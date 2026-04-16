import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { motion } from "framer-motion";

const AutomacaoFeature = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 md:pt-32">
                <section className="container mx-auto px-4 py-16 md:py-24 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Automação de <span className="text-primary">Contratos</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        Ferramentas poderosas para automatizar o seu fluxo de trabalho, desde a criação até a assinatura.
                    </motion.p>
                </section>
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default AutomacaoFeature;
