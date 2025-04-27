"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import earthTextureUrl from "../images/earth.jpg";

// -------------------- STARFIELD BACKGROUND --------------------
function SpaceBackground() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={["#000", 20, 100]} />
    </>
  );
}

// -------------------- GLOBE COMPONENT --------------------
function Globe({ autoRotate = true, rotationSpeed = 0.001 }: { autoRotate?: boolean; rotationSpeed?: number }) {
  const rotatingGroup = useRef<THREE.Group>(null!);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const glowRef = useRef<THREE.Mesh>(null!);

  // Load Earth texture once on mount
  useEffect(() => {
    new THREE.TextureLoader().load(earthTextureUrl.src, setEarthTexture);
  }, []);

  // Animate globe rotation & subtle float (texts stay fixed)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (rotatingGroup.current && autoRotate) {
      rotatingGroup.current.rotation.y += rotationSpeed;
      rotatingGroup.current.position.y = Math.sin(t * 0.2) * 0.1;
    }

    if (glowRef.current) {
      const s = 1.02 + Math.sin(t * 0.5) * 0.01;
      glowRef.current.scale.set(s, s, s);
    }
  });

  if (!earthTexture) return null;

  return (
    <>
      <color attach="background" args={["#000"]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-10, 0, -20]} intensity={1} color="#3498db" />

      {/* ------------------ ROTATING EARTH ------------------ */}
      <group ref={rotatingGroup}>
        {/* Atmospheric glow */}
        <mesh ref={glowRef} scale={1.02}>
          <sphereGeometry args={[5, 64, 64]} />
          <meshBasicMaterial color="#3498db" transparent opacity={0.1} />
        </mesh>

        {/* Earth */}
        <mesh>
          <sphereGeometry args={[5, 64, 64]} />
          <meshStandardMaterial map={earthTexture} metalness={0.1} roughness={0.8} />
        </mesh>
      </group>

      {/* ------------------ FIXED OVERLAY TEXT ------------------ */}
      <Text
        position={[0, 0.3, 6]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ResearchAI
      </Text>
    </>
  );
}

// -------------------- INTERACTIVE GLOBE --------------------
export default function InteractiveGlobe() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRotating, setIsRotating] = useState(true);

  // Redirect on authentication
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleLogin = () => signIn("google");
  const toggleRotation = () => setIsRotating((r) => !r);

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Login Button – only show when not signed in */}
      {!session && (
        <div className="absolute top-8 right-8 z-10">
          <button
            onClick={handleLogin}
            className="bg-[#01693E] hover:scale-110 text-white font-bold py-2 px-6 rounded-lg"
          >
            Sign in with Google
          </button>
        </div>
      )}

      {/* Play / Pause rotation */}
      <div className="absolute bottom-8 left-8 z-10">
        <button
          onClick={toggleRotation}
          className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${isRotating ? "bg-purple-600 hover:bg-purple-700" : "bg-pink-500 hover:bg-pink-600"}`}
        >
          {isRotating ? (
            // pause icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            // play icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* ----------- Canvas + 3D Scene ----------- */}
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Suspense fallback={null}>
          <SpaceBackground />
          <Globe autoRotate={isRotating} rotationSpeed={0.005} />
          <OrbitControls enableDamping dampingFactor={0.25} minDistance={7} maxDistance={20} makeDefault autoRotate={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
