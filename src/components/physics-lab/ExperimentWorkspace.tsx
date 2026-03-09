"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { usePhysicsLab, Instrument as InstrumentType } from '@/context/PhysicsLabContext';
import { Instrument } from '@/components/physics-lab/Instrument';
import { WireCanvas } from '@/components/physics-lab/WireCanvas';
import { calculateOhmLaw } from '@/lib/physics/experiments/ohmlaw';
import { calculateWheatstoneBridge } from '@/lib/physics/experiments/wheatstone';
import { calculateOpticsSimulation } from '@/lib/physics/experiments/optics_proto';
import { calculateMechanicsSimulation } from '@/lib/physics/experiments/mechanics_proto';
import { RayCanvas } from '@/components/physics-lab/RayCanvas';
import { VectorCanvas } from '@/components/physics-lab/VectorCanvas';
import { traceRayThroughComponents } from '@/lib/physics/core/optics';

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

    const [showVisuals, setShowVisuals] = useState(true);
    const [workspaceRect, setWorkspaceRect] = useState<DOMRect | null>(null);

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

        // Optical Bench Snapping
        let finalX = x;
        let finalY = y;
        if (experimentId === 'reflection-refraction') {
            finalX = Math.round(x / 40) * 40;
            finalY = Math.round(y / 40) * 40;
        }

        // Define terminals based on instrument type
        const terminals = [
            { id: `${instData.type}-t1-${Date.now()}`, parentId: '', type: 'positive', position: { x: 0, y: 40 } },
            { id: `${instData.type}-t2-${Date.now()}`, parentId: '', type: 'negative', position: { x: 80, y: 40 } },
        ] as any[];

        addInstrument({
            ...instData,
            position: { x: finalX, y: finalY },
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
                connections,
                instruments
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
        } else if (experimentId === 'reflection-refraction') {
            const object = instruments.find(i => i.type === 'block');
            const lenses = instruments
                .filter(i => i.type === 'lens')
                .map(l => ({
                    position: l.position,
                    focalLength: l.properties.focalLength,
                    type: l.properties.type
                }));

            if (object && lenses.length > 0) {
                const initialRay = { origin: { x: object.position.x + 50, y: 0 }, angle: 0 };
                const path = traceRayThroughComponents(initialRay, lenses);
                const firstLensY = lenses[0].position.y;
                const rays = path.map((r, i) => ({
                    ...r,
                    origin: { x: r.origin.x, y: firstLensY + 100 + r.origin.y },
                    length: i < path.length - 1 ? (path[i + 1].origin.x - r.origin.x) : 800
                }));
                setSimulationResults({ rays, isValid: true, isClosed: true });
            }
        } else if (experimentId === 'newton-second-law') {
            const m1 = instruments.find(i => i.name.includes('M1'));
            const m2 = instruments.find(i => i.name.includes('M2'));

            if (m1 && m2) {
                const result = calculateMechanicsSimulation(
                    m1.properties.mass,
                    m2.properties.mass,
                    0 // static for now
                );

                // Generate vectors for visualization (Weight and Accel)
                const vectors = [
                    {
                        origin: { x: m1.position.x + 50, y: m1.position.y + 50 },
                        direction: { x: 0, y: 40 },
                        label: 'W1',
                        color: 'text-red-400'
                    },
                    {
                        origin: { x: m2.position.x + 50, y: m2.position.y + 50 },
                        direction: { x: 0, y: 40 },
                        label: 'W2',
                        color: 'text-red-400'
                    }
                ];

                if (result.acceleration > 0) {
                    vectors.push({
                        origin: { x: (m1.position.x + m2.position.x) / 2 + 50, y: 50 },
                        direction: { x: 0, y: -30 },
                        label: 'a',
                        color: 'text-emerald-400'
                    });
                }

                setSimulationResults({ ...result, vectors, isValid: true, isClosed: true });
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
            {/* Lab HUD */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
                <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-md rounded-xl p-1 flex gap-1 shadow-2xl">
                    <button
                        onClick={() => setShowVisuals(!showVisuals)}
                        className={`p-2 rounded-lg transition-all ${showVisuals ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                        title={showVisuals ? "Hide Visualizations" : "Show Visualizations"}
                    >
                        {showVisuals ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg transition-all" title="Lab Settings">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Optical Bench Ruler */}
            {experimentId === 'reflection-refraction' && (
                <div className="absolute bottom-8 inset-x-12 h-10 border-t-2 border-slate-700/50 flex items-start pointer-events-none">
                    {Array.from({ length: 21 }).map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-0.5 h-3 bg-slate-700/50"></div>
                            <span className="text-[9px] font-mono text-slate-600 mt-1">{i * 5}cm</span>
                        </div>
                    ))}
                    <div className="absolute top-[-2px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                </div>
            )}

            {/* Table Visual */}
            <div className="absolute inset-x-8 bottom-0 h-4 bg-slate-800/50 rounded-t-2xl border-t border-slate-700"></div>

            {/* Wires */}
            <WireCanvas
                connections={connections}
                instruments={instruments}
                activeConnection={isConnecting ? { from: isConnecting.from, to: mousePos } : null}
            />

            {/* Optics Visualization */}
            {showVisuals && experimentId === 'reflection-refraction' && simulationResults.rays && (
                <RayCanvas rays={simulationResults.rays} />
            )}

            {/* Mechanics Visualization */}
            {showVisuals && experimentId === 'newton-second-law' && simulationResults.vectors && (
                <VectorCanvas vectors={simulationResults.vectors} />
            )}

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
                        {experimentId === 'ohm-law' && 'Ohmic conduction detected'}
                        {experimentId === 'wheatstone-bridge' && 'Bridge active: Galvanometer reading stable'}
                        {experimentId === 'reflection-refraction' && 'Optical path established'}
                        {experimentId === 'newton-second-law' && 'Mechanical equilibrium calculated'}
                    </span>
                </div>
            )}

            {/* Hint / Warning Notification */}
            {!simulationResults.isValid && simulationResults.hint && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-6 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {simulationResults.hint}
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
