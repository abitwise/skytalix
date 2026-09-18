---
id: 20260919T113000Z-architect-design-decision-nfr-008-cpu-level-is-15-s-on-the-owners-word-cpu-clause-met-by-60-ms-wall-reported-not-ruled-b4d1f8e6
kind: decision
by: architect-design
at: 2026-09-19T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A5
  - ABC-110/A6
  - ABC-110/A7
  - ABC-110/A8
  - ABC-110/A9
  - ABC-111
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0014
  - ADR-0019
  - memory-bank/50-decisions/ADR-0019-nfr-008-cpu-level-is-15-s-on-the-owners-word.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-110-close-the-default-lanes-1480-ms-cpu-deficit.md
  - .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
supersedes:
---

# `NFR-008`'s CPU level is **15 s** on the owner's word; **`ADR-0019` records him**; the CPU clause re-read at the new level is **MET by 60 ms and NOT ROBUST**; the wall clause is **REPORTED, NOT RULED**; `ABC-110` should **close on CPU with the wall residual named on `ABC-111`**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install. The
authority for the level is the owner's transcribed word (an agent's transcription, not a
`human:<name>` stamp — `context.human_admission` is `off`); the authority for the verdict is the
sibling `observation` note's numbers.

## What the owner decided, and its bound

> *"3. raise to 15s for now"* — Olger Oeselg, project owner, in session, 2026-09-19

Lever (ii) of `ABC-110`, the owner's alone. **It moves the CPU clause 13 s → 15 s and nothing else.**
The wall clause (3 s) is not named and does not move. Lever (i) — files behind an opt-in lane — is
not taken; no test file changed lane. `isolate: false` stays forbidden (`ADR-0008` decision 7).
"For now" is carried as three revisit triggers in `ADR-0019` `## Rollback`, not as a date he did
not give.

## The rulings

1. **`NFR-008` CPU (`≤ 15 s`): MET**, on the protocol median — **14.940 s = 99.6%**, n = 8, null
   control −0.37% at 3/8 (admissible), at `2c96dbd`, 40 files / 1213 tests / skip 0.
2. **The verdict is not robust, and that is part of the ruling.** Margin 0.4% < load sensitivity
   +1.1%; 4 of 16 usable runs individually over 15 s; one more average test file (~370 ms) puts the
   median over. **The level is exhausted on arrival.** Expect `ADR-0019` revisit trigger (a) to fire
   on the next ticket that adds a test file; the sized remedy (`OPT-1`, QE 2026-08-20) is already on
   the table, so that is a re-read against a known option, not a fresh escalation.
3. **`NFR-008` WALL (`≤ 3 s`): NOT RULED.** 4.385 s = 146.2% is **reported** — `ABC-111`'s warm/cold
   protocol is unsettled and `ABC-110` `A6` says no wall figure is a verdict until it is. **Said
   explicitly, as the subtask requires.** The size is flagged because it is not a warm/cold-sized
   number: a 1.4 s excess against a ±0.3 s straddle, with CPU/wall at 3.41x vs 5.29x — core
   contention from concurrent hops is the **candidate, not the cause**. `ABC-111` should be pulled
   soon and its `A5` second-session run is the discriminator.
4. **`N8-LANE` stays 650 ms** — the owner moved the level, not the bar; 5% of 15 s (750 ms) is NOT
   run into it; 650 ms now reads as 4.33% of the level; no ticket's line is re-cut. `ADR-0014`
   decision 4's rate-limit reading lapses by its own rollback clause on a conforming reading under
   the owner-moved level; the headroom it grants is 60 ms in substance; the standing form — measured
   milliseconds, then the clause state — is unchanged.
5. **`ADR-0014` reads `superseded by ADR-0019` on its level only**, exactly as its own `## Rollback`
   prescribed for this case; its measurement, attribution and sizing stand.
6. **The CPU figure the settled protocol implies** (the question `ABC-111` `A7` is to answer): this
   reading IS the warm-interleaved state by the row's own round-0 rule. If `ABC-111` settles on a
   cooled state, the CPU verdict is restated on that figure and, at 60 ms of margin, may flip; that
   flip is trigger (a).

## `ABC-110`'s criteria, dispositioned

| criterion | state | where |
|---|---|---|
| `A1`–`A4` | **DONE 2026-08-20 by QE** — cited, not repeated | `.grugops/context/ticket-to-pr-ABC-110-a1a4-2026-08-20/notes/` |
| `A5` | **SATISFIED** — verbatim, dated, option named (level move) | authority note; ticket page; `ADR-0019` |
| `A6` CPU | **RULED MET at 15 s** (99.6%, n = 8, null admissible) | sibling `observation`; catalog section |
| `A6` WALL | **NOT RULED — residual**, gated on `ABC-111` `A4`/`A7` | this note §3 |
| `A7` | **VERIFIED** — level-moved branch; `NFR-001`–`NFR-007` byte-identical; `NFR-008` level cell only; eight-row hash `63f66795…ca31` → `eee4dfff…3e5f` with the byte range now defined | sibling `observation` |
| `A8` | **VERIFIED no-op** — 1213 / 40 / skip 0 before and after; nothing moved lanes | sibling `observation` |
| `A9` | **NOT APPLICABLE** — no lane created; `AGENTS.md` untouched; `ABC-109` cap not engaged | — |

## Recommendation to the Orchestrator

**Close `ABC-110` on the CPU clause. Name the residual on `ABC-111`: `A6`'s wall half.** The wall
was always `ABC-111`'s input by the ticket's own dependency graph, and leaving `ABC-110` open for it
would keep a `P0` on the board whose remaining work belongs to a `P1` ticket that is already cut and
pullable. Two things to carry onto the board row when it moves: (1) 60 ms of headroom, so the next
file-adding ticket likely re-breaches at 15 s under `ADR-0019` trigger (a); (2) the reported wall
figure is 46% over and `ABC-111` should not sit in `Backlog` long. **Board moves are the
Orchestrator's; this hop moved no column.**

## What this hop did NOT do

No file under `src/` touched; `vitest.config.ts`, `AGENTS.md`, `package.json` untouched; no test
added, deleted, trimmed, or moved between lanes; no assertion changed; nothing merged, nothing
deployed; no board column moved. The harness ran outside the repository and is not committed;
`N8-SPAWN` 0 ms. `plans/board.md` untouched.
