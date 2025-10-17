const CATALOGO_SELOS = [
  {
    type: 'raiz_profunda',
    name: 'Raiz Profunda',
    category: 'jornada_interior',
    icon: '🌱',
    description: '21 dias consecutivos de presença consciente',
    conditions: {
      dias_consecutivos: 21,
      tipo_acao: 'check_in_diario'
    }
  },
  {
    type: 'quietude_vibracional',
    name: 'Quietude Vibracional',
    category: 'jornada_interior',
    icon: '🧘',
    description: '5 pausas meditativas completas',
    conditions: {
      pausas_meditativas: 5
    }
  },
  {
    type: 'transmutador',
    name: 'Transmutador',
    category: 'jornada_interior',
    icon: '🔥',
    description: '3 colapsos superados com missões regenerativas',
    conditions: {
      colapsos_superados: 3,
      missoes_concluidas: 3
    }
  },
  {
    type: 'espelho_da_alma',
    name: 'Espelho da Alma',
    category: 'conexao_energetica',
    icon: '💫',
    description: '3 conexões de coerência >90%',
    conditions: {
      conexoes_coerencia: 3,
      min_coerencia: 90
    }
  },
  {
    type: 'tecelao_encontros',
    name: 'Tecelão de Encontros',
    category: 'conexao_energetica',
    icon: '🌍',
    description: 'Organizou 5 eventos Bora com feedback positivo',
    conditions: {
      eventos_organizados: 5,
      feedback_positivo: true
    }
  },
  {
    type: 'guardiao_vinculos',
    name: 'Guardião de Vínculos',
    category: 'conexao_energetica',
    icon: '🤝',
    description: '10 conexões reais mantidas por 30+ dias',
    conditions: {
      conexoes_mantidas: 10,
      dias_minimos: 30
    }
  },
  {
    type: 'farol_vibracao',
    name: 'Farol da Vibração',
    category: 'impacto_coletivo',
    icon: '🌟',
    description: '100+ feedbacks positivos de conexões',
    conditions: {
      feedbacks_positivos: 100
    }
  },
  {
    type: 'mestre_resiliencia',
    name: 'Mestre da Resiliência',
    category: 'impacto_coletivo',
    icon: '📿',
    description: 'Guiou 5+ usuários em missões regenerativas',
    conditions: {
      usuarios_guiados: 5,
      tipo: 'missoes_regenerativas'
    }
  },
  {
    type: 'criador_experiencias',
    name: 'Criador de Experiências',
    category: 'impacto_coletivo',
    icon: '🎭',
    description: 'Criou eventos com impacto médio >1.5',
    conditions: {
      eventos_criados: 1,
      impacto_medio: 1.5
    }
  },
  {
    type: 'identidade_validada',
    name: 'Identidade Validada',
    category: 'verificacao_confianca',
    icon: '✅',
    description: 'DUC/DCO aprovado',
    conditions: {
      verificacao_duc_dco: true
    }
  },
  {
    type: 'guardiao_verificado',
    name: 'Guardião Verificado',
    category: 'verificacao_confianca',
    icon: '🛡️',
    description: 'Verificado + score >80 por 90 dias',
    conditions: {
      verificado: true,
      score_minimo: 80,
      dias_mantidos: 90
    }
  },
  {
    type: 'lenda_vibracional',
    name: 'Lenda Vibracional',
    category: 'verificacao_confianca',
    icon: '👑',
    description: 'Verificado + score >90 por 180 dias',
    conditions: {
      verificado: true,
      score_minimo: 90,
      dias_mantidos: 180
    }
  }
];

module.exports = { CATALOGO_SELOS };
