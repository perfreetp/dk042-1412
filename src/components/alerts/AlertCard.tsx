import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  User,
  CheckCircle,
  MessageSquare,
  Route,
  Ban,
} from "lucide-react";
import StatusBadge, { LevelBadge } from "@/components/common/StatusBadge";
import { useAppStore } from "@/store";
import type { Alert } from "@/types";

interface AlertCardProps {
  alert: Alert;
  variant?: "active" | "resolved";
}

const typeIcon = {
  route_deviation: Route,
  long_stop: Clock,
  near_no_stop: Ban,
};

export default function AlertCard({ alert, variant = "active" }: AlertCardProps) {
  const [showResultForm, setShowResultForm] = useState(false);
  const [result, setResult] = useState("");
  const updateAlertStatus = useAppStore((s) => s.updateAlertStatus);

  const TypeIcon = typeIcon[alert.type];
  const isResolved = variant === "resolved" || alert.status === "resolved";

  const handleStartProcess = () => {
    updateAlertStatus(alert.id, "processing", undefined, "王主任");
  };

  const handleResolve = () => {
    if (result.trim()) {
      updateAlertStatus(alert.id, "resolved", result, "王主任");
      setShowResultForm(false);
      setResult("");
    }
  };

  return (
    <div
      className={`card-base p-5 transition-all duration-300 hover:shadow-xl ${
        !isResolved
          ? "border-2 border-accent-red/40 animate-border-flash bg-gradient-to-br from-accent-red/5 to-transparent"
          : "opacity-80"
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

      {isResolved ? (
        <div className="p-4 bg-accent-green/10 rounded-lg border border-accent-green/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-accent-green" />
            <span className="text-sm font-medium text-accent-green">处理完成</span>
          </div>
          <div className="text-xs text-navy-300 mb-1">处理人：{alert.handler}</div>
          <div className="text-xs text-navy-300 mb-2">处理时间：{alert.handleTime}</div>
          <div className="text-sm text-navy-100">{alert.handleResult}</div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <button className="flex-1 btn-danger flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              联系司机 {alert.driverPhone}
            </button>
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

          {alert.status === "processing" && !showResultForm && (
            <button
              onClick={() => setShowResultForm(true)}
              className="w-full btn-success flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              标记已处理
            </button>
          )}

          {showResultForm && (
            <div className="p-4 bg-navy-900/50 rounded-lg border border-navy-700/50 space-y-3 animate-fade-in">
              <label className="block">
                <span className="text-xs text-navy-400 mb-1.5 block">处理结果</span>
                <textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="input-base h-20 resize-none"
                  placeholder="请填写处理结果..."
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleResolve}
                  disabled={!result.trim()}
                  className="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
