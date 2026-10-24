---
id: 20261023T224721Z-software-engineer-decision-464bea64
kind: decision
by: software-engineer
at: 2026-10-23T22:47:21Z
verified_by: 
confidence: high on the fix and the rig (red-first, 4 plants and a canary plant read); in-process cost not measured (no timing per brief), UNKNOWN - verify
refs:
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - ADR-0047
  - ADR-0015
  - ADR-0036
  - NFR-008
  - N8-SPAWN
  - N8-LANE
  - grugops/ABC-213
  - 5a10b4b6
  - dfaa4cdc
  - src/pgn-file.ts
  - src/pgn.test.ts
  - arch-design-ABC-213/20261023T223723Z-architect-design-decision-d7ce173f
  - arch-design-ABC-213/20261023T223723Z-architect-design-observation-ecac899f
supersedes: 
seal: sha256:d8038c49a750f9e5a6ae9ba56177a1fffa5844c09b57dce9110c6da5e647affc
---

# ABC-213 built to the design ruling, rig (b′): the cleanup unlink is guarded (first code reported, codeless rethrown), and A1–A3 are pinned in src/pgn.test.ts on a call-through node:fs double. One deviation: the canary marker rides on the five doubled functions

Software Engineer, task `ticket-to-pr-ABC-213`, branch `grugops/ABC-213` @ `5a10b4b6` from `main` `dfaa4cdc`. Worktree `../wt-ABC-213`.

## The fix (`src/pgn-file.ts`, cleanup branch only, +5/−1)
`unlinkSync(path)` is wrapped: `try { unlinkSync(path) } catch (error) { errnoOf(error); }`, then `return { ok: false, code: errnoOf(failure) }` as before. An errno-coded unlink failure is dropped and the first failure's code is reported. A codeless unlink throw is rethrown by `errnoOf` (D5). The header, imports, export and the five bindings are unchanged. This is the Architect's probed 4-line guard.

## The rig (`src/pgn.test.ts`, +126/−2)
- One hoisted `vi.mock("node:fs", importOriginal)` with `vi.hoisted` fault state. It spreads the real module and doubles only `mkdirSync`, `openSync`, `writeFileSync`, `closeSync`, `unlinkSync`, plus the same five on `default`.
- Unarmed: call-through, and a relative path throws `ABC-213 double: unarmed relative path …`.
- Armed (`arm()` per row, `afterEach` removes the exact `mkdtemp` path): relative paths are re-rooted under the row's `mkdtemp`. A write fault writes 1 real byte via the real `writeSync`, then throws `{code: W}`. A close fault closes for real, then throws `{code: C}`. An unlink fault throws `{code: U}`, or `Error` with no code (`"no-code"`), and removes nothing.
- The double counts the bytes written before a write fault and the unlink calls. `A2` (write) asserts that 1 byte reached the file, and `A1` asserts that the cleanup was attempted once.
- Rows, in the new `describe("ABC-213 — …")`: canary, `A1` ×2 (write EFBIG + unlink EACCES; close EIO + unlink EACCES), `A2` ×2 (`games/` read from the real root as `[]`), `A3`.
- One header paragraph names the ruling and says why the double is outside `ADR-0015`.

## Deviation from the ruling's letter (mechanics only)
The ruling put "a marker on the double's namespace". Measured under vitest 4.1.12 with `viteModuleRunner: false`: the mocked namespace keeps the real module's export names, so an extra key (`ABC213_DOUBLE`) never appears. The first red-first run showed this: the canary row went red, and `arm()` refused all 5 armed rows before any write. So the marker is a property on each of the five doubled functions, and the canary asserts it on all five bindings of this file's `node:fs` namespace. `arm()` checks it before the first armed call. Its intent is unchanged: a mocking change goes red before any write can land outside the root. The plant XC (the `vi.mock` call removed) shows it.

## Not done (fenced)
No ADR, board, trace, `cli.ts` or `pgn.ts` edit. The `ADR-0047` D4 dated line stays with Architect/Design. No timing was run: the brief says "No timing", and the writer child is byte-identical, so its CPU growth is 0 by construction. `A5` is QE's hand reading.
