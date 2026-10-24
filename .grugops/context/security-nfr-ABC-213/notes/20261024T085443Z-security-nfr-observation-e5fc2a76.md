---
id: 20261024T085443Z-security-nfr-observation-e5fc2a76
kind: observation
by: security-nfr
at: 2026-10-24T08:54:43Z
verified_by: 
confidence: high: every reading as it ran, deterministic; no timing reading taken (battery); heap figures are counts from vitest --logHeapUsage, n = 3
refs:
  - security-nfr-ABC-213
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - AR-213-PARTIAL
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - QE-213-e
  - ADR-0036
  - ADR-0047
  - ADR-0015
  - NFR-008
  - NFR-010
  - R-174-1
  - grugops/ABC-213
  - 41d31b18
  - 7adc85ac
  - dfaa4cdc
  - src/pgn-file.ts
  - src/pgn.test.ts
  - qe-ABC-213/20261024T084131Z-qe-e2e-decision-aceaddaf
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-1bb1938c
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-cd83ece0
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-decision-6f71057f
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-observation-47f04206
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-observation-e3ee9c45
  - security-nfr-ABC-203/20261023T211544Z-security-nfr-decision-eaaa1133
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
supersedes: 
seal: sha256:a44da73f80da56bd5b1c819c040de78ddbf15ed5d5babe3e4aeb1bef281c5e0e
---

# ABC-213 Security/NFR readings at 41d31b18: holder diff is the guard only; ADR-0036 limb 1 fires by Ruling 2 alone (0 capability lines, 0 edges); X3 base-holder reds A1 x2, head 24/24; writer child byte-identical; double costs +9 rows, +2-3 MB heap, 0 spawns, 0 files

Security/NFR, task `security-nfr-ABC-213`, branch `grugops/ABC-213` @ `41d31b18` in `../wt-ABC-213`, base `dfaa4cdc` (the ticket's base; merge-base with `main` is `adf6af38`). Node 26.11.1, vitest 4.1.12. Every reading as it ran. **No timing reading was taken** (host on battery); no vitest duration below is a reading. No `src/` edit. Scratch copies only under the session scratchpad `sec213/` (`git archive`, `node_modules` symlinked from the worktree).

## 1. The holder diff (`git diff dfaa4cdc 41d31b18 -- src/pgn-file.ts`)
- One hunk, `@@ -67,7 +67,11 @@`: the bare `unlinkSync(path);` becomes `try { unlinkSync(path); } catch (error) { errnoOf(error); }`, then `return { ok: false, code: errnoOf(failure) }` as before.
- Semantics read from the code (lines 58-75):
  - errno-coded unlink failure: dropped; the result is the FIRST failure's code (D5). Unlink is attempted exactly once.
  - codeless unlink throw: `errnoOf` rethrows it (A3; D5 defect path kept).
  - codeless first failure + errno-coded unlink failure: the unlink error is dropped, then `errnoOf(failure)` rethrows the first failure (D5 kept; pinned by probe Q8).
  - the path removed is still the `path` this call opened with `"wx"` (pinned at the `-2` candidate by probe Q7).
- Contract unchanged: 1 `node:fs` import with the same five bindings, 1 export, no `process.` in code (header lines 6-7 are prose), nothing to stdout/stderr, no message text returned. `src/cli.ts`, `src/pgn.ts`: 0-line diff (QE A6).
- Header lines 15-16 still say the path "is removed" unconditionally (QE-213-d, open).

## 2. `ADR-0036` clause (b), canonical instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs dfaa4cdc 41d31b18 {1,2,3}` (output `sec213/clause-b-dfaa4cdc-41d31b18.txt`)
- Limb 1: (b1) capability lines 0; **Ruling 2 FIRES** on `src/pgn-file.ts` (5 + lines, 1 - line; holds limb 1 at base and head); (b2) new edges 0. Holders 3 at base and head (`book-file.ts`, `pgn-file.ts`, `uci.ts`).
- Limb 2: does not fire. Limb 3: does not fire.
- So the route to this hop is Ruling 2 alone, as the page predicted. No new capability, no new edge, no new holder.

## 3. `AR-203-UNLINK` evidence, independent re-read (scratch copies, one-file `vitest run src/pgn.test.ts`, flag 400)
| copy | holder | rows | red |
|---|---|---|---|
| head | `41d31b18` | 24/24 | none |
| X3 | `dfaa4cdc` (unguarded unlink), tests at `41d31b18` | 22/24 | `A1` write+unlink, `A1` close+unlink |
| base | `dfaa4cdc` whole | 15/15 | none (rows did not exist) |
No `games/` landed in any copy root. This matches QE (`qe-ABC-213/…1bb1938c`: X3 reds `A1` x2) and the A5 hand reading (`…cd83ece0`: base exit 70, head exit 0, stderr exactly `PGN not saved: EFBIG\n`).

## 4. The test double (`src/pgn.test.ts`, rig (b′))
- One hoisted `vi.mock("node:fs", importOriginal)` spreads the real module and replaces only `mkdirSync`, `openSync`, `writeFileSync`, `closeSync`, `unlinkSync` (named and `default`). All other bindings are real.
- Write containment: unarmed, a relative path throws (`unarmed relative path`) before any fs call; armed, a relative path is re-rooted under the row's `mkdtempSync(join(tmpdir(), "abc213-"))`; absolute paths pass through, and the holder only makes relative `games/...` paths (D3). `afterEach` removes `fault.root` only when set, and it is only ever set to the `mkdtemp` return value (D7's exact-path rule).
- Canary: `arm()` refuses unless all five bindings on this file's own namespace carry the double's marker; the canary row asserts the marker BEFORE it calls `writePgnFile` unarmed, so a mocking regression goes red before anything can write into the repository.
- Scope: `vitest.config.ts` keeps `pool: "threads"`, `isolate` default `true` (each test file gets a fresh worker and module registry), `maxWorkers: 2`, `viteModuleRunner: false`. The double cannot reach another test file; the spawned writer child is a separate process and never sees it.
- No secret, env read, network, or new process in the double. Fault errors carry only a code or a fixed text.

## 5. In-process cost (`ADR-0036` Ruling 2 look; counts, not wall time)
- Rows in `src/pgn.test.ts`: 15 at base -> 24 at head (+9: canary, `A1` x2, `A2` x2, `A3`, probes Q6/Q7/Q8); describes +1; doubled bindings 5; `spawnSync(` sites 1 -> 1; new test files 0; lane 2044 -> 2047 rows, 62 files (SE `…47f04206`).
- Writer child: the whole `describe("ABC-203 — the writer, from one spawned child …")` block, including its `SCRIPT`, is **byte-identical** base vs head (118 lines, sha256 `011dbbc08d8c0302…`). Its CPU growth is 0 by construction; no reading taken.
- Heap (`--logHeapUsage --reporter=verbose`, one-file shape, flag 400; max per-row "heap used", n = 3 each, alternating): base 22 / 23 / 22 MB; head 25 / 26 / 24 MB. About +2-3 MB. `NFR-010` bounds Σ `heap_size_limit` (the flag), which this change does not touch; the suite shape's 224 MiB per isolate leaves wide room (SE's suite run at 7adc85ac: 2047/2047 under flag 128).
- The Architect's +0.07 s in-process CPU (load1 ~6) stays indicative, not a reading.

## 6. ASVS L1 (`security.asvs_level` L1)
No L1 row changes or fails. Path derivation (D2) and exclusive create (D4) are untouched; no new input reaches a capability. The nearest row, `V16.5.3` "fails securely" (L2, above the dial), is now met on this branch: a double fault ends as `PGN not saved: <CODE>`, exit 0.

## Process note
One command in this hop redirected output to `/tmp/null` by mistake (outside the brief's fence). The file was removed at once; nothing else was written outside `../wt-ABC-213` and `sec213/`.
