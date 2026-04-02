from fastapi import APIRouter

from app.schemas.egov import EGovNavigatorRequest, EGovNavigatorResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/egov-navigator", tags=["egov"])
service = AIService()


@router.post("", response_model=EGovNavigatorResponse)
async def egov_navigator(payload: EGovNavigatorRequest) -> EGovNavigatorResponse:
    return await service.build_egov_route(payload)
