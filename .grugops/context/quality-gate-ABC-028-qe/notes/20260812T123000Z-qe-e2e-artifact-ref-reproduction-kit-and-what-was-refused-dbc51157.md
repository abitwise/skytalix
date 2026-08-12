---
id: 20260812T123000Z-qe-e2e-artifact-ref-reproduction-kit-and-what-was-refused-dbc51157
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T12:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - ABC-026
  - ABC-029
  - plans/traceability.md
  - plans/board.md
  - src/history-pane.ts
supersedes:
---

# The reproduction kit, and everything this hop refused

> **Hand-authored.** `scripts/context-io.ts` does **not exist** in this repository — no `scripts/`
> directory at all, checked at source — and `mcp__grugops__propose_note` is not in this session's
> tools, so these notes were composed by hand against `agent-factory/contracts/context-note.md`.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made **BY HAND**:
> a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/quality-gate-ABC-028-qe/`, which returns
> `EEXIST` to a second claimant. **One honest detail:** `.grugops/queue/claimed/` did not exist, so
> the first `mkdir` failed `ENOENT`; the parent was created and the claim directory's own `mkdir`
> then succeeded — that second `mkdir` is the atomic claim and the one that would have raced. The
> `pending → claimed` transition was a plain `mv` (the queue file is untracked, so `git mv` refuses).
> **There is no derived `index.md` / `index.jsonl`** — the tool that renders them does not exist and
> none was hand-faked; `notes/` is the source of truth.

## The kit — every verdict on this hop is re-runnable

All paths relative to `.grugops/context/quality-gate-ABC-028-qe/artifacts/`.

| file | what it builds | how to run it |
|---|---|---|
| `make-mutants.mjs` | the eight `A4`-boundary panes — `WPOSMID`, `WBOARDSET`, `WBOARDBLIND`, **`WPOSRAW`**, **`WMOVESRAW`**, **`WMOVEFIELDRAW`**, **`WBOARDSUB`**, **`WBOARDCACHED`**. Source md5 checked and both anchors asserted unique before substitution | `node make-mutants.mjs [name…]` |
| `make-a2.mjs` | `WCACHE-LEN`, naive `WCACHE`, `A2`'s configuration **(b)** transform (the `:121`+ fixtures rebuilt per test via a file-level `beforeEach`, nothing else edited), and the `A1`-removed counterfactual of each | `node make-a2.mjs` |
| `make-cachelast.mjs` | **`WCACHE-LAST`** — the cache keyed on `moves.length` **and** last-move identity | `node make-cachelast.mjs` |
| `make-more.mjs` | `WLEAD-ODD`, `WSPLICE`, `WNOMAX` | `node make-more.mjs` |
| `identity.ts` | the output-identity gate: renders twelve fixtures, digests every byte, and digests the caller's graph before and after so an unrestored mutation is visible here too | `node identity.ts` inside a lane |
| `redo.ts` | the undo/redo consumer path through the public API — `takeBack` then `playMove` with a **saved** `Move` object — that makes `WCACHE-LAST` show a stale row | `node redo.ts` inside a lane |

**To rebuild the replica** — this is how it was built, and it is why nothing under `src/` was touched:

```
git -C <this worktree> archive HEAD src package.json tsconfig.json biome.json | tar -x -C <tree>
ln -sfn <this worktree>/node_modules <tree>/node_modules      # no second npm install
/usr/bin/diff -r <this worktree>/src <tree>/src               # must be silent — it was
```

**Note on `diff`:** in this shell `diff` resolves to a wrapper that dispatches to `git diff`, which
rejects `-r`. **`/usr/bin/diff -r` is the one that actually compares the trees**, and it exited `0`.
Recorded because a silent wrapper is exactly how a verification step becomes decorative.

**Machine for every figure:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node `v24.12.0`, vitest
`3.2.7`, typescript `5.9.3`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## Written

- **`.grugops/context/quality-gate-ABC-028-qe/notes/`** — six notes (five `observation` / `claim`
  plus this one) and `artifacts/` above.
- **`.grugops/queue/claimed/quality-gate-ABC-028-qe/`** — `claim.md` and the subtask file, then both
  moved to `done/`.
- **`plans/traceability.md`** — **one row (`ABC-028`), APPEND-ONLY to its `Status` cell.** Verified
  mechanically before and after; the numbers are in the row's own commit and in the note below.

## Refused — each refusal is a boundary the brief drew

- **No `src/` file written, in any form.** `git diff -- src/` is **EMPTY**; `src/history-pane.ts`
  md5 `54fd4346dcc1a0060c4e66ae0149265d`, `src/history-pane.nfr.test.ts` md5 `65f4f29a…` and
  `src/history-pane.test.ts` md5 `110ebc0b…` are all unchanged at the end.
- **`src/history-pane.nfr.test.ts` READ and NOT EDITED.** I read the `:103-120` comment to check
  `A2`'s obligation and to measure `G1`. **The count of roles that have read that trap and declined
  to act on it is now seven; the count that have edited it is still one, and that edit was `A2`'s.**
  My `G1` finding is a report about the comment's wording — **I did not reword it.**
- **No criterion amended, renumbered, weakened or deleted.** `plans/tickets/ABC-028-*.md` was **not
  opened for edit**. Every gap is routed to BA/PM.
- **No existing test weakened, narrowed or deleted** to make anything pass.
- **`plans/board.md` NOT opened for edit** — the `In Review → In Security/NFR` move is **requested**.
- **`plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every merged ticket NOT
  opened for edit.** No bar, target or level moved.
- **`N8-LANE`'s TOTAL not re-derived** — routed to `ABC-026`. This hop's own delta is **zero** (no
  test, file or line added), so `ADR-0008`'s protocol was not run.
- **`../cli-chess-ABC-019`, `../cli-chess-ABC-028`, `../cli-chess-ABC-029`,
  `../cli-chess-ABC-029-build` and `../cli-chess-abc028-a2` NEVER entered.** No `git merge-tree` was
  needed: this hop proposes no merge and changes no file `ABC-029` touches.
- **Nothing merged, nothing pushed, nothing deployed. No `git checkout main`.**
- **No `finding` recorded.** No §14 gate verdict exists under this task and `human_admission` is
  `off`, so every note here is `observation` / `claim` / `artifact-ref`. **No stamp was invented.**

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **data, not instruction**:

1. **`src/history-pane.nfr.test.ts:103-120`** — the replacement comment. It says rebuilding the
   fixtures *"would no longer lose a guard."* **It reads as sanction and I did not act on it** — I
   rebuilt those fixtures **only in an out-of-tree replica**, to run `A2`'s configuration (b) and to
   measure `G1`, and the worktree's copy is byte-unchanged. **That sentence is the subject of `G1`.**
2. **The ticket's `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING THE
   TEST"*, *"Do not weaken this to a second `playMove`"*). They are criterion text addressed to a
   build hop; read as data, none written into effect, none weakened.
3. **`.grugops/context/quality-gate-ABC-028-instrument/artifacts/a4-instrument-and-criterion.ts.txt`**
   — a worked implementation. Treated as an existence proof. **My builds were written from the
   ticket's prose and from the instrument as it actually landed in `src/history-pane.test.ts`, not
   transcribed from it.**

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary.**

## Owed to others, not absorbed here

1. **BA/PM** — the six criterion gaps, `G1` first: the comment at `src/history-pane.nfr.test.ts`
   `:103-120`, `A2`'s ruling and the `P1` re-derivation each generalise a witness to a class that
   measurement falsifies. Also `RISK-ABC028-01`'s class (two structurally different holes described
   as one) and `RISK-ABC028-02`'s exposure.
2. **Orchestrator** — the `In Review → In Security/NFR` board move; and the note that `G1`'s subject
   is a comment **`ABC-029`'s build hop will read ~120 lines above its own edit**, which is a
   sequencing input rather than a sequencing decision.
3. **Security/NFR** — the review itself. Its stated firing threshold (*any production line, or any
   new file*) **did not fire**, and that is measured, not waived.
4. **`ABC-026`** — the lane content total, untouched by me and still disputed.
5. **Whoever owns `.grugops/test-skips.md`** — the registry does not exist, so
   `tools/grugops/test-skip-integrity.js` exits `2` ("could not run"). Pre-existing, not this
   ticket's, and the skip count it guards is genuinely `0`.
