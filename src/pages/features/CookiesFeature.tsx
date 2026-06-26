import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const CookiesFeature = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 md:pt-32 pb-20">
                <section className="container mx-auto px-4 py-16 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-display font-bold mb-10"
                    >
                        Política de Cookies
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-slate max-w-none"
                    >
                        <p className="text-lg text-muted-foreground mb-4">
                            Em elaboração. Esta seção listará como armazenamos e manipulamos as informações de sessão (cookies).
                        </p>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CookiesFeature;
