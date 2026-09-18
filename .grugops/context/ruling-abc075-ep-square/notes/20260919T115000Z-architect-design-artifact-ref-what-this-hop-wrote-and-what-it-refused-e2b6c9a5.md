---
id: 20260919T115000Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-e2b6c9a5
kind: artifact-ref
by: architect-design
at: 2026-09-19T11:50:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ADR-0020
  - memory-bank/50-decisions/ADR-0020-ep-component-keys-on-the-ep-square-and-the-key-rides-the-per-ply-array.md
  - plans/tickets/ABC-075-incremental-zobrist-key-seam.md
  - plans/traceability.md
  - .grugops/queue/done/ruling-abc075-ep-square/ruling-abc075-ep-square.md
supersedes:
---

# WHAT THIS HOP WROTE, AND WHAT IT REFUSED

**Not a UAT-spec pointer**, so `sha` / `gate_run` / `content_hash` are absent by the contract's
own rule (they are required only on an `artifact-ref` that points at a committed `*.uat.spec.ts`).
No gate was run: this hop changed no code and no test, so there is nothing for a gate to say.

## Written — five paths, none under `src/`

1. `memory-bank/50-decisions/ADR-0020-ep-component-keys-on-the-ep-square-and-the-key-rides-the-per-ply-array.md`
   — NEW, `status: accepted`, supersedes `ADR-0005` Decision clause 1 only; owner quoted verbatim;
   six falsifiers.
2. `plans/tickets/ABC-075-incremental-zobrist-key-seam.md` — APPENDED (143 → 197 lines, under the
   300-line budget): "Ruling applied — 2026-09-19" (the seam, five sentences superseded as written,
   read this way now) and the DoR re-score, items 5 and 10 → ✅, **10/10**.
3. `plans/traceability.md` — ONE row (`ABC-075`) touched in place, three cells append-only, 10
   cells re-verified by escape-aware split before and after; one `_Updated:` line inserted after the
   title.
4. `.grugops/context/ruling-abc075-ep-square/notes/` — this note, the `decision`, the `observation`.
5. `.grugops/queue/` — `pending/ruling-abc075-ep-square.md` → `claimed/ruling-abc075-ep-square/`
   (bare `mkdir`, the atomic act) → `done/ruling-abc075-ep-square/ruling-abc075-ep-square.md`.

## Refused

- **`src/`** — zero bytes. This hop rules; `ABC-075` builds.
- **`ADR-0006`** — not re-opened, not edited.
- **`ADR-0005`** — not edited. Its clause 1 is superseded by `ADR-0020`'s own Status section; a
  later hop may add the customary back-pointer line if the project wants one.
- **`AGENTS.md`, `plans/board.md`** — not opened. `Blocked` → `Ready` is RECOMMENDED, not taken.
- **`plans/nfr-catalog.md`** — not opened for writing; no target moves.
- **`memory-bank/30-architecture.md`** — not edited; the two edits it owes are named in the ADR and
  fall due when `ABC-075` lands.
- **Merge, deploy** — neither.
- **A `finding`** — none; `human_admission` is `off`.
