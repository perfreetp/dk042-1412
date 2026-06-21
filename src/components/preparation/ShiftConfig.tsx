import {
  Sunrise,
  Sunset,
  Bus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { Shift, PreparationCheck, Bus as BusType } from "@/types";

interface ShiftCardProps {
  shift: Shift;
}

function ShiftCard({ shift }: ShiftCardProps) {
  const isMorning = shift.type === "morning";
  const Icon = isMorning ? Sunrise : Sunset;

  const preparationChecks = useAppStore((s) => s.preparationChecks);
  const buses = useAppStore((s) => s.buses);

  const shiftChecks = preparationChecks.filter((c) => c.shiftId === shift.id);
  const shiftBuses = buses.filter((b) => shift.busIds.includes(b.id));
  const readyCount = shiftChecks.filter(
    (c) => c.isOnline && c.isGpsNormal && c.isDriverConfirmed
  ).length;
  const pendingCount = shiftChecks.filter(
    (c) => c.isOnline && c.isGpsNormal && !c.isDriverConfirmed
  ).length;
  const problems = shiftChecks.filter(
    (c) => !c.isOnline || !c.isGpsNormal || !c.isDriverConfirmed
  );

  const iconWrapClass = isMorning
    ? "bg-accent-yellow/20 text-accent-yellow"
    : "bg-accent-blue/20 text-accent-blue";

  return (
    <div className="card-base p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconWrapClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">{shift.name}</h3>
          <p className="text-xs text-navy-400">{shift.scheduledTime}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{shift.busIds.length}</div>
          <div className="text-xs text-navy-400">车辆</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-navy-900/40 rounded-lg">
          <div className="text-lg font-bold text-accent-green font-mono">{readyCount}</div>
          <div className="text-xs text-navy-400">已就绪</div>
        </div>
        <div className="text-center p-2 bg-navy-900/40 rounded-lg">
          <div className="text-lg font-bold text-accent-yellow font-mono">{pendingCount}</div>
          <div className="text-xs text-navy-400">待确认</div>
        </div>
        <div className="text-center p-2 bg-navy-900/40 rounded-lg">
          <div className="text-lg font-bold text-accent-red font-mono">{problems.length}</div>
          <div className="text-xs text-navy-400">异常</div>
        </div>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {shiftBuses.map((bus: BusType) => {
          const check = shiftChecks.find((c: PreparationCheck) => c.busId === bus.id);
          const hasProblem =
            check && (!check.isOnline || !check.isGpsNormal || !check.isDriverConfirmed);
          return (
            <div
              key={bus.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                hasProblem ? "bg-accent-red/5 border border-accent-red/20" : "bg-navy-900/30"
              }`}
            >
              {hasProblem ? (
                <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0" />
              )}
              <span className="text-sm text-white font-mono flex-shrink-0">
                {bus.plateNumber}
              </span>
              <span className="text-xs text-navy-400 truncate flex-1">
                {bus.driver.name} · {bus.routeName}
              </span>
              {hasProblem && check && (
                <div className="flex gap-1 flex-shrink-0">
                  {!check.isOnline && (
                    <span className="text-xs px-1.5 py-0.5 bg-accent-red/15 text-accent-red rounded">
                      离线
                    </span>
                  )}
                  {!check.isGpsNormal && (
                    <span className="text-xs px-1.5 py-0.5 bg-accent-yellow/15 text-accent-yellow rounded">
                      定位
                    </span>
                  )}
                  {!check.isDriverConfirmed && (
                    <span className="text-xs px-1.5 py-0.5 bg-accent-blue/15 text-accent-blue rounded">
                      未确认
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {problems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-navy-700/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-accent-red" />
            <span className="text-xs font-semibold text-accent-red">
              本班次未完成项（{problems.length}项）
            </span>
          </div>
          <p className="text-xs text-navy-400">
            以上问题已自动归入{shift.name}，值班老师请跟进处理
          </p>
        </div>
      )}
    </div>
  );
}

export default function ShiftConfig() {
  const shifts = useAppStore((s) => s.shifts);

  return (
    <div className="card-base p-5">
      <div className="flex items-center gap-2 mb-5">
        <Bus className="w-5 h-5 text-accent-blue" />
        <h2 className="text-base font-bold text-white">今日班次安排</h2>
        <span className="text-xs text-navy-400 ml-auto">
          固定班次配置 · 值班老师可见
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {shifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </div>
  );
}
