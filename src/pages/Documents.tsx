import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FileText,
    Search,
    Filter,
    Eye,
    MoreHorizontal,
    FileDown,
    Printer,
    Loader2
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
import { PDFViewer } from '@react-pdf/renderer';
import DocumentPDF from '@/components/documents/DocumentPDF';
import { useUser } from '@/store/useAppStore';
import { useDocuments, useDeleteDocument } from '@/hooks/use-api';
import { IDocument } from '@/types';
import { toast } from 'sonner';

const Documents = () => {
    const user = useUser();
    const { data: docsResponse, isLoading } = useDocuments();
    const documents = docsResponse?.items || [];
    const deleteDoc = useDeleteDocument();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingDoc, setViewingDoc] = useState<IDocument | null>(null);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);

    const confirmDelete = () => {
        if (docToDelete) {
            deleteDoc.mutate(docToDelete, {
                onSuccess: () => {
                    toast.success('Documento excluído com sucesso!');
                    setDocToDelete(null);
                },
                onError: () => {
                    toast.error('Erro ao excluir documento.');
                    setDocToDelete(null);
                }
            });
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredDocs.length > 0 ? (
                                    filteredDocs.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.id}</TableCell>
                                            <TableCell>{doc.clientName}</TableCell>
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
                                                        <DropdownMenuItem 
                                                            className="gap-2 text-red-600" 
                                                            onClick={() => setDocToDelete(doc.id)}
                                                            disabled={deleteDoc.isPending}
                                                        >
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
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
                                    client={viewingDoc.clientDataSnapshot}
                                    company={{
                                        name: user.company_name || 'Minha Empresa',
                                        document: user.document || '00.000.000/0001-00',
                                        phone: user.phone || '(11) 9999-9999',
                                        address: user.address || 'Rua Principal, 123',
                                        logoUrl: user.logoUrl
                                    }}
                                    plan={user.plan}
                                    primaryColor={user.brandColor}
                                    services={viewingDoc.items.map(item => ({ name: item.name, price: item.price }))}
                                    total={viewingDoc.value}
                                    date={new Date(viewingDoc.date).toLocaleDateString('pt-BR')}
                                />
                            </PDFViewer>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. O documento será excluído permanentemente do seu histórico.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteDoc.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete} 
                            disabled={deleteDoc.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteDoc.isPending ? 'Excluindo...' : 'Sim, excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Documents;
