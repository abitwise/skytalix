---
subtask: arch-design-ABC-203
role: architect-design
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/arch-design-ABC-203/
width: 1 of 3 alongside arch-analyse-game-1 (disjoint files)
---

# Design ruling for ABC-203 (PGN file at game end) before the build

## Do
- Answer the page's four Architect questions: (1) module shape — pure formatter / writer holding `node:fs` / wiring; how the headline reaches the comment; ADR-0002 clause 4 (`history.ts` type-only). (2) Keeping the tree clean under `npm test` when spawned children reach an outcome with the tree root as cwd — with no argv/env reaching the production path. (3) The clock seam for the file name and `Date` tag. (4) Whether an ADR is needed (new ADR = fine if it reverses nothing accepted; reversing an accepted ADR = STOP, owner).
- Read ADR-0036 (b1)/(b2) and name what Security/NFR must check (first file write, the `games` symlink case).
- Write the ruling as a dated `## Design ruling` section on the ABC-203 page (and an ADR file if you rule one is needed). Recommend the next move (Ready for Dev / In Development with the SE).

## Fences
- Work on `grugops/arch-design-ABC-203` (worktree `../wt-arch-design-ABC-203` from `main`). Only the ABC-203 page, a new ADR if ruled, and your notes. No `src/`, tests, `package*.json`, `.gitignore`, board/trace. Not the game-1 analysis files (parallel hop). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design203/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-design-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: the four questions are ruled on the ABC-203 page (`## Design ruling`, 2026-10-23), and `ADR-0047` is written and accepted. The STOP did not fire** (Architect/Design, 2026-10-23). Branch `grugops/arch-design-ABC-203` @ `738a3c9f`: two commits on `main` `06fabb18` (`4a788b92` ruling + ADR + probe, `738a3c9f` notes). Records only.

- **Q1, module shape.** `src/pgn.ts` is pure: `pgnStamp(Date)` and `formatPgn(…)`, with its own replay and `history.ts`/`turn-loop.ts` as type-only imports. `src/result-screen.ts` exports its existing headline function, and its rows do not change. `src/pgn-file.ts` is the only `node:fs` holder: one export `writePgnFile(startedAt: Date, text)`. The name is derived inside from the `Date`, so only a `Date` reaches the path. It does a recursive mkdir of `games`, a `"wx"` open with `-2`…`-99`, a write to the descriptor and an unlink on failure. It reports an errno code only (`^E[A-Z0-9]+$`), and anything else is rethrown (exit 70). `src/cli.ts` gates on `reason !== null` after the screen.
- **Q2, tree clean.** The seam is the child's `cwd`; no argv or environment value is involved. In `cli.test.ts`, `childOf` runs every direct entry-point child from a module-scope `mkdtemp` directory, removed by exact path. `npmRun` keeps the repository and ends by EOF. Two guard rows, 0 spawns. `N8-SPAWN` is unchanged. The holder tests need **one** spawned child, because the `threads` pool refuses `process.chdir` (measured). `A14` is clarified: source rows on `cli.ts` that count what the ticket adds may move (the `process` census goes 10 → 11) with a dated reason.
- **Q3, clock.** `const startedAt = new Date()` appears once in `cli.ts`, directly before `runTurnLoop(`. Tests use the local-time `Date` constructor, with no `TZ` (measured at +14 and −10). `A12` is a source-order row.
- **Q4, ADR.** `ADR-0047` (`memory-bank/50-decisions/ADR-0047-a-finished-game-is-written-under-games-by-exclusive-create-from-one-fs-holder-whose-path-only-a-date-reaches.md`) is accepted and reverses nothing.
- **Security/NFR must check:**
  - (b1) limb 1 on `pgn-file.ts`, (b2) `cli.ts -> pgn-file.ts`, and limb 2 on the new `process.stderr`;
  - `ADR-0036` § Decision 3 re-armed twice: a sixth holder, and a caller value reaching a capability. Input: no call-graph reach;
  - a `games` symlink to a directory is followed (measured). Input: accept, LOW;
  - ASVS V12: path, exclusive create, errno-only output;
  - `NFR-008`: +1 file and +1 spawn (the page estimated 0). Rule whether `N8-LANE` is owed.
- **Next move:** `In Design` → `Ready for Dev`, then `In Development` with the SE, then QE, then Security/NFR.
- **Notes** (in `.grugops/context/arch-design-ABC-203/notes/` on the branch; sealed by grugops 2.1.0 `admitAndAppend`; read back as 2 notes, seals ok, index rendered):
  - `20261023T195412Z-architect-design-observation-26a21f7c`;
  - `20261023T195428Z-architect-design-decision-e6de1e00`.
- **Not touched:** `src/`, tests, `package*.json`, `.gitignore`, the board, the trace, `plans/nfr-catalog.md`, and the `arch-analyse-game-1` files. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-203 | Architect/Design ruling: pure `pgn.ts` + one `node:fs` holder `pgn-file.ts` (only a `Date` reaches the path; `"wx"` with `-2`…`-99`; errno-only) + `cli.ts` wiring; test children from a `mkdtemp` cwd with guard rows; one `new Date()` before `runTurnLoop(`; ADR-0047 accepted, STOP not fired | EPIC-006 | — | ADR-0047, ADR-0036, ADR-0002, NFR-008, NFR-007, NFR-002 | `grugops/arch-design-ABC-203` @ `738a3c9f` (records only)<br>`.grugops/context/arch-design-ABC-203/notes/` (…26a21f7c, …e6de1e00) | records only; clause-b baseline at 06fabb18; scratchpad fs/TZ/chdir-in-worker probes (`probe/`) | — | — | In Design → recommend Ready for Dev; merge is the Orchestrator's |
