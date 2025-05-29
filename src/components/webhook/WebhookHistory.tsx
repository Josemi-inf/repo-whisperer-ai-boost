
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WebhookData } from "@/types";

interface WebhookHistoryProps {
  webhookData: WebhookData[];
  onProcessWebhook: (id: string) => void;
}

const WebhookHistory = ({ webhookData, onProcessWebhook }: WebhookHistoryProps) => {
  return (
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
                      onClick={() => onProcessWebhook(item.id)}
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
  );
};

export default WebhookHistory;
