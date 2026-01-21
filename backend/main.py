from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from PyPDF2 import PdfReader
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

    if file.filename.endswith(".txt"):
        content = await file.read()
        text = content.decode("utf-8")

    elif file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

    else:
        return {"error": "Formato de arquivo não suportado"}
    
    return {
        "filename": file.filename,
        "text": text
    }

def process_text(text: str):
    sentences = text.split(".")

    summary = ". ".join(sentences[:3]).strip()

    bullets = [
        sentences.strip()
        for sentence in sentences[:5]
        if sentence.strip()
    ]

    actions = [
        f"Ação: {sentences.strip()}"
        for sentence in sentences[:3]
        if sentence.strip()
    ]

    return {
        "summary": summary,
        "bullets": bullets,
        "actions": actions
    }