// qe-ABC-269 ns per node REPORT (PREREG ...e36ee7ca, nps.ts's shape): chooseMove d8 frozen clock, 3 rounds alternating, round 1 dropped.
const [S] = process.argv.slice(2);
const he = await import(`${S}/H/src/engine.ts`), ue = await import(`${S}/U/src/engine.ts`), be = await import(`${S}/B/src/engine.ts`);
const { parseFen } = await import(`${S}/H/src/fen.ts`);
const F = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const arms: [string, any][] = [["H", he.chooseMove], ["Hdoor", he.chooseMoveWithoutTaper], ["U", ue.chooseMove], ["main", be.chooseMove]];
const out: Record<string, number[]> = {}; const nodes: Record<string, number[]> = {};
for (let r = 0; r < 3; r++) for (const [who, cm] of (r % 2 ? [...arms].reverse() : arms))
  for (const [n, fen] of Object.entries(F)) {
    const t = process.hrtime.bigint(); const c = cm(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: 8 });
    const ns = Number(process.hrtime.bigint() - t) / c.nodes; (out[`${who} ${n}`] ??= []).push(+ns.toFixed(1)); (nodes[`${who} ${n}`] ??= []).push(c.nodes);
  }
console.log(JSON.stringify({ out, nodes }));
const m = (k: string) => out[k].slice(1).reduce((a, b) => a + b) / (out[k].length - 1);
for (const n of Object.keys(F)) console.log(n, Object.fromEntries(arms.map(([w]) => [w, +m(`${w} ${n}`).toFixed(1)])), "H/U", (m(`H ${n}`) / m(`U ${n}`)).toFixed(4), "H/main", (m(`H ${n}`) / m(`main ${n}`)).toFixed(4), "Hdoor/main", (m(`Hdoor ${n}`) / m(`main ${n}`)).toFixed(4));
