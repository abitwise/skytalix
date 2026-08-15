---
id: 20260815T215000Z-security-nfr-observation-the-four-bars-against-the-merging-tree-3a7c81be
kind: observation
by: security-nfr
at: 2026-08-15T21:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - BAR-1b
  - V1.2.5
  - V1.3.2
  - V1.3.3
  - V2.1.1
  - V2.2.1
  - V2.2.2
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# The four bars, re-measured against `d011df4` — **all four MET**, and the two of them that got stronger

Measured at my own hand on the merging tree. Where a number differs from my gate reading it is stated
and the reason is named.

## Bar 1 — arguments are data, never code (PRODUCTION modules). **MET.**

```
                     src/cli.ts   src/cli-options.ts        (whole source, comments included)
eval                      0             0
Function(                 0             0
child_process             0             0
import(                   0             0
shell                     1             0     <- docblock prose ("the shell is told so")
spawn                     0             2     <- docblock prose

over EXECUTABLE CODE only: 0 / 0 / 0 / 0 / 0 / 0 on both modules
```

Identical to my gate reading, on identical bytes. The "no shell" clause is satisfied structurally:
a shell needs `child_process` or a builtin import and production has **zero** of either.
**`V1.3.2 [L1]` and `V1.2.5 [L1]`: MET on the artifact.**

## Bar 1b — the delivered TEST file. **MET on the property**, and its guard is materially better than at the gate

```
reading                        raw    comment-stripped
/\bexec\s*\(/  CALL SITES        1           0
/\bexecSync\s*\(/ CALL SITES     1           0
shell:                           1           0
exec SUBSTRING                  12           9      (must be > 0: the file MUST contain process.execPath)
process.execPath                 2           1
spawnSync( call sites            1           1
execFileSync( call sites         0           0
```

**All three raw hits are on lines 16–17 — the file's own docblock**, which quotes the forbidden
spellings in order to say it does not use them. Repository-wide over all 50 `src/*.ts`,
comment-stripped: **0 `exec(`, 0 `execSync(`, 0 `shell:`.** The one `spawnSync` argument text is
`command, [...args], { cwd, encoding, stdio }` — an **array literal**, and there is no `+` anywhere
inside the spawn call, so the no-string-concatenation clause holds.

**What is new on this tree, and it is the most useful thing I measured.** `S1` said bar 1b's harm was
*"caught by nothing mechanical"*. That is **no longer true**, and not because anyone wrote bar 1b's
row — the `Q6` spawn-pin repair closed it as a side effect. Built and run:

| # | mutant on `src/cli.test.ts` | verdict |
|---|---|---|
| `MS3` | a **second named import** of `execSync` from `node:child_process` **plus an `execSync(` call site** | **KILLED** by *"`N8-LANE` — this file spawns TEN children and no more"* |
| `MS3b` | `execSync` added to the **same** named-import list, same call site | **KILLED**, same row |
| `MS4` | **`shell:`** added to the one spawn — import list and call count unchanged | **SURVIVES 29/29 GREEN** |

The row asserts `imported === ["spawnSync"]`, so every route to `exec`/`execSync` in an ESM file — a
second import line, a widened list, a namespace import, a dynamic `import()` — reds it. **`S1`'s
residual is now exactly two clauses of bar 1b: `shell:` and the no-string-concatenation clause.**

## Bar 3 — no argument reaches the terminal unsanitised. **MET, and `S2` is closed.**

The delivered build, run by me on both channels:

```
argv token                  echoed                                            C0/DEL at the terminal
7-bit ESC + "[2J"           "--colour needs one of white/black/random: [2Jpurple"      none
DEL U+007F                  "--colour needs one of white/black/random: purple"         none
```

The instrument now locates the token by whitespace split and joins **every** occurrence, instead of
reading `union.split("\n")[0]`. I did not take that on report — I rebuilt the mutant that beat the
old one:

| # | mutant on `src/cli.ts` | at the gate | on this tree |
|---|---|---|---|
| `M3` | `printableOf` removed **AND** the token moved down two lines | **SURVIVED 29/29**, emitting a literal `ESC [ 2 J` | **KILLED by the bar 3 row** |
| `M3b` | `printableOf` removed, layout unchanged | KILLED | **KILLED** |

**`S2` is CLOSED on my own evidence.** The repair moved the assertion toward the criterion — the bar's
clause (ii) names *"the echoed token's bytes"* and the instrument now asserts over the echoed token.

## Bar 4 — no filesystem and no network (PRODUCTION modules). **MET.**

```
src/cli.ts          ./cli-options.ts  ./frame.ts  ./glyph-mode.ts  ./history.ts  ./render-seam.ts
src/cli-options.ts  ./glyph-mode.ts (type-only)   ./render.ts (type-only)

non-relative specifiers: 0 and 0        grammar /^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/ matches none
fetch / WebSocket / XMLHttpRequest:  0 / 0 / 0 on both modules
```

Unchanged from the gate, on identical bytes.

## `A9` — the exclusivity rules, re-measured on the merging tree

```
src/cli.ts   process.argv occurrences (code)   1
             process.* surface, sorted         ["process.argv","process.exitCode","process.stderr","process.stdout"]
             bare `process` identifier count   4
             resolveOptions( call sites        1
             export statements (code)          0
             globalThis (code)                 0
src/cli-options.ts contains "process" anywhere, comments included   NO
```

**`V2.2.2 [L1]`: MET on the delivered surface.** The row is now three independent assertions deep
(sorted transcription, identifier count, exact call shape) where at the gate it was one count plus a
shape; QE killed ten spellings against it and I reproduce the shape here.

## `A6`(i)'s two pinned counts, derived independently before reading the file

```
family cases 138   distinct 134   duplicates: ["-ascii","--asci","-unicode","-colour"]
misses that are an accepted spelling:            0
cases the delivered resolver ACCEPTS:            0 of 138
ACCEPTED_ARGUMENTS: ["--ascii","--unicode","--colour","white","black","random"]
```

Both numbers reproduce exactly and the family false-REDs nothing. *(A first pass of mine printed "84
collisions"; that was an artefact of flattening the fixed companion tokens into the comparison. It is
recorded here rather than dropped, because a scary number published without its correction is worse
than no number.)*
