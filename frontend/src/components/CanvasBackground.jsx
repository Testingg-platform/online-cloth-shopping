import React, { useRef, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AbstractShape = () => {
  const meshRef = useRef();

  useLayoutEffect(() => {
    // Scroll animation for the 3D element
    const ctx = gsap.context(() => {
      // 1. Initially at Home Hero
      gsap.set(meshRef.current.position, { x: 2, y: 0, z: 0 });
      gsap.set(meshRef.current.scale, { x: 1, y: 1, z: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".site-shell",
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub
        }
      });

      // Move to left and scale down slightly for Latest Collection
      tl.to(meshRef.current.position, { x: -2, y: -0.5, z: 0, ease: "power1.inOut" }, 0.2)
        .to(meshRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, ease: "power1.inOut" }, 0.2)
        // Move to right for Best Seller
        .to(meshRef.current.position, { x: 2, y: 0, z: 0, ease: "power1.inOut" }, 0.6)
        .to(meshRef.current.scale, { x: 1.2, y: 1.2, z: 1.2, ease: "power1.inOut" }, 0.6)
        // Center and scale up for Policies / Newsletter
        .to(meshRef.current.position, { x: 0, y: -1, z: 0, ease: "power1.inOut" }, 0.9)
        .to(meshRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, ease: "power1.inOut" }, 0.9);
        
      // Ensure there's a continuous gentle rotation independent of scroll too
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <PresentationControls snap global zoom={0.8} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
      <group position={[0, -0.5, 0]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh ref={meshRef} castShadow receiveShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial 
              color="#333333" 
              attach="material" 
              distort={0.4} 
              speed={1.5} 
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      </group>
    </PresentationControls>
  );
};

const CanvasBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 10, 5]} intensity={1} shadow-mapSize={[1024, 1024]} />
        <Environment preset="city" />
        <AbstractShape />
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
};

export default CanvasBackground;
