import { useEffect, useState } from "react";
import { getSessionId } from "./utils/sessionUtils";

import ProviderSelect from "./components/ProviderSelect";
import ToolSelect from "./components/ToolsSelect";
import PromptBox from "./components/PromptBox";
import FileUpload from "./components/FileUpload";
// import Actions from "./components/Actions";
// import ResultBox from "./components/ResultBox";

export default function App() {
  const [provider, setProvider] = useState("gemini");
  const [tool, setTool] = useState("Q/A");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");

  const sessionId = getSessionId();

  useEffect(() => {
    if (tool === "rag") {
      setProvider("gemini");
    }
  }, [tool]);

  async function sendPrompt() {
    const formData = new FormData();

    const finalProvider = tool === "rag" ? "gemini" : provider;

    formData.append("provider", finalProvider);
    formData.append("tool", tool);
    formData.append("prompt", prompt);
    formData.append("sessionId", sessionId);

    if (file) formData.append("file", file);

    const res = await fetch("/generate", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("Backend error:", text);
      return;
    }

    const data = await res.json();

    setResult(data.success ? data.text_output : data.text_error);
  }

  async function seeHistory() {
    const res = await fetch(`/history/${sessionId}`);
    const data = await res.json();

    setResult(
      data.history.map((msg: any, index: any) => (
        <div key={index} className={`message ${msg.role}`}>
          <div className="role"><b>{msg.role.toUpperCase()} :</b></div>
          <div className="text">{msg.text}</div>
        </div>
      ))
    );
  }

  async function clearHistory() {
    await fetch(`/history/${sessionId}`, { method: "DELETE" });
    setResult("History cleared.");
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">AI Tool Assistance</h1>

      <div className="row mb-3 justify-content-center">
        <div className="col-auto">
          <ProviderSelect value={provider} onChange={setProvider} tool={tool}/>
        </div>
        <div className="col-auto">
          <ToolSelect value={tool} onChange={setTool} />
        </div>
      </div>


      <div className="row mb-3 justify-content-center">
        <div className="col">
          <PromptBox value={prompt} onChange={setPrompt} />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col d-flex justify-content-center">
          <FileUpload onChange={setFile} />
        </div>
      </div>


      <div className="row mb-3 justify-content-center">
        <div className="col-auto">
          <button className="btn btn-primary" onClick={sendPrompt}>
            Generate
          </button>
        </div>
      </div>

      <div className="row mb-3 justify-content-center">
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={seeHistory}>
            See History
          </button>
        </div>

        <div className="col-auto">
          <button className="btn btn-danger" onClick={clearHistory}>
            Clear History
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <pre className="p-3 border">{result}</pre>
        </div>
      </div>
    </div>
  );
}