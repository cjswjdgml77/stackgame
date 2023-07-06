import Layers from "./stack/Layers";
import Floor from "./Floor";
import CutBox from "./stack/CutBox";
import { useProgress } from "@react-three/drei";

const Experience = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  console.log(active, progress, errors, item, loaded, total);

  return (
    <>
      {/* <OrbitControls /> */}
      <Layers />
      <CutBox />
      <Floor />
    </>
  );
};

export default Experience;
