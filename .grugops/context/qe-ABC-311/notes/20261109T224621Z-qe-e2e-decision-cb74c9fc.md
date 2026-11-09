---
id: 20261109T224621Z-qe-e2e-decision-cb74c9fc
kind: decision
by: qe-e2e
at: 2026-11-09T22:46:21Z
verified_by: 
confidence: high: PASS_WITH_GAPS; A1-A5 met, each checked by QE on this host; gaps G1-G4 low and non-blocking; GitHub render of the 8-column row UNKNOWN - verify (not viewed)
refs:
  - qe-ABC-311
  - ABC-311
  - grugops/qe-ABC-311
  - grugops/ABC-311
  - be4e1dff
  - 96107905
  - README.md
  - src/levels.ts
  - assets/readme-art.txt
  - orch-2026-10-30a/20261109T224101Z-orchestrator-decision-03f8f6f9
  - se-ABC-311/20261109T224233Z-software-engineer-observation-b740aaee
  - qe-ABC-311/20261109T224548Z-qe-e2e-observation-5540f546
supersedes: 
seal: sha256:1a02b0bdfb8a507c2fb83575d7fbcaf64bfa62f06142eac5459d93af6f42b056
---

# qe-ABC-311 verdict: **PASS_WITH_GAPS.** A1–A5 are all met. The gaps are about readability for a new user, none blocks, and one item is UNKNOWN - verify

QE/E2E, task `qe-ABC-311`, at `grugops/ABC-311` `be4e1dff`. `main` and the merge base are both `96107905`. The rows are graded against `orch-2026-10-30a` `…03f8f6f9`. Commands and outputs are in this task's observation `…5540f546`, sealed just before this note. QE checked every row itself and did not rely on the SE's record `…b740aaee`.

## Per row
- **A1, met.** README line 53 adds a `Projected strength` row. QE compared its 7 cells with the note's 7 ranges by script, string for string, under the `| Level | 1 … 7 |` header. All 7 are equal: `~`, an ASCII space as the thousands separator, and an en dash, as in the note.
- **A2, met.** Lines 55–59 say "projections, not measurements". They name the source as the one measured figure in § Strength (1902.5 ± 49.1 at 100 ms a move, with no blunders). They name both assumptions: about +50 to +60 for each doubling of time, less at longer times, and an unmeasured penalty for the levels that blunder. They end "on the § Strength scale only, and are not FIDE or online ratings."
- **A3, met.** § Strength still has its one measured figure, "holds on that scale only", "Level 5 normally has 4 s a move, not 100 ms" and "Its strength at 4 s was not measured". The only added words are "; § Levels gives a projection only." A grep for elo, rating, measur, strength and projec finds no line that gives a measured figure for any level. The one measured figure is § Strength's own, at 100 ms.
- **A4, met.** `src/levels.ts` `LEVELS` gives 100, 180, 330, 1000, 4000, 5000 and 30000 ms. The README's times row, untouched, reads 0.1, 0.2, 0.3, 1, 4, 5 and 30 s under "The times are approximate". `src/levels.ts` is not in the diff.
- **A5, met.** The diff against `main` holds `README.md` (+8 −1) and 3 files under `.grugops/context/se-ABC-311/`. Nothing is under `src/`, so UAT stays waived by measurement. Under the host lock, `npm run lint` exits 0 (148 files), `npm run build` exits 0, and the art cmp exits 0 against the 404-byte `assets/readme-art.txt`.

## Gaps (none blocking)
- **G1, low. The README never says which levels blunder.** "With no blunders" and "the levels that blunder" are the README's only mentions of blunders. Levels 1–4 blunder at 40, 20, 10 and 5 %, and the README says so nowhere. Without that, a new user cannot see why level 4 at 1 s (~1 800–1 950) projects at or below the 100 ms figure (1902.5). The words "with no blunders" for the measured figure are also unclear. One clause would fix it, for example "levels 1–4 sometimes play a weaker move on purpose". This would be a follow-up. A2 did not ask for it.
- **G2, low. Number style.** The table writes `~1 800`, with a space as the thousands separator, but the prose two lines below writes `1902.5`. In a narrow rendered cell, an ASCII space inside a number can break the line, so a cell could show `~1` on one line and `000–1 300` on the next. A1 requires these exact bytes, so changing them (to a no-break space, or to `1000` style) is the Orchestrator's call. The rendered result was not viewed: UNKNOWN - verify.
- **G3, low. The 8-column table in raw markdown.** Line 53 is 127 characters long. That is the longest line in the README; the next longest is 96, and the prose wraps at about 95. The cells are not padded, so in raw text a range does not sit under its level number. Read cell by cell it is clear: each range follows its pipe in level order, and `Projected strength` names the row. It wraps on an 80-column terminal. Judgement: acceptable in raw form but not tidy. Padding the three rows to aligned columns would make them readable as a grid, at about 130 characters per line.
- **G4, low. Wording nits.** "+50 to +60" has no unit; the § Strength scale and its Elo figure are the reference, but the sentence does not say so. `§` is new to this README: `main` used it nowhere. "§ Strength" is terse for a newcomer, and "the Strength section below" or a link would be easier to follow. In "a penalty for the levels that blunder, which was not measured", the last clause can be read as attaching to "the levels". Line 48's lead-in, "The times are approximate:", now introduces a table that also holds strengths.

## Read as a new user
§ Levels is clear about the main point: the numbers are rough ranges, they are not measured, and they are not FIDE. The order 1 < 2 < … < 7 is monotone, and L5/L6 overlap, which fits 4 s against 5 s. § Strength comes right after and reads true: it gives one figure, at 100 ms, and states plainly that the 4 s figure was not measured. The friction points are G1 (which levels blunder, and why level 4 sits below the measured figure) and G4 (the `§` notation and the "+50" with no unit). Neither makes the text false.

## Board
QE verdict for UAT: PASS_WITH_GAPS with no blocking gap. ABC-311 can move `In Review → Ready for UAT`, and UAT is waived by measurement. QE did not edit `plans/board.md`, which is the Orchestrator's record. G1–G4 are offered as follow-ups, not as conditions.
