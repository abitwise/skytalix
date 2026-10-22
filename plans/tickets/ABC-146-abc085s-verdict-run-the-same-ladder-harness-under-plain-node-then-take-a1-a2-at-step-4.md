---
id: ABC-146
title: "`ABC-085`'s verdict: run the same ladder harness under plain `node`, prove by digest that it plays the same games, then take `A1`/`A2` at step 4 on a tree with `ABC-083`"
status: done
column: Done
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-146 — the ladder verdict under plain `node`: ~10 h of one core, not ~44 h inside vitest, for the same games

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe114-2026-10-11`, Workflow 07).
> This is **`ABC-085`'s pre-registered split** (`ABC-085` § Dependencies, "Split trigger"): the `A1`/`A2`
> verdict run as its own `XS`. It is built to the ~~**PROPOSED**~~ **ACCEPTED** `ADR-0038` addendum of 2026-10-11 (decision 5
> amended; Architect notes `…2566e813`, `…be323233`, arithmetic `…5d70d79e`).
>
> ~~**WAITING on two things, both outside this ticket:** the owner's acceptance of the `ADR-0038` addendum, and
> `ABC-083`'s merge (it is `Blocked`). It also needs `ABC-085`'s harness merged, because that is the code it
> moves.~~ **This hop ran nothing and timed nothing.** Every figure is cited.
>
> **2026-10-11, BA/PM sync (subtask `bapm-cut-abc147-lever`).** The `ADR-0038` addendum is **ACCEPTED** by the
> owner, 2026-10-11 (verbatim "accepr ADR-0040 and ADR-0038", transcription note
> `…owner-word-accept-adr0040-adr0038-addendum-7089c972`, not a stamp). `ABC-085`'s harness is **merged**
> (`1031911b`). **One wait remains: `ABC-083`'s merge** (`Blocked`, re-levelled on its branch, unmerged).

## Problem

*User*: the owner, who wants to know whether the difficulty levels are really ordered (`EPIC-004`'s first
acceptance criterion: the hardest level scores ≥ 90 % against the easiest over 100 games).

*Pain*: the harness `ABC-085` built (`src/ladder.test.ts`, at `d5b0f0e2`) runs inside vitest. There the
engine costs **~4.35x per node** against plain `node` (4.23–4.46x, the same 145 765 nodes under both runners,
the Engineer's `…70684a78`). So the step-4 verdict costs **~43.5 h (30–58) of one core** in vitest, not the
~10 h (7–13) `ADR-0038` was accepted at. The games are a function of node counts only (`ADR-0038` decision
4), so the runner buys nothing but wall. Two days of one core on a fanless Air also runs against the owner's
"reduce cpu usage" (`ABC-144`).

*2026-10-11, BA/PM:* **the factor that moves this verdict to `node` is the same factor `ABC-147` measured and
`ABC-150` now targets.** `ABC-147` read **4.93–5.38x** on the default lane's two heaviest engine workloads
(paired, digests equal, load1 5–6, thermal level 1; `…a6122481`). The ladder's own figure stays `ABC-085`'s
4.35x on `chooseMove`, so the ~43.5 h vitest fallback below is, if anything, low. **This route does not wait
on `ABC-150`, and `ABC-150` does not re-open it:** plain `node` pays no factor, and `A3`'s digest check stays
the bar whatever `ABC-150` rules.

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
- **Finding or removing vitest's per-node overhead.** That is `ABC-147` (the reading) and `ABC-150` (the
  lever, cut 2026-10-11), and nothing here depends on either.
- **`AGENTS.md`.** The Scribe writes the `node` command after this merges (`…8515e3e7` stays as drafted
  until then).

## Acceptance (Given/When/Then)

- **`A1` (the move is verbatim, read by digest).** **Given** ~~the base commit (the merged `ABC-085` harness)~~
  *(amended 2026-10-12, BA/PM re-score)* **this ticket's own branch point on `main`, which must contain
  `f00038ef` (`ABC-083`) and `7a920ca5` (`ABC-152`) — never `1031911b`**, whose engine predates `ABC-083`
  and whose runner predates `ABC-152`, so its digests differ for reasons that are not the move and the pair
  straddles `ADR-0040` d5 —
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
  - ~~**100/100 games terminate and 100/100 replay legally**~~ *(amended 2026-10-12: the verdict plays
    **180** games — 100 for 1v5 plus 4 adjacent pairs × 20, `ladderPlan` at `src/ladder.test.ts:249-261`)*
    **every game of the run terminates and replays legally: 180 of 180, and 180 of 180** (`ABC-085` `A3`,
    `A4`, "any run"). A failure of either exits non-zero, and no score is quoted from that run.

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

- **The owner's acceptance of the `ADR-0038` addendum — ~~OWED~~ ACCEPTED 2026-10-11** (Architect `…be323233`
  question 1; note `…7089c972`). ~~**If he declines,** `A1`–`A4` are cancelled, and this ticket becomes the
  verdict run inside vitest at ~43.5 h (`A5` with `LADDER_DEEP=verdict` in vitest). It is then re-scored
  before it is pulled.~~ The decline branch is moot.
- **`ABC-083`'s merge — for `A5` only.** `ABC-083` is `Blocked` (BLOCKED_NEEDS_FIX, two class-R reds). The
  verdict has no date until it merges.
- **`ABC-085`'s merge, including `fix-ABC-085` — for `A1`–`A4`.** Its harness is the code that moves. **The
  split trigger has fired:** QE passed `A3`–`A6` in short mode at `3783ae15` (PASS_WITH_GAPS, `…3b1e7c52`),
  with `ABC-083` unmerged. `fix-ABC-085` is now adding default-lane rows for `QE-085-a`/`b`/`c` (the colour
  schedule, the pair score, the `A1` bar, the claimed-draw count, the budgets, the game counts and
  `PLY_CAP`). **This ticket moves the harness as it stands after that fix**, rows included, and `A1`'s
  base is that merge. *2026-10-11: **merged** (`1031911b`, QE PASS_WITH_GAPS on the second pass). `A1`'s base is
  `1031911b` or a later main that keeps the harness byte-equal. `QE2-085-a` (LOW, optional before the verdict)
  is on `ABC-085`'s page.*
- **Pull it only when all three hold.** *(2026-10-11: two hold; `ABC-083`'s merge is the one left.)* The build half could start before `ABC-083` merges, but nothing is
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
| 10 | no major unresolved blocker | **⚠️** ~~the `ADR-0038` addendum is PROPOSED, and~~ `ABC-083` is `Blocked`. **Re-score to 10/10 when ~~the owner accepts and~~ `ABC-083` merges.** *Re-scored 2026-10-11 (BA/PM, `bapm-cut-abc147-lever`): the addendum is ACCEPTED and `ABC-085` is merged; `ABC-083`'s merge is the only open part. Still 9/10, still `Backlog`* |

Column moves are the Orchestrator's.

## Re-score — 2026-10-12

BA/PM (task `wave-2026-09-25`, subtask `bapm-rescore-backlog-product`, Workflow 07), at `main` `1eb2edbc`.
**Result: 8 of 10, ⚠️x2 (items 1 and 10). Stays in `Backlog`. One owner question.** No timing was read here;
every wall figure below is cited. Readings and commands: `.grugops/context/bapm-rescore-backlog-product/notes/`.

**Discharged.**
- **The owner's acceptance.** The `ADR-0038` addendum is **accepted** (ADR § Status, line 12: "ACCEPTED
  2026-10-11", note `…7089c972`). No ADR acceptance is owed. The addendum's own heading (ADR line 196) still
  reads "PROPOSED; owner acceptance owed". That is stale text in the ADR, and it is Architect/Design's to fix.
- **`ABC-083`'s merge.** Merged as `f00038ef` on 2026-10-11 (`git merge-base --is-ancestor f00038ef 1eb2edbc`
  exits 0). The board row still says "Only ABC-083's merge is open". That is stale too.
- **The harness and the step still match today's code.** `src/ladder.test.ts` is byte-identical to `1031911b`
  (`git diff 1031911b 1eb2edbc -- src/ladder.test.ts` is empty; md5 `bba67b75565b4f4a2e8d231e8bcd6b2e`).
  `VERDICT_STEP = 4` and `SHORT_STEP = 120` are at `:48-50`. `LADDER_DEEP=verdict` is accepted at `:70`.
  `src/levels.ts` and `src/virtual-clock.ts` are unchanged since `1031911b`. `src/evaluate.ts` changed by
  `ABC-083`, which is the tree the verdict is meant for. On vitest 4.1 with the runner off, `LADDER_DEEP=1`
  ran green at the `ABC-152` tip (56 files, 1746/1746, `…ac190931`).

**New ⚠️, item 1: the problem's premise is no longer known to hold.** The pain was a **~4.35x per-node
cost inside vitest** (`…70684a78`). `ADR-0041` names the cause as vite's module runner. **`ABC-152` turned that
runner off** (`vitest.config.ts` `experimental.viteModuleRunner: false`, merged `7a920ca5`). Cited evidence
that the factor went with it (none of it is a paired factor reading on `chooseMove`):
- `PUZZLE_DEEP=1`'s printed wall is **3.96 s against 19.95 s** (paired, n = 4, Security/NFR `…bceca0ca`);
- `LADDER_DEEP=1` across the whole suite took **191 s** at the runner-off tip (`…ac190931`, unpaired, reported
  only). That sits beside the **~195 s** this page projects for the `node` equivalence check, and against the
  **848 s** file-only reading with the runner on.
- If the factor is gone, the vitest verdict also costs about **~10 h (7–13)**. Then scope items 1–4 (move the
  harness, add an entry, two globs and a refusal) buy almost nothing. This is `UNKNOWN - verify` until a
  paired factor reading is taken. I took none.

**New ⚠️, item 10: the route is the owner's.** He accepted the `node` route on the 4.35x premise.

**Owner question (exact):** *"`ABC-152` turned vitest's module runner off. `ADR-0041` says that runner caused
the ~4.35x cost that made you accept the `ADR-0038` addendum (the verdict under plain `node`). Do you want:
**(a)** the verdict taken inside vitest as `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`, with no new
code, if one paired re-read of the factor puts that run inside the 7–13 h band you accepted; or **(b)**
`ABC-146` built as you accepted it, with the harness moved to `tools/ladder/` and run under plain `node`?"*
- **On (a):** Architect/Design writes a second `ADR-0038` addendum, and Security/NFR takes the paired re-read
  at width 1. `A1`–`A4` are cancelled. `A5` and `A6` stand, with the command
  `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`. Size stays `XS`. It is then a run plus a report.
- **On (b):** the page stands as amended above. DoR goes to 10/10.

**Criteria amended (dated in place above):**
- **`A1`'s base** is now the ticket's branch point (must contain `f00038ef` and `7a920ca5`), not `1031911b`.
- **`A5`'s game count** is now **180 of 180**, not 100/100. The verdict plays 100 + 4 × 20 games
  (`src/ladder.test.ts:53-56`, `:249-261`).

**What pulling it means (either route).**
- **It holds one core for ~10 h (7–13).** The verdict is counts, so other hops cannot spoil it.
- **It does spoil every timing window that overlaps it** (`A6`): `ABC-144`-style windows, any `ADR-0035`
  reading, and any QE width-1 lane re-read. So the Orchestrator schedules it at a time when no timing window
  is owed, for example overnight, and holds every width-1 window until it ends.
- **The other tickets here do not make it stale.** `ABC-095` and `ABC-101` edit `src/cli.ts` and add a
  decorator or adapter. Neither touches the `PUZZLE_DEEP` engine trigger list, `src/levels.ts` or
  `src/virtual-clock.ts`. `ABC-024` adds test rows only.
- **`QE2-085-a`** (LOW, optional before the verdict; `ABC-085` page line 468) is still not built.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **⚠️** the 4.35x premise is unverified after `ABC-152`; the cited evidence says it is gone |
| 2 | scope and out-of-scope clear | ✅ |
| 3 | INVEST-shaped | ✅ (it is negotiable, and that is the question) |
| 4 | acceptance testable and measurable | ✅ after the amendments: `A1`'s base is a real commit; 180 of 180 |
| 5 | dependencies known | ✅ every named dependency is merged or accepted |
| 6 | security/NFR triggers with a measurable target | ✅ |
| 7 | test notes present | ✅ |
| 8 | size assigned | ✅ `XS` on either route |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | **⚠️** the route needs the owner's word |

## Amendment — 2026-10-17: the owner's route, "Re-measure, then vitest"

BA/PM (task `wave-2026-09-25`, subtask `bapm-cut-followups`), at `main` `1671f24f`. **No timing was read here.** The
facts below were re-read at `1671f24f`. Notes: `.grugops/context/bapm-cut-followups/notes/`.

**The owner's word, 2026-10-12** (transcribed in `.grugops/context/wave-2026-09-25/notes/…owner-word-2026-10-12-backlog-rescore-19019ec0`,
not a stamp): *"Re-measure, then vitest (Recommended)": one paired re-measurement of the factor first; if the in-vitest run
(`LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`) fits the accepted 7–13 h band, the verdict runs there with no new
code; otherwise fall back to plain node as accepted.* This answers the 2026-10-12 owner question above. The ticket now has
two routes, and `A0` picks one. The title and the sections above describe route N; they stand for that route.

**Re-read at `1671f24f`.**
- `src/ladder.test.ts` is byte-identical to `1031911b` (md5 `bba67b75565b4f4a2e8d231e8bcd6b2e`). `src/levels.ts` and
  `src/virtual-clock.ts` are unchanged since `1031911b`. The only engine-path commit since then is `ABC-083`'s
  (`79248602`, merged `f00038ef`), which is the tree the verdict is for.
- `f00038ef` (`ABC-083`) and `7a920ca5` (`ABC-152`) are ancestors of `1671f24f`.
- `LADDER_DEEP=verdict` is accepted inside vitest today (`src/ladder.test.ts:70`), and the deep rows carry no wall
  timeout (`:552-556`). `vitest.config.ts` holds `maxWorkers: 2` and `experimental: { viteModuleRunner: false }`
  (`:107-108`). vitest `~4.1.11`, node `v26.11.1`.

### `A0` (new): the paired factor reading, then the route

- **`A0` (the factor, pre-registered, counts first).** **Given** this ticket's branch point on `main` (it contains
  `f00038ef` and `7a920ca5`), **when** `chooseMove(start, 4 000 ms, virtualClock(120))` (the workload of the 4.35x
  reading, `ticket-to-pr-ABC-085/notes/…70684a78`) runs **5 times under plain `node` and 5 times inside vitest with
  the repository's own config**, as 5 interleaved pairs, **at width 1** (no other hop and no other lane running),
  **then** the record states:
  - the node count of each of the 10 runs. **They must all be equal**; if they are not, the reading is void and is
    re-taken, never graded;
  - each pair's ratio (vitest wall ÷ node wall), their median `F`, and their largest `F_hi`;
  - load1, the thermal state, and the node and vitest versions.

  The workload, `n = 5` and the route rule below are committed before the first run. Security/NFR takes the reading
  (the 2026-10-12 re-score's route (a)); the Orchestrator schedules the window.
- **The route rule.** The plain-`node` verdict was accepted at **~10 h (7–13)**. The in-vitest projection is
  10 h × `F_hi`.
  - **Route V (vitest)** when 10 h × `F_hi` **≤ 13 h**, that is `F_hi` ≤ **1.30**.
  - **Route N (plain `node`)** otherwise. The page above stands as written for that route.
  - *Reading stated, not silent (coding rule 1):* "fits the band" is read as the band's upper end against the worst
    of the 5 pairs. A reading on the median `F` would pick route V more often. If the owner means the median, he says
    so and the rule changes before `A0` runs, not after.
- **Staleness of `A0`.** A merge that changes `vitest.config.ts`, the vitest or node version, or the `PUZZLE_DEEP`
  engine trigger list before the verdict starts makes `A0` stale. It is re-taken.

### What each route keeps

| criterion | route V (vitest) | route N (plain `node`) |
|---|---|---|
| Scope 1–4, `A1`–`A4` | **cancelled**: no code is moved or written | as written above |
| `A5` (the verdict) | as written, with the command `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`, run directly and never through `npm test` (its 60 s bound would end it). The report adds the runner and its version, read with `npx vitest --version` and `node --version` | as written above |
| `A6` (fences, manners) | **0 changed lines in the whole repository outside records**: `git diff --name-only <base> -- src/ tools/ vitest.config.ts package.json` is empty. The serial-run and window rules stand | as written above |
| `A7` (new, below) | owed | owed |

**On route V, if the vitest run exits non-zero before 180 of 180 games terminate and replay** (a crash, not a red
score), no score is quoted from it. The owner's word does not cover that case, so the Orchestrator takes it to the
owner with route N named as the next step.

### `A7` (new): the ADR says what ran

Folded here from the Orchestrator's follow-up list (item 13 of `bapm-cut-followups`), instead of a ticket of its own.
- **`A7`.** **Given** the route `A0` picked, **before any verdict number is quoted**, **then**:
  - `ADR-0038`'s addendum headings no longer say PROPOSED. At `1671f24f`, `:196` reads "ADDENDUM 2026-10-11 (PROPOSED;
    owner acceptance owed)" and `:235` reads "Decision 5, amended (PROPOSED)", although § Status `:12` records the
    addendum ACCEPTED on 2026-10-11. Check: `grep -nE '^#+ .*PROPOSED'` over the ADR prints nothing;
  - **on route V**, a dated second addendum states that the verdict ran inside vitest, and cites `A0`'s reading.
  - Owner: **Architect/Design** (the ADR's owner). The edit is records only.

### Size, priority, DoR

**`XS` on either route** (route V: one reading and one run; route N: unchanged). **`P1`, inherited, unchanged.**

**Re-score: 10 of 10** (from 8 of 10 on 2026-10-12).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the premise is now measured by `A0` before any route is built, and the rule that reads it is fixed in advance |
| 2 | scope and out-of-scope clear | ✅ per route, in the table above |
| 3 | INVEST-shaped | ✅ the negotiation is settled by the owner's word |
| 4 | acceptance testable and measurable | ✅ `A0`: equal node counts, `F_hi` ≤ 1.30 or not; `A5` 180 of 180; `A7` a grep that prints nothing |
| 5 | dependencies known | ✅ `ABC-083` and `ABC-152` are on `main`; the reading needs a width-1 window, which is scheduling |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged; `A0` is the one timing reading, at width 1 |
| 7 | test notes present | ✅ five above; test note 3 applies to route N only |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | ✅ the route is the owner's, and he has given it |

**Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.

### A5 reading, 2026-10-19 (ABC-166 run 2; Orchestrator)

Run 2 (`raw/verdict-run2.out.txt`, commit `d73c4d6c`) passed 17/17, with 5 pair lines and 180 game lines. ABC-166 A2 holds. The full reading and the figure-by-figure citations are in `.grugops/context/abc146-verdict/notes/…4c1d8e27`.

- **ABC-085 A1:** 1v5 100/100, **MET**.
- **ABC-085 A2:**
  - 3v4 6.5/20 (32.5 %), **RED**;
  - 4v5 10/20 (50 %), **RED**;
  - 2v3 20/20, MET;
  - 1v2 18/20, MET.
- **Digests:**
  - 1v5 `c984a0c9a380b064`;
  - 3v4 `9667ad6328f603ab`;
  - 4v5 `57d6676d5d9090e4`;
  - 2v3 `bcbbdf2b129dd4e0`;
  - 1v2 `324e957853bfa9f3`.
- **Wall:** 40 823 s on a shared host.
- **Next:** the REDs go to ABC-087, as real scores rather than delivery defects.
