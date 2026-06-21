import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto animate-fade-in">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
