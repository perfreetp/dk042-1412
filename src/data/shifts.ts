import type { Shift } from "@/types";

export const shifts: Shift[] = [
  {
    id: "shift_morning",
    type: "morning",
    name: "早送班次",
    scheduledTime: "07:00 - 08:00",
    busIds: ["bus001", "bus002", "bus003", "bus004", "bus005", "bus006"],
  },
  {
    id: "shift_afternoon",
    type: "afternoon",
    name: "晚接班次",
    scheduledTime: "16:00 - 17:00",
    busIds: ["bus001", "bus002", "bus004", "bus005"],
  },
];
