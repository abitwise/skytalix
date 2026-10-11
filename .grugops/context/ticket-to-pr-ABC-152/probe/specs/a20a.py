NAME="R2nd-san-A20-export-PLANT"
CMD="npx vitest run src/san.test.ts -t A20"
EDITS=[("src/san.ts","export function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n","export const PLANT = 1;\nexport function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n")]
