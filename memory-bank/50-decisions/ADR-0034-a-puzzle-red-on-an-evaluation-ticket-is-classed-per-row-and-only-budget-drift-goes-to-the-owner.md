---
kind: adr
id: ADR-0034
---
# ADR-0034: A `PUZZLE_DEEP` red on an evaluation ticket stays a QE FAIL and is classed row by row. Only budget drift goes to the owner, and a gating row should keep a 0.8x readings margin

## Status

**accepted** 2026-10-10 by the owner. Owner (Olger Oeselg), 2026-10-10, verbatim: *"accept ADR-0030, ADR-0031, ADR-0032, ADR-0034 with (b) at 0.8x"*

**READING 2026-10-10 (`design-owed-rulings-2026-10-10`).**
- Decision 2's "trigger-list file" means a matched file the shipped engine can load. The block under
  decision 2 has the details.
- The run trigger, the gate and the baseline do not change.

**Addendum 2026-10-11: ACCEPTED** 2026-10-11 by Olger Oeselg (owner), verbatim "ADR-0034 accepted" (Orchestrator transcription note `…fbbdde16`); previously proposed, owner acceptance owed. It adds one item to decision 4's list for an L
re-find: a clean-lead bar that sees an LMR near-tie. It moves no count, total, baseline, budget, trigger or
level. Decisions 1–6 stay **accepted** as written. See § Addendum 2026-10-11 at the end.

Was: **proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `ruling-puzzle-edge`). It answers
Security/NFR's required fix **`R1`** on `ABC-127` (decision `…2468e396`, PASS_WITH_RISKS). That fix is owed
before `ABC-083` enters `In Development`. **Owner acceptance owed.** No agent moves an ADR to `accepted`.

- **What is ruled and what is recommended.** Decisions 1–4 and 6 say how a red is read and where it goes.
  Architect/Design proposes them, as it proposed `ADR-0028`. Decision 5 is only a **recommendation**, because
  it lowers the recorded count, and a lowering is the owner's word (`ABC-084` `A7`).
- **Amends no ADR.** It reads `ADR-0028` onto the puzzle suite. It also composes with `ADR-0031` and
  `ADR-0032`, both still proposed (Consequences).
- **Unchanged, by constraint:**
  - the gate (`solved >= baseline`, and `total` equals the recorded total);
  - `src/puzzle-suite.baseline.json`;
  - option B's trigger list and its red rule (red = QE FAIL).
- **No code changes because of this ADR, and no deep lane was run at this hop.**
  - Readings are cited from Security/NFR (`secnfr-ABC-127`, `…6a3b6274`) and QE (`qe-ABC-127`, `…f5e127b9`).
    Both are on `grugops/ABC-127-harder-puzzles` @ `f063ebce`, which is not merged.
  - The new numbers are arithmetic over their committed per-row files:
    `.grugops/context/ruling-puzzle-edge/probe/classify.mjs` → `classify.out.txt`.

## Context

`ABC-127` re-recorded the suite at **58/62** (budget 25, step 1). Security/NFR measured its budget edge out of
tree:

| readings per move | solved | rows lost (all `depth≥5` mate-in-3) |
|---|---|---|
| 25 (recorded) | 58 | — |
| 24 (−4 %) | 57 | 1982 |
| 23 (−8 %) | 55 | + 1008, 1424 |
| 22 to 20 (−12 % to −20 %) | 54 | + 1075 |

- **Every other solved row is still solved at 0.8x readings.** At step 1.25 the loss is exactly these four rows.
- **In deterministic mode the budget is a node count** (`NODES_PER_CLOCK_CHECK` 1 024). So a term that makes the
  tree to depth 5 about 4 % bigger turns the gate red on 1982, without the term being wrong. A costlier node
  raises the wall. It never changes the count.
- **Five planted evaluation terms shaped like `ABC-083`: four go red.**
  - E1 (+10 cp tempo) loses 1008.
  - E4 loses 1982, and reads green again at +5 % readings.
  - E2 loses 1008, 1424, 1982 and two win-material rows.
  - E5 loses 1982 and two win-material rows.
  - E3 stays green.
- **`ADR-0028` gives such a red no route except the owner.**
  - Decision 3's ÷1.5 cannot be used: 58 / 1.5 = 39 turns 13 of the 15 red weakenings green.
  - 39 is also below `ABC-084`'s floor of 40.

**What the per-row lines show** (this hop, `classify.out.txt`). The runner prints move, completed depth and nodes
for every row. Against the base run, a missed row has one of two shapes:

- **Shallower: the row completes a smaller depth than on base.**
  - Search weakenings read this way. Every miss of `W3`, `W4`, `W5` and `W16` is shallower.
  - So does an evaluation sign bug: `W9` has 12 misses, all shallower, and it also reds `ABC-084` `A2`.
  - So does every planted mate-row miss (E1, E2, E4, E5: d5 → d4).
- **Same depth, different move.**
  - `W13` (LMR reduces checks) misses seeds 1, 69 and 1982 at d5, which is the depth that proves a mate in 3.
  - `W14` misses seed 1075 at its recorded d6, and `W12` does the same.
  - In each of these a forced mate inside the horizon was not played. That is behaviour, not budget.
  - `W1` (quiescence off) misses nine win-material rows at the same depth.
- **So depth alone cannot clear a red, because a shallower row is also what a broken search looks like.** Two
  things separate drift from a defect:
  - the diff touches no search code;
  - the row comes back when its readings come back.

*A correction to the cited note.* Security/NFR wrote that the win-material misses under E2 and E5 "sit at the
recorded d5". Three of the four do. Seed 5180 under E5 reads d5, against d6 on base.

## Decision

1. **The red stays a QE FAIL.** This ADR says only how the red is read and where it goes next. No gate, baseline,
   trigger or red rule changes.

2. **Scope: an evaluation-only diff.** Decisions 3 and 4 apply only when every trigger-list file the diff touches
   is `src/evaluate*.ts`, which is `ADR-0028` decision 6's scope.
   - A diff that touches any other trigger-list file has **no drift class here**. Every missed row is class B.
   - A not-a-defect argument for that diff goes through `ADR-0026` decision 10's oracle, not through this ADR.
   - The reason: `W3`–`W5` and `W16` read exactly like drift, and `W1` reads exactly like a label margin.

   > **[READING 2026-10-10 at task `wave-2026-09-25`, subtask `design-owed-rulings-2026-10-10`: what
   > "trigger-list file" means HERE. The run trigger is NOT changed.]**
   >
   > - **Raised by.** BA/PM at `owner-adrs-followups` (`…41693c28`, item 6) and `ABC-083`'s page. The
   >   globs `src/search*.ts` and `src/evaluate*.ts` also match test files and test-only fixture
   >   modules.
   > - **The list has two uses, and they read differently.**
   >   1. **The RUN trigger** is the owner's option B (`AGENTS.md`; `ABC-084`: "the globs are read
   >      literally"). A test-only change inside a glob triggers a run. **Unchanged.** Running too
   >      often costs ≤ 60 s and fails safe.
   >   2. **This decision's SCOPE test** decides whether a red can be given a drift class at all.
   >      Here a "trigger-list file" is a file the list matches **that the shipped engine can load**:
   >      it is not a `.test.ts`, and at `<head>` at least one non-`.test.ts` file under `src/`
   >      imports it.
   > - **Why the scope test reads only loadable files.** This decision exists because search
   >   weakenings read like drift. Only code the puzzle suite runs can weaken search. These cannot
   >   change a puzzle row's result:
   >   - a test file;
   >   - a test-only fixture. At `37ca6ae2` these are `src/search.mate-corpus.ts` and
   >     `src/evaluate.mirror-corpus.ts`, and only tests import them.
   > - **The instrument:**
   >
   >   ```sh
   >   git diff --name-only "$B" "$H" \
   >     | grep -E '^src/(engine\.ts|search[^/]*\.ts|evaluate[^/]*\.ts|quiescence\.ts|transposition\.ts)$' \
   >     | grep -v '\.test\.ts$' \
   >     | while read -r f; do n=$(basename "$f")
   >         git grep -lF "\"./$n\"" "$H" -- 'src/*.ts' ':!src/*.test.ts' | grep -q . && echo "$f"; done
   >   ```
   >
   >   Decisions 3 and 4 apply only if every printed line is `src/evaluate*.ts`.
   > - **Measured.**
   >
   >   | merge | read literally | read here | result |
   >   |---|---|---|---|
   >   | `ABC-082` (`3858e3c`) | 6 files, including `src/search.ordering.test.ts` and `src/search.pvs-lmr.test.ts` | **`src/evaluate.ts` only** | literally, every row would be B; read here, D and L stay available |
   >   | `ABC-121` (`5b5a0a36`), control | — | `src/engine.ts`, `src/search.ts` | still all B, as decision 2 intends |
   >   | `ABC-079` (`4a79c812`), control | — | `src/engine.ts`, `src/quiescence.ts`, `src/search.ts` | still all B, as decision 2 intends |
   >
   >   So `ABC-083` `A10`'s re-pins of search test files do not remove the drift class.
   > - **Bound.** A new production file under a glob counts as soon as anything imports it. A file
   >   nothing imports is not loaded, so it cannot move a row.

3. **QE classes every `NEWLY-MISSED` row.** All the inputs are deterministic, so no load gate is needed:
   - **Side by side:** the per-row lines of the branch run and of a run at the ticket's base commit.
   - **The readings ladder, run out of tree only.**
     - Copy the branch's `src/` and change only `stepMs` in the copied baseline file. This is Security/NFR's
       sweep method. The tree and the real baseline are never touched.
     - Re-run the gate row at **+5 %, +10 % and +25 % readings** (`stepMs` ÷ 1.05, ÷ 1.1 and ÷ 1.25). Each run
       takes about 20 s.

   | class | the row on the ladder | read as | route |
   |---|---|---|---|
   | **D: budget drift** | Solved (an accepted move, depth ≥ base's) at some rung up to +25 %. The first rung that solves it is the reported growth bound | The tree grew past the row's margin | **The owner** (decision 4) |
   | **L: label margin** | A `win-material` or `do-not-hang` row, still missed at +25 %, at depth ≥ base's | The evaluation prefers another move. The row's label carries an evaluator margin ("≥ 2 pawns behind" on material alone; a losing capture) | **`ADR-0028` decisions 1 and 2:** prove not-a-defect, then re-find the fixture. No owner word |
   | **B: behaviour** | Anything else. Either a `mate-in-N` row still missed at +25 % at depth ≥ base's, or any row that does not reach base's depth by +25 % | A defect, until shown otherwise | **The Engineer**, under `ADR-0028` decision 1 |

   - **Another `PUZZLE_DEEP` row red** (`ABC-084` `A1`/`A2`, or `ABC-127`'s oracle rows) makes the whole red
     B.
   - **A red with mixed classes is worked in order: B, then L, then D.** B rows are fixed first. L rows are
     re-found next. Only the D rows that remain go to the owner.
   - **A B row cleared by `ADR-0028` decision 1's three proofs is read again.** A label row goes to L. Any other
     row goes to the owner as a depth cost, the same as D.
   - **A green run uses the same table** (QE-127-d's practice). A B row on a green run is a QE finding, even
     though the count is green.

4. **D goes to the owner, and the agent route ends at the evidence.** Every remedy for drift moves the recorded
   count, the corpus or the budget. Each of those is his word (`ABC-084` `A7`, `ADR-0028` decision 5).
   - **The evidence.** QE fails the ticket, and the Orchestrator puts the D rows to the owner. For each D row,
     QE's FAIL note carries:
     - the base and branch lines (move, depth, nodes);
     - the rung that solved the row.

     On `ABC-083` the note also carries `A9`'s clock-free nodes to depth 7 and `A7`'s depth reading. Drift is the
     per-row view of the same tree growth, so the owner rules both together.
   - **Not routes for D:**
     - re-weighting (`ADR-0028` Alternatives; `ABC-083` `A9`: "do not tune around it");
     - cutting a term (decision 6);
     - re-finding a mate row. Its label is exact by the rules, and only its budget moved.
   - **How `ADR-0028` decision 2 reads on this suite, for L.** The re-found row:
     - keeps its class and tags (`quiescence` and `depth≥5` are re-measured with `A3`'s `W1` and `W5`);
     - takes its answer from the oracle (`ABC-127` `A2`'s deep oracle row re-proves it);
     - is solved on both base and branch, and meets decision 5's margin on base;
     - lands in **its own commit**, which touches no trigger-list file and not the baseline file.

     The count and the total do not change, so the baseline does not move. Architect/Design rules the re-find,
     as `ADR-0028` ruling 1 did.

5. **Recommended to the owner (his word): option (b), re-cut for margin, before `ABC-083` enters
   `In Development`.**
   - **The margin rule.** A row counts toward the gate only if the shipped engine solves it at **0.8x the
     recorded readings** (step × 1.25). Later rows meet it too, including rows `ABC-126` re-finds.
   - **Applied today:**
     - Drop seeds **1982, 1008, 1424 and 1075** from `PUZZLES`.
     - The baseline becomes **54/58**, re-recorded in its own commit that cites his word.
     - `unsolved` (the four headroom rows) is unchanged, so `solved = total − 4` still holds.
   - **What it buys.** These figures are computed, and stay `UNKNOWN - verify` until a re-run on the re-cut
     build. The computation is sound because rows are independent: each move gets a fresh clock, and the table
     is cleared per search.
     - Every planted term loses its D rows. E1, E3 and E4 read green.
     - E2 (53) and E5 (52) stay red, on two win-material rows each. Three of those four miss at base depth, so
       they are most likely L, which is an agent route.
     - Every retained row tolerates about 25 % tree growth. `ABC-082`, the one real evaluation term measured
       here, grew `kiwipete`'s nodes to depth 7 by 14.6 % (532 363 → 610 179).
     - A D red after the re-cut therefore means more than 25 % growth on some row. That is a reading worth the
       owner's time, not a false alarm.
   - **What it costs** (computed from QE's 17 `a3/*.rows.txt`):
     - **`A3` reads 14/17 red, down from 15/17.** **`W14` survives again**, because both of its rows are
       dropped.
     - The required weakenings stay red: `W1` 43, `W1b` 41, `W4` 44 and `W5` 48, all against 54.
     - The optional ones stay red: `W2` 50, `W13` 52 (on seeds 1 and 69) and `W16` 47. So `ABC-127` `A3`'s
       "≥ 2 optional" still holds.
     - `A1`'s counts hold: mate-in-3 goes 12 → 8 (≥ 6), quiet-key 14 → 11 (≥ 4), `depth≥5` 10 → 6 (≥ 4), and
       `quiescence` stays 11.
   - **Shape.** BA/PM cuts an `XS` follow-up after `ABC-127` merges.
     - `ABC-127` as built meets its page. Re-opening it would restart its gate.
     - The follow-up is ordered against `ABC-126`, which edits the same file.
   - **If he declines (b):**
     - decisions 1–4 still stand;
     - D reds reach him on each evaluation ticket, with growth bounds as small as 5 %;
     - `AR-PUZZLE-EDGE` is his risk, accepted in his own words.

6. **A puzzle red is not a cut trigger and not a level.**
   - It never fires `ADR-0031`'s mobility cut. That cut fires on `A5`, and on `A9` if the owner answers R2 by
     keeping depth 7.
   - It never licenses re-weighting.
   - It never moves an `NFR` level.

## Alternatives

- **(a) alone, with every red going to the owner. Rejected as the default; kept as the route for D.**
  - On the current corpus it makes an owner stop the expected result of every evaluation ticket (Security/NFR
    item 5).
  - Each answer he can give lowers the count one row at a time, with no margin rule. So the suite thins out with
    no stated reason for which rows go.
  - Its +5 % / +10 % re-run cannot separate the classes on its own. E1's harmless tempo term still misses 1008
    at +11 %. Decision 3 adds the +25 % rung and the depth reading.
- **(b) at 0.9x: drop 1982, 1008 and 1424, and keep 1075. Not recommended; the owner may prefer it.**
  - The baseline becomes 55/59, and `W14` stays red: 1075 at its recorded d6 is a behaviour catch.
  - The cost is margin. 1075 fails at 0.87x readings, so it tolerates only 10–15 % growth. That is at or below
    the 14.6 % `ABC-082` measured.
  - No planted term reached 1075. Keeping it is a judgment, not a measurement.
- **(c) Raise the budget 10–15 % (25 → 28). Rejected.**
  - It moves the edge instead of removing it. The thinnest row (1982) would tolerate 12–18 %, against (b)'s
    25 %.
  - It costs about +12 % wall at every QE run, permanently.
  - It may solve a headroom row (`A4`'s "≥ 3 unsolved" is `UNKNOWN - verify`), and it may turn `W13`/`W14`
    green.
  - It also needs the owner's word.
- **Keep the four rows as a printed tier outside the count. Rejected (coding rule 7).** It needs a runner change
  and a baseline schema change, to keep a reading that nothing gates on.
- **Send L rows to the owner too. Rejected.** `ADR-0028` decision 2 (accepted) already rules rows whose label
  carries an evaluator margin, and its decision 6 names `ABC-083`.
- **Classify by depth alone (shallower = drift). Rejected.** `W3`, `W4`, `W5`, `W9` and `W16` miss only
  shallower rows.
- **`ADR-0028` decision 3's ÷1.5. Not applicable** (see Context).

## Consequences

- **`ABC-083`** gets a route for a puzzle red. QE pays about two minutes per red: one base run, plus three
  gate-row rungs at about 20 s each. The counts do not depend on load.
- **`ADR-0031` (proposed).**
  - `A5` (the cost per evaluation) bounds the suite's wall (`RR-PUZZLE-GUARD-COST`). It never bounds the count,
    so `A5` holding is no protection against drift.
  - If the cut fires, the table is applied to the build that ships (king safety alone).
  - Decision 6 keeps a puzzle red out of the cut order.
- **`ADR-0032` (proposed).**
  - Under it, the blunder spends its nodes in separate `chooseMove` calls on the children, from the level
    module. `src/engine.ts` and `src/search.ts` do not change, and the suite calls the shipped `chooseMove`. So
    Security/NFR's "−4 % → red" mechanism does not reach the gate through `ABC-087`.
  - The page names no file for the level module. Whether that file falls under a trigger glob is
    `UNKNOWN - verify`. If it does not, option B does not run for `ABC-087`.
  - `ABC-087` `A3` reads the suite as a measurement, not as the gate.
  - If the owner chose a widened root window instead, that is a search change. Decision 2 would then make every
    missed row class B.
- **`ADR-0028`.**
  - Decisions 1, 2, 5 and 6 are reused as they stand.
  - Decision 3 does not apply to this count. Here, decision 5's margin rule does the work its headroom does.
- **Stale page text, for BA/PM (not edited here).** These predate `ABC-127` (58/62, or 54/58 if (b) is taken):
  - `ABC-083` `A10`: "puzzle suite reads 40/40";
  - `ABC-087` `A3`: "(40/40) is not touched".
- **Security/NFR, for `plans/nfr-catalog.md` under `RISK-003`.** It proposed a "count gate records its budget
  margin" rule (`…2468e396`). If this ADR is accepted, the 0.8x figure and the class table are the inputs. The
  wording is Security/NFR's.

## Rollback

Edit this file. Nothing is built on it. If decision 5 is taken, undo it by restoring the four rows and
re-recording 58/62 in its own commit. That is a raise, so it is QE's to make.

## ADDENDUM 2026-10-11 (ACCEPTED 2026-10-11 by the owner, note `…fbbdde16`): a re-found L row must also clear a clean-lead bar at its solving depth ± 1. QE-083-c's screen names two thin rows and cuts none

Proposed by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-083-refind-5061`). Readings:
`.grugops/context/design-ABC-083-refind-5061/` (ruling `…8205516a`, screen `…3777f413`, this addendum
`…d95b51f2`).

### Context (this addendum)

- **Seed 5061 on `ABC-083` is class L by decision 3's table, but the table's "read as" is false for it**
  (QE `…b631991b`). The branch's evaluator ranks the label's `f5e6` first in every LMR-off search.
  `chooseMove`'s LMR iteration at d5 over-scores `g2e1` and lands it 5 cp above `f5e6`. With LMR off, the
  gap is 55 cp. That over-score is within `ADR-0026` decision 9's drift. Base's fixed-depth `search()` at d5
  already flipped the row.
- **Decision 4's re-find list cannot see this, and decision 5's margin cannot either (QE-083-c).** Seed 5061
  met both on base: it was solved at 0.8x readings, and its oracle and tags held. The 0.8x margin measures
  readings. It does not measure whether the chosen move is stable once LMR is on.

### Decision (this addendum)

1. **A re-found L row also meets a clean-lead bar, on base and on the branch.**
   - Let d be the depth the suite's call (`chooseMove`, recorded budget and step) completes on that tree.
   - At d − 1, d and d + 1, search every root move's child with `searchWithoutReductions` at one ply less,
     and negate the score.
   - The best accepted move must lead the best other move by **more than 75 cp**. That is `ADR-0026`
     decision 9's ceiling: LMR's accepted drift cannot close a lead that is larger than its own bound.
     *(Pointer 2026-10-24, `OD-205-2`: that ceiling is now 118 cp, `ADR-0026` § Proposed amendment 2026-10-24,
     accepted. So this bar reads 118 cp for later L re-finds only. Decision 2's screen and retained rows do not
     change.)*
   - **2026-10-26: accepted, not in force on `main`.** The pointer's 118 cp rode only `ABC-205`'s branch, which
     closed unmerged (`grugops/ABC-205-final` `b5d5cea5`). On `main` (`08b44f94`), the two `ABC-121` d5 drift
     rows still assert ≤ 75 cp, through one shared literal in `src/search.pvs-lmr.test.ts`; `ADR-0026` decision
     9 carries the same dated line. For this bar a larger ceiling is the stricter reading, the reverse of
     `ADR-0026` d9. This line moves no bound. Recorded by Architect/Design (task `arch-records-housekeeping`).
   - At d, fixed-depth `search()` and the suite's call must both play an accepted move.
   - **Why ± 1:** an evaluation term moves the solving depth by one ply (decision 3's shallower class). Seed
     1917 is the case. It leads by 195 cp at d5, but only by 20 cp at d6.
   - Applied first at `b29c837c`: seed 5061 was replaced by seed 5147, from `ABC-127`'s own pool. Its leads
     at d4/d5/d6 are 270/280/280 cp on base and 282/280/285 cp on the branch. Seed 5061 read 105 cp on base
     and 50 cp on the branch at d5.
2. **The 0.8x margin rule (decision 5, the owner's word) is unchanged. No retained row is cut or re-found
   because of this screen.**
   - Every `win-material` row was screened at d (`…3777f413`). All read above 75 cp except two:
     - seed 1700: 75 cp on base and 75 cp on the branch;
     - seed 5180: 120 cp on base and 77 cp on the branch.
   - Both rows are solved on both trees. They are named here, and nothing changes.
   - If a later ticket misses either row, it is class L, and decision 1 of this addendum governs the
     re-find. This follows how `ADR-0028` named its four dead-draw pairs.
3. **Whose word.**
   - The re-find at `b29c837c` does not wait on this addendum. It stands on decision 4 as written
     ("Architect/Design rules the re-find") and on `ADR-0028` decision 5 (a fixture re-find needs no owner
     word).
   - Accepting this addendum makes decision 1 here the standing bar for later L re-finds. Until then, it is
     this hop's ruling for seed 5061 only.

### Alternatives (this addendum)

- **QE's bar at d only. Not adopted.** Seed 1917 passes it at d5 (195 cp) and is a 20 cp near-tie at d6.
- **Screen and cut every retained row under the bar now. Rejected.** That changes decision 5's margin rule,
  which is the owner's word. It would also cut seed 1700, which every tree solves. The cut would trade one
  red for a thinner suite (coding rule 5).
- **Choose the replacement by "the suite's call solves it" alone. Rejected.** That is how seed 5061 was
  chosen.
- **Raise the bar to 150 cp. Not adopted.** No reading ties 75 cp to a miss beyond `ADR-0026` decision 9's
  own bound, and a higher bar would choose rows by how easy they are.

### Consequences (this addendum)

- An L re-find costs one more probe run per tree (`probe/screen.mjs`, then `probe/focus.mjs`). Its wall time
  was not measured: `UNKNOWN - verify`. Node counts are deterministic, so load does not change the result.
- Seed 1700's `quiescence` tag no longer reads on the branch (`W1` plays `g6h6` and solves the row). Tags
  are recorded measurements (`ABC-127` `A3`) and are not asserted. This is named for QE, and nothing changes.

### Rollback (this addendum)

Delete this section and the Status line that points to it. `b29c837c` is not affected.
