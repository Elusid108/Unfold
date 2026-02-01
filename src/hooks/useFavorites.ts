import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DeckId } from '@/data/decks';

export interface FavoriteCard {
  id: string; // unique identifier: deckId-questionIndex
  q: string;
  followUp: string;
  deckId: DeckId;
  deckName: string;
  colorClass: string;
  savedAt: string; // ISO date string
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCard[]>('unfold-favorites', []);

  const isFavorite = useCallback((cardId: string) => {
    return favorites.some(f => f.id === cardId);
  }, [favorites]);

  const addFavorite = useCallback((card: Omit<FavoriteCard, 'savedAt'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === card.id)) return prev;
      return [...prev, { ...card, savedAt: new Date().toISOString() }];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((cardId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== cardId));
  }, [setFavorites]);

  const toggleFavorite = useCallback((card: Omit<FavoriteCard, 'savedAt'>) => {
    if (isFavorite(card.id)) {
      removeFavorite(card.id);
    } else {
      addFavorite(card);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    count: favorites.length
  };
}
