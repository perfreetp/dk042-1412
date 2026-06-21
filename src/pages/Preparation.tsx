import { useState, useMemo } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Phone,
  Send,
  Wifi,
  MapPin,
  UserCheck,
  ChevronRight,
  Bell,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import { CheckBadge } from "@/components/common/StatusBadge";
import { useAppStore } from "@/store";
import { useCountdown } from "@/hooks/useTimer";

const SCHOOL_DISMISS_TIME = 25;

export default function Preparation() {
  const checks = useAppStore((s) => s.preparationChecks);
  const toggleDriverConfirm = useAppStore((s) => s.toggleDriverConfirm);
  const sendReminder = useAppStore((s) => s.sendReminder);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const timeLeft = useCountdown(SCHOOL_DISMISS_TIME);

  const stats = useMemo(() => {
    const online = checks.filter((c) => c.isOnline).length;
    const gpsOk = checks.filter((c) => c.isGpsNormal).length;
    const confirmed = checks.filter((c) => c.isDriverConfirmed).length;
    const total = checks.length;
    const allReady = online === total && gpsOk === total && confirmed === total;
    return { online, gpsOk, confirmed, total, allReady, notReady: total - confirmed };
  }, [checks]);

  const phases = [
    {
      name: "检查阶段",
      time: "放学前30分钟",
      label: "系统自动启动设备检查",
      status: "done" as const,
      icon: Wifi,
    },
    {
      name: "确认阶段",
      time: "放学前20分钟",
      label: "司机确认发车准备就绪",
      status: "current" as const,
      icon: UserCheck,
    },
    {
      name: "发车阶段",
      time: "放学前10分钟",
      label: "校车陆续出发前往接站点",
      status: "pending" as const,
      icon: ChevronRight,
    },
  ];

  const notReadyList = checks.filter((c) => !c.isOnline || !c.isGpsNormal || !c.isDriverConfirmed);

  const handleSendAllReminders = () => {
    notReadyList.forEach((c) => {
      if (!c.isDriverConfirmed) sendReminder(c.busId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">放学前准备</h1>
          <p className="text-sm text-navy-400">
            检查所有车辆状态，确保放学接送顺利进行
          </p>
        </div>

        <div className="card-base p-5 flex items-center gap-5 bg-gradient-to-br from-accent-yellow/10 to-transparent border-accent-yellow/30">
          <div className="text-center">
            <div className="text-xs text-navy-400 mb-1">距离放学还有</div>
            <div className="flex items-baseline gap-1 font-mono font-bold">
              <span className="text-4xl text-accent-yellow">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-accent-yellow/60 text-xl">:</span>
              <span className="text-4xl text-accent-yellow">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-sm text-navy-400 ml-1">分钟</span>
            </div>
          </div>
          <div className="w-px h-14 bg-navy-700" />
          <div className="space-y-1.5">
            <div className="text-sm text-navy-300">
              {stats.allReady ? (
                <span className="flex items-center gap-1.5 text-accent-green font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  所有车辆准备就绪
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-accent-yellow font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  还有 {stats.notReady} 辆车未确认
                </span>
              )}
            </div>
            {!stats.allReady && (
              <button
                onClick={handleSendAllReminders}
                className="btn-danger text-sm py-1.5 px-3 flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                一键批量提醒
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="车辆已上线"
          value={`${stats.online}/${stats.total}`}
          icon={Wifi}
          color="green"
        />
        <StatCard
          title="定位正常"
          value={`${stats.gpsOk}/${stats.total}`}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="司机已确认"
          value={`${stats.confirmed}/${stats.total}`}
          icon={UserCheck}
          color={stats.confirmed === stats.total ? "green" : "yellow"}
        />
        <StatCard
          title="未完成项"
          value={notReadyList.length}
          icon={AlertTriangle}
          color={notReadyList.length === 0 ? "green" : "red"}
          trend={notReadyList.length === 0 ? "全部就绪" : "需要处理"}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="card-base p-5">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-blue" />
              检查时间轴
            </h2>

            <div className="relative">
              <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-navy-700" />

              <div className="space-y-6">
                {phases.map((phase, idx) => {
                  const Icon = phase.icon;
                  const isDone = phase.status === "done";
                  const isCurrent = phase.status === "current";

                  return (
                    <div key={idx} className="relative flex gap-4">
                      <div
                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? "bg-accent-green text-white"
                            : isCurrent
                            ? "bg-accent-yellow text-navy-900 animate-pulse"
                            : "bg-navy-700 text-navy-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`text-sm font-bold ${
                              isDone || isCurrent ? "text-white" : "text-navy-400"
                            }`}
                          >
                            {phase.name}
                          </h3>
                          <span className="text-xs text-navy-500">{phase.time}</span>
                        </div>
                        <p
                          className={`text-xs ${
                            isDone || isCurrent ? "text-navy-300" : "text-navy-500"
                          }`}
                        >
                          {phase.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {notReadyList.length > 0 && (
            <div className="card-base p-5 mt-5 border-accent-red/30 bg-gradient-to-br from-accent-red/5 to-transparent">
              <h2 className="text-base font-bold text-accent-red mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                未完成项汇总
              </h2>
              <p className="text-xs text-navy-400 mb-3">
                以下车辆需要值班老师跟进处理
              </p>
              <div className="space-y-2">
                {notReadyList.map((c) => (
                  <div
                    key={c.busId}
                    className="p-3 bg-navy-900/50 rounded-lg border border-navy-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white font-mono">
                        {c.busPlateNumber}
                      </span>
                      <span className="text-xs text-navy-400">{c.driverName}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {!c.isOnline && (
                        <span className="text-xs px-2 py-0.5 bg-accent-red/15 text-accent-red rounded">
                          设备离线
                        </span>
                      )}
                      {!c.isGpsNormal && (
                        <span className="text-xs px-2 py-0.5 bg-accent-yellow/15 text-accent-yellow rounded">
                          定位异常
                        </span>
                      )}
                      {!c.isDriverConfirmed && (
                        <span className="text-xs px-2 py-0.5 bg-accent-blue/15 text-accent-blue rounded">
                          未确认发车
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8">
          <div className="card-base overflow-hidden">
            <div className="p-5 border-b border-navy-700/50">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-accent-green" />
                车辆检查列表
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      车牌号
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      司机
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      线路
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      设备在线
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      GPS定位
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      司机确认
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-navy-400 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((c) => {
                    const isExpanded = selectedBusId === c.busId;
                    return (
                      <>
                        <tr
                          key={c.busId}
                          onClick={() => setSelectedBusId(isExpanded ? null : c.busId)}
                          className={`border-b border-navy-700/30 hover:bg-navy-800/30 cursor-pointer transition-colors ${
                            (!c.isOnline || !c.isGpsNormal || !c.isDriverConfirmed)
                              ? "bg-accent-red/3"
                              : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-white font-mono">
                              {c.busPlateNumber}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-navy-200">{c.driverName}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-navy-300">{c.routeName}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <CheckBadge checked={c.isOnline} label="设备" />
                          </td>
                          <td className="px-5 py-4 text-center">
                            <CheckBadge checked={c.isGpsNormal} label="GPS" />
                          </td>
                          <td className="px-5 py-4 text-center">
                            {c.isDriverConfirmed ? (
                              <div>
                                <span className="status-badge bg-accent-green/15 text-accent-green">
                                  <CheckCircle2 className="w-3 h-3" />
                                  已确认 {c.confirmTime}
                                </span>
                              </div>
                            ) : (
                              <span className="status-badge bg-accent-yellow/15 text-accent-yellow">
                                <Clock className="w-3 h-3" />
                                待确认
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDriverConfirm(c.busId);
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  c.isDriverConfirmed
                                    ? "bg-accent-green/20 text-accent-green"
                                    : "bg-navy-700 text-navy-300 hover:bg-accent-yellow/20 hover:text-accent-yellow"
                                }`}
                                title={c.isDriverConfirmed ? "取消确认" : "标记已确认"}
                              >
                                {c.isDriverConfirmed ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendReminder(c.busId);
                                }}
                                className="p-2 rounded-lg bg-navy-700 text-navy-300 hover:bg-accent-blue/20 hover:text-accent-blue transition-colors"
                                title="发送提醒"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <a
                                href={`tel:${c.driverPhone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-lg bg-navy-700 text-navy-300 hover:bg-accent-green/20 hover:text-accent-green transition-colors"
                                title="联系司机"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-navy-900/50">
                            <td colSpan={7} className="px-5 py-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                  <div>
                                    <div className="text-xs text-navy-400 mb-1">联系电话</div>
                                    <div className="text-sm text-white font-mono">
                                      {c.driverPhone}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-navy-400 mb-1">备注信息</div>
                                    <div className="text-sm text-navy-200">
                                      {c.remark || "无"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleDriverConfirm(c.busId)}
                                    className={c.isDriverConfirmed ? "btn-secondary" : "btn-success"}
                                  >
                                    {c.isDriverConfirmed ? "取消确认" : "标记司机已确认"}
                                  </button>
                                  <button
                                    onClick={() => sendReminder(c.busId)}
                                    className="btn-primary flex items-center gap-2"
                                  >
                                    <Send className="w-4 h-4" />
                                    发送发车提醒
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
