import { useEffect, useState, useCallback } from "react";
import { getSessionId } from "./utils/sessionUtils";

import ProviderSelect from "./components/ProviderSelect";
import ToolSelect from "./components/ToolsSelect";
import PromptBox from "./components/PromptBox";
import FileUpload from "./components/FileUpload";
import ResultBox from "./components/ResultBox";
import Sidebar from "./components/Sidebar";
import SettingsModal from "./components/SettingsModel";
import { Settings, Sparkles, Send, MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryItem {
  sessionId: string;
  title: string;
  timestamp: number;
}

export default function App() {
  const [provider, setProvider] = useState("gemini");
  const [tool, setTool] = useState("Q/A");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessions, setSessions] = useState<HistoryItem[]>([]);
  const [sessionId, setSessionId] = useState(getSessionId());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load session list from localStorage to track session IDs
  const loadSessions = useCallback(() => {
    const stored = localStorage.getItem("chat_sessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (tool === "rag") {
      setProvider("gemini");
    }
  }, [tool]);

  async function sendPrompt() {
    if (!prompt.trim() && !file) return;
    
    setLoading(true);
    setResult("");

    try {
        const formData = new FormData();
        const finalProvider = tool === "rag" ? "gemini" : provider;

        formData.append("provider", finalProvider);
        formData.append("tool", tool);
        formData.append("prompt", prompt);
        formData.append("sessionId", sessionId);

        if (file) formData.append("file", file);

        const selectedKey = JSON.parse(localStorage.getItem('api_keys') || '[]')[0];

        const realKey = localStorage.getItem(`key_${selectedKey.id}`);
        console.log("Using API Key for provider", finalProvider, ":", realKey);

        const res = await fetch("/generate", {
            method: "POST",
            headers: {
                "x-api-key": realKey || ""
            },
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            setResult(err.text_error || err.error || "Unknown server error");
            return;
        }

        const data = await res.json();
        setResult(data.success ? data.text_output : data.text_error);
        
        // Update local session list if this is a new session
        const existingSessions = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
        if (!existingSessions.find((s: any) => s.sessionId === sessionId)) {
            const newSession = {
                sessionId,
                title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "") || "New Thread",
                timestamp: Date.now()
            };
            const updated = [newSession, ...existingSessions];
            localStorage.setItem("chat_sessions", JSON.stringify(updated));
            setSessions(updated);
        }
    } catch (error: any) {
        setResult(`Request failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  }

  async function loadThread(id: string) {
    setSessionId(id);
    setResult(""); 
    
    try {
        const res = await fetch(`/history/${id}`);
        const data = await res.json();

        if (data.success && data.history) {
            setResult(
                <div className="space-y-6">
                    {data.history.map((msg: any, index: number) => (
                        <div 
                            key={index} 
                            className={`flex flex-col gap-2 p-4 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-blue-50 border border-blue-100 self-end ml-12' 
                                : 'bg-white border border-gray-100 self-start mr-12'
                            }`}
                        >
                            <div className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 ${msg.role === 'user' ? 'text-blue-600' : 'text-purple-600'}`}>
                                {msg.role === 'user' ? <MessageSquare className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                {msg.role.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-800 leading-relaxed break-words whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    ))}
                </div>
            );
        } else {
            setResult(data.text_error || "No history found for this session.");
        }
    } catch (error) {
        setResult("Failed to load history.");
    }
  }

  async function deleteThread(id: string) {
    await fetch(`/history/${id}`, { method: "DELETE" });
    const updated = sessions.filter(s => s.sessionId !== id);
    localStorage.setItem("chat_sessions", JSON.stringify(updated));
    setSessions(updated);
    
    if (id === sessionId) {
        startNewThread();
    }
  }

  function startNewThread() {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setPrompt("");
    setFile(null);
    setResult("");
  }

  async function exportHistory() {
    const fullLog: any = {};
    for (const session of sessions) {
        try {
            const res = await fetch(`/history/${session.sessionId}`);
            const data = await res.json();
            if (data.success) fullLog[session.sessionId] = data.history;
        } catch (e) {
            console.error(e);
        }
    }

    const blob = new Blob([JSON.stringify({ sessions, history: fullLog }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-suite-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importHistory(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (data.sessions && data.history) {
                localStorage.setItem("chat_sessions", JSON.stringify(data.sessions));
                // We'd also need a way to batch-load the actual history into the backend
                // For this project, we'll assume the local list is enough to then fetch again or the backend is persistent
                setSessions(data.sessions);
                setResult("History registry restored. You can now access your individual threads.");
            }
        } catch (err) {
            console.error("Import error:", err);
        }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans text-gray-900">
      <Sidebar 
        history={sessions} 
        currentSessionId={sessionId} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSelectSession={loadThread}
        onNewSession={startNewThread}
        onDeleteSession={deleteThread}
        onExportHistory={exportHistory}
        onImportHistory={importHistory}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 font-sans">AI Tool Suite</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 font-mono text-[10px] uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                <span>v1.0.42</span>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              id="open-settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="max-w-4xl mx-auto py-12 px-8 space-y-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProviderSelect value={provider} onChange={setProvider} tool={tool}/>
                <ToolSelect value={tool} onChange={setTool} />
              </div>

              <PromptBox value={prompt} onChange={setPrompt} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <FileUpload onChange={setFile} file={file} />
                <button 
                  onClick={sendPrompt}
                  disabled={loading || (!prompt.trim() && !file)}
                  className={`h-11 flex items-center justify-center gap-2 px-6 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    loading || (!prompt.trim() && !file)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200'
                  }`}
                  id="generate-btn"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </div>
                  ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Generate Selection
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            <ResultBox result={result} />

            {!result && !loading && (
                <div className="py-20 text-center space-y-4 animate-in fade-in duration-1000">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full border border-gray-100">
                        <Sparkles className="w-8 h-8 text-blue-500/50" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-gray-900 font-sans">Ready to begin?</h2>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
                            Configure your session, provide context, and allow the model to refine your inputs into actionable intelligence.
                        </p>
                    </div>
                </div>
            )}
          </div>
        </div>

        <footer className="py-4 border-t border-gray-100 text-center bg-gray-50/50">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">
                Unified AI Interface • Enterprise Infrastructure
            </p>
        </footer>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
