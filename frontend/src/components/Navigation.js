import React from 'react';
import { Home, BookOpen, LogOut, FileText } from 'lucide-react';

const Navigation = ({ stage, setStage, handleLogout, goHome, goToBlog }) => {
    const navItems = [
        { name: 'Home', icon: <Home className="w-5 h-5" />, stage: 'dashboard', action: goHome, stages: ['dashboard'] },
        { name: 'Adventures', icon: <BookOpen className="w-5 h-5" />, stage: 'adventures', action: () => setStage('adventures') },
        { name: 'Blog', icon: <FileText className="w-5 h-5" />, stage: 'blog', action: goToBlog, stages: ['blog', 'my-blogs', 'create-blog', 'view-blog'] },
    ];

    return (
        <div className="fixed top-0 left-0 h-full w-20 bg-card flex flex-col items-center py-4 shadow-lg border-r border-border z-30">
            <div className="flex flex-col items-center justify-between h-full w-full">
                <div className="flex flex-col items-center gap-4">
                {navItems.map(item => (
                        <button key={item.name} onClick={item.action} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16 ${(item.stages || [item.stage]).includes(stage) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                        {item.icon}
                            <span className="text-xs font-medium">{item.name}</span>
                    </button>
                ))}
                </div>
                <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Navigation;