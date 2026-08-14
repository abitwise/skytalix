---
id: 20260815T131500Z-software-engineer-observation-fourteen-mutants-rebuilt-and-the-three-censuses-9932110d
kind: observation
by: software-engineer
at: 2026-08-15T13:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q1
  - Q2
  - Q6
  - Q7
  - A6
  - A9
  - A2
  - N8-LANE
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
supersedes: 
---

# Fourteen mutants rebuilt at my own hand — QE's arming verified, and six more survivors found

**I did not inherit QE's arming, I re-ran it against mutants I rebuilt.** Every mutant below is an
**anchored** replacement that **aborts if its anchor is not found exactly once**, was proved on disk
(`git diff --name-only`) before the run, and was reverted with `git checkout -- src/` with
`git status --porcelain` verified clean after each one. `timeout 180` per run.

`MX1`–`MX3`, `MX6`–`MX8`, `MX13` are QE's `M7`, `M19`, `M20`, `M1`, `M2`, `M11`, `M14` rebuilt from
its descriptions, not copied from its harness. `MX4`, `MX5`, `MX9`–`MX12`, `MX14` are mine.

## The table — verdict BEFORE my change (on QE's armed base `257d023`) and AFTER

| # | mutant | before | after | red against which row |
|---|---|---|---|---|
| `MX1` | `token.startsWith(COLOUR)` — QE's `M7` | **KILLED** | KILLED | `A6(i)` — the 18 near misses |
| `MX2` | `token.toLowerCase() === COLOUR` — QE's `M19` | **KILLED** | KILLED | `A6(i)` — the 18 near misses |
| `MX3` | `COLOUR.startsWith(token) && token.length > 3` — QE's `M20` | **KILLED** | KILLED | `A6(i)` — the 18 near misses **and** `A8`'s numbers |
| **`MX4`** | **`token.trim() === COLOUR`** — MINE | **SURVIVED** | **SURVIVED** | — |
| **`MX5`** | **`token.endsWith(COLOUR)`** — MINE | **SURVIVED** | **SURVIVED** | — |
| `MX6` | `--debug` **enumerated** and handled — QE's `M1` | **KILLED** | KILLED | `A6(i)` equality + the fifth-flag row |
| `MX7` | `--debug` as a **bare literal** — QE's `M2` | **KILLED** | KILLED | `A6(i)` only-argv-literal + the fifth-flag row |
| `MX8` | second read `process["argv"]` — QE's `M11` | **KILLED** | KILLED | `A9` — `process.argv` occurs exactly once |
| **`MX9`** | **alias — `const ambient = process; ambient.argv`** — MINE | **SURVIVED** | **KILLED** | `A9` |
| **`MX10`** | **ESM import — `import { argv } from "node:process"`** — MINE | **SURVIVED** | **KILLED** | `A9` |
| `MX11` | `globalThis["process"].argv` — `X8`'s own spelling — MINE | KILLED **by `A2` only** | KILLED | `A2` **and now `A9`** |
| **`MX12`** | **optional chain — `process?.argv`** — MINE | **SURVIVED** | **KILLED** | `A9` |
| `MX13` | a binding on `globalThis` without `export` — QE's `M14` | **KILLED** | KILLED | `A2` (and now `A9` too) |
| **`MX14`** | **an ELEVENTH child via a direct `spawnSync`, bypassing `childOf`** — MINE | **SURVIVED** | **KILLED** | `N8-LANE` — ten children and no more |

**Every "SURVIVED" was confirmed against the WHOLE suite, not only `src/cli.test.ts`: `MX4`, `MX5`,
`MX9`, `MX10`, `MX12` and `MX14` each shipped 856/856 on 30 files green.**

## What this settles about QE's arming

**It holds, and I watched it hold rather than reading that it did.** `MX1` and `MX2` — the two
`--colour` survivors that were the whole of `Q1`'s diagnosis — red against `A6(i)`'s near-miss row.
`MX8` reds against `A9`. `MX13` reds against `A2`, so **`Q7` is confirmed armed**. `MX6`/`MX7` — the
fifth-flag controls — still red, so the arming broke nothing it was not aimed at.

`MX3` is a small bonus QE did not claim: `M20` was killed **only** by `A8`'s numeric transcription
before, and would have lived if written without a numeric literal. With `--colour` in its two-token
position it now reds against `A6(i)` as well, on the criterion that actually owns it.

## The naming collision in the subtask, resolved by covering both readings

The subtask says *"rebuild at least `M1`/`M2` (the `--colour` survivors)"*. In QE's own census `M1`
and `M2` are the two `--debug` mutants and both were **KILLED**; the `--colour` **survivors** are
`M7` and `M19`. The parenthetical is unambiguous and the numbers are not, so I rebuilt **all four** —
`MX1`/`MX2` (`M7`/`M19`, the survivors) and `MX6`/`MX7` (`M1`/`M2`, the controls). No reading of the
instruction is left untested and nobody has to adjudicate which was meant.

## A fault in my OWN harness, recorded because it produced a false result before I caught it

My first post-change census run reported `MX9`, `MX10`, `MX12` and `MX14` as **SURVIVED** after I had
already written the assertions that kill them. The cause: the harness reverts each mutant with
`git checkout -- src/`, which also reverted my **uncommitted** instrument work. Every run after the
first was measuring the un-strengthened file.

**A run whose treatment was silently reverted reads as a false SURVIVED — the exact mirror of the
false KILLED that the anchor guard exists to prevent, and I had guarded only one of the two
directions.** I committed the instrument first and added an **instrument guard** that proves the
strengthened rows are present before *and* after every single mutant application, then re-ran the
whole census. The table above is from that re-run. The discarded run is recorded here rather than
quietly dropped, because "a fix believed rather than watched" is what this ticket is about and I
nearly published one.

## My census is NOT exhaustive either — said before anyone has to discover it

Three roles have now run independent mutant censuses over this argv surface and **each found what the
others missed**: Security/NFR's argv mutant was killed and it recorded its own prediction as refuted;
QE's bracket-notation mutant reached past that; my alias / ESM-import / optional-chain mutants reached
past QE's, and my `endsWith` mutant reaches past QE's `--colour` arming. **Assume a fourth census
finds something too.** What I did not cover is listed in my spellings note and my gaps note, by name.
