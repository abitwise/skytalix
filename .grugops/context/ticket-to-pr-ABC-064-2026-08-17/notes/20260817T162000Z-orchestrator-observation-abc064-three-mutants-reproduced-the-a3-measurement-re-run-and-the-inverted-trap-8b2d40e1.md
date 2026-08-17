---
id: 20260817T162000Z-orchestrator-observation-abc064-three-mutants-reproduced-the-a3-measurement-re-run-and-the-inverted-trap-8b2d40e1
kind: observation
by: orchestrator
at: 2026-08-17T16:20:00Z
verified_by:
confidence: high
refs:
  - ABC-064
  - ABC-063
  - ABC-042
  - src/cli.test.ts
  - src/frame.ts
  - src/render-seam.ts
  - src/status-panel.ts
supersedes:
---

# `ABC-064` verified: three mutants reproduced, `A3` re-measured, and a trap that INVERTS the last five tickets' lesson

Everything below I ran. The engineer's report is not evidence for the merge; this is.

## Three mutants, each redding its own target and nothing else

Throwaway worktree at `grugops/abc064-frame-shape-non-default-children`, outside the repository.
Control first: unmutated, `src/cli.test.ts` **42/42 green**.

| mutation | site | result |
| --- | --- | --- |
| an extra trailing newline on the frame write | `src/frame.ts:244` | **`A1` RED**, and it names the child: `white row count: expected [ 23 ] to include 24`. (`ABC-042`'s `:264` also reds — correct collateral, same property on the default child.) |
| a status panel blank on BOTH sides — **the vacuous-pass mode** | `renderStatusPanel` | **`A3` RED at its non-vacuity guard**: `the default child's status rows are blank: expected '' not to be ''`. **1 failed \| 41 passed.** |
| the word `random` leaked into a status row | `renderStatusPanel` | **`A4` RED**: `occurrences of \`random\` on the random child's stdout: expected 1 to be +0`. **1 failed \| 41 passed.** |

The middle one is the one that matters. **Every `toEqual` in `A3` compares the coloured children's
status rows to the default child's — and blank arrays equal blank arrays.** A build that emitted no
status panel at all would have satisfied `A3` as cut. The engineer put a non-vacuity guard in front
of it unprompted, and that guard is what fires. This is `ABC-063`'s lesson applied one ticket later,
by the same discipline, without being told a second time.

## `A3`'s measurement, re-run by me and not read

I spawned the delivered children myself and sliced each frame's status region:

```
default(npmRun): ["White to move  1.    ","material: 0          ","                     "]
black          : ["White to move  1.    ","material: 0          ","                     "]
white+unicode  : ["White to move  1.    ","material: 0          ","                     "]
random #0..#4  : ["White to move  1.    ","material: 0          ","                     "]   (all five)
```

Byte-identical across the default child, `black`, `white+unicode` and **five separate `random`
spawns**, matching his reported strings exactly. The structural reason checks out at source:
`makeRenderSeam` passes the orientation to `renderBoard` **alone** (`src/render-seam.ts:55`) and
`renderStatusPanel(history, status, thinking)` never receives it, so the status panel **cannot** see
the human's colour. `A3` is a contract fact held to the build, not a coincidence of one run.

## The trap, and why it inverts the last five tickets

`A1` says "exactly one trailing newline". The obvious assertion is
`stream.endsWith("\n\n") === false`. **It would have RED on a correct build**, and I verified both
halves at source:

- `src/frame.ts:205` — `rows.push("")`, a **reserved, deliberately unpadded empty prompt row**, is
  the frame's last row;
- `src/frame.ts:244` — the append writer emits `` `${frame.join("\n")}\n` ``.

So a correct stream genuinely ends in **two** newlines. **`ABC-061`, `ABC-062` and `ABC-063` were
all criteria that could not FAIL. This is a criterion that could not PASS** — and the failure mode
is worse, because the repair a hurried hop reaches for is to weaken the assertion until the correct
build goes green, which lands you back at unfalsifiable. The delivered row derives the count from
`frameOf` and carries both halves (`rows[last] === ""` and `heights` contains `rows.length - 1`),
which reds from either side.

**Recorded as a fourth class for the rule-1 retro input**: stale · already-satisfied ·
unfalsifiable · **impossible-as-written**. All four are found by RUNNING and missed by READING.

## What else I verified

- **`A5`**: `git diff --name-only 9957ddf~1 9957ddf` → `src/cli.test.ts`, one path. Whole-branch
  `--numstat`: **`121 0`** — purely additive, so every fenced row (`:244`, `:308`, `:356`, `:933`)
  is byte-identical **by construction**.
- **`spawned`** still `10` at `:933`; zero new children.
- **Commit hygiene**: `9957ddf` delivery (`src/cli.test.ts` only — what `A5` measures), `de38f85`
  ticket-page anchors only, `6bfde6b` notes only. The one-path criterion is respected without the
  page fix being skipped.
- **His base deviation is harmless**: he branched off `1a806ee` rather than the brief's `6aedb7e`.
  `git diff --name-only 6aedb7e 1a806ee` touches no `src/` file, so every anchor I handed him held.
  He flagged it himself rather than letting me find it.

## Gate

Run by me on the branch tip BEFORE the merge and on `main` AFTER, both: **869/869 on 30 files, skip
0, `No findings.` (exit 0), lint exit 0, typecheck exit 0, build exit 0.** Merged `--no-ff` at
`3b165ed`. `In Security/NFR` skipped — lean mode, no trigger: 0 production lines, 0 new files, 0
new spawns.

## What is NOT done

`ABC-064` is in **`Ready for UAT`** beside `ABC-063`. **No UAT has been conducted, nothing has been
waived, and nothing has been signed.** The owner was asked at the close of `ABC-063` — both for
these tickets and for whether "zero production lines" should become a standing waiver — and has not
answered. **Silence is not a yes, and a predicted answer is not an answer.** Both tickets hold here
until he speaks.
