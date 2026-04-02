from fastapi import APIRouter

from app.schemas.job import JobScanRequest, JobScanResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/job-scan", tags=["job"])
service = AIService()


@router.post("", response_model=JobScanResponse)
async def job_scan(payload: JobScanRequest) -> JobScanResponse:
    return await service.scan_job_offer(payload)
