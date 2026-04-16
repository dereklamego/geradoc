import React, { useState } from 'react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/use-api';
import { IService } from '@/types';

const Services = () => {
    const { data: services = [], isLoading } = useServices();
    const createService = useCreateService();
    const updateService = useUpdateService();
    const deleteService = useDeleteService();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<IService | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<IService>();

    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = async (data: IService) => {
        try {
            if (editingService) {
                await updateService.mutateAsync({ ...data, id: editingService.id });
                toast.success('Serviço atualizado!');
            } else {
                await createService.mutateAsync(data);
                toast.success('Serviço cadastrado!');
            }
            closeDialog();
        } catch (error) {
            toast.error('Erro ao salvar serviço');
        }
    };

    const handleEdit = (service: IService) => {
        setEditingService(service);
        setValue('name', service.name);
        setValue('default_price', service.default_price);
        setValue('default_warranty_months', service.default_warranty_months);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (serviceToDelete) {
            try {
                await deleteService.mutateAsync(serviceToDelete);
                toast.success('Serviço removido.');
            } catch (error) {
                toast.error('Erro ao excluir serviço');
            }
            setServiceToDelete(null);
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingService(null);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar serviço..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" /> Novo Serviço
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                            <DialogDescription>
                                Preencha os dados padrões do serviço para agilizar a geração de documentos.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Serviço</Label>
                                <Input id="name" {...register('name', { required: true })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="default_price">Valor Padrão (R$)</Label>
                                    <Input
                                        id="default_price"
                                        type="number"
                                        step="0.01"
                                        {...register('default_price', { required: true, valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="default_warranty_months">Garantia (Meses)</Label>
                                    <Input
                                        id="default_warranty_months"
                                        type="number"
                                        {...register('default_warranty_months', { required: true, valueAsNumber: true })}
                                    />
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
                            <TableHead>Valor Padrão</TableHead>
                            <TableHead>Garantia</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>R$ {service.default_price.toFixed(2)}</TableCell>
                                    <TableCell>{service.default_warranty_months} meses</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setServiceToDelete(service.id)} disabled={deleteService.isPending}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Nenhum serviço encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita e ele não estará mais disponível para novos orçamentos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteService.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete} 
                            disabled={deleteService.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteService.isPending ? 'Excluindo...' : 'Sim, excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Services;
