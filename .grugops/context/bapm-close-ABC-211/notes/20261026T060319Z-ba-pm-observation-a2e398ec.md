---
id: 20261026T060319Z-ba-pm-observation-a2e398ec
kind: observation
by: ba-pm
at: 2026-10-26T06:03:19Z
verified_by: 
confidence: high (each item re-read at ba74b71d; git reads only)
refs:
  - ABC-211
  - ABC-208
  - EPIC-008
  - ADR-0023
  - ADR-0050
  - QE-207-f
  - A1
  - plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - owner-word-2026-10-26/20261026T055855Z-orchestrator-decision-58bcd17c
  - arch-source-ABC-211/20261026T011145Z-architect-design-decision-7bb8daf1
  - arch-source-ABC-211/20261026T011145Z-architect-design-observation-a1ddd6fb
  - grugops/bapm-close-ABC-211
  - ba74b71d
  - qe-ABC-207/20261026T005119Z-qe-e2e-decision-cc744e8c
  - 85db3a64
  - 1d2fd467
  - NFR-006
supersedes: 
seal: sha256:d84b776e18c3ce275e88a9cdeadddd9c94f183cfec329cd1af7358139fd68ab1
---

# BA/PM re-reads for ABC-211's close at main ba74b71d: the owner's word, the source ruling, the book bytes, and the close convention

Task `bapm-close-ABC-211`, at `main` `ba74b71d`. Records and `git` reads only. No npm, vitest, build or timing.

1. **The owner's word** (`…58bcd17c`), verbatim: *"accept ADR-0050, O0 for ABC-211, close LIC-PUB-1"*. Item 2 routes
   this hop and says no veto is left open, because O0 is the owner's own pick.
2. **The source ruling** (`…7bb8daf1`, read-backs `…a1ddd6fb`): 0 of 3,865 rows of `lichess-org/chess-openings`
   `a6189a30` reach the position after 1.c4 c5 2.Nc3 Nf6 3.Nf3 b6. Upstream `master` equals the pin. `QE-207-f`
   (`…cc744e8c`): base plays 4.d3 there (depth 8, +56).
3. **The ruling is on `main`.** `grugops/arch-source-ABC-211` is an ancestor of `main` (merge `85db3a64`).
4. **No build for `ABC-211` exists.** No `grugops/ABC-211` branch. `data/opening-book/book.json` is 356 526 B, and the last
   commit touching `data/opening-book` or `tools/opening-book` is `1d2fd467` (`ABC-160`). Nothing to revert.
5. **The close convention.** `status: dropped`, `column: Done` is used by 8 pages, `ABC-205` and `ABC-207` among them.
   Both carry a dated banner under the title and a `## Close` section.
6. **`ABC-208`'s page** read `adr: "ADR-0050 (PROPOSED; …)"` before this hop. Its frontmatter reads `status: ready`,
   `column: Ready`, while the board holds it In Review. Page columns lag the board on other pages too (`ABC-204`,
   `ABC-215`), so this hop leaves them alone.
7. **`ADR-0050` file status** still reads PROPOSED at `ba74b71d`. Recording it as accepted there is the
   `arch-accept-adr0050` hop's, not this one's.
