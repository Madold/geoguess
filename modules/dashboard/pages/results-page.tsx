"use client";

import { useEffect, useState } from "react";
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

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Guardar el juego automáticamente al montar el componente
  useEffect(() => {
    const saveGame = async () => {
      if (gameSaved) return; // Evitar guardar múltiples veces

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
          throw new Error(data.error || "Error al guardar el juego");
        }

        setSavedGameData(data.data);
        setGameSaved(true);
        toast({
          title: "¡Juego guardado!",
          description: "Tus resultados han sido guardados exitosamente.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error al guardar el juego:", error);
        toast({
          title: "Error",
          description:
            "No se pudo guardar el juego. Puedes intentar nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveGame();
  }, [
    difficulty,
    score,
    totalQuestions,
    totalGameTime,
    questionResults,
    playerName,
    gameSaved,
    toast,
  ]);

  // Función para formatear el tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  let message = "";
  let emoji = "";
  if (percentage === 100) {
    message = "¡Perfecto! ¡Eres un maestro de la geografía!";
    emoji = "🏆";
  } else if (percentage >= 80) {
    message = "¡Excelente trabajo! ¡Conoces tu mundo!";
    emoji = "🌟";
  } else if (percentage >= 60) {
    message = "¡Buen trabajo! ¡Sigue explorando!";
    emoji = "👏";
  } else if (percentage >= 40) {
    message = "¡No está mal! ¡La práctica hace al maestro!";
    emoji = "📚";
  } else {
    message = "¡Sigue aprendiendo e inténtalo de nuevo!";
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
            ¡Juego Terminado!
          </CardTitle>

          {/* Indicador de guardado */}
          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando resultados...</span>
            </div>
          )}
          {gameSaved && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <Save className="w-4 h-4" />
              <span>Resultados guardados</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">
              ¡Bien hecho,{" "}
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
              Tu Rendimiento:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dificultad:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Respuestas Correctas:</span>
                <span className="font-semibold text-green-600">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Respuestas Incorrectas:</span>
                <span className="font-semibold text-red-600">
                  {totalQuestions - score}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precisión:</span>
                <span className="font-semibold text-blue-600">
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo Total:</span>
                <span className="font-semibold text-purple-600">
                  {formatTime(totalGameTime)}
                </span>
              </div>
              {savedGameData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distancia Promedio:</span>
                    <span className="font-semibold text-orange-600">
                      {savedGameData.detailedStatistics.averageDistance.toFixed(
                        2
                      )}{" "}
                      km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID del Juego:</span>
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
              Jugar de Nuevo
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              disabled={isSaving}
            >
              <Home className="w-5 h-5 mr-2" />
              Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
