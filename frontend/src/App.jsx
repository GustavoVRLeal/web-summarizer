import "./App.css";

function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Web Summarizer</h1>
      <textarea
        placeholder="Cole seu texto aqui..."
        style={{ width: "100%", height: "200px" }}
      />
      <br />
      <br />
      <button>Resumir</button>
    </div>
  );
}

export default App;
