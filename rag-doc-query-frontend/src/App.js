import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.text();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setMessages([...messages, { text: query, sender: "user" }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.text();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data, sender: "ai" },
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error sending query:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>RAG doc query</h1>
      </header>
      <div className="App">
        <div className="left-panel">
          <div className="left-panel-content">
            <h2>Doc Query</h2>
            <div className="file-input-wrapper">
              <label htmlFor="file-upload">Choose File</label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
            </div>
            {file && <div className="file-name">{file.name}</div>}
          </div>
          <div className="left-panel-footer">
            <button
              type="submit"
              disabled={!file}
              onClick={(e) => handleFileSubmit(e)}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="right-panel">
          <div className="chat-box">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form
            className="query-form"
            key="query-form"
            onSubmit={handleQuerySubmit}
          >
            <textarea
              value={query}
              onChange={handleQueryChange}
              placeholder="Type your query here..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
