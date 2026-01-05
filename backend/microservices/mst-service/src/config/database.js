const { Pool } = require('pg');
const logger = require('../utils/logger');

let pool = null;
let firestore = null;

const initDatabase = async () => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    await pool.query('SELECT NOW()');
    logger.info('PostgreSQL connected successfully');

    // Initialize MST tables
    await initMSTTables();

    return pool;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
};

const initMSTTables = async () => {
  const createTablesSQL = `
    -- Talent items table
    CREATE TABLE IF NOT EXISTS talent_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id UUID NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'audio', 'text', 'mixed')),
      intent TEXT,
      language VARCHAR(10) DEFAULT 'pt-BR',
      media_refs JSONB DEFAULT '[]',
      thumbnail_url TEXT,
      duration_seconds NUMERIC(6,2),
      transcription TEXT,
      feature_vector FLOAT8[],
      impact_score FLOAT8 DEFAULT 0,
      risk_score FLOAT8 DEFAULT 0,
      archetype_scores JSONB DEFAULT '{}',
      confidence FLOAT8 DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'limited', 'review')),
      visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'limited', 'private')),
      moderation_flags JSONB DEFAULT '{}',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Talent engagements table
    CREATE TABLE IF NOT EXISTS talent_engagements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      talent_id UUID NOT NULL REFERENCES talent_items(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('view', 'wave', 'donation', 'share')),
      wave_type VARCHAR(20),
      amount NUMERIC(12,2),
      seconds_watched NUMERIC(6,2),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Creator insights cache table
    CREATE TABLE IF NOT EXISTS creator_insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id UUID NOT NULL UNIQUE,
      total_views INTEGER DEFAULT 0,
      total_waves INTEGER DEFAULT 0,
      total_donations NUMERIC(12,2) DEFAULT 0,
      avg_impact_score FLOAT8 DEFAULT 0,
      avg_completion_rate FLOAT8 DEFAULT 0,
      followers_count INTEGER DEFAULT 0,
      talents_count INTEGER DEFAULT 0,
      last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Moderation reviews table
    CREATE TABLE IF NOT EXISTS mst_moderation_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      talent_id UUID NOT NULL REFERENCES talent_items(id) ON DELETE CASCADE,
      reviewer_id UUID,
      reviewer_type VARCHAR(20) DEFAULT 'auto' CHECK (reviewer_type IN ('auto', 'human')),
      decision VARCHAR(20) NOT NULL CHECK (decision IN ('approved', 'rejected', 'limited', 'escalated')),
      reason TEXT,
      risk_score_at_review FLOAT8,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_talent_creator ON talent_items(creator_id);
    CREATE INDEX IF NOT EXISTS idx_talent_status ON talent_items(status);
    CREATE INDEX IF NOT EXISTS idx_talent_visibility ON talent_items(visibility);
    CREATE INDEX IF NOT EXISTS idx_talent_published ON talent_items(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_talent_impact ON talent_items(impact_score DESC);
    CREATE INDEX IF NOT EXISTS idx_engagement_talent ON talent_engagements(talent_id);
    CREATE INDEX IF NOT EXISTS idx_engagement_user ON talent_engagements(user_id);
    CREATE INDEX IF NOT EXISTS idx_engagement_type ON talent_engagements(type);
  `;

  try {
    await pool.query(createTablesSQL);
    logger.info('MST tables initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize MST tables:', error);
    throw error;
  }
};

const initFirestore = () => {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      const admin = require('firebase-admin');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          })
        });
      }
      
      firestore = admin.firestore();
      logger.info('Firestore initialized successfully');
    } else {
      logger.warn('Firebase not configured - real-time features disabled');
    }
  } catch (error) {
    logger.warn('Failed to initialize Firestore:', error.message);
  }
};

const getDb = () => pool;
const getFirestore = () => firestore;

module.exports = {
  initDatabase,
  initFirestore,
  getDb,
  getFirestore,
  pool
};
