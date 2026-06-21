import { NavLink } from "react-router-dom";
import { Bus, AlertTriangle, ClipboardCheck, Shield, User } from "lucide-react";
import { useAppStore } from "@/store";
import { useClock } from "@/hooks/useTimer";

const navItems = [
  { path: "/", label: "实时监控", icon: Bus },
  { path: "/alerts", label: "路线偏离提醒", icon: AlertTriangle },
  { path: "/preparation", label: "放学前准备", icon: ClipboardCheck },
];

export default function Sidebar() {
  const currentTime = useAppStore((s) => s.currentTime);
  useClock();

  const pendingAlerts = useAppStore((s) =>
    s.alerts.filter((a) => a.status === "pending").length
  );

  return (
    <aside className="w-64 h-screen bg-navy-950 border-r border-navy-800 flex flex-col">
      <div className="p-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">校车护航台</h1>
            <p className="text-xs text-navy-400">实时安全监控系统</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""} group relative`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.path === "/alerts" && pendingAlerts > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-accent-red text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {pendingAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-800 space-y-4">
        <div className="card-base p-4">
          <div className="text-xs text-navy-400 mb-1">当前时间</div>
          <div className="text-xl font-mono font-bold text-accent-green">
            {currentTime}
          </div>
          <div className="text-xs text-navy-400 mt-1">
            {new Date().toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center">
            <User className="w-5 h-5 text-navy-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">王主任</div>
            <div className="text-xs text-navy-400 truncate">校车管理员</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
