import { Canvas } from "@react-three/fiber";
import Experience from "./3d/Experience";
import MyLight from "./3d/MyLight";
import { KeyboardControls, ScrollControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Game from "./Game";

const App = () => {
  return (
    <>
      <KeyboardControls map={[{ name: "space", keys: ["Space"] }]}>
        <Canvas
          camera={{ rotation: [Math.PI / -2, 0, 0], position: [5, 5, 5] }}
        >
          <Physics>
            <Experience />
            <MyLight />
          </Physics>
        </Canvas>
      </KeyboardControls>
      <div
        className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center"
        onClick={() => {
          const event = new KeyboardEvent("keydown", { key: "Space" });
          dispatchEvent(event);
          const event2 = new KeyboardEvent("keyup", { key: "Space" });
          dispatchEvent(event2);
        }}
      >
        <Game />
      </div>
    </>
  );
};

export default App;
