"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Vector {
    origin: { x: number; y: number };
    direction: { x: number; y: number };
    label: string;
    color: string;
}

interface VectorCanvasProps {
    vectors: Vector[];
}

export const VectorCanvas: React.FC<VectorCanvasProps> = ({ vectors }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
            </defs>

            {vectors.map((vec, i) => {
                const endX = vec.origin.x + vec.direction.x;
                const endY = vec.origin.y + vec.direction.y;

                return (
                    <g key={i} className={vec.color}>
                        <motion.line
                            x1={vec.origin.x}
                            y1={vec.origin.y}
                            x2={endX}
                            y2={endY}
                            stroke="currentColor"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                        />
                        <text
                            x={endX + 5}
                            y={endY + 5}
                            className="text-[10px] font-bold fill-current"
                        >
                            {vec.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};
