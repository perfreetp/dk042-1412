import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "green" | "blue" | "yellow" | "red";
}

const colorMap = {
  green: "from-accent-green/20 to-accent-green/5 border-accent-green/30",
  blue: "from-accent-blue/20 to-accent-blue/5 border-accent-blue/30",
  yellow: "from-accent-yellow/20 to-accent-yellow/5 border-accent-yellow/30",
  red: "from-accent-red/20 to-accent-red/5 border-accent-red/30",
};

const iconColorMap = {
  green: "text-accent-green",
  blue: "text-accent-blue",
  yellow: "text-accent-yellow",
  red: "text-accent-red",
};

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className={`card-base p-5 bg-gradient-to-br ${colorMap[color]} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-navy-300 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white font-mono">{value}</p>
          {trend && <p className="text-xs text-navy-400 mt-2">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-navy-900/50 ${iconColorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
