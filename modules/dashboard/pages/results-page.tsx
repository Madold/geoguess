"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/store";
import { Trophy, Home, RotateCcw, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsScreenProps {
  onPlayAgain: () => void;
}

export function ResultsPage({ onPlayAgain }: ResultsScreenProps) {
  const {
    score,
    questions,
    playerName,
    difficulty,
    resetGame,
    questionResults,
    totalGameTime,
  } = useGameStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const [savedGameData, setSavedGameData] = useState<any>(null);
  const hasSaved = useRef(false);

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Auto-save the game upon component mount
  useEffect(() => {
    const saveGame = async () => {
      // Prevent multiple saving attempts (protection against Strict Mode)
      if (hasSaved.current) return;

      hasSaved.current = true;
      setIsSaving(true);
      try {
        const response = await fetch("/api/game/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            difficulty,
            score,
            totalQuestions,
            totalTime: totalGameTime,
            questions: questionResults,
            playerName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Translated error message: "Error saving game"
          throw new Error(data.error || "Error saving game");
        }

        setSavedGameData(data.data);
        setGameSaved(true);
        toast({
          // Translated toast title: "Game Saved!"
          title: "Game Saved!",
          // Translated toast description: "Your results have been successfully saved."
          description: "Your results have been successfully saved.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error saving game:", error);
        hasSaved.current = false; // Allow retry if there's an error
        toast({
          // Translated toast title: "Error"
          title: "Error",
          // Translated toast description: "The game could not be saved. You can try again."
          description: "The game could not be saved. You can try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Function to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  let message = "";
  let emoji = "";
  if (percentage === 100) {
    // Translated message: "Perfect! You are a master of geography!"
    message = "Perfect! You are a master of geography!";
    emoji = "🏆";
  } else if (percentage >= 80) {
    // Translated message: "Excellent work! You know your world!"
    message = "Excellent work! You know your world!";
    emoji = "🌟";
  } else if (percentage >= 60) {
    // Translated message: "Good job! Keep exploring!"
    message = "Good job! Keep exploring!";
    emoji = "👏";
  } else if (percentage >= 40) {
    // Translated message: "Not bad! Practice makes perfect!"
    message = "Not bad! Practice makes perfect!";
    emoji = "📚";
  } else {
    // Translated message: "Keep learning and try again!"
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
          <CardTitle className="text-4xl font-bold">
            {/* Translated title: "Game Over!" */}
            Game Over!
          </CardTitle>

          {/* Saving Indicator */}
          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              {/* Translated text: "Saving results..." */}
              <span>Saving results...</span>
            </div>
          )}
          {gameSaved && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <Save className="w-4 h-4" />
              {/* Translated text: "Results saved" */}
              <span>Results saved</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">
              {/* Translated text: "Well done," */}
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
            {/* Translated title: "Your Performance:" */}
            <h3 className="font-semibold text-gray-900 mb-3">
              Your Performance:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                {/* Translated label: "Difficulty:" */}
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                {/* Translated label: "Correct Answers:" */}
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-semibold text-green-600">{score}</span>
              </div>
              <div className="flex justify-between">
                {/* Translated label: "Incorrect Answers:" */}
                <span className="text-gray-600">Incorrect Answers:</span>
                <span className="font-semibold text-red-600">
                  {totalQuestions - score}
                </span>
              </div>
              <div className="flex justify-between">
                {/* Translated label: "Accuracy:" */}
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold text-blue-600">
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                {/* Translated label: "Total Time:" */}
                <span className="text-gray-600">Total Time:</span>
                <span className="font-semibold text-purple-600">
                  {formatTime(totalGameTime)}
                </span>
              </div>
              {savedGameData && (
                <>
                  <div className="flex justify-between">
                    {/* Translated label: "Average Distance:" */}
                    <span className="text-gray-600">Average Distance:</span>
                    <span className="font-semibold text-orange-600">
                      {savedGameData.detailedStatistics.averageDistance.toFixed(
                        2
                      )}{" "}
                      km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    {/* Translated label: "Game ID:" */}
                    <span className="text-gray-600">Game ID:</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      #{savedGameData.gameId}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={isSaving}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {/* Translated button text: "Play Again" */}
              Play Again
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              disabled={isSaving}
            >
              <Home className="w-5 h-5 mr-2" />
              {/* Translated button text: "Home" */}
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
