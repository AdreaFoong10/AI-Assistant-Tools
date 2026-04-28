import { MessageSquare, Clock, Trash2, Plus, PanelLeftClose, PanelLeft, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryItem {
  sessionId: string;
  title: string;
  timestamp: number;
}

export default function Sidebar({ 
  history, 
  currentSessionId, 
  isCollapsed,
  onToggle,
  onSelectSession, 
  onNewSession,
  onDeleteSession,
  onExportHistory,
  onImportHistory
}: {
  history: HistoryItem[];
  currentSessionId: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onExportHistory: () => void;
  onImportHistory: (file: File) => void;
}) {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImportHistory(file);
    };
    input.click();
  };

  return (
    <motion.aside 
        id="sidebar"
        initial={false}
        animate={{ width: isCollapsed ? 80 : 288 }}
        className="h-screen bg-gray-900 text-gray-300 flex flex-col border-r border-gray-800 shrink-0 select-none z-30 overflow-hidden relative"
    >
      <div className="p-4 border-b border-gray-800 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
            {!isCollapsed && (
              <button 
                onClick={onNewSession}
                className="flex-1 flex items-center gap-2 justify-center py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all border border-gray-700 hover:border-gray-600 font-sans font-medium truncate"
                id="new-chat-btn"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">New Thread</span>
              </button>
            )}
            
            <button 
              onClick={onToggle}
              className={`p-2.5 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white ${isCollapsed ? 'w-full flex justify-center' : ''}`}
              id="toggle-sidebar-btn"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
        </div>

        {!isCollapsed && (
            <div className="flex gap-2">
                <button 
                    onClick={handleImportClick}
                    className="flex-1 flex items-center gap-2 justify-center py-2 px-3 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg transition-all border border-gray-700 hover:border-gray-600 font-sans text-xs font-medium"
                    id="import-history-btn"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Import
                </button>
                <button 
                    onClick={onExportHistory}
                    className="flex-1 flex items-center gap-2 justify-center py-2 px-3 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg transition-all border border-gray-700 hover:border-gray-600 font-sans text-xs font-medium"
                    id="export-history-btn"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className={`px-3 mb-2 flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <Clock className="w-3 h-3 text-gray-500" />
          {!isCollapsed && (
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              Recent Activity
            </h3>
          )}
        </div>
        
        {history.length === 0 ? (
          !isCollapsed && (
            <div className="px-3 py-8 text-center text-gray-600 italic text-sm font-sans">
              No recent threads
            </div>
          )
        ) : (
          history.map((item) => (
            <div 
              key={item.sessionId}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                currentSessionId === item.sessionId 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-gray-800/50 text-gray-400 border border-transparent'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
              onClick={() => onSelectSession(item.sessionId)}
              id={`history-item-${item.sessionId}`}
              title={isCollapsed ? item.title : undefined}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === item.sessionId ? 'text-blue-400' : 'text-gray-600'}`} />
                {!isCollapsed && <span className="text-sm font-medium truncate font-sans">{item.title}</span>}
              </div>
              {!isCollapsed && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(item.sessionId);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all rounded shrink-0"
                  id={`delete-history-${item.sessionId}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className={`p-4 border-t border-gray-800 text-[10px] text-gray-600 font-mono flex flex-col gap-1 items-center overflow-hidden h-16 shrink-0`}>
        {!isCollapsed ? (
          <>
            <span className="truncate w-full text-center">SESSION: {currentSessionId.slice(0, 8)}...</span>
            <span className="truncate w-full text-center">BUILD VER: 1.0.42-STABLE</span>
          </>
        ) : (
          <span className="text-[8px] rotate-90 origin-center whitespace-nowrap mt-1">v1.0.42</span>
        )}
      </div>
    </motion.aside>
  );
}

