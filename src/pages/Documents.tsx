import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    MoreHorizontal,
    FileDown,
    Printer
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_DOCUMENTS = [
    { id: 'DOC-001', type: 'Orçamento', client: 'Carlos Oliveira', value: 150.00, date: '2026-03-05', status: 'Enviado' },
    { id: 'DOC-002', type: 'Ordem de Serviço', client: 'Logística Express', value: 800.00, date: '2026-03-05', status: 'Concluído' },
    { id: 'DOC-003', type: 'Recibo', client: 'Maria Silva', value: 50.00, date: '2026-03-04', status: 'Pago' },
    { id: 'DOC-004', type: 'Orçamento', client: 'Condomínio Solar', value: 1200.00, date: '2026-03-03', status: 'Pendente' },
    { id: 'DOC-005', type: 'Ordem de Serviço', client: 'Padaria Central', value: 250.00, date: '2026-03-02', status: 'Em andamento' },
    { id: 'DOC-006', type: 'Recibo', client: 'João Souza', value: 120.00, date: '2026-03-01', status: 'Pago' },
];

const Documents = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocs = MOCK_DOCUMENTS.filter(doc =>
        doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Documentos Gerados</h2>
                    <p className="text-muted-foreground mt-1">Histórico completo de orçamentos, OS e recibos.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" /> Exportar CSV
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por cliente, ID ou tipo..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" className="gap-2">
                            <Filter className="h-4 w-4" /> Filtros
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDocs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.id}</TableCell>
                                        <TableCell>{doc.client}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-primary" />
                                                {doc.type}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(doc.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>R$ {doc.value.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === 'Pago' || doc.status === 'Concluído'
                                                    ? 'bg-green-100 text-green-800'
                                                    : doc.status === 'Pendente' || doc.status === 'Em andamento'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Eye className="h-4 w-4" /> Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Printer className="h-4 w-4" /> Imprimir
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-red-600">
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredDocs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Nenhum documento encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Documents;
