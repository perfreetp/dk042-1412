import { useState } from "react";
import {
  AlertTriangle,
  Route,
  Clock,
  Ban,
  CheckCircle2,
  History,
  Shield,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import AlertCard from "@/components/alerts/AlertCard";
import { useAppStore } from "@/store";
import type { AlertType } from "@/types";

const typeFilters: { value: "all" | AlertType; label: string; icon: typeof AlertTriangle }[] = [
  { value: "all", label: "全部类型", icon: Shield },
  { value: "route_deviation", label: "路线偏离", icon: Route },
  { value: "long_stop", label: "长时间停留", icon: Clock },
  { value: "near_no_stop", label: "接近禁停区", icon: Ban },
];

export default function Alerts() {
  const alerts = useAppStore((s) => s.alerts);
  const resolvedAlerts = useAppStore((s) => s.resolvedAlerts);
  const [activeTab, setActiveTab] = useState<"active" | "resolved">("active");
  const [typeFilter, setTypeFilter] = useState<"all" | AlertType>("all");

  const stats = {
    deviation: alerts.filter((a) => a.type === "route_deviation").length,
    longStop: alerts.filter((a) => a.type === "long_stop").length,
    noStop: alerts.filter((a) => a.type === "near_no_stop").length,
    total: alerts.length,
  };

  const filteredActive = alerts.filter(
    (a) => typeFilter === "all" || a.type === typeFilter
  );
  const filteredResolved = resolvedAlerts.filter(
    (a) => typeFilter === "all" || a.type === typeFilter
  );

  const displayList = activeTab === "active" ? filteredActive : filteredResolved;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">路线偏离提醒</h1>
        <p className="text-sm text-navy-400">
          实时监测校车运行异常，第一时间处置风险
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="待处理告警"
          value={stats.total}
          icon={AlertTriangle}
          color="red"
          trend={stats.total > 0 ? "请立即处理" : "全部正常"}
        />
        <StatCard
          title="路线偏离"
          value={stats.deviation}
          icon={Route}
          color="red"
          trend="高风险"
        />
        <StatCard
          title="长时间停留"
          value={stats.longStop}
          icon={Clock}
          color="yellow"
          trend="中风险"
        />
        <StatCard
          title="接近禁停区"
          value={stats.noStop}
          icon={Ban}
          color="blue"
          trend="低风险提示"
        />
      </div>

      <div className="card-base p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 p-1 bg-navy-900/50 rounded-lg">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "active"
                ? "bg-accent-red/20 text-accent-red"
                : "text-navy-300 hover:text-white hover:bg-navy-800/50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            待处理告警
            <span
              className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                activeTab === "active"
                  ? "bg-accent-red/30 text-accent-red"
                  : "bg-navy-700 text-navy-400"
              }`}
            >
              {alerts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "resolved"
                ? "bg-accent-green/20 text-accent-green"
                : "text-navy-300 hover:text-white hover:bg-navy-800/50"
            }`}
          >
            <History className="w-4 h-4" />
            处理历史
            <span
              className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                activeTab === "resolved"
                  ? "bg-accent-green/30 text-accent-green"
                  : "bg-navy-700 text-navy-400"
              }`}
            >
              {resolvedAlerts.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {typeFilters.map((tf) => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.value}
                onClick={() => setTypeFilter(tf.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  typeFilter === tf.value
                    ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                    : "bg-navy-700/50 text-navy-300 hover:text-white hover:bg-navy-700 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {displayList.length === 0 ? (
          <div className="col-span-2">
            <div className="card-base p-12 text-center">
              {activeTab === "active" ? (
                <>
                  <CheckCircle2 className="w-16 h-16 mx-auto text-accent-green/50 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">暂无异常告警</h3>
                  <p className="text-navy-400">所有校车运行正常，继续保持监控</p>
                </>
              ) : (
                <>
                  <History className="w-16 h-16 mx-auto text-navy-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">暂无处理记录</h3>
                  <p className="text-navy-400">已处理的告警将在此处显示</p>
                </>
              )}
            </div>
          </div>
        ) : (
          displayList.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              variant={activeTab}
            />
          ))
        )}
      </div>
    </div>
  );
}
