import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from config.db import get_pool, close_pool
from routers import sessions, tasks, subtasks, breakdown

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()   # init DB pool on startup
    yield
    await close_pool() # cleanup on shutdown

app = FastAPI(
    title="KilasTugas API",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://kilastugas.vercel.app")
cors_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(tasks.router)
app.include_router(subtasks.router)
app.include_router(breakdown.router)

@app.get("/")
@app.get("/health")
async def health():
    return {"status": "ok", "app": "KilasTugas API v1.0.0"}
