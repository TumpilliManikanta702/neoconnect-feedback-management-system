'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
    Home,
    FileText,
    PlusCircle,
    BarChart2,
    Settings,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const staffLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Submit Case', href: '/submit-case', icon: PlusCircle },
        { name: 'My Cases', href: '/my-cases', icon: FileText },
        { name: 'Polls', href: '/polls', icon: MessageSquare },
        { name: 'Public Hub', href: '/public-hub', icon: Users },
    ];

    const managerLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Manager View', href: '/manager', icon: Briefcase },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Public Hub', href: '/public-hub', icon: Users },
    ];

    const secretariatLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Polls', href: '/polls', icon: MessageSquare },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Public Hub', href: '/public-hub', icon: Users },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Admin Panel', href: '/admin', icon: Settings },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Public Hub', href: '/public-hub', icon: Users },
    ];

    let links = staffLinks;
    if (user.role === 'Case Manager') links = managerLinks;
    if (user.role === 'Secretariat') links = secretariatLinks;
    if (user.role === 'Admin') links = adminLinks;

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden p-4 fixed top-0 left-0 z-50">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-zinc-200">
                    <Menu className="w-6 h-6" />
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/10 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col h-screen shadow-2xl shadow-purple-500/10`}>
                <div className="flex items-center justify-center h-20 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            NeoConnect
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white hover:shadow-md hover:shadow-white/5'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 transition-colors ${
                                        isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                                    }`} />
                                    <span className="font-medium text-sm">{link.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                            <span className="text-xs text-gray-400">{user.role}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ml-2"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
