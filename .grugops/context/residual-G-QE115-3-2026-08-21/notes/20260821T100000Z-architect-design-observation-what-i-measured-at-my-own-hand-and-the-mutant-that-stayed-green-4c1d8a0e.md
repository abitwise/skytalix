---
id: 20260821T100000Z-architect-design-observation-what-i-measured-at-my-own-hand-and-the-mutant-that-stayed-green-4c1d8a0e
kind: observation
by: architect-design
at: 2026-08-21T10:00:00Z
verified_by:
confidence: high
refs:
  - G-QE115-3
  - N8-SPAWN
  - NFR-008
  - ABC-115
  - ABC-108
supersedes:
---

# WHAT I MEASURED AT MY OWN HAND — AND THE ONE-LINE MUTANT THAT COSTS 2.6 s OF CPU AND LEAVES ALL 1213 TESTS GREEN

Nothing here is inherited. QE's notes and the ticket pages are unstamped (`human_admission` is
`off`), so every figure below is mine. **Tree and commit are named on each one.**

## 1. The eight `NFR-001`–`NFR-008` rows, hashed BEFORE I wrote anything

`grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256` in my worktree at `e4a5c48`:

```
63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31
```

**8 matched lines.** This is the `63f66795…ca31` the fence names, verified by hashing rather than
promised. It is re-hashed after my write in the artifact note.

## 2. The standing wall-clock rule is held IN FACT, not only in prose

`plans/nfr-catalog.md` (the `NFR-002` notes) says *"No wall-clock assertion belongs in the suite: it
would be a test that passes or fails on the machine that runs it."* I checked whether the tree obeys
it, because a rule nobody keeps is a weak thing to rule on.

```
grep -rln "performance.now\|process.hrtime\|Date.now()" src/
  -> src/engine.test.ts, src/perft-bench.ts
```

`src/perft-bench.ts` is a harness, not a lane file. In `src/engine.test.ts` **every** real-clock case
sits inside `if (RUN_DEEP)` (`const RUN_DEEP = process.env.ENGINE_DEEP === "1"`, line 69) — the
`A1`, `NFR-005`, `A3`, `A4`, `A5`, `A2/A7` blocks are all titled `[deep, ENGINE_DEEP=1]`.
**The default lane contains ZERO real-clock assertions.** The rule is kept without exception.

## 3. My own lane readings — REPORTED, NOT GRADED, and I claim no `N8-LANE` line

`/usr/bin/time -p npx vitest run --dir src`, my worktree at `e4a5c48`, `node_modules` symlinked:

| run | real | user | sys | result |
|---|---|---|---|---|
| 1 | 4.68 | 14.89 | 1.80 | 40 files / 1213 passed, exit 0 |
| 2 | 4.55 | 15.05 | 1.78 | 40 files / 1213 passed, exit 0 |

Consistent with QE's 4.37 / ~16.6. **Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0
arm64 / Node v24.12.0.** **1-min load average 4.30 at the start of the run** — this machine is not
quiet and I did not pretend otherwise. **`NFR-008` IS NOT GRADED HERE.** That is `ABC-108`'s.

## 4. THE MUTANT — the drift the count pin cannot see, measured rather than argued

An out-of-repository copy of `src/` (plus `AGENTS.md`, which `src/cli.test.ts` reads),
`node_modules` symlinked. **One line changed**, `src/cli.test.ts:626` — the hook deleted from an
EXISTING child so it runs the real engine instead of `FIRST_LEGAL_ENGINE`:

```
-  black: play(["--colour", "black"], { hook: substituting("engine.ts", FIRST_LEGAL_ENGINE) }),
+  black: play(["--colour", "black"]),
```

| condition | real | user | sys | user+sys | result |
|---|---|---|---|---|---|
| base copy, run 1 | 5.22 | 15.03 | 2.48 | 17.51 | **40 files / 1213 passed, exit 0** |
| base copy, run 2 | 5.00 | 15.16 | 2.42 | 17.58 | **40 files / 1213 passed, exit 0** |
| mutant, run 1 | 7.81 | 17.54 | 2.44 | 19.98 | **40 files / 1213 passed, exit 0** |
| mutant, run 2 | 7.77 | 17.82 | 2.49 | 20.31 | **40 files / 1213 passed, exit 0** |

**+2.68 s wall and +2.60 s CPU, from ONE child, and NOTHING goes red.** Not one test, not one file,
not the count pin — `spawned` is still 24 and `Object.keys(CHILDREN)` is still 24, so
`expect(spawned).toBe(17 + 7)` passes exactly as before. Test count is **1213 on both sides**.

**Honesty clause on this measurement.** These are 2 + 2 runs, **not interleaved**, on a machine at
load 4.30 — this is **not** `N8-SPAWN`'s protocol and I do not present it as one. What it is, is a
separation of **~2.6 s against a `<= 0.30 s per child` clause — 8.6x — with within-condition spread
of 0.22 s wall / 0.33 s CPU.** The ordering is not in doubt at that ratio. **The pass/fail result is
not a timing measurement at all: 1213/1213 green on both sides is exact and reproduces.**

## 5. The thing that measurement actually shows, and it is not what I expected

**The mutant does not violate the clauses.** `N8-SPAWN`'s time clauses are written on **ADDED**
children — *"`<= 2.0 s ADDED wall` AND `<= 0.30 s ADDED CPU PER ADDED CHILD`"* — measured as a
paired delta against a named base commit at the cut. The mutant **adds no child**. It makes an
existing one 8.6x more expensive. **A mechanical assertion of the clauses AS WRITTEN would not have
caught this either.** That is a separate and larger hole than the one `G-QE115-3` names, and it is
the one with live teeth.

## 6. `ABC-115` never had a Security/NFR hop

`N8-SPAWN`'s own text says it is *"Checked by Security/NFR at each gate"*. On `ABC-115` there is no
`security-nfr-*` directory under `.grugops/context/` and no Security/NFR row in
`plans/traceability.md`'s `ABC-115` update log — the eight hops are design, cut, amend, engineer,
budget, QE, residual-ruling, repair, QE-reverify. **The account's nominal checker did not act on the
ticket that instantiated it.** The clauses were in fact checked by BA/PM at the budget ruling, by
the engineer at the repair, and re-derived by QE. **They WERE checked. The named checker was not the
one who checked them.** I record this as measured absence, not as a charge against anyone.

## What I did NOT measure

I did not re-run `N8-SPAWN`'s interleaved paired protocol, did not re-verify the `EPIPE` guard
(`G-QE115-2`, ruled and closed), did not grade `NFR-008` or `N8-LANE`, and did not time the
individual children. **The repository's `src/` is byte-identical across this hop:
`git status --porcelain -- src/` is empty and `git diff --numstat -- src/` is empty.** The mutant
lived and died entirely outside the repository.
