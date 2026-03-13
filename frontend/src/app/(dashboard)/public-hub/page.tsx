'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Megaphone, Upload, Search, Briefcase, CheckSquare } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Case {
    _id: string;
    trackingId: string;
    category: string;
    department: string;
    description: string;
    actionTaken?: string;
    result?: string;
    createdAt: string;
}

interface Announcement {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}

interface Minute {
    _id: string;
    title: string;
    fileUrl: string;
    createdAt: string;
    uploadedBy?: {
        name: string;
    };
}

export default function PublicHubPage() {
    const { user } = useAuth();
    const [digest, setDigest] = useState<{ cases: Case[]; announcements: Announcement[] }>({ cases: [], announcements: [] });
    const [minutes, setMinutes] = useState<Minute[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [annOpen, setAnnOpen] = useState(false);
    const [minOpen, setMinOpen] = useState(false);
    const [newAnn, setNewAnn] = useState({ title: '', description: '' });
    const [newMin, setNewMin] = useState({ title: '', file: null as File | null });

    const isAuthorized = user?.role === 'Secretariat' || user?.role === 'Admin';

    const fetchData = async () => {
        setLoading(true);
        try {
            const [digestRes, minutesRes] = await Promise.all([
                api.get('/public/digest'),
                api.get('/public/minutes')
            ]);
            setDigest(digestRes.data);
            setMinutes(minutesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateAnnouncement = async () => {
        try {
            await api.post('/public/announcement', newAnn);
            setAnnOpen(false);
            setNewAnn({ title: '', description: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadMinute = async () => {
        try {
            if (!newMin.file) return;
            const formData = new FormData();
            formData.append('title', newMin.title);
            formData.append('file', newMin.file);
            await api.post('/public/minutes', formData);
            setMinOpen(false);
            setNewMin({ title: '', file: null });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Public Hub</h1>
                    <p className="text-zinc-400 mt-1">Company updates, meeting minutes, and the quarterly resolution digest.</p>
                </div>

                {isAuthorized && (
                    <div className="flex space-x-3">
                        <Dialog open={annOpen} onOpenChange={setAnnOpen}>
                            <DialogTrigger
                                render={<Button variant="outline" className="border-zinc-800" />}
                            >
                                <Megaphone className="w-4 h-4 mr-2 text-blue-500" />
                                Post Announcement
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle>New Announcement</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-200">Title</Label>
                                        <Input
                                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                            value={newAnn.title}
                                            onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-200">Description</Label>
                                        <Textarea
                                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                            value={newAnn.description}
                                            onChange={e => setNewAnn({ ...newAnn, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="bg-blue-600" onClick={handleCreateAnnouncement}>Post</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={minOpen} onOpenChange={setMinOpen}>
                            <DialogTrigger
                                render={<Button variant="outline" className="border-zinc-800" />}
                            >
                                <Upload className="w-4 h-4 mr-2 text-emerald-500" />
                                Upload Minutes
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle>Upload Meeting Minutes</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-200">Title</Label>
                                        <Input
                                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                            value={newMin.title}
                                            onChange={e => setNewMin({ ...newMin, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-200">File (PDF)</Label>
                                        <Input
                                            type="file"
                                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                                            onChange={e => setNewMin({ ...newMin, file: e.target.files?.[0] || null })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="bg-blue-600" onClick={handleUploadMinute}>Upload</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6 lg:col-span-1">
                    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Megaphone className="w-5 h-5 text-blue-500" />
                                <span>Announcements</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-sm text-zinc-300">Loading...</div>
                            ) : digest.announcements.length === 0 ? (
                                <div className="text-sm text-zinc-300">No new announcements.</div>
                            ) : (
                                <div className="space-y-4">
                                    {digest.announcements.map((ann) => (
                                        <div key={ann._id} className="border-l-2 border-blue-500 pl-4 py-1">
                                            <h4 className="font-semibold text-zinc-200">{ann.title}</h4>
                                            <p className="text-sm text-zinc-300 mt-1">{ann.description}</p>
                                                <span className="text-xs text-zinc-300 mt-2 block">
                                                {new Date(ann.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                <span>Meeting Minutes</span>
                            </CardTitle>
                            <div className="mt-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    placeholder="Search minutes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-sm text-zinc-500">Loading...</div>
                            ) : minutes.length === 0 ? (
                                <div className="text-sm text-zinc-500">No minutes uploaded yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {minutes
                                        .filter((min) => 
                                            min.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (min.uploadedBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((min) => (
                                        <a
                                            key={min._id}
                                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${min.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-emerald-400" />
                                                <span className="font-medium text-zinc-300 text-sm truncate max-w-[200px]">{min.title}</span>
                                            </div>
                                            <span className="text-xs text-zinc-300">{new Date(min.createdAt).toLocaleDateString()}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-purple-400" />
                                Impact Tracking Digest
                            </CardTitle>
                            <CardDescription>Recently resolved cases and structural improvements.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center p-8 text-zinc-300">Loading digest...</div>
                            ) : digest.cases.length === 0 ? (
                                <div className="text-center p-12 text-zinc-300">
                                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                                    <h3 className="font-semibold text-lg text-zinc-100">No Resolved Cases</h3>
                                    <p className="text-sm">Resolved cases will appear here once they are closed by a manager.</p>
                                </div>
                            ) : (
                                <div className="rounded-md border border-zinc-800 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-zinc-800">
                                                <TableHead className="text-zinc-200 font-semibold">Issue Raised</TableHead>
                                                <TableHead className="text-zinc-200 font-semibold">Action Taken</TableHead>
                                                <TableHead className="text-zinc-200 font-semibold">Result</TableHead>
                                                <TableHead className="text-zinc-200 font-semibold">Tracking ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {digest.cases.map((c) => (
                                                <TableRow key={c._id} className="border-zinc-800 hover:bg-zinc-800/30">
                                                    <TableCell className="py-4">
                                                        <div className="font-semibold text-zinc-200">{c.category} - {c.department}</div>
                                                        <p className="text-sm text-zinc-300">{c.description}</p>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <p className="text-sm text-zinc-200">{c.actionTaken || 'N/A'}</p>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <p className="text-sm text-zinc-200">{c.result || 'N/A'}</p>
                                                    </TableCell>
                                                    <TableCell className="py-4 font-mono text-xs text-zinc-500">{c.trackingId}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
