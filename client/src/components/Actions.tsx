function Actions({
  onGenerate,
  onHistory,
  onClear,
}: {
  onGenerate: () => void;
  onHistory: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <button onClick={onGenerate}>Generate</button>
      <button onClick={onHistory}>See History</button>
      <button onClick={onClear}>Clear History</button>
    </div>
  );
}

export default Actions;