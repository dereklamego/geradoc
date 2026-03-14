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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PDFViewer } from '@react-pdf/renderer';
import DocumentPDF from '@/components/documents/DocumentPDF';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_DOCUMENTS = [
    { id: 'DOC-001', type: 'Orçamento', client: 'Carlos Oliveira', value: 150.00, date: '2026-03-05', clientData: { name: 'Carlos Oliveira', document: '123.456.789-00', phone: '(11) 98888-7777', address: 'Rua das Flores, 10' } },
    { id: 'DOC-002', type: 'Ordem de Serviço', client: 'Logística Express', value: 800.00, date: '2026-03-05', clientData: { name: 'Logística Express Ltda', document: '12.345.678/0001-90', phone: '(11) 3333-4444', address: 'Av. Paulista, 1000' } },
    { id: 'DOC-003', type: 'Recibo', client: 'Maria Silva', value: 50.00, date: '2026-03-04', clientData: { name: 'Maria Silva', document: '987.654.321-11', phone: '(11) 97777-6666', address: 'Rua das Palmeiras, 50' } },
    { id: 'DOC-004', type: 'Orçamento', client: 'Condomínio Solar', value: 1200.00, date: '2026-03-03', clientData: { name: 'Condomínio Solar', document: '11.222.333/0001-44', phone: '(11) 2222-1111', address: 'Rua do Sol, 500' } },
    { id: 'DOC-005', type: 'Ordem de Serviço', client: 'Padaria Central', value: 250.00, date: '2026-03-02', clientData: { name: 'Padaria Central', document: '55.666.777/0001-88', phone: '(11) 4444-5555', address: 'Av. Central, 10' } },
    { id: 'DOC-006', type: 'Recibo', client: 'João Souza', value: 120.00, date: '2026-03-01', clientData: { name: 'João Souza', document: '111.222.333-44', phone: '(11) 91111-2222', address: 'Rua dos Pinheiros, 100' } },
];

const Documents = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingDoc, setViewingDoc] = useState<typeof MOCK_DOCUMENTS[0] | null>(null);

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
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2" onClick={() => setViewingDoc(doc)}>
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

            <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Visualizar {viewingDoc?.type} - {viewingDoc?.id}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 p-4 pt-0">
                        {viewingDoc && user && (
                            <PDFViewer width="100%" height="100%" showToolbar={true} className="rounded-lg border shadow-sm">
                                <DocumentPDF
                                    docType={viewingDoc.type}
                                    client={viewingDoc.clientData}
                                    company={{
                                        name: user.company_name || 'Minha Empresa',
                                        document: user.document || '00.000.000/0001-00',
                                        phone: user.phone || '(11) 9999-9999',
                                        address: 'Rua Principal, 123'
                                    }}
                                    services={[{ name: viewingDoc.type, price: viewingDoc.value }]}
                                    total={viewingDoc.value}
                                    date={new Date(viewingDoc.date).toLocaleDateString('pt-BR')}
                                />
                            </PDFViewer>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Documents;
