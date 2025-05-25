
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  services: string[];
}

export interface Call {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  serviceId: string;
  serviceName: string;
  result: 'success' | 'failed' | 'no_answer' | 'busy';
  cost: number;
  recording?: string;
  transcription?: string;
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
}
