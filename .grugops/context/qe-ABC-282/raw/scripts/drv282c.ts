// qe-ABC-282 CONTROL for r12 (drv282.ts with three edits; information only): softMs = H, which is NOT a shipped value, on K25 at H = 10..400 step 10 and 4..9, plus SE's three D12 fixtures. It proves the instrument and oracle can see multi-pass aborts.
// qe-ABC-282 offline driver: QE's own, written from ABC-282 / ADR-0071's words, not from the Engineer's scripts.
// usage: node drv282.ts <treeRoot> <named.json> <positions.json> <part>
// parts: a0 | a03 | ident | a1c | b | sweep | r12 | r12x. One JSON line per row. Every search is on a frozen or virtual clock.
import { readFileSync } from "node:fs";
const [root, namedPath, posPath, part] = process.argv.slice(2);
const E = await import(`${root}/src/engine.ts`);
const U = await import(`${root}/src/uci-session.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const named = JSON.parse(readFileSync(namedPath, "utf8")).map((p: any) => ({ name: p.name, fen: p.fen }));
const sampled = JSON.parse(readFileSync(posPath, "utf8")).skytalix.map((p: any) => ({ name: p.game, fen: p.fen }));
const K25 = [...named, ...sampled];
const fenOf = (n: string) => named.find((p: any) => p.name === n).fen;
const sq = (f: number, t: number, pr: any) => squareName(f) + squareName(t) + (pr ? `=${pr}` : "");
const mv = (m: any) => (m ? sq(m.from, m.to, m.promotion) : "-");
const out = (o: any) => console.log(JSON.stringify(o));
const read = (c: any) => ({ move: mv(c.move), score: c.score, depth: c.depth, nodes: c.nodes, partial: c.partial ?? null, elapsedMs: c.elapsedMs });
const BUDGETS = [25, 50, 100, 200, 400];
const B = 2.3;
const session = (mode: string, lines: string[], fen: string) => {
  const o: string[] = [];
  const s = U.createUciSession({ write: (l: string) => o.push(l), now: virtualClock(1), random: () => 0.5, book: { bookMove: () => undefined, warm: () => {}, openingName: () => undefined } });
  s.handleLine("setoption name OwnBook value false");
  s.handleLine(`setoption name TimeMode value ${mode}`);
  for (const l of lines.slice(0, -1)) s.handleLine(l);
  s.handleLine(`position fen ${fen}`);
  o.length = 0;
  s.handleLine(lines.at(-1) as string);
  return o;
};
if (part === "a0") {
  for (const [name, ds] of [["kiwipete", [6, 7, 8]], ["position-6", [6, 7, 8]]] as const)
    for (const d of ds) {
      const f = { budgetMs: 60000, now: () => 0, maxDepth: d };
      const a = read(E.chooseMove(parseFen(fenOf(name)), f));
      const b = read(E.chooseMove(parseFen(fenOf(name)), { ...f, softMs: 1 }));
      out({ row: "A0-1", name, d, absent: a, soft1: b });
    }
  for (const [name, h] of [["kiwipete", 50], ["kiwipete", 200], ["position-6", 50], ["position-6", 200]] as const)
    out({ row: "A0-2", name, h, absent: read(E.chooseMove(parseFen(fenOf(name)), { budgetMs: h, now: virtualClock(1) })) });
}
if (part === "a03") {
  const rows = [["level", "go movetime 200"], ["level", "go wtime 4000 btime 4000"], ["simple-tournament", "go movetime 200"], ["simple-tournament", "go wtime 8000 btime 8000 movestogo 40"], ["uci-clock-mode", "go movetime 200"], ["uci-clock-mode", "go depth 6"], ["uci-clock-mode", "go wtime 8000 btime 8000 movestogo 40"]];
  for (const [m, g] of rows) out({ mode: m, go: g, lines: session(m as string, [g as string], fenOf("position-6")) });
}
if (part === "ident") {
  // Every row where W1 is off, on all of K25: session lines byte for byte, plus chooseMove with softMs absent.
  const rows: [string, string[]][] = [
    ["level", ["go movetime 60"]], ["level", ["go wtime 4000 btime 4000"]], ["level", ["go wtime 3000 btime 3000 winc 50 binc 50 movestogo 10"]],
    ["level", ["go depth 5"]], ["level", ["go nodes 30000"]], ["level", ["setoption name Skill Level value 1", "go"]], ["level", ["setoption name Skill Level value 3", "go wtime 4000 btime 4000"]],
    ["simple-tournament", ["go movetime 60"]], ["simple-tournament", ["go wtime 8000 btime 8000 movestogo 40"]], ["simple-tournament", ["go wtime 1500 btime 1500"]], ["simple-tournament", ["go depth 5"]], ["simple-tournament", ["go nodes 30000"]],
    ["uci-clock-mode", ["go movetime 60"]], ["uci-clock-mode", ["go wtime 8000 btime 8000 movestogo 40 movetime 60"]], ["uci-clock-mode", ["go movetime 60 wtime 1500 btime 1500"]], ["uci-clock-mode", ["go depth 5"]], ["uci-clock-mode", ["go nodes 30000"]], ["uci-clock-mode", ["go mate 2"]],
  ];
  for (const { name, fen } of K25) {
    for (const [m, l] of rows) out({ name, m, l, lines: session(m, l, fen) });
    const white = fen.split(" ")[1] === "w";
    const other = white ? "go btime 8000 movestogo 40 depth 5" : "go wtime 8000 movestogo 40 depth 5";
    out({ name, m: "uci-clock-mode", l: [other], lines: session("uci-clock-mode", [other], fen) });
    for (const h of BUDGETS) out({ name, h, choice: read(E.chooseMove(parseFen(fen), { budgetMs: h, now: virtualClock(1) })) });
  }
}
if (part === "a1c") {
  // A1 (c), plus A1 (a)/(b) and A3 (a) as properties over the 125 rows. N(d): frozen clock at maxDepth d. T(d): the boundary reading.
  for (const { name, fen } of K25) {
    const N = new Map<number, number>(), T = new Map<number, number>();
    const Nd = (d: number) => { if (!N.has(d)) N.set(d, E.chooseMove(parseFen(fen), { budgetMs: 60000, now: () => 0, maxDepth: d }).nodes); return N.get(d) as number; };
    const Td = (d: number) => { if (!T.has(d)) T.set(d, E.chooseMove(parseFen(fen), { budgetMs: 1e7, now: virtualClock(1), maxDepth: d }).elapsedMs - 1); return T.get(d) as number; };
    for (const h of BUDGETS) {
      const base = read(E.chooseMove(parseFen(fen), { budgetMs: h, now: virtualClock(1) }));
      const head = read(E.chooseMove(parseFen(fen), { budgetMs: h, now: virtualClock(1), softMs: h / B }));
      out({ name, h, base, head, nBase: Nd(base.depth), nHead: Nd(head.depth), tHead: Td(head.depth), soft: h / B });
    }
  }
}
if (part === "b") {
  for (const { name, fen } of K25) { const n: Record<number, number> = {}; for (let d = 3; d <= 10; d++) n[d] = E.chooseMove(parseFen(fen), { budgetMs: 60000, now: () => 0, maxDepth: d }).nodes; out({ name, n }); }
}
if (part === "sweep") {
  // Arm I only: what the session hands the engine, against QE's own D2/D3 oracle, with depth 1 so each row costs nothing.
  const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const black = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
  const ts = [0, 1, 2, 1000, 1099, 1100, 1101, 1102, 1105, 1200, 1999, 2000, 3000, 8000, 9000, 60000, 900000, 3600000, 2147483647];
  const ms = [undefined, 1, 2, 3, 40, 100];
  const is = [undefined, 0, 1, 100, 5000];
  let rows = 0, bad = 0, ceilingBad = 0, clockBad = 0, floorRows = 0;
  const g = globalThis as any;
  for (const [fen, side] of [[start, "w"], [black, "b"]] as const) for (const t of ts) for (const m of ms) for (const i of is) {
    const own = side === "w" ? "wtime" : "btime", oi = side === "w" ? "winc" : "binc";
    const line = `go ${own} ${t}${i === undefined ? "" : ` ${oi} ${i}`}${m === undefined ? "" : ` movestogo ${m}`} depth 1`;
    g.__opt = []; session("uci-clock-mode", [line], fen);
    const got = g.__opt[0]; rows++;
    const mm = m ?? 20, ii = i ?? 0;
    const C = Math.max(1, Math.min((t - 1000 - 100 * mm) / mm + ii, t - 1100));
    const hard = Math.min(59500, C), soft = hard / B;
    const ok = got !== undefined && got.budgetMs === hard && got.softMs === soft;
    if (!ok) { bad++; out({ bad: line, got, hard, soft }); }
    if (got && got.budgetMs > 60000) ceilingBad++;
    if (got && got.budgetMs > t - 1100) { if (got.budgetMs === 1) floorRows++; else clockBad++; }
  }
  out({ sweep: rows, bad, ceilingBad, clockBad, floorRows });
}
if (part === "r12" || part === "r12x") {
  // Arm I only. D12 item 2's oracle, from the ADR's words, over the root events; then readings 1 and 2 counted.
  const g = globalThis as any;
  const budgets = part === "r12" ? BUDGETS : [4, 5, 6, 7, 8, 9, ...Array.from({ length: 40 }, (_, i) => 10 * (i + 1))];
  const tally = { rows: 0, aborted: 0, kept: 0, oracleBad: 0, r1Any: 0, r1Above: 0, r1Differs: 0, r2: 0, keptFromFailHigh: 0, keptAcrossPass: 0, abortedInAspiration: 0, multiPassAborted: 0 };
  for (const { name, fen } of [...K25, { name: "D12-window", fen: "8/8/1R6/8/k7/8/8/K7 w - - 2 2" }, { name: "D12-failhigh", fen: "6R1/2Rb1k1p/1pN1p3/1PbN4/8/8/P1P2rPP/6K1 b - - 3 40" }, { name: "D12-faillow", fen: "rnbq1k1r/pp1Pbppp/2p5/1B6/8/8/PPP1NnPP/RNBQK2R b KQ - 2 8" }]) for (const h of budgets) {
    g.__w1 = []; g.__opt = [];
    const c = E.chooseMove(parseFen(fen), { budgetMs: h, now: virtualClock(1), softMs: h });
    tally.rows++;
    const ev: any[] = g.__w1;
    const ab = ev.findIndex((e) => e.t === "abort");
    if (ab < 0) { if (c.partial) { tally.oracleBad++; out({ bad: "partial without abort", name, h }); } continue; }
    tally.aborted++;
    const it = ev[ab].it;
    const head = ev.filter((e) => e.t === "iter" && e.it === it)[0];
    const inc = sq(head.f, head.to, head.pr);
    // The oracle: per pass, running lower edge; I exact when strictly inside; M beats when strictly above the running best after I exact.
    const passes: any[] = []; let cur: any = null;
    for (const e of ev.slice(ev.indexOf(head) + 1, ab)) {
      if (e.t === "pass") { cur = { aIn: e.aIn, b: e.b, rets: [] }; passes.push(cur); }
      else if (e.t === "ret") cur.rets.push({ m: sq(e.f, e.to, e.pr), s: e.s });
    }
    if (passes.length > 1) tally.multiPassAborted++;
    if (Number.isFinite(passes[0]?.aIn) || Number.isFinite(passes[0]?.b)) tally.abortedInAspiration++;
    let kept: any = null, keptPass = -1;
    const iExactIn: { pass: number; s: number }[] = [];
    passes.forEach((p, pi) => {
      let run = p.aIn, bestS = -Infinity, iOk = false;
      for (const r of p.rets) {
        if (r.m === inc) { iOk = r.s > run && r.s < p.b; if (iOk) iExactIn.push({ pass: pi, s: r.s }); }
        else if (iOk && r.s > bestS) { kept = { m: r.m, s: r.s, failHigh: r.s >= p.b }; keptPass = pi; }
        if (r.s > bestS) bestS = r.s;
        if (bestS > run) run = bestS;
        if (bestS >= p.b) break;
      }
    });
    const expMove = kept ? kept.m : inc, expPartial = kept !== null;
    if (mv(c.move) !== expMove || (c.partial === true) !== expPartial || (kept && c.score !== kept.s) || (!kept && c.score !== head.sc)) { tally.oracleBad++; out({ bad: "oracle", name, h, played: mv(c.move), score: c.score, partial: c.partial, kept, inc, passes }); }
    if (!kept) continue;
    tally.kept++;
    if (keptPass < passes.length - 1) tally.keptAcrossPass++;
    if (kept.failHigh) tally.keptFromFailHigh++;
    const later = iExactIn.filter((x) => x.pass > keptPass);
    if (later.length > 0) { tally.r1Any++; if (later.some((x) => x.s > kept.s)) tally.r1Above++; if (mv(c.move) !== inc) tally.r1Differs++; out({ r1: true, name, h, kept, inc, later, passes: passes.length }); }
    const again = passes.slice(keptPass + 1).flatMap((p) => { let run = p.aIn; const hit: number[] = []; for (const r of p.rets) { if (r.m === kept.m && r.s > run && r.s < p.b) hit.push(r.s); if (r.s > run) run = r.s; } return hit; });
    if (kept.failHigh && again.some((s) => s !== kept.s)) { tally.r2++; out({ r2: true, name, h, kept, again }); }
  }
  out({ tally: part, ...tally });
}
