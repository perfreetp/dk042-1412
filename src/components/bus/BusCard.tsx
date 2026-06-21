import { User, Users, MapPin, Clock, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import type { Bus } from "@/types";

interface BusCardProps {
  bus: Bus;
  onClick: () => void;
  selected?: boolean;
}

export default function BusCard({ bus, onClick, selected }: BusCardProps) {
  const passengerPercent = Math.round((bus.currentPassengers / bus.capacity) * 100);

  return (
    <div
      onClick={onClick}
      className={`card-base p-4 cursor-pointer transition-all duration-200 hover:border-accent-blue/50 hover:shadow-lg group ${
        selected ? "border-accent-blue ring-1 ring-accent-blue/30" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-base font-bold text-white">{bus.plateNumber}</h3>
            <StatusBadge status={bus.status} />
          </div>
          <p className="text-xs text-navy-400">{bus.routeName}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-navy-500 group-hover:text-accent-blue transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-navy-400" />
          <span className="text-navy-200">{bus.driver.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-navy-400" />
          <span className="text-navy-200">{bus.attendant.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-navy-400">车内人数</span>
            <span className="text-xs font-mono font-semibold text-accent-green">
              {bus.currentPassengers}/{bus.capacity}
            </span>
          </div>
          <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                passengerPercent > 90 ? "bg-accent-red" : passengerPercent > 70 ? "bg-accent-yellow" : "bg-accent-green"
              }`}
              style={{ width: `${passengerPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-navy-700/50">
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="w-4 h-4 text-accent-blue" />
          <span className="text-navy-200">{bus.nextStop.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="w-4 h-4 text-accent-yellow" />
          <span className="font-mono font-semibold text-accent-yellow">
            {bus.nextStop.etaMinutes >= 0 ? `${bus.nextStop.etaMinutes}分钟` : "--"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {bus.grades.map((g) => (
          <span
            key={g}
            className="px-2 py-0.5 bg-navy-700/50 text-navy-300 text-xs rounded"
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}
