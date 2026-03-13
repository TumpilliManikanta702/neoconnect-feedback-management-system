'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, CheckCircle2, BarChart3 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PollOption {
    _id: string;
    text: string;
    votes: number;
}

interface Poll {
    _id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    hasVoted: boolean;
    userVotedOption: string | null;
    createdAt: string;
}

export default function PollsPage() {
    const { user } = useAuth();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });

    const isAuthorized = user?.role === 'Secretariat' || user?.role === 'Admin';

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const { data } = await api.get('/polls');
            setPolls(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId: string, optionId: string) => {
        try {
            await api.post(`/polls/${pollId}/vote`, { optionId });
            fetchPolls(); // refresh results
        } catch (err) {
            console.error(err);
            alert('Failed to cast vote or already voted.');
        }
    };

    const handleAddOption = () => {
        setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
    };

    const handleRemoveOption = (index: number) => {
        if (newPoll.options.length <= 2) return;
        const updatedOptions = newPoll.options.filter((_, i) => i !== index);
        setNewPoll({ ...newPoll, options: updatedOptions });
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...newPoll.options];
        updatedOptions[index] = value;
        setNewPoll({ ...newPoll, options: updatedOptions });
    };

    const handleCreatePoll = async () => {
        try {
            const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
            if (validOptions.length < 2) {
                alert('Please provide at least 2 options');
                return;
            }
            await api.post('/polls', {
                question: newPoll.question,
                options: validOptions
            });
            setOpen(false);
            setNewPoll({ question: '', options: ['', ''] });
            fetchPolls();
        } catch (err) {
            console.error(err);
            alert('Failed to create poll');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Polls</h1>
                    <p className="text-zinc-400 mt-1">Have your say in company decisions.</p>
                </div>

                {isAuthorized && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white" />}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Poll
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Create New Poll</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-200">Question</Label>
                                    <Input
                                        placeholder="What is your question?"
                                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                                        value={newPoll.question}
                                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-200">Options</Label>
                                    <div className="space-y-2">
                                        {newPoll.options.map((opt, index) => (
                                            <div key={index} className="flex space-x-2">
                                                <Input
                                                    placeholder={`Option ${index + 1}`}
                                                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-zinc-500 hover:text-red-400"
                                                    onClick={() => handleRemoveOption(index)}
                                                    disabled={newPoll.options.length <= 2}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                        onClick={handleAddOption}
                                    >
                                        Add Option
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreatePoll}>
                                    Create Poll
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {loading ? (
                    <div className="text-zinc-500">Loading polls...</div>
                ) : polls.length === 0 ? (
                    <div className="text-zinc-500">No active polls available.</div>
                ) : (
                    polls.map((poll) => (
                        <Card key={poll._id} className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-xl leading-relaxed">{poll.question}</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    {poll.totalVotes} responses so far
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {poll.hasVoted ? (
                                    <div className="space-y-6">
                                        <div className="h-48 w-full mt-2">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={poll.options} layout="vertical" margin={{ left: 10, right: 30 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        dataKey="text"
                                                        type="category"
                                                        width={100}
                                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                                    />
                                                    <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                                                        {poll.options.map((opt, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={poll.userVotedOption === opt._id ? '#3b82f6' : '#475569'}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>You have cast your vote</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {poll.options.map((opt) => (
                                            <Button
                                                key={opt._id}
                                                variant="outline"
                                                className="w-full justify-start border-zinc-700 hover:bg-zinc-800 hover:border-blue-500/50 text-left h-auto py-3 px-4"
                                                onClick={() => handleVote(poll._id, opt._id)}
                                            >
                                                {opt.text}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </motion.div>
    );
}
