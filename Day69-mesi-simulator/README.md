# MESI Cache Coherence Protocol Simulator

An interactive, visual simulator built with React to demonstrate and explain the MESI (Modified, Exclusive, Shared, Invalid) cache coherence protocol used in multi-core processors.

## 🌟 Features

- **Visual State Management**: Watch cache lines change color in real-time as they transition between Modified (M), Exclusive (E), Shared (S), and Invalid (I) states.
- **Interactive Simulation**: Control two CPU cores and perform read/write operations to see how the protocol maintains consistency.
- **Bus Transaction Logging**: Observe the behind-the-scenes bus signals (BusRd, BusRdX, BusUpgr) that facilitate cache communication.
- **Performance Metrics**: Track cache hits, misses, read/write operations, and calculate hit rates in real-time.
- **Educational Tool**: Includes a tutorial section explaining each MESI state and its significance in computer architecture.
- **History & Undo**: Step back through operations to better understand the protocol's state transitions.

## 🧠 Understanding the MESI Protocol

The MESI protocol is a cache coherence mechanism that ensures multiple processor caches maintain a consistent view of shared memory. Each cache line can be in one of four states:

| State | Description | Color Code |
|-------|-------------|------------|
| **M** (Modified) | The cache has the only copy of the data and it differs from main memory. | Red |
| **E** (Exclusive) | The cache has the only copy of the data, but it matches main memory. | Yellow |
| **S** (Shared) | Multiple caches may have this data, and it matches main memory. | Green |
| **I** (Invalid) | The data in this cache is stale or not present. | Gray |

## 🚀 How to Use the Simulator

1. **Set Initial Memory Value**: Use the "Set Memory Value" button to initialize main memory.
2. **Perform Operations**:
   - Click **Read** on a core to simulate a read operation
   - Click **Write** on a core to simulate a write operation (you'll be prompted for a value)
3. **Observe Changes**:
   - Watch how cache states change color based on their MESI state
   - Follow the bus transactions in the log panel
   - Monitor performance statistics updating in real-time
4. **Use Controls**:
   - **Reset**: Start a new simulation
   - **Undo**: Step back through your operations
   - **Clear Log**: Clear the transaction history
