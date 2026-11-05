# qe-ABC-282 gaps: QE-282-a BLOCKING (A4 is unread: the 40/15 check is over 1 h and needs the owner's word), QE-282-b MEDIUM (the `/tmp` quota), the rest LOW or INFO

The ticket's `## Scope`, `## Acceptance criteria` and `## Falsifiers` are the contract; cited, not restated.

- **QE-282-a, BLOCKING. A4 was not run.** M1 and M2 at 40/15 are `UNKNOWN - verify`.
  - `qe-ABC-223`'s run took 3 h 56 min. Under W1 the estimate is **3.3–3.7 h**, in one lock hold, over the 1 h line. Only the owner approves it, and no record holds his approval. D10's "not asked" covers A6.
  - It cannot be shortened or split: fewer than 5 games is not a reading, and D11 argues no shortening.
  - It is more than a formality. M2 is R-0071-1's watched row, D11's worst case is under 75 %, F5 sends a miss to Architect/Design, and A6's head read a least of 76.72 % at 40/8 against a 40/15 forecast of 87.8 %.
  - **The ticket line to rule on:** § Dependencies says "The merge waits on A6 only". QE reads that as written against the old wait on the ADR's acceptance, not as waiving A4, which is still a bar with its own falsifier. If the Orchestrator reads it otherwise, that is his ruling to record.
  - **To close:** ask the owner. A4 needs about 3.5 h of lock, which holds up every other hop, and two clones' worth of disk (QE-282-b).
- **QE-282-b, MEDIUM. `/tmp`'s per-user quota is nearly full, and it fails silently.** Hard 11.79 GiB, 0.31–0.96 GiB free across this hop. Other hops' scratch holds most of it; QE touched none of it. It stopped A6's launch 1, and in two windows new files stayed 0 bytes while node exited 0, so an empty result can read as a pass. Any hop on this host can hit this. **Ask:** the Orchestrator clears finished hops' scratch; driver outputs should be checked for a line count.
- **QE-282-c, LOW. A6's harness ran from a small `--shared` checkout**, because of QE-282-b (`…5833fc48`, `…0680580d`). `tools/`, `src/` and the dry run were equal to the worktree, the builds are by SHA, and the candidate's dist hash matched launch 1's. `machine.txt` records `harness: <repo> at 701326a5`.
- **QE-282-d, LOW. ALONE did not fully hold.** Foreign vitest during A6 (6 of 137 samples) and twin round 8. At 22:33Z a `ps` showed another repository's gate vitest, outside this lock. Whether that was the same process in those windows is `UNKNOWN - verify`. Nothing was killed. A6 was played through it by both sides, and the twin's grade does not rest on that round.
- **QE-282-e, LOW. QE's own process slips, disclosed:** the PREREG's sweep count (2 280 for 1 140); the amendment sealed a dry-run sentence before reading its failure (`…0680580d`); launch 3 went past the PREREG's "once more", sealed before any game.
- **QE-282-f, LOW. `ABC-221` A10 at the ceiling:** see the pin. Owed: the row's title (three → four), and the `AGENTS.md` lane line and `ABC-221` page line SE already listed.
- **QE-282-g, LOW. The ticket's A0 tables are the old base's** (`5853d17f`). `…aadd2d48` holds the rows that bind. BA/PM owes the page.
- **QE-282-h, INFO. A6 does not prove a gain:** +45.4 ± 60.7, harness label NEUTRAL, bar met.
- **QE-282-i, INFO. D12's multi-pass paths are almost unreached at the shipped soft limit:** 0 of 151 aborts. Their committed rows use `softMs = budget`, not a shipped value, as SE said.
- **QE-282-j, INFO. A merge-time check:** today `main`'s `src/` equals the base. If `ABC-303` or `ABC-301` lands first, the counts are re-read before merge (QE-283-i's precedent). The game read is not.
- **Coverage:** no threshold applies in lean mode, and no coverage run was made. `UNKNOWN - verify`.
