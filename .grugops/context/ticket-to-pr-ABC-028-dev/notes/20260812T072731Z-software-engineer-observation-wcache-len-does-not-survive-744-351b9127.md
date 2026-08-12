---
id: 20260812T072731Z-software-engineer-observation-wcache-len-does-not-survive-744-351b9127
kind: observation
by: software-engineer
at: 2026-08-12T07:27:31Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - RISK-ABC017-01
  - ABC-017
  - ABC-017-A11
  - ABC-017-A14
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# THE CONTRADICTION IS SETTLED, AND THE FALSE SENTENCE IS *"survives 744/744"*

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or in the kit root
> (no `scripts/` directory at all — re-checked at source this hop), and `mcp__grugops__propose_note`
> is not in this session's tools. `context.human_admission` is `off` and **no §14 gate verdict record
> exists under this task**, so **nothing on this hop is a `finding`.** `confidence: high` refers to
> the measurements, every one of which was RUN, not to any admission status.

**Machine, once, for every figure on this hop:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node
`v24.12.0`, vitest `3.2.7`, biome `2.5.5`, typescript `5.9.3`. `UNKNOWN - verify` on any other.

## The question the brief posed

The ticket header says `WCACHE-LEN` *"passes `A14` exactly and survives 744/744"* **and** that its
only catcher is the incidental fixture sharing in `src/history-pane.nfr.test.ts` — a file the full
suite runs. BA/PM flagged that both cannot be true and correctly did not measure it.

**I measured it. The `survives 744/744` half is FALSE.**

## What was run

`WCACHE-LEN` re-specified from the ticket's own definition (*"a pane memoising rows per
`GameHistory`, invalidated when `moves.length` changes"*), `tsc --noEmit` 0, rendered output verified
byte-identical to the delivered pane at all ten of `A1`'s lengths **first**, then run against the
**UNMODIFIED** delivered suite out of tree:

```
tree                                                   WCACHE-LEN        WCACHE (naive)
delivered suite, 26 files, A1 ABSENT                   2 failed / 744    3 failed / 744
  the killers, both of them:  src/history-pane.nfr.test.ts > A11 > "calls toSan exactly once per
                              RENDERED ply"   -> toSan at 40: expected 16 times, got 0 times
                              src/history-pane.nfr.test.ts > A11 > "hands toSan no legal move list"
                              -> expected "toSan" to be called at least once
nfr fixtures REBUILT PER TEST, A1 absent               744 passed        1 failed / 744  (A14)
src/history-pane.test.ts ALONE, A1 absent              18 passed         1 failed / 18   (A14)
```

## Both halves of the ticket's claim, ruled separately

1. **`"survives 744/744"` — FALSE.** It fails **2 of 744**. Owner of the correction: BA/PM. **I did
   not edit either sentence**, per the brief.
2. **`"its only catcher is the incidental fixture sharing in src/history-pane.nfr.test.ts"` — TRUE,
   and now proved BY CONSTRUCTION rather than by argument.** Rebuild those fixtures per test and the
   build goes from `2 failed` to **`744 passed`**. That is the sharing, isolated as a variable.
3. **`"passes A14 exactly"` — TRUE.** `A14` is green on `WCACHE-LEN` in every configuration above.
4. **`A2`'s own numbers — `"survives 18/18"` for `WCACHE-LEN` and `"WCACHE fails 1 of 18"` — CONFIRMED
   EXACTLY.**

## THE MECHANISM, which nobody had located, and it is not what the comment says

The catcher is **`A11`'s `toSan` CALL COUNT**, not a row comparison. `A11`'s tests render the
module-scope `AT_*` singletons repeatedly: by the time the fourth `it` asserts *"`toSan` called once
per rendered ply"*, `AT_40` has already been rendered by three earlier tests in the same file, so a
cache **HIT** calls `toSan` **zero** times and the count assertion fails.

**This matters because it explains why `A14` never caught this build and the trap comment thought it
had.** `A14` compares ROWS across an append — a length-keyed cache invalidates exactly on cue there.
The sharing kills `WCACHE-LEN` through an entirely different instrument, in a different file, by
accident. **A tidy-up to per-test fixtures would have silently removed the only guard in the
project** — exactly the hazard `RISK-ABC017-01` names, now with its mechanism named too.

## Consequence for `A2`, measured with `A1` landed

```
tree                                                   WCACHE-LEN        WCACHE (naive)
src/history-pane.test.ts ALONE, WITH A1                1 failed / 24     2 failed / 24
nfr fixtures REBUILT PER TEST, WITH A1                 1 failed / 750    2 failed / 750
  and the kills are: src/history-pane.test.ts > ABC-028 acceptance > A1   (and A14 for WCACHE)
  NOT ONE kill is in src/history-pane.nfr.test.ts
```

**`A2`'s `Then` — *"both still die, and the surviving kills are in `src/history-pane.test.ts`, not in
`src/history-pane.nfr.test.ts`"* — holds exactly, in both of `A2`'s forms.** The merged sentence
becomes TRUE the moment `A1` lands, which is the mechanism the ticket chose over correcting it.
