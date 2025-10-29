"use client";

import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { DashboardMain } from "@/components/dashboard-main";
import { useGameStore } from "@/lib/store";
import mapboxgl from "mapbox-gl";
import { GamePage } from "@/modules/dashboard/pages/game-page";
import { ResultsPage } from "@/modules/dashboard/pages/results-page";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Home() {
  const { gameStarted, gameFinished, startGame, playerName } = useGameStore();

  const handleStartGame = () => {
    startGame();
  };

  const handlePlayAgain = () => {
    startGame();
  };

  // Si no hay nombre de jugador, mostrar pantalla de bienvenida
  if (!playerName) {
    return <WelcomeScreen onNext={() => {}} />;
  }

  if (gameFinished) {
    return <ResultsPage onPlayAgain={handlePlayAgain} />;
  }

  if (gameStarted) {
    return <GamePage />;
  }

  // Mostrar dashboard principal
  return <DashboardMain onStartGame={handleStartGame} />;
}
