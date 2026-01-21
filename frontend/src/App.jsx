import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [bullets, setBullets] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
    const response = await fetch("http://127.0.0.1:8000/history");

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Erro no fetchHistory:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async () => {
  try {
    if (!search.trim()) {
      await fetchHistory();
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/search?q=${encodeURIComponent(search)}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await response.json();
    setHistory(data);
    } catch (error) {
      console.error("Erro no handleSearch:", error);
    }
  };


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

    await fetchHistory();

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

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar no histórico..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />

        <button onClick={handleSearch}>Buscar</button>
      </div>
    
      <hr />

      <h2>Histórico de resumos</h2>

      {history.length === 0 && <p>Nenhum resumo ainda.</p>}

      {history.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>Resumo:</strong> {item.summary}</p>
          <small>
            Criado em: {new Date(item.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;
