---
id: 20261030T143112Z-qe-e2e-observation-e6523bfb
kind: observation
by: qe-e2e
at: 2026-10-30T14:31:12Z
verified_by: 
confidence: high: each item backed by a mutant, a measured row or a replay in raw/
refs:
  - qe-ABC-241
  - ABC-241
  - EPIC-010
  - ADR-0020
  - d1a2d5cd
  - 33540592
  - e42b637b
  - 20261030T124213Z-qe-e2e-decision-09a71388
  - QE-241-a
  - QE-241-b
  - QE-241-c
  - QE-241-d
  - QE-241-e
  - QE-241-f
  - SE-241-a
  - SE-241-b
  - SE-241-c
supersedes: 
seal: sha256:3adf89f7fe644583509bd78ce96afff0f2be7440be7e61cd40f7744cb9e42b93
---

# qe-ABC-241 findings and gaps: QE-241-a LOW (UCI `position fen` carrying ep has no src row); SE-241-a LOW confirmed; SE-241-b CLOSED; four INFO

QE/E2E, task `qe-ABC-241`. Every item is a test-strength or record item. **No product fault was found against A1–A10.** Severity follows PREREG § 7.

- **QE-241-a (LOW, non-blocking; test strength; Software Engineer / a follow-up row).**
  - The SE's suite does not cover a UCI `position fen …` whose FEN already carries an uncapturable ep square.
  - Mutant QM3 makes `parsePosition` keep the FEN's own key raw, and only the moves' keys pass the helper. The full `npm test` stays green, 2 245 / 2 245 (`raw/mutants/QM3-*`).
  - Only QE's scratch rows catch it: QE-A4e (`4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1`, then a shuffle, where `d1e1` scores exactly 0 at depths 1–5 on both surfaces, and base does not) and QE-A5.
  - Head is correct today. A refactor could drop the FEN-key call unseen.
  - **Follow-up:** add QE-A4e's UCI row to `src/uci-session.test.ts`.
- **SE-241-a (LOW): CONFIRMED** by QM2. With the `gameStatus` lookup raw, exactly one row goes red (the crafted-map row) and 0 QE rows. As the SE wrote, no real game can observe it (`F3` / `F7`).
- **SE-241-b: CLOSED.** The per-ply derive costs +0.13 / +0.67 / +0.35 µs on about 43 µs (0.3–1.6 %), against ≤ max(5 µs, 10 %). `NFR-002` is MET (`…timing` note).
- **QE-241-b (INFO).** The SE's F8 walk and QE's 31 965-position F8 walk both miss a pseudo-legal capturer test (QM4). Random play almost never pins a capturer. The fixed pin rows catch it: the SE's diagonal and rank-pin rows, and QE-A1 e, g, i, j. The walks prove "no false equality" and the fixed rows prove legality. Both are needed, and both exist.
- **QE-241-c (INFO; ticket wording; BA/PM at the next hop on the page).**
  - A3's "(base: 7.Ng1)" and "(base: 11.Ng1)" are the **1.e4 board's own** counts. They hold exactly: base counts 3 at ply 13 and 5 at ply 21; head counts 3 at ply 9 and 5 at ply 17.
  - In play, though, base's first claim on that line comes at **5…Nf6 (ply 10)**, and its game ends by fivefold at **9…Nf6 (ply 18)**. Both are from the 1…Nf6 board, which carries no ep. Head's are at ply 9 and ply 17.
  - So on the ticket's own line the fix moves the claim and the game end by **one ply**, not by four. This was measured through `runTurnLoop` (QE-A3e) and `gameStatusOf` (`raw/qrows/ticketline.txt`).
  - Nothing is wrong in the build. The page's "base" numbers describe one board, not the game.
- **QE-241-d (INFO; QE's own predicates).** QE rows v1 had 2 FAIL rows (`QE-A3a-base`, `QE-A3e-base`). They copied that per-board wording as base's first-claim and game-end plies. v2 fixes them, and v1 is kept (`raw/qrows/qrows-v1.txt`, `raw/qe-scripts/qrows-v1.mjs`). No product fault was involved.
- **QE-241-e (INFO; the smokes cannot see the change).** In 40 replayed games (both smokes and base's reference pair), no ep-normalised position recurs. Neither repetition ending in this run was touched by the rule. A10 reads the change's safety (S-1..S-4), not its effect, which is expected at about 0.5 % of D games.
- **QE-241-f (INFO; host).** A foreign vitest overlapped D (31 / 253 samples) and R (13 / 195). No thermal stop fired, the frequency fall was ≤ 0.10 %, and the readings stand. R's single-sample Tctl max was 85.5 °C, with a median of 74.63 °C. The stop rule reads the running median, which peaked at 75.31 °C.
- **SE-241-c (INFO): unchanged.** The C4 cases stay one late, as accepted (an in-tree double push, and a root carrying an uncapturable ep). QE-A6iii is consistent with this: roots whose window holds a normalised key stay node-equal to base when the board cannot recur.
