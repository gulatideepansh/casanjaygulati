"use client";

import { useEffect, useState } from "react";

import { formatPortalHeaderDate, formatPortalHeaderTime } from "@/lib/portal/time";

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const timeLabel = formatPortalHeaderTime(now);
  const dateLabel = formatPortalHeaderDate(now);

  return (
    <div className="text-right">
      <p className="font-display text-3xl leading-none tracking-[0.04em] text-white sm:text-4xl">{timeLabel}</p>
      <p className="mt-2 text-sm text-slate-300 sm:text-base">{dateLabel}</p>
    </div>
  );
}
