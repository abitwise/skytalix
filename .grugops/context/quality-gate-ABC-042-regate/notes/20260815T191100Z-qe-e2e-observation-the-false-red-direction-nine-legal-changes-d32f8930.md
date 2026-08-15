---
id: 20260815T191100Z-qe-e2e-observation-the-false-red-direction-nine-legal-changes-d32f8930
kind: observation
by: qe-e2e
at: 2026-08-15T19:11:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q1
  - Q4
  - A6
  - RF-9
  - BAR-1b
  - src/cli.test.ts
  - src/cli-options.ts
supersedes: 
---

# The FALSE-RED direction, which I ran before the kill direction and weight equally

This ticket has already shipped one guaranteed-false-RED clause (`BAR 1b`, caught as `RF-9` before it
bit). **A near-miss family that reds a correct build would be worse than the gap it closes.** So the
first question I asked of `B1` was not "does it kill?" but "what does it forbid?"

## Nine legal changes to a CORRECT build. Eight green, one red, and the red is not `B1`'s

Each is a change a competent engineer could make tomorrow with no criterion moving. Each was applied to
the tree, proved on disk, run, and reverted by byte copy.

| # | legal change | result |
|---|---|---|
| `R1` | rename the loop variable `token` → `arg` throughout — **the exact refactor BA/PM said a criterion must not forbid** | **GREEN** 29/29 |
| `R2` | the `if`-chain rewritten as a `switch` (still exact equality) | **GREEN** 29/29 |
| `R3` | a **comment** naming `--debug` and `-h` added to the resolver | **GREEN** 29/29 |
| `R4` | `ACCEPTED_ARGUMENTS` **reordered**, with its destructuring reordered to match | **GREEN** 29/29 |
| `R5` | `index++` → `index += 1` | **GREEN** 29/29 |
| `R6` | membership extracted into a named helper `matches(candidate, accepted)` | **GREEN** 29/29 |
| `R7` | entry point: `printableOf` renamed to `printable` | **GREEN** 29/29 |
| `R8` | entry point: the `USAGE` message reworded and split over two lines | **GREEN** 29/29 |
| `R9` | resolver **prose** changed to `"…white\|black\|random; -h is not a thing"` | **RED** — `A6(i) — the enumeration is the ONLY argv literal` |

**The near-miss family redded ZERO of the nine.** Not one. It is derived from the test's own
transcription of `## Scope`'s table and never touches the resolver's text, so no legal change to `src/`
can red it — and that is now measured, not reasoned.

**`R9` is real but it is not `B1`'s and it is not a false RED by the criterion's letter.** The clause
says the enumeration is *"the only argv literal in the delivered resolver"*; a user-facing message that
names `-h` writes an argv literal for a flag the allowlist does not contain. The row predates `B1` and
`B1` did not touch its semantics — `S3` only widened it to cover backtick literals, which adds **no new
literal to check** (13 scanned before, 13 after; I re-measured). Recorded as `Q11` below.

## Flake — the other way an instrument reds a correct build

`A6`(ii) draws 1000 random tokens and `--colour random` spawns a child with a coin flip in it. A random
corpus is exactly the shape that reds once a month and trains a team to re-run.

- **25 consecutive runs of `src/cli.test.ts`: 25 pass, 0 fail.**
- **The draw budget, measured rather than reasoned.** I re-implemented `A6`(ii)'s generator and the
  delivered whole-form filter independently and built the corpus **800 times** (200 replications × 4
  shapes). **Worst-case draws for 250 kept items: 250. Every time, every shape.** The correct filter has
  never once rejected a draw. `DRAW_BUDGET = 500` is therefore 2× headroom against a process that in
  800 trials consumed zero of it — **it cannot flake.**

## `Q4` reproduced in BOTH directions, at my own hand

`Q4` was that `A6`(ii)'s named control could not fail: under rejection sampling `expect(drawn).toHaveLength(250)`
is a tautology, and the over-dropping filter it is meant to catch **hangs** instead of reding.

| run | instrument | result |
|---|---|---|
| `MQ4c` | **old** (`59ea767`, unbounded loop), filter **untouched** — the control | **GREEN 29/29**, 1.30 s |
| `MQ4b` | **old**, filter switched to the forbidden **CONTAINS** reading | **DID NOT TERMINATE.** Killed at my 60 s ceiling, no summary emitted |
| `MQ4a` | **tip** (draw budget), same CONTAINS filter | **RED in 1.27 s**, redding `A6(ii)` |

The control matters: it proves the hang is the mutant and not the old instrument being broken. **`Q4` is
closed as an instrument.** A hang that a CI timeout eventually kills is not a red — it is an outage with
no diagnosis — and it is now a named assertion.

## The two pinned counts — I derived them myself before reading either number

I wrote my own derivation of BA/PM's clause, from my own transcription of `## Scope`'s table on **this
branch's** ticket text, without reading the test's `nearMisses`:

```
spelling      n  cases distinct       3*(sum n) + 3*6 = 3*40 + 18 = 138
--ascii       7    24     22
--unicode     9    30     29
--colour      8    27     26
white         5    18     18
black         5    18     18
random        6    21     21
TOTAL             138    134
duplicates: ["-ascii","--asci","-unicode","-colour"]
delivered resolver ACCEPTS 0 of 138
family members colliding with ACCEPTED_ARGUMENTS: 0
old 18-case set contained in the new family: 18 of 18  (strict superset)
```

**138 and 134 both reproduce exactly, the four duplicates are the four named, and the delivered resolver
accepts none of them.** The claim I was told to verify rather than accept is true.

## Verdict on the pins: **TRIPWIRE, not a maintenance trap** — and I measured the maintenance

Three grounds, each a measurement rather than an opinion:

1. **Neither number is coupled to production.** Both are properties of the test's own derivation from
   its own table transcription. **Nine legal changes to `src/`, zero reds** — so no correct build can
   ever be redded by them.
2. **They can only red on an event that is already loud.** I ran the two realistic evolutions:
   - **`T1` — BA/PM legitimately adds a fourth colour value word `grey`**, production and the test's
     transcription updated together. **Exactly ONE row reds**, with
     `expected [ … ] to have a length of 138 but got 153`. The equality row correctly stays green. The
     comment directly above the pin carries the arithmetic (`3n+3` per spelling, with `n` listed), so
     153 is derivable in one line without re-deriving anything.
   - **`T2` — a US-spelling alias `--color` is admitted**, which is a *deletion near-miss of `--colour`*
     and therefore a genuine contradiction between the table and the family. The family's own
     false-RED guard fires and **names the token**: `expected [ '--color' ] to deeply equal []`. That is
     the designed behaviour — the contradiction surfaces as a specific, human-readable red that forces a
     decision, instead of silently asserting that an accepted spelling is rejected.
3. **The maintenance cost is one number, and the second pin is what makes it one.** `134` is what a
   uniqueness assertion may legitimately say; `138` is the case count. An engineer reaching for the
   obvious `expect(new Set(derived).size).toBe(138)` **reds a correct build**. Writing both numbers with
   the four duplicate strings named beside them makes that mistake impossible to make quietly, for one
   line and one `Set`.

**So: keep both.** `138` is the tripwire that measures the row's reach. `134` has almost no independent
detection value and is not pretending to — it is a trap sign nailed to the trap, and it costs a line.
The pins are the cheapest half of this instrument and the one I would defend hardest.

## `BAR 1b` — measured at my own hand, both readings (`S1` / `Q5`)

| reading of `src/cli.test.ts` | `/\bexec\s*\(/` | `/\bexecSync\s*\(/` | `shell:` | `process.execPath` | `spawnSync(` |
|---|---|---|---|---|---|
| **raw source** (the bar verbatim) | **1** | **1** | **1** | 2 | 1 |
| **comment-stripped** | **0** | **0** | **0** | 1 | 1 |

All three raw hits are in the file's **own docblock**, which quotes the forbidden spellings in order to
say it does not use them. The `spawnSync` argument text is `command, [...args],` — an **array literal**,
no string concatenation. **The bar's property is MET; the bar's stated mechanism false-REDs the correct
file.** That is `Q5`, unchanged, and I confirm the `B1` hop did not make it worse: the raw counts are
identical at base `59ea767` and at the tip.
