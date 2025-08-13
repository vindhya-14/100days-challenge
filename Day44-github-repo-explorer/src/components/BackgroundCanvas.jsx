// src/components/BackgroundCanvas.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

export default function BackgroundCanvas() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <Stars
        radius={100} // Outer radius
        depth={50}   // Star depth
        count={5000} // Number of stars
        factor={4}   // Star size
        saturation={0}
        fade
      />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
