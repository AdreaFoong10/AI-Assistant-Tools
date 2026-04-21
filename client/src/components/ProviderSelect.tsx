function ProviderSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="gemini">Gemini</option>
      <option value="openrouter">OpenRouter</option>
    </select>
  );
}

export default ProviderSelect;
