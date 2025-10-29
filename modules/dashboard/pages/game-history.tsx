"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Trophy,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MapPin,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GameHistoryItem {
  id: number;
  game_date: string;
  final_score: number;
  game_mode_name: string;
  difficulty_level: string;
  total_time_seconds: number;
  detailed_statistics?: {
    accuracy?: number;
    questions?: Array<{
      country?: string;
      locationName?: string;
    }>;
  };
}

interface Statistics {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
}

interface GameHistoryPageProps {
  onBack: () => void;
}

export const GameHistoryPage = ({ onBack }: GameHistoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [gameHistoryData, setGameHistoryData] = useState<GameHistoryItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Cargar datos desde la API
  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/game/history");

        if (!response.ok) {
          throw new Error("Failed to fetch game history");
        }

        const data = await response.json();
        setGameHistoryData(data.gameHistory || []);
        setStatistics(data.statistics || null);
      } catch (err) {
        console.error("Error fetching game history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load game history"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  // Extraer región de las estadísticas detalladas
  const getRegionFromGame = (game: GameHistoryItem): string => {
    const questions = game.detailed_statistics?.questions || [];
    if (questions.length > 0) {
      return questions[0].country || "Unknown";
    }
    return "Unknown";
  };

  // Filtrar datos
  const filteredData = gameHistoryData.filter((game) => {
    const region = getRegionFromGame(game);
    const matchesSearch =
      game.game_mode_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || game.difficulty_level === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Estado de carga */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading game history...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && !isLoading && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Mensaje cuando no hay datos */}
        {!isLoading && !error && gameHistoryData.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="py-20 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No games played yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start playing to see your game history here!
              </p>
              <Button onClick={onBack}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        )}

        {/* Contenido principal - solo se muestra si hay datos */}
        {!isLoading && !error && gameHistoryData.length > 0 && (
          <>
            {/* Estadísticas resumidas */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Total Games
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {statistics?.totalGames || 0}
                  </p>
                  <p className="text-sm text-gray-600">games played</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Star className="w-8 h-8 text-blue-500" />
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      Best Score
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {(statistics?.bestScore || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">maximum points</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="w-8 h-8 text-green-500" />
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Average Score
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {(statistics?.averageScore || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">points per game</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Target className="w-8 h-8 text-purple-500" />
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      Accuracy
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {statistics?.averageAccuracy || 0}%
                  </p>
                  <p className="text-sm text-gray-600">average precision</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros y búsqueda */}
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by game mode or region..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select
                      value={difficultyFilter}
                      onValueChange={setDifficultyFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de historial */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Game History ({filteredData.length} games)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Game Mode</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Accuracy</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Region</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((game) => {
                        const region = getRegionFromGame(game);
                        const accuracy =
                          game.detailed_statistics?.accuracy || 0;

                        return (
                          <TableRow key={game.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{formatDate(game.game_date)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {game.game_mode_name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getDifficultyColor(
                                  game.difficulty_level
                                )}
                              >
                                {game.difficulty_level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="font-semibold">
                                  {game.final_score.toLocaleString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4 text-green-500" />
                                <span>{accuracy}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span>
                                  {formatTime(game.total_time_seconds)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>{region}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                      of {filteredData.length} games
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
