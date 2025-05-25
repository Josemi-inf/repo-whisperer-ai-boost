
import { useState, useEffect } from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import ServiceForm from "@/components/ServiceForm";

const ServicesTab = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Consulta General",
        description: "Consulta telefónica general automatizada",
        pricePerMinute: 0.05,
        pricePerCall: 0.50,
        active: true
      },
      {
        id: "2",
        name: "Soporte Técnico",
        description: "Asistencia técnica automatizada",
        pricePerMinute: 0.08,
        pricePerCall: 0.75,
        active: true
      },
      {
        id: "3",
        name: "Consulta Especializada",
        description: "Consulta especializada con IA avanzada",
        pricePerMinute: 0.15,
        pricePerCall: 1.25,
        active: false
      }
    ];
    setServices(mockServices);
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices([...services, newService]);
    setShowForm(false);
  };

  const handleEditService = (service: Service) => {
    setServices(services.map(s => s.id === service.id ? service : s));
    setShowForm(false);
    setSelectedService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  if (showForm) {
    return (
      <ServiceForm
        service={selectedService}
        onSubmit={selectedService ? handleEditService : handleAddService}
        onCancel={() => {
          setShowForm(false);
          setSelectedService(null);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Servicios</CardTitle>
            <CardDescription>
              Administra los servicios de llamadas automatizadas
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio/Minuto</TableHead>
              <TableHead>Precio/Llamada</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>€{service.pricePerMinute.toFixed(3)}</TableCell>
                <TableCell>€{service.pricePerCall.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={service.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {service.active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServicesTab;
