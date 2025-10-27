"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGameStore } from "@/lib/store";
import { Lightbulb, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { PlaceSelectorMap } from "./place-selector-map";
import { StreetView } from "./street-view";

export function GameScreen() {
  const [showHint, setShowHint] = useState(false);

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

  if (!currentQuestion) return null;

  // Verificar si la respuesta es correcta basándose en la distancia (200 km o menos)
  const THRESHOLD_KM = 200;
  const isCorrect =
    hasAnswered &&
    distanceFromTarget !== null &&
    distanceFromTarget <= THRESHOLD_KM;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">GeoGuess</h1>
            <p className="text-sm text-gray-600">
              Player: <span className="font-semibold">{playerName}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2 text-base">
              Question {currentQuestionIndex + 1} / {questions.length}
            </Badge>
            <Badge className="px-4 py-2 text-base bg-gradient-to-r from-blue-600 to-green-600">
              <Trophy className="w-4 h-4 mr-2" />
              Score: {score}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900"
            style={{ height: "600px" }}
          >
            {/* <img
              src={currentQuestion.location.imageUrl}
              alt="Mystery location"
              className="w-full h-full object-cover"
            /> */}
            <StreetView />
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/60 text-white border-white/20">
                {difficulty?.toUpperCase()} MODE
              </Badge>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Card className="shadow-xl h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Where am I?
                  </h2>
                  <TooltipProvider>
                    <Tooltip open={showHint} onOpenChange={setShowHint}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="space-x-2"
                          disabled={hasAnswered}
                        >
                          <Lightbulb className="w-4 h-4" />
                          <span>Hint</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-4 text-base">
                        <p>{currentQuestion.location.hint}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="my-6">
                  <Button
                    onClick={checkAnswer}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    disabled={hasAnswered || !selectedCoordinates}
                  >
                    {selectedCoordinates
                      ? "Verificar Respuesta"
                      : "Selecciona una ubicación en el mapa"}
                  </Button>
                </div>

                {hasAnswered && distanceFromTarget !== null && (
                  <div className="mt-6 space-y-4">
                    <div
                      className={`p-4 rounded-lg ${
                        isCorrect
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-red-50 border-2 border-red-200"
                      }`}
                    >
                      <p
                        className={`text-lg font-semibold ${
                          isCorrect ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {isCorrect ? "¡Correcto!" : "¡Incorrecto!"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        La ubicación correcta es{" "}
                        <span className="font-bold">
                          {currentQuestion.location.name}
                        </span>
                        , {currentQuestion.location.country}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Tu respuesta estuvo a{" "}
                        <span className="font-bold">
                          {distanceFromTarget.toFixed(2)} km
                        </span>{" "}
                        de distancia
                        {isCorrect
                          ? " (dentro del umbral de 200 km)"
                          : " (fuera del umbral de 200 km)"}
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        nextQuestion();
                        setShowHint(false);
                      }}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      {currentQuestionIndex < questions.length - 1
                        ? "Siguiente Pregunta"
                        : "Ver Resultados"}
                    </Button>
                  </div>
                )}

                <PlaceSelectorMap onMarkerPlaced={setSelectedCoordinates} />

                {!hasAnswered && (
                  <p className="text-xs text-gray-500 mt-2">
                    Haz clic en el mapa para seleccionar tu respuesta
                  </p>
                )}

                {hasAnswered && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                      <span className="font-medium">Tu respuesta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                      <span className="font-medium">Ubicación correcta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-1 bg-red-500"
                        style={{ width: "20px" }}
                      ></div>
                      <span className="font-medium">Distancia</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
