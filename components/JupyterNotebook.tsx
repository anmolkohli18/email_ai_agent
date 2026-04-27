'use client';

import { useEffect, useState } from 'react';

interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[];
  outputs?: any[];
}

interface JupyterNotebookProps {
  src: string;
}

export default function JupyterNotebook({ src }: JupyterNotebookProps) {
  const [notebook, setNotebook] = useState<{ cells: NotebookCell[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to load notebook');
        const data = await response.json();
        setNotebook(data);
      } catch (err) {
        setError('Failed to load notebook');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotebook();
  }, [src]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'notebook.ipynb';
    link.click();
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
  };

  if (loading) {
    return (
      <div className="my-8 p-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl">
        <div className="flex items-center justify-center gap-3 text-neutral-500">
          <div className="w-6 h-6 border-2 border-[#FFC700] border-t-transparent rounded-full animate-spin" />
          Loading notebook...
        </div>
      </div>
    );
  }

  if (error || !notebook) {
    return (
      <div className="my-8 p-8 bg-[#1A1A1A] border border-red-900/30 rounded-2xl">
        <p className="text-red-400">{error || 'Failed to load notebook'}</p>
      </div>
    );
  }

  return (
    <div className="my-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#232323] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-[#FFC700]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className="font-semibold text-white text-sm tracking-wide">
            JUPYTER NOTEBOOK
          </span>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-[#FFC700] transition-colors duration-200 rounded-lg hover:bg-[#1A1A1A]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          DOWNLOAD
        </button>
      </div>

      {/* Cells */}
      <div className="divide-y divide-[#2A2A2A]">
        {notebook.cells.map((cell, idx) => (
          <div key={idx} className="p-6">
            {cell.cell_type === 'markdown' ? (
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-neutral-300"
                  dangerouslySetInnerHTML={{
                    __html: cell.source.join(''),
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Code Input */}
                <div className="bg-[#232323] rounded-xl border border-[#2A2A2A] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#2A2A2A]">
                    <span className="text-xs font-semibold text-neutral-500 tracking-wider">
                      IN [{idx + 1}]
                    </span>
                    <button
                      onClick={() => copyCode(cell.source.join(''))}
                      className="text-xs text-neutral-500 hover:text-[#FFC700] transition-colors"
                    >
                      COPY
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-neutral-200 font-mono">
                      {cell.source.join('')}
                    </code>
                  </pre>
                </div>

                {/* Code Output */}
                {cell.outputs && cell.outputs.length > 0 && (
                  <div className="bg-[#0D0D0D] rounded-xl border border-[#2A2A2A] overflow-hidden">
                    <div className="px-4 py-2 bg-[#1A1A1A] border-b border-[#2A2A2A]">
                      <span className="text-xs font-semibold text-neutral-500 tracking-wider">
                        OUT [{idx + 1}]
                      </span>
                    </div>
                    <div className="p-4">
                      {cell.outputs.map((output, outIdx) => (
                        <div key={outIdx} className="text-sm">
                          {output.text && (
                            <pre className="text-neutral-300 font-mono whitespace-pre-wrap">
                              {Array.isArray(output.text)
                                ? output.text.join('')
                                : output.text}
                            </pre>
                          )}
                          {output.data?.['text/plain'] && (
                            <pre className="text-neutral-300 font-mono whitespace-pre-wrap">
                              {Array.isArray(output.data['text/plain'])
                                ? output.data['text/plain'].join('')
                                : output.data['text/plain']}
                            </pre>
                          )}
                          {output.data?.['image/png'] && (
                            <img
                              src={`data:image/png;base64,${output.data['image/png']}`}
                              alt="Output"
                              className="max-w-full h-auto rounded-lg border border-[#2A2A2A]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
