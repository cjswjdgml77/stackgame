import { RigidBody } from "@react-three/rapier";
import useGame from "../../hook/useGame";

const CutBox = () => {
  const cutBoxs = useGame((state) => state.cutBoxs);
  return (
    <>
      <group>
        {cutBoxs.map((box, idx) => (
          <RigidBody
            key={idx}
            scale={box.scale}
            position={box.position}
            colliders={"hull"}
          >
            <mesh geometry={box.mesh.geometry} material={box.mesh.material} />
          </RigidBody>
        ))}
      </group>
    </>
  );
};

export default CutBox;
