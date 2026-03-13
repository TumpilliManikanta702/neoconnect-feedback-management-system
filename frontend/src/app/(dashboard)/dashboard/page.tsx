'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { MessageSquare, Filter, UserCheck, LayoutDashboard, FileText, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface Case {
    _id: string;
    trackingId: string;
    category: string;
    department: string;
    severity: string;
    description: string;
    status: string;
    createdAt: string;
}

interface Manager {
    _id: string;
    name: string;
}

export default function DashboardDispatcher() {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'Secretariat') return <SecretariatDashboard />;
    if (user.role === 'Case Manager') return <ManagerOverview />;
    if (user.role === 'Admin') return <AdminOverview />;
    return <StaffOverview />;
}

function StaffOverview() {
    const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/cases');
                setStats({
                    total: data.length,
                    resolved: data.filter((c: Case) => c.status === 'Resolved').length,
                    pending: data.filter((c: Case) => c.status !== 'Resolved').length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Welcome back, {useAuth().user?.name}</h1>
                    <p className="text-zinc-200 mt-1">Here is an overview of your feedback and activity.</p>
                </div>
                <Link href="/submit-case">
                    <Button className="bg-blue-600 hover:bg-blue-700">Submit New Case</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-zinc-100">{loading ? '...' : stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Active Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-500">{loading ? '...' : stats.pending}</div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-500">{loading ? '...' : stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-200">Visit <Link href="/my-cases" className="text-blue-400 hover:underline">My Cases</Link> to see full history.</p>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            Public Hub
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-200">Check the <Link href="/public-hub" className="text-purple-400 hover:underline">Public Hub</Link> for company-wide updates.</p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}

function ManagerOverview() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center py-20">
            <LayoutDashboard className="w-20 h-20 mx-auto text-zinc-700 mb-6" />
            <h1 className="text-3xl font-bold text-zinc-100">Manager Overview</h1>
            <p className="text-zinc-400 max-w-md mx-auto">You have access to the Case Management system and Analytics.</p>
            <div className="flex justify-center gap-4 mt-8">
                <Link href="/manager">
                    <Button className="bg-blue-600 hover:bg-blue-700">Manage Cases</Button>
                </Link>
                <Link href="/analytics">
                    <Button variant="outline" className="border-zinc-700">View Analytics</Button>
                </Link>
            </div>
        </motion.div>
    );
}

function AdminOverview() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">System Administrator</h1>
                    <p className="text-zinc-400 mt-1">Full system control and user management.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin">
                            <Button variant="link" className="text-2xl font-bold text-blue-400 p-0">Manage Users</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href="/analytics">
                            <Button variant="link" className="text-2xl font-bold text-purple-400 p-0">View Reports</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Polls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href="/polls">
                            <Button variant="link" className="text-2xl font-bold text-emerald-400 p-0">Manage Polls</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Inbox</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard">
                            <span className="text-2xl font-bold text-zinc-100">Secretariat Mode</span>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            
            <div className="mt-8">
                <SecretariatDashboard />
            </div>
        </motion.div>
    );
}

function SecretariatDashboard() {
    const { user } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDep, setFilterDep] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');

    const [selectedCase, setSelectedCase] = useState<string | null>(null);
    const [managerId, setManagerId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const fetchCases = useCallback(async () => {
        setLoading(true);
        try {
            let query = '/cases?';
            if (filterDep !== 'All') query += `department=${filterDep}&`;
            if (filterStatus !== 'All') query += `status=${filterStatus}&`;
            if (filterSeverity !== 'All') query += `severity=${filterSeverity}&`;

            const { data } = await api.get(query);
            setCases(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterDep, filterStatus, filterSeverity]);

    const fetchManagers = async () => {
        try {
            const { data } = await api.get('/users?role=Case Manager');
            setManagers(data);
        } catch (err) {
            console.error('Could not fetch managers', err);
        }
    };

    useEffect(() => {
        fetchCases();
        if (user?.role === 'Secretariat' || user?.role === 'Admin') {
            fetchManagers();
        }
    }, [fetchCases, user?.role]);

    const handleAssign = async () => {
        if (!selectedCase || !managerId) return;
        setIsAssigning(true);
        try {
            await api.post('/cases/assign', { caseId: selectedCase, managerId });
            setSelectedCase(null);
            setManagerId('');
            fetchCases();
        } catch (err) {
            console.error('Failed to assign', err);
        } finally {
            setIsAssigning(false);
        }
    };

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Secretariat Inbox</h1>
                    <p className="text-zinc-400 mt-1">Manage and assign incoming organizational feedback.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[160px] bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-800 transition-colors">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterDep} onValueChange={setFilterDep}>
                        <SelectTrigger className="w-[160px] bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-800 transition-colors">
                            <SelectValue placeholder="Filter by Department" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="All">All Departments</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Facilities">Facilities</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                        <SelectTrigger className="w-[160px] bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-800 transition-colors">
                            <SelectValue placeholder="Filter by Severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="All">All Severities</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-400" />
                        All Cases ({cases.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center p-12 text-zinc-300">Loading cases...</div>
                    ) : cases.length === 0 ? (
                        <div className="text-center p-12 text-zinc-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                            <h3 className="font-semibold text-xl text-zinc-300">Inbox Clear</h3>
                            <p className="text-sm">No cases match the current filters.</p>
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
                                        <TableCell className="py-4">
                                            <div className="font-medium font-mono text-zinc-200 text-sm">{c.trackingId}</div>
                                            <div className="text-xs text-zinc-300 mt-1">{c.department} / {new Date(c.createdAt).toLocaleDateString()}</div>
                                        </TableCell>
                                        <TableCell className="py-4 max-w-sm">
                                            <div className="font-semibold text-zinc-200">{c.category}</div>
                                            <p className="text-sm text-zinc-300 truncate">{c.description}</p>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {c.severity === 'High' && <Badge variant="destructive">High</Badge>}
                                            {c.severity === 'Medium' && <Badge variant="outline" className="border-amber-500/50 bg-amber-950/50 text-amber-400">Medium</Badge>}
                                            {c.severity === 'Low' && <Badge variant="secondary">Low</Badge>}
                                        </TableCell>
                                        <TableCell className="py-4">{getStatusBadge(c.status)}</TableCell>
                                        <TableCell className="py-4 text-right">
                                            <Dialog onOpenChange={(open) => {
                                                if (open) setSelectedCase(c._id);
                                            }}>
                                                <DialogTrigger
                                                    render={
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
                                                            disabled={c.status !== 'New' && c.status !== 'Escalated'}
                                                        />
                                                    }
                                                >
                                                    Assign
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2 text-zinc-100">
                                                            <UserCheck className="w-5 h-5 text-blue-400" />
                                                            Assign Case Manager
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <Select value={managerId} onValueChange={setManagerId}>
                                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                                                                <SelectValue placeholder="Select a manager" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                                {managers.map(m => (
                                                                    <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isAssigning || !managerId}>
                                                            {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
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
        </div>
    );
}
