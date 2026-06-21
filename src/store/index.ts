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
  TimelineEvent,
  TimelineEventType,
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
  addTimelineEvent: (
    alertId: string,
    type: TimelineEventType,
    title: string,
    description: string,
    operator?: string
  ) => void;
  addDriverReply: (alertId: string, content: string) => void;
  resolveAlert: (
    alertId: string,
    reason: DisposeReason,
    result: string,
    handler: string
  ) => void;

  toggleDriverConfirm: (busId: string, shiftId?: string) => void;
  sendReminder: (busId: string, shiftId?: string) => void;
  setActiveShiftId: (shiftId: string) => void;
  ensureShiftChecks: (shiftId: string) => void;

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
          state.alerts.find((a) => a.id === alertId)?.driverPhoneFull ?? "",
        operator: state.currentUser,
        timestamp: nowString(),
        note,
        direction: "outbound",
      };
      const timelineEvent: TimelineEvent = {
        id: `tl_${Date.now()}`,
        type: "operator_contact",
        title: `${state.currentUser}${method === "call" ? "拨打电话" : "发送短信"}`,
        description: note || `联系司机 ${state.alerts.find((a) => a.id === alertId)?.driverName}`,
        operator: state.currentUser,
        timestamp: nowString(),
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
                timeline: [...a.timeline, timelineEvent],
              }
            : a
        ),
      };
    }),

  addTimelineEvent: (alertId, type, title, description, operator) =>
    set((state) => {
      const event: TimelineEvent = {
        id: `tl_${Date.now()}`,
        type,
        title,
        description,
        operator: operator ?? state.currentUser,
        timestamp: nowString(),
      };
      const findAndUpdate = (alerts: Alert[]) =>
        alerts.map((a) =>
          a.id === alertId ? { ...a, timeline: [...a.timeline, event] } : a
        );
      return {
        alerts: findAndUpdate(state.alerts),
        resolvedAlerts: findAndUpdate(state.resolvedAlerts),
      };
    }),

  addDriverReply: (alertId, content) =>
    set((state) => {
      const alert =
        state.alerts.find((a) => a.id === alertId) ||
        state.resolvedAlerts.find((a) => a.id === alertId);
      const contactEntry: ContactLogEntry = {
        id: `cl_${Date.now()}_reply`,
        method: "call",
        target: alert?.driverPhoneFull ?? "",
        operator: alert?.driverName ?? "司机",
        timestamp: nowString(),
        note: content,
        direction: "inbound",
      };
      const timelineEvent: TimelineEvent = {
        id: `tl_${Date.now()}_reply`,
        type: "driver_reply",
        title: "司机回复",
        description: content,
        operator: `${alert?.driverName || "司机"}（司机）`,
        timestamp: nowString(),
      };
      const findAndUpdate = (alerts: Alert[]) =>
        alerts.map((a) =>
          a.id === alertId
            ? {
                ...a,
                contactLog: [...a.contactLog, contactEntry],
                timeline: [...a.timeline, timelineEvent],
              }
            : a
        );
      return {
        alerts: findAndUpdate(state.alerts),
        resolvedAlerts: findAndUpdate(state.resolvedAlerts),
      };
    }),

  resolveAlert: (alertId, reason, result, handler) =>
    set((state) => {
      const alert = state.alerts.find((a) => a.id === alertId);
      if (!alert) return state;
      const resolveEvent: TimelineEvent = {
        id: `tl_${Date.now()}_resolved`,
        type: "alert_resolved",
        title: "告警解除",
        description: result,
        operator: handler || alert.handler || state.currentUser,
        timestamp: nowString(),
      };
      const resolved: Alert = {
        ...alert,
        status: "resolved",
        disposeReason: reason,
        handleResult: result,
        handler: handler || alert.handler || state.currentUser,
        handleTime: nowString(),
        timeline: [...alert.timeline, resolveEvent],
      };
      return {
        alerts: state.alerts.filter((a) => a.id !== alertId),
        resolvedAlerts: [resolved, ...state.resolvedAlerts],
      };
    }),

  toggleDriverConfirm: (busId, shiftId) =>
    set((state) => {
      const targetShiftId = shiftId || state.activeShiftId;
      return {
        preparationChecks: state.preparationChecks.map((c) =>
          c.busId === busId && c.shiftId === targetShiftId
            ? {
                ...c,
                isDriverConfirmed: !c.isDriverConfirmed,
                confirmTime: !c.isDriverConfirmed ? nowTime() : undefined,
              }
            : c
        ),
      };
    }),

  sendReminder: (busId, shiftId) =>
    set((state) => {
      const targetShiftId = shiftId || state.activeShiftId;
      return {
        preparationChecks: state.preparationChecks.map((c) =>
          c.busId === busId && c.shiftId === targetShiftId
            ? {
                ...c,
                remark: `已发送提醒 ${nowTime()}`,
              }
            : c
        ),
      };
    }),

  ensureShiftChecks: (shiftId) =>
    set((state) => {
      const shift = state.shifts.find((s) => s.id === shiftId);
      if (!shift) return state;
      const existingChecks = state.preparationChecks.filter(
        (c) => c.shiftId === shiftId
      );
      const existingBusIds = new Set(existingChecks.map((c) => c.busId));
      const missingChecks: PreparationCheck[] = [];
      shift.busIds.forEach((busId) => {
        if (!existingBusIds.has(busId)) {
          const bus = state.buses.find((b) => b.id === busId);
          if (bus) {
            missingChecks.push({
              busId: bus.id,
              busPlateNumber: bus.plateNumber,
              driverName: bus.driver.name,
              driverPhone: bus.driver.phone,
              driverPhoneFull: bus.driver.phoneFull,
              routeName: bus.routeName,
              shiftId: shiftId,
              isOnline: false,
              isGpsNormal: false,
              isDriverConfirmed: false,
              hasCheckRecord: false,
              remark: "无检查记录，请及时核实",
            });
          }
        }
      });
      if (missingChecks.length > 0) {
        return {
          preparationChecks: [...state.preparationChecks, ...missingChecks],
        };
      }
      return state;
    }),

  setActiveShiftId: (shiftId) => {
    set({ activeShiftId: shiftId });
    set((state) => {
      state.ensureShiftChecks(shiftId);
      return state;
    });
  },

  updateCurrentTime: () => set({ currentTime: nowTime() }),
}));

export { calculateRisk };
