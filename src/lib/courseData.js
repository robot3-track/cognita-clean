// ─── COURSE CATALOG ──────────────────────────────────────────────────────────
// Levels: "beginner" | "intermediate" | "advanced" | "ap" | "engineering"
// Types:  "full" (multi-module) | "mini" (1-3 lessons, ~1-5 min skill)

export const COURSES = [

  // ── MINI / SKILL COURSES ─────────────────────────────────────────────────
  {
    id: "mini-git-commit", title: "Writing Good Git Commits", emoji: "📝", color: "#f97316",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "2 min",
    description: "Learn the anatomy of a perfect git commit message in under 2 minutes.",
    modules: [
      { id: "mgc-1", title: "Commit Message Anatomy", videoId: "Hlp-9cdImSM", summary: "Subject line, body, and why it matters for collaboration." },
    ]
  },
  {
    id: "mini-debug-js", title: "Debugging JavaScript in DevTools", emoji: "🐛", color: "#eab308",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "3 min",
    description: "Use Chrome DevTools breakpoints and console to squash bugs fast.",
    modules: [
      { id: "mdjs-1", title: "Breakpoints & Console", videoId: "H0XScE08hy8", summary: "Set breakpoints, inspect variables, and step through code." },
    ]
  },
  {
    id: "mini-css-flexbox", title: "CSS Flexbox in 5 Minutes", emoji: "📦", color: "#06b6d4",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "5 min",
    description: "Master flex-direction, justify-content, and align-items quickly.",
    modules: [
      { id: "mcf-1", title: "Flexbox Essentials", videoId: "fYq5PXgSsbE", summary: "flex-direction, justify-content, align-items, and flex-wrap." },
    ]
  },
  {
    id: "mini-async-await", title: "async/await in JavaScript", emoji: "⚡", color: "#a855f7",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "4 min",
    description: "Write cleaner async code by replacing .then() chains with async/await.",
    modules: [
      { id: "maa-1", title: "async/await Explained", videoId: "V_Kr9OSfDeU", summary: "Promises vs async/await, error handling with try/catch." },
    ]
  },
  {
    id: "mini-big-o", title: "Big-O Notation in 3 Minutes", emoji: "📈", color: "#10b981",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "3 min",
    description: "Understand O(1), O(n), O(n²) and why algorithm complexity matters.",
    modules: [
      { id: "mbo-1", title: "Big-O Basics", videoId: "kS_gr2_-ws8", summary: "Time complexity, common complexities, and practical examples." },
    ]
  },
  {
    id: "mini-sql-joins", title: "SQL JOIN Types", emoji: "🔗", color: "#3b82f6",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "5 min",
    description: "INNER, LEFT, RIGHT, and FULL OUTER JOIN — with visual diagrams.",
    modules: [
      { id: "msj-1", title: "SQL Joins Explained", videoId: "9yeOJ0ZMUYw", summary: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN with real examples." },
    ]
  },
  {
    id: "mini-regex", title: "Regex Basics", emoji: "🔍", color: "#ef4444",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "5 min",
    description: "Write regular expressions to match, search, and replace text patterns.",
    modules: [
      { id: "mrx-1", title: "Regex Patterns", videoId: "rhzKDrUiJVk", summary: "Character classes, quantifiers, anchors, and groups." },
    ]
  },
  {
    id: "mini-docker-intro", title: "Docker in 100 Seconds", emoji: "🐳", color: "#0ea5e9",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "2 min",
    description: "What containers are, why Docker matters, and how to run your first image.",
    modules: [
      { id: "mdi-1", title: "Docker Essentials", videoId: "Gjnup-PuquQ", summary: "Images, containers, Dockerfile, and docker run." },
    ]
  },
  {
    id: "mini-linux-commands", title: "Essential Linux Commands", emoji: "🐧", color: "#84cc16",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "5 min",
    description: "ls, cd, grep, chmod, ps, and more — survive the terminal confidently.",
    modules: [
      { id: "mlc-1", title: "Linux CLI Survival", videoId: "ZtqBQ68cfJc", summary: "Navigation, file management, permissions, and process management." },
    ]
  },
  {
    id: "mini-http", title: "HTTP Status Codes", emoji: "🌐", color: "#f59e0b",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "3 min",
    description: "200, 301, 404, 500 — what every status code means and when you'll see them.",
    modules: [
      { id: "mhttp-1", title: "HTTP Status Codes", videoId: "wJa5CTIFj7U", summary: "1xx–5xx ranges, common codes, and REST best practices." },
    ]
  },
  {
    id: "mini-git-branching", title: "Git Branching in 5 Minutes", emoji: "🌿", color: "#22c55e",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "5 min",
    description: "Create, merge, and manage branches in Git with confidence.",
    modules: [
      { id: "mgb-1", title: "Branches & Merging", videoId: "e2IbNHi4uCI", summary: "git branch, checkout, merge, and resolving conflicts." },
    ]
  },
  {
    id: "mini-rest-api", title: "REST APIs Explained", emoji: "🔌", color: "#8b5cf6",
    category: "Coding Skills", level: "beginner", type: "mini", duration: "5 min",
    description: "What a REST API is, HTTP verbs, endpoints, and JSON responses.",
    modules: [
      { id: "mrest-1", title: "REST API Basics", videoId: "lsMQRaeKNDk", summary: "GET, POST, PUT, DELETE, status codes, and JSON." },
    ]
  },
  {
    id: "mini-ssh", title: "SSH in 100 Seconds", emoji: "🔐", color: "#64748b",
    category: "Coding Skills", level: "intermediate", type: "mini", duration: "2 min",
    description: "Securely connect to remote servers using SSH keys and commands.",
    modules: [
      { id: "mssh-1", title: "SSH Essentials", videoId: "v45p_kJV98A", summary: "ssh, keygen, authorized_keys, and port forwarding." },
    ]
  },

  // ── BEGINNER PROGRAMMING ─────────────────────────────────────────────────
  {
    id: "python-intro", title: "Python for Beginners", emoji: "🐍", color: "#3b82f6",
    category: "Programming", level: "beginner", type: "full", duration: "~15h",
    description: "Learn Python from scratch — variables, loops, functions, and basic projects.",
    modules: [
      { id: "py-1", title: "Python Basics", videoId: "kqtD5dpn9C8", summary: "Variables, data types, input/output, and operators." },
      { id: "py-2", title: "Control Flow", videoId: "9Os0o3wzS_I", summary: "if/elif/else, while loops, and for loops." },
      { id: "py-3", title: "Functions", videoId: "u-OmVr_fT4s", summary: "Defining functions, parameters, return values, and scope." },
      { id: "py-4", title: "Lists & Dictionaries", videoId: "W8KRzm-HUcc", summary: "Sequences, indexing, slicing, and key-value pairs." },
      { id: "py-5", title: "File I/O & Modules", videoId: "Uh2ebFW8OYM", summary: "Reading/writing files and importing libraries." },
      { id: "py-6", title: "OOP in Python", videoId: "JeznW_7DlB0", summary: "Classes, objects, inheritance, and encapsulation." },
    ]
  },
  {
    id: "html-css", title: "HTML & CSS Fundamentals", emoji: "🌐", color: "#f97316",
    category: "Programming", level: "beginner", type: "full", duration: "~12h",
    description: "Build your first websites with semantic HTML and modern CSS.",
    modules: [
      { id: "hc-1", title: "HTML Structure", videoId: "qz0aGYrrlhU", summary: "Tags, attributes, semantic elements, and document structure." },
      { id: "hc-2", title: "CSS Basics", videoId: "yfoY53QXEnI", summary: "Selectors, properties, box model, and colors." },
      { id: "hc-3", title: "Flexbox & Grid", videoId: "u044iM9xsWU", summary: "Responsive layouts with CSS Flexbox and Grid." },
      { id: "hc-4", title: "Responsive Design", videoId: "srvUrASNj0s", summary: "Media queries, mobile-first, and viewport units." },
    ]
  },
  {
    id: "javascript-basics", title: "JavaScript Fundamentals", emoji: "📜", color: "#eab308",
    category: "Programming", level: "beginner", type: "full", duration: "~18h",
    description: "From variables to DOM manipulation — the full beginner JS journey.",
    modules: [
      { id: "js-1", title: "Variables & Data Types", videoId: "W6NZfCO5SIk", summary: "var, let, const, strings, numbers, booleans, and null." },
      { id: "js-2", title: "Functions & Scope", videoId: "gigtS_5KYak", summary: "Function declarations, expressions, arrow functions, closures." },
      { id: "js-3", title: "Arrays & Objects", videoId: "oigfaZ5ApsM", summary: "Array methods: map, filter, reduce. Object literals." },
      { id: "js-4", title: "DOM Manipulation", videoId: "0ik6X4DJKCc", summary: "Selecting elements, event listeners, and updating the UI." },
      { id: "js-5", title: "Async JavaScript", videoId: "PoRJizFvM7s", summary: "Callbacks, Promises, async/await, and fetch." },
    ]
  },
  {
    id: "java-basics", title: "Java for Beginners", emoji: "☕", color: "#f97316",
    category: "Programming", level: "beginner", type: "full", duration: "~20h",
    description: "Learn Java from scratch: OOP, arrays, classes, and basic programs.",
    modules: [
      { id: "java-1", title: "Java Fundamentals", videoId: "eIrMbAQSU34", summary: "Variables, data types, operators, and first program." },
      { id: "java-2", title: "Control Flow", videoId: "1RE0egoAm5w", summary: "if/else, switch, while, and for loops in Java." },
      { id: "java-3", title: "Methods & Arrays", videoId: "L08pS0jOjek", summary: "Static methods, parameters, and arrays." },
      { id: "java-4", title: "OOP: Classes & Objects", videoId: "pTB0EiLXUC8", summary: "Classes, constructors, instance variables, methods." },
      { id: "java-5", title: "Inheritance & Polymorphism", videoId: "9TtEX7z6GdI", summary: "Extending classes, overriding methods, and interfaces." },
    ]
  },
  {
    id: "c-plus-plus", title: "C++ Fundamentals", emoji: "⚙️", color: "#0ea5e9",
    category: "Programming", level: "intermediate", type: "full", duration: "~22h",
    description: "Systems programming with C++: memory, pointers, OOP, and STL.",
    modules: [
      { id: "cpp-1", title: "C++ Basics", videoId: "vLnPwxZdW4Y", summary: "Syntax, data types, I/O, and compiling." },
      { id: "cpp-2", title: "Pointers & Memory", videoId: "dtCDZFKFKsE", summary: "Stack vs heap, pointers, references, and dynamic allocation." },
      { id: "cpp-3", title: "Classes & OOP", videoId: "2BP8NhxjrO0", summary: "Classes, constructors, destructors, and encapsulation." },
      { id: "cpp-4", title: "STL Containers", videoId: "woKI_V7aEgs", summary: "vector, map, set, queue — the C++ standard library." },
      { id: "cpp-5", title: "Templates & Modern C++", videoId: "qrJjLVhadyI", summary: "Templates, lambda expressions, and C++11/17 features." },
    ]
  },

  // ── INTERMEDIATE PROGRAMMING ─────────────────────────────────────────────
  {
    id: "react-course", title: "React.js", emoji: "⚛️", color: "#06b6d4",
    category: "Programming", level: "intermediate", type: "full", duration: "~20h",
    description: "Build modern UIs with React — components, hooks, state, and routing.",
    modules: [
      { id: "react-1", title: "Components & JSX", videoId: "Ke90Tje7VS0", summary: "Functional components, JSX syntax, and rendering." },
      { id: "react-2", title: "Props & State", videoId: "4UZrsTqkcW4", summary: "Passing props, useState hook, and controlled components." },
      { id: "react-3", title: "useEffect & Data Fetching", videoId: "0ZJgIjIuY7U", summary: "Side effects, fetch API, and lifecycle in hooks." },
      { id: "react-4", title: "React Router", videoId: "Law7wfdg_ls", summary: "Client-side routing, useParams, and nested routes." },
      { id: "react-5", title: "Context & State Management", videoId: "35lXWvCuM8o", summary: "useContext, useReducer, and when to use them." },
      { id: "react-6", title: "React Project: Build a CRUD App", videoId: "j942wKiXFu8", summary: "End-to-end project applying all React concepts." },
    ]
  },
  {
    id: "data-structures", title: "Data Structures", emoji: "🗂️", color: "#8b5cf6",
    category: "Programming", level: "intermediate", type: "full", duration: "~22h",
    description: "Arrays, linked lists, stacks, queues, trees, and graphs explained visually.",
    modules: [
      { id: "ds-1", title: "Arrays & Strings", videoId: "oBt53YbR9Kk", summary: "Memory layout, operations, and string manipulation." },
      { id: "ds-2", title: "Linked Lists", videoId: "njTh_OwMljA", summary: "Singly and doubly linked lists, insertion/deletion." },
      { id: "ds-3", title: "Stacks & Queues", videoId: "wjI1WNcIntg", summary: "LIFO/FIFO principles and common applications." },
      { id: "ds-4", title: "Hash Tables", videoId: "KyUTuwz_b7Q", summary: "Hash functions, collision resolution, and O(1) lookups." },
      { id: "ds-5", title: "Trees & Binary Search Trees", videoId: "oSWTXtMglKE", summary: "Tree traversals, BST operations, and balanced trees." },
      { id: "ds-6", title: "Graphs", videoId: "tWVWeAqZ0WU", summary: "BFS, DFS, adjacency list vs matrix." },
    ]
  },
  {
    id: "algorithms", title: "Algorithms", emoji: "⚙️", color: "#ec4899",
    category: "Programming", level: "intermediate", type: "full", duration: "~20h",
    description: "Sorting, searching, recursion, dynamic programming, and greedy algorithms.",
    modules: [
      { id: "alg-1", title: "Recursion", videoId: "ngCos392W4w", summary: "Base cases, call stack, and classic recursive problems." },
      { id: "alg-2", title: "Sorting Algorithms", videoId: "kgBjXUE_Nwc", summary: "Bubble, selection, insertion, merge, and quicksort." },
      { id: "alg-3", title: "Binary Search", videoId: "P3YID7liBug", summary: "Divide and conquer for O(log n) search." },
      { id: "alg-4", title: "Dynamic Programming", videoId: "vYquumk4nbs", summary: "Memoization, tabulation, and DP problem patterns." },
      { id: "alg-5", title: "Greedy Algorithms", videoId: "ARvQcqJ_-NY", summary: "Greedy approach, interval scheduling, and Huffman coding." },
    ]
  },
  {
    id: "sql-databases", title: "SQL & Databases", emoji: "🗄️", color: "#14b8a6",
    category: "Programming", level: "intermediate", type: "full", duration: "~14h",
    description: "Write real SQL queries, design schemas, and understand how relational databases work.",
    modules: [
      { id: "sql-1", title: "SELECT & Filtering", videoId: "7S_tz1z_5bA", summary: "SELECT, WHERE, ORDER BY, LIMIT, and DISTINCT." },
      { id: "sql-2", title: "Joins", videoId: "9yeOJ0ZMUYw", summary: "INNER, LEFT, RIGHT, and FULL OUTER joins." },
      { id: "sql-3", title: "Aggregations & Groups", videoId: "KyUTuwz_b7Q", summary: "COUNT, SUM, AVG, GROUP BY, and HAVING." },
      { id: "sql-4", title: "Schema Design", videoId: "ztHopE5Wnpc", summary: "Primary keys, foreign keys, normalization, and ERDs." },
      { id: "sql-5", title: "Subqueries & Indexes", videoId: "m1KcNV-Zhmc", summary: "Subqueries, CTEs, and using indexes for performance." },
    ]
  },

  // ── ADVANCED / ENGINEERING ───────────────────────────────────────────────
  {
    id: "system-design", title: "System Design", emoji: "🏗️", color: "#f97316",
    category: "Engineering", level: "engineering", type: "full", duration: "~25h",
    description: "Design scalable distributed systems — caching, load balancing, databases at scale.",
    modules: [
      { id: "sd-1", title: "Scalability Fundamentals", videoId: "xpDnVSmNFX0", summary: "Vertical vs horizontal scaling, latency, throughput." },
      { id: "sd-2", title: "Load Balancing & Caching", videoId: "K0Ta65OqQkY", summary: "Round-robin, CDN, Redis, and cache invalidation." },
      { id: "sd-3", title: "Database Design at Scale", videoId: "ztHopE5Wnpc", summary: "Sharding, replication, SQL vs NoSQL at scale." },
      { id: "sd-4", title: "Message Queues & Async", videoId: "oUJbuFMyBDk", summary: "Kafka, RabbitMQ, pub/sub, and event-driven architecture." },
      { id: "sd-5", title: "Design: URL Shortener", videoId: "fMZMm_0ZhK4", summary: "End-to-end design of a production URL shortener." },
      { id: "sd-6", title: "Design: Twitter/Social Feed", videoId: "wYk0xPP_P_8", summary: "Fan-out, timeline generation, and notification systems." },
    ]
  },
  {
    id: "machine-learning", title: "Machine Learning", emoji: "🤖", color: "#8b5cf6",
    category: "Engineering", level: "engineering", type: "full", duration: "~30h",
    description: "Linear regression to neural networks — the full ML pipeline with Python.",
    modules: [
      { id: "ml-1", title: "Intro to ML & Types", videoId: "Gv9_4yMHFhI", summary: "Supervised, unsupervised, reinforcement learning overview." },
      { id: "ml-2", title: "Linear & Logistic Regression", videoId: "aircAruvnKk", summary: "Cost function, gradient descent, and classification." },
      { id: "ml-3", title: "Decision Trees & Random Forests", videoId: "7VeUPuFGJHk", summary: "Entropy, information gain, and ensemble methods." },
      { id: "ml-4", title: "Neural Networks Basics", videoId: "aircAruvnKk", summary: "Perceptron, activation functions, forward/backprop." },
      { id: "ml-5", title: "Training & Evaluation", videoId: "Kdsp6soqA7o", summary: "Train/test split, overfitting, cross-validation, metrics." },
      { id: "ml-6", title: "Intro to Deep Learning", videoId: "VyWAvY2CF9c", summary: "CNNs, RNNs, and when to use deep learning." },
    ]
  },
  {
    id: "os-concepts", title: "Operating Systems", emoji: "💾", color: "#64748b",
    category: "Engineering", level: "engineering", type: "full", duration: "~20h",
    description: "Processes, threads, memory management, file systems, and scheduling.",
    modules: [
      { id: "os-1", title: "Processes & Threads", videoId: "exbKr6fnoUw", summary: "Process lifecycle, context switching, and threads." },
      { id: "os-2", title: "Scheduling Algorithms", videoId: "2h3eWaPx8SA", summary: "FCFS, SJF, Round Robin, and priority scheduling." },
      { id: "os-3", title: "Memory Management", videoId: "qdkxqs_0sf8", summary: "Virtual memory, paging, segmentation, and TLB." },
      { id: "os-4", title: "File Systems", videoId: "KN8YgJnShPM", summary: "Inodes, directories, FAT, ext4, and NTFS." },
      { id: "os-5", title: "Concurrency & Deadlocks", videoId: "s5PCh_FaMfM", summary: "Mutex, semaphores, deadlock conditions, and prevention." },
    ]
  },
  {
    id: "computer-networks", title: "Computer Networks", emoji: "🌐", color: "#0ea5e9",
    category: "Engineering", level: "engineering", type: "full", duration: "~18h",
    description: "TCP/IP, DNS, HTTP, sockets, routing, and how the internet actually works.",
    modules: [
      { id: "cn-1", title: "OSI & TCP/IP Model", videoId: "vv4y_uOneC0", summary: "7 OSI layers, TCP/IP stack, encapsulation." },
      { id: "cn-2", title: "IP Addressing & Subnetting", videoId: "s_gy_gE15xE", summary: "IPv4, CIDR, subnets, and private address ranges." },
      { id: "cn-3", title: "TCP vs UDP", videoId: "qqRYkcazomE", summary: "Connection-oriented vs connectionless, use cases." },
      { id: "cn-4", title: "HTTP & DNS", videoId: "AlkDbnbv74A", summary: "HTTP/1.1, HTTP/2, DNS resolution pipeline." },
      { id: "cn-5", title: "TLS & Security", videoId: "j9QmMEWmcfo", summary: "Handshake, certificates, HTTPS, and common attacks." },
    ]
  },
  {
    id: "cybersecurity", title: "Cybersecurity Fundamentals", emoji: "🔒", color: "#ef4444",
    category: "Engineering", level: "intermediate", type: "full", duration: "~18h",
    description: "Threats, defense, cryptography, network security, and ethical hacking basics.",
    modules: [
      { id: "sec-1", title: "Threat Landscape", videoId: "inWWhr5tnEA", summary: "Types of attacks: phishing, malware, ransomware, social engineering." },
      { id: "sec-2", title: "Cryptography Basics", videoId: "AQDCe585Lnc", summary: "Symmetric/asymmetric encryption, hashing, and PKI." },
      { id: "sec-3", title: "Network Security", videoId: "E03gh1huvW4", summary: "Firewalls, IDS/IPS, VPNs, and network hardening." },
      { id: "sec-4", title: "Web Security", videoId: "WlmKwIe9z1Q", summary: "OWASP Top 10: SQL injection, XSS, CSRF, and authentication flaws." },
      { id: "sec-5", title: "Ethical Hacking Intro", videoId: "3Kq1MIfTWCE", summary: "Penetration testing phases, tools, and responsible disclosure." },
    ]
  },
  {
    id: "devops", title: "DevOps & CI/CD", emoji: "🚀", color: "#10b981",
    category: "Engineering", level: "intermediate", type: "full", duration: "~20h",
    description: "Git workflows, CI/CD pipelines, Docker, Kubernetes, and cloud deployment.",
    modules: [
      { id: "devops-1", title: "Git & Version Control", videoId: "RGOj5yH7evk", summary: "Branching strategies, pull requests, and workflows." },
      { id: "devops-2", title: "Docker & Containers", videoId: "3c-iBn73dDE", summary: "Dockerfiles, images, containers, and compose." },
      { id: "devops-3", title: "CI/CD Pipelines", videoId: "R8_veQiYBjI", summary: "GitHub Actions, automated testing, and deployment pipelines." },
      { id: "devops-4", title: "Kubernetes Basics", videoId: "X48VuDVv0do", summary: "Pods, services, deployments, and orchestration." },
      { id: "devops-5", title: "Cloud & Infrastructure", videoId: "M988_fsOSWo", summary: "AWS/GCP/Azure overview, IaC with Terraform." },
    ]
  },

  // ── AP SCIENCES ──────────────────────────────────────────────────────────
  {
    id: "ap-biology", title: "AP Biology", emoji: "🧬", color: "#10b981",
    category: "AP Sciences", level: "ap", type: "full", duration: "~40h",
    description: "Cell biology, genetics, evolution, ecology, and more.",
    modules: [
      { id: "ap-bio-1", title: "Chemistry of Life", videoId: "QnQe0xW_JY4", summary: "Water, carbon, macromolecules, and the building blocks of life." },
      { id: "ap-bio-2", title: "Cell Structure & Function", videoId: "8IlzKri08kk", summary: "Prokaryotic vs eukaryotic cells, organelles, and membranes." },
      { id: "ap-bio-3", title: "Cellular Energetics", videoId: "00jbG_cfGuQ", summary: "Photosynthesis, cellular respiration, and fermentation." },
      { id: "ap-bio-4", title: "Cell Communication & Cell Cycle", videoId: "TNKWgcFPHqw", summary: "Signal transduction, cell division, and cancer." },
      { id: "ap-bio-5", title: "Heredity", videoId: "CBezq1fFUEA", summary: "Meiosis, Mendelian genetics, and inheritance patterns." },
      { id: "ap-bio-6", title: "Gene Expression & Regulation", videoId: "JQIwwJqF5D0", summary: "DNA replication, transcription, translation, and gene regulation." },
      { id: "ap-bio-7", title: "Natural Selection & Evolution", videoId: "DuArVnT1i-E", summary: "Evidence for evolution, mechanisms of change, and speciation." },
      { id: "ap-bio-8", title: "Ecology", videoId: "3ncoQ8_dCGk", summary: "Population ecology, community interactions, and ecosystem dynamics." },
    ]
  },
  {
    id: "ap-chemistry", title: "AP Chemistry", emoji: "⚗️", color: "#f59e0b",
    category: "AP Sciences", level: "ap", type: "full", duration: "~45h",
    description: "Atoms, molecules, reactions, thermodynamics, and kinetics.",
    modules: [
      { id: "ap-chem-1", title: "Atomic Structure & Properties", videoId: "thnDxFdkzZs", summary: "Atomic models, electron configuration, and periodic trends." },
      { id: "ap-chem-2", title: "Molecular & Ionic Bonding", videoId: "QXT4OLZR9Q0", summary: "Ionic, covalent, and metallic bonds; VSEPR theory." },
      { id: "ap-chem-3", title: "Intermolecular Forces & States", videoId: "8qfzpJvsp04", summary: "IMFs, phase changes, and properties of gases, liquids, and solids." },
      { id: "ap-chem-4", title: "Chemical Reactions", videoId: "0KTkd8aCBJg", summary: "Types of reactions, net ionic equations, stoichiometry." },
      { id: "ap-chem-5", title: "Kinetics", videoId: "wYqQCojggyM", summary: "Reaction rates, rate laws, activation energy, and mechanisms." },
      { id: "ap-chem-6", title: "Thermodynamics", videoId: "9DgAMkdpGDI", summary: "Enthalpy, entropy, Gibbs free energy, and spontaneity." },
      { id: "ap-chem-7", title: "Equilibrium", videoId: "jhoOSBBGaQw", summary: "Le Châtelier's principle, Kc, Kp, and ICE tables." },
      { id: "ap-chem-8", title: "Acids & Bases", videoId: "DupXDD87ofE", summary: "pH, buffers, titrations, and acid-base equilibria." },
      { id: "ap-chem-9", title: "Electrochemistry", videoId: "9IG-2yyIAio", summary: "Galvanic cells, electrolysis, and Nernst equation." },
    ]
  },
  {
    id: "ap-physics-1", title: "AP Physics 1", emoji: "⚡", color: "#6366f1",
    category: "AP Sciences", level: "ap", type: "full", duration: "~38h",
    description: "Mechanics, waves, electricity, and modern physics fundamentals.",
    modules: [
      { id: "app1-1", title: "Kinematics", videoId: "ZM8ECpBuQYE", summary: "Displacement, velocity, acceleration, and kinematic equations." },
      { id: "app1-2", title: "Newton's Laws", videoId: "ou9YMWlJgkE", summary: "Forces, free body diagrams, and Newton's 3 laws." },
      { id: "app1-3", title: "Work, Energy & Power", videoId: "w4QFJb9a8vo", summary: "Work-energy theorem, conservation of energy." },
      { id: "app1-4", title: "Momentum & Impulse", videoId: "XFhntPxow0U", summary: "Conservation of momentum, collisions, and impulse." },
      { id: "app1-5", title: "Circular Motion & Gravity", videoId: "mc979OhitAg", summary: "Centripetal acceleration and Newton's law of gravitation." },
      { id: "app1-6", title: "Simple Harmonic Motion", videoId: "k2FvSzWeVxQ", summary: "Springs, pendulums, and wave-like oscillations." },
      { id: "app1-7", title: "Waves & Sound", videoId: "IZKR12sGKSM", summary: "Wave properties, superposition, standing waves, Doppler." },
    ]
  },
  {
    id: "ap-environmental", title: "AP Environmental Science", emoji: "🌍", color: "#16a34a",
    category: "AP Sciences", level: "ap", type: "full", duration: "~36h",
    description: "Earth systems, ecosystems, pollution, climate change, and sustainability.",
    modules: [
      { id: "apes-1", title: "Earth's Systems", videoId: "foE1mO2yM04", summary: "Geosphere, hydrosphere, atmosphere, and biosphere interactions." },
      { id: "apes-2", title: "Ecosystems", videoId: "3ncoQ8_dCGk", summary: "Energy flow, nutrient cycles, and biodiversity." },
      { id: "apes-3", title: "Population Ecology", videoId: "fYo4CJkCEp4", summary: "Growth models, carrying capacity, and human population." },
      { id: "apes-4", title: "Land & Water Use", videoId: "OFwxRuNOJeo", summary: "Agriculture, forestry, fisheries, and resource management." },
      { id: "apes-5", title: "Energy Resources & Pollution", videoId: "zaXBVYr9Iy0", summary: "Fossil fuels, renewables, air/water/soil pollution." },
      { id: "apes-6", title: "Climate Change & Policy", videoId: "G4H1N_yXBiA", summary: "Greenhouse gases, global warming, and international agreements." },
    ]
  },

  // ── AP MATHEMATICS ──────────────────────────────────────────────────────
  {
    id: "ap-calc-ab", title: "AP Calculus AB", emoji: "∫", color: "#3b82f6",
    category: "AP Mathematics", level: "ap", type: "full", duration: "~42h",
    description: "Limits, derivatives, integrals, and the Fundamental Theorem.",
    modules: [
      { id: "ap-calc-ab-1", title: "Limits & Continuity", videoId: "riXcZT2ICjA", summary: "Definition of a limit, one-sided limits, and continuity." },
      { id: "ap-calc-ab-2", title: "Differentiation: Definition", videoId: "rAof9Ld5sOg", summary: "Derivative as a rate of change and tangent line." },
      { id: "ap-calc-ab-3", title: "Differentiation: Rules", videoId: "HEH_oKNLgUU", summary: "Power, product, quotient, and chain rules." },
      { id: "ap-calc-ab-4", title: "Contextual Differentiation", videoId: "kCj_9UvBkbs", summary: "Related rates, implicit differentiation, and applications." },
      { id: "ap-calc-ab-5", title: "Analytical Applications", videoId: "jS_MPopSUeQ", summary: "Critical values, MVT, curve sketching, and optimization." },
      { id: "ap-calc-ab-6", title: "Integration & Accumulation", videoId: "rfG8ce4nNh0", summary: "Riemann sums, definite integrals, and the FTC." },
      { id: "ap-calc-ab-7", title: "Differential Equations", videoId: "6o7b9yyhH7k", summary: "Slope fields, separation of variables, and exponential growth." },
      { id: "ap-calc-ab-8", title: "Applications of Integration", videoId: "jHWaGBNr7h8", summary: "Area between curves, volumes of solids of revolution." },
    ]
  },
  {
    id: "ap-calc-bc", title: "AP Calculus BC", emoji: "∑", color: "#2563eb",
    category: "AP Mathematics", level: "ap", type: "full", duration: "~52h",
    description: "All of AB plus series, parametric equations, and polar coordinates.",
    modules: [
      { id: "ap-calc-bc-1", title: "Limits & Continuity", videoId: "riXcZT2ICjA", summary: "All AB limits content plus L'Hôpital's rule." },
      { id: "ap-calc-bc-2", title: "Differentiation Rules", videoId: "HEH_oKNLgUU", summary: "Full differentiation toolkit." },
      { id: "ap-calc-bc-3", title: "Integration Techniques", videoId: "rfG8ce4nNh0", summary: "Integration by parts, partial fractions, and improper integrals." },
      { id: "ap-calc-bc-4", title: "Differential Equations", videoId: "6o7b9yyhH7k", summary: "Logistic growth and Euler's method." },
      { id: "ap-calc-bc-5", title: "Series: Convergence", videoId: "9rnX6ijzDkk", summary: "Geometric, p-series, comparison, ratio, and root tests." },
      { id: "ap-calc-bc-6", title: "Power & Taylor Series", videoId: "3d6DsjIBzJ4", summary: "Taylor polynomials, Maclaurin series, and error bounds." },
      { id: "ap-calc-bc-7", title: "Parametric & Polar", videoId: "1CBCMR5cHxQ", summary: "Parametric curves, polar coordinates, and area." },
    ]
  },
  {
    id: "ap-statistics", title: "AP Statistics", emoji: "📊", color: "#0ea5e9",
    category: "AP Mathematics", level: "ap", type: "full", duration: "~36h",
    description: "Data exploration, probability, inference, and regression.",
    modules: [
      { id: "ap-stat-1", title: "Exploring One-Variable Data", videoId: "uhxtUt_-GyM", summary: "Distributions, histograms, boxplots, and summary statistics." },
      { id: "ap-stat-2", title: "Exploring Two-Variable Data", videoId: "GAmzwIkGFgE", summary: "Scatterplots, correlation, and linear regression." },
      { id: "ap-stat-3", title: "Collecting Data", videoId: "esmzohFD3ms", summary: "Sampling methods, experimental design, and bias." },
      { id: "ap-stat-4", title: "Probability", videoId: "KzfWUEJjG18", summary: "Rules, conditional probability, and independence." },
      { id: "ap-stat-5", title: "Random Variables & Distributions", videoId: "3v9w79NhsfI", summary: "Discrete and continuous distributions, binomial, and normal." },
      { id: "ap-stat-6", title: "Sampling Distributions", videoId: "z0Ry_3_qhDw", summary: "Central limit theorem and standard error." },
      { id: "ap-stat-7", title: "Inference", videoId: "tFWsuO9f74o", summary: "Confidence intervals, hypothesis tests, and t-tests." },
    ]
  },
  {
    id: "precalculus", title: "Precalculus", emoji: "📐", color: "#6366f1",
    category: "AP Mathematics", level: "intermediate", type: "full", duration: "~40h",
    description: "Functions, trigonometry, conic sections, and an intro to limits.",
    modules: [
      { id: "pre-1", title: "Functions & Their Graphs", videoId: "kvGsIo1TmsM", summary: "Domain, range, transformations, and inverse functions." },
      { id: "pre-2", title: "Polynomial & Rational Functions", videoId: "6IRAlB_DzAM", summary: "Zeros, end behavior, and asymptotes." },
      { id: "pre-3", title: "Exponential & Logarithmic Functions", videoId: "Z5myJ8dg_rM", summary: "Properties, equations, and real-world models." },
      { id: "pre-4", title: "Trigonometric Functions", videoId: "yBw67Fb31Cs", summary: "Unit circle, graphs, and identities." },
      { id: "pre-5", title: "Conic Sections", videoId: "0A7RR0oy2ho", summary: "Circles, ellipses, parabolas, and hyperbolas." },
      { id: "pre-6", title: "Introduction to Limits", videoId: "riXcZT2ICjA", summary: "Informal limits and continuity as a bridge to calculus." },
    ]
  },

  // ── AP HISTORY & SOCIAL SCIENCE ──────────────────────────────────────────
  {
    id: "ap-human-geography", title: "AP Human Geography", emoji: "🗺️", color: "#16a34a",
    category: "AP History & Social Science", level: "ap", type: "full", duration: "~36h",
    description: "Population, culture, political geography, urbanization, agriculture, and globalization.",
    modules: [
      // All videos are Khan Academy / CrashCourse AP Human Geography specific
      { id: "aphg-1", title: "Thinking Geographically", videoId: "pNFYNGkXA18", summary: "Maps, map projections, spatial thinking, and geographic concepts." },
      { id: "aphg-2", title: "Population & Migration", videoId: "3bRai4s_NUQ", summary: "Population distribution, growth models, demographic transition, migration patterns." },
      { id: "aphg-3", title: "Cultural Patterns & Processes", videoId: "OcvbqEWTkis", summary: "Language, religion, ethnicity, and cultural diffusion." },
      { id: "aphg-4", title: "Political Organization of Space", videoId: "QqbanWdpFGY", summary: "States, nations, borders, geopolitics, and supranationalism." },
      { id: "aphg-5", title: "Agriculture & Rural Land Use", videoId: "lbQjIxNpPtQ", summary: "Agricultural origins, types, Green Revolution, and rural settlement." },
      { id: "aphg-6", title: "Cities & Urban Land Use", videoId: "7tBBegRGO8U", summary: "Urbanization, city models, gentrification, and urban sustainability." },
      { id: "aphg-7", title: "Industrialization & Economic Development", videoId: "sMrOUfE-YSc", summary: "Development indicators, industrial location, globalization, and trade." },
    ]
  },
  {
    id: "ap-us-history", title: "AP US History", emoji: "🇺🇸", color: "#ef4444",
    category: "AP History & Social Science", level: "ap", type: "full", duration: "~48h",
    description: "American history from colonialism through modern times.",
    modules: [
      { id: "apush-1", title: "Period 1–2: 1491–1754", videoId: "5XdSFqgAndY", summary: "Pre-Columbian societies, colonialism, and early America." },
      { id: "apush-2", title: "Period 3: Revolution", videoId: "r161yKDPN08", summary: "Revolution, Constitution, and the new republic." },
      { id: "apush-3", title: "Period 4–5: Expansion & Civil War", videoId: "MrHwh3ioLTY", summary: "Manifest Destiny, sectionalism, and Reconstruction." },
      { id: "apush-4", title: "Period 6–7: Industrialization to WWII", videoId: "OumMlXB8CJg", summary: "Gilded Age, Progressivism, and world wars." },
      { id: "apush-5", title: "Period 8–9: Cold War to Present", videoId: "GN8GoNHmPrQ", summary: "Cold War, civil rights, and modern America." },
    ]
  },
  {
    id: "ap-world-history", title: "AP World History", emoji: "🌏", color: "#f59e0b",
    category: "AP History & Social Science", level: "ap", type: "full", duration: "~44h",
    description: "Global history from 1200 CE to present: trade, empires, revolutions, and globalization.",
    modules: [
      { id: "apwh-1", title: "Global Tapestry (1200–1450)", videoId: "5XdSFqgAndY", summary: "Major civilizations, trade routes, and cultural exchange." },
      { id: "apwh-2", title: "Networks of Exchange (1200–1450)", videoId: "nBSexkfJJIE", summary: "Silk Roads, Indian Ocean trade, and the Black Death." },
      { id: "apwh-3", title: "Land-Based Empires (1450–1750)", videoId: "xuqFBqG5Kpk", summary: "Ottoman, Mughal, Qing, and Romanov empires." },
      { id: "apwh-4", title: "Transoceanic Interconnections (1450–1750)", videoId: "r9PNGoHCvyc", summary: "Columbian Exchange, Atlantic slave trade, and colonialism." },
      { id: "apwh-5", title: "Revolutions (1750–1900)", videoId: "xLCWMHoLBXM", summary: "Enlightenment, American, French, and Haitian Revolutions." },
      { id: "apwh-6", title: "Consequences of Industrialization", videoId: "zhL5DCizj5c", summary: "Imperialism, migration, and economic transformations." },
      { id: "apwh-7", title: "Global Conflict & 20th Century", videoId: "Q77yY7vqaAc", summary: "World Wars, Cold War, and decolonization." },
    ]
  },
  {
    id: "ap-psychology", title: "AP Psychology", emoji: "🧠", color: "#ec4899",
    category: "AP History & Social Science", level: "ap", type: "full", duration: "~40h",
    description: "Research methods, biological bases, cognition, and social behavior.",
    modules: [
      { id: "ap-psych-1", title: "History & Research Methods", videoId: "jU30p3QMHZM", summary: "Major schools of thought and research methods." },
      { id: "ap-psych-2", title: "Biological Bases", videoId: "H49vFKOFcPo", summary: "Neurons, brain structure, and the nervous system." },
      { id: "ap-psych-3", title: "Sensation & Perception", videoId: "unWnZvXJH2o", summary: "How we sense and interpret the world." },
      { id: "ap-psych-4", title: "Learning & Cognition", videoId: "H6LEcM0E0io", summary: "Conditioning, memory models, and thinking." },
      { id: "ap-psych-5", title: "Social Psychology", videoId: "UGxGDdQnC1Y", summary: "Conformity, obedience, attitudes, and group behavior." },
    ]
  },
  {
    id: "ap-economics", title: "AP Macroeconomics", emoji: "📈", color: "#0ea5e9",
    category: "AP History & Social Science", level: "ap", type: "full", duration: "~38h",
    description: "National economies, fiscal/monetary policy, GDP, inflation, and international trade.",
    modules: [
      { id: "ap-macro-1", title: "Basic Economics Concepts", videoId: "3ez10ADR_gM", summary: "Scarcity, opportunity cost, supply & demand, and markets." },
      { id: "ap-macro-2", title: "Measuring Economic Performance", videoId: "13oYFqkl3u8", summary: "GDP, unemployment rate, CPI, and business cycles." },
      { id: "ap-macro-3", title: "National Income & Price Determination", videoId: "eNhFzxMZ_28", summary: "Aggregate supply & demand, multiplier effect." },
      { id: "ap-macro-4", title: "Fiscal Policy", videoId: "d7sCxh_-YRY", summary: "Government spending, taxes, and budget deficits." },
      { id: "ap-macro-5", title: "Money, Banking & Monetary Policy", videoId: "GmEzLmMeFY4", summary: "Federal Reserve, money supply, and interest rates." },
      { id: "ap-macro-6", title: "International Trade & Finance", videoId: "7Qyk_0RKBfQ", summary: "Balance of trade, exchange rates, and comparative advantage." },
    ]
  },

  // ── AP CS ─────────────────────────────────────────────────────────────────
  {
    id: "ap-cs-a", title: "AP Computer Science A", emoji: "💻", color: "#14b8a6",
    category: "AP Computer Science", level: "ap", type: "full", duration: "~46h",
    description: "Java programming, data structures, algorithms, and OOP.",
    modules: [
      { id: "ap-csa-1", title: "Primitive Types & Variables", videoId: "GoXwIVyNvX0", summary: "int, double, boolean, and basic operations in Java." },
      { id: "ap-csa-2", title: "Boolean Expressions & Control", videoId: "ldYLYRXaucM", summary: "If statements, while loops, and for loops." },
      { id: "ap-csa-3", title: "Arrays & ArrayLists", videoId: "FDMfoxbBwDI", summary: "1D and 2D arrays, traversals, and ArrayList methods." },
      { id: "ap-csa-4", title: "Writing Classes", videoId: "pTB0EiLXUC8", summary: "Instance variables, constructors, and methods." },
      { id: "ap-csa-5", title: "Inheritance & Polymorphism", videoId: "9TtEX7z6GdI", summary: "Subclasses, superclasses, and method overriding." },
      { id: "ap-csa-6", title: "Recursion & Sorting", videoId: "mz6tAJMVmfM", summary: "Recursion, binary search, selection sort, and merge sort." },
    ]
  },
  {
    id: "ap-csp", title: "AP Computer Science Principles", emoji: "🖥️", color: "#7c3aed",
    category: "AP Computer Science", level: "ap", type: "full", duration: "~36h",
    description: "Digital information, algorithms, programming concepts, the internet, and impacts of computing.",
    modules: [
      { id: "ap-csp-1", title: "Digital Information", videoId: "M3vFn6NWDks", summary: "Binary, data compression, and digital representation." },
      { id: "ap-csp-2", title: "The Internet", videoId: "AEaKrq3SpW8", summary: "Packets, protocols, DNS, and how the web works." },
      { id: "ap-csp-3", title: "Programming Fundamentals", videoId: "zOjov-2OZ0E", summary: "Variables, conditionals, loops, and functions." },
      { id: "ap-csp-4", title: "Algorithms & Abstraction", videoId: "8ext9G7xspg", summary: "Searching, sorting, heuristics, and undecidability." },
      { id: "ap-csp-5", title: "Impacts of Computing", videoId: "qfn1JJb9tIo", summary: "Privacy, security, bias, and the digital divide." },
    ]
  },

  // ── LANGUAGE COURSES ─────────────────────────────────────────────────────
  {
    id: "french-beginner", title: "French for Beginners", emoji: "🇫🇷", color: "#3b82f6",
    category: "Languages", level: "beginner", type: "full", duration: "~20h",
    description: "Learn French from scratch — pronunciation, basic vocabulary, greetings, and everyday conversations.",
    modules: [
      { id: "fr-1", title: "Pronunciation & Alphabet", videoId: "A8V5kn5oyO0", summary: "French sounds, accents, and how to pronounce letters correctly." },
      { id: "fr-2", title: "Greetings & Introductions", videoId: "nBSexkfJJIE", summary: "Bonjour, merci, s'il vous plaît — essential first phrases." },
      { id: "fr-3", title: "Numbers, Days & Months", videoId: "v6BmurRdK2Y", summary: "Counting, days of the week, and calendar vocabulary." },
      { id: "fr-4", title: "Nouns, Articles & Gender", videoId: "3ZcuQX5sFz0", summary: "Masculine and feminine nouns, le, la, les, un, une." },
      { id: "fr-5", title: "Basic Verbs & Present Tense", videoId: "OXhMz7c4s5w", summary: "Être, avoir, aller, faire — the most important French verbs." },
      { id: "fr-6", title: "Common Conversations", videoId: "y2FMQ5BBXVU", summary: "Ordering food, asking directions, and shopping in French." },
    ]
  },
  {
    id: "french-intermediate", title: "Intermediate French", emoji: "🥐", color: "#2563eb",
    category: "Languages", level: "intermediate", type: "full", duration: "~25h",
    description: "Build fluency with complex grammar, past tense, and richer vocabulary.",
    modules: [
      { id: "fr-int-1", title: "Passé Composé", videoId: "mBPE7DELRlQ", summary: "Talking about the past with avoir and être." },
      { id: "fr-int-2", title: "Imparfait & Storytelling", videoId: "4Vrl3AcJniI", summary: "Describing past states and ongoing actions." },
      { id: "fr-int-3", title: "Future Tense", videoId: "w-OuQZQdmhE", summary: "Futur simple and futur proche — talking about the future." },
      { id: "fr-int-4", title: "Subjunctive Mood", videoId: "rxp1oRFvdXQ", summary: "Using the subjunctive for wishes, doubts, and emotions." },
      { id: "fr-int-5", title: "Pronouns & Object Replacement", videoId: "p4EqNHlyqh0", summary: "Direct, indirect, and reflexive pronouns." },
    ]
  },
  {
    id: "spanish-beginner", title: "Spanish for Beginners", emoji: "🇪🇸", color: "#ef4444",
    category: "Languages", level: "beginner", type: "full", duration: "~20h",
    description: "Start speaking Spanish today — pronunciation, everyday vocabulary, and basic conversations.",
    modules: [
      { id: "es-1", title: "Pronunciation & Alphabet", videoId: "bxoh-MGxsxY", summary: "Spanish sounds, vowels, and correct pronunciation rules." },
      { id: "es-2", title: "Greetings & Basic Phrases", videoId: "ow91wH2W-fk", summary: "Hola, gracias, por favor — your first Spanish words." },
      { id: "es-3", title: "Numbers & Essential Vocabulary", videoId: "wgWC96WBGRE", summary: "Counting, colors, family, and common nouns." },
      { id: "es-4", title: "Nouns, Articles & Gender", videoId: "V0zfHMVBRLo", summary: "El, la, un, una — Spanish noun gender system." },
      { id: "es-5", title: "Present Tense Verbs", videoId: "vP9wl2wGlw4", summary: "Ser, estar, tener, ir — conjugating essential verbs." },
      { id: "es-6", title: "Everyday Conversations", videoId: "yiwVHBvAUEY", summary: "Ordering food, shopping, asking directions in Spanish." },
    ]
  },
  {
    id: "spanish-intermediate", title: "Intermediate Spanish", emoji: "💃", color: "#dc2626",
    category: "Languages", level: "intermediate", type: "full", duration: "~25h",
    description: "Expand to past tense, subjunctive, and nuanced everyday expression in Spanish.",
    modules: [
      { id: "es-int-1", title: "Preterite Tense", videoId: "ZR5_r5CVNag", summary: "Talking about completed past actions." },
      { id: "es-int-2", title: "Imperfect Tense", videoId: "OB9h2vAB_pw", summary: "Describing past states and habitual actions." },
      { id: "es-int-3", title: "Ser vs. Estar Mastery", videoId: "itdoRVbQ_xQ", summary: "Deep dive into when to use ser and estar." },
      { id: "es-int-4", title: "Subjunctive Mood", videoId: "Qk2BkPREuN0", summary: "Present subjunctive for wishes, emotions, and doubt." },
      { id: "es-int-5", title: "Future & Conditional", videoId: "V1N6u_hDMTY", summary: "Talking about future plans and hypothetical situations." },
    ]
  },

  // ── FOUNDATIONAL MATH & SCIENCE ──────────────────────────────────────────
  {
    id: "algebra-1", title: "Algebra 1", emoji: "🔢", color: "#4f46e5",
    category: "Mathematics", level: "beginner", type: "full", duration: "~35h",
    description: "Variables, expressions, equations, inequalities, and functions.",
    modules: [
      { id: "alg1-1", title: "Foundations of Algebra", videoId: "NybHckSEQBI", summary: "Variables, expressions, and order of operations." },
      { id: "alg1-2", title: "Solving Equations", videoId: "l3XzepN03KQ", summary: "One-step and multi-step linear equations." },
      { id: "alg1-3", title: "Linear Functions", videoId: "MXV65i9g1Xg", summary: "Slope, y-intercept, and forms of linear equations." },
      { id: "alg1-4", title: "Systems of Equations", videoId: "-7VoCHlQNhY", summary: "Substitution, elimination, and graphical methods." },
      { id: "alg1-5", title: "Polynomials & Factoring", videoId: "qqTYV79IK88", summary: "Adding, subtracting, multiplying, and factoring polynomials." },
    ]
  },
  {
    id: "algebra-2", title: "Algebra 2", emoji: "📈", color: "#4338ca",
    category: "Mathematics", level: "intermediate", type: "full", duration: "~40h",
    description: "Polynomials, complex numbers, exponentials, logarithms, and conics.",
    modules: [
      { id: "alg2-1", title: "Complex Numbers", videoId: "SP-YJe7Vldo", summary: "Imaginary and complex numbers and their operations." },
      { id: "alg2-2", title: "Polynomial Functions", videoId: "6IRAlB_DzAM", summary: "Higher-degree polynomials, zeros, and end behavior." },
      { id: "alg2-3", title: "Exponential & Logarithmic Functions", videoId: "Z5myJ8dg_rM", summary: "Properties of logs, natural log, and exponential equations." },
      { id: "alg2-4", title: "Sequences & Series", videoId: "9Zl9l5oJ4IE", summary: "Arithmetic and geometric sequences and series." },
    ]
  },
  {
    id: "geometry", title: "Geometry", emoji: "📐", color: "#7c3aed",
    category: "Mathematics", level: "beginner", type: "full", duration: "~35h",
    description: "Points, lines, angles, triangles, circles, proofs, and coordinate geometry.",
    modules: [
      { id: "geo-1", title: "Basics of Geometry", videoId: "302eJ3TzJQU", summary: "Points, lines, planes, angles, and measurement." },
      { id: "geo-2", title: "Triangles & Congruence", videoId: "1sVm8TgdSXk", summary: "Congruence, similarity, and triangle theorems." },
      { id: "geo-3", title: "Circles", videoId: "7VDT_OaZ380", summary: "Arc, chord, tangent, and angle theorems." },
      { id: "geo-4", title: "Area, Volume & Surface Area", videoId: "QK1RB7HUpD0", summary: "Formulas for 2D and 3D figures." },
    ]
  },
  {
    id: "trigonometry", title: "Trigonometry", emoji: "📏", color: "#8b5cf6",
    category: "Mathematics", level: "intermediate", type: "full", duration: "~28h",
    description: "Unit circle, trig functions, identities, law of sines/cosines, and graphs.",
    modules: [
      { id: "trig-1", title: "Right Triangle Trig", videoId: "F21S9Wpi0y8", summary: "SOH-CAH-TOA, Pythagorean theorem, and inverse trig." },
      { id: "trig-2", title: "The Unit Circle", videoId: "yBw67Fb31Cs", summary: "Angles in radians, standard positions, and exact values." },
      { id: "trig-3", title: "Graphs of Trig Functions", videoId: "gBLbEKXpFaU", summary: "Sine, cosine, and tangent graphs, amplitude, and period." },
      { id: "trig-4", title: "Trig Identities", videoId: "siKqlTSXCZQ", summary: "Pythagorean, sum/difference, double angle identities." },
      { id: "trig-5", title: "Law of Sines & Cosines", videoId: "x_WaFZJLEtI", summary: "Solving non-right triangles and applications." },
    ]
  },
  {
    id: "biology", title: "Biology", emoji: "🌱", color: "#16a34a",
    category: "Sciences", level: "beginner", type: "full", duration: "~40h",
    description: "Cell biology, genetics, evolution, body systems, and ecology.",
    modules: [
      { id: "bio-1", title: "The Cell", videoId: "8IlzKri08kk", summary: "Cell theory, organelles, and cell membrane." },
      { id: "bio-2", title: "DNA & Genetics", videoId: "JQIwwJqF5D0", summary: "DNA structure, replication, and protein synthesis." },
      { id: "bio-3", title: "Evolution", videoId: "DuArVnT1i-E", summary: "Natural selection, adaptation, and speciation." },
      { id: "bio-4", title: "Human Body Systems", videoId: "Ae4MadKPJhg", summary: "Circulatory, respiratory, nervous, and digestive systems." },
      { id: "bio-5", title: "Ecology", videoId: "3ncoQ8_dCGk", summary: "Ecosystems, food webs, biomes, and conservation." },
    ]
  },
  {
    id: "chemistry", title: "Chemistry", emoji: "🧪", color: "#d97706",
    category: "Sciences", level: "beginner", type: "full", duration: "~40h",
    description: "Matter, atomic structure, bonding, reactions, and solutions.",
    modules: [
      { id: "chem-1", title: "Atomic Structure", videoId: "thnDxFdkzZs", summary: "Atoms, protons, neutrons, electrons, and the periodic table." },
      { id: "chem-2", title: "Chemical Bonding", videoId: "QXT4OLZR9Q0", summary: "Ionic, covalent, and metallic bonds." },
      { id: "chem-3", title: "Chemical Reactions", videoId: "0KTkd8aCBJg", summary: "Types of reactions, balancing equations, stoichiometry." },
      { id: "chem-4", title: "Acids, Bases & Solutions", videoId: "DupXDD87ofE", summary: "pH, neutralization, molarity, and solution chemistry." },
    ]
  },
  {
    id: "physics", title: "Physics", emoji: "⚛️", color: "#6366f1",
    category: "Sciences", level: "intermediate", type: "full", duration: "~42h",
    description: "Mechanics, electricity, magnetism, waves, thermodynamics, and modern physics.",
    modules: [
      { id: "phys-1", title: "Kinematics & Forces", videoId: "ZM8ECpBuQYE", summary: "Motion, Newton's laws, and free-body diagrams." },
      { id: "phys-2", title: "Energy & Momentum", videoId: "w4QFJb9a8vo", summary: "Work, kinetic/potential energy, and conservation laws." },
      { id: "phys-3", title: "Electricity & Magnetism", videoId: "IiDMHmVyyB8", summary: "Charge, electric fields, circuits, and magnetism." },
      { id: "phys-4", title: "Waves & Optics", videoId: "IZKR12sGKSM", summary: "Wave behavior, sound, light, and lenses." },
      { id: "phys-5", title: "Thermodynamics", videoId: "9DgAMkdpGDI", summary: "Heat, temperature, laws of thermodynamics." },
    ]
  },
  {
    id: "earth-science", title: "Earth Science", emoji: "🌋", color: "#78716c",
    category: "Sciences", level: "beginner", type: "full", duration: "~32h",
    description: "Geology, weather, oceans, atmosphere, and the solar system.",
    modules: [
      { id: "earth-1", title: "Plate Tectonics", videoId: "kwfNGatxUJI", summary: "Continental drift, earthquakes, and volcanoes." },
      { id: "earth-2", title: "Rocks & Minerals", videoId: "XFCgMHMEt5Y", summary: "Rock cycle, mineral identification, and formation." },
      { id: "earth-3", title: "Weather & Climate", videoId: "G4H1N_yXBiA", summary: "Atmosphere layers, weather patterns, and climate zones." },
      { id: "earth-4", title: "Oceans & Hydrology", videoId: "OFwxRuNOJeo", summary: "Ocean currents, water cycle, and freshwater systems." },
      { id: "earth-5", title: "The Solar System & Space", videoId: "libKVRa01L8", summary: "Planets, stars, galaxies, and the universe." },
    ]
  },
];

export function getCourse(id) {
  return COURSES.find(c => c.id === id) || null;
}

export const COURSE_CATEGORIES = [
  { id: "all", label: "All Courses", emoji: "🌟" },
  { id: "mini", label: "⚡ Quick Skills", emoji: "⚡", filterType: "mini" },
  { id: "Coding Skills", label: "Coding Skills", emoji: "🐛" },
  { id: "Programming", label: "Programming", emoji: "💻" },
  { id: "Engineering", label: "Engineering", emoji: "🏗️" },
  { id: "AP Sciences", label: "AP Sciences", emoji: "🔬" },
  { id: "AP Mathematics", label: "AP Mathematics", emoji: "∫" },
  { id: "AP History & Social Science", label: "AP History & SS", emoji: "📜" },
  { id: "AP Computer Science", label: "AP CS", emoji: "🖥️" },
  { id: "Mathematics", label: "Mathematics", emoji: "📐" },
  { id: "Sciences", label: "Sciences", emoji: "🌱" },
  { id: "Languages", label: "Languages", emoji: "🗣️" },
];

export const LEVEL_LABELS = {
  beginner: { label: "Beginner", color: "#22c55e" },
  intermediate: { label: "Intermediate", color: "#3b82f6" },
  advanced: { label: "Advanced", color: "#f97316" },
  ap: { label: "AP Level", color: "#a855f7" },
  engineering: { label: "Engineering", color: "#ef4444" },
};