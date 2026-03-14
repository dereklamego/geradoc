import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Phone, MapPin, FileCheck, Clock } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceHistory {
    id: string;
    service_name: string;
    price: number;
    execution_date: string;
    warranty_end_date: string;
}

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for the client
    const client = {
        id,
        name: 'Carlos Oliveira',
        type: 'PF',
        document: '123.456.789-00',
        phone: '(11) 98888-7777',
        address: 'Rua das Flores, 10 - Jd. Primavera, São Paulo - SP',
    };

    // Mock history
    const history: ServiceHistory[] = [
        {
            id: 'h1',
            service_name: 'Manutenção Preventiva AC',
            price: 150,
            execution_date: '2026-01-10',
            warranty_end_date: '2026-04-10',
        },
        {
            id: 'h2',
            service_name: 'Instalação Split 9000 BTUs',
            price: 600,
            execution_date: '2025-05-20',
            warranty_end_date: '2026-05-20',
        },
        {
            id: 'h3',
            service_name: 'Carga de Gás',
            price: 350,
            execution_date: '2024-12-05',
            warranty_end_date: '2025-06-05',
        },
    ];

    const getWarrantyStatus = (endDate: string) => {
        const isExpired = isAfter(new Date(), parseISO(endDate));
        if (isExpired) {
            return <Badge variant="destructive">Garantia Vencida</Badge>;
        }
        return <Badge className="bg-green-500 hover:bg-green-600">Garantia Ativa</Badge>;
    };

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/app/clientes')} className="gap-2 -ml-2">
                <ArrowLeft className="h-4 w-4" /> Voltar para lista
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl">Dados do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome / Razão Social</p>
                            <p className="font-semibold">{client.name}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Tipo</p>
                                <p>{client.type}</p>
                            </div>
                            <div className="flex-[2]">
                                <p className="text-sm text-muted-foreground">Documento</p>
                                <p>{client.document || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="text-sm">{client.address}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Histórico de Serviços</CardTitle>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Serviço</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Status Garantia</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.service_name}</TableCell>
                                            <TableCell>
                                                {format(parseISO(item.execution_date), 'dd/MM/yyyy', { locale: ptBR })}
                                            </TableCell>
                                            <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                                            <TableCell>{getWarrantyStatus(item.warranty_end_date)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClientDetails;
