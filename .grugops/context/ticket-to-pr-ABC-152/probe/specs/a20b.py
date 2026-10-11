NAME="R2nd-san-A20-alias-toSanX"
CMD="npx vitest run src/san.test.ts -t A20"
EDITS=[("src/san.ts","export function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n","export { toSan as toSanX };\nexport function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n")]
