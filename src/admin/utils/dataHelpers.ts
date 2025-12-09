/**
 * Helper functions to safely extract typed values from Record<string, unknown>
 */

export function getStringValue(data: Record<string, unknown>, key: string, defaultValue = ''): string {
  const value = data[key];
  return typeof value === 'string' ? value : defaultValue;
}

export function getArrayValue<T>(data: Record<string, unknown>, key: string, defaultValue: T[] = []): T[] {
  const value = data[key];
  return Array.isArray(value) ? value as T[] : defaultValue;
}

export function getNumberValue(data: Record<string, unknown>, key: string, defaultValue = 0): number {
  const value = data[key];
  return typeof value === 'number' ? value : defaultValue;
}

export function getBooleanValue(data: Record<string, unknown>, key: string, defaultValue = false): boolean {
  const value = data[key];
  return typeof value === 'boolean' ? value : defaultValue;
}

export function getObjectValue<T extends Record<string, unknown>>(
  data: Record<string, unknown>,
  key: string,
  defaultValue: T
): T {
  const value = data[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as T : defaultValue;
}

