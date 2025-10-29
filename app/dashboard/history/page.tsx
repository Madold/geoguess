"use client";

import { GameHistoryPage } from "@/modules/dashboard/pages/game-history";
import { useRouter } from "next/navigation";

export default function History() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return <GameHistoryPage onBack={handleBack} />;
}
