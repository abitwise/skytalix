---
id: 20261103T130342Z-qe-e2e-observation-3a9a2d4f
kind: observation
by: qe-e2e
at: 2026-11-03T13:03:42Z
verified_by: 
confidence: high on the facts (read and run); severity is QE's judgement: LOW for a doc-only stale usage line the ticket's A3 item 3 pins
refs:
  - qe-ABC-275
  - grugops/ABC-275
  - ABC-275
  - ABC-273
  - QE-275-a
  - QE-275-b
  - QE-275-c
  - QE-275-d
  - QE-255-a
  - QE-255-b
  - b3436c3a
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - se-ABC-275/20261103T125536Z-software-engineer-decision-28ef48dc
supersedes: 
seal: sha256:0de974c51c325c8ab693851885a63357fc60055456897140d98e5e5d6a8136da
---

# qe-ABC-275 gaps: QE-275-a LOW (stale usage text), QE-275-b/c/d INFO. Nothing blocks merge

- **QE-275-a. LOW. Owner: BA/PM (ticket follow-up or fold-in), then SE.** The usage text is stale. `rating.ts` `usage()` still reads `r <sha> <out-dir> [--elo E] [--budget-ms 500] …` and `--budget-ms: R 500 only (default 4000)`. Since `b3436c3a`, r also takes 100.
  - **Why it is a gap and not a defect:** A3 item 3 says `rpair … --budget-ms 100` is refused "with today's message (… `rpair`'s usage text)". usage() is one shared string, so editing r's line changes rpair's refusal bytes. The Engineer kept it byte-equal, which is the compliant reading. The thrown refusal names "500 or 100", so nothing misleads anyone who passes a wrong value.
  - **Why LOW:** documentation only. R1's operator is QE, running the Architect's pinned command (`…8136b589` § 2), not the usage text. The cost is a reader of `--help`-style output who never learns about 100.
  - **Fix:** two lines in `usage()` (`[--budget-ms 500|100]`, `R 500 or 100`), plus a deliberate re-reading of A3 item 3 by BA/PM. pair-check only matches `/usage/`, so no row breaks. It can ride the next `tools/rating/` ticket.
- **QE-275-b. INFO. No owner (QE-255-b stands as ruled).** `--budget-ms 1e2`, `0x64` and ` 100` are accepted as 100, exactly as 500's forms are (ticket Out of scope: "The value 100 parses exactly as 500 does"). One knock-on: the E-guard message echoes the raw flag text (for example "`at --budget-ms 1e2`"). Cosmetic.
- **QE-275-c. INFO. Owner: QE at `ABC-273` R1-A2.** A6 is unverified offline. `machine.txt`'s r-100 `control:` line and `cmd.txt`'s Stockfish `st=0.1 timemargin=2000` were read in the code, not produced. UNKNOWN - verify at R1. No offline row is owed (ticket A6, `QE-255-a` precedent).
- **QE-275-d. INFO. No owner.** The A1 pair-check rows read Stockfish's `cmd=` token from the print itself (they assert only `/^cmd=/`), so the whole-vector `deepEqual` does not pin that one token. QE's independent A1 vector pins it as `cmd=<stockfish>`. The mutants show the rows still catch every control-token change.
- **Not a gap:** the renamed ABC-255 row swapped its `100` case for `50`. Acceptance of 100 is asserted by the new A1 rows, so the row's meaning is "inverted" as the ticket asks.
