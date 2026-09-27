---
id: 20260926T211100Z-qe-e2e-observation-0fc1e1b3
kind: observation
by: qe-e2e
at: 2026-09-26T21:11:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ABC-122
  - qe-ABC-123
  - ticket-to-pr-ABC-123
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - .grugops/context/qe-ABC-123/notes/20260926T211000Z-qe-e2e-decision-d651a68b.md
supersedes:
---

# ABC-123 QE readings: A1–A8 all independently reproduced MET; all four planted mutants correctly go RED against the committed proof

Hand-authored and unsealed (same degraded posture as the decision note above). macOS Darwin
25.5.0, Node v24.12.0. Every run below was performed fresh in this session, not copied from the
Engineer's notes.

## A1 — red then green, reproduced

- **RED**, against `e57da89`'s `run-bounded.js` (byte-identical copy via `git show
  e57da89:tools/grugops/run-bounded.js | tee`, no `MAX_TIMEOUT_MS` clause present, confirmed by
  `grep`): `node run-bounded.proof.js` exited **1**, with exactly the three `ABC-123 A1` rows
  FAILED (`N=2147483648`, `N=99999999999`, `N=9007199254740993`), each reading exit `124`, a
  `TimeoutOverflowWarning ... Timeout duration was set to 1.` on stderr, and an empty stdout (the
  healthy target killed). This matches the ABC-122 gate's own measurement and the Engineer's
  claim.
- **GREEN**, against the worktree's HEAD `run-bounded.js`: `node
  tools/grugops/run-bounded.proof.js` exited **0**, "all rows held", all 26 rows PASS, including
  the same three A1 values now reading exit `2`, the exact usage-line stderr, and empty stdout.

## A2 — the boundary, reproduced

`N=2147483647` gave exit `0`, the target's marker on stdout, and empty stderr on both the
pre-fix and the fixed wrapper (confirmed inside the same two proof runs above). The accepted range
did not narrow.

## A3 — the existing malformed/lenient cases, reproduced

All 13 rows (`""`, `0`, `-5`, `abc`, `1.5`, `NaN`, `Infinity`, no arguments — rejected; `1e3`,
`0x3e8`, `" 1000 "`, `1000.0`, `0b1111101000` — accepted) PASSED identically on both the pre-fix
and the fixed proof run. Unchanged, as the ticket requires.

## Four planted mutants — all four correctly turn the proof RED

| mutant | change from the fixed wrapper | proof result |
|---|---|---|
| off-by-one | `>` → `>=` at `MAX_TIMEOUT_MS` | exit `1`; the `ABC-123 A2 N="2147483647"` row FAILS (now wrongly rejected: exit `2` instead of `0`) |
| dropped | the whole `\|\| timeoutMs > MAX_TIMEOUT_MS` clause removed | exit `1`; the same three `ABC-123 A1` rows FAIL, exit `124` with `TimeoutOverflowWarning`, identical shape to the D1 pre-fix reproduction above |
| ceiling of 2^32 | `MAX_TIMEOUT_MS = 2 ** 31 - 1` → `2 ** 32 - 1` | exit `1`; the `N="2147483648"` row FAILS, exit `124` with `TimeoutOverflowWarning` (the wrong ceiling still lets that value reach `setTimeout`'s real 32-bit clamp) |
| check after spawn | the validation `if` moved to after `spawn(...)` | exit `1`; 11 rows FAIL — every "rejected" row now shows the target's own marker already on stdout (the target had already started and written, because it inherits stdio directly, before the wrapper's own `process.exit(2)` ran), and the no-argument row additionally throws `ERR_INVALID_ARG_TYPE` inside `spawn` itself |

All four mutants: `node <mutant>/run-bounded.proof.js` exit code `1` (confirmed separately from
the row-printed text, not inferred from `grep`'s own exit code). The committed proof discriminates
every one of these four regression shapes; it is not a proof that would pass on a subtly broken
R2 guard.

## A4 — the stale status paragraph is gone

`grep -c "NOT YET WIRED IN" tools/grugops/run-bounded.js` → `0`.

## A5 — the process-model sentence is corrected

`grep -ni "session" tools/grugops/run-bounded.js` → 4 lines: 38, 41, 44, 49, all inside or
adjacent to the `detached` paragraph. Line 38: "the leader of a NEW SESSION, not merely a new
process group". Line 44: "THIS SESSION IS WHY `ABC-122`'s R1 EXISTS ...". Read by eye: the
paragraph states `setsid()`, names R1 by name, and states the operating rule (Ctrl-C or SIGTERM,
never SIGKILL). Matches the Engineer's claim exactly, including the line numbers.

## A6 — comment-only for R3

`git diff e57da89 HEAD -- tools/grugops/run-bounded.js`, filtered to changed (`+`/`-`) lines and
re-read by eye: every changed line starts with `//` **except** two lines, both clearly R2's own
behavior change: `const MAX_TIMEOUT_MS = 2 ** 31 - 1;` and the widened `if (... || timeoutMs >
MAX_TIMEOUT_MS)`. No R3 line touches behavior.

## A7 — production behavior otherwise unchanged

- `npm test` (through the wrapper, unchanged default `N=60000`): **48 files / 1467 tests passed,
  0 skipped**, 5.69 s. Matches the current wave baseline the Engineer cited (not the ticket's own
  stale 47/1446).
- `npm run lint` (`biome check .`): exit `0`, "Checked 85 files".
- `npm run typecheck` (`tsc --noEmit`): exit `0`.
- `npm run build` (`tsc --noEmit`, same command under the build slot): exit `0`.
- **Confirmed gap, read from `biome.json`'s own `files.includes`:** the includes list is
  `src/**/*.ts`, `spike/**/*.ts`, `*.json`, `vitest.config.ts` and a handful of negated
  directories — no `tools/**` entry anywhere. Both changed files
  (`tools/grugops/run-bounded.js`, `tools/grugops/run-bounded.proof.js`) sit outside every
  included glob, so Biome's 85-file, exit-`0` run structurally cannot have read either one. This
  is a pre-existing, repo-wide condition (the same gap the Engineer's own notes named), not
  something this ticket introduced or could fix inside its own fence.

## A8 — the fence

`git diff --numstat e57da89...HEAD` touches exactly: `tools/grugops/run-bounded.js`,
`tools/grugops/run-bounded.proof.js`, `plans/tickets/ABC-123-run-bounded-timeout-ceiling-and-stale-header.md`,
`plans/traceability.md`, and the ticket's own `.grugops/context/ticket-to-pr-ABC-123/notes/` files.
No `src/` line, no `package.json` line, no `AGENTS.md` line, no `plans/nfr-catalog.md` or
`plans/board.md` line, no ADR line, and `run-bounded.hang-fixture.js` is untouched.
