import { useEffect, useState } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export function getCountdown(target: number, now: number): CountdownState {
  const diff = Math.max(0, target - now) || 0;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    isOver: diff === 0,
  };
}

export function useCountdown(targetIso: string): CountdownState {
  const target = new Date(targetIso).getTime();
  const [state, setState] = useState(() => getCountdown(target, Date.now()));

  useEffect(() => {
    const tick = () => {
      const next = getCountdown(target, Date.now());
      setState(next);
      return next.isOver;
    };

    if (tick()) return undefined;

    const id = setInterval(() => {
      if (tick()) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  return state;
}
