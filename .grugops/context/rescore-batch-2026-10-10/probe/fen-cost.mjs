const wt = process.argv[2];
const { parseFen } = await import(`${wt}/src/fen.ts`);
const { isInCheck } = await import(`${wt}/src/legal.ts`);
const fens = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
function bench(label, fn, n = 200000) {
  for (let i = 0; i < 20000; i++) fn(i);
  const rounds = [];
  for (let r = 0; r < 5; r++) {
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < n; i++) fn(i);
    rounds.push(Number(process.hrtime.bigint() - t0) / n);
  }
  rounds.sort((a, b) => a - b);
  console.log(`${label}: median ${rounds[2].toFixed(0)} ns/call (min ${rounds[0].toFixed(0)}, max ${rounds[4].toFixed(0)})`);
}
bench("parseFen (3 fens rotating)", (i) => parseFen(fens[i % 3]));
const parsed = fens.map((f) => parseFen(f));
const flip = (p) => { p.blackToMove = !p.blackToMove; const r = isInCheck(p); p.blackToMove = !p.blackToMove; return r; };
bench("isInCheck of side NOT to move (flip, probe, flip back)", (i) => flip(parsed[i % 3]));
console.log(`node ${process.version}, ${process.platform} ${process.arch}`);
