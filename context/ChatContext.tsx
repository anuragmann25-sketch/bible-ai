import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, ChatSession } from '../services/aiService';

const STORAGE_KEY = '@bible_ai_chats';

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  addMessage: (message: Message) => void;
  setSessionTitle: (title: string) => void;
  deleteChat: (id: string) => void;
  clearStorage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from storage on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Save sessions to storage whenever they change
  useEffect(() => {
    saveSessions();
  }, [sessions]);

  const loadSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
        // Select the most recent chat if available
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const saveSessions = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save chat sessions:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Only ONE active chat allowed - reuse existing empty chat or clear current
  const createNewChat = useCallback(() => {
    // Check if there's already an empty "New Chat" (no title, no messages)
    const existingEmptyChat = sessions.find((s) => !s.title && s.messages.length === 0);
    
    if (existingEmptyChat) {
      // Just select the existing empty chat
      setCurrentSessionId(existingEmptyChat.id);
      return;
    }

    // If current session exists and has no messages, just reuse it
    if (currentSession && currentSession.messages.length === 0 && !currentSession.title) {
      return;
    }

    // Create a new empty chat
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, [sessions, currentSession]);

  const selectChat = useCallback((id: string) => {
    setCurrentSessionId(id);
  }, []);

  const addMessage = useCallback((message: Message) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
  }, [currentSessionId]);

  const setSessionTitle = useCallback((title: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, title }
          : session
      )
    );
  }, [currentSessionId]);

  const deleteChat = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // If we deleted the current chat, select another one or create new
      if (id === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          // Create a fresh chat if none left
          const newSession: ChatSession = {
            id: Date.now().toString(),
            title: '',
            messages: [],
            createdAt: Date.now(),
          };
          setCurrentSessionId(newSession.id);
          return [newSession];
        }
      }
      return filtered;
    });
  }, [currentSessionId]);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentSession,
        createNewChat,
        selectChat,
        addMessage,
        setSessionTitle,
        deleteChat,
        clearStorage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
