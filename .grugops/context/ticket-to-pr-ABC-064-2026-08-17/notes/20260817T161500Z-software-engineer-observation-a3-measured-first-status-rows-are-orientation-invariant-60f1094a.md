---
id: 20260817T161500Z-software-engineer-observation-a3-measured-first-status-rows-are-orientation-invariant-60f1094a
kind: observation
by: software-engineer
at: 2026-08-17T16:15:00Z
verified_by:
confidence: high
refs:
  - ABC-064
  - src/cli.test.ts
  - src/status-panel.ts
  - src/frame.ts
  - plans/tickets/ABC-064-frame-shape-and-status-rows-on-non-default-children.md
supersedes:
---

# `A3` measured BEFORE it was asserted: the status rows are orientation-invariant, and the criterion stands as cut

`## Test notes` 2 and the Orchestrator's brief both require this measurement first, with an explicit
instruction to **report a difference rather than soften the criterion**. It was run first, against the
delivered children, before a single assertion was written.

## Method

A throwaway script spawned the delivered entry point exactly as `CHILDREN` does — piped stdio, no pty
— and sliced each stream's status region at `boardRegionOf(mode, orientation).length`, taking
`STATUS_ROWS` rows. The default child was taken as `npm run chess`'s frame TAIL (npm prints a banner
first). `--colour random` was spawned **six times** so the measurement could not be an artefact of one
lucky draw.

## Result: byte-identical everywhere. `A3` is TRUE as the page words it.

The default child's status rows, and every other child's:

```
[0] "White to move  1.    "
[1] "material: 0          "
[2] "                     "
```

- `black` — byte-identical to the default child's. **Match.**
- `random`, all six spawns — byte-identical. **Match.**
- `white` (not an `A3` child, measured anyway) — byte-identical.
- All four reference frames — `ascii`/`unicode` × `white-bottom`/`black-bottom` — carry the same three
  status rows. `STATUS_ROWS` is `3`; the board region is `9` rows in every pair, so the slice offset
  is orientation-invariant too.

**Nothing had to be softened and nothing was.** The `2 of 2` is met by measurement, not by wording.

## The thing a later hop should know

The invariance is not a coincidence of layout: `makeRenderSeam` binds the orientation and passes it to
`renderBoard` ALONE (`src/render-seam.ts:55`). `renderStatusPanel(history, status, thinking)` never
receives it. **The status panel is structurally incapable of seeing the human's colour**, which is why
the ticket's "colour changes orientation only" is a contract statement and not a guess. The delivered
rows now agree with the contract, and `A3` is what holds them to it.

Because of this the `A3` block carries a **non-vacuity guard**: the default child's status rows are
asserted non-empty before anything is compared to them. Three blank arrays compare equal to three
blank arrays, so a build that emitted no status panel at all would otherwise satisfy the criterion by
saying nothing. That guard is armed — see the mutation table in the sibling `decision` note (`M5`).

## Anchors: all five re-verified by reading the line, none guessed

The brief handed five corrected anchors and told me to verify rather than trust. Each was read at
`1a806ee` (a board commit; `git diff --name-only 6aedb7e 1a806ee` touches **no `src/` file**, so the
brief's `base: main @ 6aedb7e` anchors hold unchanged):

| cited | resolves to | read back |
| --- | --- | --- |
| `:244` | byte-exact tail + the eight ranks, on `npmRun` | `it("A1 — \`npm run chess\` writes the start position and exits 0"` |
| `:266`-`:270` | the rank loop that names the child/rank in its message | the `for (const rank of [...])` loop and its `\`rank ${rank}\`` message |
| `:308` | the append strategy | `it("A8 — the append strategy: no cursor control, and exactly one newline after the last row"` |
| `:356` | the per-colour board-region comparison | `it("A4 — the running entry point draws each colour from the human's side"` |
| `:933` | the `spawned` pin | `expect(spawned).toBe(10);` |

**Five cited, five resolved, zero unresolved and zero guessed.** `ABC-063`'s unresolved `:401` is that
ticket's and was not touched here.
