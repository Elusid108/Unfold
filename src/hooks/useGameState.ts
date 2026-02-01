import { useReducer, useCallback, useEffect } from 'react';
import { DeckId, DECK_ORDER } from '@/data/decks';

// Types
export type GameScreen = 
  | 'menu' 
  | 'freeplay-select' 
  | 'freeplay-card' 
  | 'journey-setup' 
  | 'journey-card' 
  | 'shuffle-card'
  | 'game-complete'
  | 'deck-builder';

export type GameMode = 'freeplay' | 'journey' | 'shuffle';

export interface CurrentCard {
  id: string; // deckId-questionIndex for favorites
  q: string;
  followUp: string;
  category: string;
  colorClass: string;
  textGradientClass: string;
  deckId: DeckId | string;
}

export interface HistoryItem {
  q: string;
  cat: string;
  time: Date;
}

export interface PlayedQuestion {
  q: string;
  followUp: string;
  deckId: string;
}

export interface DeckStats {
  [deckId: string]: number;
}

export interface JourneyState {
  cardsPerDeck: number;
  deckIndex: number;
  cardInDeck: number;
  totalPlayed: number;
}

export interface UIState {
  showHistory: boolean;
  showDeckTransition: boolean;
  transitionDeckId: DeckId | null;
}

export interface GameState {
  screen: GameScreen;
  mode: GameMode | null;
  activeDeck: DeckId | string | null;
  currentCard: CurrentCard | null;
  isFlipped: boolean;
  history: HistoryItem[];
  playedQuestions: PlayedQuestion[];
  deckStats: DeckStats;
  skippedCount: number;
  journey: JourneyState;
  ui: UIState;
}

// Action Types
type GameAction =
  | { type: 'SET_SCREEN'; screen: GameScreen }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_ACTIVE_DECK'; deckId: DeckId | string | null }
  | { type: 'SET_CURRENT_CARD'; card: CurrentCard | null }
  | { type: 'FLIP_CARD' }
  | { type: 'UNFLIP_CARD' }
  | { type: 'ADD_TO_HISTORY'; item: HistoryItem }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_HISTORY'; history: HistoryItem[] }
  | { type: 'ADD_PLAYED_QUESTION'; question: PlayedQuestion }
  | { type: 'INCREMENT_DECK_STAT'; deckId: string }
  | { type: 'INCREMENT_SKIPPED' }
  | { type: 'RESET_SESSION_STATS' }
  | { type: 'SET_JOURNEY_CARDS_PER_DECK'; count: number }
  | { type: 'SET_JOURNEY_DECK_INDEX'; index: number }
  | { type: 'INCREMENT_JOURNEY_CARD' }
  | { type: 'RESET_JOURNEY' }
  | { type: 'SET_JOURNEY_STATE'; state: Partial<JourneyState> }
  | { type: 'SHOW_HISTORY' }
  | { type: 'HIDE_HISTORY' }
  | { type: 'SHOW_DECK_TRANSITION'; deckId: DeckId }
  | { type: 'HIDE_DECK_TRANSITION' }
  | { type: 'RESET_TO_MENU' }
  | { type: 'RESET_FOR_NEW_GAME' };

// Initial State
const initialState: GameState = {
  screen: 'menu',
  mode: null,
  activeDeck: null,
  currentCard: null,
  isFlipped: false,
  history: [],
  playedQuestions: [],
  deckStats: {},
  skippedCount: 0,
  journey: {
    cardsPerDeck: 3,
    deckIndex: 0,
    cardInDeck: 0,
    totalPlayed: 0
  },
  ui: {
    showHistory: false,
    showDeckTransition: false,
    transitionDeckId: null
  }
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    
    case 'SET_ACTIVE_DECK':
      return { ...state, activeDeck: action.deckId };
    
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.card };
    
    case 'FLIP_CARD':
      return { ...state, isFlipped: !state.isFlipped };
    
    case 'UNFLIP_CARD':
      return { ...state, isFlipped: false };
    
    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.item, ...state.history] };
    
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    
    case 'SET_HISTORY':
      return { ...state, history: action.history };
    
    case 'ADD_PLAYED_QUESTION':
      return { ...state, playedQuestions: [...state.playedQuestions, action.question] };
    
    case 'INCREMENT_DECK_STAT':
      return { 
        ...state, 
        deckStats: { 
          ...state.deckStats, 
          [action.deckId]: (state.deckStats[action.deckId] || 0) + 1 
        } 
      };
    
    case 'INCREMENT_SKIPPED':
      return { ...state, skippedCount: state.skippedCount + 1 };
    
    case 'RESET_SESSION_STATS':
      return { ...state, playedQuestions: [], deckStats: {}, skippedCount: 0 };
    
    case 'SET_JOURNEY_CARDS_PER_DECK':
      return { ...state, journey: { ...state.journey, cardsPerDeck: action.count } };
    
    case 'SET_JOURNEY_DECK_INDEX':
      return { ...state, journey: { ...state.journey, deckIndex: action.index } };
    
    case 'INCREMENT_JOURNEY_CARD':
      return { 
        ...state, 
        journey: { 
          ...state.journey, 
          cardInDeck: state.journey.cardInDeck + 1,
          totalPlayed: state.journey.totalPlayed + 1
        } 
      };
    
    case 'RESET_JOURNEY':
      return { 
        ...state, 
        journey: { 
          ...state.journey,
          deckIndex: 0, 
          cardInDeck: 0, 
          totalPlayed: 0 
        } 
      };
    
    case 'SET_JOURNEY_STATE':
      return { ...state, journey: { ...state.journey, ...action.state } };
    
    case 'SHOW_HISTORY':
      return { ...state, ui: { ...state.ui, showHistory: true } };
    
    case 'HIDE_HISTORY':
      return { ...state, ui: { ...state.ui, showHistory: false } };
    
    case 'SHOW_DECK_TRANSITION':
      return { 
        ...state, 
        ui: { ...state.ui, showDeckTransition: true, transitionDeckId: action.deckId } 
      };
    
    case 'HIDE_DECK_TRANSITION':
      return { 
        ...state, 
        ui: { ...state.ui, showDeckTransition: false, transitionDeckId: null } 
      };
    
    case 'RESET_TO_MENU':
      return {
        ...initialState,
        history: state.history, // Preserve history
        journey: { ...initialState.journey, cardsPerDeck: state.journey.cardsPerDeck }
      };
    
    case 'RESET_FOR_NEW_GAME':
      return {
        ...state,
        playedQuestions: [],
        deckStats: {},
        skippedCount: 0,
        currentCard: null,
        isFlipped: false,
        activeDeck: null
      };
    
    default:
      return state;
  }
}

// Hook
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('unfold-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Convert date strings back to Date objects
        const history = parsed.map((item: HistoryItem & { time: string }) => ({
          ...item,
          time: new Date(item.time)
        }));
        dispatch({ type: 'SET_HISTORY', history });
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('unfold-history', JSON.stringify(state.history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [state.history]);

  // Action creators
  const actions = {
    setScreen: useCallback((screen: GameScreen) => 
      dispatch({ type: 'SET_SCREEN', screen }), []),
    
    setMode: useCallback((mode: GameMode) => 
      dispatch({ type: 'SET_MODE', mode }), []),
    
    setActiveDeck: useCallback((deckId: DeckId | string | null) => 
      dispatch({ type: 'SET_ACTIVE_DECK', deckId }), []),
    
    setCurrentCard: useCallback((card: CurrentCard | null) => 
      dispatch({ type: 'SET_CURRENT_CARD', card }), []),
    
    flipCard: useCallback(() => 
      dispatch({ type: 'FLIP_CARD' }), []),
    
    unflipCard: useCallback(() => 
      dispatch({ type: 'UNFLIP_CARD' }), []),
    
    addToHistory: useCallback((q: string, cat: string) => 
      dispatch({ type: 'ADD_TO_HISTORY', item: { q, cat, time: new Date() } }), []),
    
    clearHistory: useCallback(() => 
      dispatch({ type: 'CLEAR_HISTORY' }), []),
    
    addPlayedQuestion: useCallback((q: string, followUp: string, deckId: string) => 
      dispatch({ type: 'ADD_PLAYED_QUESTION', question: { q, followUp, deckId } }), []),
    
    incrementDeckStat: useCallback((deckId: string) => 
      dispatch({ type: 'INCREMENT_DECK_STAT', deckId }), []),
    
    incrementSkipped: useCallback(() => 
      dispatch({ type: 'INCREMENT_SKIPPED' }), []),
    
    resetSessionStats: useCallback(() => 
      dispatch({ type: 'RESET_SESSION_STATS' }), []),
    
    setJourneyCardsPerDeck: useCallback((count: number) => 
      dispatch({ type: 'SET_JOURNEY_CARDS_PER_DECK', count }), []),
    
    setJourneyDeckIndex: useCallback((index: number) => 
      dispatch({ type: 'SET_JOURNEY_DECK_INDEX', index }), []),
    
    incrementJourneyCard: useCallback(() => 
      dispatch({ type: 'INCREMENT_JOURNEY_CARD' }), []),
    
    resetJourney: useCallback(() => 
      dispatch({ type: 'RESET_JOURNEY' }), []),
    
    setJourneyState: useCallback((journeyState: Partial<JourneyState>) => 
      dispatch({ type: 'SET_JOURNEY_STATE', state: journeyState }), []),
    
    showHistory: useCallback(() => 
      dispatch({ type: 'SHOW_HISTORY' }), []),
    
    hideHistory: useCallback(() => 
      dispatch({ type: 'HIDE_HISTORY' }), []),
    
    showDeckTransition: useCallback((deckId: DeckId) => 
      dispatch({ type: 'SHOW_DECK_TRANSITION', deckId }), []),
    
    hideDeckTransition: useCallback(() => 
      dispatch({ type: 'HIDE_DECK_TRANSITION' }), []),
    
    resetToMenu: useCallback(() => 
      dispatch({ type: 'RESET_TO_MENU' }), []),
    
    resetForNewGame: useCallback(() => 
      dispatch({ type: 'RESET_FOR_NEW_GAME' }), [])
  };

  return { state, actions };
}
