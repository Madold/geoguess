"use client";

import { useEffect, useState } from "react";
import { DashboardMain } from "@/components/dashboard-main";
import { useGameStore } from "@/lib/store";
import mapboxgl from "mapbox-gl";
import { GamePage } from "@/modules/dashboard/pages/game-page";
import { ResultsPage } from "@/modules/dashboard/pages/results-page";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const { gameStarted, gameFinished, startGame, setPlayerName } =
    useGameStore();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Player";

      setUserName(name);
      setPlayerName(name);
      setLoading(false);
    };

    checkUser();
  }, [router, setPlayerName]);

  const handleStartGame = () => {
    startGame();
  };

  const handlePlayAgain = () => {
    startGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return <ResultsPage onPlayAgain={handlePlayAgain} />;
  }

  if (gameStarted) {
    return <GamePage />;
  }

  return <DashboardMain onStartGame={handleStartGame} userName={userName} />;
}
