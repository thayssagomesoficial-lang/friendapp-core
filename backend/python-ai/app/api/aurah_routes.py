from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.aurah_service import AurahKosmosService

router = APIRouter()
aurah_service = AurahKosmosService()

class ProcessPersonalityRequest(BaseModel):
    userId: str
    energyVector: Dict[str, Any]
    personalityType: str

class AnalyzePostRequest(BaseModel):
    postId: str
    content: str
    emotionTone: str
    userId: str

class CalculateCompatibilityRequest(BaseModel):
    user1Id: str
    user2Id: str
    user1Data: Dict[str, Any]
    user2Data: Dict[str, Any]

class LearnInteractionRequest(BaseModel):
    userId: str
    postId: str
    interactionType: str
    durationSeconds: Optional[int] = None

@router.post("/process-personality")
async def process_personality(request: ProcessPersonalityRequest):
    """Processa dados de personalidade e cria embeddings vibracionais"""
    try:
        result = await aurah_service.process_personality(
            request.userId,
            request.energyVector,
            request.personalityType
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-post")
async def analyze_post(request: AnalyzePostRequest):
    """Analisa post e extrai características vibracionais"""
    try:
        result = await aurah_service.analyze_post(
            request.postId,
            request.content,
            request.emotionTone,
            request.userId
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate-compatibility")
async def calculate_compatibility(request: CalculateCompatibilityRequest):
    """Calcula compatibilidade holística entre dois usuários"""
    try:
        result = await aurah_service.calculate_compatibility(
            request.user1Id,
            request.user2Id,
            request.user1Data,
            request.user2Data
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/learn-interaction")
async def learn_interaction(request: LearnInteractionRequest):
    """Aprende com interações do usuário para melhorar recomendações"""
    try:
        result = await aurah_service.learn_interaction(
            request.userId,
            request.postId,
            request.interactionType,
            request.durationSeconds
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/layers")
async def get_layers():
    """Retorna informações sobre as 10 camadas da IA Aurah Kosmos"""
    return {
        "status": "success",
        "data": {
            "layers": aurah_service.layers,
            "total": len(aurah_service.layers),
            "description": "IA Aurah Kosmos - Sistema vibracional de 10 camadas"
        }
    }
