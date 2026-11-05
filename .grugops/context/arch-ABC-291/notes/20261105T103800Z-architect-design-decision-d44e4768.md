---
id: 20261105T103800Z-architect-design-decision-d44e4768
kind: decision
by: architect-design
at: 2026-11-05T10:38:00Z
verified_by: 
confidence: high that TUNE_DEEP's rows read as stated, from the source at main and b297ab89; medium on the door reading and the ABC-306 route, which are Architect readings open to overruling; all proposed until the owner answers; nothing run
refs:
  - arch-ABC-291
  - ABC-291
  - ABC-292
  - ABC-290
  - ABC-293
  - ABC-295
  - ABC-305
  - ABC-306
  - EPIC-011
  - ADR-0075
  - ADR-0056
  - ADR-0067
  - ADR-0031
  - QE-271-h
  - b297ab89
  - dd88560f
  - orch-2026-10-30a/20261105T081031Z-orchestrator-decision-42f7fd67
  - bapm-wait-lines-1105/20261105T080806Z-ba-pm-observation-a717244e
  - bapm-wait-lines-1105/20261105T080806Z-ba-pm-decision-fbc5050f
  - arch-ABC-301-miss/20261105T004230Z-architect-design-decision-2b3440cf
supersedes: 
seal: sha256:97e73ef0080b0df2d6611cbc0d7387f9703a3db185e55fa2fb64d3f744e2c45a
---

# arch-ABC-291 item 3: the four carried items. Tool line at the merge; `ABC-306` only on a yes that names it; E5 counts at the door; no second set of values after a miss

Architect/Design, task `arch-ABC-291`, records only. Line of record: `ADR-0075` d11 at `b99d10a0`, with dated lines in `ADR-0056` and `ADR-0067`. Each reads as proposed until his answer.

| item | answer | who settles |
|---|---|---|
| **`TUNE_DEEP` against a hand-valued term** (`…a717244e` 8) | The tool line lands at the term's merge: counts in the tracer, exports in the emitter, traced and held as `T_UN` is, 17 → 20 exports. `ABC-291`'s build follows `ABC-305` | Settled in d11 (a), for this term and as the pattern |
| **How `ABC-306` reaches a fit** (`…a717244e` 9) | Only on a yes that names it, by a value-identical landing at the shared weight, not at 0. It fails test 2 by default. The hold stands | The Architect, at that yes. His word chooses it |
| **E5 without per-piece mobility at the door** (`…a717244e` 10) | It counts. "E5" names the row, test 1 holds for each part, and each merged part counts if they split | Settled as a reading, open at any third-pull call |
| **No second set of values after a miss** (`…ba8265e9`) | A rule for this term on his acceptance. It narrows C2′'s "a changed form may come back": new values alone are not a form | Settled for this term. Each later ADR carries it to him |

## Why the tool line at the merge
By reading `tools/tune/tune.test.ts` on `main` and at `b297ab89`, nothing run: the gate rows compare the shipped `evaluate` with the tracer over `G3`'s 184, and at `b297ab89` a row holds the emission's exports equal to `main`'s, 17 of them. So a merge with real values would redden `TUNE_DEEP` twice. `ABC-305` A6 would STOP on it if that landing came later. And at real values the tracer is a second reading of d1 on the hot path, `QE-271-h`'s class. This supersedes, on this term, the pages' "each new export is owed to that pull's emitter change". `…6ccd8243` item 3 spoke of E4a at 0.

## The Orchestrator's two open points
- **`…42f7fd67` 2: `ABC-306` and Phase 4's close.** I find no record against his ruling. `…2b3440cf`'s list predates the split, `ADR-0056` D6's dated line leaves the list to him, and `EPIC-011` row 58's "Phase 4" is a home, not a closing rule.
- **`…fbc5050f` J10: does a miss on one term hold the next?** No. d11 (d) says so, with no record against it.
