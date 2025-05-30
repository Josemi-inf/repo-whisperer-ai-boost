
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
  const { webhookData, processWebhook, refreshData } = useWebhookData();

  useEffect(() => {
    // Configurar URL del webhook real de Supabase
    const supabaseUrl = "https://wmdafdmgilpcyrhlrfpt.supabase.co/functions/v1/webhook";
    setWebhookUrl(supabaseUrl);
    setIsConnected(true);
  }, []);

  const handleProcessWebhook = async (id: string) => {
    try {
      await processWebhook(id);
      toast({
        title: "Webhook procesado",
        description: "Los datos han sido integrados al sistema"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el webhook",
        variant: "destructive"
      });
    }
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
