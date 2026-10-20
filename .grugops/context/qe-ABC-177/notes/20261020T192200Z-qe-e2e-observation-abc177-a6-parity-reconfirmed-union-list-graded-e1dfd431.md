---
id: 20261020T192200Z-qe-e2e-observation-abc177-a6-parity-reconfirmed-union-list-graded-e1dfd431
kind: observation
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:22:00Z
verified_by:
confidence: high (re-run in full at both trees; raw files kept)
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - ABC-167
  - ABC-171
  - ABC-174
  - 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210
  - 20261020T185816Z-software-engineer-decision-abc177-fold-and-steps-937719ab
  - .grugops/context/ticket-to-pr-ABC-177/probe/frozen-mutants.json
  - .grugops/context/qe-ABC-177/probe/parity/
---

# `ABC-177` A6: **MET**. All 15 changed rows kill the same ids at base and tip over the SE's frozen list (145 applicable). The union list is the right reading of "M01–M11"

Hand-authored and unsealed: no sanctioned writer.

## The re-run
- **Harness:** the SE's `mut.mjs`, `units.mjs` and `parity.mjs` (byte copies) over the SE's `frozen-mutants.json`. No id
  was added, removed or edited.
- **Trees:** base = `git archive ff1e375f`; tip = a **full** `git archive f81bf03c`, not the SE's "B plus the tip's
  test file". `/usr/bin/diff -rq` shows they differ only in `src/uci-session.test.ts`.
- **Run:** one mutant at a time, with
  `NODE_OPTIONS=--max-old-space-size=400 vitest run src/uci-session.test.ts -t <15 rows> --testTimeout=120000`. The
  source was restored and compared after each mutant. 19:03:14–19:13:11Z.
- **Controls:** green at both trees, 15 rows each. 145 mutants ran at each tree, 15 rows every time, with no suite error
  ("odd none").
- **Result:** `same id set: true`. **Per-unit parity: U1–U8 all true. All 15 rows are SAME.** The per-row kill sets
  equal the SE's `…03c6e9de` list.
- **Stronger than per-row equality:** `kill-qb.jsonl` and `kill-qh.jsonl` are byte-identical (sha256
  `c4534664…`). So every mutant, and the control, reds exactly the same rows at base as at the tip.
- **It matches the SE's raw data:** for each of 146 ids, the failing rows and the run counts are identical to
  `kill-base.jsonl` / `kill-c1.jsonl` (0 differ at either tree).

## Was the list frozen before head? Re-derived, not trusted
- The probe files' mtimes are all one copy time (21:58:16 +0300), so they cannot show the SE's 18:43:15Z freeze.
- Instead, `freeze.mjs` was re-run here against the **base archive only**. It printed "150 listed; 145 apply at base"
  and produced a file **byte-identical** to the SE's (sha256 `b9033970…`).
- Its inputs are the base source plus three committed mutant sources: `qe-ABC-167/probe/mutants.mjs` (`86e8be75`,
  2026-10-18), `qe-ABC-171/probe/mutants3.mjs` (`78fffeb3`, 2026-10-19) and `qe-ABC-174/probe/mutants.tsv`
  (`2372edde`, 2026-10-19). All are clean in the tree and predate `ABC-177`.
- The script has no head input, and it takes every row of the three sources without curation. So the list could not
  have been fitted to head results.
- The only hand-written entries are the successors 167-M45a/b, 171-S42b, H1 and H2, and their text is base-derived.

## Grade of the SE's union-list choice: **CORRECT, and the conservative reading**
- "M01–M11" names a list in both `ABC-167` (`uci-session.ts`) and `ABC-174` (`levels.ts`).
- A6 also names "the wrong builds named by ABC-167 and ABC-171 for these rows", so the 167 and 171 lists are owed
  anyway.
- The superset makes parity **harder** to pass: 145 ids must match instead of a subset.
- 174-M09, M10, M11 and M17 are in the kill sets of U2, U6 and U7. So the 174 reading of "M01–M11" mattered, and it is
  covered.

**Caveats (INFO, `QE-177-e`):**
- 5 entries are inert at base: 167-M07, 167-M45 (2 matches; its successors M45a/b apply), 171-N11 (N11b applies),
  171-S42, and **171-S42b, the SE's own successor, which matches nothing at base**.
- S42/S42b concern the `uci` option order, which no changed row writes, so no changed row's set is affected.

## Limit of A6 (why `…02deb2e2` exists)
- The frozen list mutates `uci-session.ts` (131 entries), `levels.ts` (16) and `cli-options.ts` (3). **None touches
  `engine.ts`'s time-limited loop.**
- So parity cannot see search that a coarser step loses, which is exactly what BA/PM's condition 2 says.
- The time-limit and cross-session questions are graded with separate gap probes. Those probes are not part of the
  list and are not used for parity.
