'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = true,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="bg-white/5 border border-white/10 border-b-0 rounded-t-xl px-4 py-2 text-sm text-gray-400 font-mono">
          {title}
        </div>
      )}
      <div className={`relative ${title ? '' : 'rounded-xl'} ${title ? 'rounded-b-xl' : ''} overflow-hidden border border-white/10`}>
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 z-10 px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
          aria-label="Copy code"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            paddingTop: '3rem',
            background: 'rgba(0, 0, 0, 0.4)',
            fontSize: '0.875rem',
            borderRadius: title ? '0 0 0.75rem 0.75rem' : '0.75rem',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#6b7280',
            userSelect: 'none',
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
