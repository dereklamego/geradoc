import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTA } from "@/components/sections/CTA";
import { motion } from "framer-motion";

const SolucoesFeature = () => {
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
                        Soluções para <span className="text-primary">Autônomos e PMEs</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        Plataforma projetada para otimizar o tempo de quem trabalha de forma independente ou gerencia pequenas equipes, focando na agilidade e na profissionalização.
                    </motion.p>
                </section>
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default SolucoesFeature;
