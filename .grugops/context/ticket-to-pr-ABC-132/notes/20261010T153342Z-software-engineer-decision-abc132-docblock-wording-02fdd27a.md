---
id: 20261010T153342Z-software-engineer-decision-abc132-docblock-wording-02fdd27a
kind: decision
by: software-engineer
at: 2026-10-10T15:33:42Z
verified_by:
confidence: high
refs:
  - ABC-132
  - ABC-053
  - ADR-0029
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
supersedes:
---

# `ABC-132`: how the three stale sentences were rewritten

This note is hand-authored and unsealed (AGENTS.md: no sanctioned writer on this install).
Branch `grugops/ABC-132-stale-docblocks` from `3159ab68`; code `1416a069`.

## 1. The three sentences

- **`src/render-seam.ts`** — "As of this ticket this module IS a frame producer and is DECLARED as
  one in … `FRAME_PRODUCERS` (`ADR-0011` clause 2: the frame path is declared, not derived)" became
  "This module IS the declared `COMPOSITION_ROOT` in `src/history-pane.nfr.test.ts`, and the frame
  path is DERIVED from it (`ADR-0029`: the root's load closure plus every module a frame call
  loads)." The parenthesis paraphrases the probe docblock's own membership rule
  (`src/history-pane.nfr.test.ts`, the `ADR-0029` paragraph above `COMPOSITION_ROOT`).
- **`src/result-screen.ts`** — "It is therefore NOT a frame producer and is deliberately NOT declared
  in … `FRAME_PRODUCERS` (… so the count moves deliberately rather than by drift)" became "It is
  therefore NOT on the frame path, by `ADR-0029`'s membership rule: it is neither in the load
  closure of `src/history-pane.nfr.test.ts`'s `COMPOSITION_ROOT` nor loaded by a frame call (only
  `src/cli.ts` imports it)." "Only `src/cli.ts` imports it" was re-measured at `3159ab68`:
  `git grep -n result-screen -- 'src/*.ts' ':!*.test.ts'` prints one line, `src/cli.ts:75`.
- **`src/cli.ts`** — the scope offered "drop the clause, or date it as `ABC-042`'s reading and
  point at `ADR-0029`". Took the second: "production 18 -> 20, entry points 1 -> 2 (`ABC-042`'s
  reading). The frame path is no longer a counted list: `ADR-0029` derives it from one declared
  root." The two kept counts are dated rather than re-measured, because re-measuring them is not
  this ticket's.

## 2. Words avoided (test note 1)

- `render-seam.ts`: no `process` substring, `globalThis`, `import.meta`, or `from "./…"`
  specifier in the new text.
- `cli.ts`: no `eval` (so not `ADR-0029`'s verb "evaluated"), `Function(`, `import(`, `fetch`.
- No new text says "frame producer" in any spelling, so `A2`'s case-insensitive grep stays 0.

## 3. Re-flow

`biome.json` `lineWidth` is 100. Only the edited paragraph lines were re-wrapped; no line in the
three files grew past what base already had (the pre-existing 101/102-character lines are base's).
