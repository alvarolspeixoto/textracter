from fastapi import FastAPI
from app.routes import analyze_document

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(analyze_document.router)

@app.get("/api")
def test():
    return {"message": "Hello World"}

