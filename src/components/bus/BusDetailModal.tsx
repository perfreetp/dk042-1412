import {
  User,
  Users,
  Phone,
  MapPin,
  Clock,
  Route,
  CheckCircle2,
  AlertTriangle,
  Shield,
  AlertCircle,
  History,
  Bus as BusIcon,
} from "lucide-react";
import Modal from "@/components/common/Modal";
import StatusBadge from "@/components/common/StatusBadge";
import { ContactButton } from "@/components/common/ContactDriverModal";
import { riskConfig } from "@/utils/risk";
import { useAppStore } from "@/store";
import type { Bus, RiskInfo, ShiftType } from "@/types";
import { useCountdown } from "@/hooks/useTimer";

interface BusDetailModalProps {
  bus: Bus | null;
  risk?: RiskInfo;
  shiftType?: ShiftType;
  isOpen: boolean;
  onClose: () => void;
}

export default function BusDetailModal({
  bus,
  risk,
  shiftType = "morning",
  isOpen,
  onClose,
}: BusDetailModalProps) {
  const timeLeft = useCountdown(bus?.nextStop.etaMinutes || 0);
  const alerts = useAppStore((s) => s.alerts);
  const resolvedAlerts = useAppStore((s) => s.resolvedAlerts);

  if (!bus) return null;

  const hasRisk = risk && risk.level !== "none";
  const progressField = shiftType === "morning" ? "morningProgress" : "afternoonProgress";
  const progress = bus[progressField];
  const busAlerts = [...alerts, ...resolvedAlerts].filter(
    (a) => a.busId === bus.id
  );
  const activeAlerts = busAlerts.filter((a) => a.status !== "resolved");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${bus.plateNumber} - 实时详情`}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {hasRisk && (
            <div className="card-base p-4 border-l-4 bg-gradient-to-br from-accent-red/5 to-transparent animate-slide-in-right"
              style={{ borderLeftColor: riskConfig[risk!.level].dot.replace("bg-", "").includes("red") ? "#E63946" : riskConfig[risk!.level].dot.replace("bg-", "").includes("yellow") ? "#E9C46A" : "#457B9D" }}
            >
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${riskConfig[risk!.level].text}`} />
                迟到风险来源
                <span className={`ml-auto status-badge ${riskConfig[risk!.level].bg} ${riskConfig[risk!.level].text}`}>
                  {riskConfig[risk!.level].label}
                </span>
              </h3>
              <div className="space-y-2">
                {risk!.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-navy-900/40 rounded-lg">
                    <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${riskConfig[factor.level].text}`} />
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${riskConfig[factor.level].text}`}>
                        {factor.label}
                      </div>
                      <div className="text-xs text-navy-300 mt-0.5">{factor.description}</div>
                    </div>
                    <span className={`status-badge text-xs ${riskConfig[factor.level].bg} ${riskConfig[factor.level].text}`}>
                      {riskConfig[factor.level].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasRisk && (
            <div className="card-base p-4 border-l-4 border-l-accent-green bg-gradient-to-br from-accent-green/5 to-transparent">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-green" />
                <span className="text-sm font-bold text-accent-green">当前无风险</span>
                <span className="text-xs text-navy-400 ml-auto">车辆运行正常</span>
              </div>
            </div>
          )}

          <div className="card-base p-4">
            <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
              <Route className="w-4 h-4 text-accent-blue" />
              行程信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-navy-400 mb-1">当前线路</div>
                <div className="text-sm font-medium text-white">{bus.routeName}</div>
              </div>
              <div>
                <div className="text-xs text-navy-400 mb-1">运行状态</div>
                <StatusBadge status={bus.status} size="md" />
              </div>
              <div>
                <div className="text-xs text-navy-400 mb-1">下一站</div>
                <div className="text-sm font-medium text-accent-green flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {bus.nextStop.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-navy-400 mb-1">预计到站</div>
                <div className="text-sm font-mono font-bold text-accent-yellow flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {bus.nextStop.etaMinutes >= 0
                    ? `${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`
                    : "--:--"}
                </div>
              </div>
            </div>
          </div>

          {progress && (
            <div className="card-base p-4">
              <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
                <BusIcon className="w-4 h-4 text-accent-yellow" />
                本班次进度
                <span className="ml-auto text-xs text-navy-400 font-normal">
                  {shiftType === "morning" ? "早送" : "晚接"}班次
                </span>
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 bg-navy-900/40 rounded-lg">
                  <div className="text-xl font-bold text-white font-mono">
                    {progress.completedStops}/{progress.totalStops}
                  </div>
                  <div className="text-xs text-navy-400">完成站点</div>
                </div>
                <div className="text-center p-2 bg-navy-900/40 rounded-lg">
                  <div className="text-xl font-bold text-accent-green font-mono">
                    {progress.pickedStudents}
                  </div>
                  <div className="text-xs text-navy-400">已接学生</div>
                </div>
                <div className="text-center p-2 bg-navy-900/40 rounded-lg">
                  <div className="text-xl font-bold text-accent-yellow font-mono">
                    {progress.pendingStudents}
                  </div>
                  <div className="text-xs text-navy-400">待接学生</div>
                </div>
                <div className="text-center p-2 bg-navy-900/40 rounded-lg">
                  <div className="text-xl font-bold text-accent-blue font-mono">
                    {progress.totalStops > 0 ? Math.round((progress.completedStops / progress.totalStops) * 100) : 0}%
                  </div>
                  <div className="text-xs text-navy-400">完成进度</div>
                </div>
              </div>
              <div className="w-full h-2 bg-navy-700 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.totalStops > 0 ? (progress.completedStops / progress.totalStops) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="space-y-1.5">
                {progress.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      stop.completed ? "bg-accent-green/5" : "bg-navy-900/30"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        stop.completed
                          ? "bg-accent-green text-white"
                          : "bg-navy-700 text-navy-400"
                      }`}
                    >
                      {stop.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-sm flex-1 ${
                        stop.completed ? "text-accent-green" : "text-navy-300"
                      }`}
                    >
                      {stop.name}
                    </span>
                    {stop.studentsToPick && (
                      <span className="text-xs text-navy-400">
                        {stop.studentsToPick}人
                      </span>
                    )}
                    {stop.completeTime && (
                      <span className="text-xs text-navy-500 font-mono">
                        {stop.completeTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-base p-4">
            <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-green" />
              已上车学生名单
              <span className="ml-auto text-xs text-navy-400 font-normal">
                共 {bus.onboardStudents.length} 人 / 核载 {bus.capacity} 人
              </span>
            </h3>

            {bus.onboardStudents.length === 0 ? (
              <div className="text-center py-8 text-navy-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">暂无学生上车</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {bus.onboardStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-navy-900/40 rounded-lg border border-navy-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-xs text-navy-400">
                          {student.grade}{student.className}
                        </div>
                      </div>
                    </div>
                    {student.boardTime && (
                      <span className="text-xs font-mono text-accent-green bg-accent-green/10 px-2 py-1 rounded">
                        {student.boardTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {busAlerts.length > 0 && (
            <div className="card-base p-4">
              <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent-red" />
                本班次异常记录
                <span className="ml-auto text-xs text-navy-400 font-normal">
                  共 {busAlerts.length} 条记录
                </span>
              </h3>
              {activeAlerts.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-accent-red mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    待处理（{activeAlerts.length}）
                  </div>
                  <div className="space-y-2">
                    {activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-accent-red/5 border border-accent-red/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`status-badge text-xs ${
                              alert.level === "high"
                                ? "bg-accent-red/15 text-accent-red"
                                : alert.level === "medium"
                                ? "bg-accent-yellow/15 text-accent-yellow"
                                : "bg-accent-blue/15 text-accent-blue"
                            }`}
                          >
                            {alert.typeName}
                          </span>
                          <span className="text-xs text-navy-400 font-mono ml-auto">
                            {alert.timestamp.split(" ")[1]}
                          </span>
                        </div>
                        <p className="text-xs text-navy-300">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-navy-300 mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  历史记录（{busAlerts.filter((a) => a.status === "resolved").length}）
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {busAlerts
                    .filter((a) => a.status === "resolved")
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-navy-900/40 border border-navy-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="status-badge text-xs bg-accent-green/15 text-accent-green">
                            {alert.typeName}
                          </span>
                          <span className="text-xs text-navy-500 font-mono ml-auto">
                            {alert.timestamp.split(" ")[1]}
                          </span>
                        </div>
                        <p className="text-xs text-navy-400 mb-1">{alert.description}</p>
                        <p className="text-xs text-navy-500">
                          处理结果：{alert.handleResult || "已解决"}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card-base p-4">
            <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-accent-blue" />
              司机信息
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center border-2 border-navy-600">
                <User className="w-7 h-7 text-navy-300" />
              </div>
              <div>
                <div className="text-base font-bold text-white">{bus.driver.name}</div>
                <div className="text-xs text-navy-400">主驾</div>
              </div>
            </div>
            <ContactButton
              name={bus.driver.name}
              phone={bus.driver.phone}
              phoneFull={bus.driver.phoneFull}
              busPlate={bus.plateNumber}
              variant="success"
              label={`联系司机`}
              className="w-full"
            />
          </div>

          <div className="card-base p-4">
            <h3 className="text-sm font-bold text-navy-200 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-accent-yellow" />
              随车照管员
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-yellow/30 to-accent-yellow/10 flex items-center justify-center border-2 border-accent-yellow/30">
                <User className="w-7 h-7 text-accent-yellow" />
              </div>
              <div>
                <div className="text-base font-bold text-white">{bus.attendant.name}</div>
                <div className="text-xs text-navy-400">照管员</div>
              </div>
            </div>
            <ContactButton
              name={bus.attendant.name}
              phone={bus.attendant.phone}
              phoneFull={bus.attendant.phoneFull}
              busPlate={bus.plateNumber}
              variant="primary"
              label={`联系照管员`}
              className="w-full"
            />
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-navy-400 mb-2">数据最后更新</div>
            <div className="text-sm font-mono text-navy-200">{bus.lastUpdate}</div>
            {bus.offlineMinutes && (
              <div className="mt-2 text-xs text-accent-red">
                离线时长：{bus.offlineMinutes} 分钟
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
