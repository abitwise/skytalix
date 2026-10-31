---
id: 20261031T055207Z-security-nfr-observation-8881d726
kind: observation
by: security-nfr
at: 2026-10-31T05:52:07Z
verified_by: 
confidence: high for the read facts; figures copied from se-ABC-221 notes, none re-measured
refs:
  - secnfr-ABC-221
  - ABC-221
  - EPIC-009
  - ADR-0052
  - ADR-0044
  - ADR-0045
  - ADR-0036
  - NFR-004
  - NFR-008
  - NFR-009
  - NFR-010
  - NFR-011
  - AR-NFR004-A
  - AR-UCI-BUSY
  - SEC-221-a
  - SEC-221-b
  - SE-221-b
  - SEC-220-b
  - orch-2026-10-29g/20261029T221000Z-orchestrator-decision-a67f71ac
  - orch-2026-10-29g/20261030T041740Z-orchestrator-decision-3dd61448
  - se-ABC-221/20261031T053932Z-software-engineer-decision-ac6abd6a
  - se-ABC-221/20261031T053932Z-software-engineer-observation-563fc63b
  - se-ABC-221/20261031T053932Z-software-engineer-observation-af63269c
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - secnfr-ABC-220/20261030T161256Z-security-nfr-decision-87a74b89
  - c48a6f83
  - d58f2d77
  - fb3696fa
  - 787820c3
  - plans/nfr-catalog.md
  - src/uci-session.ts
  - src/engine.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:ec16486bc1555e9864dd29718b99e3fa92631b7edf563195b5134fb1bdc337ea
---

# Security/NFR observation, secnfr-ABC-221: two INFO items (SEC-221-a, SEC-221-b), the NFR-010 and NFR-008 reads, and what is carried

Records only, at the catalog commit `787820c3`. No §14 gate ran on this branch, so none of these is a `finding`. The severities are this role's.

## `SEC-221-a` (INFO). Owner: Security/NFR, at any ticket that hands the engine a budget over 59 500
- The clamp now bounds a raw `chooseMove` deadline at 60 000.
- A raw call above that returns a few ms past it, by `AR-NFR004-A`'s mechanism. No real-clock reading at 60 000 exists (`UNKNOWN - verify`), as at 32 000.
- No surface reaches it: the CLI plays levels (≤ 30 000), and UCI caps at a level budget, T or 59 500.

## `SEC-221-b` (INFO). Owner: Architect/Design, at the `SE-221-b` ruling
- `ADR-0052` D8's 2026-10-30 line says `src/uci-session.test.ts` "has no spawn site". At `c48a6f83` it has one: `A10`'s `ENGINE_DEEP` child.
- What D8 guards still holds (see the decision note). The words need a dated line either way. No code changes.

## `NFR-010`: read from the code, not measured
- `A10`'s child inherits the parent's environment, so it carries the lane's `--max-old-space-size` flag.
- On the one-file line it is one Node child live at a time, inside the one-file shape's 2.
- In a suite-shape `ENGINE_DEEP` run it could be live beside `src/transposition.test.ts`'s `A7` child: 2 of the shape's 3.
- No isolate was counted.

## `NFR-008`: not ruled here (QE's `G8`; the Orchestrator's watch)
- The SE's informal wall: +0.16 s (n = 3 per arm), so about 9.57 s against `ABC-242`'s 9.41 s. That is under the 9.6 s trigger and under 10 s, and `UNKNOWN - verify`.
- The 33 new rows cost 39 ms in-thread. The 3 real-engine rows are class P at coarse steps. The `RF-1` rows read the same at base and head (`…563fc63b`).
- If QE reads over 9.6 s, `ABC-244`'s tranche 2 fires. Over 10 s, `A9` is NOT MET, and the breach is this ticket's.

## Carried, not Security/NFR's
- `SE-221-a` (LOW, records): `A6`'s "≥ 117 s" (BA/PM), and `ADR-0052` D4's sentence (Architect).
- `SE-221-c`–`g` (INFO).
- Test note 4's merge folds (BA/PM).
- The `TimeMode` line and the `A10` lane command in `AGENTS.md` (the Scribe).

## Read, not re-derived
- The figures are copied from the SE's notes `…af63269c` (readings), `…563fc63b` (census) and `…7896971d` (findings) on `grugops/ABC-221` `fb3696fa`.
- The code facts come from `git diff d58f2d77 c48a6f83 -- src` and `git show c48a6f83:src/uci-session.ts`.
- No value was re-measured.
