# ⚡ Branch Predictor Visualizer

An **interactive React app** that demonstrates how modern CPUs guess the outcome of branches (`if` conditions) using a **2-bit Branch History Table (BHT)**.  
It shows **mispredictions, pipeline flushes, and wasted cycles** with animations, helping students visualize this hidden but critical CPU concept.

---

## 🚀 Features

- 🎛️ **Interactive BHT**: Choose a branch entry and update its history by taking/not taking the branch.
- 🔄 **2-bit Counter Predictor**: Visualizes "Strongly Taken", "Weakly Taken", etc.
- ❌ **Mispredictions**: Shows pipeline flush + wasted cycles with animation.
- 📊 **Live Stats**: Tracks total branches, correct predictions, mispredictions, and wasted cycles.
- 🎨 **Clean UI**: Modern styling with animations for better understanding.
