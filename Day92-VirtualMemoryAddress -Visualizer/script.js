// Virtual Memory Simulation
class VirtualMemorySimulator {
  constructor() {
    this.config = {
      PAGE_SIZE: 256,
      VIRTUAL_ADDRESS_SPACE: 16,
      PHYSICAL_ADDRESS_SPACE: 16,
      TLB_SIZE: 8,
      NUM_PAGES: 64,
      NUM_FRAMES: 32,
    };

    this.state = {
      tlbHits: 0,
      tlbMisses: 0,
      currentVPN: 0x2a,
      currentOffset: 0x7f,
      currentPFN: 0x0d,
      tlb: new Map(),
      pageTable: new Map(),
      physicalMemory: new Map(),
    };

    this.initializeMappings();
  }

  initializeMappings() {
    // Clear existing mappings
    this.state.tlb.clear();
    this.state.pageTable.clear();
    this.state.physicalMemory.clear();

    // Add some initial TLB entries
    this.state.tlb.set(0x15, 0x03);
    this.state.tlb.set(0x2b, 0x0a);
    this.state.tlb.set(0x3f, 0x1c);

    // Initialize page table with random mappings
    const usedFrames = new Set();

    for (let i = 0; i < this.config.NUM_PAGES; i++) {
      // Some pages are not present (null), others have random PFNs
      if (Math.random() > 0.3 && usedFrames.size < this.config.NUM_FRAMES) {
        let pfn;
        do {
          pfn = Math.floor(Math.random() * this.config.NUM_FRAMES);
        } while (usedFrames.has(pfn));

        usedFrames.add(pfn);
        this.state.pageTable.set(i, pfn);

        // Initialize physical memory with some data
        this.state.physicalMemory.set(pfn, `Page Data ${i}`);
      } else {
        this.state.pageTable.set(i, null);
      }
    }

    // Ensure our example page is mapped
    if (!usedFrames.has(0x0d)) {
      this.state.pageTable.set(0x2a, 0x0d);
      this.state.physicalMemory.set(0x0d, `Page Data 0x2A`);
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.initializeMappings();
  }

  translateAddress(virtualAddress) {
    // Calculate bits for VPN and offset based on page size
    const pageSizeBits = Math.log2(this.config.PAGE_SIZE);
    const vpnMask = (0xffff >> pageSizeBits) << pageSizeBits;
    const offsetMask = (1 << pageSizeBits) - 1;

    const vpn = (virtualAddress & vpnMask) >> pageSizeBits;
    const offset = virtualAddress & offsetMask;

    this.state.currentVPN = vpn;
    this.state.currentOffset = offset;

    // Check TLB
    let pfn;
    let tlbHit = false;
    let pageFault = false;

    if (this.state.tlb.has(vpn)) {
      // TLB Hit
      pfn = this.state.tlb.get(vpn);
      this.state.tlbHits++;
      tlbHit = true;
    } else {
      // TLB Miss - Check page table
      pfn = this.state.pageTable.get(vpn);
      this.state.tlbMisses++;
      tlbHit = false;

      if (pfn !== null && pfn !== undefined) {
        // Update TLB with new mapping
        if (this.state.tlb.size >= this.config.TLB_SIZE) {
          // Remove oldest entry (simple LRU approximation)
          const firstKey = this.state.tlb.keys().next().value;
          this.state.tlb.delete(firstKey);
        }
        this.state.tlb.set(vpn, pfn);
      } else {
        // Page fault
        pageFault = true;
        pfn = 0xff; // Invalid PFN for display
      }
    }

    this.state.currentPFN = pfn;

    return {
      vpn,
      offset,
      pfn,
      tlbHit,
      pageFault,
      physicalAddress: pageFault ? null : (pfn << pageSizeBits) | offset,
    };
  }

  getStats() {
    const totalAccesses = this.state.tlbHits + this.state.tlbMisses;
    const hitRate =
      totalAccesses > 0
        ? ((this.state.tlbHits / totalAccesses) * 100).toFixed(1)
        : 0;

    return {
      tlbHits: this.state.tlbHits,
      tlbMisses: this.state.tlbMisses,
      totalAccesses,
      hitRate: `${hitRate}%`,
    };
  }

  getTLBEntries() {
    const entries = [];
    for (let [vpn, pfn] of this.state.tlb) {
      entries.push({ vpn, pfn });
    }
    return entries;
  }

  getPageTableEntries(limit = 16) {
    const entries = [];
    for (let i = 0; i < limit; i++) {
      entries.push({
        vpn: i,
        pfn: this.state.pageTable.get(i),
      });
    }
    return entries;
  }

  generateRandomAddress() {
    const maxVirtualAddress = (1 << this.config.VIRTUAL_ADDRESS_SPACE) - 1;
    return Math.floor(Math.random() * maxVirtualAddress);
  }
}

// UI Controller
class UIController {
  constructor() {
    this.simulator = new VirtualMemorySimulator();
    this.initializeEventListeners();
    this.renderAll();
  }

  initializeEventListeners() {
    document.getElementById("translate-btn").addEventListener("click", () => {
      this.handleTranslate();
    });

    document.getElementById("random-btn").addEventListener("click", () => {
      this.handleRandomAddress();
    });

    document.getElementById("reset-btn").addEventListener("click", () => {
      this.handleReset();
    });

    document
      .getElementById("virtual-address")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleTranslate();
        }
      });

    document.getElementById("tlb-size").addEventListener("change", (e) => {
      this.simulator.updateConfig({ TLB_SIZE: parseInt(e.target.value) });
      this.renderAll();
    });

    document.getElementById("page-size").addEventListener("change", (e) => {
      this.simulator.updateConfig({ PAGE_SIZE: parseInt(e.target.value) });
      this.renderAll();
    });
  }

  handleTranslate() {
    const input = document.getElementById("virtual-address").value;

    // Parse the input (support hex and decimal)
    let virtualAddress;
    if (input.startsWith("0x")) {
      virtualAddress = parseInt(input.substring(2), 16);
    } else {
      virtualAddress = parseInt(input, 10);
    }

    if (isNaN(virtualAddress)) {
      alert("Please enter a valid virtual address!");
      return;
    }

    const maxVirtualAddress =
      (1 << this.simulator.config.VIRTUAL_ADDRESS_SPACE) - 1;
    if (virtualAddress < 0 || virtualAddress > maxVirtualAddress) {
      alert(
        `Virtual address must be between 0x0000 and 0x${maxVirtualAddress
          .toString(16)
          .toUpperCase()}!`
      );
      return;
    }

    this.processAddress(virtualAddress);
  }

  handleRandomAddress() {
    const randomAddress = this.simulator.generateRandomAddress();
    document.getElementById("virtual-address").value = `0x${randomAddress
      .toString(16)
      .toUpperCase()}`;
    this.processAddress(randomAddress);
  }

  handleReset() {
    this.simulator = new VirtualMemorySimulator();
    document.getElementById("virtual-address").value = "0x2A7F";
    this.renderAll();
  }

  processAddress(virtualAddress) {
    const result = this.simulator.translateAddress(virtualAddress);
    this.updateAddressBreakdown(result.vpn, result.offset);
    this.renderTLB();
    this.renderPageTable();
    this.updateTranslationSteps(result);
    this.updateStats();

    if (result.pageFault) {
      alert(
        `Page Fault: Virtual page 0x${result.vpn.toString(
          16
        )} is not present in memory!`
      );
    }
  }

  updateAddressBreakdown(vpn, offset) {
    document.getElementById("vpn").textContent = `0x${vpn
      .toString(16)
      .toUpperCase()}`;
    document.getElementById("offset").textContent = `0x${offset
      .toString(16)
      .toUpperCase()}`;
  }

  renderTLB() {
    const tlbGrid = document.getElementById("tlb-grid");
    tlbGrid.innerHTML = "";

    const entries = this.simulator.getTLBEntries();
    const currentVPN = this.simulator.state.currentVPN;

    for (let i = 0; i < this.simulator.config.TLB_SIZE; i++) {
      const cell = document.createElement("div");
      cell.className = "memory-cell";

      if (i < entries.length) {
        const { vpn, pfn } = entries[i];
        cell.textContent = `VPN: 0x${vpn
          .toString(16)
          .padStart(2, "0")} → PFN: 0x${pfn.toString(16).padStart(2, "0")}`;

        if (vpn === currentVPN) {
          cell.classList.add("hit");
        }
      } else {
        cell.textContent = "Empty";
        cell.classList.add("empty");
      }

      tlbGrid.appendChild(cell);
    }
  }

  renderPageTable() {
    const pageTableGrid = document.getElementById("page-table-grid");
    pageTableGrid.innerHTML = "";

    const entries = this.simulator.getPageTableEntries();
    const currentVPN = this.simulator.state.currentVPN;

    entries.forEach((entry) => {
      const cell = document.createElement("div");
      cell.className = "memory-cell";

      if (entry.pfn !== null) {
        cell.textContent = `VPN: 0x${entry.vpn
          .toString(16)
          .padStart(2, "0")} → PFN: 0x${entry.pfn
          .toString(16)
          .padStart(2, "0")}`;

        if (entry.vpn === currentVPN) {
          cell.classList.add("active");
        }
      } else {
        cell.textContent = `VPN: 0x${entry.vpn
          .toString(16)
          .padStart(2, "0")} → Not Present`;
        cell.classList.add("empty");
      }

      pageTableGrid.appendChild(cell);
    });
  }

  updateTranslationSteps(result) {
    // Reset all steps
    document.querySelectorAll(".step").forEach((step) => {
      step.classList.remove("active");
      step.style.display = "flex";
    });

    const { vpn, offset, pfn, tlbHit, pageFault } = result;

    // Step 1: Check TLB
    document.getElementById("step1").classList.add("active");
    document.getElementById("step1-vpn").textContent = `0x${vpn
      .toString(16)
      .toUpperCase()}`;

    if (tlbHit) {
      // TLB Hit
      document.getElementById("step2").textContent =
        "TLB Hit - Found mapping in TLB";
      document.getElementById("step2").classList.add("active");
      document.getElementById("step3").style.display = "none";
      document.getElementById("step4").style.display = "none";
    } else if (pageFault) {
      // Page Fault
      document.getElementById("step2").textContent =
        "TLB Miss - Access Page Table";
      document.getElementById("step2").classList.add("active");
      document.getElementById(
        "step3"
      ).textContent = `Page Fault: VPN 0x${vpn.toString(16)} not in memory`;
      document.getElementById("step3").classList.add("active");
      document.getElementById("step4").style.display = "none";
      document.getElementById("step5").style.display = "none";
    } else {
      // TLB Miss but page found
      document.getElementById("step2").textContent =
        "TLB Miss - Access Page Table";
      document.getElementById("step2").classList.add("active");
      document.getElementById("step3").classList.add("active");
      document.getElementById("step3-vpn").textContent = `0x${vpn
        .toString(16)
        .toUpperCase()}`;
      document.getElementById("step3-pfn").textContent = `0x${pfn
        .toString(16)
        .toUpperCase()}`;
      document.getElementById("step4").classList.add("active");
    }

    if (!pageFault) {
      document.getElementById("step5").classList.add("active");
      document.getElementById("step5-pfn").textContent = `0x${pfn
        .toString(16)
        .toUpperCase()}`;
      document.getElementById("step5-offset").textContent = `0x${offset
        .toString(16)
        .toUpperCase()}`;

      // Update physical address
      const pageSizeBits = Math.log2(this.simulator.config.PAGE_SIZE);
      const physicalAddress = (pfn << pageSizeBits) | offset;
      document.getElementById(
        "physical-address"
      ).textContent = `Physical Address: 0x${physicalAddress
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")}`;
      document.getElementById("physical-address").style.borderColor =
        "var(--success)";
    } else {
      document.getElementById("physical-address").textContent =
        "Physical Address: PAGE FAULT";
      document.getElementById("physical-address").style.borderColor =
        "var(--warning)";
    }
  }

  updateStats() {
    const stats = this.simulator.getStats();

    document.getElementById("tlb-hits").textContent = stats.tlbHits;
    document.getElementById("tlb-misses").textContent = stats.tlbMisses;
    document.getElementById("total-accesses").textContent = stats.totalAccesses;
    document.getElementById("hit-rate").textContent = stats.hitRate;
  }

  renderAll() {
    this.renderTLB();
    this.renderPageTable();
    this.updateStats();

    // Process the initial example address
    this.processAddress(0x2a7f);
  }
}

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new UIController();
});
