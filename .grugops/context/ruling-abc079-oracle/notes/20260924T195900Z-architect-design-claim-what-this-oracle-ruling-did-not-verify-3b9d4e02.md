---
id: 20260924T195900Z-architect-design-claim-what-this-oracle-ruling-did-not-verify-3b9d4e02
kind: claim
by: architect-design
at: 2026-09-24T19:59:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-077
  - NFR-008
  - src/search.test.ts
  - AGENTS.md
supersedes:
---

# What this ruling did NOT establish

1. **The edited lane was not run, because there is no edited lane yet.** Every option was timed
   out of tree. The option (a) cells come from a vitest harness with the repository's
   `pool: "threads"`; its control reproduced the real file's `position-4` depth-3 case at 22.0 s
   against 22.9 s. The whole-lane wall after the Engineer's hop is **estimated, not measured**:
   roughly 100–140 s at load ~4, summed from the cells below and dominated by `A4`'s deep case
   and kiwipete's quiescence-on depth-2 pair. The Engineer's run is the record.
2. **`A4`'s deep case is the lane's next-closest cell to its timeout, and this ruling does not
   touch it.** It read 60.4 s against 120 s at load 4.2 (the real file, `-t`, this session),
   which is 50%. The Engineer read 82.7 s at load 10 → 4, which is 69%. It runs the SHIPPED
   quiescence search over the corpora, so no oracle change reaches it. If it goes red on a
   busier day, the remedy belongs to a new ruling, not to this one.
3. **The ~5x vitest-over-node factor is measured, but its cause is not.** On the same machine
   and at the same load, `src/`'s own exports run `position-4` depth 3 in 4.5 s in plain node
   and 22.0 s in a vitest worker; `position-5` runs in 9.2 s and 44.3 s. The likely cause is the
   runner's transformed module imports on a hot recursion (`UNKNOWN - verify`). Every pass/fail
   verdict in the probe table was therefore taken under vitest, never scaled from node.
4. **Every wall time is a load-3.4–10 wall time.** Sibling hops were live throughout. Node
   counts and scores are exact; the seconds are not the catalog's quiet-machine protocol, and
   each figure is one run, not a median.
5. **The residual gap in option (a) is argued, not mutation-tested.** No mutant was built that
   is caught ONLY by a quiescence-on depth-3 pair on a capture-dense board. The claim that each
   half of the conjunction stays covered comes from reading the window flow in
   `src/search.ts`. QE is the natural owner of that mutant if one is wanted.
6. **The `AGENTS.md` lines are named, not written.** They are the Scribe's, and must carry the
   Engineer's measured numbers rather than this probe's.
