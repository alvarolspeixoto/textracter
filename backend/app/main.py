from fastapi import FastAPI
from app.routes import analyze_document

app = FastAPI()
app.include_router(analyze_document.router)

@app.get("/api")
def test():
    return {"message": "Hello World"}

