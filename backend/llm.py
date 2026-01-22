import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def _safe_list(value):
    if isinstance(value, list):
        return [str(x).strip() for x in value if str(x).strip()]
    return []

def _clamp_list(items, max_len):
    return items[:max_len]

def _extract_json(text: str):
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise RuntimeError(f"LLM não retornou JSON. Saída: {text[:300]}")
    return json.loads(text[start:end+1])

def llm_summarize(text: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY não encontrado. Configure no backend/.env")
    
    MAX_CHARS = 12000
    text_to_send = text.strip()
    if len(text_to_send) > MAX_CHARS:
        text_to_send = text_to_send[:MAX_CHARS]
    
    client = OpenAI(api_key=api_key)

    prompt = f"""
Retorne APENAS um JSON válido, sem markdown, sem texto extra.
Esquema obrigatório:
{{
  "summary": "string (2-5 frases)",
  "bullets": ["string", "..."] (3 a 6 itens),
  "actions": ["string", "..."] (2 a 5 itens)
}}

Regras:
- bullets e actions devem ser frases curtas.
- Não repita frases idênticas.
- Se faltar informação, retorne listas menores, mas nunca null.

Texto:
{text}
""".strip()

    
    # Respostas API
    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    output_text = resp.output_text.strip()
    data = _extract_json(output_text)

    summary = str(data.get("summary", "")).strip()
    bullets = _safe_list(data.get("bullets"))
    actions = _safe_list(data.get("actions"))

    bullets = _clamp_list(bullets, max_len=6)
    actions = _clamp_list(actions, max_len=5)

    if not summary:
        summary = "Não foi possível gerar um resumo com qualidade. Tente novamente com mais contexto."

    return {"summary": summary, "bullets": bullets, "actions": actions}