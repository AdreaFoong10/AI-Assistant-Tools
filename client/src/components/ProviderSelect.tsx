function ProviderSelect({
  value,
  onChange,
  tool,
}: {
  value: string;
  onChange: (v: string) => void;
  tool: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={tool === "rag"}>
      <option value="gemini">Gemini</option>
      <option value="openrouter">OpenRouter</option>
    </select>
  );
}

export default ProviderSelect;
