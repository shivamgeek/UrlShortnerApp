import React, { useState } from "react";
import { shortenUrl, getHistory } from "./api";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [history, setHistory] = useState([]);

  const handleShorten = async () => {
    if (!longUrl) return;
    const data = await shortenUrl(longUrl);
    if (data.shortUrl) {
      setShortUrl(`http://localhost/${data.shortUrl}`);
      fetchHistory();
    }
  };

  const fetchHistory = async () => {
    const urls = await getHistory();
    setHistory(urls);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>URL Shortener</h1>
      <input
        type="text"
        placeholder="Enter long URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleShorten}>Shorten</button>
      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
      <button onClick={fetchHistory}>Show History</button>
      {history.length > 0 && (
        <ul>
          {history.map((url, index) => (
            <li key={index}>
              {url.shortUrl} → {url.longUrl}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
