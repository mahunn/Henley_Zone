"use client";

import { useEffect, useState } from "react";

const COLORS = ["#16a34a", "#2563eb", "#ca8a04", "#db2777", "#9333ea", "#ea580c", "#0d9488"];

type Piece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rot: number;
  size: number;
};

export function OrderCelebration() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const generated: Piece[] = Array.from({ length: 56 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.55,
      duration: 2.4 + Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      rot: Math.random() * 360,
      size: 6 + Math.random() * 6
    }));
    setPieces(generated);
    const timer = window.setTimeout(() => setPieces([]), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!pieces.length) return null;

  return (
    <div className="order-celebration" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="order-celebration-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.35,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rot}deg)`
          }}
        />
      ))}
    </div>
  );
}
