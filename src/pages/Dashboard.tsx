import { useState, useMemo } from "react";
import {
  Bus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Flame,
  LayoutGrid,
  Map as MapIcon,
  Sunrise,
  Sunset,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import BusMap from "@/components/bus/BusMap";
import BusCard from "@/components/bus/BusCard";
import BusDetailModal from "@/components/bus/BusDetailModal";
import ShiftProgressView from "@/components/dashboard/ShiftProgressView";
import { useAppStore, calculateRisk } from "@/store";
import { routes, grades } from "@/data/buses";
import { riskConfig } from "@/utils/risk";
import type {
  Bus as BusType,
  BusStatusFilter,
  RiskFilter,
  GradeFilter,
  RouteFilter,
  ShiftType,
} from "@/types";

type ViewMode = "map" | "progress";

const riskOptions: { value: RiskFilter; label: string; color: string }[] = [
  { value: "all", label: "全部风险", color: "text-navy-300" },
  { value: "high", label: "高风险", color: "text-accent-red" },
  { value: "medium", label: "中风险", color: "text-accent-yellow" },
  { value: "low", label: "低风险", color: "text-accent-blue" },
  { value: "none", label: "无风险", color: "text-accent-green" },
];

export default function Dashboard() {
  const buses = useAppStore((s) => s.buses);
  const alerts = useAppStore((s) => s.alerts);
  const filters = useAppStore((s) => s.filters);
  const setFilterStatus = useAppStore((s) => s.setFilterStatus);
  const setFilterRisk = useAppStore((s) => s.setFilterRisk);
  const setFilterGrade = useAppStore((s) => s.setFilterGrade);
  const setFilterRoute = useAppStore((s) => s.setFilterRoute);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeShiftType, setActiveShiftType] = useState<ShiftType>("morning");

  const busRisks = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateRisk>>();
    buses.forEach((b) => map.set(b.id, calculateRisk(b, alerts)));
    return map;
  }, [buses, alerts]);

  const stats = useMemo(() => {
    const running = buses.filter((b) => b.status === "running").length;
    const stopped = buses.filter((b) => b.status === "stopped").length;
    const offline = buses.filter((b) => b.status === "offline").length;
    const pendingAlerts = alerts.filter((a) => a.status === "pending").length;
    const highRisk = buses.filter(
      (b) => busRisks.get(b.id)?.level === "high"
    ).length;
    return {
      running,
      stopped,
      offline,
      pendingAlerts,
      highRisk,
      total: buses.length,
    };
  }, [buses, alerts, busRisks]);

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const risk = busRisks.get(bus.id);
      if (filters.risk !== "all" && risk?.level !== filters.risk) return false;
      if (filters.status !== "all" && bus.status !== filters.status) return false;
      if (filters.grade !== "all" && !bus.grades.includes(filters.grade)) return false;
      if (filters.route !== "all" && bus.routeId !== filters.route) return false;
      if (searchText) {
        const text = searchText.toLowerCase();
        return (
          bus.plateNumber.toLowerCase().includes(text) ||
          bus.driver.name.includes(text) ||
          bus.routeName.includes(text)
        );
      }
      return true;
    });
  }, [buses, filters, searchText, busRisks]);

  const statusOptions: { value: BusStatusFilter; label: string }[] = [
    { value: "all", label: "全部状态" },
    { value: "running", label: "运行中" },
    { value: "stopped", label: "已到站" },
    { value: "delay", label: "延迟" },
    { value: "offline", label: "离线" },
  ];

  const handleSelectBus = (bus: BusType) => {
    setSelectedBus(bus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">实时监控</h1>
          <p className="text-sm text-navy-400">掌握所有校车实时动态，确保学生接送安全</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="在途车辆"
          value={stats.running}
          icon={Bus}
          color="green"
          trend={`总计 ${stats.total} 辆校车`}
        />
        <StatCard
          title="高风险车辆"
          value={stats.highRisk}
          icon={Flame}
          color="red"
          trend={stats.highRisk > 0 ? "需重点关注" : "当前无高风险"}
        />
        <StatCard
          title="异常告警"
          value={stats.pendingAlerts}
          icon={AlertTriangle}
          color="yellow"
          trend={stats.pendingAlerts > 0 ? "需要处理" : "当前无待处理告警"}
        />
        <StatCard
          title="已完成接送"
          value={stats.stopped}
          icon={CheckCircle}
          color="blue"
          trend="安全到校"
        />
      </div>

      <div className="card-base p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-navy-400" />
            <span className="text-sm text-navy-300 font-medium">筛选：</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-navy-900/50 rounded-lg">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "map"
                  ? "bg-navy-700 text-white"
                  : "text-navy-400 hover:text-white hover:bg-navy-800/50"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              地图视图
            </button>
            <button
              onClick={() => setViewMode("progress")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "progress"
                  ? "bg-navy-700 text-white"
                  : "text-navy-400 hover:text-white hover:bg-navy-800/50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              班次进度
            </button>
          </div>

          {viewMode === "progress" && (
            <div className="flex items-center gap-1 p-1 bg-navy-900/50 rounded-lg">
              <button
                onClick={() => setActiveShiftType("morning")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeShiftType === "morning"
                    ? "bg-accent-yellow/20 text-accent-yellow"
                    : "text-navy-400 hover:text-white hover:bg-navy-800/50"
                }`}
              >
                <Sunrise className="w-4 h-4" />
                早送
              </button>
              <button
                onClick={() => setActiveShiftType("afternoon")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeShiftType === "afternoon"
                    ? "bg-accent-blue/20 text-accent-blue"
                    : "text-navy-400 hover:text-white hover:bg-navy-800/50"
                }`}
              >
                <Sunset className="w-4 h-4" />
                晚接
              </button>
            </div>
          )}

          {viewMode === "map" && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
                <input
                  type="text"
                  placeholder="搜索车牌/司机/线路..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="input-base pl-9 w-56 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-navy-900/50 rounded-lg">
                {riskOptions.map((opt) => {
                  const isActive = filters.risk === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFilterRisk(opt.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? "bg-navy-700 " + opt.color
                          : "text-navy-400 hover:text-white hover:bg-navy-800/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

          <select
            value={filters.status}
            onChange={(e) => setFilterStatus(e.target.value as BusStatusFilter)}
            className="input-base w-32 py-2 text-sm appearance-none cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filters.route}
            onChange={(e) => setFilterRoute(e.target.value as RouteFilter)}
            className="input-base w-44 py-2 text-sm appearance-none cursor-pointer"
          >
            <option value="all">全部线路</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={filters.grade}
            onChange={(e) => setFilterGrade(e.target.value as GradeFilter)}
            className="input-base w-28 py-2 text-sm appearance-none cursor-pointer"
          >
            <option value="all">全部年级</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <div className="ml-auto text-sm text-navy-400">
            共筛选出 <span className="text-white font-bold font-mono">{filteredBuses.length}</span> 辆校车
          </div>
            </>
          )}
        </div>

        {filters.risk !== "all" && viewMode === "map" && (
          <div className="mt-3 pt-3 border-t border-navy-700/50 flex items-center gap-2 text-xs">
            <Flame className="w-3.5 h-3.5 text-accent-yellow" />
            <span className="text-navy-300">
              已按
              <span className={`font-bold mx-1 ${riskConfig[filters.risk as "high" | "medium" | "low" | "none"].text}`}>
                {riskConfig[filters.risk as "high" | "medium" | "low" | "none"].label}
              </span>
              筛选，地图与列表已同步显示对应车辆
            </span>
          </div>
        )}
      </div>

      {viewMode === "map" ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">实时位置地图</h2>
              <span className="text-xs text-navy-400">点击车辆标记查看详情</span>
            </div>
            <BusMap onSelectBus={handleSelectBus} />
          </div>

          <div className="col-span-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">车辆列表</h2>
              <span className="text-xs text-navy-400">共 {filteredBuses.length} 辆</span>
            </div>
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredBuses.length === 0 ? (
                <div className="card-base p-8 text-center">
                  <Bus className="w-10 h-10 mx-auto text-navy-600 mb-2" />
                  <p className="text-navy-500">没有符合条件的校车</p>
                </div>
              ) : (
                filteredBuses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    risk={busRisks.get(bus.id)!}
                    selected={selectedBus?.id === bus.id}
                    onClick={() => setSelectedBus(bus)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <ShiftProgressView shiftType={activeShiftType} />
      )}

      <BusDetailModal
        bus={selectedBus}
        risk={selectedBus ? busRisks.get(selectedBus.id) : undefined}
        shiftType={activeShiftType}
        isOpen={!!selectedBus}
        onClose={() => setSelectedBus(null)}
      />
    </div>
  );
}
