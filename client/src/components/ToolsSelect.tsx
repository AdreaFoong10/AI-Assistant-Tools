function ToolSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="Q/A">Q/A</option>
      <option value="resume">Resume Enhancer</option>
      <option value="email">Email Generator</option>
      <option value="blog">Blog Title Generator</option>
      <option value="study">Study Notes</option>
      <option value="malaysian-gibberish">Malaysian Gibberish</option>
      <option value="rag">Document Q&A (RAG)</option>
    </select>
  );
}

export default ToolSelect;