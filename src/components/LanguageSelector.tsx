
import { useCallback } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProgrammingLanguage } from '@/types';
import { getLanguageLabel } from '@/lib/languageUtils';
import LanguageIcon from './LanguageIcon';

interface LanguageSelectorProps {
  languages: { value: ProgrammingLanguage; label: string }[];
  selectedLanguage: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  disabled = false,
  className = '',
  placeholder = 'Select language',
}: LanguageSelectorProps) => {
  const handleValueChange = useCallback((value: string) => {
    onLanguageChange(value as ProgrammingLanguage);
  }, [onLanguageChange]);

  return (
    <Select
      disabled={disabled}
      value={selectedLanguage}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={`w-full bg-secondary/50 hover:bg-secondary/70 backdrop-blur-md border-editor-border transition-all ${className}`}>
        <SelectValue placeholder={placeholder}>
          {selectedLanguage !== 'auto' ? (
            <div className="flex items-center gap-2">
              <LanguageIcon language={selectedLanguage} className="text-primary" />
              <span>{getLanguageLabel(selectedLanguage)}</span>
            </div>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover/95 backdrop-blur-lg border border-editor-border">
        {languages.map((language) => (
          <SelectItem 
            key={language.value} 
            value={language.value}
            className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LanguageIcon language={language.value} className="text-primary" />
              <span>{language.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
