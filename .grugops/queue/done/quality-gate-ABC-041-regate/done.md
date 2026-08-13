---
task: quality-gate-ABC-041-regate
by: qe-e2e
at: 2026-08-13T23:10:00Z
state: complete
---

Work COMPLETE. This claim is finished, not stale — read it that way if the
`queue.stale_ttl_minutes` (30) window has passed.

**VERDICT: `BLOCKED_NEEDS_FIX` — on `A6`, not on `A4`.** The block I raised on `A4` is
**DISCHARGED on evidence**; a narrower one takes its place, and it is three lines of instrument.

**The four questions all answer yes, by rebuilt mutant.** Runs B and C reproduce digit for digit —
same `X2`, whole-frame equality removed in both, only the width source differing: panel-derived
**RED at `src/render-seam.test.ts:241`**, `frame[0]`-derived **GREEN**. `X1` and `X2` each red `A4`
**alone** with the whole-frame check removed, so nothing was softened to fit. `A11` is a **rename**
— all 12 body lines byte-identical, only the title moved — and `X3b` (a real second board
implementation, `tsc` 0) reds **`A11` and nothing else**, `A4` and `A8` green: the property survived
the move. The lane allotment did not move (`src/` 47 → 49: one module, one test file), `A10` holds,
and `src/render-seam.ts` is git blob `51e50a38…` at `ac17fe2`, `8dbe2b4`, `78a3db8` and at my tip —
untouched since the day it was written.

**The overlap is disposed of: I DELETED my own `A4 (width)` row.** `X2b` — padding applied only in
`black-bottom` — reds `A4` while that row stayed **GREEN**, so it was strictly weaker than the clause
it duplicated; dropping it loses no kill on `X2` / `X1` / `X2b`, and even under a regressed `A4`
width it only ever added a second red. Not softening: `A4` reds on `X2` by itself. The reason and the
mutant are recorded **in the file**, so one revert restores it with its evidence.
`src/render-seam.test.ts` **+10/−19**, **11 in the file, 827/827 on 29, skip 0**, no file added or
removed.

**Why the gate is still red.** `A6`'s wording was widened to four spellings (`process.`, the bare
word `process`, `globalThis`, `import.meta`) and **no instrument moved** — three of the four are
asserted nowhere in the suite, checked not assumed. Mutant `X8` reads `process.env` through
`globalThis["process"]` and ships **827/827, `tsc` 0, lint 0**, and it is not decorative: with the
variable set the seam silently overrides its bound glyph mode. Same defect as `A4`'s, in a different
criterion. **Homed to the Software Engineer**: three `expect(source).not.toContain(...)` lines in the
existing `A6 / A7` row, no new test, no new file, arming mutant spelled out in the notes. **Not homed
to BA/PM — the wording is right and must not be shrunk back to what the instrument happens to
assert.**

Gates at my own hand on the tip: lint **0** (51 files, the 2 pre-existing `biome.json` infos),
typecheck **0**, build **0**, `npm test` **827/827 on 29**, skip **0**, `test-integrity`
**`No findings.` exit 0**. `PERFT_DEEP` not run — the diff is one `*.test.ts` and one markdown file.

Five notes under `.grugops/context/quality-gate-ABC-041-regate/notes/`, committed on
`grugops/quality-gate-ABC-041-regate` @ `c3384ea`. **No `finding`, no invented `§14-gate` stamp.**
Mutation ran in an out-of-tree copy, so `src/render-seam.ts` was never opened for writing at all.
`node_modules` symlink removed from the worktree.

**The `pending -> done` queue move is OWED TO THE ORCHESTRATOR**, for the same reason the two hops
before recorded: `.grugops/queue/pending/quality-gate-ABC-041-regate.md` is committed on `main`,
which is ahead of this branch's base, and this hop commits only on its own branch. This `claim.md` /
`done.md` pair is written into the MAIN repo's working tree and left **untracked**.

**`ABC-041` was NOT moved on the board — it stays `In Review`.** The ticket page was not opened,
`src/render-seam.ts` was not touched, nothing was merged and nothing was deployed.
