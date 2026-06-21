import { useMemo } from "react";
import { Sunrise, Sunset, Bus as BusIcon, MapPin, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAppStore, calculateRisk } from "@/store";
import { routes } from "@/data/buses";
import type { ShiftType, Bus, RiskInfo, Alert } from "@/types";

interface RouteProgressBus {
  bus: Bus;
  progress: any;
  risk: RiskInfo;
  alerts: Alert[];
}

interface RouteProgress {
  route: typeof routes[0];
  buses: RouteProgressBus[];
  totalStops: number;
  completedStops: number;
  pendingStudents: number;
  pickedStudents: number;
  progressPercent: number;
}

interface ProgressData {
  routes: RouteProgress[];
  summary: {
    totalStops: number;
    completedStops: number;
    pendingStudents: number;
    pickedStudents: number;
    busCount: number;
  } | null;
}

interface ShiftProgressViewProps {
  shiftType: ShiftType;
}

export default function ShiftProgressView({ shiftType }: ShiftProgressViewProps) {
  const buses = useAppStore((s) => s.buses);
  const alerts = useAppStore((s) => s.alerts);
  const resolvedAlerts = useAppStore((s) => s.resolvedAlerts);
  const shifts = useAppStore((s) => s.shifts);

  const shift = useMemo(() => shifts.find((s) => s.type === shiftType), [shifts, shiftType]);

  const progressData = useMemo((): ProgressData => {
    if (!shift) return { routes: [], summary: null };

    const shiftBuses = buses.filter((b) => shift.busIds.includes(b.id));
    const progressField = shiftType === "morning" ? "morningProgress" : "afternoonProgress";

    const routeProgress = routes.map((route) => {
      const routeBuses = shiftBuses.filter((b) => b.routeId === route.id);
      if (routeBuses.length === 0) return null;

      const totalStops = routeBuses.reduce(
        (sum, b) => sum + (b[progressField]?.totalStops || 0),
        0
      );
      const completedStops = routeBuses.reduce(
        (sum, b) => sum + (b[progressField]?.completedStops || 0),
        0
      );
      const pendingStudents = routeBuses.reduce(
        (sum, b) => sum + (b[progressField]?.pendingStudents || 0),
        0
      );
      const pickedStudents = routeBuses.reduce(
        (sum, b) => sum + (b[progressField]?.pickedStudents || 0),
        0
      );

      return {
        route,
        buses: routeBuses.map((b) => {
          const progress = b[progressField];
          const allAlerts = [...alerts, ...resolvedAlerts].filter(
            (a) => a.busId === b.id && a.timeline.some((t) => t.timestamp.startsWith("2026-06-22"))
          );
          const risk = calculateRisk(b, alerts);
          return {
            bus: b,
            progress,
            risk,
            alerts: allAlerts,
          };
        }),
        totalStops,
        completedStops,
        pendingStudents,
        pickedStudents,
        progressPercent: totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0,
      };
    }).filter(Boolean) as RouteProgress[];

    const summary = routeProgress.reduce(
      (acc, rp) => ({
        totalStops: acc.totalStops + rp.totalStops,
        completedStops: acc.completedStops + rp.completedStops,
        pendingStudents: acc.pendingStudents + rp.pendingStudents,
        pickedStudents: acc.pickedStudents + rp.pickedStudents,
        busCount: acc.busCount + rp.buses.length,
      }),
      { totalStops: 0, completedStops: 0, pendingStudents: 0, pickedStudents: 0, busCount: 0 }
    );

    return { routes: routeProgress, summary };
  }, [shift, shiftType, buses, alerts, resolvedAlerts]);

  if (!shift || !progressData.summary) return null;

  const { routes: routeData, summary } = progressData;
  const Icon = shiftType === "morning" ? Sunrise : Sunset;
  const bgAccent = shiftType === "morning" ? "accent-yellow" : "accent-blue";
  const overallPercent =
    summary.totalStops > 0 ? Math.round((summary.completedStops / summary.totalStops) * 100) : 0;

  return (
    <div className="card-base p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl bg-${bgAccent}/20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${bgAccent}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">{shift.name} 运行进度</h2>
          <p className="text-xs text-navy-400">按线路展示当前接送进度</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{overallPercent}%</div>
          <div className="text-xs text-navy-400">总体进度</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-navy-900/40 rounded-lg text-center">
          <div className="text-lg font-bold text-white font-mono">{summary.busCount}</div>
          <div className="text-xs text-navy-400">运营车辆</div>
        </div>
        <div className="p-3 bg-navy-900/40 rounded-lg text-center">
          <div className="text-lg font-bold text-accent-green font-mono">
            {summary.completedStops}/{summary.totalStops}
          </div>
          <div className="text-xs text-navy-400">完成站点</div>
        </div>
        <div className="p-3 bg-navy-900/40 rounded-lg text-center">
          <div className="text-lg font-bold text-accent-blue font-mono">{summary.pickedStudents}</div>
          <div className="text-xs text-navy-400">已接学生</div>
        </div>
        <div className="p-3 bg-navy-900/40 rounded-lg text-center">
          <div className="text-lg font-bold text-accent-yellow font-mono">{summary.pendingStudents}</div>
          <div className="text-xs text-navy-400">待接学生</div>
        </div>
      </div>

      <div className="space-y-4">
        {routeData.map((rp) => (
          <div key={rp.route.id} className="p-4 bg-navy-900/30 rounded-xl border border-navy-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rp.route.color }}
              />
              <h3 className="text-sm font-bold text-white flex-1">{rp.route.name}</h3>
              <div className="text-xs text-navy-300 font-mono">
                {rp.completedStops}/{rp.totalStops} 站
              </div>
              <div className="w-24 h-2 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${rp.progressPercent}%`, backgroundColor: rp.route.color }}
                />
              </div>
              <span className="text-xs font-bold text-white font-mono w-10 text-right">
                {rp.progressPercent}%
              </span>
            </div>

            <div className="space-y-2">
              {rp.buses.map(({ bus, progress, risk, alerts: busAlerts }) => (
                <div
                  key={bus.id}
                  className="flex items-center gap-3 p-2.5 bg-navy-900/40 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-navy-600" />
                  <span className="text-sm text-white font-mono flex-shrink-0 w-24">
                    {bus.plateNumber}
                  </span>
                  <span className="text-xs text-navy-400 flex-1 truncate">
                    {bus.driver.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-green" />
                    <span className="text-xs text-navy-300 font-mono">
                      {progress?.completedStops || 0}/{progress?.totalStops || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-xs text-navy-300 font-mono">
                      {bus.currentPassengers}/{bus.capacity}
                    </span>
                  </div>
                  {risk && risk.level !== "none" && (
                    <span
                      className={`status-badge text-xs ${
                        risk.level === "high"
                          ? "bg-accent-red/15 text-accent-red"
                          : risk.level === "medium"
                          ? "bg-accent-yellow/15 text-accent-yellow"
                          : "bg-accent-blue/15 text-accent-blue"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {risk.level === "high" ? "高" : risk.level === "medium" ? "中" : "低"}
                      风险
                    </span>
                  )}
                  {busAlerts.length > 0 && (
                    <span className="status-badge bg-accent-red/15 text-accent-red text-xs">
                      {busAlerts.length} 条异常
                    </span>
                  )}
                  {progress && progress.completedStops === progress.totalStops && (
                    <span className="status-badge bg-accent-green/15 text-accent-green text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      已完成
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
