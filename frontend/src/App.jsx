import "./App.css";

import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://web-summarizer-3gkx.onrender.com";


console.log("API_URL:", API_URL);


function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [bullets, setBullets] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [originalText, setOriginalText] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);

      if (!response.ok) {
        throw new Error("Error fetching history");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error in fetchHistory:", error);
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
       `${API_URL}/search?q=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error("Error fetching history");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      setSummary(data.summary || "");
      setBullets(Array.isArray(data.bullets) ? data.bullets : []);
      setActions(Array.isArray(data.actions) ? data.actions : []);
      setOriginalText("");
      setSelectedId(null);

      await fetchHistory();
    } catch (error) {
      console.error("Error summarizing:", error);
      alert("Error summarizing. Check if the backend is online and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = async (id) => {
    if (selectedId === id) {
      setSelectedId(null);
      setOriginalText("");
      return;
    }

    setDetailLoading(true);
    try {
      const response = await fetch(`${API_URL}/history/${id}`);

      if (!response.ok) {
        throw new Error("Error fetching summary");
      }

      const data = await response.json();

      setSummary(data.summary || "");
      setBullets(Array.isArray(data.bullets) ? data.bullets : []);
      setActions(Array.isArray(data.actions) ? data.actions : []);
      setOriginalText(data.original_text || "");
      setSelectedId(id);
    } catch (error) {
      console.error("Error opening summary:", error);
      alert("Error opening history summary.");
    } finally {
      setDetailLoading(false);
    }
  };


  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Error uploading file");
      }

      const data = await response.json();
      setText(data.text || "");
    } catch (e) {
      console.error(e);
      alert("Could not read the file. Try another PDF/TXT.");
    }
  };

  const hasResults =
    summary || bullets.length > 0 || actions.length > 0 || originalText;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Web Summarizer</h1>
          <p className="subtitle">
            Paste text or upload a PDF/TXT to generate a summary, key points, and actions.
          </p>
        </header>

        {/* Input */}
        <section className="card">
          <label className="label">Text</label>
          <textarea
            className="textarea"
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="actionsRow">
            <button className="btn btnPrimary" onClick={handleSummarize} disabled={loading || !text.trim()}>
              {loading ? "Summarizing..." : "Summarize"}
            </button>

            <button className="btn btnSecondary" onClick={handleUpload} disabled={loading || !file}>
              {loading ? "Processing..." : "Import file"}
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
              {file ? file.name : "No file selected"}
            </span>
          </div>
        </section>

        {/* Output */}
        {hasResults && (
          <section className="resultsGrid">
            {originalText && (
              <div className="card">
                <h2 className="cardTitle">Original text</h2>
                <p className="text pre">{originalText}</p>
              </div>
            )}

            {summary && (
              <div className="card">
                <h2 className="cardTitle">Summary</h2>
                <p className="text">{summary}</p>
              </div>
            )}

            {bullets.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">Key points</h2>
                <ul className="list">
                  {bullets.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {actions.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">Suggested actions</h2>
                <ul className="list">
                  {actions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* History */}
        <section className="card">
          <div className="historyHeader">
            <h2 className="cardTitle">History</h2>

            <div className="searchRow">
              <input
                className="searchInput"
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btnGhost" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="muted">No summaries yet.</p>
          ) : (
            <div className="historyGrid">
              {history.map((item) => (
                <button
                  className={`historyCard ${selectedId === item.id ? "historyCardActive" : ""}`}
                  key={item.id}
                  onClick={() => handleHistorySelect(item.id)}
                  type="button"
                >
                  <p className="historyText">
                    <strong>Summary:</strong> {item.summary}
                  </p>
                  <small className="muted">
                    Criado em: {new Date(item.created_at).toLocaleString()}
                  </small>
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <span className="muted">
            {detailLoading
              ? "Loading history summary..."
              : "Tip: generate a few summaries to populate the history."}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
