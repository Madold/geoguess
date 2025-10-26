import { create } from 'zustand';
import { type Difficulty, type Question, generateQuestions } from './game-data';

interface GameState {
  playerName: string;
  difficulty: Difficulty | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  gameStarted: boolean;
  gameFinished: boolean;

  setPlayerName: (name: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: '',
  difficulty: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  hasAnswered: false,
  selectedAnswer: null,
  gameStarted: false,
  gameFinished: false,

  setPlayerName: (name: string) => set({ playerName: name }),

  setDifficulty: (difficulty: Difficulty) => set({ difficulty }),

  startGame: () => {
    const { difficulty } = get();
    if (!difficulty) return;

    const questions = generateQuestions(difficulty, 10);
    set({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      hasAnswered: false,
      selectedAnswer: null,
      gameStarted: true,
      gameFinished: false
    });
  },

  selectAnswer: (answer: string) => {
    const { questions, currentQuestionIndex, score } = get();
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    set({
      selectedAnswer: answer,
      hasAnswered: true,
      score: isCorrect ? score + 1 : score
    });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      set({ gameFinished: true });
    } else {
      set({
        currentQuestionIndex: nextIndex,
        hasAnswered: false,
        selectedAnswer: null
      });
    }
  },

  resetGame: () => set({
    playerName: '',
    difficulty: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    hasAnswered: false,
    selectedAnswer: null,
    gameStarted: false,
    gameFinished: false
  })
}));
