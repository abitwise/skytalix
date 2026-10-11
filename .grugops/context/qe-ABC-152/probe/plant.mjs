// QE ABC-152 plant harness. Usage: node plant.mjs <specs.mjs> <pristine> <work> <outdir> [id-filter-regex]
// Each spec: { id, edits: [{ file, find, replace, count? }], tests: [paths], env?: {}, t?: "-t pattern", expect: "red"|"green", why }
// Applies the edits to <work> (each `find` must occur exactly `count ?? 1` times), runs
// `vitest run <tests> --reporter=json`, records the result, restores the files from <pristine>, and checks the
// work tree equals the pristine tree again (/usr/bin/diff -rq, excluding node_modules/.test-results/coverage).
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [specsPath, pristine, work, outdir, filter] = process.argv.slice(2);
const { default: specs } = await import(pathToFileURL(resolve(specsPath)).href);
mkdirSync(outdir, { recursive: true });
const tsv = join(outdir, "results.tsv");
if (!existsSync(tsv)) writeFileSync(tsv, "id\texpect\tgot\tok\texit\tfailed\tpassed\tfirst_red\n");
const re = filter ? new RegExp(filter) : null;

function clean() {
  const r = spawnSync("/usr/bin/diff", ["-rq", "-x", "node_modules", "-x", ".test-results", "-x", "coverage", pristine, work], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`work tree not clean:\n${r.stdout}${r.stderr}`);
}

for (const spec of specs) {
  if (re && !re.test(spec.id)) continue;
  clean();
  const touched = new Set();
  let diffs = "";
  try {
    for (const e of spec.edits ?? []) {
      const p = join(work, e.file);
      const src = readFileSync(p, "utf8");
      const n = src.split(e.find).length - 1;
      if (n !== (e.count ?? 1)) throw new Error(`${spec.id}: anchor in ${e.file} hit ${n} times, want ${e.count ?? 1}: ${JSON.stringify(e.find)}`);
      writeFileSync(p, src.split(e.find).join(e.replace));
      touched.add(e.file);
    }
    for (const f of touched) {
      const d = spawnSync("/usr/bin/diff", ["-u", join(pristine, f), join(work, f)], { encoding: "utf8" });
      diffs += d.stdout;
    }
    const json = join(outdir, `${spec.id}.json`);
    rmSync(json, { force: true });
    const args = ["run", ...spec.tests, "--reporter=json", `--outputFile=${json}`];
    if (spec.t) args.push("-t", spec.t);
    const run = spawnSync(join(work, "node_modules/.bin/vitest"), args, {
      cwd: work,
      env: { ...process.env, ...(spec.env ?? {}) },
      encoding: "utf8",
      timeout: spec.timeoutMs ?? 600000,
      maxBuffer: 1 << 28,
    });
    let failed = "?";
    let passed = "?";
    const reds = [];
    if (existsSync(json)) {
      const r = JSON.parse(readFileSync(json, "utf8"));
      failed = r.numFailedTests;
      passed = r.numPassedTests;
      for (const f of r.testResults) {
        const rel = f.name.replace(`${work}/`, "");
        if (f.status === "failed" && f.message) reds.push(`[suite ${rel}] ${f.message.split("\n")[0]}`);
        for (const a of f.assertionResults) {
          if (a.status === "failed") reds.push(`${(a.failureMessages[0] ?? "").split("\n")[0]} @ [${rel}] ${a.fullName}`);
        }
      }
    }
    const got = run.status === 0 && reds.length === 0 ? "green" : "red";
    const ok = got === spec.expect ? "OK" : "UNEXPECTED";
    const first = (reds[0] ?? (run.status !== 0 ? `exit ${run.status} signal ${run.signal} ${(run.stderr || "").split("\n").find((l) => /Error/.test(l)) ?? ""}` : "")).replace(/\t/g, " ").slice(0, 400);
    appendFileSync(tsv, `${spec.id}\t${spec.expect}\t${got}\t${ok}\t${run.status}\t${failed}\t${passed}\t${first}\n`);
    writeFileSync(
      join(outdir, `${spec.id}.log`),
      `# ${spec.id}\nwhy: ${spec.why ?? ""}\nexpect: ${spec.expect}\ngot: ${got} (${ok})\nexit: ${run.status} signal: ${run.signal}\nenv: ${JSON.stringify(spec.env ?? {})}\ncmd: vitest ${args.join(" ")}\nfailed: ${failed} passed: ${passed}\n\n## diff\n${diffs}\n## reds (${reds.length})\n${reds.join("\n")}\n\n## stderr tail\n${(run.stderr || "").split("\n").slice(-15).join("\n")}\n`,
    );
    console.log(`${spec.id}\t${spec.expect}\t${got}\t${ok}\t${first.slice(0, 160)}`);
  } finally {
    for (const f of touched) copyFileSync(join(pristine, f), join(work, f));
    clean();
  }
}
