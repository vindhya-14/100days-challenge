export type TcpState =
  | "CLOSED"
  | "SYN-SENT"
  | "SYN-RECEIVED"
  | "ESTABLISHED"
  | "TIMEOUT";
export type PacketType = "SYN" | "SYN-ACK" | "ACK";

export type Packet = {
  status: string;
  id: string;
  type: PacketType;
  from: "CLIENT" | "SERVER";
  to: "CLIENT" | "SERVER";
  seq?: number;
  ack?: number;
};
