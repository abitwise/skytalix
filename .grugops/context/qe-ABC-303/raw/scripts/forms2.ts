// qe-ABC-303: forms mode's in-check call, corrected: its first FEN was not in check (the c3 knight blocks b4). usage: node forms2.ts <H root>
const [H] = process.argv.slice(2) as [string];
const { moveCountNode } = await import(`${H}/src/search.ts`);
const { parseFen } = await import(`${H}/src/fen.ts`);
const { isInCheck } = await import(`${H}/src/legal.ts`).catch(() => ({ isInCheck: undefined as any }));
const check = parseFen("4k3/8/8/8/8/8/4r3/RNBQKBNR w KQ - 0 1"), quiet = parseFen("4k3/8/8/8/8/8/r7/RNBQKBNR w KQ - 0 1");
console.log(JSON.stringify({ inCheck: moveCountNode(check, 2, 1, 0, 1), sameMaterialNotInCheck: moveCountNode(quiet, 2, 1, 0, 1), inCheckProbe: isInCheck ? isInCheck(check) : "not exported here" }));
