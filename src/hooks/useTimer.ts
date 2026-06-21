import { useEffect, useState } from "react";
import { useAppStore } from "@/store";

export function useClock() {
  const updateCurrentTime = useAppStore((s) => s.updateCurrentTime);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [updateCurrentTime]);
}

export function useCountdown(targetMinutes: number) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: Math.floor(targetMinutes),
    seconds: Math.floor((targetMinutes % 1) * 60),
  });

  useEffect(() => {
    let totalSeconds = targetMinutes * 60;
    const timer = setInterval(() => {
      totalSeconds = Math.max(0, totalSeconds - 1);
      setTimeLeft({
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetMinutes]);

  return timeLeft;
}
