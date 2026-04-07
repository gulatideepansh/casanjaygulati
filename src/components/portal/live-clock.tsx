"use client";

import { useEffect, useState } from "react";

import { PORTAL_TIMEZONE } from "@/lib/portal/config";

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(now);

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: PORTAL_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brass">Portal Time</p>
      <p className="mt-2 text-xl font-semibold text-white">{timeLabel}</p>
      <p className="mt-1 text-sm text-slate-300">{dateLabel}</p>
    </div>
  );
}
