// BA/PM own derive counter: counts legalMoves() calls in one resolveMoveInput(h, "Qxd4"). Usage: node derives.mjs <tree> <fen>
const [tree, fen] = process.argv.slice(2);
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
const h = newGame(fen);
globalThis.__bapmDerives = 0;
const out = resolveMoveInput(h, "Qxd4");
console.log(`derives=${globalThis.__bapmDerives} kind=${out.kind} messages=${JSON.stringify(out.messages)}`);
