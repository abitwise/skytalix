# bapm-ABC-242-225-owner: ABC-242 accepted, DoR 10/10, Ready (A1 last-in-order fixture, A4 by determinism, A8 corrected); ABC-225 unblocked at width 1, In Development, DoR 10/10; the whole-second reading closed in ABC-220, ABC-222 and EPIC-009

BA/PM, records only, at `main` `5090a4d6`. No `src/`, `tools/`, `data/` or board edit was made. Nothing was run, built, timed or played, because a QE is timing ALONE on the host.

The owner's words, verbatim:
- `orch-2026-10-30a` `…65848126`: "ABC-242: accept, ABC-225 - approve to run one at a time".
- `…f4673b9f`, the clause folded here: "Whole-second reading of "≤ 22 s" - confirm". The catalog clause is Security/NFR's.

## Rulings

### 1. ABC-242: DoR 9/10 → 10/10, Backlog → Ready
The owner accepted `ADR-0054` § Proposed amendment 2026-10-30 and its `ADR-0032` d1 bullet. On a blunder move at levels 1–4, a root move whose child position stood twice before scores exactly 0, and its child is not searched. The check is in `src/levels.ts` `blunder`, and the engine path is unchanged. The ADR status text is `arch-ABC-242-accept`'s hop.

Folded:
- **A1** gains the skipped child search. The number of child searches is the legal moves minus those scored 0 this way: 4 for 5 on the probe, with `scored[0]` = `{d8e8, 0}`. The probe's entries 1–4 are `UNKNOWN - verify` and are not pinned.
- **A1** also gains the Architect's recommended fixture, with the third-occurrence move last in `legalMoves` order. On it, every earlier entry equals base's exactly, the last is 0, and there are `legalMoves` − 1 child searches.
- **A4** is re-worded, because no surface prints the scored list. The CLI seam, UCI (`Skill Level 1`, injected `random`) and a direct `createLevel(LEVELS[1], …)` all run on the same seed, budget, virtual clock, position and trimmed keys. All three play the same move. UCI's `info` `nodes` and `depth` equal the direct call's. The direct call's list carries the 0. The seed forces level 1's blunder draw.
- **A8** is corrected (`…f3b8d750`). The ladder lane (`src/ladder.test.ts:179`) hands in no prior keys, so it is an identity row inside A7, not a check of the change. **A1–A5 are the checks.** S2 with no smoke stands; the Orchestrator ruled it 2026-10-30.
- **The `NFR-004` line** reads at most 49 comparisons per root move (was ≤ 50). The `NFR-008` line names the default lane at ≤ 10 s and the 0.27–0.31 s headroom watch.
- **The parent-root count** is ruled out by the Architect (`…fec766ee`), noted in § Out of scope.
- **Dependencies are all met:** `ABC-230` and `ABC-241` are Done (`1f6abec4`), the reading is merged (`01c37946`), and the owner has accepted.
- **Shared files:** `ABC-243` (Ready) shares `src/uci-session.test.ts`, which is rebase order only. `ABC-229` (In Review) shares no file.
- Size S and P3 are unchanged. The pull is the Orchestrator's.

### 2. ABC-225: Blocked → In Development; DoR stays 10/10
- **A5 runs at `--concurrency 1`** by the owner's word. This answers QE-225-b with option (iii). `rpair` already accepts `--concurrency 1` (default 2), so no tool change is owed. ALONE, the 85 °C Tctl-median stop and a new PREREG all hold.
- **The width-1 wall of the 40-game smoke:**
  - About 2 h, double the width-2 estimate of about 1 h.
  - About 2.2–2.4 h by the recorded width-1 R rate at 4 000 ms. The R smokes of `qe-ABC-228-ii` and `qe-ABC-241` took 36.1 and 32.6 min for 10 games, which is 3.3–3.6 min a game.
  - Both figures are estimates; A6 reads the real one.
- **The budget line stands:** `rpair`'s `budget: 3000` moves to 4 000 for A1 ("the same pins as `r`"). `se-ABC-225-main` brings `main` in by merge, and the earlier dated lines' "rebase" reads as that merge.
- **A6 is re-worded for width 1.** A width-1 smoke cannot project a width-2 pair (QE-225-b (iii)). So A6 reports the smoke's wall and games per hour, and projects the 400-game pair at width 1: about 22–24 h (estimated). The width-2 ≤ 10 h is BA/PM's earlier estimate, not an owner bound, and it is no longer graded.
- **For the Orchestrator:** milestone 1's batch was costed at about 9 h at width 2. At width 1 it is about 22–24 h. The owner's word covers `ABC-225`'s A5, not the batch's width. Scheduling it, or asking the owner, is the Orchestrator's call.

### 3. The whole-second reading: closed, dated, with the owner quoted
In `simple-tournament`, "≤ 22 s" means < 22 500 ms on the wall.
- **`ABC-220`** (Done):
  - a CONFIRMED block at the top;
  - inline "(Confirmed by the owner 2026-10-30, `…f4673b9f`)" on the MERGED block's "still open", on the FOLDED note's wall reading, on the § NFR triggers `AR-UCI-BUSY` bullet, and on DoR row 10.
  - Nothing moves: A11 < 22 500 ms (read max 22 001.0 ms) and A6 ≤ start + 22 000 ms.
- **`ABC-222`** (Ready):
  - a CONFIRMED block saying **the PREREG reads A5 against < 22 500 ms**;
  - inline closures in the RE-SCORED block, the FOLDED block, A5 and DoR row 10.
  - DoR stays 10/10.
- **`EPIC-009`:**
  - a CONFIRMED block at the top;
  - inline closures in the MILESTONE 1 block and the FOLDED block;
  - in § Owner questions, the confirmation line now reads "Answered 2026-10-30: confirmed", with the old text kept as "Was". The section heading names the answer.
- **`ABC-221` is unchanged.** Its "≤ 60 s" is read exactly (59 500 + ~31 + 100 < 60 000), so it does not use the whole-second reading.

### 4. EPIC-010
- A FOLDED header block.
- Tickets table: row 3 (`ABC-225` In Development, A5 at width 1) and row 10 (`ABC-242` Ready 10/10).
- The cost table's `ABC-225` and batch rows carry width-1 figures.
- The `ABC-242` milestone footnote is dated.
- A fold line sits under the table.

Front matter: `ABC-242` is `ready` / `Ready`, and `ABC-225` is `in-development` / `In Development`, which matches the board at 18:10Z. Board moves are the Orchestrator's.
