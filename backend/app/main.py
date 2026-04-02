from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.providers.google_ai import ProviderConfigurationError, ProviderError
from app.routes.document import router as document_router
from app.routes.egov import router as egov_router
from app.routes.job import router as job_router
from app.routes.loan import router as loan_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_allow_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(ProviderConfigurationError)
    async def provider_configuration_error_handler(_: Request, __: ProviderConfigurationError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={"detail": "AI provider is not configured."},
        )

    @app.exception_handler(ProviderError)
    async def provider_error_handler(_: Request, __: ProviderError) -> JSONResponse:
        return JSONResponse(
            status_code=502,
            content={"detail": "AI provider request failed."},
        )

    app.include_router(document_router)
    app.include_router(egov_router)
    app.include_router(loan_router)
    app.include_router(job_router)

    @app.get("/health", tags=["system"])
    async def healthcheck() -> dict[str, str]:
        return {"status": "ok", "service": settings.app_name}

    return app


app = create_app()
