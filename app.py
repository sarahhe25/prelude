# exposes health-check and chat endpoints through FastAPI

from __future__ import annotations

from functools import lru_cache

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

from rag import RAGService, service_from_env


app = FastAPI(title="Interview RAG API", version="1.0.0")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    role_family: str = Field(min_length=1, max_length=100)

    @field_validator("message", "role_family")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be blank")
        return value.strip()


@lru_cache
def get_service() -> RAGService:
    return service_from_env()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest, service: RAGService = Depends(get_service)) -> dict:
    try:
        return service.chat(request.message, request.role_family)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
