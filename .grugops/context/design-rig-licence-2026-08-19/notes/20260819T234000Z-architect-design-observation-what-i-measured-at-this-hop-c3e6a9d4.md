---
id: 20260819T234000Z-architect-design-observation-what-i-measured-at-this-hop-c3e6a9d4
kind: observation
by: architect-design
at: 2026-08-19T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0011
  - ADR-0015
  - src/cli.ts
  - src/line-input.ts
  - src/command-input.ts
  - src/frame.ts
supersedes:
---

# What I measured myself, and the one measurement that decided `G-01`

Everything below was run on `grugops/design-rig-licence` — branched off
`grugops/quality-gate-ABC-043-qe-2026-08-19` @ `afa68c2`, with `main` merged in. **`src/` is the QE
tip's `src/`**, unchanged by me: `git diff --name-only main HEAD -- src/` is `src/cli.ts` and
`src/cli.test.ts`, the delivered `ABC-043` diff and nothing of mine.

I re-derived only what the ruling had to stand on. QE's totality run, mutant results and gate figures
are QE's and I took them as given, as the brief directed.

## The composition, read off `src/cli.ts` rather than off a summary

`src/cli.ts:150-157`:

```
runTurnLoop({ history, humanColour, render, input, engine, sink })
```

| option | supplier named in `src/cli.ts` | is it an injection point? |
|---|---|---|
| `render` | `makeRenderSeam` ← `./render-seam.ts` (`:74`) | yes |
| **`input`** | **`createLineInputSeam` ← `./line-input.ts` (`:73`, passed at `:155`)** | **YES — and this is the measurement that decided the hop** |
| `engine` | `createEngine` ← `./engine.ts` (`:70`, passed at `:156`) | yes |
| `history` | `newGame` ← `./history.ts` (`:72`) | yes |
| `humanColour` | a value from `./cli-options.ts` (`:69`) | yes |
| `sink` | `process.stdout` (`:147`) | not a module |

**`InputSeam` is injected, exactly as `EngineSeam` is.** Neither QE's account nor BA/PM's states this,
and both rulings turn on it: it is why `A3` is not unbuildable, and it is why `./command-input.ts` did
not have to be reached for.

## Reachability, measured

| module | production importers (`grep -rn` over `src/`, `.test.ts` excluded) |
|---|---|
| `./command-input.ts` | **exactly one — `src/line-input.ts:56`.** Confirms QE's measurement independently. Named nowhere in `src/cli.ts` |
| `./frame.ts` | `src/render-seam.ts:41`, `src/turn-loop.ts:50`. Named nowhere in `src/cli.ts` |

**`./command-input.ts` sits in the identical structural position to `./frame.ts` — one static import
below a seam supplier — and BA/PM refused `./frame.ts` by name.** This is the measurement that makes
the refusal a *reproduction* of BA/PM's fence rather than an *extension* of it, and it is the reason
`ADR-0015` clause (S) is stated as a rule rather than as a preference.

## `ADR-0011` clause 4, re-verified because the ruling depends on it

`grep -c` over `^export`/`export ` in `src/cli.ts` → **0**. Clause 4 intact, and **nothing in
`ADR-0015` touches it.** Preserving it is what the rig exists for; the ruling would be trivial and
wrong if it were relaxed, which is why alternative D in `ADR-0015` names and refuses that route
explicitly.

## The gate, unchanged

`npx vitest run --reporter=json` at this branch tip: **exit 0, 1189 total, 1189 passed,
`numPendingTests + numTodoTests` = 0, `success: true`.** The record the brief named — **1189 / skip
0** — holds. Run in this agent's own contained worktree; the repo root was never used for a
measurement.

**I changed nothing under `src/` and nothing that a test reads**, so this is a confirmation that the
tree I ruled on is the tree QE gated, not a claim of new evidence.

## One trap for the next reader, since it cost this hop a merge

`grugops/quality-gate-ABC-043-qe-2026-08-19` predates `ADR-0014` and predates its own subtask file.
Branching off it verbatim gives you an ADR directory that ends at `ADR-0013` and an index line that
says *"next free id is `ADR-0014`"* — **both stale, and writing `ADR-0014` there would have collided
with the merged one.** `main` was merged in for exactly this reason. The only conflict was
`plans/traceability.md`'s header stamp; **both stamps were kept**, newest first, and **no table row
was touched** by me.
