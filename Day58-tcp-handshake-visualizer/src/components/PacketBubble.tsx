import { motion } from "framer-motion";
import {
  Zap,
  Clock,
  WifiOff,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { Packet } from "../lib/types";

export default function PacketBubble({
  p,
  direction,
}: {
  p: Packet;
  direction?: "left" | "right";
}) {
  const getPacketColor = () => {
    if (p.status === "lost") return "border-red-300 bg-red-50 text-red-800";

    switch (p.type) {
      case "SYN":
        return "border-yellow-300 bg-yellow-50 text-yellow-800";
      case "SYN-ACK":
        return "border-blue-300 bg-blue-50 text-blue-800";
      case "ACK":
        return "border-green-300 bg-green-50 text-green-800";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getPacketIcon = () => {
    if (p.status === "lost") return <WifiOff className="h-4 w-4" />;

    switch (p.type) {
      case "SYN":
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case "SYN-ACK":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "ACK":
        return <Zap className="h-4 w-4 text-green-600" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getDirectionArrow = () => {
    if (!direction) return null;

    return direction === "right" ? (
      <ChevronRight className="h-3 w-3 ml-1" />
    ) : (
      <ChevronLeft className="h-3 w-3 mr-1" />
    );
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border-2 shadow-sm px-3 py-2 text-sm bg-white/90 backdrop-blur flex items-center gap-2 ${getPacketColor()} relative group`}
    >
      {/* Status indicator */}
      {p.status === "sending" && (
        <div className="absolute -top-1 -right-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-3 w-3 rounded-full bg-blue-500 border border-white"
          />
        </div>
      )}

      {p.status === "lost" && (
        <div className="absolute -top-1 -right-1">
          <div className="h-3 w-3 rounded-full bg-red-500 border border-white" />
        </div>
      )}

      {/* Packet icon */}
      <div className="flex-shrink-0">{getPacketIcon()}</div>

      {/* Packet content */}
      <div className="flex flex-col">
        <div className="font-semibold flex items-center">
          {p.type}
          {getDirectionArrow()}
        </div>
        <div className="text-xs flex gap-2 mt-1">
          {typeof p.seq === "number" && (
            <span className="bg-black/10 px-1.5 py-0.5 rounded">
              SEQ {p.seq}
            </span>
          )}
          {typeof p.ack === "number" && (
            <span className="bg-black/10 px-1.5 py-0.5 rounded">
              ACK {p.ack}
            </span>
          )}
        </div>
      </div>

      {/* Hover information */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Connection line indicator */}
      <div
        className={`absolute ${
          direction === "right" ? "-left-4" : "-right-4"
        } top-1/2 transform -translate-y-1/2 opacity-60`}
      >
        {direction === "right" ? (
          <div className="flex items-center">
            <div className="h-0.5 w-3 bg-gray-400"></div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        ) : direction === "left" ? (
          <div className="flex items-center">
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <div className="h-0.5 w-3 bg-gray-400"></div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
