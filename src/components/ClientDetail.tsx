
import { useState, useEffect } from "react";
import { Client, Call } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Calendar, DollarSign } from "lucide-react";

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

const ClientDetail = ({ client, onBack }: ClientDetailProps) => {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    // Datos de ejemplo de llamadas para este cliente
    const mockCalls: Call[] = [
      {
        id: "1",
        clientId: client.id,
        clientName: client.name,
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
        clientId: client.id,
        clientName: client.name,
        date: "2024-03-10",
        time: "14:15",
        duration: 30,
        serviceId: "2",
        serviceName: "Soporte Técnico",
        result: "success",
        cost: 1.50
      }
    ];
    setCalls(mockCalls.filter(call => call.clientId === client.id));
  }, [client.id]);

  const totalCalls = calls.length;
  const totalCost = calls.reduce((sum, call) => sum + call.cost, 0);
  const successfulCalls = calls.filter(call => call.result === 'success').length;

  const getResultBadge = (result: Call['result']) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      no_answer: "bg-yellow-100 text-yellow-800",
      busy: "bg-orange-100 text-orange-800"
    };
    return <Badge className={variants[result]}>{result}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Detalle del Cliente</CardTitle>
              <CardDescription>Información completa y historial</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">{client.name}</h3>
              <p className="text-gray-600">{client.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <Badge className={
                client.status === 'active' ? "bg-green-100 text-green-800" :
                client.status === 'inactive' ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }>
                {client.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalCalls}</p>
                    <p className="text-sm text-gray-600">Total Llamadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{successfulCalls}</p>
                    <p className="text-sm text-gray-600">Llamadas Exitosas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">€{totalCost.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Coste Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Llamadas</CardTitle>
          <CardDescription>Todas las llamadas realizadas a este cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Coste</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{new Date(call.date).toLocaleDateString()}</TableCell>
                  <TableCell>{call.time}</TableCell>
                  <TableCell>{call.serviceName}</TableCell>
                  <TableCell>{call.duration}min</TableCell>
                  <TableCell>{getResultBadge(call.result)}</TableCell>
                  <TableCell>€{call.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetail;
