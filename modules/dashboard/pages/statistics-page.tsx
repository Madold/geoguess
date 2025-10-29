"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Trophy,
  Target,
  Play,
  Clock,
  BarChart3,
  Award,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StatisticsData {
  summary: {
    bestScore: number;
    averageErrorKm: number;
    gamesPlayed: number;
    totalTimeSeconds: number;
  };
  byMode: Array<{ mode: string; partidas: number; promedio: number }>;
  byDifficulty: Array<{ name: string; value: number; color: string }>;
  lastGames: Array<{ label: string; score: number }>;
  regionalStrengths: Array<{ region: string; accuracy: number }>;
}

export const StatisticsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StatisticsData | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/game/statistics");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Error al cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const difficultyConfig = useMemo(() => {
    if (!data) return {};
    const config: Record<string, { label: string }> = {};
    data.byDifficulty.forEach((d) => {
      config[d.name] = { label: d.name };
    });
    return config;
  }, [data]);

  const totalTime = useMemo(() => {
    if (!data) return "0h 0m 0s";
    const sec = data.summary.totalTimeSeconds;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Error al cargar datos"}
          </p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const { summary, byMode, byDifficulty, lastGames, regionalStrengths } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="px-2 h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mis Estadísticas</h1>
          <p className="text-gray-600 mt-2">
            Resumen y análisis de tu rendimiento
          </p>
        </div>

        {/* Resumen */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Mejor Puntuación
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {summary.bestScore.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">puntos</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-green-500" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Precisión Media
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {summary.averageErrorKm} km
              </p>
              <p className="text-sm text-gray-600">error promedio</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Play className="w-8 h-8 text-blue-500" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Actividad
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {summary.gamesPlayed}
              </p>
              <p className="text-sm text-gray-600">partidas jugadas</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-purple-500" />
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Tiempo Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{totalTime}</p>
              <p className="text-sm text-gray-600">de juego</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Últimas partidas (línea) */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Evolución de Puntuación (últimas partidas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ score: { label: "Puntuación", color: "#16a34a" } }}
                className="h-72"
              >
                <LineChart data={lastGames}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Distribución por dificultad (dona) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Partidas por Dificultad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={difficultyConfig} className="h-72">
                <PieChart>
                  <Pie
                    data={byDifficulty}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {byDifficulty.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Fortalezas regionales */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle>Fortalezas Regionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {regionalStrengths.map((r) => (
                <div key={r.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {r.region}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {r.accuracy}%
                    </span>
                  </div>
                  <Progress value={r.accuracy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento por modo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Rendimiento por Modo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ promedio: { label: "Promedio", color: "#22c55e" } }}
              className="h-80"
            >
              <BarChart data={byMode}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mode" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="promedio"
                  fill="var(--color-promedio)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {byMode.map((m) => (
                <div key={m.mode} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.mode}</span>
                    <Badge variant="secondary">{m.partidas} partidas</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Promedio: {m.promedio.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
