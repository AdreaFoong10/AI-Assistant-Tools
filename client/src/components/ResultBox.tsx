import Markdown from 'react-markdown';

export default function ResultBox({ result }: { result: any }) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Generated Result</label>
      <div 
        id="result-container"
        className="w-full p-6 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 break-words prose prose-blue max-w-none"
      >
        {typeof result === 'string' ? (
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
        ) : (
          result
        )}
      </div>
    </div>
  );
}
