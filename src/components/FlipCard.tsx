import { RefreshCw } from 'lucide-react';

interface CardData {
  q: string;
  followUp: string;
  category: string;
  colorClass: string;
  textGradientClass: string;
}

interface FlipCardProps {
  card: CardData | null;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ card, isFlipped, onFlip }: FlipCardProps) {
  if (!card) return null;

  return (
    <div 
      onClick={onFlip} 
      className="relative w-full aspect-[3/4] max-h-[50vh] cursor-pointer group perspective-1000"
    >
      <div className={`w-full h-full transition-transform duration-500 ease-out preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-card rounded-3xl border border-border shadow-2xl flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center h-full justify-between py-3">
            <span className={`text-xs font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-border/50 bg-secondary/50 ${card.textGradientClass}`}>
              {card.category}
            </span>
            <p className="text-xl md:text-2xl font-light leading-snug text-card-foreground">
              {card.q}
            </p>
            <div className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors">
              <RefreshCw className="w-3 h-3" /> Tap to reveal Deep Dive
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-card rounded-3xl border border-primary/30 glow-amber flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center h-full justify-center">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/30 pb-2">
              The Deep Dive
            </span>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-primary/90 italic">
              "{card.followUp}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
