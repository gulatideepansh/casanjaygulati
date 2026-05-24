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
      <p className="text-lg font-semibold leading-none text-ink sm:text-xl">{timeLabel}</p>
      <p className="mt-1 text-sm text-slate-600">{dateLabel}</p>
    </div>
  );
}
