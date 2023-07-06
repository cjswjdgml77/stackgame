import { gameBox } from "../../hook/useGame";
import * as THREE from "three";
export const box = {
  size: [3, 1, 3],
  initialColor: [1, 0.1, 0.1],
  colorGap: 0.05,
};

export const moveInitial: gameBox = {
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(
        box.initialColor[0],
        box.initialColor[1] + 0.1,
        box.initialColor[2] + 0.1
      ),
    })
  ),
  scale: [4, 1, 4],
  position: [0, 0, 0],
};
