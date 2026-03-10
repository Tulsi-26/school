"use client";

import React from 'react';
import { Connection, Instrument } from '@/context/PhysicsLabContext';

interface WireCanvasProps {
    connections: Connection[];
    activeConnection: { from: string, to: { x: number, y: number } } | null;
    instruments: Instrument[];
    showCurrentFlow?: boolean;
}

export const WireCanvas: React.FC<WireCanvasProps> = ({ connections, activeConnection, instruments, showCurrentFlow }) => {
    // Helper to find terminal position
    const getTerminalPos = (terminalId: string) => {
        for (const inst of instruments) {
            const terminal = inst.terminals.find(t => t.id === terminalId);
            if (terminal) {
                return {
                    x: inst.position.x + terminal.position.x,
                    y: inst.position.y + terminal.position.y
                };
            }
        }
        return null;
    };

    const drawWire = (start: { x: number, y: number }, end: { x: number, y: number }, color: string, key: string, animated?: boolean) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const midX = start.x + dx / 2;
        const midY = start.y + dy / 2 + Math.abs(dx) / 10 + 20; // Slight curve downwards

        return (
            <g key={key}>
                <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-300"
                />
                {/* Animated current flow particles */}
                {animated && showCurrentFlow && (
                    <path
                        d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
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
    };

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Existing connections */}
            {connections.map((conn, idx) => {
                const start = getTerminalPos(conn.from);
                const end = getTerminalPos(conn.to);
                if (start && end) {
                    return drawWire(start, end, conn.color, `wire-${conn.id}-${idx}`, true);
                }
                return null;
            })}

            {/* Active drafting wire */}
            {activeConnection && (() => {
                const start = getTerminalPos(activeConnection.from);
                if (start) {
                    return drawWire(start, activeConnection.to, '#3b82f6', 'drafting');
                }
                return null;
            })()}
        </svg>
    );
};
