import "./App.css";

import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [bullets, setBullets] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleSummarize = async () => {
    setLoading(true);

    const response = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    setSummary(data.summary);
    setBullets(data.bullets);
    setActions(data.actions);

    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setText(data.text);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <div className="container">
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
      </div>

      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* RESUMO */}
      {summary && (
        <div>
          <h2>Resumo</h2>
          <p>{summary}</p>
        </div>
      )}

      {/* BULLETS */}
      {bullets.length > 0 && (
        <div>
          <h2>Pontos principais</h2>
          <ul>
            {bullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ACTION ITEMS */}
      {actions.length > 0 && (
        <div>
          <h2>Ações sugeridas</h2>
          <ul>
            {actions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
