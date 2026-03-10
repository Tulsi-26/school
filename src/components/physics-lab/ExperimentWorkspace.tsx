"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Settings, Eye, EyeOff, Grid3X3 } from 'lucide-react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';
import { Instrument } from '@/components/physics-lab/Instrument';
import { WireCanvas } from '@/components/physics-lab/WireCanvas';
import { calculateOhmLaw } from '@/lib/physics/experiments/ohmlaw';
import { calculateWheatstoneBridge } from '@/lib/physics/experiments/wheatstone';
import { calculateMechanicsSimulation } from '@/lib/physics/experiments/mechanics_proto';
import { RayCanvas } from '@/components/physics-lab/RayCanvas';
import { VectorCanvas } from '@/components/physics-lab/VectorCanvas';
import { CircuitFeedback } from '@/components/physics-lab/CircuitFeedback';
import { validateOhmLawCircuit, validateWheatstoneBridge } from '@/lib/physics/core/circuitValidator';
import { traceRayThroughComponents } from '@/lib/physics/core/optics';

const SNAP_SIZE = 40;

export const ExperimentWorkspace: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const {
        instruments,
        addInstrument,
        updateInstrumentPosition,
        updateInstrumentProperties,
        connections,
        addConnection,
        removeConnection,
        simulationResults,
        setSimulationResults,
        setValidationState
    } = usePhysicsLab();

    const [showVisuals, setShowVisuals] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [workspaceRect, setWorkspaceRect] = useState<DOMRect | null>(null);
    const [wirePanelInstrumentId, setWirePanelInstrumentId] = useState<string | null>(null);

    const workspaceRef = useRef<HTMLDivElement>(null);
    const [isConnecting, setIsConnecting] = useState<{ from: string, type: string } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const lastReadingsRef = useRef<Record<string, number>>({});

    const snapToGrid = (val: number) => snapEnabled ? Math.round(val / SNAP_SIZE) * SNAP_SIZE : val;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!workspaceRef.current) return;

        const data = e.dataTransfer.getData('physics-instrument');
        if (!data) return;

        const instData = JSON.parse(data);
        const rect = workspaceRef.current.getBoundingClientRect();

        const typeDimensions: Record<string, { w: number, h: number }> = {
            battery: { w: 280, h: 160 },
            ammeter: { w: 200, h: 250 },
            voltmeter: { w: 200, h: 250 },
            resistor: { w: 240, h: 160 },
            rheostat: { w: 260, h: 120 },
            switch: { w: 180, h: 120 },
            galvanometer: { w: 288, h: 340 },
        };
        const dim = typeDimensions[instData.type] || { w: 100, h: 100 };

        const x = e.clientX - rect.left - (dim.w / 2); // Dynamic Center offset
        const y = e.clientY - rect.top - (dim.h / 2);

        // Snap to grid
        const finalX = snapToGrid(x);
        const finalY = snapToGrid(y);

        const terminalLayouts: Record<string, { x: number; y: number }[]> = {
            battery: [{ x: 122, y: 110 }, { x: 156, y: 110 }],
            ammeter: [{ x: 44, y: 224 }, { x: 180, y: 224 }],
            voltmeter: [{ x: 102, y: 272 }, { x: 186, y: 272 }],
            resistor: [{ x: 30, y: 120 }, { x: 210, y: 120 }],
            rheostat: [{ x: 12, y: 77 }, { x: 248, y: 77 }],
            switch: [{ x: 57, y: 20 }, { x: 123, y: 20 }],
            galvanometer: [{ x: 44, y: 224 }, { x: 180, y: 224 }], // Assuming uses a Meter or similar
        };

        const layout = terminalLayouts[instData.type] || [{ x: 0, y: 40 }, { x: 80, y: 40 }];
        const terminals = [
            { id: `${instData.type}-t1-${Date.now()}`, parentId: '', type: 'positive', position: layout[0] },
            { id: `${instData.type}-t2-${Date.now()}`, parentId: '', type: 'negative', position: layout[1] },
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



    const handleTerminalClick = useCallback((terminalId: string, type: string) => {
        if (isConnecting) {
            if (isConnecting.from !== terminalId) {
                addConnection(isConnecting.from, terminalId);
            }
            setIsConnecting(null);
        }
    }, [isConnecting, addConnection]);

    const handleTerminalDoubleClick = useCallback((terminalId: string, type: string) => {
        setIsConnecting({ from: terminalId, type });
    }, []);

    const handleInstrumentDoubleClick = useCallback((instrumentId: string) => {
        setWirePanelInstrumentId((prev) => prev === instrumentId ? null : instrumentId);
        setIsConnecting(null); // Cancel any active terminal connection
    }, []);

    const handleWirePanelClose = useCallback(() => {
        setWirePanelInstrumentId(null);
    }, []);

    const handleWireConnect = useCallback((fromTerminalId: string, toTerminalId: string) => {
        addConnection(fromTerminalId, toTerminalId);
    }, [addConnection]);

    const handleWireDisconnect = useCallback((connectionId: string) => {
        removeConnection(connectionId);
    }, [removeConnection]);

    const handlePositionChange = useCallback((id: string, x: number, y: number) => {
        const snappedX = snapToGrid(x);
        const snappedY = snapToGrid(y);
        updateInstrumentPosition(id, snappedX, snappedY);
    }, [snapToGrid, updateInstrumentPosition]);

    const handlePropertyUpdate = useCallback((id: string, props: any) => {
        updateInstrumentProperties(id, props);
    }, [updateInstrumentProperties]);

    const handleWorkspaceClick = useCallback(() => {
        if (wirePanelInstrumentId) {
            setWirePanelInstrumentId(null);
        }
    }, [wirePanelInstrumentId]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isConnecting && workspaceRef.current) {
            const rect = workspaceRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    }, [isConnecting]);

    // Circuit validation
    useEffect(() => {
        if (experimentId === 'ohm-law') {
            const validation = validateOhmLawCircuit(instruments, connections);
            setValidationState(validation.errors, validation.suggestions, validation.isValid);
        } else if (experimentId === 'wheatstone-bridge') {
            const validation = validateWheatstoneBridge(instruments, connections);
            setValidationState(validation.errors, validation.suggestions, validation.isValid);
        } else {
            setValidationState([], [], true);
        }
    }, [instruments, connections, experimentId, setValidationState]);

    // Extract simulation-relevant values as primitives to avoid infinite loops.
    // The old code had instruments in the dependency array AND called updateInstrumentProperties
    // (which modifies instruments), creating: useEffect runs → setInstruments → useEffect runs → ...
    const simInputs = useMemo(() => {
        const battery = instruments.find(i => i.type === 'battery');
        const resistor = instruments.find(i => i.type === 'resistor');
        const rheostat = instruments.find(i => i.type === 'rheostat');
        const sw = instruments.find(i => i.type === 'switch');
        const p = instruments.find(i => i.id === 'p');
        const q = instruments.find(i => i.id === 'q');
        const r = instruments.find(i => i.id === 'r');
        const s = instruments.find(i => i.id === 's');
        const galvanometer = instruments.find(i => i.type === 'galvanometer');
        const meterIds = instruments.filter(i => i.type === 'ammeter' || i.type === 'voltmeter').map(i => ({
            id: i?.id,
            type: i?.type,
            unit: i?.properties?.unit || (i?.type === 'ammeter' ? 'mA' : 'V')
        }));
        const object = instruments.find(i => i.type === 'block');
        const lenses = instruments.filter(i => i.type === 'lens').map(l => ({
            position: { x: l.position.x, y: l.position.y },
            focalLength: l.properties.focalLength,
            type: l.properties.type
        }));
        const m1 = instruments.find(i => i.name?.includes('M1'));
        const m2 = instruments.find(i => i.name?.includes('M2'));

        const isOpticsOrMech = experimentId === 'reflection-refraction' || experimentId === 'newton-second-law';

        return {
            voltage: battery?.properties.voltage || 9,
            resistance: resistor?.properties.resistance || 100,
            rheostatR: rheostat?.properties.resistance || 50,
            switchClosed: sw?.properties.closed || false,
            pR: p?.properties.resistance || 100,
            qR: q?.properties.resistance || 100,
            rR: r?.properties.resistance || 100,
            sR: s?.properties.resistance || 100,
            galvanometerId: galvanometer?.id || null,
            meterIds,
            object: (isOpticsOrMech && object) ? { posX: object.position.x, posY: object.position.y } : (object ? { posX: 0, posY: 0 } : null),
            lenses: isOpticsOrMech ? lenses : [],
            m1: (isOpticsOrMech && m1) ? { posX: m1.position.x, posY: m1.position.y, mass: m1.properties.mass } : null,
            m2: (isOpticsOrMech && m2) ? { posX: m2.position.x, posY: m2.position.y, mass: m2.properties.mass } : null,
        };
    }, [instruments, experimentId]);

    // Simulation integration — uses extracted primitive values to avoid dependency on instruments object
    useEffect(() => {
        if (experimentId === 'ohm-law') {
            const result = calculateOhmLaw(
                simInputs.voltage,
                simInputs.resistance,
                simInputs.rheostatR,
                simInputs.switchClosed,
                connections,
                instruments
            );

            setSimulationResults(result);

            // Update instrument readings only when values actually change
            simInputs.meterIds.forEach(({ id, type, unit }) => {
                let newReading: number | string = 0;
                if (type === 'ammeter') {
                    const currentMultiplier = unit === 'mA' ? 1000 : 1;
                    newReading = (result.isValid && result.isClosed) ? (result.current * currentMultiplier).toFixed(2) : 0;
                } else if (type === 'voltmeter') {
                    const voltageMultiplier = unit === 'mV' ? 1000 : 1;
                    newReading = (result.isValid && result.isClosed) ? (result.voltage * voltageMultiplier).toFixed(2) : 0;
                }
                const key = `${id}-reading`;
                if (lastReadingsRef.current[key] !== Number(newReading)) {
                    lastReadingsRef.current[key] = Number(newReading);
                    updateInstrumentProperties(id, { reading: newReading });
                }
            });
        } else if (experimentId === 'wheatstone-bridge') {
            const result = calculateWheatstoneBridge(
                simInputs.pR,
                simInputs.qR,
                simInputs.rR,
                simInputs.sR,
                simInputs.voltage,
                simInputs.switchClosed,
                connections
            );

            setSimulationResults(result);

            // Update Galvanometer only when reading changes
            if (simInputs.galvanometerId) {
                const newReading = result.isClosed && result.isValid ? result.galvanometerReading : 0;
                const key = `${simInputs.galvanometerId}-reading`;
                if (lastReadingsRef.current[key] !== newReading) {
                    lastReadingsRef.current[key] = newReading;
                    updateInstrumentProperties(simInputs.galvanometerId, { reading: newReading });
                }
            }
        } else if (experimentId === 'reflection-refraction') {
            if (simInputs.object && simInputs.lenses.length > 0) {
                const initialRay = { origin: { x: simInputs.object.posX + 50, y: 0 }, angle: 0 };
                const path = traceRayThroughComponents(initialRay, simInputs.lenses);
                const firstLensY = simInputs.lenses[0].position.y;
                const rays = path.map((r, i) => ({
                    ...r,
                    origin: { x: r.origin.x, y: firstLensY + 100 + r.origin.y },
                    length: i < path.length - 1 ? (path[i + 1].origin.x - r.origin.x) : 800
                }));
                setSimulationResults({ rays, isValid: true, isClosed: true });
            }
        } else if (experimentId === 'newton-second-law') {
            if (simInputs.m1 && simInputs.m2) {
                const result = calculateMechanicsSimulation(
                    simInputs.m1.mass,
                    simInputs.m2.mass,
                    0 // static for now
                );

                // Generate vectors for visualization (Weight and Accel)
                const vectors = [
                    {
                        origin: { x: simInputs.m1.posX + 50, y: simInputs.m1.posY + 50 },
                        direction: { x: 0, y: 40 },
                        label: 'W1',
                        color: 'text-red-400'
                    },
                    {
                        origin: { x: simInputs.m2.posX + 50, y: simInputs.m2.posY + 50 },
                        direction: { x: 0, y: 40 },
                        label: 'W2',
                        color: 'text-red-400'
                    }
                ];

                if (result.acceleration > 0) {
                    vectors.push({
                        origin: { x: (simInputs.m1.posX + simInputs.m2.posX) / 2 + 50, y: 50 },
                        direction: { x: 0, y: -30 },
                        label: 'a',
                        color: 'text-emerald-400'
                    });
                }

                setSimulationResults({ ...result, vectors, isValid: true, isClosed: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [simInputs, connections, experimentId]);

    const isCurrentFlowing = simulationResults.isValid && simulationResults.isClosed;

    return (
        <div
            ref={workspaceRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onClick={handleWorkspaceClick}
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
                    <button
                        onClick={() => setSnapEnabled(!snapEnabled)}
                        className={`p-2 rounded-lg transition-all ${snapEnabled ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                        title={snapEnabled ? "Disable Snap to Grid" : "Enable Snap to Grid"}
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg transition-all" title="Lab Settings">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Snap Grid Overlay */}
            {snapEnabled && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Grid dots at snap intersections */}
                    <svg className="w-full h-full opacity-20">
                        <defs>
                            <pattern id="snapGrid" width={SNAP_SIZE} height={SNAP_SIZE} patternUnits="userSpaceOnUse">
                                <circle cx={SNAP_SIZE / 2} cy={SNAP_SIZE / 2} r="1.5" fill="#475569" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#snapGrid)" />
                    </svg>
                </div>
            )}

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

            {/* Wires with current flow animation */}
            <WireCanvas
                connections={connections}
                instruments={instruments}
                activeConnection={isConnecting ? { from: isConnecting.from, to: mousePos } : null}
                showCurrentFlow={isCurrentFlowing}
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
                    id={inst.id}
                    type={inst.type}
                    name={inst.name}
                    position={inst.position}
                    properties={inst.properties}
                    terminals={inst.terminals}
                    onPositionChange={handlePositionChange}
                    onTerminalClick={handleTerminalClick}
                    onTerminalDoubleClick={handleTerminalDoubleClick}
                    updateProperties={handlePropertyUpdate}
                    onInstrumentDoubleClick={handleInstrumentDoubleClick}
                    showWirePanel={wirePanelInstrumentId === inst.id}
                    onWirePanelClose={handleWirePanelClose}
                    onWireConnect={handleWireConnect}
                    onWireDisconnect={handleWireDisconnect}
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
