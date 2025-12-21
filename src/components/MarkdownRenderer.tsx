import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`prose prose-neutral max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // 自定义标题样式
          h1: ({ children }) => (
            <h1 className="text-h1 font-bold text-primary-900 mb-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-h2 font-semibold text-primary-900 mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-h3 font-semibold text-primary-900 mb-3 mt-6">
              {children}
            </h3>
          ),
          // 自定义段落样式
          p: ({ children }) => (
            <p className="text-body text-neutral-700 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          // 自定义列表样式
          ul: ({ children }) => (
            <ul className="mb-4 list-disc list-outside pl-6 space-y-2 text-body text-neutral-700 [&_ul]:mt-2 [&_ul]:mb-0 [&_ul]:pl-6 [&_ul]:list-[circle] [&_ul_ul]:list-[square] [&_ol]:mt-2 [&_ol]:mb-0 [&_ol]:pl-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal list-outside pl-6 space-y-2 text-body text-neutral-700 [&_ol]:mt-2 [&_ol]:mb-0 [&_ol]:pl-6 [&_ul]:mt-2 [&_ul]:mb-0 [&_ul]:pl-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-body text-neutral-700">
              {children}
            </li>
          ),
          // 自定义代码样式
          code: ({ children }) => (
            <code className="bg-neutral-100 text-primary-600 px-2 py-1 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          // 自定义链接样式
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary-600 hover:text-primary-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // 自定义引用样式
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-600 mb-4">
              {children}
            </blockquote>
          ),
          // 自定义表格样式
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-neutral-200 rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-neutral-50 border border-neutral-200 px-4 py-2 text-left text-body font-semibold text-primary-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-neutral-200 px-4 py-2 text-body text-neutral-700">
              {children}
            </td>
          ),
          // 自定义强调样式
          strong: ({ children }) => (
            <strong className="font-semibold text-primary-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary-700">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
