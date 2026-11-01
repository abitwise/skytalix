// qe-ABC-248 kill runner (QE's own, written fresh; reads the SE's frozen format {file, anchor?, find, repl} and
// qe-ABC-244's {file, from, to}). usage: node mut.mjs <tree> <label> <list.json> <testFile|LANE> <outDir> [id ...|all]
// Work tree = `cp -al <tree>` (hard links). A file is only ever written after `rm`, so <tree>'s inodes are never
// written. For each id (CONTROL first) every touched production file is restored from <tree>, the edits are applied
// (each `find` must occur EXACTLY once after its anchor, else the runner throws), and:
//   testFile -> node_modules/.bin/vitest run <testFile> --reporter=json, heap 400, ENGINE_DEEP/SEARCH_DEEP unset;
//   LANE     -> `npm test` as spelled (heap 128, run-bounded 60 s), read from .test-results/last-run.json.
// One JSON line per id: {label,id,rc,ran,failed[],suiteErrors,pending}.
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, label, listPath, target, outDir, ...want] = process.argv.slice(2);
const work = join(outDir, `work-${label}`);
const raw = JSON.parse(readFileSync(listPath, "utf8")).mutants.filter((m) => m.applies !== false);
const list = raw.map((m) => ({
  id: m.id,
  edits: m.edits.map((e) => ({ file: e.file, anchor: e.anchor ?? "", find: e.find ?? e.from, repl: e.repl ?? e.to })),
}));
const ids = want.length === 0 || want[0] === "all" ? list.map((m) => m.id) : want;
rmSync(work, { recursive: true, force: true });
execFileSync("cp", ["-al", tree, work]);
const out = join(outDir, `kill-${label}.jsonl`);
rmSync(out, { force: true });
const touched = new Set(list.filter((m) => ids.includes(m.id)).flatMap((m) => m.edits.map((e) => e.file)));
const put = (f, text) => { rmSync(join(work, f), { force: true }); writeFileSync(join(work, f), text); };
const restore = () => { for (const f of touched) put(f, readFileSync(join(tree, f))); };
const count = (s, sub) => s.split(sub).length - 1;
for (const id of ["CONTROL", ...ids]) {
  restore();
  if (id !== "CONTROL") {
    const m = list.find((x) => x.id === id);
    if (!m) throw new Error(`unknown or not applicable: ${id}`);
    for (const e of m.edits) {
      const text = readFileSync(join(work, e.file), "utf8");
      const start = e.anchor ? text.indexOf(e.anchor) : 0;
      if (start < 0) throw new Error(`${id}: anchor not found in ${e.file}`);
      const rest = text.slice(start);
      if (count(rest, e.find) < 1) throw new Error(`${id}: edit not found in ${e.file}`);
      if (!e.anchor && count(text, e.find) !== 1) throw new Error(`${id}: ${count(text, e.find)} occurrences in ${e.file}`);
      const i = start + rest.indexOf(e.find);
      put(e.file, text.slice(0, i) + e.repl + text.slice(i + e.find.length));
    }
  }
  let r;
  let json;
  if (target === "LANE") {
    json = join(work, ".test-results/last-run.json");
    rmSync(json, { force: true });
    const env = { ...process.env };
    for (const k of ["ENGINE_DEEP", "SEARCH_DEEP", "NODE_OPTIONS", "VITEST_MAX_WORKERS"]) delete env[k];
    r = spawnSync("npm", ["test"], { cwd: work, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env, timeout: 300_000, killSignal: "SIGTERM" });
  } else {
    json = join(work, "qe-r.json");
    rmSync(json, { force: true });
    const env = { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" };
    for (const k of ["ENGINE_DEEP", "SEARCH_DEEP", "VITEST_MAX_WORKERS"]) delete env[k];
    r = spawnSync("node_modules/.bin/vitest", ["run", target, "--reporter=json", `--outputFile=${json}`], {
      cwd: work, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env, timeout: 600_000, killSignal: "SIGTERM",
    });
  }
  let line;
  if (!existsSync(json)) line = { label, id, rc: r.status, ran: 0, failed: ["<no report>"], suiteErrors: 1, pending: null };
  else {
    const rep = JSON.parse(readFileSync(json, "utf8"));
    const failed = [];
    let suiteErrors = 0;
    let ran = 0;
    for (const f of rep.testResults) {
      if (f.status === "failed" && f.assertionResults.every((a) => a.status !== "failed")) suiteErrors++;
      for (const a of f.assertionResults) {
        if (a.status === "skipped" || a.status === "pending" || a.status === "todo") continue;
        ran++;
        if (a.status !== "passed") failed.push(`${f.name.replace(`${work}/`, "")} :: ${[...a.ancestorTitles, a.title].join(" > ")}`);
      }
    }
    if (suiteErrors > 0) failed.push("<suite error>");
    line = { label, id, rc: r.status, ran, failed, suiteErrors, pending: (rep.numPendingTests ?? 0) + (rep.numTodoTests ?? 0) };
  }
  appendFileSync(out, `${JSON.stringify(line)}\n`);
  console.log(new Date().toISOString(), label, id, "rc", line.rc, "ran", line.ran, "failed", line.failed.length, "suiteErrors", line.suiteErrors);
}
restore();
rmSync(work, { recursive: true, force: true });
