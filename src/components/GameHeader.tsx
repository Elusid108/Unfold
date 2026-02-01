import { Sparkles, History, Home } from 'lucide-react';

interface GameHeaderProps {
  onReset: () => void;
  onShowHistory: () => void;
  showHomeButton?: boolean;
}

export function GameHeader({ onReset, onShowHistory, showHomeButton = false }: GameHeaderProps) {
  return (
    <header className="w-full max-w-md px-4 py-2 flex justify-between items-center z-10">
      <button 
        onClick={onReset} 
        className="cursor-pointer flex items-center gap-2 group"
      >
        <div className="bg-secondary p-1.5 rounded-lg group-hover:bg-muted transition-colors">
          {showHomeButton ? (
            <Home className="w-4 h-4 text-primary" />
          ) : (
            <Sparkles className="w-4 h-4 text-primary" />
          )}
        </div>
        <h1 className="text-lg font-bold tracking-widest uppercase text-card-foreground">
          Unfold
        </h1>
      </button>
      <button 
        onClick={onShowHistory} 
        className="p-1.5 hover:bg-secondary rounded-full transition-colors relative"
      >
        <History className="w-4 h-4 text-muted-foreground" />
      </button>
    </header>
  );
}
