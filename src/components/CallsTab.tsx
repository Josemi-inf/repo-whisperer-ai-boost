
import { useState } from "react";
import { Call } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, RefreshCw } from "lucide-react";
import { useWebhookData } from "@/hooks/useWebhookData";

const CallsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<string>("all");
  
  const { calls, loading, refreshData } = useWebhookData();

  const filteredCalls = calls.filter(call => {
    const matchesSearch = (call.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.from_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.to_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.call_id?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesType = filterType === "all" || call.type === filterType;
    const matchesResult = filterResult === "all" || call.result === filterResult;
    
    return matchesSearch && matchesType && matchesResult;
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Cargando llamadas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registro de Llamadas</CardTitle>
              <CardDescription>
                Historial completo de todas las llamadas procesadas desde n8n
              </CardDescription>
            </div>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Buscar por cliente, teléfono o Call ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="inbound">Entrante</SelectItem>
                <SelectItem value="outbound">Saliente</SelectItem>
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
                <TableHead>Call ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>De → Para</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Coste</TableHead>
                <TableHead>Sentimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-mono text-xs">{call.call_id || 'N/A'}</TableCell>
                  <TableCell className="font-medium">{call.client_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(call.time).toLocaleDateString()}</div>
                      <div className="text-gray-500">{new Date(call.time).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{call.from_number || 'N/A'}</div>
                      <div className="text-gray-500">→ {call.to_number || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={call.type === 'inbound' ? 'default' : 'secondary'}>
                      {call.type || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.duration}s</TableCell>
                  <TableCell>{getResultBadge(call.result)}</TableCell>
                  <TableCell>€{call.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    {call.user_sentiment && (
                      <Badge variant="outline" className="text-xs">
                        {call.user_sentiment}
                      </Badge>
                    )}
                  </TableCell>
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
              {filteredCalls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No se encontraron llamadas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsTab;
