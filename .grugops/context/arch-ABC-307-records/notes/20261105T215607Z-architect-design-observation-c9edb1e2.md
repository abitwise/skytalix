---
id: 20261105T215607Z-architect-design-observation-c9edb1e2
kind: observation
by: architect-design
at: 2026-11-05T21:56:07Z
verified_by: 
confidence: high that each item is open on the records; nothing run
refs:
  - arch-ABC-307-records
  - ABC-307
  - ABC-291
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - EPIC-011
  - ADR-0046
  - ADR-0075
  - ADR-0056
  - NFR-005
  - NFR-008
  - NFR-009
  - G2
  - G6
  - bce24018
  - 014b8fa2
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
  - bapm-ABC-291-probe-lines/20261105T141916Z-ba-pm-observation-bf92ae84
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-19f6c80a
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-d356030c
supersedes: 
seal: sha256:ec098fca9f20237961b3133172cf3dd203770d45c42ef6d81020925a594d3474
---

# arch-ABC-307-records: what this hop leaves owed and open

Architect/Design, records only. Nothing below is a reading.

**Owed by others.**
1. **BA/PM, `ABC-291`'s page:** the F2 note (§ F2 after the probe) says K5's half is not ruled. It owes one line pointing at `ADR-0075`'s, after the Orchestrator's call. The ticket is outside this hop's fence.
2. **The Orchestrator, the board:** `ABC-291`'s row reads "Before K4's PREREG: rule K5's half of F2; date ADR-0075's 640 KiB lines". The second is done, and the first is done subject to the call above.
3. **The Orchestrator, QE briefs:** the run rule is 23 lines from now, and the next brief the trigger fires on carries the new one. Its first run confirms "1 passed".
4. **QE, K4's PREREG:** it seals K5's read and K5's void rule, beside PR8's two levels.

**Seen, not touched (outside the brief).**
- `ADR-0075` § The probe's reading still leaves the deep-lane call with the Orchestrator (`…2926c26b` call 2). `…69ee96e7` 2 ruled it. No dated line was asked for.
- `ADR-0075` § Consequences and `ABC-291`'s page still say the row census "gates the merge". The census has reported, and `ABC-307` held that work (`…bf92ae84` 4).
- `ADR-0046` § `arch-ABC-307`'s forecast (−0.235 to −0.25 s) stands as a forecast. A9 read −0.350 s (`…78d1f873`), and its place is `ABC-307`'s A10.
- `AGENTS.md` has no line for the `qe-hop` or `book` `ENGINE_DEEP` deep lanes, while its merge re-read rule names any test file's deep lane. No ruling asks for one, and 39 B are free, less than such a line needs.

**`UNKNOWN - verify`, not mine to settle.** `G6` on this term, what the cut buys, and the new `-t` line's count until run.
