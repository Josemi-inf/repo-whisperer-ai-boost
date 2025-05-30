
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
          Formato esperado para los datos del webhook desde n8n
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Para registrar una llamada desde n8n:</h4>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
{`POST ${webhookUrl}
{
  "type": "call",
  "data": {
    "call_id": "ID_único_de_la_llamada",
    "client_id": "uuid_del_cliente_si_existe",
    "client_name": "Nombre del cliente",
    "time": "2024-01-15T10:30:00Z",
    "duration": 180,
    "type": "inbound",
    "cost": 2.45,
    "disconnection_reason": "Normal clearing",
    "result": "success",
    "user_sentiment": "positive",
    "from_number": "+34600123456",
    "to_number": "+34900123456",
    "call_successful": true,
    "call_summary": "Consulta sobre facturación resuelta exitosamente",
    "service_id": "service_1",
    "service_name": "Atención al Cliente",
    "recording": "url_de_grabacion",
    "transcription": "Transcripción completa de la llamada..."
  }
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">Campos obligatorios:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• <strong>time:</strong> Fecha y hora de la llamada (ISO 8601)</li>
              <li>• <strong>duration:</strong> Duración en segundos</li>
              <li>• <strong>cost:</strong> Coste de la llamada</li>
              <li>• <strong>result:</strong> success, failed, no_answer, busy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Campos opcionales adicionales:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• <strong>call_id:</strong> ID único del sistema externo</li>
              <li>• <strong>type:</strong> Tipo de llamada (inbound/outbound)</li>
              <li>• <strong>disconnection_reason:</strong> Razón de desconexión</li>
              <li>• <strong>user_sentiment:</strong> Sentimiento del usuario</li>
              <li>• <strong>from_number/to_number:</strong> Números origen y destino</li>
              <li>• <strong>call_successful:</strong> Boolean si fue exitosa</li>
              <li>• <strong>call_summary:</strong> Resumen de la llamada</li>
              <li>• <strong>recording:</strong> URL de grabación</li>
              <li>• <strong>transcription:</strong> Transcripción completa</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookDocumentation;
