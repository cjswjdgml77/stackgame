import { useMemo, useRef, useState } from "react";
import useGame from "../../hook/useGame";
import * as THREE from "three";
import MovingBox from "./MovingBox";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { box, moveInitial } from "./box";
import { gsap } from "gsap";

const Layers = () => {
  const layers = useGame((state) => state.layers);
  const step = useGame((state) => state.step);
  const addLayer = useGame((state) => state.addLayer);
  const [curShape, setCurShape] = useState(moveInitial);
  const correctRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Camera
    const cPos = state.camera.position;
    if (layers.length > 3) {
      const lastLayer = layers[layers.length - 1];
      state.camera.position.lerp(
        new THREE.Vector3(
          cPos.x,
          layers.length * lastLayer.scale[1] + 3,
          cPos.z
        ),
        0.1
      );
    } else {
      state.camera.lookAt(layers[0].mesh.position);
      state.camera.position.lerp(new THREE.Vector3(5, 5, 5), 0.1);
    }
  });
  const exactSize = useMemo(() => {
    if (layers.length < 2) return false;
    const lastOne = layers[layers.length - 1].scale;
    const secondOne = layers[layers.length - 2].scale;

    return (
      lastOne[0] === secondOne[0] &&
      lastOne[1] === secondOne[1] &&
      lastOne[2] === secondOne[2]
    );
  }, [layers]);
  if (exactSize) {
    if (correctRef.current) {
      // const timeline = gsap.timeline({ repeat: 0 });
      // timeline.to(correctRef.current.material, {
      //   opacity: 0.8,
      //   duration: 0.25,
      // });
      // timeline.to(correctRef.current.material, { opacity: 0, duration: 0.15 });
      gsap.fromTo(
        correctRef.current.material,
        { opacity: 0.8 },
        { opacity: 0.0, duration: 0.8 }
      );
    }
  }
  return (
    <>
      <group>
        {layers.map((box, idx) => (
          <RigidBody key={idx} mass={5} type="fixed" colliders="hull">
            <mesh
              position={[box.position[0], box.scale[1] * idx, box.position[2]]}
              scale={box.scale}
              geometry={box.mesh.geometry}
              material={box.mesh.material}
            />
          </RigidBody>
        ))}
      </group>
      {exactSize && (
        <mesh
          ref={correctRef}
          scale={[
            layers[layers.length - 1].scale[0] + 0.5,
            0.05,
            layers[layers.length - 1].scale[2] + 0.5,
          ]}
          position={[
            layers[layers.length - 1].position[0],
            layers.length - 2 + 0.5,
            layers[layers.length - 1].position[2],
          ]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial opacity={0.0} transparent />
        </mesh>
      )}
      {step === "start" && (
        <MovingBox
          curShape={curShape}
          setCurShape={setCurShape}
          height={layers.length}
          addLayer={addLayer}
          layers={layers}
        />
      )}
    </>
  );
};
export default Layers;
