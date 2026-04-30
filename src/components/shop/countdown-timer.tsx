"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  Days: number;
  Hrs: number;
  Min: number;
  Sec: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    Days: Math.floor(diff / 86_400_000),
    Hrs: Math.floor((diff % 86_400_000) / 3_600_000),
    Min: Math.floor((diff % 3_600_000) / 60_000),
    Sec: Math.floor((diff % 60_000) / 1_000)
  };
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const entries = Object.entries(time) as [keyof TimeLeft, number][];

  return (
    <div className="countdown">
      {entries.map(([label, val], i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="countdown-unit">
            <span className="countdown-num">{String(val).padStart(2, "0")}</span>
            <span className="countdown-label">{label}</span>
          </div>
          {i < entries.length - 1 && (
            <span className="countdown-sep">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
