import os
from contextlib import asynccontextmanager
import aiomysql
from dotenv import load_dotenv

load_dotenv()

_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        _pool = await aiomysql.create_pool(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "kilas_user"),
            password=os.getenv("DB_PASS", ""),
            db=os.getenv("DB_NAME", "kilastugas_db"),
            autocommit=True,
            charset="utf8mb4",
            minsize=1,
            maxsize=10,
        )
    return _pool

@asynccontextmanager
async def get_db():
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            yield cur

async def close_pool():
    global _pool
    if _pool:
        _pool.close()
        await _pool.wait_closed()
        _pool = None
