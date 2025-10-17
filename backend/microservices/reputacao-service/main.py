from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import time
from database import init_db, get_db_connection
from calculator import calcular_reputacao, obter_estado_vibracional
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response
import os

logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp":"%(asctime)s","level":"%(levelname)s","message":"%(message)s","requestId":"%(requestId)s"}'
)
logger = logging.getLogger(__name__)

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint'])

app = FastAPI(title="Reputacao Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_metrics(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path, status=response.status_code).inc()
    REQUEST_DURATION.labels(method=request.method, endpoint=request.url.path).observe(duration)
    return response

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
    logger.info("Reputacao Service started", extra={'requestId': 'startup'})

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "reputacao-service"
    }

@app.get("/ready")
def readiness_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        return {
            "ready": True,
            "service": "reputacao-service",
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {e}", extra={'requestId': 'readiness'})
        raise HTTPException(status_code=503, detail="Service not ready")

@app.get("/metrics")
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

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
