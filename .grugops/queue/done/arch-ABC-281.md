---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T03:07:56Z
subtask: arch-ABC-281
role: architect-design
ref: .grugops/context/arch-ABC-281/
branch: new grugops/arch-ABC-281 from main — worktree .claude/worktrees/arch-ABC-281
width: wrap EVERY run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. Small reads only (≤ 20 min); mutant probes on a scratch copy. Host paths only as placeholders.
---
# ABC-281 DoR row 11: one form per row (W / S / K)
Read plans/tickets/ABC-281*.md, BA/PM notes (…45c342fe, …d012231e), Security/NFR (…8a4fb936, …69126dca), ADR-0046 (T2b census, § Consequences kill parity), ADR-0050 (abort guard), ABC-248's ruling, QE-087-d.
For R1 (QE-208-a pos-6 → SEARCH_DEEP), R2 (ABC-230 A4 → ENGINE_DEEP), R3 (levels A9 → ENGINE_DEEP) pick W (move whole), S (slice: name the small default-lane remnant that keeps the kill) or K (keep). Say whether ADR-0046's option (b) binds for any W (if it does, that row becomes an owner question — prefer a form that doesn't need one if coverage holds). A small mutant read is allowed to confirm a slice keeps the kill. Write the dated line in ADR-0046 (and ADR-0050 if R1 touches its guard). Forecast the wall saving of your forms vs the 0.38 s probe.
## Fences
memory-bank/50-decisions, your records, scratch. No ticket edits (list the dated DoR line for BA/PM, or write it on the ticket only if the page's DoR row 11 says the Architect writes it). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-281, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T03:22:05Z. Records plus scratch mutant reads. The runs used a `git archive` copy (`src/` tree `8adb0a18` = `main`'s) under the host lock, about 4 min of runs in all. Nothing was written to `src/` or `tools/`, the ticket page is untouched, the scratch copy and symlink were removed, and nothing is left running.
- **The forms: S, S, S.**
  - **R1 `QE-208-a`:** the remnant is the sweep on `chooseMoveWithoutTaper` at readings 8 and 10, about 20 ms of 368.
  - **R2 `ABC-230` A4:** the remnant is `[]` vs absent on kr-corner, startpos and position-6, about 21 ms of 233.
  - **R3 levels A9:** the remnant is `QE-087-d`'s draw check on seed 1 over the first 10 of the thirty, about 4 ms of 137.
- **Why S.** Under W, M1 (`ADR-0050`'s plant), M2 (`[]` leaves the table uncleared), M3c (`M5b`, an after-decision extra draw on a blunder) and M3d each lose their only default-lane killer, so option (b) would bind. The tip sketch's default lane kills all seven mutants (M1, M2, M2c, M3a–d), so parity holds. **(b) does not bind, and no owner question arises.**
  - BA/PM's single-holder reading is corrected for "the seed is used": M3a has 15 other killers.
- **Forecast:** about −0.36 s of wall (693 of 738 ms in-thread, scaled from the −0.38 s probe). `G8` head about 9.4–9.55 s.
- **Records:**
  - `ADR-0046`: a Status pointer, and § Dated 2026-11-04, which carries build conditions 1–5 and the A6 freeze recommendation;
  - `ADR-0050`: a Status line;
  - notes `…e969c2f0` (observation) and `…d7b2b02b` (decision); raw files in `.grugops/context/arch-ABC-281/raw/`.
- **The DoR line, for BA/PM to write on the page** (row 11 does not say the Architect writes it): "11 ✅ 2026-11-04, Architect/Design (`arch-ABC-281`; `ADR-0046` § Dated 2026-11-04): R1 S, R2 S, R3 S; kill parity measured on seven mutants, option (b) does not bind, no owner question. Row 10 ✅. DoR 10/10: Ready."
- **Owed page lines (BA/PM):** A3 under all-S (lane total and file counts equal base); A4 (deep lanes + 1); A8's expected value (base − 0.36 s); `R-281-a` closed for the measured mutants. The board move is the Orchestrator's.
