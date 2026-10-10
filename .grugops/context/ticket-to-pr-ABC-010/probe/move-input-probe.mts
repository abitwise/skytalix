// ABC-010 SE probe: resolveMoveInput's messages for (fen, line) pairs in <tree>. Reads only.
const tree = process.argv[2];
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
const { parseFen } = await import(`${tree}/src/fen.ts`);
for (let i = 3; i < process.argv.length; i += 2) {
  const fen = process.argv[i], line = process.argv[i + 1];
  let verdict = "accepted";
  try { parseFen(fen); } catch (e) { verdict = `REJECTED ${e.message}`; }
  let out;
  try { const o = resolveMoveInput(newGame(fen), line); out = JSON.stringify(o.kind === "ambiguous" ? { kind: o.kind, messages: o.messages } : o.kind); } catch (e) { out = `throws ${e.message}`; }
  console.log(`${fen} | ${line} | parseFen ${verdict}\n   -> ${out}`);
}
