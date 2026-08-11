---
id: 20260811T134000Z-architect-design-artifact-ref-5e8c94b2
kind: artifact-ref
by: architect-design
at: 2026-08-11T13:40:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0009
  - ADR-0010
  - NFR-002
  - memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md
  - plans/nfr-catalog.md
supersedes:
---

# Artifacts written at `design-frame-width-clearing`, and what was deliberately NOT written

> **Hand-authored** — `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. No
> `finding` in this task's notes.

## Written

| path | what | scope |
|---|---|---|
| `memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` | **NEW.** `accepted` 2026-08-11. 8 decision clauses, 6 alternatives (A–F), the sum-vs-max rule, one self-correction block. | Architect/Design's own |
| `plans/nfr-catalog.md` | One **new dated section** under `## NFR-002`. **All eight table rows byte-identical** — eight-line sha256 `1136d003d12c6674ce3594aa3e06d169a11c6023282d7285911dfb997227c810` before and after. `git diff --numstat` = **41 insertions / 0 deletions**. | Architect/Design's own |
| `.grugops/context/design-frame-width-clearing/notes/` | this note + one `decision` + one `observation` | Workflow 16 |
| `.grugops/queue/claimed/…` → `done/…` | subtask record, Workflow 17 | — |

**`ADR-0010`'s anchor claims, for a reader who wants the one-line version:** the consumer owns width
because `W` composes by **max** while `H` composes by **sum**; `ADR-0009` clause 1 is confirmed for
counts by the same measurement that denies it for widths; clause 9's `firstFrame.length` is sound only
because `H` is invariant (0 mismatches / 510 shapes) and `W` is not (4 distinct values, same sweep).

## NOT written, deliberately

- **Zero `src/` bytes.** `git status --porcelain src/` = **0 lines**. Every harness ran on copies
  outside the repository. The production change `ADR-0010` requires is **named and not made**:
  `src/frame.ts:216` (+ header `:27-29`), and three changes in `src/frame.test.ts` (the screen model
  must learn `\x1b[K` or the suite goes red; `:376`'s escape count 2 → 24; a first narrowing fixture).
- **No file under `plans/tickets/`.** All four read only. What `ABC-016` / `ABC-017` / `ABC-019` are
  each owed is enumerated in the `decision` note; **the Orchestrator routes, BA/PM writes.**
- **No `plans/board.md`.** The Orchestrator's.
- **No `plans/traceability.md` row** — nothing was built at this hop.
- **`memory-bank/50-decisions/ADR-0009-…` untouched**, byte-for-byte. Cited and extended; **not
  reopened**, no clause struck or reworded.
- **No new NFR row.** A per-frame correctness invariant with no target to miss belongs in an
  acceptance criterion (`ADR-0010` cl. 7), not in the catalog. `NFR-002`'s `< 16 ms` target does not
  move; no bar created, moved or loosened.

## Sources read read-only, and how

- **The delivered `ABC-016` panel** — `git show grugops/ABC-016-status-panel:src/status-panel.ts`.
  That branch was **never checked out and never written**; a Software Engineer is live on it.
- **BA/PM's `A13` notes** — `git show d469551:.grugops/context/refinement-ABC-016-a13/notes/…`. Those
  notes are **not on `main`**; the context directory the subtask brief names does not exist in this
  worktree, and this is how it was reached.
- **`ABC-019`'s ticket** — read from disk on `main`. A BA/PM agent is live on its branch; **nothing was
  written to it and no channel was opened.**
- Merged `src/frame.ts`, `src/frame.test.ts`, `src/fen.ts`, `plans/epics/EPIC-002-*.md`,
  `plans/tickets/ABC-017-*.md`, `plans/nfr-catalog.md`, `ADR-0009`.

## Gate posture

**No gate was run and none is claimed.** This hop changed **zero** `src/` lines and zero test lines, so
lint / typecheck / build / test are unaffected and the `676/676 on 22 files` baseline on `main` is
untouched by it. The gate obligation lands on whichever ticket carries `ADR-0010`'s production line —
and that run will be a **real** one, because the screen model at `src/frame.test.ts:187-188` throws on
an unmodelled escape and will go red until it learns `\x1b[K`.
