
import React from 'react';
import { 
  Code, FileCode, Terminal, FileJson, 
  GripVertical, Hash, Braces, MoveHorizontal, 
  Binary, MessageSquareCode, Brackets
} from 'lucide-react';
import { ProgrammingLanguage } from '@/types';

interface LanguageIconProps {
  language: ProgrammingLanguage;
  size?: number;
  className?: string;
}

const LanguageIcon = ({ language, size = 16, className = '' }: LanguageIconProps) => {
  const getIcon = () => {
    switch (language) {
      case 'c':
        return <Code className={className} size={size} />;
      case 'cpp':
        return <Brackets className={className} size={size} />;
      case 'csharp':
        return <Hash className={className} size={size} />;
      case 'java':
        return <FileCode className={className} size={size} />;
      case 'rust':
        return <GripVertical className={className} size={size} />;
      case 'python':
        return <MessageSquareCode className={className} size={size} />;
      case 'golang':
        return <MoveHorizontal className={className} size={size} />;
      case 'bash':
        return <Terminal className={className} size={size} />;
      case 'javascript':
        return <Braces className={className} size={size} />;
      case 'typescript':
        return <FileJson className={className} size={size} />;
      case 'auto':
      default:
        return <Binary className={className} size={size} />;
    }
  };

  return getIcon();
};

export default LanguageIcon;
