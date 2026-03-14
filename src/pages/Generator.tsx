import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  FileText,
  Save,
  Download,
  Sparkles
} from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DocumentPDF from '@/components/documents/DocumentPDF';

// Mock data constants
const CLIENTS = [
  { id: '1', name: 'Carlos Oliveira', document: '123.456.789-00', phone: '(11) 98888-7777', address: 'Rua das Flores, 10' },
  { id: '2', name: 'Logística Express Ltda', document: '12.345.678/0001-90', phone: '(11) 3333-4444', address: 'Av. Paulista, 1000' },
];

const CATALOG = [
  { id: 's1', name: 'Manutenção Preventiva AC', price: 150 },
  { id: 's2', name: 'Carga de Gás R410A', price: 350 },
  { id: 's3', name: 'Instalação Split 9000 BTUs', price: 600 },
];

const Generator = () => {
  const { user, incrementUsage } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<typeof CLIENTS[0] | null>(null);
  const [docType, setDocType] = useState('Orçamento');
  const [selectedServices, setSelectedServices] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false);

  // Stepper logic
  const nextStep = () => {
    if (step === 3 && user?.plan === 'free' && user.monthlyUsage >= 2) {
      toast.error('Limite do plano gratuito atingido (2 documentos/mês). Faça upgrade para continuar!', {
        duration: 5000,
      });
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const totalValue = selectedServices.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const addService = (service: typeof CATALOG[0]) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.map(s => s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s);
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    toast.success('Serviço adicionado');
  };

  const removeService = (id: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, quantity: qty } : s));
  };

  const handleFinish = () => {
    if (user?.plan === 'free' && user.monthlyUsage >= 2) {
      toast.error('Limite atingido!');
      return;
    }

    incrementUsage();
    toast.success('Documento salvo e registrado com sucesso!');
    // In a real app, here we would save to DB
    setStep(1);
    setSelectedClient(null);
    setSelectedServices([]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
              step === i ? "bg-primary text-white border-primary" :
                step > i ? "bg-primary/20 text-primary border-primary/20" : "bg-white text-muted-foreground border-slate-200"
            )}>
              {step > i ? <Check className="h-5 w-5" /> : i}
            </div>
            <span className={cn("text-xs font-medium", step >= i ? "text-primary" : "text-muted-foreground")}>
              {i === 1 ? 'Cliente' : i === 2 ? 'Tipo' : i === 3 ? 'Serviços' : 'Finalizar'}
            </span>
          </div>
        ))}
      </div>

      {user?.plan === 'free' && (
        <div className="mb-6 mx-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Você está no Plano Gratuito</p>
              <p className="text-xs text-blue-700">Você ainda pode criar <span className="font-bold">{Math.max(0, 2 - (user.monthlyUsage || 0))} documentos</span> este mês.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 text-xs font-bold" onClick={() => navigate('/app/assinatura')}>
            Escolher Plano
          </Button>
        </div>
      )}

      <Card className="shadow-lg border-primary/5">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Selecione o Cliente"}
            {step === 2 && "Tipo de Documento"}
            {step === 3 && "Adicionar Serviços"}
            {step === 4 && "Preview e Conclusão"}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {/* Step 1: Select Client */}
          {step === 1 && (
            <div className="space-y-4">
              <Label>Buscar Cliente</Label>
              <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isClientPopoverOpen}
                    className="w-full justify-between h-12 text-lg"
                  >
                    {selectedClient ? selectedClient.name : "Selecione um cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Digite o nome..." />
                    <CommandList>
                      <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                      <CommandGroup>
                        {CLIENTS.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.name}
                            onSelect={() => {
                              setSelectedClient(client);
                              setIsClientPopoverOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", selectedClient?.id === client.id ? "opacity-100" : "opacity-0")} />
                            {client.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedClient && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <p className="font-semibold text-primary">{selectedClient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.document}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Document Type */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Orçamento', 'Ordem de Serviço', 'Recibo'].map((type) => (
                <div
                  key={type}
                  onClick={() => setDocType(type)}
                  className={cn(
                    "cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 text-center",
                    docType === type ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-100 hover:border-primary/30"
                  )}
                >
                  <div className={cn("p-4 rounded-full", docType === type ? "bg-primary text-white" : "bg-slate-100")}>
                    <FileText className="h-8 w-8" />
                  </div>
                  <span className="font-bold">{type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Add Services */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <Label>Adicionar do Catálogo</Label>
                <div className="flex flex-wrap gap-2">
                  {CATALOG.map((item) => (
                    <Button key={item.id} variant="outline" size="sm" onClick={() => addService(item)}>
                      <Plus className="h-3 w-3 mr-1" /> {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Serviços Selecionados</Label>
                {selectedServices.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3">Descrição</th>
                          <th className="text-center p-3">Qtd</th>
                          <th className="text-right p-3">Preço</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedServices.map((s) => (
                          <tr key={s.id}>
                            <td className="p-3 font-medium">{s.name}</td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(s.id, s.quantity - 1)}>-</Button>
                                <span>{s.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(s.id, s.quantity + 1)}>+</Button>
                              </div>
                            </td>
                            <td className="p-3 text-right">R$ {(s.price * s.quantity).toFixed(2)}</td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => removeService(s.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={2} className="p-3 text-right">TOTAL</td>
                          <td className="p-3 text-right text-primary">R$ {totalValue.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                    Selecione serviços acima para começar
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Preview and Finish */}
          {step === 4 && (
            <div className="space-y-4 h-[600px] flex flex-col">
              <div className="bg-slate-100 rounded-lg flex-1 overflow-hidden border">
                <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                  <DocumentPDF
                    plan={user?.plan}
                    company={{
                      name: user?.company_name || 'Minha Empresa',
                      document: user?.document || '00.000.000/0001-00',
                      phone: user?.phone || '(11) 9999-9999',
                      address: 'Rua Principal, 123 - Cidade/UF',
                      logoUrl: user?.logoUrl
                    }}
                    client={{
                      name: selectedClient?.name || 'Cliente Genérico',
                      document: selectedClient?.document || 'N/A',
                      phone: selectedClient?.phone || 'N/A',
                      address: selectedClient?.address || 'N/A'
                    }}
                    docType={docType}
                    services={selectedServices}
                    total={totalValue}
                    date={new Date().toLocaleDateString('pt-BR')}
                  />
                </PDFViewer>
              </div>
              <div className="flex gap-4">
                <PDFDownloadLink
                  document={
                    <DocumentPDF
                      plan={user?.plan}
                      company={{
                        name: user?.company_name || 'Minha Empresa',
                        document: user?.document || '00.000.000/0001-00',
                        phone: user?.phone || '(11) 9999-9999',
                        address: 'Rua Principal, 123 - Cidade/UF',
                        logoUrl: user?.logoUrl
                      }}
                      client={{
                        name: selectedClient?.name || 'Cliente Genérico',
                        document: selectedClient?.document || 'N/A',
                        phone: selectedClient?.phone || 'N/A',
                        address: selectedClient?.address || 'N/A'
                      }}
                      docType={docType}
                      services={selectedServices}
                      total={totalValue}
                      date={new Date().toLocaleDateString('pt-BR')}
                    />
                  }
                  fileName={`doc_${Date.now()}.pdf`}
                  className="flex-1"
                >
                  {({ loading }) => (
                    <Button variant="outline" className="w-full gap-2" disabled={loading}>
                      <Download className="h-4 w-4" /> Baixar PDF
                    </Button>
                  )}
                </PDFDownloadLink>
                <Button className="flex-1 gap-2" onClick={handleFinish}>
                  <Save className="h-4 w-4" /> Finalizar e Salvar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 pt-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-1 px-4"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>

          {step < 4 && (
            <Button
              onClick={nextStep}
              disabled={step === 1 && !selectedClient}
              className="gap-1 px-6 font-bold"
            >
              Próximo <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Generator;
