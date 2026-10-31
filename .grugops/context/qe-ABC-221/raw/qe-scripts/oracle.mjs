// qe-ABC-221 ORACLE (plain node, never vitest). Out-of-tree differential of what a `go` hands the engine, base vs head,
// plus an INDEPENDENT oracle for `uci-clock-mode` at head. It reads the REAL `src/uci-session.ts` and `src/levels.ts` of
// each tree through a counting shim (qe-ABC-242 shim.mjs pattern): `src/engine.ts` is renamed `engine-real.ts` and a shim
// `engine.ts` re-exports it, recording every `chooseMove` call's { budgetMs, maxDepth, maxNodes } and answering at once with
// the position's first legal move (so no search runs and the output is deterministic). `now` is a constant 0.
// usage: node oracle.mjs <B tree> <H tree> <scratch dir>
import { cpSync, existsSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [B, H, scratch] = process.argv.slice(2).map((p) => resolve(p));

function buildShim(tree, outDir) {
  rmSync(outDir, { recursive: true, force: true });
  cpSync(join(tree, "src"), join(outDir, "src"), { recursive: true });
  const src = join(outDir, "src");
  renameSync(join(src, "engine.ts"), join(src, "engine-real.ts"));
  if (existsSync(join(src, "engine.ts"))) throw new Error("shim: engine.ts still present");
  writeFileSync(
    join(src, "engine.ts"),
    [
      'export * from "./engine-real.ts";',
      'import { HARD_CEILING_MS } from "./engine-real.ts";',
      'import { legalMoves } from "./legal.ts";',
      "globalThis.__qeCalls ??= [];",
      "export function chooseMove(position, options) {",
      "  globalThis.__qeCalls.push({ budgetMs: options?.budgetMs, effective: Math.min(options?.budgetMs, HARD_CEILING_MS), maxDepth: options?.maxDepth ?? null, maxNodes: options?.maxNodes ?? null });",
      "  const move = legalMoves(position)[0];",
      "  return move === undefined ? null : { move, score: 0, depth: 1, nodes: 1, elapsedMs: 0 };",
      "}",
      "",
    ].join("\n"),
  );
  for (const f of ["levels.ts", "uci-session.ts"]) {
    if (!/from "\.\/engine\.ts"/.test(readFileSync(join(src, f), "utf8"))) throw new Error(`shim: ${f} import moved`);
  }
  return src;
}

const load = async (tree, tag) => {
  const src = buildShim(tree, join(scratch, `shim-${tag}`));
  const u = (f) => pathToFileURL(join(src, f)).href;
  const session = await import(u("uci-session.ts"));
  const book = await import(u("book.ts"));
  const levels = await import(u("levels.ts"));
  const engine = await import(u("engine.ts"));
  return { session, book, levels, engine, tag };
};

// ---- the go grid -------------------------------------------------------------------------------------------------
const BIG = "9".repeat(320); // > 308 integer digits: Number() is Infinity (SEC-220-b)
const goes = ["go", "go infinite", "go ponder", "go depth 3", "go nodes 1000", "go mate 2", "go depth 2 mate 3"];
for (const x of [0, 1, 5000, 21999, 22000, 22001, 30000, 31999, 32000, 32001, 45000, 59499, 59500, 59501, 60000, 90000, 3600000])
  goes.push(`go movetime ${x}`);
goes.push("go movetime -5", "go movetime 1.5", `go movetime ${BIG}`, `go movetime -${BIG}`, "go movetime abc", "go movetime");
const clocks = [800, 1000, 1100, 1101, 1500, 3000, 10000, 60000, 300000, 900000, 3600000];
const incs = ["", " winc 2000 binc 0", " winc 0 binc 2000", " winc 500 binc 500", " winc 30000 binc 30000"];
const mtgs = ["", " movestogo 1", " movestogo 10", " movestogo 40"];
for (const t of clocks) for (const i of incs) for (const m of mtgs) goes.push(`go wtime ${t} btime ${t}${i}${m}`);
// asymmetric clocks: the side to move's own clock and increment
for (const [w, b] of [[900000, 3000], [3000, 900000], [3600000, 800], [800, 3600000]])
  for (const i of incs) for (const m of mtgs) goes.push(`go wtime ${w} btime ${b}${i}${m}`);
// movetime with a clock (D3: an explicit move time wins over a clock), depth limits with a clock, malformed tokens
for (const x of [300, 5000, 45000, 90000]) {
  goes.push(`go wtime 900000 btime 900000 movestogo 40 movetime ${x}`, `go movetime ${x} wtime 1000 btime 1000`);
}
goes.push("go wtime 900000 btime 900000 depth 3", "go wtime 3600000 btime 3600000 movestogo 40 nodes 5000");
goes.push(`go wtime ${BIG} btime ${BIG}`, `go wtime -${BIG} btime -${BIG}`, `go wtime ${BIG} btime ${BIG} movestogo 40`);
goes.push("go wtime -5 btime -5", "go wtime 0 btime 0", "go wtime abc btime abc movestogo 40", "go wtime 900000 btime 900000 movestogo 0");
goes.push("go wtime 900000 btime 900000 movestogo", "go wtime btime 900000", "go searchmoves e2e4 movetime 5000", "go movestogo 40");

const MODES = [
  ["unset", []],
  ["level", ["setoption name TimeMode value level"]],
  ["simple-tournament", ["setoption name TimeMode value simple-tournament"]],
  ["uci-clock-mode", ["setoption name TimeMode value uci-clock-mode"]],
];
const POSITIONS = [["white", "position startpos"], ["black", "position startpos moves e2e4"]];

/** One session per (mode, skill, side); every go in the grid, in order. Returns per-go records. */
function drive(mod, modeLines, skill, posLine) {
  const out = [];
  let draws = 0;
  let r = mod.levels.seededRandom(1);
  const empty = new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} }));
  const s = mod.session.createUciSession({
    write: (l) => out.push(l),
    now: () => 0,
    random: () => {
      draws++;
      return r();
    },
    book: mod.book.createBookProbe({ read: () => empty, warn: () => {}, random: mod.levels.seededRandom(7) }),
  });
  const setup = ["setoption name OwnBook value false", `setoption name Skill Level value ${skill}`, ...modeLines];
  const setupOut = [];
  for (const l of setup) {
    const before = out.length;
    s.handleLine(l);
    setupOut.push(...out.slice(before));
  }
  const recs = [];
  for (const g of goes) {
    s.handleLine(posLine);
    globalThis.__qeCalls = [];
    const d0 = draws;
    const before = out.length;
    s.handleLine(g);
    s.handleLine("stop"); // releases a held answer (infinite/ponder); writes nothing otherwise
    recs.push({ go: g, calls: globalThis.__qeCalls, lines: out.slice(before), draws: draws - d0 });
  }
  return { setupOut, recs };
}

// ---- independent oracle for uci-clock-mode (ADR-0052 D2, D4), from the ticket's words, not from the code ---------
const CAP = 60_000 - 500, T = 22_000;
const C = (t, i, m) => Math.max(1, Math.min((t - 1000 - m * 100) / m + i, t - 1000 - 100));
const KW = new Set(["searchmoves", "ponder", "wtime", "btime", "winc", "binc", "movestogo", "depth", "nodes", "mate", "movetime", "infinite"]);
function oracleClockMode(go, black) {
  const tk = go.split(" ");
  const clock = {};
  for (let i = 1; i < tk.length; i++) {
    const k = tk[i];
    if (["movetime", "wtime", "btime", "winc", "binc"].includes(k)) {
      const v = tk[i + 1];
      if (v === undefined || KW.has(v)) continue;
      i++;
      if (/^-?\d+(\.\d+)?$/.test(v)) clock[k] = Number(v);
    } else if (k === "movestogo" || k === "depth" || k === "nodes" || k === "mate") {
      const v = tk[i + 1];
      if (v === undefined || KW.has(v)) continue;
      i++;
      if (k === "movestogo" && /^\d+$/.test(v) && Number(v) >= 1 && Number.isSafeInteger(Number(v))) clock.movestogo = Number(v);
    } else if (k === "searchmoves") {
      while (i + 1 < tk.length && !KW.has(tk[i + 1])) i++;
    }
  }
  const t = clock[black ? "btime" : "wtime"];
  if (clock.movetime !== undefined) return Math.min(clock.movetime, CAP);
  if (t !== undefined) return Math.min(CAP, C(t, clock[black ? "binc" : "winc"] ?? 0, clock.movestogo ?? 20));
  return T;
}

// ---- run ----------------------------------------------------------------------------------------------------------
const mb = await load(B, "B");
const mh = await load(H, "H");
const lines = [];
let checks = 0, fails = 0;
const check = (ok, what) => {
  checks++;
  if (!ok) {
    fails++;
    lines.push(`FAIL ${what}`);
  }
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
lines.push(`clamp B ${mb.engine.HARD_CEILING_MS}, H ${mh.engine.HARD_CEILING_MS}; ${goes.length} go lines x 7 skills x 2 sides per mode`);
const stats = { parityGo: 0, oracleGo: 0, clockModeMax: -Infinity, levelMaxHanded: -Infinity, stMaxHanded: -Infinity };
for (const [mode, modeLines] of MODES) {
  const perSkillH = [];
  for (const skill of [1, 2, 3, 4, 5, 6, 7]) {
    for (const [side, posLine] of POSITIONS) {
      const h = drive(mh, modeLines, skill, posLine);
      perSkillH.push({ skill, side, h });
      if (mode !== "uci-clock-mode") {
        // P1: base parity. Every go: the same chooseMove calls (budget, effective deadline budget, limits), the same
        // output lines and the same random draws. Setup output too. (The refusal text differs only for refused
        // TimeMode values, which this grid never sends in these modes.)
        const b = drive(mb, modeLines, skill, posLine);
        check(same(b.setupOut, h.setupOut), `P1 ${mode} L${skill} ${side} setup output ${JSON.stringify(b.setupOut)} vs ${JSON.stringify(h.setupOut)}`);
        for (let k = 0; k < goes.length; k++) {
          const rb = b.recs[k], rh = h.recs[k];
          // the handed budgets and limits; the effective (clamped) budget is compared separately below
          const strip = (c) => c.map(({ budgetMs, maxDepth, maxNodes }) => ({ budgetMs, maxDepth, maxNodes }));
          check(same(strip(rb.calls), strip(rh.calls)), `P1 ${mode} L${skill} ${side} '${goes[k]}' handed B ${JSON.stringify(strip(rb.calls))} H ${JSON.stringify(strip(rh.calls))}`);
          check(same(rb.calls.map((c) => c.effective), rh.calls.map((c) => c.effective)), `P1e ${mode} L${skill} ${side} '${goes[k]}' effective B ${JSON.stringify(rb.calls.map((c) => c.effective))} H ${JSON.stringify(rh.calls.map((c) => c.effective))}`);
          check(same(rb.lines, rh.lines), `P1o ${mode} L${skill} ${side} '${goes[k]}' lines B ${JSON.stringify(rb.lines)} H ${JSON.stringify(rh.lines)}`);
          check(rb.draws === rh.draws, `P1d ${mode} L${skill} ${side} '${goes[k]}' draws B ${rb.draws} H ${rh.draws}`);
          stats.parityGo++;
          for (const c of rh.calls) {
            if (Number.isFinite(c.budgetMs)) {
              if (mode === "simple-tournament") stats.stMaxHanded = Math.max(stats.stMaxHanded, c.budgetMs);
              else stats.levelMaxHanded = Math.max(stats.levelMaxHanded, c.budgetMs);
            }
          }
        }
      } else {
        // O1: head's uci-clock-mode against the independent oracle; one call per go, limits passed, no draw, and the
        // effective deadline budget <= 60 000 (and <= 59 500 whenever the handed budget is a number).
        check(same(h.setupOut, []), `O1 setup output not silent: ${JSON.stringify(h.setupOut)}`);
        for (const r of h.recs) {
          const want = oracleClockMode(r.go, side === "black");
          check(r.calls.length === 1, `O1 L${skill} ${side} '${r.go}' calls ${r.calls.length}`);
          const got = r.calls[0]?.budgetMs;
          check(Object.is(got, want), `O1 L${skill} ${side} '${r.go}' budget ${got} want ${want}`);
          check(r.calls[0]?.effective <= 60_000 && got <= CAP, `O1c L${skill} ${side} '${r.go}' effective ${r.calls[0]?.effective} handed ${got}`);
          check(r.draws === 0, `O1d L${skill} ${side} '${r.go}' draws ${r.draws}`);
          stats.oracleGo++;
          if (Number.isFinite(got)) stats.clockModeMax = Math.max(stats.clockModeMax, got);
        }
      }
    }
  }
  if (mode === "simple-tournament" || mode === "uci-clock-mode") {
    // S1: Skill Level is not read in a mode: every skill gives the same records, side by side.
    for (const side of ["white", "black"]) {
      const ref = perSkillH.find((x) => x.skill === 1 && x.side === side).h.recs;
      for (const { skill, h } of perSkillH.filter((x) => x.side === side)) check(same(ref, h.recs), `S1 ${mode} ${side} skill ${skill} differs from skill 1`);
    }
  }
}
// L1: every level budget sits under both clamps, so min(budget, 60 000) = min(budget, 32 000) = the budget.
for (const [L, { budgetMs }] of Object.entries(mh.levels.LEVELS)) check(Math.min(budgetMs, 60_000) === budgetMs && Math.min(budgetMs, 32_000) === budgetMs, `L1 level ${L} budget ${budgetMs}`);
check(same(Object.entries(mb.levels.LEVELS), Object.entries(mh.levels.LEVELS)), "L1 LEVELS B == H");
check(mb.levels.DEFAULT_LEVEL === mh.levels.DEFAULT_LEVEL, "L1 DEFAULT_LEVEL B == H");
lines.push(`go records compared base vs head (unset, level, simple-tournament): ${stats.parityGo}; uci-clock-mode go records vs oracle: ${stats.oracleGo}`);
lines.push(`largest finite budget handed at head: level/unset ${stats.levelMaxHanded}, simple-tournament ${stats.stMaxHanded}, uci-clock-mode ${stats.clockModeMax}`);
lines.push(`ORACLE ${checks} checks, ${fails} FAIL`);
console.log(lines.join("\n"));
