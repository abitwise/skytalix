---
id: 20260821T004500Z-software-engineer-observation-both-unknowns-answered-and-no-criterion-was-bent-to-fit-4f7a2e18
kind: observation
by: software-engineer
at: 2026-08-21T00:45:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A9
  - A4
supersedes:
---

# THE TWO UNKNOWNS THE PAGE HANDED THIS HOP — both answered by measurement, neither by weakening a row

## UNKNOWN 1 — does `spawnSync`'s timeout kill report cleanly through `childOf` inside vitest?

**IT DOES, and this was the first thing run.** A deliberately hanging child (`sh -c 'sleep 20'` at a
2 s bound), inside a vitest worker:

```
{"ms":2003,"error":"Error: spawnSync /bin/sh ETIMEDOUT","status":null,"signal":"SIGTERM"}
```

`childOf`'s existing guard — *"a guard must never pass by being unable to look"* — turns that into a
named throw with no change to the helper's contract. **So `A9` needed no new mechanism**: "the child
HAS EXITED within `T_bound`" is expressed as *`childOf` returned at all*, which is stronger than a
stopwatch reading and immune to the pipeline-timing dead end by construction.

**One harness fact had to be respected and it is not a weakening.** Vitest's default `testTimeout` is
**5000 ms**. `T_bound` is **4000 ms**, so a hung child is killed by this file's own bound and reports
as this file's own named throw, rather than being reported as a runner timeout that names nothing.
`T_open` is **10 s** and `T_bound < T_open` — the criterion — holds with 6 s of margin. The settle is
**0.6 s**, above the `>= 0.5 s` the page requires after measuring 0 s flaky; 5 consecutive identical
runs were taken on each of three builds, as required.

**`ChildOptions` gained `timeout` and `Child` gained `signal`.** Both are helper extensions of the
kind `ABC-043` made (`input`, `hook`), not a second `spawnSync` call site: the pin at
`src/cli.test.ts` still measures **one** call site and `spawnSync` as the only imported name. `signal`
is needed because `A2` and `A9` say *"not killed by a signal"* and a status-only assertion reads a
signal death (`status: null`) as `null !== 1` and passes.

## UNKNOWN 2 — `A4`'s throwing-`InputSeam` half, and lint/typecheck of the delivered literal

**Both run, both green, on the delivered build.**

- `A4` re-reads `CHILDREN.inputSeamThrows` and `CHILDREN.badColour` — **zero new children**, as the
  page's `N8-SPAWN` derivation predicted. Measured on the delivered build: a throwing `InputSeam`
  exits **70** with the `internal error:` line and a **non-empty stderr**; a refused command line
  exits **1** with the usage line carrying the `npm run chess -- ` separator; end-of-input exits
  **0** with the notice. All three of `ABC-043` `A3`'s existing rows stay green with zero edits.
- `npm run lint` (`biome check .`): **Checked 73 files, no fixes applied**, exit 0.
- `npm run typecheck` (`tsc --noEmit`) and `npm run build` (the same command wearing the build slot's
  name): **exit 0, no output**. The `(error as NodeJS.ErrnoException)` cast is `ADR-0016` clause 4's
  own spelling and type-checks as written.

**No criterion was reshaped to fit the harness.** The one place the harness constrained a number is
`T_bound = 4 s` against vitest's 5 s default, and that makes the bound *tighter* than the page's
example (`T_bound = 5 s`), not looser.
