function PromptBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      className="form-control w-51 text-center"
      rows={3}
      placeholder="Enter your prompt..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default PromptBox;