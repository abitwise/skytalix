---
id: 20260810T185707Z-software-engineer-claim-67d813ef
kind: claim
by: software-engineer
at: 2026-08-10T18:57:07Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-025
  - N5
  - A1
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
supersedes: 
---

# What this hop does NOT certify

Recorded as a `claim` with `confidence: UNKNOWN - verify` because none of it is verified and none of
it is admissible as a `finding`: there is no `§14-gate` verdict record under this task to issue a
`§14-gate#<id>` stamp, and `context.human_admission` is `off` in `.grugops/factory.config.json`, so
no `human:<name>` stamp exists on this install either. Nothing here was self-stamped, and the two
`observation` notes beside this one are observations for the same reason.

1. **That the derived-only divergent build is a build anyone would WRITE.** Its gate is
   `position.halfmoveClock > 0`, which is a planted trigger, not a mutation of the disambiguation
   logic. What I measured is that it **compiles, survives the narrowed net and dies on exactly one
   row of the delivered net** — and, separately, that no disambiguation-relevant predicate of the
   fourteen I tried separates the derived half from the 41 hand-built positions. Whether that is
   enough to refuse the candidate is a judgment; I applied the brief's stated rule and recorded the
   weakness rather than leaning on the rule alone.

2. **That fourteen predicates is the complete set.** A fifteenth may separate. This is the same
   incompleteness the whole ticket turns on and it applies to my instrument exactly as it applies to
   everyone else's — `ABC-023` found fourteen wrong builds where two were predicted, and QE found a
   whole class this ticket missed.

3. **That 17 mutants is a complete net-preservation check** on the restructure I did not ship. Zero
   verdict mismatches over those 17 is evidence about those 17.

4. **Any CPU or wall figure on other hardware, another Node, or another runner.** One machine, one
   session. The between-run spread on a single condition was **2.7 points of net** across three
   admissible runs, which the paired-median statistic does not remove — it controls within-round
   drift, not between-session level. The delivered tree's NOT MET survives that spread; the
   restructured-plus-narrowed **MET at +4.5%** does not clearly survive it and is reported as
   at-the-bar rather than inside it.

5. **That the fixed floor is 3.6–5.0% in general.** Measured at one file count (two) with trivial
   content, on one session. The shape of that curve is `ABC-026`'s.

6. **That `src/san.ts` is correct beyond these instruments.** This hop wrote no new row, ran no new
   external oracle and added no evidence in that direction, and claims none. No row proved the
   delivered code wrong here either, so `A6` does not fail by design.

7. **That `ABC-025` may leave `In Development`, or merge, or that `N5` may be closed.** The
   disposition of a knowingly-unmet bar is the Orchestrator's with the owner. `RISK-ABC013-04`
   closes on merge, not here. `plans/board.md` was deliberately not touched.

8. **That the substrate this hop ran on is sound.** Re-verified at the source on this hop rather than
   inherited from the four prior hops that recorded it: there is no `scripts/` directory in the
   repository, no `context-io.*` and no `claim.*` anywhere in the repository or in the kit at
   `/Users/olgeroeselg/.grugops/agent-factory`, and `mcp__grugops__propose_note` is not in this
   session's tool set. Workflow 16's stop condition — *"the only way to record the result would be to
   hand-write the `.grugops/context/` path → stop"* — is live on every hop of this install. **These
   five notes were hand-written into `notes/` in the `agent-factory/contracts/context-note.md`
   format**, as every prior note on this task did, and the queue claim was taken with a plain atomic
   `mkdir(2)` exactly as Workflow 17 step 2 specifies. **Nothing mechanically validated any of it**,
   and `index.md` / `index.jsonl` do not exist for this task because nothing renders them. Owner
   **Orchestrator**; this is the fifth consecutive hop to record it.
