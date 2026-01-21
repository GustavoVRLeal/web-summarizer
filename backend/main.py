from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from fastapi import Depends
from pydantic import BaseModel
from PyPDF2 import PdfReader
import PyPDF2
from database import engine
from models import Base
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Summary
import json

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "API do Web Summarizer está rodando 🚀"}

@app.post("/summarize")
async def summarize(input: TextInput, db: Session = Depends(get_db)):
    result = process_text(input.text)

    summary_db = Summary(
        original_text=input.text,
        summary=result["summary"],
        bullets=json.dumps(result["bullets"]),
        actions=json.dumps(result["actions"])
    )

    db.add(summary_db)
    db.commit()
    db.refresh(summary_db)

    return result

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

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    summaries = db.query(Summary).order_by(Summary.created_at.desc()).all()

    return [
        {
            "id": s.id,
            "summary": s.summary,
            "created_at": s.created_at
        }
        for s in summaries
    ]

def process_text(text: str):
    sentences = text.split(".")

    summary = ". ".join(sentences[:3]).strip()

    bullets = [
        sentence.strip()
        for sentence in sentences[:5]
        if sentence.strip()
    ]

    actions = [
        f"Ação: {sentence.strip()}"
        for sentence in sentences[:3]
        if sentence.strip()
    ]

    return {
        "summary": summary,
        "bullets": bullets,
        "actions": actions
    }
