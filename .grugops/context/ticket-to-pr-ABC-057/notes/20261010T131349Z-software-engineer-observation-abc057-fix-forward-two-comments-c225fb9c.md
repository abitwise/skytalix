---
id: 20261010T131349Z-software-engineer-observation-abc057-fix-forward-two-comments-c225fb9c
kind: observation
by: software-engineer
at: 2026-10-10T13:13:49Z
verified_by:
confidence: high
refs:
  - ABC-057
  - QE-054-b
  - src/history-pane.nfr.test.ts
  - 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
  - 20261010T131017Z-software-engineer-observation-abc057-gates-ledger-arming-controls-cost-4d731ea3
supersedes:
---

# `ABC-057` fix-forward on the coordinator's word: the two flagged comments are corrected (`d2920d60`)

This note is hand-authored and unsealed. It discharges items 1 and 2 of the "Left as found, flagged"
list in `…b4c2a298` (`D3`). Item 3, the `turn-loop.ts` reading of "receive one injected", is with
Architect/Design and is not touched.

- **Item 1.** The in-test comment in the composer tripwire's `it` now makes the same claim as the
  docblock's fail-closed paragraph. It names what the expression reads (a namespace binding, or a brace
  specifier that begins with the name) and the two value imports it does not count (`QE-054-b`).
- **Item 2.** The licence docblock no longer says "this tree has no `turn-loop.ts`" or "the same 16
  files". It states the vacuous-entry bound without a stale tree.
- `d2920d60` is comment-only: +8/−6 in `src/history-pane.nfr.test.ts`, and the non-comment filter
  printed nothing. `spans.py` gives the same four hashes as base (`probe/spans-head2.txt`).
- `npm run lint` exit 0. `npm test` exit 0, 51 files / 1583 passed (load1 3.09 → 2.92).
- On `d2920d60` (`probe/ledger-m15-fix.tsv`, whole `src` lane, load1 2.77–3.54): CONTROL passes
  1583/1583. **`M15` is RED** and **`M15-SUB` is RED**, 1 failed / 1582 passed each, attributed only
  to "the licence guard compares with an EQUALITY".
- `A5` over the delivered range `079284d9..d2920d60`: `src/` = `src/history-pane.nfr.test.ts` only,
  numstat +42/−18.
