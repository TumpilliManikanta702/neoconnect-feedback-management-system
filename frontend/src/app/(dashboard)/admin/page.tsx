'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { UserCog, Trash2, UserPlus } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
}

export default function AdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '', department: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user?.role === 'Admin') fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (val: string) => {
        setEditForm({ ...editForm, role: val });
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        setIsUpdating(true);
        try {
            await api.put(`/users/${selectedUser._id}`, editForm);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Failed to update user', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    if (user?.role !== 'Admin') {
        return <div className="text-zinc-500 text-center mt-20">Access Denied. Administrators Only.</div>;
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'Admin': return <Badge variant="destructive">Admin</Badge>;
            case 'Secretariat': return <Badge variant="outline" className="border-purple-500/50 bg-purple-950/50 text-purple-400">Secretariat</Badge>;
            case 'Case Manager': return <Badge variant="outline" className="border-blue-500/50 bg-blue-950/50 text-blue-400">Case Manager</Badge>;
            default: return <Badge variant="secondary">Staff</Badge>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Admin Panel</h1>
                    <p className="text-zinc-400 mt-1">Manage platform users, roles, and organizational structure.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                </Button>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <CardHeader>
                    <CardTitle>User Directory ({users.length})</CardTitle>
                    <CardDescription>View and manage all user accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center p-12 text-zinc-400">Loading users...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableHead className="text-zinc-300 font-semibold">User</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold">Role</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold">Department</TableHead>
                                    <TableHead className="text-zinc-300 font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u._id} className="border-zinc-800 hover:bg-zinc-800/30">
                                        <TableCell className="py-4">
                                            <div className="font-medium text-zinc-200">{u.name}</div>
                                            <div className="text-xs text-zinc-400 mt-1">{u.email}</div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                                        <TableCell className="text-zinc-300">{u.department || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog onOpenChange={(open) => {
                                                if (open) {
                                                    setSelectedUser(u);
                                                    setEditForm(u);
                                                }
                                            }}>
                                                <DialogTrigger
                                                    render={
                                                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" />
                                                    }
                                                >
                                                    <UserCog className="w-4 h-4" />
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit User: {u.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-zinc-200">Role</Label>
                                                            <Select value={editForm.role} onValueChange={handleRoleChange}>
                                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                                    <SelectItem value="Staff">Staff</SelectItem>
                                                                    <SelectItem value="Case Manager">Case Manager</SelectItem>
                                                                    <SelectItem value="Secretariat">Secretariat</SelectItem>
                                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-zinc-200">Department</Label>
                                                            <Input id="department" value={editForm.department} onChange={handleEditChange} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700" disabled={isUpdating}>
                                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500" onClick={() => handleDeleteUser(u._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
