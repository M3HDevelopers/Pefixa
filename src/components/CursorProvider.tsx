import React, { createContext, useContext, useState, ReactNode } from 'react';

type CursorState = 'default' | 'pointer' | 'text' | 'move' | 'zoom-in' | 'zoom-out' | 'not-allowed' | 'loading' | 'crosshair';

interface CursorContextType {
  cursorState: CursorState;
  setCursor: (state: CursorState) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('default');

  const setCursor = (state: CursorState) => {
    setCursorState(state);
  };

  const resetCursor = () => {
    setCursorState('default');
  };

  return (
    <CursorContext.Provider value={{ cursorState, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
