
import { useState, useEffect } from 'react';
import { Client, Call, WebhookData } from '@/types';

// Hook personalizado para manejar datos compartidos entre componentes
export const useWebhookData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);

  // Cargar datos iniciales del localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    const savedCalls = localStorage.getItem('calls');
    const savedWebhooks = localStorage.getItem('webhookData');

    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Datos de ejemplo iniciales
      const mockClients: Client[] = [
        {
          id: "1",
          name: "Juan Pérez",
          phone: "+34 600 123 456",
          email: "juan@empresa.com",
          company: "Empresa ABC",
          status: "active",
          registrationDate: "2024-01-15",
          services: ["1", "2"]
        },
        {
          id: "2",
          name: "María García",
          phone: "+34 600 789 012",
          email: "maria@startup.com",
          company: "Startup XYZ",
          status: "pending",
          registrationDate: "2024-02-20",
          services: ["1"]
        }
      ];
      setClients(mockClients);
      localStorage.setItem('clients', JSON.stringify(mockClients));
    }

    if (savedCalls) {
      setCalls(JSON.parse(savedCalls));
    } else {
      // Datos de ejemplo iniciales
      const mockCalls: Call[] = [
        {
          id: "1",
          clientId: "1",
          clientName: "Juan Pérez",
          date: "2024-03-15",
          time: "10:30",
          duration: 45,
          serviceId: "1",
          serviceName: "Consulta General",
          result: "success",
          cost: 2.25,
          transcription: "Llamada exitosa sobre consulta general"
        },
        {
          id: "2",
          clientId: "2",
          clientName: "María García",
          date: "2024-03-15",
          time: "11:15",
          duration: 20,
          serviceId: "2",
          serviceName: "Soporte Técnico",
          result: "no_answer",
          cost: 0,
        }
      ];
      setCalls(mockCalls);
      localStorage.setItem('calls', JSON.stringify(mockCalls));
    }

    if (savedWebhooks) {
      setWebhookData(JSON.parse(savedWebhooks));
    }
  }, []);

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient = { ...clientData, id: Date.now().toString() };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    const updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(c => c.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const addCall = (callData: Omit<Call, 'id'>) => {
    const newCall = { ...callData, id: Date.now().toString() };
    const updatedCalls = [...calls, newCall];
    setCalls(updatedCalls);
    localStorage.setItem('calls', JSON.stringify(updatedCalls));
    return newCall;
  };

  const addWebhookData = (data: Omit<WebhookData, 'id'>) => {
    const newWebhook = { ...data, id: Date.now().toString() };
    const updatedWebhooks = [...webhookData, newWebhook];
    setWebhookData(updatedWebhooks);
    localStorage.setItem('webhookData', JSON.stringify(updatedWebhooks));
    return newWebhook;
  };

  const processWebhook = (webhookId: string) => {
    const webhook = webhookData.find(w => w.id === webhookId);
    if (!webhook) return;

    if (webhook.type === 'client') {
      const clientData = {
        name: webhook.data.name,
        phone: webhook.data.phone,
        email: webhook.data.email,
        company: webhook.data.company || '',
        status: webhook.data.status || 'pending' as const,
        registrationDate: new Date().toISOString().split('T')[0],
        services: webhook.data.services || []
      };
      addClient(clientData);
    } else if (webhook.type === 'call') {
      const client = clients.find(c => c.id === webhook.data.clientId);
      const callData = {
        clientId: webhook.data.clientId,
        clientName: client?.name || 'Cliente desconocido',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        duration: webhook.data.duration || 0,
        serviceId: webhook.data.serviceId || '1',
        serviceName: webhook.data.serviceName || 'Servicio General',
        result: webhook.data.result || 'success' as const,
        cost: webhook.data.cost || 0,
        recording: webhook.data.recording,
        transcription: webhook.data.transcription
      };
      addCall(callData);
    }

    // Marcar webhook como procesado
    const updatedWebhooks = webhookData.map(w => 
      w.id === webhookId ? { ...w, processed: true } : w
    );
    setWebhookData(updatedWebhooks);
    localStorage.setItem('webhookData', JSON.stringify(updatedWebhooks));
  };

  return {
    clients,
    calls,
    webhookData,
    addClient,
    updateClient,
    deleteClient,
    addCall,
    addWebhookData,
    processWebhook
  };
};
