---
id: 20260926T203000Z-architect-design-decision-g6-ruling-amendments-written-into-adr0026-adr0006-b7e41c92
kind: decision
by: architect-design
at: 2026-09-26T20:30:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-081
  - ABC-075
  - ABC-077
  - ADR-0026
  - ADR-0006
  - ADR-0025
  - memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
  - memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md
  - 20260926T201000Z-orchestrator-decision-52aaf5f3
  - 20260926T034100Z-architect-design-observation-g6-score-pair-reds-no-castling-key-bug-on-any-path-0a3528d1
  - 20260926T034200Z-architect-design-decision-g6-pair-is-a-decision-4-row-repoint-stands-no-new-row-ea306e58
  - 20260926T034300Z-architect-design-decision-pvsnoresearch-consequences-overclaim-no-row-added-408249af
supersedes:
---

# The `ruling-abc121-g6` amendments are written into `ADR-0026` and `ADR-0006`

Hand-authored, no `seal`. This repo ships no `context-io` writer and no `propose_note` tool
surfaced at this hop, so the note follows the `amend-adr0026` precedent (`…d41c7a58`). It is a
`decision`, so it needs no stamp. No test was run and nothing was re-measured. Every number is
cited from the ruling notes.

## Scope

- In scope: the two ADR files, one trace row plus its `_Updated_` log line, and this note.
- Out of scope: `src/`, `plans/board.md`, `memory-bank/00-index.md`. The index lists no ADR
  status, so it has nothing to change.

## What was applied

The owner's word was Olger Oeselg, 2026-09-26, verbatim *"3. accept"* (`…52aaf5f3`). Each proposal
was applied as written, and its "*(proposed 2026-09-26 …)*" marker became "*(amended 2026-09-26 …)*".

- **`ADR-0026`, decision 7:** the ruling's paragraph (`…ea306e58` §3) is appended as a sub-bullet.
  The paragraph says "the `G6` knight pair is struck from the examples above". To match that, the
  example list shows `~~`G6` knight pair,~~ *(struck 2026-09-26, see below)*`. The prior text
  stays visible.
- **`ADR-0026`, decision 9:** the note (`…408249af` §3) is appended after the "*Measured:*"
  sub-bullet of the mate-floor clause.
- **`ADR-0026`, Consequences:** the last two sub-bullets of the guard list are replaced by the
  ruling's three. An *(amended …)* line after them quotes the two replaced lines verbatim.
- **`ADR-0026`, Status:** one bullet records the amendment, the owner's word and the note ids. The
  status stays **accepted**.
- **`ADR-0006`, the `G6` cell:** the "how to check" cell is replaced with the ruling's text
  (`…ea306e58` §3). An erratum paragraph under the table quotes the old cell and gives the reason
  (`…0a3528d1` §2). The falsifier column and the Decision are unchanged.

## Not applied, and why

- **The `KNIGHT_G1_PAIR` erratum.** The ruling proposes no ADR text for it. `…ea306e58` §4 flags
  the `ABC-081` docstring in `src/transposition.test.ts` and says it "gets fixed when the owner
  accepts the `ADR-0006` erratum". The owner has now accepted, so that docstring edit is owed to
  the Engineer. It was not done here, because this hop makes no change under `src/`.

## Risks

- **Observation, not edited:** `ADR-0006`'s 2026-09-25 amendment paragraph still says "An
  availability key would collide the two, and the table would return a wrong score." That is the
  same premise the ruling corrects in the docstring: the two roots never share a table. The
  ruling proposes no text for that paragraph, so it was left alone. If the owner wants it
  aligned, it needs its own proposal.
