import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function DropCountdown({
  title = "NEXT DROP IN",
  subtitle = "Our next drop of original silhouettes is currently in production.",
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: "05",
    hours: "18",
    minutes: "42",
    seconds: "10",
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    targetDate.setHours(targetDate.getHours() + 18);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#FAF8F5] border border-[#141414]/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#141414]/60 mb-1.5">
          <Clock size={13} className="text-[#141414]" />
          <span>{title}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#141414]/70 font-medium">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 font-mono">
        {[
          { label: "D", val: timeLeft.days },
          { label: "H", val: timeLeft.hours },
          { label: "M", val: timeLeft.minutes },
          { label: "S", val: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-baseline gap-1 bg-white border border-[#141414]/10 px-3 py-2 rounded-xl"
          >
            <span className="font-heading font-black text-lg sm:text-xl text-[#141414]">
              {item.val}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#141414]/40">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
