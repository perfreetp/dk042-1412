import type { Bus, Route } from "@/types";

export const routes: Route[] = [
  { id: "r1", name: "东线（阳光小区方向）", color: "#2A9D8F" },
  { id: "r2", name: "西线（绿城花园方向）", color: "#457B9D" },
  { id: "r3", name: "南线（滨江新城方向）", color: "#E9C46A" },
  { id: "r4", name: "北线（学府雅苑方向）", color: "#E63946" },
];

export const grades = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];

const makeStops = (
  stopNames: { name: string; students?: number }[],
  completedCount: number
) => {
  return stopNames.map((s, i) => ({
    id: `stop_${i}`,
    name: s.name,
    completed: i < completedCount,
    completeTime: i < completedCount ? `07:${10 + i * 3}` : undefined,
    studentsToPick: s.students || 5 + Math.floor(Math.random() * 5),
  }));
};

const calcProgress = (stops: ReturnType<typeof makeStops>) => {
  const completedStops = stops.filter((s) => s.completed).length;
  const pickedStudents = stops
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + (s.studentsToPick || 0), 0);
  const pendingStudents = stops
    .filter((s) => !s.completed)
    .reduce((sum, s) => sum + (s.studentsToPick || 0), 0);
  return {
    totalStops: stops.length,
    completedStops,
    pickedStudents,
    pendingStudents,
    stops,
  };
};

export const buses: Bus[] = [
  {
    id: "bus001",
    plateNumber: "沪A·12345",
    driver: { name: "张建国", phone: "138****1234", phoneFull: "13801231234" },
    attendant: { name: "李秀英", phone: "139****5678", phoneFull: "13905675678" },
    routeId: "r1",
    routeName: "东线（阳光小区方向）",
    currentPassengers: 32,
    capacity: 45,
    status: "running",
    position: { lat: 31.2304, lng: 121.4737, x: 28, y: 35 },
    grades: ["一年级", "二年级"],
    nextStop: { name: "阳光小区北门", eta: "07:28", etaMinutes: 3 },
    onboardStudents: [
      { id: "s001", name: "王小明", grade: "一年级", className: "1班", boardTime: "07:15" },
      { id: "s002", name: "李小红", grade: "一年级", className: "2班", boardTime: "07:15" },
      { id: "s003", name: "张小强", grade: "二年级", className: "1班", boardTime: "07:18" },
      { id: "s004", name: "刘小美", grade: "二年级", className: "3班", boardTime: "07:18" },
      { id: "s005", name: "陈小华", grade: "一年级", className: "1班", boardTime: "07:20" },
    ],
    lastUpdate: "2026-06-22 07:25:30",
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "明珠小区南门", students: 8 },
            { name: "阳光小区西门", students: 6 },
            { name: "阳光小区北门", students: 7 },
            { name: "东风路小学", students: 5 },
            { name: "学校正门", students: 6 },
          ],
          2
        )
      ),
    },
    afternoonProgress: {
      shiftId: "shift_afternoon",
      ...calcProgress(
        makeStops(
          [
            { name: "学校正门", students: 6 },
            { name: "东风路小学", students: 5 },
            { name: "阳光小区北门", students: 7 },
            { name: "阳光小区西门", students: 6 },
            { name: "明珠小区南门", students: 8 },
          ],
          0
        )
      ),
    },
  },
  {
    id: "bus002",
    plateNumber: "沪A·23456",
    driver: { name: "王志强", phone: "138****2345", phoneFull: "13802342345" },
    attendant: { name: "赵丽华", phone: "139****6789", phoneFull: "13906786789" },
    routeId: "r2",
    routeName: "西线（绿城花园方向）",
    currentPassengers: 28,
    capacity: 45,
    status: "running",
    position: { lat: 31.235, lng: 121.465, x: 62, y: 42 },
    grades: ["三年级", "四年级"],
    nextStop: { name: "绿城花园东门", eta: "07:32", etaMinutes: 7 },
    onboardStudents: [
      { id: "s006", name: "孙大伟", grade: "三年级", className: "2班", boardTime: "07:10" },
      { id: "s007", name: "周小芳", grade: "四年级", className: "1班", boardTime: "07:12" },
      { id: "s008", name: "吴小明", grade: "三年级", className: "1班", boardTime: "07:14" },
    ],
    lastUpdate: "2026-06-22 07:25:45",
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "绿城花园西门", students: 7 },
            { name: "绿城花园东门", students: 8 },
            { name: "西山公园", students: 6 },
            { name: "幸福里小区", students: 5 },
            { name: "学校正门", students: 4 },
          ],
          1
        )
      ),
    },
    afternoonProgress: {
      shiftId: "shift_afternoon",
      ...calcProgress(
        makeStops(
          [
            { name: "学校正门", students: 4 },
            { name: "幸福里小区", students: 5 },
            { name: "西山公园", students: 6 },
            { name: "绿城花园东门", students: 8 },
            { name: "绿城花园西门", students: 7 },
          ],
          0
        )
      ),
    },
  },
  {
    id: "bus003",
    plateNumber: "沪A·34567",
    driver: { name: "李明华", phone: "138****3456", phoneFull: "13803453456" },
    attendant: { name: "钱秀英", phone: "139****7890", phoneFull: "13907897890" },
    routeId: "r3",
    routeName: "南线（滨江新城方向）",
    currentPassengers: 0,
    capacity: 45,
    status: "delay",
    position: { lat: 31.225, lng: 121.48, x: 45, y: 68 },
    grades: ["五年级", "六年级"],
    nextStop: { name: "滨江新城公交站", eta: "07:45", etaMinutes: 20 },
    onboardStudents: [],
    lastUpdate: "2026-06-22 07:20:10",
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "滨江新城北门", students: 9 },
            { name: "滨江新城公交站", students: 7 },
            { name: "江滨公园", students: 5 },
            { name: "江南小区", students: 6 },
            { name: "学校正门", students: 5 },
          ],
          0
        )
      ),
    },
  },
  {
    id: "bus004",
    plateNumber: "沪A·45678",
    driver: { name: "赵德胜", phone: "138****4567", phoneFull: "13804564567" },
    attendant: { name: "孙丽华", phone: "139****8901", phoneFull: "13908908901" },
    routeId: "r4",
    routeName: "北线（学府雅苑方向）",
    currentPassengers: 38,
    capacity: 45,
    status: "running",
    position: { lat: 31.24, lng: 121.47, x: 72, y: 28 },
    grades: ["一年级", "三年级", "五年级"],
    nextStop: { name: "学府雅苑西门", eta: "07:30", etaMinutes: 5 },
    onboardStudents: [
      { id: "s009", name: "郑小军", grade: "一年级", className: "3班", boardTime: "07:05" },
      { id: "s010", name: "冯小丽", grade: "三年级", className: "2班", boardTime: "07:08" },
      { id: "s011", name: "何小强", grade: "五年级", className: "1班", boardTime: "07:10" },
    ],
    lastUpdate: "2026-06-22 07:25:50",
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "学府雅苑北门", students: 8 },
            { name: "学府雅苑西门", students: 6 },
            { name: "科技路", students: 7 },
            { name: "状元府小区", students: 5 },
            { name: "学校正门", students: 6 },
          ],
          2
        )
      ),
    },
    afternoonProgress: {
      shiftId: "shift_afternoon",
      ...calcProgress(
        makeStops(
          [
            { name: "学校正门", students: 6 },
            { name: "状元府小区", students: 5 },
            { name: "科技路", students: 7 },
            { name: "学府雅苑西门", students: 6 },
            { name: "学府雅苑北门", students: 8 },
          ],
          0
        )
      ),
    },
  },
  {
    id: "bus005",
    plateNumber: "沪A·56789",
    driver: { name: "刘建军", phone: "138****5678", phoneFull: "13805675678" },
    attendant: { name: "周桂英", phone: "139****9012", phoneFull: "13909019012" },
    routeId: "r1",
    routeName: "东线（阳光小区方向）",
    currentPassengers: 40,
    capacity: 45,
    status: "stopped",
    position: { lat: 31.232, lng: 121.478, x: 35, y: 52 },
    grades: ["二年级", "四年级"],
    nextStop: { name: "学校正门", eta: "已到站", etaMinutes: 0 },
    onboardStudents: [
      { id: "s012", name: "黄小明", grade: "二年级", className: "2班", boardTime: "06:55" },
      { id: "s013", name: "林小美", grade: "四年级", className: "3班", boardTime: "06:58" },
    ],
    lastUpdate: "2026-06-22 07:24:00",
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "阳光小区东门", students: 7 },
            { name: "东风路口", students: 6 },
            { name: "少年宫", students: 5 },
            { name: "实验幼儿园", students: 6 },
            { name: "学校正门", students: 5 },
          ],
          5
        )
      ),
    },
    afternoonProgress: {
      shiftId: "shift_afternoon",
      ...calcProgress(
        makeStops(
          [
            { name: "学校正门", students: 5 },
            { name: "实验幼儿园", students: 6 },
            { name: "少年宫", students: 5 },
            { name: "东风路口", students: 6 },
            { name: "阳光小区东门", students: 7 },
          ],
          0
        )
      ),
    },
  },
  {
    id: "bus006",
    plateNumber: "沪A·67890",
    driver: { name: "陈卫东", phone: "138****6789", phoneFull: "13806786789" },
    attendant: { name: "吴秀兰", phone: "139****0123", phoneFull: "13900120123" },
    routeId: "r2",
    routeName: "西线（绿城花园方向）",
    currentPassengers: 0,
    capacity: 45,
    status: "offline",
    position: { lat: 31.2, lng: 121.5, x: 80, y: 78 },
    grades: ["五年级", "六年级"],
    nextStop: { name: "待发车", eta: "--:--", etaMinutes: -1 },
    onboardStudents: [],
    lastUpdate: "2026-06-22 06:30:00",
    offlineMinutes: 55,
    morningProgress: {
      shiftId: "shift_morning",
      ...calcProgress(
        makeStops(
          [
            { name: "绿城花园南门", students: 8 },
            { name: "西山路", students: 6 },
            { name: "市民广场", students: 5 },
            { name: "梧桐苑", students: 6 },
            { name: "学校正门", students: 5 },
          ],
          0
        )
      ),
    },
  },
];
