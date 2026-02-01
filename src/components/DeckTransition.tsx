import { useEffect, useRef, useState } from 'react';
import { decks, DeckId } from '@/data/decks';

interface DeckTransitionProps {
  deckId: DeckId;
  onPreload: () => void;
  onComplete: () => void;
}

export function DeckTransition({ deckId, onPreload, onComplete }: DeckTransitionProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');
  const onPreloadRef = useRef(onPreload);
  const onCompleteRef = useRef(onComplete);
  
  // Keep refs updated without causing re-renders
  onPreloadRef.current = onPreload;
  onCompleteRef.current = onComplete;

  const deck = decks[deckId];

  useEffect(() => {
    // Reset phase for new deck
    setPhase('enter');
    
    const enterTimer = setTimeout(() => {
      setPhase('visible');
    }, 50);
    
    const preloadTimer = setTimeout(() => {
      onPreloadRef.current();
    }, 400);
    
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1200);
    
    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 1500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(preloadTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [deckId]); // Only re-run when deckId changes

  if (!deck) return null;

  const getOpacity = () => {
    switch (phase) {
      case 'enter': return 'opacity-0';
      case 'visible': return 'opacity-100';
      case 'exit': return 'opacity-0';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'enter': return 'scale-95';
      case 'visible': return 'scale-100';
      case 'exit': return 'scale-105';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-lg transition-opacity duration-300 ${getOpacity()}`}
    >
      <div className={`text-center transition-transform duration-300 ${getScale()}`}>
        <div className={`w-20 h-20 mx-auto rounded-3xl ${deck.colorClass} mb-5 shadow-2xl`} />
        <h2 className="text-2xl font-bold text-card-foreground mb-2 tracking-widest uppercase">
          {deck.name}
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {deck.desc}
        </p>
      </div>
    </div>
  );
}
