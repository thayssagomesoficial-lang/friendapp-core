from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
from database import init_db, get_db_connection
from calculator import calcular_reputacao, obter_estado_vibracional
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Reputacao Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AtualizarReputacaoRequest(BaseModel):
    user_id: str
    coerencia: Optional[float] = 0.5
    reciprocidade: Optional[float] = 0.5
    feedbacks_positivos: Optional[int] = 0
    denuncias_validadas: Optional[int] = 0
    maturity_days: Optional[int] = 0

@app.on_event("startup")
async def startup():
    init_db()
    logger.info("Reputacao Service started")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "reputacao-service"
    }

@app.post("/api/reputacao/calcular")
def calcular_score(request: AtualizarReputacaoRequest):
    try:
        score = calcular_reputacao(
            coerencia=request.coerencia,
            reciprocidade=request.reciprocidade,
            feedbacks_positivos=request.feedbacks_positivos,
            denuncias_validadas=request.denuncias_validadas,
            maturity_days=request.maturity_days
        )
        
        estado = obter_estado_vibracional(score)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO reputation_scores 
            (user_id, score, coherence, reciprocity, feedbacks_positive, warnings, maturity_days)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                score = %s,
                coherence = %s,
                reciprocity = %s,
                feedbacks_positive = %s,
                warnings = %s,
                maturity_days = %s,
                updated_at = NOW()
        """, (
            request.user_id, score, request.coerencia, request.reciprocidade,
            request.feedbacks_positivos, request.denuncias_validadas, request.maturity_days,
            score, request.coerencia, request.reciprocidade,
            request.feedbacks_positivos, request.denuncias_validadas, request.maturity_days
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        logger.info(f"Score calculado para usuário {request.user_id}: {score}")
        
        return {
            "user_id": request.user_id,
            "score": score,
            "estado": estado,
            "details": {
                "coerencia": request.coerencia,
                "reciprocidade": request.reciprocidade,
                "feedbacks_positivos": request.feedbacks_positivos,
                "denuncias": request.denuncias_validadas
            }
        }
    
    except Exception as e:
        logger.error(f"Erro ao calcular reputação: {e}")
        raise HTTPException(status_code=500, detail="Erro ao calcular reputação")

@app.get("/api/reputacao/usuario/{user_id}")
def obter_reputacao(user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT user_id, score, coherence, reciprocity, 
                   feedbacks_positive, warnings, maturity_days, updated_at
            FROM reputation_scores
            WHERE user_id = %s
        """, (user_id,))
        
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not result:
            raise HTTPException(status_code=404, detail="Reputação não encontrada")
        
        score = result[1]
        estado = obter_estado_vibracional(score)
        
        return {
            "user_id": result[0],
            "score": result[1],
            "estado": estado,
            "coherence": result[2],
            "reciprocity": result[3],
            "feedbacks_positive": result[4],
            "warnings": result[5],
            "maturity_days": result[6],
            "updated_at": result[7].isoformat() if result[7] else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter reputação: {e}")
        raise HTTPException(status_code=500, detail="Erro ao obter reputação")
