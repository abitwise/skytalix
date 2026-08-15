---
id: 20260815T164700Z-software-engineer-decision-s2-and-s3-taken-s1-routed-8f52ba13
kind: decision
by: software-engineer
at: 2026-08-15T16:47:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - S1
  - S2
  - S3
  - Q5
  - BAR-1b
  - ASVS-V1.2.5
  - ASVS-V2.2.1
  - src/cli.test.ts
supersedes: 
---

# `S2` and `S3` taken and watched red; **`S1` ROUTED, because it cannot be built without writing a clause that is BA/PM's**

The subtask's condition was explicit: take them only if they need no criterion change, and **`S1` in
particular may — if it does, stop and route it.** It does. Here is the measurement I stopped on rather
than the argument.

## `S1` — ROUTED. The bar as worded is a guaranteed false RED, and the repair is `Q5`, which is open

`BAR 1b` says the property is *"asserted textually over the delivered diff"* and supplies
`/\bexec\s*\(/` and `/\bexecSync\s*\(/`. **I applied them literally to the correct delivered file, at
both ends of my branch:**

| `src/cli.test.ts` | `/\bexec\s*\(/` | `/\bexecSync\s*\(/` | `shell:` | verdict |
|---|---|---|---|---|
| base `59ea767`, **raw text (the bar verbatim)** | **1** | **1** | **1** | **FALSE RED on a correct file** |
| base `59ea767`, comment-stripped | 0 | 0 | 0 | property MET |
| **my tip**, raw text | **1** | **1** | **1** | unchanged by me |
| **my tip**, comment-stripped | 0 | 0 | 0 | property MET, `process.execPath` present exactly once |

All three raw-text hits are in the file's **own docblock**, which quotes the forbidden spellings in order
to say the file does not use them. **This is `Q5` exactly, and `Q5` is open, LOW, and assigned to BA/PM:
"one clause — apply the regexes to comment-stripped text".**

**Why that makes the row un-writable by me today.** The only instrument that does not red a correct build
is one over **comment-stripped** text — and choosing "comment-stripped" *is* the clause `Q5` says BA/PM
must write. If I write the row, I have resolved an open criterion question by implementation, and a
reviewer comparing my row to the bar cannot tell whether the row implements the bar or quietly re-words
it. **That ambiguity is the whole reason `Q5` exists.** This ticket has deleted two criteria rather than
let an implementer re-word one; I am not going to re-word one by writing its instrument.

**The row is ~8 lines and I can land it the moment the clause exists** — assert over
`executableCodeOf("cli.test.ts")`: zero matches of `/\bexec\s*\(/` and `/\bexecSync\s*\(/`, zero
`shell:`, and every `spawnSync` argv argument an array literal. Nothing needs rediscovering; the numbers
above are the ones the row will assert.

**One thing I checked so the routing is not a shrug: I did not make `Q5` worse.** The raw-text counts are
**identical at base and at my tip** — my added comments introduce no new `exec(`, `execSync(` or
`shell:` substring. And the bar's *property* is MET today, measured twice (Security/NFR's gate and mine).

## `S3` — TAKEN. One alternation, and `M2` now dies

`A6`(i)'s only-argv-literal scan covered `"…"` and `'…'`. Added `` `(?:[^`\\]|\\.)*` ``, exactly as
Security/NFR prescribed.

**No criterion change:** the criterion says the enumeration is *"the only argv literal in the delivered
resolver"*. A template literal is an argv literal. The scan was **narrower than the clause**, and this
makes it match the clause. Nothing on the page moved.

- **Watched red:** `M2` — `--engine-path` recognised through a backtick literal — **SURVIVED 29/29 on the
  old instrument, KILLED at my tip** by the only-argv-literal row.
- **Cannot false-RED today:** the current resolver's executable code contains **zero** backticks, so the
  alternation matches **13 literals before and 13 after** — it adds no new literal to check.

## `S2` — TAKEN. The token is located instead of assumed to be on line 0

Bar 3 read `child.union.split("\n")[0]` and called that *"a superset of the echoed token"* — true only
while the echo happens to land on line 0. It now splits the union on **whitespace** and asserts over
**every word containing the echoed token**, wherever the message puts it. `ESC` is not whitespace, so an
unstripped one stays attached to the word it precedes and lands inside what is asserted.

**No criterion change, and this is the direction that matters: the bar's clause (ii) says *"the **echoed
token's** bytes"*. The delivered instrument asserted over a LINE. My row asserts over the token — it moves
the instrument TOWARD the criterion's literal wording, not away from it.** The bar's stated order is
preserved: (i) non-vacuity first, (ii) the token's bytes, (iii) zero frame rows.

- **Watched red:** `M3` — sanitiser dropped **and** the token moved off line 0 — **SURVIVED 29/29 on the
  old instrument, KILLED at my tip**.
- **Nothing lost:** `M3b` — sanitiser dropped, layout unchanged — **KILLED both before and after**.
- **No new spawn:** it reads bar 3's existing child. The count stays at ten.

## What I did not touch on this line

**`AR-1` (C1/CSI outside bar 2's class)** is an accepted risk with BA/PM as owner and a standing L2
ruling behind it. My located-token assertion checks the same class the bar names — C0, `U+007F`, `\x1b` —
and **deliberately does not widen to C1**: doing so would re-open a ruled risk from inside an instrument
repair, which is precisely the move `S1` is being routed to avoid.
