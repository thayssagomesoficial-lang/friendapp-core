from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
from app.api import aurah_routes, nlp_routes
from app.config.database import init_db

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FriendApp AI Service",
    description="IA Aurah Kosmos - Processamento de NLP e embeddings vibracionais",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing FriendApp AI Service...")
    await init_db()
    logger.info("AI Service started successfully")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "friendapp-python-ai",
        "version": "1.0.0",
    }

app.include_router(aurah_routes.router, prefix="/api/v1/ai", tags=["Aurah Kosmos"])
app.include_router(nlp_routes.router, prefix="/api/v1/nlp", tags=["NLP"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
