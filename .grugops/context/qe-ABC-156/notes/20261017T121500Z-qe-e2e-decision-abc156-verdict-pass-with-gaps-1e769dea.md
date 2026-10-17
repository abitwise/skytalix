---
id: 20261017T121500Z-qe-e2e-decision-abc156-verdict-pass-with-gaps-1e769dea
kind: decision
by: qe-e2e
task: qe-ABC-156
at: 2026-10-17T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-156
  - plans/tickets/ABC-156-metrics-rework-rate-undercounts-backward-moves.md
  - QE-156-a
  - QE-156-b
  - QE-156-c
  - QE-156-d
  - 20261017T120500Z-qe-e2e-observation-abc156-independent-rederivation-bb48de4c
  - 20261017T121000Z-qe-e2e-observation-abc156-criteria-plants-gates-0e84865a
  - 20261017T150000Z-software-engineer-observation-rederivation-a1560001
  - 20261017T150100Z-software-engineer-decision-header-placement-a1560002
supersedes:
---

# QE `ABC-156` on `grugops/ABC-156-metrics-rework-count` (tip `6d2caf56`, code `64e9c94d`, base `ac7d9589`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read. I took my
figures from my own walk over all 173 `plans/board.md` commits up to `3215004c`, before I opened the SE's notes. They
equal the SE's on every count.

| item | QE (independent) | SE | ruling |
|---|---|---|---|
| total / rate | 15 / 0.60 (15 of 25) | 15 / 0.60 | **A1 MET** |
| `ABC-017` / `ABC-019` | 2 / 3; the other seven unchanged; sum 15 = 15 chronology rows | same | **A2 MET** |
| "off by one" / register pointer | 0 / named | same | **A3 MET** |
| last ten | `022 023 013 025 016 027 017 028 029 019`: 7 tickets, 13 moves; the 11th is `009` | same set, 7 / 13 | **A4 MET** |
| numstat | metrics 2/1, page 29/0, trace 1/0, `src/` and `memory-bank/` empty | same | **A5 MET** |
| header with no blank line | literal A5 reading correct; a trailing `\` was an in-A5 option | flagged | conforms, `QE-156-a` |
| Period-cell clause | inside row `:28` and the Scope; matches Test note 2 | flagged | conforms |
| gates at tip | lint 0 (113), typecheck 0, build 0, `npm test` 58 / 1810, success true, skip 0, `No findings.` | same | **green** |
| UAT waiver | `ac7d9589...6d2caf56` production-`src/` grep empty | same | **applies**; waived, not signed |
| merge | `git merge-tree --write-tree main 6d2caf56` exit 0 | — | clean |

**Gap register.** No criterion is unmet, and none of these blocks.
- **`QE-156-a` LOW, cosmetic; the Orchestrator or the Factory Coach may take it or leave it.** The new `_Updated:`
  line and the 2026-08-20 line render as one CommonMark paragraph. A trailing `\` (a hard line break) would separate
  them and stay within A5 (+1 line, 0 others). The SE's note says *"A5 has to allow it"*, and that is not so.
- **`QE-156-b` INFO.** A2's sum check alone is blind to compensating errors: a planted `028` 2 / `019` 4 still sums
  to 15. A2's *"every other per-ticket count is unchanged"* clause closes this. I checked it per ticket against my own
  walk and against base.
- **`QE-156-c` INFO, outside this scope.** The Factory Coach's 2026-08-12 artifact-ref
  (`audit-delivery/…metrics-filled-0b844c19.md:33`) still reads *"13 backward moves"*, and nothing supersedes it. A
  superseding note is the Coach's call. No ruling cites 13 or 0.52, so the P2 raise trigger did not fire.
- **`QE-156-d` INFO.** The SE's three notes are stamped `at: 2026-10-17T15:0xZ`. The commit carrying them is
  `2026-10-17 11:58:50 +0000`, so the stamps run about 3 h ahead of UTC (local `+0300` was written as `Z`). Note order
  is unaffected.

**Next column.** At the `In Review` exit, QE recommends `Ready for UAT`, then `Done` under the zero-production-lines
waiver (measured, it applies). The Orchestrator decides.
