---
id: 20260919T074200Z-software-engineer-claim-limits-and-what-is-not-verified-5e7a9c13
kind: claim
by: software-engineer
at: 2026-09-19T07:42:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-080
  - ABC-084
  - ADR-0003
  - ADR-0019
  - NFR-008
  - AGENTS.md
  - src/quiescence.test.ts
supersedes:
---

# What this hop did NOT establish — read before quoting anything from it

Recorded as a `claim` at `UNKNOWN - verify` on purpose.

1. **Every CPU and wall figure was taken on a LOADED machine.** Two sibling hops ran concurrently
   throughout; load average 2.4–9.2 on 8 cores, and the "before" lane reading (16.95 s CPU) is
   already above the 15 s level that `plans/nfr-catalog.md` records as 14.940 s on a quiet
   machine. The DELTA (+19 s CPU, +12 s wall) is attributable; the absolute readings are not
   comparable to the catalog's. The N8-LANE paired runs and the deep lanes overlapped each other
   in time as well. Node counts and multipliers are deterministic and unaffected.

2. **The multiplier's cause is not proven to be ordering alone.** The diagnostic (MVV-LVA cuts
   it ~25x; still 17x–33x) was one scratch variant at depth 2 on two positions. It says what the
   number is SENSITIVE to, not what the right fix is. `ABC-080` landing first is a hypothesis
   for Architect/Design, not a finding.

3. **`A1` is proven at depth 1 and reported at depth 3.** The hanging-piece corpus is 24
   hand-built miniatures where the losing capture is the ONLY tempting capture. It is not a
   puzzle set; `ABC-084`'s real budgets and real positions are still owed. At depth 3 the bare
   leaf sees the recapture too, so the "strictly worse" clause holds only at odd, shallow depth.

4. **`A4`'s "pre-quiescence build" is the door, not a checkout.** `searchWithoutQuiescence`
   reproduces the base build's recorded fingerprints (position-6: 47 / 562 / 14 565 nodes;
   g5f6 / g5f6 / c3d5) and the node-identity proof on quiet positions is exact, but no scores
   were captured from an actual checkout of `4f0ef01` — the PreToolUse hook refused every
   `git show`/`git archive` form tried.

5. **The `SEARCH_DEEP=1` command slot for `src/quiescence.test.ts` is NOT in `AGENTS.md`** — the
   file is fenced for this hop. The lane exists and is documented in the test file's header; the
   slot is the Orchestrator's to add.

6. **Three `src/engine.test.ts` fixtures are red and their replacement fixtures were not
   designed.** Whatever budgets and bounds replace them depend on the multiplier that is ruled,
   so designing them now would be designing around 1 500x.
