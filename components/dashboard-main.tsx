"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Play,
  Trophy,
  Target,
  BarChart3,
  History,
  Settings,
  MessageSquare,
  LogOut,
  User,
  Star,
  MapPin,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useGameStore } from "@/lib/store";
import { DifficultyModal } from "@/components/difficulty-modal";

interface DashboardMainProps {
  onStartGame: () => void;
}

export function DashboardMain({ onStartGame }: DashboardMainProps) {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const { playerName } = useGameStore();

  // Datos de ejemplo - en el futuro vendrán de la base de datos
  // Sample Data - will come from the database in the future
  const userStats = {
    bestScore: 24990,
    averagePrecision: 15.5,
    gamesPlayed: 42,
    globalRank: 452,
    regionalStrengths: [
      { region: "Europe", accuracy: 85, color: "bg-blue-500" },
      { region: "North America", accuracy: 72, color: "bg-green-500" },
      { region: "Asia", accuracy: 68, color: "bg-purple-500" },
      { region: "Africa", accuracy: 45, color: "bg-orange-500" },
    ],
  };

  const handleNewGame = () => {
    setShowDifficultyModal(true);
  };

  const handleQuickGame = () => {
    // Iniciar partida rápida con configuración predeterminada
    // Start quick game with default settings
    onStartGame();
  };

  const handleDifficultyConfirm = () => {
    setShowDifficultyModal(false);
    onStartGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header con perfil de usuario */}
      {/* Header with user profile */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                GeoGuess
              </span>
            </div>

            {/* Perfil de usuario */}
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Hello,</p>
                <p className="font-semibold text-gray-900">
                  {playerName || "Player"}!
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt="Profile"
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {playerName || "Player"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      GeoGuess Player
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>My Stats</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Sección de acción principal */}
        {/* Main Action Section */}
        <div className="text-center mb-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                It's time to explore!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Showcase your geography knowledge and discover incredible places
                around the world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleNewGame}
                size="lg"
                className="h-16 px-12 text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-6 h-6 mr-3" />
                New Game
                <ChevronRight className="w-6 h-6 ml-3" />
              </Button>
              <Button
                onClick={handleQuickGame}
                variant="outline"
                size="lg"
                className="h-16 px-8 text-lg font-semibold border-2 hover:bg-gray-50"
              >
                <Zap className="w-5 h-5 mr-2" />
                Quick Game
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard estadístico */}
        {/* Statistics Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Mi Récord */}
          {/* My High Score */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Record
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.bestScore.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">max points</p>
              </div>
            </CardContent>
          </Card>

          {/* Mi Precisión */}
          {/* My Accuracy */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-green-500" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Accuracy
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.averagePrecision} km
                </p>
                <p className="text-sm text-gray-600">average error</p>
              </div>
            </CardContent>
          </Card>

          {/* Partidas Jugadas */}
          {/* Games Played */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Play className="w-8 h-8 text-blue-500" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Activity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.gamesPlayed}
                </p>
                <p className="text-sm text-gray-600">games played</p>
              </div>
            </CardContent>
          </Card>

          {/* Ranking Global */}
          {/* Global Ranking */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Star className="w-8 h-8 text-purple-500" />
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Ranking
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  #{userStats.globalRank}
                </p>
                <p className="text-sm text-gray-600">global position</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fortalezas regionales */}
        {/* Regional Strengths */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Regional Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userStats.regionalStrengths.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {region.region}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {region.accuracy}%
                    </span>
                  </div>
                  <Progress value={region.accuracy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Módulos de navegación */}
        {/* Navigation Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Rankings
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                See where you stand in the world rankings
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Rankings
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Stats
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Detailed analysis of your progress
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Statistics
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <History className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Game History
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review your previous games
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View History
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Feedback
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Report issues or suggest improvements
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Send Feedback
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de dificultad */}
      {/* Difficulty Modal */}
      <DifficultyModal
        open={showDifficultyModal}
        onConfirm={handleDifficultyConfirm}
      />
    </div>
  );
}
