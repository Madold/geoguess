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
import { DifficultyModal } from "@/modules/shared/components/difficulty-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DashboardMainProps {
  onStartGame: () => void;
  userName: string;
}

export function DashboardMain({ onStartGame, userName }: DashboardMainProps) {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const router = useRouter();

  // Sample Data - will come from the database in the future
  const userStats = {
    bestScore: 24990,
    averagePrecision: 15.5,
    gamesPlayed: 42,
    globalRank: 452,
    // Renombrar 'regionalStrengths' para seguir convenciones de código en inglés (opcional, pero recomendado)
    regionalStrengths: [
      // Cambiar 'region' y traducir valores
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
    // Start quick game with default settings
    onStartGame();
  };

  const handleDifficultyConfirm = () => {
    setShowDifficultyModal(false);
    onStartGame();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Hello,</p>{" "}
                {/* "¡Hola," translated to "Hello," */}
                <p className="font-semibold text-gray-900">{userName}!</p>
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
                      />{" "}
                      {/* "Perfil" translated to "Profile" */}
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      GeoGuess Player {/* "Jugador de GeoGuess" translated */}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Settings</span>{" "}
                    {/* "Perfil y Configuración" translated */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>My Stats</span> {/* "Mis Estadísticas" translated */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span> {/* "Configuración" translated */}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span> {/* "Cerrar Sesión" translated */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Action Section */}
        <div className="text-center mb-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                It's time to explore! {/* "¡Es hora de explorar!" translated */}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Show off your geographical knowledge and discover amazing places
                around the world. {/* Translated text */}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleNewGame}
                size="lg"
                className="h-16 px-12 text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-6 h-6 mr-3" />
                New Game {/* "Nueva Partida" translated */}
                <ChevronRight className="w-6 h-6 ml-3" />
              </Button>
              <Button
                onClick={handleQuickGame}
                variant="outline"
                size="lg"
                className="h-16 px-8 text-lg font-semibold border-2 hover:bg-gray-50"
              >
                <Zap className="w-5 h-5 mr-2" />
                Quick Game {/* "Partida Rápida" translated */}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* My High Score */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  High Score {/* "Récord" translated */}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.bestScore.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">maximum points</p>{" "}
                {/* "puntos máximos" translated */}
              </div>
            </CardContent>
          </Card>

          {/* My Accuracy */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-green-500" />
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Accuracy {/* "Precisión" translated */}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.averagePrecision} km
                </p>
                <p className="text-sm text-gray-600">average error</p>{" "}
                {/* "error promedio" translated */}
              </div>
            </CardContent>
          </Card>

          {/* Games Played */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Play className="w-8 h-8 text-blue-500" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Activity {/* "Actividad" translated */}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.gamesPlayed}
                </p>
                <p className="text-sm text-gray-600">games played</p>{" "}
                {/* "partidas jugadas" translated */}
              </div>
            </CardContent>
          </Card>

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
                <p className="text-sm text-gray-600">global position</p>{" "}
                {/* "posición global" translated */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Strengths */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Regional Strengths {/* "Fortalezas Regionales" translated */}
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

        {/* Navigation Modules */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Rankings {/* "Rankings Globales" translated */}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                See where you stand in the world rankings{" "}
                {/* Translated text */}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Rankings {/* "Ver Rankings" translated */}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Statistics {/* "Mis Estadísticas" translated */}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Detailed analysis of your progress {/* Translated text */}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Statistics {/* "Ver Estadísticas" translated */}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <History className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Game History {/* "Historial de Partidas" translated */}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review your previous games {/* Translated text */}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View History {/* "Ver Historial" translated */}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Difficulty Modal */}
      <DifficultyModal
        open={showDifficultyModal}
        onConfirm={handleDifficultyConfirm}
      />
    </div>
  );
}
