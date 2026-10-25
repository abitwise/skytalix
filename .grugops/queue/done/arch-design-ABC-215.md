---
subtask: arch-design-ABC-215
role: architect-design
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/arch-design-ABC-215/
branch: new grugops/arch-design-ABC-215 from main, worktree ../wt-arch-design-ABC-215
width: 1 of 3 (records + frozen-clock probe only — no real-clock timing, no G6, no games)
---

# Design ABC-215: our own evaluation values by stated rules; moved-pin probe

## Do
- Design exactly as the page asks (Scope, Test note 1 "Design probe first", the frozen-clock d7/d8 pre-check note): the stated rule per table (not derived from the Michniewski numbers), candidate values, the moved-pin probe (which ruled rows and deep pins move, counted on a scratch tree), and the frozen-clock node counts to depths 7 and 8 on kiwipete and position-6 for base and candidate (a count, not a reading).
- If the moved set is too wide for one L build, say so: BA/PM splits before Ready for Dev (page § Size).
- Name any ADR or owner word needed (page says none expected; the licence carve-out end is ADR-0048's — confirm what NOTICE/evaluate.ts header lines change).
- Context: Architect `arch-rule-ABC-205-g6/…912bcb0d` (gate vs blend; base at the position-6 d8 edge), Orchestrator `…154f2ced`, ADR-0031, ADR-0048.

## Fences
- Only your worktree and `<scratchpad>/arch215/`. Scratch trees for the probe; no `src/` edits on the branch. No real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch (the page's `## Design ruling` + notes). Seal notes (task arch-design-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-25, branch `grugops/arch-design-ABC-215` @ `9bc034cf` (= `15f42dd2` + records; not pushed,
not merged). Records plus probes on scratch clones in `<scratchpad>/arch215/` (`base`, `c2`, `pv`, `tb`). No `src/`
edit, no real-clock timing (real-clock deep rows filtered out by name), no `G6`, no games, no D.

- **Ruling: one candidate, `c2`, made by seven stated rules** (page § Design ruling, with the exact literals):
  - `PIECE_VALUE` `[0, 100, 325, 325, 500, 900, 0]`: the classical 1/3/3/5/9 scale × 100, plus 25 on each minor;
  - pawn `2 × e(f) × (R − 2)`;
  - knight `10 × reach − 50`;
  - bishop `5 × (diagonal reach − 9)`;
  - rook 20 on the 7th rank;
  - queen `5 × ring − 5`;
  - king `max(−50, −10 × file distance to b/g − 10 × (R − 1))`.

  The first set (`c1`) reddened two relation premises (`ABC-083` `A2` g6/g2, `A4` rook d4). Only those two rules were
  changed. The counts were read after `c2` was fixed.
- **Relations: all green, unedited** (`A1` mirror, `ABC-076` `A2`–`A4`, `ABC-083` `A2`–`A4`/`A6`, `QE-G2`/`G3`). The
  thinnest is `ABC-083` `A2` g6 (margin 3).
- **Moved-pin set: 16 rows in 5 files, 0 relations, 0 levels.** Default lane: 13 reds in `engine`, `search.ordering`,
  `search.pvs-lmr` and `transposition`. Deep: 3 in `quiescence`. Routes:
  - re-pin: 9 value rows;
  - `ADR-0028` d2 re-find: `engine` `A3` ×2, the ordering Scope tie, `pvs-lmr` `A4` ×2;
  - the oracle rule: `ORACLE_AT_DEPTH_3`, re-run on `c2` and equal on both boards: kiwipete 70 → 8 / e2a6, position-6
    84 → 85 / c3d5.

  All six multiplier cells are under level (position-6 d1 9.19 → 8.96x of 10). d5 drift max is 63 cp (base 51; row 75).
  `G1` 54/58 = baseline.
- **Frozen-clock d7/d8, base → `c2`:**
  - kiwipete d7 566 233 → 609 900; d8 1 638 196 → 1 735 339;
  - position-6 d7 644 469 → 586 333; d8 1 451 759 → **1 355 149 (−6.65 %)**, 6.2 % below base's lowest 3-s run.

  **Predicted `G6` MET** (kiwipete 7 = 7; position-6 8 in every run), while the throughput cost stays under about 6 %.
  The eval code is unchanged. `UNKNOWN - verify` until QE reads it.
- **Split: no.** One `L` build. `PIECE_VALUE` alone (`pv`) is +2.15 % at position-6 d8, which predicts a `G6` miss on
  the split's first half. The split would also need a second D.
- **ADR / owner word: none.** `ADR-0048` decision 7 rules the carve-out's end. After the merge, a dated status line
  goes on `ADR-0048` (Architect/Design).
  - `NOTICE`: delete lines 7–15. The file is then byte-equal to `ABC-214` Scope 5, and line 5 stays.
  - Header `:16`–`:22` becomes one line.
- **BA/PM line owed before Ready for Dev:** `README.md:84-86` names the CC BY-SA 3.0 values (`ABC-216`). That line is
  false after the merge, and `A8` fences `README.md` out. Add it to `A8`, limited to that sentence, or cut a twin.
- **Notes** (`.grugops/context/arch-design-ABC-215/notes/`): decision `…e04234f4`, observation `…cbbb9a63`.

**Trace row** (for the Orchestrator):

| ABC-215 (arch-design-ABC-215) | design ruled: seven stated rules (candidate c2), relations all green; 16 pins move in 5 files by re-pin / ADR-0028 d2 re-find / oracle rule; no level, no bound; no split | EPIC-008 | own evaluation values by rule; CC BY-SA carve-out removed from NOTICE and the src/evaluate.ts header | NFR-005 G6: frozen-clock position-6 d8 −6.65 % (predicted MET); G1 54/58; d5 drift max 63 cp; multiplier cells under level; G2 unchanged by construction (UNKNOWN - verify) | grugops/arch-design-ABC-215 @ 9bc034cf (15f42dd2 + records)<br>.grugops/context/arch-design-ABC-215/notes/ (2) | default + deterministic deep lanes on 4 scratch clones; frozen-clock d6–d8; oracle re-run; no timing | UAT owed at build (QE verdict signs) | BA/PM adds README.md:84-86 to A8; Orchestrator merges records, then In Design → Ready for Dev | In Design → Ready for Dev (after BA/PM line) |
