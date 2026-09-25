---
id: 20260924T201400Z-software-engineer-claim-rehop2-limits-and-what-is-not-verified-d38f5b72
kind: claim
by: software-engineer
at: 2026-09-24T20:14:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-077
  - NFR-005
  - NFR-008
  - src/search.test.ts
  - src/search.ts
  - AGENTS.md
supersedes: 20260919T094000Z-software-engineer-claim-rehop-limits-and-what-is-not-verified-5a7c9eb6
---

# What re-hop 2 did NOT establish. Read this before quoting anything from it

1. **The commits are not on `grugops/ABC-079-quiescence`.** Two other worktrees hold that
   branch, and this agent could not inspect or release them. The work is on
   `grugops/ABC-079-quiescence-rehop2`, a strict fast-forward of it. Moving the named branch is
   the Orchestrator's step (decision note §4).
2. **`A4`'s deep case is at 61% of its 120 s timeout** (73.6 s at load 3.9–7.9). Across three
   runs it has read 50%, 69% and 61%. This hop does not touch it, and the ruling gives its
   remedy to a new ruling. It is the first case in this lane to go red on a busy day.
3. **Every deep-lane second is one run.** Load was 3.9–7.9 on the search lane and ~6–7 on the
   other two. Node counts and scores are exact; durations are not medians.
4. **`NFR-008` / `N8-LANE` were read at load 17–35.** The full-lane subtraction figures contain
   an impossible negative charge. Only the standalone two-file pairing (+0.20 s median) is worth
   reading, and even that is loaded. Nothing is claimed MET.
5. **The residual gap the ruling names is not mutation-tested here.** No mutant was built that
   only a quiescence-on depth-3 pair on a capture-dense board would catch. The gap is argued in
   the ruling and restated in the file header, not measured.
6. **`NFR-005` in the `ENGINE_DEEP` run read depth 2 on BOTH kiwipete and position-6** (re-hop 1
   read 2 and 3). This hop changed no code on that path. The reading tracks the moment's node
   rate, and it is reported, not ruled.
7. **The `AGENTS.md` deep-lane lines are still owed by the Scribe.** The `search.test.ts` entry's
   "23.0 s" is still false at this tip. The measured replacement is 43 passed, exit 0, 125.5 s,
   at `33b9a02`, load 3.9–7.9.
8. **`src/search.ts`'s `Switches` docblock and module header were left as they were**, per the
   ruling's "nothing else in the file changes". They do not mention the both-off door
   (decision note §1).
