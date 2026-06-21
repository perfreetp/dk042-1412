import {
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  User,
  MapPin,
  CheckCircle,
  FileText,
  Clock,
} from "lucide-react";
import type { TimelineEvent, TimelineEventType } from "@/types";

interface AlertTimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<
  TimelineEventType,
  { icon: typeof AlertTriangle; color: string; bg: string; border: string }
> = {
  alert_created: {
    icon: AlertTriangle,
    color: "text-accent-red",
    bg: "bg-accent-red/10",
    border: "border-accent-red/30",
  },
  operator_contact: {
    icon: PhoneCall,
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/30",
  },
  driver_reply: {
    icon: MessageSquare,
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/10",
    border: "border-accent-yellow/30",
  },
  route_replanned: {
    icon: MapPin,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
    border: "border-accent-green/30",
  },
  alert_resolved: {
    icon: CheckCircle,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
    border: "border-accent-green/30",
  },
  note_added: {
    icon: FileText,
    color: "text-navy-300",
    bg: "bg-navy-700/50",
    border: "border-navy-600/50",
  },
};

export default function AlertTimeline({ events }: AlertTimelineProps) {
  if (events.length === 0) return null;

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, idx) => {
        const config = eventConfig[event.type] || eventConfig.note_added;
        const Icon = config.icon;
        const isLast = idx === sortedEvents.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4">
            {!isLast && (
              <div className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-navy-700" />
            )}
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}
            >
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`text-sm font-bold ${config.color}`}>
                  {event.title}
                </h4>
                <span className="text-xs text-navy-500 font-mono ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.timestamp.split(" ")[1]}
                </span>
              </div>
              <p className="text-xs text-navy-300 mb-1">{event.description}</p>
              {event.operator && (
                <div className="flex items-center gap-1 text-xs text-navy-500">
                  <User className="w-3 h-3" />
                  <span>{event.operator}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
