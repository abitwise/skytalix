---
id: 20261010T133349Z-qe-e2e-decision-abc104-verdict-pass-with-gaps-1ad3f484
kind: decision
by: qe-e2e
at: 2026-10-10T13:33:49Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ABC-031
  - ADR-0004
  - EPIC-003
  - N8-LANE
  - src/coordinate-move.ts
  - 20261010T133349Z-qe-e2e-observation-abc104-readings-probe-diff-gates-f3d29d14
  - 20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19
  - 20261010T132825Z-software-engineer-decision-abc104-totality-scoped-to-text-30823a98
  - 20261010T132825Z-software-engineer-observation-abc104-gates-and-throws-a2addac5
supersedes:
---

# `ABC-104` QE verdict: **PASS_WITH_GAPS** at `76237852`. `A1`–`A3` MET; three LOW prose gaps, three INFO; none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`, because no `§14-gate`
verdict exists on this install (`AGENTS.md`).
- Under review: `b7cffc52..76237852` on `grugops/ABC-104-coordinate-move-docblock`. The code commit is
  `7707f61f`.
- QE worked in its own worktree. It wrote its own probe, and it checked the comment-only claim by three
  independent methods. The Engineer's readings were used as pointers only. The readings are in
  `…f3d29d14`.

| | QE's reading | result |
|---|---|---|
| `A1` | `:30` reads "TOTAL OVER `text`", and `:32` reads "Totality is over `text` ONLY". `grep "TOTAL function"` finds 0 hits, and no unqualified totality claim remains in the header. `:33` says "`position` and `legal` are a caller obligation" | **MET** (gaps QE-104-a/b are about how that obligation sits beside `:25` and against the ADR) |
| `A2` | QE's own probe. `(null,"e2e4")` throws `TypeError` (reading `'blackToMove'`). `(startpos,"e2e4",42)` throws `TypeError` (`.filter is not a function`). The control `(startpos,"e2e4")` returns `move`. The docblock names both calls as throwing, which is consistent | **MET** (gap QE-104-c covers the general sentence before the colon) |
| `A3` | One file, `src/coordinate-move.ts`. One hunk, `@@ -30,3 +30,8 @@`, inside the 1–33 header, whose base equals `f76e041`. Every changed line is a ` *` line. The comment-stripped `transpileModule` emit is **byte-identical** between base and tip (1291 B, sha256 `f59e2c32…`). The suite is green (51 files / 1583), and the measured skip count is 0 | **MET** |

**Gate at `76237852`.**
- lint, typecheck and build: exit 0.
- `npm test`: exit 0, 51 files / 1583 passed.
- Skip count: 0.
- `test-skip-integrity`: `No findings.`

**Why PASS_WITH_GAPS and not PASS.** Every criterion is met as written. The repaired paragraph still
carries three small width defects of the kind this ticket repairs:
- **QE-104-a.** The `:25` heading "ONE CALLER OBLIGATION" now disagrees with the count. The Engineer's
  "validated vs not" defence fails, because `:25` is itself "not validated here".
- **QE-104-b.** "In the same terms `ADR-0004` clause 2 states … a real `Position`": clause 2 has no
  such term.
- **QE-104-c.** "A wrong type throws" is unconditional, but 6 measured wrong-type calls return without
  throwing.

All three are LOW. They are comment-only, and the two quoted throws are exact. **QE's recommendation:**
one SE fix-forward on this branch before `In UAT`, because the owner signs this exact paragraph. That
fix should touch about three docblock lines and no executable line.

**Why not FAIL.** No criterion fails. The code did not change (emit identical). Every throw the docblock
names reproduces, and no reading depends on the Engineer's numbers.

**Next.** The board move out of `In Review` belongs to the Orchestrator, because the board is fenced from
this hop.
- Security is not triggered (a comment). QE measured nothing that contradicts that.
- `N8-LANE`: 0 test files and 0 executable lines, so no measurement is owed.
- **UAT is NOT waived (measured).** The owner's word is needed at `In UAT`.
- Not merged, not pushed. The gaps are routed in `…df369a19`.
