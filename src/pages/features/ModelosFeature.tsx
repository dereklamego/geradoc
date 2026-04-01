import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Layout, UserCheck, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ModelosFeature = () => {
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
                        Modelos que <span className="text-primary">Geram Confiança</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        Dê adeus aos papéis amassados e documentos mal formatados. Use layouts desenhados por especialistas para fechar mais negócios.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Button size="lg" asChild>
                            <Link to="/register">Ver modelos agora</Link>
                        </Button>
                    </motion.div>
                </section>

                {/* Feature Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Personalização Automática</h2>
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    Não perca tempo preenchendo o cabeçalho toda vez. No GeraDoc, cadastrou uma vez, tá pronto pra sempre. O PDF já sai com sua logo, CNPJ/CPF e contatos de forma automática e elegante.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="text-green-500 h-5 w-5" />
                                        <span>Sua marca em destaque em cada página</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="text-green-500 h-5 w-5" />
                                        <span>Termos de garantia claros e profissionais</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center">
                                <Layout className="h-24 w-24 text-slate-300" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-sm bg-blue-50">
                                <CardContent className="pt-8">
                                    <div className="h-10 w-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mb-6 font-bold">01</div>
                                    <h3 className="text-xl font-bold mb-3">Climatização</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Checklists específicos para instalação e manutenção de ar condicionado. Transmita autoridade técnica.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-green-50">
                                <CardContent className="pt-8">
                                    <div className="h-10 w-10 bg-green-500 text-white rounded-lg flex items-center justify-center mb-6 font-bold">02</div>
                                    <h3 className="text-xl font-bold mb-3">Limpeza de Estofados</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Modelos focados em detalhamento de processos e avisos pós-limpeza. Evite retornos desnecessários.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-orange-50">
                                <CardContent className="pt-8">
                                    <div className="h-10 w-10 bg-orange-500 text-white rounded-lg flex items-center justify-center mb-6 font-bold">03</div>
                                    <h3 className="text-xl font-bold mb-3">Marcenaria</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Destaque para materiais, prazos e custos de ferragens. Clareza total para você e seu cliente.
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

export default ModelosFeature;
