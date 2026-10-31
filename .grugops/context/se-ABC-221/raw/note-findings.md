# `ABC-221` SE findings and the handoff to the next roles (one LOW for the records, the rest INFO; none blocks)

## Findings
- **SE-221-a (LOW, records): A6's "(≥ 117 s by arithmetic)" does not fit A6's own words.**
  - A6 says "80 moves are played with no added time". On that shape the clock after move 80 is **17 205 ms**. This
    matches `arch-epic009-settings` `raw/alloc.txt` § "sudden death 15 min, 80 moves", uci-clock-mode closest 17 205.
    Every move still leaves ≥ 1 000 ms, so **A6's bound is met**.
  - 117 735 ms is alloc.txt's § "40/15, no movestogo sent, 80 moves". Its simulator adds the period's 900 000 ms after
    move 40, and the closest call is move 40 (`raw/alloc.mjs` `play`, `per: 40, sendMtg: false`).
  - I built both shapes as two stubbed rows, each pinning its own figure, so whichever reading BA/PM keeps is covered.
    `ADR-0052` D4 repeats the "80 moves leave ≥ 117 s" sentence.
  - **BA/PM, at the fold:** correct A6's parenthetical to 17 205 ms, or make A6 "+900 000 after move 40". The bound does
    not move. If the D4 sentence is to change, the Architect owns it.
- **SE-221-b (INFO): A10 adds one deep-lane `spawnSync` call to `src/uci-session.test.ts`.**
  - `ADR-0052` D8's dated amendment says this file "has no spawn site", and it moved A14 out to keep the delivered
    entry point's spawn site single.
  - A10's child is not the delivered entry point. It is `node --expose-gc --input-type=module -e <script>` importing
    `src/` modules, the `ABC-081` A7 instrument `src/transposition.test.ts` already runs in `ENGINE_DEEP`.
  - It is defined only under `ENGINE_DEEP=1`, so the default lane spawns 0 (`N8-SPAWN` unchanged). The one new static
    import, `node:child_process`, is a built-in.
  - The Architect may confirm this reading of D8, or ask for the memory read to move to a QE hand reading in plain
    node, as `ABC-212`'s was. That change is test-only.
- **SE-221-c (INFO): two re-pins outside the files the ticket names.** Both were forced by the clamp value:
  - `src/engine.test.ts` (RF-1 "names the ceiling");
  - `src/levels.test.ts` (clause B). This row asserted `max(level ceilings) === HARD_CEILING_MS`, which is `ADR-0045`
    A3's "the clamp is the largest level ceiling". D6 retires that equality. The row now pins the clamp at 60 000, the
    largest level ceiling at 32 000, and the second ≤ the first.
  - `src/levels.ts` is untouched. I read `levels.test.ts` as one of "their tests", because it pins `src/engine.ts`'s
    export. BA/PM may want `ADR-0045` § AMENDMENT A3's fold line to name it.
- **SE-221-d (INFO): one row removed and three titles changed.**
  - Removed: `ABC-220` A1 "uci-clock-mode is not offered at this build (ABC-221)".
  - Titles changed: `ABC-220` A8's constants row, and `levels` clause B ("clamp 60 000 (ABC-221)").
  - `ABC-220` A10's refused value `uci-clock-mode` is now `Uci-Clock-Mode`, so that block keeps its 6 rows.
  - Net rows: +31 −1 = **+30** (2 333 → 2 363).
- **SE-221-e (INFO): `QE-244-a` carry, nothing re-run is owed.**
  - This build touches none of that carry's levers: the step literals, `LEVELS[5].budgetMs`, `NODES_PER_CLOCK_CHECK`,
    and the `ABC-230`/`ABC-241` rows.
  - Every one of those rows is byte-identical, in `src/cli.test.ts` (unchanged) and in `src/uci-session.test.ts`,
    where no hunk falls in those blocks.
  - Level 5's 4 000 is under both clamps, so their searches read the same clock.
- **SE-221-f (INFO): the informal `G8` wall.** The figures are in the readings note. The new rows cost 39 ms
  in-thread, about 0.02 s of wall on 2 slots, so most of the interleaved +0.16 s is likely window drift. That is
  `UNKNOWN - verify` until QE's `G8`.
- **SE-221-g (INFO): a stale comment not edited.** In `src/engine.test.ts` `ABC-170` A2, "The ceiling, on a 1 ms step:
  about 5 000 consultations" has been stale since `ABC-212` (32 000), and it is staler at 60 000. It is a comment in a
  row this ticket does not own, and nodes end that search first. I left it.

## What QE needs
- **A8, git diff:** `git diff d58f2d77..c48a6f83 -- src/engine.ts` shows the one value and comment lines only;
  `src/levels.ts`, `src/search.ts` and `src/uci.ts` are empty in the diff. Check `LEVELS[1..7]`, `DEFAULT_LEVEL` and
  the `Skill Level` line.
- **A9 / `G8`:** interleaved, host clear. Base `d58f2d77`, head `c48a6f83`. If the head median is > 9.6 s, `ABC-244`'s
  tranche-2 trigger fires. If it is > 10 s, A9 is NOT MET (the Orchestrator's `NFR-008` watch).
- **A10, A11 row 2:** my one run each is in the readings note. QE re-runs them ALONE.
- **A11 row 3 (A14b):** QE's own probe, a copy of `qe-ABC-220`'s `probe/a14b-probe.mjs` with `uci-clock-mode`.
  Not run here.
- **Plants to try** (SE red checks, all killed; see the readings note): cap 22 000, cap 60 000, `movetime` uncapped,
  clamp 32 000, the no-token budget = cap, QM4 per mode, the level cap in the mode, and C replaced by t ÷ m.
- UAT is owed (production lines change). The QE verdict signs it.

## What Security/NFR needs
- `NFR-004`: the text "60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s); the engine's one clamp sits at the
  largest ceiling in force, 60 s". `AR-NFR004-A` is re-read at 59.5 s from A10's walls (readings note).
- `NFR-009` at 59.5 s: A10's memory figures.
- `AR-UCI-BUSY`: ≤ 60 s holds exactly in this mode (59 500 + ~31 + 100 < 60 000).
- ASVS L1: the closed set gained one value, matched exactly. The refusal echo is still through `printableOf`, and an
  `ABC-220` A10 row pins the control-character drop. `go`'s numbers are unchanged, and `SEC-220-b` is a comment.
