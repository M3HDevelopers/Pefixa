import { useEffect, useState } from 'react';

type CursorState = 'default' | 'pointer' | 'text' | 'move' | 'zoom-in' | 'zoom-out' | 'not-allowed' | 'loading' | 'crosshair';

export function useCustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default');

  useEffect(() => {
    // Remove cursor-none class when component unmounts
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  const setCursor = (state: CursorState) => {
    setCursorState(state);
  };

  const resetCursor = () => {
    setCursorState('default');
  };

  return {
    cursorState,
    setCursor,
    resetCursor,
  };
}

// Cursor utility classes
export const cursorClasses = {
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  text: 'cursor-text',
  move: 'cursor-move',
  'zoom-in': 'cursor-zoom-in',
  'zoom-out': 'cursor-zoom-out',
  'not-allowed': 'cursor-not-allowed',
  loading: 'cursor-wait',
  crosshair: 'cursor-crosshair',
};
