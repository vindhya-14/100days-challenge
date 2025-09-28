// DOM Elements
const visualization = document.getElementById('visualization');
const algorithmSelect = document.getElementById('algorithm');
const packetRateSlider = document.getElementById('packetRate');
const packetRateValue = document.getElementById('packetRateValue');
const routerCapacitySlider = document.getElementById('routerCapacity');
const routerCapacityValue = document.getElementById('routerCapacityValue');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const sentCount = document.getElementById('sentCount');
const deliveredCount = document.getElementById('deliveredCount');
const lostCount = document.getElementById('lostCount');
const queueSize = document.getElementById('queueSize');
const deliveryRate = document.getElementById('deliveryRate');
const algorithmInfo = document.getElementById('algorithmInfo');

// Simulation state
let simulationRunning = false;
let simulationInterval;
let packetCounter = 0;
let packetsSent = 0;
let packetsDelivered = 0;
let packetsLost = 0;
let queue = [];
let routerCapacity = 15;
let packetRate = 5; // packets per second
let algorithm = 'none';

// Algorithm information
const algorithmDescriptions = {
    none: `In this scenario, there is <span class="highlight">no congestion control</span>. 
    Packets are sent at a constant rate regardless of network conditions. When the router's queue fills up, 
    newly arriving packets are dropped, leading to <span class="highlight">high packet loss</span> and 
    <span class="highlight">reduced throughput</span>.`,

    aimd: `<span class="highlight">AIMD (Additive Increase Multiplicative Decrease)</span> is the basis for TCP congestion control.
    The sender gradually increases its transmission rate (additive increase) until packet loss is detected.
    When loss occurs, the transmission rate is drastically reduced (multiplicative decrease).
    This creates a <span class="highlight">sawtooth pattern</span> that efficiently utilizes available bandwidth.`,

    red: `<span class="highlight">RED (Random Early Detection)</span> is a router-based congestion avoidance mechanism.
    Instead of waiting for the queue to completely fill up, RED starts randomly dropping packets 
    when the average queue size exceeds a threshold. This <span class="highlight">signals congestion early</span> 
    to TCP senders, allowing them to reduce their transmission rates before severe congestion occurs.`,

    fair: `<span class="highlight">Fair Queuing</span> aims to provide fair bandwidth allocation among multiple flows.
    The router maintains separate queues for different flows and services them in a round-robin fashion.
    This prevents <span class="highlight">aggressive flows</span> from monopolizing bandwidth and ensures 
    <span class="highlight">fairness</span> for all connections.`
};

// Initialize visualization
function initializeVisualization() {
    visualization.innerHTML = '';
    
    // Create router
    const router = document.createElement('div');
    router.className = 'router';
    router.id = 'router';
    router.style.left = '50%';
    router.style.top = '50%';
    router.style.transform = 'translate(-50%, -50%)';
    router.textContent = 'Router';
    visualization.appendChild(router);
    
    // Create queue visualization
    const queueViz = document.createElement('div');
    queueViz.className = 'queue';
    queueViz.id = 'queueViz';
    queueViz.style.left = 'calc(50% + 80px)';
    queueViz.style.top = 'calc(50% - 100px)';
    visualization.appendChild(queueViz);
    
    const queueFill = document.createElement('div');
    queueFill.className = 'queue-fill';
    queueFill.id = 'queueFill';
    queueFill.style.height = '0%';
    queueViz.appendChild(queueFill);
    
    updateQueueDisplay();
}

// Update queue visualization
function updateQueueDisplay() {
    const queueFill = document.getElementById('queueFill');
    const router = document.getElementById('router');
    const fillPercentage = (queue.length / routerCapacity) * 100;
    
    queueFill.style.height = `${fillPercentage}%`;
    queueSize.textContent = `${queue.length}/${routerCapacity}`;
    
    // Change color and add congestion effect if queue is high
    if (fillPercentage > 80) {
        queueFill.classList.add('high');
        router.classList.add('congested');
    } else {
        queueFill.classList.remove('high');
        router.classList.remove('congested');
    }
}

// Create a new packet
function createPacket() {
    packetsSent++;
    packetCounter++;
    sentCount.textContent = packetsSent;
    
    const packet = document.createElement('div');
    packet.className = 'data-packet';
    packet.id = `packet-${packetCounter}`;
    
    // Random starting position on left side
    const startY = Math.random() * (visualization.offsetHeight - 40) + 20;
    packet.style.left = '20px';
    packet.style.top = `${startY}px`;
    
    visualization.appendChild(packet);
    
    // Animate packet moving toward router
    const router = document.getElementById('router');
    const routerRect = router.getBoundingClientRect();
    const vizRect = visualization.getBoundingClientRect();
    
    const targetX = routerRect.left - vizRect.left + routerRect.width / 2;
    const targetY = routerRect.top - vizRect.top + routerRect.height / 2;
    
    packet.style.transition = `all ${1000/packetRate}ms linear`;
    packet.style.left = `${targetX}px`;
    packet.style.top = `${targetY}px`;
    
    // Handle packet arrival at router
    setTimeout(() => {
        handlePacketArrival(packet);
    }, 1000/packetRate);
}

// Handle packet arrival at router
function handlePacketArrival(packet) {
    if (queue.length < routerCapacity) {
        // Add to queue
        queue.push(packet);
        updateQueueDisplay();
        
        // Process packet after a delay (simulating transmission time)
        setTimeout(() => {
            processPacket(packet);
        }, 500);
    } else {
        // Packet loss - queue is full
        packetsLost++;
        lostCount.textContent = packetsLost;
        packet.classList.add('lost');
        
        // Remove packet after animation
        setTimeout(() => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        }, 500);
    }
    
    updateDeliveryRate();
}

// Process packet from queue
function processPacket(packet) {
    // Remove from queue
    const index = queue.indexOf(packet);
    if (index > -1) {
        queue.splice(index, 1);
    }
    
    updateQueueDisplay();
    
    // Animate packet moving to right side (destination)
    packet.style.transition = `all ${1000/packetRate}ms linear`;
    packet.style.left = `${visualization.offsetWidth - 40}px`;
    
    // Mark as delivered after animation
    setTimeout(() => {
        packetsDelivered++;
        deliveredCount.textContent = packetsDelivered;
        
        if (packet.parentNode) {
            packet.parentNode.removeChild(packet);
        }
        
        updateDeliveryRate();
    }, 1000/packetRate);
}

// Update delivery rate statistic
function updateDeliveryRate() {
    const rate = packetsSent > 0 ? (packetsDelivered / packetsSent * 100).toFixed(1) : 0;
    deliveryRate.textContent = `${rate}%`;
}

// Start simulation
function startSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    startBtn.textContent = 'Pause Simulation';
    
    // Apply selected algorithm
    algorithm = algorithmSelect.value;
    algorithmInfo.innerHTML = algorithmDescriptions[algorithm];
    
    // Adjust simulation based on algorithm
    let adjustedPacketRate = packetRate;
    
    if (algorithm === 'aimd') {
        // AIMD: Vary packet rate based on congestion
        simulationInterval = setInterval(() => {
            const congestionLevel = queue.length / routerCapacity;
            
            if (congestionLevel > 0.8) {
                // Multiplicative decrease
                adjustedPacketRate = Math.max(1, Math.floor(adjustedPacketRate * 0.5));
            } else if (congestionLevel < 0.5) {
                // Additive increase
                adjustedPacketRate = Math.min(20, adjustedPacketRate + 1);
            }
            
            createPacket();
        }, 1000 / adjustedPacketRate);
        
    } else if (algorithm === 'red') {
        // RED: Random early detection
        simulationInterval = setInterval(() => {
            const avgQueueSize = queue.length;
            const maxThreshold = routerCapacity * 0.8;
            const minThreshold = routerCapacity * 0.2;
            
            if (avgQueueSize > maxThreshold) {
                // Always drop packets when above max threshold
                packetsLost++;
                lostCount.textContent = packetsLost;
                updateDeliveryRate();
            } else if (avgQueueSize > minThreshold) {
                // Randomly drop packets with increasing probability
                const dropProbability = (avgQueueSize - minThreshold) / (maxThreshold - minThreshold);
                if (Math.random() < dropProbability) {
                    packetsLost++;
                    lostCount.textContent = packetsLost;
                    updateDeliveryRate();
                } else {
                    createPacket();
                }
            } else {
                // No dropping below min threshold
                createPacket();
            }
        }, 1000 / packetRate);
        
    } else if (algorithm === 'fair') {
        // Fair Queuing: Simulate multiple flows
        const flows = [
            { id: 1, rate: packetRate / 3 },
            { id: 2, rate: packetRate / 3 },
            { id: 3, rate: packetRate / 3 }
        ];
        
        let flowIndex = 0;
        simulationInterval = setInterval(() => {
            // Round-robin scheduling
            const flow = flows[flowIndex];
            createPacket();
            
            flowIndex = (flowIndex + 1) % flows.length;
        }, 1000 / (packetRate / 3));
        
    } else {
        // No congestion control
        simulationInterval = setInterval(() => {
            createPacket();
        }, 1000 / packetRate);
    }
}

// Pause simulation
function pauseSimulation() {
    simulationRunning = false;
    startBtn.textContent = 'Resume Simulation';
    clearInterval(simulationInterval);
}

// Reset simulation
function resetSimulation() {
    pauseSimulation();
    
    // Reset statistics
    packetsSent = 0;
    packetsDelivered = 0;
    packetsLost = 0;
    packetCounter = 0;
    queue = [];
    
    // Update UI
    sentCount.textContent = '0';
    deliveredCount.textContent = '0';
    lostCount.textContent = '0';
    deliveryRate.textContent = '0%';
    queueSize.textContent = `0/${routerCapacity}`;
    
    // Reset visualization
    initializeVisualization();
    startBtn.textContent = 'Start Simulation';
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (simulationRunning) {
        pauseSimulation();
    } else {
        startSimulation();
    }
});

resetBtn.addEventListener('click', resetSimulation);

packetRateSlider.addEventListener('input', () => {
    packetRate = parseInt(packetRateSlider.value);
    packetRateValue.textContent = packetRate;
});

routerCapacitySlider.addEventListener('input', () => {
    routerCapacity = parseInt(routerCapacitySlider.value);
    routerCapacityValue.textContent = routerCapacity;
    queueSize.textContent = `0/${routerCapacity}`;
});

algorithmSelect.addEventListener('change', () => {
    algorithmInfo.innerHTML = algorithmDescriptions[algorithmSelect.value];
    if (simulationRunning) {
        pauseSimulation();
        startSimulation();
    }
});


initializeVisualization();