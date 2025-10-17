from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import logging
import time
from database import init_db, get_db_connection
from neo4j_service import Neo4jService
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

app = FastAPI(title="Antifraude Service")

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

neo4j_service = None

class RegistrarInteracaoRequest(BaseModel):
    user_id_origem: str
    user_id_destino: str
    tipo_interacao: str
    valor: Optional[int] = None

class AnalisarPadraoRequest(BaseModel):
    user_id: str

@app.on_event("startup")
async def startup():
    global neo4j_service
    init_db()
    
    neo4j_uri = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
    neo4j_user = os.getenv('NEO4J_USER', 'neo4j')
    neo4j_password = os.getenv('NEO4J_PASSWORD', 'password')
    
    neo4j_service = Neo4jService(neo4j_uri, neo4j_user, neo4j_password)
    
    logger.info("Antifraude Service started")

@app.on_event("shutdown")
async def shutdown():
    if neo4j_service:
        neo4j_service.close()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "antifraude-service"
    }

@app.get("/ready")
def readiness_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        
        db_status = "connected"
        neo4j_status = "connected" if neo4j_service else "not_configured"
        
        return {
            "ready": True,
            "service": "antifraude-service",
            "database": db_status,
            "neo4j": neo4j_status
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {e}", extra={'requestId': 'readiness'})
        raise HTTPException(status_code=503, detail="Service not ready")

@app.get("/metrics")
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/api/antifraude/registrar-interacao")
def registrar_interacao(request: RegistrarInteracaoRequest):
    try:
        if neo4j_service:
            neo4j_service.criar_interacao(
                request.user_id_origem,
                request.user_id_destino,
                request.tipo_interacao,
                request.valor
            )
        
        logger.info(f"Interação registrada: {request.user_id_origem} -> {request.user_id_destino}")
        
        return {
            "success": True,
            "origem": request.user_id_origem,
            "destino": request.user_id_destino,
            "tipo": request.tipo_interacao
        }
    
    except Exception as e:
        logger.error(f"Erro ao registrar interação: {e}")
        raise HTTPException(status_code=500, detail="Erro ao registrar interação")

@app.post("/api/antifraude/analisar-padrao")
def analisar_padrao(request: AnalisarPadraoRequest):
    try:
        if not neo4j_service:
            return {
                "user_id": request.user_id,
                "suspeito": False,
                "score_fraude": 0.0,
                "clusters": [],
                "message": "Neo4j não configurado"
            }
        
        clusters = neo4j_service.detectar_clusters_fechados(request.user_id)
        
        interacoes_repetitivas = neo4j_service.contar_interacoes_repetitivas(request.user_id)
        
        score_fraude = calcular_score_fraude(len(clusters), interacoes_repetitivas)
        
        suspeito = score_fraude > 0.7
        
        if suspeito:
            logger.warning(f"Usuário {request.user_id} marcado como suspeito (score: {score_fraude})")
        
        return {
            "user_id": request.user_id,
            "suspeito": suspeito,
            "score_fraude": score_fraude,
            "clusters_detectados": len(clusters),
            "interacoes_repetitivas": interacoes_repetitivas,
            "clusters": clusters[:5]
        }
    
    except Exception as e:
        logger.error(f"Erro ao analisar padrão: {e}")
        raise HTTPException(status_code=500, detail="Erro ao analisar padrão")

@app.get("/api/antifraude/estatisticas/{user_id}")
def obter_estatisticas(user_id: str):
    try:
        if not neo4j_service:
            return {
                "user_id": user_id,
                "total_conexoes": 0,
                "message": "Neo4j não configurado"
            }
        
        total_conexoes = neo4j_service.contar_conexoes(user_id)
        
        return {
            "user_id": user_id,
            "total_conexoes": total_conexoes,
            "timestamp": "2025-10-15"
        }
    
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas: {e}")
        raise HTTPException(status_code=500, detail="Erro ao obter estatísticas")

def calcular_score_fraude(num_clusters: int, interacoes_repetitivas: int) -> float:
    w1 = 0.6
    w2 = 0.4
    
    cluster_norm = min(num_clusters / 10, 1.0)
    
    repeticao_norm = min(interacoes_repetitivas / 50, 1.0)
    
    score = (w1 * cluster_norm) + (w2 * repeticao_norm)
    
    return round(score, 2)
