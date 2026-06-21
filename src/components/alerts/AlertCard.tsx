import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Route,
  Ban,
  Phone,
  MessageSquare,
  PhoneCall,
  History,
  Timer,
} from "lucide-react";
import StatusBadge, { LevelBadge } from "@/components/common/StatusBadge";
import { ContactButton } from "@/components/common/ContactDriverModal";
import AlertTimeline from "@/components/alerts/AlertTimeline";
import { useAppStore } from "@/store";
import { DISPOSE_REASONS } from "@/types";
import type { Alert, DisposeReason } from "@/types";

interface AlertCardProps {
  alert: Alert;
  variant?: "active" | "resolved";
}

const typeIcon = {
  route_deviation: Route,
  long_stop: Clock,
  near_no_stop: Ban,
};

const reasonLabel: Record<DisposeReason, string> = {
  driver_communicated: "已与司机沟通确认",
  route_adjusted: "临时调整路线",
  false_alarm: "误报，已核实无异常",
  equipment_issue: "设备故障，已报修",
  traffic_delay: "交通拥堵导致延误",
  student_waited: "等待迟到学生",
  other: "其他原因",
};

export default function AlertCard({ alert, variant = "active" }: AlertCardProps) {
  const [showResultForm, setShowResultForm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [reason, setReason] = useState<DisposeReason>("driver_communicated");
  const [result, setResult] = useState("");
  const [handler, setHandler] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const startProcess = useAppStore((s) => s.startProcess);
  const addContactLog = useAppStore((s) => s.addContactLog);
  const resolveAlert = useAppStore((s) => s.resolveAlert);
  const addDriverReply = useAppStore((s) => s.addDriverReply);
  const addTimelineEvent = useAppStore((s) => s.addTimelineEvent);
  const currentUser = useAppStore((s) => s.currentUser);

  const TypeIcon = typeIcon[alert.type];
  const isResolved = variant === "resolved" || alert.status === "resolved";

  const handleStartProcess = () => {
    startProcess(alert.id);
  };

  const handleContacted = (method: "call" | "sms", note?: string) => {
    addContactLog(alert.id, method, note);
  };

  const handleResolve = () => {
    if (result.trim()) {
      resolveAlert(alert.id, reason, result, handler.trim() || currentUser);
      setShowResultForm(false);
      setResult("");
      setHandler("");
      setReason("driver_communicated");
    }
  };

  const handleDriverReply = () => {
    if (replyContent.trim()) {
      addDriverReply(alert.id, replyContent.trim());
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  const handleRouteReplanned = () => {
    addTimelineEvent(
      alert.id,
      "route_replanned",
      "已重新规划路线",
      "根据司机反馈和现场情况，已为车辆重新规划接送路线",
      currentUser
    );
  };

  return (
    <div
      className={`card-base p-5 transition-all duration-300 hover:shadow-xl ${
        !isResolved
          ? "border-2 border-accent-red/40 animate-border-flash bg-gradient-to-br from-accent-red/5 to-transparent"
          : "opacity-90"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              !isResolved
                ? "bg-accent-red/20 text-accent-red animate-pulse"
                : "bg-accent-green/20 text-accent-green"
            }`}
          >
            <TypeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white">{alert.typeName}</h3>
              <LevelBadge level={alert.level} />
            </div>
            <p className="text-xs text-navy-400">{alert.timestamp}</p>
          </div>
        </div>
        <StatusBadge status={alert.status} />
      </div>

      <p className="text-sm text-navy-200 mb-4 leading-relaxed">{alert.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-navy-400 flex-shrink-0" />
          <span className="text-navy-200 truncate">{alert.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-navy-400 flex-shrink-0" />
          <span className="text-navy-200">{alert.driverName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 flex items-center justify-center text-navy-400 font-bold text-xs">
            🚌
          </div>
          <span className="text-navy-200 font-mono">{alert.busPlateNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-navy-400 flex-shrink-0" />
          <span className="text-navy-200">{alert.timestamp.split(" ")[1]}</span>
        </div>
      </div>

      {alert.contactLog.length > 0 && (
        <div className="mb-4 p-3 bg-navy-900/40 rounded-lg border border-navy-700/50">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-semibold text-navy-200">联系记录</span>
            <span className="text-xs text-navy-500">({alert.contactLog.length}次)</span>
          </div>
          <div className="space-y-1.5">
            {alert.contactLog.map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-xs">
                {log.method === "call" ? (
                  <PhoneCall className="w-3.5 h-3.5 text-accent-green flex-shrink-0 mt-0.5" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5 text-accent-blue flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className="text-navy-300">
                    {log.method === "call" ? "电话" : "短信"} · {log.timestamp}
                  </span>
                  {log.note && (
                    <span className="text-navy-400 ml-1">— {log.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alert.timeline && alert.timeline.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full p-3 bg-navy-900/40 rounded-lg border border-navy-700/50 hover:bg-navy-800/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-accent-yellow" />
              <span className="text-xs font-semibold text-navy-200">处置时间线</span>
              <span className="text-xs text-navy-500">({alert.timeline.length}个事件)</span>
            </div>
            <span className="text-xs text-navy-400">
              {showTimeline ? "收起" : "展开"}
            </span>
          </button>
          {showTimeline && (
            <div className="mt-3 p-4 bg-navy-900/30 rounded-lg border border-navy-700/30 animate-fade-in">
              <AlertTimeline events={alert.timeline} />
            </div>
          )}
        </div>
      )}

      {isResolved ? (
        <div className="space-y-3">
          <div className="p-4 bg-accent-green/10 rounded-lg border border-accent-green/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">处理完成</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-navy-400 w-20 flex-shrink-0">处置原因</span>
                <span className="text-navy-100 font-medium">
                  {alert.disposeReason ? reasonLabel[alert.disposeReason] : "未记录"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-navy-400 w-20 flex-shrink-0">处理结果</span>
                <span className="text-navy-100">{alert.handleResult}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-navy-400 w-20 flex-shrink-0">处理人</span>
                <span className="text-navy-200">{alert.handler}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-navy-400 w-20 flex-shrink-0">处理时间</span>
                <span className="text-navy-200 font-mono">{alert.handleTime}</span>
              </div>
              {alert.processStartTime && (
                <div className="flex items-start gap-2">
                  <span className="text-navy-400 w-20 flex-shrink-0">开始处理</span>
                  <span className="text-navy-200 font-mono">{alert.processStartTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <ContactButton
              name={alert.driverName}
              phone={alert.driverPhone}
              phoneFull={alert.driverPhoneFull}
              busPlate={alert.busPlateNumber}
              variant="danger"
              label={`联系司机`}
              onContacted={handleContacted}
              className="flex-1"
            />
            {alert.status === "pending" && (
              <button
                onClick={handleStartProcess}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                开始处理
              </button>
            )}
          </div>

          {alert.status === "processing" && !showResultForm && !showReplyForm && (
            <div className="space-y-2 mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  记录司机回复
                </button>
                <button
                  onClick={handleRouteReplanned}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <Route className="w-4 h-4" />
                  重新规划路线
                </button>
              </div>
              <button
                onClick={() => setShowResultForm(true)}
                className="w-full btn-success flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                标记已处理
              </button>
            </div>
          )}

          {showReplyForm && (
            <div className="p-4 bg-navy-900/50 rounded-lg border border-navy-700/50 space-y-4 mb-3 animate-fade-in">
              <label className="block">
                <span className="text-xs text-navy-400 mb-1.5 block">司机回复内容</span>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="input-base h-20 resize-none"
                  placeholder="请记录司机反馈的情况..."
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleDriverReply}
                  disabled={!replyContent.trim()}
                  className="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  确认记录
                </button>
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {showResultForm && (
            <div className="p-4 bg-navy-900/50 rounded-lg border border-navy-700/50 space-y-4 animate-fade-in">
              <div>
                <span className="text-xs text-navy-400 mb-1.5 block">处置原因</span>
                <div className="grid grid-cols-2 gap-2">
                  {DISPOSE_REASONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReason(r.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        reason === r.value
                          ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
                          : "bg-navy-800/50 text-navy-300 hover:bg-navy-700 border border-transparent"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs text-navy-400 mb-1.5 block">处理结果备注</span>
                <textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="input-base h-20 resize-none"
                  placeholder="请详细填写处理结果..."
                />
              </label>

              <label className="block">
                <span className="text-xs text-navy-400 mb-1.5 block">处理人</span>
                <input
                  type="text"
                  value={handler}
                  onChange={(e) => setHandler(e.target.value)}
                  className="input-base"
                  placeholder={currentUser}
                />
              </label>

              <div className="flex items-center gap-2 text-xs text-navy-400">
                <Clock className="w-3.5 h-3.5" />
                处理时间将自动记录为提交时刻
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleResolve}
                  disabled={!result.trim()}
                  className="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  提交处理结果
                </button>
                <button
                  onClick={() => setShowResultForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
