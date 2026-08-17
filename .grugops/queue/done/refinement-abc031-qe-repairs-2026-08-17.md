---
task: refinement-abc031-qe-repairs-2026-08-17
role: ba-pm
---

# Repair the `ABC-031` ticket PAGE defects found by the engineer and QE

Not a re-cut, not a code change.

1. Repair `A2`'s FEN (kings adjacent, criterion unsatisfiable). **DONE** — `8/4P3/8/8/8/8/4k3/4K3` →
   `8/4P3/8/8/8/4k3/8/4K3`, verified 6 legal moves incl. four `e7e8`.
2. Repair the `A6` / zero-call wording (QE gap 1, OPEN). **DONE** — claim withdrawn in 5 places,
   marked `UNKNOWN - verify`, ruled accepted-as-unwatched with the reason and a falsifier.
3. Rule on QE's remaining findings. **DONE** — gap 5 → `ABC-104` (`XS`, `P3`); gap 4 → accepted, no
   ticket, routed to `ABC-076`'s live corpus discussion with an expiry; `src/cli.test.ts` module
   count → `ABC-103` (`S`, `P2`).

Notes: `.grugops/context/refinement-abc031-qe-repairs-2026-08-17/notes/`.
No `src/` file touched. `plans/board.md` not edited. Nothing merged.
