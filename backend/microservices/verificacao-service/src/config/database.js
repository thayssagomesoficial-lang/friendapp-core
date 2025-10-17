const { Pool } = require('pg');
const admin = require('firebase-admin');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'friendapp',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres'
});

let firebaseInitialized = false;

const initFirebase = () => {
  if (!firebaseInitialized && !admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      firebaseInitialized = true;
      logger.info('Firebase initialized successfully');
    } catch (error) {
      logger.error('Firebase initialization error:', error);
    }
  }
};

const initDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('PostgreSQL connected successfully');
    
    await createTables();
    
    initFirebase();
    
    return true;
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

const createTables = async () => {
  const createVerificationsTable = `
    CREATE TABLE IF NOT EXISTS verifications (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE NOT NULL,
      provider VARCHAR(50),
      verification_type VARCHAR(20),
      status VARCHAR(20),
      verified_at TIMESTAMP,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createVerificationsTable);
    logger.info('verifications table created/verified');
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
};

const getDb = () => pool;
const getFirestore = () => admin.firestore();

module.exports = { 
  initDatabase, 
  getDb, 
  getFirestore,
  pool
};
