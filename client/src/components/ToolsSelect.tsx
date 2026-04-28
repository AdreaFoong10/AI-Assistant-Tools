export default function ToolSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const tools = [
    { value: "Q/A", label: "Q/A" },
    { value: "resume", label: "Resume Enhancer" },
    { value: "email", label: "Email Generator" },
    { value: "blog", label: "Blog Title Generator" },
    { value: "study", label: "Study Notes" },
    { value: "malaysian-gibberish", label: "Malaysian Gibberish" },
    { value: "rag", label: "Document Q&A (RAG)" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Tool Type</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
        id="tool-select"
      >
        {tools.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}
