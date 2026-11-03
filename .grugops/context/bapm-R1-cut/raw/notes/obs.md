# bapm-R1-cut: open items after this hop. **Orchestrator:** place `ABC-275` (Ready) and then `ABC-273` before the next value-changing merge; move `ABC-273` to Ready when `ABC-275` merges (or queue a records hop); decide whether `ABC-273`'s P3 should rise to match the placement ruling (left at P3 here, the brief did not ask). **Architect:** none owed. **Owner:** nothing new; `ADR-0067` acceptance, Q-3K-6, Q-3K-7 (a)/(b)/(c), Q-3K-8, Q-3K-9, B-T8 stay pending

BA/PM, task `bapm-R1-cut`, records only, at `main` `30d15584`. Nothing run.

- **Priority mismatch recorded, not hidden:** the Architect's owed-lines note `…1fa63931` item 2 wrote P3 for the tools ticket. The brief set P2. The page follows the brief and says so.
- **A tension the Orchestrator may want to rule:** `ABC-273` is DoR 10/10 but stays Backlog on a hard, unmerged dependency (`ABC-275`), per the Architect's line. It is not "almost ready": every DoR row holds, and the only wait is a merge.
- **Not in this fence, seen in passing:** `plans/board.md` line 1 already names `ABC-275`; no card exists for it yet (the Orchestrator's). The `QE-269-j` line (env vars in QE briefs) is recorded on the board as done by the Orchestrator.
- **No `UNKNOWN - verify` added.** Two estimates carried as estimates: R1's 0.4–0.9 h and the 1 730–1 840 at 100 ms (both the Architect's, `…8136b589`).
