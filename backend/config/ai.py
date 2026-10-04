import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

ai_client = AsyncOpenAI(
    base_url=os.getenv("NINE_ROUTER_URL", "https://9router.najmifaza.my.id/v1"),
    api_key=os.getenv("NINE_ROUTER_KEY", "not-needed"),
    timeout=15.0,
)

AI_MODEL = os.getenv("AI_MODEL", "ag/gemini-3.7-flash-medium")
