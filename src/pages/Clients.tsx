import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Search, Eye, UserPlus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';

interface Client {
    id: string;
    name: string;
    type: 'PF' | 'PJ';
    document: string;
    phone: string;
    address: string;
}

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([
        { id: '1', name: 'Carlos Oliveira', type: 'PF', document: '123.456.789-00', phone: '(11) 98888-7777', address: 'Rua das Flores, 10' },
        { id: '2', name: 'Logística Express Ltda', type: 'PJ', document: '12.345.678/0001-90', phone: '(11) 3333-4444', address: 'Av. Paulista, 1000' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, control } = useForm<Client>({
        defaultValues: {
            type: 'PF'
        }
    });

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = (data: Client) => {
        if (editingClient) {
            setClients((prev) =>
                prev.map((c) => (c.id === editingClient.id ? { ...data, id: c.id } : c))
            );
            toast.success('Cliente atualizado!');
        } else {
            setClients((prev) => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
            toast.success('Cliente cadastrado!');
        }
        closeDialog();
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setValue('name', client.name);
        setValue('type', client.type);
        setValue('document', client.document);
        setValue('phone', client.phone);
        setValue('address', client.address);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            setClients((prev) => prev.filter((c) => c.id !== id));
            toast.success('Cliente removido.');
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingClient(null);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cliente..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                            <UserPlus className="h-4 w-4" /> Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
                            <DialogDescription>
                                Cadastre as informações básicas do cliente para facilitar a cobrança.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="name">Nome / Razão Social</Label>
                                    <Input id="name" {...register('name', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Controller
                                        control={control}
                                        name="type"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                                                    <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="document">CPF/CNPJ</Label>
                                    <Input id="document" {...register('document')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input id="phone" {...register('phone')} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address">Endereço</Label>
                                    <Input id="address" {...register('address')} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Salvar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>{client.type}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => navigate(`/app/clientes/${client.id}`)} title="Ver Detalhes">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(client)} title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(client.id)} title="Excluir">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Nenhum cliente encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Clients;
