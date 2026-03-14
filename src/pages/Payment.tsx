import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, QrCode, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
    const navigate = useNavigate();
    const [method, setMethod] = useState("pix");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            toast.success("Pagamento realizado com sucesso! Bem-vindo ao Plano Pro.");
            navigate("/app");
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pagamento</h2>
                    <p className="text-muted-foreground mt-1">Escolha como prefere pagar sua assinatura.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Método de Pagamento</CardTitle>
                            <CardDescription>O pagamento é processado de forma segura.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={method} onValueChange={setMethod} className="space-y-4">
                                <div
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${method === "pix" ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    onClick={() => setMethod("pix")}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value="pix" id="pix" />
                                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                            <QrCode className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <Label htmlFor="pix" className="font-bold cursor-pointer">PIX</Label>
                                            <p className="text-xs text-muted-foreground">Liberação instantânea</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Recomendado</span>
                                </div>

                                <div
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${method === "card" ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    onClick={() => setMethod("card")}
                                >
                                    <div className="flex items-center gap-4">
                                        <RadioGroupItem value="card" id="card" />
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <Label htmlFor="card" className="font-bold cursor-pointer">Cartão de Crédito</Label>
                                            <p className="text-xs text-muted-foreground">Até 12x sem juros</p>
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {method === "pix" && (
                        <Card className="border-dashed border-green-200 bg-green-50/30">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                <div className="h-48 w-48 bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                                    {/* Placeholder for QR Code */}
                                    <div className="h-full w-full bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                        <QrCode className="h-12 w-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-green-900">Escaneie o QR Code acima</p>
                                    <p className="text-xs text-green-700">Ou copie o código PIX abaixo para pagar no seu banco.</p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white border-green-200 text-green-700 hover:bg-green-50 w-full max-w-xs font-bold">
                                    Copiar Código PIX
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {method === "card" && (
                        <Card className="border-slate-200">
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome no cartão</Label>
                                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Como está no cartão" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Número do cartão</Label>
                                    <input className="w-full p-2 border rounded-md text-sm" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Validade</Label>
                                        <input className="w-full p-2 border rounded-md text-sm" placeholder="MM/AA" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVV</Label>
                                        <input className="w-full p-2 border rounded-md text-sm" placeholder="123" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <CardHeader>
                            <CardTitle className="text-lg">Resumo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-70">Plano Profissional</span>
                                <span className="font-bold">R$ 29,90</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-70">Ciclo</span>
                                <span>Mensal</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span>Total</span>
                                <span className="text-primary">R$ 29,90</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
                            >
                                {isProcessing ? "Processando..." : "Confirmar Pagamento"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-2 px-2">
                        {[
                            "Acesso imediato após confirmação",
                            "Sem fidelidade, cancele quando quiser",
                            "Nota fiscal enviada por e-mail"
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
