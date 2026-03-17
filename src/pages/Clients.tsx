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
import { Pencil, Trash2, Search, Eye, UserPlus, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/use-api';
import { IClient } from '@/types';

const Clients = () => {
    const { data: clients = [], isLoading } = useClients();
    const createClient = useCreateClient();
    const updateClient = useUpdateClient();
    const deleteClient = useDeleteClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<IClient | null>(null);

    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, control } = useForm<Omit<IClient, 'id'>>({
        defaultValues: {
            type: 'PF'
        }
    });

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = async (data: Omit<IClient, 'id'>) => {
        try {
            if (editingClient) {
                await updateClient.mutateAsync({ ...data, id: editingClient.id });
                toast.success('Cliente atualizado!');
            } else {
                await createClient.mutateAsync(data);
                toast.success('Cliente cadastrado!');
            }
            closeDialog();
        } catch (error) {
            toast.error('Erro ao salvar cliente');
        }
    };

    const handleEdit = (client: IClient) => {
        setEditingClient(client);
        setValue('name', client.name);
        setValue('type', client.type);
        setValue('document', client.document);
        setValue('phone', client.phone);
        setValue('address', client.address);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await deleteClient.mutateAsync(id);
                toast.success('Cliente removido.');
            } catch (error) {
                toast.error('Erro ao excluir cliente');
            }
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
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
                                    {(createClient.isPending || updateClient.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar
                                </Button>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredClients.length > 0 ? (
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
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(client.id)} title="Excluir" disabled={deleteClient.isPending}>
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
