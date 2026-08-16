---
id: 20260816T141143Z-software-engineer-claim-gates-and-criterion-verdicts-4d9a1e07
kind: claim
by: software-engineer
at: 2026-08-16T14:11:43Z
verified_by:
confidence: high
refs:
  - ABC-067
  - ABC-071
  - src/cli.test.ts
supersedes:
---

# Gate results and every criterion's verdict, with the measurement each was scored on

**Recorded as a `claim`, not a `finding`, and not stamped.** `AGENTS.md` § Role / workflow files:
no `finding` is admissible on this install and `context.human_admission` is `off`. The gate commands
were really run and their output is transcribed; no `§14-gate#<id>` verdict is claimed for them.

## Gates, on the branch tip `grugops/slot-guard-anchor-2026-08-16`

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 54 files in 56ms. No fixes applied.` exit **0** |
| typecheck | `npm run typecheck` | `tsc --noEmit`, no output, exit **0** |
| test | `npm test` | `Test Files 30 passed (30)` / `Tests 861 passed (861)` |
| build | `npm run build` | `tsc --noEmit`, no output, exit **0** |
| skip count | `npx vitest run --reporter=json … jq` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit **0** |

`.grugops/test-skips.md` was **read and passed to the checker only**. No row was written — it is
human-owned.

**One self-fix, of two allowed.** The first `npm run lint` failed with a **formatting-only** diff, on
two of my own added lines (a long `throw` and a long `const`). Fixed with
`npx biome check --write src/cli.test.ts`; second run green. No rule was disabled and no assertion
changed.

## `ABC-067`

| criterion | verdict | measurement |
|---|---|---|
| `A1` window bounded, one-closer case reds | **MET** | mutant `M1`: `GREEN 32/32` before, `RED` after with `AGENTS.md's \`- Dev / run:\` slot comment does not close before the next list item` |
| `A2` bound is a property of the captured region | **MET** | asserted in the suite: **0** `"\n- "` in the captured slot unmutated; the unbounded window on the same fixture holds **≥ 1** (4 measured). Technique: the closer must precede the next top-level list item — `A2`'s own first named alternative |
| `A3` dead branch live, or claim withdrawn | **MET, both halves** | the never-closes sentence is gone; the replacement states only what is delivered, and each named failure is exercised by a fixture (absent label, duplicated label, unterminated slot). **0** sentences asserting an untested protection |
| `A4` over-capture proved harmful | **MET** | mutant `M2`: before, red on `--coverage` (wrong reason); after, `reasonOf(twoRemoved)` is asserted **equal to** `reasonOf(unterminated)` — same message, the unterminated slot |
| `A5` `ABC-065` unchanged and green | **MET** | `ABC-065` `A1`/`A3` and `ABC-042`'s `AGENTS.md` row green; slot still **9 lines / 800 bytes**; 861/861, skip **0**. No merged criterion edited or deleted |
| `A6` nothing else moved | **MET** | `git diff --name-only HEAD~1 HEAD` → `src/cli.test.ts`, one path. 0 production lines, 0 new files, `expect(spawned).toBe(10)` green |

## `ABC-071`

| criterion | verdict | measurement |
|---|---|---|
| `A1` appended duplicate no longer green | **MET** | `M3`: `GREEN 32/32` before, `RED` after on `` `- Dev / run:` slots in AGENTS.md: expected 2 to be 1 `` — the count, not a missing option |
| `A2` asymmetry gone | **MET** | asserted structurally: `expect(new Set(reasons).size).toBe(1)` over the after-placed and before-placed fixtures. On disk, `M3`/`M4`/`M5` all red with one identical message |
| `A3` unmutated file unaffected | **MET** | label occurs exactly **1**; captured slot unchanged at 9 lines / 800 bytes; suite green, skip **0** |
| `A4` no unstated assumption | **MET** | the assertion enforces it and a six-line comment records the decision and its reason. **0** unstated |
| `A5` nothing else moved | **MET** | one path, 0 production lines, 0 new files, `spawned` **10** |

## `N8-LANE` — inherited by name on `ABC-067`, bar 650 ms

**0** new test files, **0** new files under `src/`, **0** new child processes. Two new rows, both
reported at **0 ms** on three consecutive runs; the file's in-process `tests` figure moved 14 ms →
13 ms (noise, and downward). The added work is string arithmetic plus two `readFileSync` of a 5 KB
markdown file the block already reads. **No measurable increase against `ABC-065`'s 152.5 ms charge
(0.23× the bar).** I did not re-run `ABC-042`'s full A–B CPU protocol; that method is recorded at
`.grugops/context/security-nfr-ABC-042-g1-regrade/notes/` and nothing in this diff moves the terms it
measures.

## Two judgement calls a reviewer should see

1. **`A5`'s "9 lines / 800 bytes" is measured, not asserted in the suite.** Pinning a byte count of
   `AGENTS.md` would break the moment someone adds an honest sentence to the slot, which is exactly
   what `ABC-067` test note 3 and `ABC-065` test note 3 forbid. Measured at delivery instead.
2. **`A4`'s `--coverage` is named in a comment and in the notes, not in an assertion.** Asserting that
   a particular token sits below the slot would be asserting `AGENTS.md`'s prose. The assertion that
   IS in the suite is the prose-independent one the criterion actually scores: the two-closer case and
   the one-closer case give the **same** stated reason, so `--coverage` can no longer be it.

## What is NOT in this diff, deliberately

`ABC-068`, `ABC-069`, `ABC-070` — same block, same slot, not this hop. `AGENTS.md` is untouched
(sha256 identical to the pre-hop file). `plans/board.md` is the Orchestrator's; the `plans/` edits
present in the working tree at this hop are not mine and were **not staged**.
