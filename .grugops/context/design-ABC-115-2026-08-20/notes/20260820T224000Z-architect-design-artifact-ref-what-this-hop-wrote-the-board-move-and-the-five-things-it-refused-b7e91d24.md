---
id: 20260820T224000Z-architect-design-artifact-ref-what-this-hop-wrote-the-board-move-and-the-five-things-it-refused-b7e91d24
kind: artifact-ref
by: architect-design
at: 2026-08-20T22:40:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - plans/board.md
  - plans/traceability.md
  - memory-bank/00-index.md
  - plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
supersedes:
---

# WHAT THIS HOP WROTE, THE BOARD MOVE, AND THE FIVE THINGS IT REFUSED TO DO

Branch `grugops/abc115-design`, worktree off **`grugops/cut-epipe-regression` @ `c9e7e11`** — **not
`main`**, because `ABC-115` exists only on that branch and merging it is the human's.

## Written

| file | change |
|---|---|
| `memory-bank/50-decisions/ADR-0016-closed-stdout-reader-ends-the-session-at-exit-zero.md` | **new**, `accepted` — the ruling, the seam, the permitted shape, five rejected alternatives, four falsification triggers |
| `memory-bank/00-index.md` | ADR census 15 → **16**, next free id `ADR-0017` — **same commit**, as that file's own rule requires; count re-measured by listing `50-decisions/` |
| `plans/tickets/ABC-115-…md` | frontmatter `backlog`/`Backlog` → `ready-for-dev`/`Ready for Dev`; one new `## Design ruling` section pointing at `ADR-0016`. **No criterion edited, no score touched** |
| `plans/board.md` | `ABC-115` `Backlog` → `Ready for Dev`; column header `0/6` → **`1/6`**; one `_Updated:_` header appended |
| `plans/traceability.md` | `ABC-115` row, `Status` cell, **append-only**; one header appended. Re-split from disk after the write: **12 pipe-fields**, the shape BA/PM recorded |
| `.grugops/context/design-ABC-115-2026-08-20/notes/` | this note plus one `observation` (measurements + prototypes), two `decision`s (the exit code; the seam), one `failed-attempt` (two dead ends) |
| `.grugops/queue/…/design-abc115-exit-code` | claimed by a **bare `mkdir`** per Workflow 17 and `AGENTS.md`, then `pending` → `claimed` → `done` |

**No `finding` was written and no stamp was minted.** `human_admission` is `off`,
`scripts/context-io.ts` and `mcp__grugops__propose_note` are absent, so every note here is
hand-authored per `agent-factory/contracts/context-note.md` under a soft kind. Nothing downstream may
read any of it as verified.

## The board move — and what it is NOT

`ABC-115` `Backlog` → **`Ready for Dev`**, `Ready for Dev` **0/6 → 1/6**, under the limit. Nothing
else moved.

**The ticket never sat in `In Design`, and I am not pretending it did.** The design hop ran
off-column at the Orchestrator's dispatch; `In Design` was 0/2 before and after, so no WIP limit was
breached either way. **The `Ready for Dev` EXIT — re-reading the criteria against the built tree
(`AGENTS.md` `## Process rules` 1) — is the Orchestrator's and was NOT performed here.**

## The five things this hop refused to do

1. **Did not touch `src/`.** `git diff --numstat -- src/` is empty on this branch. The three
   candidate arms were prototyped in a **copy outside the repository** and thrown away.
2. **Did not touch `AGENTS.md`** — and, more usefully, ruled that **no edit is owed to it**, which is
   the answer the brief asked for rather than a deferral. `ABC-109` is live against that file under a
   byte cap and is undisturbed.
3. **Did not re-score, re-cut or edit a criterion.** `S`/`P1` and `A1`–`A8` are BA/PM's. Where my
   measurements imply a row the page lacks (the bare-swallow shape), it is **recommended to BA/PM,
   not written by me** — it would take `N8-SPAWN` past the derived +5 ceiling, which is a scoring
   decision.
4. **Did not seed an NFR row, and did not open `plans/nfr-catalog.md`.** This design has no bar
   anybody could fail: no latency, no frame composed (`NFR-002` untriggered), no lane cost beyond the
   children `ABC-115` already priced. **The reversal trigger is named in `ADR-0016`:** if the same
   unhandled-`error` shape appears on a second stream, an exit-contract NFR with an owner becomes
   worth its row.
5. **Did not merge and did not deploy.** Humans hold both. `ABC-115` is not pulled past
   `Ready for Dev`; `ABC-043`, `ABC-042`, `ABC-044`, `ABC-113`, `ABC-114` are untouched; `ABC-050`'s
   `exclude` residual and `G-06` are still open and still not mine.

## Open, and handed forward rather than closed quietly

- **`A4`'s throwing-`InputSeam` half and the lint/typecheck of the delivered literal are
  `UNKNOWN - verify` at this hop** — I ran the CLI, not the test file and not the gates.
- **A TTY stdin was never exercised** (every run used pipes), and the interactive `| less` + `q` case
  is the real-world Given. `src/line-input.ts` sets no raw mode, so I expect nothing to restore under
  the primary shape — expectation, not measurement.
- **A non-`EPIPE` stdout error still crashes with a stack and exit `1`.** `ADR-0016` leaves it exactly
  as it is and says so; it is a ticket for whoever measures one, not a speculative arm.
