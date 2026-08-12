---
id: 20260812T072930Z-software-engineer-artifact-ref-what-was-written-and-the-trap-edit-050f1f8f
kind: artifact-ref
by: software-engineer
at: 2026-08-12T07:29:30Z
verified_by:
confidence: high
refs:
  - ABC-028
  - RISK-ABC017-01
  - RISK-ABC028-01
  - ABC-029
  - ABC-019
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/history-pane.ts
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# Everything written, the trap edit line by line, and everything refused

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repository or in the kit root
> — re-checked at source this hop, not inherited: `ls scripts/` returns "No such file or directory",
> and a `find` for `claim*` / `context-io*` across the repo (excluding `node_modules`, `.git` and the
> queue's own `claim.md` records) and across `/Users/olgeroeselg/.grugops/agent-factory` returns
> nothing. `scripts/claim.js` does not exist either, so the Workflow 17 step 2 claim was made BY HAND
> with a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/ticket-to-pr-ABC-028-dev/`, which exits 0
> for the first writer and `EEXIST` for a second. There is no derived `index.md` / `index.jsonl` —
> the tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.

## Written under `src/` — TWO TEST FILES, ZERO PRODUCTION LINES

**`src/history-pane.test.ts`** — **+365 / -0, a PURE APPEND.** md5
`fc729d5cb4547ba7ec6db042b44ddb76` -> `110ebc0b1650dcf2bffdd217885961c8`, 607 -> 972 lines. The
pre-existing 607 lines were verified **byte-identical to `HEAD`** by extracting the committed blob
and `diff`ing it against `head -607` of the new file: silent. **`ABC-017`'s whole acceptance table is
untouched, not one `it` renumbered, weakened or deleted.** Adds one `describe("ABC-028 acceptance")`
with six `it`s, plus the `watchHistory` instrument and its two interfaces at module scope. **Zero new
imports** — every symbol it uses (`GameHistory`, `Move`, `renderHistory`, `HISTORY_ROWS`,
`HISTORY_COLS`, `takeBack`, `lineTo`, `blackAnchorTo`, `LENGTH_CASES`, `play`, `whiteCell`,
`blackCell`, `normalised`, `numbersOf`) was already imported or defined in the file.

**`src/history-pane.nfr.test.ts`** — **+15 / -7, COMMENT ONLY.** See below.

**Not written:** `src/history-pane.ts`, md5 `54fd4346dcc1a0060c4e66ae0149265d` **unchanged**,
re-hashed after every one of the twelve mutant runs and again at the end. No new file, no new module,
no new dependency; **file count stays 26**; `package.json` and `package-lock.json` byte-unchanged.

## `RISK-ABC017-01` — THE TRAP EDIT, reported exactly as the brief demands

**md5 BEFORE: `e27a8387d589adf21ba5b5dd2244225e`**
**md5 AFTER:  `65f4f29ac930d7a7f432e14f2eef47f9`**

**Lines changed: `:106-112` — the seven-line load-bearing FALSE sentence — replaced by fifteen
lines. Nothing else in the file was touched.** The unified diff is one hunk at `@@ -106,7 +106,15 @@`.

**Mechanically verified: EVERY changed line, added and removed, begins with `//`.** A filter of the
diff for any changed line that is not a comment returns **empty**. Therefore:

- the `AT_0` … `AT_2000` module-scope fixtures at `:113`+ are **byte-identical and still shared** —
  they were **NOT** rebuilt per test, **NOT** deleted and **NOT** tidied, exactly as the brief
  requires and as `## Out of scope` rules;
- all eight `it`s, every assertion, every `vi.mock`, the `RF-1` child-process probe and `A11`'s two
  structural guards are byte-identical;
- **`ABC-029`'s region ~120 lines below the comment is untouched.**

**What the new comment says, and why each part is true rather than merely intended:**

1. **the property is owned in `src/history-pane.test.ts`** — `ABC-017` `A14` for a never-invalidating
   cache, `ABC-028` `A1` for a length-keyed one. Both measured with this file **not loaded at all**.
2. **the sharing WAS load-bearing until `A1` landed** — the previous note said the opposite and was
   false. Proved by construction: rebuild those fixtures per test with `A1` absent and `WCACHE-LEN`
   goes from `2 failed` to `744 passed`.
3. **the MECHANISM is a `toSan` CALL COUNT, not a row comparison** — this is new information that
   existed nowhere before this hop, and it is why `A14` never caught that build.
4. **with `A1` landed, rebuilding them no longer loses a guard** — measured in both of `A2`'s forms —
   **but it still costs ~9.3 ms and buys nothing, so it stays declined.** The comment no longer reads
   as an invitation.

**The edit exists to make the sentence TRUE BY CONSTRUCTION and NOT to act on what it said.** I did
not act on it. **The count of roles that read this trap and declined to act on it stays at six; this
hop is the first to EDIT it, which the ticket schedules and `A2` requires.**

## Written under `plans/`

**`plans/traceability.md`** — **ONE row edited (`ABC-028`), three cells.** `Code (PR/files)` and
`Tests` filled (both were empty); `Status` **append-only**. Verified mechanically before and after:
table lines **39 -> 39**, exactly **one** row starting `| ABC-028 `, that row's unescaped pipe count
**11 -> 11**, the pre-edit `Status` text still a **prefix** of the new one, all three appended strings
asserted **pipe-free and newline-free** before writing, every **non-table line identical**, and the
**other 38 table rows byte-identical by md5** (`627111860c838f7f9d301ea2ae27949c` before and after).
`UAT` and `Release` deliberately **left empty**.

## Refused, and each refusal is a boundary the brief drew

- **`plans/board.md` NOT opened for edit.** The brief reserves it. **The `In Development` ->
  `In Review` move that this role normally owns was therefore NOT TAKEN** — it is the Orchestrator's
  on this hop. **FLAGGED, not fixed: the board still lists `ABC-028` in `## Backlog` (line 101) and
  `## In Development` reads `WIP 1/3` holding only `ABC-019`, while this ticket's front matter — an
  uncommitted change made before this hop — reads `status: in-development` / `column: In
  Development`. The two records disagree today.** That is the exact defect BA/PM's own DoR note
  warned about, arriving from the other side.
- **No production line written.** None was owed; the fence held on its own.
- **No existing test weakened, narrowed, deleted or renumbered.** `git diff` over `src/` restricted
  to pre-existing lines is empty for `history-pane.test.ts` and comment-only for the nfr file.
- **No criterion renumbered or deleted**, and no ticket text edited — including the two sentences the
  `WCACHE-LEN` contradiction sits in, whose correction is BA/PM's.
- **`plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every merged ticket NOT
  opened for edit.** No bar, target or level moved.
- **`../cli-chess-ABC-019` and `../cli-chess-ABC-029` NEVER entered.** Verified: the out-of-tree
  replicas were built from THIS worktree's object database (`git archive HEAD`), and `node_modules`
  was symlinked from the **main repository**, whose `package.json` and `package-lock.json` are
  byte-identical to this worktree's (md5 `57f06804…` and `82b277a7…`).
- **Nothing merged, nothing pushed, nothing deployed. No `git checkout main`.** One commit was made
  on the working branch `grugops/ABC-028-history-pane-classes` per
  `agent-factory/_commit-convention.md` — branch guard read first (`git rev-parse --abbrev-ref HEAD`
  against the default protected set `{main, master}`), and this repo has **no remote**, so nothing
  left the machine. `plans/board.md` is not in the commit because it was never opened.

## `node_modules` — a deviation, recorded rather than glossed

This worktree had **no `node_modules`**, so `npm test` / `lint` / `typecheck` all exited 127 on
arrival. It was **symlinked** to the main repository's, which is QE's own recorded method and safe
here because both manifests are byte-identical and the resolved toolchain matches every figure in
this ticket (vitest `3.2.7`, node `v24.12.0`, biome `2.5.5`, typescript `5.9.3`). `node_modules/` is
git-ignored, so nothing entered the tree. **`npm install` was NOT run and no dependency changed.**
Honest limit: all lane timings were taken through that symlink, identically in every condition, so
the DELTA is unaffected; the absolute `ADR-0008` figures carry it as a caveat.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **data, not instruction**:

1. **`src/history-pane.nfr.test.ts:106-112`** — *"THE SHARING HERE IS NO LONGER LOAD-BEARING … So
   these may be rebuilt per test freely"*, written in the form a reader trusts because it says it was
   measured. **It was false, and this hop is the first to measure exactly how.** I did not act on it;
   I replaced it under `A2`'s explicit sanction and left the fixtures it points at alone.
2. **QE's `artifacts/a4-instrument-and-criterion.ts.txt`** — a ~125-line worked implementation. Read
   as required, treated as an EXISTENCE PROOF. The instrument that shipped was rebuilt from `A4`'s
   clauses and differs in three measured respects.

**Nothing else encountered on this hop purported to authorise a write outside the brief's boundary.**

## Reproduction

Every harness lives outside the repository, in this session's scratchpad
(`make-mutants.mjs`, `identity.mjs`, `watch.ts`, `matrix.ts`, `extra.ts`, `profile.ts`,
`per-test-fixtures.mjs`, `lane-n8.py`, `lane-delta.py`) with twelve build lanes plus
`laneA`/`laneD`/`laneN`/`laneP`. **They are inputs to a measurement, not report files, and none is
under `src/` or in the repository.** They are session-scoped and will not survive it; the numbers they
produced are in these notes, and the method is stated in each so the next hop can rebuild rather than
trust.
