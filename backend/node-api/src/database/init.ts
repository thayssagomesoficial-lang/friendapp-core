import { query } from '../config/database';
import { connectRedis } from '../config/redis';
import { logger } from '../config/logger';

export const initDatabase = async () => {
  try {
    await connectRedis();
    logger.info('Redis connected successfully');

    await query('SELECT NOW()');
    logger.info('PostgreSQL connected successfully');

    await createTables();
    logger.info('Database tables initialized');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      birth_date DATE,
      gender VARCHAR(50),
      location_city VARCHAR(100),
      location_state VARCHAR(100),
      location_country VARCHAR(100),
      bio TEXT,
      profile_picture_url TEXT,
      conscious_intention TEXT,
      seeking_connections VARCHAR(50)[],
      frequency_vector JSONB,
      personality_type VARCHAR(50),
      energy_profile JSONB,
      trust_score DECIMAL(3,2) DEFAULT 0.5,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_city, location_state);
    CREATE INDEX IF NOT EXISTS idx_users_personality ON users(personality_type);

    CREATE TABLE IF NOT EXISTS personality_test_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      test_version VARCHAR(10) NOT NULL,
      answers JSONB NOT NULL,
      energy_vector JSONB NOT NULL,
      personality_type VARCHAR(50) NOT NULL,
      archetype_primary VARCHAR(50),
      archetype_secondary VARCHAR(50),
      vibrational_frequency DECIMAL(5,2),
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_personality_test_user ON personality_test_results(user_id);

    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      media_urls TEXT[],
      sensorial_tags VARCHAR(50)[],
      emotion_tone VARCHAR(50),
      frequency_level DECIMAL(3,2),
      visibility VARCHAR(20) DEFAULT 'public',
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_posts_frequency ON posts(frequency_level);

    CREATE TABLE IF NOT EXISTS connections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
      user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
      connection_type VARCHAR(50) NOT NULL,
      compatibility_score DECIMAL(3,2),
      energy_alignment DECIMAL(3,2),
      intention_match DECIMAL(3,2),
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user1_id, user2_id)
    );

    CREATE INDEX IF NOT EXISTS idx_connections_user1 ON connections(user1_id);
    CREATE INDEX IF NOT EXISTS idx_connections_user2 ON connections(user2_id);
    CREATE INDEX IF NOT EXISTS idx_connections_score ON connections(compatibility_score DESC);

    CREATE TABLE IF NOT EXISTS feed_interactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      interaction_type VARCHAR(20) NOT NULL,
      duration_seconds INTEGER,
      emotion_reaction VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_feed_interactions_user ON feed_interactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_feed_interactions_post ON feed_interactions(post_id);
  `);
};
