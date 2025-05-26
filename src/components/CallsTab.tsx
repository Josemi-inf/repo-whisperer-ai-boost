import { useState } from "react";
import { Call } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { useWebhookData } from "@/hooks/useWebhookData";

const CallsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<string>("all");
  
  const { calls } = useWebhookData();

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === "all" || call.serviceId === filterService;
    const matchesResult = filterResult === "all" || call.result === filterResult;
    
    return matchesSearch && matchesService && matchesResult;
  });

  const getResultBadge = (result: Call['result']) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      no_answer: "bg-yellow-100 text-yellow-800",
      busy: "bg-orange-100 text-orange-800"
    };
    const labels = {
      success: "Exitosa",
      failed: "Fallida",
      no_answer: "Sin respuesta",
      busy: "Ocupado"
    };
    return <Badge className={variants[result]}>{labels[result]}</Badge>;
  };

  const totalCalls = filteredCalls.length;
  const totalCost = filteredCalls.reduce((sum, call) => sum + call.cost, 0);
  const successRate = totalCalls > 0 ? (filteredCalls.filter(call => call.result === 'success').length / totalCalls * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalCalls}</p>
              <p className="text-sm text-gray-600">Total Llamadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{successRate}%</p>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">€{totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Coste Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Llamadas</CardTitle>
          <CardDescription>
            Historial completo de todas las llamadas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Buscar por cliente o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los servicios</SelectItem>
                <SelectItem value="1">Consulta General</SelectItem>
                <SelectItem value="2">Soporte Técnico</SelectItem>
                <SelectItem value="3">Consulta Especializada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los resultados</SelectItem>
                <SelectItem value="success">Exitosa</SelectItem>
                <SelectItem value="failed">Fallida</SelectItem>
                <SelectItem value="no_answer">Sin respuesta</SelectItem>
                <SelectItem value="busy">Ocupado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Coste</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.clientName}</TableCell>
                  <TableCell>{new Date(call.date).toLocaleDateString()}</TableCell>
                  <TableCell>{call.time}</TableCell>
                  <TableCell>{call.serviceName}</TableCell>
                  <TableCell>{call.duration}min</TableCell>
                  <TableCell>{getResultBadge(call.result)}</TableCell>
                  <TableCell>€{call.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(call.recording || call.transcription) && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsTab;
