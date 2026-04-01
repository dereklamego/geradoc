import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus, Calculator, CheckCircle2, ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const GeradorFeature = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 md:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-24 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Gerador de Contratos e <span className="text-primary">Documentos Ágeis</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        Esqueça as planilhas e o Word. Com o GeraDoc, você emite Orçamentos, Ordens de Serviço e Recibos em menos de 2 minutos.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Button size="lg" asChild>
                            <Link to="/register">Começar agora gratuitamente</Link>
                        </Button>
                    </motion.div>
                </section>

                {/* Core Benefits */}
                <section className="bg-slate-50 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16">Como o gerador facilita o seu dia?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-md">
                                <CardContent className="pt-8 text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <UserPlus className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Fluxo "Cliente Primeiro"</h3>
                                    <p className="text-muted-foreground">
                                        Organização desde o início. Selecione quem você vai atender antes mesmo de começar a digitar o serviço, garantindo que nenhum documento fique perdido.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardContent className="pt-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Calculator className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Cálculo Automático</h3>
                                    <p className="text-muted-foreground">
                                        Chega de calculadoras. O sistema puxa itens do seu catálogo, soma tudo automaticamente e gera o valor final pra você. Menos erros, mais agilidade.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardContent className="pt-8 text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FilePlus className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Suporte Multi-Documento</h3>
                                    <p className="text-muted-foreground">
                                        Gere muito mais que contratos. Emita Orçamentos profissionais, Ordens de Serviço (OS) detalhadas e Recibos rápidos em um único fluxo.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <CTA />
            </main>

            <Footer />
        </div>
    );
};

export default GeradorFeature;
