---
id: 20260821T052000Z-qe-e2e-observation-the-regression-sweep-on-the-whole-delivered-build-and-the-lane-cost-i-do-not-grade-890c8ad8
kind: observation
by: qe-e2e
at: 2026-08-21T05:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A7
  - A8
  - NFR-008
  - ABC-108
supersedes:
---

# THE REGRESSION SWEEP ON THE WHOLE DELIVERED BUILD — EXIT CODES, A REAL TTY, A PLAYED MOVE, THE GATES, AND FLAKE AT MY OWN BAR

Not the repaired rows only. Every reading below is mine, taken at `8d4980c` in a `git worktree` with
`node_modules` symlinked.

## The exit-code contract, all three codes, each driven independently of the suite

`AGENTS.md` `## Development`: *0 when the session ran, 1 for a refused command line, 70 for an
internal error.*

| code | how I drove it | reading |
|---|---|---|
| **0** | `node src/cli.ts --ascii </dev/null` | **exit 0**, board + `> input ended`, **stderr 0 bytes** |
| **0** | `node src/cli.ts --ascii </dev/null \| head -2` — this ticket's own Given | **node exit 0**, **stderr 0 bytes** |
| **1** | `node src/cli.ts --colour purple </dev/null` | **exit 1**, `--colour needs one of white\|black\|random: purple` + the usage line |
| **70** | `src/line-input.ts`'s seam made to throw, in the out-of-repo copy | **exit 70**, one line: `internal error: a bug ended this session, and it is not a chess outcome`, **no stack** |

The `70` row was driven by hand rather than read off the suite's substitution hook, so the contract
is answered by three independent measurements and not by one harness three times. The copy was
restored and `cmp`-verified byte-identical afterwards.

## A real TTY, and a move actually played

`script -q` around `/bin/sh -c '<product>; echo "NODE_EXIT=$?"'`, human plays `e4`:

```
   1. e4      Nc6
> input ended
NODE_EXIT=0
```

The board redrew, the engine answered `Nc6`, the status panel read `White to move  2.` and
`last: Nc6`, and the session ended at **0**. **3 consecutive runs, `NODE_EXIT=0` on all three.**
The product plays chess on a real pty and this ticket did not break that.

## The four mandatory gates and test integrity, at the tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — `Checked 73 files in 75ms. No fixes applied.` |
| typecheck | `npm run typecheck` | **exit 0**, no output |
| build | `npm run build` | **exit 0**, no output |
| unit | `npx vitest run --dir src` | **exit 0 — 40 files / 1213 passed (1213)** |

**Test integrity:** skip count **0** from the host runner's own JSON;
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`,
exit 0. **`.grugops/test-skips.md` was read, never written** — it is human-owned.

**`A7` reconciles at my hand:** 1213 total, `src/cli.test.ts` 61, **0 new test files**, 0 skipped.

## Flake, at my own bar

- `npx vitest run src/cli.test.ts` — **10 consecutive runs, 61 passed (61) on all ten.**
- `npx vitest run --dir src` — **3 consecutive runs, 1213 passed (1213) on all three**, plus the
  baseline and the JSON-reporter run: **5 of 5 full-lane runs green this hop.**
- The new child (`A10`) is a single `spawnSync` at module scope with no sleep, no FIFO and no race.
  It failed to be flaky in 15 opportunities. **No flake observed. I do not claim it cannot flake.**

## Lane cost — REPORTED, NOT GRADED, and that is the fence I was given

`/usr/bin/time -p npx vitest run --dir src`, delivered tip, three runs:

| run | real | user | sys |
|---|---|---|---|
| 1 | 4.37 | 14.90 | 1.64 |
| 2 | 4.48 | 15.18 | 1.70 |
| 3 | 4.23 | 15.38 | 1.64 |

Median **real 4.37 s**, **user+sys ~16.6 s**. **I do not grade this and I claim no `N8-LANE` line.**
`NFR-008`'s clauses are `<= 3 s` wall and `<= 13 s` CPU on a named reference machine with a
7-interleaved-run protocol I did not run, and `ABC-108`'s `OQ-1` still has the lane's own total
under open question. These are three readings on one machine on one afternoon, handed to `ABC-108`
as such.
