import { memo } from 'react';
import { History, X, Trash2, Heart, Star } from 'lucide-react';
import { FavoriteCard } from '@/hooks/useFavorites';

interface HistoryItem {
  q: string;
  cat: string;
  time: Date;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  favorites?: FavoriteCard[];
  onRemoveFavorite?: (cardId: string) => void;
}

export const HistoryPanel = memo(function HistoryPanel({ 
  history, 
  isOpen, 
  onClose, 
  onClearHistory,
  favorites = [],
  onRemoveFavorite
}: HistoryPanelProps) {
  if (!isOpen) return null;

  const handleClear = () => {
    onClearHistory();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-sm bg-card h-full border-l border-border p-6 overflow-y-auto animate-slide-in-right shadow-2xl">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-card pb-4 border-b border-border z-10">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Session
          </h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button 
                onClick={handleClear}
                className="p-1.5 hover:bg-destructive/20 rounded-md transition-colors group"
                title="Clear history"
              >
                <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-secondary rounded-md transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-3 uppercase tracking-widest">
              <Heart className="w-3 h-3 fill-current" /> Favorites ({favorites.length})
            </h3>
            <div className="space-y-3">
              {favorites.map((fav) => (
                <div key={fav.id} className="border border-primary/30 rounded-xl p-3 bg-primary/5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-primary/80 uppercase tracking-wider font-bold">
                      {fav.deckName}
                    </span>
                    {onRemoveFavorite && (
                      <button
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-1 hover:bg-destructive/20 rounded transition-colors"
                        title="Remove from favorites"
                      >
                        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    )}
                  </div>
                  <p className="text-secondary-foreground text-sm leading-relaxed">{fav.q}</p>
                  <p className="text-xs text-primary/70 mt-1 italic">"{fav.followUp}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-3 uppercase tracking-widest">
            <History className="w-3 h-3" /> Recent ({history.length})
          </h3>
          <div className="space-y-6">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No cards drawn yet. Start a conversation!
              </p>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-primary/80 uppercase tracking-wider font-bold">
                      {item.cat}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-secondary-foreground text-sm leading-relaxed">{item.q}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
