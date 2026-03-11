"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Unplug, Cable, ChevronRight, CircleDot } from '@/lib/icons';
import { Instrument, Connection } from '@/context/PhysicsLabContext';

interface ConnectedTerminalInfo {
    connectionId: string;
    instrumentName: string;
    instrumentType: string;
    terminalType: 'positive' | 'negative' | 'ground' | 'input' | 'output';
    terminalId: string;
}

interface WireConnectPanelProps {
    instrument: Instrument;
    allInstruments: Instrument[];
    connections: Connection[];
    onConnect: (fromTerminalId: string, toTerminalId: string) => void;
    onDisconnect: (connectionId: string) => void;
    onClose: () => void;
}

export const WireConnectPanel: React.FC<WireConnectPanelProps> = ({
    instrument,
    allInstruments,
    connections,
    onConnect,
    onDisconnect,
    onClose,
}) => {
    const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Build connection info for each terminal of this instrument
    const terminalInfo = useMemo(() => {
        return instrument.terminals.map((terminal) => {
            // Find connections for this terminal
            const termConns = connections.filter(
                (c) => c.from === terminal.id || c.to === terminal.id
            );
            // For each connection, find the other instrument
            const connectedTo = termConns.map((conn) => {
                const otherTerminalId = conn.from === terminal.id ? conn.to : conn.from;
                for (const inst of allInstruments) {
                    const otherTerminal = inst.terminals.find((t) => t.id === otherTerminalId);
                    if (otherTerminal) {
                        return {
                            connectionId: conn.id,
                            instrumentName: inst.name,
                            instrumentType: inst.type,
                            terminalType: otherTerminal.type,
                            terminalId: otherTerminal.id,
                        };
                    }
                }
                return null;
            }).filter((x): x is ConnectedTerminalInfo => x !== null);

            return {
                ...terminal,
                isConnected: connectedTo.length > 0,
                connectedTo: connectedTo as ConnectedTerminalInfo[],
            };
        });
    }, [instrument.terminals, connections, allInstruments]);

    // Get available target terminals (from other instruments, not already connected to this terminal)
    const availableTargets = useMemo(() => {
        if (!selectedTerminal) return [];

        // Get terminal IDs already connected to the selected terminal
        const selectedConns = connections.filter(
            (c) => c.from === selectedTerminal || c.to === selectedTerminal
        );
        const alreadyConnectedIds = new Set(
            selectedConns.map((c) => (c.from === selectedTerminal ? c.to : c.from))
        );

        const targets: {
            instrumentId: string;
            instrumentName: string;
            instrumentType: string;
            terminalId: string;
            terminalType: string;
        }[] = [];

        for (const inst of allInstruments) {
            if (inst.id === instrument.id) continue;
            for (const t of inst.terminals) {
                if (!alreadyConnectedIds.has(t.id)) {
                    targets.push({
                        instrumentId: inst.id,
                        instrumentName: inst.name,
                        instrumentType: inst.type,
                        terminalId: t.id,
                        terminalType: t.type,
                    });
                }
            }
        }
        return targets;
    }, [selectedTerminal, connections, allInstruments, instrument.id]);

    const terminalLabel = (type: string) => {
        switch (type) {
            case 'positive': return '+';
            case 'negative': return '−';
            case 'input': return 'In';
            case 'output': return 'Out';
            default: return type;
        }
    };

    const terminalColor = (type: string) => {
        switch (type) {
            case 'positive': return 'text-red-400 bg-red-500/20 border-red-500/40';
            case 'negative': return 'text-slate-300 bg-slate-600/30 border-slate-500/40';
            case 'input': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
            case 'output': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
            default: return 'text-slate-400 bg-slate-600/20 border-slate-500/40';
        }
    };

    return (
        <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute z-[200] w-72 bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-xl overflow-hidden"
            style={{ left: '100%', top: 0, marginLeft: 12 }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/40">
                <div className="flex items-center gap-2">
                    <Cable className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-slate-200 tracking-tight">
                        Wire Connect
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Instrument name */}
            <div className="px-4 py-2 border-b border-slate-800/50">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    {instrument.name}
                </span>
            </div>

            {/* Terminals List */}
            <div className="p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-1 mb-2">
                    Terminals
                </div>
                {terminalInfo.map((t) => (
                    <div key={t.id} className="space-y-1">
                        <button
                            onClick={() => setSelectedTerminal(selectedTerminal === t.id ? null : t.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left ${
                                selectedTerminal === t.id
                                    ? 'bg-blue-500/15 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                                    : 'bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/70 hover:border-slate-600/50'
                            }`}
                        >
                            {/* Terminal badge */}
                            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border ${terminalColor(t.type)}`}>
                                {terminalLabel(t.type)}
                            </span>

                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-300 capitalize">
                                    {t.type} Terminal
                                </div>
                                <div className="text-[10px] text-slate-500">
                                    {t.isConnected
                                        ? `Connected to ${t.connectedTo.map((c) => c.instrumentName).join(', ')}`
                                        : 'Available'
                                    }
                                </div>
                            </div>

                            {/* Status indicator */}
                            {t.isConnected ? (
                                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                                <CircleDot className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}

                            <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform shrink-0 ${
                                selectedTerminal === t.id ? 'rotate-90 text-blue-400' : ''
                            }`} />
                        </button>

                        {/* Existing connections for this terminal */}
                        <AnimatePresence>
                            {selectedTerminal === t.id && t.connectedTo.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                >
                                    <div className="ml-4 pl-3 border-l-2 border-slate-700/50 space-y-1 py-1">
                                        {t.connectedTo.map((conn) => (
                                            <div
                                                key={conn.connectionId}
                                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/20"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold border ${terminalColor(conn.terminalType)}`}>
                                                        {terminalLabel(conn.terminalType)}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        {conn.instrumentName}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDisconnect(conn.connectionId);
                                                    }}
                                                    className="p-1 rounded-md hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors"
                                                    title="Disconnect wire"
                                                >
                                                    <Unplug className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Available targets for connection */}
                        <AnimatePresence>
                            {selectedTerminal === t.id && availableTargets.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                >
                                    <div className="ml-4 pl-3 border-l-2 border-blue-500/30 space-y-1 py-1">
                                        <div className="text-[9px] uppercase tracking-wider text-blue-400/70 font-semibold px-2 py-0.5">
                                            Connect to…
                                        </div>
                                        {availableTargets.map((target) => (
                                            <button
                                                key={`${target.instrumentId}-${target.terminalId}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onConnect(t.id, target.terminalId);
                                                    setSelectedTerminal(null);
                                                }}
                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/15 border border-transparent hover:border-blue-500/30 transition-all group text-left"
                                            >
                                                <span className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold border ${terminalColor(target.terminalType)}`}>
                                                    {terminalLabel(target.terminalType)}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[11px] text-slate-400 group-hover:text-slate-200 font-medium truncate block">
                                                        {target.instrumentName}
                                                    </span>
                                                    <span className="text-[9px] text-slate-600 capitalize">
                                                        {target.terminalType}
                                                    </span>
                                                </div>
                                                <Cable className="w-3 h-3 text-slate-700 group-hover:text-blue-400 transition-colors shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* No available targets message */}
                        <AnimatePresence>
                            {selectedTerminal === t.id && availableTargets.length === 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                >
                                    <div className="ml-4 pl-3 border-l-2 border-slate-700/30 py-2">
                                        <span className="text-[10px] text-slate-600 italic px-2">
                                            {allInstruments.length <= 1
                                                ? 'Add more instruments to connect'
                                                : 'All terminals connected'
                                            }
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-slate-800/50 bg-slate-800/20">
                <p className="text-[9px] text-slate-600 text-center leading-relaxed">
                    Select a terminal, then pick a target to create a wire
                </p>
            </div>
        </motion.div>
    );
};
