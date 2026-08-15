---
id: 20260815T190500Z-qe-e2e-observation-the-gate-re-run-at-my-own-hand-ab0b86ac
kind: observation
by: qe-e2e
at: 2026-08-15T19:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - grugops/abc042-integrated
  - AGENTS.md
  - .grugops/factory.config.json
supersedes: 
---

# The gate, re-run at my own hand on the INTEGRATED tree — and what I did not take on trust

The Orchestrator ran these commands as an **integration check** and explicitly claimed no verdict. I
re-ran every one of them myself on my own branch off `grugops/abc042-integrated` (`238a7f6`). **My
numbers agree with theirs exactly.** That agreement is worth stating precisely because agreement is
the case in which it is easiest not to look.

## The gate, in Workflow 05's order, commands taken from `AGENTS.md` at runtime

| step | command | result |
|---|---|---|
| install | `npm install` | **exit 0**, 1.5 s. *(This worktree had **no** `node_modules` — a real install, not a symlink. See `Q10` below.)* |
| lint | `npm run lint` | **exit 0** — `Checked 54 files`, **2 infos**, both the pre-existing `biome.json` migration notice. `quality.lint.strict` is `false`, so infos do not fail. Not mine and not this ticket's |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** *(`tsc --noEmit` wearing the build slot's name — `AGENTS.md` says so)* |
| unit | `npm test` | **856 passed (856)** on **30 files**, exit 0 |
| e2e | `UNKNOWN - verify` | **non-blocking.** No UI surface exists; `quality.ui_e2e` is `ui-or-critical-path`. **Said plainly: this ticket's critical path IS exercised end to end** — `src/cli.test.ts` spawns **ten real child processes** running the delivered command with stdout and stderr piped. That is the E2E lane in substance; the `AGENTS.md` slot stays honestly `UNKNOWN - verify` because no *runner* is configured |
| skip count | `npx vitest run --reporter=json … jq` | **0** — an integer, not an assumed zero |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` **exit 0** — the registry justifies every skip because there are none. **I read `.grugops/test-skips.md` and wrote no row into it** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`, non-blocking** — `scripts/` does not exist in this repository. Workflow 05 step 3 provides for exactly this and calls it an honest UNKNOWN, never a faked pass |
| auto-UAT live E2E | `npm run test:e2e` | **`UNKNOWN - verify`, non-blocking** — no such script in `package.json`; measured, not assumed |

**Ran twice**: once on arrival, once after all 32 mutant runs, to prove the tree I graded is the tree
I was handed. Identical both times. `git status --porcelain` at the end shows exactly one untracked
path — my own queue claim directory.

## `self_fix_attempts` — not consumed, and why that is not a loophole

`quality.self_fix_attempts` is `2` and `gate_enforcement` is `blocking`. **Nothing in the delivered
build failed a gate step, so there was nothing to self-fix.** Workflow 05 step 4 spends the budget on
agent-fixable *failures*; a green step does not consume one. I record this because a gate that reports
"budget unspent" without saying why invites the reading that it was skipped.

## What the merge itself is, measured rather than accepted

I checked `238a7f6` for an **evil merge** — content introduced by the merge commit that is in neither
parent — because "merged clean with zero conflicts" is a statement about *conflict markers*, not about
content:

```
diff(merge, parent ab4c5c9)  ==  diff(59ea767, c7b200f)   IDENTICAL
diff(merge, parent c7b200f)  ==  diff(59ea767, ab4c5c9)   IDENTICAL
```

**The merge tree is exactly the union of the two sides. No evil merge.** The file sets are disjoint as
described: the Architect/Design hop touched `memory-bank/50-decisions/ADR-0011-…md` and its own notes;
the `B1` hop touched `src/cli.test.ts` and its own notes.

## The zero-production-bytes claim — verified, not accepted

The `B1` hop claims both repairs cost **zero production bytes**. I checked it the way it can actually
be checked, by **git blob SHA**, over every merged production module under `src/`:

```
18 of 18 merged production modules: blob SHA at `main` == blob SHA at my HEAD
src/moves.ts src/legal.ts src/apply.ts src/position.ts  — IDENTICAL, named individually
```

and the branch's own non-`.grugops` diff against the merge-base (`7df25b9`) touches `src/` in exactly
three files: `src/cli.ts`, `src/cli-options.ts` (both NEW) and `src/cli.test.ts`. **`src/cli.ts` and
`src/cli-options.ts` are byte-identical to the original build commit `e140355`.** The claim holds.

## `A11`, reproduced on the integrated tree

9 runs, round 0 discarded, n = 8: `node src/cli.ts` median **61.4 ms** (57.8–63.2), `npm run chess`
median **147.2 ms** (144.7–161.1). Bar is **≤ 1 s** — two orders under it. **Machine: Apple M3, 8
cores, 16 GB, Darwin 25.5.0 arm64, Node v24.12.0.** This reproduces my own earlier reading (61.3 /
147.5) to within 0.3 ms and the engineer's (68.8 / 150.3) on the same machine. **`plans/nfr-catalog.md`
was not opened for writing.**
