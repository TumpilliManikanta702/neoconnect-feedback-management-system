'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, Eye, EyeOff, Shield } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
    });
    const [role, setRole] = useState<'Staff' | 'Secretariat' | 'Case Manager' | 'Admin'>('Staff');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string | null) => {
        setFormData({ ...formData, department: value || '' });
        if (value) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.department) {
            setError('Please select a department');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/register', { ...formData, role });
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
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to register');
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
                                <User className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>
                        <CardTitle className="text-4xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Join NeoConnect
                        </CardTitle>
                        <CardDescription className="text-center text-zinc-100 text-lg font-medium">
                            Create your account to start sharing feedback
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
                                <Label htmlFor="name" className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-400" />
                                    Full Name
                                </Label>
                                <Input
                                    suppressHydrationWarning
                                    id="name"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <Label className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    Role
                                </Label>
                                <Select value={role} onValueChange={(value: 'Staff' | 'Secretariat' | 'Case Manager' | 'Admin') => setRole(value)}>
                                    <SelectTrigger suppressHydrationWarning className="bg-black/20 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20 h-12">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/20 text-white">
                                        <SelectItem value="Staff" className="hover:bg-white/10">Staff</SelectItem>
                                        <SelectItem value="Secretariat" className="hover:bg-white/10">Secretariat</SelectItem>
                                        <SelectItem value="Case Manager" className="hover:bg-white/10">Case Manager</SelectItem>
                                        <SelectItem value="Admin" className="hover:bg-white/10">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>

                            

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email" className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-purple-400" />
                                    Email Address
                                </Label>
                                <Input
                                    suppressHydrationWarning
                                    id="email"
                                    type="email"
                                    placeholder="your.email@company.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password" className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-400" />
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        suppressHydrationWarning
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-12 pr-12"
                                        placeholder="Create a strong password"
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
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <Label className="text-zinc-100 font-semibold flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-purple-400" />
                                    Department
                                </Label>
                                <Select value={formData.department} onValueChange={(value: string | null) => handleSelectChange(value ?? '')}>
                                    <SelectTrigger suppressHydrationWarning className="bg-black/20 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20 h-12">
                                        <SelectValue placeholder="Select your department" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/20 text-white">
                                        <SelectItem value="Engineering" className="hover:bg-white/10">Engineering</SelectItem>
                                        <SelectItem value="HR" className="hover:bg-white/10">HR</SelectItem>
                                        <SelectItem value="Facilities" className="hover:bg-white/10">Facilities</SelectItem>
                                        <SelectItem value="Operations" className="hover:bg-white/10">Operations</SelectItem>
                                        <SelectItem value="Sales" className="hover:bg-white/10">Sales</SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
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
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center pt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white/90 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg"
                        >
                            <span className="text-sm text-black font-medium">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-black font-bold hover:opacity-70 transition-opacity underline decoration-black/30 underline-offset-4"
                                >
                                    Sign in securely
                                </Link>
                            </span>
                        </motion.div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
