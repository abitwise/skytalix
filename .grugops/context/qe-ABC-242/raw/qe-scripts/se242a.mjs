// qe-ABC-242 SE-242-a (time-boxed 15 min): QE-230's blunder-probe.mjs, UNCHANGED, run on `git archive` trees of each
// first-parent merge since ABC-230 that touched an engine-path file, to read where base's d8e8 moved (-1013 recorded
// at qe-ABC-230, -1020 read by the SE at 4387d4e8). Trees go under <scratch>/se242a/<sha>; node_modules symlinked.
// usage: node se242a.mjs <repo> <probe.mjs> <scratch> <sha,sha,...>
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
const [repo, probe, scratch, shas] = process.argv.slice(2);
for (const sha of shas.split(",")) {
  const dir = join(scratch, "se242a", sha);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const tar = execFileSync("git", ["-C", repo, "archive", sha, "src"], { maxBuffer: 256 * 1024 * 1024 });
  spawnSync("tar", ["-x", "-C", dir], { input: tar });
  symlinkSync(join(repo, "node_modules"), join(dir, "node_modules"));
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [probe, dir], { encoding: "utf8", timeout: 300_000 });
  const subject = execFileSync("git", ["-C", repo, "log", "-1", "--format=%s", sha], { encoding: "utf8" }).trim().slice(0, 60);
  console.log(`== ${sha} (${subject}) rc=${r.status} ${((Date.now() - t0) / 1000).toFixed(1)} s\n${r.stdout.trim()}${r.stderr ? `\n[stderr] ${r.stderr.trim().slice(0, 300)}` : ""}`);
}
