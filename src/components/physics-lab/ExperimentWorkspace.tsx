"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { usePhysicsLab, Instrument as InstrumentType } from '@/context/PhysicsLabContext';
import { Instrument } from '@/components/physics-lab/Instrument';
import { WireCanvas } from '@/components/physics-lab/WireCanvas';
import { calculateOhmLaw } from '@/lib/physics/experiments/ohmlaw';
import { calculateWheatstoneBridge } from '@/lib/physics/experiments/wheatstone';

export const ExperimentWorkspace: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const {
        instruments,
        addInstrument,
        updateInstrumentPosition,
        updateInstrumentProperties,
        connections,
        addConnection,
        simulationResults,
        setSimulationResults
    } = usePhysicsLab();

    const workspaceRef = useRef<HTMLDivElement>(null);
    const [isConnecting, setIsConnecting] = useState<{ from: string, type: string } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!workspaceRef.current) return;

        const data = e.dataTransfer.getData('physics-instrument');
        if (!data) return;

        const instData = JSON.parse(data);
        const rect = workspaceRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 50; // Center offset
        const y = e.clientY - rect.top - 50;

        // Define terminals based on instrument type
        const terminals = [
            { id: `${instData.type}-t1-${Date.now()}`, parentId: '', type: 'positive', position: { x: 0, y: 40 } },
            { id: `${instData.type}-t2-${Date.now()}`, parentId: '', type: 'negative', position: { x: 80, y: 40 } },
        ] as any[];

        addInstrument({
            ...instData,
            position: { x, y },
            terminals,
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleTerminalClick = (terminalId: string, type: string) => {
        if (!isConnecting) {
            setIsConnecting({ from: terminalId, type });
        } else {
            if (isConnecting.from !== terminalId) {
                addConnection(isConnecting.from, terminalId);
            }
            setIsConnecting(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (workspaceRef.current) {
            const rect = workspaceRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    // Simulation integration
    useEffect(() => {
        if (experimentId === 'ohm-law') {
            const battery = instruments.find(i => i.type === 'battery');
            const resistor = instruments.find(i => i.type === 'resistor');
            const rheostat = instruments.find(i => i.type === 'rheostat');
            const sw = instruments.find(i => i.type === 'switch');

            const result = calculateOhmLaw(
                battery?.properties.voltage || 9,
                resistor?.properties.resistance || 100,
                rheostat?.properties.resistance || 50,
                sw?.properties.closed || false,
                connections
            );

            setSimulationResults(result);

            // Update instrument readings
            instruments.forEach(inst => {
                if (inst.type === 'ammeter') {
                    updateInstrumentProperties(inst.id, { reading: (result.isValid && result.isClosed) ? (result.current * 1000).toFixed(2) : 0 });
                }
                if (inst.type === 'voltmeter') {
                    updateInstrumentProperties(inst.id, { reading: (result.isValid && result.isClosed) ? result.voltage.toFixed(2) : 0 });
                }
            });
        } else if (experimentId === 'wheatstone-bridge') {
            const battery = instruments.find(i => i.type === 'battery');
            const sw = instruments.find(i => i.type === 'switch');
            const p = instruments.find(i => i.id === 'p');
            const q = instruments.find(i => i.id === 'q');
            const r = instruments.find(i => i.id === 'r');
            const s = instruments.find(i => i.id === 's');

            const result = calculateWheatstoneBridge(
                p?.properties.resistance || 100,
                q?.properties.resistance || 100,
                r?.properties.resistance || 100,
                s?.properties.resistance || 100,
                battery?.properties.voltage || 9,
                sw?.properties.closed || false,
                connections
            );

            setSimulationResults(result);

            // Update Galvanometer
            const galvanometer = instruments.find(i => i.type === 'galvanometer');
            if (galvanometer) {
                updateInstrumentProperties(galvanometer.id, { reading: result.isClosed && result.isValid ? result.galvanometerReading : 0 });
            }
        }
    }, [instruments, connections, updateInstrumentProperties, setSimulationResults, experimentId]);

    return (
        <div
            ref={workspaceRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            className="w-full h-full relative cursor-crosshair overflow-hidden"
        >
            {/* Table Visual */}
            <div className="absolute inset-x-8 bottom-0 h-4 bg-slate-800/50 rounded-t-2xl border-t border-slate-700"></div>

            {/* Wires */}
            <WireCanvas
                connections={connections}
                instruments={instruments}
                activeConnection={isConnecting ? { from: isConnecting.from, to: mousePos } : null}
            />

            {/* Instruments */}
            {instruments.map((inst) => (
                <Instrument
                    key={inst.id}
                    instrument={inst}
                    onPositionChange={(x: number, y: number) => updateInstrumentPosition(inst.id, x, y)}
                    onTerminalClick={handleTerminalClick}
                    updateProperties={updateInstrumentProperties}
                />
            ))}

            {/* Success Notification */}
            {simulationResults.isValid && simulationResults.isClosed && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {experimentId === 'ohm-law' ? 'Ohmic conduction detected' : 'Bridge active: Galvanometer reading stable'}
                    </span>
                </div>
            )}

            {/* Connection Indicator */}
            {isConnecting && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold animate-pulse uppercase tracking-widest">
                    Connecting {isConnecting.type} terminal...
                </div>
            )}
        </div>
    );
};
