---
id: 20260815T093500Z-security-nfr-observation-v221-discharge-probed-with-mutants-6a4d1f9f
kind: observation
by: security-nfr
at: 2026-08-15T09:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - V2.2.1
  - V2.2.2
  - V1.3.3
  - RF-1
  - RF-7
  - src/cli-options.ts
  - src/cli.ts
supersedes: 
---

# Does the delivered resolver CLOSE `V2.2.1`, or only satisfy the assertions I specified? — six built mutants

**The question the subtask puts first, and it is the right one to put first.** `V2.2.1` was my HIGH.
`A6`(i)/(ii) and `A9`(2) were the repair I demanded. I discharged my own block on the criteria before
any code existed. So the only honest way to answer whether the code closes it is to **build the
builds that would slip through and watch what happens** — not to re-read the assertions I wrote.

**Method.** Three out-of-tree copies of the delivered tree, `node_modules` symlinked, `cmp`-verified
byte-identical file by file (**1532 files, 0 mismatches**) before anything was changed. **The
repository's own `src/` was never opened for writing at any point in this hop.** Each mutant is one
edit, run against the delivered `src/cli.test.ts`, then reverted from a pristine copy. Control first:
the untouched mutant tree runs **29/29 GREEN**.

## The answer, stated before the table

**The delivered resolver genuinely closes `V2.2.1`. The instrument that verifies it does not close
completely, and the residual is one regex character class wide.**

The code is a real positive allowlist, and I read it line by line rather than inferring it from a
green suite: one exported closed enumeration (`ACCEPTED_ARGUMENTS`), destructured so **no accepted
spelling is written twice in the module**, membership by **exact string equality** — never
`startsWith`, never `toLowerCase` — and **rejection as the default branch of the loop**, so the
complement is closed by construction rather than by a denylist somebody has to keep complete. That is
what `V2.2.1` asks for, and it is what shipped.

## The mutants

| # | build | prediction | measured |
|---|---|---|---|
| **M0** | `--debug` accepted, written as a **double-quoted** literal — the exact build my original HIGH named | RED | **KILLED, by TWO rows**: `A6(i)` *the enumeration is the ONLY argv literal* and `A6(i)` *an undocumented fifth flag is rejected and named*. 2 failed / 27 passed |
| **M1** | `--debug` accepted, written as a **template literal** | ? | **KILLED, by ONE row** — the explicit fifth-flag row. The only-argv-literal row went **blind**: its literal scan is `/"(?:[^"\\]|\\.)*"\|'(?:[^'\\]|\\.)*'/`, which does not match backticks. 1 failed / 28 passed |
| **M2** | **`--engine-path`** accepted, written as a **template literal** — an untargeted fifth flag in the spelling M1 exposed | ? | **SURVIVES. 29/29 GREEN.** |
| **M3** | bar 3 evasion: `printableOf` removed **and** the raw token moved to line 2 of the message | ? | **SURVIVES. 29/29 GREEN** — and `od -c` on its output shows a literal `\033 [ 2 J` (clear-screen) reaching the terminal |
| **M3b** | `printableOf` removed, **message shape unchanged** | RED | **KILLED** by the `bar 3` row. So the instrument catches the sanitiser being removed; it is the *coupling to the message layout* that is the gap |
| **M4** | a **second branch on argv after the resolver returns** — `const given = process.argv.slice(2)` (still exactly ONE `process.argv` occurrence), then `if (given.includes("--trace"))` | I expected this to SURVIVE | **KILLED** by `A9 — process.argv occurs EXACTLY once and only as the resolver's argument`. The row also pins the literal shape `resolveOptions(process.argv.slice(2))`, which the alias breaks |

**M4 refuted me and I am recording that against my own name.** I went in believing `A9`(2)'s
instrument had an aliasing hole — that keeping one `process.argv` occurrence would let a second argv
branch through. It does not: the row asserts the occurrence count **and** the exact call shape **and**
a single `resolveOptions` call site, and the three together close it. `RF-1(b)` is not merely
satisfied, it is stronger than the criterion I wrote for it.

## What the surviving mutants mean, sized honestly

**M2 is the residual of `RF-7`, and it is strictly narrower than `RF-7` was.**

- Before the criteria repair: **any** fifth flag shipped green against every criterion and every bar.
- After the repair, on the delivered build: a fifth flag ships green only if it is **(a) not
  `--debug`** and **(b) written with backticks**. Every quoted spelling dies on the only-argv-literal
  row (M0), `--debug` dies on its own row in either spelling (M0, M1), and enlarging the enumeration
  dies on the element-for-element equality against `## Scope`'s table.

That is a large narrowing, and it is why `V2.2.1` is **MET on the artifact** rather than failing again.
The control is present and verified; what has a hole is the **regression guard against a future edit**.
I graded `RF-7` medium when the residual was "any fifth flag, `--debug` included, ships green in 10/10
seeds". This residual is smaller than that, so it grades **LOW** — `S3` in the ruling note — and it
costs one alternation to fix.

**M3 is `S2`.** The delivered bar-3 assertion reads `child.union.split("\n")[0]` — the first line of
stdout∪stderr — and calls it "the echoed LINE, a superset of the echoed token, so this is stronger,
never weaker". That claim is true **only while the echo sits on line 0 and stdout is empty**, which is
a fact about the delivered message layout, not a property of the assertion. It is a positional proxy
for "the echoed token", which is what the bar actually names. M3b shows the instrument is armed
against the obvious mutation; M3 shows it is blind when the layout moves with it. **Two coordinated
changes are needed to reach the harm**, and the ASVS row for terminal-escape injection is
`V1.3.3 [L2]` — above this project's active L1 floor, which is to `ABC-042`'s credit. **LOW.**

## One behavioural observation that is not a finding

The accepted set is closed at the **token** level, as the criteria require. The accepted **argv
grammar** admits repetition that `## Scope`'s table does not enumerate as a form:

```
--colour white --colour black   -> exit 0, last wins (black)
--ascii --ascii                 -> exit 0
--unicode --colour random       -> exit 0   (intended: the table lists the flags independently)
```

Every value in every one of those is drawn from the allowlist, so **`V2.2.1` is untouched** — this is
not a validation gap. It is a wording question about whether the table enumerates tokens or forms, and
it belongs to BA/PM's batched wording hop if it belongs anywhere. **Recorded, not raised as a fix.**
