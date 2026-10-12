import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
const { main } = await import(process.argv[2]);
const good = "---\nkind: decision\nby: qe-e2e\nrefs:\n  - ABC-200\n---\n";
function tree() {
  const r = mkdtempSync(join(tmpdir(), "qeprobe-"));
  mkdirSync(join(r, "plans")); writeFileSync(join(r, "plans/board.md"), "## Done\n- [ABC-200] x\n");
  writeFileSync(join(r, ".grugops-snap"), ""); mkdirSync(join(r, ".grugops/context"), { recursive: true });
  writeFileSync(join(r, ".grugops/qe-cutover-2026-08-17.txt"), "# h\nABC-001\n");
  return r;
}
const outside = mkdtempSync(join(tmpdir(), "qeprobe-out-")); mkdirSync(join(outside, "notes")); writeFileSync(join(outside, "notes/a.md"), good); writeFileSync(join(outside, "a.md"), good);
const cases = {
  "notes-dir symlink": (r) => { mkdirSync(join(r, ".grugops/context/qe-ABC-200")); symlinkSync(join(outside, "notes"), join(r, ".grugops/context/qe-ABC-200/notes")); },
  "note-file symlink": (r) => { mkdirSync(join(r, ".grugops/context/qe-ABC-200/notes"), { recursive: true }); symlinkSync(join(outside, "a.md"), join(r, ".grugops/context/qe-ABC-200/notes/a.md")); },
  "context-root symlink": (r) => { rmSync(join(r, ".grugops/context"), { recursive: true }); mkdirSync(join(outside, "ctx/qe-ABC-200/notes"), { recursive: true }); writeFileSync(join(outside, "ctx/qe-ABC-200/notes/a.md"), good); symlinkSync(join(outside, "ctx"), join(r, ".grugops/context")); },
};
for (const [name, plant] of Object.entries(cases)) for (const argv of [["--sweep"], ["--ticket", "ABC-200"]]) {
  const r = tree(); plant(r);
  let err = ""; const w = process.stderr.write.bind(process.stderr); const o = process.stdout.write.bind(process.stdout);
  process.stderr.write = (s) => { err += s; return true; }; process.stdout.write = () => true;
  const code = main(argv, { root: r });
  process.stderr.write = w; process.stdout.write = o;
  console.log(`${name}\t${argv.join(" ")}\texit ${code}\t${err.split("\n")[0]}`);
  rmSync(r, { recursive: true, force: true });
}
rmSync(outside, { recursive: true, force: true });
