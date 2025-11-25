export interface NoteImage {
  id: string;
  data: string; // Base64 string
  name: string;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  images: NoteImage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  isTyping?: boolean;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}