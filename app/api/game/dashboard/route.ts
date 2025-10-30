import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    // Obtener todos los juegos del usuario desde game_history
    const { data: gameHistory, error: historyError } = await supabase
      .from("game_history")
      .select("*")
      .eq("user_id", user.id)
      .order("game_date", { ascending: false });

    if (historyError) {
      console.error("Error fetching game history:", historyError);
      return NextResponse.json(
        {
          error: "Failed to fetch game history",
          details: historyError.message,
        },
        { status: 500 }
      );
    }

    // Si no hay juegos, devolver valores por defecto
    if (!gameHistory || gameHistory.length === 0) {
      return NextResponse.json(
        {
          bestScore: 0,
          averageErrorKm: 0,
          gamesPlayed: 0,
          globalRank: null,
          regionalStrengths: [],
        },
        { status: 200 }
      );
    }

    // Calcular mejor puntuación
    const bestScore = Math.max(...gameHistory.map((g) => g.final_score));

    // Calcular juegos jugados
    const gamesPlayed = gameHistory.length;

    // Calcular error promedio en km desde detailed_statistics
    const totalErrorDistance = gameHistory.reduce((sum, g) => {
      const avgDistance = g.detailed_statistics?.averageDistance || 0;
      return sum + avgDistance;
    }, 0);
    const averageErrorKm =
      gamesPlayed > 0
        ? parseFloat((totalErrorDistance / gamesPlayed).toFixed(1))
        : 0;

    // Obtener ranking global del usuario
    const { data: rankingData, error: rankingError } = await supabase
      .from("ranking")
      .select("position")
      .eq("user_id", user.id)
      .eq("ranking_type", "global")
      .order("calculation_date", { ascending: false })
      .limit(1)
      .single();

    const globalRank = rankingData?.position || null;

    // Fortalezas regionales: calcular a partir de detailed_statistics -> questions -> country
    const regionMap = new Map<
      string,
      { totalDistance: number; count: number }
    >();

    gameHistory.forEach((g) => {
      const questions = g.detailed_statistics?.questions || [];
      questions.forEach((q: any) => {
        const country = q.country || "Unknown";
        // Mapear país a región (simplificado)
        let region = "Otros";
        if (["UK", "France", "Italy", "Spain", "Germany"].includes(country)) {
          region = "Europa";
        } else if (["USA", "Canada", "Mexico"].includes(country)) {
          region = "N. América";
        } else if (["Japan", "China", "India", "Thailand"].includes(country)) {
          region = "Asia";
        } else if (["Egypt", "South Africa", "Nigeria"].includes(country)) {
          region = "África";
        } else if (["Brazil", "Argentina", "Chile"].includes(country)) {
          region = "S. América";
        } else if (["Australia", "New Zealand"].includes(country)) {
          region = "Oceanía";
        }

        if (!regionMap.has(region)) {
          regionMap.set(region, { totalDistance: 0, count: 0 });
        }
        const current = regionMap.get(region)!;
        current.totalDistance += q.distance || 0;
        current.count++;
      });
    });

    const regionalStrengths = Array.from(regionMap.entries())
      .map(([region, data]) => {
        const avgDistance =
          data.count > 0 ? data.totalDistance / data.count : 0;
        // Convertir a "accuracy" (0-100): menos distancia = más accuracy
        // Fórmula simple: max 100 a 0km, min 0 a 10000km+
        const accuracy = Math.max(
          0,
          Math.min(100, Math.round(100 - (avgDistance / 10000) * 100))
        );
        return { region, accuracy };
      })
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 4);

    return NextResponse.json(
      {
        bestScore,
        averageErrorKm,
        gamesPlayed,
        globalRank,
        regionalStrengths,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in dashboard endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
