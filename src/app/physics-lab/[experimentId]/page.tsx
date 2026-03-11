"use client";

import React, { use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PhysicsLabProvider, usePhysicsLab } from '@/context/PhysicsLabContext';
import { LabShell } from '@/components/physics-lab/LabShell';

interface PageProps {
    params: Promise<{ experimentId: string }>;
}

function LabContent({ experimentId }: { experimentId: string }) {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const { loadExperiment } = usePhysicsLab();

    useEffect(() => {
        if (sessionId) {
            loadExperiment(sessionId).catch(() => {
                // Failed to load session - user will start fresh
            });
        }
    }, [sessionId, loadExperiment]);

    return (
        <div className="fixed inset-0 overflow-hidden bg-black selection:bg-blue-500/30">
            <LabShell experimentId={experimentId} />
        </div>
    );
}

export default function PhysicsLabPage({ params }: PageProps) {
    const { experimentId } = use(params);

    return (
        <PhysicsLabProvider>
            <LabContent experimentId={experimentId} />
        </PhysicsLabProvider>
    );
}
