import "./App.css";

import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Web Summarizer</h1>

      <textarea
        placeholder="Cole seu texto aqui..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      />

      <br /><br />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Resumindo..." : "Resumir"}
      </button>

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
