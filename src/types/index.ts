export interface Student {
  id: string;
  name: string;
  grade: string;
  className: string;
  boardTime?: string;
}

export interface BusPosition {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export interface NextStop {
  name: string;
  eta: string;
  etaMinutes: number;
}

export type BusStatus = "running" | "stopped" | "offline" | "delay";

export type RiskLevel = "none" | "low" | "medium" | "high";

export interface RiskFactor {
  type: "late_arrival" | "offline_long" | "next_stop_abnormal" | "route_deviation" | "long_stop";
  label: string;
  description: string;
  level: RiskLevel;
}

export interface RiskInfo {
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface Bus {
  id: string;
  plateNumber: string;
  driver: {
    name: string;
    phone: string;
  };
  attendant: {
    name: string;
    phone: string;
  };
  routeId: string;
  routeName: string;
  currentPassengers: number;
  capacity: number;
  status: BusStatus;
  position: BusPosition;
  grades: string[];
  nextStop: NextStop;
  onboardStudents: Student[];
  lastUpdate: string;
  offlineMinutes?: number;
}

export interface Route {
  id: string;
  name: string;
  color: string;
}

export type AlertType = "route_deviation" | "long_stop" | "near_no_stop";
export type AlertLevel = "high" | "medium" | "low";
export type AlertStatus = "pending" | "processing" | "resolved";

export interface ContactLogEntry {
  id: string;
  method: "call" | "sms";
  target: string;
  operator: string;
  timestamp: string;
  note?: string;
}

export type DisposeReason =
  | "driver_communicated"
  | "route_adjusted"
  | "false_alarm"
  | "equipment_issue"
  | "traffic_delay"
  | "student_waited"
  | "other";

export interface Alert {
  id: string;
  busId: string;
  busPlateNumber: string;
  driverName: string;
  driverPhone: string;
  type: AlertType;
  typeName: string;
  level: AlertLevel;
  description: string;
  location: string;
  timestamp: string;
  status: AlertStatus;
  contactLog: ContactLogEntry[];
  handler?: string;
  disposeReason?: DisposeReason;
  handleResult?: string;
  handleTime?: string;
  processStartTime?: string;
}

export type ShiftType = "morning" | "afternoon";

export interface Shift {
  id: string;
  type: ShiftType;
  name: string;
  scheduledTime: string;
  busIds: string[];
}

export interface PreparationCheck {
  busId: string;
  busPlateNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  shiftId: string;
  isOnline: boolean;
  isGpsNormal: boolean;
  isDriverConfirmed: boolean;
  confirmTime?: string;
  remark?: string;
}

export type BusStatusFilter = "all" | "running" | "stopped" | "delay" | "offline";
export type RiskFilter = "all" | "high" | "medium" | "low" | "none";
export type GradeFilter = "all" | string;
export type RouteFilter = "all" | string;

export const DISPOSE_REASONS: { value: DisposeReason; label: string }[] = [
  { value: "driver_communicated", label: "已与司机沟通确认" },
  { value: "route_adjusted", label: "临时调整路线" },
  { value: "false_alarm", label: "误报，已核实无异常" },
  { value: "equipment_issue", label: "设备故障，已报修" },
  { value: "traffic_delay", label: "交通拥堵导致延误" },
  { value: "student_waited", label: "等待迟到学生" },
  { value: "other", label: "其他原因" },
];
