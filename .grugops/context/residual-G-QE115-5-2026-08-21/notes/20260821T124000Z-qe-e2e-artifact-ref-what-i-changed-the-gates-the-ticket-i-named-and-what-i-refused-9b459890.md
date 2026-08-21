---
id: 20260821T124000Z-qe-e2e-artifact-ref-what-i-changed-the-gates-the-ticket-i-named-and-what-i-refused-9b459890
kind: artifact-ref
by: qe-e2e
at: 2026-08-21T12:40:00Z
verified_by:
confidence: high
refs:
  - G-QE115-5
  - ABC-066
  - ABC-115
  - N8-SPAWN
  - T2
supersedes:
---

# WHAT THIS HOP TOUCHED, WHAT IT MEASURED, THE ONE TICKET IT NAMED WITHOUT CUTTING, AND THE SEVEN THINGS IT REFUSED

## Changed — one file
- `src/cli.test.ts` — `105 / 18`, and it is the **only** changed file under `src/`.
  - `Child` gains `productArgv`; `childOf` gains it as a **required positional**; the six construction
    paths (`run`, `play`, `npmRun`, `closedReader`, `heldOpenReaderClosed`, `unwritableStdout`) state it.
  - New `productExitOf` — the product's exit whether or not a `/bin/sh` wrapper stands between.
    Deliberately **not** a replacement for `productStatusOf`, whose throw is a guard other rows rely on.
  - `ABC-066` `A1/A2/A3`'s derivation re-based on the resolver; both old clauses kept as assertions;
    one converse assertion added; the false sentence deleted **and written out at the site**, per this
    project's own `ABC-114` discipline.

## Untouched, and verified rather than asserted
- **`src/cli.ts` is byte-identical** — `git diff --exit-code -- src/cli.ts` clean.
- **Zero production lines**: `git diff --numstat -- src/ | grep -v '\.test\.ts$'` is **empty**.
- **`N8-SPAWN` / `N8-LANE` unmoved**: `spawned` = 24 (`17 + 7`), `Object.keys(CHILDREN)` = 24, one
  `spawnSync` call site, `spawnSync` the only name imported from `node:child_process`. All green.
- **`T2` did NOT fire.** It fires for a hop that changes what an existing child *does*. Every spawn's
  `command`, `args` and options are byte-identical — diffed line by line; the only change on a spawn
  line is Biome's re-indentation of the `closedReader` template and an added argument that is
  **recorded, never passed to the child**. No re-measure was owed and none is claimed.
- `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md`: zero bytes.

## Gates at the branch tip (`grugops/residual-gqe115-5`)
| gate | command | result |
| --- | --- | --- |
| lint | `npm run lint` | exit 0 — `Checked 73 files in 87ms. No fixes applied.` |
| typecheck | `npm run typecheck` | exit 0 — `tsc --noEmit`, no output |
| build | `npm run build` | exit 0 — `tsc --noEmit`, no output |
| unit | `npx vitest run --dir src` | exit 0 — **40 files / 1213 passed / skip 0**, 4.02 s |

Skip count `0` via the recorded capture; `node tools/grugops/test-skip-integrity.js
.grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0. **Identical to the `e4a5c48`
baseline the subtask states — 40 / 1213 / 0 — because the additions are assertions inside an existing
`it`, not new `it` blocks.**

## The one ticket I would cut, NAMED AND LEFT UNCUT
**"Amend the accepted stdout-write residual's record: that `1` is an unhandled exception, not
`USAGE_EXIT_CODE` being assigned."** — size **XS**, priority **P3**, owner **BA/PM** (their pen; the
owner's call whether it is worth a hop at all).

**It is a correction of record, NOT a re-opening**, and I have kept it that way deliberately: the
acceptance stands, `ADR-0016` clause 3 stands, and no wider arm is proposed. What is owed is a
superseding note carrying the measured mechanism (`…d2c79dc9`), because the standing note's
*"`1` is `USAGE_EXIT_CODE`"* will mislead the hop that eventually closes the residual — that hop
cannot route non-`EPIPE` to `70` with a `try`/`catch`, since the throw arrives on a later tick.
**Notes are append-only, so this cannot be a silent edit, which is exactly why it needs an owner.**

## Refused, and why
1. **Refused to make the row green by narrowing it.** The exclusion is argued from `ABC-066`'s
   subject and mutation-tested; it is not the wrapper's accident kept for convenience.
2. **Refused to red an `ABC-066` row to look rigorous.** The measured red is the instrument asking a
   crash for a usage line. Reporting that as a defect of a `Done` ticket would be a false finding.
3. **Refused to re-open** `ABC-115`, `ADR-0016`, the exit-code ruling, or the accepted stdout-write
   residual. Refused to propose a wider product arm.
4. **Refused to cut the ticket above.** Named with size, priority and owner, left uncut.
5. **Refused to touch `src/cli.ts`, even as a mutant.** Every mutant ran in a copied tree outside the
   repository, baselined green first, reverted after.
6. **Refused to add a child.** The cheap way to "prove" a refusal path is a new spawn; it charges
   `N8-SPAWN` at its ceiling and buys nothing this derivation does not already reach.
7. **Refused to emit any `finding` or any `§14-gate#` stamp.** `context.human_admission` is `off`;
   these are `observation` / `decision` / `artifact-ref`, hand-authored.
8. **Refused to branch off `grugops/residual-gqe115-3` or `-4`.** Branched off `main` @ `e4a5c48` as
   instructed. **Flagging a merge hazard rather than resolving it: `-4` is unmerged and edits comments
   in this same file, and I have rewritten the `ABC-066` row's comment block. Whoever merges second
   will see a conflict there — it is textual, and both hops' rulings are compatible.**
