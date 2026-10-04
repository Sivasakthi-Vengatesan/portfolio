"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Project } from '@/data/portfolio';
import { caseStudies } from '@/data/caseStudies';
import { ArchitectureFlow } from '@/components/ArchitectureFlow';
import { CodeSnippetCard } from '@/components/CodeSnippetCard';
import { motion } from 'framer-motion';

// --- SUB-SIMULATORS FOR PORTFOLIO PROJECTS ---

// 1. AVE (Asynchronous Verification Engine) Simulator
const AveSimulator: React.FC = () => {
    const [selectedAction, setSelectedAction] = useState<'fund_transfer' | 'drop_table' | 'read_audit'>('fund_transfer');
    const [solveState, setSolveState] = useState<'idle' | 'evaluating' | 'resolved'>('idle');
    const [auditLog, setAuditLog] = useState<string[]>([
        "SYSTEM_BOOT: Z3 SMT Solver Core v4.12.2 Initialized.",
        "GATEWAY: Interceptor listening on /v1/agent/tool_call.",
        "POLICY_REGISTRY: Loaded 14 formal constraint rules."
    ]);

    const toolCalls = {
        fund_transfer: {
            title: "Agent Tool Call: TransferFunds",
            tool: "wire_transfer_v2",
            params: { amount: 45000, recipient: "0x89A...F01", currency: "USD", max_authorized: 10000 },
            z3Formula: "And(amount <= max_authorized, recipient_verified == True, daily_total + amount <= 50000)",
            verdict: "BLOCK",
            reason: "VIOLATION: amount (45000) > max_authorized (10000). Constraint unsatisfiable (UNSAT)."
        },
        drop_table: {
            title: "Agent Tool Call: DropTable",
            tool: "db_admin_execute",
            params: { action: "DROP", target: "public.users_audit_prod", role: "ai_agent_tier_1" },
            z3Formula: "And(role == 'superadmin', environment != 'production', table_type != 'audit')",
            verdict: "BLOCK",
            reason: "CRITICAL VIOLATION: Agent role tier 1 denied DROP permission on production audit tables."
        },
        read_audit: {
            title: "Agent Tool Call: SafeAuditRead",
            tool: "query_telemetry",
            params: { filter: "timestamp >= now() - 1h", limit: 100, tenant_id: "cit_internal" },
            z3Formula: "And(limit <= 1000, tenant_id == session_tenant, read_only == True)",
            verdict: "ALLOW",
            reason: "SATISFIABLE (SAT): All formal safety constraints verified across parameters."
        }
    };

    const handleRunVerification = () => {
        setSolveState('evaluating');
        setTimeout(() => {
            const current = toolCalls[selectedAction];
            setSolveState('resolved');
            setAuditLog(prev => [
                `[${new Date().toLocaleTimeString()}] INGESTION: Tool '${current.tool}' intercepted.`,
                `[${new Date().toLocaleTimeString()}] Z3 SOLVER: Checking satisfiability against formal AST rules...`,
                `[${new Date().toLocaleTimeString()}] RESULT: ${current.verdict} - ${current.reason}`,
                ...prev.slice(0, 5)
            ]);
        }, 600);
    };

    const current = toolCalls[selectedAction];

    return (
        <div className="space-y-4 text-retro-charcoal font-pixel">
            <div className="bg-black text-green-400 p-2 text-[10px] uppercase tracking-wider flex justify-between items-center">
                <span>AVE_CORE://Z3_SMT_GUARD_v2.4</span>
                <span className="animate-pulse">● INTERCEPTOR ACTIVE</span>
            </div>

            {/* Selector */}
            <div className="grid grid-cols-3 gap-2">
                {(['fund_transfer', 'drop_table', 'read_audit'] as const).map(action => (
                    <button
                        key={action}
                        onClick={() => { setSelectedAction(action); setSolveState('idle'); }}
                        className={`p-2 border-2 text-[10px] uppercase transition-all ${
                            selectedAction === action ? 'bg-retro-yellow border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-zinc-300 text-zinc-600'
                        }`}
                    >
                        {action === 'fund_transfer' ? 'Wire $45k' : action === 'drop_table' ? 'Drop Table' : 'Safe Read'}
                    </button>
                ))}
            </div>

            {/* Main Terminal View */}
            <div className="border-4 border-black bg-zinc-950 p-3 text-white font-mono text-[11px] space-y-3">
                <div className="text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
                    <span>{current.title}</span>
                    <span className="text-retro-yellow">TOOL: {current.tool}</span>
                </div>

                <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-pixel mb-1">Incoming Arguments (Extracted via Pydantic):</div>
                    <pre className="bg-zinc-900 p-2 rounded border border-zinc-800 text-green-300 text-[10px] overflow-x-auto">
                        {JSON.stringify(current.params, null, 2)}
                    </pre>
                </div>

                <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-pixel mb-1">Z3 SMT Verification Formula:</div>
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-800 text-yellow-300 text-[10px] font-mono break-all">
                        {current.z3Formula}
                    </div>
                </div>

                {solveState === 'evaluating' && (
                    <div className="bg-zinc-900 p-3 border-2 border-retro-yellow text-center space-y-1">
                        <div className="text-retro-yellow text-xs animate-pulse font-pixel">EVALUATING SMT FIRST-ORDER LOGIC CONSTRAINTS...</div>
                        <div className="text-[10px] text-zinc-400">Solving AST satisfiability on Z3Py engine</div>
                    </div>
                )}

                {solveState === 'resolved' && (
                    <div className={`p-3 border-2 font-pixel text-xs ${
                        current.verdict === 'ALLOW' 
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' 
                            : 'bg-red-950/80 border-red-500 text-red-300'
                    }`}>
                        <div className="flex items-center gap-2 text-sm font-bold tracking-wider mb-1">
                            <span>VERDICT: {current.verdict}</span>
                            <span>{current.verdict === 'ALLOW' ? '✔' : '✖'}</span>
                        </div>
                        <div className="font-mono text-[10px] leading-relaxed text-zinc-200">
                            {current.reason}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {solveState !== 'evaluating' && (
                <button
                    onClick={handleRunVerification}
                    className="w-full py-2.5 bg-retro-orange border-2 border-black text-xs uppercase font-pixel font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    Run Z3 Formal Verification
                </button>
            )}

            {/* Live Audit Trail */}
            <div className="bg-zinc-900 p-2 border-2 border-black font-mono text-[9px] text-zinc-400 space-y-1">
                <div className="font-pixel text-[10px] text-zinc-300 uppercase border-b border-zinc-800 pb-0.5 mb-1">Immutable Security Audit Trail</div>
                {auditLog.map((log, idx) => (
                    <div key={idx} className="truncate">{log}</div>
                ))}
            </div>
        </div>
    );
};

// 2. OXYS Simulator
const OxysSimulator: React.FC = () => {
    const [streamStatus, setStreamStatus] = useState<'normal' | 'schema_drift' | 'null_storm' | 'duplicate_replay'>('normal');
    const [eventsProcessed, setEventsProcessed] = useState(14820);
    const [quarantineCount, setQuarantineCount] = useState(0);

    const handleInjectAnomaly = (type: 'normal' | 'schema_drift' | 'null_storm' | 'duplicate_replay') => {
        setStreamStatus(type);
        if (type !== 'normal') {
            setQuarantineCount(prev => prev + 1);
        }
    };

    return (
        <div className="space-y-4 text-retro-charcoal font-pixel">
            <div className="bg-black text-amber-400 p-2 text-[10px] uppercase tracking-wider flex justify-between items-center">
                <span>OXYS_STREAM://USGS_EARTHQUAKE_PIPELINE</span>
                <span className="animate-pulse">● SPARK STREAMING ENGINE</span>
            </div>

            {/* Anomaly Trigger Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    { id: 'normal', label: 'Healthy Stream' },
                    { id: 'schema_drift', label: 'Schema Drift' },
                    { id: 'null_storm', label: 'Null Storm' },
                    { id: 'duplicate_replay', label: 'Replay Storm' }
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleInjectAnomaly(item.id as any)}
                        className={`p-2 border-2 text-[10px] uppercase transition-all ${
                            streamStatus === item.id 
                                ? 'bg-retro-yellow border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-white border-zinc-300 text-zinc-600'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Pipeline Visualizer */}
            <div className="border-4 border-black bg-zinc-950 p-3 text-white font-mono text-[11px] space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-pixel">
                    <div className="bg-zinc-900 p-2 border border-zinc-800">
                        <div className="text-zinc-400">INGESTION</div>
                        <div className="text-retro-green font-bold">1,240 msg/s</div>
                    </div>
                    <div className="bg-zinc-900 p-2 border border-zinc-800">
                        <div className="text-zinc-400">P99 LATENCY</div>
                        <div className="text-retro-yellow font-bold">18.4 ms</div>
                    </div>
                    <div className="bg-zinc-900 p-2 border border-zinc-800">
                        <div className="text-zinc-400">QUARANTINED</div>
                        <div className="text-retro-orange font-bold">{quarantineCount} EVENTS</div>
                    </div>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <div className="text-[10px] text-zinc-400 uppercase font-pixel mb-1.5 flex justify-between">
                        <span>Live Spark Micro-Batch Inspection</span>
                        <span className="text-retro-yellow">SOURCE: USGS GeoJSON Feed</span>
                    </div>

                    {streamStatus === 'normal' && (
                        <div className="text-emerald-400 text-[10px] space-y-1">
                            <div>✔ Schema Match: [id: string, mag: float, place: string, time: timestamp, coordinates: array[float]]</div>
                            <div>✔ Null Rate: 0.002% (Below 0.05% threshold)</div>
                            <div>✔ Deduplication Bloom Filter: 0 duplicate hashes detected</div>
                            <div className="text-zinc-400 text-[9px] mt-1">STATUS: Batch passed to Postgres warehouse + MinIO cold lake.</div>
                        </div>
                    )}

                    {streamStatus === 'schema_drift' && (
                        <div className="text-retro-orange text-[10px] space-y-1">
                            <div className="font-bold">⚠ CRITICAL SCHEMA DRIFT DETECTED IN INGESTION BATCH #9412</div>
                            <div>Anomaly: Field `magnitude_type` altered from `VARCHAR(8)` to `INTEGER` by upstream API.</div>
                            <div className="bg-red-950/60 p-1.5 border border-red-500/50 text-red-200 mt-1 font-pixel">
                                ACTION: Schema enforcement triggered → Record redirected to Quarantine DLQ.
                            </div>
                        </div>
                    )}

                    {streamStatus === 'null_storm' && (
                        <div className="text-red-400 text-[10px] space-y-1">
                            <div className="font-bold">⚠ NULL-RATE ANOMALY SPIKE: 68.4% of coordinates missing</div>
                            <div>Threshold Exceeded: Max allowed null threshold (5%) violated in USGS region feed.</div>
                            <div className="bg-red-950/60 p-1.5 border border-red-500/50 text-red-200 mt-1 font-pixel">
                                ACTION: Circuit breaker opened. Alerts emitted via FastAPI telemetry webhook.
                            </div>
                        </div>
                    )}

                    {streamStatus === 'duplicate_replay' && (
                        <div className="text-yellow-400 text-[10px] space-y-1">
                            <div className="font-bold">⚠ REPLAY STORM IDENTIFIED: 4,200 repeated event hashes</div>
                            <div>Fingerprint Match: Exact duplicate window detected on event IDs [ci4098234..ci4098310].</div>
                            <div className="bg-yellow-950/60 p-1.5 border border-yellow-500/50 text-yellow-200 mt-1 font-pixel">
                                ACTION: Sliding window deduplicator dropped duplicate payloads prior to database commit.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 3. Crime Record Intelligence Platform Simulator
const CrimeRecordSimulator: React.FC = () => {
    const [selectedQuery, setSelectedQuery] = useState<number>(0);
    const [searchState, setSearchState] = useState<'idle' | 'searching' | 'done'>('idle');

    const sampleQueries = [
        {
            query: "Retrieve financial fraud FIR records involving shell company wire transfers in Sector 4",
            matches: [
                { id: "FIR-2025-9041", score: "0.082 (Cosine Sim: 91.8%)", crime: "Wire Fraud / Section 420", location: "Sector 4 Financial District", status: "Charge Sheet Filed" },
                { id: "FIR-2024-8120", score: "0.141 (Cosine Sim: 85.9%)", crime: "Money Laundering / Benami Accounts", location: "North Zone", status: "Under Trial" }
            ],
            ragSummary: "Found 2 strongly correlated FIR dossiers. Both instances involve unauthorized offshore wire transactions via forged corporate GSTIN certificates. Records dispatched to investigating officer dashboard."
        },
        {
            query: "Cross-reference suspect alias 'Kaviarasu' with armed robbery firearm seizure logs",
            matches: [
                { id: "LOG-2025-3312", score: "0.061 (Cosine Sim: 93.9%)", crime: "Arms Act Violation & Burglary", location: "Central Metro Rail Yard", status: "Arrested / In Custody" },
                { id: "INC-2023-7741", score: "0.198 (Cosine Sim: 80.2%)", crime: "Conspiracy & Extortion", location: "Industrial Estate", status: "Warrant Issued" }
            ],
            ragSummary: "Suspect alias matched with high confidence against 2 firearm recovery manifests. Serial numbers correlate with previously confiscated unlicensed 9mm firearms in Central Yard."
        }
    ];

    const handleSearch = () => {
        setSearchState('searching');
        setTimeout(() => setSearchState('done'), 500);
    };

    const current = sampleQueries[selectedQuery];

    return (
        <div className="space-y-4 text-retro-charcoal font-pixel">
            <div className="bg-black text-cyan-400 p-2 text-[10px] uppercase tracking-wider flex justify-between items-center">
                <span>CRIME_INTEL://PGVECTOR_SEMANTIC_SEARCH</span>
                <span className="animate-pulse">● LANGCHAIN4J RAG PIPELINE</span>
            </div>

            {/* Query Selector */}
            <div className="space-y-2">
                {sampleQueries.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setSelectedQuery(idx); setSearchState('idle'); }}
                        className={`w-full text-left p-2 border-2 text-[10px] uppercase transition-all ${
                            selectedQuery === idx 
                                ? 'bg-retro-yellow border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-white border-zinc-300 text-zinc-600'
                        }`}
                    >
                        Query #{idx + 1}: {q.query.substring(0, 65)}...
                    </button>
                ))}
            </div>

            {/* Execution Frame */}
            <div className="border-4 border-black bg-zinc-950 p-3 text-white font-mono text-[11px] space-y-3">
                <div className="text-zinc-400 text-[10px]">
                    <span className="text-retro-yellow font-pixel">Active Natural Language Query:</span>
                    <div className="mt-1 text-white bg-zinc-900 p-2 border border-zinc-800 italic">
                        "{current.query}"
                    </div>
                </div>

                {searchState === 'searching' && (
                    <div className="bg-zinc-900 p-3 border-2 border-cyan-400 text-center space-y-1">
                        <div className="text-cyan-400 text-xs animate-pulse font-pixel">GENERATING EMBEDDINGS & QUERYING PGVECTOR INDEX...</div>
                        <div className="text-[10px] text-zinc-400">Calculating cosine distance on 1536-dimensional FIR embeddings</div>
                    </div>
                )}

                {searchState === 'done' && (
                    <div className="space-y-2">
                        <div className="text-[10px] text-zinc-400 font-pixel uppercase">Top Vector Matches (pgvector index lookup):</div>
                        {current.matches.map((m, i) => (
                            <div key={i} className="bg-zinc-900 p-2 rounded border border-zinc-800 text-[10px] space-y-0.5">
                                <div className="flex justify-between font-bold text-cyan-300">
                                    <span>{m.id} // {m.crime}</span>
                                    <span className="text-retro-yellow font-pixel">{m.score}</span>
                                </div>
                                <div className="text-zinc-400">Location: {m.location} | Status: {m.status}</div>
                            </div>
                        ))}

                        <div className="mt-2 bg-zinc-900/90 border border-emerald-500/50 p-2.5 rounded text-emerald-200 text-[10px]">
                            <div className="font-pixel text-[10px] text-emerald-400 uppercase mb-1">RAG Contextual Synthesis (Spring Boot + LangChain4j):</div>
                            <div className="leading-relaxed font-mono">{current.ragSummary}</div>
                        </div>
                    </div>
                )}
            </div>

            {searchState !== 'searching' && (
                <button
                    onClick={handleSearch}
                    className="w-full py-2.5 bg-retro-green border-2 border-black text-xs uppercase font-pixel font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    Execute Semantic Search &amp; RAG
                </button>
            )}
        </div>
    );
};

// 4. ICHNOS Simulator
const IchnosSimulator: React.FC = () => {
    const [selectedTrace, setSelectedTrace] = useState<number>(0);

    const traces = [
        {
            traceId: "tr-9481a0e",
            route: "POST /v1/transactions/verify",
            duration: "58ms",
            status: "200 OK",
            spans: [
                { name: "FastAPI Ingress Router", time: "4ms", width: "10%", color: "bg-emerald-500" },
                { name: "JWT IAM Security Validation", time: "8ms", width: "16%", color: "bg-cyan-500" },
                { name: "PostgreSQL Connection Pool", time: "14ms", width: "26%", color: "bg-blue-500" },
                { name: "Z3 Formal Constraint Solver", time: "26ms", width: "42%", color: "bg-purple-500" },
                { name: "Kafka Audit Event Emit", time: "6ms", width: "12%", color: "bg-amber-500" }
            ]
        },
        {
            traceId: "tr-8820c4b",
            route: "GET /v1/telemetry/earthquake/stream",
            duration: "142ms",
            status: "200 OK",
            spans: [
                { name: "FastAPI Stream Endpoint", time: "5ms", width: "8%", color: "bg-emerald-500" },
                { name: "Kafka Consumer Poll Window", time: "38ms", width: "30%", color: "bg-amber-500" },
                { name: "Spark Batch Delta Compute", time: "85ms", width: "55%", color: "bg-red-500" },
                { name: "WebSocket Push to Client", time: "14ms", width: "12%", color: "bg-cyan-500" }
            ]
        }
    ];

    const current = traces[selectedTrace];

    return (
        <div className="space-y-4 text-retro-charcoal font-pixel">
            <div className="bg-black text-purple-400 p-2 text-[10px] uppercase tracking-wider flex justify-between items-center">
                <span>ICHNOS_TRACE://DISTRIBUTED_TELEMETRY</span>
                <span className="animate-pulse">● TRACE INSPECTOR</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {traces.map((t, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedTrace(idx)}
                        className={`p-2 border-2 text-[10px] uppercase transition-all ${
                            selectedTrace === idx 
                                ? 'bg-retro-yellow border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                : 'bg-white border-zinc-300 text-zinc-600'
                        }`}
                    >
                        Trace #{t.traceId} ({t.duration})
                    </button>
                ))}
            </div>

            <div className="border-4 border-black bg-zinc-950 p-3 text-white font-mono text-[11px] space-y-3">
                <div className="flex justify-between border-b border-zinc-800 pb-1 text-[10px]">
                    <span className="text-zinc-300">ENDPOINT: {current.route}</span>
                    <span className="text-emerald-400 font-pixel">{current.status} · {current.duration}</span>
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] text-zinc-400 font-pixel uppercase">Execution Span Waterfall:</div>
                    {current.spans.map((s, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-300">
                                <span>{s.name}</span>
                                <span className="font-pixel text-zinc-400">{s.time}</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-2.5 rounded overflow-hidden border border-zinc-800">
                                <div className={`h-full ${s.color} transition-all duration-300`} style={{ width: s.width }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 5. DataRace Simulator
const DataRaceSimulator: React.FC = () => {
    const [isolationLevel, setIsolationLevel] = useState<'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE'>('READ_COMMITTED');
    const [step, setStep] = useState(0);

    const steps = [
        { label: "Step 0: Initial State", t1: "IDLE", t2: "IDLE", balance: 100, desc: "Shared account balance = $100." },
        { label: "Step 1: Tx1 Reads Balance", t1: "READ balance ($100)", t2: "IDLE", balance: 100, desc: "Tx1 prepares to withdraw $40." },
        { label: "Step 2: Tx2 Interleaves & Reads", t1: "PAUSED", t2: "READ balance ($100)", balance: 100, desc: "Tx2 prepares to withdraw $80 simultaneously." },
        { label: "Step 3: Tx1 Writes Balance ($60)", t1: "WRITE balance = $60 & COMMIT", t2: "PAUSED", balance: 60, desc: "Tx1 subtracts $40 and commits." },
        { label: "Step 4: Tx2 Overwrites ($20)", t1: "DONE", t2: "WRITE balance = $20 & COMMIT", balance: 20, desc: "Tx2 overwrites based on stale $100 read! ($100 - $80 = $20). Lost Update anomaly!" }
    ];

    const handleNextStep = () => {
        setStep(prev => (prev + 1) % steps.length);
    };

    const currentStep = steps[step];

    return (
        <div className="space-y-4 text-retro-charcoal font-pixel">
            <div className="bg-black text-rose-400 p-2 text-[10px] uppercase tracking-wider flex justify-between items-center">
                <span>DATARACE://CONCURRENCY_INTERLEAVING_ENGINE</span>
                <span className="animate-pulse">● ISOLATION TESTER</span>
            </div>

            <div className="border-4 border-black bg-zinc-950 p-3 text-white font-mono text-[11px] space-y-3">
                <div className="flex justify-between border-b border-zinc-800 pb-1 text-[10px]">
                    <span className="text-zinc-400">{currentStep.label}</span>
                    <span className="text-retro-yellow font-pixel">ACCOUNT_BALANCE: ${currentStep.balance}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                        <div className="text-zinc-400 font-pixel mb-1">TRANSACTION #1</div>
                        <div className="text-cyan-300">{currentStep.t1}</div>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                        <div className="text-zinc-400 font-pixel mb-1">TRANSACTION #2</div>
                        <div className="text-purple-300">{currentStep.t2}</div>
                    </div>
                </div>

                <div className="bg-zinc-900 p-2 rounded border border-zinc-800 text-[10px] text-zinc-300">
                    <span className="font-pixel text-zinc-400 uppercase block mb-0.5">Scheduler Analysis:</span>
                    {currentStep.desc}
                </div>

                {step === 4 && (
                    <div className="bg-red-950/80 border-2 border-red-500 p-2 text-red-200 text-[10px] font-pixel">
                        ⚠ RACE CONDITION DETECTED: Total money withdrawn = $120 from initial $100 balance. Final state $20 violates conservation invariants!
                    </div>
                )}
            </div>

            <button
                onClick={handleNextStep}
                className="w-full py-2.5 bg-retro-orange border-2 border-black text-xs uppercase font-pixel font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
                {step === steps.length - 1 ? 'Reset Concurrency Trace' : 'Step Interleaving Clock →'}
            </button>
        </div>
    );
};

// --- END OF SUB-SIMULATORS ---

interface ProjectModalProps {
    project: Project | null;
    currentIndex: number | null;
    totalProjects: number;
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
    project,
    currentIndex,
    totalProjects,
    onClose,
    onNavigate,
}) => {
    const [showSimulator, setShowSimulator] = useState(false);

    // Check if the current project title has a simulator
    const hasSimulator = project ? (
        project.title.includes("OXYS") ||
        project.title.includes("ICHNOS") ||
        project.title.includes("DataRace")
    ) : false;

    // Reset simulator tab when project changes
    useEffect(() => {
        setShowSimulator(false);
    }, [project]);

    const renderSimulator = (title: string) => {
        if (title.includes("OXYS")) {
            return <OxysSimulator />;
        } else if (title.includes("ICHNOS")) {
            return <IchnosSimulator />;
        } else if (title.includes("DataRace")) {
            return <DataRaceSimulator />;
        } else {
            return <div className="text-center py-8 font-pixel text-zinc-500">Simulator not found.</div>;
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (!project) return;
            if (e.key === 'ArrowRight') onNavigate('next');
            if (e.key === 'ArrowLeft') onNavigate('prev');
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, onNavigate, project]);

    if (!project) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-retro-charcoal/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="bg-retro-white border-4 border-black p-0 max-w-3xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative flex flex-col max-h-[92vh] overflow-hidden animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.96, y: 14, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.98, y: 8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div className="bg-retro-charcoal text-white p-2 flex justify-between items-center gap-2 border-b-4 border-black">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-sm">deployed_code</span>
                        <span className="font-pixel text-[10px] sm:text-sm tracking-wider truncate">CARTRIDGE_SLOT_A://{project.title.toUpperCase()}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-red-500 p-1 rounded-none transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm block">close</span>
                    </button>
                </div>

                <div className="p-3 sm:p-6 overflow-y-auto font-body">
                    <div className="border-4 border-black bg-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="grid lg:grid-cols-12">
                            <div className="lg:col-span-5 p-4 border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-retro-cream">
                                <div className="font-pixel text-xs uppercase tracking-wider bg-black text-white inline-block px-2 py-1 mb-3">
                                    Project Cartridge
                                </div>
                                <motion.div
                                    className="h-3 bg-zinc-800 border-2 border-black mb-3 overflow-hidden"
                                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                                    transition={{ duration: 0.28, delay: 0.1, ease: "easeOut" }}
                                >
                                    <div className="h-full bg-retro-yellow w-1/2" />
                                </motion.div>

                                <motion.div
                                    className="border-4 border-black bg-white mb-4 relative overflow-hidden"
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.08 }}
                                >
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full aspect-video object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full aspect-video flex items-center justify-center bg-retro-charcoal/5">
                                            <span className="material-symbols-outlined text-6xl text-retro-charcoal/30">{project.icon}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.12)_50%,transparent_100%)] animate-scanline" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="font-pixel text-[11px] uppercase tracking-wider text-zinc-700 space-y-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25, delay: 0.15 }}
                                >
                                    <div>Slot: A1</div>
                                    <div>File: {project.title.toUpperCase().replace(/\s+/g, "_")}.CRT</div>
                                    <div>Build: Stable</div>
                                </motion.div>
                            </div>

                            <motion.div
                                className="lg:col-span-7 p-3 sm:p-4 bg-retro-white flex flex-col justify-between"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 }}
                            >
                                {showSimulator ? (
                                    <div className="flex-1 flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
                                                <h2 className="font-display text-xl sm:text-2xl uppercase tracking-tight leading-none text-retro-charcoal">
                                                    {project.title} Simulator
                                                </h2>
                                                <button
                                                    onClick={() => setShowSimulator(false)}
                                                    className="px-2 py-1 bg-zinc-100 border-2 border-black font-pixel text-[10px] uppercase hover:bg-zinc-200 transition-colors"
                                                >
                                                    Back to Details
                                                </button>
                                            </div>
                                            {renderSimulator(project.title)}
                                        </div>

                                        <div className="pt-4 flex flex-wrap gap-3 mt-auto border-t-2 border-dashed border-black/15">
                                            <motion.button
                                                onClick={() => onNavigate('prev')}
                                                className="px-3 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1"
                                                whileHover={{ y: -1 }}
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                                Prev
                                            </motion.button>

                                            <motion.button
                                                onClick={() => onNavigate('next')}
                                                className="px-3 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1"
                                                whileHover={{ y: -1 }}
                                            >
                                                Next
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </motion.button>

                                            <motion.a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-retro-green border-2 border-black font-pixel text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                                                whileHover={{ y: -1 }}
                                            >
                                                <span className="material-symbols-outlined text-sm">code</span>
                                                View Source
                                            </motion.a>

                                            <button
                                                onClick={onClose}
                                                className="px-4 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors"
                                            >
                                                Eject
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-between h-full">
                                        <div>
                                            <motion.h2
                                                className="font-display text-2xl sm:text-3xl uppercase tracking-tight leading-none mb-3 text-retro-charcoal"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.12 }}
                                            >
                                                {project.title}
                                            </motion.h2>
                                            <motion.p
                                                className="text-zinc-700 leading-relaxed mb-5"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.17 }}
                                            >
                                                {project.description}
                                            </motion.p>

                                            <div className="mb-5">
                                                <h3 className="font-pixel text-sm uppercase mb-2 border-b-2 border-black inline-block">Specs</h3>
                                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                                    {project.specs.map((spec, index) => (
                                                        <motion.div
                                                            key={`${spec.label}-${spec.value}`}
                                                            className="border-2 border-black bg-zinc-100 px-3 py-2"
                                                            initial={{ opacity: 0, y: 8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                                                            whileHover={{ y: -2, x: -2 }}
                                                        >
                                                            <div className="font-pixel uppercase text-zinc-500 tracking-wider">{spec.label}</div>
                                                            <div className="font-body text-sm text-zinc-800">{spec.value}</div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <h3 className="font-pixel text-sm uppercase mb-2 border-b-2 border-black inline-block">Stack</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack?.map((tech, index) => (
                                                        <motion.span
                                                            key={tech}
                                                            className="px-2 py-1 bg-retro-yellow border-2 border-black font-pixel text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.18, delay: 0.22 + index * 0.04 }}
                                                        >
                                                            {tech}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>

                                            {caseStudies[project.slug] && (
                                                <div className="mb-5 space-y-4 border-t-2 border-dashed border-black/15 pt-4">
                                                    {caseStudies[project.slug].architectureFlow && (
                                                        <ArchitectureFlow steps={caseStudies[project.slug].architectureFlow} />
                                                    )}
                                                    {caseStudies[project.slug].codeSnippet && (
                                                        <CodeSnippetCard snippet={caseStudies[project.slug].codeSnippet} />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 flex flex-wrap gap-3 mt-auto border-t-2 border-dashed border-black/15">
                                            <motion.button
                                                onClick={() => onNavigate('prev')}
                                                className="px-3 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.28 }}
                                                whileHover={{ y: -1 }}
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                                Prev
                                            </motion.button>

                                            <motion.button
                                                onClick={() => onNavigate('next')}
                                                className="px-3 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors flex items-center gap-1"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.29 }}
                                                whileHover={{ y: -1 }}
                                            >
                                                Next
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </motion.button>

                                            {project.demo && (
                                                <motion.a
                                                    href={project.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-retro-yellow border-2 border-black font-pixel text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black"
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.3 }}
                                                    whileHover={{ y: -1 }}
                                                >
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                    Launch Demo
                                                </motion.a>
                                            )}

                                            {hasSimulator && (
                                                <motion.button
                                                    onClick={() => setShowSimulator(true)}
                                                    className="px-4 py-2 bg-retro-orange border-2 border-black font-pixel text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.3 }}
                                                    whileHover={{ y: -1 }}
                                                >
                                                    <span className="material-symbols-outlined text-sm">sports_esports</span>
                                                    Launch Simulator
                                                </motion.button>
                                            )}

                                            <motion.a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-retro-green border-2 border-black font-pixel text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.35 }}
                                                whileHover={{ y: -1 }}
                                            >
                                                <span className="material-symbols-outlined text-sm">code</span>
                                                View Source
                                            </motion.a>

                                            <motion.button
                                                onClick={onClose}
                                                className="px-4 py-2 bg-zinc-100 border-2 border-black font-pixel text-xs uppercase hover:bg-zinc-200 transition-colors"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: 0.4 }}
                                                whileHover={{ y: -1 }}
                                            >
                                                Eject
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                                <motion.div
                                    className="mt-4 font-pixel text-[11px] uppercase text-zinc-500 tracking-wider"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2, delay: 0.45 }}
                                >
                                    Cartridge {currentIndex !== null ? currentIndex + 1 : 1} / {totalProjects}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectModal;
