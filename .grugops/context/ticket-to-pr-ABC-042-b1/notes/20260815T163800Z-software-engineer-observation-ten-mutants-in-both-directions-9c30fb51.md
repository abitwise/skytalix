---
id: 20260815T163800Z-software-engineer-observation-ten-mutants-in-both-directions-9c30fb51
kind: observation
by: software-engineer
at: 2026-08-15T16:38:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B1
  - E1
  - E4
  - Q4
  - S2
  - S3
  - A6
  - src/cli.test.ts
  - src/cli-options.ts
  - src/cli.ts
supersedes: 
---

# Ten mutants, each run in BOTH directions — and the false-RED control run first

**The delivered build going green matters as much as the mutants going red, so the control came first.**
A criterion that reds a correct build is worse than the gap `B1` closes, and this ticket has already
shipped one such clause (`BAR 1b`) and caught it before it bit.

## Direction one — the CORRECT build. No false RED, measured three ways

| control | result |
|---|---|
| the delivered resolver against the 138-case family, called directly (before I wrote the row) | **accepts 0 of 138** |
| members of the family colliding with `ACCEPTED_ARGUMENTS` | **0** — the existing non-vacuity guard still holds and is now more load-bearing |
| the old 18 contained in the new 138 | **18 of 18** — strict superset, so nothing QE and the fix hop armed is traded away |
| `npx vitest run src/cli.test.ts` at my tip | **29/29 green** (29 before, 29 after — no row added) |
| `npm test` at my tip | **856/856 on 30 files green** |
| the backtick alternation (`S3`) against the current resolver | 13 literals scanned before, **13 after** — it adds no new literal to check, so it cannot false-RED today |

## Direction two — the mutants. Every one rebuilt at my hand and watched

Kill determination against `src/cli.test.ts`, each mutant run against **both** instrument versions —
base `59ea767` (the old 18, the unbounded loop, the line-0 proxy) and my tip. The "old" column is the
control that proves **my row** is what changed the verdict.

| # | mutant | old instrument | my tip | which row redded |
|---|---|---|---|---|
| `MX5` | `token.endsWith(COLOUR)` — BA/PM's `E1` survivor | **SURVIVED** | **KILLED** | `A6`(i) near-miss family |
| `MX4` | `token.trim() === COLOUR` — BA/PM's `E1` survivor | **SURVIVED** | **KILLED** | `A6`(i) near-miss family |
| `MX1` | `token.startsWith(COLOUR)` — QE's `M7` | KILLED | KILLED | `A6`(i) near-miss family |
| `MX2` | `token.toLowerCase() === COLOUR` — QE's `M19` | KILLED | KILLED | `A6`(i) near-miss family |
| **`MX15`** | **`token.trim() === ASCII`** — the same front weakening on a **FLAG** | **SURVIVED** | **KILLED** | `A6`(i) near-miss family |
| **`MX16`** | **`token.endsWith(UNICODE)`** — prefix insertion on a **FLAG** | **SURVIVED** | **KILLED** | `A6`(i) near-miss family |
| **`MX17`** | **`candidate === next?.trim()`** — the weakening on a **VALUE WORD** | **SURVIVED** | **KILLED** | `A6`(i) near-miss family |
| `M17` | `A6`(ii)'s filter switched to the forbidden CONTAINS reading | **DID NOT TERMINATE in 30 s** | **KILLED in 1.6 s** | `A6`(ii) draw budget |
| `M2` | a fifth flag through a **backtick** literal — Security/NFR's `S3` | **SURVIVED** | **KILLED** | `A6`(i) only-argv-literal |
| `M3` | byte filter dropped **and** the token moved off line 0 — `S2` | **SURVIVED** | **KILLED** | bar 3 |
| `M3b` | byte filter dropped, layout unchanged — the **regression control** | KILLED | KILLED | bar 3 |

**`E1`'s two survivors die; `Q1`'s two stay dead; `M3b` stays dead.** The three extra weakenings I added
(`MX15`–`MX17`) are the same defect class aimed at the **flags** and at the **value words** rather than at
`--colour`, and all three shipped green against the old row — evidence that the hole was a half of the
string, not a `--colour` accident.

**`M17`'s exact failure text, because "reds instead of hangs" is the whole of `Q4`:**

```
AssertionError: draws for shape --colour <word>: expected 500 to be less than 500
```

The old row, same mutant, ran to my 30 s ceiling and was killed by it (exit 143, no summary emitted) —
QE's 180 s hang, reproduced at a tenth of the cost.

## The harness — and the guard `E4` cost me last hop

My previous hop published a **false SURVIVED** because it reverted mutants with `git checkout -- src/`,
which also reverted the *uncommitted instrument*. Every run after the first measured the un-strengthened
file. I guarded the mutation side and not the instrument side. This hop:

1. **The instrument was committed FIRST** (`56c5cea`), before a single mutant was applied.
2. **Two guards, not one.** Every mutant is an anchored replacement that **aborts unless its anchor
   occurs exactly once**, and the mutation is proved on disk (`git diff --name-only`) before the run —
   that is the mutation side. **The instrument side** is proved **before AND after every application**:
   the row's own markers must be present *and* the file's md5 must equal the expected variant's.
3. **Restore is a byte copy from a pristine in-memory capture, never `git checkout -- src/`.** After
   every mutant: md5 compared to the pristine value, and `git status --porcelain src/` asserted empty.
4. **`timeout 180 s` per run** (30 s for the deliberate hang probe), and the harness lives in the session
   scratchpad, **outside the repository**.

**Final state after 22 mutant runs: `git status --porcelain src/` empty, and all three production hashes
byte-identical to the pre-work capture.**

## What this census does NOT cover — said before anyone finds it

**A weakening that accepts only tokens at edit distance ≥ 2 from every accepted spelling still survives**
(BA/PM's `token.replace("xx","") === COLOUR` shape). No finite instrument closes that, and the family's
value is that its completeness now has a **stated dimension** — every position, one edit — instead of a
list of three transformations. **Four censuses have now run over this surface and each found what the
last one missed; assume a fifth does too.**
