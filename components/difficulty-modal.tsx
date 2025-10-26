'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { type Difficulty } from '@/lib/game-data';
import { useGameStore } from '@/lib/store';
import { useState } from 'react';
import { Zap, Mountain, Flame } from 'lucide-react';

interface DifficultyModalProps {
  open: boolean;
  onConfirm: () => void;
}

export function DifficultyModal({ open, onConfirm }: DifficultyModalProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  const playerName = useGameStore((state) => state.playerName);

  const handleConfirm = () => {
    setDifficulty(selectedDifficulty);
    onConfirm();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome, {playerName}!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Choose your difficulty level to begin your journey
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <RadioGroup
            value={selectedDifficulty}
            onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="flex items-center space-x-3 cursor-pointer flex-1">
                <div className="bg-green-100 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">Easy</div>
                  <div className="text-sm text-gray-600">Famous landmarks and major cities</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-yellow-200 hover:bg-yellow-50 transition-colors cursor-pointer">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="flex items-center space-x-3 cursor-pointer flex-1">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Mountain className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">Medium</div>
                  <div className="text-sm text-gray-600">Well-known cities and attractions</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-red-200 hover:bg-red-50 transition-colors cursor-pointer">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="flex items-center space-x-3 cursor-pointer flex-1">
                <div className="bg-red-100 p-2 rounded-full">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">Hard</div>
                  <div className="text-sm text-gray-600">Hidden gems and expert level</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            Start Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
