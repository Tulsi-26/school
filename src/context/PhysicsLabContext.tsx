"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface Terminal {
    id: string;
    parentId: string;
    type: 'positive' | 'negative' | 'ground' | 'input' | 'output';
    position: { x: number; y: number };
}

export interface Instrument {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    properties: Record<string, any>;
    terminals: Terminal[];
}

export interface Connection {
    id: string;
    from: string; // Terminal ID
    to: string;   // Terminal ID
    color: string;
    connectionType: 'wire' | 'rope'; // Wire for electrical, rope for mechanics
}

export interface SavedSession {
    id: string;
    experimentId: string;
    experimentTitle: string;
    instruments: Instrument[];
    connections: Connection[];
    observations: any[];
    checklist: string[];
    simulationResults: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

interface PhysicsLabContextType {
    instruments: Instrument[];
    connections: Connection[];
    addInstrument: (instrument: Omit<Instrument, 'id'>) => void;
    removeInstrument: (id: string) => void;
    updateInstrumentPosition: (id: string, x: number, y: number) => void;
    updateInstrumentProperties: (id: string, properties: Record<string, any>) => void;
    addConnection: (from: string, to: string, connectionType?: 'wire' | 'rope') => void;
    removeConnection: (id: string) => void;
    resetLab: () => void;
    simulationResults: Record<string, any>;
    setSimulationResults: (results: Record<string, any>) => void;
    observations: any[];
    recordObservation: () => void;
    clearObservations: () => void;
    activeExperimentId: string | null;
    setActiveExperimentId: (id: string | null) => void;
    masteredExperiments: string[];
    toggleMastery: (experimentId: string) => void;
    validationErrors: any[];
    validationSuggestions: string[];
    circuitIsValid: boolean;
    setValidationState: (errors: any[], suggestions: string[], isValid: boolean) => void;
    saveExperiment: () => Promise<void>;
    loadExperiment: (sessionId: string) => Promise<void>;
    isSaving: boolean;
    lastSavedAt: Date | null;
}

const PhysicsLabContext = createContext<PhysicsLabContextType | undefined>(undefined);

export const PhysicsLabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [simulationResults, setSimulationResults] = useState<Record<string, any>>({});
    const [observations, setObservations] = useState<any[]>([]);
    const [masteredExperiments, setMasteredExperiments] = useState<string[]>([]);
    const [activeExperimentId, setActiveExperimentId] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<any[]>([]);
    const [validationSuggestions, setValidationSuggestions] = useState<string[]>([]);
    const [circuitIsValid, setCircuitIsValid] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    const setValidationState = useCallback((errors: any[], suggestions: string[], isValid: boolean) => {
        setValidationErrors(errors);
        setValidationSuggestions(suggestions);
        setCircuitIsValid(isValid);
    }, []);

    // Persistence logic
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMastery = JSON.parse(localStorage.getItem('physics-lab-mastery') || '[]');
            setMasteredExperiments(savedMastery);
        }
    }, []);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && activeExperimentId) {
            const savedObs = JSON.parse(localStorage.getItem(`physics-obs-${activeExperimentId}`) || '[]');
            setObservations(savedObs);
        }
    }, [activeExperimentId]);

    const toggleMastery = useCallback((id: string) => {
        setMasteredExperiments(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('physics-lab-mastery', JSON.stringify(next));
            return next;
        });
    }, []);

    const addInstrument = useCallback((instrument: Omit<Instrument, 'id'>) => {
        const id = `${instrument.type}-${Date.now()}`;
        setInstruments((prev) => [...prev, { ...instrument, id }]);
    }, []);

    const removeInstrument = useCallback((id: string) => {
        setInstruments((prev) => prev.filter((inst) => inst.id !== id));
        setConnections((prev) => prev.filter((conn) =>
            !conn.from.startsWith(id) && !conn.to.startsWith(id)
        ));
    }, []);

    const updateInstrumentPosition = useCallback((id: string, x: number, y: number) => {
        setInstruments((prev) =>
            prev.map((inst) => (inst.id === id ? { ...inst, position: { x, y } } : inst))
        );
    }, []);

    const updateInstrumentProperties = useCallback((id: string, properties: Record<string, any>) => {
        setInstruments((prev) =>
            prev.map((inst) => (inst.id === id ? { ...inst, properties: { ...inst.properties, ...properties } } : inst))
        );
    }, []);

    const addConnection = useCallback((from: string, to: string, connectionType: 'wire' | 'rope' = 'wire') => {
        const id = `conn-${Date.now()}`;
        const color = connectionType === 'rope' ? '#a8896c' : '#3b82f6';
        setConnections((prev) => [...prev, { id, from, to, color, connectionType }]);
    }, []);

    const removeConnection = useCallback((id: string) => {
        setConnections((prev) => prev.filter((conn) => conn.id !== id));
    }, []);

    const recordObservation = useCallback(() => {
        if (simulationResults.isValid && simulationResults.isClosed && activeExperimentId) {
            setObservations((prev) => {
                const next = [...prev, { ...simulationResults, timestamp: Date.now() }];
                localStorage.setItem(`physics-obs-${activeExperimentId}`, JSON.stringify(next));
                return next;
            });
        }
    }, [simulationResults, activeExperimentId]);

    const clearObservations = useCallback(() => {
        if (activeExperimentId) {
            setObservations([]);
            localStorage.removeItem(`physics-obs-${activeExperimentId}`);
        }
    }, [activeExperimentId]);

    const saveExperiment = useCallback(async () => {
        if (!activeExperimentId) return;
        setIsSaving(true);
        try {
            const checklist: string[] = typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem(`checklist-${activeExperimentId}`) || '[]')
                : [];

            const res = await fetch('/api/experiment-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experimentId: activeExperimentId,
                    instruments,
                    connections,
                    observations,
                    checklist,
                    simulationResults,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save experiment session');
            }

            setLastSavedAt(new Date());
        } catch (error) {
            console.error('Failed to save experiment:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [activeExperimentId, instruments, connections, observations, simulationResults]);

    const loadExperiment = useCallback(async (sessionId: string) => {
        try {
            const res = await fetch(`/api/experiment-sessions/${encodeURIComponent(sessionId)}`);
            if (!res.ok) {
                throw new Error('Failed to load experiment session');
            }

            const data = await res.json();
            const saved = data.session;

            setInstruments(saved.instruments || []);
            setConnections(saved.connections || []);
            setObservations(saved.observations || []);
            setSimulationResults(saved.simulationResults || {});

            // Restore checklist to localStorage
            if (saved.checklist && saved.experimentId && typeof window !== 'undefined') {
                localStorage.setItem(
                    `checklist-${saved.experimentId}`,
                    JSON.stringify(saved.checklist)
                );
            }

            setLastSavedAt(new Date(saved.updatedAt));
        } catch (error) {
            console.error('Failed to load experiment:', error);
            throw error;
        }
    }, []);

    const resetLab = useCallback(() => {
        setInstruments([]);
        setConnections([]);
        setSimulationResults({});
        setObservations([]);
    }, []);

    const value = useMemo(() => ({
        instruments,
        connections,
        addInstrument,
        removeInstrument,
        updateInstrumentPosition,
        updateInstrumentProperties,
        addConnection,
        removeConnection,
        resetLab,
        simulationResults,
        setSimulationResults,
        observations,
        recordObservation,
        clearObservations,
        activeExperimentId,
        setActiveExperimentId,
        masteredExperiments,
        toggleMastery,
        validationErrors,
        validationSuggestions,
        circuitIsValid,
        setValidationState,
        saveExperiment,
        loadExperiment,
        isSaving,
        lastSavedAt
    }), [
        instruments,
        connections,
        addInstrument,
        removeInstrument,
        updateInstrumentPosition,
        updateInstrumentProperties,
        addConnection,
        removeConnection,
        resetLab,
        simulationResults,
        observations,
        recordObservation,
        clearObservations,
        activeExperimentId,
        masteredExperiments,
        toggleMastery,
        validationErrors,
        validationSuggestions,
        circuitIsValid,
        setValidationState,
        saveExperiment,
        loadExperiment,
        isSaving,
        lastSavedAt
    ]);

    return (
        <PhysicsLabContext.Provider value={value}>
            {children}
        </PhysicsLabContext.Provider>
    );
};

export const usePhysicsLab = () => {
    const context = useContext(PhysicsLabContext);
    if (context === undefined) {
        throw new Error('usePhysicsLab must be used within a PhysicsLabProvider');
    }
    return context;
};
