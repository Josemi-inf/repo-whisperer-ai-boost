
import { useState } from "react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (service: Service) => void;
  onCancel: () => void;
}

const ServiceForm = ({ service, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: service?.name || "",
    description: service?.description || "",
    pricePerMinute: service?.pricePerMinute || 0,
    pricePerCall: service?.pricePerCall || 0,
    active: service?.active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (service) {
      onSubmit({ ...formData, id: service.id });
    } else {
      onSubmit(formData as Service);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>
              {service ? "Editar Servicio" : "Nuevo Servicio"}
            </CardTitle>
            <CardDescription>
              {service ? "Modifica la información del servicio" : "Añade un nuevo servicio al sistema"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Servicio</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerMinute">Precio por Minuto (€)</Label>
              <Input
                id="pricePerMinute"
                type="number"
                step="0.001"
                min="0"
                value={formData.pricePerMinute}
                onChange={(e) => setFormData({ ...formData, pricePerMinute: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="pricePerCall">Precio por Llamada (€)</Label>
              <Input
                id="pricePerCall"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerCall}
                onChange={(e) => setFormData({ ...formData, pricePerCall: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Servicio Activo</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">
              {service ? "Actualizar" : "Crear"} Servicio
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
