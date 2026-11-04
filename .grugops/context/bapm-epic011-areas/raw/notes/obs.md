# Artifacts of bapm-epic011-areas, the ABC-271 lines folded into EPIC-011, the R-281-a pointer, and what was observed on the way

**Artifacts** (branch grugops/bapm-epic011-areas):
- claim 8a0bb876;
- merge of main 9dc1644f (main had moved 350a383b → b274711c with bapm-ABC-271-ready; no EPIC-011 change in it);
- records aebc9783.

**The records:**
- 16 new pages under plans/tickets/, ABC-284 … ABC-299.
- EPIC-011:
  - a dated top block;
  - § Phases: 17 rows, the stub-id rule, the Q2 line;
  - § "P1, parked";
  - § Tickets: row 23, new rows 36–51, the ids line;
  - § Owner questions: a dated header, rows Q-3K-10, the d6 amendment and B-T8 re-confirmation;
  - § Dependencies: one dated bullet.
- memory-bank/40-contributing.md § Conventions: one pointer paragraph to ADR-0046's last dated section (R-281-a's run-frequency rule). This was the only memory-bank edit.
- records-path-check --base main: clean, exit 0.

**ABC-271's owed EPIC-011 lines** (arch-ADR-0070-accept …212d6a4c § 5), all written; ABC-271's page was not touched:
- Row E4: E4a → ADR-0070 ACCEPTED, form (a), structure only at 0.
- Row E2: the second pull fits KD and FP (eg ≥ 0, mg 0) and holds PASSED_UNSTOPPABLE at 0. It is a new attempt under F6 with its own PREREG.
- § Dependencies: ABC-271 → the second pull, one read judging both.
- § Owner questions: the d6 amendment and B-T8's re-confirmation.
- § Tickets row 23 was aligned to the merged page (af0b0ae6): S, Ready, 10/10. This was read from the page, not decided here. Its title cell is left as cut.

**Observed:**
1. **E2's second pull has no ticket id.** The ruled order and every Phase 4 page wait on it. Cutting it is not this brief's; it is named for the Orchestrator.
2. **P1's named example premise (E1's changed tree, ADR-0056 D6's dated line of 2026-11-03) has been on main since 54dee3f2.** No P1 re-probe on it is on record (UNKNOWN - verify: grep of ADR-0060 § Status shows none after arch-post-268).
3. **The tools/tune emitter writes 13 exports** (…6ccd8243 item 3). Every new evaluation export in ABC-290 … ABC-293 is owed to a pull's tools change.
4. **The git merge commit 9dc1644f carries git's default message without the Co-Authored-By line.** It was not amended (amend is fenced).
5. **No board, ADR or src/ edit.** Nothing is running.
