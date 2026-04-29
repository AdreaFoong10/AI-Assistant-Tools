export default function ProviderSelect({
  value,
  onChange,
  tool,
}: {
  value: string;
  onChange: (v: string) => void;
  tool: string;
}) {
  const isRag = tool === "rag";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">AI Provider</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        disabled={isRag}
        className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${isRag ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        id="provider-select"
      >
        <option value="gemini">Gemini</option>
        <option value="openrouter">OpenRouter</option>
      </select>
    </div>
  );
}
