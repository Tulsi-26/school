"use client";

import React, { use } from 'react';
import { PhysicsLabProvider } from '@/context/PhysicsLabContext';
import { LabShell } from '@/components/physics-lab/LabShell';

interface PageProps {
    params: Promise<{ experimentId: string }>;
}

export default function PhysicsLabPage({ params }: PageProps) {
    const { experimentId } = use(params);

    return (
        <PhysicsLabProvider>
            <div className="fixed inset-0 overflow-hidden bg-black selection:bg-blue-500/30">
                <LabShell experimentId={experimentId} />
            </div>
        </PhysicsLabProvider>
    );
}
