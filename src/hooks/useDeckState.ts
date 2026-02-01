import { useState, useCallback, useEffect } from 'react';
import { decks, DeckId, DECK_ORDER } from '@/data/decks';
import { useLocalStorage } from './useLocalStorage';
import { CustomDeck } from './useCustomDecks';

interface UsedIndices {
  [deckId: string]: number[];
}

interface DrawnCard {
  id: string;
  q: string;
  followUp: string;
  category: string;
  colorClass: string;
  textGradientClass: string;
  deckId: DeckId | string;
  questionIndex: number;
}

export function useDeckState(customDecks: CustomDeck[] = []) {
  // Track used card indices per deck with localStorage persistence
  const [usedIndices, setUsedIndices] = useLocalStorage<UsedIndices>('unfold-used-indices', {});

  const getAllDecks = useCallback(() => {
    const allDecks: Record<string, { id: string; name: string; colorClass: string; textGradientClass: string; desc: string; questions: { q: string; followUp: string }[] }> = { ...decks };
    customDecks.forEach(cd => {
      allDecks[cd.id] = {
        id: cd.id,
        name: cd.name,
        colorClass: cd.colorClass,
        textGradientClass: cd.textGradientClass,
        desc: cd.description,
        questions: cd.questions
      };
    });
    return allDecks;
  }, [customDecks]);

  const getAvailableCount = useCallback((deckId: string) => {
    const allDecks = getAllDecks();
    const deck = allDecks[deckId];
    if (!deck) return 0;
    const used = usedIndices[deckId]?.length || 0;
    return deck.questions.length - used;
  }, [usedIndices, getAllDecks]);

  const getTotalCount = useCallback((deckId: string) => {
    const allDecks = getAllDecks();
    return allDecks[deckId]?.questions.length || 0;
  }, [getAllDecks]);

  const drawRandomCard = useCallback((deckId: string): DrawnCard | null => {
    const allDecks = getAllDecks();
    const deck = allDecks[deckId];
    if (!deck) return null;
    
    const used = usedIndices[deckId] || [];
    const usedSet = new Set(used);
    
    // Get available indices
    const availableIndices = deck.questions.map((_, i) => i).filter(i => !usedSet.has(i));
    
    if (availableIndices.length === 0) {
      return null; // No cards left
    }

    // Pick random from available
    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // Mark as used
    setUsedIndices(prev => ({
      ...prev,
      [deckId]: [...(prev[deckId] || []), randomIdx]
    }));

    return {
      id: `${deckId}-${randomIdx}`,
      ...deck.questions[randomIdx],
      category: deck.name,
      colorClass: deck.colorClass,
      textGradientClass: deck.textGradientClass,
      deckId,
      questionIndex: randomIdx
    };
  }, [usedIndices, getAllDecks, setUsedIndices]);

  // Draw random card from ALL decks (shuffle mode)
  const drawRandomFromAllDecks = useCallback((): DrawnCard | null => {
    const allDecks = getAllDecks();
    
    // Build list of all available cards across all decks
    const availableCards: { deckId: string; questionIndex: number }[] = [];
    
    Object.keys(allDecks).forEach(deckId => {
      const deck = allDecks[deckId];
      const used = usedIndices[deckId] || [];
      const usedSet = new Set(used);
      
      deck.questions.forEach((_, i) => {
        if (!usedSet.has(i)) {
          availableCards.push({ deckId, questionIndex: i });
        }
      });
    });
    
    if (availableCards.length === 0) {
      return null;
    }
    
    // Pick random card
    const randomChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
    const deck = allDecks[randomChoice.deckId];
    const question = deck.questions[randomChoice.questionIndex];
    
    // Mark as used
    setUsedIndices(prev => ({
      ...prev,
      [randomChoice.deckId]: [...(prev[randomChoice.deckId] || []), randomChoice.questionIndex]
    }));
    
    return {
      id: `${randomChoice.deckId}-${randomChoice.questionIndex}`,
      ...question,
      category: deck.name,
      colorClass: deck.colorClass,
      textGradientClass: deck.textGradientClass,
      deckId: randomChoice.deckId,
      questionIndex: randomChoice.questionIndex
    };
  }, [usedIndices, getAllDecks, setUsedIndices]);

  // Skip card - don't mark as used (for skip feature)
  const skipCard = useCallback((deckId: string, questionIndex: number) => {
    // Remove from used indices if it was marked
    setUsedIndices(prev => {
      const current = prev[deckId] || [];
      return {
        ...prev,
        [deckId]: current.filter(i => i !== questionIndex)
      };
    });
  }, [setUsedIndices]);

  const resetDeck = useCallback((deckId: string) => {
    setUsedIndices(prev => {
      const next = { ...prev };
      delete next[deckId];
      return next;
    });
  }, [setUsedIndices]);

  const resetAllDecks = useCallback(() => {
    setUsedIndices({});
  }, [setUsedIndices]);

  const getTotalAvailableAcrossAllDecks = useCallback(() => {
    const allDecks = getAllDecks();
    let total = 0;
    Object.keys(allDecks).forEach(deckId => {
      total += getAvailableCount(deckId);
    });
    return total;
  }, [getAllDecks, getAvailableCount]);

  return {
    getAvailableCount,
    getTotalCount,
    drawRandomCard,
    drawRandomFromAllDecks,
    skipCard,
    resetDeck,
    resetAllDecks,
    usedIndices,
    getTotalAvailableAcrossAllDecks,
    getAllDecks
  };
}
