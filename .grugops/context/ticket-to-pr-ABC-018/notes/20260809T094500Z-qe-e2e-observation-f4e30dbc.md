---
id: 20260809T094500Z-qe-e2e-observation-f4e30dbc
kind: observation
by: qe-e2e
at: 2026-08-09T09:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
  - AGENTS.md
  - .grugops/factory.config.json
  - 20260809T090500Z-software-engineer-artifact-ref-f0614850
  - 20260809T090700Z-software-engineer-observation-6b72e200
supersedes: 
---

# Every gate RE-RUN on the tip by this role, with its exit code — and the tree-restoration proof

Neutral facts only. **Not one figure below is inherited from the Engineer's note.** Every command was
run here, on branch `grugops/ticket-to-pr-ABC-018` at `d88a1f0`, with the real commands from
`AGENTS.md` § Commands. A gate this role did not run is not reported as a gate.

## The gates, in Workflow 05 step 3 order, BEFORE the tests this role added

| Step | Command (`AGENTS.md`) | Exit | Result |
|---|---|---|---|
| lint | `npm run lint` | **0** | 31 files, **0 errors**, 2 infos |
| typecheck | `npm run typecheck` | **0** | — |
| unit | `npm test` | **0** | **297 passed / 297 on 14 files** |
| build | `npm run build` | **0** | `tsc --noEmit` |
| test-integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | **0 skips** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **2** | `cannot read the registry file` |
| e2e | — | **`UNKNOWN - verify`** | the `AGENTS.md` slot is unknown |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`** | the script does not exist here |

**The Engineer's lint result is confirmed but its history is not reproducible, and that is stated
rather than smoothed.** `npm run lint` exits **0** here on the first run, because the Engineer's one
safe autofix pass is already committed in `d88a1f0`. The two remaining **infos** are the pre-existing
`biome.json` schema-version mismatch (`2.3.0` against CLI `2.5.5`) and the `recommended`-deprecation
notice — both present before this ticket, unrelated to it, and deliberately not touched.

**The test-integrity checker's exit 2 is recorded as an ERROR and NOT as a pass.**
`.grugops/test-skips.md` does not exist (`ls` confirms). Exit 2 is "the checker could not run"; it is
not the exit-1 human-only short-circuit and it is not green. **No registry file was created** — an
agent may not self-author a justification to clear its own gate — and the suite's skip count is **0**,
so nothing is owed a justification. This is the fifth ticket on this board to record the same.

## The baseline was RE-DERIVED, not subtracted

`npx vitest run $(ls src/*.test.ts | grep -v frame)` → **277 passed / 277 on 13 files**, exit 0. That
is the Engineer's published "before" figure reproduced by running it, not by subtracting 20 from 297.

## The gates, AFTER the seven tests this role added

| Step | Command | Exit | Result |
|---|---|---|---|
| lint | `npm run lint` | **1**, then **0** after ONE safe autofix pass | see below |
| typecheck | `npm run typecheck` | **0** | — |
| unit | `npm test` | **0** | **304 passed / 304 on 14 files** |
| build | `npm run build` | **0** | — |
| test-integrity | skip-count command | **0** | **0 skips** |

**The lint failure and its fix are reported as they happened.** `biome check .` exited **1** on one
formatting error in **this role's own new test code** — two statements over the 100-column line width,
**no rule violation**. `quality.lint.autofix` is `true`, so the safe autofix ran on that one file
(`npx biome check --write src/frame.test.ts`, the `AGENTS.md` single-file command) and the recheck
exited **0**. That is **self-fix attempt 1 of 2**; the second was not needed. **`src/frame.ts` was not
in that command and was not touched by it.**

## Coverage, against the `0.8` threshold

`npx vitest run --coverage --coverage.include='src/frame.ts' src/frame.test.ts` →
**`src/frame.ts` 100% statements / 100% branches / 100% functions / 100% lines**. The coverage run
rewrites the tracked `coverage/` directory — the known hazard on this board — and it was restored
both times with `git clean -f coverage/` followed by `git checkout -- coverage/`, then verified with
`git status --short`. The v8 reporter also writes **untracked** per-file HTML into a different path
than the tracked layout; those were removed by the `git clean`, which `git checkout` alone would not
have done.

## Flakiness, checked rather than assumed

**Five full-suite runs with `--sequence.shuffle`: 304/304 every time.** No test in the added block
touches an ambient global, no test carries a wall-clock assertion, and the suite is order-independent.

## THE TREE-RESTORATION PROOF

**`src/frame.ts` is byte-identical to the Engineer's first and only commit of it.**

- `md5 src/frame.ts` = **`bb827f52fe537817e40020a29dfa0e6d`** before the campaign;
- **`bb827f52fe537817e40020a29dfa0e6d`** after **75 mutate-and-restore cycles** over **56 distinct
  mutants**;
- `git show d88a1f0:src/frame.ts | md5` = **`bb827f52fe537817e40020a29dfa0e6d`** — the same digest,
  so the module also matches the Engineer's **first** commit, which is what this board's merge record
  checks;
- `git diff --stat d88a1f0 -- src/frame.ts` is **EMPTY**.

It is also the digest the Engineer published, which is the independent confirmation that this gate
changed **no production code**. The harness asserted the digest after **every single** cycle and
would have aborted the campaign on the first mismatch.

## `NFR-002` — NOT re-derived here, and one coarse sanity check so this role does not merely RELAY

The plan of record routes `NFR-002` to the Security/NFR gate, which re-derives on its own instruments
rather than ratifying. This role did **not** produce a competing measurement and does not discharge
`plans/nfr-catalog.md`'s row.

One coarse **order-of-magnitude** check was run out of tree, in its own process, so that a
four-orders-of-magnitude claim is not relayed unlooked-at: 20,000 frames (compute + serialize into an
in-memory sink) after a 5,000-frame warm-up → **0.0071 ms per frame** on Apple M3 / Node v24.12.0 /
darwin arm64. The Engineer's in-memory pair is 6.03 + 0.64 µs = **0.0067 ms**. **They agree.** This is
a sanity check with a single sample and no rotation — it is **not** a measurement, it is **not** a
substitute for the gate's own, and it may not be quoted as one.
