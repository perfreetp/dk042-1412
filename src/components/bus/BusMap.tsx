import { useAppStore, calculateRisk } from "@/store";
import { riskConfig } from "@/utils/risk";
import type { Bus, RiskLevel } from "@/types";

interface BusMapProps {
  onSelectBus: (bus: Bus) => void;
}

const riskAnimation: Record<RiskLevel, string> = {
  high: "animate-pulse-red",
  medium: "animate-pulse-yellow",
  low: "animate-pulse-green",
  none: "animate-pulse-green",
};

const riskFillColor: Record<RiskLevel, string> = {
  high: "#E63946",
  medium: "#E9C46A",
  low: "#457B9D",
  none: "#2A9D8F",
};

const routePaths = [
  { id: "r1", d: "M 50 800 L 150 700 L 280 550 L 400 450 L 550 350 L 700 300", color: "#2A9D8F" },
  { id: "r2", d: "M 50 200 L 200 280 L 400 320 L 600 420 L 750 550", color: "#457B9D" },
  { id: "r3", d: "M 400 50 L 400 200 L 350 400 L 450 600 L 500 800", color: "#E9C46A" },
  { id: "r4", d: "M 800 300 L 700 350 L 600 500 L 500 650 L 300 750", color: "#E63946" },
];

const mapStops = [
  { name: "学校正门", x: 400, y: 430 },
  { name: "阳光小区北门", x: 260, y: 570 },
  { name: "绿城花园东门", x: 620, y: 440 },
  { name: "滨江新城站", x: 440, y: 620 },
  { name: "学府雅苑西门", x: 580, y: 520 },
];

export default function BusMap({ onSelectBus }: BusMapProps) {
  const buses = useAppStore((s) => s.buses);
  const alerts = useAppStore((s) => s.alerts);
  const filters = useAppStore((s) => s.filters);

  const filteredBuses = buses.filter((bus) => {
    const risk = calculateRisk(bus, alerts);
    if (filters.risk !== "all" && risk.level !== filters.risk) return false;
    if (filters.status !== "all" && bus.status !== filters.status) return false;
    if (filters.grade !== "all" && !bus.grades.includes(filters.grade)) return false;
    if (filters.route !== "all" && bus.routeId !== filters.route) return false;
    return true;
  });

  return (
    <div className="card-base p-4 relative overflow-hidden h-full min-h-[520px]">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/50 to-navy-950/80" />

      <div className="relative h-full w-full">
        <svg viewBox="0 0 850 850" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1f3552" strokeWidth="0.5" />
            </pattern>
            {routePaths.map((r) => (
              <filter key={r.id} id={`glow-${r.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          <rect width="850" height="850" fill="url(#grid)" />

          {routePaths.map((route) => (
            <path
              key={route.id}
              d={route.d}
              fill="none"
              stroke={route.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
              opacity="0.6"
              filter={`url(#glow-${route.id})`}
            />
          ))}

          <rect x="350" y="380" width="100" height="100" rx="8" fill="#0A2342" stroke="#457B9D" strokeWidth="2" />
          <text x="400" y="440" textAnchor="middle" fill="#457B9D" fontSize="14" fontWeight="600">
            学校
          </text>

          {mapStops.map((stop, idx) => (
            <g key={idx}>
              <circle cx={stop.x} cy={stop.y} r="8" fill="#1f3552" stroke="#5C7EAB" strokeWidth="2" />
              <circle cx={stop.x} cy={stop.y} r="3" fill="#5C7EAB" />
              <text
                x={stop.x}
                y={stop.y - 15}
                textAnchor="middle"
                fill="#9FB4CF"
                fontSize="11"
              >
                {stop.name}
              </text>
            </g>
          ))}

          {filteredBuses.map((bus) => {
            const risk = calculateRisk(bus, alerts);
            const fillColor = riskFillColor[risk.level];
            return (
              <g
                key={bus.id}
                className="cursor-pointer"
                onClick={() => onSelectBus(bus)}
                transform={`translate(${bus.position.x * 8 + 100}, ${bus.position.y * 8})`}
              >
                <circle
                  r="20"
                  fill="transparent"
                  className={bus.status !== "offline" ? riskAnimation[risk.level] : ""}
                  style={{ animationDuration: risk.level === "high" ? "0.8s" : "2s" }}
                />
                <circle
                  r="13"
                  fill={fillColor}
                  stroke="white"
                  strokeWidth="2.5"
                  opacity={bus.status === "offline" ? 0.4 : 1}
                />
                <text y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
                  🚌
                </text>
                <text
                  y="38"
                  textAnchor="middle"
                  fill="#E8EEF5"
                  fontSize="10"
                  fontWeight="600"
                >
                  {bus.plateNumber.replace("沪A·", "")}
                </text>
                {risk.level !== "none" && (
                  <text y="52" textAnchor="middle" fill={fillColor} fontSize="9" fontWeight="700">
                    {riskConfig[risk.level].label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="card-base p-3 space-y-2">
            <div className="text-xs font-medium text-navy-300 mb-2">风险图例</div>
            {[
              { c: "#E63946", l: "高风险" },
              { c: "#E9C46A", l: "中风险" },
              { c: "#457B9D", l: "低风险" },
              { c: "#2A9D8F", l: "无风险" },
            ].map((item) => (
              <div key={item.l} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.c }}
                />
                <span className="text-xs text-navy-200">{item.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
