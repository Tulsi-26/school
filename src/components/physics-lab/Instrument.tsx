"use client";

import React, { useMemo, useState } from 'react';
import { Instrument as InstrumentType, usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';
import { motion } from 'framer-motion';

interface InstrumentProps {
    instrument: InstrumentType;
    onPositionChange: (x: number, y: number) => void;
    onTerminalClick: (id: string, type: string) => void;
    updateProperties: (id: string, props: any) => void;
}

export const Instrument: React.FC<InstrumentProps> = ({
    instrument,
    onPositionChange,
    onTerminalClick,
    updateProperties
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { connections, instruments, removeInstrument } = usePhysicsLab();

    const connectedState = useMemo(() => {
        const ownTerminalIds = new Set(instrument.terminals.map((t) => t.id));

        const ownConnections = connections.filter(
            (conn) => ownTerminalIds.has(conn.from) || ownTerminalIds.has(conn.to)
        );

        const connectedTerminalIds = new Set<string>();
        ownConnections.forEach((conn) => {
            if (ownTerminalIds.has(conn.from)) {
                connectedTerminalIds.add(conn.from);
            }
            if (ownTerminalIds.has(conn.to)) {
                connectedTerminalIds.add(conn.to);
            }
        });

        const getInstrumentByTerminal = (terminalId: string) => {
            for (const inst of instruments) {
                if (inst.terminals.some((t) => t.id === terminalId)) {
                    return inst;
                }
            }
            return null;
        };

        const connectedNames = new Set<string>();
        ownConnections.forEach((conn) => {
            const otherTerminal = ownTerminalIds.has(conn.from) ? conn.to : conn.from;
            const otherInst = getInstrumentByTerminal(otherTerminal);
            if (otherInst && otherInst.id !== instrument.id) {
                connectedNames.add(otherInst.name);
            }
        });

        return {
            connectedTerminalIds,
            connectedNames: Array.from(connectedNames),
            count: ownConnections.length,
        };
    }, [connections, instruments, instrument.id, instrument.terminals]);

    const handleDrag = (e: any, info: any) => {
        onPositionChange(instrument.position.x + info.offset.x, instrument.position.y + info.offset.y);
    };

    const handleInstrumentClick = () => {
        if (instrument.type === 'switch') {
            updateProperties(instrument.id, { closed: !instrument.properties.closed });
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent standard browser right-click menu
        removeInstrument(instrument.id);
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDrag}
            initial={{ x: instrument.position.x, y: instrument.position.y }}
            animate={{ x: instrument.position.x, y: instrument.position.y }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onContextMenu={handleContextMenu}
            className="absolute cursor-grab active:cursor-grabbing z-10"
            style={{ touchAction: 'none' } as any}
        >
            <div className="relative group" onClick={handleInstrumentClick}>
                {/* Instrument Visual */}
                <InstrumentVisuals
                    type={instrument.type}
                    properties={instrument.properties}
                    isHovered={isHovered}
                    onPropertyChange={(props: any) => updateProperties(instrument.id, props)}
                />

                {/* Terminals */}
                {instrument.terminals.map((t) => (
                    <button
                        key={t.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onTerminalClick(t.id, t.type);
                        }}
                        className={`absolute w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 z-20 ${t.type === 'positive'
                            ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                            : 'bg-black border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                            }`}
                        style={{
                            left: t.position.x,
                            top: t.position.y,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: connectedState.connectedTerminalIds.has(t.id)
                                ? '0 0 0 2px rgba(59,130,246,0.85), 0 0 16px rgba(59,130,246,0.65)'
                                : undefined
                        }}
                        title={`${t.type} terminal`}
                    />
                ))}

                {/* Label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tighter text-slate-400">
                    {instrument.name}
                </div>
            </div>
        </motion.div>
    );
};
