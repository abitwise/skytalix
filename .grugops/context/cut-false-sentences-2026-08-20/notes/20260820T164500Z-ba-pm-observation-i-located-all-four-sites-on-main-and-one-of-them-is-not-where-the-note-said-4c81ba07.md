---
id: 20260820T164500Z-ba-pm-observation-i-located-all-four-sites-on-main-and-one-of-them-is-not-where-the-note-said-4c81ba07
kind: observation
by: ba-pm
role: ba-pm
task: cut-false-sentences-2026-08-20
at: 2026-08-20T16:45:00Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
  - ABC-044
  - EPIC-006
  - src/cli.test.ts
  - src/result-screen.test.ts
  - plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md
  - agent-factory/workflows/16-context-read-write.md
supersedes:
---

# The site inventory, grepped on `main` @ `b03658f` — and **one site is not in a test file at all**

## Why this is a hand-authored `observation` and not a stamped `finding`

`context.human_admission` is `off` on this install; Workflow 16 admits a `finding` only against a live
green `§14-gate#<id>` verdict, and there is no stamp issuer here. So: **no `finding`, no stamp, no
`§14-gate` verdict.** Everything below is a grep I ran myself on the working tree at `b03658f`.

## The four comment sites — all four PRESENT, located by content

| | file and line at `b03658f` | matched string |
|---|---|---|
| S1 | `src/cli.test.ts:2057` | `with both of those rows still green` |
| S2 | `src/cli.test.ts:2053-2059` | the same comment block; names `D3` and `M9`, **no remainder sentence** |
| S3 | `src/result-screen.test.ts:182` | `ALONE is unconstructible while those word rows stand` |
| S4 | `src/cli.test.ts:2124` | `NEVER PLAYS THE MOVE` (clause spans ≈2119–2127) |

## **SITE 2 IS NOT IN `src/cli.test.ts`. The `closes D3` claim is on the `ABC-113` PAGE**

The brief said the grep for a *"closes `D3`"* string in `src/cli.test.ts` came back empty and asked me to
locate it by content or say it does not exist. **It does not exist in a test file.** The sentence is:

```
plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md:64
  false too. `A1` below closes `D3` while keeping the once-only pin, so after this ticket the
  instrument is stronger than **both** — which is the first time an ordering can honestly be asserted.
```

`grep -n "closes" src/*.test.ts` returns fifteen hits and **not one of them is about `D3`** — they are
`evaluate.test.ts:172`, `history.test.ts:223`, `history-pane.test.ts:426/646/1007`,
`moves.castling.hardening.test.ts:120/1107/1432`, `legal.test.ts:287/292`, `move-input.test.ts:309/347`,
`san.parse.test.ts:440`, and `cli.test.ts:1568/2276` (a never-closes branch and a diff half). The QE note
itself is precise about this — it says *"the **page's** sentence"* — and the summary that reached me had
promoted it to a test-file site.

**The nearest thing in a test file is NOT false.** `src/cli.test.ts:2065-2068` says the `ABC-043` `A1`
repair triple *"is blind to `D3`"* and that the count row *"is what makes the current instrument stronger
than both"*. Over the named mutants (`M10`, `D3`, `M9`) that is TRUE and `D4` does not falsify it — `D4`
is a different spelling of the class, not a counterexample to the ordering. **So I did not invent a
fourth false test-file sentence to fill the slot.** What the test file is guilty of is **silence**: the
comment names `D3` the mutant and never says which spellings of the class the count row cannot see. That
is `ABC-114` `A2`, written as *name the remainder*, not as *correct a falsehood*.

## A FIFTH AND A SIXTH SITE, both on the same BA/PM page

- `plans/tickets/ABC-113-…md:64` — the *"closes `D3`"* sentence above.
- `plans/tickets/ABC-113-…md:106` — the `unconstructible` sentence, word-for-word the same claim as S3.

`grep -rn "unconstructible"` outside `.grugops/context/` returns exactly four hits: those two, plus
`src/result-screen.test.ts:182` and a restatement inside `plans/board.md`'s `ABC-113` `_Updated:` header.
**The board header is a QE-authored `_Updated:` line that ALREADY names the sentence as falsified in the
same paragraph, so it is self-correcting and I did not cut it as a site.**

## Lane baseline, measured at this cut rather than quoted

`npx vitest run --dir src` on `main` @ `b03658f`: **40 test files passed, 1207 tests passed, 0 skipped**,
duration 2.67 s. This is `ABC-114` `A6`'s recorded base — and `A6` still orders it **re-measured at pull
time**, because the lane moved twice this week (`ABC-050`, `ABC-113`).

## What I did NOT do

- **I edited nothing under `src/`.** Not one comment. This hop cuts a ticket.
- **I re-planted no build.** `M9`, `D4`, `M15` and the FIFO harness are `ABC-114`'s repair-hop work, and
  re-measuring them at a refinement hop would be BA/PM authoring the answer the ticket exists to have
  measured by someone else.
- **I did not correct the two `ABC-113` page sentences** — ruled, with reasons, in the `decision` note
  alongside this one.
