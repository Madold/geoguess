import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Autenticación (requerida para mantener consistencia con otros endpoints)
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

    const searchParams = request.nextUrl.searchParams;
    const rankingType = searchParams.get("type"); // global | regional | weekly | monthly
    const period = searchParams.get("period");
    const region = searchParams.get("region");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Obtener rankings
    let query = supabase
      .from("ranking")
      .select("*")
      .order("position", { ascending: true });

    if (rankingType) {
      query = query.eq("ranking_type", rankingType);
    }
    if (period) {
      query = query.eq("period", period);
    }
    if (region) {
      query = query.eq("region", region);
    }

    // paginación
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching ranking:", error);
      return NextResponse.json(
        { error: "Failed to fetch ranking", details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          entries: [],
          pagination: {
            offset,
            limit,
            count: 0,
          },
        },
        { status: 200 }
      );
    }

    // Obtener los user_ids únicos
    const userIds = Array.from(
      new Set(data.map((entry: any) => entry.user_id))
    );

    // Crear cliente admin de Supabase
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    // Obtener información de usuarios usando admin.listUsers()
    const { data: usersData, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers();

    // Crear mapa de usuarios
    const userMap = new Map();

    if (!usersError && usersData?.users) {
      usersData.users.forEach((u: any) => {
        const userName =
          u.user_metadata?.username || u.email?.split("@")[0] || "Jugador";
        userMap.set(u.id, userName);
      });
    } else {
      console.error("Error fetching users:", usersError);
      // Si falla, usar IDs como fallback
      userIds.forEach((id: string) => {
        userMap.set(id, String(id).slice(0, 8));
      });
    }

    // Mapear datos incluyendo el nombre del usuario
    const mappedEntries = data.map((entry: any) => {
      return {
        id: entry.id,
        user_id: entry.user_id,
        user_name:
          userMap.get(entry.user_id) || String(entry.user_id).slice(0, 8),
        ranking_type: entry.ranking_type,
        position: entry.position,
        score: entry.score,
        period: entry.period,
        region: entry.region,
        calculation_date: entry.calculation_date,
      };
    });

    return NextResponse.json(
      {
        entries: mappedEntries,
        pagination: {
          offset,
          limit,
          count: mappedEntries.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in ranking endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
