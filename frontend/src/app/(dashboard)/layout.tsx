import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto md:ml-64 p-4 md:p-8 pt-20 md:pt-8 bg-gradient-to-br from-slate-900/50 via-slate-950/50 to-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
