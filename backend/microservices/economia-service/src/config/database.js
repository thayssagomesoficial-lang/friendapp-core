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
  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions_log (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL,
      tipo VARCHAR(50),
      valor INT NOT NULL,
      indice_impacto FLOAT,
      fator_surpresa FLOAT,
      reducao_repeticao FLOAT,
      metadata JSONB,
      timestamp TIMESTAMP DEFAULT NOW()
    );
  `;

  const createWalletsTable = `
    CREATE TABLE IF NOT EXISTS user_wallets (
      user_id UUID PRIMARY KEY,
      saldo_fc INT DEFAULT 0,
      status_premium VARCHAR(20) DEFAULT 'inativo',
      premium_expira_em TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTransactionsTable);
    await pool.query(createWalletsTable);
    logger.info('economia tables created/verified');
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
