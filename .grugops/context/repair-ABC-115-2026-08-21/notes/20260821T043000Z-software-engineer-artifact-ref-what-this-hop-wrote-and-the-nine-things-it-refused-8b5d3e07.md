---
id: 20260821T043000Z-software-engineer-artifact-ref-what-this-hop-wrote-and-the-nine-things-it-refused-8b5d3e07
kind: artifact-ref
by: software-engineer
at: 2026-08-21T04:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - G-QE115-1
  - G-QE115-2
  - G-QE115-3
  - N8-SPAWN
  - plans/board.md
  - plans/traceability.md
  - src/cli.test.ts
supersedes:
---

# WHAT THIS HOP WROTE, AND THE NINE THINGS IT REFUSED TO WRITE

Branch `grugops/abc115-repair`, off `grugops/abc115-residuals` @ `92ccec5` — **not `main`**; **nine
branches are stacked unmerged** and nothing here was merged. Worked in its own `git worktree`.
Node v24.12.0, vitest 3.2.7, darwin-arm64.

## Written

- **`src/cli.test.ts`** — `+128 / -34`, and it is the **only** file under `src/` in the diff.
  `unwritableStdout()` beside the two existing `/bin/sh` builders; `CHILDREN.unwritableStdout`; the
  `A10` row in the existing `ABC-115` describe; the `N8-LANE` pin `17 + 6` → `17 + 7` with its
  comment block corrected (`G-QE115-2`); the `CHILDREN` section header six → seven; the file header's
  "six children need a REAL `head`" sentence amended.
- **`plans/board.md`** — `ABC-115` moved `In Development` → `In Review` (1/3 → 0/3 and 0/3 → 1/3,
  both under the limit), the ticket line appended to, one `_Updated:` line added.
- **`plans/traceability.md`** — one row touched in place (`ABC-115`), three cells appended to
  (`NFRs`, `Tests`, `Status`), one `_Updated:` line added. No row added or removed.
- **`.grugops/context/repair-ABC-115-2026-08-21/notes/`** — six notes: two `decision` (`A10`'s shape;
  the false sentences corrected out loud), two `observation` (the two-armed watched-RED round; the
  paired-run budget re-measurement and the gates), one `failed-attempt`, this `artifact-ref`.
- **`.grugops/queue/`** — `repair-abc115` claimed by a bare `mkdir` and transitioned to `done/`.

**All notes are hand-authored and UNSTAMPED.** `scripts/context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are absent from this repository and from the kit, and
`context.human_admission` is `off` — **no `finding` is admissible here and none is claimed**
(`AGENTS.md` § "Role / workflow files"). There is no `index.md` / `index.jsonl` because the
sanctioned renderer does not exist on this install; the notes are the source of truth.

## The measurements this hop stands on, in one place

- **Zero production lines:** `git diff --numstat 92ccec5 HEAD` → `128 34 src/cli.test.ts`, and
  `git diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'` → **empty**.
- **Gates:** lint exit 0 (73 files), typecheck exit 0, build exit 0, unit **40 files / 1213 tests /
  0 skipped** green; test-integrity `No findings.` exit 0 at skip count 0.
- **Watched RED:** mutant arm **1 failed / 60 passed**, the one red being `A10`; `main` arm `A10`
  **green** with `A1`/`A2`/`A3`/`A9` red.
- **`N8-SPAWN`:** +7 children, median +1.20 s wall, **0.179 s CPU per added child**, sign 5/5 on
  both, all three clauses MET.
- **Flake:** 10/10 single-file, 12/12 full lane.

## Refused

1. **Touching `src/cli.ts`.** The delivered 13-line fix is gated and verified; it is byte-unchanged.
2. **Widening the arm** to the accepted non-`EPIPE` residual, or proposing that it be widened.
3. **Re-opening any of the three rulings** — the exit code (`ADR-0016`), the CPU clause, the count
   ceiling.
4. **Pinning `1`, an errno, a byte count or a stack shape** in `A10`. Readings stay readings.
5. **A second `spawnSync` call site**, and any async `spawn` shape. Zero new call sites.
6. **Closing `G-QE115-3`.** The wall and per-child CPU clauses are still asserted mechanically by
   nobody; that is a design question, and it is named here rather than left to be assumed closed.
7. **Grading `NFR-008` or claiming an `N8-LANE` line**, and touching `ABC-108`,
   `plans/nfr-catalog.md`, `AGENTS.md`, `ADR-0016` or any other ticket.
8. **Re-scoring the ticket.** `S` / `P1` stand.
9. **Merging, deploying, conducting a UAT or self-signing anything.** The **delivered** diff carries
   13 production lines, so the zero-production-lines waiver does **not** apply to `ABC-115` — this
   hop adding none does not change that, and `In Review` is where the ticket now sits.

## One thing the Orchestrator has to know about the queue

`.grugops/queue/pending/repair-abc115.md` exists on `main` but **not at this branch's merge base**,
and this branch carries it in `done/`. **A merge will therefore leave a copy in `pending/` as well** —
git cannot see it as a move. It needs deleting by hand after the merge; it is not a second,
unclaimed task. The same is true of `rule-abc115-residuals`, which the previous hop already flagged.
