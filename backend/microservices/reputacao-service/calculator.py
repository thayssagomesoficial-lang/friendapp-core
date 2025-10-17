import math

def calcular_reputacao(
    coerencia: float,
    reciprocidade: float,
    feedbacks_positivos: int,
    denuncias_validadas: int,
    maturity_days: int
) -> int:
    w1 = 0.30
    w2 = 0.25
    w3 = 0.20
    w4 = 0.15
    w5 = 0.10
    
    C = min(max(coerencia, 0), 1)
    R = min(max(reciprocidade, 0), 1)
    
    F_plus_norm = min(feedbacks_positivos / 100, 1)
    
    D_minus_norm = min(denuncias_validadas * 0.1, 1)
    
    T_norm = min(maturity_days / 365, 1)
    
    score_raw = (
        (w1 * C) + 
        (w2 * R) + 
        (w3 * F_plus_norm) + 
        (w4 * T_norm) - 
        (w5 * D_minus_norm)
    )
    
    score = int(max(min(score_raw * 100, 100), 0))
    
    return score

def obter_estado_vibracional(score: int) -> dict:
    if score >= 0 and score <= 30:
        return {
            "emoji": "🌱",
            "nome": "Fluxo em Construção",
            "descricao": "Iniciando jornada vibracional"
        }
    elif score >= 31 and score <= 60:
        return {
            "emoji": "🌿",
            "nome": "Energia Estável",
            "descricao": "Mantendo equilíbrio energético"
        }
    elif score >= 61 and score <= 85:
        return {
            "emoji": "✨",
            "nome": "Coerência Elevada",
            "descricao": "Alta harmonia vibracional"
        }
    else:
        return {
            "emoji": "🌟",
            "nome": "Guardião da Vibração",
            "descricao": "Excelência vibracional"
        }
