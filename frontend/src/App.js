import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://watchmysite-backend.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Error contacting backend." });
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f6f8fa" }}>
      <h1 style={{ textAlign: "center", margin: "2rem 0" }}>WatchMySite</h1>
      <form onSubmit={handleCheck} style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter website URL"
          style={{
            padding: 12, fontSize: 18, borderRadius: 6, border: "1px solid #ccc", width: 400, marginRight: 12
          }}
        />
        <button style={{
          padding: "12px 32px", fontSize: 18, borderRadius: 6, background: "#2563eb", color: "#fff", border: "none"
        }} type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check"}
        </button>
      </form>
      {result && (
        <div style={{
          display: "flex", justifyContent: "center", gap: 24
        }}>
          <div style={{
            background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #dbeafe", padding: 24, minWidth: 300
          }}>
            <h3>Status</h3>
            <div>
              {result.status === "reachable" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>✔ Reachable</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>✖ {result.status || "Error"}</span>
              )}
            </div>
            <h3>SSL</h3>
            <div>
              {result.ssl ? (
                <span style={{ color: "green", fontWeight: "bold" }}>✔ Valid</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>✖ Invalid</span>
              )}
            </div>
            <h3>DNS</h3>
            <div>
              {Array.isArray(result.dns) && result.dns.length > 0 ? (
                <ul>{result.dns.map(ip => <li key={ip}>{ip}</li>)}</ul>
              ) : "No DNS found"}
            </div>
          </div>
          <div style={{
            background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #dbeafe", padding: 24, minWidth: 300
          }}>
            <h3>Lighthouse</h3>
            {result.lighthouse && typeof result.lighthouse === "object" ? (
              <div>
                <div><strong>Performance:</strong> {result.lighthouse.performance ?? "--"}</div>
                <div><strong>Accessibility:</strong> {result.lighthouse.accessibility ?? "--"}</div>
                <div><strong>SEO:</strong> {result.lighthouse.seo ?? "--"}</div>
              </div>
            ) : (
              <div>No Lighthouse data</div>
            )}
          </div>
        </div>
      )}
      {result?.error && <div style={{ color: "red", textAlign: "center", marginTop: 32 }}>{result.error}</div>}
    </div>
  );
}

export default App;