NAME="R4-zobrist-nfr-NFR005-asks-hasLegalEnPassant"
CMD="npx vitest run src/zobrist.nfr.test.ts"
EDITS=[("src/zobrist.ts",'import { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";\n','import { hasLegalEnPassant } from "./legal.ts";\nimport { FLAG_CASTLE, FLAG_EN_PASSANT, type Move } from "./moves.ts";\n'),
("src/zobrist.ts","export function zobristKey(position: Position): bigint {\n  let key = 0n;\n","export function zobristKey(position: Position): bigint {\n  hasLegalEnPassant(position); // PLANT: an expected-0 call added\n  let key = 0n;\n")]
