import { create } from "zustand";
import type {
  Bus,
  Alert,
  PreparationCheck,
  Shift,
  BusStatusFilter,
  RiskFilter,
  GradeFilter,
  RouteFilter,
  ContactLogEntry,
  DisposeReason,
} from "@/types";
import { buses as mockBuses } from "@/data/buses";
import { alerts as mockAlerts, resolvedAlerts as mockResolvedAlerts } from "@/data/alerts";
import { preparationChecks as mockPrepChecks } from "@/data/preparation";
import { shifts as mockShifts } from "@/data/shifts";
import { calculateRisk } from "@/utils/risk";

interface Filters {
  status: BusStatusFilter;
  risk: RiskFilter;
  grade: GradeFilter;
  route: RouteFilter;
}

interface AppState {
  buses: Bus[];
  alerts: Alert[];
  resolvedAlerts: Alert[];
  preparationChecks: PreparationCheck[];
  shifts: Shift[];
  currentUser: string;
  selectedBusId: string | null;
  activeShiftId: string;
  filters: Filters;
  currentTime: string;

  setSelectedBusId: (id: string | null) => void;
  setFilterStatus: (status: BusStatusFilter) => void;
  setFilterRisk: (risk: RiskFilter) => void;
  setFilterGrade: (grade: GradeFilter) => void;
  setFilterRoute: (route: RouteFilter) => void;

  startProcess: (alertId: string) => void;
  addContactLog: (alertId: string, method: "call" | "sms", note?: string) => void;
  resolveAlert: (
    alertId: string,
    reason: DisposeReason,
    result: string,
    handler: string
  ) => void;

  toggleDriverConfirm: (busId: string) => void;
  sendReminder: (busId: string) => void;
  setActiveShiftId: (shiftId: string) => void;

  updateCurrentTime: () => void;
}

const nowString = () =>
  new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");

const nowTime = () =>
  new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const useAppStore = create<AppState>((set) => ({
  buses: mockBuses,
  alerts: mockAlerts,
  resolvedAlerts: mockResolvedAlerts,
  preparationChecks: mockPrepChecks,
  shifts: mockShifts,
  currentUser: "王主任",
  selectedBusId: null,
  activeShiftId: "shift_afternoon",
  filters: {
    status: "all",
    risk: "all",
    grade: "all",
    route: "all",
  },
  currentTime: nowTime(),

  setSelectedBusId: (id) => set({ selectedBusId: id }),

  setFilterStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),

  setFilterRisk: (risk) =>
    set((state) => ({ filters: { ...state.filters, risk } })),

  setFilterGrade: (grade) =>
    set((state) => ({ filters: { ...state.filters, grade } })),

  setFilterRoute: (route) =>
    set((state) => ({ filters: { ...state.filters, route } })),

  startProcess: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: "processing" as const,
              handler: state.currentUser,
              processStartTime: nowString(),
            }
          : a
      ),
    })),

  addContactLog: (alertId, method, note) =>
    set((state) => {
      const entry: ContactLogEntry = {
        id: `cl_${Date.now()}`,
        method,
        target:
          state.alerts.find((a) => a.id === alertId)?.driverPhone ?? "",
        operator: state.currentUser,
        timestamp: nowString(),
        note,
      };
      return {
        alerts: state.alerts.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: a.status === "pending" ? ("processing" as const) : a.status,
                handler: a.handler ?? state.currentUser,
                processStartTime: a.processStartTime ?? nowString(),
                contactLog: [...a.contactLog, entry],
              }
            : a
        ),
      };
    }),

  resolveAlert: (alertId, reason, result, handler) =>
    set((state) => {
      const alert = state.alerts.find((a) => a.id === alertId);
      if (!alert) return state;
      const resolved: Alert = {
        ...alert,
        status: "resolved",
        disposeReason: reason,
        handleResult: result,
        handler: handler || alert.handler || state.currentUser,
        handleTime: nowString(),
      };
      return {
        alerts: state.alerts.filter((a) => a.id !== alertId),
        resolvedAlerts: [resolved, ...state.resolvedAlerts],
      };
    }),

  toggleDriverConfirm: (busId) =>
    set((state) => ({
      preparationChecks: state.preparationChecks.map((c) =>
        c.busId === busId
          ? {
              ...c,
              isDriverConfirmed: !c.isDriverConfirmed,
              confirmTime: !c.isDriverConfirmed ? nowTime() : undefined,
            }
          : c
      ),
    })),

  sendReminder: (busId) =>
    set((state) => ({
      preparationChecks: state.preparationChecks.map((c) =>
        c.busId === busId
          ? {
              ...c,
              remark: `已发送提醒 ${nowTime()}`,
            }
          : c
      ),
    })),

  setActiveShiftId: (shiftId) => set({ activeShiftId: shiftId }),

  updateCurrentTime: () => set({ currentTime: nowTime() }),
}));

export { calculateRisk };
