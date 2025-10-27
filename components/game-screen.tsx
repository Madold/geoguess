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

export function GameScreen() {
  const [showHint, setShowHint] = useState(false);

  const {
    questions,
    currentQuestionIndex,
    score,
    hasAnswered,
    selectedAnswer,
    selectAnswer,
    nextQuestion,
    playerName,
    difficulty,
  } = useGameStore();

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  const isCorrect =
    hasAnswered && selectedAnswer === currentQuestion.correctAnswer;

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
            <img
              src={currentQuestion.location.imageUrl}
              alt="Mystery location"
              className="w-full h-full object-cover"
            />
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
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    disabled={hasAnswered}
                  >
                    Check Answer
                  </Button>
                </div>

                <PlaceSelectorMap />

                {/* <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQuestion.correctAnswer;
                    const showAsCorrect = hasAnswered && isCorrectOption;
                    const showAsIncorrect = hasAnswered && isSelected && !isCorrectOption;

                    return (
                      <Button
                        key={option}
                        onClick={() => !hasAnswered && selectAnswer(option)}
                        disabled={hasAnswered}
                        variant={showAsCorrect ? "default" : showAsIncorrect ? "destructive" : "outline"}
                        className={`w-full h-16 text-lg font-medium justify-between transition-all ${
                          showAsCorrect ? 'bg-green-600 hover:bg-green-700' : ''
                        } ${
                          !hasAnswered && 'hover:bg-blue-50 hover:border-blue-400'
                        }`}
                      >
                        <span>{option}</span>
                        {showAsCorrect && <CheckCircle2 className="w-6 h-6" />}
                        {showAsIncorrect && <XCircle className="w-6 h-6" />}
                      </Button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                      <p className={`text-lg font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        The correct answer is <span className="font-bold">{currentQuestion.correctAnswer}</span>, {currentQuestion.location.country}
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        nextQuestion();
                        setShowHint(false);
                      }}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </Button>
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
