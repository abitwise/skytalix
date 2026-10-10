---
id: 20261010T151002Z-software-engineer-observation-abc134-gates-a1-a5-spans-pins-d5b9d74c
kind: observation
by: software-engineer
at: 2026-10-10T15:10:02Z
verified_by:
confidence: high
refs:
  - ABC-134
  - ABC-136
  - ABC-057
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T151002Z-software-engineer-decision-abc134-four-comment-sites-at-least-four-spellings-1f2b70bf
supersedes:
---

# `ABC-134` readings: gate green, 1608 = base; five phrases 1 -> 0; comment-only filter empty; pins and six spans identical, `probe-it` code-only identical

Hand-authored and unsealed (see `…1f2b70bf`). Branch `grugops/ABC-134-frame-probe-prose` from `7f7e6b84`; code
`a42b59e3` (`src/history-pane.nfr.test.ts` +26/-13). Not merged, not pushed. Node v26.11.0. Raw: `../probe/RUN.txt`.

**Premise re-verified at `7f7e6b84` before editing:** all five A1-A4 phrases count 1 in collapsed text (docblock sites
unmoved at `:186-199`; the in-test sites moved down to `:556-558` and `:673-675` by `ABC-136`; wording unchanged). `turn < 3` is the settle's literal. `ADR-0029`'s pointer lists four spellings.

- **A1 MET:** phrase 1 -> 0; the CONDITIONAL bullet contains `unicode`, `black-bottom`, `thinking`, `message`.
- **A2 MET:** phrase 1 -> 0; the rebuild bullet contains `gameStatus`, `replay`, "seen by no instrument".
- **A3 MET:** phrase 1 -> 0; the settle comment states 3 turns (= `turn < 3`), names "a timer" and "a deeper
  `setImmediate` chain" as NOT seen.
- **A4 MET:** both phrases 1 -> 0; docblock paragraph and in-test comment each contain "string-named specifier",
  "comment containing `;`", "AT LEAST" and "not exhaustive".
- **A5 MET:** name-only = `src/history-pane.nfr.test.ts` alone; the comment-only filter prints nothing; whole-file
  hash with comment lines dropped is `2b417f409edf32c0` at base and head; test count 1608 = base.
- **Identity:** `ABC-136`'s four pinned literals count 1 at base and head (hashes `6ab1361e`, `409d8b25`, `48644b04`,
  `919467a5`). `spansqe.py`: `licence-regex-lines`, `licence-it-body`, `sibling-tripwire`, `composer-tripwire-code`,
  `witnessed-expression`, `LICENSED_DRIVERS` identical; `probe-it` 051ea712… -> ee38882f… (115 -> 118 lines, the
  settle comment); `probe-it` with `//` lines dropped `9536c4f9835a2cfd` both. First `LICENSED_DRIVERS` /
  `COMPOSITION_ROOT` declarations are still the real ones (raw readers `A9`/`A12` unaffected; suite green).
- **Gate** (worktree): lint exit 0 (100 files), typecheck 0, build 0, `npm test` 52 files / 1608 passed, skip count 0,
  integrity `No findings.`, `lane-inventory.js` 52/52 no findings.
- **Cost:** not timed. Comment lines only, no `it`, file or spawn; `N8-LANE` ≈ 0 by construction (ticket's own figure).
