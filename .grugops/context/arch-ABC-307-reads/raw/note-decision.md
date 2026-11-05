# arch-ABC-307-reads decision: eight rows stay S under the PREREG. C1 misses clause (d) on MC1, so by the sealed rule row 10 does not close; that comes to the Orchestrator, with a recommendation. The sum is inside by 11 ms, and `AR-154-TWO-POINT-CONTROL`'s trigger has fired unread

Architect/Design, task `arch-ABC-307-reads`. Readings: this task's observation. The record is `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307-reads`).

## Per row
- **S, every clause met:** Q1, Q2, Q3, L1, L2, L3, C2, B1.
- **C1: clauses (a), (b) and (c) are met; (d) is not.** Its remnant kills MC1 and M6 in the lane, and the full row kills M6 alone. Alone under MC1 the full row passes, at the tip and at base. The PREREG gives (d) no redesign route, and nothing is left to redesign: the body is byte-identical.
- No row must go K or W by this read. No mutant lost its last killer.

## The sum
- **K rows: none, so 0 of 113.**
- **With all nine S: saved 592 of 750 against 581.** Inside the slack by 11 ms, on a read whose noise is larger than that. `R-307-b` stands as written.
- **What this does to `A6`:** the 113 ms was set on est. kept 129. At kept 158 almost none of it is left. A K of any row but B1 now reads past 581. **C1 alone, 54 ms by § Scope, lands at about 555.** The page's "any two of C1, C2 and B1 can fall" no longer holds on this read.

## Row 10
**2026-11-05: DoR row 10 is not closed. Every form, remnant, `-t` line, count, kept ms and kill is measured and eight rows hold, but the PREREG closes it only with all nine S, and C1 misses (d) on MC1.**

## For the Orchestrator
1. **C1's clause (d).** This is a sealed clause, on a ticket where you ruled that a sealed rule is not waived on a close figure. So I do not read past it. Your options:
   - **(a) recommended: rule that MC1 is unfit for the deep leg, and that C1's (d) reads on M6.** MC1 is a mutant I wrote badly: its kill depends on how many sessions ran before it, and the same row passes alone at base. M6 is on the sealed list and passes (d). MC1 stays in `A7` for the lane only, and QE reads it there. Row 10 then closes on your line, with no run.
   - **(b)** a new MC1 under a new PREREG, for one more read. It costs a hop and a mutant of this kind stays weak: the row sees two or three path choices.
   - **(c)** K of C1. It keeps nothing MC1 needs, and it lands past the slack.
2. **`AR-154-TWO-POINT-CONTROL`, trigger `R-a`.** `ABC-154`'s page says a ticket that edits `tools/grugops/qe-hop-integrity.test.ts` carries `F1`–`F4`. `ABC-307` edits it, and its page does not. Neither `arch-ABC-307` nor the cut read this.
   - It does not change a form: the two green plants read 0 at base and 0 at the tip, so nothing is lost.
   - `F1` and `F4` cannot stand as written. `F1` is a default-lane count over `allNotes()`, which `A5` forbids and which would re-arm `T-QEHOP-GROWTH`.
   - **I recommend a ruling for BA/PM's pen:** `F1`–`F4` do not ride on `ABC-307`, the residual stays accepted, and `R-a` re-reads on the next ticket that edits the deep rows. If you want `F1` kept, it goes in the deep lane as one more row, and the `qe-hop` count reads 36, not 35.
3. **The margin, for information.** If you want more than 11 ms, two remnants have room, both unread: B1 on seeds 1, 4 and 7 (the same three replies, not the ADR's "1 to k"), and L1 with one call, not three, at the default level. Each needs a re-read on its mutant. I do not recommend a hop for it. `A9` grades the figure.

**Owner question: none.** No ADR is reversed, and no level, bound, cap, W or lane line moves.

## BA/PM's page lines (written once, for after call 1; nothing here edits the page)
- **§ Scope:** the kept column is `raw/kept.tsv`. The remnants are `raw/tip.py`'s, with these titles:
  - Q1 "--sweep on a copy of the named folders lists ABC-073 as a finding, with its trap in the copy";
  - Q2 "coverage() over the named folders' real notes reads ABC-062 and ABC-073 as findings";
  - Q3 "on a copy of the named folders: prints each count line and every finding by id, exits 1; 0 when every row is grandfathered";
  - L1 "A8′ (sample) — levels 1 and the default: the seam moves exactly as `createLevel` does, on one seed and one injected clock";
  - L2 "A4 (no search): with a legal ep capture available the two key lists are equal; on the uncapturable line they are not";
  - L3 "A7 (no search): after d8e8, the move A4 (slice) pins, gameStatusOf reports the claim";
  - C1 "two sessions on seededRandom(2), over the first two gos (a blunder, then the engine), write the same bestmove sequence";
  - C2 "setoption name Skill Level value 7 sets 7: a bare go hands the engine 30 000 ms";
  - B1 "seeds 1 to 7, one pick each, at least 3 distinct replies".
- **`A2`, exceptions by name:** those in `…838ecf31`, plus `levelOneMoves`' loop in the default describe reads `goes.slice(0, 4)`; `qe-hop` gains `NAMED` and `namedRoot`.
- **`A3`:** no W. 2 709 in 71 files at `8d66a706`, 9 names out and 9 in. Re-read at the build's base.
- **`A4`:** the nine lines in `ADR-0046`. `ENGINE_DEEP` passed counts base → tip: `uci-session` 265 → 270, `qe-hop` 32 → 35, `book` 35 → 36.
- **`A5`:** stands, measured by the sentinel A5R (base 3 red, tip 0). QE should repeat it.
- **`A6`:** replace "any two of C1, C2 and B1 can fall, or L2 or L3 alone" with: at kept 158 the margin is 11 ms, so any K but B1 reads past the slack and goes to the Orchestrator. L3 with B1 or C2 is past it (`…f86e0257` 2).
- **`A7`:** the row's named mutant with its remnant among the killers. The list and the holders are `raw/kill-matrix.tsv`. Named holders:
  - L2's QMATCH1: `cli` A4 (slice), `uci` A4, `ABC-249`;
  - L3's F230, M2s, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1: `cli` A4 (slice), `uci` A5 (slice), `cli` `ABC-230` A1;
  - C2's P2b: `ABC-221` A11, `ABC-220` A6, `ABC-221` A7, `ABC-259`.
  - Add `ABC-154`'s plants and MQ2, MQ3, on the re-anchored `q4b`. **C1's line waits for call 1.** Say "killed" per mutant, not "only killer": that holds only for ML1.
- **`A8`:** the run rule is 22 lines, and its trigger gains `tools/grugops/qe-hop-integrity.js` and `data/opening-book/book.json`.
- **§ The Architect's confirmation:** point 3's eight are read and hold; point 4's counts are above.
- **§ Open 1 and 2:** answered by `…9e878ba6`.
- **Risks:** `R-307-a` closes, measured. `R-307-c` stands, accepted. `R-307-b` reads the 11 ms.
- **`A10`:** gains `T-QEHOP-GROWTH`'s retirement and `R-N8H-2`.
- **DoR row 10:** the dated line above, then yours.

## SE build lines
`…838ecf31`'s stand, measured on `raw/tip.py` (run with `B1_K=7`). One addition: `namedRoot` copies `.grugops/context` with `cpSync`'s `filter`, so no further `node:fs` binding is needed.
