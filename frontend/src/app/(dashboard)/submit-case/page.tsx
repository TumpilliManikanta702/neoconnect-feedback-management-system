'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, Upload, Shield, AlertTriangle, MapPin, Building, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubmitCasePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        category: '',
        department: user?.department || '',
        location: '',
        severity: '',
        description: '',
        anonymous: false,
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (key: string, value: string | null) => {
        setFormData({ ...formData, [key]: value ?? '' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.category || !formData.severity || !formData.department || !formData.location || !formData.description) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, typeof value === 'boolean' ? String(value) : value);
            });
            if (file) {
                data.append('file', file);
            }

            const res = await api.post('/cases', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSuccess(`Case submitted successfully! Your tracking ID is ${res.data.trackingId}`);
            setFormData({
                category: '',
                department: user?.department || '',
                location: '',
                severity: '',
                description: '',
                anonymous: false,
            });
            setFile(null);
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to submit case');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Submit a Case</h1>
                <p className="text-zinc-200 mt-1">Raise an issue, complaint, or feedback securely.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-zinc-100">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    Case Details
                                </CardTitle>
                                <CardDescription className="text-zinc-200">Please provide as much information as possible to help us address your concern.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-zinc-200">Category *</Label>
                                        <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                            <SelectTrigger id="category" className="bg-zinc-800 border-zinc-700 text-zinc-100"><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                <SelectItem value="Safety">Safety</SelectItem>
                                                <SelectItem value="Policy">Policy</SelectItem>
                                                <SelectItem value="Facilities">Facilities</SelectItem>
                                                <SelectItem value="HR">HR</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="severity" className="text-zinc-200">Severity *</Label>
                                        <Select value={formData.severity} onValueChange={(val) => handleSelectChange('severity', val)}>
                                            <SelectTrigger id="severity" className="bg-zinc-800 border-zinc-700 text-zinc-100"><SelectValue placeholder="Select Severity" /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-zinc-200">Department *</Label>
                                        <Input id="department" value={formData.department} onChange={handleChange} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" placeholder="e.g. Engineering" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-zinc-200">Location *</Label>
                                        <Input id="location" value={formData.location} onChange={handleChange} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" placeholder="e.g. Building A, Floor 3" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-zinc-200">Description *</Label>
                                    <Textarea id="description" value={formData.description} onChange={handleChange} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[120px]" placeholder="Describe the issue in detail..." />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-zinc-100">
                                    <Upload className="w-5 h-5 text-purple-400" />
                                    Evidence
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Label htmlFor="file-upload" className="border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                    <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                                    <span className="text-sm font-medium text-zinc-300">{file ? file.name : 'Click to upload (Image or PDF)'}</span>
                                    <span className="text-xs text-zinc-500">Max file size: 5MB</span>
                                </Label>
                                <Input id="file-upload" type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-zinc-100">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    Anonymity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                                    <Label htmlFor="anonymous" className="flex flex-col cursor-pointer">
                                        <span className="font-medium text-zinc-200">Submit Anonymously</span>
                                        <span className="text-xs text-zinc-400">Your profile details will be hidden.</span>
                                    </Label>
                                    <Switch
                                        id="anonymous"
                                        checked={formData.anonymous}
                                        onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 p-3 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{success}</span>
                                </div>
                            )}
                            <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Case'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
