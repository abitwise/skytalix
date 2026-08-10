---
id: 20260810T213554Z-architect-design-artifact-ref-7d53c111
kind: artifact-ref
by: architect-design
at: 2026-08-10T21:35:54Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ADR-0009
  - NFR-002
  - memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# What this hop produced, and where the trace picks it up

## Written

| Artifact | What it holds |
|---|---|
| `memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md` | **New, `accepted` 2026-08-11.** The ruling in full: producer-owns-count, `A1`/`A11` clause struck, the fit-check in `src/frame.test.ts`, four alternatives with the reason each was rejected, consequences, rollback. Sets **no target and no level**, so no owner ratification is owed — the explicit distinction from `ADR-0008`. |
| `plans/nfr-catalog.md` | **`NFR-002` only.** One cell of the section's unknowns table edited (a stale two-link blocker chain; the `2x` → `3x` ratio pointer) and one subsection appended. **Its table row is BYTE-IDENTICAL** — all eight `NFR-` table lines hashed before and after, 8 lines before and 8 after, and one field count re-checked. No target, bar, measured figure or `UNKNOWN - verify` marker moved. |
| `plans/traceability.md` | **One row APPENDED (`ADR-0009`), no existing row touched.** |

## Deliberately NOT written, each with an owner

- `plans/tickets/ABC-016-status-panel.md`, `plans/tickets/ABC-017-bounded-move-history-pane.md` — the
  `A11` / `A1` clause strikes and `ABC-016`'s stale `NFR-002` flag. **Owner BA/PM at the next hop.**
- `plans/board.md` — **owner Orchestrator.** No board move is claimed or implied by this hop.
- `src/**` — **zero production lines**, which is the expected diff for a design hop. `src/render.ts` and
  `src/frame.ts` are merged and were read only. The fit-check in `src/frame.test.ts` is **specified, not
  written**: it belongs to whichever panel ticket merges second, at its own dev hop.
- The three untracked `src/_wb019*.ts` files are the concurrent `refinement-ABC-019` hop's declared
  throwaway harness. **Not mine, not touched, not committed.**

## Gates run at this hop

`npm run typecheck` (`tsc --noEmit`, project-wide) **green**. `npx biome check` reports both written
files as ignored paths — Biome does not process markdown in this project, so lint is not applicable to
this hop's outputs. No test was added and none was changed, so the `unit` lane is untouched and
`NFR-008`'s lane budget is not charged.
