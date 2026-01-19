from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Web Summarizer API")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return{"message": "API do Web Summarizer está rodando 🚀"}

@app.post("/summarize")
def summarize(request: TextRequest):
    text = request.text

    # Resumo fake (por enquanto)
    summary = text[:100] + "..." if len(text) > 100 else text

    return{
        "summary": summary
    }