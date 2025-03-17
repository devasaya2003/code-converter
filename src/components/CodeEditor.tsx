
import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ProgrammingLanguage } from '@/types';
import { detectLanguage } from '@/lib/languageUtils';
import ConversionAnimation from './ConversionAnimation';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  language?: ProgrammingLanguage;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  isProcessing?: boolean;
  className?: string;
  title?: string;
  showCopy?: boolean;
}

const CodeEditor = ({
  code,
  language,
  onChange,
  readOnly = false,
  isProcessing = false,
  className = '',
  title,
  showCopy = true
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<ProgrammingLanguage>('auto');
  const [lineCount, setLineCount] = useState(1);
  
  useEffect(() => {
    if (language === 'auto' && code) {
      const detected = detectLanguage(code);
      setDetectedLanguage(detected);
    } else if (language && language !== 'auto') {
      setDetectedLanguage(language);
    }
  }, [code, language]);
  
  useEffect(() => {
    // Update line count when code changes
    const lines = code.split('\n').length;
    setLineCount(lines || 1);
  }, [code]);
  
  const handleCopy = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Generate line numbers
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
  
  return (
    <div className={cn(
      "rounded-xl border border-editor-border bg-white/10 backdrop-blur-md relative",
      "shadow-glass-lg hover:shadow-glass transition-all duration-300 overflow-hidden",
      className
    )}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-editor-border">
          <div className="font-medium text-sm">
            {title}
            {detectedLanguage !== 'auto' && language === 'auto' && (
              <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                Detected: {detectedLanguage}
              </span>
            )}
          </div>
          {showCopy && code && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-primary/10 transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-primary" />
              )}
            </button>
          )}
        </div>
      )}
      
      <div className="relative">
        <ConversionAnimation isActive={isProcessing} />
        
        <div className="flex">
          {/* Line numbers */}
          <div className="code-line-numbers select-none px-2 py-4 text-right text-muted-foreground/50 border-r border-editor-border bg-editor-bg/50">
            {lineNumbers}
          </div>
          
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              "code-editor",
              "scrollbar-thin scrollbar-thumb-editor-border scrollbar-track-transparent",
              "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40",
              "pl-3 py-4 w-full",
              {"opacity-70": isProcessing}
            )}
            placeholder={readOnly ? "Converted code will appear here..." : "Enter your code here..."}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
