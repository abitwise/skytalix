---
id: 20261104T214523Z-architect-design-decision-8c6e7ec0
kind: decision
by: architect-design
at: 2026-11-04T21:45:23Z
verified_by: 
confidence: high on the lines that carry QE's and the Orchestrator's rulings and on the door comparison read from source; medium on the run-rule reading; UNKNOWN - verify on R3's kills until run; nothing run
refs:
  - arch-records-1104
  - ABC-301
  - ABC-302
  - ABC-289
  - ABC-271
  - ABC-274
  - ABC-248
  - ABC-281
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - ADR-0056
  - ADR-0046
  - ADR-0064
  - ADR-0074
  - ADR-0066
  - ADR-0024
  - NFR-008
  - QE-271-h
  - QE-301-a
  - QE-301-b
  - QE-301-d
  - R-281-a
  - OQ-0074-1
  - ca00e4a5
  - a1e19981
  - 83894094
  - 57e942fb
  - arch-records-1104/20261104T214318Z-architect-design-decision-c9056f1d
  - qe-ABC-301-s0/20261104T213516Z-qe-e2e-decision-9fd32f43
  - qe-ABC-301-s0/20261104T213516Z-qe-e2e-observation-270757f7
  - qe-ABC-302/20261104T202949Z-qe-e2e-decision-051a910d
  - arch-ABC-289/20261104T204820Z-architect-design-decision-62012bbe
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - secnfr-ABC-302-a9/20261104T203737Z-security-nfr-decision-0089724b
  - orch-2026-10-30a/20261104T212001Z-orchestrator-decision-878035ca
  - orch-2026-10-30a/20261104T212555Z-orchestrator-decision-0edae6fd
  - orch-2026-10-30a/20261104T205921Z-orchestrator-decision-5ec6c124
  - orch-2026-10-30a/20261104T203052Z-orchestrator-decision-264a280a
  - src/search.futility.test.ts
supersedes: 
seal: sha256:38d7332dcc1c4142a7256bde5416a0b4ef1d6a7e8f6dd68646b24ce348f1bc7a
---

# arch-records-1104 lines: P1's own-phase form, the tracer's conditional line, row Q2 and QE-302's LOW carry are written. ADR-0046 changes one word of the run rule and asks one re-point; `ADR-0066` d5 waits for W1's merge

Architect/Design, task `arch-records-1104`, records only, on `grugops/arch-records-1104` from `main` `83894094`. Nothing was run. All the lines below are in commit `ca00e4a5`; the two-row ruling is `…c9056f1d`, at `a1e19981`. No bar, level, NFR, cap, pin or W moves.

| ADR | place | line |
|---|---|---|
| `ADR-0070` | d4, § Status, log | `QE-271-h`'s row takes the own-phase form in QE's wording (`…9fd32f43`). The forced form reads 31 / 44 because U fires on the argument. Exact on 44 / 44; limits `QE-301-a` and `QE-301-d` named |
| `ADR-0067` | precondition 1, log | reads that form; built at `57e942fb` |
| `ADR-0067` | d5, log | the tracer row reads the seam through QE's frozen fixtures, on condition `TUNE_DEEP` is green at the fit commit. Check 2 stays a hard step, and does not see a crossed emitter column (`QE-301-b`) |
| `ADR-0056` | row Q2, D2 dated line | basis "pre-registered: D200b +0.279 ply, d8 0.64–0.83×"; dependency and ticket cells brought up to date; +5–20 stays an estimate |
| `ADR-0046` | § Status, new dated section | `QE-302`'s LOW carry, below |

**`QE-302`'s LOW carry: what should change.**
1. **The run rule's "four lines" reads thirteen.** `ABC-302`'s nine rows joined under rule item 3, but the text still said four. The nine are now listed once. `qe-ABC-302` read all thirteen, each 0–1 s.
2. **R3 should re-point at the file's next touch.** Its blindness has a cause older than `ABC-302`: `search()` against the futility door differs by five other features. `searchWithoutTaper` / `chooseMoveWithoutTaper` differ from the futility doors in `futility` alone, read from the source. It must then read 1 passed unmutated and red under M3 and M3s, which is `UNKNOWN - verify` until run; if not, the row stays. Test-only, deep lane, no bar waits on it.
3. **No change:** deep-only breadth, which the run rule answers; R9 outside `AGENTS.md`'s engine line, which the rule reaches, with 3 B of headroom in that file; parity on the 27, a property of a sealed list.

**Readings to check.** I took the rule's "joins the table" as the nine belonging to the thirteen, as `qe-ABC-282`'s brief already does. That R3's not being re-pointed under `ADR-0064` d7 came from `toBeLessThan` staying green is my inference, and the line says so.

**Not written:** `ADR-0066` d5's line waits for W1's merge, per the brief. `ADR-0024` waits on the owner's acceptance of `ADR-0074`.

**For the Orchestrator.**
- `se-ABC-301-fit` needs this branch on `main` for scope 4. The ruling is at `a1e19981`.
- BA/PM owes `ABC-301`: P1's "PROVISIONAL" banner read as confirmed, and test note 4's "re-pinned or retired" read as one of each. `ABC-302`'s page is not changed by this line.
- QE briefs that fire the rule carry thirteen lines. `ABC-301` fires it (`src/evaluate-params.ts`).
- R3's re-point is BA/PM's to attach to a ticket.
- `qe-ABC-301-s0`'s notes are cited by id and sit on an unmerged branch until that merge.
