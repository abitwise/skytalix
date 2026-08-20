---
id: 20260820T231000Z-ba-pm-observation-i-re-measured-the-bare-swallow-claim-and-it-reproduces-a1a2f3b4
kind: observation
by: ba-pm
at: 2026-08-20T23:10:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - src/cli.ts
  - A1
  - A2
  - A9
supersedes:
---

# I RE-MEASURED ARCHITECT/DESIGN'S CLAIM RATHER THAN INHERITING IT — AND IT REPRODUCES

**Not a finding.** `human_admission` is `off`, `scripts/context-io.ts` and
`mcp__grugops__propose_note` are absent on this install, so no `§14-gate#<id>` verdict can be
emitted. This is an `observation`, hand-authored per `agent-factory/contracts/context-note.md`.
Nothing downstream may read it as verified.

**Architect/Design's note is itself an unstamped `observation`, so I treated every number in it as a
claim.** Fresh `git worktree` off `grugops/abc115-design` @ `5703fcb`, a **copy of `src/` in a scratch
directory OUTSIDE the repository** for the variants, Node **v24.12.0**, macOS, `/bin/sh`.
**`src/` WAS NOT TOUCHED** — `git diff --numstat -- src/` is empty on this branch.

## The four builds

| id | arm installed after `const sink = process.stdout;` (`src/cli.ts:148`) |
|---|---|
| BASE | none — the delivered build |
| V1 | `if (code !== "EPIPE") throw; process.exit(0)` — `ADR-0016`'s FALLBACK |
| V2 | `if (code !== "EPIPE") throw; process.stdin.destroy()` — `ADR-0016`'s PRIMARY |
| V3 | `if (code !== "EPIPE") throw;` and nothing else — **the bare swallow** |

## `A1` + `A2` on this page's own Givens — V3 PASSES BOTH

`set -o pipefail; node <build>/cli.ts --ascii </dev/null | head -2`

| build | exit | stderr bytes | 24-line control |
|---|---|---|---|
| BASE | **1** | **1274** (stack, `write EPIPE`, absolute checkout path) | exit 0, 0 bytes |
| V2 | **0** | **0** | exit 0, 0 bytes |
| V3 | **0** | **0** | exit 0, 0 bytes |

**V3 is indistinguishable from the ruled fix on `A1` and `A2`. The gap Architect/Design reported is
REAL, and a criterion was owed.**

## The live-stdin discriminator — 8.02 s vs 3.08 s, reproduced twice each

Instrument (theirs, and it is the right one — it times the CHILD, not the pipeline):

```
{ echo e4; sleep 8; echo quit; } | { /usr/bin/time -p node <build>/cli.ts --ascii; echo "NODE_EXIT=$?" >&2; } 2>/tmp/t | head -2 >/dev/null
```

| build | rep 1 | rep 2 | exit |
|---|---|---|---|
| BASE | real 3.06 | real 3.08 | 1 |
| V2 | real 3.08 | real 3.08 | 0 |
| V3 | **real 8.02** | **real 8.02** | 0 |

**Architect/Design measured 8.02 / 3.07 / 3.08. I measured 8.02 / 3.08 / 3.08. The claim holds to
the hundredth of a second on an independent hop.** V3's session runs on into a dead pipe until stdin
closes — the human types into nothing and the product looks alive.

## The instrument `A9` actually uses, and why it is cheaper than the one above

The 8 s discriminator prices a whole `DEFAULT_BUDGET_MS` engine search plus an 8 s sleep. A rejected
input (`zz`) forces a write with **no search**, so the same separation costs ~1 s:

```
mkfifo $F; ( { sleep 0.5; echo zz; sleep 10; } > $F & ); set -o pipefail;
node <build>/cli.ts --ascii < $F | head -2 >/dev/null; echo NODE_EXIT=$?
```

`sh` waits only for `node | head` because the writer is detached, so **the wrapper's exit IS the
child's ending** and no stopwatch is needed — the assertion is "did it exit inside the bound".

| build | 5 reps at `T_open = 10 s`, `T_bound = 5 s` |
|---|---|
| BASE | exit **1** at **1.05 s**, 5/5 |
| V1 | exit **0** at **1.05 s**, 5/5 |
| V2 | exit **0** at **1.05 s**, 5/5 |
| V3 | **NEVER EXITS — killed at the 5 s bound, 5/5** |

Cost of that one child, measured: **real 1.04 s, user 0.14 s, sys 0.02 s** — most of the second is
`sleep`, which is why the CPU cost is ~2× a normal child while the wall cost is ~15×.

## What I did NOT measure, so no gap is read as a pass

- **`npm run lint` / `npm run typecheck` on any candidate line.** The variants ran under Node's type
  stripping, which proves they parse. `UNKNOWN - verify` — same posture as the design hop.
- **The vitest lane.** I ran no test file and moved no spawn pin. `A7`'s base is the repair hop's to
  re-measure.
- **A TTY stdin, and `| less` + `q`.** Every run used pipes and FIFOs.
- **`A4`'s throwing-`InputSeam` half.** Still `UNKNOWN - verify`; still the repair hop's.
