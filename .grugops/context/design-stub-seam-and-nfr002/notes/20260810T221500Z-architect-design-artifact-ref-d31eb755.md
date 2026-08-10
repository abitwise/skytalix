---
id: 20260810T221500Z-architect-design-artifact-ref-d31eb755
kind: artifact-ref
by: architect-design
at: 2026-08-10T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ADR-0009
  - NFR-002
  - NFR-008
  - memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# What this hop produced, what it refused to touch, and the gates it ran

## Written

| Artifact | What it holds |
|---|---|
| `memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md` | **AMENDED, not superseded.** New `## AMENDMENT 2026-08-11` section adding **clause 9** (9a–9f), with the seven measurements, four alternatives (E–H) and their rejections, the surfaced-and-declined clause-5 tension, a consequences addendum and a clause-9 rollback. **Clauses 1–8 unchanged — not one word edited.** Two lines added to `## Status` pointing at the amendment. Status stays `accepted`; **no target, no level, so no owner ratification owed.** |
| `plans/nfr-catalog.md` | **`NFR-002` only.** ONE table cell edited — `Applies to` — plus one dated `###` section appended, plus the file's `_Updated:` header line. **`ID` / `Category` / `Target` / `Verified by` verified BYTE-IDENTICAL cell by cell against `HEAD`**, and `NFR-001` / `NFR-003`–`NFR-008` byte-identical. **The `< 16 ms` target does not move and no bar is created, moved or loosened.** |
| `plans/traceability.md` | **ONE row edited in place (`ADR-0009`), FOUR cells appended to** — `NFRs`, `Code (PR/files)`, `Tests`, `Status` — plus the file's `_Updated:` header line. **`UAT` and `Release` left deliberately EMPTY.** See the staging note below: **this file is written but NOT staged.** |

### Verification of the writes, done mechanically rather than asserted

- **`plans/nfr-catalog.md`:** 8 `NFR-` table lines before and 8 after; the seven rows this hop does not
  own hashed and confirmed byte-identical against `HEAD`; the `NFR-002` row's five content cells hashed
  cell by cell against `HEAD` with exactly one (`Applies to`) changed; `NFR-002` at 7 pipe-separated
  fields before and after; `git diff --numstat` reports **1 deletion / 1 insertion on the table** plus
  the appended block and header line.
- **`plans/traceability.md`:** 35 table lines before and 35 after; **every other table line hashed
  inside the same write and confirmed unchanged**; the `ADR-0009` row at exactly 12 pipe-separated
  fields before and after; all four added strings asserted pipe-free and newline-free **before**
  writing.
- **`src/` byte-identical:** 36-file aggregate md5 `afbc181925173a615c3fbf18fd51dab8` before and after,
  `git status --short -- src/` empty, zero untracked files. **Zero production lines, zero test lines.**

## Deliberately NOT written, each with an owner

- **`plans/tickets/ABC-019-turn-loop-skeleton.md`** — clause 9d's stub row counts and clause 9e's
  session-height invariant are **two acceptance criteria owed**. **Owner BA/PM.** Not taken: the
  subtask fenced `plans/tickets/` and a BA/PM hop (`repair-panel-tickets`) is concurrently claimed on
  this branch.
- **`plans/tickets/ABC-016-*.md` / `ABC-017-*.md`** — fenced by the subtask, owned by that concurrent
  hop. Untouched. (They show as modified in the working tree; **those modifications are theirs, not
  mine.**)
- **`plans/board.md`** — **owner Orchestrator.** No board move is claimed or implied.
- **`src/**`** — **zero production lines and zero test lines**, the expected diff for a design hop.
  `src/frame.ts`, `src/frame.test.ts`, `src/render.ts` and `src/history.ts` were read at source and not
  written. The loop shape, the render-seam signature and the two stub shapes are **specified, not
  written**: they belong to `ABC-019`'s dev hop.
- **`ABC-019`'s three ply-count NFR clauses** — not touched. **No bar created, moved or loosened**, and
  `MET`/`MISS` stays **Security/NFR's**.

## The staging decision on `plans/traceability.md`, and how it actually resolved

**This hop deliberately did NOT stage `plans/traceability.md`.** A concurrent BA/PM hop
(`repair-panel-tickets`) edited the `ABC-016` and `ABC-017` rows and prepended its own `_Updated:` line
to that file **between this hop's read and its write**. Their text was **preserved byte-for-byte** —
verified by hashing every other table line inside the same write, 35 table lines before and after,
zero other lines changed. Staging it would have committed another agent's in-flight work under this
hop's commit, and they might still write to it again, so it was left for whichever hop next committed
that file.

**Outcome, verified rather than assumed:** that hop committed at **`5b69b30`** and **carried this
hop's trace row with it**. Confirmed against committed `HEAD`: all four of this hop's cell additions
present exactly once each, its `_Updated:` header line present, the `ADR-0009` row still at **12
pipe-separated fields**, **35 table lines**, and the working tree byte-identical to `HEAD` for that
file. **Nothing was lost and nothing was clobbered in either direction.** Recorded because the
sequence is unusual: this hop's trace row lives in another role's commit, and an auditor reading
`git log` for it would otherwise not find it.

Staged and committed by this hop itself: `memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`,
`plans/nfr-catalog.md`, this task's `.grugops/context/design-stub-seam-and-nfr002/` notes, and its
queue records. **`git add -A` was never used**; every path was named explicitly, and the staged set was
listed and checked before committing.

## Gates run at this hop

Run on the branch tip **before and after** the writes; identical both times.

| Gate | Command | Result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — 40 files checked, 2 `infos`, both **pre-existing** `biome.json` deprecation notices present in the baseline run too |
| typecheck | `npm run typecheck` | **exit 0** (`tsc --noEmit`, project-wide) |
| build | `npm run build` | **exit 0** |
| unit | `npm test` | **exit 0 — 676/676 on 22 files** |
| test integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |

**Lint is not applicable to this hop's outputs:** `npx biome check` on both written markdown files
reports *"Checked 0 files"* and lists them as ignored paths — Biome does not process markdown in this
project. **No test was added or changed**, so the unit lane is untouched and **`NFR-008`'s lane budget
is not charged**. The timing harness ran **outside the repository**, so no wall-clock assertion
entered the suite.

## Harnesses — all five outside the repository, none committed

`h1-identity.ts` (the 560-shape `.length` identity + the derived-height session order),
`h2-mutants.ts` (three height forms × six row-count mutants, plus the clause-5 coverage check),
`h3-timing.ts` (the third independent reading of `repetitionCounts` / `gameStatusOf` / bare
`gameStatus` at 40/120/300), `h4-stub-counts.ts` (which stub counts catch a hardcoded height, and the
session-constant invariant), `h5-recommended.ts` (the recommended loop shape run end to end against a
stub seam and three real-geometry seams). All read-only against merged `src/`; **`src/` never
written.**

## Limits held

Nothing merged, nothing deployed, no protected branch touched, no board move taken. Work is on
`grugops/frame-merge-order-2026-08-11`. Merge and deploy remain the owner's. No `finding` was written:
this hop holds no `§14-gate#<id>` stamp and no `human:<name>` grant, so every result is an
`observation` or a `decision`.
