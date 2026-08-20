---
id: 20260821T041500Z-software-engineer-observation-the-seventh-child-made-the-per-child-cpu-figure-fall-and-all-four-gates-are-green-2c8f5b19
kind: observation
by: software-engineer
at: 2026-08-21T04:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - A7
  - N8-SPAWN
  - NFR-008
  - ABC-108
  - G-QE115-3
supersedes:
---

# `N8-SPAWN` RE-MEASURED ON THE INSTRUMENT THE CLAUSE NAMES — MET ON ALL THREE, AND THE PER-CHILD FIGURE WENT DOWN

The brief said re-measure, do not quote. Nothing below is inherited from QE's or BA/PM's readings,
and where mine differ from theirs the difference is stated rather than smoothed.

## The instrument, as the clause defines it

`npx vitest run --dir src`, **5 interleaved paired runs**, base `main` @ `414ef75` versus this tip.
**Both sides are git worktrees with a symlinked `node_modules`** — QE flagged their own base/worktree
asymmetry as an honesty note, and pairing two worktrees removes it.

| pair | base real / user / sys | delivered real / user / sys |
|---|---|---|
| 1 | 2.86 / 14.33 / 1.43 | 4.26 / 14.75 / 1.62 |
| 2 | 3.06 / 14.03 / 1.33 | 4.30 / 14.82 / 1.63 |
| 3 | 3.05 / 14.20 / 1.38 | 4.25 / 15.20 / 1.65 |
| 4 | 3.16 / 13.93 / 1.32 | 4.23 / 14.93 / 1.64 |
| 5 | 3.07 / 14.02 / 1.36 | 4.25 / 14.96 / 1.67 |

- **Wall deltas** 1.40 / 1.24 / 1.20 / 1.07 / 1.18 → **median +1.20 s**, sign **5/5**.
- **CPU (`user`+`sys`) deltas** 0.61 / 1.09 / 1.27 / 1.32 / 1.25 → **median +1.25 s**, sign **5/5**.
- **Children** 17 → 24 = **+7**, asserted mechanically by the suite (`17 + 7`).

## The three clauses in force, each with its arithmetic

| clause | reading | verdict |
|---|---|---|
| `<= 7` added children | **+7** | **MET**, exactly at the ceiling |
| `<= 2.0 s` added wall | **+1.20 s** | **MET** |
| `<= 0.30 s` added CPU (user+sys) **per added child** | **1.25 / 7 = 0.179 s** | **MET**, at 60% of the ceiling |

**THE NUMBER WORTH NOTICING: the per-child figure FELL.** The delivery measured 0.198 s (BA/PM) and
0.202 s (QE) at six children; at seven it reads **0.179 s**. Adding a child made the per-child cost
go DOWN, which is BA/PM's pricing confirmed on the lane instrument rather than on standalone
readings: `A10`'s child dies at its first write, renders nothing and captures nothing, so it is the
cheapest child on the page. **A count clause was the only thing that had ever stood in its way.**

## The four mandatory gates, at the branch tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — `Checked 73 files in 62ms. No fixes applied.` |
| typecheck | `npm run typecheck` | **exit 0**, no output |
| build | `npm run build` (a typecheck wearing the build slot's name) | **exit 0**, no output |
| unit | `npx vitest run --dir src` | **exit 0 — 40 files / 1213 tests / 0 failed** |

**Test integrity:** skip count `0` from the host runner; `test-skip-integrity.js` → `No findings.`,
exit 0.

**`A7` reconciles exactly:** base 1207 → delivered **1213**, `1207 + 6` = `A1`, `A2`, `A3`, `A4`,
`A9`, `A10`. **0 new test files.**

**No flake:** `src/cli.test.ts` alone **10/10 green**; the full lane green on every run this hop
(**12 of 12**, the five paired-run deliveries included).

## Reported, not graded — and one gap NOT closed

**`NFR-008` is not graded here and no `N8-LANE` line is claimed.** `user` alone is over its 13 s CPU
clause on **both** sides of every pair above; that is `ABC-108`'s to rule and I do not rule it. This
ticket's **0.179 s per added child** is handed to `ABC-108` as a measured contribution, exactly as
`A9`'s was.

**`G-QE115-3` is NOT closed by this hop and I am saying so rather than letting it be assumed.** Only
the **count** clause has a mechanical pin; the wall and per-child CPU clauses are still asserted by
nobody, and drift on either is still invisible to the gate. QE recorded it as a gap rather than a
demand, and making a lane timing assertion mechanical is a design question `plans/nfr-catalog.md`'s
standing rule bears on — not a bench fix, and not in this subtask's fences.
