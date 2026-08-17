---
id: 20260817T210200Z-software-engineer-claim-limits-and-what-is-not-verified-2e6c8b9f
kind: claim
by: software-engineer
at: 2026-08-17T21:02:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-103
  - ADR-0005
  - NFR-008
  - src/search.ts
supersedes:
---

# What this ticket did NOT establish — read before quoting anything from it

Recorded as a `claim` at `UNKNOWN - verify` on purpose: every item below is something I did not
measure, and the honest confidence in "it is fine" is not high.

1. **A green `A1` says nothing about the evaluation.** Both of its sides call the same `evaluate()`
   (`G2`). `ABC-076`'s own guard was found blind to its piece-square table CONTENTS. So the search
   is now proven to maximise `evaluate()` faithfully, and `evaluate()` is proven to be what it is —
   which is not the same as proven right. **Do not read "the engine plays well" out of this
   ticket.**

2. **`A2`'s own case runs only in the opt-in lane.** kiwipete at depth 3 measured 9.0%, but it costs
   ~700 ms and sits behind `SEARCH_DEEP=1`. The default lane's `A2` guard is startpos at depth 2
   (27.1%). **A pruning regression visible only at depth 3 would pass `npm test`.** The mitigation is
   a documented command in `AGENTS.md`, not a gate; nobody is forced to run it.

3. **The depth figures are DIAGNOSTICS from a loaded machine, single runs, no warm-up.** Load
   average 24.77 on 8 cores. No depth verdict is taken and none may be inferred — `ABC-078` owns the
   budget and the clock.

4. **The `N8-LANE` reading uses a run-pairing protocol, not the catalog's tree-pairing protocol.**
   Median 625 ms CPU, sign 8/8, null control −0.005 s at 4/8, 465 ms net of the 160 ms floor against
   a 650 ms bar. It is inside the bar with margin, but it is my instrument, on a loaded machine, and
   Architect/Design owns that row.

5. **The lane TOTAL (without this file) read 11.3-13.3 s CPU on this machine against `NFR-008`'s
   13 s clause.** That is an incidental observation from a delta instrument under heavy load, NOT a
   measurement of `NFR-008` and NOT a verdict. Someone should measure it properly; it is not mine.

6. **Parallelism was not decided and must not be read as decided.** `ADR-0005` `F6` is
   `UNKNOWN - verify` and is Architect/Design's. The module is single-threaded because that is where
   every shape of that decision starts.

7. **Quiescence, move ordering, the transposition table, in-tree repetition and the wall clock are
   absent by design** (`ABC-079`/`ABC-080`/`ABC-081`/`ABC-078`). The consequence to expect: the
   scores this search returns are horizon-limited and will change — sometimes a lot — when
   quiescence lands. The node counts will change when ordering lands.

8. **The page's § Dependencies still says `ABC-076` is OPEN.** It is merged. `G1` said not to edit
   the page and I did not. **The stale sentence is still there** and is the page-owner's to repair.

9. **`ABC-103`'s tax was paid again rather than fixed.** `src/cli.test.ts`'s hand-maintained module
   count moved 22 → 23. Fixing the pattern was out of scope for this ticket; the fourth data point
   is now on the record.

10. **No UAT and no QE hop has happened.** This is an engineer's report on an engineer's branch.
    Per `AGENTS.md` § QE validation authority, `ABC-077` cannot leave `In Review` without QE's
    recorded verdict — and this ticket carries production lines, so the zero-production-lines UAT
    waiver does NOT apply to it.
