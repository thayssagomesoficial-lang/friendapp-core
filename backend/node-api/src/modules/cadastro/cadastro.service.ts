import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { RegisterInput, LoginInput, UpdateProfileInput, User } from './cadastro.types';
import { logger } from '../../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class CadastroService {
  async register(data: RegisterInput): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('Email já cadastrado', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await query(
      `INSERT INTO users (
        email, password_hash, name, birth_date, gender, 
        location_city, location_state, location_country, 
        bio, conscious_intention, seeking_connections
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, name, birth_date, gender, 
                location_city, location_state, location_country, 
                bio, conscious_intention, seeking_connections, 
                trust_score, is_verified, created_at`,
      [
        data.email,
        passwordHash,
        data.name,
        data.birthDate,
        data.gender,
        data.locationCity,
        data.locationState,
        data.locationCountry,
        data.bio,
        data.consciousIntention,
        data.seekingConnections,
      ]
    );

    const user = result.rows[0];
    const token = this.generateToken(user.id, user.email);

    logger.info(`New user registered: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(data: LoginInput): Promise<{ user: Partial<User>; token: string }> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const token = this.generateToken(user.id, user.email);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const result = await query(
      `SELECT id, email, name, birth_date, gender, 
              location_city, location_state, location_country, 
              bio, profile_picture_url, conscious_intention, 
              seeking_connections, personality_type, trust_score, 
              is_verified, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return this.sanitizeUser(result.rows[0]);
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<Partial<User>> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = this.camelToSnake(key);
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new AppError('Nenhum campo para atualizar', 400);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING id, email, name, birth_date, gender, 
                 location_city, location_state, location_country, 
                 bio, profile_picture_url, conscious_intention, 
                 seeking_connections, personality_type, trust_score, 
                 is_verified, created_at, updated_at`,
      values
    );

    logger.info(`User profile updated: ${userId}`);

    return this.sanitizeUser(result.rows[0]);
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private sanitizeUser(user: any): Partial<User> {
    const { password_hash, ...sanitized } = user;
    return {
      id: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      birthDate: sanitized.birth_date,
      gender: sanitized.gender,
      locationCity: sanitized.location_city,
      locationState: sanitized.location_state,
      locationCountry: sanitized.location_country,
      bio: sanitized.bio,
      profilePictureUrl: sanitized.profile_picture_url,
      consciousIntention: sanitized.conscious_intention,
      seekingConnections: sanitized.seeking_connections,
      personalityType: sanitized.personality_type,
      trustScore: parseFloat(sanitized.trust_score),
      isVerified: sanitized.is_verified,
      createdAt: sanitized.created_at,
      updatedAt: sanitized.updated_at,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
