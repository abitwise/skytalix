// QE: count legalMoves derives in one resolveMoveInput("Qxd4") prompt. Usage: node count-derives.mts <tree> <fen>
const [tree, fen] = process.argv.slice(2);
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
const h = newGame(fen);
(globalThis as any).__qeDerives = 0;
const out = resolveMoveInput(h, "Qxd4");
console.log(`derives ${(globalThis as any).__qeDerives}; kind ${out.kind}; messages ${JSON.stringify((out as any).messages)}`);
