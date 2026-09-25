---
id: 20260925T144535Z-software-engineer-observation-abc122-rehop-a4-landed-a11-a12-fresh-5d2b7e91
kind: observation
by: software-engineer
at: 2026-09-25T14:45:35Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-042
  - wave-2026-09-25
  - ticket-to-pr-ABC-122-rehop
  - amend-abc122-a4-pin
  - package.json
  - src/cli.test.ts
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-rehop-npm-test-green.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-rehop-npm-test-root-guard-reverted.txt
supersedes:
---

# ABC-122 re-hop: `A4` landed inside the widened `A11`. `A4`, `A11` and `A12` are met, read fresh

Hand-authored and unsealed. This is an `observation`, not a stamp: `context.human_admission` is
`off` and there is no `context-io.ts` on this install. The readings come from commands this hop
ran at the committed tree. Run on macOS (Darwin 25.5.0) with Node v24.12.0. Each gate was spawned
by a scratch Node runner with its own 180 s SIGKILL outer bound, and that bound never fired.

## The change: commit `ca9f42d`, from `594e349` (the claim), on top of `92533e8`

Two lines, as BA/PM ruled (decision `c960e385`):
- `package.json:12`: `"test": "vitest run"` became `"test": "node tools/grugops/run-bounded.js 60000 vitest run"`.
- `src/cli.test.ts:1661`: `test: "vitest run",` became `test: "node tools/grugops/run-bounded.js 60000 vitest run",`.
  The literal is identical, byte for byte. No other `SCRIPTS_AT_HEAD` key changed.

`git show --numstat ca9f42d`: `1 1 package.json`, `1 1 src/cli.test.ts`. Nothing beyond the two
lines was needed, so this hop hit no stop condition.

## Readings

| # | verdict | reading |
|---|---|---|
| `A4` | **MET** | The wrapped string is in `package.json`, and `npm test` echoes `> node tools/grugops/run-bounded.js 60000 vitest run`. N = 60000 is the value the build hop justified (8.1× the 7.45 s median lane wall, inside the 5×–120 000 band). It was not re-measured here. The pin mirrors it in the same commit. **Armed:** with only the pin reverted to `"vitest run"`, `npx vitest run src/cli.test.ts` exits 1, and exactly 1 of 65 tests fails, the `ABC-042` A10 row (`scripts.test: expected 'node tools/grugops/run-bounded.js 600…' to be 'vitest run'`). With the pin restored it exits 0, 65/65. |
| `A11` | **MET** | `git diff --numstat grugops/wave-2026-09-25...HEAD` (merge-base `0bc31e1`), leaving out `.grugops/`, `plans/tickets/` and `plans/traceability.md`: `package.json` 1/1, `src/cli.test.ts` 1/1, `src/engine.capacity.test.ts` +114, `src/search.capacity.test.ts` +94, `tools/grugops/run-bounded.hang-fixture.js` +18, `run-bounded.js` +96, `run-bounded.proof.js` +141. `src/search.ts` and `src/engine.ts` have 0 lines. `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md` and the ADRs have **no ticket-owned change**. **Caveat on the base:** against the page's original base `66a45d1`, those files do differ (`AGENTS.md` +15, `plans/board.md` +10/−2, `ADR-0026` +187). Every one of those changes arrived through merge `11744f9` from `grugops/wave-2026-09-25`, in commits `cf5d71a` (Scribe), `721e38c` (Architect), `00f02a4`, `03fa645`, `aa0e381` and `0bc31e1` (Orchestrator). None are `ABC-122`'s. The wave merge-base is the honest base for the fence. |
| `A12` | **MET** | `npm run lint` exit 0 (0.35 s). `npm run typecheck` exit 0 (1.06 s). `npm run build` exit 0 (1.01 s). **`npm test` (through the wrapper): exit 0, Test Files 47 passed (47), Tests 1446 passed (1446), no skips**, in 5.6 s and then 6.3 s on the restored tree. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.` There are still exactly 2 new test files under `src/`, with 1 test each. The build hop's `N8-LANE` reading (+475 ms gross, ≈ +155 ms net, bar 650) stands and was not re-measured. The two changed lines add no test and no file, and the wrapper spawns outside the lane's own count. |

## The hang through `npm test` itself (re-run)

The root depth guard was reverted to `if (false)` (`src/search.ts:358`), and then `npm test` was run.
Result: **exit 124 at 60.17 s**, with stderr `run-bounded: timed out after 60000 ms, killed the
process tree of: vitest run`. The outer 180 s bound did not fire. Afterwards `pgrep -fl vitest`
showed no process from this worktree. The only vitest processes alive belonged to an unrelated
session under `~/Projects/public/grugops`. The guard was then restored, and `git diff` showed only
the two-line patch before the commit. Raw output is in `raw-out-rehop-npm-test-root-guard-reverted.txt`.

## Still owed (unchanged, not this hop's)

- The `AGENTS.md` `### Test` line goes to the Scribe, now that `A4` has landed. It should cover the wrapper, exit 124, the 60 s bound, and the
  proof command. It should also say the `*_DEEP` lanes must not run via `npm test`.
- A QE hop.
- `lane-inventory.js` is red on the pre-existing file `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts`. That is not `ABC-122`'s.
- The board is untouched (fenced). Recommendation: `ABC-122` can move `In Development → In Review`,
  because all 12 criteria are now met. The Orchestrator makes that move.
