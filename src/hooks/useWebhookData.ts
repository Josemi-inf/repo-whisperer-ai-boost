
import { useState, useEffect } from 'react';
import { Client, Call, WebhookData } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.error('Error loading clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }

      // Cargar llamadas
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .order('time', { ascending: false });

      if (callsError) {
        console.error('Error loading calls:', callsError);
      } else {
        setCalls(callsData || []);
      }

      // Cargar webhook data
      const { data: webhookDataRes, error: webhookError } = await supabase
        .from('webhook_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (webhookError) {
        console.error('Error loading webhook data:', webhookError);
      } else {
        setWebhookData(webhookDataRes || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Error adding client:', error);
        throw error;
      }

      setClients(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', updatedClient.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        throw error;
      }

      setClients(prev => prev.map(c => c.id === updatedClient.id ? data : c));
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        throw error;
      }

      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const addCall = async (callData: Omit<Call, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('calls')
        .insert([callData])
        .select()
        .single();

      if (error) {
        console.error('Error adding call:', error);
        throw error;
      }

      setCalls(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding call:', error);
      throw error;
    }
  };

  const addWebhookData = async (data: Omit<WebhookData, 'id' | 'created_at'>) => {
    try {
      const { data: webhookResult, error } = await supabase
        .from('webhook_data')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error adding webhook data:', error);
        throw error;
      }

      setWebhookData(prev => [webhookResult, ...prev]);
      return webhookResult;
    } catch (error) {
      console.error('Error adding webhook data:', error);
      throw error;
    }
  };

  const processWebhook = async (webhookId: string) => {
    try {
      const webhook = webhookData.find(w => w.id === webhookId);
      if (!webhook) return;

      if (webhook.type === 'call') {
        // Procesar datos de llamada con las nuevas columnas
        const callData = {
          call_id: webhook.data.call_id,
          client_id: webhook.data.client_id,
          client_name: webhook.data.client_name,
          time: webhook.data.time || new Date().toISOString(),
          duration: webhook.data.duration || 0,
          type: webhook.data.type,
          cost: parseFloat(webhook.data.cost) || 0,
          disconnection_reason: webhook.data.disconnection_reason,
          result: webhook.data.result || 'success' as const,
          user_sentiment: webhook.data.user_sentiment,
          from_number: webhook.data.from_number,
          to_number: webhook.data.to_number,
          call_successful: webhook.data.call_successful,
          call_summary: webhook.data.call_summary,
          service_id: webhook.data.service_id,
          service_name: webhook.data.service_name,
          recording: webhook.data.recording,
          transcription: webhook.data.transcription
        };
        
        await addCall(callData);
      }

      // Marcar webhook como procesado
      const { error } = await supabase
        .from('webhook_data')
        .update({ processed: true })
        .eq('id', webhookId);

      if (error) {
        console.error('Error updating webhook:', error);
        throw error;
      }

      setWebhookData(prev => prev.map(w => 
        w.id === webhookId ? { ...w, processed: true } : w
      ));
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  };

  return {
    clients,
    calls,
    webhookData,
    loading,
    addClient,
    updateClient,
    deleteClient,
    addCall,
    addWebhookData,
    processWebhook,
    refreshData: loadData
  };
};
