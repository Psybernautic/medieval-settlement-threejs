import type { RiverField } from '../rivers/RiverField.ts';
import type { TerrainBounds } from '../terrain/Terrain.ts';
import { sampleTerrainBlendWeights } from '../terrain/TerrainBlendWeights.ts';
import { riverFieldBounds } from './worldToMapPercent.ts';
import { yieldToMain } from '../utils/yieldToMain.ts';
import { getActiveWorldGeneration } from '../world/worldGenerationContext.ts';
import {
  ANCIENT_EGYPT_WORLD,
  isAncientEgyptTerrainPreset,
} from '../world/ancientEgyptWorldConstants.ts';

const MINIMAP_RESOLUTION = 512;
const ROWS_PER_YIELD = 32;

const GRASS_COLORS = {
  meadow: { r: 78, g: 118, b: 58 },
  dense: { r: 48, g: 82, b: 42 },
  dry: { r: 128, g: 118, b: 62 },
} as const;

const WATER_COLOR = { r: 52, g: 108, b: 158 };
const MUD_COLOR = { r: 92, g: 72, b: 48 };

export type TerrainMinimapImage = {
  canvas: HTMLCanvasElement;
  bounds: TerrainBounds;
};

export async function createTerrainMinimapImage(riverField: RiverField): Promise<TerrainMinimapImage> {
  const canvas = document.createElement('canvas');
  canvas.width = MINIMAP_RESOLUTION;
  canvas.height = MINIMAP_RESOLUTION;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to acquire 2D canvas context for terrain minimap.');
  }

  const image = context.createImageData(MINIMAP_RESOLUTION, MINIMAP_RESOLUTION);
  const bounds = riverFieldBounds(riverField);
  const rowDenominator = Math.max(MINIMAP_RESOLUTION - 1, 1);
  const columnDenominator = Math.max(MINIMAP_RESOLUTION - 1, 1);

  for (let row = 0; row < MINIMAP_RESOLUTION; row++) {
    if (row > 0 && row % ROWS_PER_YIELD === 0) {
      await yieldToMain();
    }

    const z = bounds.minZ + (row / rowDenominator) * (bounds.maxZ - bounds.minZ);
    for (let column = 0; column < MINIMAP_RESOLUTION; column++) {
      const x = bounds.minX + (column / columnDenominator) * (bounds.maxX - bounds.minX);
      const color = sampleMinimapColor(riverField, x, z);
      const index = (row * MINIMAP_RESOLUTION + column) * 4;
      image.data[index] = color.r;
      image.data[index + 1] = color.g;
      image.data[index + 2] = color.b;
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return { canvas, bounds };
}

function sampleMinimapColor(
  riverField: RiverField,
  x: number,
  z: number,
): { r: number; g: number; b: number } {
  const ancientEgypt = isAncientEgyptTerrainPreset(
    getActiveWorldGeneration().terrainPreset,
  );
  const palette = ancientEgypt
    ? {
        meadow: ANCIENT_EGYPT_WORLD.minimapColors.fertile,
        dense: ANCIENT_EGYPT_WORLD.minimapColors.lush,
        dry: ANCIENT_EGYPT_WORLD.minimapColors.sand,
        water: ANCIENT_EGYPT_WORLD.minimapColors.water,
        mud: ANCIENT_EGYPT_WORLD.minimapColors.silt,
      }
    : {
        ...GRASS_COLORS,
        water: WATER_COLOR,
        mud: MUD_COLOR,
      };
  if (riverField.isRenderedWetAt(x, z)) {
    return palette.water;
  }

  const [meadow, dense, dry] = sampleTerrainBlendWeights(x, z);
  const grass = {
    r: palette.meadow.r * meadow + palette.dense.r * dense + palette.dry.r * dry,
    g: palette.meadow.g * meadow + palette.dense.g * dense + palette.dry.g * dry,
    b: palette.meadow.b * meadow + palette.dense.b * dense + palette.dry.b * dry,
  };

  const shoreGrass = riverField.sampleMudBlendAt(x, z);
  const mudMix = (1 - shoreGrass) * 0.88;
  return blendColors(grass, palette.mud, mudMix);
}

function blendColors(
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number },
  t: number,
): { r: number; g: number; b: number } {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(from.r + (to.r - from.r) * clamped),
    g: Math.round(from.g + (to.g - from.g) * clamped),
    b: Math.round(from.b + (to.b - from.b) * clamped),
  };
}
