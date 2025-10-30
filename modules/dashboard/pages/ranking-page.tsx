"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Award, Globe2, MapPin, Trophy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type RankingType = "global" | "regional" | "weekly" | "monthly";

interface RankingEntry {
  id: number;
  userId: string;
  userName: string;
  rankingType: RankingType;
  position: number;
  score: number;
  period?: string | null;
  region?: string | null;
}

const MOCK_RANKING: RankingEntry[] = [
  {
    id: 1,
    userId: "u1",
    userName: "Ana",
    rankingType: "global",
    position: 1,
    score: 98765,
    period: null,
    region: null,
  },
  {
    id: 2,
    userId: "u2",
    userName: "Luis",
    rankingType: "global",
    position: 2,
    score: 95600,
    period: null,
    region: null,
  },
  {
    id: 3,
    userId: "u3",
    userName: "Carla",
    rankingType: "global",
    position: 3,
    score: 94010,
    period: null,
    region: null,
  },
  {
    id: 4,
    userId: "u4",
    userName: "Diego",
    rankingType: "global",
    position: 4,
    score: 90120,
    period: null,
    region: null,
  },
  {
    id: 5,
    userId: "u5",
    userName: "Sofía",
    rankingType: "global",
    position: 5,
    score: 88700,
    period: null,
    region: null,
  },
  // Regional
  {
    id: 6,
    userId: "u6",
    userName: "Pablo",
    rankingType: "regional",
    position: 1,
    score: 81230,
    period: null,
    region: "Europa",
  },
  {
    id: 7,
    userId: "u7",
    userName: "Elena",
    rankingType: "regional",
    position: 2,
    score: 79990,
    period: null,
    region: "Europa",
  },
  {
    id: 8,
    userId: "u8",
    userName: "María",
    rankingType: "regional",
    position: 1,
    score: 83450,
    period: null,
    region: "LatAm",
  },
  {
    id: 9,
    userId: "u9",
    userName: "Jorge",
    rankingType: "regional",
    position: 2,
    score: 82010,
    period: null,
    region: "LatAm",
  },
  // Weekly
  {
    id: 10,
    userId: "u10",
    userName: "Valeria",
    rankingType: "weekly",
    position: 1,
    score: 22100,
    period: "2025-W44",
    region: null,
  },
  {
    id: 11,
    userId: "u11",
    userName: "Tomás",
    rankingType: "weekly",
    position: 2,
    score: 20950,
    period: "2025-W44",
    region: null,
  },
  {
    id: 12,
    userId: "u12",
    userName: "Irene",
    rankingType: "weekly",
    position: 3,
    score: 20540,
    period: "2025-W44",
    region: null,
  },
  // Monthly
  {
    id: 13,
    userId: "u13",
    userName: "Julián",
    rankingType: "monthly",
    position: 1,
    score: 70210,
    period: "2025-10",
    region: null,
  },
  {
    id: 14,
    userId: "u14",
    userName: "Marta",
    rankingType: "monthly",
    position: 2,
    score: 68800,
    period: "2025-10",
    region: null,
  },
  {
    id: 15,
    userId: "u15",
    userName: "Rosa",
    rankingType: "monthly",
    position: 3,
    score: 67110,
    period: "2025-10",
    region: null,
  },
];

const REGIONS = [
  "Global",
  "Europa",
  "LatAm",
  "Norteamérica",
  "Asia",
  "África",
  "Oceanía",
];

export const RankingPage = () => {
  const router = useRouter();
  const [rankingType, setRankingType] = useState<RankingType>("global");
  const [region, setRegion] = useState<string>("Global");
  const [period, setPeriod] = useState<string>("Actual");
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.set("type", rankingType);
        if (rankingType === "regional" && region && region !== "Global") {
          params.set("region", region);
        }
        if (
          (rankingType === "weekly" || rankingType === "monthly") &&
          period &&
          period !== "Actual"
        ) {
          params.set("period", period);
        }
        params.set("limit", "50");

        const res = await fetch(`/api/game/ranking?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("No se pudo obtener el ranking");
        const json = await res.json();
        const apiEntries = (json.entries || []) as Array<any>;
        const mapped: RankingEntry[] = apiEntries.map((e) => ({
          id: e.id,
          userId: e.user_id,
          userName:
            e.user_name ||
            (e.user_id ? String(e.user_id).slice(0, 8) : "Jugador"),
          rankingType: e.ranking_type,
          position: e.position,
          score: e.score,
          period: e.period,
          region: e.region,
        }));
        setEntries(mapped);
      } catch (err) {
        console.error(err);
        setError("Error cargando ranking");
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
    return () => controller.abort();
  }, [rankingType, region, period]);

  const filtered = useMemo(() => {
    let list = entries.filter((r) => r.rankingType === rankingType);
    if (rankingType === "regional") {
      list = list.filter((r) =>
        region === "Global" ? true : r.region === region
      );
    }
    if (rankingType === "weekly" || rankingType === "monthly") {
      // En mock usamos el primer periodo disponible si no es "Actual"
      list = list.filter((r) =>
        period === "Actual" ? true : r.period === period
      );
    }
    return list.sort((a, b) => a.position - b.position).slice(0, 10);
  }, [rankingType, region, period, entries]);

  const topBarData = useMemo(
    () =>
      filtered.map((e) => ({
        name: `#${e.position} ${e.userName}`,
        score: e.score,
      })),
    [filtered]
  );

  // Se eliminaron gráficos de distribución regional y tendencia semanal

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="px-2 h-9"
            onClick={() => router.back()}
          >
            Volver
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Ranking</h1>
          <p className="text-gray-600 mt-2">
            Top jugadores por tipo, período y región
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Cargando ranking...</span>
          </div>
        )}
        {error && <div className="text-sm text-red-600 mb-6">{error}</div>}

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={rankingType === "global" ? "default" : "secondary"}
              onClick={() => setRankingType("global")}
            >
              Global
            </Button>
            <Button
              variant={rankingType === "regional" ? "default" : "secondary"}
              onClick={() => setRankingType("regional")}
            >
              Regional
            </Button>
            <Button
              variant={rankingType === "weekly" ? "default" : "secondary"}
              onClick={() => setRankingType("weekly")}
            >
              Semanal
            </Button>
            <Button
              variant={rankingType === "monthly" ? "default" : "secondary"}
              onClick={() => setRankingType("monthly")}
            >
              Mensual
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {rankingType === "regional" && (
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Región" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {(rankingType === "weekly" || rankingType === "monthly") && (
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actual">Actual</SelectItem>
                  <SelectItem value="2025-W44">2025-W44</SelectItem>
                  <SelectItem value="2025-10">2025-10</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Resumen superior */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Top 1
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {filtered[0]?.userName ?? "N/D"}
              </p>
              <p className="text-sm text-gray-600">
                {filtered[0]?.score
                  ? `${filtered[0].score.toLocaleString()} pts`
                  : "N/D"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Award className="w-8 h-8 text-green-500" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Top 3 Promedio
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {filtered.length
                  ? Math.round(
                      filtered.slice(0, 3).reduce((a, b) => a + b.score, 0) /
                        Math.min(3, filtered.length)
                    ).toLocaleString()
                  : "N/D"}
              </p>
              <p className="text-sm text-gray-600">puntos</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Globe2 className="w-8 h-8 text-blue-500" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Tipo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 capitalize">
                {rankingType}
              </p>
              <p className="text-sm text-gray-600">vista actual</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <MapPin className="w-8 h-8 text-purple-500" />
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Ámbito
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {rankingType === "regional" ? region : "Global"}
              </p>
              <p className="text-sm text-gray-600">
                {rankingType === "weekly" || rankingType === "monthly"
                  ? period === "Actual"
                    ? "Período actual"
                    : period
                  : "sin período"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfica principal: Top 10 por puntuación */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle>Top 10 por puntuación</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ score: { label: "Puntuación", color: "#22c55e" } }}
              className="h-72"
            >
              <BarChart data={topBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="score"
                  fill="var(--color-score)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Tabla de posiciones</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-semibold">N/D</p>
                <p className="text-sm mt-2">
                  No hay datos de ranking disponibles
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Jugador</TableHead>
                      <TableHead>Puntaje</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Región</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">
                          {e.position}
                        </TableCell>
                        <TableCell>{e.userName}</TableCell>
                        <TableCell>{e.score.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">
                          {e.rankingType}
                        </TableCell>
                        <TableCell>{e.period ?? "-"}</TableCell>
                        <TableCell>
                          {e.region ??
                            (rankingType === "regional" ? "-" : "Global")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankingPage;
