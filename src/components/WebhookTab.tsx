
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWebhookData } from "@/hooks/useWebhookData";
import WebhookConfiguration from "./webhook/WebhookConfiguration";
import WebhookStats from "./webhook/WebhookStats";
import WebhookHistory from "./webhook/WebhookHistory";
import WebhookDocumentation from "./webhook/WebhookDocumentation";

const WebhookTab = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { webhookData, addWebhookData, processWebhook } = useWebhookData();

  useEffect(() => {
    // Cargar URL guardada del localStorage o generar una por defecto
    const savedUrl = localStorage.getItem('webhookUrl');
    const defaultUrl = `${window.location.origin}/api/webhook/${Math.random().toString(36).substr(2, 9)}`;
    const initialUrl = savedUrl || defaultUrl;
    
    setWebhookUrl(initialUrl);

    // Si no había URL guardada, guardar la generada
    if (!savedUrl) {
      localStorage.setItem('webhookUrl', initialUrl);
    }

    // Simular recepción de webhooks en desarrollo
    const simulateWebhook = () => {
      // Solo simular si no hay muchos webhooks ya
      if (webhookData.length < 5) {
        const mockWebhook = Math.random() > 0.5 ? {
          timestamp: new Date().toISOString(),
          type: 'client' as const,
          data: {
            name: `Cliente ${Math.floor(Math.random() * 1000)}`,
            phone: `+34 6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            email: `cliente${Math.floor(Math.random() * 1000)}@empresa.com`,
            company: `Empresa ${Math.floor(Math.random() * 100)}`,
            status: 'pending'
          },
          processed: false
        } : {
          timestamp: new Date().toISOString(),
          type: 'call' as const,
          data: {
            clientId: "1",
            duration: Math.floor(Math.random() * 60) + 10,
            result: Math.random() > 0.3 ? 'success' : 'failed',
            cost: Math.random() * 5,
            serviceName: 'Consulta General'
          },
          processed: false
        };

        addWebhookData(mockWebhook);
        console.log('Webhook simulado recibido:', mockWebhook);
      }
    };

    // Simular webhooks cada 30 segundos en desarrollo
    const interval = setInterval(simulateWebhook, 30000);
    return () => clearInterval(interval);
  }, [webhookData.length, addWebhookData]);

  const handleProcessWebhook = (id: string) => {
    processWebhook(id);
    toast({
      title: "Webhook procesado",
      description: "Los datos han sido integrados al sistema"
    });
  };

  return (
    <div className="space-y-6">
      <WebhookConfiguration
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />

      <WebhookStats webhookData={webhookData} />

      <WebhookHistory 
        webhookData={webhookData} 
        onProcessWebhook={handleProcessWebhook} 
      />

      <WebhookDocumentation webhookUrl={webhookUrl} />
    </div>
  );
};

export default WebhookTab;
