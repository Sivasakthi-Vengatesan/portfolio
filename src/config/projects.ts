export interface ProjectStage {
  step: string;
  name: string;
  title: string;
  description: string;
}

export interface DecisionItem {
  decision: string;
  chosen: string;
  chosenRationale: string;
  rejected: string;
  rejectedRationale: string;
}

export interface MetricItem {
  value: string;
  label: string;
  subtext: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  tagline: string;
  categories: string[];
  role: string;
  timeline: string;
  constraints: string;
  deployment: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  problem: string;
  stages: ProjectStage[];
  decisions: DecisionItem[];
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    explanation?: string;
  };
  tradeoffs: string;
  metrics: MetricItem[];
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

export const PROJECTS: Record<string, ProjectData> = {
  'oxys': {
    slug: 'oxys',
    title: 'OXYS (Real-Time Streaming Reliability)',
    tagline: 'Real-Data Streaming Reliability System with Schema Drift & Anomaly Detection',
    categories: ['Big Data', 'Backend'],
    role: 'Lead Big Data & Streaming Systems Engineer',
    timeline: '6 Weeks',
    constraints: 'Zero-latency ingestion and anomalous event isolation on high-velocity streaming GeoJSON feeds',
    deployment: 'Kafka + Apache Spark Structured Streaming + FastAPI + PostgreSQL + MinIO',
    techStack: ['Python', 'Kafka', 'Spark', 'FastAPI', 'PostgreSQL', 'MinIO', 'Docker'],
    githubUrl: 'https://github.com/Sivasakthi-Vengatesan/OXYS',
    liveUrl: 'https://github.com/Sivasakthi-Vengatesan/OXYS',
    problem: 'Distributed streaming pipelines face catastrophic downstream errors when upstream event producers introduce schema drift, null-rate spikes, cardinality explosions, or duplicate replay storms without quarantine controls.',
    stages: [
      { step: '01', name: 'INGEST', title: 'USGS Real-Time Feed Ingestion', description: 'Polls and streams real-time earthquake GeoJSON data from USGS Hazards Program feeds into high-throughput Apache Kafka event topics.' },
      { step: '02', name: 'DEDUP', title: 'Deduplication & State Watermarking', description: 'Employs memory-bounded Bloom filters and event-time watermarking to filter duplicate replay storms in real time.' },
      { step: '03', name: 'STREAM', title: 'Spark Structured Streaming Processing', description: 'Executes windowed micro-batch processing across Kafka topics with sliding 10-second tumbling aggregations.' },
      { step: '04', name: 'DETECT', title: 'Schema Drift & Anomaly Engine', description: 'Compares runtime event payloads against expected schema catalogs and statistical null-rate/cardinality thresholds.' },
      { step: '05', name: 'ROUTING', title: 'ALLOW / QUARANTINE / BLOCK Routing', description: 'Streams validated records to PostgreSQL/MinIO while diverting corrupted frames to quarantine dead-letter queues.' },
    ],
    decisions: [
      {
        decision: 'Spark Structured Streaming + Kafka Broker Decoupling',
        chosen: 'Apache Kafka Producer/Consumer Architecture with Spark Structured Streaming',
        chosenRationale: 'Decoupled message ingestion guarantees zero data loss during traffic spikes and provides replayable topic offsets.',
        rejected: 'Direct HTTP Ingestion to Database',
        rejectedRationale: 'Direct database ingestion causes connection pool exhaustion and crashes under streaming replay storms.',
      },
      {
        decision: 'Tiered Quarantine Pipeline for Malformed Payloads',
        chosen: 'Dead-Letter Queue (DLQ) with MinIO Raw Object S3 Persistence',
        chosenRationale: 'Quarantining malformed schemas prevents downstream consumer pipeline failure while preserving corrupted records for root-cause analysis.',
        rejected: 'Silent Payload Dropping',
        rejectedRationale: 'Silently discarding events masks upstream producer bugs and makes telemetry reconciliation impossible.',
      },
    ],
    codeSnippet: {
      filename: 'streaming/spark_stream_detector.py',
      language: 'python',
      explanation: 'Spark Structured Streaming pipeline computing real-time windowed null-rates and schema validation.',
      code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, when, count, isnull, window

spark = SparkSession.builder \\
    .appName("OXYS-Streaming-Reliability-Engine") \\
    .getOrCreate()

# Ingest live USGS earthquake telemetry from Kafka
raw_stream = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "localhost:9092") \\
    .option("subscribe", "usgs-earthquake-stream") \\
    .load()

parsed_events = raw_stream.select(
    from_json(col("value").cast("string"), earthquake_schema).alias("data"),
    col("timestamp")
)

# Detect null-rate anomalies and schema drift in 10s windows
validated_stream = parsed_events \\
    .withWatermark("timestamp", "30 seconds") \\
    .groupBy(window(col("timestamp"), "10 seconds")) \\
    .agg(
        count(when(isnull(col("data.properties.mag")), 1)).alias("null_mag_count"),
        count("*").alias("total_event_count")
    ) \\
    .withColumn("null_rate", col("null_mag_count") / col("total_event_count")) \\
    .withColumn("action", when(col("null_rate") > 0.05, "QUARANTINE").otherwise("ALLOW"))

query = validated_stream.writeStream \\
    .outputMode("update") \\
    .format("console") \\
    .start()`,
    },
    tradeoffs: 'Maintaining Spark state stores and Kafka brokers requires active infrastructure, but provides fault-tolerant exactly-once stream processing guarantees.',
    metrics: [
      { value: 'Zero Loss', label: 'Stream Ingestion', subtext: 'Kafka message buffer reliability' },
      { value: '< 100ms', label: 'Detection Latency', subtext: 'Spark sliding window validation' },
      { value: '3-Way', label: 'Routing Engine', subtext: 'ALLOW / QUARANTINE / BLOCK' },
    ],
    prevProject: { slug: 'datarace', title: 'DataRace' },
    nextProject: { slug: 'ichnos', title: 'ICHNOS' },
  },

  'ichnos': {
    slug: 'ichnos',
    title: 'ICHNOS (Trace Inspection & Visualization)',
    tagline: 'Trace Inspection & Workflow Visualization System for Distributed Execution Flows',
    categories: ['Frontend', 'Backend'],
    role: 'Full-Stack Telemetry Systems Developer',
    timeline: '4 Weeks',
    constraints: 'Rendering high-density execution spans and trace DAGs with smooth interactive framerates',
    deployment: 'React + TypeScript + Node.js + Express',
    techStack: ['TypeScript', 'React', 'Node.js', 'Express', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Sivasakthi-Vengatesan/ICHNOS',
    problem: 'Engineering teams debugging distributed microservice systems face difficult investigations when raw execution logs fail to clearly represent parallel spans, parent-child task latencies, and bottleneck services.',
    stages: [
      { step: '01', name: 'INGEST', title: 'Structured Trace Ingestion', description: 'Receives distributed telemetry spans, execution timings, and service metadata from backend microservices.' },
      { step: '02', name: 'GRAPH', title: 'DAG Topology Construction', description: 'Parses span IDs and parent references into directed acyclic dependency graphs with cycle detection.' },
      { step: '03', name: 'WATERFALL', title: 'Waterfall Span Rendering', description: 'Renders hierarchical timeline waterfall bars showing critical path latency breakdowns across services.' },
      { step: '04', name: 'FLAME', title: 'Execution Flame Graph', description: 'Provides visual breakdown of compute time, database query durations, and asynchronous wait states.' },
    ],
    decisions: [
      {
        decision: 'Custom Interactive SVG / Canvas Trace Rendering',
        chosen: 'Modular React & TypeScript Canvas Components',
        chosenRationale: 'Custom canvas rendering maintains 60 FPS performance even when visualizing traces with thousands of concurrent spans.',
        rejected: 'Heavy Third-Party Charting Bundles',
        rejectedRationale: 'Generic charts lacked dedicated waterfall and distributed span nesting capabilities.',
      },
    ],
    codeSnippet: {
      filename: 'src/components/TraceWaterfall.tsx',
      language: 'typescript',
      explanation: 'TypeScript trace visualizer calculating span relative offsets and render bounds.',
      code: `export interface TelemetrySpan {
  id: string;
  parentId?: string;
  serviceName: string;
  operationName: string;
  startTimeUs: number;
  durationUs: number;
}

export function computeSpanCoordinates(spans: TelemetrySpan[], totalDurationUs: number) {
  const rootStartTime = Math.min(...spans.map(s => s.startTimeUs));
  
  return spans.map(span => {
    const leftPercent = ((span.startTimeUs - rootStartTime) / totalDurationUs) * 100;
    const widthPercent = Math.max((span.durationUs / totalDurationUs) * 100, 0.5);
    
    return {
      ...span,
      left: \`\${leftPercent.toFixed(2)}%\`,
      width: \`\${widthPercent.toFixed(2)}%\`,
      latencyMs: (span.durationUs / 1000).toFixed(2)
    };
  });
}`,
    },
    tradeoffs: 'Client-side DAG computation required optimizing graph parsing, but unlocked instant client-side filtering without roundtrip server calls.',
    metrics: [
      { value: '60 FPS', label: 'Rendering Smoothness', subtext: 'Canvas span waterfall viewport' },
      { value: '< 500us', label: 'Span Resolution', subtext: 'High-precision microsecond telemetry' },
      { value: 'Zero Dep', label: 'Custom Architecture', subtext: 'Built from scratch in TypeScript' },
    ],
    prevProject: { slug: 'oxys', title: 'OXYS' },
    nextProject: { slug: 'datarace', title: 'DataRace' },
  },

  'datarace': {
    slug: 'datarace',
    title: 'DataRace (Concurrency Analysis)',
    tagline: 'Database Concurrency Analysis & Anomalous Transaction Interleaving Detector',
    categories: ['Backend', 'Databases'],
    role: 'Database Systems & Concurrency Researcher',
    timeline: '3 Weeks',
    constraints: 'Isolating race conditions and inconsistent transaction schedules across concurrent worker pools',
    deployment: 'Python + PostgreSQL + MySQL + SQLAlchemy + Docker',
    techStack: ['Python', 'PostgreSQL', 'MySQL', 'SQLAlchemy', 'Docker'],
    githubUrl: 'https://github.com/Sivasakthi-Vengatesan/DataRace',
    problem: 'Standard sequential unit tests pass on database application code, but fail to detect race conditions, lost updates, dirty reads, and phantom state corruptions that only manifest under concurrent transaction interleavings.',
    stages: [
      { step: '01', name: 'SCHEDULE', title: 'Multi-Transaction Scheduling', description: 'Generates permuted interleaving schedules across concurrent transaction threads.' },
      { step: '02', name: 'EXECUTE', title: 'Isolated Database Testing', description: 'Executes concurrent read/write transactions against isolated PostgreSQL and MySQL test databases.' },
      { step: '03', name: 'DETECT', title: 'Anomaly & Race Isolation', description: 'Analyzes final database states and locking tables to identify serializability violations and lost updates.' },
      { step: '04', name: 'REPORT', title: 'Conflict Matrix Generation', description: 'Outputs conflict graph analysis and recommended transaction isolation levels (READ COMMITTED vs REPEATABLE READ).' },
    ],
    decisions: [
      {
        decision: 'Automated Schedule Permutation Analysis',
        chosen: 'Thread Barrier Interleaving Simulator',
        chosenRationale: 'Deterministic thread barriers force specific transaction interleavings, reliably reproducing race conditions that occur intermittently in production.',
        rejected: 'Random Load Testing',
        rejectedRationale: 'Random stress tests fail to systematically test all critical conflict edge cases.',
      },
    ],
    codeSnippet: {
      filename: 'concurrency/scheduler.py',
      language: 'python',
      explanation: 'Multi-transaction schedule barrier simulator isolating database race conditions.',
      code: `import threading
from sqlalchemy.orm import Session

def run_concurrent_schedule(engine, tx1_func, tx2_func):
    barrier = threading.Barrier(2)
    results = {}

    def worker_1():
        with Session(engine) as session:
            barrier.wait() # Sync thread start
            results["tx1"] = tx1_func(session)

    def worker_2():
        with Session(engine) as session:
            barrier.wait()
            results["tx2"] = tx2_func(session)

    t1 = threading.Thread(target=worker_1)
    t2 = threading.Thread(target=worker_2)
    
    t1.start(); t2.start()
    t1.join(); t2.join()
    
    return results`,
    },
    tradeoffs: 'Exhaustive schedule testing requires spinning up sandboxed database containers, but guarantees provable isolation anomaly detection.',
    metrics: [
      { value: '100%', label: 'Race Reproducibility', subtext: 'Deterministic thread barrier schedules' },
      { value: 'PostgreSQL', label: 'Isolation Analysis', subtext: 'Multi-engine lock inspection' },
      { value: 'Automated', label: 'Conflict Detection', subtext: 'Dirty read & lost update flags' },
    ],
    prevProject: { slug: 'ichnos', title: 'ICHNOS' },
    nextProject: { slug: 'oxys', title: 'OXYS' },
  },
};
