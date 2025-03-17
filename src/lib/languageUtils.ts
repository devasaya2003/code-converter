
import { ProgrammingLanguage } from '@/types';

export const SUPPORTED_LANGUAGES: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'python', label: 'Python' },
  { value: 'golang', label: 'Go' },
  { value: 'bash', label: 'Bash' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
];

export const TARGET_LANGUAGES = SUPPORTED_LANGUAGES.filter(lang => lang.value !== 'auto');

export function getLanguageLabel(language: ProgrammingLanguage): string {
  return SUPPORTED_LANGUAGES.find(lang => lang.value === language)?.label || 'Unknown';
}

// Simple language detection based on syntax patterns
export function detectLanguage(code: string): ProgrammingLanguage {
  if (!code.trim()) return 'auto';
  
  const codeNormalized = code.toLowerCase();
  
  // C++ detection
  if (codeNormalized.includes('#include <iostream>') || 
      codeNormalized.includes('std::') ||
      codeNormalized.includes('cout <<')) {
    return 'cpp';
  }
  
  // Java detection
  if (codeNormalized.includes('public class') || 
      codeNormalized.includes('public static void main(string[] args)') ||
      codeNormalized.includes('system.out.println')) {
    return 'java';
  }
  
  // C# detection
  if (codeNormalized.includes('using system;') ||
      codeNormalized.includes('namespace') && codeNormalized.includes('class') ||
      codeNormalized.includes('console.writeline')) {
    return 'csharp';
  }
  
  // C detection (after C++ and C# to avoid false positives)
  if (codeNormalized.includes('#include <stdio.h>') ||
      codeNormalized.includes('printf(') ||
      codeNormalized.includes('int main(')) {
    return 'c';
  }
  
  // Rust detection
  if (codeNormalized.includes('fn main()') ||
      codeNormalized.includes('let mut') ||
      codeNormalized.includes('println!')) {
    return 'rust';
  }
  
  // Python detection
  if (codeNormalized.includes('def ') ||
      codeNormalized.includes('import ') && !codeNormalized.includes(';') ||
      codeNormalized.includes('print(')) {
    return 'python';
  }
  
  // Go detection
  if (codeNormalized.includes('package main') ||
      codeNormalized.includes('func main()') ||
      codeNormalized.includes('fmt.')) {
    return 'golang';
  }
  
  // Bash detection
  if (codeNormalized.includes('#!/bin/bash') ||
      codeNormalized.includes('echo ') && !codeNormalized.includes(';') ||
      codeNormalized.startsWith('#!') && codeNormalized.includes('sh')) {
    return 'bash';
  }
  
  // TypeScript detection (check before JavaScript)
  if (codeNormalized.includes(': string') ||
      codeNormalized.includes(': number') ||
      codeNormalized.includes('interface ') ||
      codeNormalized.includes('<t>')) {
    return 'typescript';
  }
  
  // JavaScript detection
  if (codeNormalized.includes('function ') ||
      codeNormalized.includes('const ') ||
      codeNormalized.includes('let ') ||
      codeNormalized.includes('console.log')) {
    return 'javascript';
  }
  
  // If no match found
  return 'auto';
}
