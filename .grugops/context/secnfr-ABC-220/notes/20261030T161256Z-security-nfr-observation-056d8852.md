---
id: 20261030T161256Z-security-nfr-observation-056d8852
kind: observation
by: security-nfr
at: 2026-10-30T16:12:56Z
verified_by: 
confidence: high for the read facts; figures copied from qe-ABC-220 notes, none re-measured
refs:
  - secnfr-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - ADR-0044
  - NFR-004
  - NFR-008
  - NFR-011
  - AR-NFR004-A
  - AR-UCI-BUSY
  - SEC-220-a
  - SEC-220-b
  - SEC-220-c
  - SEC-228-a
  - SEC-212-a
  - qe-ABC-220/20261030T152147Z-qe-e2e-decision-7a09c5e1
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-c6bdd364
  - arch-ABC-220-a14/20261030T143241Z-architect-design-observation-ca075632
  - fbab54ff
  - 68ba364c
  - cc32a470
  - 9c676157
  - plans/nfr-catalog.md
  - src/uci-session.ts
supersedes: 
seal: sha256:5388ff2b47c8999d8684fc11c2b4c9d328fab44b2bd345507dbdbdfb20445e2a
---

# Security/NFR observation, secnfr-ABC-220: NFR-008 watch line, three INFO items (SEC-220-a to c), and what is carried

Records only, at the catalog commit `9c676157`. No §14 gate ran on this branch, so none of these is a `finding`. The severities are this role's.

## `NFR-008` (R-1): a watch line, not a ruling. Owner of the watch: the Orchestrator (timing protocol `…5aaf7cec`)
- **MET at this gate.**
  - `A12`: 9.69 s at load1 0.41, so 0.31 s under 10 s.
  - `G8`, interleaved b h h b b h: medians base 9.64 s and head 9.73 s, so **+0.09 s** for 52 rows. That leaves 0.27 s.
  - 0 real-clock rows were added to the default lane.
- **The headroom is shrinking.** It was 0.39 s at `ABC-228` (9.61 s) and is 0.27–0.31 s now. Those are different windows, not a series.
- The next row-adding merges (`ABC-229`, `ABC-221`) may cross 10 s. If a later gate reads more than 10 s, the breach belongs to that gate.
- R-1's level is the owner's, and the row is not edited (QE-220-c).

## `SEC-220-a` (INFO). Owner: Architect/Design, at the `ADR-0052` fold at the merge
The sentence proposed in `ADR-0052` § Consequences still quotes clause A as "≤ 3 s at default difficulty". That has been ≤ 4 s since `ABC-228`. Only the ADR's new clause was placed, so the catalog is right. The ADR quote needs one dated line.

## `SEC-220-b` (INFO, pre-existing, not `ABC-220`'s). Owner: the Software Engineer, at the next touch of `src/uci-session.ts` (`ABC-221`)
`milliseconds` (at `fbab54ff`) says "any finite decimal number". Its pattern `^-?\d+(\.\d+)?$` accepts a figure of more than 308 digits, and `Number` turns that into ±Infinity. Every branch handles it safely: in the mode, +Infinity goes to T and −Infinity to depth 1; at a level, the level's cap applies (QE-220-d). So only the comment is wrong. Whether to fix the comment or the rule is the SE's and BA/PM's call.

## `SEC-220-c` (INFO). Owner: QE, at the next `NFR-011` re-read
This corrects `arch-ABC-220-a14` `…ca075632` § "Seen". `NFR-011`'s `Verified by` cell does not name `sysctl`. The instrument it cites, `qe-ABC-168` `probe/a6-probe.mjs`, reads load through macOS `sysctl`. A re-read on the Linux host needs `os.loadavg()[0]`, as `qe-ABC-220`'s `A14b` probe already uses. The cell is not edited.

## Carried, not Security/NFR's
- QE-220-a (LOW, test strength: the mode's side-to-move increment is unpinned in `src`; QE's follow-up into the `A7` block, perhaps at `ABC-221`).
- QE-220-b, -d, -e and -f (INFO).
- SE F3 (the Scribe's `AGENTS.md` command for the `A11` lane).
- BA/PM's merge folds into `ADR-0044` D3, D4, D5 and D11.

## Read, not re-derived
The figures above are copied from QE `…58af5b6a` (timing) and `…c6bdd364` (gaps), on branch `grugops/qe-ABC-220`, and from `git show fbab54ff:src/uci-session.ts`. No value was re-measured.
