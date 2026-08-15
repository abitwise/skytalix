---
id: 20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613
kind: observation
by: uat-planner
at: 2026-08-15T11:11:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/glyph-mode.ts
  - package.json
  - AGENTS.md
supersedes: 
---

# Six facts the run turned up that no acceptance criterion asks about

**None of these is a defect and none of them failed a scenario.** They are behaviours of the
delivered command that a person will meet, that `A1`–`A12` do not mention, and that would otherwise
be re-discovered by the next hop or — worse — mistaken for a bug by the owner during signoff.
Measured, not reasoned about.

## 1. The default drawing style CHANGES depending on where the output goes

- On a **real terminal**: `npm run chess`, no options, draws **32 Unicode chess figures**.
- **Piped or redirected to a file**: the same command draws **plain letters**, and the output contains
  **zero** bytes above `U+007F`.

Both were measured — the terminal case under a pseudo-terminal, which showed 32 code points in
`U+2654`–`U+265F` and **zero** escape bytes from the program.

This is `selectGlyphMode`'s merged rule working as designed (a sink that cannot be seen gets the
portable form), and `A7` asserts the piped half. **The consequence for acceptance is practical: the
owner running this in his terminal will see figures, while every transcript in this task's notes
shows letters, because everything an agent runs is piped.** A signer comparing the two would
otherwise think one of them is wrong. **The UAT pack carries this as a scope note in Group C.**

## 2. Forgetting the `--` separator fails in two different confusing ways

Options must be typed after a bare `--`. Without it the package runner intercepts them, and the two
failure shapes are not alike:

| typed | what happened | why it matters |
|---|---|---|
| `npm run chess --ascii` | **exit `0`, a board printed** — and `--ascii` was silently discarded; the runner passed no arguments at all | the user asked for letters, got a board, and was never told their option was dropped |
| `npm run chess --colour black` | exit `1`, `npm warn Unknown cli config "--colour"`, then `unrecognised argument: black` | the complaint names `black` — the word the user meant as the **answer** — not `--colour` |

**Neither is the chess program's doing.** The program received exactly what the runner handed it and
behaved correctly on both. **The first is the one to watch**: it is the only measured path in this
whole run where a person can ask for something, be given a board, and not be told their request was
ignored. **The UAT pack carries both, so that a missing `--` is not recorded as a product failure.**

## 3. A repeated option is accepted, and the last one wins

| typed | result |
|---|---|
| `--colour white --colour black` | **black** at the bottom |
| `--colour black --colour white` | **white** at the bottom |
| `--ascii --ascii` | accepted, board drawn, exit `0` |

No criterion specifies this either way; it falls out of the resolver walking the arguments in order.
Recorded because "last one wins" is a real convention that a later ticket may want to keep, change,
or reject — and because it should be a deliberate choice rather than something nobody noticed.

## 4. There is no help screen, and `--help` is refused like any other unknown word

`npm run chess -- --help` → exit `1`, `unrecognised argument: --help`, then the usage line.

This is exactly what the ticket scoped (*no `--help` beyond the usage message the error paths
print*). **It is recorded here because a person's first instinct on an unfamiliar command is
`--help`, and what they will get is a refusal that happens to contain the help they wanted.** It
works; it does not read as if it were meant to.

## 5. The frame is always the same shape: 23 rows, and the last row is blank

Nine board rows (eight ranks and the file letters), two status rows, twelve move-list rows. Always 23,
regardless of options. The stream ends with exactly one newline after the last row and contains **zero**
`ESC [` sequences — the product never repaints, never clears, never colours.

**The twelve move-list rows are blank on every run and always will be in this version.** They are the
most visible piece of evidence in front of a signer that something is meant to go there and does not
yet — the pack names them in its limitations for that reason.

## 6. Running from the wrong folder gives a package-runner error, not a product error

`cd /tmp && npm run chess` → **exit `254`**, `npm error code ENOENT … Could not read package.json`.

The exit code is the runner's, not the program's — the program never started. Worth having on record:
**`254` is not a chess-program failure code**, and the only exit codes the product itself produces are
`0` (board drawn) and `1` (arguments refused).
