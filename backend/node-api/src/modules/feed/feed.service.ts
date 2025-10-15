import { query } from '../../config/database';
import { getRedisClient } from '../../config/redis';
import { AppError } from '../../middleware/errorHandler';
import { CreatePostInput, InteractPostInput, Post, FeedItem } from './feed.types';
import { logger } from '../../config/logger';
import axios from 'axios';

export class FeedService {
  async createPost(userId: string, data: CreatePostInput): Promise<Post> {
    const frequencyLevel = this.calculateFrequencyLevel(data.emotionTone);

    const result = await query(
      `INSERT INTO posts (
        user_id, content, media_urls, sensorial_tags, 
        emotion_tone, frequency_level, visibility
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        data.content,
        data.mediaUrls || [],
        data.sensorialTags || [],
        data.emotionTone,
        frequencyLevel,
        data.visibility,
      ]
    );

    const post = result.rows[0];

    try {
      await axios.post(`${process.env.PYTHON_AI_SERVICE_URL}/api/v1/ai/analyze-post`, {
        postId: post.id,
        content: post.content,
        emotionTone: post.emotion_tone,
        userId,
      });
    } catch (error) {
      logger.warn('Failed to notify AI service about new post', error);
    }

    logger.info(`New post created by user: ${userId}`);

    return this.formatPost(post);
  }

  async getFeed(userId: string, limit: number = 20, offset: number = 0): Promise<FeedItem[]> {
    const userProfile = await query(
      'SELECT personality_type, energy_profile, frequency_vector FROM users WHERE id = $1',
      [userId]
    );

    if (userProfile.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const cacheKey = `feed:${userId}:${limit}:${offset}`;
    const redis = getRedisClient();

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Feed cache hit for user: ${userId}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.warn('Redis cache read failed', error);
    }

    const posts = await query(
      `SELECT p.*, u.name as user_name, u.profile_picture_url as user_profile_picture
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.visibility = 'public' 
         OR (p.visibility = 'connections' AND EXISTS (
           SELECT 1 FROM connections c 
           WHERE (c.user1_id = $1 AND c.user2_id = p.user_id)
              OR (c.user2_id = $1 AND c.user1_id = p.user_id)
              AND c.status = 'accepted'
         ))
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit * 3, offset]
    );

    const scoredFeed = await this.rankFeed(userId, posts.rows, userProfile.rows[0]);
    const topFeed = scoredFeed.slice(0, limit);

    try {
      await redis.set(cacheKey, JSON.stringify(topFeed), { EX: 300 });
    } catch (error) {
      logger.warn('Redis cache write failed', error);
    }

    return topFeed;
  }

  async getPost(postId: string, userId?: string): Promise<Post> {
    const result = await query(
      `SELECT p.*, u.name as user_name, u.profile_picture_url as user_profile_picture
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [postId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Post not found', 404);
    }

    const post = result.rows[0];

    if (post.visibility === 'private' && post.user_id !== userId) {
      throw new AppError('Not authorized to view this post', 403);
    }

    return this.formatPost(post);
  }

  async interactWithPost(userId: string, postId: string, data: InteractPostInput): Promise<void> {
    await query(
      `INSERT INTO feed_interactions (user_id, post_id, interaction_type, duration_seconds, emotion_reaction)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, postId, data.interactionType, data.durationSeconds, data.emotionReaction]
    );

    if (data.interactionType === 'like') {
      await query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
        [postId]
      );
    } else if (data.interactionType === 'share') {
      await query(
        'UPDATE posts SET shares_count = shares_count + 1 WHERE id = $1',
        [postId]
      );
    }

    try {
      await axios.post(`${process.env.PYTHON_AI_SERVICE_URL}/api/v1/ai/learn-interaction`, {
        userId,
        postId,
        interactionType: data.interactionType,
        durationSeconds: data.durationSeconds,
      });
    } catch (error) {
      logger.warn('Failed to notify AI service about interaction', error);
    }

    logger.debug(`User ${userId} interacted with post ${postId}: ${data.interactionType}`);
  }

  private async rankFeed(userId: string, posts: any[], userProfile: any): Promise<FeedItem[]> {
    const rankedFeed: FeedItem[] = [];

    for (const post of posts) {
      let score = 1.0;
      let reason = 'Conteúdo geral';

      const recencyHours = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
      const recencyScore = Math.exp(-recencyHours / 24);
      score *= (0.3 + 0.7 * recencyScore);

      if (userProfile.personality_type && post.emotion_tone) {
        const emotionCompatibility = this.calculateEmotionCompatibility(
          userProfile.personality_type,
          post.emotion_tone
        );
        score *= emotionCompatibility;
        if (emotionCompatibility > 1.2) {
          reason = 'Ressonância emocional';
        }
      }

      const engagementScore = Math.log(1 + post.likes_count + post.comments_count * 2 + post.shares_count * 3);
      score *= (1 + engagementScore * 0.1);

      if (post.frequency_level && userProfile.frequency_vector) {
        score *= 1.2;
        reason = 'Alinhamento vibracional';
      }

      rankedFeed.push({
        ...this.formatPost(post),
        relevanceScore: score,
        reasonShown: reason,
      });
    }

    return rankedFeed.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private calculateFrequencyLevel(emotionTone?: string): number {
    const frequencyMap: Record<string, number> = {
      amor: 0.95,
      gratidao: 0.9,
      alegria: 0.85,
      paz: 0.8,
      inspiracao: 0.75,
      curiosidade: 0.65,
      reflexao: 0.6,
      transformacao: 0.7,
    };

    return emotionTone ? frequencyMap[emotionTone] || 0.5 : 0.5;
  }

  private calculateEmotionCompatibility(personalityType: string, emotionTone: string): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      Radiante: { alegria: 1.5, inspiracao: 1.4, amor: 1.3, gratidao: 1.2 },
      Reflexivo: { reflexao: 1.5, paz: 1.4, transformacao: 1.3, curiosidade: 1.2 },
      Enraizado: { gratidao: 1.5, paz: 1.4, reflexao: 1.3, amor: 1.2 },
      Visionário: { inspiracao: 1.5, curiosidade: 1.4, transformacao: 1.3, alegria: 1.2 },
      Fluente: { amor: 1.5, paz: 1.4, gratidao: 1.3, reflexao: 1.2 },
      Transformador: { transformacao: 1.5, inspiracao: 1.4, alegria: 1.3, curiosidade: 1.2 },
      Transcendente: { paz: 1.5, amor: 1.4, reflexao: 1.3, gratidao: 1.2 },
    };

    return compatibilityMatrix[personalityType]?.[emotionTone] || 1.0;
  }

  private formatPost(row: any): Post {
    return {
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userProfilePicture: row.user_profile_picture,
      content: row.content,
      mediaUrls: row.media_urls,
      sensorialTags: row.sensorial_tags,
      emotionTone: row.emotion_tone,
      frequencyLevel: parseFloat(row.frequency_level),
      visibility: row.visibility,
      likesCount: row.likes_count,
      commentsCount: row.comments_count,
      sharesCount: row.shares_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
