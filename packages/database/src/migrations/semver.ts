const SEMVER_CORE_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

type SemverParts = readonly [major: number, minor: number, patch: number];

const toSemverCore = (version: string): string => {
  const withoutBuildMetadata = version.split('+', 1)[0] ?? '';
  const withoutPrerelease = withoutBuildMetadata.split('-', 1)[0] ?? '';

  return withoutPrerelease.trim();
};

export const assertValidSemver = (version: string): string => {
  const semverCore = toSemverCore(version);

  if (!SEMVER_CORE_REGEX.test(semverCore)) {
    throw new Error(`Invalid semver version: "${version}"`);
  }

  return semverCore;
};

const toSemverParts = (version: string): SemverParts => {
  const normalizedVersion = assertValidSemver(version);
  const matches = normalizedVersion.match(SEMVER_CORE_REGEX);

  if (!matches) {
    throw new Error(`Invalid semver version: "${version}"`);
  }

  return [Number(matches[1]), Number(matches[2]), Number(matches[3])] as const;
};

export const compareSemver = (left: string, right: string): number => {
  const [leftMajor, leftMinor, leftPatch] = toSemverParts(left);
  const [rightMajor, rightMinor, rightPatch] = toSemverParts(right);

  if (leftMajor !== rightMajor) {
    return leftMajor > rightMajor ? 1 : -1;
  }

  if (leftMinor !== rightMinor) {
    return leftMinor > rightMinor ? 1 : -1;
  }

  if (leftPatch !== rightPatch) {
    return leftPatch > rightPatch ? 1 : -1;
  }

  return 0;
};
