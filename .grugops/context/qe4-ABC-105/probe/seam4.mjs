// QE4 in-memory seam probe: what options.notes does that the CLI cannot.
import { main } from "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/q4/cli/tools/grugops/qe-hop-integrity.js";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = mkdtempSync(join(tmpdir(), "qe4-seam-"));
mkdirSync(join(root, "plans")); writeFileSync(join(root, "plans/board.md"), "## Done\n- [ABC-200] x\n- [ABC-001] y\n");
mkdirSync(join(root, ".grugops"), { recursive: true }); writeFileSync(join(root, ".grugops/qe-cutover-2026-08-17.txt"), "# h\nABC-001\n");
// NOTE: no .grugops/context directory at all
const good = { path: ".grugops/context/qe-ABC-200/notes/a.md", folder: "qe-ABC-200", kind: "decision", by: "qe-e2e", refs: ["ABC-200"], malformed: null };
const badElsewhere = { path: ".grugops/context/other/notes/b.md", folder: "other", kind: "", by: "", refs: [], malformed: "no closing --- line" };
const cases = [
  ["--sweep, no context dir, nothing injected", ["--sweep"], { root }],
  ["--sweep, no context dir, notes: []", ["--sweep"], { root, notes: [] }],
  ["--ticket ABC-200, no context dir, notes: [good]", ["--ticket", "ABC-200"], { root, notes: [good] }],
  ["--ticket ABC-200, notes: [good, malformed in another folder]", ["--ticket", "ABC-200"], { root, notes: [good, badElsewhere] }],
  ["--ticket ABC-001 (pre-cutover), notes: []", ["--ticket", "ABC-001"], { root, notes: [] }],
];
for (const [label, argv, opt] of cases) {
  let out = "", err = "";
  const ow = process.stdout.write.bind(process.stdout), ew = process.stderr.write.bind(process.stderr);
  process.stdout.write = (s) => ((out += s), true); process.stderr.write = (s) => ((err += s), true);
  const code = main(argv, opt);
  process.stdout.write = ow; process.stderr.write = ew;
  console.log(`${label}: exit ${code}; stdout ${JSON.stringify(out.split("\n").filter((l) => /finding|UNKNOWN|covered|Malformed|out-of-scope/.test(l)).slice(0, 3))}; stderr ${JSON.stringify(err.split("\n")[0])}`);
}
rmSync(root, { recursive: true, force: true });
