import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Question } from '@/data/decks';

export interface CustomDeck {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  textGradientClass: string;
  questions: Question[];
  createdAt: string;
}

const CUSTOM_COLORS = [
  { colorClass: 'bg-gradient-to-br from-pink-500 to-rose-600', textGradientClass: 'text-pink-400' },
  { colorClass: 'bg-gradient-to-br from-cyan-500 to-blue-600', textGradientClass: 'text-cyan-400' },
  { colorClass: 'bg-gradient-to-br from-green-500 to-emerald-600', textGradientClass: 'text-green-400' },
  { colorClass: 'bg-gradient-to-br from-orange-500 to-red-600', textGradientClass: 'text-orange-400' },
  { colorClass: 'bg-gradient-to-br from-indigo-500 to-purple-600', textGradientClass: 'text-indigo-400' },
];

export function useCustomDecks() {
  const [customDecks, setCustomDecks] = useLocalStorage<CustomDeck[]>('unfold-custom-decks', []);

  const getNextColor = useCallback(() => {
    const colorIndex = customDecks.length % CUSTOM_COLORS.length;
    return CUSTOM_COLORS[colorIndex];
  }, [customDecks.length]);

  const createDeck = useCallback((name: string, description: string, questions: Question[]) => {
    const color = getNextColor();
    const newDeck: CustomDeck = {
      id: `custom-${Date.now()}`,
      name,
      description,
      colorClass: color.colorClass,
      textGradientClass: color.textGradientClass,
      questions,
      createdAt: new Date().toISOString()
    };
    setCustomDecks(prev => [...prev, newDeck]);
    return newDeck;
  }, [getNextColor, setCustomDecks]);

  const updateDeck = useCallback((id: string, updates: Partial<Omit<CustomDeck, 'id' | 'createdAt'>>) => {
    setCustomDecks(prev => prev.map(deck => 
      deck.id === id ? { ...deck, ...updates } : deck
    ));
  }, [setCustomDecks]);

  const deleteDeck = useCallback((id: string) => {
    setCustomDecks(prev => prev.filter(deck => deck.id !== id));
  }, [setCustomDecks]);

  const getDeck = useCallback((id: string) => {
    return customDecks.find(deck => deck.id === id);
  }, [customDecks]);

  const addQuestionToDeck = useCallback((deckId: string, question: Question) => {
    setCustomDecks(prev => prev.map(deck => 
      deck.id === deckId 
        ? { ...deck, questions: [...deck.questions, question] }
        : deck
    ));
  }, [setCustomDecks]);

  const removeQuestionFromDeck = useCallback((deckId: string, questionIndex: number) => {
    setCustomDecks(prev => prev.map(deck => 
      deck.id === deckId 
        ? { ...deck, questions: deck.questions.filter((_, i) => i !== questionIndex) }
        : deck
    ));
  }, [setCustomDecks]);

  return {
    customDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    addQuestionToDeck,
    removeQuestionFromDeck
  };
}
