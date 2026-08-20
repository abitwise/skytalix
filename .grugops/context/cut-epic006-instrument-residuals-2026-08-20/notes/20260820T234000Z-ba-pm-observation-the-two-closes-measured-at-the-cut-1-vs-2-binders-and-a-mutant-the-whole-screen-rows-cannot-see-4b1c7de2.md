---
id: 20260820T234000Z-ba-pm-observation-the-two-closes-measured-at-the-cut-1-vs-2-binders-and-a-mutant-the-whole-screen-rows-cannot-see-4b1c7de2
kind: observation
by: ba-pm
role: ba-pm
task: cut-epic006-instrument-residuals-2026-08-20
at: 2026-08-20T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-113/A1
  - ABC-113/A2
  - ABC-043/A1
  - ABC-044/A2
  - EPIC-006
supersedes:
---

# Both closes measured AT THE CUT, out of tree, so `ABC-113`'s criteria are numbers rather than adjectives

**Method, and its limit stated first.** Neither measurement mutates the repository. The binder count
is computed over the same derived view the test uses (`executableCodeOf`: the file with block and
line comments stripped). The `A2` measurement runs the **real delivered renderer** against a
**copy of `src/` in the scratchpad** with `REASON_PHRASE` mutated there, and evaluates the assertion
expressions directly (`not.toContain` is `String.includes`). **What was NOT done: vitest was not run
on a mutated tree**, because `ABC-044` is in UAT on this branch and mutating `src/` under a
concurrent agent is not a cost this cut is entitled to spend. `git status --porcelain` shows no
`src/` entry at any point in this hop.

## 1. `ABC-043` `A1` — the binder count, three builds

Expression: `entry.match(/\bhistory\s*[:=]/g)` over `executableCodeOf("cli.ts")`.

| build | matches | length | row |
|---|---|---|---|
| delivered branch tip | `["history ="]` | **1** | **GREEN** |
| `D3` — shadowing-parameter rebind (`const play = async (history: …) => …`) | `["history =","history:"]` | **2** | **RED** |
| `M9` — flat copy at the call (`history: decoy,`) | `["history =","history:"]` | **2** | **RED** |

**This reproduces QE's figures independently** (`decision` `2f1c8ba6`: delivered 1, shadow decoy 2,
flat-copy decoy 2). Two roles, two derivations, same three numbers.

## 2. `ABC-044` `A2` — a mutant the whole-screen rows cannot see, and the headline rows can

Mutant **`M11b`**, in the scratchpad copy of `src/result-screen.ts`:

```
"fivefold-repetition":   "by repetition"
"threefold-repetition":  "by repetition. it was claimed by the player to move under FIDE 9.2"
```

Headlines produced by the real renderer:

```
claimed:   "Draw by repetition. it was claimed by the player to move under FIDE 9.2."
automatic: "Draw by repetition."
```

| row, on `M11b` | result |
|---|---|
| non-substring, over the **joined screen** (as delivered) | **GREEN** |
| non-substring, over `screen.split("\n")[1]` (the close) | **RED** |
| `\bclaimed\b` present on the claimed screen | GREEN |
| `\bautomatic\b` present on the automatic screen | **RED** |
| `/automatic/i` absent from the claimed screen | GREEN |
| `/claim/i` absent from the automatic screen | GREEN |

Delivered build, same six rows: **all GREEN**.

**The honest reading, and it is on the ticket rather than hidden here:** `M11b` also reddens the
sibling `automatic` word row, so the headline close does not kill it *alone*. **And no mutant can be
built that it does kill alone**, which is a proof rather than a search: a substring relation between
a pair's two headlines requires the containing headline to carry the other's text, and the other's
text carries `automatic` (or `claim`) — the very word the sibling row forbids there. **So the close
buys non-vacuity and the criterion's own words, not new coverage.** The rows as delivered are
dominated; after the close they can at least fail.

## Where the numbers came from

`node` over the delivered source and over a scratchpad copy of `src/`; the delivered renderer imported
directly (`renderResultScreen`, `newGame`/`playMove`, `generateMoves`) on a 4-ply game. No test file
was edited, no production file was edited, no lane was run.

**No `finding` and no `§14-gate#<id>` stamp.** This install has no `scripts/context-io.ts`, no
`mcp__grugops__propose_note` and no stamp issuer; this is a hand-authored `observation` in the
folder's convention.
