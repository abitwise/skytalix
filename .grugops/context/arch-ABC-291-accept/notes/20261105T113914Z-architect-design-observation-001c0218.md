---
id: 20261105T113914Z-architect-design-observation-001c0218
kind: observation
by: architect-design
at: 2026-11-05T11:39:14Z
verified_by: 
confidence: high on what the records hold; items 1 to 3 are readings of the brief, open to the Orchestrator's overruling; nothing run
refs:
  - arch-ABC-291-accept
  - ABC-291
  - ADR-0075
  - ADR-0056
  - ADR-0067
supersedes: 
seal: sha256:8b59e5840aade99db047e2f52af22f0ac1abae67747999eee0f224fa56bd3767
---

# arch-ABC-291-accept: where the brief's letter and the records differ

1. **"Index line to match": there is no index line.** `memory-bank/00-index.md` has no per-ADR rows, and `memory-bank/50-decisions/` holds no index file. `ADR-0075` is named outside the ADRs only in the queue, `plans/board.md` and `plans/traceability.md`. `arch-adr0007-bin-note`'s Result records the same absence. No line was added, and no index was made: both would be new form, and `00-index.md` is outside this hop's fence. The nearest lines are the Status head and the decision log, and both read accepted. `plans/board.md`'s `ABC-291` row still reads "ADR-0075 PROPOSED"; the board is the Orchestrator's.
2. **One word beyond "proposed" moved, in `ADR-0067`.** The dated head read "`ADR-0075` PROPOSED, so these lines read as proposed until his answer". The swap alone reads "accepted until his answer", which is false. "until" became "from". Nothing else in that line moved.
3. **`ADR-0067`'s log row of `arch-ABC-291` was read as a dated line,** so its "as proposed with" reads "as accepted with". The row still names `arch-ABC-291` as its record. No new log row was added in `ADR-0056` or `ADR-0067`: the brief says words otherwise unchanged. The acceptance's log rows are in `ADR-0075`.
4. **"and acceptance is the owner's", in `ADR-0056`'s dated line, stays.** It is still true, and the brief leaves it.
5. **Base.** The brief was cut at `1d0c7acc`. `main` had moved to `a6ae8227` (`ABC-282`'s merge) when this branch was cut, so the branch is from `a6ae8227`. Between the two, no file under `memory-bank/` changed and no Orchestrator decision note was added.
