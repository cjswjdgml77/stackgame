import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { create } from "zustand";
import * as THREE from "three";

export type numArr = [number, number, number];
export interface gameBox {
  mesh: Mesh<BoxGeometry, MeshStandardMaterial>;
  scale: numArr;
  position: numArr;
}
type Game = {
  step: string;
  setStep: (value: string) => void;
  layers: gameBox[];
  cutBoxs: gameBox[] | [];
  addLayer: (box: gameBox) => void;
  addCutBox: (box: gameBox) => void;
  reset: () => void;
  combo: number;
  setCombo: (value: number) => void;
};
export const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 0.1, 0.1),
    metalness: 0,
    roughness: 1,
  })
);

const useGame = create<Game>((set) => ({
  step: "initial",
  setStep: (value) =>
    set((state) => {
      if (state.step === value) return {};
      return { step: value };
    }),
  layers: [{ mesh: boxMesh, scale: [4, 1, 4], position: [0, 0, 0] }],
  addLayer: (box) =>
    set((state) => {
      return { layers: [...state.layers, box] };
    }),
  cutBoxs: [],
  addCutBox: (box) =>
    set((state) => {
      return { cutBoxs: [...state.cutBoxs, box] };
    }),
  reset: () =>
    set(() => {
      return {
        layers: [{ mesh: boxMesh, scale: [4, 1, 4], position: [0, 0, 0] }],
        cutBoxs: [],
      };
    }),
  combo: 0,
  setCombo: (value) =>
    set((state) => {
      if (value === 0) return { combo: 0 };
      return { combo: state.combo + 1 };
    }),
}));

export default useGame;
