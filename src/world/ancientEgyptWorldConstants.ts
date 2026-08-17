/**
 * Ancient Egypt world tuning sheet.
 *
 * Keep authored Nile, floodplain, oasis, desert, palette, and vegetation
 * values here so the world can be art-directed without hunting through the
 * renderer and procedural generation systems.
 */
export const ANCIENT_EGYPT_WORLD = {
  presetId: 'nile_valley',
  defaultSeed: 0x4e1a_2e0d,
  presetSeedSignature: 0x4e10_0000,
  topography: 24,
  hydrology: 86,
  forestDensity: 4,
  nile: {
    centerXRatio: -0.12,
    broadMeanderRatio: 0.022,
    localMeanderRatio: 0.006,
    broadMeanderCycles: 1.18,
    localMeanderCycles: 4.35,
    halfWidthMin: 52,
    halfWidthMax: 72,
    channelDepthMin: 2.4,
    channelDepthMax: 3.4,
    sampleSpacing: 2.6,
    floodplainInnerBank: 12,
    floodplainOuterBank: 210,
    segmentIndexReach: 300,
    canalHalfWidth: 3.6,
    canalDepth: 1.15,
  },
  oases: [
    {
      xRatio: -0.69,
      zRatio: 0.42,
      radiusX: 31,
      radiusZ: 22,
      rotation: 0.28,
      depth: 2.7,
    },
    {
      xRatio: 0.67,
      zRatio: -0.36,
      radiusX: 27,
      radiusZ: 20,
      rotation: -0.34,
      depth: 2.45,
    },
  ],
  oasisVegetationOuterScale: 2.7,
  terrain: {
    floodplainBaseHeight: 0.65,
    floodplainUndulation: 0.42,
    northwardGrade: 1.35,
    desertBaseHeight: 5.6,
    duneAmplitude: 2.7,
    duneSecondaryAmplitude: 1.15,
    rockyEdgeStart: 0.72,
    rockyEdgeHeight: 16,
  },
  vegetation: {
    densityScale: 0.035,
    minimumHabitatBlend: 0.18,
  },
  openingView: {
    distance: 104,
    riverContextBlend: 0.26,
    yawDeg: -42,
    pitchDeg: 50,
  },
  palms: {
    nilePalmCount: 18,
    palmsPerOasis: 11,
    trunkHeightMin: 6.8,
    trunkHeightMax: 10.5,
    frondsPerPalm: 10,
    frondLength: 4.4,
    trunkColor: 0x8d673d,
    frondColor: 0x446b2c,
  },
  atmosphere: {
    latitudeDeg: 30.05,
    longitudeDeg: 31.24,
    cloudCoverage: 0.12,
    cloudHeight: 360,
    hazeStrength: 0.16,
    turbidity: 2.2,
    rayleigh: 0.62,
    initialSunElevationDeg: 54,
    fogColor: 0xc9b17f,
    fogDensity: 0.00052,
    hemiSkyColor: 0xe9e1ca,
    hemiGroundColor: 0x86683f,
    ambientColor: 0xcdbf9e,
    fillColor: 0xc9d5d2,
  },
  minimapColors: {
    fertile: { r: 95, g: 118, b: 48 },
    lush: { r: 53, g: 86, b: 35 },
    sand: { r: 196, g: 158, b: 91 },
    water: { r: 39, g: 112, b: 171 },
    silt: { r: 83, g: 61, b: 37 },
  },
  // Linear-space colors consumed by the WebGPU terrain material.
  terrainPalette: {
    fertile: [0.15, 0.24, 0.045],
    lush: [0.026, 0.072, 0.012],
    sand: [0.43, 0.285, 0.105],
    stableFertile: [0.12, 0.18, 0.035],
    stableLush: [0.022, 0.055, 0.01],
    stableSand: [0.34, 0.225, 0.082],
  },
} as const;

export function isAncientEgyptTerrainPreset(preset: string): boolean {
  return preset === ANCIENT_EGYPT_WORLD.presetId;
}
