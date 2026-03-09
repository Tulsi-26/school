"use client";

import React, { useState } from 'react';
import {
    BookOpen,
    Info,
    ListOrdered,
    Table,
    LineChart,
    ShieldCheck,
    TrendingUp,
    Download,
    Trash2
} from 'lucide-react';
import { usePhysicsLab } from '@/context/PhysicsLabContext';

export const ExperimentGuide: React.FC<{ experimentId: string }> = ({ experimentId }) => {
    const [activeTab, setActiveTab] = useState<'theory' | 'procedure' | 'observation' | 'graph'>('theory');
    const { simulationResults } = usePhysicsLab();

    const tabs = [
        { id: 'theory', icon: BookOpen, label: 'Theory' },
        { id: 'procedure', icon: ListOrdered, label: 'Procedure' },
        { id: 'observation', icon: Table, label: 'Observation' },
        { id: 'graph', icon: LineChart, label: 'Graph' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-slate-800 p-1 bg-slate-900/30">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${activeTab === tab.id
                            ? 'text-blue-400'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'theory' && (
                    experimentId === 'ohm-law' ? <OhmTheory /> :
                        experimentId === 'wheatstone-bridge' ? <WheatstoneTheory /> :
                            experimentId === 'reflection-refraction' ? <OpticsTheory /> :
                                <MechanicsTheory />
                )}
                {activeTab === 'procedure' && (
                    experimentId === 'ohm-law' ? <OhmProcedure /> :
                        experimentId === 'wheatstone-bridge' ? <WheatstoneProcedure /> :
                            experimentId === 'reflection-refraction' ? <OpticsProcedure /> :
                                <MechanicsProcedure />
                )}
                {activeTab === 'observation' && <Observation experimentId={experimentId} />}
                {activeTab === 'graph' && (
                    experimentId === 'ohm-law' ? <Graph experimentId={experimentId} /> :
                        <div className="text-slate-500 text-xs italic">Graphing is specific to Ohm's Law in this version.</div>
                )}
            </div>
        </div>
    );
};

// Ohm's Law Components
const OhmTheory = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
        <section className="space-y-2">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Aim of Experiment
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                To verify Ohm’s law by measuring the current flowing through a resistor for various potential differences across it and to plot a graph between V and I.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Basic Concept
            </h3>
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-3">
                <p className="text-slate-300 text-sm italic">
                    "At a constant temperature, the current (I) flowing through a conductor is directly proportional to the potential difference (V) across its ends."
                </p>
                <div className="bg-slate-900 p-3 rounded text-center border border-slate-800">
                    <code className="text-blue-400 font-bold text-lg">V = I × R</code>
                </div>
            </div>
        </section>
    </div>
);

const OhmProcedure = () => (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
        <ul className="space-y-3">
            {[
                "Drag the required instruments to the workspace.",
                "Connect the Battery positive terminal to the Ammeter positive.",
                "Connect the Ammeter negative to the Resistor terminal 1.",
                "Connect the Resistor terminal 2 to the Rheostat.",
                "Complete the circuit via the Switch back to the Battery negative.",
                "Connect the Voltmeter in parallel with the Resistor.",
                "Close the switch and adjust the rheostat to get different readings."
            ].map((step, i) => (
                <li key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        {i + 1}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
                </li>
            ))}
        </ul>
    </div>
);

const WheatstoneTheory = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
        <section className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Aim of Experiment
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                To determine the unknown resistance (S) using a Wheatstone Bridge by achieving a null deflection in the galvanometer.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Bridge Principle
            </h3>
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-3">
                <p className="text-slate-300 text-sm italic">
                    "When the bridge is balanced, no current flows through the galvanometer. This happens when the ratio of adjacent resistances is equal."
                </p>
                <div className="bg-slate-900 p-3 rounded text-center border border-slate-800">
                    <code className="text-purple-400 font-bold text-lg">P / Q = R / S</code>
                </div>
            </div>
        </section>
    </div>
);

const WheatstoneProcedure = () => (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
        <ul className="space-y-3">
            {[
                "Place resistors P, Q, R, and S in a bridge configuration.",
                "Connect the Galvanometer across the horizontal opposite junctions.",
                "Connect the Battery and Switch across the vertical opposite junctions.",
                "Close the switch and observe the Galvanometer deflection.",
                "Adjust variable resistor R until the Galvanometer reading is 0 (Null Point).",
                "Calculate S = (Q * R) / P."
            ].map((step, i) => (
                <li key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        {i + 1}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
                </li>
            ))}
        </ul>
    </div>
);

const OpticsTheory = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
        <section className="space-y-2">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Reflection & Refraction
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                Study the behavior of light rays as they interact with different optical media and surfaces.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Lens Formula
            </h3>
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-3">
                <p className="text-slate-300 text-sm italic">
                    "The relationship between object distance (u), image distance (v), and focal length (f) of a lens."
                </p>
                <div className="bg-slate-900 p-3 rounded text-center border border-slate-800">
                    <code className="text-blue-400 font-bold text-lg">1/f = 1/v - 1/u</code>
                </div>
            </div>
        </section>
    </div>
);

const OpticsProcedure = () => (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
        <ul className="space-y-3">
            {[
                "Place a Light Source (Object) on the left side of the workspace.",
                "Place a Convex or Concave lens at the center.",
                "Adjust the object position and observe the ray paths.",
                "Measure the image distance (v) for various object distances (u).",
                "Verify the lens formula using the measured values."
            ].map((step, i) => (
                <li key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        {i + 1}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
                </li>
            ))}
        </ul>
    </div>
);

const MechanicsTheory = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
        <section className="space-y-2">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                Newton's Second Law
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                Study the relationship between an object's mass, its acceleration, and the applied force.
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                Force Equation
            </h3>
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-3">
                <p className="text-slate-300 text-sm italic">
                    "The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force and inversely proportional to the mass of the object."
                </p>
                <div className="bg-slate-900 p-3 rounded text-center border border-slate-800">
                    <code className="text-red-400 font-bold text-lg">F = m × a</code>
                </div>
            </div>
        </section>
    </div>
);

const MechanicsProcedure = () => (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
        <ul className="space-y-3">
            {[
                "Setup a pulley at the edge or center of the workspace.",
                "Connect two blocks (M1 and M2) to the pulley system.",
                "Vary the masses of the blocks.",
                "Observe the acceleration and tension in the system.",
                "Analyze the results using Newton's laws of motion."
            ].map((step, i) => (
                <li key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                        {i + 1}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
                </li>
            ))}
        </ul>
    </div>
);

const Observation = ({ experimentId }: { experimentId: string }) => {
    const { observations, recordObservation, clearObservations } = usePhysicsLab();

    const handleExport = () => {
        if (observations.length === 0) return;

        let headers = [];
        let rows = [];

        if (experimentId === 'ohm-law') {
            headers = ["Serial No.", "Voltage (V)", "Current (A)", "Resistance (Ohm)"];
            rows = observations.map((o, i) => [i + 1, o.v, o.i, o.r]);
        } else {
            headers = ["Serial No.", "P/Q Ratio", "R (Ohm)", "Deflection"];
            rows = observations.map((o, i) => [i + 1, (o.p / o.q), o.r, o.reading]);
        }

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `experiment_${experimentId}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Auto-Recording System</div>
                <div className="flex gap-2">
                    <button
                        onClick={clearObservations}
                        className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Clear all readings"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={recordObservation}
                        className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 transition-colors uppercase tracking-widest"
                    >
                        Record Reading
                    </button>
                </div>
            </div>

            <div className="overflow-hidden border border-slate-800 rounded-xl">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-800 text-slate-400 font-bold">
                        {experimentId === 'ohm-law' ? (
                            <tr>
                                <th className="p-3 border-b border-slate-700">Serial No.</th>
                                <th className="p-3 border-b border-slate-700">Voltage (V)</th>
                                <th className="p-3 border-b border-slate-700">Current (A)</th>
                                <th className="p-3 border-b border-slate-700">R = V/I (Ω)</th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="p-3 border-b border-slate-700">Serial No.</th>
                                <th className="p-3 border-b border-slate-700">P/Q Ratio</th>
                                <th className="p-3 border-b border-slate-700">R (Ω)</th>
                                <th className="p-3 border-b border-slate-700">Deflection</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {observations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500 italic">No readings recorded yet. Connect the circuit and click Record.</td>
                            </tr>
                        )}
                        {observations.map((obs: any, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-3 text-slate-500">{i + 1}</td>
                                {experimentId === 'ohm-law' ? (
                                    <>
                                        <td className="p-3 text-blue-300">{obs.v?.toFixed(2)}</td>
                                        <td className="p-3 text-emerald-300">{obs.i?.toFixed(4)}</td>
                                        <td className="p-3 font-mono text-slate-400">{obs.r?.toFixed(2)}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 text-purple-300">{(obs.p / obs.q).toFixed(2)}</td>
                                        <td className="p-3 text-blue-300">{obs.r?.toFixed(0)}</td>
                                        <td className="p-3 text-yellow-300">{obs.reading > 0 ? 'Right' : obs.reading < 0 ? 'Left' : 'Null'}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleExport}
                disabled={observations.length === 0}
                className="w-full p-3 bg-blue-500/5 text-slate-400 border border-slate-800 rounded-xl hover:bg-blue-500/10 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download size={14} />
                Export Data (CSV)
            </button>
        </div>
    );
};

const Graph = ({ experimentId }: { experimentId: string }) => {
    const { observations } = usePhysicsLab();

    if (experimentId !== 'ohm-law') {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-4 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-2">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-400">Graph Plot Not Applicable</h4>
                <p className="text-[10px] text-slate-500 max-w-[200px]">
                    The Wheatstone Bridge experiment focuses on achieving a Null Point (0 deflection) rather than linear characteristic plotting.
                </p>
            </div>
        );
    }

    // Scale factors for a simple SVG plot
    const maxV = Math.max(...observations.map((o: any) => o.v || 0), 10);
    const maxI = Math.max(...observations.map((o: any) => o.i || 0), 0.1);

    return (
        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 animate-in zoom-in-95 duration-500">
            <div className="w-full h-full border-l-2 border-b-2 border-slate-600 relative">
                {/* Plotting axis labels */}
                <div className="absolute -left-10 top-1/2 -rotate-90 text-[8px] uppercase tracking-widest text-slate-500 font-bold">Voltage (V)</div>
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-slate-500 font-bold">Current (I)</div>

                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                {/* Data Points */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {observations.length > 1 && (
                        <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeOpacity="0.5"
                            points={observations
                                .filter((o: any) => o.v !== undefined && o.i !== undefined)
                                .sort((a: any, b: any) => a.i - b.i)
                                .map((o: any) => `${(o.i / maxI) * 100},${100 - (o.v / maxV) * 100}`)
                                .join(' ')}
                        />
                    )}
                    {observations.map((obs: any, i) => (
                        <circle
                            key={i}
                            cx={(obs.i / maxI) * 100}
                            cy={100 - (obs.v / maxV) * 100}
                            r="1.5"
                            fill="#3b82f6"
                            className="drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
                        />
                    ))}
                </svg>
            </div>
            <p className="text-[9px] text-slate-500 italic text-center">
                {observations.length < 2
                    ? "Record at least 2 points to see the V-I characteristic line."
                    : "Linear relationship indicates verification of Ohm's Law."
                }
            </p>
        </div>
    );
};
