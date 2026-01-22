import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def llm_summarize(text: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY não encontrado. Configure no backend/.env")
    
    client = OpenAI(api_key=api_key)

    prompt = f"""
Você é um assistente que resume relatórios.
Retorne APENAS JSON válido no formato:
{{
  "summary": "string",
  "bullets": ["string", "..."],
  "actions": ["string", "..."]
}}

Texto:
{text}
""".strip()
    
    # Respostas API
    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    output_text = resp.output_text.strip()

    # tenta JSON direto, se vier com texto extra, tenta extrair
    try:
        data = json.loads(output_text)
    except Exception:
        start = output_text.find("{")
        end = output_text.rfind("}")
        if start == -1 or end == -1:
            raise RuntimeError(f"LLM não retornou JSON. Saída: {output_text[:300]}")
        data = json.loads(output_text[start : end + 1])

    # estrutura valida
    return {
        "summary": str(data.get("summary", "")).strip(),
        "bullets": [str(x).strip() for x in (data.get("bullets") or [])],
        "actions": [str(x).strip() for x in (data.get("actions") or [])]
    }