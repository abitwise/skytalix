---
id: 20260821T033500Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-eight-things-it-refused-3c9f5d81
kind: artifact-ref
by: ba-pm
at: 2026-08-21T03:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - G-QE115-2
  - A10
  - N8-SPAWN
  - plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
  - plans/traceability.md
supersedes:
---

# WHAT THIS HOP WROTE, AND THE EIGHT THINGS IT REFUSED TO WRITE

Branch `grugops/abc115-residuals`, off `grugops/qe-abc115` @ `3b2ac08` — **not `main`**; eight
branches are stacked unmerged and nothing here was merged.

## Written

- `plans/tickets/ABC-115-…md` — new `## Residual ruling — 2026-08-21` section; new criterion **`A10`**
  in `## Acceptance criteria`; a superseding `⚠️` on the `N8-SPAWN` bullet in `## NFR / security`
  (`<= 6` → `<= 7` added children, pin 23 → 24, time clauses unchanged); DoR item 6 marked superseded
  in place with the original wording kept as the record.
- `.grugops/context/rule-ABC-115-residuals-2026-08-21/notes/` — six notes: two `observation` (the
  lane-wide mutation reading; the two-build delta and the instrument), one `failed-attempt` (the
  copied tree that was red before the mutant), three `decision` (the guard is owed; the ceiling goes
  to seven; the non-`EPIPE` residual is accepted with a trigger).
- `plans/traceability.md` — one row touched in place (`ABC-115`), two cells appended to.
- `.grugops/queue/` — `rule-abc115-residuals` claimed by a bare `mkdir` and transitioned to `done/`.

**All notes are hand-authored and UNSTAMPED.** `scripts/context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are absent from this repository and from the kit, and
`context.human_admission` is `off` — so **no `finding` is admissible here and none is claimed**
(`AGENTS.md` § "Role / workflow files"). There is no `index.md` / `index.jsonl` because the sanctioned
renderer does not exist on this install; the notes are the source of truth.

## Refused

1. **Touching `src/`** — not `src/cli.ts`, not `src/cli.test.ts`. The mutant lived in a throwaway copy
   outside the repository and the repository's `src/` is byte-unchanged.
2. **Writing `A10`'s test.** The row is the criterion; the code is the repair hop's.
3. **Repairing `G-QE115-2`** — the superseded `<= 0.5 s CPU` clause and the false "THE CPU CLAUSE IS
   BREACHED" sentence in `src/cli.test.ts`. A real defect of my own budget ruling, routed elsewhere.
4. **Re-opening `ADR-0016` or the exit code**, and proposing any wider arm.
5. **Re-deriving the CPU clause** — only the COUNT clause was in question and only it moved.
6. **Moving `ABC-115` on `plans/board.md`.** It stays in `In Development` until both defects are
   repaired; the move is the Orchestrator's.
7. **Grading `NFR-008` or claiming an `N8-LANE` line**, and touching `ABC-108`, `plans/nfr-catalog.md`
   or `AGENTS.md`.
8. **Merging, deploying, or self-signing anything.**

## One thing the Orchestrator has to know about the queue

`.grugops/queue/pending/rule-abc115-residuals.md` exists on `main` but **not at this branch's merge
base** (`3b2ac08` predates it). This branch carries it in `done/`. **A merge will therefore leave a
copy in `pending/` as well** — git cannot see it as a move. It needs deleting by hand after the
merge; it is not a second, unclaimed task.
