import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Clock, History, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RelatoriosFeature = () => {
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
                        Gestão Simplificada e <span className="text-primary">Controle de Garantia</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        O seu negócio na palma da mão. Acompanhe o histórico de cada cliente e nunca mais se perca nos prazos de garantia.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Button size="lg" asChild>
                            <Link to="/register">Organizar meu negócio agora</Link>
                        </Button>
                    </motion.div>
                </section>

                {/* Feature Detail Section */}
                <section className="bg-slate-50 py-20 divide-y divide-slate-200">
                    {/* Histórico de Clientes */}
                    <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <Card className="border-none shadow-xl">
                                    <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                            <Users className="h-4 w-4" /> Perfil do Cliente
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                                        <div className="space-y-2">
                                            <div className="h-10 bg-slate-50 border rounded-lg flex items-center px-3 justify-between">
                                                <div className="h-3 bg-slate-200 rounded w-1/3" />
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Ativo</span>
                                            </div>
                                            <div className="h-10 bg-slate-50 border rounded-lg flex items-center px-3 justify-between">
                                                <div className="h-3 bg-slate-200 rounded w-1/4" />
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Encerrado</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    <History className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Histórico Completo de Clientes</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Não perca o contato de quem já te contratou. Tenha um perfil centralizado para cada cliente com todo o histórico de serviços, orçamentos aprovados e OS geradas. O Mini-CRM que você sempre quis, sem a complexidade desnecessária.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Garantia Inteligente */}
                    <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Controle de Garantia Inteligente</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Dê segurança ao seu cliente e proteção ao seu negócio. O GeraDoc sinaliza automaticamente se um serviço ainda está dentro do prazo de garantia ou se ele já venceu, poupando você de ter que procurar recibos e datas antigas.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-2xl font-bold">12</span>
                                    <span className="text-xs text-muted-foreground uppercase">Ativas</span>
                                </div>
                                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                    <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <span className="text-2xl font-bold">04</span>
                                    <span className="text-xs text-muted-foreground uppercase">Expiradas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <CTA />
            </main>

            <Footer />
        </div>
    );
};

export default RelatoriosFeature;
