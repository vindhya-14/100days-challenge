class MicroservicesVisualizer {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.services = new Map();
        this.connections = [];
        this.selectedService = null;
        this.draggingService = null;
        this.currentProtocol = 'REST';
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.animate();
    }

    setupEventListeners() {
        // Protocol selection
        document.querySelectorAll('.protocol-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.protocol-option').forEach(opt => opt.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentProtocol = e.currentTarget.dataset.protocol;
                document.getElementById('currentProtocol').textContent = this.currentProtocol;
                this.updateMethodOptions();
            });
        });

        // Button events
        document.getElementById('addService').addEventListener('click', () => this.showServiceModal());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportConfiguration());

        // Modal events
        document.getElementById('saveService').addEventListener('click', () => this.saveService());
        document.getElementById('cancelService').addEventListener('click', () => this.hideServiceModal());
        document.getElementById('saveConnection').addEventListener('click', () => this.saveConnection());
        document.getElementById('cancelConnection').addEventListener('click', () => this.hideConnectionModal());

        // Close modals when clicking X
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Canvas events
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });

        // Window resize
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }

    showServiceModal(service = null) {
        const modal = document.getElementById('serviceModal');
        if (service) {
            // Edit mode
            document.getElementById('serviceName').value = service.name;
            document.getElementById('serviceColor').value = service.color;
            document.getElementById('serviceType').value = service.type;
            modal.dataset.editingId = service.id;
        } else {
            // Add mode
            document.getElementById('serviceName').value = '';
            document.getElementById('serviceColor').value = '#4f46e5';
            document.getElementById('serviceType').value = 'Custom';
            delete modal.dataset.editingId;
        }
        modal.style.display = 'block';
    }

    hideServiceModal() {
        document.getElementById('serviceModal').style.display = 'none';
    }

    showConnectionModal(fromService, toService) {
        const modal = document.getElementById('connectionModal');
        document.getElementById('fromService').textContent = fromService.name;
        document.getElementById('toService').textContent = toService.name;
        modal.dataset.fromId = fromService.id;
        modal.dataset.toId = toService.id;
        this.updateMethodOptions();
        modal.style.display = 'block';
    }

    hideConnectionModal() {
        document.getElementById('connectionModal').style.display = 'none';
    }

    updateMethodOptions() {
        const methodSelect = document.getElementById('method');
        methodSelect.innerHTML = '';

        const methods = {
            'REST': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            'gRPC': ['UNARY', 'SERVER_STREAMING', 'CLIENT_STREAMING', 'BIDI_STREAMING'],
            'MQ': ['PUBLISH', 'SUBSCRIBE', 'SEND', 'RECEIVE']
        };

        methods[this.currentProtocol].forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method;
            methodSelect.appendChild(option);
        });
    }

    saveService() {
        const name = document.getElementById('serviceName').value.trim();
        const color = document.getElementById('serviceColor').value;
        const type = document.getElementById('serviceType').value;

        if (!name) {
            alert('Please enter a service name');
            return;
        }

        const modal = document.getElementById('serviceModal');
        if (modal.dataset.editingId) {
            // Update existing service
            const service = this.services.get(modal.dataset.editingId);
            service.name = name;
            service.color = color;
            service.type = type;
        } else {
            // Create new service
            const id = 'service_' + Date.now();
            const service = {
                id,
                name,
                color,
                type,
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                radius: 40
            };
            this.services.set(id, service);
        }

        this.hideServiceModal();
        this.updateServicesList();
        this.updateStats();
    }

    saveConnection() {
        const modal = document.getElementById('connectionModal');
        const fromId = modal.dataset.fromId;
        const toId = modal.dataset.toId;
        const endpoint = document.getElementById('endpoint').value.trim();
        const method = document.getElementById('method').value;
        const dataFlow = document.getElementById('dataFlow').value.trim();

        if (!endpoint) {
            alert('Please enter an endpoint or queue name');
            return;
        }

        const connectionId = `${fromId}_${toId}`;
        
        // Remove existing connection if any
        this.connections = this.connections.filter(conn => conn.id !== connectionId);

        this.connections.push({
            id: connectionId,
            from: fromId,
            to: toId,
            protocol: this.currentProtocol,
            endpoint,
            method,
            dataFlow,
            active: true
        });

        this.hideConnectionModal();
        this.updateStats();
    }

    updateServicesList() {
        const container = document.getElementById('servicesContainer');
        container.innerHTML = '';

        this.services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.dataset.serviceId = service.id;
            
            if (this.selectedService?.id === service.id) {
                serviceElement.classList.add('active');
            }

            serviceElement.innerHTML = `
                <div class="service-color" style="background-color: ${service.color}"></div>
                <div class="service-info">
                    <div class="service-name">${service.name}</div>
                    <div class="service-type">${service.type}</div>
                </div>
                <div class="service-actions">
                    <button class="service-action edit-service" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="service-action delete-service" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add event listeners for actions
            serviceElement.querySelector('.edit-service').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showServiceModal(service);
            });

            serviceElement.querySelector('.delete-service').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteService(service.id);
            });

            serviceElement.addEventListener('click', () => {
                this.selectService(service);
            });

            container.appendChild(serviceElement);
        });

        // Show/hide no services message
        document.getElementById('noServicesMessage').style.display = 
            this.services.size === 0 ? 'flex' : 'none';
    }

    selectService(service) {
        this.selectedService = service;
        this.updateServicesList();
    }

    deleteService(serviceId) {
        if (confirm('Are you sure you want to delete this service?')) {
            this.services.delete(serviceId);
            // Remove connections involving this service
            this.connections = this.connections.filter(conn => 
                conn.from !== serviceId && conn.to !== serviceId
            );
            this.updateServicesList();
            this.updateStats();
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all services and connections?')) {
            this.services.clear();
            this.connections = [];
            this.selectedService = null;
            this.updateServicesList();
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('serviceCount').textContent = this.services.size;
        document.getElementById('connectionCount').textContent = this.connections.length;
        document.getElementById('currentProtocol').textContent = this.currentProtocol;
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked on a service
        for (const service of this.services.values()) {
            const distance = Math.sqrt((x - service.x) ** 2 + (y - service.y) ** 2);
            if (distance <= service.radius) {
                this.selectService(service);
                return;
            }
        }

        // Deselect if clicked on empty space
        this.selectedService = null;
        this.updateServicesList();
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (const service of this.services.values()) {
            const distance = Math.sqrt((x - service.x) ** 2 + (y - service.y) ** 2);
            if (distance <= service.radius) {
                this.draggingService = service;
                break;
            }
        }
    }

    handleMouseMove(e) {
        if (this.draggingService) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggingService.x = e.clientX - rect.left;
            this.draggingService.y = e.clientY - rect.top;
        }
    }

    handleMouseUp() {
        this.draggingService = null;
    }

    handleRightClick(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let clickedService = null;
        for (const service of this.services.values()) {
            const distance = Math.sqrt((x - service.x) ** 2 + (y - service.y) ** 2);
            if (distance <= service.radius) {
                clickedService = service;
                break;
            }
        }

        if (clickedService && this.selectedService && clickedService.id !== this.selectedService.id) {
            this.showConnectionModal(this.selectedService, clickedService);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (so they appear behind services)
        this.connections.forEach(connection => {
            this.drawConnection(connection);
        });

        // Draw services
        this.services.forEach(service => {
            this.drawService(service);
        });
    }

    drawService(service) {
        const ctx = this.ctx;
        
        // Service circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(service.x, service.y, service.radius, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(
            service.x, service.y, 0,
            service.x, service.y, service.radius
        );
        gradient.addColorStop(0, service.color + 'CC');
        gradient.addColorStop(1, service.color + '66');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = service === this.selectedService ? '#ffffff' : service.color;
        ctx.lineWidth = service === this.selectedService ? 3 : 2;
        ctx.stroke();
        
        // Service name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(service.name, service.x, service.y);
        
        // Service type
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Segoe UI';
        ctx.fillText(service.type, service.x, service.y + 20);
        
        ctx.restore();
    }

    drawConnection(connection) {
        const fromService = this.services.get(connection.from);
        const toService = this.services.get(connection.to);
        
        if (!fromService || !toService) return;

        const ctx = this.ctx;
        const dx = toService.x - fromService.x;
        const dy = toService.y - fromService.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate actual start and end points (edge of circles)
        const startX = fromService.x + (dx / distance) * fromService.radius;
        const startY = fromService.y + (dy / distance) * fromService.radius;
        const endX = toService.x - (dx / distance) * toService.radius;
        const endY = toService.y - (dy / distance) * toService.radius;

        // Connection line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        // Protocol-specific styling
        const colors = {
            'REST': '#10b981',
            'gRPC': '#f59e0b',
            'MQ': '#ef4444'
        };
        
        ctx.strokeStyle = colors[connection.protocol] || '#6b7280';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowLength = 10;
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowLength * Math.cos(angle - Math.PI / 6),
            endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            endX - arrowLength * Math.cos(angle + Math.PI / 6),
            endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = colors[connection.protocol] || '#6b7280';
        ctx.fill();
        
        // Connection label
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        ctx.fillStyle = colors[connection.protocol] || '#6b7280';
        ctx.font = 'bold 12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Label background
        const text = `${connection.method}: ${connection.endpoint}`;
        const textMetrics = ctx.measureText(text);
        const padding = 6;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(
            midX - textMetrics.width / 2 - padding,
            midY - 12,
            textMetrics.width + padding * 2,
            24
        );
        
        // Label text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, midX, midY);
        
        ctx.restore();
    }

    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    exportConfiguration() {
        const config = {
            services: Array.from(this.services.values()),
            connections: this.connections,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `microservices-config-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importConfiguration(config) {
        // This method can be extended to import configurations
        console.log('Import functionality can be implemented here');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MicroservicesVisualizer();
});

// Add some sample data for demonstration
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const visualizer = window.visualizer = new MicroservicesVisualizer();
        
        // Add sample services
        const sampleServices = [
            { name: 'API Gateway', color: '#4f46e5', type: 'API', x: 200, y: 150 },
            { name: 'User Service', color: '#10b981', type: 'Auth', x: 400, y: 250 },
            { name: 'Product Service', color: '#f59e0b', type: 'Custom', x: 600, y: 150 },
            { name: 'Order Service', color: '#ef4444', type: 'Custom', x: 400, y: 350 },
            { name: 'Message Broker', color: '#8b5cf6', type: 'Message', x: 800, y: 250 }
        ];

        sampleServices.forEach((service, index) => {
            setTimeout(() => {
                const id = 'sample_' + index;
                visualizer.services.set(id, { ...service, id, radius: 40 });
                visualizer.updateServicesList();
                visualizer.updateStats();
            }, index * 100);
        });

        // Add sample connections
        setTimeout(() => {
            visualizer.connections = [
                {
                    id: 'sample_0_1',
                    from: 'sample_0',
                    to: 'sample_1',
                    protocol: 'REST',
                    endpoint: '/api/users',
                    method: 'GET',
                    dataFlow: 'User data request',
                    active: true
                },
                {
                    id: 'sample_0_2',
                    from: 'sample_0',
                    to: 'sample_2',
                    protocol: 'REST',
                    endpoint: '/api/products',
                    method: 'GET',
                    dataFlow: 'Product catalog',
                    active: true
                },
                {
                    id: 'sample_0_3',
                    from: 'sample_0',
                    to: 'sample_3',
                    protocol: 'REST',
                    endpoint: '/api/orders',
                    method: 'POST',
                    dataFlow: 'Order creation',
                    active: true
                },
                {
                    id: 'sample_3_4',
                    from: 'sample_3',
                    to: 'sample_4',
                    protocol: 'MQ',
                    endpoint: 'order.queue',
                    method: 'PUBLISH',
                    dataFlow: 'Order events',
                    active: true
                }
            ];
            visualizer.updateStats();
        }, 600);
    }, 1000);
});