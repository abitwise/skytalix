// se-ABC-291 K0 reader. Usage: node k0.ts <mode> <root> [baseRoot]. Modes: a (off door against the base's shipped entries),
// c (the head's counts, on `root`), b (every door on the base against the same door on `root`). Rows are ADR-0075 d7's;
// (b) is the shape se-ABC-303 read S2 in: search doors at d5, the three unpruned at d3, chooseMove doors at d6.
const [mode, root, baseRoot] = process.argv.slice(2);
const load = async (r: string) => ({ S: await import(`${r}/src/search.ts`), E: await import(`${r}/src/engine.ts`), F: await import(`${r}/src/fen.ts`), P: await import(`${r}/src/position.ts`) });
const H = await load(root as string);
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const ROWS: [string, string, string, number][] = [
  ["chooseMove", "kiwipete", KIWI, 8], ["chooseMove", "kiwipete", KIWI, 9],
  ["chooseMove", "position-6", POS6, 8], ["chooseMove", "position-6", POS6, 9], ["chooseMove", "position-6", POS6, 10],
  ["search", "kiwipete", KIWI, 8], ["search", "position-6", POS6, 8],
];
const mv = (M: any, m: { from: number; to: number } | null) => (m ? M.P.squareName(m.from) + M.P.squareName(m.to) : "-");
const read = (M: any, f: any, kind: string, fen: string, d: number) => {
  const r = kind === "search" ? f(M.F.parseFen(fen), d) : f(M.F.parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
  return { nodes: r.nodes, score: r.score, move: mv(M, r.move) };
};
const out = (o: unknown) => console.log(JSON.stringify(o));
const same = (a: any, b: any) => a.nodes === b.nodes && a.score === b.score && a.move === b.move;
if (mode === "c") {
  for (const [k, n, fen, d] of ROWS) out({ row: "K0c", kind: k, name: n, d, ...read(H, k === "search" ? H.S.search : H.E.chooseMove, k, fen, d) });
}
if (mode === "a") {
  const B = await load(baseRoot as string);
  let ok = 0;
  for (const [k, n, fen, d] of ROWS) {
    const door = read(H, k === "search" ? H.S.searchWithoutPawnShape : H.E.chooseMoveWithoutPawnShape, k, fen, d);
    const base = read(B, k === "search" ? B.S.search : B.E.chooseMove, k, fen, d);
    const eq = same(door, base); if (eq) ok++;
    out({ row: "K0a", kind: k, name: n, d, door, base, eq });
  }
  out({ K0a: ok, of: ROWS.length });
}
if (mode === "b") {
  const B = await load(baseRoot as string);
  const doorsS = Object.keys(B.S).filter((k) => /^searchWithout/.test(k));
  const doorsE = Object.keys(B.E).filter((k) => /^chooseMoveWithout/.test(k));
  let ok = 0, rows = 0;
  for (const [n, fen] of [["kiwipete", KIWI], ["position-6", POS6]] as const) {
    for (const k of doorsS) {
      const d = /Pruning$|PruningOrQuiescence/.test(k) && !/See|Futility|MoveCount/.test(k) ? 3 : 5;
      const a = read(H, H.S[k], "search", fen, d), b = read(B, B.S[k], "search", fen, d);
      const eq = same(a, b); rows++; if (eq) ok++;
      out({ row: "K0b", door: k, name: n, d, ...a, baseNodes: b.nodes, eq });
    }
    for (const k of doorsE) {
      const a = read(H, H.E[k], "chooseMove", fen, 6), b = read(B, B.E[k], "chooseMove", fen, 6);
      const eq = same(a, b); rows++; if (eq) ok++;
      out({ row: "K0b", door: k, name: n, d: 6, ...a, baseNodes: b.nodes, eq });
    }
  }
  out({ K0b: ok, of: rows, doorsS: doorsS.length, doorsE: doorsE.length });
}
