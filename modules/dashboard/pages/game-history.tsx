"use client";

import { useState } from "react";
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
} from "lucide-react";

interface GameHistoryItem {
  id: number;
  gameDate: string;
  finalScore: number;
  gameModeName: string;
  difficultyLevel: string;
  totalTimeSeconds: number;
  accuracy: number;
  region: string;
}

interface GameHistoryPageProps {
  onBack: () => void;
}

export const GameHistoryPage = ({ onBack }: GameHistoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos hardcodeados de ejemplo
  const gameHistoryData: GameHistoryItem[] = [
    {
      id: 1,
      gameDate: "2024-01-15T14:30:00Z",
      finalScore: 24990,
      gameModeName: "Classic Mode",
      difficultyLevel: "Expert",
      totalTimeSeconds: 300,
      accuracy: 95,
      region: "Europe",
    },
    {
      id: 2,
      gameDate: "2024-01-14T16:45:00Z",
      finalScore: 18750,
      gameModeName: "Time Challenge",
      difficultyLevel: "Hard",
      totalTimeSeconds: 180,
      accuracy: 78,
      region: "North America",
    },
    {
      id: 3,
      gameDate: "2024-01-13T10:20:00Z",
      finalScore: 22100,
      gameModeName: "Classic Mode",
      difficultyLevel: "Expert",
      totalTimeSeconds: 420,
      accuracy: 88,
      region: "Asia",
    },
    {
      id: 4,
      gameDate: "2024-01-12T19:15:00Z",
      finalScore: 15600,
      gameModeName: "Speed Round",
      difficultyLevel: "Medium",
      totalTimeSeconds: 120,
      accuracy: 65,
      region: "Africa",
    },
    {
      id: 5,
      gameDate: "2024-01-11T13:30:00Z",
      finalScore: 19800,
      gameModeName: "Classic Mode",
      difficultyLevel: "Hard",
      totalTimeSeconds: 360,
      accuracy: 82,
      region: "South America",
    },
    {
      id: 6,
      gameDate: "2024-01-10T15:45:00Z",
      finalScore: 23400,
      gameModeName: "Precision Mode",
      difficultyLevel: "Expert",
      totalTimeSeconds: 480,
      accuracy: 92,
      region: "Europe",
    },
    {
      id: 7,
      gameDate: "2024-01-09T11:20:00Z",
      finalScore: 14200,
      gameModeName: "Time Challenge",
      difficultyLevel: "Medium",
      totalTimeSeconds: 150,
      accuracy: 71,
      region: "Oceania",
    },
    {
      id: 8,
      gameDate: "2024-01-08T17:30:00Z",
      finalScore: 26700,
      gameModeName: "Classic Mode",
      difficultyLevel: "Expert",
      totalTimeSeconds: 540,
      accuracy: 97,
      region: "North America",
    },
  ];

  // Calcular estadísticas resumidas
  const totalGames = gameHistoryData.length;
  const averageScore = Math.round(
    gameHistoryData.reduce((sum, game) => sum + game.finalScore, 0) / totalGames
  );
  const bestScore = Math.max(...gameHistoryData.map((game) => game.finalScore));
  const averageAccuracy = Math.round(
    gameHistoryData.reduce((sum, game) => sum + game.accuracy, 0) / totalGames
  );

  // Filtrar datos
  const filteredData = gameHistoryData.filter((game) => {
    const matchesSearch =
      game.gameModeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || game.difficultyLevel === difficultyFilter;
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
              <p className="text-3xl font-bold text-gray-900">{totalGames}</p>
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
                {bestScore.toLocaleString()}
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
                {averageScore.toLocaleString()}
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
                {averageAccuracy}%
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
                  {paginatedData.map((game) => (
                    <TableRow key={game.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(game.gameDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{game.gameModeName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getDifficultyColor(game.difficultyLevel)}
                        >
                          {game.difficultyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">
                            {game.finalScore.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span>{game.accuracy}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{formatTime(game.totalTimeSeconds)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{game.region}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} games
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
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
      </div>
    </div>
  );
};
