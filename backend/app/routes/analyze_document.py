import os
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from pydantic import BaseModel

from app.utils import FeatureType, upload_file_to_s3, analyze_document
from app.routes.models import TextractResponse

router = APIRouter()

load_dotenv()

BUCKET_NAME = os.getenv("BUCKET_NAME")


class ErrorResponse(BaseModel):
    error: str


@router.post("/analyze-document", responses={
    200: {"description": "Successful Operation", "model": TextractResponse},
    400: {
        "description": "Bad Request",
        "content": {
            "application/json": {
                "examples": {
                    "invalid_file_type": {
                        "summary": "Invalid File Type",
                        "value": {"error": "Formato de arquivo não suportado. Apenas PNG, PDF e JPG são permitidos."}
                    },
                    "file_too_large": {
                        "summary": "File Too Large",
                        "value": {"error": "O arquivo deve ter menos de 5MB."}
                    },
                    "missing_feature_type": {
                        "summary": "Missing Feature Type",
                        "value": {"error": "Pelo menos um tipo de recurso deve ser selecionado."}
                    },
                    "missing_queries": {
                        "summary": "Missing Queries",
                        "value": {"error": "Nenhuma consulta foi fornecida."}
                    },
                    "aws_credentials_not_found": {
                        "summary": "AWS Credentials Not Found",
                        "value": {"error": "Credenciais da AWS não encontradas."}
                    },
                    "aws_credentials_incomplete": {
                        "summary": "Incomplete AWS Credentials",
                        "value": {"error": "Credenciais da AWS incompletas."}
                    }
                }
            }
        }
    },
    422: {"description": "Validation Error"}
})
async def analyze(
    file: UploadFile = File(...),
    feature_type: FeatureType = FeatureType.TABLES,
    queries: list[str] = None,
) -> JSONResponse:
    if file.content_type not in ["image/png", "application/pdf", "image/jpeg"]:
        raise HTTPException(
            status_code=400,
            detail="Formato de arquivo não suportado. Apenas PNG, PDF e JPG são permitidos.",
        )

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="O arquivo deve ter menos de 5MB.")
    await file.seek(0)

    if not feature_type:
        raise HTTPException(
            status_code=400,
            detail="Pelo menos um tipo de recurso deve ser selecionado.",
        )

    if feature_type == FeatureType.QUERIES.value and (not queries or queries == [""]):
        raise HTTPException(status_code=400, detail="Nenhuma consulta foi fornecida.")

    try:
        upload_file_to_s3(file, BUCKET_NAME)
        response = analyze_document(file.filename, BUCKET_NAME, feature_type, queries)

        filtered_blocks = [
            block
            for block in response["Blocks"]
            if block["BlockType"] in ["WORD", "QUERY", "QUERY_RESULT"]
        ]
        filtered_response = {**response, "Blocks": filtered_blocks}

        return JSONResponse(content=filtered_response, status_code=200)

    except NoCredentialsError:
        raise HTTPException(
            status_code=400, detail="Credenciais da AWS não encontradas."
        )

    except PartialCredentialsError:
        raise HTTPException(status_code=400, detail="Credenciais da AWS incompletas.")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
