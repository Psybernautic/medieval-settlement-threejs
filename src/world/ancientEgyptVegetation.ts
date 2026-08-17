import type { ForestCore } from '../props/forestField.ts';
import type { RiverLayout } from '../rivers/RiverLayout.ts';
import { ANCIENT_EGYPT_WORLD } from './ancientEgyptWorldConstants.ts';

/** Sparse groves follow the Nile and oasis moisture instead of filling the desert. */
export function createAncientEgyptVegetationCores(
  riverLayout: RiverLayout,
): ForestCore[] {
  const nile = riverLayout.corridors[0];
  const cores: ForestCore[] = [];
  for (const [coreIndex, progress] of [0.16, 0.36, 0.6, 0.82].entries()) {
    const point = nile?.points[Math.round((nile.points.length - 1) * progress)];
    if (!point) continue;
    cores.push({
      x: point.x + (coreIndex % 2 === 0 ? 52 : -48),
      z: point.z,
      radiusX: 54,
      radiusZ: 82,
      rotation: coreIndex % 2 === 0 ? 0.08 : -0.1,
      strength: 0.72,
      coniferBias: 0,
    });
  }
  for (const oasis of riverLayout.inlandWaterBodies) {
    if (oasis.kind !== 'oasis') continue;
    cores.push({
      x: oasis.x,
      z: oasis.z,
      radiusX: oasis.radiusX * 1.7,
      radiusZ: oasis.radiusZ * 1.9,
      rotation: oasis.rotation,
      strength: 0.8,
      coniferBias: 0,
    });
  }
  return cores;
}

export function isAncientEgyptVegetationHabitat(
  riverLayout: RiverLayout,
  x: number,
  z: number,
): boolean {
  return riverLayout.sampleVegetationBlend(x, z)
    >= ANCIENT_EGYPT_WORLD.vegetation.minimumHabitatBlend;
}
