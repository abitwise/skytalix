# bapm-269-done decisions: `ABC-269` (E1) is recorded **Done** (merged to local `main` `54dee3f2` with cut C1; QE PASS_WITH_GAPS `…eff2fe64` signs UAT). `ABC-274` (E2-pre) is **DoR 10/10, Ready**; its merge still waits on the owner's *"accept ADR-0067"*. `ABC-270`–`ABC-273` no longer wait on E1 and stay 9/10. Each of QE's gaps `QE-269-f`…`k` has a named owner. The S′ pool is referenced, not computed. No bar moved

BA/PM, task `bapm-269-done`, records only, at `main` `128e3c6c`. Nothing run.

## Decisions
1. **`ABC-269` → Done.** Front matter `status: done`, `column: Done`, with a `closed:` line. A CLOSED block with the Result goes at the top of the page:
   - F3 fired once on `G2` (1.071 / 1.067 ×, `se-ABC-269` `…669f366c`). The one value-identical cut C1 (`…a0468a78`) re-read **1.0373 ×, MET** under PREREG `…e36ee7ca`.
   - QE's rows: B5 1 / 2 986, max 17 cp; B7 depth 9 / 10, medians equal base; B8 C2′ **57.0 / 100** (+49.0 ± 59.5 Elo); S′ 7.0 / 10 at E 1 810; Levels 57 / 57.
   - Post-merge `npm test` 2 566 / 2 566 (the Orchestrator's board line).
   - `ADR-0064` is in force from the merge by its own § Status ("not in force until this ticket merges"). The dated in-force line is the Architect's (`arch-post-269` item 1).
2. **QE's gaps and their owners** (`…9ba289c2`; none blocks):

   | gap | owner |
   |---|---|
   | `QE-269-f` | Architect/Design: `ABC-274`'s `G2` PREREG guidance, in `ADR-0067` F8 / A5 (`arch-post-269` item 2) |
   | `QE-269-g` | Architect/Design: PREREG wording (`arch-post-269` item 2) |
   | `QE-269-h` | none owed; a report, recorded on the page |
   | `QE-269-i` | none owed; recorded; C3″ is the net check |
   | `QE-269-j` | Orchestrator: the brief template or runbook line. The Architect names the variables in R1's command (`arch-post-269` item 4) |
   | `QE-269-k` | Architect/Design: the pool and any step, in `ADR-0056` S′ (`arch-post-269` item 3) |

   - QE named BA/PM for `-k`. The Orchestrator's brief routes the arithmetic to the Architect, who is updating the pool in parallel. BA/PM records the join on `EPIC-011` § Close-out and points to `ADR-0056`.
3. **`ABC-274`: DoR row 10 ✅ → 10/10, front matter `status: ready` / `column: Ready`** (precedent `dd8f0270`, `ABC-238`).
   - The pre-ticket head is `main` `54dee3f2`, `src/` `4d6b117b`. That is the tree QE graded (`git rev-parse`).
   - The Orchestrator has already moved it to In Development (`se-ABC-274`). The owner's `ADR-0067` acceptance is pending and gates the merge only.
4. **`ABC-270` / `271` / `272` / `273`:** the `ABC-269` wait is marked met in the header block, § Dependencies and DoR row 10. Each stays 9/10:
   - `ABC-270`: the design.
   - `ABC-271`: the ADR.
   - `ABC-272`: the probe and the ADR.
   - `ABC-273`: the control ruling, which is `arch-post-269` item 4.
   - **`ABC-239`:** its first hard wait is met.
5. **`EPIC-011`:**
   - a top block;
   - § Phases: E1 DONE; E2-pre Ready; R1's window open. **Phase 4 next: `ABC-274`.**
   - § Success measures G3: the tally reads **2 of 2** value-changing merges passed C2′ (`ABC-268` 58.0, `ABC-269` 57.0). Both are passes, not proven gains.
   - § Tickets: rows 12 and 21–26.
   - § Close-out, the S′ pool row: `ABC-269`'s 7.0 / 10 joins at E 1 810, and the count is the Architect's.
   - the `ADR-0064` owner row and the Phase 4 order line.
