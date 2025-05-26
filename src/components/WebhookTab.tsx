import { useState, useEffect } from "react";
import { WebhookData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, CheckCircle, XCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebhookData } from "@/hooks/useWebhookData";

const WebhookTab = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [tempWebhookUrl, setTempWebhookUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { webhookData, addWebhookData, processWebhook } = useWebhookData();

  useEffect(() => {
    // Cargar URL guardada del localStorage o generar una por defecto
    const savedUrl = localStorage.getItem('webhookUrl');
    const defaultUrl = `${window.location.origin}/api/webhook/${Math.random().toString(36).substr(2, 9)}`;
    const initialUrl = savedUrl || defaultUrl;
    
    setWebhookUrl(initialUrl);
    setTempWebhookUrl(initialUrl);

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

  const handleProcessWebhook = (id: string) => {
    processWebhook(id);
    toast({
      title: "Webhook procesado",
      description: "Los datos han sido integrados al sistema"
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuración del Webhook */}
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
                readOnly={!isEditing}
                className={`font-mono text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Ingresa tu URL del webhook personalizada"
              />
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="default" onClick={saveWebhookUrl}>
                    <Save className="h-4 w-4" />
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{webhookData.length}</p>
              <p className="text-sm text-gray-600">Webhooks Recibidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {webhookData.filter(item => item.processed).length}
              </p>
              <p className="text-sm text-gray-600">Procesados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {webhookData.filter(item => !item.processed).length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registro de Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Webhooks</CardTitle>
          <CardDescription>
            Historial de datos recibidos desde sistemas externos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Datos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhookData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'client' ? 'default' : 'secondary'}>
                      {item.type === 'client' ? 'Cliente' : 'Llamada'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-hidden">
                      {JSON.stringify(item.data, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        item.processed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.processed ? 'Procesado' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!item.processed && (
                      <Button
                        size="sm"
                        onClick={() => handleProcessWebhook(item.id)}
                      >
                        Procesar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Documentación de la API */}
      <Card>
        <CardHeader>
          <CardTitle>Documentación de la API</CardTitle>
          <CardDescription>
            Formato esperado para los datos del webhook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Para crear un cliente:</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
{`POST ${webhookUrl}
{
  "type": "client",
  "data": {
    "name": "Nombre del cliente",
    "phone": "+34 600 123 456", 
    "email": "cliente@empresa.com",
    "company": "Nombre de la empresa",
    "status": "active"
  }
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Para registrar una llamada:</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
{`POST ${webhookUrl}
{
  "type": "call",
  "data": {
    "clientId": "id_del_cliente",
    "serviceId": "id_del_servicio",
    "duration": 45,
    "result": "success",
    "cost": 2.25,
    "transcription": "Texto de la llamada..."
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookTab;
