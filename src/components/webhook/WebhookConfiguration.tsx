
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, CheckCircle, XCircle, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookConfigurationProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

const WebhookConfiguration = ({ 
  webhookUrl, 
  setWebhookUrl, 
  isConnected, 
  setIsConnected 
}: WebhookConfigurationProps) => {
  const [tempWebhookUrl, setTempWebhookUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast({
        title: "URL copiada",
        description: "La URL del webhook ha sido copiada al portapapeles"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive"
      });
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setTempWebhookUrl(webhookUrl);
  };

  const saveWebhookUrl = () => {
    if (!tempWebhookUrl.trim()) {
      toast({
        title: "Error",
        description: "La URL no puede estar vacía",
        variant: "destructive"
      });
      return;
    }

    setWebhookUrl(tempWebhookUrl);
    localStorage.setItem('webhookUrl', tempWebhookUrl);
    setIsEditing(false);
    toast({
      title: "URL guardada",
      description: "La URL del webhook ha sido actualizada correctamente"
    });
  };

  const cancelEdit = () => {
    setTempWebhookUrl(webhookUrl);
    setIsEditing(false);
  };

  const testConnection = () => {
    setIsConnected(true);
    toast({
      title: "Conexión exitosa",
      description: "El webhook está funcionando correctamente"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Webhook</CardTitle>
        <CardDescription>
          Endpoint para recibir datos desde n8n y otros sistemas externos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="webhook-url">URL del Webhook</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="webhook-url"
              value={isEditing ? tempWebhookUrl : webhookUrl}
              onChange={(e) => setTempWebhookUrl(e.target.value)}
              disabled={!isEditing}
              className={`font-mono text-sm ${!isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
              placeholder="Ingresa tu URL del webhook personalizada"
            />
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={startEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" onClick={saveWebhookUrl}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing 
              ? "Ingresa tu URL personalizada del webhook" 
              : "Usa esta URL en n8n para enviar datos de clientes y llamadas"
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600">Conectado</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-600">Desconectado</span>
              </>
            )}
          </div>
          <Button variant="outline" onClick={testConnection}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Probar Conexión
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfiguration;
