import { memo, useState } from 'react';
import { Sparkles, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { decks, DeckId } from '@/data/decks';

interface PlayedQuestion {
  q: string;
  followUp: string;
  deckId: string;
}

interface DeckStats {
  [deckId: string]: number;
}

interface GameCompleteProps {
  isJourneyMode: boolean;
  isShuffleMode?: boolean;
  playedQuestions: PlayedQuestion[];
  deckStats: DeckStats;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameComplete = memo(function GameComplete({ 
  isJourneyMode,
  isShuffleMode = false,
  playedQuestions, 
  deckStats, 
  onPlayAgain, 
  onGoHome 
}: GameCompleteProps) {
  const [expandedDecks, setExpandedDecks] = useState<string[]>([]);

  const toggleDeck = (deckId: string) => {
    setExpandedDecks(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId)
        : [...prev, deckId]
    );
  };

  const totalQuestions = Object.values(deckStats).reduce((sum, count) => sum + count, 0);
  const hasExpandedDecks = expandedDecks.length > 0;

  // Group questions by deck
  const questionsByDeck = playedQuestions.reduce((acc, q) => {
    if (!acc[q.deckId]) acc[q.deckId] = [];
    acc[q.deckId].push(q);
    return acc;
  }, {} as { [deckId: string]: PlayedQuestion[] });

  const getDeckInfo = (deckId: string) => {
    return decks[deckId as DeckId];
  };

  const getTitle = () => {
    if (isJourneyMode) return 'Journey Complete';
    if (isShuffleMode) return 'Shuffle Complete';
    return 'Session Complete';
  };

  return (
    <div className={`flex flex-col items-center text-center w-full ${hasExpandedDecks ? 'h-full overflow-y-auto' : 'h-full overflow-hidden'}`}>
      <div className="flex-shrink-0 bg-secondary p-3 rounded-2xl mb-2">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      
      <h2 className="flex-shrink-0 text-xl font-bold text-card-foreground mb-1">
        {getTitle()}
      </h2>
      
      <p className="flex-shrink-0 text-muted-foreground text-xs max-w-xs leading-relaxed mb-3">
        Thank you for being brave enough to ask, and vulnerable enough to answer.
      </p>

      {/* Stats Summary */}
      <div className="flex-shrink-0 w-full bg-card/50 rounded-xl p-2.5 mb-2 border border-border">
        <p className="text-xs text-muted-foreground mb-0.5">Questions explored</p>
        <p className="text-lg font-bold text-card-foreground">{totalQuestions}</p>
        
        {!isJourneyMode && Object.keys(deckStats).length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-border space-y-0.5">
            {Object.entries(deckStats).map(([deckId, count]) => {
              const deck = getDeckInfo(deckId);
              if (!deck || count === 0) return null;
              return (
                <div key={deckId} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{deck.name}</span>
                  <span className="text-card-foreground font-mono">{count} cards</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reflection Section */}
      {playedQuestions.length > 0 && (
        <div className="flex-1 min-h-0 w-full mb-2 flex flex-col">
          <h3 className="flex-shrink-0 text-xs font-bold text-card-foreground mb-1.5 uppercase tracking-widest">
            Your Questions
          </h3>
          
          <div className="flex-1 min-h-0 space-y-1 overflow-y-auto">
            {Object.entries(questionsByDeck).map(([deckId, questions]) => {
              const deck = getDeckInfo(deckId);
              if (!deck) return null;
              const isExpanded = expandedDecks.includes(deckId);
              
              return (
                <div key={deckId} className="bg-card/50 rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => toggleDeck(deckId)}
                    className="w-full p-2 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${deck.colorClass}`} />
                      <span className="text-sm font-medium text-card-foreground">{deck.name}</span>
                      <span className="text-xs text-muted-foreground">({questions.length})</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-2.5 pb-2.5 space-y-1.5">
                      {questions.map((q, idx) => (
                        <div key={idx} className="text-left border-t border-border/50 pt-1.5">
                          <p className="text-xs text-card-foreground leading-relaxed">{q.q}</p>
                          <p className="text-xs text-primary mt-0.5 italic">Deep Dive: {q.followUp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-shrink-0 w-full space-y-1.5">
        <button
          onClick={onPlayAgain}
          className="w-full py-2.5 rounded-xl deck-gradient-reset text-primary-foreground font-bold tracking-widest text-sm shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> PLAY AGAIN
        </button>
        
        <button
          onClick={onGoHome}
          className="w-full py-2.5 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-sm transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> MAIN MENU
        </button>
      </div>
    </div>
  );
});
