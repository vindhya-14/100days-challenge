// Bloch Sphere Visualization
class BlochSphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) * 0.35;

    // Rotation state
    this.rotationX = 0;
    this.rotationY = 0;
    this.zoom = 1.0;

    // Interaction state
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    // Current state vector
    this.stateVector = null;

    this.setupEventListeners();
    this.draw();
  }

  setupEventListeners() {
    // Mouse interactions
    this.canvas.addEventListener("mousedown", (e) => this.startDrag(e));
    this.canvas.addEventListener("mousemove", (e) => this.drag(e));
    this.canvas.addEventListener("mouseup", () => this.endDrag());
    this.canvas.addEventListener("mouseleave", () => this.endDrag());

    // Touch interactions
    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.startDrag(e.touches[0]);
      }
    });
    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1) {
        this.drag(e.touches[0]);
      }
    });
    this.canvas.addEventListener("touchend", () => this.endDrag());

    // Zoom
    this.canvas.addEventListener("wheel", (e) => this.zoomSphere(e));
  }

  startDrag(e) {
    this.isDragging = true;
    this.lastX = e.clientX || e.pageX;
    this.lastY = e.clientY || e.pageY;
    this.canvas.style.cursor = "grabbing";
  }

  drag(e) {
    if (!this.isDragging) return;

    const currentX = e.clientX || e.pageX;
    const currentY = e.clientY || e.pageY;

    const deltaX = currentX - this.lastX;
    const deltaY = currentY - this.lastY;

    this.rotationY += deltaX * 0.01;
    this.rotationX += deltaY * 0.01;

    // Keep rotations within reasonable bounds
    this.rotationX = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.rotationX)
    );

    this.lastX = currentX;
    this.lastY = currentY;

    this.draw();
  }

  endDrag() {
    this.isDragging = false;
    this.canvas.style.cursor = "grab";
  }

  zoomSphere(e) {
    e.preventDefault();
    this.zoom += e.deltaY * -0.001;
    this.zoom = Math.max(0.3, Math.min(3.0, this.zoom));
    this.draw();
  }

  // Convert 3D point to 2D canvas coordinates with proper perspective
  projectPoint(x, y, z) {
    // Apply rotations - correct order: Y then X
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);

    // Rotate around Y axis first
    let x1 = x * cosY + z * sinY;
    let y1 = y;
    let z1 = -x * sinY + z * cosY;

    // Then rotate around X axis
    let x2 = x1;
    let y2 = y1 * cosX - z1 * sinX;
    let z2 = y1 * sinX + z1 * cosX;

    // Apply perspective projection
    const scale = this.radius * this.zoom;
    const distance = 5; // Perspective distance

    if (z2 > -distance) {
      const factor = distance / (distance + z2);
      return {
        x: this.centerX + x2 * scale * factor,
        y: this.centerY + y2 * scale * factor,
        visible: true,
      };
    }

    return { x: 0, y: 0, visible: false };
  }

  // Draw the Bloch sphere
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw sphere background with gradient
    this.drawSphereBackground();

    // Draw grid lines
    this.drawGrid();

    // Draw axes
    this.drawAxes();

    // Draw great circles
    this.drawGreatCircles();

    // Draw basis states
    this.drawBasisStates();

    // Draw state vector if available
    if (this.stateVector) {
      this.drawStateVector(this.stateVector);
    }

    // Draw equator line
    this.drawEquator();
  }

  drawSphereBackground() {
    // Create radial gradient for sphere background
    const gradient = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      this.radius * this.zoom
    );
    gradient.addColorStop(0, "rgba(30, 41, 59, 0.8)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0.9)");

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(
      this.centerX,
      this.centerY,
      this.radius * this.zoom,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawGrid() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    this.ctx.lineWidth = 1;

    // Draw latitude circles
    for (let i = 1; i <= 3; i++) {
      const angle = (i / 4) * Math.PI;
      const circleRadius = Math.sin(angle) * this.radius * this.zoom;
      const yOffset = Math.cos(angle) * this.radius * this.zoom;

      // Upper hemisphere
      this.ctx.beginPath();
      this.ctx.arc(
        this.centerX,
        this.centerY - yOffset,
        circleRadius,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();

      // Lower hemisphere
      this.ctx.beginPath();
      this.ctx.arc(
        this.centerX,
        this.centerY + yOffset,
        circleRadius,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }

    // Draw longitude lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.ctx.beginPath();

      for (let j = 0; j <= 20; j++) {
        const phi = (j / 20) * Math.PI;
        const x = Math.sin(phi) * Math.cos(angle);
        const y = Math.sin(phi) * Math.sin(angle);
        const z = Math.cos(phi);

        const point = this.projectPoint(x, y, z);
        if (point.visible) {
          if (j === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        }
      }
      this.ctx.stroke();
    }
  }

  drawAxes() {
    const axes = [
      { point: [1, 0, 0], label: "X", color: "#ef4444" },
      { point: [0, 1, 0], label: "Y", color: "#22c55e" },
      { point: [0, 0, 1], label: "Z", color: "#3b82f6" },
      { point: [-1, 0, 0], label: "-X", color: "#ef4444" },
      { point: [0, -1, 0], label: "-Y", color: "#22c55e" },
      { point: [0, 0, -1], label: "-Z", color: "#3b82f6" },
    ];

    axes.forEach((axis) => {
      const start = this.projectPoint(0, 0, 0);
      const end = this.projectPoint(...axis.point);

      if (start.visible && end.visible) {
        // Draw axis line
        this.ctx.strokeStyle = axis.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();

        // Draw axis label
        this.ctx.fillStyle = axis.color;
        this.ctx.font = "bold 14px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(axis.label, end.x, end.y);
      }
    });
  }

  drawGreatCircles() {
    const circles = [
      { axis: "xy", color: "rgba(239, 68, 68, 0.3)" }, // XY plane (red)
      { axis: "yz", color: "rgba(34, 197, 94, 0.3)" }, // YZ plane (green)
      { axis: "zx", color: "rgba(59, 130, 246, 0.3)" }, // ZX plane (blue)
    ];

    circles.forEach((circle) => {
      this.ctx.strokeStyle = circle.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();

      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        let x, y, z;

        switch (circle.axis) {
          case "xy": // equator
            x = Math.cos(angle);
            y = Math.sin(angle);
            z = 0;
            break;
          case "yz": // meridian
            x = 0;
            y = Math.cos(angle);
            z = Math.sin(angle);
            break;
          case "zx": // prime meridian
            x = Math.cos(angle);
            y = 0;
            z = Math.sin(angle);
            break;
        }

        const point = this.projectPoint(x, y, z);
        if (point.visible) {
          if (i === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        }
      }

      this.ctx.stroke();
    });
  }

  drawBasisStates() {
    const states = [
      { point: [0, 0, 1], label: "|0⟩", color: "#06d6a0" },
      { point: [0, 0, -1], label: "|1⟩", color: "#ef476f" },
      { point: [1, 0, 0], label: "|+⟩", color: "#8b5cf6" },
      { point: [-1, 0, 0], label: "|-⟩", color: "#f59e0b" },
      { point: [0, 1, 0], label: "|i+⟩", color: "#ec4899" },
      { point: [0, -1, 0], label: "|i-⟩", color: "#14b8a6" },
    ];

    states.forEach((state) => {
      const point = this.projectPoint(...state.point);

      if (point.visible) {
        // Draw state point
        this.ctx.fillStyle = state.color;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw glow effect
        this.ctx.shadowColor = state.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw state label
        this.ctx.fillStyle = state.color;
        this.ctx.font = "bold 12px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(state.label, point.x, point.y - 15);
      }
    });
  }

  drawEquator() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 3]);

    this.ctx.beginPath();
    this.ctx.arc(
      this.centerX,
      this.centerY,
      this.radius * this.zoom,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();

    this.ctx.setLineDash([]);
  }

  drawStateVector(stateVector) {
    const { x, y, z } = stateVector;
    const point = this.projectPoint(x, y, z);
    const origin = this.projectPoint(0, 0, 0);

    if (point.visible && origin.visible) {
      // Draw vector line with gradient
      const gradient = this.ctx.createLinearGradient(
        origin.x,
        origin.y,
        point.x,
        point.y
      );
      gradient.addColorStop(0, "rgba(245, 158, 11, 0.7)");
      gradient.addColorStop(1, "rgba(245, 158, 11, 1)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(origin.x, origin.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();

      // Draw vector arrowhead
      this.drawArrowhead(origin, point);

      // Draw state point with glow
      this.ctx.fillStyle = "#f59e0b";
      this.ctx.shadowColor = "#f59e0b";
      this.ctx.shadowBlur = 15;
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw inner point
      this.ctx.fillStyle = "#ffffff";
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawArrowhead(start, end) {
    const headLength = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    this.ctx.fillStyle = "#f59e0b";
    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Update state vector visualization
  updateStateVector(quantumState) {
    if (
      quantumState &&
      typeof quantumState.getBlochCoordinates === "function"
    ) {
      this.stateVector = quantumState.getBlochCoordinates();
      this.draw();
    }
  }

  // Reset view
  resetView() {
    this.rotationX = 0;
    this.rotationY = 0;
    this.zoom = 1.0;
    this.draw();
  }

  // Get current view parameters
  getViewParameters() {
    return {
      rotationX: this.rotationX,
      rotationY: this.rotationY,
      zoom: this.zoom,
    };
  }

  // Set view parameters
  setViewParameters(params) {
    if (params.rotationX !== undefined) this.rotationX = params.rotationX;
    if (params.rotationY !== undefined) this.rotationY = params.rotationY;
    if (params.zoom !== undefined) this.zoom = params.zoom;
    this.draw();
  }
}
