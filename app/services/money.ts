export function toCents(value: number | string): bigint {
  const normalized = String(value).trim();
  if (!normalized) throw new Error('Invalid money value');

  const negative = normalized.startsWith('-');
  const raw = negative ? normalized.slice(1) : normalized;
  const [intPartRaw, decPartRaw = ''] = raw.split('.');

  if (!/^\d+$/.test(intPartRaw || '0') || !/^\d*$/.test(decPartRaw)) {
    throw new Error('Invalid money value');
  }

  const intPart = BigInt(intPartRaw || '0');
  const padded = (decPartRaw + '00').slice(0, 3);
  const cents = BigInt(padded.slice(0, 2));
  const third = Number(padded[2]);

  let total = intPart * 100n + cents;
  if (third >= 5) total += 1n;
  if (negative) total *= -1n;

  return total;
}

export function centsToMoney(cents: bigint): string {
  const negative = cents < 0n;
  const absolute = negative ? cents * -1n : cents;
  const intPart = absolute / 100n;
  const decPart = absolute % 100n;
  const asString = `${intPart.toString()}.${decPart.toString().padStart(2, '0')}`;
  return negative ? `-${asString}` : asString;
}

export function money(value: number | string): string {
  return centsToMoney(toCents(value));
}
