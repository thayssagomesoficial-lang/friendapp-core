import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as aioredis
import logging

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://friendapp:friendapp_dev_2024@postgres:5432/friendapp")
DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

redis_client = None

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_redis():
    return redis_client

async def init_db():
    global redis_client
    try:
        redis_client = await aioredis.from_url(REDIS_URL, decode_responses=True)
        await redis_client.ping()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        
    try:
        async with engine.begin() as conn:
            logger.info("PostgreSQL connected successfully")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
