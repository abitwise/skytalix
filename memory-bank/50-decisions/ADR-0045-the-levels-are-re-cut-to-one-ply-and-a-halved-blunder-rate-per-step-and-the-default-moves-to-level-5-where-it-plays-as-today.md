---
kind: adr
id: ADR-0045
---
# ADR-0045: The levels are re-cut so that each step is about one ply and a halved blunder rate. The default moves to level 5, where it plays exactly as level 3 plays today. The mechanism does not change

## Status

**accepted** 2026-10-19 by Olger Oeselg (owner), as proposed. The owner's menu answers, verbatim (note
`.grugops/context/wave-2026-09-25/notes/20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42.md`,
a transcription, not a stamp):
- **Q1:** "Default = level 5 (Recommended)". D1 and D2 stand. This overturns `ABC-101` ruling 2, which was his to
  overturn.
- **Q2:** "Yes, 0.1 / 0.05 (Recommended)". The rates at levels 3 and 4 stand.
- **Q3:** "Verdict before UAT; add rows (Recommended)". D6.4's recommended tree stands: the re-take runs on the build's
  QE-passed branch, overnight at width 1, before his UAT word.

Recorded by BA/PM (task `wave-2026-09-25`, subtask `bapm-adr0045-cut`). This hop ran nothing and timed nothing.

- **Id correction (fold line).** `ABC-173` was already taken when this ADR was written: it is the vitest cap ticket
  (owner word `…c4a8e1f6`). **Every `ABC-173` in this ADR that names the re-cut build reads `ABC-174`.** The re-take
  of D6 is its own `XS` ticket, **`ABC-175`**. The body below is kept as written.
- **Folds made at acceptance (BA/PM, 2026-10-19):** `ABC-087` `A1`; `ABC-101` ruling 2, `A2` and `A8′`;
  `ADR-0044` D11's `default 3` (and D3's option line); and an `ABC-085` § Dependencies line marking the 2026-10-19
  verdict STALE on `ABC-174`'s merge. Each page carries a dated fold line. The folds are records. The code they
  describe changes only at `ABC-174`'s merge.
- **Routed, not edited here:**
  - `AGENTS.md` line 59 ("level 3 (≤3 s/move)") → **the Scribe**, within the 24 576 B budget, landing with
    `ABC-174`;
  - the `plans/nfr-catalog.md` `NFR-004` lines that name the old table: `AR-NFR004-A`'s "level 3 =
    `DEFAULT_BUDGET_MS`" (now level 5), and `:1364`'s "Levels 4 and 5 (4 000 / 4 500 ms)" (now 1 000 / 0.05 and
    3 000 / 0, and the hardest level of `ABC-087` `A5` reads at 3 000 ms) → **Security/NFR**, at `ABC-174`'s gate.

Previously **proposed** 2026-10-19 by Architect/Design (task `wave-2026-09-25`, subtask `arch-levels-recut`). The owner's word of
2026-10-19 asked for it: ADR-0038 owner menu (b), *"Re-cut the levels (Recommended)"* (note
`.grugops/context/wave-2026-09-25/notes/20261019T111500Z-orchestrator-decision-owner-word-abc087-recut-levels-b2e6d4a9.md`).
~~**Owner acceptance owed.** No agent moves an ADR to `accepted`. Nothing is built because of this ADR until it is
accepted and BA/PM cuts `ABC-173` (§ Consequences).~~ *(Met 2026-10-19: accepted above; the build is `ABC-174`.)*

- **What it amends on acceptance, each named:**
  - `ABC-101` ruling 2, "the default is `3` — the middle, NOT the strongest". The page reserves this to the
    owner: *"it is the owner's to overturn"*.
  - `ADR-0044` D11's `default 3`, which becomes `DEFAULT_LEVEL`, now 5.
  - `ABC-087` `A1`'s vocabulary "default = `3`".
- **What it does not amend:**
  - `ADR-0032`: the blunder construction.
  - `ADR-0027`: the seed reaches the draw only.
  - `ADR-0038` decisions 1–6: one step per run, budgets passed verbatim, step 4 for the verdict, and the
    staleness rule.
  - `ABC-087`'s mechanism: a level is a budget plus a blunder rate, with seeded draws.
  - `NFR-004` and `NFR-005` as written (§ Consequences).
- **Evidence.** The readings are in `.grugops/context/arch-levels-recut/probe/` (`RUN.txt`, `raw/`). The probes
  ran on the virtual clock only. No wall-clock figure was taken.

## Context

**The finding.** `ABC-146`'s verdict (`.grugops/context/abc146-verdict/notes/…4c1d8e27`) was taken at step 4, seeds
1..10:
- 3v4 scored 6.5/20 (RED);
- 4v5 scored 10/20 (RED);
- 2v3 scored 20/20 and 1v2 scored 18/20 (both MET);
- 1v5 scored 100/100 (`A1` MET).

The two RED pairs ended 22 of their 40 games in a claimed threefold repetition.

**The cause, read from run 2's own game lines.** 4v5 plays the same game from both chairs. Seed 5, for example,
is 53 plies and a white win both ways round, and so is seed 4's threefold draw at 82 plies. The two levels are one
engine. This is the mechanism BA/PM predicted on `ABC-085` (§ Dependencies, "Named risk to `A2`"). Rate-0 levels
that complete the same depth play the same move: an aborted iteration is discarded, and the TT is cleared per
search.

**Measured at this hop** (main `398603fa`, step 4, BA/PM's 50-position set; `probe/RUN.txt`). Each count below
is out of 50 positions.

- **One more ply costs 2.67x the clock reads** (median; p25 2.30, p75 3.10, 148 samples). The ADR-0032 figure of
  "about 3x" holds on today's engine.
- **The budgets of today's top levels sit inside one ply.** "Deeper" counts the positions where the
  higher-budget level completes a deeper iteration than the lower-budget one.

| budgets (ms) | ratio | deeper | mean ply gain | move differs |
|---|---:|---:|---:|---:|
| 3 000 v 4 000 (today 3v4) | 1.33 | 7 | +0.14 | 1 |
| 4 000 v 4 500 (today 4v5) | 1.13 | 3 | +0.06 | 1 |
| 3 000 v 4 500 (today 3v5) | 1.50 | 10 | +0.20 | 2 |
| 3 000 v 5 000 (the ceiling) | 1.67 | 18 | +0.36 | 2 |
| 1 000 v 3 000 | 3.00 | 49 | +1.08 | 5 |
| 330 v 1 000 | 3.03 | 49 | +1.06 | 3 |
| 500 v 1 500 | 3.00 | 47 | +1.04 | 5 |
| 1 500 v 4 500 | 3.00 | 48 | +1.04 | 5 |

- The sweep's rule was checked against direct `chooseMove` calls: 60 of 60 agree on depth and move.

**The structural fact this design rests on.**
- Over a 3 000 ms default, `NFR-004`'s 5 s ceiling leaves at most 1.67x. That is less than one ply (2.67x),
  and the table above shows it buys +0.36 ply.
- No blunder rate makes a level *stronger* than rate 0.
- **So, within `NFR-004`, no level can be reliably stronger than the shipped engine at 3 s.** Today, two levels
  (4 and 5) sit in that gap, and the verdict measured them as the same player.
- Every re-cut therefore does one of two things:
  - it weakens the default's play, so that there is room above it;
  - or it puts the default at the top.

**The constraints the brief names.**
- `NFR-004`'s 5 s hard ceiling.
- `DEFAULT_LEVEL` 3 is `DEFAULT_BUDGET_MS` today: `LEVELS[DEFAULT_LEVEL]` is pinned to `{ 3000, 0 }` at
  `src/levels.test.ts:228-234`, `src/engine.test.ts:901` and `src/cli.test.ts:3712`.
- UCI `Skill Level` 1–5 (`ADR-0044` D11; `ABC-171`, delivered at `9ae31679` and not merged) maps onto the same
  table.
- `ABC-087`'s mechanism stays.
- Levels are data.
- **Also binding:**
  - `ADR-0038` decision 3's admission rule, a verdict step `s ≤ LEVELS[1].budgetMs ÷ 10`;
  - `ABC-087` `A5`, under which the hardest level returns in ≤ 5 s on the real clock with `AR-NFR004-A`'s ≤ 31 ms
    overshoot;
  - `ABC-101`'s rule that a level is an opaque ordinal with no depth attached (its `A7`);
  - `ABC-087` test note 4: do not tune the levels to make the ladder pass.

## Decision

### D1. The table (data only, in `src/levels.ts`)

| level | `budgetMs` | `blunderRate` | step from the level below |
|---:|---:|---:|---|
| 1 (easiest) | **100** (unchanged) | **0.4** (unchanged) | — |
| 2 | **180** (was 500) | **0.2** (unchanged) | 1.8x time, rate halved |
| 3 | **330** (was 3 000) | **0.1** (was 0) | 1.83x time, rate halved |
| 4 | **1 000** (was 4 000) | **0.05** (was 0) | 3.03x time, rate halved |
| 5 (hardest, **default**) | **3 000** (was 4 500) | **0** | 3x time, rate to 0 |

- **Every adjacent pair differs by more than time alone**, the wording of the owner's menu.
  - The rate halves at every step: 0.4, 0.2, 0.1, 0.05, then 0.
  - Each step also adds about one ply (the top two steps) or about two-thirds of one (the bottom two).
- The table keeps the merged ordering row (`src/levels.test.ts` A1): budgets never fall, rates never rise, and
  each step improves at least one of the two.

### D2. `DEFAULT_LEVEL` moves from 3 to 5. `DEFAULT_BUDGET_MS` does not move

- **`DEFAULT_LEVEL = HARDEST_LEVEL = 5`.** `EASIEST_LEVEL` stays 1, and the ordinals stay `1`–`5`.
- **`LEVELS[DEFAULT_LEVEL]` is still `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }`**, which is `{ 3000, 0 }`.
  It is today's level 3 exactly. So the pins on that equality hold unchanged, and so do `ABC-087` `A6`,
  `ABC-101` `A8′` ("a session without the flag plays as it did") and `NFR-005`'s referent. Only the ordinal they
  are reached by changes.
- `src/cli-options.ts` `DEFAULT_DIFFICULTY` follows. It is pinned equal to `DEFAULT_LEVEL` (`src/cli.test.ts:3609`).
- **This overturns `ABC-101` ruling 2, which is the owner's call** (Q1). Ruling 2's reason was that `NFR-004`'s two
  bars have content only if some level is slower than the default. After this ADR:
  - the ≤ 3 s bar binds the default, as today;
  - the 5 s bar binds the mechanism, through the engine's clamp (`RF-1`, `HARD_CEILING_MS`) and the level layer's
    blunder clamp. It is enforced whatever a caller passes, but no level reaches it any more.
  The counter-argument the page recorded, that *"club strength [is] the product, which argues for defaulting to
  the top"*, is the one this ADR takes.

### D3. The mechanism does not change

- `Level` stays `{ budgetMs, blunderRate }`. Its pin is "a budget and a blunder rate, and nothing else".
- These do not change: `createLevel`, `blunder`, `seededRandom`, `src/engine.ts`, `src/search.ts` and
  `src/virtual-clock.ts`.
- **No `maxDepth` and no `maxNodes` on a level** (Alternatives (c), (d)).
- `ABC-087` `A8`'s boundary holds for the build: no change to `src/engine.ts` or `src/search.ts`.

### D4. UCI `Skill Level` reads the same table (`ADR-0044` D4, D11)

- **`option name Skill Level type spin default 5 min 1 max 5`.** The `default` is `DEFAULT_LEVEL`.
- **D11's two paths are chosen by the level's data, as written:**
  - **Level 5 (rate 0)** calls `chooseMove` with D12's `maxDepth` / `maxNodes`. A bare `go` at the default is
    still 3 000 ms (D4.2).
  - **Levels 1–4 (rate > 0)** go through `createLevel`. `go depth` / `nodes` / `mate` are ignored there, with one
    `info string`, and no score is sent. **That is new for levels 3 and 4**, and it is the price of a rate at
    those levels (Q2).
- `ABC-171`'s session code reads `LEVELS` and `DEFAULT_LEVEL`. Its tests pin level 3's 3 000 ms in about nine rows
  (`src/uci-session.test.ts` at `9ae31679`: 211–212, 284–285, 412, 448, 453, 719, 802). Those rows move with
  `ABC-173` (§ Consequences).

### D5. Why each pair has a credible path to > 50 % at step 4

Each pair gets two levers in the same direction. Neither lever was tuned on a game result.

| pair | time | completes a deeper iteration (of 50) | rate gap | one blunder costs (median, its own search) |
|---|---:|---|---|---|
| 4v5 (1 000 / 0.05 v 3 000 / 0) | 3x | 49, +1.08 ply | 0.05 → 0 | 71 cp at 1 000 ms |
| 3v4 (330 / 0.1 v 1 000 / 0.05) | 3.03x | 49, +1.06 ply | 0.1 → 0.05 | 71 cp at 330 ms |
| 2v3 (180 / 0.2 v 330 / 0.1) | 1.83x | 30, +0.64 ply | 0.2 → 0.1 | 71 cp at 220 ms (closest probe) |
| 1v2 (100 / 0.4 v 180 / 0.2) | 1.8x | 39, +0.82 ply | 0.4 → 0.2 | 71 cp at 220 ms (closest probe) |
| 1v5 (`A1`, 100 / 0.4 v 3 000 / 0) | 30x | 50, +3.60 ply | 0.4 → 0 | — |

- **One ply, published.** Thompson's Belle at n+1 plies scored about 80 % against Belle at n, for depths 3–8.
  Heinz's 3 000-game self-play matches read +115, +92 and +84 Elo for 10v9, 11v10 and 12v11 plies (about 66–62 %)
  (chessprogramming.org, "Depth", read 2026-10-19). That evidence is on other engines and is not this engine's
  verdict. At step 4 this engine sits at median depth 7–8 at the top two levels (`probe/RUN.txt`), inside the band
  those results cover.
- **The rate, from this ladder.**
  - A rate gap with a 5–6x budget step already separated the bottom: 1v2 scored 90 % and 2v3 100 %.
  - A strict-second-best blunder gives away a median of about 70 cp, and ≥ 100 cp on 11–18 of the 50 positions.
  - Over roughly 50 moves a side, a 0.05 gap is about 2.5 extra blunders a game, and a 0.2 gap about 10.
- **The repetition mechanism weakens.** A pair with any blunder rate no longer plays one deterministic game from
  both chairs. Of today's pairs, only 4v5's level 5 stays at rate 0, and 4v5 now has a one-ply gap as well.
- **The weakest of the five is 2v3:** +0.64 ply on 30 of 50 positions, plus the 0.2 → 0.1 gap. It is still a
  larger edge than 3v4 or 4v5 has today (+0.14 and +0.06 ply, with no rate gap). **Predicted MET on all five, and
  `UNKNOWN - verify`**: the verdict is a game score, and these are move-level counts.

### D6. The re-measure plan

1. **What re-runs: the full verdict, all five pairs, 180 games.** Every pair contains a level whose entry changes
   (2, 3, 4 and 5; only level 1 is unchanged). So no pair's 2026-10-19 reading describes the new table, and none
   carries over.
   - Under `ABC-085` § Dependencies' staleness rule (`ADR-0038` decision 6), any merge touching `src/levels.ts`
     makes the 2026-10-19 verdict STALE anyway.
   - A pair-scoped carry-over is not proposed. With this table there is nothing to carry.
2. **The harness and its constants are unchanged.**
   - Step 4.
   - Seeds `1..10`, both colours, for each `A2` pair (20 games), and `1..50` for `1v5` (100 games).
   - The same order: 3v4 and 4v5 first.
   - `PLY_CAP` 600, and every claimable draw claimed at the first offer.
   - `src/ladder.test.ts` does not change.
3. **The command is route V, as `ADR-0038` addendum 2 records it:**
   `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`. It produces raw
   files in the `abc146-verdict/raw/verdict-run2.*` shape, and the meta file records the command (closing the gap
   noted at `…6a2f9d03`).
4. **The tree.**
   - The verdict is taken on a commit whose `src/` is byte-equal to what merges for `ABC-173`
     (`git diff <run commit> <merge commit> -- src` prints nothing). It is the engine that ships (decision 6).
   - **Recommended:** run it on `ABC-173`'s QE-passed branch tip before the owner's UAT word, so that the owner
     accepts the re-cut with its score in hand (Q3).
   - Any merge between the run and `ABC-173`'s merge that touches the trigger list, `src/levels.ts` or
     `src/virtual-clock.ts` makes the reading STALE.
5. **The pre-flight, `ABC-166` `A1`'s form.**
   - `A0` stays current. These must print nothing against `eb216351`:
     - `vitest.config.ts`;
     - the node and vitest versions (v26.11.1 and 4.1.11);
     - `PUZZLE_DEEP`'s engine trigger list (`src/levels.ts` is not on it).
     If anything prints, `A0` is re-taken, or route N applies (`ADR-0038` addendum 2).
   - `src/` is clean.
   - A `-t "3v4"` probe prints its `LADDER` lines.
   - Width 1: no timing window overlaps the run.
6. **Expected wall: about 5.5 h (roughly 3.5–7.5 h). This is an ESTIMATE, nothing was timed.**
   - The formula is games × plies × mean budget × run 2's recorded wall per virtual-ms-ply. That rate was
     0.91–1.27 on the shared host, from `verdict-run2.out.txt`: 3v4 1.09, 4v5 1.10, 2v3 1.08, 1v2 0.91, 1v5 1.27.
     Plies are run 2's per-pair means, and the plies at the new table are `UNKNOWN - verify`.
   - Per pair: 1v5 ≈ 3.6 h, 4v5 ≈ 1.3 h, 3v4 ≈ 0.4 h, 2v3 ≈ 0.15 h, 1v2 ≈ 0.07 h.
   - The range takes the rate from 0.91 to 1.27 and the plies at ±20 %.
   - Run 2 was 11.3 h. The new top level is 3 000 ms, not 4 500.
7. **It is pre-registered: one shot, no tuning loop.** The bars stay `A1` ≥ 90 % and `A2` > 50 %. A RED pair is
   reported with its claimed-draw count and goes to the owner (ADR-0038 menu (c), or accept). **No second table is
   derived from these games without the owner's word** (`ABC-087` test note 4).
8. **The short mode is not the verdict.** `LADDER_DEEP=1` (step 120) runs at `ABC-173`'s QE for `A3`/`A4`/`A5`
   only. At step 120, level 3 gets 2.75 readings and level 1 gets less than one, so it claims no `A2`.

## Alternatives

Each lever the brief names, with its predicted effect and its evidence.

- **(a) Spread the budgets downward and keep the default at level 3, with a lower budget.** RUNNER-UP, and the
  owner may pick it instead (Q1).
  - The table: 100/0.4, 220/0.2, **500/0**, 1 500/0, 4 500/0.
  - **Predicted:**
    - 3v4 (500 v 1 500) deeper on 47 of 50 (+1.04 ply);
    - 4v5 (1 500 v 4 500) deeper on 48 (+1.04);
    - 2v3 deeper on 31 (+0.72), plus the rate gap;
    - 1v2 deeper on 45 (+1.00).
  - **Its cost is the default player's.** The default thinks for 0.5 s instead of 3 s and plays about 1.9 plies
    shallower: 500 v 3 000 is +1.88 ply, and the median depth at step 4 falls from 8 to 6.
  - It breaks `ABC-087` `A6`, `ABC-101` `A8′` and the three `LEVELS[DEFAULT_LEVEL] = { DEFAULT_BUDGET_MS, 0 }`
    pins.
  - `NFR-005` would then read a 3 s budget that no level plays. Its depth-6 floor is the FAIL "because `NFR-004`'s
    promise and the 1400–1700 strength target rest on it" (`plans/nfr-catalog.md`).
  - Its one advantage is the vocabulary: the default stays `3`, the middle.
  - A variant keeps level 2 at 500/0.2 so that 1v2 and 1v5 carry over. Its 2v3 is then 500 v 500, which completes a
    deeper iteration on 0 of 50 positions and rests on the rate alone.
- **(b) Small blunder rates at levels 3 and 4, with today's budgets** (3 000/0.1, 4 000/0.05, 4 500/0). REJECTED.
  - **Predicted:** the separation is the rate gap alone. The 1.33x and 1.13x budgets add +0.14 and +0.06 ply. Each
    pair gets a 0.05 gap, about 2.5 blunders a game at a median 86 cp (3 000 ms probe).
  - **Its cost:** the default blunders on about 10 % of its moves, and those moves are ≥ 100 cp on 18 of 50.
  - The UCI default would also lose D12's limits and its score line (D11's `createLevel` path).
  - It weakens the default without buying the depth separation that D1 buys.
- **(c) A depth cap per level through `maxDepth` (`ABC-170`).** REJECTED.
  - **Predicted:** deterministic separation, one ply per cap. But a cap can only *weaken* a level, so it meets the
    same default question as (a).
  - It adds a third `Level` field. That breaks:
    - the "budget and rate, nothing else" pin;
    - `ABC-087`'s mechanism;
    - `ABC-101`'s opaque-ordinal rule ("a level defined as 'depth 4' would contradict a surviving risk
      mitigation", its `A7`).
    It also reopens `ADR-0038` decision 1 ("reopens only if a level is redefined as something other than a budget
    plus a rate").
  - A cap that binds early returns well under the level's budget, which fails `ABC-087` `A2`'s ±20 %.
  - UCI would then need `min(level cap, go depth)`, which is an edit to `ABC-171`'s session.
- **(d) A node cap per level through `maxNodes` (`ABC-170`).** REJECTED.
  - **Predicted: no separating power in the verdict.** On the virtual clock a budget already *is* a node count,
    about 1 024 · b ÷ s, so a node cap is the budget dial twice.
  - On the real clock it would make a level hardware-independent, which nobody asked for (coding rule 7).
  - It has the same third-field costs as (c).
- **(e) The default at level 4 (3 000/0), with level 5 at 4 500 or 5 000.** REJECTED.
  - **Predicted:** 4v5 deeper on 10 or 18 of 50 (+0.20 or +0.36 ply), with 2 of 50 moves differing. That is
    today's RED again.
  - 5 000 also leaves no margin for `ABC-087` `A5`'s ≤ 5 s on the real clock: the clamp returns at ~5 003 ms
    (`AR-NFR004-A`).
- **(f) Fewer levels.** NOT TAKEN.
  - `ABC-101` calls the set "cheap to change", but UCI's spin `1–5` and the `--difficulty` words would both move.
  - D1 keeps five, and every one of them separates.
- **(g) Scope the ladder to level 3 (`ADR-0038` menu (c)).** The owner chose (b).

## Consequences

- **The default player's experience: unchanged in play.**
  - A terminal game with no `--difficulty`, and a UCI GUI that never sets `Skill Level`, get `{ 3000, 0 }`: the
    shipped engine at 3 s, the same move on the same position. `createLevel` at rate 0 draws once and calls
    `chooseMove`, so the draw does not reach the move.
  - What changes is the label. The default is now called the hardest, and **there is no level above it.** Today
    there is none in measured terms either: level 4 scored 32.5 % against level 3.
- **A player who names a level does see a change:**
  - `--difficulty 3` (or `Skill Level 3`) now plays about 2.1 plies shallower than before, at 330 ms, with a
    10 % blunder rate. 330 v 3 000 is deeper on 50 of 50 positions, +2.14 ply;
  - `4` plays at 1 000 ms with 5 %;
  - `5` plays at 3 000 ms instead of 4 500 ms. That is +0.20 ply less, and the move differs on 2 of 50 positions.
- **`NFR-004`:**
  - clause A (≤ 3 s at the default) holds as today, under the same `AR-NFR004-A`;
  - clause B (the 5 s ceiling) stays enforced by the engine's clamp;
  - `ABC-087` `A5`, the hardest level's ≤ 5 s on 30/30, now reads at 3 000 ms.
  - Security/NFR rules the catalog line at `ABC-173`'s gate. No catalog row is edited here.
- **`NFR-005`:** its referent is unchanged.
- **`NFR-008`:** no lane is added. The default-lane rows read `LEVELS` by key. The cost moves only where a row
  plays the default level by number, which is the Engineer's to list.
- **The pins and pages that move with `ABC-173` (BA/PM folds the pages):**
  - `src/levels.test.ts:193` (`[1, 3, 5]` → `[1, 5, 5]`);
  - `src/cli.test.ts:3602` ("the middle of the level set");
  - `src/cli-options.ts:70-71`;
  - `src/levels.ts`'s header and table comment;
  - `src/cli.ts`'s header line "level 3";
  - `ABC-171`'s `src/uci-session.ts` option line and the rows listed in D4;
  - `ABC-087` `A1`;
  - `ABC-101` ruling 2, `A2` and `A8′`;
  - `ADR-0044` D11's `default 3`;
  - `AGENTS.md` line 59 ("level 3 (≤3 s/move)"), which goes to the Scribe and is subject to the 24 576 B budget.
- **Sequencing:**
  - **`ABC-173` is pulled after `ABC-171` merges.** They share `src/uci-session.ts` and its test file.
  - The verdict follows the plan in D6.
- **The opening book is unaffected.** `ABC-095`'s book wraps the level seam, and the ladder plays no book
  (`ADR-0012`).
- **The ladder's `A1` pair becomes cheaper,** because its stronger side is 3 000 ms, not 4 500.

## Rollback

- **This is a data revert:**
  - the five `LEVELS` entries, `DEFAULT_LEVEL` and `DEFAULT_DIFFICULTY` go back to 100/0.4, 500/0.2, 3 000/0,
    4 000/0, 4 500/0 and 3;
  - the pins and pages listed above go back with them.
  No mechanism code is involved. A reverted table makes any verdict taken on this table STALE.
- **If the owner picks (a) at acceptance,** D1 and D2 are replaced by (a)'s table, with `DEFAULT_LEVEL` 3. D3, D4's
  path rule and D6 stand. D6 then still re-runs all five pairs, because level 2 changes.
- **If the re-measure is RED on a pair,** nothing reverts by itself. The owner decides (D6.7).

## Owner questions

- **Q1. Accept the default at the top, overturning `ABC-101` ruling 2? Recommended: yes.**
  - Yes: the default plays as today, and every level below it is a ply-and-rate step weaker (D1, D2).
  - No: take (a). The default stays `3`, plays about 1.9 plies shallower at 0.5 s, and `NFR-005`'s 3 s reading no
    longer describes any level.
- **Q2. The rates at levels 3 and 4: 0.1 and 0.05 (recommended) or 0?**
  - With them, every pair "differs by more than time alone", which is the menu's wording, and both chairs stop
    playing one game.
  - The cost: UCI `Skill Level` 3 and 4 ignore `go depth`/`nodes`/`mate` and send no score (D4).
  - With 0, 3v4 and 4v5 rest on about one ply each: deeper on 49 of 50 positions, with 3–5 moves differing.
- **Q3. Run the verdict on `ABC-173`'s QE-passed branch before your UAT word (recommended), or after the merge?**
  - Either way it is ~5.5 h (estimate) of one core, on the Orchestrator's overnight schedule, with every width-1
    window held until it ends.
