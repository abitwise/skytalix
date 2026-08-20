---
id: 20260820T233500Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-six-things-it-refused-f7e8d9c0
kind: artifact-ref
by: ba-pm
at: 2026-08-20T23:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - A1
  - N8-SPAWN
  - ABC-108
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
supersedes:
---

# WHAT THIS HOP WROTE, WHAT IT CHANGED ON THE PAGE, AND THE SIX THINGS IT REFUSED

Branch `grugops/abc115-amend`, worktree off **`grugops/abc115-design` @ `5703fcb`** — **not `main`**.
**Three branches are stacked unmerged** (`grugops/cut-epipe-regression` → `grugops/abc115-design` →
this one) because merging is the human's.

## Written

| file | change |
|---|---|
| `plans/tickets/ABC-115-…md` | **`A9` added** (the session ENDS, as a bound); **`A1`'s byte base corrected** from a constant to `982 + 2 × path length` plus a prohibition on asserting any byte count; **`N8-SPAWN` ceiling raised +5 → +6** with the reason and with wall/CPU clauses beside the count; `A9`'s instrument added to `## Test notes`; a `## Amendment` section; **DoR 9/10 ⚠️x1 → 10/10** (item 10 closed by `ADR-0016`, which the page's own `## Design ruling` section already said); DoR items 3, 4 and 6 corrected to match. **`A2`–`A8` NOT edited. Size `S` and priority `P1` NOT re-scored.** |
| `plans/board.md` | one `_Updated:_` header; the `ABC-115` entry **appended to in place**. **No column move, `Ready for Dev` stays 1/6, no WIP limit touched.** |
| `plans/traceability.md` | one `_Updated:_` header; the `ABC-115` row's last cell **appended to**, append-only, including the correction of the `1196 bytes` figure that row itself recorded at the cut |
| `.grugops/context/amend-ABC-115-2026-08-20/notes/` | this note, two `observation`s (the re-measurement; the byte formula), two `decision`s (`A9`; the ceiling), one `failed-attempt` (two instruments thrown away) |
| `.grugops/queue/…/amend-abc115-session-ends` | claimed by a **bare `mkdir`** per Workflow 17 and `AGENTS.md`, then `pending` → `claimed` → `done` |

**No `finding` was written and no stamp was minted.** `human_admission` is `off`,
`scripts/context-io.ts` and `mcp__grugops__propose_note` are absent, so every note here is
hand-authored per `agent-factory/contracts/context-note.md` under a soft kind. **Nothing downstream
may read any of it as verified**, including the numbers, which are my own runs.

## The six refusals

1. **Did not touch `src/`.** `git diff --numstat -- src/` is empty on this branch. All four builds
   were prototyped in a **copy of `src/` outside the repository** and thrown away.
2. **Did not re-open the exit code.** `ADR-0016` settled it; `A2`(i)'s literal `0` is untouched.
3. **Did not edit `ADR-0016`, `AGENTS.md`, or any other ticket.** `ABC-108` is named as the owner of
   the wall-clock budget `A9` grows — **named, not edited, not re-scored, not moved**.
4. **Did not move `ABC-115`** off `Ready for Dev`, and did not perform the `Ready for Dev` exit
   criteria re-read (`AGENTS.md` `## Process rules` 1) — that is the Orchestrator's.
5. **Did not re-score size or priority.** `A9` adds zero production lines and one child, so `S` holds;
   the page says so out loud rather than absorbing it. `SPLIT_REQUIRED` not raised.
6. **Did not merge, did not deploy, did not self-sign.** Humans hold merge; nothing is signed here.

## Two costs I am not hiding

- **The ticket page grew 361 → 451 lines**, against `AGENTS.md` `## Process rules` 2's ≤ 300-line
  budget. Measurements, rejected alternatives and instrument sweeps went to these notes as that rule
  requires; what stayed on the page is one criterion, one corrected base, one ceiling ruling and their
  reasons — the categories the rule keeps on the page. **It is over budget and it is stated, not
  smoothed.** A hop that wants the page shorter should cut the `## Amendment` summary first: it is the
  only part that restates what the criteria already say.
- **The lane will get ~1 s slower in wall time** when `A9` ships. Routed to `ABC-108`; not ruled here.

## Open, handed forward rather than closed quietly

- **`A9`'s instrument was measured on `/bin/sh` on macOS with Node v24.12.0 only.** `mkfifo`, the
  detached writer and `set -o pipefail` all work here; a platform change re-measures.
- **The `A9` row has never been run inside vitest.** It was measured as shell commands. Whether
  `spawnSync`'s `timeout:` kill of that wrapper reports cleanly through `childOf` is
  **`UNKNOWN - verify`** and is the repair hop's first check.
- **The detached `sleep` orphan** outlives the row by design. Harmless and bounded, but it is a
  process the lane leaves behind, and nobody has measured 20 of them running at once.
- **Everything the design hop left open stays open**: `A4`'s throwing-`InputSeam` half, lint/typecheck
  of the delivered literal, a TTY stdin, and a non-`EPIPE` stdout error.
