---
id: 20260817T140500Z-software-engineer-observation-a1-mutant-run-first-hand-green-without-the-guard-red-with-it-1a2b3c4d
kind: observation
by: software-engineer
at: 2026-08-17T14:05:00Z
verified_by:
confidence: high
refs:
  - ABC-062
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
  - .grugops/context/ticket-to-pr-ABC-062-2026-08-17/notes/20260817T133000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2.md
supersedes:
---

# `A1`'s mutant, run at first hand: GREEN without the guard, RED with it. Everything the page claims reproduces.

Ran in a throwaway detached git worktree at `/private/tmp/abc062-mutant-probe`, **outside the
repository**, `node_modules` symlinked from the shared tree, **removed afterwards** (`git worktree
remove --force` then `rm -rf`; `git worktree list` confirms it is gone and this repository's `src/`
was never mutated). Machine: this session's host, Node v24.12.0.

The mutant is the one the page names: `src/cli-options.ts:130`,
`reject(MISSING_VALUE, next ?? token)` → `reject(MISSING_VALUE, next as string)`.

| condition | result |
|---|---|
| baseline, no mutant, no guard (`main` @ `4c5e19e`) | **863/863 on 30 files**; `src/cli.test.ts` 36/36 |
| baseline, no mutant, guard present | **864/864**; `src/cli.test.ts` **37/37** |
| **mutant applied, guard REMOVED** (`git checkout -- src/cli.test.ts` in the probe) | **863/863 GREEN on 30 files** — the page's central claim, reproduced |
| **mutant applied, guard present** | **RED: 1 failed \| 36 passed** in `src/cli.test.ts` |

The failure is the deep equality and nothing else:

```
AssertionError: expected [ undefined ] to deeply equal [ '--colour' ]
 ❯ src/cli.test.ts:1198:36
```

**Nothing else in the suite moved between the two mutant conditions** — 863 green without the guard,
863 + 1 failing with it. The new row is the only thing that sees this mutant, which is what makes it
the witness rather than a bystander.

## The user-visible failure, also reproduced

Under the mutant, in the probe:

```
$ node src/cli.ts --colour
TypeError: text is not iterable
    at printableOf (.../src/cli.ts:69:27)
    at main (.../src/cli.ts:82:54)
exit=1
```

A seven-line Node stack trace where the usage sentence belongs, **at exit code `1` — the same code a
correct refusal exits with**, so no exit-code assertion could ever have caught it. The page's `P1`
argument is true as written.

## Nothing disagreed with the page

I was asked to report any discrepancy rather than work around it. On the substance there is none:
every measurement the page and the parent `observation` state for `A1` reproduced exactly, including
the 863/863 figure, the crash site (`src/cli.ts:69`) and the exit code. Two cosmetic drifts are
recorded in the sibling `decision` note; neither changed any decision.
