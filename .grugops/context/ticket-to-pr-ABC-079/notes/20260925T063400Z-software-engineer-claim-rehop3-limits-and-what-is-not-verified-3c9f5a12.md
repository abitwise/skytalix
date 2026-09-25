---
id: 20260925T063400Z-software-engineer-claim-rehop3-limits-and-what-is-not-verified-3c9f5a12
kind: claim
by: software-engineer
at: 2026-09-25T06:34:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-114
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
supersedes:
---

# What re-hop 3 did NOT establish

1. **The oracle was not re-run.** The pins are the ruling's oracle-checked values, and this hop
   did not repeat the 161.9 s and 28.0 s `searchWithoutPruning(p, 3)` runs. What this hop shows
   is that shipped `search()` still returns exactly those values (the pinned rows are green) and
   that `R2b`/`R2c` red them.
2. **Only `R2b` and `R2c` were re-applied**, as the licence asks. `R2a` was not re-run against
   the pins. The ruling's probe says it moves kiwipete's answer too, but no red row for it was
   produced here.
3. **Every wall time is one run at load 2.2–4.0.** That is a quieter machine than QE's 2.7–9.8,
   and it is not the catalog's quiet-machine protocol. The worst deep case is 40.1%, so crossing
   120 s would take about 2.5x this reading. That margin is an estimate from one reading.
4. **`NFR-008` was not measured.** It is fenced, and the ruling says the split adds cases but no
   searches. The default lane's case count is unchanged at 1392, and no default-lane test body
   changed. Whether the lane's CPU moved is `UNKNOWN - verify`. It is not expected to move.
5. **`ENGINE_DEEP=1` and `src/search.qe.test.ts` were not re-run under a deep flag.** Nothing
   they import changed in code. `src/search.ts`'s token stream is identical, and they ran green
   in the default lane.
6. **The D1–D4 rewrite is my reading of the ruling's table.** Whether QE reads the new sentences
   as true is QE's call on re-QE. The `A1` banner at `search.test.ts:352` was changed as the
   ruling added it. Whether QE would have counted it is still `UNKNOWN - verify` (the ruling's
   claim, item 6).
7. **The Scribe's `AGENTS.md` `Quiescence deep lane` entry is not written.** It is fenced, and it
   is owed after the hop, per the ruling's "Not in this ruling".
8. **This branch carries the queue move for `ticket-to-pr-ABC-079-rehop3`**
   (pending → claimed → done), because the pending file exists on this branch's base (`9a7e549`).
   Nothing was merged or pushed.
