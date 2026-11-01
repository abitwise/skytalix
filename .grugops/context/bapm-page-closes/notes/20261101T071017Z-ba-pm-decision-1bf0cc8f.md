---
id: 20261101T071017Z-ba-pm-decision-1bf0cc8f
kind: decision
by: ba-pm
at: 2026-11-01T07:10:17Z
verified_by: 
confidence: high: every verdict, SHA and gap copied from the sealed QE/secnfr notes and the board at 55fbc90e; merge SHAs checked as ancestors of main; nothing run
refs:
  - bapm-page-closes
  - EPIC-010
  - ABC-243
  - ABC-244
  - ABC-245
  - ABC-248
  - ABC-241
  - ABC-230
  - ABC-242
  - ABC-228
  - ADR-0046
  - NFR-008
  - NFR-009
  - SE-228ii-a
  - QE-228ii-b
  - QE-241-a
  - QE-242-b
  - SE-242-f
  - QE-243-a
  - QE-243-b
  - QE-243-c
  - SE-243-a
  - SE-243-b
  - SE-243-c
  - SE-243-d
  - SE-243-e
  - QE-244-a
  - QE-244-b
  - QE-244-c
  - QE-244-d
  - QE-244-e
  - QE-244-f
  - SE-244-a
  - SE-244-b
  - SE-244-c
  - SE-244-d
  - SE-244-e
  - QE-245-a
  - QE-245-b
  - QE-245-c
  - QE-245-d
  - SE-245-a
  - SE-245-b
  - SE-245-c
  - qe-ABC-243/20261031T040755Z-qe-e2e-decision-2d790e40
  - qe-ABC-243/20261031T040755Z-qe-e2e-observation-cf057dd1
  - qe-ABC-244/20261030T230742Z-qe-e2e-decision-4fe9bfe1
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - secnfr-ABC-244/20261030T231242Z-security-nfr-decision-9087cb39
  - secnfr-ABC-244/20261030T231242Z-security-nfr-observation-619ead26
  - qe-ABC-245/20261031T064950Z-qe-e2e-decision-b2ebc183
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-cf53b0ed
  - 3628fe99
  - 24b22339
  - 2cce84e0
  - 55fbc90e
  - b76b821e
  - src/transposition.test.ts
  - src/levels.test.ts
supersedes: 
seal: sha256:dd9bde47666c8cea2177b02dc7251628e9c425c3e52e27d56e5f067a7aa630af
---

# BA/PM closes the ABC-243, ABC-244 and ABC-245 pages: done / Done, each with a CLOSED block naming QE's verdict note and the merge SHA; every QE, SE and Security/NFR gap dispositioned. No ticket cut; two proposals for the Orchestrator

Records only, at `main` `55fbc90e`; nothing run, built or timed (`qe-ABC-246` holds the host). Records commit `b76b821e`
on `grugops/bapm-page-closes`. Only the three ticket pages were edited. The board, trace, epics, ADRs, `src/`, `tools/`
and `data/` are untouched. Merge SHAs are the board's Done rows, each checked as an ancestor of `main`.

## ABC-243: CLOSED (QE PASS `qe-ABC-243/…2d790e40`; merged `3628fe99`, 2026-10-31; UAT waived, 0 production lines)
- QE-243-a LOW (QE scratch harness self-match): closed. No reading moved; the fix is on record in `…cf057dd1`.
- QE-243-b INFO (SE-243-b): closed. `ABC-167`'s default-level row still checks `score`.
- QE-243-c INFO (deep row stdout `src/transposition.test.ts:695` prints `3 s` for the 4 s search; the child script
  names it `three`): carried, to proposed ticket P-1 (observation note). The `NFR-009` catalog half was already fixed
  by `secnfr-ABC-228-catalog`.
- SE-243-a, -c (118 chars), -d, -e: closed (QE confirmed; `G8` read -d).

## ABC-244: CLOSED (QE PASS `qe-ABC-244/…4fe9bfe1`; Security/NFR PASS `secnfr-ABC-244/…9087cb39`; merged `24b22339`, 2026-10-30; UAT waived)
- QE-244-a LOW (SE-244-a widened): carried, two named carriers: BA/PM's R4 DoR line at every cut (re-run A6 on CLI
  `ABC-241` A4/A7 with F230, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1 when their step, `LEVELS[5].budgetMs` or
  `NODES_PER_CLOCK_CHECK` moves), and `ABC-248`, whose § Out of scope already fences the `ABC-241` U2 rows out.
- QE-244-b (SE-244-b): closed. QE-244-c: closed for this ticket (parity asked, held); QM1/QM2/QM4 red in `npm test` at
  `qe-ABC-241`, QM3 killed by `ABC-243` A6; the other five stay `UNKNOWN - verify` (proposal P-2).
- QE-244-d: closed, overtaken (tranche 2 fired at `qe-ABC-245`, cut as `ABC-248`). QE-244-e, -f: closed.
- SE-244-c, -d: closed (A8/A9 read them). SE-244-e: closed (QE adopted the SE's 9 mutants).
- Security/NFR carries: `NFR-008` state and the two-file `F` are in the catalog (closed); QE-244-a as above.
- The page's owed `ADR-0046` status line is met (`arch-qe242a-ruling`, 2026-10-31).

## ABC-245: CLOSED (QE PASS `qe-ABC-245/…b2ebc183`; merged `2cce84e0`, 2026-10-31; UAT waived)
- QE-242-b: closed (the ticket's purpose; QE "CLOSED"). SE-242-f: closed by A4.
- QE-245-b LOW (`G8` H 9.82 s fired tranche 2 on a noisy n = 3 median): carried, carrier `ABC-248`.
- QE-245-a INFO: closed (`ADR-0046` § Ruling 2026-10-31 accepts the label). QE-245-c INFO (SE-245-c, header count goes
  stale with the next row): closed as an accepted maintenance cost; BA/PM names the count at the next cut that adds a
  row to `src/levels.test.ts`. QE-245-d: closed. SE-245-a, -b: closed (QE confirmed).

## Not done here
- No board move: the three rows already read Done on the board. No trace edit (rendered from refs).
- No ticket cut: P-1 is XS and test-only, but this hop's fence allows edits to the three pages only.
