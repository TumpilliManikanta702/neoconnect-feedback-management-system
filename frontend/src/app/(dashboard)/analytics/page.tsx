'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart3, Layers, ListTodo } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

interface AnalyticsData {
    totalCases: number;
    byDepartment: { name: string; value: number }[];
    byCategory: { name: string; value: number }[];
    byStatus: { name: string; value: number }[];
    hotspots: { department: string; category: string; count: number }[];
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-zinc-500 text-center mt-20">Loading analytics...</div>;
    }

    if (!data) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-zinc-400 mt-1">Real-time breakdown of company feedback and hotspots.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-zinc-400 text-sm font-medium">Total Cases</CardTitle>
                        <ListTodo className="w-4 h-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-zinc-100">{data.totalCases}</div>
                    </CardContent>
                </Card>

                {data.hotspots.length > 0 && (
                    <Card className="border-red-500/50 bg-red-950/20 backdrop-blur md:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-red-400 text-sm font-medium flex items-center">
                                <span className="relative flex h-3 w-3 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Active Hotspots Detected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {data.hotspots.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-red-500/20 pb-1">
                                        <span className="text-zinc-300"><span className="font-semibold text-zinc-100">{h.department}</span> / <span className="font-semibold text-zinc-100">{h.category}</span></span>
                                        <span className="font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{h.count} cases</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListTodo className="w-5 h-5 text-blue-400" /> By Status</CardTitle>
                        <CardDescription>Distribution of case progress</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.byStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" nameKey="name">
                                    {data.byStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                                <Legend iconSize={10} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-400" /> By Department</CardTitle>
                        <CardDescription>Case volume per department</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byDepartment} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} cursor={{ fill: '#3f3f46' }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-400" /> By Category</CardTitle>
                        <CardDescription>Case volume per category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} cursor={{ fill: '#3f3f46' }} />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
