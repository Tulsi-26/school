"use client";

import React from 'react';
import { Connection, Instrument } from '@/context/PhysicsLabContext';

interface WireCanvasProps {
    connections: Connection[];
    activeConnection: { from: string, to: { x: number, y: number } } | null;
    instruments: Instrument[];
    showCurrentFlow?: boolean;
    dragOffsets?: Record<string, { x: number, y: number }>;
}

export const WireCanvas: React.FC<WireCanvasProps> = ({ connections, activeConnection, instruments, showCurrentFlow, dragOffsets = {} }) => {
    // Create a lookup map for terminals to speed up getTerminalPos
    const terminalMap = React.useMemo(() => {
        const map = new Map<string, { instrument: Instrument; terminal: any }>();
        instruments.forEach(inst => {
            inst.terminals.forEach(t => {
                map.set(t.id, { instrument: inst, terminal: t });
            });
        });
        return map;
    }, [instruments]);

    // Optimized helper to find terminal position
    const getTerminalPos = React.useCallback((terminalId: string) => {
        const entry = terminalMap.get(terminalId);
        if (!entry) return null;

        const { instrument: inst, terminal } = entry;
        const offset = dragOffsets[inst.id] || { x: 0, y: 0 };
        return {
            x: inst.position.x + terminal.position.x + offset.x,
            y: inst.position.y + terminal.position.y + offset.y
        };
    }, [terminalMap, dragOffsets]);

    const WirePath = React.memo(({ start, end, color, animated, showCurrentFlow }: { 
        start: { x: number, y: number }, 
        end: { x: number, y: number }, 
        color: string, 
        animated?: boolean,
        showCurrentFlow?: boolean
    }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const midX = start.x + dx / 2;
        const midY = start.y + dy / 2 + Math.abs(dx) / 10 + 20;

        const pathData = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

        return (
            <g>
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                />
                {animated && showCurrentFlow && (
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="4 8"
                        style={{ animation: 'current-flow 0.6s linear infinite' }}
                        opacity="0.8"
                    />
                )}
            </g>
        );
    });

    const RopePath = React.memo(({ start, end, color }: {
        start: { x: number, y: number },
        end: { x: number, y: number },
        color: string
    }) => {
        const dx = end.x - start.x;
        const dist = Math.sqrt(dx * dx + (end.y - start.y) ** 2);
        const sag = Math.min(dist * 0.15, 40);
        const midX = (start.x + end.x) / 2;
        const midY = Math.max(start.y, end.y) + sag;

        const pathData = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

        return (
            <g>
                <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY + 2} ${end.x} ${end.y}`}
                    fill="none"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                />
            </g>
        );
    });

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {connections.map((conn, idx) => {
                const start = getTerminalPos(conn.from);
                const end = getTerminalPos(conn.to);
                if (start && end) {
                    if (conn.connectionType === 'rope') {
                        return <RopePath key={`rope-${conn.id}-${idx}`} start={start} end={end} color={conn.color} />;
                    }
                    return <WirePath key={`wire-${conn.id}-${idx}`} start={start} end={end} color={conn.color} animated showCurrentFlow={showCurrentFlow} />;
                }
                return null;
            })}

            {activeConnection && (() => {
                const start = getTerminalPos(activeConnection.from);
                if (start) {
                    return <WirePath start={start} end={activeConnection.to} color="#3b82f6" />;
                }
                return null;
            })()}
        </svg>
    );
};
