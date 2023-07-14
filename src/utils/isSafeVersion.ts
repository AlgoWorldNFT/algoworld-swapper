import { MIN_CONTRACTS_VERSION } from '@/common/constants';

export function isSafeVersion(version: string | undefined): boolean {
  if (version === undefined) {
    return false;
  }

  // Split the version strings into arrays of numbers.
  const minVersionParts = MIN_CONTRACTS_VERSION.split(`.`).map(Number);
  const versionParts = version.split(`.`).map(Number);

  // Compare each part of the version strings.
  for (let i = 0; i < 3; i++) {
    if (versionParts[i] < minVersionParts[i]) {
      return false;
    } else if (versionParts[i] > minVersionParts[i]) {
      return true;
    }
  }

  // If the code reaches this point, the versions are equal.
  return true;
}
