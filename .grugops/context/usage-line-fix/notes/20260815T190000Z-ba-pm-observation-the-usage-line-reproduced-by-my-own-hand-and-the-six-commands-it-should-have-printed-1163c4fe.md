---
id: 20260815T190000Z-ba-pm-observation-the-usage-line-reproduced-by-my-own-hand-and-the-six-commands-it-should-have-printed-1163c4fe
kind: observation
by: ba-pm
at: 2026-08-15T19:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-062
  - ABC-065
  - ABC-042
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# The defect reproduced by my own hand, the six commands the program should have printed, and the merged rows I checked before writing a criterion about them

Machine: Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0. Tree: `main` @ `af3eb8b`, clean.
**Nothing under `src/` was edited, at any point in this hop** — every number below comes from running
the delivered build.

## 1. The loop, reproduced

```
$ npm run chess --colour black
> node src/cli.ts black
npm warn "black" is being parsed as a normal command line argument.
npm warn Unknown cli config "--colour". This will stop working in the next major version of npm.
unrecognised argument: black
usage: npm run chess [--colour white|black|random] [--ascii | --unicode]        exit 1
```

The Orchestrator's and the owner's account is exact. **npm eats `--colour` as one of its own configs
and forwards only `black`**, so the program sees `["black"]`, refuses it correctly by `ABC-042`'s
`A6`(iii), and then prints an instruction whose whole content is *type what you just typed*.

## 2. The separator form, run six ways — all correct, none ever printed

| command | exit | stdout lines | stderr bytes |
|---|---|---|---|
| `npm run chess -- ` | `0` | 27 | 0 |
| `npm run chess -- --colour white` | `0` | 27 | 0 |
| `npm run chess -- --colour black` | `0` | 27 | 0 |
| `npm run chess -- --colour random` | `0` | 27 | 0 |
| `npm run chess -- --ascii` | `0` | 27 | 0 |
| `npm run chess -- --unicode` | `0` | 27 | 0 |

**6 of 6.** The bare trailing `--` is accepted by npm and behaves as no arguments, so the bracketed
"all options optional" reading of the usage line stays true with the separator in it.

## 3. The absence, counted rather than asserted

| measurement | value |
|---|---|
| `npm run chess -- ` in the program's output, across all six refusal command lines, both channels | **0** |
| `npm run chess -- ` anywhere under `src/` | **0** |
| `usage` in `src/cli.test.ts` | **1**, and it is inside a comment at `:663` |

The third row is QE's finding re-measured at this hop, and it is what makes a string-only fix
unsafe: **there is no assertion anywhere in this repository that reads the usage line.**

## 4. What I checked before writing `A6`'s "nothing else moved"

A criterion saying *the merged rows stay green* is worth nothing if nobody looked at the mechanism.
I read all three rows that touch a refusal child's output:

- **`:315` and `:325`** assert `toContain(<the offending token>)` on stderr and zero frame rows.
  The offending token is unchanged by this ticket.
- **`:750`** (security bar 3) splits `stdout+stderr` on whitespace and keeps only the words
  containing `[2Jpurple`. **A `--` word is not one of them**, so adding it cannot reach the
  assertion.
- **`:201`** (`A1`'s documentation row) reads `AGENTS.md`, which this ticket does not open.

So the fix reds nothing today, and that conclusion rests on the three mechanisms rather than on a
green run I have not done. **I ran no test suite this hop** — BA/PM cuts tickets and does not
execute the work.

## 5. One thing I could not settle from here, recorded rather than guessed

**Whether npm forwards the tokens after `--` on every supported npm major is `UNKNOWN - verify`.**
It does on npm 11.7.0, measured above. `engines.node` is `>= 22` and no npm floor is declared
anywhere in the manifest, which is the same untested-floor gap QE already recorded for Node. The
ticket does not depend on the answer — it prints the form that works on the runtime this project
actually uses — but a criterion asserting *npm forwards it* would have been fabricated, so none was
written.
