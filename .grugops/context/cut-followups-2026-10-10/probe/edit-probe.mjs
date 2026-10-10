// BA/PM probe, cut-followups-2026-10-10. Run against a git-archive copy of 85d0139, never a worktree.
// `test` mode inserts the candidate assertion at FIXED lines of src/turn-loop.test.ts as of 85d0139.
// `mut` mode plants M9 by a unique anchor (same insertion as QE-051 mut.mjs M9). Never commit the result.
import { readFileSync, writeFileSync } from "node:fs";
const [file, mode] = process.argv.slice(2);
let s = readFileSync(file, "utf8").split("\n");
const A = '    expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0); // PROBE';
if (mode === "test") {
  // insert BEFORE 1-based lines 1946, 1975(after 1974), 1989 -- do highest first
  s.splice(1988, 0, A);   // before line 1989 (A5)
  s.splice(1974, 0, A);   // after line 1974 (A4)
  s.splice(1945, 0, A);   // before line 1946 (A3)
} else {
  const i = s.findIndex((l) => l === "        takeBack(history, outcome.plies);");
  if (i < 0 || s.filter((l) => l === "        takeBack(history, outcome.plies);").length !== 1) throw new Error("anchor");
  s.splice(i + 1, 0, "        keyHistory(history);");
}
writeFileSync(file, s.join("\n"));
