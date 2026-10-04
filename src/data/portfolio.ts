export interface Social {
    github: string;
    linkedin: string;
    buyMeACoffee?: string;
}

export interface Personal {
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    social: Social;
}

export interface HeroAction {
    text: string;
    href: string;
    icon: string;
    primary: boolean;
}

export interface Hero {
    status: string;
    taglines: string[];
    subtext: string;
    actions: HeroAction[];
}

export interface About {
    title: string;
    bio: string;
    image: string;
    highlights: {
        label: string;
        value: string;
        icon: string;
    }[];
}

export interface Education {
    period: string;
    degree: string;
    institution: string;
    cgpa?: string;
}

export interface CertificationItem {
    title: string;
    issuer: string;
    featured?: boolean;
}

export interface Experience {
    period: string;
    role: string;
    company: string;
    description: string[];
}

export interface Skill {
    category: string;
    items: string;
}

export interface Project {
    slug: string;
    title: string;
    icon: string;
    description: string;
    image?: string;
    github: string;
    demo?: string;
    featured?: boolean;
    problem?: string;
    approach?: string;
    outcome?: string;
    specs: {
        label: string;
        value: string;
    }[];
    category?: string[];
    techStack: string[];
}

export interface Footer {
    copyright: string;
}

export interface PortfolioData {
    personal: Personal;
    hero: Hero;
    about: About;
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    certifications: CertificationItem[];
    achievements: string[];
    footer: Footer;
}

export const portfolioData: PortfolioData = {
    personal: {
        name: "SIVASAKTHI VENGATESAN",
        role: "BACKEND / BIG DATA ENGINEER",
        email: "sivasakthivengatesan2427@gmail.com",
        phone: "+91 7358160652",
        location: "Chennai, Tamil Nadu, India",
        social: {
            github: "https://github.com/Sivasakthi-Vengatesan",
            linkedin: "https://linkedin.com/in/sivasakthi-vengatesan-8a1209410"
        }
    },
    hero: {
        status: "📍 Chennai, India | Available for Backend & Big Data Roles",
        taglines: [
            "Building Distributed Data Infrastructure & Scalable Event Pipelines.",
            "Architecting Resilient Backend Systems around Spark, Kafka & Databases.",
            "Processing Real-Time Streaming Data with Spark Structured Streaming.",
            "Engineering Concurrency Analyzers and High-Throughput Web Services."
        ],
        subtext: "I build backend systems and data infrastructure around distributed processing, streaming data, and reliable software systems.",
        actions: [
            { text: "View Flagship Projects", href: "#projects", icon: "arrow_forward", primary: true },
            { text: "Download Resume (PDF)", href: "/Sivasakthi_V.pdf", icon: "download", primary: false },
            { text: "LinkedIn", href: "https://linkedin.com/in/sivasakthi-vengatesan-8a1209410", icon: "open_in_new", primary: false }
        ]
    },
    about: {
        title: "About / Identity",
        bio: "Computer Science Engineering student at Chennai Institute of Technology focused on Backend Engineering and Big Data. Passionate about distributed systems, data infrastructure, streaming systems, and reliable backend systems. Experienced in building practical engineering projects around Apache Spark, Kafka, FastAPI, database concurrency analysis, and scalable backend services.",
        image: "/sivasakthi_avatar.jpg",
        highlights: [
            { label: "INSTITUTION", value: "Chennai Institute of Technology", icon: "school" },
            { label: "DEGREE", value: "B.E. CSE · 3rd Sem (CGPA: 8.6)", icon: "workspace_premium" },
            { label: "SPECIALIZATION", value: "Backend Systems & Big Data Infrastructure", icon: "rocket_launch" }
        ]
    },
    education: [
        {
            period: "2025 – 2029",
            degree: "Bachelor of Engineering, Computer Science and Engineering",
            institution: "Chennai Institute of Technology, Chennai",
            cgpa: "8.6 / 10 (3rd Semester)"
        }
    ],
    experience: [],
    skills: [
        {
            category: "Big Data",
            items: "Hadoop, HDFS, MapReduce, YARN, Hive, HiveQL, Spark, Spark SQL, RDD, Sqoop, Airflow"
        },
        {
            category: "Backend",
            items: "Python, Java, FastAPI, Spring Boot, Node.js, Express, REST APIs, SQLAlchemy, Pydantic"
        },
        {
            category: "Databases",
            items: "PostgreSQL, MySQL, pgvector"
        },
        {
            category: "AI / Security",
            items: "LangChain4j, RAG, LLMs, Z3, Z3Py"
        },
        {
            category: "Cloud / Tools",
            items: "AWS, Linux, Bash, Git, GitHub, Docker"
        },
        {
            category: "Frontend",
            items: "React, Next.js, TypeScript, JavaScript, Tailwind CSS"
        }
    ],
    projects: [
        {
            slug: "oxys",
            title: "OXYS (Real-Time Streaming Reliability)",
            icon: "stream",
            featured: true,
            description: "A real-data streaming reliability system that detects schema drift, null-rate anomalies, cardinality changes, and duplicate replay storms in streaming data.",
            problem: "Distributed streaming pipelines fail silently when upstream producers emit malformed schemas, null-rate spikes, or duplicate event storms, corrupting downstream analytics.",
            approach: "Built a high-throughput streaming validation pipeline ingesting real-time USGS Earthquake Hazards GeoJSON data through Kafka into Spark Structured Streaming with automatic schema drift detection and deduplication.",
            outcome: "Automates ALLOW / QUARANTINE / BLOCK routing for streaming telemetry, guaranteeing clean data ingestion into PostgreSQL and MinIO object storage under high message rates.",
            image: "/projects/oxys.png",
            github: "https://github.com/Sivasakthi-Vengatesan/OXYS",
            demo: "https://github.com/Sivasakthi-Vengatesan/OXYS",
            specs: [
                { label: "Stream Engine", value: "Spark Structured Streaming" },
                { label: "Message Broker", value: "Apache Kafka" },
                { label: "Data Source", value: "USGS Real-Time GeoJSON Feed" },
                { label: "Storage Layer", value: "PostgreSQL + MinIO" }
            ],
            category: ["Big Data", "Backend"],
            techStack: ["Python", "Kafka", "Spark", "FastAPI", "PostgreSQL", "MinIO", "Docker"]
        },
        {
            slug: "ichnos",
            title: "ICHNOS (Trace Inspection & Visualization)",
            icon: "hub",
            featured: true,
            description: "A trace inspection and workflow visualization system for understanding distributed execution flows, execution telemetry monitoring, and system behavior.",
            problem: "Analyzing complex distributed microservice call chains and asynchronous data flow graphs is difficult without granular timeline visualization and span inspection.",
            approach: "Engineered a TypeScript web application dedicated to execution telemetry monitoring, structured data workflow visualization, and span dependency inspection.",
            outcome: "Renders interactive execution traces, distributed span waterfall views, and real-time monitoring of backend data flows.",
            image: "/projects/ichnos.png",
            github: "https://github.com/Sivasakthi-Vengatesan/ICHNOS",
            specs: [
                { label: "Frontend Engine", value: "React + TypeScript" },
                { label: "Backend Runtime", value: "Node.js + Express" },
                { label: "Visualization", value: "Interactive Trace Graphs" },
                { label: "Telemetry", value: "Distributed Span Waterfalls" }
            ],
            category: ["Frontend", "Backend"],
            techStack: ["TypeScript", "React", "Node.js", "Express", "Tailwind CSS"]
        },
        {
            slug: "datarace",
            title: "DataRace (Concurrency Analysis)",
            icon: "sync_problem",
            featured: false,
            description: "A concurrency analysis tool to isolate database race conditions and anomalous transaction interleavings that pass standard sequential testing.",
            image: "/projects/datarace.png",
            github: "https://github.com/Sivasakthi-Vengatesan/DataRace",
            specs: [
                { label: "Analysis Engine", value: "Transaction Interleaving Analysis" },
                { label: "Databases", value: "PostgreSQL & MySQL" },
                { label: "Detection", value: "Dirty Reads, Lost Updates, Phantoms" }
            ],
            category: ["Backend", "Databases"],
            techStack: ["Python", "PostgreSQL", "MySQL", "SQLAlchemy", "Docker"]
        }
    ],
    certifications: [
        { title: "AWS Certified AI Practitioner", issuer: "AWS", featured: true },
        { title: "AWS Cloud Practitioner Essentials", issuer: "AWS", featured: true },
        { title: "Fundamentals of Analytics on AWS – Part 1 & Part 2", issuer: "AWS", featured: true },
        { title: "Databricks Big Data Certification", issuer: "Databricks", featured: true },
        { title: "Oracle Cloud Infrastructure AI Foundations Associate", issuer: "Oracle", featured: true },
        { title: "Cisco Python Essentials 1 & 2", issuer: "Cisco", featured: false },
        { title: "MongoDB Certifications", issuer: "MongoDB", featured: false }
    ],
    achievements: [
        "Winner (1st Place) — BuildFest '26",
        "Finalist — Monad Blitz Hackathon",
        "Finalist — TNWISE (TNWISE CBE)",
        "Finalist — Build with DataHub: The Agent Hackathon",
        "500+ problems solved on LeetCode across core Data Structures and Algorithms"
    ],
    footer: {
        copyright: "© 2026 Sivasakthi Vengatesan · Backend / Big Data Engineer"
    }
};
