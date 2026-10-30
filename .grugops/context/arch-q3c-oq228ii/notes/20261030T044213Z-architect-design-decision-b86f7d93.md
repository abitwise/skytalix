---
id: 20261030T044213Z-architect-design-decision-b86f7d93
kind: decision
by: architect-design
at: 2026-10-30T04:42:13Z
verified_by: 
confidence: high: records only; transcribes the owner's verbatim word (…c4ab73de); design by code read at c0698ddd (sibling …54dd698c); 133 % bar assumes linear time-to-nodes (UNKNOWN - verify); reference-check No findings x5
refs:
  - arch-q3c-oq228ii
  - ADR-0020
  - ADR-0053
  - ADR-0045
  - ADR-0044
  - ADR-0054
  - ADR-0011
  - ADR-0002
  - ADR-0038
  - OQ-228-1
  - EPIC-010
  - EPIC-008
  - EPIC-009
  - ABC-228
  - ABC-230
  - ABC-231
  - ABC-225
  - NFR-004
  - NFR-005
  - NFR-002
  - AR-NFR004-A
  - orch-2026-10-29g/20261030T044400Z-orchestrator-decision-c4ab73de
  - arch-ABC-230-reading/20261029T213529Z-architect-design-decision-90a3aa31
  - arch-q3c-oq228ii/20261030T044205Z-architect-design-observation-54dd698c
supersedes: 
seal: sha256:258a951569817eb03459c1ef075518bfa5d0bfe157a3cc77b5a04b85cc1790a7
---

## Scope

Records only. This note records the owner's answers of 2026-10-30, verbatim "QQ-228-1: ii ; Q3: c" (Orchestrator `orch-2026-10-29g/…c4ab73de`), in the ADRs. Branch `grugops/arch-q3c-oq228ii`, cut from `main` `c0698ddd`, records commit `7c14f719`. Only `memory-bank/50-decisions` was edited. There is no `src/`, `tools/`, `data/`, `plans/` or board edit. The facts this note rests on are in the sibling observation.

## Decision

1. **Q3 (c): recorded as a dated amendment section in `ADR-0020`** (§ AMENDMENT 2026-10-30), plus a § Status block and one line under decision 2's threefold bullet. It is not a new ADR: it amends one consequence bullet, and decisions 1 and 3 and the hash stand. **ACCEPTED 2026-10-30 on the owner's word.**
   - **C1, the repetition key.** It is `zobristKey(position)` with the ep file XORed out when the ep square is set and `hasLegalEnPassant` is false; otherwise it is unchanged. Only a reversible window's oldest position can carry ep, so this per-position form equals "the oldest key of the window". An illegal pseudo-legal capture also takes the file out, as FIDE says.
   - **C2, one helper, in `src/gameend.ts`.** It already imports `legal.ts` and `zobrist.ts`, and `history.ts` and `engine.ts` already import it. `zobrist.ts` gains one export, a pure read of the ep component. No module gains an import of `legal.ts`. Rejected homes: `zobrist.ts` (it would re-add the `legal.ts` edge), `legal.ts`, and a new module.
   - **C3, both halves land together.**
     - `keyHistory` stays the hash list.
     - `history.ts` gains a repetition-key list. `repetitionCounts` (still the one `positionCounts` supplier) counts it.
     - The `gameStatus` lookup goes through the helper.
     - `turn-loop.ts` `claimShortfall` counts the same list.
     - `cli.ts` injects that list where `ABC-230` injects `keyHistory`. UCI `parsePosition` applies the helper. The blunder path's appended root key is a repetition key.
     - Every key in `priorKeys` is a repetition key. `ADR-0054`'s scan is unchanged.
   - **C4, still one late, in the safe direction:** in-tree double pushes, and a root that itself carries an uncapturable ep square.
   - **Licence surface.**
     - `LICENSED_DRIVERS` stays `["turn-loop.ts", "cli.ts"]`.
     - `ADR-0002` clause 4's single supplier holds, and `ABC-081` `A6` holds.
     - `history.ts`'s imports do not change.
     - `uci-session.ts` gains `gameend.ts`: one entry in `ADR-0044` D2's allowed list, with a dated pointer. The `A11-g1` deny list holds.
   - **The rest.** Value-changing, with the 10 D + 10 R smoke pair and the repetition-ending count reported. Size S. Built after `ABC-230` merges, as its own ticket. The tests it owes are in the amendment's Consequences: helper rows, unchanged hash rows, the `1.e4` game-end rows, prior-key rows on both surfaces, a consistency row and the fence rows.
2. **OQ-228-1 (ii): recorded in `ADR-0053` § Status and decision 10.** "PENDING THE OWNER" is struck and kept. On a re-forecast miss, level 5's per-move time becomes 4 000 ms in `ABC-228`. Nothing changes if the forecast meets `G6`. The consequences are written out in decision 10's 2026-10-30 block:
   - **The forecast is re-read at 4 000 ms.** The bar is ≤ 133 % (4/3), and today's reference reads 125 %. Above 133 %, (ii) does not cover it, and the question goes back to the owner.
   - **The data.** `LEVELS[5]` and `DEFAULT_BUDGET_MS` both go to 4 000, so `ADR-0045` D2's equality holds, and the test literals are re-pointed. `G9` is waived for `ABC-228` on `LEVELS[5]` only.
   - **The `ADR-0045` amendment.** D1's row and D2's "today's level 3" move. A3's margin at level 5 becomes 1 000 ms, and the 5 s ceiling stays, so no further `NFR-004` bound moves. The 5 → 6 step shrinks to 1.25×.
   - **NFR text.** `NFR-004` becomes ≤ 4 s at the default. `NFR-005`'s referent becomes 4 s, and its floors do not move.
   - **Gates.** `G5` ≤ 4 s. `G6` reads each build at its own `LEVELS[5]`: head 4 000 ms against base 3 000 ms. `G11` is read at 4 s, and `G8` reads the real-clock rows.
   - **The R frame moves to 4 000 ms.** The `rating.ts` R literal changes in the same merge, before the R smoke. D is unchanged. The 3 000 ms references stay on record and are never compared with 4 000 ms readings. The trend pool closes at the merge. The batches run both sides at 4 000 ms.
   - **Re-reads.** `G5`, `G6` and `G11`; the `NFR-004` and `NFR-005` text; the ladder verdict (STALE under `ADR-0038` d6); `ABC-231` `A1`; any `EPIC-009` fixed-budget reading; the `AGENTS.md` level line; `ADR-0044` D11's note.
3. **Pointer lines (dated 2026-10-30):**
   - `ADR-0045` § Status: "CONDITIONAL: level 5 to 4 000 ms, see `ADR-0053` decision 10";
   - `ADR-0054` § Status and its "ep interaction (Q3)" consequence: answered (c);
   - `ADR-0044` D2's allowed list: `gameend.ts`, from the Q3 (c) merge.

## Next (BA/PM, records)

- **Cut the Q3 (c) ticket** from `ADR-0020` § AMENDMENT 2026-10-30. It is S, value-changing, and waits on `ABC-230`'s merge. Its rows and gates come from the amendment's Consequences. Fold `EPIC-010`: Q3 answered (c), § Out of scope's "normalising `epSquare`" line, the § B item 3 row, and the owner-questions table.
- **Fold (ii) into `ABC-228`**: the 4 000 ms re-forecast at the 133 % bar, the conditional `G9` waiver, `G5`/`G6`/`G11` under (ii), the `rating.ts` R literal (place it in `ABC-228` or `ABC-225`), the trend-pool close, and both-sides-at-4 000 batches. Also fold `EPIC-010`'s amendment line, which still says "pending the owner", and § Out of scope's `G9` line. Fold `EPIC-008`'s `G9` and `G6` text only if the build happens.

## Risks

- **`ADR-0044` D2 gains `gameend.ts`.** This is a small change to an owner-accepted list. I took it as a direct consequence of (c), which the owner accepted with its UCI half. If the Orchestrator reads it as needing a separate word, the fallback is `legal.ts` as the helper's home, which costs two new edges and a collision with `ABC-229`.
- **The 133 % bar assumes nodes scale linearly with time** (`UNKNOWN - verify`). The graded `G6` decides.
- **Level 6 sits only 1.25× above a 4 s default.** It is recorded and not re-cut, because that is the owner's call.
- **`ABC-230` is in build in parallel.** The amendment names `ABC-230`'s seams by role, not by file, where they are not yet merged (the blunder-path root key is `UNKNOWN - verify`).

## Checks

`node tools/grugops/reference-check.js` printed "No findings." (exit 0) on all five edited ADRs. A scan of the added lines for host paths, IPv4 addresses and user names found 0 hits.
