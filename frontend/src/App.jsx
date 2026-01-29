import "./App.css";

import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://web-summarizer-3gkx.onrender.com";


console.log("API_URL:", API_URL);

const BrazilFlagIcon = () => (
  <svg className="flagIcon" viewBox="0 0 64 48" aria-hidden="true">
    <defs>
      <clipPath id="brFlagClip">
        <rect width="64" height="48" rx="6" ry="6" />
      </clipPath>
      <clipPath id="brCircleClip">
        <circle cx="32" cy="24" r="11" />
      </clipPath>
      <pattern id="brStars" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.45" fill="#ffffff" />
      </pattern>
    </defs>
    <g clipPath="url(#brFlagClip)">
      <rect width="64" height="48" fill="#009c3b" />
      <polygon points="32,6 58,24 32,42 6,24" fill="#ffdf00" />
      <g clipPath="url(#brCircleClip)">
        <circle cx="32" cy="24" r="11" fill="#002776" />
        <rect x="21" y="17" width="22" height="14" fill="url(#brStars)" opacity="0.85" />
        <path
          d="M20 22 C26 18 38 18 44 22"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </g>
    <rect width="64" height="48" rx="6" ry="6" fill="none" stroke="rgba(255,255,255,0.2)" />
  </svg>
);

const UsaFlagIcon = () => (
  <svg className="flagIcon" viewBox="0 0 64 48" aria-hidden="true">
    <defs>
      <clipPath id="usFlagClip">
        <rect width="64" height="48" rx="6" ry="6" />
      </clipPath>
      <pattern id="usStripes" width="64" height="7.3846" patternUnits="userSpaceOnUse">
        <rect width="64" height="3.6923" fill="#ff4b55" />
        <rect y="3.6923" width="64" height="3.6923" fill="#ffffff" />
      </pattern>
      <pattern id="usStars" width="6" height="6" patternUnits="userSpaceOnUse">
        <polygon
          points="3,0.4 3.8,2.2 5.8,2.2 4.2,3.4 4.8,5.6 3,4.3 1.2,5.6 1.8,3.4 0.2,2.2 2.2,2.2"
          fill="#ffffff"
        />
      </pattern>
    </defs>
    <g clipPath="url(#usFlagClip)">
      <rect width="64" height="48" fill="url(#usStripes)" />
      <rect width="28" height="22" fill="#3c3b6e" />
      <rect width="28" height="22" fill="url(#usStars)" />
    </g>
    <rect width="64" height="48" rx="6" ry="6" fill="none" stroke="rgba(255,255,255,0.2)" />
  </svg>
);


function App() {
  const [language, setLanguage] = useState("pt");
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
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const translations = {
    pt: {
      languageToggleLabel: "Idioma",
      title: "Web Summarizer",
      subtitle: "Cole o texto ou envie um PDF/TXT para gerar um resumo, pontos-chave e acoes.",
      textLabel: "Texto",
      textPlaceholder: "Cole seu texto aqui...",
      summarize: "Resumir",
      summarizing: "Resumindo...",
      importFile: "Importar arquivo",
      processing: "Processando...",
      noFileSelected: "Nenhum arquivo selecionado",
      originalText: "Texto original",
      summary: "Resumo",
      keyPoints: "Pontos-chave",
      suggestedActions: "Acoes sugeridas",
      history: "Historico",
      paginationPrev: "Anterior",
      paginationNext: "Proxima",
      pageLabel: "Pagina",
      ofLabel: "de",
      searchPlaceholder: "Buscar no historico...",
      search: "Buscar",
      noSummaries: "Nenhum resumo ainda.",
      createdAt: "Criado em",
      loadingHistory: "Carregando resumo do historico...",
      tip: "Dica: gere alguns resumos para preencher o historico.",
      errorSummarize: "Erro ao resumir. Verifique se o backend esta online e tente novamente.",
      errorHistory: "Erro ao abrir o resumo do historico.",
      errorUpload: "Nao foi possivel ler o arquivo. Tente outro PDF/TXT.",
    },
    en: {
      languageToggleLabel: "Language",
      title: "Web Summarizer",
      subtitle: "Paste text or upload a PDF/TXT to generate a summary, key points, and actions.",
      textLabel: "Text",
      textPlaceholder: "Paste your text here...",
      summarize: "Summarize",
      summarizing: "Summarizing...",
      importFile: "Import file",
      processing: "Processing...",
      noFileSelected: "No file selected",
      originalText: "Original text",
      summary: "Summary",
      keyPoints: "Key points",
      suggestedActions: "Suggested actions",
      history: "History",
      paginationPrev: "Previous",
      paginationNext: "Next",
      pageLabel: "Page",
      ofLabel: "of",
      searchPlaceholder: "Search history...",
      search: "Search",
      noSummaries: "No summaries yet.",
      createdAt: "Created at",
      loadingHistory: "Loading history summary...",
      tip: "Tip: generate a few summaries to populate the history.",
      errorSummarize: "Error summarizing. Check if the backend is online and try again.",
      errorHistory: "Error opening history summary.",
      errorUpload: "Could not read the file. Try another PDF/TXT.",
    },
  };

  const localeByLanguage = {
    pt: "pt-BR",
    en: "en-US",
  };

  const t = translations[language];

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

  useEffect(() => {
    setPage(1);
  }, [history.length]);

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
      alert(t.errorSummarize);
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
      alert(t.errorHistory);
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
      alert(t.errorUpload);
    }
  };

  const hasResults =
    summary || bullets.length > 0 || actions.length > 0 || originalText;
  const totalPages = Math.max(1, Math.ceil(history.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedHistory = history.slice(startIndex, startIndex + pageSize);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="languageToggle" role="group" aria-label={t.languageToggleLabel}>
            <button
              className={`flagButton ${language === "pt" ? "flagButtonActive" : ""}`}
              type="button"
              aria-label="Mudar para Portugues"
              title="Portuguese"
              aria-pressed={language === "pt"}
              onClick={() => setLanguage("pt")}
            >
              <BrazilFlagIcon />
            </button>
            <button
              className={`flagButton ${language === "en" ? "flagButtonActive" : ""}`}
              type="button"
              aria-label="Switch to English"
              title="English"
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              <UsaFlagIcon />
            </button>
          </div>
          <h1 className="title">{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </header>

        {/* Input */}
        <section className="card">
          <label className="label">{t.textLabel}</label>
          <textarea
            className="textarea"
            placeholder={t.textPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="actionsRow">
            <button className="btn btnPrimary" onClick={handleSummarize} disabled={loading || !text.trim()}>
              {loading ? t.summarizing : t.summarize}
            </button>

            <button className="btn btnSecondary" onClick={handleUpload} disabled={loading || !file}>
              {loading ? t.processing : t.importFile}
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
              {file ? file.name : t.noFileSelected}
            </span>
          </div>
        </section>

        {/* Output */}
        {hasResults && (
          <section className="resultsGrid">
            {originalText && (
              <div className="card">
                <h2 className="cardTitle">{t.originalText}</h2>
                <p className="text pre">{originalText}</p>
              </div>
            )}

            {summary && (
              <div className="card">
                <h2 className="cardTitle">{t.summary}</h2>
                <p className="text">{summary}</p>
              </div>
            )}

            {bullets.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">{t.keyPoints}</h2>
                <ul className="list">
                  {bullets.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {actions.length > 0 && (
              <div className="card">
                <h2 className="cardTitle">{t.suggestedActions}</h2>
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
            <h2 className="cardTitle">{t.history}</h2>

            <div className="searchRow">
              <input
                className="searchInput"
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btnGhost" onClick={handleSearch}>
                {t.search}
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="muted">{t.noSummaries}</p>
          ) : (
            <>
              <div className="historyGrid">
                {pagedHistory.map((item) => (
                <button
                  className={`historyCard ${selectedId === item.id ? "historyCardActive" : ""}`}
                  key={item.id}
                  onClick={() => handleHistorySelect(item.id)}
                  type="button"
                >
                  <p className="historyText">
                    <strong>{t.summary}:</strong> {item.summary}
                  </p>
                  <small className="muted">
                    {t.createdAt}: {new Date(item.created_at).toLocaleString(localeByLanguage[language])}
                  </small>
                </button>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btnGhost"
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                  >
                    {t.paginationPrev}
                  </button>
                  <span className="paginationInfo">
                    {t.pageLabel} {safePage} {t.ofLabel} {totalPages}
                  </span>
                  <button
                    className="btn btnGhost"
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safePage === totalPages}
                  >
                    {t.paginationNext}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <footer className="footer">
          <span className="muted">
            {detailLoading ? t.loadingHistory : t.tip}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
