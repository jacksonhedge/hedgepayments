'use client';

import { useState, useCallback, useRef } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

function highlightSyntax(code: string, language: string): string {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings (double and single quoted)
  highlighted = highlighted.replace(
    /(&quot;|"|')((?:(?!\1).)*?)\1/g,
    '<span class="text-[#98C379]">$1$2$1</span>'
  );

  // Template literals / backtick strings
  highlighted = highlighted.replace(
    /`([^`]*?)`/g,
    '<span class="text-[#98C379]">`$1`</span>'
  );

  // Comments (// and #)
  highlighted = highlighted.replace(
    /(\/\/.*?$|#.*?$)/gm,
    '<span class="text-[#5C6370] italic">$1</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-[#D19A66]">$1</span>'
  );

  // URLs
  highlighted = highlighted.replace(
    /(https?:\/\/[^\s<"']+)/g,
    '<span class="text-[#61AFEF]">$1</span>'
  );

  if (language === 'bash' || language === 'shell' || language === 'sh') {
    // Bash commands
    highlighted = highlighted.replace(
      /\b(curl|wget|npm|npx|yarn|pnpm|git|cd|mkdir|echo|export|source|sudo|chmod|docker)\b/g,
      '<span class="text-[#C678DD]">$1</span>'
    );
    // Flags
    highlighted = highlighted.replace(
      /(\s)(-{1,2}[\w-]+)/g,
      '$1<span class="text-[#56B6C2]">$2</span>'
    );
  } else if (language === 'json') {
    // JSON keys
    highlighted = highlighted.replace(
      /(<span class="text-\[#98C379\]">(?:"|&quot;)(.*?)(?:"|&quot;)<\/span>)\s*:/g,
      '<span class="text-[#E06C75]">"$2"</span>:'
    );
  } else if (language === 'javascript' || language === 'typescript' || language === 'js' || language === 'ts' || language === 'jsx' || language === 'tsx') {
    // Keywords
    highlighted = highlighted.replace(
      /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|async|await|new|class|extends|try|catch|throw|typeof|instanceof)\b/g,
      '<span class="text-[#C678DD]">$1</span>'
    );
    // Built-in objects/methods
    highlighted = highlighted.replace(
      /\b(console|Promise|Array|Object|JSON|Math|Date|Error|Response|Request|fetch)\b/g,
      '<span class="text-[#E5C07B]">$1</span>'
    );
    // Booleans/null/undefined
    highlighted = highlighted.replace(
      /\b(true|false|null|undefined|NaN|Infinity)\b/g,
      '<span class="text-[#D19A66]">$1</span>'
    );
  } else if (language === 'python' || language === 'py') {
    highlighted = highlighted.replace(
      /\b(def|class|import|from|return|if|elif|else|for|while|try|except|with|as|in|not|and|or|is|None|True|False|self|print|raise|pass|break|continue|lambda|yield)\b/g,
      '<span class="text-[#C678DD]">$1</span>'
    );
  }

  return highlighted;
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const highlighted = highlightSyntax(code, language);

  return (
    <div
      className="rounded-lg border border-[#2a2a4a] overflow-hidden my-4 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={title ? `Code: ${title}` : `${language} code block`}
    >
      {title && (
        <div className="bg-[#12122a] px-4 py-2.5 border-b border-[#2a2a4a] flex items-center justify-between">
          <span className="text-[#8B8BA3] text-xs font-medium tracking-wide uppercase font-mono">
            {title}
          </span>
          <span className="text-[#5A5A7A] text-[10px] font-mono bg-[#1a1a3a] px-2 py-0.5 rounded-full">
            {language}
          </span>
        </div>
      )}
      <div className="relative bg-[#1a1a2e]">
        {!title && (
          <span className="absolute top-2.5 right-12 text-[#5A5A7A] text-[10px] font-mono bg-[#12122a] px-2 py-0.5 rounded-full border border-[#2a2a4a]">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 ${
            copied
              ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
              : 'bg-[#12122a] text-[#5A5A7A] hover:text-[#8B8BA3] border border-[#2a2a4a] hover:border-[#3a3a5a]'
          } ${isHovered || copied ? 'opacity-100' : 'opacity-0 focus:opacity-100'}`}
          aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
          aria-live="polite"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code
            className="font-mono text-[#ABB2BF]"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}
