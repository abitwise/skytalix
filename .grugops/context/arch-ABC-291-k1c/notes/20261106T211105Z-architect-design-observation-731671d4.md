---
id: 20261106T211105Z-architect-design-observation-731671d4
kind: observation
by: architect-design
at: 2026-11-06T21:11:05Z
verified_by: 
confidence: high on the table, read as stated; the history is what the records show as searched; nothing run
refs:
  - ABC-291
  - ABC-228
  - ABC-274
  - ABC-289
  - ABC-290
  - ABC-292
  - ABC-293
  - ADR-0075
  - EPIC-011
  - orch-2026-10-30a/20261106T202213Z-orchestrator-decision-a7dc99cb
  - qe-ABC-291-k1/20261106T202814Z-qe-e2e-decision-2e186a33
  - bapm-ABC-291-k1-lines/20261106T210025Z-ba-pm-observation-cd569ec9
  - se-ABC-291/20261106T201944Z-software-engineer-observation-f0c9e801
  - arch-ABC-291-k1c/20261106T211039Z-architect-design-decision-6e97a0b6
supersedes: 
seal: sha256:e8766fa8d754311f932fbbaecc1fbcc9858c7b1cab99b0c9254f936c41a27ac7
---

# arch-ABC-291-k1c observation: what the ruling was checked against, three premises corrected, and what it leaves stale

Architect/Design. Read at `main` `85731c89` and `grugops/ABC-291` `9e496e4a`, read only. Nothing run but `git` reads, `sha256sum` and one text compare.

## Checked by read
| claim | how | result |
|---|---|---|
| QE's sealed files unchanged | `sha256sum` against `…2e186a33`; `git log` on `k1-rows.mjs`, `k1-labeller.mjs` | 3 of 3 match; one commit, `4948aad0` |
| seal before compare | commit order, 20:28:14Z and 20:37:25Z | holds. It shows no more than the order |
| probe's seal before the build | `d033ea0e` is an ancestor of `aec95beb`, 2026-11-05 13:55Z and 2026-11-06 19:47Z | holds, about 30 h |
| `labeller.ts`, `e4bprobe.ts` | `sha256sum` against the PREREG's `4dc558bb…`, `8b070dda…` | match |
| the 16 | `PAWN_SHAPE_POSITIONS` against `PAWN_SET`, text compare | equal, in order |
| corpora unchanged, `8e115110` to `9e496e4a` | `git diff` on `evaluate.mirror-corpus.ts`, `evaluate.taper-corpus.ts`, `evaluate.passer-fixtures.json`, `search.mate-corpus.ts`, `puzzle-corpus.ts`, `puzzle-suite.baseline.json` | empty |
| the seven zugzwang rows | the diffs of `search.null-move.test.ts`, `search.futility.test.ts` | door lists and `futilityNode` arguments only |
| K1 (b)'s tables | the diffs of `evaluate.passer.test.ts`, `evaluate.queen-on.test.ts`, `evaluate.taper.test.ts` | the function called changes, no table entry |
| `TAPER_MIRROR_POSITIONS` inside the door corpus | text compare | 30 of 30, so K1 (b)'s rows read PR4's corpora but the games |
| no production line since QE's drift read | `git diff --stat 63af973e 9e496e4a -- src tools` | three test files |
| bundle-off drift row against the probe | `raw/note-readings.md` | every published field matches |

**Not checked:** that any row is green. No test ran. `…f0c9e801`'s labeller figures, and whether QE opened anything before its seal.

## Premises corrected
1. **The brief's item 2 asks about K1 (b). The note means form (b)** (decision § 2). `…cd569ec9` and `…a7dc99cb` carried the same gap. The page's test note 1 keeps a sentence that now reads as K1 (b).
2. **"Cannot now be met" (brief, page banner, K1 (c)'s page line).** True of the guard. Of the words it is a little too strong: a rebuild after the freeze would meet them. It would be theatre, so I do not offer it, and the ADR line says so.
3. **"The owner was told at about 20:22Z."** It stands in the brief only. `…a7dc99cb` records the miss, not a word to him, and `…cd569ec9` found no such note at 21:00Z. I cite the brief and rest nothing on it. **`UNKNOWN - verify`** on the record, until the Orchestrator writes it.

## The miss has a history
`ABC-228` (`Q-SET`), `ABC-274` (`QE-274-a`), `ABC-289` (`…085f647c` 1), now `ABC-291`: four, and the last two after `EPIC-011`'s dispatch line of 2026-11-03. Prose has not held this one. `ABC-290`, `ABC-292` and `ABC-293` carry test note 1 word for word, and each ADR after d12's pattern will carry a K1 (c) with these words. The Orchestrator may want the next term's brief to check for the freeze note before dispatch. I build nothing for it here.

## Stale after this hop, none mine to edit
- **`ABC-291`'s page:** K1 (c)'s "it rules nothing" and "`ADR-0075` K1 (c) has no dated line on it"; test note 1's dated line; the drift bullet's "goes to the next Architect hop"; the banner's "no later step can meet them".
- **`ABC-290`, `ABC-292`, `ABC-293` test note 1:** "(b) rows" reads as a K row once each has an ADR. One word fixes it: "form (b)'s rows".
- **`qe-ABC-291`'s brief:** does not carry the labeller read, the PREREG line, or K1 (c) as two halves.
- **`ADR-0075` § `UNKNOWN - verify`'s row count:** `…cd569ec9` flagged it. Outside this brief's three items, so not touched.

## Width
The brief says three dated lines. The ADR takes those three, with bullets under the first two, plus one Status bullet and one Decision log row, 14 lines added and none removed. The log row is this ADR's habit. The Status bullet is needed because the line above it says K1 (h) is "the one place" a bar's words do not hold, and a reader starts there.

## One slip in the decision note
§ 4 says "the two reads above". It is one read and one PREREG line.
