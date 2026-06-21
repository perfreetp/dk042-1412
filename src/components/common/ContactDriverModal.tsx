import { useState } from "react";
import { Phone, MessageSquare, PhoneCall, Send, X, User } from "lucide-react";
import Modal from "@/components/common/Modal";

interface ContactDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  phone: string;
  busPlate?: string;
  onContacted?: (method: "call" | "sms", note?: string) => void;
}

export default function ContactDriverModal({
  isOpen,
  onClose,
  name,
  phone,
  busPlate,
  onContacted,
}: ContactDriverModalProps) {
  const [note, setNote] = useState("");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleCall = () => {
    window.location.href = `tel:${phone.replace(/\D/g, "")}`;
    onContacted?.("call", note.trim() || undefined);
    setLastAction(`已发起电话呼叫 ${phone}`);
    setNote("");
  };

  const handleSms = () => {
    const body = note ? `?body=${encodeURIComponent(note)}` : "";
    window.location.href = `sms:${phone.replace(/\D/g, "")}${body}`;
    onContacted?.("sms", note.trim() || undefined);
    setLastAction(`已打开短信应用 ${phone}`);
    setNote("");
  };

  const handleClose = () => {
    setNote("");
    setLastAction(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="联系司机"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 p-4 bg-navy-900/50 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-white">{name}</div>
            <div className="text-sm text-navy-300 font-mono">{phone}</div>
            {busPlate && (
              <div className="text-xs text-navy-400 mt-0.5">车牌 {busPlate}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCall}
            className="btn-success flex flex-col items-center gap-2 py-4"
          >
            <PhoneCall className="w-6 h-6" />
            <span className="text-sm font-medium">拨打电话</span>
          </button>
          <button
            onClick={handleSms}
            className="btn-primary flex flex-col items-center gap-2 py-4"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm font-medium">发送短信</span>
          </button>
        </div>

        <div>
          <label className="block">
            <span className="text-xs text-navy-400 mb-1.5 block">
              联系备注（可选，将记录到处置日志）
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-base h-20 resize-none"
              placeholder="例如：询问车辆当前位置、告知偏离路线..."
            />
          </label>
        </div>

        {lastAction && (
          <div className="flex items-center gap-2 p-3 bg-accent-green/10 rounded-lg border border-accent-green/20 animate-fade-in">
            <Phone className="w-4 h-4 text-accent-green flex-shrink-0" />
            <span className="text-sm text-accent-green">{lastAction}</span>
            <button
              onClick={() => setLastAction(null)}
              className="ml-auto text-navy-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-navy-700/50">
          <p className="text-xs text-navy-500">
            点击拨号将调用设备电话功能，操作将自动记录
          </p>
          <button onClick={handleClose} className="btn-secondary text-sm">
            关闭
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface ContactButtonProps {
  name: string;
  phone: string;
  busPlate?: string;
  onContacted?: (method: "call" | "sms", note?: string) => void;
  variant?: "danger" | "success" | "primary" | "icon";
  label?: string;
  className?: string;
}

export function ContactButton({
  name,
  phone,
  busPlate,
  onContacted,
  variant = "success",
  label,
  className,
}: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const variantClass = {
    danger: "btn-danger",
    success: "btn-success",
    primary: "btn-primary",
    icon: "p-2 rounded-lg bg-navy-700 text-navy-300 hover:bg-accent-green/20 hover:text-accent-green transition-colors",
  }[variant];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${variantClass} flex items-center justify-center gap-2 ${className ?? ""}`}
        title={`联系 ${name}`}
      >
        <Phone className={variant === "icon" ? "w-4 h-4" : "w-4 h-4"} />
        {label && <span>{label}</span>}
      </button>
      <ContactDriverModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        phone={phone}
        busPlate={busPlate}
        onContacted={onContacted}
      />
    </>
  );
}

export { Send };
