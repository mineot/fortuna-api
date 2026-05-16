export const toNumber = (value: number | bigint | string | null | undefined): number => {
  if (value == null) {
    return 0;
  }

  return Number(value);
};

export const hasPatchValues = (payload: object): boolean => Object.keys(payload).length > 0;

export const clampPositiveInteger = (value: number): number =>
  Number.isInteger(value) && value > 0 ? value : 0;
