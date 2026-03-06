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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Service {
    id: string;
    name: string;
    default_price: number;
    default_warranty_months: number;
}

const Services = () => {
    const [services, setServices] = useState<Service[]>([
        { id: '1', name: 'Manutenção Preventiva AC', default_price: 150, default_warranty_months: 3 },
        { id: '2', name: 'Carga de Gás R410A', default_price: 350, default_warranty_months: 6 },
        { id: '3', name: 'Instalação Split 9000 BTUs', default_price: 600, default_warranty_months: 12 },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<Service>();

    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = (data: Service) => {
        if (editingService) {
            setServices((prev) =>
                prev.map((s) => (s.id === editingService.id ? { ...data, id: s.id } : s))
            );
            toast.success('Serviço atualizado!');
        } else {
            setServices((prev) => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
            toast.success('Serviço cadastrado!');
        }
        closeDialog();
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setValue('name', service.name);
        setValue('default_price', service.default_price);
        setValue('default_warranty_months', service.default_warranty_months);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            setServices((prev) => prev.filter((s) => s.id !== id));
            toast.success('Serviço removido.');
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
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(service.id)}>
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
        </div>
    );
};

export default Services;
