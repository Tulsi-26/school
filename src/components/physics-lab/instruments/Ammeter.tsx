"use client";

import React from 'react';
import { Meter } from './Meter';

interface AmmeterProps {
    reading: number;
    scale?: number;
    unit?: string;
    isHovered?: boolean;
}

export const Ammeter: React.FC<AmmeterProps> = ({ reading, scale = 100, unit = "mA", isHovered }) => {
    return (
        <Meter
            type="ammeter"
            reading={reading}
            scale={scale}
            unit={unit === 'mA' ? "Milliamperes" : "Amperes"}
            label={unit}
            isHovered={isHovered}
        />
    );
};
