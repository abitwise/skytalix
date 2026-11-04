// arch-ABC-283-mate step 1: node trace along the door's (history-off) mating line, door and head.
// usage: node trace.ts <probeRoot> search|choose <fen> <depth>
const [root, mode, fen, depthArg] = process.argv.slice(2);
const depth = Number(depthArg);
const S = await import(`${root}/src/search.ts`);
const E = await import(`${root}/src/engine.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const CAND = process.env.CAND ?? "base";
const FL: Record<string, any> = { base: {}, K2: { k2: true }, K3: { k3: true }, K1L: { k1L: true } };
const run = (history: boolean) => {
  const fl = FL[CAND]; S.PROBE.k1L = !!fl.k1L; S.PROBE.k2 = !!fl.k2; S.PROBE.k3 = !!fl.k3;
  const ev: any[] = [];
  S.PROBE.trace = (e: any) => ev.push(e);
  S.PROBE.path.length = 0;
  const r = mode === "search"
    ? S.searchWith(parseFen(fen), depth, { history })
    : E.chooseMoveWith(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: depth }, { history });
  S.PROBE.trace = null;
  return { r, ev };
};
const door = run(false), head = run(true);
// the door's line: at each node, the last visit's best-scoring move
const line: string[] = [];
for (let ply = 0; ply < depth; ply++) {
  const P = line.join(" ");
  const at = door.ev.filter((e) => e.path === P && e.ply === ply && e.score !== undefined);
  if (at.length === 0) break;
  let start = 0; for (let i = 0; i < at.length; i++) if (at[i].index === 0) start = i;
  const last = at.slice(start);
  last.sort((a, b) => b.score - a.score);
  line.push(last[0].move);
}
console.log(JSON.stringify({ candidate: CAND, fen, mode, depth, door: [door.r.score, S.mvName(door.r.move)], head: [head.r.score, S.mvName(head.r.move)], doorLine: line.join(" ") }));
const fmt = (e: any) => [e.ply, "d" + e.depth, e.tt !== undefined ? `TT ${e.tt}` : e.skipped ? `SKIP ${e.move}` : `${e.move}`, e.index !== undefined ? `i${e.index}` : "", e.pre !== undefined && e.pre >= 0 ? `pre${e.pre}` : "", e.reduction ? `R${e.reduction}` : "", e.score !== undefined ? `=${e.score}` : "", e.alphaIn !== undefined ? `w(${e.alphaIn},${e.beta})` : e.alpha !== undefined ? `w(${e.alpha},${e.beta})` : "", e.h ? `h${e.h}` : ""].filter(Boolean).join(" ");
for (const [name, t] of [["DOOR", door], ["HEAD", head]] as const) {
  for (let ply = 0; ply < line.length; ply++) {
    const P = line.slice(0, ply).join(" ");
    const at = t.ev.filter((e: any) => e.path === P && e.ply === ply);
    console.log(`${name} node [${P || "root"}] ply ${ply}: ${at.length} events`);
    for (const e of at) console.log("   " + fmt(e) + (e.move === line[ply] ? "   <== line" : ""));
  }
}
