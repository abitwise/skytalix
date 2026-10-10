const { parseFen } = await import(`${process.argv[2]}/src/fen.ts`);
for (const n of ["10000", "999999", "9007199254740993", "99999999999999999999", "100000000000000000000", "999999999999999999999"]) {
  try { const p = parseFen(`4k3/8/8/8/8/8/8/4K3 w - - 0 ${n}`); console.log(`fullmove ${n}: ACCEPTED as ${p.fullmoveNumber}`); }
  catch (e) { console.log(`fullmove ${n}: rejected: ${(e as Error).message}`); }
}
