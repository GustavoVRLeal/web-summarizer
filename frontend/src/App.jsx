import "./App.css";

import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  async function handleSummarize() {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Erro ao resumir:", error);
      alert("Erro ao resumir texto");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!file) {
      alert("Selecione um arquivo");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Web Summarizer</h1>

      <textarea
        placeholder="Cole seu texto aqui..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      />

      <br />
      <br />
      
      <div className="actions">
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "Resumindo..." : "Resumir"}
        </button>

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processando..." : "Enviar Arquivo"}
        </button>
      </div>

      <input
        type="file"
        accept=".txt,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {summary && (
        <>
          <h2>Resumo</h2>
          <p>{summary}</p>
        </>
      )}
    </div>
  );
}

export default App;
