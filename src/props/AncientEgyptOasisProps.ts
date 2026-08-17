import * as THREE from 'three';
import type { RiverLayout } from '../rivers/RiverLayout.ts';
import type { Terrain } from '../terrain/Terrain.ts';
import { mulberry32 } from '../utils/random.ts';
import { ANCIENT_EGYPT_WORLD } from '../world/ancientEgyptWorldConstants.ts';

export type AncientEgyptOasisProps = {
  group: THREE.Group;
  dispose: () => void;
};

type PalmPlacement = {
  x: number;
  z: number;
  height: number;
  yaw: number;
};

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function createAncientEgyptOasisProps(
  terrain: Terrain,
  riverLayout: RiverLayout,
  seed: number,
): AncientEgyptOasisProps {
  const config = ANCIENT_EGYPT_WORLD.palms;
  const rng = mulberry32(seed ^ 0x0a515);
  const placements = createPalmPlacements(riverLayout, rng);
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.34, 1, 8, 5);
  const frondGeometry = createPalmFrondGeometry(config.frondLength);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    name: 'Date palm fibrous trunk',
    color: config.trunkColor,
    roughness: 0.96,
    metalness: 0,
  });
  const frondMaterial = new THREE.MeshStandardMaterial({
    name: 'Date palm fronds',
    color: config.frondColor,
    roughness: 0.88,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const trunks = new THREE.InstancedMesh(
    trunkGeometry,
    trunkMaterial,
    Math.max(placements.length, 1),
  );
  const frondCount = placements.length * config.frondsPerPalm;
  const fronds = new THREE.InstancedMesh(
    frondGeometry,
    frondMaterial,
    Math.max(frondCount, 1),
  );
  trunks.name = 'Nile and oasis date palm trunks';
  fronds.name = 'Nile and oasis date palm crowns';
  trunks.count = placements.length;
  fronds.count = frondCount;
  trunks.castShadow = true;
  trunks.receiveShadow = true;
  fronds.castShadow = true;
  fronds.receiveShadow = true;

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  let frondIndex = 0;
  placements.forEach((palm, palmIndex) => {
    const groundY = terrain.getHeightAt(palm.x, palm.z);
    const trunkLean = 0.025 + rng() * 0.055;
    quaternion.setFromEuler(new THREE.Euler(
      Math.cos(palm.yaw) * trunkLean,
      palm.yaw,
      Math.sin(palm.yaw) * trunkLean,
      'YXZ',
    ));
    position.set(palm.x, groundY + palm.height * 0.5, palm.z);
    scale.set(0.88 + rng() * 0.22, palm.height, 0.88 + rng() * 0.22);
    matrix.compose(position, quaternion, scale);
    trunks.setMatrixAt(palmIndex, matrix);

    const crownY = groundY + palm.height * 0.96;
    for (let leaf = 0; leaf < config.frondsPerPalm; leaf++) {
      const yaw = palm.yaw + (leaf / config.frondsPerPalm) * Math.PI * 2 + (rng() - 0.5) * 0.2;
      const upwardTilt = leaf % 3 === 0 ? 0.16 : -0.04 - rng() * 0.1;
      quaternion.setFromAxisAngle(Y_AXIS, yaw)
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), upwardTilt));
      position.set(palm.x, crownY + (rng() - 0.5) * 0.28, palm.z);
      const leafScale = 0.82 + rng() * 0.36;
      scale.set(leafScale, leafScale, leafScale);
      matrix.compose(position, quaternion, scale);
      fronds.setMatrixAt(frondIndex++, matrix);
    }
  });
  trunks.instanceMatrix.needsUpdate = true;
  fronds.instanceMatrix.needsUpdate = true;

  const group = new THREE.Group();
  group.name = 'Ancient Egypt riparian date palms';
  group.userData.biome = 'nile-valley';
  group.add(trunks, fronds);
  return {
    group,
    dispose: () => {
      trunkGeometry.dispose();
      frondGeometry.dispose();
      trunkMaterial.dispose();
      frondMaterial.dispose();
    },
  };
}

function createPalmPlacements(
  riverLayout: RiverLayout,
  rng: () => number,
): PalmPlacement[] {
  const config = ANCIENT_EGYPT_WORLD.palms;
  const placements: PalmPlacement[] = [];
  const nile = riverLayout.corridors[0];
  for (let index = 0; index < config.nilePalmCount; index++) {
    const progress = 0.06 + (index + 0.5) / config.nilePalmCount * 0.88;
    const point = nile?.points[Math.round((nile.points.length - 1) * progress)];
    if (!point) continue;
    const side = index % 2 === 0 ? 1 : -1;
    const bankOffset = point.halfWidth + 15 + rng() * 26;
    appendDryPalm(placements, riverLayout, {
      x: point.x + side * bankOffset,
      z: point.z + (rng() - 0.5) * 18,
      height: THREE.MathUtils.lerp(config.trunkHeightMin, config.trunkHeightMax, rng()),
      yaw: rng() * Math.PI * 2,
    });
  }

  for (const oasis of riverLayout.inlandWaterBodies) {
    if (oasis.kind !== 'oasis') continue;
    for (let index = 0; index < config.palmsPerOasis; index++) {
      const angle = (index / config.palmsPerOasis) * Math.PI * 2 + rng() * 0.28;
      const radiusScale = 1.18 + rng() * 0.72;
      appendDryPalm(placements, riverLayout, {
        x: oasis.x + Math.cos(angle) * oasis.radiusX * radiusScale,
        z: oasis.z + Math.sin(angle) * oasis.radiusZ * radiusScale,
        height: THREE.MathUtils.lerp(config.trunkHeightMin, config.trunkHeightMax, rng()),
        yaw: rng() * Math.PI * 2,
      });
    }
  }
  return placements;
}

function appendDryPalm(
  placements: PalmPlacement[],
  riverLayout: RiverLayout,
  placement: PalmPlacement,
): void {
  if (riverLayout.isWaterAt(placement.x, placement.z)) return;
  if (riverLayout.sampleVegetationBlend(placement.x, placement.z) < 0.12) return;
  placements.push(placement);
}

function createPalmFrondGeometry(length: number): THREE.BufferGeometry {
  const segments = 6;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let index = 0; index <= segments; index++) {
    const t = index / segments;
    const x = t * length;
    const y = -t * t * length * 0.28;
    const halfWidth = Math.sin(t * Math.PI) * 0.42 + 0.025;
    positions.push(x, y, -halfWidth, x, y, halfWidth);
    uvs.push(t, 0, t, 1);
    if (index === segments) continue;
    const a = index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
