
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  registration_date: string;
  services: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Call {
  id: string;
  call_id?: string; // Call ID del sistema externo
  client_id?: string;
  client_name?: string;
  time: string; // Time
  duration: number; // duration en segundos
  type?: string; // Type
  cost: number; // cost
  disconnection_reason?: string; // Disconnection Reason
  result: 'success' | 'failed' | 'no_answer' | 'busy'; // result
  user_sentiment?: string; // User Sentiment
  from_number?: string; // From
  to_number?: string; // To
  call_successful?: boolean; // Call successful
  call_summary?: string; // resumen llamada
  service_id?: string;
  service_name?: string;
  recording?: string;
  transcription?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  pricePerMinute: number;
  pricePerCall: number;
  active: boolean;
}

export interface WebhookData {
  id: string;
  timestamp: string;
  type: 'client' | 'call';
  data: any;
  processed: boolean;
  created_at?: string;
}
