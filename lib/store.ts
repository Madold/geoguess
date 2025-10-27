import { create } from "zustand";
import { type Difficulty, type Question, generateQuestions } from "./game-data";
import { calculateHaversineDistance } from "./utils";

interface GameState {
  playerName: string;
  difficulty: Difficulty | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  selectedCoordinates: { lng: number; lat: number } | null;
  distanceFromTarget: number | null;
  gameStarted: boolean;
  gameFinished: boolean;

  setPlayerName: (name: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  setSelectedCoordinates: (lng: number, lat: number) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: "",
  difficulty: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  hasAnswered: false,
  selectedAnswer: null,
  selectedCoordinates: null,
  distanceFromTarget: null,
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
      selectedCoordinates: null,
      distanceFromTarget: null,
      gameStarted: true,
      gameFinished: false,
    });
  },

  setSelectedCoordinates: (lng: number, lat: number) => {
    set({ selectedCoordinates: { lng, lat } });
  },

  checkAnswer: () => {
    const { questions, currentQuestionIndex, score, selectedCoordinates } =
      get();

    if (!selectedCoordinates) return;

    const currentQuestion = questions[currentQuestionIndex];
    const { latitude, longitude } = currentQuestion.location;

    // Calcular la distancia usando Haversine
    const distance = calculateHaversineDistance(
      selectedCoordinates.lat,
      selectedCoordinates.lng,
      latitude,
      longitude
    );

    // Umbral de 200 km
    const THRESHOLD_KM = 200;
    const isCorrect = distance <= THRESHOLD_KM;

    set({
      selectedAnswer: currentQuestion.location.name,
      distanceFromTarget: distance,
      hasAnswered: true,
      score: isCorrect ? score + 1 : score,
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
        selectedAnswer: null,
        selectedCoordinates: null,
        distanceFromTarget: null,
      });
    }
  },

  resetGame: () =>
    set({
      playerName: "",
      difficulty: null,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      hasAnswered: false,
      selectedAnswer: null,
      selectedCoordinates: null,
      distanceFromTarget: null,
      gameStarted: false,
      gameFinished: false,
    }),
}));
