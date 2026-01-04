const logger = require('../utils/logger');

/**
 * Calcula o ImpactScore de um talento baseado no feature vector
 * Formula: ImpactScore = sigmoid(W_i * feature_vector + b_i) * 1000
 */
const calculateImpactScore = (featureVector) => {
  if (!featureVector || featureVector.length === 0) {
    return 0;
  }

  // Pesos simplificados para cada dimensao do vetor (128D)
  // Em producao, esses pesos viriam do modelo treinado
  const weights = generateWeights(featureVector.length);
  const bias = 0.1;

  // Calcula o produto escalar
  let dotProduct = 0;
  for (let i = 0; i < featureVector.length; i++) {
    dotProduct += weights[i] * featureVector[i];
  }

  // Aplica sigmoid e escala para 0-1000
  const sigmoid = 1 / (1 + Math.exp(-(dotProduct + bias)));
  const impactScore = sigmoid * 1000;

  return Math.round(impactScore * 100) / 100;
};

/**
 * Calcula o RiskScore de um talento
 * Formula: RiskScore = sigmoid(W_r * feature_vector + b_r)
 * Thresholds:
 * - >= 0.70: Auto-rejeicao
 * - 0.30-0.69: Revisao humana
 * - < 0.30: Conteudo seguro
 */
const calculateRiskScore = (featureVector, metadata = {}) => {
  if (!featureVector || featureVector.length === 0) {
    return 0.5; // Risco medio se nao houver vetor
  }

  // Pesos para deteccao de risco
  const riskWeights = generateRiskWeights(featureVector.length);
  const bias = -0.5;

  let dotProduct = 0;
  for (let i = 0; i < featureVector.length; i++) {
    dotProduct += riskWeights[i] * featureVector[i];
  }

  // Ajustes baseados em metadata
  let adjustment = 0;
  if (metadata.hasExplicitContent) adjustment += 0.3;
  if (metadata.hasViolentContent) adjustment += 0.3;
  if (metadata.hasHateSpeech) adjustment += 0.4;

  const sigmoid = 1 / (1 + Math.exp(-(dotProduct + bias + adjustment)));
  
  return Math.round(sigmoid * 100) / 100;
};

/**
 * Calcula os scores de arquetipos (7 dimensoes)
 */
const calculateArchetypeScores = (featureVector) => {
  const archetypes = [
    'expressivo',
    'tecnico',
    'emocional',
    'energetico',
    'narrativo',
    'visual',
    'sonoro'
  ];

  if (!featureVector || featureVector.length === 0) {
    return archetypes.reduce((acc, arch) => ({ ...acc, [arch]: 0 }), {});
  }

  // Divide o vetor em 7 partes para cada arquetipo
  const partSize = Math.floor(featureVector.length / 7);
  const scores = {};

  archetypes.forEach((archetype, index) => {
    const start = index * partSize;
    const end = start + partSize;
    const slice = featureVector.slice(start, end);
    
    // Calcula a media normalizada do slice
    const sum = slice.reduce((a, b) => a + Math.abs(b), 0);
    const avg = sum / slice.length;
    
    // Aplica softmax simplificado
    scores[archetype] = Math.round(avg * 100) / 100;
  });

  // Normaliza para que a soma seja 1
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(scores).forEach(key => {
      scores[key] = Math.round((scores[key] / total) * 100) / 100;
    });
  }

  return scores;
};

/**
 * Calcula o score de confianca da inferencia
 */
const calculateConfidence = (featureVector) => {
  if (!featureVector || featureVector.length === 0) {
    return 0;
  }

  // Calcula a variancia do vetor
  const mean = featureVector.reduce((a, b) => a + b, 0) / featureVector.length;
  const variance = featureVector.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / featureVector.length;

  // Confidence = 1 - variance (normalizado)
  const normalizedVariance = Math.min(variance, 1);
  const confidence = 1 - normalizedVariance;

  return Math.round(confidence * 100) / 100;
};

/**
 * Calcula o score de ranking para o feed
 */
const calculateFeedScore = (talent, userVector = null) => {
  const {
    impact_score = 0,
    feature_vector = [],
    published_at,
    total_views = 0,
    total_waves = 0
  } = talent;

  // Componentes do score
  const impactNormalized = impact_score / 1000;
  
  // Similaridade com usuario (se disponivel)
  let similarity = 0.5;
  if (userVector && feature_vector && feature_vector.length > 0) {
    similarity = cosineSimilarity(userVector, feature_vector);
  }

  // Social signals
  const socialScore = Math.min((total_views + total_waves * 5) / 10000, 1);

  // Freshness (decai ao longo do tempo)
  const ageHours = published_at ? (Date.now() - new Date(published_at).getTime()) / (1000 * 60 * 60) : 0;
  const freshness = Math.exp(-ageHours / 168); // Decai ao longo de 1 semana

  // Formula de ranking
  const feedScore = (
    0.35 * impactNormalized +
    0.25 * similarity +
    0.20 * socialScore +
    0.10 * freshness +
    0.10 * Math.random() // Pequena aleatoriedade para diversidade
  );

  return Math.round(feedScore * 1000) / 1000;
};

// Funcoes auxiliares
const generateWeights = (length) => {
  // Gera pesos pseudo-aleatorios mas deterministicos
  const weights = [];
  for (let i = 0; i < length; i++) {
    weights.push(Math.sin(i * 0.1) * 0.5 + 0.5);
  }
  return weights;
};

const generateRiskWeights = (length) => {
  const weights = [];
  for (let i = 0; i < length; i++) {
    weights.push(Math.cos(i * 0.15) * 0.3);
  }
  return weights;
};

const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = {
  calculateImpactScore,
  calculateRiskScore,
  calculateArchetypeScores,
  calculateConfidence,
  calculateFeedScore,
  cosineSimilarity
};
