import Layers from "./stack/Layers";
import Floor from "./Floor";
import CutBox from "./stack/CutBox";

const Experience = () => {
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
