
export type ProgrammingLanguage = 
  | 'auto'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'java'
  | 'rust'
  | 'python'
  | 'golang'
  | 'bash'
  | 'javascript'
  | 'typescript';

export interface CodeConversion {
  id?: string;
  user_id?: string;
  primary_language: ProgrammingLanguage;
  converted_to: ProgrammingLanguage;
  original_code: string;
  converted_code: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface User {
  id: string;
  user_name: string;
  email: string;
  phone_no?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
