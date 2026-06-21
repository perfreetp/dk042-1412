import { User, Users, Phone, MapPin, Clock, Route, CheckCircle2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import StatusBadge from "@/components/common/StatusBadge";
import type { Bus } from "@/types";
import { useCountdown } from "@/hooks/useTimer";

interface BusDetailModalProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BusDetailModal({ bus, isOpen, onClose }: BusDetailModalProps) {
  const timeLeft = useCountdown(bus?.nextStop.etaMinutes || 0);

  if (!bus) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${bus.plateNumber} - 实时详情`}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
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
            <button className="w-full btn-success flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {bus.driver.phone}
            </button>
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
            <button className="w-full btn-primary flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {bus.attendant.phone}
            </button>
          </div>

          <div className="card-base p-4">
            <div className="text-xs text-navy-400 mb-2">数据最后更新</div>
            <div className="text-sm font-mono text-navy-200">{bus.lastUpdate}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
