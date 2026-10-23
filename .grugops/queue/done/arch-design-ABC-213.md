---
subtask: arch-design-ABC-213
role: architect-design
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/arch-design-ABC-213/
width: 3 of 3 (records + light probes)
---

# Design ruling for ABC-213 (PGN cleanup guard): the test rig under ADR-0015

## Do
- Answer the page's one question: which fault-injection rig ADR-0015 allows — (a) hook inside the existing writer child (0 spawns, 0 files; recommended by BA/PM), (b) a `vi.mock` test file (+1 file), (c) a new child (+1 spawn). Probe (a) on a scratch copy. A change to an accepted ADR (e.g. clause (S)) is PROPOSED and STOPs to the owner.
- Dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-213` from `main`. Only the ABC-213 page, a proposed ADR if needed, your notes. No `src/`/tests. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design213/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-213`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: records plus light probes. Branch `grugops/arch-design-ABC-213` @ `41053cc1`** (from `main` `af4a934c`;
`e849e437` page ruling, `41053cc1` notes). Not pushed and not merged. Worktree `../wt-arch-design-ABC-213`. The probes
ran on a scratch copy of `src/` at `af4a934c` (scratchpad `design213/`).

- **Files:** the ABC-213 page § Design ruling (dated 2026-10-24), and `.grugops/context/arch-design-ABC-213/notes/`
  (2 notes) with the rendered index. **Not touched:** `src/`, tests, ADRs, the catalog, the board and the trace file.
- **The rig: (b′).** BA/PM's rig (b) double, a hoisted `vi.mock("node:fs")`, hosted in the **existing**
  `src/pgn.test.ts`: 0 spawns, 0 files, and the writer child is byte-identical.
  - (a) and (c) are refused by `ADR-0015`'s letter: `node:fs` fails (S), and `src/cli.ts` has no `node:fs` import.
  - Licensing them would be an accepted-ADR change for no gain over (b′). **Not proposed** (clause 2).
  - (b′) is outside the rule (in-process; `engine.capacity.test.ts` and `gameend.nfr.test.ts` precedent). (C) holds
    because `node:fs`'s errno contract is published. (N) holds (BA/PM).
- **The double:** call-through. It doubles only the five holder bindings. Unarmed, a relative path throws. Armed,
  relative paths are re-rooted under a per-row `mkdtemp`, a write writes 1 real byte and then throws W, a close
  closes and then throws C, and an unlink throws U or a codeless Error. A canary row comes first. Fallback: the same
  block in its own file (`N8-LANE` reading owed).
- **Probes** (deterministic):
  - **Rig (a)** works in the writer child via a `?fault` holder copy. Base: `A1` red. Fix: green. X1, X4 and X5
    each red their row.
  - **(b)/(b′)** under the lane's vitest 4.1.12 (`viteModuleRunner: false`): the mock reaches the holder.
    - Base: `A1` ×2 red. Fix: 6/6. X1: `A2` ×2 and `A3`. X4: `A1` ×2. X5: `A3`.
    - The 15 existing `pgn.test.ts` rows stay green in every variant, and no stray `games/` was written.
  - **Cost, indicative:** +0.07 s CPU on the one file (1.35 → 1.42 s median, n = 5, load1 about 6).
- **NFR:** `N8-SPAWN` 0. `N8-LANE`: no file, no spawn, writer child growth 0, so no reading is owed by the page's
  bars. The in-process cost goes to Security/NFR under Ruling 2.
- **ADR:** none changed or proposed. **STOP: none.**
  - The `ADR-0047` D4 dated line is **drafted on the page, not written**. It is a reading (best-effort removal on a
    double fault, first code, codeless rethrow).
  - The Orchestrator confirms that it is below the owner's bar (`…5aaf7cec` item 3). Otherwise it goes to the owner
    as INFO.
- **Next move (Orchestrator):**
  1. Merge this records branch.
  2. Move ABC-213 `In Design` → `Ready for Dev`.
  3. Queue `ticket-to-pr-ABC-213` (SE, (b′)) after `qe-timing-ABC-203`.
  4. QE: plants X1/X3/X4/X5, and `A5` by hand.
  5. `In Security/NFR` (Ruling 2; closes `AR-203-UNLINK`).
  6. Route the D4 line to Architect/Design at the build's records step.
- **Notes:** `20261023T223723Z-architect-design-observation-ecac899f` and
  `20261023T223723Z-architect-design-decision-d7ce173f`. Sealed by grugops 2.1.0 `appendNote` with the worktree's
  context root. Each validated with 0 faults, and the index was rendered.

### Trace row (10 cells, header order)

| ABC-213 (arch design) | Architect/Design: rig ruled (b′). The `vi.mock("node:fs")` call-through double hosted in the existing `src/pgn.test.ts` (0 spawns, 0 files, writer child byte-identical). (a)/(c) refused by `ADR-0015` (S)'s letter, with no addendum proposed (clause 2). `ADR-0047` D4 dated line drafted for routing | EPIC-006 | ADR-0015, ADR-0047, ADR-0036, ADR-0009, ABC-203, AR-203-UNLINK, AR-203-LANEGAP (b), QE-203-b, QE-203-c | NFR-008 (N8-SPAWN 0; N8-LANE no file/spawn, writer child +0; in-process about +0.07 s indicative to Security/NFR) | `grugops/arch-design-ABC-213` @ `41053cc1` (records only)<br>`plans/tickets/ABC-213-…md` § Design ruling<br>`.grugops/context/arch-design-ABC-213/notes/` (…ecac899f, …d7ce173f) | records only; scratch-copy probes at af4a934c (rig (a) in the writer child; (b) and (b′) under the lane's vitest: base A1 red, fix 6/6, X1→A2+A3, X4→A1, X5→A3; 15 existing rows green in every variant) | — | — | DONE; no STOP; merge is the Orchestrator's |
