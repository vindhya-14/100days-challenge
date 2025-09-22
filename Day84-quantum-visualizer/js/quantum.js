// Quantum Computing Library
class QuantumState {
  constructor(alphaReal = 1, alphaImag = 0, betaReal = 0, betaImag = 0) {
    this.alpha = { real: alphaReal, imag: alphaImag };
    this.beta = { real: betaReal, imag: betaImag };
    this.history = [];
    this.saveState();
  }

  // Save current state to history
  saveState() {
    this.history.push({
      alpha: { ...this.alpha },
      beta: { ...this.beta },
    });
  }

  // Restore previous state
  undo() {
    if (this.history.length > 1) {
      this.history.pop(); // Remove current state
      const previousState = this.history[this.history.length - 1];
      this.alpha = { ...previousState.alpha };
      this.beta = { ...previousState.beta };
      return true;
    }
    return false;
  }

  // Normalize the state vector
  normalize() {
    const norm = Math.sqrt(
      this.alpha.real ** 2 +
        this.alpha.imag ** 2 +
        this.beta.real ** 2 +
        this.beta.imag ** 2
    );

    if (norm > 0) {
      this.alpha.real /= norm;
      this.alpha.imag /= norm;
      this.beta.real /= norm;
      this.beta.imag /= norm;
    }

    this.saveState();
    return this;
  }

  // Apply quantum gates
  applyGate(gate) {
    const gates = {
      X: () => this.pauliX(),
      Y: () => this.pauliY(),
      Z: () => this.pauliZ(),
      H: () => this.hadamard(),
      S: () => this.phaseGate(),
      T: () => this.tGate(),
    };

    if (gates[gate]) {
      gates[gate]();
      this.saveState();
    }
  }

  // Apply rotation gates
  applyRotation(rx, ry, rz) {
    // Simplified rotation implementation
    // In a real implementation, this would use rotation matrices
    const alphaReal = this.alpha.real;
    const alphaImag = this.alpha.imag;
    const betaReal = this.beta.real;
    const betaImag = this.beta.imag;

    // Rx rotation
    const cosRx = Math.cos(rx / 2);
    const sinRx = Math.sin(rx / 2);

    const newAlphaReal = cosRx * alphaReal - sinRx * betaImag;
    const newAlphaImag = cosRx * alphaImag + sinRx * betaReal;
    const newBetaReal = cosRx * betaReal - sinRx * alphaImag;
    const newBetaImag = cosRx * betaImag + sinRx * alphaReal;

    this.alpha.real = newAlphaReal;
    this.alpha.imag = newAlphaImag;
    this.beta.real = newBetaReal;
    this.beta.imag = newBetaImag;

    this.normalize();
    this.saveState();
  }

  // Pauli-X gate (bit flip)
  pauliX() {
    [this.alpha, this.beta] = [this.beta, this.alpha];
  }

  // Pauli-Y gate
  pauliY() {
    const newAlpha = {
      real: -this.beta.imag,
      imag: this.beta.real,
    };
    const newBeta = {
      real: this.alpha.imag,
      imag: -this.alpha.real,
    };
    this.alpha = newAlpha;
    this.beta = newBeta;
  }

  // Pauli-Z gate (phase flip)
  pauliZ() {
    this.beta.real = -this.beta.real;
    this.beta.imag = -this.beta.imag;
  }

  // Hadamard gate
  hadamard() {
    const sqrt2 = Math.sqrt(2);
    const newAlpha = {
      real: (this.alpha.real + this.beta.real) / sqrt2,
      imag: (this.alpha.imag + this.beta.imag) / sqrt2,
    };
    const newBeta = {
      real: (this.alpha.real - this.beta.real) / sqrt2,
      imag: (this.alpha.imag - this.beta.imag) / sqrt2,
    };
    this.alpha = newAlpha;
    this.beta = newBeta;
  }

  // Phase gate (S gate)
  phaseGate() {
    this.beta = {
      real: -this.beta.imag,
      imag: this.beta.real,
    };
  }

  // T gate
  tGate() {
    const angle = Math.PI / 4;
    this.beta = {
      real: Math.cos(angle) * this.beta.real - Math.sin(angle) * this.beta.imag,
      imag: Math.sin(angle) * this.beta.real + Math.cos(angle) * this.beta.imag,
    };
  }

  // Calculate probabilities
  getProbabilities() {
    const prob0 = this.alpha.real ** 2 + this.alpha.imag ** 2;
    const prob1 = this.beta.real ** 2 + this.beta.imag ** 2;
    return { prob0, prob1 };
  }

  // Measure the qubit
  measure() {
    const { prob0, prob1 } = this.getProbabilities();
    const random = Math.random();

    if (random < prob0) {
      // Collapse to |0⟩
      this.alpha = { real: 1, imag: 0 };
      this.beta = { real: 0, imag: 0 };
      return 0;
    } else {
      // Collapse to |1⟩
      this.alpha = { real: 0, imag: 0 };
      this.beta = { real: 1, imag: 0 };
      return 1;
    }
  }

  // Get Bloch sphere coordinates
  getBlochCoordinates() {
    const { prob0, prob1 } = this.getProbabilities();

    // Calculate theta and phi from state vector
    const alphaMag = Math.sqrt(prob0);
    const betaMag = Math.sqrt(prob1);

    let theta = 2 * Math.acos(alphaMag);
    let phi = 0;

    if (alphaMag > 0 && betaMag > 0) {
      const alphaPhase = Math.atan2(this.alpha.imag, this.alpha.real);
      const betaPhase = Math.atan2(this.beta.imag, this.beta.real);
      phi = betaPhase - alphaPhase;
    }

    // Convert to Cartesian coordinates
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    return { x, y, z, theta, phi };
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = QuantumState;
}
