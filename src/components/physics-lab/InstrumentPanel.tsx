"use client";

import React from 'react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { Trash2 } from 'lucide-react';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';

export const InstrumentPanel: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const { addInstrument, resetLab } = usePhysicsLab();

    // Define instruments based on experiment
    const instrumentsByExperiment: Record<string, any[]> = {
        'ohm-law': [
            { type: 'battery', name: 'Battery', properties: { voltage: 9 } },
            { type: 'resistor', name: 'Resistor', properties: { resistance: 100 } },
            { type: 'ammeter', name: 'Ammeter', properties: { scale: 10, reading: 0 } },
            { type: 'voltmeter', name: 'Voltmeter', properties: { scale: 20, reading: 0 } },
            { type: 'rheostat', name: 'Rheostat', properties: { resistance: 50, maxResistance: 100, reading: 0 } },
            { type: 'switch', name: 'Plug Key', properties: { closed: false } },
        ],
        'wheatstone-bridge': [
            { type: 'battery', name: 'Battery', properties: { voltage: 12 } },
            { type: 'resistor', name: 'P (Fixed)', properties: { resistance: 10 } },
            { type: 'resistor', name: 'Q (Fixed)', properties: { resistance: 10 } },
            { type: 'resistor', name: 'R (Variable)', properties: { resistance: 10 } },
            { type: 'resistor', name: 'S (Unknown)', properties: { resistance: 100 } },
            { type: 'galvanometer', name: 'Galvanometer', properties: { reading: 0 } },
            { type: 'switch', name: 'Key K1', properties: { closed: false } },
            { type: 'switch', name: 'Key K2', properties: { closed: false } },
        ],
        'reflection-refraction': [
            { type: 'block', name: 'Object (Source)', properties: { mass: 'Light Source' } },
            { type: 'lens', name: 'Convex Lens', properties: { type: 'convex', focalLength: 20 } },
            { type: 'lens', name: 'Concave Lens', properties: { type: 'concave', focalLength: 15 } },
            { type: 'mirror', name: 'Plane Mirror', properties: { type: 'plane' } },
        ],
        'newton-second-law': [
            { type: 'pulley', name: 'Fixed Pulley', properties: { friction: 0 } },
            { type: 'block', name: 'Mass Block M1', properties: { mass: 5 } },
            { type: 'block', name: 'Mass Block M2', properties: { mass: 10 } },
        ]
    };

    const instruments = instrumentsByExperiment[experimentId] || instrumentsByExperiment['ohm-law'];

    const handleDragStart = (e: React.DragEvent, inst: any) => {
        e.dataTransfer.setData('physics-instrument', JSON.stringify(inst));
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {instruments.map((inst) => (
                    <div
                        key={`${inst.type}-${inst.name}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, inst)}
                        className="group p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-2 overflow-hidden"
                    >
                        <div className="w-full flex items-center justify-center scale-[0.36] origin-center -my-8 pointer-events-none">
                            <InstrumentVisuals
                                type={inst.type}
                                properties={inst.properties}
                                isHovered={false}
                            />
                        </div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">{inst.name}</span>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-slate-800">
                <button
                    onClick={resetLab}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium text-sm"
                >
                    <Trash2 size={16} />
                    Reset Workspace
                </button>
            </div>
        </div>
    );
};
