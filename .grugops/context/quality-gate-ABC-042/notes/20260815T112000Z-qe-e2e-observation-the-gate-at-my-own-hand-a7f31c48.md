---
id: 20260815T112000Z-qe-e2e-observation-the-gate-at-my-own-hand-a7f31c48
kind: observation
by: qe-e2e
at: 2026-08-15T11:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - .grugops/test-skips.md
supersedes: 
---

# The gate, re-run at my own hand on the engineer's tip — and the two things I re-verified rather than inherited

## Where this ran

Branch `grugops/quality-gate-ABC-042`, cut from the engineer's tip **`8b07d9f`**, in an isolated
`git worktree` (a Security/NFR hop is live off the same tip in this repo; a second checkout in the
shared working tree would have collided with it). `node_modules` symlinked in, **removed before
finish**. `main` was never checked out, nothing was pushed, nothing merged, nothing deployed.

## The gate

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — 54 files, no fixes, **2 infos**, both the pre-existing `biome migrate` config notice, neither from this diff |
| typecheck | `npm run typecheck` | **PASS** — `tsc --noEmit`, no output, rc 0 |
| build | `npm run build` | **PASS** — `tsc --noEmit` (this project's honest "build") |
| unit | `npm test` | **PASS — 856/856 on 30 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **PASS** — `No findings.`, exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **PASS — 32/32**, 8 deep counts exact, 36.2 s |

`.grugops/test-skips.md` was **read and run against; no row was written into it** — it is
human-owned. `self_fix_attempts` (2) was **not consumed**: nothing in the delivered build failed a
gate, so there was nothing to self-fix. Every number above is from a command I ran in this worktree,
not from the engineer's note.

## The two facts I was told and re-measured anyway

**1. `A12`'s file list is exactly six paths.** The Orchestrator verified this and told me so; the
subtask told me to re-verify rather than inherit it, and I did.

```
git diff --name-only e140355~1 e140355
  AGENTS.md  package.json  src/cli-options.ts  src/cli.test.ts  src/cli.ts  src/history-pane.nfr.test.ts
```

Six, and `e140355`'s parent is `7df25b9` — the base the engineer recorded. `git diff --numstat
e140355 8b07d9f -- src/` is **empty**, so the tip adds no `src/` change beyond the delivered commit,
and the whole-branch diff `7df25b9..8b07d9f` is those six paths plus **9 substrate paths** (7 notes,
2 queue records) that Workflows 16 and 17 mandate. The engineer's two-commit split is what makes
`A12` checkable exactly as worded; I confirm the split does what it claims.

**2. All 18 merged production modules are byte-identical.** Not read off a numstat — compared by
**git blob SHA**, module by module, `main@8dbc3db` against `e140355`:

```
18 production modules at main; 20 at e140355; the two new ones are src/cli.ts and src/cli-options.ts
IDENTICAL x18  (apply fen frame gameend glyph-mode history-pane history legal moves
                perft-bench perft position render-seam render san status-panel turn-loop zobrist)
```

Zero differ. `productionModules()` returning 20 in the suite agrees with the tree.

## The licence edit, inspected rather than accepted

`git diff e140355~1 e140355 -- src/history-pane.nfr.test.ts` is **two hunks and nothing else**:

- `LICENSED_DRIVERS` gains exactly one element — `"cli.ts"` — and the array is still a two-name list.
- A five-line citation paragraph above it, **verbatim** from Architect/Design's
  `…decision-clause4-census-and-licence-d07080ea` (I diffed the prose against the note; only the
  leading `` `cli.ts` is `` was added to turn their sentence fragment into a sentence).

What the subtask asked me to check for, checked and **absent**: the guard's comparator is still
`expect(runtimeImporters).toEqual(production.filter(...))` — **`toEqual`, not weakened to a subset**;
`FRAME_PRODUCERS` is untouched; the `runtimeImporters` regex is untouched. The `+7 −1` numstat is 6
citation lines plus the one changed array line.

**The guard is not vacuous, proved by mutant, not by reading:** removing `"cli.ts"` from
`LICENSED_DRIVERS` reds `src/history-pane.nfr.test.ts` *and* `A12`'s row. So the licence edit was
genuinely forced by the correct flat build, exactly as the ticket predicted.

## Bar 1b — MET, with a trap in the bar's own wording

Measured over the delivered test file, **executable text vs raw source**:

| probe | raw file | comments stripped |
|---|---|---|
| `/\bexec\s*\(/` (the bar's own regex) | **1** | **0** |
| `/\bexecSync\s*\(/` | **1** | **0** |
| `shell:` | **1** | **0** |
| `process.execPath` (the bar says it MUST be present) | 2 | 1 |

**Bar 1b is MET.** Both raw hits are on lines 16–17 — the file's own docblock, quoting the forbidden
spellings in order to say it does not use them. `spawnSync` has **one** executable call site,
argv-array form, `stdio: ["ignore","pipe","pipe"]`, and no spawn argument built by concatenation.

But note what that table says about the *instrument*: the bar states two regexes and the words
"**call sites, NEVER occurrences**", and a regex over raw source **cannot tell a call site from a
comment**. Applied literally to the correct build it returns 1 and 1 — a **false RED**. That is the
same defect class `RF-9` repaired one layer up (it repaired "occurrences of `exec`" to "call sites"
but left regexes that still count occurrences). Recorded in the gaps note as `Q5`; it matters
now because Security/NFR is reading this bar concurrently.

## The spawn pin — checked for honesty, not taken on report

- `spawnSync(` has **exactly one executable call site** (`:122`), inside `childOf`, which is the only
  thing that increments `spawned`. So the counter cannot miss a spawn made through the sanctioned path.
- All **10** children are constructed in the module-scope `CHILDREN` object literal (`:145`–`:158`);
  there is no `childOf`/`run` call inside any test body. They are therefore all spawned during
  collect, before any assertion runs, which is what makes `expect(spawned).toBe(10)` meaningful at
  the point it executes.
- `stdio: ["ignore","pipe","pipe"]` lives in that one wrapper, so **both channels really are piped on
  every one of the ten** — the union assertions have something to union.

**The one honest caveat:** the pin is self-referential. `spawnSync` is in scope, and a future hop
that called it directly would spawn a child the counter never sees while `expect(spawned).toBe(10)`
stayed green. Today there is exactly one call site, so the pin is honest **now**; it is not
tamper-proof. Low severity, recorded as `Q6`.
