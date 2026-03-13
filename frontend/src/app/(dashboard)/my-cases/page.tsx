'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
interface Case {
    _id: string;
    trackingId: string;
    category: string;
    department: string;
    location: string;
    severity: string;
    description: string;
    status: string;
    createdAt: string;
    submittedBy?: {
        name: string;
        email: string;
    };
    assignedTo?: {
        name: string;
        email: string;
    };
}
export default function MyCasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [trackedCase, setTrackedCase] = useState<Case | null>(null);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const { data } = await api.get('/cases');
                setCases(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const handleTrack = async () => {
        if (!searchId) return;
        try {
            const { data } = await api.get(`/cases/track/${encodeURIComponent(searchId)}`);
            setTrackedCase(data);
        } catch (err) {
            setTrackedCase(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-500/10 text-blue-500';
            case 'Assigned': return 'bg-purple-500/10 text-purple-500';
            case 'In Progress': return 'bg-amber-500/10 text-amber-500';
            case 'Pending': return 'bg-orange-500/10 text-orange-500';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-500';
            case 'Escalated': return 'bg-red-500/10 text-red-500';
            default: return 'bg-zinc-500/10 text-zinc-500';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'text-red-500';
            case 'Medium': return 'text-amber-500';
            case 'Low': return 'text-emerald-500';
            default: return 'text-zinc-500';
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
                <p className="text-zinc-400 mt-1">Track the status and progress of your submitted complaints.</p>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur mb-6">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Track by ID</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                    <input
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter tracking ID (e.g., NEO-2026-001)"
                        className="flex-1 bg-black/20 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:ring-blue-400/20 h-10 rounded-md px-3"
                    />
                    <button onClick={handleTrack} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                        Track
                    </button>
                </CardContent>
                {trackedCase && (
                    <CardContent>
                        <div className="rounded-md border border-zinc-800 overflow-hidden mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800">
                                        <TableHead>Tracking ID</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-mono text-xs">{trackedCase.trackingId}</TableCell>
                                        <TableCell>{trackedCase.category} / {trackedCase.department}</TableCell>
                                        <TableCell>{trackedCase.status}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Case History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8 text-zinc-500">Loading cases...</div>
                    ) : cases.length === 0 ? (
                        <div className="text-center p-12 border-2 border-dashed border-zinc-800 rounded-xl">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-semibold text-xl text-zinc-100">No Cases Submitted</h3>
                            <p className="text-zinc-300 mt-2">You haven&apos;t submitted any cases yet. Use the &apos;Submit Case&apos; page to raise a concern.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-zinc-800 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-900 border-b border-zinc-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-zinc-200 font-semibold">Tracking ID</TableHead>
                                        <TableHead className="text-zinc-200 font-semibold">Category</TableHead>
                                        <TableHead className="text-zinc-200 font-semibold">Severity</TableHead>
                                        <TableHead className="text-zinc-200 font-semibold">Submitted On</TableHead>
                                        <TableHead className="text-zinc-200 font-semibold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cases.map((c) => (
                                        <TableRow key={c._id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <TableCell className="font-medium font-mono text-zinc-200">{c.trackingId}</TableCell>
                                            <TableCell className="text-zinc-200">{c.category}</TableCell>
                                            <TableCell className={`font-medium ${getSeverityColor(c.severity)}`}>{c.severity}</TableCell>
                                            <TableCell className="text-zinc-300">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`border-0 ${getStatusColor(c.status)}`}>
                                                    {c.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
