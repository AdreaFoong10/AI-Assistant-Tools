import { Upload, X, FileText } from 'lucide-react';
import React from 'react';

export default function FileUpload({
  onChange,
  file,
}: {
  onChange: (file: File | null) => void;
  file: File | null;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const clearFile = () => onChange(null);

  return (
    <div className="w-full">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Attachment</label>
      {!file ? (
        <label 
          id="file-upload-label"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
            <p className="text-sm text-gray-500 group-hover:text-blue-600">Click or drag to upload</p>
          </div>
          <input 
            id="file-upload-input" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
              <p className="text-xs text-blue-600">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button 
            id="clear-file-btn"
            onClick={clearFile}
            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
