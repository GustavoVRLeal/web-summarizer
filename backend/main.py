from fastapi import FastAPI

app = FastAPI(title="Web Summarizer API")

@app.get("/")
def read_root():
    return{"message": "API do Web Summarizer está rodando 🚀"}