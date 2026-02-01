import { useCallback } from 'react';
import { decks, DeckId, DECK_ORDER } from '@/data/decks';
import { GameHeader } from '@/components/GameHeader';
import { DeckSelector } from '@/components/DeckSelector';
import { CardDisplay } from '@/components/CardDisplay';
import { HistoryPanel } from '@/components/HistoryPanel';
import { BackgroundAmbience } from '@/components/BackgroundAmbience';
import { MainMenu, GameMode } from '@/components/MainMenu';
import { JourneySetup } from '@/components/JourneySetup';
import { GameComplete } from '@/components/GameComplete';
import { DeckTransition } from '@/components/DeckTransition';
import { DeckBuilder } from '@/components/DeckBuilder';
import { useDeckState } from '@/hooks/useDeckState';
import { useGameState, CurrentCard } from '@/hooks/useGameState';
import { useFavorites } from '@/hooks/useFavorites';
import { useCustomDecks } from '@/hooks/useCustomDecks';

const Index = () => {
  const { state, actions } = useGameState();
  const { customDecks, createDeck, deleteDeck } = useCustomDecks();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  
  const { 
    getAvailableCount, 
    getTotalCount, 
    drawRandomCard,
    drawRandomFromAllDecks,
    skipCard,
    resetDeck, 
    resetAllDecks,
    getTotalAvailableAcrossAllDecks
  } = useDeckState(customDecks);

  const drawCard = useCallback((deckId: string) => {
    actions.unflipCard();
    setTimeout(() => {
      const card = drawRandomCard(deckId);
      if (card) {
        const currentCard: CurrentCard = {
          id: card.id,
          q: card.q,
          followUp: card.followUp,
          category: card.category,
          colorClass: card.colorClass,
          textGradientClass: card.textGradientClass,
          deckId: card.deckId
        };
        actions.setCurrentCard(currentCard);
        actions.addToHistory(card.q, card.category);
        actions.addPlayedQuestion(card.q, card.followUp, deckId);
        actions.incrementDeckStat(deckId);
      }
    }, 200);
  }, [drawRandomCard, actions]);

  const drawShuffleCard = useCallback(() => {
    actions.unflipCard();
    setTimeout(() => {
      const card = drawRandomFromAllDecks();
      if (card) {
        const currentCard: CurrentCard = {
          id: card.id,
          q: card.q,
          followUp: card.followUp,
          category: card.category,
          colorClass: card.colorClass,
          textGradientClass: card.textGradientClass,
          deckId: card.deckId
        };
        actions.setCurrentCard(currentCard);
        actions.addToHistory(card.q, card.category);
        actions.addPlayedQuestion(card.q, card.followUp, String(card.deckId));
        actions.incrementDeckStat(String(card.deckId));
      } else {
        // No cards left
        actions.setScreen('game-complete');
      }
    }, 200);
  }, [drawRandomFromAllDecks, actions]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    actions.resetSessionStats();
    actions.setMode(mode);
    
    if (mode === 'freeplay') {
      actions.setScreen('freeplay-select');
    } else if (mode === 'shuffle') {
      actions.setScreen('shuffle-card');
      drawShuffleCard();
    } else {
      actions.setScreen('journey-setup');
    }
  }, [actions, drawShuffleCard]);

  const handleDeckSelect = useCallback((deckId: string) => {
    actions.setActiveDeck(deckId);
    actions.setScreen('freeplay-card');
    drawCard(deckId);
  }, [actions, drawCard]);

  const handleDrawNext = useCallback(() => {
    if (state.activeDeck) {
      drawCard(state.activeDeck);
    }
  }, [state.activeDeck, drawCard]);

  const handleShuffleNext = useCallback(() => {
    drawShuffleCard();
  }, [drawShuffleCard]);

  const handleSkipCard = useCallback(() => {
    if (state.currentCard && state.currentCard.deckId) {
      // Get the question index from the card id
      const parts = state.currentCard.id.split('-');
      const questionIndex = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(questionIndex)) {
        skipCard(String(state.currentCard.deckId), questionIndex);
        actions.incrementSkipped();
      }
      // Draw a new card
      if (state.mode === 'shuffle') {
        drawShuffleCard();
      } else if (state.activeDeck) {
        drawCard(state.activeDeck);
      }
    }
  }, [state.currentCard, state.mode, state.activeDeck, skipCard, actions, drawShuffleCard, drawCard]);

  const handleEndFreeplay = useCallback(() => {
    actions.setScreen('game-complete');
  }, [actions]);

  const startJourney = useCallback(() => {
    resetAllDecks();
    actions.resetSessionStats();
    actions.resetJourney();
    
    // Show deck transition for first deck
    actions.showDeckTransition(DECK_ORDER[0]);
  }, [resetAllDecks, actions]);

  const handlePreloadNextDeck = useCallback((deckId: DeckId) => {
    actions.setActiveDeck(deckId);
    actions.setScreen('journey-card');
    drawCard(deckId);
    actions.setJourneyState({ cardInDeck: 1, totalPlayed: state.journey.totalPlayed + 1 });
  }, [actions, drawCard, state.journey.totalPlayed]);

  const handleDeckTransitionComplete = useCallback(() => {
    actions.hideDeckTransition();
  }, [actions]);

  const handleJourneyNext = useCallback(() => {
    if (state.journey.cardInDeck >= state.journey.cardsPerDeck) {
      const nextDeckIndex = state.journey.deckIndex + 1;
      
      if (nextDeckIndex >= DECK_ORDER.length) {
        actions.setScreen('game-complete');
        return;
      }
      
      actions.setJourneyDeckIndex(nextDeckIndex);
      actions.setJourneyState({ cardInDeck: 0 });
      actions.showDeckTransition(DECK_ORDER[nextDeckIndex]);
    } else {
      drawCard(state.activeDeck!);
      actions.incrementJourneyCard();
    }
  }, [state.journey, state.activeDeck, actions, drawCard]);

  const handleClearHistory = useCallback(() => {
    actions.clearHistory();
    resetAllDecks();
  }, [actions, resetAllDecks]);

  const resetToMenu = useCallback(() => {
    actions.resetToMenu();
  }, [actions]);

  const resetToFreeplaySelect = useCallback(() => {
    actions.setActiveDeck(null);
    actions.setCurrentCard(null);
    actions.unflipCard();
    actions.setScreen('freeplay-select');
  }, [actions]);

  const handlePlayAgain = useCallback(() => {
    actions.resetForNewGame();
    if (state.mode === 'journey') {
      startJourney();
    } else if (state.mode === 'shuffle') {
      actions.setScreen('shuffle-card');
      drawShuffleCard();
    } else {
      actions.setScreen('freeplay-select');
    }
  }, [state.mode, actions, startJourney, drawShuffleCard]);

  const handleToggleFavorite = useCallback(() => {
    if (state.currentCard) {
      toggleFavorite({
        id: state.currentCard.id,
        q: state.currentCard.q,
        followUp: state.currentCard.followUp,
        deckId: state.currentCard.deckId as DeckId,
        deckName: state.currentCard.category,
        colorClass: state.currentCard.colorClass
      });
    }
  }, [state.currentCard, toggleFavorite]);

  const handleOpenDeckBuilder = useCallback(() => {
    actions.setScreen('deck-builder');
  }, [actions]);

  const handleSaveCustomDeck = useCallback((name: string, description: string, questions: { q: string; followUp: string }[]) => {
    createDeck(name, description, questions);
    actions.setScreen('menu');
  }, [createDeck, actions]);

  const showHomeButton = state.screen !== 'menu';

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col items-center overflow-hidden relative">
      <BackgroundAmbience />
      
      <GameHeader 
        onReset={resetToMenu} 
        onShowHistory={actions.showHistory}
        showHomeButton={showHomeButton}
      />

      <main className="flex-1 w-full max-w-md flex flex-col justify-center px-4 pb-4 z-10 perspective-1000 overflow-hidden">
        {state.screen === 'menu' && (
          <MainMenu 
            onSelectMode={handleModeSelect} 
            onOpenDeckBuilder={handleOpenDeckBuilder}
            customDeckCount={customDecks.length}
          />
        )}

        {state.screen === 'deck-builder' && (
          <DeckBuilder
            onSave={handleSaveCustomDeck}
            onBack={resetToMenu}
          />
        )}

        {state.screen === 'freeplay-select' && (
          <DeckSelector 
            onSelectDeck={handleDeckSelect}
            getAvailableCount={getAvailableCount}
            getTotalCount={getTotalCount}
            onResetDeck={resetDeck}
            onEndSession={handleEndFreeplay}
            customDecks={customDecks}
          />
        )}

        {state.screen === 'freeplay-card' && state.activeDeck && (
          <CardDisplay
            card={state.currentCard}
            isFlipped={state.isFlipped}
            onFlip={actions.flipCard}
            onDrawNext={handleDrawNext}
            onBack={resetToFreeplaySelect}
            availableCount={getAvailableCount(state.activeDeck)}
            totalCount={getTotalCount(state.activeDeck)}
            onResetDeck={() => resetDeck(state.activeDeck!)}
            onSkipCard={handleSkipCard}
            isFavorite={state.currentCard ? isFavorite(state.currentCard.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {state.screen === 'shuffle-card' && (
          <CardDisplay
            card={state.currentCard}
            isFlipped={state.isFlipped}
            onFlip={actions.flipCard}
            onDrawNext={handleShuffleNext}
            onBack={resetToMenu}
            onEndSession={handleEndFreeplay}
            availableCount={getTotalAvailableAcrossAllDecks()}
            totalCount={0}
            onResetDeck={() => {}}
            onSkipCard={handleSkipCard}
            isShuffleMode={true}
            isFavorite={state.currentCard ? isFavorite(state.currentCard.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {state.screen === 'journey-setup' && (
          <JourneySetup
            cardsPerDeck={state.journey.cardsPerDeck}
            onCardsPerDeckChange={actions.setJourneyCardsPerDeck}
            onStart={startJourney}
            onBack={resetToMenu}
          />
        )}

        {state.screen === 'journey-card' && state.activeDeck && (
          <CardDisplay
            card={state.currentCard}
            isFlipped={state.isFlipped}
            onFlip={actions.flipCard}
            onDrawNext={handleJourneyNext}
            onBack={resetToMenu}
            availableCount={getAvailableCount(state.activeDeck)}
            totalCount={getTotalCount(state.activeDeck)}
            onResetDeck={() => {}}
            onSkipCard={handleSkipCard}
            isJourneyMode={true}
            journeyProgress={{
              current: state.journey.totalPlayed,
              total: state.journey.cardsPerDeck * 4,
              deckIndex: state.journey.deckIndex
            }}
            isFavorite={state.currentCard ? isFavorite(state.currentCard.id) : false}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {state.screen === 'game-complete' && (
          <GameComplete
            isJourneyMode={state.mode === 'journey'}
            isShuffleMode={state.mode === 'shuffle'}
            playedQuestions={state.playedQuestions}
            deckStats={state.deckStats}
            onPlayAgain={handlePlayAgain}
            onGoHome={resetToMenu}
          />
        )}
      </main>

      <HistoryPanel 
        history={state.history} 
        isOpen={state.ui.showHistory} 
        onClose={actions.hideHistory}
        onClearHistory={handleClearHistory}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
      />

      {state.ui.showDeckTransition && state.ui.transitionDeckId && (
        <DeckTransition 
          deckId={state.ui.transitionDeckId} 
          onPreload={() => handlePreloadNextDeck(state.ui.transitionDeckId!)}
          onComplete={handleDeckTransitionComplete} 
        />
      )}
    </div>
  );
};

export default Index;
