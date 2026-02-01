import { useState, useEffect, useRef, memo } from 'react';
import { ArrowLeft, RefreshCw, RotateCcw, SkipForward, Heart, Flag } from 'lucide-react';
import { FlipCard } from './FlipCard';
import { DeckId } from '@/data/decks';

interface CardData {
  id: string;
  q: string;
  followUp: string;
  category: string;
  colorClass: string;
  textGradientClass: string;
  deckId: DeckId | string;
  questionIndex?: number;
}

interface CardDisplayProps {
  card: CardData | null;
  isFlipped: boolean;
  onFlip: () => void;
  onDrawNext: () => void;
  onBack: () => void;
  onEndSession?: () => void;
  availableCount: number;
  totalCount: number;
  onResetDeck: () => void;
  onSkipCard?: () => void;
  isJourneyMode?: boolean;
  isShuffleMode?: boolean;
  journeyProgress?: { current: number; total: number; deckIndex: number };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const CardDisplay = memo(function CardDisplay({ 
  card, 
  isFlipped, 
  onFlip, 
  onDrawNext, 
  onBack,
  onEndSession, 
  availableCount, 
  totalCount, 
  onResetDeck,
  onSkipCard,
  isJourneyMode = false,
  isShuffleMode = false,
  journeyProgress,
  isFavorite = false,
  onToggleFavorite
}: CardDisplayProps) {
  const isEmpty = availableCount === 0;
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCard, setDisplayCard] = useState(card);
  const isFirstRender = useRef(true);
  const animationRef = useRef<{ timeout1?: number; timeout2?: number }>({});

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayCard(card);
      return;
    }

    if (card && card.q !== displayCard?.q) {
      setIsAnimating(true);
      
      // Clear any existing timeouts
      if (animationRef.current.timeout1) clearTimeout(animationRef.current.timeout1);
      if (animationRef.current.timeout2) clearTimeout(animationRef.current.timeout2);
      
      // Wait for fade out, then swap card and fade in
      animationRef.current.timeout1 = window.setTimeout(() => {
        setDisplayCard(card);
        animationRef.current.timeout2 = window.setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 200);
    }
    
    return () => {
      if (animationRef.current.timeout1) clearTimeout(animationRef.current.timeout1);
      if (animationRef.current.timeout2) clearTimeout(animationRef.current.timeout2);
    };
  }, [card?.q]);

  const handleTransitionEnd = () => {
    if (isAnimating && displayCard === card) {
      setIsAnimating(false);
    }
  };

  const getBackLabel = () => {
    if (isJourneyMode) return 'End Journey';
    if (isShuffleMode) return 'Back';
    return 'Back to Decks';
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      <div className="w-full flex justify-between items-center mb-3">
        <button 
          onClick={onBack} 
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" /> {getBackLabel()}
        </button>
        
        <div className="flex items-center gap-3">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          
          {isJourneyMode && journeyProgress ? (
            <span className="text-xs font-mono text-muted-foreground">
              Card {journeyProgress.current}/{journeyProgress.total}
            </span>
          ) : isShuffleMode ? (
            <span className="text-xs font-mono text-muted-foreground">
              Shuffle Mode
            </span>
          ) : (
            <>
              <span className={`text-xs font-mono ${isEmpty ? 'text-destructive' : 'text-muted-foreground'}`}>
                {availableCount}/{totalCount} left
              </span>
              {isEmpty && (
                <button
                  onClick={onResetDeck}
                  className="p-1.5 bg-secondary hover:bg-muted rounded-lg transition-colors"
                  title="Reset deck"
                >
                  <RotateCcw className="w-3 h-3 text-primary" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div 
        className={`w-full transition-all duration-200 ease-out ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <FlipCard card={displayCard} isFlipped={isFlipped} onFlip={onFlip} />
      </div>

      <div className="flex flex-col gap-3 mt-6 w-full">
        <div className="flex gap-2">
          {onSkipCard && (
            <button 
              onClick={onSkipCard}
              className="py-3 px-4 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-sm transition-all flex items-center justify-center gap-2"
              title="Skip this card (won't count as used)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onDrawNext}
            disabled={isEmpty && !isJourneyMode && !isShuffleMode}
            className={`flex-1 py-3 rounded-xl font-bold tracking-widest text-sm shadow-lg transition-all flex items-center justify-center gap-3 ${
              isEmpty && !isJourneyMode && !isShuffleMode
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'deck-gradient-reset text-primary-foreground hover:shadow-primary/40'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> 
            {isJourneyMode ? 'NEXT CARD' : 'DRAW NEXT CARD'}
          </button>
        </div>

        {/* End Session button for shuffle mode */}
        {isShuffleMode && onEndSession && (
          <button 
            onClick={onEndSession}
            className="w-full py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-2"
          >
            <Flag className="w-3 h-3" /> END SESSION
          </button>
        )}
      </div>
    </div>
  );
});
