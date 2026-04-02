from fastapi import APIRouter

from app.schemas.document import DocumentDecodeRequest, DocumentDecodeResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/document-decode", tags=["document"])
service = AIService()


@router.post("", response_model=DocumentDecodeResponse)
async def document_decode(payload: DocumentDecodeRequest) -> DocumentDecodeResponse:
    return await service.analyze_document(payload)
