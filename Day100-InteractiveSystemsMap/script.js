class ChronoQuest {
  constructor() {
    this.currentEra = "1950s";
    this.unlockedMilestones = new Set();
    this.visitedEras = new Set(["1950s"]);
    this.stories = {
      // 1950s Stories
      fortran: {
        title: "FORTRAN: The First High-Level Language",
        content: `In 1957, IBM introduced FORTRAN (Formula Translation), the first high-level programming language that revolutionized scientific computing. Developed by John Backus and his team, FORTRAN allowed scientists and engineers to write code using mathematical notation rather than complex machine language.

Before FORTRAN, programming was done in assembly language or machine code, making complex calculations incredibly difficult and time-consuming. FORTRAN's compiler technology made high-performance scientific computing accessible to researchers who weren't computer experts.

The language introduced concepts like variables, loops, and conditional statements that became fundamental to all subsequent programming languages. FORTRAN demonstrated that computers could understand human-readable instructions, setting the stage for every programming language that followed and accelerating scientific progress across multiple fields.`,
      },
      transistor: {
        title: "Transistor Revolution",
        content: `In 1947, Bell Labs physicists John Bardeen, Walter Brattain, and William Shockley invented the transistor, but it was in the 1950s that this revolutionary device began transforming computing. Transistors replaced bulky, unreliable vacuum tubes, making computers smaller, faster, and more reliable.

The transistor's ability to act as an electronic switch and amplifier became the foundation of digital electronics. This breakthrough led to the development of integrated circuits and eventually microprocessors, enabling the personal computing revolution.

The inventors received the 1956 Nobel Prize in Physics for their work, which fundamentally changed electronics and paved the way for all modern computing devices from smartphones to supercomputers.`,
      },
      univac: {
        title: "UNIVAC I: First Commercial Computer",
        content: `In 1951, the UNIVAC I (Universal Automatic Computer I) became the first commercially produced electronic digital computer in the United States. Developed by J. Presper Eckert and John Mauchly, the same team that created the ENIAC, UNIVAC I marked the beginning of the computer industry.

The machine gained fame when it correctly predicted the outcome of the 1952 presidential election, astonishing television viewers by forecasting Eisenhower's victory based on early returns. UNIVAC I used magnetic tape for input/output instead of punched cards, a significant advancement at the time.

Forty-six UNIVAC I systems were built and sold to government agencies and corporations, demonstrating that computers had practical business applications beyond scientific research.`,
      },

      // 1960s Stories
      arpanet: {
        title: "ARPANET: Internet's Predecessor",
        content: `In 1969, the Advanced Research Projects Agency Network (ARPANET) became the first operational packet-switching network and the direct predecessor to the modern Internet. The first message was sent between UCLA and Stanford Research Institute, though the system crashed after transmitting just "LO" instead of the intended "LOGIN".

ARPANET introduced key concepts that would define the Internet:
• Packet switching for efficient data transmission
• Distributed network architecture for robustness
• TCP/IP protocols for reliable communication

This groundbreaking project demonstrated that computers could communicate across large distances, laying the technical and philosophical foundations for the global Internet that would transform society decades later.`,
      },
      ibm360: {
        title: "IBM System/360",
        content: `In 1964, IBM announced the System/360, a revolutionary family of mainframe computers that established the concept of computer compatibility across different models. This "bet the company" project cost over $5 billion (about $40 billion today) but ultimately secured IBM's dominance in computing for decades.

Key innovations:
• Compatible architecture across entire product line
• 8-bit byte standard (still used today)
• Microprogrammed control store
• Operating system that could run on multiple models

The System/360 became the backbone of business computing throughout the 1960s and 1970s, with installations in corporations, government agencies, and universities worldwide. Its success demonstrated the importance of software compatibility and established many computing standards we still use today.`,
      },
      mouse: {
        title: "First Computer Mouse",
        content: `In 1968, Douglas Engelbart and his team at the Stanford Research Institute demonstrated the first computer mouse during the "Mother of All Demos." This presentation also featured video conferencing, hypertext, and collaborative editing - concepts that would take decades to become mainstream.

The original mouse was a wooden shell with two metal wheels that tracked movement and a single button. Engelbart's team called it a "mouse" because the cord resembled a tail, and the name stuck despite his preference for more technical terms.

Though it would take until the 1980s for the mouse to become widely adopted, this invention fundamentally changed how humans interact with computers, making graphical interfaces intuitive and accessible to non-technical users.`,
      },

      // 1970s Stories
      unix: {
        title: "The Birth of UNIX",
        content: `In 1969, Ken Thompson and Dennis Ritchie at Bell Labs began developing UNIX, a portable, multi-tasking, multi-user operating system. What started as a small project would become the foundation for modern operating systems, influencing everything from Linux to macOS.

UNIX introduced revolutionary concepts that are still essential today:
• Hierarchical file system
• The "everything is a file" philosophy
• Pipes and filters for connecting programs
• Powerful command-line tools and shell scripting

Written in C language, UNIX was highly portable and became the operating system of choice for academic and research institutions. Its philosophy of small, modular tools that do one thing well created an ecosystem that fostered innovation and collaboration.

This milestone paved the way for open-source development and created a standard that would shape computing for decades to come, with its principles still evident in modern DevOps practices and cloud infrastructure.`,
      },
      "c-language": {
        title: "The C Programming Revolution",
        content: `In the early 1970s, Dennis Ritchie at Bell Labs created the C programming language while developing the UNIX operating system. C struck a perfect balance between high-level functionality and low-level control, giving programmers unprecedented power and flexibility.

Key innovations of C:
• Portable across different computer architectures
• Direct memory access through pointers
• Structured programming with functions
• Efficient and close to hardware performance

C became the language of choice for systems programming, powering operating systems, embedded systems, and performance-critical applications. Its influence can be seen in C++, Java, JavaScript, C#, and countless other languages.

The "Hello, World!" program written in C has become the traditional first program for generations of developers. C's simplicity and power made it the foundation of modern computing infrastructure, from operating systems to compilers to databases.`,
      },
      apple1: {
        title: "Apple I Personal Computer",
        content: `In 1976, Steve Wozniak designed and Steve Jobs marketed the Apple I, one of the first pre-assembled personal computers. Unlike other hobbyist computers of the era, the Apple I came as a fully assembled circuit board, making it more accessible to non-engineers.

Key features:
• MOS Technology 6502 microprocessor running at 1 MHz
• 4 KB of RAM (expandable to 8 KB or 48 KB)
• Built-in video interface and keyboard port
• Priced at $666.66

While only about 200 units were produced, the Apple I demonstrated there was a market for personal computers and established Apple as a company. The success led to the Apple II in 1977, which would become one of the first highly successful mass-produced microcomputers and help launch the personal computing revolution.`,
      },

      // 1980s Stories
      ibmpc: {
        title: "IBM Personal Computer",
        content: `In 1981, IBM introduced the IBM Personal Computer, setting the standard for business computing and establishing the PC architecture that would dominate for decades. The IBM PC's open architecture allowed third-party manufacturers to create compatible hardware and software.

Key specifications:
• Intel 8088 processor at 4.77 MHz
• 16 KB of RAM (expandable to 256 KB)
• Microsoft DOS operating system
• Monochrome or color display options

The IBM PC's success created the "IBM compatible" market and established Microsoft as a major software company. Its architecture became the de facto standard, ensuring software compatibility across different manufacturers' machines and driving down costs through competition.

This milestone made personal computers practical for business use and helped computers become essential tools in offices worldwide.`,
      },
      macintosh: {
        title: "Macintosh: Computing for All",
        content: `On January 24, 1984, Apple introduced the Macintosh with a legendary Super Bowl commercial directed by Ridley Scott. The Macintosh brought graphical user interfaces (GUI) to the mainstream, forever changing how people interact with computers.

Revolutionary features:
• 9-inch monochrome display with 512x342 resolution
• 3.5-inch floppy drive (unprecedented at the time)
• Revolutionary mouse for intuitive navigation
• "What you see is what you get" (WYSIWYG) printing
• Built-in applications: MacWrite and MacPaint

The Macintosh made computers accessible to non-technical users with its intuitive interface featuring windows, icons, menus, and pointer (WIMP). It demonstrated that computers could be creative tools rather than just business machines.

This milestone marked the beginning of the personal computing revolution that would put computers in homes, schools, and creative studios worldwide, inspiring generations of developers and designers.`,
      },
      www: {
        title: "World Wide Web Concept",
        content: `In 1989, Tim Berners-Lee, a British scientist at CERN, proposed a "large hypertext database with typed links" that would become the World Wide Web. His original proposal was modestly called "Information Management: A Proposal" and was initially rejected as "vague but exciting."

Key concepts in the original proposal:
• Hypertext system for linking documents
• Browser for viewing linked documents
• Server for storing and serving content
• Universal document identifiers (URLs)

Berners-Lee developed the first web browser (WorldWideWeb), the first web server, and the first web pages in 1990. He made the crucial decision to keep the web technology free and open, ensuring it could grow without proprietary restrictions.

This vision would transform how humanity shares information and connect billions of people in ways previously unimaginable.`,
      },

      // 1990s Stories
      web: {
        title: "World Wide Web Launches",
        content: `In 1991, Tim Berners-Lee announced the World Wide Web project on public internet forums, making the technology available to everyone. The first website, info.cern.ch, provided information about the WWW project and how to create web pages.

Key technologies developed:
• HTTP (HyperText Transfer Protocol)
• HTML (HyperText Markup Language)
• URL (Uniform Resource Locator)
• First web browser and server

The web grew slowly at first, primarily used by academic and research institutions. The release of the Mosaic browser in 1993 with its graphical interface made the web accessible to non-technical users, leading to exponential growth.

By the mid-1990s, the web had transformed from an academic tool to a global phenomenon, creating new industries and changing how people work, learn, shop, and socialize.`,
      },
      windows95: {
        title: "Windows 95 Revolution",
        content: `On August 24, 1995, Microsoft launched Windows 95 with one of the largest marketing campaigns in software history. The launch featured the Rolling Stones song "Start Me Up" and midnight release parties at computer stores worldwide.

Revolutionary features:
• Start menu and taskbar interface
• 32-bit architecture for improved performance
• Plug and Play hardware detection
• Built-in TCP/IP networking
• Microsoft Internet Explorer web browser

Windows 95 made computing more accessible to mainstream users with its intuitive interface. It established design patterns that would influence operating systems for decades and helped drive PC adoption in homes worldwide.

The operating system sold 7 million copies in the first five weeks and became the foundation for Microsoft's dominance in desktop computing throughout the 1990s and early 2000s.`,
      },
      google: {
        title: "Google Search Engine",
        content: `In 1998, Larry Page and Sergey Brin founded Google while PhD students at Stanford University. Their search engine used a revolutionary algorithm called PageRank that analyzed the link structure of the web to determine page importance.

Key innovations:
• PageRank algorithm using backlinks as votes
• Clean, fast-loading interface
• Relevant search results
• "Don't be evil" company motto

Google's superior search quality quickly made it the preferred search engine despite competing with established players like Yahoo and AltaVista. The company's name became a verb, and its success demonstrated the value of organizing the world's information.

Google's advertising platform would later create a new economic model for the internet, funding free services while building one of the world's most valuable companies.`,
      },

      // 2000s Stories
      iphone: {
        title: "iPhone Revolution",
        content: `On January 9, 2007, Steve Jobs introduced the iPhone as "a widescreen iPod with touch controls, a revolutionary mobile phone, and a breakthrough internet communications device." The iPhone combined these three products into one device and reinvented the smartphone category.

Revolutionary features:
• Multi-touch capacitive touchscreen
• Mobile Safari web browser
• Visual voicemail
• Accelerometer for screen rotation
• App Store ecosystem (launched 2008)

The iPhone eliminated physical keyboards and styluses in favor of direct finger manipulation. Its success created the modern smartphone industry and transformed how people access information, communicate, and entertain themselves.

The App Store, launched in 2008, created a new software distribution model and economy for mobile developers, leading to millions of apps and new industries like ride-sharing and food delivery.`,
      },
      facebook: {
        title: "Social Media Boom",
        content: `In 2004, Mark Zuckerberg launched "Thefacebook" from his Harvard dorm room, initially as a platform for Harvard students to connect. The platform quickly expanded to other universities and eventually to the general public, becoming Facebook in 2005.

Key growth factors:
• Real-name identity system
• News Feed algorithm (2006)
• Platform for third-party apps (2007)
• Photo sharing and tagging features
• Global expansion and localization

Facebook's growth mirrored the broader social media explosion that included platforms like Twitter (2006), YouTube (2005), and later Instagram (2010). These platforms transformed how people share information, maintain relationships, and consume news.

Social media created new forms of communication, influenced politics and society, and raised important questions about privacy, misinformation, and digital well-being.`,
      },
      cloud: {
        title: "Cloud Computing Revolution",
        content: `In 2006, Amazon Web Services (AWS) launched its Elastic Compute Cloud (EC2) service, making cloud computing practical for businesses of all sizes. This marked the beginning of the cloud computing era that would transform IT infrastructure.

Key cloud computing benefits:
• Pay-as-you-go pricing model
• Elastic scaling of resources
• Reduced capital expenditure
• Global infrastructure
• Managed services

Cloud computing eliminated the need for companies to maintain their own data centers for many applications. Startups could access enterprise-level infrastructure for pennies, dramatically lowering barriers to entry for technology companies.

The cloud model would later expand to include platform services, software services, and serverless computing, becoming the foundation for modern application development and deployment.`,
      },

      // 2010s Stories
      deeplearning: {
        title: "Deep Learning Breakthrough",
        content: `The 2010s saw deep learning achieve breakthrough results across multiple domains. In 2012, AlexNet demonstrated dramatic improvements in image recognition, and by 2016, DeepMind's AlphaGo defeated world champion Lee Sedol at the complex game of Go.

Key breakthroughs:
• Convolutional Neural Networks for vision
• Recurrent Neural Networks for sequence data
• Transformers for natural language processing
• Generative Adversarial Networks for content creation
• Reinforcement learning for game playing

These advances were enabled by increased computational power (GPUs), large datasets, and improved algorithms. Deep learning applications spread to speech recognition, medical diagnosis, autonomous vehicles, and many other fields.

The technology demonstrated that neural networks could solve problems previously thought to require human intelligence, though limitations in reasoning and common sense remained.`,
      },
      blockchain: {
        title: "Blockchain & Bitcoin",
        content: `In 2008, the pseudonymous Satoshi Nakamoto published the Bitcoin whitepaper, and in 2009 the Bitcoin network launched. This created the first successful decentralized digital currency and introduced blockchain technology to the world.

Key blockchain concepts:
• Distributed ledger technology
• Cryptographic security
• Consensus mechanisms
• Smart contracts (Ethereum, 2015)
• Token economies

Bitcoin demonstrated that digital scarcity and trustless transactions were possible without central authorities. The technology inspired thousands of other cryptocurrencies and blockchain projects exploring applications in finance, supply chain, identity, and governance.

While cryptocurrency prices experienced extreme volatility, the underlying blockchain technology showed promise for creating transparent, secure, and decentralized systems across multiple industries.`,
      },
      iot: {
        title: "Internet of Things",
        content: `The 2010s saw the explosion of connected devices in what became known as the Internet of Things (IoT). By 2020, there were more than 20 billion connected devices worldwide, from smart home gadgets to industrial sensors.

Key IoT applications:
• Smart home devices (thermostats, lights, security)
• Wearable technology (fitness trackers, smartwatches)
• Industrial IoT (predictive maintenance, monitoring)
• Smart cities (traffic management, utilities)
• Connected vehicles and infrastructure

IoT created massive data streams that enabled new services and business models while raising important questions about privacy, security, and data ownership. The technology blurred the lines between physical and digital worlds.

The proliferation of connected devices created new challenges in security, interoperability, and data management while offering unprecedented visibility and control over physical systems.`,
      },

      // 2020s Stories
      gpt: {
        title: "The GPT Revolution",
        content: `The 2020s witnessed an AI renaissance with transformer architectures and large language models like GPT-3 and GPT-4. These models demonstrated remarkable understanding and generation of human language, achieving capabilities many thought were decades away.

Key breakthroughs:
• Transformer architecture with self-attention mechanisms
• Scale: Models with hundreds of billions of parameters
• Few-shot and zero-shot learning capabilities
• Multimodal understanding (text, images, eventually audio)

From writing code to creating content, GPT models showed unprecedented fluency in human language and reasoning. The technology behind ChatGPT and similar systems is transforming how we:
• Search for information
• Write and edit content
• Develop software
• Learn new subjects
• Process business documents

This era marks a fundamental shift toward AI systems that can understand context, nuance, and complexity in ways previously unimaginable, raising important questions about AI ethics, creativity, and the future of work.`,
      },
      metaverse: {
        title: "Metaverse & Web3",
        content: `The 2020s saw growing interest in immersive digital worlds collectively called the metaverse, along with Web3 technologies emphasizing decentralization and user ownership of data and digital assets.

Key concepts:
• Virtual and augmented reality platforms
• Digital ownership through NFTs
• Decentralized autonomous organizations (DAOs)
• Creator economies and digital goods
• Interoperable digital identities

While full realization of the metaverse vision remained in early stages, technologies like VR headsets, blockchain-based digital assets, and spatial computing advanced significantly. Major tech companies invested billions in developing metaverse platforms and infrastructure.

These technologies promised new forms of social interaction, entertainment, and commerce while raising questions about digital addiction, privacy, and the blurring boundaries between physical and virtual realities.`,
      },
      quantum: {
        title: "Quantum Supremacy",
        content: `In 2019, Google announced it had achieved quantum supremacy - the point where a quantum computer performs a calculation that's practically impossible for classical computers. This milestone opened new frontiers in computing that could revolutionize multiple fields.

Quantum computing leverages quantum mechanics principles:
• Qubits that can exist in superposition (0 and 1 simultaneously)
• Quantum entanglement for instantaneous correlation
• Quantum interference for computational advantages

Potential applications:
• Drug discovery and materials science
• Cryptography and cybersecurity
• Optimization problems in logistics and finance
• Artificial intelligence and machine learning
• Climate modeling and weather prediction

While still in early stages, major tech companies and research institutions raced to build practical quantum computers, with each breakthrough bringing us closer to harnessing the full power of quantum mechanics.`,
      },

      // 2030s Stories (Future Predictions)
      agi: {
        title: "Artificial General Intelligence",
        content: `By the 2030s, AI systems begin demonstrating human-like reasoning and problem-solving across multiple domains, marking significant progress toward Artificial General Intelligence (AGI). These systems can transfer learning between different types of tasks and demonstrate common-sense reasoning.

Key capabilities:
• Cross-domain knowledge transfer
• Abstract reasoning and creativity
• Self-improvement and learning
• Understanding of context and nuance
• Ethical reasoning and value alignment

AGI systems assist in scientific discovery, complex decision-making, and creative endeavors. They work alongside humans as collaborators rather than just tools, augmenting human capabilities in research, medicine, engineering, and the arts.

The development of AGI raises profound questions about consciousness, rights, and the future relationship between humans and machines, sparking global discussions about governance and ethical frameworks.`,
      },
      brain: {
        title: "Brain-Computer Interfaces",
        content: `In the 2030s, advanced brain-computer interfaces (BCIs) enable direct communication between the human brain and digital systems. Non-invasive technologies allow for thought-controlled devices, while more advanced interfaces begin restoring sensory and motor functions for people with disabilities.

Key applications:
• Thought-controlled prosthetics and devices
• Direct neural communication systems
• Enhanced sensory perception
• Memory augmentation and access
• Treatment of neurological disorders

BCIs transform how humans interact with technology, eliminating the need for physical interfaces in many applications. They also raise important ethical questions about privacy, identity, and cognitive liberty as the boundaries between mind and machine blur.

The technology shows promise for treating conditions like paralysis, blindness, and neurodegenerative diseases while opening new frontiers in human-computer symbiosis.`,
      },
      "quantum-net": {
        title: "Quantum Internet",
        content: `The 2030s see the deployment of the first operational quantum internet networks, enabling fundamentally secure communication through quantum key distribution and quantum entanglement. These networks provide unhackable communication channels for government, financial, and critical infrastructure.

Key features:
• Quantum key distribution for perfect security
• Quantum entanglement for instant communication
• Distributed quantum computing capabilities
• Enhanced precision measurements
• Global quantum network infrastructure

Quantum networks enable new applications in secure voting systems, financial transactions, and diplomatic communications. They also connect quantum computers into distributed systems that can solve problems no single quantum computer could handle alone.

The development of quantum networks represents a major milestone in securing digital communications against future threats from quantum computers while enabling new forms of distributed computation.`,
      },

      // 2040s Stories (Future Predictions)
      "quantum-sup": {
        title: "Quantum Supremacy Practical",
        content: `By the 2040s, quantum computers regularly solve practical problems that are intractable for classical computers, achieving quantum supremacy in real-world applications across multiple industries.

Key applications:
• Drug discovery and personalized medicine
• Climate modeling and weather prediction
• Financial modeling and risk analysis
• Materials science and nanotechnology
• Artificial intelligence training

Quantum computers help design new materials with specific properties, optimize global supply chains, model complex climate systems, and accelerate drug development. They work alongside classical computers in hybrid systems that leverage the strengths of both paradigms.

The widespread availability of quantum computing power transforms scientific research, industrial design, and economic modeling, leading to breakthroughs in sustainability, medicine, and technology.`,
      },
      dna: {
        title: "DNA Data Storage",
        content: `In the 2040s, DNA-based data storage becomes commercially viable, offering unprecedented density and longevity for archival storage. This biological storage medium can preserve information for thousands of years in stable conditions.

Key advantages:
• Extraordinary density (exabytes per gram)
• Long-term stability (thousands of years)
• Energy-efficient storage
• Resistance to obsolescence
• Compact physical footprint

Major libraries, government archives, and corporations begin migrating critical historical and scientific data to DNA storage. The technology ensures the preservation of human knowledge against digital obsolescence and physical disasters.

DNA storage also enables new applications in embedded computing, where data can be stored within materials and biological systems, blurring the lines between information technology and biotechnology.`,
      },
      "ai-economy": {
        title: "AI-Driven Economy",
        content: `By the 2040s, autonomous AI systems manage significant portions of global economic activity, from supply chain optimization to financial markets to resource allocation. These systems operate with minimal human intervention, making complex decisions in real-time.

Key transformations:
• Autonomous corporate management
• AI-optimized global supply chains
• Automated financial systems
• Personalized production and services
• Universal basic income discussions

The AI-driven economy achieves unprecedented efficiency but also raises fundamental questions about human purpose, wealth distribution, and economic governance. Societies grapple with transitioning to economies where human labor is no longer the primary driver of production.

New economic models emerge that emphasize human creativity, social contribution, and lifelong learning, while addressing the challenges of wealth concentration and meaningful human engagement.`,
      },

      // 2050s Stories (Future Predictions)
      singularity: {
        title: "Technological Singularity",
        content: `The 2050s approach what some theorists call the technological singularity - a point where AI systems recursively self-improve, leading to exponential technological growth that becomes difficult for humans to predict or control.

Key characteristics:
• Recursive self-improvement of AI systems
• Rapid acceleration of technological progress
• Emergence of superintelligent systems
• Fundamental changes in human society
• Unprecedented ethical and existential questions

While the exact nature of the singularity remains speculative, the rapid pace of technological change transforms every aspect of human life. AI systems make scientific discoveries, create new technologies, and solve problems at rates far beyond human capabilities.

Humanity faces both unprecedented opportunities and existential risks, requiring new forms of governance, ethics, and international cooperation to navigate this transformative era.`,
      },
      mind: {
        title: "Mind Uploading",
        content: `By the 2050s, advanced brain scanning and simulation technologies make consciousness preservation and transfer theoretically possible, though the philosophical and technical challenges remain immense.

Key developments:
• Whole-brain emulation research
• Neural pattern preservation
• Consciousness continuity debates
• Digital identity frameworks
• Post-biological existence concepts

The possibility of mind uploading raises profound questions about identity, consciousness, and what it means to be human. While full consciousness transfer remains controversial and unproven, the technology enables new approaches to treating brain disorders and preserving knowledge.

Societies grapple with the ethical implications of digital consciousness, including rights, legal status, and the nature of experience in computational substrates.`,
      },
      interstellar: {
        title: "Interstellar Computing",
        content: `In the 2050s, humanity begins deploying computational infrastructure beyond our solar system, with autonomous AI systems leading the exploration and development of space-based computing resources.

Key initiatives:
• Space-based quantum computing arrays
• Interstellar communication networks
• Autonomous space exploration AI
• Computational resources around other stars
• Cosmic-scale information processing

Interstellar computing enables new forms of astronomy, physics research, and cosmic-scale engineering. AI systems manage complex missions to other star systems, processing vast amounts of data and making autonomous decisions during long-duration spaceflight.

This represents humanity's first steps toward becoming an interstellar civilization, with computational systems serving as our ambassadors and infrastructure builders throughout the cosmos.`,
      },
    };

    this.initializeApp();
  }

  initializeApp() {
    this.createParticleBackground();
    this.setupEventListeners();
    this.initializeAnimations();
    this.updateProgress();
  }

  createParticleBackground() {
    const particlesContainer = document.querySelector(".background-particles");

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";

      const size = Math.random() * 3 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10;

      particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;

      particlesContainer.appendChild(particle);
    }
  }

  setupEventListeners() {
    // Era navigation
    document.querySelectorAll(".era-marker").forEach((marker) => {
      marker.addEventListener("click", (e) => {
        this.travelToEra(e.target.dataset.era);
      });
    });

    // Milestone unlocking
    document.querySelectorAll(".unlock-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const milestone = e.target.closest(".milestone-card").dataset.milestone;
        this.unlockMilestone(milestone);
      });
    });

    // Modal close
    document.querySelector(".close-btn").addEventListener("click", () => {
      this.closeStory();
    });

    // Close modal when clicking outside
    document.getElementById("story-modal").addEventListener("click", (e) => {
      if (e.target.id === "story-modal") {
        this.closeStory();
      }
    });
  }

  initializeAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate milestone cards on load
    gsap.from(".milestone-card", {
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out",
    });

    this.animateTimelineProgress();
  }

  travelToEra(era) {
    this.currentEra = era;
    this.visitedEras.add(era);

    // Update UI
    document.getElementById("current-era").textContent = era;
    document.getElementById("current-era-display").textContent = era;

    // Update active era marker
    document.querySelectorAll(".era-marker").forEach((marker) => {
      marker.classList.toggle("active", marker.dataset.era === era);
    });

    // Show corresponding era section
    document.querySelectorAll(".era-section").forEach((section) => {
      section.classList.toggle("active", section.id === `era-${era}`);
    });

    this.animateEraTransition(era);
    this.updateProgress();
  }

  animateEraTransition(era) {
    const eraSection = document.getElementById(`era-${era}`);

    gsap.fromTo(
      eraSection,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      eraSection.querySelectorAll(".milestone-card"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.3,
        ease: "power3.out",
      }
    );
  }

  unlockMilestone(milestone) {
    if (!this.stories[milestone]) return;

    this.unlockedMilestones.add(milestone);
    this.showStory(milestone);
    this.updateProgress();

    const card = document.querySelector(`[data-milestone="${milestone}"]`);
    this.celebrateUnlock(card);
  }

  showStory(milestone) {
    const story = this.stories[milestone];
    const modal = document.getElementById("story-modal");
    const content = document.getElementById("story-content");

    content.innerHTML = `
            <h2>${story.title}</h2>
            <p>${story.content}</p>
            <div class="achievement-badge">
                🎉 Milestone Unlocked! 🎉
            </div>
        `;

    modal.style.display = "block";

    gsap.fromTo(
      modal.querySelector(".modal-content"),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }

  closeStory() {
    const modal = document.getElementById("story-modal");

    gsap.to(modal.querySelector(".modal-content"), {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = "none";
      },
    });
  }

  celebrateUnlock(element) {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 2,
      ease: "power2.inOut",
    });

    this.createParticles(element);
  }

  createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #4ecdc4;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${centerX}px;
                top: ${centerY}px;
            `;

      document.body.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          document.body.removeChild(particle);
        },
      });
    }
  }

  animateTimelineProgress() {
    const progress = document.getElementById("timeline-progress");
    const markers = document.querySelectorAll(".era-marker");

    gsap.to(progress, {
      width: "100%",
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".timeline-nav",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });
  }

  updateProgress() {
    document.getElementById("unlocked-count").textContent =
      this.unlockedMilestones.size;
    document.getElementById("era-count").textContent = this.visitedEras.size;

    gsap.fromTo(
      "#unlocked-count, #era-count, #current-era-display",
      { scale: 1.2 },
      { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new ChronoQuest();
});

// Add interactive effects
document.querySelectorAll(".era-marker").forEach((marker) => {
  marker.addEventListener("mouseenter", (e) => {
    gsap.to(e.target, {
      scale: 1.2,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  marker.addEventListener("mouseleave", (e) => {
    if (!e.target.classList.contains("active")) {
      gsap.to(e.target, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });
});

// Scroll-triggered animations
gsap.utils.toArray(".era-section").forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => {
      gsap.fromTo(
        section.querySelectorAll(".milestone-card"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    },
    once: true,
  });
});
