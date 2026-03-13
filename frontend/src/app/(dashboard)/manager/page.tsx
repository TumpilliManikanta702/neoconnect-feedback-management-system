'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Briefcase, Edit } from 'lucide-react';

interface Case {
    _id: string;
    trackingId: string;
    category: string;
    severity: string;
    description: string;
    status: string;
    createdAt: string;
    notes: { text: string; addedAt: string }[];
}

export default function ManagerDashboard() {
    const { user } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [resultText, setResultText] = useState('');
    const [note, setNote] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchCases = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/cases');
            setCases(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    const handleUpdate = async () => {
        if (!selectedCase) return;
        setIsUpdating(true);
        try {
            await api.put(`/cases/${selectedCase._id}`, {
                status: newStatus,
                actionTaken: newStatus === 'Resolved' ? actionTaken : undefined,
                result: newStatus === 'Resolved' ? resultText : undefined,
                note
            });
            setSelectedCase(null);
            fetchCases();
        } catch (err) {
            console.error('Failed to update case', err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (user?.role !== 'Case Manager' && user?.role !== 'Admin') {
        return <div className="text-zinc-500 text-center mt-20">Access Denied. Case Managers Only.</div>;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'New': return <Badge variant="outline" className="border-blue-500/50 bg-blue-950/50 text-blue-400">New</Badge>;
            case 'Assigned': return <Badge variant="outline" className="border-purple-500/50 bg-purple-950/50 text-purple-400">Assigned</Badge>;
            case 'In Progress': return <Badge variant="outline" className="border-amber-500/50 bg-amber-950/50 text-amber-400">In Progress</Badge>;
            case 'Resolved': return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-950/50 text-emerald-400">Resolved</Badge>;
            case 'Escalated': return <Badge variant="destructive">Escalated</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Manager Dashboard</h1>
                <p className="text-zinc-200 mt-1">Review your assigned cases and provide timely resolutions.</p>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Assigned Cases</CardTitle>
                    <CardDescription className="text-zinc-200">Update status and add investigation notes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8 text-zinc-300">Loading cases...</div>
                    ) : cases.length === 0 ? (
                        <div className="text-center p-12 border-2 border-dashed border-zinc-800 rounded-xl">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-semibold text-xl text-zinc-100">No Assigned Cases</h3>
                            <p className="text-zinc-300 mt-2">You currently have no cases assigned to you. Great work!</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableHead className="text-zinc-300 font-semibold">Case Details</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold">Severity</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold">Status</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.map((c) => (
                                    <TableRow key={c._id} className="border-zinc-800 hover:bg-zinc-800/30">
                                        <TableCell className="py-4 max-w-sm">
                                            <div className="font-medium font-mono text-zinc-200 text-sm">{c.trackingId}</div>
                                            <p className="text-sm text-zinc-300 truncate">{c.description}</p>
                                        </TableCell>
                                        <TableCell>
                                            {c.severity === 'High' && <Badge variant="destructive">High</Badge>}
                                            {c.severity === 'Medium' && <Badge variant="outline" className="border-amber-500/50 bg-amber-950/50 text-amber-400">Medium</Badge>}
                                            {c.severity === 'Low' && <Badge variant="secondary">Low</Badge>}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog onOpenChange={(open) => {
                                                if (open) {
                                                    setSelectedCase(c);
                                                    setNewStatus(c.status);
                                                    setActionTaken('');
                                                    setResultText('');
                                                    setNote('');
                                                }
                                            }}>
                                                <DialogTrigger
                                                    render={
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
                                                        />
                                                    }
                                                >
                                                    Update
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2 text-zinc-100">
                                                            <Edit className="w-5 h-5 text-blue-400" />
                                                            Update Case {c.trackingId}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-zinc-200">Set Status</Label>
                                                            <Select value={newStatus} onValueChange={setNewStatus}>
                                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                                                                    <SelectValue placeholder="Select Status" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {newStatus === 'Resolved' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-200">Action Taken</Label>
                                                                    <Textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} placeholder="What structural change was made?" className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-200">Result / Outcome</Label>
                                                                    <Textarea value={resultText} onChange={(e) => setResultText(e.target.value)} placeholder="What was the measurable outcome?" className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="space-y-2">
                                                            <Label className="text-zinc-200">Add a Note (Optional)</Label>
                                                            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Document your actions or reasoning..." className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isUpdating}>
                                                            {isUpdating ? 'Updating...' : 'Save Changes'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
