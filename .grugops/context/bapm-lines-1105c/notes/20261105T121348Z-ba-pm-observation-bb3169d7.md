---
id: 20261105T121348Z-ba-pm-observation-bb3169d7
kind: observation
by: ba-pm
at: 2026-11-05T12:13:48Z
verified_by: 
confidence: high for what git and grep show; three items UNKNOWN - verify
refs:
  - bapm-lines-1105c
  - grugops/bapm-lines-1105c
  - EPIC-011
  - ABC-305
  - ABC-303
  - ABC-289
  - ABC-223
  - ABC-282
  - ABC-291
  - ADR-0071
  - QE-282-l
  - QE-223-c
  - a6ae8227
  - a6c24d45
  - f08c7cbd
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
  - orch-2026-10-30a/20261105T081031Z-orchestrator-decision-42f7fd67
  - arch-ABC-282-close/20261105T120405Z-architect-design-decision-1ce8828d
  - bapm-ABC-282-close/20261105T115732Z-ba-pm-observation-77657fed
supersedes: 
seal: sha256:695a07f32f853a5d8e0d2014e84ead2f749f955ea8f608d6c286bd54f226e592
---

# bapm-lines-1105c observation: six more lines still read as if A4 or the old slot were ahead; none was in the brief, none edited

BA/PM, task `bapm-lines-1105c`. Read with git and grep at `main` `a6c24d45`, with this hop's pages on top. Nothing was run. None of these moves a bar. Line numbers are at `f08c7cbd`.

**Seen, not edited.**
1. **`ABC-305` DoR row 10:** "The wait on `ABC-282`'s A4 is an ordering". The wait is past. The brief named row 5 only. The ✅ does not depend on it.
2. **`EPIC-011` § Tickets row 57 (`ABC-305`), Depends cell:** "after `ABC-282`'s A4 ends; either order with `ABC-282`". This is the line this hop changed on the ticket's page. The brief gave § Dependencies only.
3. **`EPIC-011` § Tickets row 55 (`ABC-303`), Depends cell:** "the C2′ read after `ABC-282` and `ABC-301` have each merged or been recorded as failed", then "C2′ waits on `ABC-282` alone". Met, and still reads as a wait.
4. **`EPIC-011` § Dependencies, "The reads queue" (line 1508):** a term's "ADR and probe wait only for the host, after `ABC-282`'s A4". A4 has ended, and `…16e0ec2c` puts `ABC-291`'s probe after the census.
5. **The same point on `EPIC-011` § Phases row E4 and § Tickets row 43, and `ABC-291` § DoR row 5:** "the probe after A4". True, but the census now comes first.
6. **`ABC-305` A5:** "after `ABC-282`'s A4 ends". Left on purpose, a bar row, met.

**Top blocks.** `EPIC-011` line 19 and `ABC-303` lines 37 and 59 say C2′ waits on `ABC-282`. They are dated history under later blocks, so I read them as true of their date.

**`UNKNOWN - verify`.**
- The census's result: `secnfr-census-1105` has not reported, so the pages give the gate and not its result. If it holds up the next merge, these lines do not change, but the merge does.
- `ABC-305`'s conflict list against `main` now: Scope 2's read was at `a38315bf`, and it is owed at the build. Not read here.
- Which of `ABC-303` and `ABC-305` is the next lane-adding merge. The pages leave it open, as the ruling does.
