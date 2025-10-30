"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useGameStore } from "@/lib/store";
import { DifficultyModal } from "@/modules/shared/components/difficulty-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DashboardMainProps {
  onStartGame: () => void;
  userName: string;
}

interface DashboardData {
  bestScore: number;
  averageErrorKm: number;
  gamesPlayed: number;
  globalRank: number | null;
  regionalStrengths: Array<{ region: string; accuracy: number }>;
}

export function DashboardMain({ onStartGame, userName }: DashboardMainProps) {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // Translated error message: "Error loading dashboard data"
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<DashboardData>({
    bestScore: 0,
    averageErrorKm: 0,
    gamesPlayed: 0,
    globalRank: null,
    regionalStrengths: [],
  });
  const router = useRouter();
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/game/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setUserStats(result);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Translated error message
        setError("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNewGame = () => {
    setShowDifficultyModal(true);
  };

  const handleQuickGame = () => {
    // Start quick game with default settings (medium difficulty)
    setDifficulty("medium");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          {/* Translated loading text: "Loading dashboard..." */}
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                {/* Translated greeting: "Hello," */}
                <p className="text-sm text-gray-600">Hello,</p>
                <p className="font-semibold text-gray-900">{userName}!</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      {/* Translated alt text: "Profile" */}
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt="Profile"
                      />
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
                    {/* Translated role/description: "GeoGuess Player" */}
                    <p className="text-xs leading-none text-muted-foreground">
                      GeoGuess Player
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {/* Translated text: "Profile and Settings" */}
                    <span>Profile and Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {/* Translated text: "My Statistics" */}
                    <span>My Statistics</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {/* Translated text: "Settings" */}
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {/* Translated text: "Log Out" */}
                    <span>Log Out</span>
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
              {/* Translated title: "It's time to explore!" */}
              <h1 className="text-4xl font-bold text-gray-900">
                It's time to explore!
              </h1>
              {/* Translated subtitle/description */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Show off your geographical knowledge and discover incredible
                places around the world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleNewGame}
                size="lg"
                className="h-16 px-12 text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-6 h-6 mr-3" />
                {/* Translated button text: "New Game" */}
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
                {/* Translated button text: "Quick Game" */}
                Quick Game
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
                  {/* Translated badge: "Record" */}
                  Record
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.bestScore.toLocaleString()}
                </p>
                {/* Translated subtitle: "maximum points" */}
                <p className="text-sm text-gray-600">maximum points</p>
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
                  {/* Translated badge: "Accuracy" */}
                  Accuracy
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.averageErrorKm} km
                </p>
                {/* Translated subtitle: "average error" */}
                <p className="text-sm text-gray-600">average error</p>
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
                  {/* Translated badge: "Activity" */}
                  Activity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.gamesPlayed}
                </p>
                {/* Translated subtitle: "games played" */}
                <p className="text-sm text-gray-600">games played</p>
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
                  {/* Translated badge: "Ranking" */}
                  Ranking
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {userStats.globalRank ? `#${userStats.globalRank}` : "N/A"}
                </p>
                {/* Translated subtitle: "global position" */}
                <p className="text-sm text-gray-600">global position</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Strengths */}
        {userStats.regionalStrengths.length > 0 && (
          <Card className="shadow-lg mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {/* Translated title: "Regional Strengths" */}
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
        )}

        {/* Navigation Modules */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              {/* Translated title: "Global Rankings" */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Rankings
              </h3>
              {/* Translated description: "See where you stand in the world rankings" */}
              <p className="text-sm text-gray-600 mb-4">
                See where you stand in the world rankings
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push("/dashboard/ranking")}
              >
                {/* Translated button text: "View Rankings" */}
                View Rankings
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              {/* Translated title: "My Statistics" */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Statistics
              </h3>
              {/* Translated description: "Detailed analysis of your progress" */}
              <p className="text-sm text-gray-600 mb-4">
                Detailed analysis of your progress
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push("/dashboard/statistics")}
              >
                {/* Translated button text: "View Statistics" */}
                View Statistics
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <History className="w-12 h-12 text-green-500 mx-auto mb-4" />
              {/* Translated title: "Game History" */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Game History
              </h3>
              {/* Translated description: "Review your previous games" */}
              <p className="text-sm text-gray-600 mb-4">
                Review your previous games
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push("/dashboard/history")}
              >
                {/* Translated button text: "View History" */}
                View History
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
