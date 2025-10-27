export type MessageRole = 'user' | 'ai';

export interface FileChange {
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  path: string;
  description: string;
  content?: string; // Raw file content as a string
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  codeChanges?: FileChange[];
  version?: number;
  error?: string;
  isStreaming?: boolean;
  imageUrls?: string[];
  previousFileSystem?: FileSystem;
  isExpectingCodeChanges?: boolean;
}

export interface FileData {
  content: string; // For text files: raw text. For binary files: base64 data.
  type: string; // e.g., 'tsx', 'html', 'css', or a mime-type like 'image/png'
  isBinary?: boolean;
}

export interface FileSystem {
  [path: string]: FileData;
}

export interface Project {
  id: number;
  name: string;
  fileSystem: FileSystem;
  messages: Message[];
}

export type AiStatus = 'idle' | 'thinking' | 'streaming';

export type AppTheme = 'light' | 'dark' | 'system';

export type IntegrationType =
    | 'openai'
    | 'auth0'
    | 'stripe';

export type SettingsTab = 'account' | 'subscription' | 'memory';
