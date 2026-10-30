// qe-ABC-220 QE rows (PREREG § 1). Plain node, never vitest, never the real clock.
// usage: node qrows.mjs <baseTree> <headTree>
// Instrument: a node:module resolve hook sends every import of <tree>/src/engine.ts (except the stub's own `?real`
// import) to a per-tree generated stub that re-exports the real engine and wraps chooseMove. The wrapper records
// { budgetMs, maxDepth, maxNodes, from } and answers the first legal move at once (stub mode) or calls the real
// chooseMove (real mode, virtual clock). Each row prints `<row> | <what> | PASS|FAIL`; exit code = FAIL count.
import { mkdirSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [baseTree, headTree] = process.argv.slice(2).map((p) => resolve(p));
const here = dirname(fileURLToPath(import.meta.url));
const stubDir = join(here, "..", "stubs");
mkdirSync(stubDir, { recursive: true });

const engineURLs = new Map(); // engine.ts URL -> stub URL
globalThis.__qe = { mode: "stub", handed: [] };
for (const [name, tree] of [["base", baseTree], ["head", headTree]]) {
  const engine = pathToFileURL(join(tree, "src/engine.ts")).href;
  const legal = pathToFileURL(join(tree, "src/legal.ts")).href;
  const stubPath = join(stubDir, `engine-${name}.mjs`);
  writeFileSync(
    stubPath,
    `export * from ${JSON.stringify(`${engine}?real`)};
import { chooseMove as realChoose } from ${JSON.stringify(`${engine}?real`)};
import { legalMoves } from ${JSON.stringify(legal)};
export function chooseMove(position, options) {
  const stack = new Error().stack ?? "";
  const from = /levels\\.ts/.test(stack) ? "levels.ts" : "uci-session.ts";
  globalThis.__qe.handed.push({ budgetMs: options.budgetMs, maxDepth: options.maxDepth, maxNodes: options.maxNodes, from });
  if (globalThis.__qe.mode === "real") return realChoose(position, options);
  const move = legalMoves(position)[0];
  return move === undefined ? null : { move, score: 0, depth: 1, nodes: 1, elapsedMs: 1 };
}
`,
  );
  engineURLs.set(engine, pathToFileURL(stubPath).href);
}
registerHooks({
  resolve(specifier, context, next) {
    const r = next(specifier, context);
    const stub = engineURLs.get(r.url);
    if (stub !== undefined && !(context.parentURL ?? "").startsWith(pathToFileURL(stubDir).href)) {
      return { ...r, url: stub, shortCircuit: true };
    }
    return r;
  },
});

const load = async (tree) => ({
  uci: await import(pathToFileURL(join(tree, "src/uci-session.ts")).href),
  book: await import(pathToFileURL(join(tree, "src/book.ts")).href),
  levels: await import(pathToFileURL(join(tree, "src/levels.ts")).href),
  clock: await import(pathToFileURL(join(tree, "src/virtual-clock.ts")).href),
  fen: await import(pathToFileURL(join(tree, "src/fen.ts")).href),
  cm: await import(pathToFileURL(join(tree, "src/coordinate-move.ts")).href),
});
const B = await load(baseTree);
const H = await load(headTree);

let fails = 0;
const row = (id, what, ok) => {
  if (!ok) fails++;
  console.log(`${id} | ${what} | ${ok ? "PASS" : "FAIL"}`);
};

/** One session on tree `M`. Returns send(line) -> lines written, plus counters. */
function session(M, { stepMs = 1_000, random = () => 0.5 } = {}) {
  const out = [];
  const draws = { count: 0 };
  const s = M.uci.createUciSession({
    write: (l) => out.push(l),
    now: M.clock.virtualClock(stepMs),
    random: () => {
      draws.count++;
      return random();
    },
    book: M.book.createBookProbe({
      read: () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} })),
      warn: () => {},
      random: M.levels.seededRandom(7),
    }),
  });
  const send = (line) => {
    const before = out.length;
    s.handleLine(line);
    return out.slice(before);
  };
  return { send, out, draws };
}
const handedSince = (n) => globalThis.__qe.handed.slice(n);
const mark = () => globalThis.__qe.handed.length;
const ST = "setoption name TimeMode value simple-tournament";
const T = 22_000;
const PRINTABLE = (l) => [...l].every((c) => c.codePointAt(0) >= 0x20 && c.codePointAt(0) !== 0x7f);

/** Budget of one go in tree M after setup lines. */
function budgetOf(M, setup, position, go) {
  globalThis.__qe.mode = "stub";
  const { send } = session(M);
  for (const l of setup) send(l);
  send(position);
  const m = mark();
  const lines = send(go);
  if (/\binfinite\b|\bponder\b/.test(go)) lines.push(...send("stop"));
  const h = handedSince(m);
  return { budget: h.length === 1 ? h[0].budgetMs : undefined, handed: h, lines };
}

// ---- oracle (D2/D3), QE's, from the ticket text ----
function oracle(tok, black) {
  const v = (k) => tok[k];
  if (v("movetime") !== undefined) return Math.min(v("movetime"), T);
  const t = v(black ? "btime" : "wtime");
  if (t === undefined) return T;
  const inc = v(black ? "binc" : "winc") ?? 0;
  const m = v("movestogo") ?? 20;
  const C = Math.max(1, Math.min((t - 1000 - m * 100) / m + inc, t - 1100));
  return Math.min(T, C);
}
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function genGo(r) {
  const tok = {};
  const parts = ["go"];
  const pick = (p) => r() < p;
  const clockVal = () => {
    const x = r();
    if (x < 0.08) return -Math.floor(r() * 5000);
    if (x < 0.15) return Number((r() * 100000).toFixed(2));
    return Math.floor(r() * 4_000_000);
  };
  for (const k of ["wtime", "btime"]) if (pick(0.8)) tok[k] = clockVal();
  for (const k of ["winc", "binc"]) if (pick(0.35)) tok[k] = Math.floor(r() * 30000);
  if (pick(0.5)) tok.movestogo = 1 + Math.floor(r() * 100);
  if (pick(0.3)) tok.movetime = Math.floor(r() * 60000);
  for (const [k, val] of Object.entries(tok)) parts.push(k, String(val));
  if (pick(0.1)) parts.push("depth", String(1 + Math.floor(r() * 6)));
  if (pick(0.05)) parts.push("nodes", String(1 + Math.floor(r() * 100000)));
  if (pick(0.05)) parts.push("infinite");
  return { tok, line: parts.join(" ") };
}
const WHITE = "position startpos";
const BLACK = "position startpos moves e2e4";

// ================= QE-A1 =================
{
  const b = session(B).send("uci");
  const h = session(H).send("uci");
  const at = h.indexOf("option name TimeMode type combo default level var level var simple-tournament");
  const without = h.filter((_, i) => i !== at);
  row("QE-A1a", `head uci = base uci + the TimeMode line right after Skill Level (head ${h.length} lines, base ${b.length})`, at > 0 && JSON.stringify(without) === JSON.stringify(b) && h[at - 1] === "option name Skill Level type spin default 5 min 1 max 7" && h[at + 1] === "uciok");
  const s = session(H);
  const first = s.send("uci");
  s.send(ST);
  const second = s.send("uci");
  row("QE-A1b", "after the setting a second uci writes the same reply (combo default stays level)", JSON.stringify(first) === JSON.stringify(second));
}

// ================= QE-A6 =================
{
  const r = mulberry(220);
  let bad = 0, over = 0, nT = 0, nC = 0, nMt = 0, firstBad = "";
  for (let i = 0; i < 3000; i++) {
    const { tok, line } = genGo(r);
    const black = i % 2 === 1;
    const { budget } = budgetOf(H, [ST], black ? BLACK : WHITE, line);
    const want = oracle(tok, black);
    if (!(budget === want || Math.abs(budget - want) < 1e-9)) {
      bad++;
      if (!firstBad) firstBad = `${black ? "B" : "W"} ${line}: got ${budget} want ${want}`;
    }
    if (budget > T) over++;
    if (tok.movetime !== undefined) {
      if (want === tok.movetime) nMt++;
      else nT++;
    } else if (want === T) nT++;
    else nC++;
  }
  row("QE-A6a", `3 000 random go lines in the setting: ${bad} oracle mismatches, ${over} budgets > 22 000; T bound ${nT}, C bound ${nC}, movetime bound ${nMt}${firstBad ? `; first: ${firstBad}` : ""}`, bad === 0 && over === 0 && nT >= 100 && nC >= 100 && nMt >= 100);

  const nines = "9".repeat(400);
  const b1 = budgetOf(H, [ST], WHITE, `go wtime ${nines} btime ${nines}`).budget;
  const b2 = budgetOf(H, [ST], WHITE, `go movetime ${nines}`).budget;
  const b3 = budgetOf(H, [ST], WHITE, `go wtime -${nines} winc ${nines}`).budget;
  globalThis.__qe.mode = "real";
  const rs = session(H, { stepMs: 50 });
  rs.send(ST);
  rs.send(WHITE);
  const lines3 = rs.send(`go wtime -${nines} winc ${nines}`);
  globalThis.__qe.mode = "stub";
  const depth3 = /^info depth (\d+) /.exec(lines3[0] ?? "")?.[1];
  row("QE-A6b", `400-digit clocks: wtime -> ${b1}, movetime -> ${b2}, wtime -inf winc +inf -> ${b3}; real engine on the NaN budget: depth ${depth3}, ${lines3.at(-1)}`, b1 === T && b2 === T && Number.isNaN(b3) && depth3 === "1" && /^bestmove [a-h][1-8][a-h][1-8]$/.test(lines3.at(-1) ?? ""));

  const out = [];
  for (const mt of [-5, 0]) {
    const hb = budgetOf(H, [ST], BLACK, `go movetime ${mt}`).budget;
    const bb = budgetOf(B, [], BLACK, `go movetime ${mt}`).budget;
    globalThis.__qe.mode = "real";
    const s = session(H, { stepMs: 50 });
    s.send(ST);
    s.send(BLACK);
    const l = s.send(`go movetime ${mt}`);
    globalThis.__qe.mode = "stub";
    out.push({ mt, hb, bb, last: l.at(-1), ok: hb === mt && bb === mt && /^bestmove [a-h][1-8][a-h][1-8]$/.test(l.at(-1) ?? "") });
  }
  row("QE-A6c", `movetime -5 / 0 in the setting: ${out.map((o) => `${o.mt} -> head ${o.hb} (base level 5 ${o.bb}), ${o.last}`).join("; ")}`, out.every((o) => o.ok));
}

// ================= QE-A3/A7 side to move =================
{
  const cases = [
    [BLACK, "go wtime 10000 btime 10000 winc 0 binc 2000 movestogo 10", 2800],
    [BLACK, "go wtime 10000 btime 10000 winc 2000 binc 0 movestogo 10", 800],
    [WHITE, "go wtime 10000 btime 10000 winc 2000 binc 0 movestogo 10", 2800],
    [WHITE, "go wtime 10000 btime 10000 winc 0 binc 2000 movestogo 10", 800],
    [WHITE, "go wtime 900000 btime 3000 movestogo 1", T],
    [BLACK, "go wtime 3000 btime 900000 movestogo 1", T],
    [WHITE, "go wtime 3000 btime 900000 movestogo 1", 1900],
  ];
  const got = cases.map(([p, g, want]) => ({ p: p === BLACK ? "B" : "W", g, want, b: budgetOf(H, [ST], p, g).budget }));
  row("QE-A3a", `side to move reads its own clock and increment: ${got.map((x) => `${x.p} ${x.g.slice(3)} -> ${x.b} (want ${x.want})`).join("; ")}`, got.every((x) => x.b === x.want));
  const only = budgetOf(H, [ST], WHITE, "go btime 5000").budget;
  const onlyBase = budgetOf(B, ["setoption name Skill Level value 7"], WHITE, "go btime 5000").budget;
  row("QE-A3b", `White to move with only btime 5000: budget ${only} (the no-time-token branch; base level 7 gives ${onlyBase}, its own no-clock budget)`, only === T);
}

// ================= QE-A8 identity on the real base code =================
{
  let diffs = 0, rows = 0, first = "";
  for (const setup of [[], ["setoption name TimeMode value level"]]) {
    for (let level = 1; level <= 7; level++) {
      const r = mulberry(1000 + level);
      const sb = session(B), sh = session(H);
      const pre = [...setup, `setoption name Skill Level value ${level}`];
      // base has no TimeMode: its own reply to the TimeMode setoption is compared too (ignored there, silent here).
      const ob = [], oh = [];
      for (const l of pre) {
        ob.push(...sb.send(l));
        oh.push(...sh.send(l));
      }
      for (let i = 0; i < 300; i++) {
        const { line } = genGo(r);
        const pos = i % 2 ? BLACK : WHITE;
        sb.send(pos);
        sh.send(pos);
        const m0 = mark();
        const lb = sb.send(line);
        if (/\binfinite\b/.test(line)) lb.push(...sb.send("stop"));
        const hb = handedSince(m0).map((x) => JSON.stringify([x.budgetMs, x.maxDepth, x.maxNodes]));
        const m1 = mark();
        const lh = sh.send(line);
        if (/\binfinite\b/.test(line)) lh.push(...sh.send("stop"));
        const hh = handedSince(m1).map((x) => JSON.stringify([x.budgetMs, x.maxDepth, x.maxNodes]));
        rows++;
        if (JSON.stringify(lb) !== JSON.stringify(lh) || JSON.stringify(hb) !== JSON.stringify(hh)) {
          diffs++;
          if (!first) first = `${setup.length ? "level" : "unset"} L${level} ${line}: base ${hb} ${JSON.stringify(lb)} head ${hh} ${JSON.stringify(lh)}`;
        }
      }
      if (JSON.stringify(ob) !== JSON.stringify(oh) || sb.draws.count !== sh.draws.count) {
        diffs++;
        if (!first) first = `${setup.length ? "level" : "unset"} L${level}: setup lines or draws differ (base ${sb.draws.count}, head ${sh.draws.count})`;
      }
    }
  }
  row("QE-A8", `base a649fbc4 vs head, TimeMode unset and level, Skill Level 1-7, 300 random go lines each: ${rows} rows, ${diffs} differences (handed budget/limits, lines, random draws)${first ? `; first: ${first}` : ""}`, diffs === 0 && rows === 4200);
}

// ================= QE-A9 =================
{
  const res = [];
  for (const level of [1, 2, 3, 4]) {
    globalThis.__qe.mode = "stub";
    const s = session(H, { random: () => 0.01 });
    s.send(ST);
    s.send(`setoption name Skill Level value ${level}`);
    const m = mark();
    let t = 900000;
    for (let i = 0; i < 10; i++) {
      s.send(BLACK);
      s.send("go");
    }
    for (let i = 0; i < 10; i++) {
      s.send(BLACK);
      s.send(`go wtime ${t} btime ${t} movestogo ${40 - i}`);
      t -= T + 31;
    }
    const h = handedSince(m);
    res.push({ level, draws: s.draws.count, n: h.length, fromLevels: h.filter((x) => x.from !== "uci-session.ts").length, allT: h.every((x) => x.budgetMs === T) });
  }
  const nv = session(H, { random: () => 0.01 });
  nv.send("setoption name TimeMode value level");
  nv.send("setoption name Skill Level value 1");
  nv.send(BLACK);
  const mnv = mark();
  nv.send("go");
  const nvFrom = handedSince(mnv).map((x) => x.from);
  row("QE-A9a", `Skill Level 1-4 in the setting, 20 go each: ${res.map((x) => `L${x.level} draws ${x.draws}, calls ${x.n}, via levels.ts ${x.fromLevels}, all T ${x.allT}`).join("; ")}; non-vacuity TimeMode level L1: draws ${nv.draws.count}, engine via ${nvFrom.join(",") || "none (blunder)"}`, res.every((x) => x.draws === 0 && x.n === 20 && x.fromLevels === 0 && x.allT) && nv.draws.count > 0);

  const lim = [];
  for (const [g, key, want] of [["go depth 3", "maxDepth", 3], ["go nodes 5000", "maxNodes", 5000], ["go mate 2", "maxDepth", 3]]) {
    const { handed, lines } = budgetOf(H, [ST, "setoption name Skill Level value 1"], BLACK, g);
    lim.push({ g, ok: handed.length === 1 && handed[0][key] === want && handed[0].budgetMs === T && !lines.some((l) => /ignores/.test(l)), got: handed[0] });
  }
  row("QE-A9b", `limits in the setting at Skill Level 1: ${lim.map((x) => `${x.g} -> ${JSON.stringify(x.got)}`).join("; ")}; no 'ignores' line`, lim.every((x) => x.ok));

  const s = session(H);
  const m = mark();
  for (const l of [ST, "setoption name Skill Level value 6", BLACK, "go", "setoption name TimeMode value level", "go", ST, "go", "setoption name TimeMode value level", "go"]) s.send(l);
  const seq = handedSince(m).map((x) => x.budgetMs);
  row("QE-A9c", `toggle setting/level at Skill Level 6, bare go budgets: ${seq.join(", ")}`, JSON.stringify(seq) === JSON.stringify([T, 5000, T, 5000]));
}

// ================= QE-A10 =================
{
  const refused = ["SIMPLE-TOURNAMENT", "simple-tournament extra", "simple_tournament", "__proto__", "constructor", "toString", "0", "Level"];
  let bad = [];
  for (const v of refused) {
    for (const from of ["level", "simple-tournament"]) {
      const s = session(H);
      if (from !== "level") s.send(ST);
      const lines = s.send(`setoption name TimeMode value ${v}`);
      s.send(BLACK);
      const m = mark();
      s.send("go");
      const b = handedSince(m)[0]?.budgetMs;
      const want = `info string TimeMode takes level or simple-tournament, got ${v}; kept ${from}`;
      if (!(lines.length === 1 && lines[0] === want && b === (from === "level" ? 4000 : T))) bad.push(`${v} from ${from}: ${JSON.stringify(lines)} budget ${b}`);
    }
  }
  row("QE-A10a", `${refused.length} refused values x 2 starting modes: ${bad.length} wrong${bad.length ? `: ${bad.join(" | ")}` : ""}`, bad.length === 0);

  const acc = [];
  for (const line of ["setoption name TIMEMODE value simple-tournament", "setoption   name   TimeMode   value   simple-tournament"]) {
    const s = session(H);
    const w = s.send(line);
    s.send(BLACK);
    const m = mark();
    s.send("go");
    acc.push({ line, w, b: handedSince(m)[0]?.budgetMs });
  }
  row("QE-A10b", `accepted silently: ${acc.map((x) => `'${x.line}' -> ${JSON.stringify(x.w)} budget ${x.b}`).join("; ")}`, acc.every((x) => x.w.length === 0 && x.b === T));

  const s = session(H);
  const w = s.send("setoption name Time Mode value simple-tournament");
  s.send(BLACK);
  const m = mark();
  s.send("go");
  const b = handedSince(m)[0]?.budgetMs;
  row("QE-A10c", `'setoption name Time Mode value simple-tournament' (unknown option): lines ${JSON.stringify(w)}, budget ${b} (level 5)`, w.length === 0 && b === 4000);

  const p = session(H);
  p.send(ST);
  p.send("ucinewgame");
  p.send("ucinewgame");
  p.send("uci");
  p.send(BLACK);
  const mp = mark();
  p.send("go");
  row("QE-A10d", `the setting survives ucinewgame x2 and a second uci: budget ${handedSince(mp)[0]?.budgetMs}`, handedSince(mp)[0]?.budgetMs === T);

  const e = session(H);
  const le = e.send("setoption name TimeMode value simple\u0007-tourn\u001bament");
  row("QE-A10e", `BEL and ESC in the value: ${JSON.stringify(le)} printable`, le.length === 1 && PRINTABLE(le[0]) && le[0] === "info string TimeMode takes level or simple-tournament, got simple-tournament; kept level");
}

// ================= QE-A13 (virtual clock, the real search) =================
function queued(script, inject, readingAt = 3, stepMs = 500) {
  globalThis.__qe.mode = "real";
  const queue = [...script];
  const clock = H.clock.virtualClock(stepMs);
  let searching = false, readings = 0, injected = false;
  const out = [];
  const s = H.uci.createUciSession({
    write: (l) => out.push(l),
    now: () => {
      if (searching && ++readings === readingAt && !injected) {
        queue.unshift(...inject);
        injected = true;
      }
      return clock();
    },
    random: H.levels.seededRandom(1),
    book: H.book.createBookProbe({ read: () => new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} })), warn: () => {}, random: H.levels.seededRandom(7) }),
  });
  while (queue.length > 0) {
    const line = queue.shift();
    searching = line.startsWith("go");
    readings = searching ? 0 : readings;
    s.handleLine(line);
    searching = false;
  }
  globalThis.__qe.mode = "stub";
  return { out, injected };
}
{
  const a = queued([ST, BLACK, "go"], ["isready", "isready"]);
  row("QE-A13a", `two isready queued during go: ${JSON.stringify(a.out.map((l) => l.split(" ").slice(0, 2).join(" ")))}`, a.injected && a.out.length === 4 && a.out[0].startsWith("info depth") && a.out[1].startsWith("bestmove") && a.out[2] === "readyok" && a.out[3] === "readyok");
  const b = queued([ST, BLACK, "go infinite"], ["stop", "isready"]);
  row("QE-A13b", `go infinite, stop then isready queued during the search: ${JSON.stringify(b.out.map((l) => l.split(" ").slice(0, 2).join(" ")))}`, b.injected && b.out.length === 3 && b.out[0].startsWith("info depth") && b.out[1].startsWith("bestmove") && b.out[2] === "readyok");
  const c = queued([ST, BLACK, "go movetime 2000"], ["isready"], 3, 100);
  row("QE-A13c", `go movetime 2000, isready queued: ${JSON.stringify(c.out.map((l) => l.split(" ").slice(0, 2).join(" ")))}`, c.injected && c.out.length === 3 && c.out[0].startsWith("info depth") && c.out[1].startsWith("bestmove") && c.out[2] === "readyok");
}

console.log(`FAIL ${fails}`);
process.exit(fails);
