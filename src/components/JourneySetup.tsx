import { ArrowLeft, Play, Minus, Plus } from 'lucide-react';
import { decks, DECK_ORDER } from '@/data/decks';

interface JourneySetupProps {
  cardsPerDeck: number;
  onCardsPerDeckChange: (count: number) => void;
  onStart: () => void;
  onBack: () => void;
}

export function JourneySetup({ cardsPerDeck, onCardsPerDeckChange, onStart, onBack }: JourneySetupProps) {
  const totalCards = cardsPerDeck * 4;
  const maxCards = Math.min(...DECK_ORDER.map(id => decks[id].questions.length));

  return (
    <div className="space-y-4 flex flex-col h-full justify-center">
      <button
        onClick={onBack}
        className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="w-3 h-3" /> Back
      </button>

      <div className="text-center mb-2">
        <h2 className="text-2xl font-light text-card-foreground mb-1">Journey Mode</h2>
        <p className="text-muted-foreground text-sm">
          Progress through all 4 decks automatically.
        </p>
      </div>

      <div className="bg-card/50 border border-border rounded-2xl p-5 backdrop-blur-sm">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
            Cards per deck
          </p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => onCardsPerDeckChange(Math.max(1, cardsPerDeck - 1))}
              className="p-2 bg-secondary hover:bg-muted rounded-xl transition-colors"
              disabled={cardsPerDeck <= 1}
            >
              <Minus className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-4xl font-bold text-card-foreground w-16 text-center">
              {cardsPerDeck}
            </span>
            <button
              onClick={() => onCardsPerDeckChange(Math.min(maxCards, cardsPerDeck + 1))}
              className="p-2 bg-secondary hover:bg-muted rounded-xl transition-colors"
              disabled={cardsPerDeck >= maxCards}
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total cards:</span>
            <span className="text-card-foreground font-bold">{totalCards}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-2">
          Deck Order
        </p>
        {DECK_ORDER.map((deckId, index) => (
          <div 
            key={deckId} 
            className="flex items-center gap-3 p-2.5 bg-card/30 rounded-xl border border-border/50"
          >
            <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
            <div className={`w-2 h-2 rounded-full ${decks[deckId].colorClass}`} />
            <span className="text-sm text-card-foreground">{decks[deckId].name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3 rounded-xl deck-gradient-reset text-primary-foreground font-bold tracking-widest text-sm shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 mt-2"
      >
        <Play className="w-4 h-4" /> START JOURNEY
      </button>
    </div>
  );
}
