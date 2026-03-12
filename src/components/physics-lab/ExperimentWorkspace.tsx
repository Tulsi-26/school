"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Settings, Eye, EyeOff, Grid3X3 } from '@/lib/icons';
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
const MECHANICAL_INSTRUMENT_TYPES = ['pulley', 'block'];
const MECHANICS_EXPERIMENT_IDS = ['newton-second-law'];

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
    const workspaceRef = useRef<HTMLDivElement>(null);
    const lastReadingsRef = useRef<Record<string, number>>({});
    const [isConnecting, setIsConnecting] = useState<{ from: string, type: string, timestamp: number } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [wirePanelInstrumentId, setWirePanelInstrumentId] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [dragOffsets, setDragOffsets] = useState<Record<string, { x: number, y: number }>>({});
    const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

    const snapToGrid = (val: number) => snapEnabled ? Math.round(val / SNAP_SIZE) * SNAP_SIZE : val;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!workspaceRef.current) return;

        const data = e.dataTransfer.getData('physics-instrument');
        if (!data) return;

        const instData = JSON.parse(data);
        const rect = workspaceRef.current.getBoundingClientRect();

        const typeDimensions: Record<string, { w: number, h: number }> = {
            battery: { w: 220, h: 130 },
            ammeter: { w: 288, h: 256 },
            voltmeter: { w: 288, h: 256 },
            resistor: { w: 160, h: 96 },
            rheostat: { w: 320, h: 150 },
            switch: { w: 140, h: 95 },
            galvanometer: { w: 288, h: 256 },
        };
        const dim = typeDimensions[instData.type] || { w: 100, h: 100 };

        const x = e.clientX - rect.left - (dim.w / 2); // Dynamic Center offset
        const y = e.clientY - rect.top - (dim.h / 2);

        // Snap to grid
        const finalX = snapToGrid(x);
        const finalY = snapToGrid(y);

        const terminalLayouts: Record<string, { x: number; y: number }[]> = {
            battery: [{ x: 88, y: 109 }, { x: 128, y: 109 }],
            ammeter: [{ x: 112, y: 260 }, { x: 176, y: 260 }],
            voltmeter: [{ x: 112, y: 260 }, { x: 176, y: 260 }],
            resistor: [{ x: 15, y: 85 }, { x: 145, y: 85 }],
            rheostat: [{ x: 62, y: 125 }, { x: 258, y: 125 }],
            switch: [{ x: 42, y: 37 }, { x: 98, y: 37 }],
            galvanometer: [{ x: 112, y: 260 }, { x: 176, y: 260 }], 
        };

        const layout = terminalLayouts[instData.type] || [{ x: 0, y: 40 }, { x: 80, y: 40 }];
        const isMechanical = MECHANICAL_INSTRUMENT_TYPES.includes(instData.type);
        const terminals = layout.map((pos, idx) => ({
            id: `${instData.type}-t${idx + 1}-${Date.now()}`,
            parentId: '',
            type: isMechanical ? (idx === 0 ? 'input' : 'output') : (idx === 0 ? 'positive' : 'negative'),
            position: pos,
        })) as any[];

        addInstrument({
            ...instData,
            position: { x: finalX, y: finalY },
            terminals,
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };


    const handleTerminalPointerDown = useCallback((terminalId: string, type: string) => {
        if (isConnecting && isConnecting.from !== terminalId) {
            const isMechanicsExp = MECHANICS_EXPERIMENT_IDS.includes(experimentId);
            addConnection(isConnecting.from, terminalId, isMechanicsExp ? 'rope' : 'wire');
            setIsConnecting(null);
        } else {
            setIsConnecting({ from: terminalId, type, timestamp: Date.now() });
        }
    }, [isConnecting, addConnection, experimentId]);

    const handleTerminalPointerUp = useCallback((terminalId: string, type: string) => {
        if (isConnecting) {
            if (isConnecting.from !== terminalId) {
                const isMechanicsExp = MECHANICS_EXPERIMENT_IDS.includes(experimentId);
                addConnection(isConnecting.from, terminalId, isMechanicsExp ? 'rope' : 'wire');
                setIsConnecting(null);
            } else {
                const elapsed = Date.now() - isConnecting.timestamp;
                if (elapsed > 300) {
                    setIsConnecting(null);
                }
            }
        }
    }, [isConnecting, addConnection, experimentId]);

    const handleTerminalHover = useCallback((terminalId: string | null) => {
        setHoveredTerminal(terminalId);
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

    const handleDrag = useCallback((id: string, x: number, y: number) => {
        // Use requestAnimationFrame for smoother updates and to avoid React batching bottlenecks
        window.requestAnimationFrame(() => {
            setDragOffsets(prev => {
                if (prev[id]?.x === x && prev[id]?.y === y) return prev;
                return { ...prev, [id]: { x, y } };
            });
        });
    }, []);

    const handleDragEndLive = useCallback((id: string) => {
        setDragOffsets(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const handleWorkspaceClick = useCallback(() => {
        if (wirePanelInstrumentId) {
            setWirePanelInstrumentId(null);
        }
    }, [wirePanelInstrumentId]);

    const handleWorkspacePointerUp = useCallback(() => {
        if (isConnecting && !hoveredTerminal) {
             const elapsed = Date.now() - (isConnecting.timestamp || 0);
             if (elapsed > 300) {
                 setIsConnecting(null);
             }
        }
    }, [isConnecting, hoveredTerminal]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isConnecting || !workspaceRef.current) return;
        
        const rect = workspaceRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only update if the position actually changed significantly (e.g., > 1px)
        // or just update directly if already connecting
        setMousePos({ x, y });
    };

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
        const meterIds = instruments.filter(i => i.type === 'ammeter' || i.type === 'voltmeter').map(i => ({ id: i.id, type: i.type }));
        const object = instruments.find(i => i.type === 'block');
        const lenses = instruments.filter(i => i.type === 'lens').map(l => ({ position: l.position, focalLength: l.properties.focalLength, type: l.properties.type }));
        const m1 = instruments.find(i => i.name?.includes('M1'));
        const m2 = instruments.find(i => i.name?.includes('M2'));

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
            object: object ? { posX: object.position.x, posY: object.position.y } : null,
            lenses,
            m1: m1 ? { posX: m1.position.x, posY: m1.position.y, mass: m1.properties.mass } : null,
            m2: m2 ? { posX: m2.position.x, posY: m2.position.y, mass: m2.properties.mass } : null,
        };
    }, [instruments]);

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
            simInputs.meterIds.forEach(({ id, type }: { id: string, type: string }) => {
                let newReading: number | string = 0;
                if (type === 'ammeter') {
                    newReading = (result.isValid && result.isClosed) ? (result.current * 1000).toFixed(2) : 0;
                } else if (type === 'voltmeter') {
                    newReading = (result.isValid && result.isClosed) ? result.voltage.toFixed(2) : 0;
                }
                const key = `${id}-reading`;
                if (lastReadingsRef.current[key] !== Number(newReading)) {
                    lastReadingsRef.current[key] = Number(newReading);
                    updateInstrumentProperties(id, { reading: newReading });
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
    }, [simInputs, connections, instruments, updateInstrumentProperties, setSimulationResults, experimentId]);

    const isCurrentFlowing = simulationResults.isValid && simulationResults.isClosed;

    return (
        <div
            ref={workspaceRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onMouseMove={handleMouseMove}
            onPointerUp={handleWorkspacePointerUp}
            onClick={handleWorkspaceClick}
            className={`w-full h-full relative cursor-crosshair overflow-hidden transition-colors duration-300 ${isDragOver ? 'bg-blue-500/5' : ''}`}
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
                dragOffsets={dragOffsets}
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
                    onTerminalPointerDown={handleTerminalPointerDown}
                    onTerminalPointerUp={handleTerminalPointerUp}
                    onTerminalHover={handleTerminalHover}
                    onInstrumentDoubleClick={handleInstrumentDoubleClick}
                    showWirePanel={wirePanelInstrumentId === inst.id}
                    onWirePanelClose={handleWirePanelClose}
                    onWireConnect={handleWireConnect}
                    onWireDisconnect={handleWireDisconnect}
                    updateProperties={updateInstrumentProperties}
                    onDrag={handleDrag}
                    onDragEndLive={handleDragEndLive}
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
                    {experimentId === 'newton-second-law' ? 'Attaching rope...' : `Connecting ${isConnecting.type} terminal...`}
                </div>
            )}
        </div>
    );
};
