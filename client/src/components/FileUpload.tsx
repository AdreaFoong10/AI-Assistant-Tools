function FileUpload({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  return (
    <input
      type="file"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
    />
  );
}

export default FileUpload;