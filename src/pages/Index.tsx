import { useState, useCallback, useEffect } from 'react';
import { ChevronRight, Copy, ArrowLeft, ArrowRight, Check, Code } from 'lucide-react';
import { ProgrammingLanguage } from '@/types';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES, detectLanguage, getLanguageLabel } from '@/lib/languageUtils';
import LanguageSelector from '@/components/LanguageSelector';
import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/UserNav';
import { useAuth } from '@/context/AuthContext';
import { convertCode } from '@/lib/geminiUtils';

const Index = () => {
  const { user } = useAuth();
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<ProgrammingLanguage>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<ProgrammingLanguage>('auto');
  const [targetLanguage, setTargetLanguage] = useState<ProgrammingLanguage>('python');
  const [isConverting, setIsConverting] = useState(false);
  
  // Detect source language when source code changes
  useEffect(() => {
    if (sourceCode && sourceLanguage === 'auto') {
      const detected = detectLanguage(sourceCode);
      if (detected !== 'auto') {
        setDetectedLanguage(detected);
        
        // If target language is the same as detected, suggest a different one
        if (detected === targetLanguage) {
          const alternative = TARGET_LANGUAGES.find(lang => lang.value !== detected)?.value || 'python';
          setTargetLanguage(alternative);
        }
      }
    }
  }, [sourceCode, sourceLanguage, targetLanguage]);
  
  const handleConvert = useCallback(async () => {
    // Validation
    if (!sourceCode.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }
    
    const effectiveSourceLanguage = sourceLanguage === 'auto' ? detectedLanguage : sourceLanguage;
    
    if (effectiveSourceLanguage === 'auto') {
      toast.error('Could not detect the language. Please select the source language manually.');
      return;
    }
    
    if (effectiveSourceLanguage === targetLanguage) {
      toast.error('Source and target languages must be different');
      return;
    }
    
    setIsConverting(true);
    
    // In a real app, we would call an API here, for now we'll simulate it
    try {
      const result = await convertCode(
        sourceCode,
        getLanguageLabel(effectiveSourceLanguage),
        getLanguageLabel(targetLanguage)
      );
      
      setConvertedCode(result);
      toast.success(`Successfully converted to ${getLanguageLabel(targetLanguage)}`);
      
      // In a real app, we would also save this to Supabase here if user is logged in
      if (user) {
        console.log('Would save conversion to Supabase for user:', user.id);
      }
      
    } catch (error) {
      console.error('Error during conversion:', error);
      toast.error('Failed to convert the code. Please try again.');
    } finally {
      setIsConverting(false);
    }
  }, [sourceCode, sourceLanguage, targetLanguage, detectedLanguage, user]);
  
  const swapLanguages = useCallback(() => {
    if (detectedLanguage !== 'auto' && convertedCode) {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(detectedLanguage);
      setSourceCode(convertedCode);
      setConvertedCode('');
    }
  }, [detectedLanguage, targetLanguage, convertedCode]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="w-full py-6 px-6 md:px-8 border-b border-border/40 bg-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Code Converter</h1>
            </div>
            <UserNav />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Transform your code between multiple programming languages</p>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-6 md:px-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Source Code</h2>
                <LanguageSelector
                  languages={SUPPORTED_LANGUAGES}
                  selectedLanguage={sourceLanguage}
                  onLanguageChange={setSourceLanguage}
                  className="w-40"
                  placeholder="Source language"
                />
              </div>
              
              <CodeEditor
                code={sourceCode}
                language={sourceLanguage}
                onChange={setSourceCode}
                className="min-h-[400px]"
                title="Input"
              />
            </div>
            
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Converted Code</h2>
                <LanguageSelector
                  languages={TARGET_LANGUAGES}
                  selectedLanguage={targetLanguage}
                  onLanguageChange={setTargetLanguage}
                  className="w-40"
                  placeholder="Target language"
                />
              </div>
              
              <CodeEditor
                code={convertedCode}
                language={targetLanguage}
                readOnly
                isProcessing={isConverting}
                className="min-h-[400px]"
                title="Output"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="outline"
              className={cn(
                "bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30",
                "backdrop-blur-md transition-all duration-300"
              )}
              onClick={swapLanguages}
              disabled={!convertedCode || isConverting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Swap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleConvert}
              disabled={!sourceCode || isConverting}
              className={cn(
                "bg-primary/90 hover:bg-primary backdrop-blur-md transition-all duration-300",
                "shadow-md hover:shadow-lg"
              )}
            >
              {isConverting ? (
                <>Converting<span className="animate-pulse">...</span></>
              ) : (
                <>
                  Convert
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          <Separator className="my-12 opacity-30" />
          
          <div className="text-center space-y-3 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-medium">Supported Languages</h2>
            <p className="text-sm text-muted-foreground">Our code converter supports conversion between these programming languages:</p>
            
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {TARGET_LANGUAGES.map((lang) => (
                <div
                  key={lang.value}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium"
                >
                  {lang.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 px-6 md:px-8 border-t border-border/40 bg-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Code Converter — Transform your code between programming languages instantly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
