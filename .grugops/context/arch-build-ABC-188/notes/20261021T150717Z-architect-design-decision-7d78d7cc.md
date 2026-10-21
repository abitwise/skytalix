---
id: 20261021T150717Z-architect-design-decision-7d78d7cc
kind: decision
by: architect-design
at: 2026-10-21T15:07:17Z
verified_by: 
confidence: high (every criterion run by the builder; QE read owed)
refs:
  - ABC-188
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - QE-182-a
  - ADR-0036
  - NFR-008
  - ABC-168
  - 5cd279a4
  - 98487c1e
  - d722a6b6
  - eb097a7b
  - b71f8902
  - 341da4c1
  - 87d3897d
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T145301Z-ba-pm-decision-77891d86
  - 20261021T101645Z-qe-e2e-observation-87ce96c8
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
supersedes: 
seal: sha256:2d1130d733d7f3d992904871e64a045e76e74faac403bc5cd27d2dd8e756c546
---

# Architect build `ABC-188` at tip `eb097a7b` (code `d722a6b6`, base `main` `5cd279a4`): the `AR-163-DELONLY` fix is built. A1–A9 are met on the builder's read. QE's read of A2–A7 is owed; that read closes the risk

Cites the ticket page's `## Scope` (four files) and the risks it carries (`AR-163-DELONLY`, `AR-163-UNCOMMENT`, `QE-182-a`).
The page's `## Out of scope` is held: no `src/`, `biome.json` or `plans/` line, limbs 2/3 not widened, and D1/D2 are not rows.

## Reading of Security/NFR's ruling: the same as the page, not narrower
`…75a45be0` § 2: "any changed line, `+` or `−` … in a production file that holds limb 1 in code at `<base>` or `<head>`".
A holder deleted or renamed away at `<head>` held limb 1 at `<base>`, and every one of its lines is a changed (`−`) line.
So `REN` must FIRE, and nothing goes back to Security/NFR before the build. BA/PM's suggested records read of `A8`'s
text is the Orchestrator's call.

## Chosen design (`clause-b.mjs`, one diff, two maps)
- `addedLines` becomes `changedLines`. It still parses the one `git diff -U0 --no-renames <base> <head> -- src` and
  returns:
  - `added`, byte-for-byte the old map (`+` line numbers keyed by the `+++ b/` path);
  - `removed`, the `−` count from each hunk header, keyed by the `--- a/` path. A file deleted at `<head>` (`+++ /dev/null`)
    lands only here.
- Ruling 2 (limb 1 only) walks the union of both maps' keys and drops the `!lines.size` skip. Each line prints
  `N + line(s), M - line(s); holds limb 1 at …`, so the harness parser's `holds limb 1 at (.*)\)$` suffix is kept. The
  head line reads `holder files with changed lines (+ or -): N` (test note 4).
- **Why `added` is not widened instead.** `added` feeds `production files changed` and the (b1), word-hit and
  unresolved scopes on every limb. Putting a deleted file into it would change limbs 2/3 output on `REN`, and they are
  held byte-identical to `341da4c1`.
- **Unchanged:** the empty-holder case (no holder at either end: "adds nothing", and no pathspec diff; git-shim read: 1
  diff call, `-- src`, 79 git calls in all, as QE's ABC-163 count), `(b1) capability`, and limbs 2 and 3 (10 of 10
  identical).

## Alternatives rejected
- **Drop only the skip** (the term's "~3 lines"): `REN` and a plain holder delete stay silent (`A3` shows it).
- **A second `git diff --numstat`:** a second subprocess, and it no longer "reads the same diff".
- **List a deleted file under `production files changed`:** that is a separate cosmetic gap, it breaks limbs 2/3 byte
  identity, and nobody asked for it.

## Harness (`r2-mutants.sh`)
- `mk <plant> <file>…` stages the plant and compares the sorted `git diff --cached --name-only --no-renames` with the
  files the plant names. If they differ, it exits **2** and stderr names the plant (`QE-182-a`). This also covers the
  old "changed nothing" refusal.
- `G1-IMP` and `G1-GRD` flip to FIRES, and the "gap" is dropped from their labels. `G1B`, `UNC1` and `REN` are added
  with the page's bodies. There are 10 rows.
- One added print line, `R2 file`, echoes each Ruling 2 file line whole, so `A5`'s counts are readable from `A4`'s
  output. The row parser is unchanged.

## ADR
`ADR-0036` § S1 gets one append-only block, `#### Ruling 2 widened — 2026-10-21 (ABC-188)`, after the `ABC-163` block.
It states (i)–(vi), the output change and the rollback. Its diff is 25 `+` lines and 0 `−` lines.

## Criteria (readings in the companion observation)
| | result |
|---|---|
| A1 | MET: `main...HEAD` = the 4 Scope files at `eb097a7b`, before this hop's own notes. The waiver pipe prints nothing |
| A2 | MET: rc 1, `limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`, 0 `DIFFER` |
| A3 | MET: rc 1, `limb 1 MISMATCH: REN` only, 0 `DIFFER` |
| A4 | MET: rc 0, 10 of 10 rows, limbs 2/3 identical 10 of 10. Status, `HEAD` and refs unchanged |
| A5 | MET: G1-IMP 0/1, G1B 0/1, REN `src/book-file.ts` 0/17, P2b 1/1 |
| A6 | MET: D1 FIRES `src/uci.ts` 0/1, D2 FIRES 0/4, `<base> and <head>`. Limbs 2/3 identical to `341da4c1`. Base instrument: does not fire on both |
| A7 | MET: drift tip `b294ba6f` (scratch): rc 2, stderr `plant P2c did not apply at b294ba6f: changed [src/book-file.ts], names [src/book-file.ts src/cli.ts]` |
| A8 | MET: 0 `−` lines; (i)–(vi) stated |
| A9 | MET: `npm test` rc 0, 59/1987 = base, `success` true; skips 0; `biome.json` unchanged; lint, typecheck and build rc 0 |

## Residuals (none against a criterion)
- **`R-188-a` (INFO, Architect/Design).** The new `--- ` header match shares the old `+++ ` match's assumption: a
  content line that starts `-- ` (or `++ `) could pass for a header. The worst effect is a low `−` count on that
  file's later hunks, and the file still fires, because the hunk before it already counted. Measured: 0 production
  lines start that way at `eb097a7b` and at `b71f8902`.
- **`R-188-b` (INFO).** The file-list check catches a plant that misses a whole file (`QE-182-a`'s case). It does not
  catch a plant with two substitutions in ONE file where only one applies (`X1`, `G1B-base`). Out of the page's
  fix shape; recorded only.
- **Pre-existing, flagged and not changed:** `production files changed` omits a file deleted at `<head>` on every
  limb. Ruling 2 now names that file on limb 1.
- **`AR-163-UNCOMMENT`:** limb 1 is covered by `UNC1` when this merges. Limbs 2 and 3 stay open, LOW, owner
  Architect/Design. The Orchestrator records the partial.
- **`NFR-008`:** 0 / 0 / 0. No timing was taken.

## Board
Builder hop done. Next: QE reads `A2`–`A7` and the gates, then any Security/NFR records read of `A8`. Column moves are the Orchestrator's.
