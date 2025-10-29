"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGameStore } from "@/lib/store";
import {
  Lightbulb,
  Trophy,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Target,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { PlaceSelectorMap } from "@/modules/shared/components/place-selector-map";
import { StreetView } from "@/modules/shared/components/street-view";

export function GamePage() {
  const [showHint, setShowHint] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [showAnswerAnimation, setShowAnswerAnimation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const {
    questions,
    currentQuestionIndex,
    score,
    hasAnswered,
    selectedAnswer,
    selectedCoordinates,
    distanceFromTarget,
    setSelectedCoordinates,
    checkAnswer,
    nextQuestion,
    playerName,
    difficulty,
  } = useGameStore();

  const currentQuestion = questions[currentQuestionIndex];

  // Timer para mostrar tiempo transcurrido
  // Timer to display elapsed time
  useEffect(() => {
    if (!hasAnswered && currentQuestion) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasAnswered, currentQuestion]);

  // Reset timer cuando cambia la pregunta
  // Reset timer when the question changes
  useEffect(() => {
    setTimeElapsed(0);
    setShowAnswerAnimation(false);
    setIsCheckingAnswer(false);
  }, [currentQuestionIndex]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  // Verificar si la respuesta es correcta basándose en la distancia (200 km o menos)
  // Check if the answer is correct based on distance (200 km or less)
  const THRESHOLD_KM = 200;
  const isCorrect =
    hasAnswered &&
    distanceFromTarget !== null &&
    distanceFromTarget <= THRESHOLD_KM;

  // Calcular progreso del juego
  // Calculate game progress
  const gameProgress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Función para manejar la verificación de respuesta con animación
  // Function to handle answer checking with animation
  const handleCheckAnswer = async () => {
    setIsCheckingAnswer(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simular tiempo de procesamiento
    checkAnswer();
    setShowAnswerAnimation(true);
    setIsCheckingAnswer(false);
  };

  // Función para formatear tiempo
  // Function to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header mejorado con progreso */}
        {/* Enhanced Header with Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">GeoGuess</h1>
              <p className="text-sm text-gray-600">
                Player: <span className="font-semibold">{playerName}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                <Clock className="w-3 h-3" />
                {formatTime(timeElapsed)}
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                Question {currentQuestionIndex + 1} / {questions.length}
              </Badge>
              <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-green-600 flex items-center gap-2">
                <Trophy className="w-3 h-3" />
                Score: {score}
              </Badge>
            </div>
          </div>

          {/* Barra de progreso */}
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Game Progress</span>
              <span>{Math.round(gameProgress)}%</span>
            </div>
            <Progress value={gameProgress} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 xl:gap-8">
          {/* Street View con mejoras visuales */}
          {/* Street View with visual enhancements */}
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900 transition-all duration-300 hover:shadow-3xl"
            style={{ height: "600px" }}
            role="img"
            aria-label={`Street view of ${currentQuestion.location.name}, ${currentQuestion.location.country}`}
          >
            <StreetView imageId={currentQuestion.location.imageId} />

            {/* Overlay con información */}
            {/* Overlay with information */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <Badge className="bg-black/60 text-white border-white/20 backdrop-blur-sm">
                {difficulty?.toUpperCase()} MODE
              </Badge>
              {hasAnswered && (
                <Badge
                  className={`${
                    isCorrect
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  } backdrop-blur-sm transition-all duration-500`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              )}
            </div>

            {/* Indicador de carga para Street View */}
            {/* Loading Indicator for Street View */}
            {isCheckingAnswer && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Checking answer...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Card className="shadow-xl h-full transition-all duration-300 hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Where am I?
                    </h2>
                  </div>
                  <TooltipProvider>
                    <Tooltip open={showHint} onOpenChange={setShowHint}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="space-x-2 transition-all duration-200 hover:bg-yellow-50 hover:border-yellow-300"
                          disabled={hasAnswered}
                        >
                          <Lightbulb
                            className={`w-4 h-4 ${
                              showHint ? "text-yellow-600" : ""
                            }`}
                          />
                          <span>Hint</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-4 text-base bg-yellow-50 border-yellow-200">
                        <p className="text-gray-800">
                          {currentQuestion.location.hint}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="my-6">
                  <Button
                    onClick={handleCheckAnswer}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
                    disabled={
                      hasAnswered || !selectedCoordinates || isCheckingAnswer
                    }
                    aria-label={
                      selectedCoordinates
                        ? "Check selected answer"
                        : "Select a location on the map first"
                    }
                  >
                    {isCheckingAnswer ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : selectedCoordinates ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Check Answer
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Select a location on the map
                      </>
                    )}
                  </Button>
                </div>

                {hasAnswered && distanceFromTarget !== null && (
                  <div
                    className={`mt-6 space-y-4 transition-all duration-500 ${
                      showAnswerAnimation
                        ? "animate-in slide-in-from-bottom-4"
                        : ""
                    }`}
                  >
                    <Alert
                      className={`${
                        isCorrect
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      } transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <AlertDescription className="text-lg font-semibold">
                            {isCorrect ? "Correct!" : "Incorrect!"}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>

                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Correct Location:{" "}
                          <span className="font-bold text-gray-900">
                            {currentQuestion.location.name}
                          </span>
                          , {currentQuestion.location.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Your answer was{" "}
                          <span
                            className={`font-bold ${
                              isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {distanceFromTarget.toFixed(2)} km
                          </span>{" "}
                          away
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Time: {formatTime(timeElapsed)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        nextQuestion();
                        setShowHint(false);
                      }}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
                      aria-label={
                        currentQuestionIndex < questions.length - 1
                          ? "Continue to the next question"
                          : "View final game results"
                      }
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Next Question
                        </>
                      ) : (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          View Results
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Mapa selector con mejoras */}
                {/* Map selector with enhancements */}
                <div
                  className="mt-4"
                  role="region"
                  aria-label="Map to select location"
                >
                  <PlaceSelectorMap onMarkerPlaced={setSelectedCoordinates} />

                  {!hasAnswered && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">
                          Click on the map to select your answer
                        </span>
                      </div>
                    </div>
                  )}

                  {hasAnswered && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                          <span className="font-medium text-gray-700">
                            Your Answer
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                          <span className="font-medium text-gray-700">
                            Correct
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-1 bg-red-500 rounded"
                            style={{ width: "16px" }}
                          ></div>
                          <span className="font-medium text-gray-700">
                            Distance
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
