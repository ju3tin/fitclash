// app/(option)/listener3/page.tsx
'use client';

import { Suspense } from "react";
import GameRoomContent from './GameRoomContent';

export default function GameRoomPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameRoomContent />
    </Suspense>
  );
}