"use client";

import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { DifficultyModal } from "@/components/difficulty-modal";
import { GameScreen } from "@/components/game-screen";
import { ResultsScreen } from "@/components/results-screen";
import { useGameStore } from "@/lib/store";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFya3Vzd2F0ZXIiLCJhIjoiY200ZjJzcjMwMDhtdjJqcTJkemd4bDY4MyJ9.dsrTOPOrlWzqEGr8GNFJXw";

export default function Home() {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const { gameStarted, gameFinished, startGame, playerName } = useGameStore();

  const handleWelcomeNext = () => {
    setShowDifficultyModal(true);
  };

  const handleDifficultyConfirm = () => {
    setShowDifficultyModal(false);
    startGame();
  };

  const handlePlayAgain = () => {
    setShowDifficultyModal(true);
  };

  if (gameFinished) {
    return <ResultsScreen onPlayAgain={handlePlayAgain} />;
  }

  if (gameStarted) {
    return <GameScreen />;
  }

  return (
    <>
      <WelcomeScreen onNext={handleWelcomeNext} />
      {playerName && (
        <DifficultyModal
          open={showDifficultyModal}
          onConfirm={handleDifficultyConfirm}
        />
      )}
    </>
  );
}
