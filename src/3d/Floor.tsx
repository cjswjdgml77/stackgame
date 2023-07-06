import { RigidBody } from "@react-three/rapier";

const Floor = () => {
  return (
    <>
      <RigidBody type="fixed" scale={[20, 1, 20]} position={[0, -50, 0]}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial transparent opacity={0.0} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Floor;
