import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

from app.utils import FeatureType, upload_file_to_s3, analyze_document

router = APIRouter()

load_dotenv()

BUCKET_NAME = os.getenv("BUCKET_NAME")

@router.post("/analyze-document")
async def analyze(file: UploadFile = File(...), feature_type: FeatureType = FeatureType.TABLES, queries: list[str] = None):
    if file.content_type not in ["image/png", "application/pdf", "image/jpeg"]:
        return JSONResponse(content={"error": "Formato de arquivo não suportado. Apenas PNG, PDF e JPG são permitidos."}, status_code=400)

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        return JSONResponse(content={"error": "O arquivo deve ter menos de 5MB."}, status_code=400)
    await file.seek(0)

    if not feature_type:
        return JSONResponse(content={"error": "Pelo menos um tipo de recurso deve ser selecionado."}, status_code=400)

    if feature_type == FeatureType.QUERIES.value and (not queries or queries == ['']):
        return JSONResponse(content={"error": "Nenhuma consulta foi fornecida."}, status_code=400)

    try:
        upload_file_to_s3(file, BUCKET_NAME)
        response = analyze_document(file.filename, BUCKET_NAME, feature_type, queries)

        filtered_blocks = [block for block in response['Blocks'] if block['BlockType'] in ['WORD', 'QUERY', 'QUERY_RESULT']]

        filtered_response = {**response, 'Blocks': filtered_blocks}

        return JSONResponse(content=filtered_response, status_code=200)
    except NoCredentialsError:
        return JSONResponse(content={"error": "Credenciais da AWS não encontradas."}, status_code=400)
    except PartialCredentialsError:
        return JSONResponse(content={"error": "Credenciais da AWS incompletas."}, status_code=400)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)