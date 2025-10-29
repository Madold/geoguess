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

    // Obtener parámetros de búsqueda opcionales
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Construir la query
    let query = supabase
      .from("game_history")
      .select("*")
      .eq("user_id", user.id)
      .order("game_date", { ascending: false });

    // Aplicar filtros opcionales
    if (difficulty && difficulty !== "all") {
      query = query.eq("difficulty_level", difficulty);
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1);

    // Ejecutar la query
    const { data: gameHistory, error: queryError } = await query;

    if (queryError) {
      console.error("Error fetching game history:", queryError);
      return NextResponse.json(
        { error: "Failed to fetch game history", details: queryError.message },
        { status: 500 }
      );
    }

    // Calcular estadísticas resumidas
    const { data: allGames, error: statsError } = await supabase
      .from("game_history")
      .select("final_score, detailed_statistics")
      .eq("user_id", user.id);

    if (statsError) {
      console.error("Error fetching statistics:", statsError);
      return NextResponse.json(
        {
          gameHistory,
          statistics: null,
        },
        { status: 200 }
      );
    }

    // Calcular estadísticas
    const statistics = {
      totalGames: allGames.length,
      averageScore:
        allGames.length > 0
          ? Math.round(
              allGames.reduce((sum, game) => sum + game.final_score, 0) /
                allGames.length
            )
          : 0,
      bestScore:
        allGames.length > 0
          ? Math.max(...allGames.map((game) => game.final_score))
          : 0,
      averageAccuracy:
        allGames.length > 0
          ? Math.round(
              allGames.reduce((sum, game) => {
                const accuracy = game.detailed_statistics?.accuracy || 0;
                return sum + accuracy;
              }, 0) / allGames.length
            )
          : 0,
    };

    return NextResponse.json(
      {
        gameHistory,
        statistics,
        pagination: {
          offset,
          limit,
          total: allGames.length,
          hasMore: offset + limit < allGames.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in game history endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
