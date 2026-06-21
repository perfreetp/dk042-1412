import { create } from "zustand";
import type { Bus, Alert, PreparationCheck, BusStatusFilter, GradeFilter, RouteFilter } from "@/types";
import { buses as mockBuses } from "@/data/buses";
import { alerts as mockAlerts, resolvedAlerts as mockResolvedAlerts } from "@/data/alerts";
import { preparationChecks as mockPrepChecks } from "@/data/preparation";

interface AppState {
  buses: Bus[];
  alerts: Alert[];
  resolvedAlerts: Alert[];
  preparationChecks: PreparationCheck[];
  selectedBusId: string | null;
  filters: {
    status: BusStatusFilter;
    grade: GradeFilter;
    route: RouteFilter;
  };
  currentTime: string;
  setSelectedBusId: (id: string | null) => void;
  setFilterStatus: (status: BusStatusFilter) => void;
  setFilterGrade: (grade: GradeFilter) => void;
  setFilterRoute: (route: RouteFilter) => void;
  updateAlertStatus: (alertId: string, status: Alert["status"], result?: string, handler?: string) => void;
  toggleDriverConfirm: (busId: string) => void;
  sendReminder: (busId: string) => void;
  updateCurrentTime: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  buses: mockBuses,
  alerts: mockAlerts,
  resolvedAlerts: mockResolvedAlerts,
  preparationChecks: mockPrepChecks,
  selectedBusId: null,
  filters: {
    status: "all",
    grade: "all",
    route: "all",
  },
  currentTime: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),

  setSelectedBusId: (id) => set({ selectedBusId: id }),

  setFilterStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),

  setFilterGrade: (grade) =>
    set((state) => ({ filters: { ...state.filters, grade } })),

  setFilterRoute: (route) =>
    set((state) => ({ filters: { ...state.filters, route } })),

  updateAlertStatus: (alertId, status, result, handler) =>
    set((state) => {
      const alert = state.alerts.find((a) => a.id === alertId);
      if (!alert) return state;

      const updatedAlert: Alert = {
        ...alert,
        status,
        handleResult: result || alert.handleResult,
        handler: handler || alert.handler,
        handleTime: status === "resolved" ? new Date().toLocaleString("zh-CN") : alert.handleTime,
      };

      if (status === "resolved") {
        return {
          alerts: state.alerts.filter((a) => a.id !== alertId),
          resolvedAlerts: [updatedAlert, ...state.resolvedAlerts],
        };
      }

      return {
        alerts: state.alerts.map((a) => (a.id === alertId ? updatedAlert : a)),
      };
    }),

  toggleDriverConfirm: (busId) =>
    set((state) => ({
      preparationChecks: state.preparationChecks.map((c) =>
        c.busId === busId
          ? {
              ...c,
              isDriverConfirmed: !c.isDriverConfirmed,
              confirmTime: !c.isDriverConfirmed
                ? new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
                : undefined,
            }
          : c
      ),
    })),

  sendReminder: (busId) =>
    set((state) => ({
      preparationChecks: state.preparationChecks.map((c) =>
        c.busId === busId ? { ...c, remark: "已发送提醒 " + new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) } : c
      ),
    })),

  updateCurrentTime: () =>
    set({
      currentTime: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }),
}));
