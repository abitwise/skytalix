// se-ABC-269: ns per node, chooseMove to depth 8 on a frozen clock, build vs main, 3 alternating rounds. A REPORT.
const [W, B] = process.argv.slice(2);
const he = await import(`${W}/src/engine.ts`), be = await import(`${B}/src/engine.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const F = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const out: Record<string, number[]> = {};
for (let r = 0; r < 3; r++) for (const [who, m] of (r % 2 ? [["base", be], ["door", { chooseMove: he.chooseMoveWithoutTaper }], ["head", he]] : [["head", he], ["door", { chooseMove: he.chooseMoveWithoutTaper }], ["base", be]]) as any)
  for (const [n, fen] of Object.entries(F)) {
    const t = process.hrtime.bigint(); const c = m.chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: 8 });
    const ns = Number(process.hrtime.bigint() - t) / c.nodes; (out[`${who} ${n}`] ??= []).push(+ns.toFixed(1));
  }
console.log(JSON.stringify(out));
for (const n of Object.keys(F)) { const m = (k: string) => out[k].slice(1).reduce((a, b) => a + b) / (out[k].length - 1); console.log(n, "head/base", (m(`head ${n}`) / m(`base ${n}`)).toFixed(4), "door/base (same tree)", (m(`door ${n}`) / m(`base ${n}`)).toFixed(4)); }
