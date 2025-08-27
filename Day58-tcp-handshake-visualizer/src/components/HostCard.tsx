import { motion } from "framer-motion";
import { Cpu, Server, Clock, Wifi } from "lucide-react";
import type { TcpState } from "../lib/types";

const stateColor: Record<TcpState, string> = {
  CLOSED: "bg-gray-100 text-gray-700",
  "SYN-SENT": "bg-yellow-100 text-yellow-700",
  "SYN-RECEIVED": "bg-blue-100 text-blue-700",
  ESTABLISHED: "bg-green-100 text-green-700",
  TIMEOUT: "bg-red-100 text-red-700",
};

const stateIcon: Record<TcpState, React.ReactNode> = {
  CLOSED: <div className="h-2 w-2 rounded-full bg-gray-500"></div>,
  "SYN-SENT": (
    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
  ),
  "SYN-RECEIVED": (
    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
  ),
  ESTABLISHED: <div className="h-2 w-2 rounded-full bg-green-500"></div>,
  TIMEOUT: (
    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
  ),
};

const stateDescriptions: Record<TcpState, string> = {
  CLOSED: "No connection exists",
  "SYN-SENT": "Waiting for SYN-ACK response",
  "SYN-RECEIVED": "Received SYN, sent SYN-ACK",
  ESTABLISHED: "Connection is active",
  TIMEOUT: "Waiting for response timed out",
};

export default function HostCard({
  role,
  state,
  isn,
  rtt,
  packetCount,
}: {
  role: "CLIENT" | "SERVER";
  state: TcpState;
  isn: number;
  rtt?: number;
  packetCount?: { sent: number; received: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100 relative overflow-hidden group"
    >
      {/* Decorative gradient bar at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              role === "CLIENT" ? "bg-emerald-500" : "bg-indigo-500"
            } animate-pulse`}
          />
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {role === "CLIENT" ? (
              <>
                <Cpu className="h-4 w-4 text-emerald-600" /> Client
              </>
            ) : (
              <>
                <Server className="h-4 w-4 text-indigo-600" /> Server
              </>
            )}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          ISN: {isn}
        </span>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stateColor[state]} mb-3`}
      >
        {stateIcon[state]}
        <span className="text-sm font-medium">{state}</span>
      </motion.div>

      <div className="text-xs text-gray-500 mb-2">
        {stateDescriptions[state]}
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Wifi className="h-3 w-3" />
          <span>RTT: {rtt !== undefined ? `${rtt}ms` : "N/A"}</span>
        </div>

        {packetCount && (
          <div className="text-xs text-gray-600">
            📤 {packetCount.sent} 📥 {packetCount.received}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-600 col-span-2">
          <Clock className="h-3 w-3" />
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Connection status indicator */}
      <div className="absolute bottom-2 right-2">
        <div
          className={`h-2 w-2 rounded-full ${
            state === "ESTABLISHED"
              ? "bg-green-500"
              : state === "CLOSED"
              ? "bg-gray-400"
              : "bg-yellow-500 animate-pulse"
          }`}
        ></div>
      </div>
    </motion.div>
  );
}
