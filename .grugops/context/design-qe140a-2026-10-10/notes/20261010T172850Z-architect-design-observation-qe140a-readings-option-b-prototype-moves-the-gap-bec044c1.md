---
id: 20261010T172850Z-architect-design-observation-qe140a-readings-option-b-prototype-moves-the-gap-bec044c1
kind: observation
by: architect-design
at: 2026-10-10T17:28:50Z
verified_by:
confidence: high
refs:
  - QE-140-a
  - QE-140-b
  - QE-136-a
  - R5b
  - R5d
  - ABC-140
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - .grugops/context/design-qe140a-2026-10-10/probe/RUN.txt
  - .grugops/context/design-qe140a-2026-10-10/probe/architect-option-b-prototype.patch
  - 20261010T171908Z-qe-e2e-observation-abc140-gap-register-64112bc2
  - 20261010T171908Z-qe-e2e-observation-abc140-ledger-static-gates-5400cc2b
supersedes:
---

# `QE-140-a` readings at `bb73aebb`: option (b)'s contiguous pin closes QE's two spellings, and the same class survives one statement higher, on both guards, whole suite green

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The rows,
timestamps and re-run line are in `../probe/RUN.txt`, `ledger-file.tsv` and `ledger-suite.tsv`. Node v26.11.0,
Apple M3. Each build used a fresh `git archive` tree. The issuing ticket's `## Scope` / `## Risks` are `ABC-140`'s
and QE's gap register `…64112bc2`. This note cites them and does not restate them.

## O1. QE's committed harness ran, and the survivor reproduces
The permission layer refused nothing. At the wave tip `bb73aebb`, QE's `qe140-ledger.sh` / `qe140-plant.mjs`
(unchanged) gave these rows:
- `Q-WSC`: exit 1, on the composer tripwire.
- `Q-RETURN-BETWEEN+FMT+Q-WSC`: exit 0, 12/12, lint 0, tsc 0.

## O2. The Architect's own planter adds three builds
`../probe/arch-plant.mjs` adds three builds. QE's spellings are applied by QE's planter, unchanged.
- **`A-RETURN-BEFORE`:** an early `return` placed **above** the composer tripwire's pinned scan statement. It sits
  between the predicate and the scan, so it is outside both `R5d` literals and outside the gap QE named.
- **`A-LIC-RETURN-BEFORE`:** the same line placed above the **licence guard's** pinned scan pair. That is
  `QE-136-a`'s twin, and it is **outside `QE-136-a`'s trigger**, which runs from the importer statement to
  `toEqual`, now at `:373`–`:385`.
- **`A-CONTIG`:** a prototype of option (b), in `architect-option-b-prototype.patch`. It merges `R5d`'s two literals
  into one: the scan, a blank line, then the comparator. It keeps the one `biome-ignore` and adds none. It needs
  FMT to be lint 0.

## O3. The ledger

| build | at `bb73aebb` | with the option (b) prototype |
|---|---|---|
| `CONTROL` / `+FMT` | 0, 12/12 | 0, 12/12 |
| `Q-WSC` (witness) | 1, composer tripwire | 1, composer tripwire |
| `Q-N-TAIL`, `Q-C-SLICE` (`+FMT+Q-WSC`): edits pinned text | not run (QE: RED at head) | 1, drift tripwire (merged pin) |
| `Q-MUTATE-BETWEEN`, `Q-RETURN-BETWEEN` (`+FMT+Q-WSC`) | **0, 12/12** | 1, drift tripwire (merged pin) |
| `A-RETURN-BEFORE+FMT+Q-WSC` | **0, 12/12** | **0, 12/12** |
| `Q-LOCAL-SHADOW+FMT+Q-WSC` (`QE-140-b`) | **0, 12/12** | **0, 12/12** |
| `A-LIC-RETURN-BEFORE+FMT+Q-WPS` | **0, 12/12** | not applicable (licence guard) |

Whole suite (52 files):
- `A-RETURN-BEFORE+FMT+Q-WSC`: 1608/1608.
- `A-CONTIG+A-RETURN-BEFORE+FMT+Q-WSC`: 1608/1608.
- `A-LIC-RETURN-BEFORE+FMT+Q-WPS`: 1608/1608.

All three are lint 0 and tsc 0. Each witness alone reds: `Q-WSC` reds the composer tripwire and `Q-WPS` reds the
licence guard. So in every green row a kill was dropped.

## O4. What the readings say
- Option (b) is real and costs ≈ 0 in code. It closes exactly the two spellings QE named.
- Option (b) does not close the class. With the merged pin in place, an added statement one line higher keeps
  every pinned byte and drops the second-composer kill across the whole suite. The licence guard has the same
  opening above its own pins, and `QE-136-a`'s trigger does not name it.
- Text pins on these two guards have only one closure for the insertion class: the whole `it` body. That body
  contains `bindsAssembleFrame` (fenced by `ADR-0011` P7 and `ADR-0029` `AR-053-COMPOSER`) and both comment blocks.
- **Line drift:** `QE-136-a`'s trigger is written as `:366`–`:374` at `7f7e6b84`. At `bb73aebb` the same span is
  `:373`–`:385`. Line-number triggers go stale every time this file is edited.
