import { create } from "zustand";
import { type Difficulty, type Question, generateQuestions } from "./game-data";
import { calculateHaversineDistance } from "./utils";

export interface QuestionResult {
  locationName: string;
  country: string;
  distance: number;
  isCorrect: boolean;
  timeSpent: number;
  userCoordinates: { lng: number; lat: number } | null;
  correctCoordinates: { lng: number; lat: number };
}

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
  questionResults: QuestionResult[];
  gameStartTime: number | null;
  questionStartTime: number | null;
  totalGameTime: number;

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
  questionResults: [],
  gameStartTime: null,
  questionStartTime: null,
  totalGameTime: 0,

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
      questionResults: [],
      gameStartTime: Date.now(),
      questionStartTime: Date.now(),
      totalGameTime: 0,
    });
  },

  setSelectedCoordinates: (lng: number, lat: number) => {
    set({ selectedCoordinates: { lng, lat } });
  },

  checkAnswer: () => {
    const {
      questions,
      currentQuestionIndex,
      score,
      selectedCoordinates,
      questionResults,
      questionStartTime,
    } = get();

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

    // Calcular tiempo transcurrido en esta pregunta
    const timeSpent = questionStartTime
      ? Math.floor((Date.now() - questionStartTime) / 1000)
      : 0;

    // Crear resultado de la pregunta
    const questionResult: QuestionResult = {
      locationName: currentQuestion.location.name,
      country: currentQuestion.location.country,
      distance,
      isCorrect,
      timeSpent,
      userCoordinates: selectedCoordinates,
      correctCoordinates: {
        lng: longitude,
        lat: latitude,
      },
    };

    set({
      selectedAnswer: currentQuestion.location.name,
      distanceFromTarget: distance,
      hasAnswered: true,
      score: isCorrect ? score + 1 : score,
      questionResults: [...questionResults, questionResult],
    });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions, gameStartTime } = get();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      // Calcular tiempo total del juego
      const totalGameTime = gameStartTime
        ? Math.floor((Date.now() - gameStartTime) / 1000)
        : 0;
      set({ gameFinished: true, totalGameTime });
    } else {
      set({
        currentQuestionIndex: nextIndex,
        hasAnswered: false,
        selectedAnswer: null,
        selectedCoordinates: null,
        distanceFromTarget: null,
        questionStartTime: Date.now(),
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
      questionResults: [],
      gameStartTime: null,
      questionStartTime: null,
      totalGameTime: 0,
    }),
}));
