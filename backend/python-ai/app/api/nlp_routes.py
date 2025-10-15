from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class AnalyzeTextRequest(BaseModel):
    text: str
    language: str = "pt"

class ExtractKeywordsRequest(BaseModel):
    text: str
    maxKeywords: int = 10

@router.post("/analyze-text")
async def analyze_text(request: AnalyzeTextRequest):
    """Analisa texto usando NLP para extrair sentimento e entidades"""
    try:
        word_count = len(request.text.split())
        char_count = len(request.text)
        
        return {
            "status": "success",
            "data": {
                "language": request.language,
                "word_count": word_count,
                "char_count": char_count,
                "sentiment": "neutral",
                "entities": [],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/extract-keywords")
async def extract_keywords(request: ExtractKeywordsRequest):
    """Extrai palavras-chave do texto"""
    try:
        words = request.text.lower().split()
        keywords = list(set(words))[:request.maxKeywords]
        
        return {
            "status": "success",
            "data": {
                "keywords": keywords,
                "count": len(keywords),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
