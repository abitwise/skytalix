// se-ABC-248 kill runner. Usage: node mut.mjs <tree> <label> <frozen.json> <testFile> [id ...|all]
// Copies <tree> (src, data, tools, configs; node_modules linked) to a work dir once, then for each mutant
// restores every production file from <tree>, applies the frozen edits, runs the ONE test file in the
// default lane (ENGINE_DEEP / SEARCH_DEEP unset, heap 400, one file, as AGENTS.md's single-file line),
// and appends {label,id,ran,failed[],suiteErrors} to kill-<label>.jsonl next to this script.
// CONTROL (no edit) runs first. Vitest is invoked as node_modules/.bin/vitest (never npx).
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [tree, label, listPath, testFile, ...want] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const work = join(process.env.SE248_SCRATCH, "mut", label);
const list = JSON.parse(readFileSync(listPath, "utf8")).mutants.filter((m) => m.applies);
const ids = want.length === 0 || want[0] === "all" ? list.map((m) => m.id) : want;
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
for (const p of ["src", "data", "tools", "vitest.config.ts", "package.json", "tsconfig.json"]) cpSync(join(tree, p), join(work, p), { recursive: true });
symlinkSync(process.env.SE248_NODE_MODULES, join(work, "node_modules"));
const out = join(here, `kill-${label}.jsonl`);
const touched = new Set(list.flatMap((m) => m.edits.map((e) => e.file)));
const restore = () => { for (const f of touched) writeFileSync(join(work, f), readFileSync(join(tree, f))); };
for (const id of ["CONTROL", ...ids]) {
  restore();
  if (id !== "CONTROL") {
    const m = list.find((x) => x.id === id);
    if (!m) throw new Error(`unknown or not applicable: ${id}`);
    for (const e of m.edits) {
      const path = join(work, e.file);
      const text = readFileSync(path, "utf8");
      const start = e.anchor ? text.indexOf(e.anchor) : 0;
      const i = text.indexOf(e.find, start);
      if (start < 0 || i < 0) throw new Error(`${id}: edit not found in ${e.file}`);
      writeFileSync(path, text.slice(0, i) + e.repl + text.slice(i + e.find.length));
    }
  }
  const json = join(work, "r.json");
  rmSync(json, { force: true });
  const env = { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" };
  delete env.ENGINE_DEEP;
  delete env.SEARCH_DEEP;
  const r = spawnSync("node_modules/.bin/vitest", ["run", testFile, "--reporter=json", `--outputFile=${json}`], {
    cwd: work, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env, timeout: 600_000,
  });
  let line;
  if (!existsSync(json)) line = { label, id, ran: 0, failed: ["<no report>"], suiteErrors: 1, rc: r.status };
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
        if (a.status !== "passed") failed.push([...a.ancestorTitles, a.title].join(" > "));
      }
    }
    if (suiteErrors > 0) failed.push("<suite error>");
    line = { label, id, ran, failed, suiteErrors, pending: rep.numPendingTests + rep.numTodoTests };
  }
  appendFileSync(out, `${JSON.stringify(line)}\n`);
  console.log(label, id, "ran", line.ran, "failed", line.failed.length, "suiteErrors", line.suiteErrors);
}
restore();
rmSync(work, { recursive: true, force: true });
