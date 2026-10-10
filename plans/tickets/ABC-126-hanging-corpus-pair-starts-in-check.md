---
id: ABC-126
title: The hanging corpus's "R takes a bishop a pawn defends" pair starts in check, and two win-material rows describe boards no game reaches — re-find all four, and assert the header's claim
status: done
column: Done
size: S
priority: P2
epic: EPIC-004
feature: —
---

# ABC-126 — four corpus rows break a rule they claim to keep, and the row named for that rule only checks legality

> **Cut 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`,
> Workflow 07) from Architect/Design's side finding at `ruling-abc082-levels`
> (`.grugops/context/ruling-abc082-levels/notes/20261009T164755Z-architect-design-decision-what-the-engineer-changes-what-ba-pm-folds-owner-word-owed-33e5e0a3.md`
> item 5; measured in `…-observation-row21-hanging-corpus-margins-and-the-replacement-pair-d25a0383.md`).
> Pre-existing since `ABC-079`; not caused by `ABC-082`.
>
> **ORDERED AFTER `ABC-084` MERGES.** `ABC-084` (In Development) moves this corpus out of
> `src/quiescence.test.ts` into a data module, byte-identical. Editing the rows before that lands
> would collide with the move or fork the corpus.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`,
> Workflow 07) against the wave tip `71be48b`. `ABC-084` merged (`e634bc1`). The corpus is
> `HANGING_CORPUS` in `src/puzzle-corpus.ts` (the pair is at `:70` and `:84`). The "none of them in
> check" row is still `src/quiescence.test.ts:269`. `ABC-084`'s suite carries a carve-out for this
> pair (`src/puzzle-suite.test.ts:130`–`:133`), and this ticket removes it (`A6`). No production
> file has changed since the `7b54dae` probe. **DoR 10/10 → `Ready`.** Reasoning:
> `.grugops/context/rescore-batch-2026-10-10/notes/`.
>
> **Folded 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `recut-abc010`) at the wave tip
> `980890f`. Two `win-material` rows of `PUZZLES` that `ABC-010`'s rules (`ADR-0033`) reject are
> folded in as **`A7`**: "pin: Re1" has a pawn on h8, and in "discovered check" black is in check
> with white to move. **This ticket is now `ABC-010`'s hard predecessor.** `A4` and `A6` no longer
> hard-code 40/40, because `ABC-127` re-records the baseline. **Size `XS` → `S`. `P2` unchanged.
> DoR 10/10, page stays `Ready`.** Reasoning: `.grugops/context/recut-abc010/notes/`.

## Problem

*User*: every later reader of `ABC-079` `A1`'s evidence and of `ABC-084`'s do-not-hang class.

*Pain*: the corpus header says every row "must NOT be in check, or the losing capture is not even
on the menu and the row proves nothing". **Two rows are in check:** "R takes a bishop a pawn
defends" (`4k3/8/1p6/b7/8/8/8/R3K3 w - - 0 1`, `Ba5+` on `e1`) and its mirror
(`r3k3/8/8/8/B7/1P6/8/4K3 b - - 0 1`, `Ba4+` on `e8`). The row titled "carries at least 20
positions, none of them in check for the side to move" (`src/quiescence.test.ts:306`) only asserts
that the losing capture is legal. BA/PM's probe at `7b54dae`: **2 of 24 rows in check, exactly this
pair** (`.grugops/context/cut-followups-2026-10-09/probe/in-check.out.txt`).

The rows still test something, because the losing capture also answers the check. But with 5 legal
moves, 4 of them king moves, the row is a much narrower test than its theme claims.

*Added 2026-10-10 (fold from `ABC-010`'s re-cut).* Two `ABC-084` rows describe boards that no
game reaches. In "pin: Re1 pins the queen to the king" (`src/puzzle-corpus.ts:108`,
`4k2p/8/8/4q3/8/1P6/P2K4/R7 w - - 0 1`) a black pawn stands on h8. In "discovered check: the bishop
moves, Rxd8" (`:110`, `3q4/6k1/8/8/3B4/8/6PP/3R2K1 w - - 0 1`), `Bd4` already checks `g7` with
white to move. Under `ADR-0033` `parseFen` rejects both, and the suite parses every puzzle, so
`ABC-010` cannot land over them. It is the same defect class as the pair: a corpus row that breaks a
rule the corpus claims to keep.

*Value*: the corpus says what it does, and a future in-check row is caught by a test instead of by
an Architect reading FENs. `ABC-010` can then land without editing the corpus.

## Scope

- **Re-find the pair:** replace each FEN with one of the same theme (a rook takes a bishop that a
  pawn defends; same side to move; the capture is the named losing move), with the side to move
  **not** in check. The name and the losing move stay unless the new FEN forces a new square.
- **Make the title's claim an assertion:** the "none of them in check" row also asserts
  `isInCheck(parseFen(fen))` is `false` (`src/legal.ts:32`) for every row it iterates.
- Both edits land where `ABC-084` put them: the FENs in `src/puzzle-corpus.ts`, the assertion in
  `src/quiescence.test.ts:269`.
- **Re-author the two `win-material` rows** *(folded 2026-10-10, `A7`)*: same name, class and
  motif, a board that passes `ADR-0033`'s rules, and an accepted set that `ABC-084`'s oracle proves.
- **Drop `ABC-084`'s carve-out for this pair** *(added 2026-10-10)*. The `A6` row in
  `src/puzzle-suite.test.ts:126`–`:139` skips the in-check assertion for `do-not-hang` rows. Its
  comment (`:130`–`:132`) names this pair as the reason. Once the pair is re-found, that comment is
  false and the skip has no reason left. Remove both, so that row asserts not-in-check on every
  puzzle.

## Out of scope

- **Any other corpus row,** including the four dead-draw pairs (`…d25a0383`). They are not in check.
  *(Re-checked at the fold.)* `ADR-0033`'s rules reject no other row, either at `980890f` or at
  `ABC-127`'s in-flight `47433c5`.
- **Any level of `ABC-079` `A1`.** Under `ADR-0028` decision 2 a fixture is re-found and its level
  does not move.
- **`ADR-0033`'s rules themselves, and `src/fen.ts`.** Those are `ABC-010`'s. Here they are only an
  instrument (`A7`).
- **`src/puzzle-suite.baseline.json`** (`A4`), and any new puzzle. New puzzles are `ABC-127`'s.
- **Any production file.**

## Acceptance (Given/When/Then)

- **`A1` (the claim is asserted).** **Given** the 24 rows `ABC-079` `A1` reads, **when** the
  "none of them in check" row runs, **then** it asserts **not in check** for each, **24/24**, as
  well as legality. **On today's pair it is red on exactly 2 rows** (shown in the PR note before
  the FEN change).
- **`A2` (the pair is re-found, not dropped).** **Then** `ABC-079` `A1` still reads **exactly 24
  rows**. The two replacements are not in check, their losing capture is legal, and the side to
  move has **more than one non-king move**. *(Added at the fold:)* each replacement also passes
  `ADR-0033`'s rules, so `ABC-010` does not have to touch it. "Passes" means
  `node .grugops/context/recut-abc010/probe/rules-only.mts <tree> <fen>` prints `accepted`.
- **`A3` (the rows still discriminate).** **Given** each replacement, **then** with quiescence the
  losing capture is **not** chosen at depth 1 and at depth 3 (`SEARCH_DEEP=1`), and the bare leaf
  (`searchWithoutQuiescence`) **does** choose it at depth 1. The PR note records each row's margin
  at depth 3 (the best move's score minus the capture's), as `…f0115510` did for row 21. The
  default lane and `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` are green.
- **`A4` (`ABC-084`'s suite and baseline are respected).** **Given** `ABC-084`'s opt-in lane,
  **when** it runs after the change, **then** `total` equals the baseline file's `total` and the
  solved count is **not below** its `solved`, both read on this ticket's base. *(Re-worded at the
  fold. It read 40/40 at `980890f`, and `ABC-127` re-records it.)* If `ABC-127`'s per-row diff is on
  the base, the run prints **no `NEWLY-MISSED` line**. **The baseline file is not
  touched in this ticket's commits** (`ABC-084` `A7`: the baseline moves only in its own commit
  with a reason). Each replaced row's provenance records the re-find. *(Made concrete 2026-10-10:
  `HANGING_CORPUS` rows carry no `source` field. `PUZZLES` stamps all 24 with one shared string. So
  the provenance is a comment line above each replaced row, in the shape of the `ABC-082` re-find
  comment at `src/puzzle-corpus.ts:71`–`:72`. It names `ABC-126`, the old FEN's fault (in check),
  and the depth-3 margin from `A3`.)*
  **The `ABC-084` trigger (owner option B) does not fire here:** no file on its list changes. **The
  suite still runs, because this criterion requires it.** This ticket changes 4 of the suite's
  inputs, and the trigger list covers engine changes, not data changes. The Engineer runs
  `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` and records the result in the PR note, and
  QE re-runs it at review as this ticket's `A4`.
- **`A5` (test data only).** **Then** `git diff --numstat <base>...<tip> -- src` lists exactly
  `src/puzzle-corpus.ts`, `src/quiescence.test.ts` and `src/puzzle-suite.test.ts` *(third file
  added 2026-10-10, for `A6`)*. Lint, typecheck, build and `npm test` exit 0; skip count 0;
  integrity `No findings.`
- **`A6` (the carve-out goes; added 2026-10-10).** **Given** `src/puzzle-suite.test.ts`'s row "every
  row names its source and its moves are legal; no added row starts in check", **then** it asserts
  `isInCheck(position) === false` for **every** puzzle (`PUZZLES.length` on the base; 40 at
  `980890f`), with no `kind` exemption. The comment
  naming this pair is gone. **Red first:** with the exemption removed and today's pair in place,
  the row is red on exactly the two pair rows (shown in the PR note, as for `A1`).
- **`A7` (two win-material rows that no game reaches are re-authored; folded 2026-10-10).**
  **Given** "pin: Re1 pins the queen to the king" and "discovered check: the bishop moves, Rxd8",
  **then** each FEN is replaced, and:
  - **red first:** on the shipped FENs, `rules-only.mts` (as in `A2`) prints `pawn on rank 8 (h8)`
    and `side not to move (black) is in check`. On the replacements it prints `accepted`;
  - **the answer is the oracle's, never the engine's** (`ABC-084` `A6`). Each row's `accept` is
    exactly the strictly-best set of `ABC-084`'s material-only 4-ply oracle, and its `source`
    gain is that oracle's best minus stand. If `ABC-127`'s `A2` row is on the base, that
    `PUZZLE_DEEP=1` row is the re-proof. Otherwise the PR note carries the
    `.grugops/context/ticket-to-pr-ABC-084/notes/raw-probe-oracle.mts.txt` reading;
  - **name, class and count unchanged:** both names stay byte-identical, so the baseline's row
    names and `ABC-127`'s per-row lines keep their keys. The `win-material` count does not change;
  - **solved, and the baseline does not move.** The shipped engine solves each replacement at the
    baseline file's budget and step (`A4`). A replacement it does not solve is re-found, never
    kept, the same rule `ADR-0028` decision 2 applies to a fixture. Lowering the baseline needs the
    owner's word (`ABC-084` `A7`) and is not this ticket's to ask;
  - **provenance:** a comment line above each row names `ABC-126` (via `ABC-010`'s re-cut), the old
    FEN's fault, and the oracle's gain, in the shape of `src/puzzle-corpus.ts:71`–`:72`.

## Dependencies

- ~~**`ABC-084` must merge first — OPEN (In Development).**~~ **`ABC-084` — `Done`** (owner
  accepted 2026-10-10, merged `e634bc1`). The data module is `src/puzzle-corpus.ts`.
- **File overlap (2026-10-10, re-dated at the fold).** Do not build any two of these in
  parallel; the second one rebases.
  - **`ABC-127` is In Development** on `src/puzzle-corpus.ts`, `src/puzzle-suite.test.ts` and the
    baseline, so this ticket **builds after `ABC-127` merges**. `ABC-127` keeps the existing rows
    byte-identical and only appends, so the rebase is mechanical. Its `A2` row then re-proves `A7`'s
    accepted sets in the lane.
  - **`ABC-083`** re-pins rows in `src/quiescence.test.ts`. This ticket goes before it, so
    `ABC-083`'s re-pin ledger reads the re-found rows.
- **`ABC-010` names this ticket as its hard predecessor** *(fold)*. Its build parses every puzzle
  through the validating `parseFen`.
- **`ABC-079` — `Done`.** It owns `A1` and its 24 rows.
- **`ADR-0028` decision 2** governs the re-find (fixture re-found, level unchanged).

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** 24 `isInCheck` calls, and no new test file: about 0 ms.
- **`NFR-004`, `NFR-005` — not triggered.** No production line.
- **Zero production lines**, so UAT is waived under the standing rule; the QE hop still applies.
- **Security — not triggered.** Static test data.

## Test notes

1. **Write `A1` first and see it red on the shipped pair**, then re-find. That proves the
   assertion can fail.
2. **A measured candidate, not a prescription.** Moving the king off the bishop's diagonal
   (`4k3/8/1p6/b7/8/8/8/R4K2 w - - 0 1`, mirror `r4k2/8/8/8/B7/1P6/8/4K3 b - - 0 1`) reads at
   `7b54dae`: not in check, capture legal, 12 legal moves; quiescence picks `f1g1` at d1 (115) and
   `a1b1` at d3 (105); the bare leaf picks `a1a5` at d1 (410). The FEN choice is the Engineer's;
   the margins are re-measured on the tree it lands on.
3. **Re-run `ABC-084`'s lane, do not assume it.** The shared rows read 0/24 losing at `dfda6ba`,
   and a re-found row should keep that, but `A4` is a reading.
4. **`A7` has measured candidates, not prescriptions** (BA/PM, `980890f`,
   `.grugops/context/recut-abc010/probe/`):
   - **"pin: Re1"**: move the pawn from h8 to h7, giving `4k3/7p/8/4q3/8/1P6/P2K4/R7 w - - 0 1`.
     The oracle keys are `[a1e1]` and the gain is +4, the same as today. The engine plays `a1e1`
     at d7 (budget 25, step 1).
   - **"discovered check"**: put the king on f8, giving `3q1k2/8/8/8/3B4/8/6PP/3R2K1 w - - 0 1`.
     `Bc5+` (or `Bg7+`) unmasks `Rd1` on `Qd8`. The oracle keys are `[d4g7, d4c5]` and the gain is
     **+4, not +6**, because the king can now reach e7/e8 and guard d8. The engine plays `d4c5` at
     d6. The `source` string's gain changes to match.

   Both candidates are `accepted` under `ADR-0033`'s rules, with the side to move not in check (14
   and 26 legal moves). Re-measure on the tree the change lands on.

## Size and priority rationale

**Size `S` (2)** *(was `XS` (1); re-sized at the fold)*. There are now four FENs instead of two,
under two oracles (quiescence margins for the pair, the material oracle for `A7`), plus one added
assertion and a carve-out removed. Every FEN has a measured candidate, and the file fence does not
grow (`A5`).

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P2`.** A correctness gap in test data, not a defect: the rows still test something and
nothing is red. *(Fold.)* `ABC-010` (`P2`) now waits on it. That makes it a predecessor, and it
gains no priority from that: a predecessor of a `P2` is not urgent before the `P2` is.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at the fold** (`recut-abc010`, wave tip `980890f`). **Result: 10 of
10, 0 ⚠️. Met; the page stays `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅ wider:** four named rows. The pair breaks the header; the two `A7` rows break `ADR-0033`'s rules, reproduced at `980890f` |
| 2 | scope and out-of-scope clear | **✅ wider:** `A7` is in scope. Every other row, `ADR-0033`'s rules, the baseline and production code are fenced out. Same three files (`A5`) |
| 3 | INVEST-shaped | **✅** `ABC-127` shares the file but not the rows, so the order is a merge order, not a content dependency (§ Dependencies). Still small at `S` |
| 4 | acceptance testable and measurable | **✅** `A4` and `A6` read the base's baseline and length instead of 40/40. New `A7`: red first on the rules, oracle-exact sets, unchanged names, solved without a baseline move. `A2` gains a rules check |
| 5 | dependencies known | **✅** `ABC-127` (merges first), `ABC-083` (after), `ABC-010` (waits on this one) |
| 6 | security/NFR triggers with a measurable target | **✅** unchanged: `N8-LANE` ≈ 0 ms, no new file; `NFR-004`/`NFR-005` not triggered |
| 7 | test notes present | **✅** four (adds `A7`'s candidates) |
| 8 | size assigned | **✅** `S` (2), was `XS` |
| 9 | priority assigned | **✅** `P2`, with the reason |
| 10 | no major unresolved blocker | **✅** every FEN has a measured candidate, and no ruling is owed. The baseline does not move (`A7`) |

**Re-scored 2026-10-10 by BA/PM** (`rescore-batch-2026-10-10`, wave tip `71be48b`). **Result: 10 of
10, 0 ⚠️ — met; page `Ready`. The board move is the Orchestrator's.**
- **Item 3, ⚠️ → ✅.** `ABC-084` is `Done`. The ticket is independent.
- **Item 2 stays ✅, and is wider.** `ABC-084`'s carve-out comment (`src/puzzle-suite.test.ts:130`)
  becomes false once the pair is re-found, so removing it is in scope (`A6`). `A5`'s fence lists
  three files.
- **Item 4 stays ✅.** `A4` now says "not below" means 40/40, says where the provenance goes, and
  says why the suite runs although option B's trigger does not fire. `A6` is new.
- **Item 5 stays ✅.** The dependency is `Done`. The file overlap with `ABC-083` and the
  harder-puzzles cut is named.
- **Items 1, 6–10 unchanged ✅.** No production file has changed since the `7b54dae` probe. The
  candidate's measured margins still apply to today's search.

Assessed by BA/PM, **2026-10-09**, against the wave tip `7b54dae`. **Result: 9 of 10, 1 ⚠️ — NOT
met; stays in `Backlog`.** The ⚠️ is an ordering hold with a named release: when `ABC-084` merges,
item 3 becomes ✅ by that fact alone, and nothing else needs to change.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two named rows, the header they break, and a 2/24 measurement |
| 2 | scope and out-of-scope clear | **✅** two FENs and one assertion; other rows, levels, `ABC-084`'s additions and production code fenced out |
| 3 | INVEST-shaped | **⚠️** small, testable and valuable, but **not independent until `ABC-084` merges**: it edits the rows `ABC-084` is moving |
| 4 | acceptance testable and measurable | **✅** 24/24 not in check (red on 2 today), exactly 24 rows, depth-1/depth-3 choices per arm, solved count ≥ baseline, a `numstat` fence |
| 5 | dependencies known | **✅** `ABC-084` (ordering), `ABC-079`, `ADR-0028` decision 2 |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0 ms, no new file); `NFR-004`/`NFR-005` not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with the reason |
| 10 | no major unresolved blocker | **✅** a candidate FEN is measured; the remedy is the Architect's, and no ruling is owed |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-126`). Branch
`grugops/ABC-126-corpus-repairs` from `d6aceeb5`; code in `d10ffeff`. Not merged, not pushed.
Decisions and readings are in `.grugops/context/ticket-to-pr-ABC-126/` (`…7c41a2e9`, `…b3d870e5`,
raw files in `probe/`) and are not restated here.

**Criteria: `A1`–`A7` met as readings. No stop condition fired.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | The row asserts `isInCheck === false` per row, 24/24 green. Red first on exactly the pair: shipped → red on "R takes a bishop a pawn defends"; that row re-found → red on its mirror only; both → green |
| `A2` | MET | 24 rows. Replacements `4k3/8/1p6/b7/8/8/8/R4K2 w` and `r4k2/8/8/8/B7/1P6/8/4K3 b`: not in check, capture legal, 12 legal / 8 non-king, `rules-only.mts` → `accepted` |
| `A3` | MET | Quiescence picks `f1g1` / `f8g8` at d1 and `a1b1` / `a8b8` at d3; the bare leaf takes at d1. Depth-3 margin **185 / 185 cp**. Default lane and `SEARCH_DEEP=1` quiescence (37 passed) green |
| `A4` | MET | `PUZZLE_DEEP=1` ×3: 58/62 = baseline 58/62, no `NEWLY-MISSED`, identical per-row moves. Baseline file untouched; a provenance comment above each replaced row |
| `A5` | MET | `src` numstat: `puzzle-corpus.ts` 12/4, `quiescence.test.ts` 4/2, `puzzle-suite.test.ts` 1/4. Lint, typecheck, build, `npm test` (51 / 1581) exit 0; skip 0; `No findings.` |
| `A6` | MET | The `kind` exemption and its comment are gone; 62/62 assert not in check. Red first on exactly the two pair rows (same steps as `A1`) |
| `A7` | MET | Red: `pawn on rank 8 (h8)`, `side not to move (black) is in check`. Replacements `accepted`. Oracle: pin `[a1e1]` +4; discovered check `[d4g7, d4c5]` +4 (source +6 → +4). Deep `A2` oracle row green. Engine solves both (`a1e1` d7, `d4c5` d6). Names and class count unchanged |

- **`N8-LANE`:** 48 added `isInCheck` calls, about 0.04 ms CPU; no new test file.
- **`QE-127-f`** is closed by `A7`: the discovered-check row's set no longer depends on the "king is
  never captured" convention. **`QE-127-e`** is left to BA/PM.
- **Owed:** the QE hop (zero production lines, so UAT is waived; QE is not). No `AGENTS.md` line is owed.
