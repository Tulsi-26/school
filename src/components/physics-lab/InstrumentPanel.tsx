"use client";

import React from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { Trash2 } from '@/lib/icons';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';
import { useLanguage } from '@/context/LanguageContext';

export const InstrumentPanel: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const { addInstrument, resetLab } = usePhysicsLab();
    const { t } = useLanguage();

    // Define instruments based on experiment
    const instrumentsByExperiment: Record<string, any[]> = {
        'ohm-law': [
            { type: 'battery', name: t('instruments.battery'), properties: { voltage: 9 } },
            { type: 'resistor', name: t('instruments.resistor'), properties: { resistance: 100 } },
            { type: 'ammeter', name: t('instruments.ammeter'), properties: { scale: 100, unit: 'mA', reading: 0 } },
            { type: 'voltmeter', name: t('instruments.voltmeter'), properties: { scale: 20, unit: 'V', reading: 0 } },
            { type: 'rheostat', name: t('instruments.rheostat'), properties: { resistance: 50, maxResistance: 100, reading: 0 } },
            { type: 'switch', name: t('instruments.switch'), properties: { closed: false } },
        ],
        'wheatstone-bridge': [
            { type: 'battery', name: t('instruments.battery'), properties: { voltage: 12 } },
            { type: 'resistor', name: t('instruments.fixedP'), properties: { resistance: 10 } },
            { type: 'resistor', name: t('instruments.fixedQ'), properties: { resistance: 10 } },
            { type: 'resistor', name: t('instruments.varR'), properties: { resistance: 10 } },
            { type: 'resistor', name: t('instruments.unS'), properties: { resistance: 100 } },
            { type: 'galvanometer', name: t('instruments.galvanometer'), properties: { reading: 0 } },
            { type: 'switch', name: t('instruments.keyK1'), properties: { closed: false } },
            { type: 'switch', name: t('instruments.keyK2'), properties: { closed: false } },
        ],
        'reflection-refraction': [
            { type: 'block', name: t('instruments.source'), properties: { mass: 'Light Source' } },
            { type: 'lens', name: t('instruments.convex'), properties: { type: 'convex', focalLength: 20 } },
            { type: 'lens', name: t('instruments.concave'), properties: { type: 'concave', focalLength: 15 } },
            { type: 'mirror', name: t('instruments.plane'), properties: { type: 'plane' } },
            { type: 'screen', name: t('instruments.screen'), properties: {} },
        ],
        'newton-second-law': [
            { type: 'pulley', name: t('instruments.pulley'), properties: { friction: 0 } },
            { type: 'block', name: t('instruments.m1'), properties: { mass: 5 } },
            { type: 'block', name: t('instruments.m2'), properties: { mass: 10 } },
            { type: 'stopwatch', name: t('instruments.stopwatch'), properties: { time: 0, running: false } },
            { type: 'meter-scale', name: t('instruments.scale'), properties: { length: 100 } },
        ]
    };

    const instruments = instrumentsByExperiment[experimentId] || instrumentsByExperiment['ohm-law'];

    const handleDragStart = (e: React.DragEvent, inst: any) => {
        e.dataTransfer.setData('physics-instrument', JSON.stringify(inst));
        
        // Create a custom, nice-looking drag ghost image
        const ghost = document.createElement('div');
        ghost.className = 'px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-2xl border-2 border-blue-400 pointer-events-none fixed top-[-1000px] left-[-1000px] z-[9999] flex items-center justify-center';
        ghost.style.width = '160px';
        ghost.innerHTML = `${t('common.drop') ?? 'Drop'} ${inst.name}`;
        document.body.appendChild(ghost);
        
        e.dataTransfer.setDragImage(ghost, 80, 20); // Center the ghost on the mouse
        
        // Cleanup ghost element after drag starts
        setTimeout(() => {
            if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        }, 100);
    };

    return (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth">
            <div className="grid grid-cols-1 gap-2">
                {instruments.map((inst) => (
                    <div
                        key={`${inst.type}-${inst.name}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, inst)}
                        className="group p-2 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing flex flex-row items-center gap-3 overflow-hidden h-14"
                    >
                        <div className="w-12 h-full flex items-center justify-center shrink-0">
                            <div className="scale-[0.24] origin-center pointer-events-none">
                                <InstrumentVisuals
                                    type={inst.type}
                                    properties={inst.properties}
                                    isHovered={false}
                                />
                            </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate flex-1">
                            {inst.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={resetLab}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium text-sm"
                >
                    <Trash2 size={16} />
                    {t('common.reset')}
                </button>
            </div>
        </div>
    );
};
