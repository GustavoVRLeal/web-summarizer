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
        `http://127.0.0.1:8000/search?q=${encodeURIComponent(search)}`,
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

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Erro ao enviar arquivo");
      }

      const data = await response.json();
      setText(data.text || "");
    } catch (e) {
      console.error(e);
      alert("Não foi possível ler o arquivo. Tente outro PDF/TXT.");
    }
  };

  const hasResults = summary || bullets.length > 0 || actions.length > 0;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Web Summarizer</h1>
          <p className="subtitle">
            Cole um texto ou envie um PDF/TXT para gerar resumo, pontos principais e ações.
          </p>
        </header>

        {/* Entrada */}
        <section className="card">
          <label className="label">Texto</label>
          <textarea
            className="textarea"
            placeholder="Cole seu texto aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="actionsRow">
            <button className="btn btnPrimary" onClick={handleSummarize} disabled={loading || !text.trim()}>
              {loading ? "Resumindo..." : "Resumir"}
            </button>

            <button className="btn btnSecondary" onClick={handleUpload} disabled={loading || !file}>
              {loading ? "Processando..." : "Importar arquivo"}
            </button>
          </div>

          <div className="uploadRow">
            <input
              className="fileInput"
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span className="fileName">
              {file ? file.name : "Nenhum arquivo selecionado"}
            </span>
          </div>
        </section>

        {/* Saída */}
        {hasResults && (
          <section className="resultsGrid">
            {summary && (
              <div className="card">
                <h2 className="cardTitle">Resumo</h2>
                <p className="text">{summary}</p>
              </div>
            )}

            {bullets.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">Pontos principais</h2>
                <ul className="list">
                  {bullets.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {actions.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">Ações sugeridas</h2>
                <ul className="list">
                  {actions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Histórico */}
        <section className="card">
          <div className="historyHeader">
            <h2 className="cardTitle">Histórico</h2>

            <div className="searchRow">
              <input
                className="searchInput"
                type="text"
                placeholder="Buscar no histórico..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btnGhost" onClick={handleSearch}>
                Buscar
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="muted">Nenhum resumo ainda.</p>
          ) : (
            <div className="historyGrid">
              {history.map((item) => (
                <div className="historyCard" key={item.id}>
                  <p className="historyText">
                    <strong>Resumo:</strong> {item.summary}
                  </p>
                  <small className="muted">
                    Criado em: {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <span className="muted">Dica: gere alguns resumos para alimentar o histórico.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
