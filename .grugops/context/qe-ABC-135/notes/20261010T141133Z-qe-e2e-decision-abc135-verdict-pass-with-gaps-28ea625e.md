---
id: 20261010T141133Z-qe-e2e-decision-abc135-verdict-pass-with-gaps-28ea625e
kind: decision
by: qe-e2e
at: 2026-10-10T14:11:33Z
verified_by:
confidence: high
refs:
  - ABC-135
  - QE-054-a
  - QE-054-c
  - ADR-0030
  - src/render-seam.test.ts
  - commit:b09d880c
  - commit:ce6d8746
  - 20261010T141133Z-qe-e2e-observation-abc135-mutants-probes-map-2a045cdb
  - 20261010T141133Z-qe-e2e-observation-abc135-gap-register-efa99c8b
  - 20261010T141133Z-qe-e2e-artifact-ref-abc135-qe-rows-gates-5b93e7c5
  - 20261010T140136Z-software-engineer-decision-abc135-strip-inside-the-instrument-sibling-it-75495e30
  - 20261010T140136Z-software-engineer-observation-abc135-red-first-mutants-map-cost-f07216ef
supersedes:
---

# `ABC-135` QE verdict: **PASS_WITH_GAPS** at `ce6d8746`. `A1`–`A4` are MET and no gap blocks it

Hand-authored, no seal. This is a `decision`, not a `finding`, because this install has no `§14-gate`
verdict. The diff under review is `5c17d1ed..b09d880c` (code) on
`grugops/ABC-135-a8-comment-specifiers`, plus QE's one test-only commit `ce6d8746`. QE re-derived
every criterion against the page, with its own harnesses, in its own worktree and in `git archive`
copies.

| | reading (QE's own runs) | result |
|---|---|---|
| `A1` | The four `QE-054-a` spellings read `true` on the base instrument and `false` on the tip. A TypeScript-parser oracle of decision 2 also reads `false`. A row asserts each one. The eight `ADR-0030` rows' `it` block is byte-identical at base, `b09d880c` and `ce6d8746` (sha256 prefix `619e5f5dd5833d9b`): 4 `true`, 4 `false`, the strings unchanged and `toHaveLength(4)` kept. `M-NO-STRIP` and `M-STRIP-IN-CALLER` red the new `it` on row 1 | **MET** |
| `A2` | Both `QE-054-c` rows read `true` on the base, on the tip and on the oracle, and a row asserts each one. `M-SINGLE-LINE` survives the base (12/12) and reds the tip on the multi-line row. `M-FIRST-STATEMENT-ONLY` survives the base and reds the tip on the two-statement row. The pristine runs are green: 12, then 13, then 14 at QE | **MET** |
| `A3` | QE's own harness lifts the instrument by AST. Base and tip both read **1,190 pairs / 92 consumers**, and the maps are byte-identical (sha256 `a8da4a9d…99dc1`, equal to the Engineer's). A parser oracle agrees on all 1,190 pairs at both, so there is no over-strip and no residual mis-read on today's tree. `render-seam.ts` consumes `render.ts`, `status-panel.ts` and `history-pane.ts` | **MET** |
| `A4` | `git diff --name-only 5c17d1ed..b09d880c` = `src/render-seam.test.ts` only (+31/−6). At the QE tip, `-- src/` is still that one path (+46/−6). Lint, typecheck and build exit 0. `npm test`: 51 files / 1586 at QE, 1585 at `b09d880c`, 1584 at base, with 0 skips at all three. Integrity `No findings.` Lane inventory 51/51 `No findings.` (see QE-135-f for the branch-tip reading) | **MET** |

**The brief's own checks.**
- *Comment spellings the shared strip could mishandle.* 18 probes, set out in the observation note `…2a045cdb`.
  - URLs in specifiers and in comments are handled, and so is a `*/` in a line comment.
  - A `/*` inside a string literal (P1) or inside a line comment (P2) hides code. That is an under-count, there are 0 of either on the real tree, and the docblock names only P1 (QE-135-b).
  - One new over-count (P15) is unreachable in a gate-clean tree.
- *Over-strip that would drop a real consumer.* Three over-strip mutants survived the delivered file and were invisible to the real-tree map. QE closed that gap with three `true` rows in `ce6d8746` (QE-135-a).
- *The sibling `it`.* **Endorsed.**
  - The eight-spelling test asserts `toHaveLength(4)` over its `true` rows. Adding rows there would change what that count means, and `A1` requires the eight unchanged.
  - A sibling keeps the `ADR-0030` spellings as one block that a hash can check, and a failure names its own `it` (every mutant above names exactly one).
  - The one cost is house style: one `for … expect` per `it` stops at its first failing row, so a mutant that breaks two rows reports one. Every failure still names its spelling in the message, so this is not a gap.
  - QE's own rows follow the same reasoning: they sit in a third `it`, so that the Engineer's `it` still holds exactly the page's six.

**Board:** QE's hop is done. The `In Review` exit and the merge are the Orchestrator's. UAT is waived by
the standing 2026-08-17 rule, measured at merge (0 production lines on both commits).
