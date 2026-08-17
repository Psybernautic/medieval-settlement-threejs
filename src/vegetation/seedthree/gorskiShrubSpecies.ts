/**
 * SeedThree-compatible shrub presets owned by the game.
 *
 * The upstream SeedThree package contains the generator and authored textures,
 * but its public repository does not currently publish shrub preset modules.
 * Keeping these small data-only presets here makes the integration explicit
 * and prevents the build from depending on unpublished vendor files.
 */

type ShrubPreset = {
  name: string;
  params: Record<string, number | boolean>;
  foliage: Record<string, number | string>;
};

const COMMON_BRANCH_PARAMS = {
  armFalloff: 0.84,
  forkRadiusKeep: 0.78,
  forkBaseScale: 0.82,
  trunkFlare: 0.24,
  trunkSegRes: 5,
  branchRepel: 0.78,
  radialSegs: 7,
  segCurveRes: 4,
  trunks: 1,
} as const;

const COMMON_FOLIAGE = {
  mode: 'clusters',
  clusterSizeVar: 0.18,
  downAngle: 62,
  downAngleV: 18,
  bend: 0.08,
  droop: 8,
  droopV: 5,
  trunkClearRadius: 0,
} as const;

export const bilberry: ShrubPreset = {
  name: 'Bilberry',
  params: {
    ...COMMON_BRANCH_PARAMS,
    firstForkHeight: 0.11,
    armLength: 0.13,
    forkGenerations: 5,
    branchiness: 0.98,
    forkSpread: 48,
    forkTriChance: 0,
    curlUp: 0.18,
    armBend: 10,
    gnarliness: 16,
    continuationKink: 13,
    trunkRadius: 0.018,
    minRadius: 0.006,
    radialSegs: 9,
  },
  foliage: {
    ...COMMON_FOLIAGE,
    clustersPerBranch: 6,
    parentSprays: 0.55,
    clusterSize: 0.2,
    clusterQuads: 6,
  },
};

export const commonJuniper: ShrubPreset = {
  name: 'Common Juniper',
  params: {
    ...COMMON_BRANCH_PARAMS,
    firstForkHeight: 0.2,
    armLength: 0.25,
    forkGenerations: 6,
    branchiness: 0.98,
    forkSpread: 47,
    forkTriChance: 0,
    curlUp: 0.32,
    armBend: 9,
    gnarliness: 13,
    continuationKink: 10,
    trunkRadius: 0.035,
    minRadius: 0.009,
    branchRepel: 0.92,
    radialSegs: 8,
  },
  foliage: {
    ...COMMON_FOLIAGE,
    clustersPerBranch: 7,
    parentSprays: 0.68,
    clusterSize: 0.35,
    clusterQuads: 4,
    downAngle: 48,
    droop: 4,
  },
};

export const raspberry: ShrubPreset = {
  name: 'Raspberry',
  params: {
    ...COMMON_BRANCH_PARAMS,
    firstForkHeight: 0.16,
    armLength: 0.2,
    forkGenerations: 6,
    branchiness: 0.98,
    forkSpread: 39,
    forkTriChance: 0,
    curlUp: 0.42,
    armBend: 13,
    gnarliness: 17,
    continuationKink: 14,
    trunkRadius: 0.024,
    minRadius: 0.007,
    radialSegs: 6,
  },
  foliage: {
    ...COMMON_FOLIAGE,
    clustersPerBranch: 6,
    parentSprays: 0.52,
    clusterSize: 0.27,
    clusterQuads: 4,
    downAngle: 55,
    droop: 10,
  },
};
