import React from 'react';
import { Home, User, BookOpen, LogOut } from 'lucide-react';

const Navigation = ({ stage, setStage, handleLogout, goHome }) => {
    const navItems = [
        { name: 'Home', icon: <Home className="w-6 h-6" />, stage: 'dashboard', action: goHome },
        { name: 'Profile', icon: <User className="w-6 h-6" />, stage: 'profile', action: () => setStage('profile') },
        { name: 'Adventures', icon: <BookOpen className="w-6 h-6" />, stage: 'dashboard', action: goHome },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg border-t-2 border-indigo-200 md:left-auto md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:right-4 md:rounded-2xl md:border">
            <div className="flex justify-around p-2 md:flex-col md:p-4 md:gap-6">
                {navItems.map(item => (
                    <button key={item.name} onClick={item.action} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${stage === item.stage ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                        {item.icon}
                        <span className="text-xs font-bold">{item.name}</span>
                    </button>
                ))}
                <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors text-gray-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="w-6 h-6" />
                    <span className="text-xs font-bold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Navigation;