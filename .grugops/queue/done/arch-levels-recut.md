---
subtask: arch-levels-recut
role: architect-design
tickets: [ABC-087, ABC-085]
branch: grugops/arch-levels-recut (from main, current tip)
worktree: ../wt-arch-levels-recut
ref: .grugops/context/arch-levels-recut/
---

# Re-cut the difficulty levels so neighbours separate (owner word `…b2e6d4a9`, ADR-0038 menu (b))

**The finding**, from ABC-146's verdict (`.grugops/context/abc146-verdict/notes/…4c1d8e27`), step 4, seeds 1..10:
- **3v4:** 6.5/20 (RED).
- **4v5:** 10/20 (RED), with 22 claimed threefold draws between the two pairs.
- 2v3 and 1v2 are MET, and 1v5 is 100/100.

**The cause** was predicted in ABC-085 § Dependencies, "Named risk to A2":
- `LEVELS` 3/4/5 are 3000/4000/4500 ms, all at blunder rate 0.
- NFR-004's 5 s ceiling allows at most 1.67x.
- One ply costs about 3x.

## Design a new `LEVELS` table
Write it as an ADR, either new or superseding, PROPOSED and for the owner to accept. Each adjacent pair must have a credible path to > 50 % at step 4.

Constraints:
- NFR-004's 5 s hard ceiling.
- `DEFAULT_LEVEL` 3 is `DEFAULT_BUDGET_MS` today, so say whether it moves.
- UCI `Skill Level` 1–5 (ADR-0044 D11, ABC-171, delivered on the branch, not merged) maps onto the same table.
- ABC-087's mechanism stays as it is: a budget plus a blunder rate, with seeded draws.
- Levels are data.

Consider at least these levers:
- spreading budgets downward (fewer plies at the low end);
- small blunder rates at levels 3 and 4;
- a depth cap via `maxDepth` (ABC-170, now on main);
- node caps.

Give each option's predicted effect and evidence. Cheap virtual-clock probes on scratch copies are fine, for example depth reached per level on the A0 positions. Pick one, and state what it costs the default player's experience.

## The re-measure plan
- Which pairs re-run, which seeds, and the expected wall time.
- Whether the full 180-game verdict is needed or only the changed pairs.
- How it stays within ABC-146's staleness rule.

## Fences
- **Records only.** Do not touch `src/` (scratch copies only), `plans/board.md` or `plans/traceability.md`.
- **No timing readings:** virtual clock only, and no wall-clock lane runs.
- Never push, never merge.
- Commit on `grugops/arch-levels-recut`: `git worktree add ../wt-arch-levels-recut -b grugops/arch-levels-recut main`.

## Handoff
Write `.grugops/queue/done/arch-levels-recut.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit;
- the ADR id;
- the proposed table;
- the options weighed;
- the re-measure plan;
- the owner questions;
- the ticket shape BA/PM should cut, to become ABC-173;
- a trace row.

---

## Result (architect-design, 2026-10-19)

- **Commit:** `e9dd5e87` on `grugops/arch-levels-recut` (parent `398603fa`), in `../wt-arch-levels-recut`. Not pushed, not merged.
  16 files, +1453. **0 lines under `src/`**. `plans/board.md` and `plans/traceability.md` are untouched.
- **ADR:** **ADR-0045, PROPOSED**, at
  `memory-bank/50-decisions/ADR-0045-the-levels-are-re-cut-to-one-ply-and-a-halved-blunder-rate-per-step-and-the-default-moves-to-level-5-where-it-plays-as-today.md`.
  Owner acceptance is owed.
- **Notes**, under `.grugops/context/arch-levels-recut/notes/`, all hand-authored and `sealed: false`:
  - observation `…5804b43d`: the probe readings;
  - decision `…6b458088`: ADR-0045;
  - artifact-ref `…431546f7`.
- **Probe:** `.grugops/context/arch-levels-recut/probe/`, which holds `RUN.txt`, the scripts and `raw/`.

### The proposed table (D1, D2)

| level | budgetMs | blunderRate | was |
|---:|---:|---:|---|
| 1 | 100 | 0.4 | unchanged |
| 2 | 180 | 0.2 | 500 / 0.2 |
| 3 | 330 | 0.1 | 3 000 / 0 (old default) |
| 4 | 1 000 | 0.05 | 4 000 / 0 |
| 5 (hardest, **DEFAULT**) | 3 000 | 0 | 4 500 / 0 |

- **`DEFAULT_LEVEL` moves from 3 to 5, which is `HARDEST_LEVEL`.** `DEFAULT_DIFFICULTY` follows it.
- **`DEFAULT_BUDGET_MS` stays 3 000.** `LEVELS[DEFAULT_LEVEL]` is still `{ DEFAULT_BUDGET_MS, 0 }`, which is today's level 3 exactly.
- **The mechanism is unchanged:** a `Level` is still `{ budgetMs, blunderRate }`, with no depth or node field.
- **UCI:** `Skill Level` defaults to `DEFAULT_LEVEL` (5). Levels 3 and 4 now take D11's `createLevel` path.
- **The cost to the default player is none in play.** A no-flag game and a GUI default play the same moves as today. What changes:
  - the default is now called the hardest, and nothing sits above it (in measured terms nothing does today either: level 4 scored
    32.5 % against level 3);
  - an explicit `--difficulty 3` is about 2.1 plies weaker than before, at 330 ms with 10 % blunders.

### The options weighed (evidence: virtual clock, step 4, 50 positions; 60 of 60 direct `chooseMove` calls match the sweep)

**The structural fact.** One ply costs 2.67x the clock reads (median). Over a 3 000 ms default, `NFR-004` leaves 1.67x, which buys
+0.36 ply. No blunder rate makes a level stronger than rate 0. So no level fits above a 3 s, rate-0 default.

Today's pairs barely separate:
- 3 000 v 4 000 completes a deeper iteration on 7 of 50 positions (+0.14 ply), and the move differs on 1;
- 4 000 v 4 500 does so on 3 of 50 (+0.06), and the move differs on 1.

Run 2's game lines show 4v5 playing the same game from both chairs.

| option | predicted effect (evidence) | ruling |
|---|---|---|
| **Chosen: the default at the top, with a ply-and-rate ladder** | 4v5: 49/50 deeper (+1.08), rate 0.05 → 0. 3v4: 49/50 (+1.06), 0.1 → 0.05. 2v3: 30/50 (+0.64), 0.2 → 0.1. 1v2: 39/50 (+0.82), 0.4 → 0.2. 1v5: 50/50 (+3.6). A blunder costs a median 71 cp (≥ 100 cp on 12–16 of 50). Published: one ply is about 62–80 % (Heinz 84–115 Elo at 9–12 plies; Thompson ~80 % at 3–8). | **PICKED** |
| (a) Spread the budgets downward and keep the default at 3 (100/0.4, 220/0.2, 500/0, 1 500/0, 4 500/0) | Separates like the pick: 47/50 and 48/50 deeper. The default plays about 1.9 plies shallower at 0.5 s (median depth 8 → 6). It breaks `ABC-087` `A6`, `ABC-101` `A8′`, `NFR-005`'s referent and 3 pins. | runner-up (Q1) |
| (b) Small rates at 3 and 4 on today's budgets | The rate gap is the only separation (+0.14 and +0.06 ply). The default blunders on 10 % of its moves at a median 86 cp. The UCI default loses D12. | rejected |
| (c) A `maxDepth` cap per level | It can only weaken, so the same default question remains. A third field breaks the `Level` pin, `ABC-101` `A7`, `ADR-0038` d1 and `ABC-087` `A2`'s ±20 %. | rejected |
| (d) A `maxNodes` cap per level | On the virtual clock it is the budget dial twice, with no separating power. Same costs as (c). | rejected |
| (e) The default at 4, with 5 at 4 500 or 5 000 | Deeper on 10/50 or 18/50 (+0.20 or +0.36 ply). Predicted RED again. 5 000 also has no `A5` margin. | rejected |
| (f) Fewer levels; (g) menu (c) | Not asked for. The owner chose (b). | not taken |

### The re-measure plan (ADR-0045 D6)

- **The full 180-game verdict.** All five pairs contain a changed level, so no 2026-10-19 reading carries over.
- **The harness is unchanged:**
  - step 4;
  - seeds 1..10 in both colours for each `A2` pair (20 games), and 1..50 for 1v5 (100 games);
  - the same order, 3v4 and 4v5 first.
- **Route V:**
  `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`. The meta file should record the command.
- **The staleness rule:**
  - `ABC-173`'s merge touches `src/levels.ts`, which makes the old verdict STALE.
  - The re-take runs on a commit whose `src/` is byte-equal to what merges.
  - Any later merge that touches the trigger list, `levels.ts` or `virtual-clock.ts` makes the reading STALE.
  - `A0` stays current only if `vitest.config.ts`, node v26.11.1, vitest 4.1.11 and the `PUZZLE_DEEP` trigger list are unchanged since
    `eb216351`. `src/levels.ts` is not on that list.
  - The pre-flight is `ABC-166` `A1`'s form.
- **Expected wall: about 5.5 h, roughly 3.5–7.5 h. This is an estimate; nothing was timed.**
  - Per pair: 1v5 3.6 h, 4v5 1.3 h, 3v4 0.4 h, 2v3 0.15 h, 1v2 0.07 h.
  - It is computed from run 2's recorded wall per virtual-ms-ply (0.91–1.27) and its mean plies.
  - Run 2 took 11.3 h.
- **One pre-registered shot.** A RED goes to the owner, and no second table is tuned from the games.

### Owner questions

- **Q1.** Put the default at the top, which overturns `ABC-101` ruling 2? That ruling is reserved to the owner. Recommended: yes. The
  alternative is (a).
- **Q2.** Use rates of 0.1 and 0.05 at levels 3 and 4 (recommended), or 0? With 0, UCI keeps `go depth`/`nodes`/`mate` at skills 3 and
  4, but the pairs rest on one ply alone.
- **Q3.** Run the verdict on `ABC-173`'s QE-passed branch before the UAT word (recommended), or after the merge? Either way it is about
  5.5 h overnight, with width-1 windows held.

### The ticket shape for BA/PM, to become `ABC-173` (S, P1, EPIC-004; cut after the owner accepts ADR-0045)

- **Title:** "Re-cut the level table per ADR-0045 (data only); the default moves to level 5 and plays as today".
- **Scope:**
  - `src/levels.ts`: the `LEVELS` values, `DEFAULT_LEVEL` = 5, and the comments.
  - `src/cli-options.ts`: `DEFAULT_DIFFICULTY` = 5, and the comment.
  - `src/uci-session.ts`: the `Skill Level` `default` read from `DEFAULT_LEVEL`.
  - The pins that move:
    - `levels.test.ts:193`;
    - `cli.test.ts:3602`;
    - the `uci-session.test.ts` rows that pin level 3 at 3 000 (211–212, 284–285, 412, 448, 453, 719, 802 at `9ae31679`);
    - the `src/cli.ts` header line.
- **Out of scope:**
  - the mechanism (`createLevel`, `blunder`, `src/engine.ts`, `src/search.ts`, `src/virtual-clock.ts`);
  - `src/ladder.test.ts`;
  - the catalog text (Security/NFR);
  - `AGENTS.md` line 59 (the Scribe);
  - the verdict run.
- **Acceptance:**
  - **A1:** the table equals ADR-0045 D1. It is frozen, and the ordering row stays green.
  - **A2:** `[EASIEST, DEFAULT, HARDEST]` = `[1, 5, 5]`. `LEVELS[DEFAULT_LEVEL]` deep-equals `{ DEFAULT_BUDGET_MS, 0 }`, and
    `DEFAULT_DIFFICULTY === DEFAULT_LEVEL`.
  - **A3:** the default plays as today. On ≥ 30 positions on virtual clocks, the new level 5's move, depth and nodes equal
    `chooseMove` at 3 000, the old level 3. A no-flag CLI builds level 5.
  - **A4:** the mechanism is unchanged. `git diff --numstat` shows 0 lines in `src/engine.ts`, `src/search.ts` and
    `src/virtual-clock.ts`. The `Level` keys are still `[blunderRate, budgetMs]`. The `createLevel`/`blunder` bodies are byte-equal.
  - **A5:** UCI `uci` prints `option name Skill Level type spin default 5 min 1 max 5`. A bare `go` at the default searches 3 000 ms on
    the `chooseMove` path, with D12's limits. Skills 3 and 4 take the `createLevel` path, with the `info string`.
  - **A6, at QE:** `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` is green (`ABC-087` `A2`–`A5`, and `A3` easiest < default).
    `LADDER_DEEP=1` short mode holds `A3`/`A4`/`A5` only.
- **Dependencies:**
  - the owner's acceptance of ADR-0045;
  - **`ABC-171` merged first**, because the two share `src/uci-session.ts` and its tests.
- **Folds owed by BA/PM:**
  - `ABC-087` `A1` (default = 5);
  - `ABC-101` ruling 2, `A2` and `A8′`;
  - `ADR-0044` D11's `default 3`, which becomes `DEFAULT_LEVEL`;
  - `ABC-085`, so that the 2026-10-19 verdict is marked STALE on merge.
- **Recommended:** cut the re-take as its own `XS` companion, on the `ABC-146` precedent (suggested `ABC-174`), with D6 as its
  acceptance. A ~5.5 h run then does not hold a built ticket in a column. Whether to split is BA/PM's call.

### Trace row (for the Orchestrator to apply; not hand-edited here)

`| ABC-087 / ABC-085 A2 (re-cut) | ADR-0045 PROPOSED: LEVELS 100/0.4, 180/0.2, 330/0.1, 1000/0.05, 3000/0; DEFAULT_LEVEL 3→5 (= HARDEST, plays as today: LEVELS[5] = { DEFAULT_BUDGET_MS, 0 }); mechanism unchanged; re-measure = full 180-game verdict at step 4, route V, est. ~5.5 h; Architect/Design arch-levels-recut | EPIC-004 / EPIC-006 / EPIC-007 | ADR-0045 (amends on acceptance: ABC-101 ruling 2, ADR-0044 D11 default) | NFR-004 A unchanged, B clamp-only; NFR-005 referent unchanged; NFR-008 no new lane | records only; e9dd5e87 on grugops/arch-levels-recut; 0 lines in src/ | virtual-clock probes only (probe/RUN.txt; 60/60 sweep check), no wall timing | owner acceptance owed (Q1–Q3); ABC-173 to cut | notes …6b458088, …5804b43d, …431546f7 |`
