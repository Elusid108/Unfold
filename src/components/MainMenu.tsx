import { Sparkles, Shuffle, Route, Info, ExternalLink, Layers, Plus } from 'lucide-react';
import { useState } from 'react';

export type GameMode = 'freeplay' | 'journey' | 'shuffle';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenDeckBuilder?: () => void;
  customDeckCount?: number;
}

export function MainMenu({ onSelectMode, onOpenDeckBuilder, customDeckCount = 0 }: MainMenuProps) {
  const [showAbout, setShowAbout] = useState(false);

  if (showAbout) {
    return (
      <div className="space-y-4 flex flex-col h-full justify-center">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-secondary p-3 rounded-2xl">
              <Info className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-card-foreground mb-2">
            About
          </h1>
        </div>

        <div className="p-5 rounded-2xl bg-card/50 border border-border backdrop-blur-sm">
          <p className="text-foreground text-sm leading-relaxed mb-4">
            I built Unfold because I wanted a better tool for connection. But deep down, I just love making things.
          </p>
          <p className="text-foreground text-sm leading-relaxed mb-4">
            My projects range from social experiments to physical fabrication. On any given day, you might find me coding a web app, designing a lighting rig, 3D printing an art piece, or prototyping a circuit.
          </p>
          <p className="text-foreground text-sm leading-relaxed mb-4">
            If you like how this app works, come see what I'm building in the rest of my lab.
          </p>
          <a
            href="https://chrismoore.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-sm transition-colors"
          >
            Chris Moore Designs <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => setShowAbout(false)}
          className="w-full py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-sm transition-all"
        >
          BACK TO MENU
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col h-full justify-center">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="bg-secondary p-3 rounded-2xl">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-widest uppercase text-card-foreground mb-2">
          Unfold
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
          We stop being curious about the people we love because we think we already know them. But people are rivers, not rocks. Time to see what has changed.
        </p>
      </div>

      <button
        onClick={() => onSelectMode('freeplay')}
        className="w-full text-left p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-muted/80 transition-all group relative overflow-hidden backdrop-blur-sm"
      >
        <div className="absolute left-0 top-0 w-1 h-full deck-gradient-reset opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-xl group-hover:bg-muted transition-colors">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground">Freeplay</h3>
            <p className="text-sm text-muted-foreground mt-1 group-hover:text-secondary-foreground transition-colors">
              Pick a deck and draw cards at your own pace.
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelectMode('shuffle')}
        className="w-full text-left p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-muted/80 transition-all group relative overflow-hidden backdrop-blur-sm"
      >
        <div className="absolute left-0 top-0 w-1 h-full deck-gradient-vault opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-xl group-hover:bg-muted transition-colors">
            <Shuffle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground">Shuffle</h3>
            <p className="text-sm text-muted-foreground mt-1 group-hover:text-secondary-foreground transition-colors">
              Random cards from all decks, mixed together.
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelectMode('journey')}
        className="w-full text-left p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-muted/80 transition-all group relative overflow-hidden backdrop-blur-sm"
      >
        <div className="absolute left-0 top-0 w-1 h-full deck-gradient-shadow opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-xl group-hover:bg-muted transition-colors">
            <Route className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground">Journey</h3>
            <p className="text-sm text-muted-foreground mt-1 group-hover:text-secondary-foreground transition-colors">
              Progress through all decks automatically.
            </p>
          </div>
        </div>
      </button>

      <div className="flex gap-2">
        {onOpenDeckBuilder && (
          <button
            onClick={onOpenDeckBuilder}
            className="flex-1 py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> CREATE DECK
            {customDeckCount > 0 && (
              <span className="text-primary">({customDeckCount})</span>
            )}
          </button>
        )}
        <button
          onClick={() => setShowAbout(true)}
          className="flex-1 py-3 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold tracking-widest text-xs transition-all flex items-center justify-center gap-2"
        >
          <Info className="w-3 h-3" /> ABOUT
        </button>
      </div>
    </div>
  );
}
