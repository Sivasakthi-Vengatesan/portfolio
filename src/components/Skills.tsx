"use client";
import React, { useState, useEffect } from 'react';
import { portfolioData } from '@/data/portfolio';
import { motion, AnimatePresence } from 'framer-motion';

const skillDetails: Record<string, string> = {
    // Big Data
    "Hadoop": "Architected distributed storage and processing jobs across cluster nodes with HDFS and MapReduce workflows.",
    "HDFS": "Engineered partitioned distributed file system storage, replica management, and fault-tolerant block allocations for large datasets.",
    "MapReduce": "Implemented distributed batch computing algorithms, custom mappers, reducers, and combiners for massive data aggregation.",
    "YARN": "Managed cluster resource negotiation, node allocations, and container scheduling for concurrent big data processing pipelines.",
    "Hive": "Developed structured data warehousing layers and HiveQL analytical batch queries over distributed HDFS data stores.",
    "HiveQL": "Structured SQL-like analytical query processing, partition schemes, and optimized bucketed joins on Apache Hive.",
    "Spark": "Engineered distributed in-memory compute workflows and scalable real-time streaming engines in OXYS.",
    "Spark SQL": "Executed high-performance distributed DataFrame aggregations, Catalyst optimizer plans, and windowed streaming queries.",
    "RDD": "Implemented resilient distributed dataset transformations (map, flatMap, reduceByKey, join) for fault-tolerant in-memory computations.",
    "Sqoop": "Transferred high-throughput bulk relational datasets between RDBMS databases (MySQL/PostgreSQL) and Hadoop HDFS/Hive.",
    "Airflow": "Authored and scheduled directed acyclic graphs (DAGs), dynamic task dependencies, and automated pipeline retry policies.",

    // Backend
    "Python": "Primary language for backend pipelines, Spark Structured Streaming (OXYS), and SMT formal verification guardrails (AVE).",
    "Java": "Engineered high-performance, strongly typed backend microservices in Java 17 for Crime Record Intelligence Platform.",
    "FastAPI": "Built asynchronous high-throughput event ingestion endpoints and verification microservices with sub-25ms response latencies.",
    "Spring Boot": "Architected enterprise backend architectures with Spring Boot 17, dependency injection, and JPA/Hibernate ORM.",
    "Node.js": "Developed asynchronous runtime engines, telemetry servers, and trace visualizer APIs in ICHNOS.",
    "Express": "Constructed lightweight REST middleware routing and span telemetry endpoints for web application layers.",
    "REST APIs": "Designed RESTful API architectures with strict contract schemas, pagination, rate limiting, and HTTP status handling.",
    "SQLAlchemy": "Configured asynchronous database session management, connection pooling, and ORM model mapping in PostgreSQL.",
    "Pydantic": "Implemented strict schema validation, type parsing, and data sanitation for incoming API tool call parameters.",

    // Databases
    "PostgreSQL": "Primary relational database engine. Designed schema indexes, constraint triggers, and integrated pgvector extensions.",
    "MySQL": "Administered relational schemas and isolated database transaction schedules during DataRace concurrency analysis.",
    "pgvector": "Configured vector embeddings storage and cosine distance similarity indexes (HNSW) for RAG semantic search.",

    // AI / Security
    "LangChain4j": "Integrated Java-native LangChain4j orchestration for conversational retrieval, vector search, and contextual RAG prompts.",
    "RAG": "Engineered Retrieval-Augmented Generation pipelines connecting semantic vector stores with LLM prompt context.",
    "LLMs": "Integrated large language models into structured workflows with deterministic guardrails and schema validation.",
    "Z3": "Integrated Microsoft Z3 SMT solver theorem proving for deterministic AI tool call validation in AVE.",
    "Z3Py": "Formulated formal verification mathematical constraints in Python to provably validate balance and state invariants.",

    // Cloud / Tools
    "AWS": "Architected cloud backend services, distributed storage, and analytics pipelines on AWS cloud infrastructure.",
    "Linux": "Extensive CLI experience with process management (ps, kill, nohup), cron jobs, shell automation, and Linux server administration.",
    "Bash": "Scripted automated deployment pipelines, cluster provisioning, environment initialization, and log stream parsing.",
    "Git": "Version control workflow across complex multi-branch repositories, PR reviews, and collaborative Git delivery.",
    "GitHub": "Managed CI/CD workflows, open source repositories, and project issues for distributed software delivery.",
    "Docker": "Containerized multi-tier backend services, Spark workers, Kafka brokers, and database instances with Docker Compose.",

    // Frontend
    "React": "Crafted responsive, retro-styled user interfaces, trace waterfalls in ICHNOS, and dynamic component widgets.",
    "Next.js": "Built modern server-rendered and static web applications with App Router, TypeScript, and optimized asset delivery.",
    "TypeScript": "Developed strongly typed frontend components, trace DAG visualizers, and robust interface definitions.",
    "JavaScript": "Engineered client-side UI animations, Web Audio synthesizers, and dynamic browser DOM interactions.",
    "Tailwind CSS": "Authored custom retro design tokens, bento grid layouts, pixel borders, and responsive styling."
};

const iconMap: Record<string, string> = {
    "Hadoop": "apachehadoop",
    "HDFS": "apachehadoop",
    "MapReduce": "apachehadoop",
    "YARN": "apachehadoop",
    "Hive": "apachehive",
    "HiveQL": "apachehive",
    "Spark": "apachespark",
    "Spark SQL": "apachespark",
    "RDD": "apachespark",
    "Sqoop": "apache",
    "Airflow": "apacheairflow",
    "Python": "python",
    "Java": "openjdk",
    "FastAPI": "fastapi",
    "Spring Boot": "springboot",
    "Node.js": "nodedotjs",
    "Express": "express",
    "REST APIs": "fastapi",
    "SQLAlchemy": "sqlalchemy",
    "Pydantic": "pydantic",
    "PostgreSQL": "postgresql",
    "MySQL": "mysql",
    "pgvector": "postgresql",
    "LangChain4j": "langchain",
    "RAG": "openai",
    "LLMs": "openai",
    "Z3": "python",
    "Z3Py": "python",
    "AWS": "amazonwebservices",
    "Linux": "linux",
    "Bash": "gnubash",
    "Git": "git",
    "GitHub": "github",
    "Docker": "docker",
    "React": "react",
    "Next.js": "nextdotjs",
    "TypeScript": "typescript",
    "JavaScript": "javascript",
    "Tailwind CSS": "tailwindcss"
};

const CUSTOM_ICONS: Record<string, (props: { className?: string; isWhite?: boolean }) => React.ReactNode> = {
    "Z3": ({ className = "w-3.5 h-3.5", isWhite = false }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={isWhite ? "#ffffff" : "#10B981"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 22 22 22" fill={isWhite ? "#ffffff" : "#10B981"} fillOpacity="0.3"/>
            <circle cx="12" cy="12" r="3" fill={isWhite ? "#ffffff" : "#10B981"} />
        </svg>
    ),
    "Z3Py": ({ className = "w-3.5 h-3.5", isWhite = false }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={isWhite ? "#ffffff" : "#3B82F6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
    ),
    "LangChain4j": ({ className = "w-3.5 h-3.5", isWhite = false }) => (
        <svg className={className} viewBox="0 0 24 24" fill={isWhite ? "#ffffff" : "#D97706"}>
            <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2z"/>
        </svg>
    )
};

const TOP_SKILLS = new Set([
    "Spark", "Hadoop", "Python", "Java", "FastAPI", "Spring Boot", "PostgreSQL", "pgvector", "Z3", "Z3Py", "Airflow", "Docker", "Next.js"
]);

const SkillIcon = ({ skill, isTop }: { skill: string; isTop: boolean }) => {
    const [failed, setFailed] = useState(false);
    
    if (CUSTOM_ICONS[skill]) {
        const CustomIcon = CUSTOM_ICONS[skill];
        return <CustomIcon className="w-3.5 h-3.5" isWhite={isTop} />;
    }

    const slug = iconMap[skill] || skill.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
    const color = isTop ? 'white' : '18181b';

    if (failed) {
        return <span className="material-symbols-outlined text-[13px] opacity-70">terminal</span>;
    }

    return (
        <img
            src={`https://cdn.simpleicons.org/${slug}/${color}`}
            alt={skill}
            className={`w-3.5 h-3.5 object-contain ${isTop ? 'opacity-100' : 'opacity-80'}`}
            onError={() => setFailed(true)}
        />
    );
};

const SkillModalIcon = ({ skill }: { skill: string }) => {
    const [failed, setFailed] = useState(false);
    
    if (CUSTOM_ICONS[skill]) {
        const CustomIcon = CUSTOM_ICONS[skill];
        return <CustomIcon className="w-full h-full object-contain" isWhite={true} />;
    }

    const slug = iconMap[skill] || skill.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");

    if (failed) {
        return <span className="material-symbols-outlined text-2xl text-white">terminal</span>;
    }

    return (
        <img
            src={`https://cdn.simpleicons.org/${slug}/white`}
            alt={skill}
            className="w-full h-full object-contain"
            onError={() => setFailed(true)}
        />
    );
};

{/* Spark Streaming & Distributed Engine Diagram */}
const SparkDiagram = () => (
    <div className="mt-4 border-2 border-black bg-zinc-900 rounded-xl p-3.5 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-[10px] text-zinc-400 font-sans font-bold ml-2">SPARK STRUCTURED STREAMING // TOPOLOGY</span>
            </div>
            <span className="text-[10px] bg-orange-600/30 text-orange-300 px-2 py-0.5 rounded border border-orange-500/40">CLUSTER_ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
            <div className="bg-zinc-800/80 p-2 rounded border border-zinc-700">
                <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Kafka Ingestion</div>
                <div className="space-y-1 text-[11px] text-zinc-300">
                    <div className="text-emerald-400">⚡ topic: usgs-earthquakes</div>
                    <div className="text-zinc-400">Partition [0..7]</div>
                    <div className="text-yellow-400 font-bold">Throughput: 12.4k msg/s</div>
                </div>
            </div>

            <div className="bg-zinc-800/80 p-2 rounded border border-zinc-700 sm:col-span-2">
                <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold mb-1 border-b border-zinc-700 pb-1">
                    <span>Spark Worker Cluster [4 Nodes]</span>
                    <span className="text-emerald-400">● Watermark: 30s</span>
                </div>
                <div className="text-[11px] text-zinc-300 space-y-0.5 leading-snug">
                    <div><span className="text-purple-400">val</span> stream = spark.readStream.format(<span className="text-emerald-300">"kafka"</span>)</div>
                    <div><span className="text-purple-400">val</span> validated = stream.groupBy(window(<span className="text-yellow-300">"10s"</span>))</div>
                    <div className="text-zinc-500">// Schema Drift & Null Rate Anomaly Check</div>
                    <div className="text-cyan-400">.writeStream.format("postgres").start()</div>
                </div>
            </div>
        </div>

        <div className="bg-black/60 p-2 rounded border border-zinc-800 text-[10px] text-emerald-400 flex items-center justify-between">
            <span className="truncate">Status: 0 Event Loss · Sliding Tumbling Windows · Latency &lt; 85ms</span>
            <span className="text-zinc-500 text-[9px] shrink-0 font-sans">OXYS STREAMING</span>
        </div>
    </div>
);

{/* Z3 SMT Formal Logic Proof Engine Diagram */}
const Z3Diagram = () => (
    <div className="mt-4 border-2 border-black bg-slate-900 rounded-xl p-3.5 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 text-black font-bold flex items-center justify-center text-[10px] rounded">Z3</div>
                <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase">AVE // SMT Formal Constraint Verifier</span>
            </div>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">PROVER SAT</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Invariant Definition</div>
                <div className="text-xs text-zinc-200 mt-1 space-y-0.5 font-mono">
                    <div>∀ tx ∈ Transfers:</div>
                    <div className="text-emerald-400">amount &gt; 0 ∧ amount ≤ balance</div>
                    <div className="text-blue-400">daily_sum + amount ≤ limit</div>
                </div>
            </div>
            <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Solver Execution</div>
                <div className="text-xs text-zinc-200 mt-1 space-y-0.5 font-mono">
                    <div className="text-yellow-400">solver.check() == sat</div>
                    <div className="text-emerald-400 font-bold">Decision: ALLOW (Safe)</div>
                    <div className="text-zinc-400 text-[10px]">Verification Time: 12ms</div>
                </div>
            </div>
        </div>

        <div className="bg-slate-800/90 p-2 rounded border border-slate-700 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Deterministic Zero False Execution Leaks Guaranteed</span>
            </div>
            <span className="text-slate-500 text-[9px]">AVE SMT Engine v1.0</span>
        </div>
    </div>
);

const Skills = () => {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        if (isModalOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isModalOpen]);

    return (
        <section className="max-w-7xl mx-auto mb-6 px-3 sm:px-4 md:px-0 h-full" id="skills">
            <div className="w-full h-full">
                <div className="bg-retro-green bento-card rounded-3xl p-6 sm:p-8 relative overflow-hidden retro-grain border-4 border-black/10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-3 mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-zinc-800/70 font-pixel text-xs uppercase tracking-widest mb-1">
                                    <span>02 // CAPABILITIES & STACK</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tighter text-retro-charcoal">
                                    Technical Stack
                                </h2>
                            </div>
                            <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <span className="material-symbols-outlined text-xl text-retro-charcoal">terminal</span>
                            </div>
                        </div>

                        {/* Grouped Skills by Category */}
                        <div className="space-y-4">
                            {portfolioData.skills.map((skillCategory, idx) => {
                                const items = skillCategory.items.split(', ');

                                return (
                                    <div key={idx} className="bg-white/80 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
                                        <h3 className="font-pixel text-xs uppercase tracking-wider text-zinc-600 mb-2.5 flex items-center justify-between">
                                            <span>{skillCategory.category}</span>
                                            <span className="text-[9px] bg-black/10 text-zinc-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                                {items.length}
                                            </span>
                                        </h3>

                                        <div className="flex flex-wrap gap-2">
                                            {items.map((skill, i) => {
                                                const isTop = TOP_SKILLS.has(skill);

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            setSelectedSkill(skill);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-body font-bold transition-all cursor-pointer ${
                                                            isTop
                                                                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] hover:bg-retro-yellow hover:text-black'
                                                                : 'bg-zinc-100 text-zinc-800 border-black/30 hover:border-black hover:bg-zinc-200'
                                                        }`}
                                                        title={`Inspect ${skill}`}
                                                    >
                                                        <SkillIcon skill={skill} isTop={isTop} />
                                                        <span>{skill}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-[10px] font-pixel text-retro-charcoal/70 uppercase">
                        <span>Click any skill to view project usage & representations</span>
                        <span>Categorized Modules</span>
                    </div>
                </div>
            </div>

            {/* Skill Inspector Modal */}
            <AnimatePresence>
                {isModalOpen && selectedSkill && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-charcoal/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className={`bg-retro-white border-4 border-black p-0 w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col overflow-hidden rounded-2xl max-h-[90vh] ${
                                selectedSkill === 'Spark' || selectedSkill === 'Z3' || selectedSkill === 'Z3Py' ? 'max-w-xl' : 'max-w-md'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.96, y: 14, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.98, y: 8, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* Header */}
                            <div className="bg-retro-charcoal text-white p-3 flex justify-between items-center gap-2 border-b-4 border-black shrink-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="material-symbols-outlined text-sm">terminal</span>
                                    <span className="font-pixel text-xs tracking-wider truncate uppercase">SKILL_INSPECTOR://{selectedSkill.toUpperCase().replace(/\s+/g, "_")}</span>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="hover:bg-red-500 p-1 transition-colors flex items-center justify-center cursor-pointer rounded-xs"
                                    aria-label="Close modal"
                                >
                                    <span className="material-symbols-outlined text-sm block">close</span>
                                </button>
                            </div>

                            {/* Body content */}
                            <div className="p-5 bg-retro-cream overflow-y-auto font-body">
                                <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-retro-charcoal border-2 border-black p-2 flex items-center justify-center shrink-0 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <SkillModalIcon skill={selectedSkill} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-display text-xl text-retro-charcoal leading-none tracking-tight uppercase truncate">
                                                {selectedSkill}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <p className="text-[9px] font-pixel text-zinc-500 tracking-wider uppercase">ACTIVE IN PRODUCTION</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-0.5 border-t border-dashed border-black/15 my-0.5" />

                                    <div className="text-zinc-700 font-body text-sm leading-relaxed text-left">
                                        {skillDetails[selectedSkill] || `${selectedSkill} is part of Sivasakthi's active software engineering toolchain across distributed data infrastructure, backend services, and verified architectures.`}
                                    </div>
                                </div>

                                {/* Custom Visual Representations */}
                                {(selectedSkill === 'Spark' || selectedSkill === 'Spark SQL' || selectedSkill === 'RDD') && <SparkDiagram />}
                                {(selectedSkill === 'Z3' || selectedSkill === 'Z3Py') && <Z3Diagram />}

                                <div className="mt-5 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => {
                                            const skillToFilter = selectedSkill;
                                            setIsModalOpen(false);
                                            window.dispatchEvent(new CustomEvent('filter-by-skill', { detail: { skill: skillToFilter } }));
                                            const el = document.getElementById('projects');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="px-4 py-2 bg-retro-orange text-black border-2 border-black font-pixel text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-400 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer rounded-lg font-bold flex items-center gap-1.5"
                                    >
                                        <span>View {selectedSkill} Projects</span>
                                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-retro-yellow border-2 border-black font-pixel text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-black cursor-pointer rounded-lg font-bold"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Skills;
