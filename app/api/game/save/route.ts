import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const {
      difficulty,
      score,
      totalQuestions,
      totalTime,
      questions,
      playerName,
    } = body;

    // Validar datos requeridos
    if (!difficulty || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Calcular distancia total de error
    const totalErrorDistance = questions.reduce(
      (sum: number, q: any) => sum + (q.distance || 0),
      0
    );

    // Generar identificador de sesión único
    const sessionIdentifier = `${user.id}-${Date.now()}`;

    // Guardar en la tabla 'game'
    const { data: gameData, error: gameError } = await supabase
      .from("game")
      .insert({
        user_id: user.id,
        session_identifier: sessionIdentifier,
        game_mode_name: "GeoGuess",
        difficulty_level: difficulty,
        total_score: score,
        total_error_distance: totalErrorDistance,
        total_attempts: totalQuestions,
        start_time: new Date(Date.now() - totalTime * 1000).toISOString(),
        end_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error al guardar el juego:", gameError);
      return NextResponse.json(
        { error: "Error al guardar el juego", details: gameError.message },
        { status: 500 }
      );
    }

    // Preparar estadísticas detalladas
    const detailedStatistics = {
      playerName,
      questions: questions.map((q: any, index: number) => ({
        questionNumber: index + 1,
        locationName: q.locationName,
        country: q.country,
        distance: q.distance,
        isCorrect: q.isCorrect,
        timeSpent: q.timeSpent || 0,
        userCoordinates: q.userCoordinates,
        correctCoordinates: q.correctCoordinates,
      })),
      accuracy: Math.round((score / totalQuestions) * 100),
      averageDistance: totalErrorDistance / totalQuestions,
    };

    // Guardar en la tabla 'game_history'
    const { data: historyData, error: historyError } = await supabase
      .from("game_history")
      .insert({
        user_id: user.id,
        game_id: gameData.id,
        game_date: new Date().toISOString(),
        final_score: score,
        game_mode_name: "GeoGuess",
        difficulty_level: difficulty,
        total_time_seconds: totalTime,
        detailed_statistics: detailedStatistics,
      })
      .select()
      .single();

    if (historyError) {
      console.error("Error al guardar el historial:", historyError);
      return NextResponse.json(
        {
          error: "Error al guardar el historial",
          details: historyError.message,
        },
        { status: 500 }
      );
    }

    // Retornar los datos guardados
    return NextResponse.json({
      success: true,
      data: {
        gameId: gameData.id,
        historyId: historyData.id,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        difficulty,
        totalTime,
        detailedStatistics,
      },
    });
  } catch (error) {
    console.error("Error en el endpoint:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
