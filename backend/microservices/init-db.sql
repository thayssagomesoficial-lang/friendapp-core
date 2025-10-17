
CREATE TABLE IF NOT EXISTS user_seals (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  seal_type VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  vibration_score FLOAT,
  metadata JSONB,
  UNIQUE(user_id, seal_type)
);

CREATE INDEX idx_user_seals_user_id ON user_seals(user_id);
CREATE INDEX idx_user_seals_type ON user_seals(seal_type);

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

CREATE INDEX idx_verifications_user_id ON verifications(user_id);
CREATE INDEX idx_verifications_status ON verifications(status);

CREATE TABLE IF NOT EXISTS reputation_scores (
  user_id UUID PRIMARY KEY,
  score INT CHECK (score >= 0 AND score <= 100),
  coherence FLOAT,
  reciprocity FLOAT,
  feedbacks_positive INT DEFAULT 0,
  warnings INT DEFAULT 0,
  maturity_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reputation_score ON reputation_scores(score);

CREATE TABLE IF NOT EXISTS security_events (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type VARCHAR(50),
  risk_score FLOAT,
  shield_activated VARCHAR(20),
  variables JSONB,
  action_taken VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_timestamp ON security_events(timestamp);

CREATE TABLE IF NOT EXISTS user_trust_level (
  user_id UUID PRIMARY KEY,
  trust_score INT CHECK (trust_score >= 0 AND trust_score <= 100),
  shield_history JSONB,
  last_incident TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE INDEX idx_transactions_user_id ON transactions_log(user_id);
CREATE INDEX idx_transactions_timestamp ON transactions_log(timestamp);

CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY,
  saldo_fc INT DEFAULT 0,
  status_premium VARCHAR(20) DEFAULT 'inativo',
  premium_expira_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallets_premium ON user_wallets(status_premium);

CREATE TABLE IF NOT EXISTS partners_payments (
  id SERIAL PRIMARY KEY,
  partner_id UUID NOT NULL,
  valor NUMERIC(10,2),
  status VARCHAR(20),
  contrato JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations_log (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  destino VARCHAR(100),
  valor INT,
  moeda VARCHAR(10),
  auditoria_hash VARCHAR(64),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fraud_alerts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  score_fraude FLOAT,
  motivo VARCHAR(200),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);

COMMENT ON TABLE user_seals IS 'Selos vibracionais conquistados pelos usuários';
COMMENT ON TABLE verifications IS 'Verificações de identidade DUC/DCO';
COMMENT ON TABLE reputation_scores IS 'Scores de reputação vibracional';
COMMENT ON TABLE security_events IS 'Eventos de segurança e blindagens ativadas';
COMMENT ON TABLE user_trust_level IS 'Nível de confiança e histórico de segurança';
COMMENT ON TABLE transactions_log IS 'Log completo de transações de FriendCoins';
COMMENT ON TABLE user_wallets IS 'Carteiras e status premium dos usuários';
COMMENT ON TABLE fraud_alerts IS 'Alertas de fraude detectados pelo sistema';
