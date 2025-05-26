import { useState } from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import ClientForm from "@/components/ClientForm";
import ClientDetail from "@/components/ClientDetail";
import { useWebhookData } from "@/hooks/useWebhookData";

const ClientsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const { clients, addClient, updateClient, deleteClient } = useWebhookData();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (client: Omit<Client, 'id'>) => {
    addClient(client);
    setShowForm(false);
  };

  const handleEditClient = (client: Client) => {
    updateClient(client);
    setShowForm(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
  };

  const getStatusBadge = (status: Client['status']) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  if (showDetail && selectedClient) {
    return (
      <ClientDetail
        client={selectedClient}
        onBack={() => {
          setShowDetail(false);
          setSelectedClient(null);
        }}
      />
    );
  }

  if (showForm) {
    return (
      <ClientForm
        client={selectedClient}
        onSubmit={selectedClient ? handleEditClient : handleAddClient}
        onCancel={() => {
          setShowForm(false);
          setSelectedClient(null);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Clientes</CardTitle>
            <CardDescription>
              Administra la información de tus clientes
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Alta</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{getStatusBadge(client.status)}</TableCell>
                <TableCell>{new Date(client.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowDetail(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
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

export default ClientsTab;
