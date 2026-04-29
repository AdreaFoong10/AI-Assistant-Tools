import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Trash2, Save, Plus } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [apiKey, setApiKey] = useState('');
  const [keyName, setKeyName] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [savedKeys, setSavedKeys] = useState<ApiKeyEntry[]>([]);

  useEffect(() => {
    const keys = localStorage.getItem('api_keys');
    if (keys) {
      setSavedKeys(JSON.parse(keys));
    }
  }, []);

  const saveKey = () => {
    if (!apiKey.trim() || !keyName.trim()) return;
    
    const newEntry: ApiKeyEntry = {
      id: crypto.randomUUID(),
      name: keyName,
      key: apiKey.replace(/.(?=.{4})/g, '*'), // Mask the key for display
      provider: provider
    };

    const updatedKeys = [...savedKeys.filter(k => k.provider !== provider), newEntry];
    setSavedKeys(updatedKeys);
    localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    
    // In a real app, you'd store the actual key securely. 
    // Here we'll also store the actual key separately for "use" if needed, 
    // but the request specifically asks to display them in a table.
    localStorage.setItem(`key_${newEntry.id}`, apiKey);

    setApiKey('');
    setKeyName('');
  };

  const clearSpecificKey = (id: string) => {
    const updatedKeys = savedKeys.filter(k => k.id !== id);
    setSavedKeys(updatedKeys);
    localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    localStorage.removeItem(`key_${id}`);
  };

  const clearAllKeys = () => {
    savedKeys.forEach(k => localStorage.removeItem(`key_${k.id}`));
    setSavedKeys([]);
    localStorage.setItem('api_keys', JSON.stringify([]));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"            id="settings-popup"
          >
            <div className="p-6 border-bottom flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 font-sans">API Settings</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                id="close-settings-btn"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-sm font-medium text-gray-700 ml-1">Key Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. My Gemini Key"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-sm font-medium text-gray-700 ml-1">Provider</label>
                    <select 
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-sans"
                    >
                      <option value="gemini">Gemini</option>
                      <option value="openrouter">OpenRouter</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-sm font-medium text-gray-700 ml-1">API Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="Enter your API key here..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10 font-sans"
                      id="api-key-input"
                    />
                    <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 pt-2">
                  <button 
                    onClick={saveKey}
                    className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 font-sans font-medium"
                    id="save-key-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Save API Key
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 px-1 font-sans">Saved Keys</h3>
                </div>
                
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm font-sans" id="api-keys-table">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-100 uppercase text-[10px] tracking-widest font-bold">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Provider</th>
                        <th className="px-4 py-3">Key (Masked)</th>
                        <th className="px-4 py-3 text-right">
                          <button 
                            onClick={clearAllKeys}
                            className="bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors uppercase"
                            id="clear-all-keys-btn"
                          >
                            Clear All
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {savedKeys.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic font-sans">
                            No API keys saved yet
                          </td>
                        </tr>
                      ) : (
                        savedKeys.map((k) => (
                          <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{k.name}</td>
                            <td className="px-4 py-3 font-mono text-[10px] uppercase">
                                <span className={`px-2 py-0.5 rounded-full ${k.provider === 'gemini' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {k.provider}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500 break-all max-w-[200px]">{k.key}</td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => clearSpecificKey(k.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                id={`clear-key-${k.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only font-sans">Clear</span>
                                <span className="text-[10px] font-bold ml-1 uppercase">Clear</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ApiKeyEntry {
  id: string;
  name: string;
  key: string;
  provider: string;
}

