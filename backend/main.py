from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
import PyPDF2


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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = ""

    if file.filename.endswith(".txt"):
        content = (await file.read()).decode("utf-8")

    elif file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file.file)
        for page in reader.pages:
            content += page.extract_text() or ""

    else:
        return {"error": "Formato de arquivo não suportado"}

    # Reaproveitando a lógica de resumo
    summary = content[:200]

    bullets = [
        sentence.strip()
        for sentence in content.split(".")[:3]
        if sentence.strip()
    ]

    actions = [
        "Revisar o resumo gerado",
        "Validar informações importantes",
        "Definir ações com base no relatório"
    ]

    return {
        "filename": file.filename,
        "summary": summary,
        "bullets": bullets,
        "actions": actions
    }