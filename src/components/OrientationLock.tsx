"use client";

import React, { useEffect, useState } from 'react';
import { RotateCw, Smartphone } from '@/lib/icons';

export const OrientationLock: React.FC = () => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if device is mobile and in portrait
            // Using a slightly more robust check for mobile/tablet
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
            const portrait = window.innerHeight > window.innerWidth;
            setIsPortrait(isMobile && portrait);
        };

        // Initial check
        checkOrientation();

        // Listen for orientation changes or resize
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        // Attempt to lock orientation if API is available
        const lockOrientation = async () => {
            try {
                if (screen.orientation && (screen.orientation as any).lock) {
                    await (screen.orientation as any).lock('landscape');
                }
            } catch (err) {
                // Ignore errors as this is a best-effort
            }
        };

        lockOrientation();

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isPortrait) return null;

    return (
        <div className="fixed inset-0 z-[100000] bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white landscape:hidden">
            <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-blue-600 rounded-3xl shadow-2xl">
                    <div className="relative">
                        <Smartphone size={40} className="rotate-0 animate-pulse" />
                        <RotateCw size={24} className="absolute -top-2 -right-2 text-yellow-400 animate-spin" />
                    </div>
                </div>
            </div>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">PLEASE ROTATE YOUR DEVICE</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">
                Virtual Physics Lab is optimized for landscape mode.
            </p>
            
            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
            </div>
        </div>
    );
};
