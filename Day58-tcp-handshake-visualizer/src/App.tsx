import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Activity,
  Zap,
  Info,
  Server,
  Cpu,
  Wifi,
  WifiOff,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// ---------- Types ----------
type TcpState =
  | "CLOSED"
  | "SYN-SENT"
  | "SYN-RECEIVED"
  | "ESTABLISHED"
  | "TIMEOUT";

type PacketType = "SYN" | "SYN-ACK" | "ACK";

type Packet = {
  id: string;
  type: PacketType;
  from: "CLIENT" | "SERVER";
  to: "CLIENT" | "SERVER";
  seq?: number;
  ack?: number;
  status?: "sending" | "delivered" | "lost";
};

// ---------- Helpers ----------
const randISN = () => Math.floor(Math.random() * 100000) + 1000;
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ---------- Badge/Chip UI ----------
const Chip: React.FC<{ label: string; subtle?: boolean; color?: string }> = ({
  label,
  subtle,
  color,
}) => (
  <span
    className={
      "px-2 py-0.5 rounded-full text-xs font-medium transition-all " +
      (subtle
        ? "bg-gray-100 text-gray-600"
        : color
        ? `${color} text-white`
        : "bg-black/80 text-white")
    }
  >
    {label}
  </span>
);

// ---------- Host Card ----------
const stateColor: Record<TcpState, string> = {
  CLOSED: "bg-gray-100 text-gray-700",
  "SYN-SENT": "bg-yellow-100 text-yellow-700",
  "SYN-RECEIVED": "bg-blue-100 text-blue-700",
  ESTABLISHED: "bg-green-100 text-green-700",
  TIMEOUT: "bg-red-100 text-red-700",
};

const HostCard: React.FC<{
  role: "CLIENT" | "SERVER";
  state: TcpState;
  isn: number;
}> = ({ role, state, isn }) => {
  return (
    <div className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {role === "CLIENT" ? (
              <>
                <Cpu className="h-4 w-4" /> Client
              </>
            ) : (
              <>
                <Server className="h-4 w-4" /> Server
              </>
            )}
          </h3>
        </div>
        <Chip label={`ISN: ${isn}`} subtle />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stateColor[state]} transition-colors`}
      >
        <Activity className="h-4 w-4" />
        <span className="text-sm font-medium">{state}</span>
      </motion.div>
    </div>
  );
};

// ---------- Packet Bubble ----------
const PacketBubble: React.FC<{ p: Packet }> = ({ p }) => {
  const base =
    "rounded-xl border shadow-sm px-3 py-2 text-sm bg-white/90 backdrop-blur flex items-center gap-2 transition-all";
  const iconMap: Record<PacketType, React.ReactNode> = {
    SYN: <Zap className="h-4 w-4 text-yellow-500" />,
    "SYN-ACK": <Zap className="h-4 w-4 text-blue-500" />,
    ACK: <Zap className="h-4 w-4 text-green-500" />,
  };

  const color =
    p.type === "SYN"
      ? "border-yellow-300 bg-yellow-50"
      : p.type === "SYN-ACK"
      ? "border-blue-300 bg-blue-50"
      : "border-green-300 bg-green-50";

  const statusColor = p.status === "lost" ? "border-red-300 bg-red-50" : "";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`${base} ${statusColor || color} relative`}
    >
      {p.status === "lost" && (
        <div className="absolute -top-2 -right-2">
          <WifiOff className="h-4 w-4 text-red-500" />
        </div>
      )}
      {iconMap[p.type]}
      <div className="font-semibold">{p.type}</div>
      <div className="text-xs text-gray-600 flex gap-2">
        {typeof p.seq === "number" && <span>SEQ {p.seq}</span>}
        {typeof p.ack === "number" && <span>ACK {p.ack}</span>}
      </div>
    </motion.div>
  );
};

// ---------- Connection Line ----------
const ConnectionLine: React.FC<{ connected: boolean }> = ({ connected }) => {
  return (
    <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`absolute inset-0 ${
          connected
            ? "bg-gradient-to-r from-green-400 to-green-600"
            : "bg-gradient-to-r from-gray-300 to-gray-400"
        }`}
        initial={{ width: "0%" }}
        animate={{ width: connected ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {connected && (
        <motion.div
          className="absolute top-0 left-0 w-4 h-2 bg-white/30 rounded-full"
          initial={{ left: "-1rem" }}
          animate={{ left: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
};

// ---------- Main App ----------
export default function TcpHandshakeVisualizer() {
  // Simulation state
  const [clientState, setClientState] = useState<TcpState>("CLOSED");
  const [serverState, setServerState] = useState<TcpState>("CLOSED");
  const [clientISN, setClientISN] = useState(randISN());
  const [serverISN, setServerISN] = useState(randISN());
  const [packets, setPackets] = useState<Packet[]>([]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0); // 0..4
  const [speed, setSpeed] = useState(1); // multiplier
  const [loss, setLoss] = useState(false);
  const [delay, setDelay] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const laneRef = useRef<HTMLDivElement | null>(null);

  const timeline = useMemo(
    () => [
      "Idle (CLOSED)",
      "Client → SYN",
      "Server → SYN-ACK",
      "Client → ACK",
      "ESTABLISHED",
    ],
    []
  );

  const reset = () => {
    setPlaying(false);
    setStep(0);
    setClientState("CLOSED");
    setServerState("CLOSED");
    setPackets([]);
    setClientISN(randISN());
    setServerISN(randISN());
  };

  const addPacket = (p: Packet) => setPackets((prev) => [...prev, p]);
  const removePacket = (id: string) =>
    setPackets((prev) => prev.filter((x) => x.id !== id));
  const updatePacket = (id: string, updates: Partial<Packet>) =>
    setPackets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

  // Core step executor
  const doStep = async () => {
    switch (step) {
      case 0: {
        // Send SYN from client
        setClientState("SYN-SENT");
        const pkt: Packet = {
          id: crypto.randomUUID(),
          type: "SYN",
          from: "CLIENT",
          to: "SERVER",
          seq: clientISN,
          status: "sending",
        };
        addPacket(pkt);

        // Animate packet sending
        await sleep(300 / speed);
        updatePacket(pkt.id, { status: "delivered" });
        await sleep(300 / speed);

        if (loss) {
          // Simulate packet loss
          updatePacket(pkt.id, { status: "lost" });
          await sleep(800 / speed);
          setClientState("TIMEOUT");
          await sleep(800 / speed);
          setClientState("SYN-SENT");

          // retransmit
          const rtx: Packet = {
            ...pkt,
            id: crypto.randomUUID(),
            status: "sending",
          };
          addPacket(rtx);
          await sleep(300 / speed);
          updatePacket(rtx.id, { status: "delivered" });
          await sleep(300 / speed);
          removePacket(rtx.id);
        } else {
          removePacket(pkt.id);
        }
        setStep(1);
        break;
      }
      case 1: {
        // Server got SYN
        setServerState("SYN-RECEIVED");
        const pkt: Packet = {
          id: crypto.randomUUID(),
          type: "SYN-ACK",
          from: "SERVER",
          to: "CLIENT",
          seq: serverISN,
          ack: clientISN + 1,
          status: "sending",
        };
        addPacket(pkt);

        await sleep(300 / speed);
        updatePacket(pkt.id, { status: "delivered" });
        await sleep(300 / speed);
        removePacket(pkt.id);
        setStep(2);
        break;
      }
      case 2: {
        // Client got SYN-ACK
        setClientState("ESTABLISHED");
        const pkt: Packet = {
          id: crypto.randomUUID(),
          type: "ACK",
          from: "CLIENT",
          to: "SERVER",
          ack: serverISN + 1,
          status: "sending",
        };
        addPacket(pkt);

        await sleep(300 / speed);
        updatePacket(pkt.id, { status: "delivered" });
        await sleep(300 / speed);
        removePacket(pkt.id);
        setStep(3);
        break;
      }
      case 3: {
        // Server receives ACK
        setServerState("ESTABLISHED");
        setStep(4);
        break;
      }
      default:
        break;
    }
  };

  // Visual positions for packets
  const activePackets = packets.map((p) => {
    const isClientToServer = p.from === "CLIENT";
    return (
      <motion.div
        key={p.id}
        initial={{
          x: isClientToServer ? "0%" : "100%",
          y: 0,
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          x: isClientToServer ? "100%" : "0%",
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: delay ? 1.4 / speed : 0.9 / speed,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{ width: "100%" }}
      >
        <div
          className={`flex ${
            isClientToServer ? "justify-start" : "justify-end"
          }`}
        >
          <PacketBubble p={p} />
        </div>
      </motion.div>
    );
  });

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    let stop = false;
    const run = async () => {
      while (!stop && step < 4) {
        await doStep();
        await sleep(200 / speed);
      }
      setPlaying(false);
    };
    run();
    return () => {
      stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TCP Handshake Visualizer
            </h1>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              See the 3-way handshake in action: <b>SYN</b> → <b>SYN-ACK</b> →{" "}
              <b>ACK</b>
            </p>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            {showExplanation ? "Hide" : "Show"} Details
            {showExplanation ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          {/* Left: Client */}
          <div className="md:col-span-1">
            <HostCard role="CLIENT" state={clientState} isn={clientISN} />
          </div>

          {/* Middle: Timeline + Lane */}
          <div className="md:col-span-1">
            <div className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Timeline
                </h3>
                <Chip
                  label={`Step ${step} / 4`}
                  subtle
                  color={step === 4 ? "bg-green-500" : "bg-blue-500"}
                />
              </div>

              <ol className="space-y-2 mb-5">
                {timeline.map((t, i) => (
                  <motion.li
                    key={t}
                    className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        i <= step
                          ? "bg-black text-white border-black shadow-md"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                    >
                      {i}
                    </div>
                    <span
                      className={`${
                        i <= step
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {t}
                    </span>
                    {i === step && i < 4 && (
                      <motion.div
                        className="h-2 w-2 rounded-full bg-blue-500 ml-auto"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </motion.li>
                ))}
              </ol>

              {/* Connection status */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Connection Status</span>
                  <span className="text-xs text-gray-500">
                    {step === 4 ? "ESTABLISHED" : "HANDSHAKING"}
                  </span>
                </div>
                <ConnectionLine connected={step === 4} />
              </div>

              <div>
                <div
                  ref={laneRef}
                  className="relative h-[140px] rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-dashed border-gray-300 overflow-hidden"
                >
                  {/* LANE LABELS */}
                  <div className="absolute left-3 top-2 text-xs text-gray-500 font-medium flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" /> Client → Server
                  </div>
                  <div className="absolute right-3 bottom-2 text-xs text-gray-500 font-medium flex items-center gap-1">
                    <ChevronLeft className="h-3 w-3" /> Server → Client
                  </div>

                  {/* Packets */}
                  <AnimatePresence>{activePackets}</AnimatePresence>

                  {/* Midline */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />

                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Server */}
          <div className="md:col-span-1">
            <HostCard role="SERVER" state={serverState} isn={serverISN} />
          </div>
        </div>

        {/* Control Panel */}
        <div className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow border bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {playing ? "Pause" : "Play"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => doStep()}
                disabled={playing || step >= 4}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow border bg-white disabled:opacity-50"
              >
                <StepForward className="h-4 w-4" />
                <span className="text-sm font-medium">Step</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow border bg-white"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm font-medium">Reset</span>
              </motion.button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <label className="text-sm text-gray-700 whitespace-nowrap flex items-center gap-1">
                  <Zap className="h-4 w-4" /> Speed
                </label>
                <input
                  type="range"
                  min={0.25}
                  max={2}
                  step={0.25}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-600 w-10 text-right">
                  {speed}×
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={delay}
                  onChange={(e) => setDelay(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <Clock className="h-4 w-4" />
                Add Delay
              </label>

              <label className="inline-flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={loss}
                  onChange={(e) => setLoss(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <WifiOff className="h-4 w-4" />
                Simulate Loss
              </label>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid lg:grid-cols-2 gap-5 mb-6"
            >
              <div className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  What's happening
                </h3>
                <ul className="text-sm text-gray-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <b>Client sends SYN</b> with its Initial Sequence Number
                      (ISN)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <b>Server replies with SYN-ACK</b> with its ISN and
                      acknowledges client's ISN+1
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <b>Client sends ACK</b>, acknowledging server's ISN+1
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </div>
                    <div>
                      <b>Connection established</b> - both sides can now
                      exchange data
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl shadow-lg p-5 bg-white border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Try these scenarios
                </h3>
                <ul className="text-sm text-gray-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <WifiOff className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      Enable <b>Simulate Loss</b> to see how TCP handles packet
                      loss with retransmission
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      Enable <b>Add Delay</b> to simulate network latency and
                      higher RTT
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      Adjust <b>Speed</b> to slow down or speed up the animation
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <StepForward className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      Use <b>Step</b> to move through the handshake one stage at
                      a time
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>
            TCP Handshake Visualizer • Demonstrating the three-way handshake
            protocol
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper components for chevrons
const ChevronUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
