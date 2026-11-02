// arch-ABC-266-repropose grader, applies the sealed pre-registration. usage:
//   node analyse.mjs <ref.jsonl> <run.jsonl>...      (each run graded against its own T1; confirm runs likewise)
import { readFileSync } from "node:fs";
const [refF, ...runs] = process.argv.slice(2);
const rd = (f) => readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const REF = rd(refF); const refMove = new Map(REF.filter((o) => o.ev === "ref").map((o) => [o.pos, o.move]));
const refPhase = REF.find((o) => o.ev === "phase");
const ELIGIBLE = new Set(["T12S", "T12D", "T12P", "T12SD", "T12SDP", "T4SD", "T4", "T4SDP"]);
const out = { ref: { n: refMove.size, depthMedian: med(REF.filter((o) => o.ev === "ref").map((o) => o.depth)), depths: REF.filter((o) => o.ev === "ref").map((o) => o.depth).join(" "), foreignCores: +refPhase.foreignCores.toFixed(3), tctl: refPhase.tctl }, runs: {} };
for (const f of runs) {
  const L = rd(f); const start = L.find((o) => o.ev === "start");
  const gos = L.filter((o) => o.ev === "go"); const blocks = L.filter((o) => o.ev === "block"); const phase = L.find((o) => o.ev === "phase");
  const mt = gos[0].movetime; const passes = Math.max(...gos.map((o) => o.pass)) + 1;
  const cells = [...new Set(gos.map((o) => o.cell))];
  const R = { file: f.split("/").pop(), movetime: mt, passes, affinity: start.affinity, cells: {} };
  const nodesT1 = med(gos.filter((o) => o.cell === "T1").map((o) => o.nodes));
  for (const c of cells) {
    const g = gos.filter((o) => o.cell === c);
    const Q = [...refMove.keys()].reduce((s, p) => { const gp = g.filter((o) => o.pos === p); return s + gp.filter((o) => o.move === refMove.get(p)).length / gp.length; }, 0);
    const perPos = [...refMove.keys()].map((p) => med(g.filter((o) => o.pos === p).map((o) => o.depth)));
    const cell = { n: g.length, D: med(g.map((o) => o.depth)), meanDepth: +(g.reduce((s, o) => s + o.depth, 0) / g.length).toFixed(3), Q: +Q.toFixed(3), perPosDepthMedian: perPos.join(" "), nodesMedian: med(g.map((o) => o.nodes)), wallMsMax: Math.max(...g.map((o) => o.wallMs)) };
    if (g[0].k > 1) {
      const k = g[0].k;
      cell.perWorkerRate = +((med(g.map((o) => o.nodes)) / k) / nodesT1).toFixed(3);
      cell.allSameDepth = g.filter((o) => o.depths.every((d) => d === o.depths[0])).length;
      cell.playedAboveW0 = g.filter((o) => o.depth > o.w0depth).length;
      cell.w0D = med(g.map((o) => o.w0depth));
      cell.w0Q = +[...refMove.keys()].reduce((s, p) => { const gp = g.filter((o) => o.pos === p); return s + gp.filter((o) => o.w0move === refMove.get(p)).length / gp.length; }, 0).toFixed(3);
    }
    R.cells[c] = cell;
  }
  // load (pre-registered): (a) foreign vitest/cutechess at any block; (b) run foreign cores > 0.8; (c) > 20 % of blocks > 0.8
  const a = blocks.some((o) => o.vitest > 0 || o.cutechess > 0); const b = phase.foreignCores > 0.8; const cN = blocks.filter((o) => o.foreignCores > 0.8).length;
  const loaded = a || b || cN > 0.2 * blocks.length;
  R.load = { vitestOrCutechess: a, foreignCores: +phase.foreignCores.toFixed(3), blocksOver08: `${cN}/${blocks.length}`, blockFcMax: +Math.max(...blocks.map((o) => o.foreignCores)).toFixed(3), hot: phase.hot, tctlEnd: phase.tctl, startTctl: start.tctl, startHot: start.hot3s, LOADED: loaded };
  // rule (100 ms only)
  if (mt === 100 && R.cells.T1) {
    const t1 = R.cells.T1; R.rule = {};
    for (const c of cells) {
      if (!ELIGIBLE.has(c)) continue;
      const x = R.cells[c]; const dD = x.D - t1.D; const dQ = +(x.Q - t1.Q).toFixed(3);
      const depthPass = x.D > t1.D && dQ > -2; const qualityPass = dQ >= 2;
      const pass = depthPass || qualityPass;
      R.rule[c] = { dD, dQ, depthPass, qualityPass, outcome: pass ? (loaded ? "PASS (SHARED)" : "PASS") : loaded ? "VOID-LOAD" : "MISS" };
    }
    if (R.cells.T1D) R.attribution = { T1D_minus_T1: { dD: R.cells.T1D.D - t1.D, dQ: +(R.cells.T1D.Q - t1.Q).toFixed(3) } };
  }
  out.runs[R.file] = R;
}
// selection across the 100 ms screening runs (not confirm runs): rank PASSes
const sel = [];
for (const R of Object.values(out.runs)) if (R.rule && !R.file.startsWith("confirm")) for (const [c, r] of Object.entries(R.rule)) if (r.depthPass || r.qualityPass) sel.push({ run: R.file, cell: c, ...r, k: R.cells[c] && Number(c.match(/\d+/)[0]), knobs: c.replace(/T\d+/, "").length });
sel.sort((x, y) => (y.depthPass - x.depthPass) || (y.dD - x.dD) || (y.dQ - x.dQ) || (x.k - y.k) || (x.knobs - y.knobs));
out.selection = sel;
console.log(JSON.stringify(out, null, 1));
