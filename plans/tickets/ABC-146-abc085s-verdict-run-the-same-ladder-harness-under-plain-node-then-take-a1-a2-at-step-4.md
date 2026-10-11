---
id: ABC-146
title: "`ABC-085`'s verdict: run the same ladder harness under plain `node`, prove by digest that it plays the same games, then take `A1`/`A2` at step 4 on a tree with `ABC-083`"
status: backlog
column: Backlog
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-146 — the ladder verdict under plain `node`: ~10 h of one core, not ~44 h inside vitest, for the same games

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe114-2026-10-11`, Workflow 07).
> This is **`ABC-085`'s pre-registered split** (`ABC-085` § Dependencies, "Split trigger"): the `A1`/`A2`
> verdict run as its own `XS`. It is built to the **PROPOSED** `ADR-0038` addendum of 2026-10-11 (decision 5
> amended; Architect notes `…2566e813`, `…be323233`, arithmetic `…5d70d79e`).
>
> **WAITING on two things, both outside this ticket:** the owner's acceptance of the `ADR-0038` addendum, and
> `ABC-083`'s merge (it is `Blocked`). It also needs `ABC-085`'s harness merged, because that is the code it
> moves. **This hop ran nothing and timed nothing.** Every figure is cited.

## Problem

*User*: the owner, who wants to know whether the difficulty levels are really ordered (`EPIC-004`'s first
acceptance criterion: the hardest level scores ≥ 90 % against the easiest over 100 games).

*Pain*: the harness `ABC-085` built (`src/ladder.test.ts`, at `d5b0f0e2`) runs inside vitest. There the
engine costs **~4.35x per node** against plain `node` (4.23–4.46x, the same 145 765 nodes under both runners,
the Engineer's `…70684a78`). So the step-4 verdict costs **~43.5 h (30–58) of one core** in vitest, not the
~10 h (7–13) `ADR-0038` was accepted at. The games are a function of node counts only (`ADR-0038` decision
4), so the runner buys nothing but wall. Two days of one core on a fanless Air also runs against the owner's
"reduce cpu usage" (`ABC-144`).

*Value*: the epic's first criterion, and `A2`'s ordered-ladder check, are read at the cost the owner accepted,
with a digest check that proves the cheaper route plays the same games.

## Scope

1. **One game loop, moved verbatim.** The harness's non-vitest code moves into a module under
   `tools/ladder/`: the step constants, `stepForMode`, the sides, the game loop, the claim policy, the ply cap,
   the scorer, the `A4` replay, the digests and the report lines (`ADR-0038` addendum item 1).
   `src/ladder.test.ts` imports it and keeps every default row and `LADDER_DEEP=1`.
2. **A small `node` entry** under `tools/ladder/` that runs `verdict`, and `1` for the equivalence check. The
   Engineer names it.
3. **`tsconfig.json` `include` and `biome.json` `files.includes` gain `tools/ladder/**/*.ts`**, as `ADR-0037`
   did for `tools/opening-book/`.
4. **Under vitest, `LADDER_DEEP=verdict` is refused at load**, with a message that names the `node` command.
5. **The equivalence check, then the verdict run** at step 4 on a tree that contains `ABC-083`'s merge, and
   its report.

## Out of scope

- **Any change to the games.** Steps 4 and 120, the game counts, the seeds, the claim policy and the cap stay
  exactly as `ABC-085` built them. `ADR-0038` decisions 1–4 and 6 are unchanged.
- **Tuning the levels.** A RED `A1` or `A2` pair is `ABC-087`'s finding, routed to BA/PM (`ABC-085` § Out of
  scope).
- **Running the pairs as parallel processes** (`ADR-0038` addendum, rejected alternative (b)).
- **A `node` entry under `src/`** (rejected alternative (c′): it would be a production module, `ADR-0011`
  cl. 1).
- **Finding or removing vitest's per-node overhead.** That is `ABC-147`, and nothing here depends on it.
- **`AGENTS.md`.** The Scribe writes the `node` command after this merges (`…8515e3e7` stays as drafted
  until then).

## Acceptance (Given/When/Then)

- **`A1` (the move is verbatim, read by digest).** **Given** the base commit (the merged `ABC-085` harness)
  and this ticket's head, **when** `LADDER_DEEP=1 npx vitest run src/ladder.test.ts` runs on each, **then**
  both print **the same five pair digests and the same `A5` digest**, and the file's `it` count is the same
  at base and head, unset and with `LADDER_DEEP=1`.
  - The digests are compared base against head on this ticket's own runs. The values recorded at
    `d5b0f0e2` (`72f01570a3987247`, `302d8b4676cd7299`, `f89bbd75f4a066e9`, `89b8059f53c970df`,
    `d30b4a153b7c1a9a`) hold only while the engine path is unchanged, so they are a cross-check, not the
    bar.
- **`A2` (the `node` entry).** **Given** head, **when** the entry runs with `1`, **then** it exits **0** and
  every report line names the mode, the step, the game count, the claimed draws per pair, and **the runner
  and its version** (`node v…`; addendum item 3). Any argument other than `1` or `verdict` prints a usage
  line and exits **non-zero**.
- **`A3` (the equivalence check: pre-registered, counts and digests only, never a timing).** **Given** one
  commit, **when** `LADDER_DEEP=1 npx vitest run src/ladder.test.ts` and the `node` entry with `1` both run,
  **then** they print **the same five pair digests, the same `A5` digest, and the same plies and ending for
  every game** (26 of 26 at `ABC-085`'s short-mode counts).
  - **This passes on the verdict commit before any verdict number is quoted.**
  - **If any digest, ply count or ending differs, the `node` route is refused.** Nothing is quoted from it.
    The difference goes to the owner through the Orchestrator, with the fallback named: the verdict inside
    vitest at ~43.5 h. **This ticket does not start a 44-hour run on its own authority.**
- **`A4` (one verdict route).** **Given** head, **when** `LADDER_DEEP=verdict npx vitest run
  src/ladder.test.ts` runs, **then** it exits **non-zero** before any game is played, and its output contains
  the `node` entry's command.
- **`A5` (the verdict: `ABC-085` `A1` and `A2`, taken here).** **Given** a tree that contains `ABC-083`'s
  merge (`ADR-0038` decision 6; if `ABC-083` is split or dropped, `ABC-085` `A1` says which tree) and on which
  `A3` passed, **when** the `node` entry runs `verdict` once, **then** the report states:
  - the commit, the step (4), the seeds, the game counts, the wall time, load1, and the runner and version;
  - **`ABC-085` `A1`:** the 1v5 score over 100 games, colours alternating, as **MET or RED against ≥ 90 %**;
  - **`ABC-085` `A2`:** every adjacent pair's score over ≥ 20 games, as **MET or RED against > 50 %**, with
    **3v4 and 4v5 run first**;
  - the claimed draws per pair (`ABC-085` `A3`);
  - **100/100 games terminate and 100/100 replay legally** (`ABC-085` `A3`, `A4`). A failure of either exits
    non-zero, and no score is quoted from that run.

  A RED `A1` or `A2` is a real score and `ABC-087`'s finding. It does not hold this ticket open and it is not
  a delivery defect (`ABC-085` `A2`).
- **`A6` (fences and the run's manners).**
  - Under `src/`, only `src/ladder.test.ts` changes. **0 production lines**:
    `git diff --name-only <base> | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.
  - `npm test`: **the default lane plays 0 ladder games.** The file count equals base, or base + 1 only if
    the Engineer adds a test file under `tools/ladder/`, declared before the reading. The test count is
    declared the same way. Skips are **0**. Lint, typecheck and build exit **0**.
  - **The verdict is one serial background process, scheduled by the Orchestrator.** It **never overlaps a
    no-other-hop window** (`ABC-144` Window B, any `ADR-0035` reading); a run that holds one core for ~10 h
    is another hop by that definition. The pairs never run in parallel.

## Dependencies

- **The owner's acceptance of the `ADR-0038` addendum — OWED** (Architect `…be323233` question 1). **If he
  declines,** `A1`–`A4` are cancelled, and this ticket becomes the verdict run inside vitest at ~43.5 h
  (`A5` with `LADDER_DEEP=verdict` in vitest). It is then re-scored before it is pulled.
- **`ABC-083`'s merge — for `A5` only.** `ABC-083` is `Blocked` (BLOCKED_NEEDS_FIX, two class-R reds). The
  verdict has no date until it merges.
- **`ABC-085`'s merge, including `fix-ABC-085` — for `A1`–`A4`.** Its harness is the code that moves. **The
  split trigger has fired:** QE passed `A3`–`A6` in short mode at `3783ae15` (PASS_WITH_GAPS, `…3b1e7c52`),
  with `ABC-083` unmerged. `fix-ABC-085` is now adding default-lane rows for `QE-085-a`/`b`/`c` (the colour
  schedule, the pair score, the `A1` bar, the claimed-draw count, the budgets, the game counts and
  `PLY_CAP`). **This ticket moves the harness as it stands after that fix**, rows included, and `A1`'s
  base is that merge.
- **Pull it only when all three hold.** The build half could start before `ABC-083` merges, but nothing is
  gained: the verdict cannot run, and `A3` is re-run on the verdict commit anyway.
- **Staleness** (`ABC-085` § Dependencies): a verdict is STALE after any merge that touches `PUZZLE_DEEP`'s
  engine trigger list, `src/levels.ts` or `src/virtual-clock.ts`. Re-taking it is the Orchestrator's to
  schedule, and `A3` re-runs first.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** the default lane plays 0 games. The count pin is 0 games, + 0 files (+ 1 only if
  declared, `A6`), 0 spawns. No wall bound.
- **Cost, labelled as estimates** (`ADR-0038` addendum § Consequences; per-pair split is the Engineer's ×30
  route ÷ 4.35, `…5d70d79e`; plies at step 4 are `UNKNOWN - verify`):

  | runner, step 4 | full run | `A1` (1v5, 100 games) | 3v4 + 4v5 first |
  |---|---:|---:|---:|
  | plain `node` (this ticket) | **~10 h** (7–13) | ~4.3 h | ~4.6 h |
  | inside vitest (the fallback) | ~43.5 h (30–58) | ~18.7 h | ~20.0 h |

  The equivalence check under `node` projects to ~195 s (848.3 s in vitest ÷ 4.35). That is a projection,
  not a reading.
- **`ABC-144`:** the run is a hop for window purposes (`A6`). `ADR-0040`'s worker cap does not reach a
  plain-`node` process.
- **Security: not triggered.** A dev tool outside `src/` with one argument, refused when unknown, no
  network, no file written.

## Test notes

1. **Equivalence is by digest, plies and ending, never by time** (`A3`). A wall time from one runner is
   never compared with one from the other.
2. **`A1`'s verbatim check is base against head on this ticket's runs.** The `d5b0f0e2` digests move with
   any engine change, and `ABC-083` is one.
3. **Show `A4`'s refusal on a run, and show that `A3` can fail.** On a scratch copy, perturb one input that
   only the `node` run sees (the Engineer picks it, for example one seed in the entry). The digests must
   then differ. Revert it after. A check that cannot go red is not a check.
4. **Report the mode with every number** (`ABC-085` test note 4). Nothing from `LADDER_DEEP=1` is ever quoted
   as `A1` or `A2`.
5. **Mandatory gates:** lint, typecheck, build, `npm test`. Then the QE hop (owner's standing rule).

## Size and priority

**`XS`.** Code is moved, not written. The new parts are one small entry, two include globs and one refusal.
The verdict is machine time on the Orchestrator's schedule, not effort. **Not `S`:** no new game logic and no
new criterion. Every bar is `ABC-085`'s.

**`P1`, inherited.** This carries `ABC-085`'s `A1`, the epic's first criterion, and the owner kept `ABC-085`
at `P1` (note `…owner-word-six-answers-b7c41e09`). **Not `P0`:** for the same reason `ABC-085` is not.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 9 of 10, ⚠️x1 (item 10). Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** ~43.5 h in vitest against ~10 h under `node`, for the same games |
| 2 | scope and out-of-scope clear | **✅** move, entry, refusal, equivalence, run. The games and the levels are fenced off |
| 3 | INVEST-shaped | **✅** one route change and one run. Negotiable on the owner's acceptance. Testable by digest |
| 4 | acceptance testable and measurable | **✅** digest equality (5 + 1, 26 of 26 games), exit codes, MET/RED against ≥ 90 % and > 50 %, 100/100 |
| 5 | dependencies known | **✅** the owner's acceptance, `ABC-083`, `ABC-085`, with a stated fallback for each |
| 6 | security/NFR triggers with a measurable target | **✅** 0 games in the default lane, a count pin, an estimated cost with its band |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1`, inherited |
| 10 | no major unresolved blocker | **⚠️** the `ADR-0038` addendum is PROPOSED, and `ABC-083` is `Blocked`. **Re-score to 10/10 when the owner accepts and `ABC-083` merges** |

Column moves are the Orchestrator's.
