---
id: 20260811T094000Z-software-engineer-observation-3f136750
kind: observation
by: software-engineer
at: 2026-08-11T09:40:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - NFR-002
supersedes:
---

# Gate results, the `A14` cost bar, and the structural fact the Security/NFR gate is owed

> **Hand-authored**, and deliberately an `observation` rather than a `finding`: the four gates below
> were RUN and these are their real outputs, but **no `§14-gate#<id>` verification stamp is issuable
> to me**, and Workflow 16 admits a `finding` only with one. Recording a self-stamped green would be
> the most expensive lie in the trace. The §14 gate is the authority on whether this is a pass.

## The four blocking gates, as they ran

| gate | command | baseline on `main` | after this ticket |
|---|---|---|---|
| lint | `npm run lint` | exit 0 | **exit 0** |
| typecheck | `npm run typecheck` | exit 0 | **exit 0** |
| build | `npm run build` | exit 0 | **exit 0** |
| unit | `npm test` | 676/676, 22 files | **707/707, 24 files** |
| skip count | `npx vitest run --reporter=json … jq` | 0 | **0** |

31 tests added (26 acceptance and snapshot, 5 call-count), 2 files added. **No test was skipped,
todo-ed or otherwise deferred, and no existing test was modified** — the 676 that were green before
are the same 676 and are still green.

**One self-fix round was spent and it was mine.** The first `npm run lint` returned exit 1 on one
formatting error in `src/status-panel.test.ts` (biome would have broken a 101-character filter
callback across lines). Fixed with `npx biome check --write` on my three files only, then re-run to
exit 0. `self_fix_attempts` is 2; one was used, one remains unspent. The two INFOS in that output
are pre-existing `biome.json` schema deprecations, are not errors, and were not touched.

## `A14` — the `NFR-002` bar, measured out of tree

Method matches the ticket's own derivation so the two are comparable: the deterministic LCG game
from `src/history.test.ts:81-89`, 2000 renders per round, nine rounds, medians of per-round means,
warm-up discarded, `parseFen` inside the timed region because the panel pays it there. **Machine is
the same one the bar names: Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify`
on any other hardware.**

| plies | measured | ticket's derivation |
|---|---|---|
| 0 | 0.57 µs | ≈ 0.2 µs |
| 40 | **5.68 µs** | ≈ 5.4 µs |
| 120 | **8.07 µs** | ≈ 8.0 µs |
| 300 | **9.94 µs** | ≈ 10.0 µs |

- **Part 1 — panel compute ≤ 25 µs at every one of 40 / 120 / 300 plies: HOLDS.** Worst cell 9.94 µs,
  **0.40x** of the bar — the same 0.40x BA/PM predicted.
- **Part 2 — the three figures within 3x of each other: HOLDS.** Spread **1.75x** (BA/PM derived
  1.88x). This is the machine-independent half.
- **Part 3 — the call counts of `A13`, the part that actually binds: HOLDS EXCEPT ONE CLAUSE.** See
  this hop's `claim` note; the exception is a defect in the criterion's wording, not a regression.

The 40/120/300 agreement with BA/PM's independently measured figures is within ~5%, which is
corroboration that the instrument is sane. **The 0-ply cell is the one that differs materially**
(0.57 against ≈ 0.2 µs) and I am not claiming BA/PM's figure is wrong: 0 plies is not one of the
bar's three points, the panel there is a `parseFen`-free path dominated by the 64-square scan, and
the difference is well inside what a different timing loop explains.

**These are a TARGET's measurements taken by the engineer, not a gate verdict.** Security/NFR owns
the verdict, and the ticket is explicit that a miss on any part is BA/PM's to rule on rather than the
engineer's to absorb. Nothing missed here.

## The structural condition `ABC-012`'s gate stands on, re-checked on delivered code

`NFR-002`'s `O(window)` boundary was verified structurally on the ground that nothing pulls the
repetition derive into a frame. Measured now by `grep` over `src/`:

- **Production runtime importers of `src/history.ts`: ZERO.** `src/status-panel.ts`'s only reference
  is `import type { GameHistory }`, which is erased; `src/san.ts`'s is a comment. **The verification
  survives this ticket**, which item 7 as originally written would have expired on merge.
- Test runtime importers: `src/history.test.ts` (pre-existing) and **`src/status-panel.nfr.test.ts`
  (new)**. The new one exists solely to spy `gameStatusOf`, `repetitionCounts` and `keyHistory` and
  assert the panel calls them **zero** times — it is evidence for the property, not a breach of it.
  Named here so the gate's `grep` is not surprised by a third match.

**`A13` is this ticket's own half and does NOT discharge the Security/NFR gate's half.** That is the
ticket's own words and this note does not weaken them.
