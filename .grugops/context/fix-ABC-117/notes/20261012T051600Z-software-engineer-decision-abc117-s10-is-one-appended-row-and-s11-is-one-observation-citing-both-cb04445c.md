---
id: 20261012T051600Z-software-engineer-decision-abc117-s10-is-one-appended-row-and-s11-is-one-observation-citing-both-cb04445c
kind: decision
by: software-engineer
task: fix-ABC-117
at: 2026-10-12T05:16:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - QE-117-a
  - QE-117-c
  - S10
  - S11
  - plans/traceability.md
supersedes:
---

# S10 and S11 shapes, and the A10 referent

- **S10:** one row appended at the END of `plans/traceability.md`, keyed `ABC-115 (correction,
  ABC-117 S10)`. It quotes the clause it corrects and says the rest of the sentence stands. The
  `ABC-115` row (`:676`) is byte-unchanged. 10 cells, no pipe inside a cell. It sits before this
  hop's delivery row, which is also at the END.
- **S11:** one new `observation`, `…3429abce`, with an empty `supersedes`. Its `refs` name both
  `…0391186e` and the S3–S5 correction `…92514474`. That is the "follow-on observation citing both"
  the subtask allows, so S11 is corrected the same way S3–S5 were. `…0391186e` is a `claim` and its
  `G-QE115-5` conclusion stands, so superseding it would fold out a standing conclusion to fix one
  clause.
- **The page's false "verified clean" bullet:** a dated bullet is added directly under it in `## Out
  of scope`. The original bullet is kept.
- **QE-117-c:** in the `A10` comment, "this ticket" became `` `ABC-115` `` and "its `## Residual
  ruling`" became `` `ABC-115`'s `## Residual ruling` ``. Three comment lines were re-wrapped to stay
  within 100 columns (+3/−3). The heading is at `ABC-115`'s page `:249`.
- **Wording from this hop's own A1 run**, not from earlier notes: exit 1, `^usage: ` 0,
  `internal error` 0, banner on `src/cli.ts:160`; repro exit 1 with no `CAUGHT:`; control `--bogus`
  `^usage: ` 1. The figures in `…3429abce` come from that run.
