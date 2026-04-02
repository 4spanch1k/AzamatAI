from fastapi import APIRouter

from app.schemas.loan import LoanAnalyzerRequest, LoanAnalyzerResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/loan-analyzer", tags=["loan"])
service = AIService()


@router.post("", response_model=LoanAnalyzerResponse)
async def loan_analyzer(payload: LoanAnalyzerRequest) -> LoanAnalyzerResponse:
    return await service.analyze_loan(payload)
