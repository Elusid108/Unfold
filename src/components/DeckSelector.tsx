import { memo } from 'react';
import { ChevronRight, RotateCcw, Flag } from 'lucide-react';
import { decks, Deck, DeckId } from '@/data/decks';
import { CustomDeck } from '@/hooks/useCustomDecks';

interface DeckSelectorProps {
  onSelectDeck: (deckId: string) => void;
  getAvailableCount: (deckId: string) => number;
  getTotalCount: (deckId: string) => number;
  onResetDeck: (deckId: string) => void;
  onEndSession: () => void;
  customDecks?: CustomDeck[];
}

export const DeckSelector = memo(function DeckSelector({ 
  onSelectDeck, 
  getAvailableCount, 
  getTotalCount, 
  onResetDeck, 
  onEndSession,
  customDecks = []
}: DeckSelectorProps) {
  const allDecks = [
    ...Object.values(decks),
    ...customDecks.map(cd => ({
      id: cd.id,
      name: cd.name,
      colorClass: cd.colorClass,
      textGradientClass: cd.textGradientClass,
      desc: cd.description,
      questions: cd.questions
    }))
  ];

  return (
    <div className="space-y-3 flex flex-col h-full justify-start pt-2">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-light text-card-foreground mb-1">Select a Layer</h2>
        <p className="text-muted-foreground text-sm">Choose the depth of your conversation.</p>
      </div>
      {allDecks.map((deck) => {
        const available = getAvailableCount(deck.id);
        const total = getTotalCount(deck.id);
        const isEmpty = available === 0;
        const isCustom = deck.id.startsWith('custom-');

        return (
          <div key={deck.id} className="relative">
            <button 
              onClick={() => !isEmpty && onSelectDeck(deck.id)} 
              disabled={isEmpty}
              className={`w-full text-left p-4 rounded-2xl bg-card/50 border border-border transition-all group relative overflow-hidden backdrop-blur-sm ${
                isEmpty 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-primary/50 hover:bg-muted/80'
              }`}
            >
              <div className={`absolute left-0 top-0 w-1 h-full ${deck.colorClass} opacity-70 group-hover:opacity-100 transition-opacity`} />
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-card-foreground flex items-center gap-2">
                  {deck.name}
                  {isCustom && (
                    <span className="text-xs font-normal text-muted-foreground">(custom)</span>
                  )}
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${isEmpty ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {available}/{total}
                  </span>
                  {!isEmpty && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 pr-4 group-hover:text-secondary-foreground transition-colors leading-relaxed">
                {deck.desc}
              </p>
            </button>
            
            {isEmpty && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetDeck(deck.id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-secondary hover:bg-muted rounded-lg transition-colors"
                title="Reset deck"
              >
                <RotateCcw className="w-4 h-4 text-primary" />
              </button>
            )}
          </div>
        );
      })}

      <button 
        onClick={onEndSession}
        className="w-full py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-2 mt-2"
      >
        <Flag className="w-3 h-3" /> END SESSION
      </button>
    </div>
  );
});
