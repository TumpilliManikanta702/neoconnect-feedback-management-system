'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Shield, BarChart3, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">NeoConnect</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 pt-24 pb-32 overflow-hidden">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 mb-8 leading-[1.1]">
                                Transparent Feedback. <br />
                                Real Structural Impact.
                            </h1>
                            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                NeoConnect bridges the gap between employees and management. Submit complaints, track resolutions, and see your feedback transform the workplace with real-time analytics.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg shadow-2xl shadow-blue-600/30">
                                        Join NeoConnect <ChevronRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="/public-hub">
                                    <Button size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900 px-8 h-14 text-lg backdrop-blur-sm">
                                        View Public Hub
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600/20 group-hover:scale-110 transition-all">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Safe & Anonymous</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                Submit feedback with full anonymity tracking or identity protection, ensuring a safe psychological space for all staff to raise issues.
                            </p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-600/20 group-hover:scale-110 transition-all">
                                <BarChart3 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Impact Analytics</h3>
                            <p className="text-zinc-200 leading-relaxed text-sm">
                                Monitor hotspot detection and response times through transparent dashboards accessible by the Secretariat to ensure accountability.
                            </p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-purple-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-600/20 group-hover:scale-110 transition-all">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Public Hub</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                Access meeting minutes, company announcements, and see the quarterly digest of structural improvements in our live tracking table.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="py-12 px-6 border-t border-zinc-900/50 bg-zinc-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2 opacity-50">
                        <MessageSquare className="w-5 h-5 text-zinc-400" />
                        <span className="font-bold tracking-tight text-zinc-400">NeoConnect</span>
                    </div>
                    <p className="text-zinc-500 text-sm text-center">
                        &copy; {new Date().getFullYear()} NeoConnect Management Platform. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-zinc-500">
                        <Link href="/public-hub" className="hover:text-zinc-300">Public Records</Link>
                        <Link href="/login" className="hover:text-zinc-300">Portal Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
