"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Point {
    x: number;
    y: number;
}

interface Ray {
    origin: Point;
    angle: number;
    color?: string;
    length?: number;
}

interface RayCanvasProps {
    rays: Ray[];
    width?: number;
    height?: number;
}

export const RayCanvas: React.FC<RayCanvasProps> = ({ rays }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <defs>
                <filter id="rayGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {rays.map((ray, i) => {
                const length = ray.length || 800;
                const endX = ray.origin.x + length * Math.cos(ray.angle);
                const endY = ray.origin.y + length * Math.sin(ray.angle);

                return (
                    <g key={i} filter="url(#rayGlow)">
                        <motion.line
                            x1={ray.origin.x}
                            y1={ray.origin.y}
                            x2={endX}
                            y2={endY}
                            stroke={ray.color || "url(#rayGradient)"}
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                        {/* Light Source Glow */}
                        <circle
                            cx={ray.origin.x}
                            cy={ray.origin.y}
                            r="3"
                            fill="#60a5fa"
                            className="animate-pulse"
                        />
                    </g>
                );
            })}
        </svg>
    );
};
