import { useFrame } from "@react-three/fiber";
import useGame, { gameBox, numArr } from "../../hook/useGame";
import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { box, moveInitial } from "./box";
type Props = {
  curShape: gameBox;
  setCurShape: (value: gameBox) => void;
  height: number;
  addLayer: (box: gameBox) => void;
  layers: gameBox[];
};
const successSound = new Audio("./sound/success.mp3");
successSound.load();
const failSound = new Audio("./sound/fail.mp3");
failSound.load();
const MovingBox = ({
  curShape,
  setCurShape,
  height,
  addLayer,
  layers,
}: Props) => {
  const ref = useRef<Mesh<BoxGeometry, MeshStandardMaterial>>(null);
  const direction = useRef(false);
  const [sub] = useKeyboardControls();
  const isX = useRef(false);

  const addCutBox = useGame((state) => state.addCutBox);
  const setCombo = useGame((state) => state.setCombo);
  const setStep = useGame((state) => state.setStep);
  useFrame((state, delta) => {
    if (!ref.current || !direction || !isX) return;
    const current = isX.current
      ? ref.current.position.x
      : ref.current.position.z;
    if (current < -6 && !direction.current) {
      direction.current = true;
    }
    if (current > 6 && direction.current) {
      direction.current = false;
    }
    const dir = direction.current ? 1 : -1;
    const strength = 5 * delta * dir; //*1.5;
    isX.current
      ? ref.current.position.setX(current + strength)
      : ref.current.position.setZ(current + strength);
  });
  const calculatBox = () => {
    if (!ref.current) return;
    const position = ref.current.position;
    const color = ref.current.material.color;
    const lighterColor = color.clone();
    const rgb = ["r", "g", "b"];
    const idxForRgb = Math.floor((height % 30) / 10);
    const chosenColor = rgb[idxForRgb] as "r" | "g" | "b";
    const resetColor = (height % 30) % 10 === 0;
    const initialColor = [
      { r: 1, g: 0.1, b: 0.1 },
      { r: 0.329, g: 0.812, b: 0.329 },
      { r: 0.329, g: 0.329, b: 0.8 },
    ];
    const toneDown = rgb.filter((value) => value !== chosenColor) as [
      "r",
      "g",
      "b"
    ];

    if (resetColor) {
      lighterColor.r = initialColor[idxForRgb].r;
      lighterColor.g = initialColor[idxForRgb].g;
      lighterColor.b = initialColor[idxForRgb].b;
    }
    toneDown.forEach((value) => {
      lighterColor[value] += box.colorGap;
    });
    const scale = ref.current.scale;
    const lastLayer = layers[layers.length - 1];
    const origin = lastLayer.position;

    const cut = isX.current ? position.x - origin[0] : position.z - origin[2];
    const left = cut >= 0 ? 1 : -1;
    const range = isX.current ? scale.x : scale.z;
    const overPosX = isX.current ? cut / 2 + origin[0] : origin[0];
    const overPosZ = isX.current ? origin[2] : cut / 2 + origin[2];
    const maxOfCut = 0.12;
    const materialProps = { color: color, metalness: 0, roughness: 1 };
    // check if the new stack is pressed in the range of previous one
    if (range >= Math.abs(cut)) {
      // lower than maxOfCut wouldn't be cut
      if (Math.abs(cut) < maxOfCut) {
        successSound.currentTime = 0;
        successSound.autoplay = true;
        successSound.play();
        const meshProps = {
          scale: [scale.x, scale.y, scale.z] as numArr,
          position: [origin[0], origin[1], origin[2]] as numArr,
        };
        const newLayer: gameBox = {
          mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ ...materialProps })
          ),
          ...meshProps,
        };
        const newCurShape: gameBox = {
          mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
              color: lighterColor,
              metalness: 0,
              roughness: 1,
            })
          ),
          ...meshProps,
        };
        addLayer(newLayer);
        setCurShape(newCurShape);
        setCombo(1);
      } else {
        failSound.currentTime = 0;
        failSound.play();
        const over = isX.current
          ? scale.x - Math.abs(cut)
          : scale.z - Math.abs(cut);
        const meshProps = {
          scale: [
            isX.current ? over : scale.x,
            1,
            isX.current ? scale.z : over,
          ] as numArr,
          position: [
            isX.current ? cut / 2 + origin[0] : origin[0],
            0,
            isX.current ? origin[2] : cut / 2 + origin[2],
          ] as numArr,
        };

        const newLayer: gameBox = {
          mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
              ...materialProps,
            })
          ),
          ...meshProps,
        };
        const newCurShape: gameBox = {
          mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
              color: lighterColor,
              metalness: 0,
              roughness: 1,
            })
          ),
          ...meshProps,
        };
        setCombo(0); // Combo initial

        addLayer(newLayer);

        setCurShape(newCurShape);

        addCutBox({
          mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
              ...materialProps,
            })
          ),
          position: [
            isX.current ? overPosX + scale.x * 0.5 * left : origin[0],
            scale.y * height,
            isX.current ? origin[2] : overPosZ + scale.z * 0.514 * left,
          ],
          scale: [
            isX.current ? Math.abs(cut) : scale.x,
            1,
            isX.current ? scale.z : Math.abs(cut),
          ],
        });
      }
    } else {
      const meshProps = {
        scale: [scale.x, scale.y, scale.z] as numArr,
        position: [position.x, position.y, position.z] as numArr,
      };
      addCutBox({
        mesh: new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ ...materialProps })
        ),
        ...meshProps,
      });
      setCurShape(moveInitial);
      setStep("finish");
    }
    isX.current = !isX.current;
  };
  useEffect(() => {
    const subSpace = sub(
      (state) => state.space,
      (value) => {
        if (value) {
          calculatBox();
        }
      }
    );
    return () => {
      subSpace();
    };
  }, [layers, addLayer]);
  return (
    <mesh
      position={[
        isX.current ? 6 : curShape.position[0],
        height * curShape.scale[1],
        isX.current ? curShape.position[2] : 6,
      ]}
      geometry={curShape.mesh.geometry}
      material={curShape.mesh.material}
      scale={curShape.scale}
      ref={ref}
    />
  );
};

export default MovingBox;
