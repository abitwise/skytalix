NAME="R4-san-nfr-N1-generates-with-list-supplied"
CMD="npx vitest run src/san.nfr.test.ts"
EDITS=[("src/san.ts","export function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n","export function toSan(position: Position, move: Move, legal?: readonly Move[]): string {\n  legalMoves(position); // PLANT\n")]
