---
subtask: arch-ABC-175-heap
role: architect-design
tickets: [ABC-175]
ref: .grugops/context/arch-ABC-175-heap/
---

# Architect: verdict command under the heap cap (records only)

## Problem
`secnfr-ABC-174-a0` (route V, F_hi 1.047, A0 commit `ed88329c`; done file `.grugops/queue/done/secnfr-ABC-174-a0.md`, note `.grugops/context/secnfr-ABC-174-a0/notes/…-e4b8d062.md`) found that on the ABC-175 run tree (`grugops/ABC-174` @ `f6b63c1c`, carrying ABC-173's heap guard per ADR-0008 addendum / NFR-010) the verdict command and the A1 `-t "3v4"` probe have no `NODE_OPTIONS=--max-old-space-size=…` prefix, and the guard refuses an unprefixed one-file run (exit 1, no test runs). Probable form: `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`. Whether 180 verdict games fit in that heap is UNKNOWN — no OOM probe is in scope here; an OOM on the night goes to the owner (ABC-173 Q4).

## Do
Rule the verdict and pre-flight command forms under ADR-0008's addendum (which heap value; must it match the AGENTS.md lane prefix; does the A0 vitest arm C1 at 400 bind it). Write a dated forward-only addendum to ADR-0045 D6.3 and ADR-0038 addendum 2 (`memory-bank/50-decisions/`) with the exact commands. Say whether the night needs an OOM pre-probe and how (owner-routed if it costs a run).

## Fences
Records only, on main's working tree: those two ADR files and your notes. No `src/`, `tools/`, `AGENTS.md`, `plans/`, no lane runs, no timing. Leave uncommitted. Never push or merge.

## Publish
Notes under `ref:` (`kind: decision`); `.grugops/queue/done/arch-ABC-175-heap.md` (brief + `## Result`, the exact two commands) and `.claim.md`, uncommitted.

## Result

**done_at 2026-10-19T22:45Z. RULED. Records only.** No lane was run and no timing was taken. Nothing was committed,
pushed or merged. This hop read the run tree `grugops/ABC-174` @ `f6b63c1c` with `git show` only.

### The two commands (exact; BA/PM copies these verbatim)

**Verdict** (`ABC-175` § Scope 2, `ADR-0045` D6.3, `ADR-0038` addendum 2 decision 5.1). Run it from the root of the run tree:

```
caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose
```

**Pre-flight probe** (`ABC-175` `A1`). It must exit **0**, with 4 × `LADDER GAME {` and 1 × `LADDER PAIR {` reading `"pair":"3v4"`:

```
LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1
```

### Rulings (under `ADR-0008` § ADDENDUM 2026-10-19)

- **H1. The heap value is the ONE-FILE flag `400`, so `heap_size_limit` is 496 MiB. It is exactly 400, not "≤ 400".**
  `src/ladder.test.ts` is one file. `-t` filters test names, not files, so the guard reads 1 file in both commands.
  The value comes from `tools/grugops/heap-guard.js` `FLAGS_MIB.oneFile` on the run tree.
- **H2. The prefix matches the `AGENTS.md` ladder lane prefix (run tree, `AGENTS.md:127`).**
  - The token is the same: `NODE_OPTIONS=--max-old-space-size=400`.
  - Its place is the same: after the `LADDER_DEEP` assignment and before `npx`.
  - The token is single and unquoted, with no `--expose-gc`, which only `INPUT_DEEP` needs.
  - If the row ever moves, `heap-guard.js`, the `AGENTS.md` line and these two commands move together (`ADR-0008`
    addendum § Rollback, "the rows are data").
- **H3. `A0`'s vitest arm (C1, flag 400 → 496 MiB) binds the verdict's flag.**
  - Route V rests on `F_hi` 1.047, which was read with the vitest arm at 496 MiB (`secnfr-ABC-174-a0`, `ed88329c`).
  - So the flag is now an `A0` staleness input. It is a command input, recorded through `A2`'s verbatim command in
    `verdict.meta.txt`, not through a file md5.
  - A verdict run at any other flag is a runner configuration that `A0` did not read. That means either an `A0`
    re-take or route N, and the owner decides.
  - A higher flag is also refused by the guard, and raising a row is the owner's call (`ABC-173` Q4). A lower flag
    would pass the guard, but H3 rules it out.
- **H4. The pre-flight probe carries the same flag**, so it runs the configuration the verdict runs (`ABC-175` test
  note 2: "same file, flag, configuration and redirect"). Its exit 0 is also the cap's admission check for the night.
  A refusal reads `heap-guard: refused …` and exits 1, which stops the night before the start.
- **H5. The `env NODE_OPTIONS=…` assignment replaces any `NODE_OPTIONS` already in the Orchestrator's shell.** Nothing
  ambient, such as an `--import`, reaches the run. No `package.json` script and no `npm test`: the 60 s bound stands
  (`ADR-0038` addendum 2 decision 5.1).
- **H6. The budget fits.** ONE-FILE Σ is the main process (496) plus 1 worker (496), so 992 MiB of Node isolates. The
  ladder's only children are `git rev-parse` and `git status` (`src/ladder.test.ts:300-301`). They are not Node, so
  they are recorded and not counted (`ADR-0008` addendum Ruling 2). That is within the 1984 MiB row.

### Does the night need an OOM pre-probe? **No.** A step-4 probe is owner-routed, and I recommend against it.

- **Why 180 games should not build up heap (structural; it is read from source and was not run):**
  - `src/transposition.ts` holds the table at module scope. `clearTable()` allocates it once, at a fixed size, and
    after that only zero-fills it. Nothing grows with the number of games.
  - What the harness keeps across games is the game records (≤ 600 plies each) and the summary lines.
  - The peak live heap is therefore one search's transient heap plus small records.
  - Whether the table's typed-array backing stores count against `heap_size_limit` is standard V8 behaviour (they
    are external memory), but it was not read on this tree: `UNKNOWN - verify`.
- **Evidence at 496 MiB:**
  - QE's `LADDER_DEEP=1` short mode on `ABC-174`: exit 0, 18/18 (`secnfr-ABC-174-a0` note `…e4b8d062`).
  - `A0`'s vitest arm: 5 × `chooseMove(start, 4000 ms, virtualClock(120))`, 29 717 nodes each, all green.
- **What is still unknown:** no step-4 game has run under the cap. Each step-4 search is larger than anything read
  at 496 MiB. So "180 verdict games fit in 496 MiB" stays **`UNKNOWN - verify`**.
- **Why a step-4 pre-probe costs a run:** the harness has step 4 only in verdict mode.
  `LADDER_DEEP=verdict … -t "3v4"` plays the 20 pre-registered 3v4 verdict games, about 0.4 h by estimate (D6.6,
  not timed). It also prints a verdict-mode 3v4 score before the one shot, which breaks `ABC-175` § Pre-registration.
  So it is the owner's call only.
- **Another way, not recommended:** a separate Security/NFR probe of one level-5 `chooseMove` at step 4 under flag
  400, recording peak `heapUsed` and counts only. It plays no verdict game, but it does not cover the 180-game run
  either.
- **On the night:** the pair order is 3v4, 4v5, 2v3, 1v2, 1v5, so an OOM in 1v5 (≈ 3.6 h, estimate) costs the most.
  `ABC-175` `A4` already covers it: no score, the owner decides, route N is named, and the Orchestrator does not
  restart (`ABC-173` Q4: no row is raised without his word).
  - **Add to the `A4` report:** whether `verdict.out.txt` contains `heap out of memory` or `Worker exited unexpectedly`.
    The second is the `PUZZLE_DEEP` OOM signature at 224 MiB (`ADR-0008` addendum).

### `ADR-0045` D6.5 pointer (records)

The `A0` in force is now `ed88329c`, the records-only commit on `f6b63c1c`, which is equivalent for `A1`. It
supersedes `eb216351` (`secnfr-ABC-174-a0`). BA/PM owns the staleness values on the ticket page.

### Files (uncommitted, on main's working tree)

- `memory-bank/50-decisions/ADR-0045-…md`: § ADDENDUM 2026-10-20 (D6.3 and D6.5 pointer).
- `memory-bank/50-decisions/ADR-0038-…md`: § ADDENDUM 3, 2026-10-20 (decision 5.1's command under the cap).
- `.grugops/context/arch-ABC-175-heap/notes/20261019T224500Z-architect-design-decision-abc175-verdict-and-preflight-carry-one-file-heap-flag-400-a0-binds-7c31d5e8.md`
  (decision; hand-authored and unsealed, because there is no sanctioned writer on this install: no
  `scripts/context-io.*`).

### NFR impact

- **`NFR-010`** (test-lane V8 heap ceiling): the verdict run is now a ONE-FILE-shape lane under it.
- **`NFR-008`**: unchanged, because the default lane plays 0 ladder games.
- `plans/nfr-catalog.md` was not edited (fenced).

### Owner question (asked with his go for the night; the recommended path needs no new word)

- **OQ-175-H1.** Run the night with no step-4 OOM pre-probe (**recommended**)? If so, an OOM spends the night and
  comes to you under `ABC-173` Q4, with route N named.
- The alternative is to authorise a pre-probe:
  - **(b)** a `-t "3v4"` verdict-mode run, about 0.4 h estimated, which plays and shows the 3v4 verdict games before
    the one shot; or
  - **(b′)** a one-search heap probe by Security/NFR, which plays no verdict games.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)

| ABC-175 | heap prefix on verdict + pre-flight | arch-ABC-175-heap | ADR-0045 § ADDENDUM 2026-10-20; ADR-0038 § ADDENDUM 3 | flag 400 (ONE-FILE, 496 MiB), = AGENTS.md ladder lane, bound by A0 C1 (`ed88329c`) | NFR-010, NFR-008 (unchanged) | records only; OOM at step 4 `UNKNOWN - verify`, no pre-probe (OQ-175-H1) |
