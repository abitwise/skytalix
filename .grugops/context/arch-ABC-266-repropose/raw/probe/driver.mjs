// arch-ABC-266-repropose probe driver, built on qe-ABC-266-d12 driver.mjs (same corpus, sample, pool, D5 order, D6 rule,
// host readings). usage:
//   node driver.mjs <tree> <out.jsonl> ref <budgetMs>                 T1 reference move per sample position
//   node driver.mjs <tree> <out.jsonl> run <set> <movetime> <passes>   set = p12 | p4 | smoke12 | smoke4 | cells:A,B,...
// Threads 1 = today's chooseMove on the main thread (D2). k >= 2 = ADR-0062 D3-D6 pool + the cell's candidate knobs.
import { Worker } from "node:worker_threads";
import { appendFileSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { loadavg } from "node:os";
import { join } from "node:path";
const [tree, out, mode, a1, a2, a3] = process.argv.slice(2);
const log = (o) => appendFileSync(out, `${JSON.stringify({ t: new Date().toISOString(), ...o })}\n`);
const tt = await import(`${tree}/src/transposition.ts`);
const fenM = await import(`${tree}/src/fen.ts`);
const eng = await import(`${tree}/src/engine.ts`);
const legal = await import(`${tree}/src/legal.ts`);
const apply = await import(`${tree}/src/apply.ts`);
const ge = await import(`${tree}/src/gameend.ts`);
const busyJiffies = () => { const f = readFileSync("/proc/stat", "utf8").split("\n")[0].trim().split(/\s+/).slice(1).map(Number); return f[0] + f[1] + f[2] + f[5] + f[6] + f[7]; };
const ownCpuS = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1e6; };
const pids = (args) => { try { return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").filter(Boolean).map(Number); } catch { return []; } };
const commOf = (pid) => { try { return readFileSync(`/proc/${pid}/comm`, "utf8").trim(); } catch { return ""; } };
const foreign = () => ({ vitest: pids(["-f", "[/]vitest"]).filter((p) => /^(node|vitest)/.test(commOf(p))).length, cutechess: pids(["-x", "cutechess-cli"]).length });
const tctl = () => { for (const h of readdirSync("/sys/class/hwmon")) { const p = join("/sys/class/hwmon", h); try { if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000; } catch {} } return NaN; };
const procSnap = () => { const m = new Map(); for (const d of readdirSync("/proc")) { if (!/^\d+$/.test(d)) continue; try { const s = readFileSync(`/proc/${d}/stat`, "utf8"); const rp = s.lastIndexOf(")"); const f = s.slice(rp + 2).split(" "); m.set(Number(d), { comm: s.slice(s.indexOf("(") + 1, rp), ticks: Number(f[11]) + Number(f[12]) }); } catch {} } return m; };
const hotProcs = (a, b, wallS, minPct) => { const o = []; for (const [pid, x] of b) { if (pid === process.pid || !a.has(pid)) continue; const pct = ((x.ticks - a.get(pid).ticks) / 100 / wallS) * 100; if (pct > minPct) o.push(`${x.comm}:${pid}:${Math.round(pct)}%`); } return o; };
const meter = () => { const j = busyJiffies(), c = ownCpuS(), w = Date.now(); return () => { const wall = (Date.now() - w) / 1000; return { wallS: wall, foreignCores: ((busyJiffies() - j) / 100 - (ownCpuS() - c)) / wall }; }; };
const affinity = () => { try { return readFileSync("/proc/self/status", "utf8").match(/Cpus_allowed_list:\s*(\S+)/)[1]; } catch { return "?"; } };
// corpus: ABC-078 A3 (276), sample i % 14 == 0 (20) — identical to qe-ABC-266-d12
const PERFT = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const ENDS = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const children = (f) => { const o = []; const p = fenM.parseFen(f); for (const m of legal.legalMoves(p)) { const u = apply.makeMove(p, m); if (ge.gameStatus(p).result === "in-progress") o.push(fenM.toFen(p)); apply.unmakeMove(p, m, u); } return o; };
const corpus = []; for (const f of [...PERFT, ...ENDS]) corpus.push(f, ...children(f));
const SAMPLE = corpus.filter((_, i) => i % 14 === 0);
const WARM = "rnbqkb1r/p2ppppp/1p3n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4";
if (corpus.length !== 276 || SAMPLE.length !== 20) throw new Error(`corpus ${corpus.length} sample ${SAMPLE.length}`);
const mvStr = (c) => `${c.move.from}-${c.move.to}-${c.move.promotion ?? ""}`;
const T0 = Date.now();
const pre = procSnap(); const pw = Date.now(); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
log({ ev: "start", mode, args: [a1, a2, a3], node: process.version, affinity: affinity(), load: loadavg(), tctl: tctl(), ...foreign(), hot3s: hotProcs(pre, procSnap(), (Date.now() - pw) / 1000, 20), fens: SAMPLE });
if (mode === "ref") {
  const budget = Number(a1); const ph = meter(); const ps = procSnap(); const pw2 = Date.now();
  for (let i = 0; i < SAMPLE.length; i++) {
    const f0 = foreign(); const m = meter();
    const c = eng.chooseMove(fenM.parseFen(SAMPLE[i]), { budgetMs: budget });
    const f1 = foreign();
    log({ ev: "ref", pos: i, budget, depth: c.depth, move: mvStr(c), score: c.score, nodes: c.nodes, ...m(), vitest: Math.max(f0.vitest, f1.vitest), cutechess: Math.max(f0.cutechess, f1.cutechess), tctl: tctl() });
  }
  log({ ev: "phase", movetime: budget, ...ph(), hot: hotProcs(ps, procSnap(), (Date.now() - pw2) / 1000, 20), tctl: tctl(), load: loadavg() });
  log({ ev: "done", totalS: (Date.now() - T0) / 1000, tctl: tctl(), ...foreign() });
  process.exit(0);
}
// cells: name -> { k, deeper, skip, perturb }
const CELLS = {
  T1: { k: 1 }, T1D: { k: 1, deeper: true },
  T12: { k: 12 }, T12S: { k: 12, skip: true }, T12D: { k: 12, deeper: true }, T12P: { k: 12, perturb: true },
  T12SD: { k: 12, skip: true, deeper: true }, T12SDP: { k: 12, skip: true, deeper: true, perturb: true },
  T4: { k: 4 }, T4SD: { k: 4, skip: true, deeper: true }, T4SDP: { k: 4, skip: true, deeper: true, perturb: true },
};
const SETS = { p12: ["T1", "T1D", "T12", "T12S", "T12D", "T12P", "T12SD", "T12SDP", "T4SD"], p4: ["T1", "T4", "T4SD", "T4SDP"] };
SETS.smoke12 = SETS.p12; SETS.smoke4 = SETS.p4;
const set = a1.startsWith("cells:") ? a1.slice(6).split(",") : SETS[a1];
if (!set || set.some((c) => !CELLS[c])) throw new Error(`bad set ${a1}`);
const SMOKE = a1.startsWith("smoke");
const movetime = Number(a2); const passes = Number(a3);
tt.clearTable();
const table = tt.tableBuffer();
const stopBuf = new SharedArrayBuffer(4); const stop = new Int32Array(stopBuf);
async function makePool(k) {
  const ws = []; const online = [];
  for (let i = 0; i < k; i++) {
    const w = new Worker(new URL("./worker.mjs", import.meta.url), { workerData: { tree, table, stop: stopBuf, index: i } });
    w.on("error", (e) => { log({ ev: "worker-error", k, i, e: String(e) }); process.exit(3); });
    online.push(new Promise((r) => w.once("message", r)));
    ws.push(w);
  }
  await Promise.all(online);
  return ws;
}
function poolGo(ws, fen, budget, cfg) {
  return new Promise((resolve) => {
    tt.clearTable(); Atomics.store(stop, 0, 0);
    const goAt = Date.now(); const res = []; let first = -1;
    const on = (m) => {
      if (first < 0) { first = m.index; Atomics.store(stop, 0, 1); }
      res.push(m);
      if (res.length === ws.length) {
        const wallMs = Date.now() - goAt;
        for (const w of ws) w.off("message", on);
        res.sort((a, b) => a.index - b.index);
        let best = res[0]; for (const r of res) if (r.depth > best.depth) best = r; // D6
        resolve({ depth: best.depth, by: best.index, move: best.move, score: best.score, nodes: res.reduce((s, r) => s + r.nodes, 0), w0depth: res[0].depth, w0move: res[0].move, depths: res.map((r) => r.depth), first, wallMs });
      }
    };
    for (const w of ws) w.on("message", on);
    for (const w of ws) w.postMessage({ fen, budget, goAt, cfg });
  });
}
function mainGo(fen, budget, cfg) {
  tt.scratchSetDeeper(!!cfg.deeper);
  const goAt = Date.now();
  const c = eng.chooseMove(fenM.parseFen(fen), { budgetMs: budget });
  tt.scratchSetDeeper(false);
  return { depth: c.depth, by: "main", move: mvStr(c), score: c.score, nodes: c.nodes, wallMs: Date.now() - goAt };
}
const ks = [...new Set(set.map((c) => CELLS[c].k).filter((k) => k > 1))];
const pools = {}; for (const k of ks) pools[k] = await makePool(k);
log({ ev: "pools-online", ks, ms: Date.now() - T0 });
const go = (cell, fen, budget) => { const c = CELLS[cell]; return c.k === 1 ? Promise.resolve(mainGo(fen, budget, c)) : poolGo(pools[c.k], fen, budget, c); };
for (const cell of set) log({ ev: "warmup", cell, ...(await go(cell, WARM, 300)) });
const list = SMOKE ? [WARM] : SAMPLE;
const phase = meter(); const ps = procSnap(); const pw2 = Date.now();
for (let p = 0; p < passes; p++) for (let i = 0; i < list.length; i++) {
  const f0 = foreign(); const blk = meter();
  for (let j = 0; j < set.length; j++) {
    const cell = set[(i + p + j) % set.length];
    const m = meter();
    const r = await go(cell, list[i], movetime);
    log({ ev: "go", movetime, pass: p, pos: i, cell, k: CELLS[cell].k, ...r, ...m() });
  }
  const f1 = foreign();
  log({ ev: "block", movetime, pass: p, pos: i, ...blk(), vitest: Math.max(f0.vitest, f1.vitest), cutechess: Math.max(f0.cutechess, f1.cutechess), tctl: tctl(), load1: loadavg()[0] });
}
log({ ev: "phase", movetime, ...phase(), hot: hotProcs(ps, procSnap(), (Date.now() - pw2) / 1000, 20), tctl: tctl(), load: loadavg() });
for (const k of ks) for (const w of pools[k]) await w.terminate();
log({ ev: "done", totalS: (Date.now() - T0) / 1000, load: loadavg(), tctl: tctl(), ...foreign() });
