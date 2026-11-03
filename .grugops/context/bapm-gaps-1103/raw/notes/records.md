# bapm-gaps-1103 records: ABC-276 and ABC-277 Done; EPIC-011 rows 28–30; trace row; proposed board lines

- **`ABC-276` → Done.** Page front matter `status: done`, `column: Done`, and a `closed:` line. A CLOSED block gives the A1–A7 table (all MET, from QE `…a79db6c1`) and the gap routing (QE-276-a/b accepted LOW with triggers; -c to QE; -d no owner). Merged `3dd27cfc` from `grugops/ABC-276` at `b4f962c5`, code `f4c52d62`.
- **`ABC-277` → Done.** Front matter as above. A CLOSED block gives A1–A6 MET, A7 not done (owner SEC-HP-2 pending, the ticket's own skip path) and the NFRs MET (from QE `…98c1d275`), with QE-277-a…-f routed to `ABC-278` and -g accepted. Merged `541ddf45` from `grugops/ABC-277` at `0f188473`, code `861de9c5`.
- **`EPIC-011`:**
  - a dated top block;
  - § Tickets rows 28 and 29 struck from Ready to Done;
  - new row 30 for `ABC-278` (S upper end, P2, Ready, 10/10);
  - the ids line notes that `ABC-278` is taken.
- **`plans/traceability.md`:** one appended row, `bapm-gaps-1103`.
- **Not touched:** `plans/board.md`, ADRs, `src/`, `tools/`, `memory-bank/`. Nothing pushed or merged. The only run was the records path check (with the real HOME, under the host lock) and this seal.
- **Proposed board lines (the Orchestrator's to place):**
  - `- [ABC-278] Ready 2026-11-03 (cut bapm-gaps-1103; S, P2, DoR 10/10) Records path check hardened: text diff whatever .gitattributes says (QE-277-a MEDIUM), .xz decompressed, wider foreign-argv (≤ 10 new non-process hits), home before . - _, quoted names clean, both homes + runbook real-HOME line (EPIC-011 hygiene; tools/grugops + 1 runbook line)`
  - ABC-276 card: append `QE-276-a/b accepted LOW with re-open triggers on the page (bapm-gaps-1103); page Done`.
  - ABC-277 card: append `QE-277-a…f → ABC-278 (bapm-gaps-1103); page Done; A7 owner pending`.
- **Open for others:** Orchestrator: board cards, pull `ABC-278`. Owner: SEC-HP-2 (ABC-277 A7), pending. QE: QE-276-c at the next r/d reading.
