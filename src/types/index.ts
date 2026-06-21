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
  status: "running" | "stopped" | "offline" | "delay";
  position: BusPosition;
  grades: string[];
  nextStop: NextStop;
  onboardStudents: Student[];
  lastUpdate: string;
}

export interface Route {
  id: string;
  name: string;
  color: string;
}

export type AlertType = "route_deviation" | "long_stop" | "near_no_stop";
export type AlertLevel = "high" | "medium" | "low";
export type AlertStatus = "pending" | "processing" | "resolved";

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
  handler?: string;
  handleResult?: string;
  handleTime?: string;
}

export interface PreparationCheck {
  busId: string;
  busPlateNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  isOnline: boolean;
  isGpsNormal: boolean;
  isDriverConfirmed: boolean;
  confirmTime?: string;
  remark?: string;
}

export type BusStatusFilter = "all" | "running" | "stopped" | "delay" | "offline";
export type GradeFilter = "all" | string;
export type RouteFilter = "all" | string;
