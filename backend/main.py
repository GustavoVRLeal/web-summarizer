from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "API do Web Summarizer está rodando 🚀"}

@app.post("/summarize")
def summarize(request: TextRequest):
    text = request.text

    summary = text[:200]

    bullets = [
        sentence.strip()
        for sentence in text.split(".")[:3]
        if sentence.strip()
    ]

    actions = [
        "Revisar o conteúdo resumido",
        "Compartilhar com a equipe",
        "Definir próximos passos"
    ]

    return {
        "summary": summary,
        "bullets": bullets,
        "actions": actions
    }

