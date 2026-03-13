'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(
                {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    department: data.department
                },
                data.token
            );
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl shadow-purple-500/20">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex justify-center mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>
                        <CardTitle className="text-4xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            NeoConnect
                        </CardTitle>
                        <CardDescription className="text-center text-zinc-100 text-lg font-medium">
                            Secure Staff Feedback Platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email" className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    Email Address
                                </Label>
                                <Input
                                    suppressHydrationWarning
                                    id="email"
                                    type="email"
                                    placeholder="your.email@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password" className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-purple-400" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        suppressHydrationWarning
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-12 pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        suppressHydrationWarning
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {error && (
                                    <div className="p-4 text-sm text-red-300 bg-red-500/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            {error}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    suppressHydrationWarning
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold h-12 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        'Sign In Securely'
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center pt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/90 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg"
                        >
                            <span className="text-sm text-black font-medium">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-black font-bold hover:opacity-70 transition-opacity underline decoration-black/30 underline-offset-4"
                                >
                                    Create one here
                                </Link>
                            </span>
                        </motion.div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
