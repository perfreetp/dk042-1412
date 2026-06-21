import { Circle, CircleDot } from "lucide-react";

interface StatusBadgeProps {
  status: "running" | "stopped" | "offline" | "delay" | "pending" | "processing" | "resolved";
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  running: { label: "运行中", bg: "bg-accent-green/15", color: "text-accent-green", dot: "bg-accent-green" },
  stopped: { label: "已到站", bg: "bg-accent-blue/15", color: "text-accent-blue", dot: "bg-accent-blue" },
  offline: { label: "离线", bg: "bg-navy-600/30", color: "text-navy-300", dot: "bg-navy-500" },
  delay: { label: "延迟", bg: "bg-accent-yellow/15", color: "text-accent-yellow", dot: "bg-accent-yellow" },
  pending: { label: "待处理", bg: "bg-accent-red/15", color: "text-accent-red", dot: "bg-accent-red" },
  processing: { label: "处理中", bg: "bg-accent-yellow/15", color: "text-accent-yellow", dot: "bg-accent-yellow" },
  resolved: { label: "已解决", bg: "bg-accent-green/15", color: "text-accent-green", dot: "bg-accent-green" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const padding = size === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <span className={`status-badge ${config.bg} ${config.color} ${padding} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function LevelBadge({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: { label: "紧急", bg: "bg-accent-red/20", color: "text-accent-red", border: "border-accent-red/40" },
    medium: { label: "注意", bg: "bg-accent-yellow/20", color: "text-accent-yellow", border: "border-accent-yellow/40" },
    low: { label: "提示", bg: "bg-accent-blue/20", color: "text-accent-blue", border: "border-accent-blue/40" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${c.bg} ${c.color} border ${c.border}`}>
      <CircleDot className="w-3 h-3 mr-1" />
      {c.label}
    </span>
  );
}

export function CheckBadge({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        checked
          ? "bg-accent-green/15 text-accent-green"
          : "bg-accent-red/15 text-accent-red"
      }`}
    >
      {checked ? <Circle className="w-3 h-3 fill-current" /> : <Circle className="w-3 h-3" />}
      {label}
      {checked ? "正常" : "异常"}
    </span>
  );
}
