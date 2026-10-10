const [tree] = process.argv.slice(2);
const { parseFen } = await import(`${tree}/src/fen.ts`);
for (const n of ["9999", "10000", "100000000000000000000"]) {
  try { const p = parseFen(`4k3/8/8/8/8/8/8/4K3 w - - 0 ${n}`); console.log(`fullmove ${n}: ACCEPTED ${p.fullmoveNumber}`); }
  catch (e) { console.log(`fullmove ${n}: rejected: ${e.message}`); }
}
