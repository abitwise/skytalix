---
id: 20260815T112612Z-qe-e2e-observation-the-uncriterioned-behaviours-and-two-one-word-mutations-the-suite-cannot-see-ecf312e9
kind: observation
by: qe-e2e
at: 2026-08-15T11:26:12Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/glyph-mode.ts
  - src/cli.test.ts
  - AGENTS.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613.md
supersedes: 
---

# The uncriterioned behaviours — would a test catch a regression in each today? Two would not, and I proved it with one-word mutations

The pack recorded **six behaviours of the delivered command that a person will meet and that `A1`–`A12`
do not mention**, plus an untested runtime. This note answers the only question QE owes them: **if that
behaviour regressed tomorrow, would anything go red?**

**Read this first, because it is the thing most likely to be misread: the delivered product is
CORRECT on every point below.** Both mutations were made to a **copy of the tree, outside the
repository**, and reverted with it. **Nothing under `src/` in this repository was touched** — the `src/`
tree object still hashes to `main`'s, and `git status` is clean. What the mutations measure is the
SUITE's blindness, not a defect in the product.

## The two proofs — a one-word change, a user-visible break, and 856/856 green

Both were run in a full copy of the worktree at the session scratchpad, `node_modules` symlinked, on
Apple M3 / Darwin 25.5.0 / Node v24.12.0 / vitest 3.2.7.

### M1 — `--ascii` can be silently ignored, and the whole suite stays green

Mutation, one word, in `src/cli-options.ts:153`:

```
-      flags: { ascii, unicode },
+      flags: { ascii: false, unicode },
```

| what | result |
|---|---|
| `npx vitest run` on the mutated tree | **Test Files 30 passed (30) · Tests 856 passed (856)** |
| mutated build, `--ascii` **under a real pty** (`script -q /dev/null node src/cli.ts --ascii`) | **32 code points in `U+2654`–`U+265F`** — chess figures, i.e. **UAT-8 FAILS for a human** |
| control: unmutated tree, `--ascii` under a pty | **0** figures — letters, correct |
| control: unmutated tree, no flags under a pty | **32** figures — correct (the sink rule) |

**Why the suite cannot see it.** `selectGlyphMode` row 1 (`--ascii` beats every signal) and row 3 (a
sink that cannot be seen gets the portable form) **agree on a pipe**. Every automated child runs on a
pipe, so `--ascii` and no-flag are indistinguishable there. `--unicode`'s wiring IS pinned — it takes
row 2, which disagrees with row 3, and `src/cli.test.ts:274` compares that child byte-exactly.
`--ascii`'s wiring is pinned by nothing. The one row that touches it, `:359`, asserts only
`resolveOptions(["--ascii"]).ok === true`, and `.ok` is still `true` after the mutation.

**Note what does NOT catch it, so nobody assumes it does:** deleting `--ascii`'s handling altogether
WOULD go red, because `A5` requires `--ascii --unicode` to be rejected and the conflict branch reads
the same local. The mutation above keeps the local and drops it from the returned options — the exact
gap between "the flag is parsed" and "the flag reaches the renderer".

### M2 — `npm run chess -- --colour` can crash with a stack trace instead of a usage message, and the whole suite stays green

Mutation, in `src/cli-options.ts:130` — removing the fallback that names `--colour` when the command
line simply stops:

```
-      if (value === undefined) return reject(MISSING_VALUE, next ?? token);
+      if (value === undefined) return reject(MISSING_VALUE, next as string);
```

| what | result |
|---|---|
| `npx vitest run` on the mutated tree | **Test Files 30 passed (30) · Tests 856 passed (856)** |
| mutated build, `node src/cli.ts --colour` | **uncaught `TypeError: text is not iterable` from `printableOf`**, a seven-line Node stack trace on stderr, **no usage message** — i.e. **UAT-10 row f FAILS for a human** |
| exit code of the crashing build | **`1`** — the same code the correct build uses, so even an exit-code-only assertion would pass |

**Why the suite cannot see it.** `["--colour"]` **alone is resolved by no test.** The near-miss family
(`:401`) always supplies a second token; `A6`(ii)'s `--colour <word>` shape always supplies a word;
`A6`(iii)'s four spawned children all carry one. The `?? token` fallback is a live branch with no test
on it, and the usage line it produces is asserted by nothing.

## The six uncriterioned behaviours, graded

| # | behaviour (pack's numbering) | would a regression go red today? |
|---|---|---|
| 1 | **The default drawing style flips with the sink** — figures on a terminal, letters in a pipe or file | **Half.** The pipe half is asserted (`src/cli.test.ts:206`, zero code points above `U+007F`). **The terminal half is asserted by no test at the CLI level** — nothing runs the entry point under a pty. `src/glyph-mode.test.ts` covers `selectGlyphMode`'s rule as a unit, so a change to the RULE reds; a change to the WIRING on the terminal side does not — **M1 is exactly that build** |
| 2 | **Forgetting the `--` separator**: `npm run chess --ascii` prints a board, **exits 0, and silently discards the flag** | **No, and no test reasonably could** — it is the package runner's behaviour, not the product's. But it is the only measured path where a person asks for something, is given a board, and is never told their request was dropped. **`AGENTS.md`'s `Dev / run` line does not mention the `--`**, and `:193` asserts that line's text — so the docs are pinned in a form that omits the trap |
| 3 | **A repeated option is accepted and the last one wins** (`--colour white --colour black` → black; `--ascii --ascii` accepted) | **No.** No test resolves any argv with a repeated token. First-wins, or rejecting duplicates, would both ship green. Reachable by any user. It is also **nobody's decision** — no criterion states it either way |
| 4 | **There is no help screen; `--help` is refused like any other unknown word** | **Split, and the split is worth knowing.** A regression *toward accepting* `--help` **does** go red — it must either enter `ACCEPTED_ARGUMENTS` (`:353`'s element-for-element equality reds) or be written as a literal (`:372`'s only-argv-literal row reds). A regression that **removed the usage line** from the refusal — the only help this version offers — goes red **nowhere** |
| 5 | **The frame is always 23 rows, the last is blank, and there are zero `ESC [` sequences** | **For the default child only.** `:162`'s tail equality pins the row count and content, and `:226` pins the ESC absence and the single trailing newline — **both on `npmRun` alone**. On the `white`, `black` and `random` children only the **9 board rows** are compared: their row count, trailing newline and ESC absence are unasserted |
| 6 | **Running from the wrong folder gives a package-runner error (`ENOENT`, exit 254), not a product error** | **No.** Every spawn uses `cwd: REPOSITORY`. Same gap as UAT-17's behavioural half; the structural cause is pinned by `A10` (`:670`) |
| + | **Node 22 is exercised by nobody** — `engines.node >= 22`, both UAT runs and my suite run were on v24.12.0 | **No.** No test and no config pins the runtime floor |

## The highest-value item on this hop

**M1.** An untested, uncriterioned behaviour a user can reach: **`npm run chess -- --ascii` on a real
terminal is correct today and is protected by nothing.** It is the one place where the pack's UAT run
and the automated suite are *both* blind — the run is piped, so every transcript in this task's notes
shows letters whatever the flag does, and the suite is piped for the same reason. **The only evidence
that `--ascii` works is the pty check in this note**, and the only evidence it will keep working is
that nobody edits that line.
