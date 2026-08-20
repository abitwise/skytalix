---
id: 20260821T041000Z-software-engineer-observation-a10-watched-red-against-the-mutant-and-watched-green-against-main-9d4a7f31
kind: observation
by: software-engineer
at: 2026-08-21T04:10:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - A5
  - A9
  - G-QE115-1
  - src/cli.ts
supersedes:
---

# THE WATCHED-RED ROUND, BOTH ARMS, VERBATIM — AND THE SECOND ARM IS THE ONE THAT PROVES I DID NOT WATCH THE WRONG THING

`A5`'s watched-RED round for `A10` runs against the **deleted-token mutant** and against nothing
else. BA/PM pre-named the failure mode — *`A10` does not red against `main` at all* — so I ran
**both** arms and report both, rather than reporting one and asserting the other.

## Discipline first: the copied tree was established GREEN before a token was changed

The recorded failed attempt (a copy that omitted `AGENTS.md` and was **red before the mutant
existed**, which would have read as *the branch IS guarded*) was read and **avoided by
construction**, not re-run. The copy carries `src/`, `package.json`, `package-lock.json`,
`tsconfig.json`, `vitest.config.ts`, `biome.json`, **`AGENTS.md`** and `tools/`, with `node_modules`
symlinked, and it lives **outside the repository**. Baseline on the delivered build, recorded before
mutating: **61 passed / 61**.

## Arm 1 — the one-token mutant. RED, and `A10` is the ONLY red

```
sink.on("error", () => {
  process.stdin.destroy();
});
```

```
 × ABC-115 … > A10 — a REAL write failure is not absorbed: the arm narrows to EPIPE and nothing wider
   → a failed write was absorbed: "NODE_EXIT=0\n": expected +0 not to be +0 // Object.is equality
 ❯ src/cli.test.ts:2882:88

 Test Files  1 failed (1)
      Tests  1 failed | 60 passed (61)
```

**One red out of sixty-one.** That is the whole reading: the row discriminates that token and
nothing else, and the other sixty rows confirm QE's and BA/PM's measurement that deleting it is
otherwise invisible. The status clause fires first; the stderr clause would fire too — the mutant
writes **0 bytes**.

## Arm 2 — `main`'s production arm with this test file. `A10` is GREEN, and that is CORRECT

`git show main:src/cli.ts` dropped into a second copy of this tree:

```
 ✓ A10 — a REAL write failure is not absorbed: …
 × A1 …   × A2 …   × A3 …   × A9 …
 Test Files  1 failed (1)
      Tests  5 failed | 56 passed (61)
```

**`main` installs no arm at all, so it dies loudly on this path and passes `A10` by accident.**
A hop that watched only `main` would have recorded four reds, seen the suite go red, and concluded
the round was done — **without ever having watched `A10` red**. That is the same species of mistake
`A9` already taught this ticket, pre-named on the page, and it is why this arm is reported.

## Both trees destroyed after reading; the repository's `src/` never held a mutant

The repository worktree was never mutated. `git status` on the branch shows only the intended files.
