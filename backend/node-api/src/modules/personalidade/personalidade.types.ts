import { z } from 'zod';

export const PersonalityTestAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.number(), z.string(), z.array(z.string())]),
});

export const SubmitPersonalityTestSchema = z.object({
  testVersion: z.string().default('v1.0'),
  answers: z.array(PersonalityTestAnswerSchema),
});

export type SubmitPersonalityTestInput = z.infer<typeof SubmitPersonalityTestSchema>;

export interface EnergyVector {
  dimensions: {
    solar: number;
    lunar: number;
    terrestre: number;
    aereo: number;
    aquatico: number;
    igneo: number;
    etereo: number;
  };
  magnitude: number;
  dominantElement: string;
}

export interface PersonalityTestResult {
  id: string;
  userId: string;
  testVersion: string;
  answers: any;
  energyVector: EnergyVector;
  personalityType: string;
  archetypePrimary: string;
  archetypeSecondary: string;
  vibrationalFrequency: number;
  completedAt: Date;
}

export const PERSONALITY_QUESTIONS = [
  {
    id: 'q1',
    category: 'energy_source',
    question: 'Como você recarrega sua energia?',
    type: 'single',
    options: [
      { value: 'alone', text: 'Ficando sozinho(a) em introspecção', weight: { lunar: 2, etereo: 1 } },
      { value: 'social', text: 'Estando com pessoas e em ambientes vibrantes', weight: { solar: 2, igneo: 1 } },
      { value: 'nature', text: 'Em contato com a natureza', weight: { terrestre: 2, aquatico: 1 } },
      { value: 'creative', text: 'Criando e expressando-me artisticamente', weight: { aereo: 2, etereo: 1 } },
    ],
  },
  {
    id: 'q2',
    category: 'emotional_expression',
    question: 'Como você lida com emoções intensas?',
    type: 'single',
    options: [
      { value: 'process_alone', text: 'Processo internamente antes de compartilhar', weight: { lunar: 2, aquatico: 1 } },
      { value: 'express_immediately', text: 'Expresso imediatamente o que sinto', weight: { igneo: 2, solar: 1 } },
      { value: 'seek_balance', text: 'Busco equilíbrio através de práticas contemplativas', weight: { etereo: 2, terrestre: 1 } },
      { value: 'talk_it_out', text: 'Converso com pessoas de confiança', weight: { aereo: 2, solar: 1 } },
    ],
  },
  {
    id: 'q3',
    category: 'decision_making',
    question: 'Como você toma decisões importantes?',
    type: 'single',
    options: [
      { value: 'intuition', text: 'Sigo minha intuição e sensações viscerais', weight: { lunar: 2, aquatico: 1 } },
      { value: 'logic', text: 'Analiso dados e uso lógica', weight: { aereo: 2, terrestre: 1 } },
      { value: 'heart', text: 'Sinto com o coração o que é certo', weight: { aquatico: 2, etereo: 1 } },
      { value: 'action', text: 'Tomo decisões rápidas e ajo', weight: { igneo: 2, solar: 1 } },
    ],
  },
  {
    id: 'q4',
    category: 'life_purpose',
    question: 'O que te motiva na vida?',
    type: 'multiple',
    options: [
      { value: 'growth', text: 'Crescimento pessoal e espiritual', weight: { etereo: 1, lunar: 1 } },
      { value: 'impact', text: 'Causar impacto positivo no mundo', weight: { solar: 1, igneo: 1 } },
      { value: 'connection', text: 'Conexões profundas e autênticas', weight: { aquatico: 1, aereo: 1 } },
      { value: 'stability', text: 'Segurança e estabilidade', weight: { terrestre: 1 } },
      { value: 'freedom', text: 'Liberdade e autonomia', weight: { aereo: 1, igneo: 1 } },
      { value: 'harmony', text: 'Harmonia e paz interior', weight: { etereo: 1, aquatico: 1 } },
    ],
  },
  {
    id: 'q5',
    category: 'conflict_style',
    question: 'Como você age em situações de conflito?',
    type: 'single',
    options: [
      { value: 'avoid', text: 'Prefiro evitar e me afastar', weight: { aereo: 2, lunar: 1 } },
      { value: 'confront', text: 'Enfrento diretamente e busco resolução', weight: { igneo: 2, solar: 1 } },
      { value: 'mediate', text: 'Busco mediar e encontrar harmonia', weight: { aquatico: 2, etereo: 1 } },
      { value: 'analyze', text: 'Analiso racionalmente e busco soluções práticas', weight: { terrestre: 2, aereo: 1 } },
    ],
  },
  {
    id: 'q6',
    category: 'communication_style',
    question: 'Como você prefere se comunicar?',
    type: 'single',
    options: [
      { value: 'verbal', text: 'Conversas profundas e articuladas', weight: { aereo: 2, solar: 1 } },
      { value: 'nonverbal', text: 'Através de gestos, energia e presença', weight: { etereo: 2, lunar: 1 } },
      { value: 'written', text: 'Escrita e expressão criativa', weight: { lunar: 2, aereo: 1 } },
      { value: 'action', text: 'Através de ações e demonstrações práticas', weight: { terrestre: 2, igneo: 1 } },
    ],
  },
  {
    id: 'q7',
    category: 'time_perception',
    question: 'Como você se relaciona com o tempo?',
    type: 'single',
    options: [
      { value: 'present', text: 'Vivo intensamente o momento presente', weight: { igneo: 2, solar: 1 } },
      { value: 'past', text: 'Reflito sobre experiências passadas', weight: { lunar: 2, aquatico: 1 } },
      { value: 'future', text: 'Planejo e visualizo o futuro', weight: { aereo: 2, terrestre: 1 } },
      { value: 'timeless', text: 'Sinto que o tempo é relativo e fluido', weight: { etereo: 2, aquatico: 1 } },
    ],
  },
  {
    id: 'q8',
    category: 'learning_style',
    question: 'Como você aprende melhor?',
    type: 'single',
    options: [
      { value: 'doing', text: 'Fazendo e experimentando na prática', weight: { terrestre: 2, igneo: 1 } },
      { value: 'observing', text: 'Observando e refletindo', weight: { lunar: 2, aereo: 1 } },
      { value: 'feeling', text: 'Sentindo e vivenciando emocionalmente', weight: { aquatico: 2, etereo: 1 } },
      { value: 'thinking', text: 'Estudando e analisando conceitos', weight: { aereo: 2, terrestre: 1 } },
    ],
  },
  {
    id: 'q9',
    category: 'creativity',
    question: 'Como sua criatividade se manifesta?',
    type: 'multiple',
    options: [
      { value: 'artistic', text: 'Artes visuais, música, dança', weight: { aereo: 1, aquatico: 1 } },
      { value: 'innovation', text: 'Inovação e novas ideias', weight: { solar: 1, igneo: 1 } },
      { value: 'healing', text: 'Cura e transformação', weight: { etereo: 1, aquatico: 1 } },
      { value: 'building', text: 'Construção e manifestação material', weight: { terrestre: 1, igneo: 1 } },
      { value: 'intuitive', text: 'Insights intuitivos e visionários', weight: { lunar: 1, etereo: 1 } },
    ],
  },
  {
    id: 'q10',
    category: 'relationship_needs',
    question: 'O que você mais valoriza em relacionamentos?',
    type: 'multiple',
    options: [
      { value: 'depth', text: 'Profundidade emocional', weight: { aquatico: 1, lunar: 1 } },
      { value: 'passion', text: 'Paixão e intensidade', weight: { igneo: 1, solar: 1 } },
      { value: 'intellectual', text: 'Estimulação intelectual', weight: { aereo: 1, terrestre: 1 } },
      { value: 'spiritual', text: 'Conexão espiritual', weight: { etereo: 1, lunar: 1 } },
      { value: 'loyalty', text: 'Lealdade e estabilidade', weight: { terrestre: 1, aquatico: 1 } },
      { value: 'freedom', text: 'Liberdade e independência', weight: { aereo: 1, solar: 1 } },
    ],
  },
];
