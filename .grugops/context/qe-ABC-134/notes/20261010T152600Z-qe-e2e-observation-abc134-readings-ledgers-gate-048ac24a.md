---
id: 20261010T152600Z-qe-e2e-observation-abc134-readings-ledgers-gate-048ac24a
kind: observation
by: qe-e2e
at: 2026-10-10T15:26:00Z
verified_by:
confidence: high
refs:
  - ABC-134
  - ABC-136
  - ABC-057
  - ABC-041
  - ABC-016
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T152600Z-qe-e2e-decision-abc134-verdict-pass-with-gaps-5ec48998
supersedes:
---

# `ABC-134` QE readings: phrases 1 → 0, AST identical, four mutant ledgers, pins and spans, gate green at both tips

This note is hand-authored and unsealed. Node v26.11.0. The raw log is `../probe/RUN.txt`, which holds every command and its output.

- **Test scope.** Each of the four rewritten sentences is a claim about what an instrument sees. Each one was tested by planting the thing it names and running the instrument.
  - **`A3`.** `plant.py` puts an `import("./history.ts")` into the seam call, either synchronously or deferred. 12 variants × 10 runs, and 5 variants × 5 runs with the settle removed.
  - **`A1`.** The same planter, with the import gated on each held-fixed dimension. 8 variants × 3 runs.
  - **`A2`.** A positions-count rebuild by replay, placed in the pane, the seam or the status panel, against the full lane. A `gameStatus` control.
  - **`A4`.** Thirteen spellings planted as production modules, against the composer tripwire; `biome check` on each.
- **Text.** `qe134.mjs` implements the ticket's "collapsed text".
  - The five phrases read 1 at base and 0 at both tips. All named words are present.
  - The comment-free AST (TypeScript printer, `removeComments`) hashes `098d230788c505dc` at base, `4d6b019a` and `4cac6911`.
  - The template literals are identical (24), and there are 12 `it` calls at base and at the tip.
- **`A5`.** Over `7f7e6b84..4cac6911`:
  - name-only lists `src/history-pane.nfr.test.ts` alone (+28/−13);
  - the ticket's filter prints nothing;
  - the production-lines measure is empty;
  - the base tree runs 1608 tests, equal to the tip.
- **Identity.**
  - `ABC-136`'s pins 0–3 count 1 raw at base and both tips.
  - QE-057's `spansqe.py`: six rows are identical. `probe-it` goes from 115 lines (`051ea712…`) to 120 (`98312bbf…`); with its `//` lines dropped it is `0ad1227b…` at both.
  - The new prose quotes no raw-reader target, and the first `LICENSED_DRIVERS` / `COMPOSITION_ROOT` declarations are still the real ones.
- **`A3` ledger.**
  - Without the settle: SYNC RED 10/10; MICRO and IMM1–3 RED 10/10; IMM4 and IMM5 GREEN 10/10.
  - Timers: TIMER0 and TIMER1 RED 10/10, TIMER5 1/10, TIMER50 0/10. The RED cause is the PER FRAME assertion.
  - With the settle removed (`turn < 0`): SYNC RED 5/5; MICRO, IMM1 and TIMER0 GREEN 5/5.
- **`A1` ledger.**
  - The `ascii` and `white-bottom` controls are RED 3/3.
  - The `unicode`, `black-bottom`, `thinking`, non-empty messages, plies > 40 and ended-game conditions are GREEN 3/3.
  - One planted row (`status.kind`) was void and is annotated in the ledger.
- **`A2` ledger.**
  - A replay riding the pane's walk is GREEN, 52 files / 1608. So is a digit-free replay in the seam.
  - The `gameStatus` control is RED in 4 tests, including `ABC-041` `A2`.
  - A pane replay with its own `parseFen` is RED on `A11`'s one-parse count. A status-panel replay is RED on `ABC-016` `A13`.
- **`A4` ledger.**
  - The five forms of the four named spellings are uncounted and lint-clean.
  - Single quotes, no semicolon, `import{`, a leading space and `with {}` attributes are uncounted too. The first four are formatter-rejected.
  - The brace, namespace and `type`-plus-alias controls are counted, exactly those three.
- **Gate** (`gate-4d6b019a.txt`, `gate-4cac6911.txt`, identical):
  - lint 0 (100 files), typecheck 0, build 0;
  - `npm test` 52 files / 1608 passed; skip count 0;
  - integrity `No findings.`; `lane-inventory.js` 52/52, no findings.
- **Coverage.** No delta: no executable line changed, and lean mode has no enforced threshold. **Flaky risk:** none added; see `QE-134-d` for the race that the fixed sentence now names.
- **Cost.** `N8-LANE` ≈ 0 by construction (identical AST). Not timed.
