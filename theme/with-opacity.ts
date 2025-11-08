/**
 * A helper function to convert a hex color and an opacity value into an `rgba` string.
 * @param hex The hex color string (e.g., '#RRGGBB').
 * @param opacity The opacity value (0-1).
 * @returns An rgba color string.
 */
export function withOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}