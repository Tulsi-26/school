"use client";

import React from 'react';
import { Meter } from './Meter';

interface AmmeterProps {
    reading: number;
    scale?: number;
    isHovered?: boolean;
}

export const Ammeter: React.FC<AmmeterProps> = ({ reading, scale = 100, isHovered }) => {
    return (
        <Meter
            type="ammeter"
            reading={reading}
            scale={scale}
            unit="Milliamperes"
            label="A"
            isHovered={isHovered}
        />
    );
};
