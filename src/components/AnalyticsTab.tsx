
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const AnalyticsTab = () => {
  const [period, setPeriod] = useState("30d");
  
  // Datos de ejemplo para gráficos
  const revenueByService = [
    { name: "Consulta General", revenue: 450.50, calls: 120 },
    { name: "Soporte Técnico", revenue: 320.75, calls: 85 },
    { name: "Consulta Especializada", revenue: 680.25, calls: 45 }
  ];

  const revenueByClient = [
    { name: "Juan Pérez", revenue: 285.50 },
    { name: "María García", revenue: 195.75 },
    { name: "Carlos López", revenue: 420.25 },
    { name: "Ana Martín", revenue: 350.00 },
    { name: "Luis Rodríguez", revenue: 200.00 }
  ];

  const monthlyTrend = [
    { month: "Ene", revenue: 1200, calls: 340 },
    { month: "Feb", revenue: 1450, calls: 410 },
    { month: "Mar", revenue: 1680, calls: 480 },
    { month: "Abr", revenue: 1920, calls: 520 },
    { month: "May", revenue: 2150, calls: 590 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalRevenue = revenueByService.reduce((sum, item) => sum + item.revenue, 0);
  const totalCalls = revenueByService.reduce((sum, item) => sum + item.calls, 0);
  const avgRevenuePerCall = totalRevenue / totalCalls;

  const handleExportPDF = () => {
    console.log("Exportando a PDF...");
    // Aquí implementarías la lógica de exportación
  };

  const handleExportExcel = () => {
    console.log("Exportando a Excel...");
    // Aquí implementarías la lógica de exportación
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Análisis de Gastos y Rendimiento</CardTitle>
              <CardDescription>
                Informes detallados de costes por cliente y servicio
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">90 días</SelectItem>
                  <SelectItem value="1y">1 año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
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
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">€{avgRevenuePerCall.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Promedio/Llamada</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{revenueByClient.length}</p>
                <p className="text-sm text-gray-600">Clientes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por Servicio */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Servicio</CardTitle>
            <CardDescription>Distribución de ingresos por tipo de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`€${value}`, name === 'revenue' ? 'Ingresos' : 'Llamadas']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes por Ingresos</CardTitle>
            <CardDescription>Clientes que más ingresos generan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByClient}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: €${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {revenueByClient.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`€${value}`, 'Ingresos']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ingresos y Llamadas</CardTitle>
          <CardDescription>Evolución mensual de ingresos y número de llamadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="right" dataKey="calls" fill="#82ca9d" />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
