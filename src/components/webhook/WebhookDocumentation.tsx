
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WebhookDocumentationProps {
  webhookUrl: string;
}

const WebhookDocumentation = ({ webhookUrl }: WebhookDocumentationProps) => {
  return (
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
  );
};

export default WebhookDocumentation;
