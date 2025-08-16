
export type Sender = 'user' | 'bot';

export interface BotResponse {
  quote: string;
  source: string;
  explanation: string;
  practice: string;
}

export interface Message {
  id: string;
  sender: Sender;
  content: string | BotResponse;
}
