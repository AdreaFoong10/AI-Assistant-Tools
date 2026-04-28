export default function PromptBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Your Prompt</label>
      <textarea
        id="prompt-input"
        className="form-control w-full p-4 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[120px]"
        rows={4}
        placeholder="Enter your prompt here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}