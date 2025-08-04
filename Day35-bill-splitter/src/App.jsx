import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { FiUserPlus, FiDollarSign, FiPieChart, FiRefreshCw, FiHome } from 'react-icons/fi';
import Participants from './components/Participants';
import ExpenseForm from './components/ExpenseForm';
import ExpenseSummary from './components/ExpenseSummary';

// Particle Background Component
function ParticleBackground() {
  const particlesRef = useRef();
  const count = 2000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  useFrame((state) => {
    const { clock } = state;
    particlesRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          itemSize={3}
          array={colors}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.02}
        sizeAttenuation
        alphaTest={0.01}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function RotatingCube() {
  return (
    <mesh rotation={[10, 10, 10]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#4ade80'} />
    </mesh>
  );
}

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('participants');
  const [isAnimating, setIsAnimating] = useState(false);

  const resetAll = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setParticipants([]);
      setExpenses([]);
      setIsAnimating(false);
    }, 500);
  };

  const addSampleData = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setParticipants(['Alice', 'Bob', 'Charlie']);
      setExpenses([
        { name: 'Dinner', amount: 120, payer: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] },
        { name: 'Taxi', amount: 45, payer: 'Bob', participants: ['Alice', 'Bob'] }
      ]);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <ParticleBackground />
          <Stars 
            radius={100} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-1 bg-gradient-to-br from-blue-50/70 to-green-50/70 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.header
            className="text-center mb-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-2 flex items-center justify-center gap-3">
              <FiDollarSign className="text-green-500" />
              Bill Splitter
              <FiPieChart className="text-green-500" />
            </h1>
            <p className="text-gray-600">Fairly divide expenses among friends and family</p>
          </motion.header>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/80 rounded-lg shadow-md p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('participants')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'participants' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100/50'}`}
              >
                <FiUserPlus className="inline mr-2" />
                Participants
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'expenses' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100/50'}`}
              >
                <FiDollarSign className="inline mr-2" />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'summary' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100/50'}`}
              >
                <FiPieChart className="inline mr-2" />
                Summary
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSampleData}
              className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-lg shadow-sm hover:bg-blue-200/80 transition-colors flex items-center backdrop-blur-sm"
            >
              <FiRefreshCw className="mr-2" />
              Add Sample Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetAll}
              className="px-4 py-2 bg-red-100/80 text-red-700 rounded-lg shadow-sm hover:bg-red-200/80 transition-colors flex items-center backdrop-blur-sm"
            >
              <FiHome className="mr-2" />
              Reset All
            </motion.button>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm"
            >
              <div className="p-6">
                {activeTab === 'participants' && (
                  <Participants participants={participants} setParticipants={setParticipants} />
                )}
                {activeTab === 'expenses' && (
                  <ExpenseForm participants={participants} setExpenses={setExpenses} />
                )}
                {activeTab === 'summary' && (
                  <ExpenseSummary participants={participants} expenses={expenses} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3D Visualization */}
          <motion.div 
            className="mt-12 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-500/80 to-blue-500/80 backdrop-blur-sm"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Canvas className="w-full h-64">
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              <RotatingCube />
            </Canvas>
          </motion.div>

          {/* Footer */}
          <motion.footer 
            className="mt-12 text-center text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Made with ❤️ using React, Framer Motion, and Three.js</p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
