const W = process.argv[2];
const { parseFen } = await import(`${W}/src/fen.ts`);
const { semanticFault } = await import("./rules.mjs");
for (const fen of process.argv.slice(3)) console.log(`${fen}  adr0033=${semanticFault(fen.split(" "), parseFen(fen)) ?? "accepted"}`);
