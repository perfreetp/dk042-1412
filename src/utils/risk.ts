import type { Bus, RiskInfo, RiskFactor, RiskLevel, Alert } from "@/types";

const levelPriority: Record<RiskLevel, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export function calculateRisk(bus: Bus, alerts: Alert[]): RiskInfo {
  const factors: RiskFactor[] = [];

  if (bus.status === "offline") {
    const offlineMin = bus.offlineMinutes ?? 55;
    if (offlineMin >= 30) {
      factors.push({
        type: "offline_long",
        label: "离线时间过长",
        description: `车辆已离线 ${offlineMin} 分钟，无法获取实时位置`,
        level: "high",
      });
    }
  }

  if (bus.nextStop.etaMinutes > 15) {
    factors.push({
      type: "late_arrival",
      label: "预计晚到",
      description: `预计还需 ${bus.nextStop.etaMinutes} 分钟到达下一站，超出正常范围`,
      level: "high",
    });
  } else if (bus.nextStop.etaMinutes >= 8 && bus.nextStop.etaMinutes <= 15 && bus.status === "delay") {
    factors.push({
      type: "late_arrival",
      label: "到站延迟",
      description: `预计 ${bus.nextStop.etaMinutes} 分钟后到站，存在延迟风险`,
      level: "medium",
    });
  }

  if (
    bus.status !== "offline" &&
    bus.nextStop.etaMinutes < 0 &&
    bus.currentPassengers === 0
  ) {
    factors.push({
      type: "next_stop_abnormal",
      label: "下一站异常",
      description: "尚未发车或站点信息未更新，需核实车辆状态",
      level: "medium",
    });
  }

  const busAlerts = alerts.filter(
    (a) => a.busId === bus.id && a.status !== "resolved"
  );
  busAlerts.forEach((alert) => {
    if (alert.type === "route_deviation") {
      factors.push({
        type: "route_deviation",
        label: "路线偏离告警",
        description: alert.description,
        level: "high",
      });
    } else if (alert.type === "long_stop") {
      factors.push({
        type: "long_stop",
        label: "长时间停留告警",
        description: alert.description,
        level: alert.level === "high" ? "high" : "medium",
      });
    }
  });

  let maxLevel: RiskLevel = "none";
  for (const f of factors) {
    if (levelPriority[f.level] > levelPriority[maxLevel]) {
      maxLevel = f.level;
    }
  }

  return { level: maxLevel, factors };
}

export const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bg: string; text: string; border: string; dot: string }
> = {
  none: {
    label: "无风险",
    color: "green",
    bg: "bg-accent-green/15",
    text: "text-accent-green",
    border: "border-accent-green/30",
    dot: "bg-accent-green",
  },
  low: {
    label: "低风险",
    color: "blue",
    bg: "bg-accent-blue/15",
    text: "text-accent-blue",
    border: "border-accent-blue/30",
    dot: "bg-accent-blue",
  },
  medium: {
    label: "中风险",
    color: "yellow",
    bg: "bg-accent-yellow/15",
    text: "text-accent-yellow",
    border: "border-accent-yellow/30",
    dot: "bg-accent-yellow",
  },
  high: {
    label: "高风险",
    color: "red",
    bg: "bg-accent-red/15",
    text: "text-accent-red",
    border: "border-accent-red/30",
    dot: "bg-accent-red",
  },
};
