"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { Trophy, Home, RotateCcw } from "lucide-react";

interface ResultsScreenProps {
  onPlayAgain: () => void;
}

export function ResultsPage({ onPlayAgain }: ResultsScreenProps) {
  const { score, questions, playerName, difficulty, resetGame } =
    useGameStore();
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  let message = "";
  let emoji = "";
  if (percentage === 100) {
    message = "Perfect! You are a geography master!";
    emoji = "🏆";
  } else if (percentage >= 80) {
    message = "Excellent work! You know your world!";
    emoji = "🌟";
  } else if (percentage >= 60) {
    message = "Good job! Keep exploring!";
    emoji = "👏";
  } else if (percentage >= 40) {
    message = "Not bad! Practice makes perfect!";
    emoji = "📚";
  } else {
    message = "Keep learning and try again!";
    emoji = "🌍";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-full">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">
              Well done,{" "}
              <span className="font-bold text-gray-900">{playerName}</span>!
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {score} / {totalQuestions}
            </p>
            <p className="text-2xl font-semibold text-gray-700">
              {percentage}%
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center">
            <p className="text-3xl mb-2">{emoji}</p>
            <p className="text-xl font-semibold text-gray-800">{message}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Your Performance:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-semibold text-green-600">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Incorrect Answers:</span>
                <span className="font-semibold text-red-600">
                  {totalQuestions - score}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-blue-600">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
