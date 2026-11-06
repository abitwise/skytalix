---
id: 20261106T135321Z-ba-pm-decision-ed812ffb
kind: decision
by: ba-pm
at: 2026-11-06T13:53:21Z
verified_by: 
confidence: high on what was written, each line taken from the named notes, and on the sums, read and not run; medium on J1 to J4, judgement; nothing run
refs:
  - bapm-lines-1106
  - ABC-307
  - ABC-305
  - ABC-291
  - EPIC-011
  - ADR-0075
  - ADR-0046
  - NFR-008
  - R-N8H-1
  - R-CEN-1
  - R-307-b
  - QE-305-a
  - bce24018
  - d00164ce
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - qe-ABC-307/20261105T214717Z-qe-e2e-decision-bec57958
  - qe-ABC-307/20261105T214701Z-qe-e2e-observation-78d1f873
  - qe-ABC-305/20261106T132503Z-qe-e2e-decision-482f3e67
  - se-ABC-305/20261106T131126Z-software-engineer-observation-9c9e2a35
  - secnfr-ABC-307-a10/20261105T215450Z-security-nfr-decision-6c111277
  - arch-ABC-307-records/20261105T215607Z-architect-design-decision-7cb68537
  - arch-ABC-307-records/20261105T215607Z-architect-design-observation-c9edb1e2
supersedes: 
seal: sha256:0bbd4134d322140596dc0a640084f6ff5b5d5c2f87a2bcae5a174cb7c791764e
---

# bapm-lines-1106: `ABC-307`, `ABC-305` and `ABC-291` closed out by dated lines. No bar moved

BA/PM, task `bapm-lines-1106`, records only, from `main` `ffdc0db0`. Nothing was run: no test, build, engine or read. Text of record: the three pages.

## `ABC-307`
- **Front matter:** done, Done, `closed:` at `bce24018`. QE PASS `…bec57958`.
- **§ Risks:** `R-N8H-1` reads LOW, not closed (`…6c111277`). `R-CEN-1` reads MEDIUM, any foreign load (`…b17275dd`, `…6c111277`, `…43e6d8fd` 4).
- **A9 and § Open 1:** the read was on the arms before the merge, B `e01d39b1`, H `797bb1a5`, under `…b17275dd`, lane inputs equal at `main` `375f6362`.
- **The forecast, stated:** −0.219 s sealed, −0.211 s row by row, the ADR's earlier −0.235 to −0.25 s, the probe −0.365 s, against A9's −0.350 s. The read is 0.131 s past the sealed forecast. The cause is `UNKNOWN - verify`. `R-307-b` is not ruled.

## `ABC-305`
- **Front matter:** done, Done, `closed:` at `d00164ce`.
- **A5:** read MET, −0.110 s against ≤ +0.10 s and 9.085 s against ≤ 10 s, with `QE-305-a` LOW carried beside it.
- **A9:** read QE PASS `…482f3e67`, UAT waived by A3.

## `ABC-291`
- **F2's note and K5:** K5's reading, by pointer to `ADR-0075` § What would falsify this (`…7cb68537`, confirmed `…43e6d8fd` 2).
- **d11 (d):** a second K5 miss counts, `…43e6d8fd` 3, open to the owner's overruling. The line defines it as F2's second miss on K5's half: a clean run below depth 6 on the build.
- **Test note 4:** K4's PREREG carries K5's read and void rule; QE's briefs carry `ADR-0046`'s 23rd line.

## Judgements, mine
- **J1.** Dated insertions only. Every removed line is front matter; no existing line was struck or reworded.
- **J2.** `closed:` is added beside status and column, as the Done pages carry it.
- **J3.** The forecast sits under A9, where § Problem says it is graded. `…c9edb1e2` named A10 as its place, and A10 is Security/NFR's.
- **J4.** The earlier forecast of `ADR-0046` is on the line too, because the brief says "the forecast" and two exist.

**No bar moved.** No value, target, level, NFR line or criterion changed.
