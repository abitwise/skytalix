---
id: 20260812T083600Z-qe-e2e-observation-baseline-gates-and-the-rig-4b1c07de
kind: observation
by: qe-e2e
at: 2026-08-12T08:36:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.nfr.test.ts
supersedes:
---

# Baseline, gates, and the rig — validated against the record's own controls before anything was judged

> **Hand-authored.** `scripts/context-io.ts` does **not** exist — re-checked at source at this hop,
> not inherited: `ls scripts` fails, and a `find` for `context-io*` / `claim*` across this repo
> (outside `node_modules` and `.git`) and across the kit root
> `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. So note kind, id and front matter are
> written by hand and there is **no derived `index.md` / `index.jsonl`** for this `ref:` — `notes/` is
> the source of truth and stands alone. **`scripts/claim.js` does not exist either**; the Workflow 17
> claim was taken by hand (atomic `mkdir`).
>
> **`kind: observation`, not `finding`, and that is forced.** `.grugops/context/quality-gate-ABC-029-qe/`
> held **no `§14-gate` verdict record** when this hop started (checked: the directory did not exist),
> and `context.human_admission` is **`off`**. **No `finding` is written at this hop and nothing is
> self-stamped.** A gate I ran myself is not a `finding`.

## 1. Baseline verified on arrival, so any red below is attributable to me

| | brief said | I measured, before touching anything |
|---|---|---|
| lint | 0 | **0 errors**, 2 infos (both pre-existing `biome migrate` notices about `biome.json`) |
| typecheck | 0 | **0** |
| build | 0 | **0** (it is `tsc --noEmit`) |
| tests | 750/750 on 26 files | **750 passed (750) on 26 files** |
| skip count | 0 | **0** (`--reporter=json`, `numPendingTests + numTodoTests`) |

All five matched exactly. Environment: Apple M3 / Darwin 25.5.0 arm64 / Node **v24.12.0** /
vitest **3.2.7** / git 2.55.0. `UNKNOWN - verify` on any other machine.

**`ADR-0008`'s two ratified clauses hold with room**, three runs of `npm test` with `PERFT_DEEP`
unset on this branch tip: **wall 1.77 / 1.75 / 1.82 s** against ≤ **3 s**, **CPU (user + sys)
9.01 / 8.89 / 8.92 s** against ≤ **13 s**.

**I added no code and no test, so my own `N8-LANE` delta is ZERO by construction** — the file count
in the lane is unchanged and `src/` is byte-identical to the branch tip. The disputed lane TOTAL and
the ticket's unreconciled `~102 ms` `RF-1` figure are routed to `ABC-026` and I left them there.

## 2. The rig, stated precisely — because the record's description of it is ambiguous

Two trees, both built **out of tree** in a scratch directory from the git object database and from
this worktree. **No repository worktree was written by any measurement, and none of the six live
worktrees was entered** (`../cli-chess-ABC-019`, `../cli-chess-ABC-028`, `../cli-chess-ABC-029`,
`../cli-chess-ABC-029-build`, `../cli-chess-abc028-a2`, `../cli-chess-abc028-qe`).

- **`base16`** — this branch's tree verbatim. **16** non-test `.ts`, **26** test files.
- **`base17`** — **the post-rebase tree**: this branch plus `turn-loop.ts`, `turn-loop.test.ts` and
  `turn-loop.nfr.test.ts` taken at `grugops/ABC-019-turn-loop-skeleton` (`b1bf089`). **17** non-test
  `.ts`, **28** test files, `turn-loop.ts` md5 **`bd793612476c9d0eac28b75e1e3297cc`** — reproduced.

**Each cell in every table below is the REAL `src/history-pane.nfr.test.ts` run under REAL vitest**
against a throwaway copy, with the verdict read per `it` out of vitest's JSON reporter. No guard was
re-implemented.

### The record's `cmp`-identity claim does not reproduce as stated, and here is the exact reason

The parent notes and this subtask's brief both say the replica's **16 shared non-test files are
`cmp`-identical** to this branch. **Measured by md5 over every `src/*.ts` at both refs: one file
differs — `src/history-pane.ts`** (`54fd4346…` at the tip and on `main`, `c4653c4c…` here). That is
`ABC-029`'s own single permitted production line, so the divergence is expected and its content is a
comment; **the claim is true of `main` vs the tip (0 of 16 differ, verified) and false of this branch
vs the tip.**

**It changes no verdict** — a comment cannot move a guard — but `## Test notes` 8 makes that identity
a **stop condition** (*"if it does not reproduce, stop and re-measure"*), so a reader following the
instruction literally will halt on a false alarm. Recorded so the next hop does not.

## 3. Rig validation — both controls the record requires, reproduced verbatim

| control | required by the record | measured |
|---|---|---|
| **ruled** instrument, BASE, `base16` | green / green | **green / green**, 8/8 |
| **ruled** instrument, BASE, `base17` | green / green | **green / green**, 8/8 |
| **delivered** instrument (`b7e1226^`, md5 `65f4f29a…`), `base16` | green / green | **green / green**, 8/8 |
| **delivered** instrument, `base17` | RED / RED | **RED / RED**, 6/8, messages **verbatim** |

The two verbatim messages, which are the ones the ticket records:

```
expected [ 'turn-loop.ts' ] to deeply equal []
history.ts was evaluated in a production closure: expected [ 'apply.ts', 'moves.ts', …(14) ] to not include 'history.ts'
```

**So the rig reproduces the red it is supposed to remove, on the tree it is supposed to remove it
on.** Everything downstream rests on that.

## 4. Determinism and the probe's own bars — re-run, not inherited

- **12 consecutive runs of `src/history-pane.nfr.test.ts`: 12 × 8/8, 0 flaky.** The structural reason
  is intact and I confirmed it by reading the delivered source rather than by trusting the note:
  there is **no wall-clock assertion, no concurrency and no ordering dependence** in the probe, and
  no duration is compared to anything.
- **The probe's three controls are still falsifiable, and I falsified two more than the record
  required** — see the sibling `observation` on the probe's bars.

## 5. `ui_e2e` — stated rather than invented

`quality.ui_e2e` is **`ui-or-critical-path`** and this project has **no runnable UI surface**:
`AGENTS.md` records `Dev / run` and `E2E` as `UNKNOWN - verify` with no CLI entry point until
`EPIC-006`. **No E2E was written and none is owed at this hop.** Recording `UNKNOWN - verify` here is
the honest result; inventing a Playwright lane against a program that cannot be started would be a
faked check.
