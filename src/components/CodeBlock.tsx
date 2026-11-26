import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  label?: string;
  copyable?: boolean;
}

export function CodeBlock({ code, label, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 rounded-xl border border-slate-200 overflow-hidden">
      {(label || copyable) && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {label ?? 'Formula'}
          </span>
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#1D4ED8]" />
                  <span className="text-[#1D4ED8]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre className="p-6 font-mono text-base sm:text-lg lg:text-xl leading-relaxed overflow-x-auto text-slate-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}
