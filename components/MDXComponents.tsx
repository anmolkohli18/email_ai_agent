import CodeBlock from './CodeBlock';
import ThreeDViewer from './ThreeDViewer';
import YouTubeEmbed from './YouTubeEmbed';
import PaperCitation from './PaperCitation';
import JupyterNotebook from './JupyterNotebook';

const MDXComponents = {
  // Code blocks
  code: ({ className, children, ...props }: any) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-[#232323] text-[#FFC700] px-2 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    // Extract language from className (e.g., "language-javascript" -> "javascript")
    const language = className?.replace(/language-/, '') || 'text';
    return <CodeBlock language={language}>{String(children).trim()}</CodeBlock>;
  },
  
  // Custom components
  CodeBlock,
  ThreeDViewer,
  YouTubeEmbed,
  PaperCitation,
  JupyterNotebook,
  Citation: PaperCitation,
  
  // Enhanced HTML elements - Dark theme
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 mt-12" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: any) => (
    <h2 id={id} className="text-3xl md:text-4xl font-bold text-white mb-6 mt-10 scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: any) => (
    <h3 id={id} className="text-2xl md:text-3xl font-semibold text-white mb-4 mt-8 scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-xl font-semibold text-white mb-3 mt-6" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-lg leading-relaxed text-neutral-400 mb-6" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      className="text-[#FFC700] hover:text-[#FFD700] underline transition-colors duration-300"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-neutral-400" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-neutral-400" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-4 border-[#FFC700] pl-6 py-4 my-8 bg-[#1A1A1A] italic text-neutral-300 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full divide-y divide-[#2A2A2A] border border-[#2A2A2A] rounded-2xl" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-[#232323]" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody className="divide-y divide-[#2A2A2A] bg-[#1A1A1A]" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-4 text-left text-sm font-semibold text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 text-sm text-neutral-400" {...props}>
      {children}
    </td>
  ),
  hr: () => <hr className="my-12 border-[#2A2A2A]" />,
  img: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} className="rounded-2xl my-8 max-w-full border border-[#2A2A2A]" {...props} />
  ),
};

export default MDXComponents;
