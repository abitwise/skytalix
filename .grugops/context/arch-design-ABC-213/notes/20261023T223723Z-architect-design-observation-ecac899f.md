---
id: 20261023T223723Z-architect-design-observation-ecac899f
kind: observation
by: architect-design
at: 2026-10-23T22:37:23Z
verified_by: 
confidence: high on the mechanics (deterministic scratch probes); cost figures indicative only, UNKNOWN - verify
refs:
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - NFR-008
  - N8-SPAWN
  - N8-LANE
  - ADR-0015
  - ADR-0047
  - ADR-0036
  - ADR-0009
  - af4a934c
  - plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
  - bapm-cut-levels-6-7/20261023T213402Z-ba-pm-decision-44bee405
  - bapm-cut-levels-6-7/20261023T213354Z-ba-pm-observation-78d4532b
  - security-nfr-ABC-203/20261023T211544Z-security-nfr-decision-eaaa1133
  - qe-ABC-203/20261023T210415Z-qe-e2e-decision-f28588e1
  - bapm-cut-ABC-200-followups/20261022T201509Z-ba-pm-decision-97a4b809
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 
seal: sha256:183ff3535d1effe467064517465af91e645946fab7e53b0e2d43dc47d4252a3e
---

# ABC-213 rig probes: rig (a) works in the writer child; vi.mock("node:fs") reaches the holder in-process under the lane's vitest, standalone and hosted in pgn.test.ts; every A4 plant reds its row

Architect/Design, task `arch-design-ABC-213`, scratch copy of `src/` at `main` `af4a934c` (session scratchpad `design213/`). Node 26.11.1, vitest 4.1.12, `pool: "threads"`, `viteModuleRunner: false`. Holder variants written in scratch only: base (= X3), fix (guarded unlink, first code), X1 (no unlink), X4 (report U), X5 (`catch {}`).

## Reads
- `ADR-0015` rule: "a module substitution inside a spawned child" is a double only if (S), (C), (N) hold. (S) = imported by `src/cli.ts` AND passed in the `runTurnLoop({…})` bag. Measured: `src/cli.ts` has no `node:fs` import; the bag is history, humanColour, render, input, engine, sink. So `node:fs` fails (S): rigs (a) and (c) are refused by the letter.
- In-process substitutions of non-supplier modules already stand in the lane: `src/engine.capacity.test.ts` (`./legal.ts`, `./zobrist.ts`, `./search.ts` factories) and `src/gameend.nfr.test.ts` (`./legal.ts`, `./zobrist.ts`). `src/cli.ts` imports none of those three. No hop has read `ADR-0015` onto them.
- `src/gameend.nfr.test.ts` keeps its mock in its own file "so it re-routes nothing else".

## Probe 1: rig (a)
The writer child's `-e` script registers a `node:module` resolve hook that swaps `node:fs` only when the parent URL ends `?fault`, and imports the holder twice (plain and `?fault`). The fake spreads the real `node:fs` and overrides writeFileSync (fd: write 1 real byte, throw W), closeSync (close, throw C), unlinkSync (throw U or a codeless Error).
- The plain copy and the unarmed `?fault` copy both write the 21-byte file: no leak into the real copy.
- base: A1 (write and close) throws EACCES; A2 0 files; A3 throws.
- fix: A1 returns EFBIG / EIO; A2 0 files; A3 throws.
- X1: A2 leaves a 1-byte and a 21-byte file; A3 returns EFBIG.
- X4: A1 returns EACCES. X5: A3 returns EFBIG.

## Probe 2: rig (b) standalone and (b′) hosted in a copy of src/pgn.test.ts
A hoisted `vi.mock("node:fs", importOriginal)` doubles only mkdirSync, openSync, writeFileSync, closeSync, unlinkSync (and `default`), re-roots relative paths under a per-row mkdtemp when armed, writes 1 real byte before a write fault. Six rows: A1 ×2, A2 ×2, A3, a control.

| variant | red, each host | existing pgn.test.ts rows in (b′) |
|---|---|---|
| base | A1 ×2 | 15/15 |
| fix | none | 15/15 |
| X1 | A2 ×2, A3 | 15/15 |
| X4 | A1 ×2 | 15/15 |
| X5 | A3 | 15/15 |

No `games/` landed in the copy root or `src/`.

## Indicative cost (not a reading: load1 about 6, n = 5, one-file vitest run, user+sys)
pgn.test.ts unedited median 1.35 s; with (b′) median 1.42 s (about +0.07 s). The standalone (b) file alone: median 1.07 s.
