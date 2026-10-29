import api from "@/lib/axios";
import { useEffect, useRef } from "react";

// FROM JALAL TO EVERYONE THIS FUNCTION CAN BREAK EVERYTHING
export function useActiveTimeOnSite(enable: boolean) {
  const lastActiveStart = useRef<number | null>(null);
  const totalActiveTime = useRef(0);

  useEffect(() => {
    if (!enable) return;

    const onVisible = () => {
      lastActiveStart.current = Date.now();
    };

    const onHidden = () => {
      if (lastActiveStart.current !== null) {
        totalActiveTime.current += Date.now() - lastActiveStart.current;
        lastActiveStart.current = null;
      }
    };

    const sendAndReset = () => {
      if (lastActiveStart.current !== null) {
        totalActiveTime.current += Date.now() - lastActiveStart.current;
        lastActiveStart.current = Date.now();
      }

      api.post("/api/stats/record-session-duration", {
        durationMs: totalActiveTime.current,
      });

      totalActiveTime.current = 0;
    };

    const visibleChange = () => {
      if (document.visibilityState === "hidden") onHidden();
      else onVisible();
    };

    document.addEventListener("visibilitychange", visibleChange);
    window.addEventListener("beforeunload", sendAndReset);

    lastActiveStart.current = Date.now();

    return () => {
      sendAndReset();
      window.removeEventListener("beforeunload", sendAndReset);
      document.removeEventListener("visibilitychange", visibleChange);
    };
  }, [enable]);
}
