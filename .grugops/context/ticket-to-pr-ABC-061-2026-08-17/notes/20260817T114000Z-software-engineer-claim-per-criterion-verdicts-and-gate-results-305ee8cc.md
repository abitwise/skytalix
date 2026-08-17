---
id: 20260817T114000Z-software-engineer-claim-per-criterion-verdicts-and-gate-results-305ee8cc
kind: claim
by: software-engineer
at: 2026-08-17T11:40:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - src/cli.test.ts
supersedes: 
---

# `ABC-061` — `A1`–`A6` answered by measurement, and the five gates on the branch tip

**A `claim`, not a `finding`.** No `finding` is admissible on this install (`AGENTS.md`): no
`scripts/context-io.ts`, no `mcp__grugops__propose_note`, `context.human_admission` `off`, so no
`§14-gate#<id>` verdict can be emitted and `verified_by` is empty on purpose. Every number below was
run by me on branch `grugops/abc061-resolver-value-assertions` at `74900e7`; none is quoted from the
ticket page or from the Orchestrator's note. **The Orchestrator re-runs the gate itself and holds the
merge — this note does not stand in for that run.**

## The six criteria

| # | what it asks | how it was answered | verdict |
|---|---|---|---|
| `A1` | `flags: { ascii: false, unicode }` at `:153` ⇒ suite RED | mutant RUN on a copy outside the repo, twice: green (861/861) without the guard, **RED** (1 failed \| 862 passed of 863) with it | **RED — observed** |
| `A2` | all six accepted argvs compared as a WHOLE object; zero of six `.ok`-only in the new blocks | 5 rows in `ABC-061 A2` + 1 in `ABC-061 A3`; every one a whole-object `toEqual` against `.options`. `.ok` appears only as a narrowing `throw` guard | **6 of 6 by value, 0 of 6 by `.ok`** |
| `A3` | `random`: `flags` exact, `colour` ∈ `{white,black}`, orientation paired, asserted TOGETHER | one call; `toContain` on the colour, then the whole object against the test's own pairing row for the colour that landed. Mismatched-pair probe reds the row (observation note, run 5) | **pair asserted together — MET** |
| `A4` | `flags: { ascii, unicode: false }` at `:153` ⇒ suite RED | mutant RUN: **RED** with the guard (3 failed \| 860 passed of 863), and `ABC-061 A2` is one of the three. It was already red via two spawned-child rows before the guard — now pinned at the resolver too | **RED — observed** |
| `A5` | `ACCEPTED_ARGUMENTS` unchanged, the element-for-element equality untouched, the merged accepting row byte-identical | `src/cli-options.ts` is not in the diff at all. `expect(ACCEPTED_ARGUMENTS).toHaveLength(TABLE.length)` unmoved at `:438`. The `it("A6(i) — every documented spelling resolves in its legal argv position")` block: `shasum` of the block extracted from `HEAD~1` and from the delivered tree both **`510a5256…`** | **byte-identical — MET, by identity not by number** |
| `A6` | one path, zero production lines, `spawned` still 10, suite green, skip 0 | `git diff --name-only 74900e7~1 74900e7` ⇒ **`src/cli.test.ts`**, one line. It is a `.test.ts`, so **zero production lines**. The `N8-LANE` row asserting `spawned` `10` passes untouched. **863 passed (863)** on 30 files, skip **0** | **MET** |

`A5` is reported against the row's IDENTITY. Reported against the page's number `:359` it would also
have read MET, and would have meant nothing — `:359` is `const white = boardRegionOf("unicode",
"white-bottom");` today (`G-B`).

## The gates, on the branch tip at `74900e7`

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | `Checked 54 files in 78ms. No fixes applied.` exit **0** |
| typecheck | `npm run typecheck` | `tsc --noEmit`, no output, exit **0** |
| build | `npm run build` | `tsc --noEmit` (a typecheck in the build slot, per `AGENTS.md`), exit **0** |
| tests | `npm test` | **Test Files 30 passed (30) · Tests 863 passed (863)**, exit 0 |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit **0** |

**863 = 861 baseline + 2**, the two blocks this ticket adds. `src/cli.test.ts` runs 36 tests in
**13 ms** — the same 13 ms the file reported at 34 tests on the baseline run, so `N8-LANE`'s 152.5 ms
of 650 ms is not moved by this change: 0 new files, 0 new spawns, two pure `resolveOptions` tables.

## Nothing was escalated

No conflict between the page and the tree beyond the six the Orchestrator's `Ready for Dev` note
already recorded, and every one of those six was usable as written. One clerical mismatch, resolved
and not escalated: the queue item's `base:` header says `main @ 86594fb` while the activation message
and `main`'s tip say `a1f3643` — two board/context commits later with no `src/` change between them
(`git diff --stat 86594fb a1f3643`). Branched off `a1f3643`.
