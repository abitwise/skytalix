---
id: 20260811T094000Z-software-engineer-artifact-ref-6b4cfc3b
kind: artifact-ref
by: software-engineer
at: 2026-08-11T09:40:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - plans/traceability.md
supersedes:
---

# What was built, what the gates said, and the eleven wrong builds that were run against it

**Branch `grugops/ABC-019-turn-loop-skeleton`, worktree `../cli-chess-ABC-019`. Not merged, not
pushed, not rebased onto the panels. No `git checkout main`, no merge, no deploy.**

## Artifacts

| File | Lines | What |
|---|---|---|
| `src/turn-loop.ts` | 261 | The loop, its two seam types, the prompt-outcome union, the terminal-reason superset, `INPUT_ENDED_NOTICE` |
| `src/turn-loop.test.ts` | 895 | 13 scripted rows + one test per criterion; both stub seams and **both** panel stub shapes are local to this file |
| `src/turn-loop.nfr.test.ts` | 144 | `NFR-002`'s spied derive counts at `A17`'s 40 / 120 / 300 plies |

`plans/traceability.md` — the `ABC-019` row only, three cells. Verified mechanically at the write:
**pipe count 12 → 12, table lines 36 → 36, and every other line md5-identical.**

## Gates — all four blocking gates, on the branch tip

| Gate | Command | Result |
|---|---|---|
| lint | `npm run lint` | exit **0** (2 pre-existing `biome migrate` infos, present at baseline) |
| typecheck | `npm run typecheck` | exit **0** |
| build | `npm run build` | exit **0** |
| unit | `npm test` | **715/715 on 24 files** (baseline 676/676 on 22) |
| skip count | the `AGENTS.md` § Test integrity command (`vitest --reporter=json` piped through `jq`) | **0** |

`self_fix_attempts` was **not** spent: one fixture defect was found on the first run of the suite (see
the `observation` note, item 1) and fixed before any gate was declared. No gate ran red on the tip.

## The eleven wrong builds — the ticket's own method, applied to the delivered loop

Each mutant was written into `src/turn-loop.ts`, the suite was RUN, the failing criteria recorded, and
the file restored. **The file was verified byte-identical to its pristine copy afterwards.** No mutant
was green.

| # | Wrong build | RED at |
|---|---|---|
| M1 | declares `H`, with a literal **tuned to shape A** | `A18`, `A19` |
| M2 | re-derives the winner from `blackToMove` | `A7`, rows 1-5 |
| M3 | begins a session **per frame** | `A19` |
| M4 | evaluates against a counts map that is not this game's | `A3`, `A4`, `A13`, `A7b`, row 4 |
| M5 | applies whatever the engine returns | `A10`, row 13 |
| M6 | does not repair the position after a throw | `A9` |
| M7 | dispatches on ply parity instead of side-to-move | `A1b`, `A2`, `A3b`, `A4`, `A5`, `A6`, `A8`, `A11`, `A13`, rows 6/8/10/11 |
| M8 | derives **twice** per ply | `A3`, `A3b` |
| M9 | re-evaluates on a non-advancing outcome | `A3b`, `A5`, `A6` |
| M10 | pads/truncates every frame to a declared height | `A19` |
| M11 | renders one frame per ply (no initial frame) | `A2`, `A1`, `A5`, `A6`, rows 8/9/10 |

**M1 is the row that justifies `A18`'s two shapes empirically:** a literal tuned to shape `A` is green
on every clause of `A19` under `A` alone, and RED the moment shape `B` runs. **M10 is the row that
justifies `A19` (c):** it is invisible to (a), (b) and (d).

## `NFR-002` — measured out of tree, not asserted in the lane

Own harness in its own process outside the repository, discarded warm-up round, **8 recorded rounds**,
cell order rotated every round, medians of per-round means. The render and both seams are reduced to
the cheapest shape the bar's own exclusion permits (a constant one-row frame, a no-op sink, seams that
index a precomputed line). Iterations 400/200/60 (average reading) and 300/200/80 (marginal reading) —
**fewer than the 400 the ticket's harness used at the two larger cells, and said so rather than
implied**. **Darwin arm64 / Node v24.12.0; `UNKNOWN - verify` on any other hardware.**

| plies | marginal at depth | averaged over the game | bar | marginal ratio |
|---|---|---|---|---|
| 40 | **27.23 µs** | 16.09 µs | ≤ 45 µs | 0.61x |
| 120 | **58.79 µs** | 30.99 µs | ≤ 100 µs | 0.59x |
| 300 | **112.86 µs** | 58.49 µs | ≤ 200 µs | 0.56x |

**`MET`/`MISS` is Security/NFR's at the gate. This is a measurement, not a verdict**, and no note in
this hop is a `finding`.

## `NFR-008` / `N8-LANE` — measured, and the verdict is BA/PM's

Paired interleaved rounds of the full lane against the lane with `--exclude='**/turn-loop*'` (which
reproduces the baseline **676/676 on 22 files** exactly), 7 rounds, warm-up discarded, CPU = user+sys
via `/usr/bin/time -p`, same machine as above.

- **Median paired delta: 740 ms CPU.**
- **Identity null control** (the full lane against itself, same rounds): median **1.23%**, inside the
  protocol's ≤ 1.5% floor — but two of seven rounds read 2.3% and 6.8%, so the delta carries roughly
  ±100 ms of real uncertainty and is not a tight number.
- Allowance: **≤ 650 ms CPU, net of 160 ms per test FILE added.** Two files added → 320 ms netted, so
  the chargeable figure is **420 ms against 650 ms = 0.65x**.
- Per-file test time: `turn-loop.test.ts` **28 ms**, `turn-loop.nfr.test.ts` **130 ms**. The NFR file
  is the expensive one and it is the 300-ply run that makes it so.

**`N8-LANE`'s owner is BA/PM at each cut, by the ticket's own words. Recorded here, not adjudicated.**

## Criteria — 17 of 19 met outright, 2 met in part and named as such

**Met:** `A1`, `A1b`, `A2`, `A3`, `A3b`, `A4`, `A5`, `A6`, `A7`, `A7b`, `A8`, `A9`, `A10`, `A11`,
`A13`, `A14`, `A15`, `A16`, `A18`, `A19`.

**Met in part, and the part that is not met is named rather than implied:**

- **`A12`** — all five automatic fixtures RUN and each stops with its own reason and that reason only
  (rows 1-5). What the separate `A12` test asserts is the **enumeration** — that the table holds a row
  for each of the five — and it reads the table's declarations, not a sixth run.
- **`A17`** — the spied-count half holds at all three ply counts, in the lane. The **timing** half is
  measured out of tree above and is **not** asserted in the suite, because the instrument that
  criterion names is not `vitest`. Whether the three bars are `MET` is Security/NFR's call.

`A3b` is recorded as met on a count of **`plies + 1`**, not `plies` — see the `decision` note, item 5.

## Requested board move, and what I did not do

**`In Development` → `In Review` for `ABC-019` — REQUESTED, not taken.** `plans/board.md` is the
Orchestrator's alone and was not opened for edit. The ticket file's front matter (`status:
in-development` / `column: In Development`) was **left alone deliberately**: moving it before the board
moves would put the two out of step, and the board is the authority.

**Still owed, and explicitly not mine:** the rebase of this branch onto merged `ABC-016` and `ABC-017`
and `ADR-0009` clause 9f's **real-panel** re-gate. Under clause 9 the loop's own code is
swap-invariant, so what that re-gate tests is the **seam wiring** — and only a real-panel run tests it.

Not done, at all: no merge, no push, no deploy, no `git checkout main`, no dependency change, no
unrelated refactor, no edit to any merged module, no `src/status-panel.*`, no `src/frame.test.ts`, no
`plans/board.md`, and no row of `plans/traceability.md` other than `ABC-019`'s.
