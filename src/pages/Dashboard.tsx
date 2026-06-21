import { useState, useMemo } from "react";
import {
  Bus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import BusMap from "@/components/bus/BusMap";
import BusCard from "@/components/bus/BusCard";
import BusDetailModal from "@/components/bus/BusDetailModal";
import { useAppStore } from "@/store";
import { routes, grades } from "@/data/buses";
import type { Bus as BusType, BusStatusFilter, GradeFilter, RouteFilter } from "@/types";

export default function Dashboard() {
  const buses = useAppStore((s) => s.buses);
  const alerts = useAppStore((s) => s.alerts);
  const filters = useAppStore((s) => s.filters);
  const setFilterStatus = useAppStore((s) => s.setFilterStatus);
  const setFilterGrade = useAppStore((s) => s.setFilterGrade);
  const setFilterRoute = useAppStore((s) => s.setFilterRoute);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [searchText, setSearchText] = useState("");

  const stats = useMemo(() => {
    const running = buses.filter((b) => b.status === "running").length;
    const stopped = buses.filter((b) => b.status === "stopped").length;
    const offline = buses.filter((b) => b.status === "offline").length;
    const pendingAlerts = alerts.filter((a) => a.status === "pending").length;
    return { running, stopped, offline, pendingAlerts, total: buses.length };
  }, [buses, alerts]);

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
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
  }, [buses, filters, searchText]);

  const statusOptions: { value: BusStatusFilter; label: string }[] = [
    { value: "all", label: "全部状态" },
    { value: "running", label: "运行中" },
    { value: "stopped", label: "已到站" },
    { value: "delay", label: "延迟" },
    { value: "offline", label: "离线" },
  ];

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
          title="已完成接送"
          value={stats.stopped}
          icon={CheckCircle}
          color="blue"
          trend="安全到校"
        />
        <StatCard
          title="异常告警"
          value={stats.pendingAlerts}
          icon={AlertTriangle}
          color="red"
          trend={stats.pendingAlerts > 0 ? "需要立即处理" : "当前无待处理告警"}
        />
        <StatCard
          title="离线车辆"
          value={stats.offline}
          icon={Clock}
          color="yellow"
          trend="待检查设备状态"
        />
      </div>

      <div className="card-base p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-navy-400" />
            <span className="text-sm text-navy-300 font-medium">筛选：</span>
          </div>

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

          <select
            value={filters.status}
            onChange={(e) => setFilterStatus(e.target.value as BusStatusFilter)}
            className="input-base w-36 py-2 text-sm appearance-none cursor-pointer"
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
            className="input-base w-48 py-2 text-sm appearance-none cursor-pointer"
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
            className="input-base w-32 py-2 text-sm appearance-none cursor-pointer"
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
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">实时位置地图</h2>
            <span className="text-xs text-navy-400">点击车辆标记查看详情</span>
          </div>
          <BusMap onSelectBus={setSelectedBus} />
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
                  selected={selectedBus?.id === bus.id}
                  onClick={() => setSelectedBus(bus)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <BusDetailModal
        bus={selectedBus}
        isOpen={!!selectedBus}
        onClose={() => setSelectedBus(null)}
      />
    </div>
  );
}
