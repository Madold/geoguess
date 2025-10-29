import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Función auxiliar para actualizar rankings
async function updateRankings(
  supabase: any,
  userId: string,
  newScore: number,
  difficulty: string
) {
  try {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // 1. Ranking Global - Acumulativo
    await upsertRanking(
      supabase,
      userId,
      "global",
      newScore,
      null,
      null,
      currentDate
    );

    // 2. Ranking por Dificultad - Acumulativo
    await upsertRanking(
      supabase,
      userId,
      "difficulty",
      newScore,
      null,
      difficulty,
      currentDate
    );

    // 3. Ranking Mensual
    await upsertRanking(
      supabase,
      userId,
      "monthly",
      newScore,
      currentMonth,
      null,
      currentDate
    );

    // 4. Ranking Mensual por Dificultad
    await upsertRanking(
      supabase,
      userId,
      "monthly-difficulty",
      newScore,
      currentMonth,
      difficulty,
      currentDate
    );

    // Después de actualizar los scores, recalcular las posiciones
    await recalculatePositions(supabase, "global", null, null);
    await recalculatePositions(supabase, "difficulty", null, difficulty);
    await recalculatePositions(supabase, "monthly", currentMonth, null);
    await recalculatePositions(
      supabase,
      "monthly-difficulty",
      currentMonth,
      difficulty
    );
  } catch (error) {
    console.error("Error al actualizar rankings:", error);
    // No lanzamos el error para que no falle el guardado del juego
  }
}

// Función para insertar o actualizar un registro de ranking
async function upsertRanking(
  supabase: any,
  userId: string,
  rankingType: string,
  newScore: number,
  period: string | null,
  region: string | null,
  calculationDate: Date
) {
  // Buscar registro existente
  let query = supabase
    .from("ranking")
    .select("*")
    .eq("user_id", userId)
    .eq("ranking_type", rankingType);

  // Manejar comparaciones con NULL correctamente
  if (period !== null) {
    query = query.eq("period", period);
  } else {
    query = query.is("period", null);
  }

  if (region !== null) {
    query = query.eq("region", region);
  } else {
    query = query.is("region", null);
  }

  const { data: existingRanking, error: selectError } = await query.single();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error al buscar ranking existente:", selectError);
  }

  if (existingRanking) {
    // Actualizar score acumulativo
    const updatedScore = existingRanking.score + newScore;
    const { error: updateError } = await supabase
      .from("ranking")
      .update({
        score: updatedScore,
        calculation_date: calculationDate.toISOString(),
      })
      .eq("id", existingRanking.id);

    if (updateError) {
      console.error("Error al actualizar ranking:", updateError);
    }
  } else {
    // Insertar nuevo registro
    const { error: insertError } = await supabase.from("ranking").insert({
      user_id: userId,
      ranking_type: rankingType,
      score: newScore,
      period: period,
      region: region,
      position: 1, // Se recalculará después con la posición correcta
      calculation_date: calculationDate.toISOString(),
    });

    if (insertError) {
      console.error("Error al insertar ranking:", insertError);
    }
  }
}

// Función para recalcular posiciones en un tipo de ranking
async function recalculatePositions(
  supabase: any,
  rankingType: string,
  period: string | null,
  region: string | null
) {
  // Obtener todos los rankings del tipo especificado ordenados por score
  let query = supabase
    .from("ranking")
    .select("*")
    .eq("ranking_type", rankingType)
    .order("score", { ascending: false });

  // Manejar comparaciones con NULL correctamente
  if (period !== null) {
    query = query.eq("period", period);
  } else {
    query = query.is("period", null);
  }

  if (region !== null) {
    query = query.eq("region", region);
  } else {
    query = query.is("region", null);
  }

  const { data: rankings, error: queryError } = await query;

  if (queryError) {
    console.error("Error al obtener rankings:", queryError);
    return;
  }

  if (rankings && rankings.length > 0) {
    // Actualizar posiciones
    const updates = rankings.map((ranking: any, index: number) => ({
      id: ranking.id,
      position: index + 1,
    }));

    // Actualizar cada registro con su nueva posición
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("ranking")
        .update({ position: update.position })
        .eq("id", update.id);

      if (updateError) {
        console.error("Error al actualizar posición:", updateError);
      }
    }
  }
}

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

    // Actualizar rankings
    await updateRankings(supabase, user.id, score, difficulty);

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
