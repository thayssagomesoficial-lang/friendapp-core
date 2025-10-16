import { query } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { SubmitPersonalityTestInput, EnergyVector, PersonalityTestResult, PERSONALITY_QUESTIONS } from './personalidade.types';
import { logger } from '../../config/logger';
import axios from 'axios';

export class PersonalidadeService {
  async getQuestions() {
    return PERSONALITY_QUESTIONS;
  }

  async submitTest(userId: string, data: SubmitPersonalityTestInput): Promise<PersonalityTestResult> {
    const energyVector = this.calculateEnergyVector(data.answers);
    
    const personalityType = this.determinePersonalityType(energyVector);
    const archetypes = this.determineArchetypes(energyVector);
    const vibrationalFrequency = this.calculateVibrationalFrequency(energyVector);

    const result = await query(
      `INSERT INTO personality_test_results (
        user_id, test_version, answers, energy_vector, 
        personality_type, archetype_primary, archetype_secondary, 
        vibrational_frequency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        userId,
        data.testVersion,
        JSON.stringify(data.answers),
        JSON.stringify(energyVector),
        personalityType,
        archetypes.primary,
        archetypes.secondary,
        vibrationalFrequency,
      ]
    );

    await query(
      `UPDATE users SET 
        personality_type = $1, 
        energy_profile = $2, 
        frequency_vector = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [personalityType, JSON.stringify(energyVector), JSON.stringify(energyVector), userId]
    );

    try {
      await axios.post(`${process.env.PYTHON_AI_SERVICE_URL}/api/v1/ai/process-personality`, {
        userId,
        energyVector,
        personalityType,
      });
    } catch (error) {
      logger.warn('Failed to notify AI service about personality test', error);
    }

    logger.info(`Personality test completed for user: ${userId}`);

    return this.formatResult(result.rows[0]);
  }

  async getUserResults(userId: string): Promise<PersonalityTestResult[]> {
    const result = await query(
      `SELECT * FROM personality_test_results 
       WHERE user_id = $1 
       ORDER BY completed_at DESC`,
      [userId]
    );

    return result.rows.map(row => this.formatResult(row));
  }

  private calculateEnergyVector(answers: any[]): EnergyVector {
    const scores = {
      solar: 0,
      lunar: 0,
      terrestre: 0,
      aereo: 0,
      aquatico: 0,
      igneo: 0,
      etereo: 0,
    };

    answers.forEach((answer) => {
      const question = PERSONALITY_QUESTIONS.find(q => q.id === answer.questionId);
      if (!question) return;

      if (question.type === 'single') {
        const option = question.options.find((opt: any) => opt.value === answer.answer);
        if (option && option.weight) {
          Object.entries(option.weight).forEach(([dimension, weight]) => {
            scores[dimension as keyof typeof scores] += weight as number;
          });
        }
      } else if (question.type === 'multiple' && Array.isArray(answer.answer)) {
        answer.answer.forEach((ans: string) => {
          const option = question.options.find((opt: any) => opt.value === ans);
          if (option && option.weight) {
            Object.entries(option.weight).forEach(([dimension, weight]) => {
              scores[dimension as keyof typeof scores] += weight as number;
            });
          }
        });
      }
    });

    const magnitude = Math.sqrt(
      Object.values(scores).reduce((sum, val) => sum + val * val, 0)
    );

    const normalizedScores = Object.fromEntries(
      Object.entries(scores).map(([key, val]) => [key, magnitude > 0 ? val / magnitude : 0])
    ) as typeof scores;

    const dominantElement = Object.entries(normalizedScores).reduce((a, b) => 
      normalizedScores[a[0] as keyof typeof scores] > normalizedScores[b[0] as keyof typeof scores] ? a : b
    )[0];

    return {
      dimensions: normalizedScores,
      magnitude,
      dominantElement,
    };
  }

  private determinePersonalityType(energyVector: EnergyVector): string {
    const { dimensions } = energyVector;
    const dominant = energyVector.dominantElement;

    const typeMap: Record<string, string> = {
      solar: 'Radiante',
      lunar: 'Reflexivo',
      terrestre: 'Enraizado',
      aereo: 'Visionário',
      aquatico: 'Fluente',
      igneo: 'Transformador',
      etereo: 'Transcendente',
    };

    return typeMap[dominant] || 'Equilibrado';
  }

  private determineArchetypes(energyVector: EnergyVector): { primary: string; secondary: string } {
    const { dimensions } = energyVector;
    
    const sorted = Object.entries(dimensions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    const archetypeMap: Record<string, string> = {
      solar: 'O Líder',
      lunar: 'O Sábio',
      terrestre: 'O Construtor',
      aereo: 'O Mensageiro',
      aquatico: 'O Curador',
      igneo: 'O Guerreiro',
      etereo: 'O Místico',
    };

    return {
      primary: archetypeMap[sorted[0][0]] || 'Explorador',
      secondary: archetypeMap[sorted[1][0]] || 'Aprendiz',
    };
  }

  private calculateVibrationalFrequency(energyVector: EnergyVector): number {
    const { dimensions } = energyVector;
    
    const frequencyWeights = {
      etereo: 963,
      lunar: 852,
      aereo: 741,
      aquatico: 639,
      solar: 528,
      igneo: 417,
      terrestre: 396,
    };

    let totalFrequency = 0;
    let totalWeight = 0;

    Object.entries(dimensions).forEach(([dimension, value]) => {
      const freq = frequencyWeights[dimension as keyof typeof frequencyWeights];
      totalFrequency += freq * value;
      totalWeight += value;
    });

    return totalWeight > 0 ? Math.round(totalFrequency / totalWeight) : 528;
  }

  private formatResult(row: any): PersonalityTestResult {
    return {
      id: row.id,
      userId: row.user_id,
      testVersion: row.test_version,
      answers: row.answers,
      energyVector: row.energy_vector,
      personalityType: row.personality_type,
      archetypePrimary: row.archetype_primary,
      archetypeSecondary: row.archetype_secondary,
      vibrationalFrequency: parseFloat(row.vibrational_frequency),
      completedAt: row.completed_at,
    };
  }
}
