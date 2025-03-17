import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function convertCode(
  sourceCode: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Convert the following ${sourceLanguage} code to ${targetLanguage}. 
Return only the converted code without any markdown formatting, explanations, or code block symbols:

${sourceCode}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let code = response.text();
  
  code = code.replace(/^```[\w]*\n?/, '');
  code = code.replace(/\n?```$/, '');     
  code = code.trim();
  
  return code;
}