import { useState } from "react";
import useGame from "../../hook/useGame";
import * as THREE from "three";
import MovingBox from "./MovingBox";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { box, moveInitial } from "./box";

const Layers = () => {
  const layers = useGame((state) => state.layers);
  const step = useGame((state) => state.step);
  const addLayer = useGame((state) => state.addLayer);
  const [curShape, setCurShape] = useState(moveInitial);
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
    // state.camera.position.setY(2);
  });
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
