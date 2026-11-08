// qe-ABC-292-freeze: K1 (b)'s sets, by name and commit. ADR-0076 K1 (b): evaluateAtPhaseWithoutPieceTerms and
// evaluateWithoutTaper are Object.is-equal to the pre-ticket entries over the frozen corpora.
//  (1) names each committed set: where it lives, its length, the last commit on main that touched its file, and
//      the file's sha256 at main's tip;
//  (2) re-reads each committed pre-ticket table against main's own evaluate / evaluateWithoutTaper NOW, so the
//      entries are shown to be main's at this tip (a mismatch is reported, never fixed);
//  (3) reads main's evaluate and evaluateWithoutTaper on every position this freeze adds (K1 (a), K1 (c), K2)
//      and on each one's mirror: the pre-ticket entries for the new rows. A baseline read, not a hand value.
// usage (worktree root as cwd): node <this> <fixtures.json> <out.json>
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const SRC = `${resolve(process.cwd(), "src")}/`;
const { parseFen, toFen } = await import(`${SRC}fen.ts`);
const ev = await import(`${SRC}evaluate.ts`);
const { mirrorPosition, buildCorpus } = await import(`${SRC}evaluate.mirror-corpus.ts`);
const TC = await import(`${SRC}evaluate.taper-corpus.ts`);
const data = JSON.parse(readFileSync(process.argv[2], "utf8"));
const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
const main = git("rev-parse", "main");
const srcTree = git("rev-parse", "main:src");
const fileInfo = (path) => ({
  file: path,
  lastCommit: git("log", "-1", "--format=%H", "main", "--", path),
  sha256: createHash("sha256").update(execFileSync("git", ["show", `main:${path}`])).digest("hex"),
});
const constArray = (path, name) => {
  const text = execFileSync("git", ["show", `main:${path}`], { encoding: "utf8" });
  const m =
    text.match(new RegExp(`^const ${name}[^=\\n]*= \\[(.*)\\];$`, "m")) ?? // one line
    text.match(new RegExp(`^const ${name}[^=\\n]*= \\[\\n([\\s\\S]*?)\\n\\];`, "m")); // multi-line
  if (!m) throw new Error(`${name} not found in ${path}`);
  return JSON.parse(`[${m[1].replace(/,\s*$/, "")}]`);
};

const MIRROR = "src/evaluate.mirror-corpus.ts", TAPER = "src/evaluate.taper-corpus.ts", PASSER = "src/evaluate.passer.test.ts", QUEEN = "src/evaluate.queen-on.test.ts";
const g3 = buildCorpus();
const G3_PRE = constArray(PASSER, "G3_PRE"), DOOR_PRE = constArray(PASSER, "DOOR_PRE");
const QUEEN_PAIR_PRE = constArray(PASSER, "QUEEN_PAIR_PRE"), PASSER_PRE = constArray(PASSER, "PASSER_PRE");
const qG3 = constArray(QUEEN, "G3_PRE"), qDOOR = constArray(QUEEN, "DOOR_PRE"), qQP = constArray(QUEEN, "QUEEN_PAIR_PRE");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const checks = [];
const check = (set, fn, list) => {
  const bad = list.filter(([, got, want]) => !Object.is(got, want)).map(([n]) => n);
  checks.push({ set, fn, n: list.length, mismatches: bad.length, first: bad.slice(0, 3) });
};
const E = (p) => ev.evaluate(p), T = (p) => ev.evaluateWithoutTaper(p);
check("G3 (buildCorpus, 184) vs G3_CORPUS_MAIN_EVALUATE", "evaluateWithoutTaper", g3.map(({ name, position }, i) => [name, T(position), TC.G3_CORPUS_MAIN_EVALUATE[i]]));
check("TAPER_DOOR_CORPUS (176) .main", "evaluateWithoutTaper", TC.TAPER_DOOR_CORPUS.map(({ fen, main: m }) => [fen, T(parseFen(fen)), m]));
check("G3 (buildCorpus, 184) vs G3_PRE", "evaluate", g3.map(({ name, position }, i) => [name, E(position), G3_PRE[i]]));
check("TAPER_DOOR_CORPUS (176) vs DOOR_PRE", "evaluate", TC.TAPER_DOOR_CORPUS.map(({ fen }, i) => [fen, E(parseFen(fen)), DOOR_PRE[i]]));
check("QUEEN_PAIR_PRE (28)", "evaluate", QUEEN_PAIR_PRE.map(([fen, m]) => [fen, E(parseFen(fen)), m]));
check("PASSER_PRE (112)", "evaluate", PASSER_PRE.map(([fen, m]) => [fen, E(parseFen(fen)), m]));
check("TAPER_MIRROR_POSITIONS (30): each row in TAPER_DOOR_CORPUS", "membership", TC.TAPER_MIRROR_POSITIONS.map(({ id, fen }) => [id, TC.TAPER_DOOR_CORPUS.some((r) => r.fen === fen), true]));
checks.push({ set: `${QUEEN}'s G3_PRE / DOOR_PRE / QUEEN_PAIR_PRE equal ${PASSER}'s`, fn: "text", n: 3, mismatches: [same(qG3, G3_PRE), same(qDOOR, DOOR_PRE), same(qQP, QUEEN_PAIR_PRE)].filter((x) => !x).length });

const sets = [
  { name: "G3", what: "buildCorpus(): the six perft roots and every one-ply child, in buildCorpus order", count: g3.length, ...fileInfo(MIRROR) },
  { name: "TAPER_MIRROR_POSITIONS", what: "ABC-269 B1 (a)'s frozen mirror positions", count: TC.TAPER_MIRROR_POSITIONS.length, ...fileInfo(TAPER) },
  { name: "TAPER_DOOR_CORPUS", what: "ABC-269's door corpus with each row's pre-ABC-269 evaluate (= evaluateWithoutTaper)", count: TC.TAPER_DOOR_CORPUS.length, ...fileInfo(TAPER) },
  { name: "G3_CORPUS_MAIN_EVALUATE", what: "G3's pre-ABC-269 evaluate (= evaluateWithoutTaper), buildCorpus order", count: TC.G3_CORPUS_MAIN_EVALUATE.length, ...fileInfo(TAPER) },
  { name: "G3_PRE", what: "G3's evaluate, buildCorpus order (copy also in the queen-on file)", count: G3_PRE.length, ...fileInfo(PASSER) },
  { name: "DOOR_PRE", what: "TAPER_DOOR_CORPUS's evaluate, in its order", count: DOOR_PRE.length, ...fileInfo(PASSER) },
  { name: "QUEEN_PAIR_PRE", what: "ABC-270's queen pairs and mirrors with evaluate", count: QUEEN_PAIR_PRE.length, ...fileInfo(PASSER) },
  { name: "PASSER_PRE", what: "ABC-271's 12 + 44 positions and mirrors with evaluate", count: PASSER_PRE.length, ...fileInfo(PASSER) },
  { name: "queen-on copies", what: "G3_PRE / DOOR_PRE / QUEEN_PAIR_PRE as copied in the queen-on file", count: 3, ...fileInfo(QUEEN) },
];

const rows = [];
const add = (id, fen) => {
  const p = parseFen(fen), m = mirrorPosition(p);
  rows.push({ id, fen, evaluate: E(p), evaluateWithoutTaper: T(p) });
  rows.push({ id: `${id}~mirror`, fen: toFen(m), evaluate: E(m), evaluateWithoutTaper: T(m) });
};
for (const r of data.k1a) add(r.id, r.fen);
for (const r of data.k1c) add(r.id, r.fen);
const a4 = data.k2.find((k) => k.id === "K2-A4"), a3 = data.k2.find((k) => k.id === "K2-A3b");
add("K2-A4", a4.fen);
add("K2-A4-btm", a4.fen.replace(" w ", " b "));
add("K2-A3b-F5", a3.closedF5);
add("K2-A3b-E5", a3.halfOpenE5);
const mirrorBad = [];
for (let i = 0; i < rows.length; i += 2) if (!Object.is(rows[i].evaluate, rows[i + 1].evaluate) || !Object.is(rows[i].evaluateWithoutTaper, rows[i + 1].evaluateWithoutTaper)) mirrorBad.push(rows[i].id);

const out = {
  task: "qe-ABC-292-freeze",
  row: "ADR-0076 K1 (b): evaluateAtPhaseWithoutPieceTerms (at phaseOf) === pre-ticket evaluate; evaluateWithoutTaper === pre-ticket evaluateWithoutTaper; Object.is",
  main,
  srcTree,
  sets,
  checksOnMainNow: checks,
  newRows: { note: "main's readings at this tip on every position this freeze adds and its mirror; the pre-ticket entries for those rows", count: rows.length, mirrorMismatches: mirrorBad, rows },
};
writeFileSync(process.argv[3], `${JSON.stringify(out, null, 2)}\n`);
for (const s of sets) console.log(`set ${s.name} n=${s.count} ${s.file} last ${s.lastCommit.slice(0, 8)} sha256 ${s.sha256.slice(0, 12)}…`);
for (const c of checks) console.log(`check ${c.set} [${c.fn}] n=${c.n} mismatches=${c.mismatches}${c.first?.length ? ` ${JSON.stringify(c.first)}` : ""}`);
console.log(`new rows ${rows.length} (mirror-equal pairs: ${rows.length / 2 - mirrorBad.length}/${rows.length / 2})`);
process.exit(checks.some((c) => c.mismatches) || mirrorBad.length ? 1 : 0);
