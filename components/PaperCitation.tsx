'use client';

import { useEffect, useState } from 'react';

interface PaperCitationProps {
  doi?: string;
  arxiv?: string;
  title?: string;
  authors?: string;
  year?: string;
  venue?: string;
  url?: string;
}

interface PaperMetadata {
  title: string;
  authors: string;
  year: string;
  venue: string;
  url: string;
}

export default function PaperCitation({
  doi,
  arxiv,
  title,
  authors,
  year,
  venue,
  url,
}: PaperCitationProps) {
  const [metadata, setMetadata] = useState<PaperMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (title && authors && year) {
      setMetadata({
        title: title,
        authors: authors,
        year: year,
        venue: venue || '',
        url: url || '',
      });
      return;
    }

    if (!doi && !arxiv) return;

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        if (doi) {
          const response = await fetch(`https://api.crossref.org/works/${doi}`);
          if (!response.ok) throw new Error('Failed to fetch DOI metadata');
          
          const data = await response.json();
          const paper = data.message;
          
          setMetadata({
            title: paper.title?.[0] || 'Untitled',
            authors:
              paper.author
                ?.map((a: any) => `${a.given} ${a.family}`)
                .join(', ') || 'Unknown authors',
            year: paper.published?.['date-parts']?.[0]?.[0]?.toString() || '',
            venue: paper['container-title']?.[0] || '',
            url: paper.URL || `https://doi.org/${doi}`,
          });
        } else if (arxiv) {
          const response = await fetch(
            `https://export.arxiv.org/api/query?id_list=${arxiv}`
          );
          if (!response.ok) throw new Error('Failed to fetch arXiv metadata');
          
          const text = await response.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'text/xml');
          const entry = xml.querySelector('entry');
          
          if (!entry) throw new Error('Paper not found');
          
          setMetadata({
            title: entry.querySelector('title')?.textContent?.trim() || 'Untitled',
            authors:
              Array.from(entry.querySelectorAll('author name'))
                .map((a) => a.textContent)
                .join(', ') || 'Unknown authors',
            year:
              entry
                .querySelector('published')
                ?.textContent?.substring(0, 4) || '',
            venue: 'arXiv preprint',
            url: `https://arxiv.org/abs/${arxiv}`,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch paper metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [doi, arxiv, title, authors, year, venue, url]);

  if (loading) {
    return (
      <div className="my-6 p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl">
        <div className="flex items-center gap-3 text-neutral-500">
          <div className="w-5 h-5 border-2 border-[#FFC700] border-t-transparent rounded-full animate-spin" />
          Loading citation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6 p-6 bg-[#1A1A1A] border border-red-900/30 rounded-2xl">
        <p className="text-red-400 text-sm">Failed to load citation: {error}</p>
        {(doi || arxiv) && (
          <a
            href={doi ? `https://doi.org/${doi}` : `https://arxiv.org/abs/${arxiv}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFC700] hover:text-[#FFD700] text-sm mt-2 inline-block"
          >
            View paper →
          </a>
        )}
      </div>
    );
  }

  if (!metadata) return null;

  return (
    <div className="my-6 p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#FFC700]/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-[#232323] rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#FFC700]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-2 leading-snug">
            {metadata.title}
          </h4>
          <p className="text-sm text-neutral-400 mb-1">{metadata.authors}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            {metadata.year && <span>{metadata.year}</span>}
            {metadata.venue && (
              <>
                <span>•</span>
                <span>{metadata.venue}</span>
              </>
            )}
            {(doi || arxiv) && (
              <>
                <span>•</span>
                <span className="font-mono text-[#FFC700]">
                  {doi ? `DOI: ${doi}` : `arXiv: ${arxiv}`}
                </span>
              </>
            )}
          </div>
          {metadata.url && (
            <a
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#FFC700] hover:text-[#FFD700] mt-3 font-medium transition-colors"
            >
              Read paper
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
