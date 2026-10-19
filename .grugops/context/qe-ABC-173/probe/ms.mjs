// qe-ABC-173: the ABC-167 A5 "movetime 100" row's kill set at step 1 and at step 10, and M15 against ABC-170 A3 at step 5.
// Mutants M01-M11 are qe-ABC-167/probe/mutants.mjs's A5 entries verbatim; MT1-MT3 are the SE's three movetime wrong builds.
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
const WT = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-173";
const OUT = `${new URL(".", import.meta.url).pathname}ms-out.json`;
const LOG = `${new URL(".", import.meta.url).pathname}ms.log`;
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !(k === "NODE_OPTIONS" || k.endsWith("_DEEP") || k.startsWith("VITEST"))));
const muts = [
  ["M01","const DEFAULT_MOVES_TO_GO = 20;","const DEFAULT_MOVES_TO_GO = 19;"],
  ["M02","const MOVE_OVERHEAD_MS = 50;","const MOVE_OVERHEAD_MS = 0;"],
  ["M03","+ increment / 2;","+ 0 * increment;"],
  ["M04","+ increment / 2;","+ increment;"],
  ["M05","(clock.movestogo ?? DEFAULT_MOVES_TO_GO)","DEFAULT_MOVES_TO_GO"],
  ["M06",'clock[blackToMove ? "binc" : "winc"]','clock[blackToMove ? "winc" : "binc"]'],
  ["M07","budgetMs: Math.min(budget, LEVELS[DEFAULT_LEVEL].budgetMs),","budgetMs: budget,"],
  ["M08",'clock[blackToMove ? "btime" : "wtime"]','clock[blackToMove ? "wtime" : "btime"]'],
  ["M09","Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS))","Math.max(0, Math.min(share, time - MOVE_OVERHEAD_MS))"],
  ["M10","budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));","budget = Math.min(share, time - MOVE_OVERHEAD_MS);"],
  ["M11","if (clock.movetime !== undefined) {","if (clock.movetime !== undefined && time === undefined) {"],
  ["MT1","if (clock.movetime !== undefined) {","if (false) {"],
  ["MT2","    budget = clock.movetime;\n","    budget = clock.movetime - MOVE_OVERHEAD_MS;\n"],
  ["MT3","    budget = clock.movetime;\n","    budget = clock.movetime / 2;\n"],
];
const vit = (file, t) => {
  rmSync(OUT, { force: true });
  const r = spawnSync("npx", ["vitest", "run", file, "-t", t, "--testTimeout=120000", "--reporter=json", `--outputFile=${OUT}`], { cwd: WT, env: { ...env, NODE_OPTIONS: "--max-old-space-size=400" }, encoding: "utf8", maxBuffer: 1 << 28 });
  let j; try { j = JSON.parse(readFileSync(OUT, "utf8")); } catch { return { exit: r.status, err: (r.stderr || r.stdout).slice(0, 300) }; }
  const all = j.testResults.flatMap((f) => f.assertionResults);
  return { exit: r.status, ran: all.filter((a) => a.status !== "skipped" && a.status !== "pending").length, failed: all.filter((a) => a.status === "failed").map((a) => a.title) };
};
const mode = process.argv[2];
if (mode === "a5") {
  const TF = `${WT}/src/uci-session.test.ts`, PF = `${WT}/src/uci-session.ts`;
  const tOrig = readFileSync(TF, "utf8"), pOrig = readFileSync(PF, "utf8");
  const ROW10 = '["movetime 100", `position fen ${START_FEN}`, 100, 10], // step 10: ABC-173, owner 2026-10-19';
  if (tOrig.split(ROW10).length !== 2) throw new Error("row pattern");
  try {
    for (const step of [1, 10]) {
      writeFileSync(TF, step === 10 ? tOrig : tOrig.replace(ROW10, '["movetime 100", `position fen ${START_FEN}`, 100, 1],'));
      const control = vit("src/uci-session.test.ts", "movetime 100: go movetime 100");
      const line = { step, id: "CONTROL", ...control };
      console.log(JSON.stringify(line)); appendFileSync(LOG, JSON.stringify(line) + "\n");
      for (const [id, from, to] of muts) {
        if (pOrig.split(from).length !== 2) { console.log(id, "BAD"); continue; }
        writeFileSync(PF, pOrig.replace(from, to));
        const r = vit("src/uci-session.test.ts", "movetime 100: go movetime 100");
        writeFileSync(PF, pOrig);
        const l = { step, id, verdict: r.failed?.length ? "KILLED" : r.exit === 0 && r.ran === 1 ? "SURVIVED" : "OTHER", ...r };
        console.log(JSON.stringify(l)); appendFileSync(LOG, JSON.stringify(l) + "\n");
      }
    }
  } finally { writeFileSync(TF, tOrig); writeFileSync(PF, pOrig); }
}
if (mode === "m15") {
  const EF = `${WT}/src/engine.ts`; const eOrig = readFileSync(EF, "utf8");
  const TF = `${WT}/src/engine.test.ts`; const tOrig = readFileSync(TF, "utf8");
  const INIT_OLD = "    maxNodes: options.maxNodes ?? Number.POSITIVE_INFINITY,\n";
  const M15 = "    maxNodes: options.maxNodes ?? now() * 0 + Number.POSITIVE_INFINITY,\n";
  const M16 = "    maxNodes: (now(), options.maxNodes ?? Number.POSITIVE_INFINITY),\n";
  try {
    for (const step of [5, 1]) {
      writeFileSync(TF, step === 5 ? tOrig : tOrig.replaceAll("now: tickingClock(5)", "now: tickingClock(1)"));
      for (const [id, to] of [["CONTROL", INIT_OLD], ["M15", M15], ["M16", M16]]) {
        writeFileSync(EF, eOrig.replace(INIT_OLD, to));
        const r = vit("src/engine.test.ts", "ABC-170 A3");
        writeFileSync(EF, eOrig);
        const l = { step, id, ...r };
        console.log(JSON.stringify(l)); appendFileSync(LOG, JSON.stringify(l) + "\n");
      }
    }
  } finally { writeFileSync(EF, eOrig); writeFileSync(TF, tOrig); }
}
