---
id: 20261010T091104Z-qe-e2e-observation-abc051-gap-register-e9262a1c
kind: observation
by: qe-e2e
at: 2026-10-10T09:11:04Z
verified_by:
confidence: high
refs:
  - ABC-051
  - ABC-120
  - ABC-021
  - NFR-002
  - QE-051-a
  - QE-051-b
  - QE-051-c
  - QE-051-d
  - QE-051-e
  - src/turn-loop.nfr.test.ts
  - src/turn-loop.test.ts
  - src/turn-loop.ts
  - src/line-input.ts
  - src/command-input.ts
  - src/command-input.test.ts
  - src/result-screen.ts
  - src/cli.ts
  - src/cli.test.ts
  - src/engine.ts
  - src/move-input.ts
  - 20261010T091104Z-qe-e2e-observation-abc051-mutant-matrix-and-measurements-8ea81c8c
supersedes:
---

# `ABC-051` QE gap register: one overreaching sentence, two surviving replay shapes, stale cites, and a waiver the rule does not grant

Hand-authored, no seal. Each mutant cited below is in the matrix note (`…8ea81c8c`).

## QE-051-a. MEDIUM, in this ticket's own file. The new header sentence claims more than its spies can see

`src/turn-loop.nfr.test.ts:24-25` (tip) says: *"`repetitionCounts` and `keyHistory` at 0 prove the
loop adds no replay of its own to a PLY."*

`M8` puts `takeBack(history, 0)` before every advancing derive. That is an `O(plies)` replay from
`initialFen` on every ply, and `src/turn-loop.ts:423` itself calls it *"rebuilt by replay"*. `M8`
leaves `gameStatus` at `plies + 1`, `repetitionCounts` at 0 and `keyHistory` at 0. It is **green in
this file and in all 1,540 tests** (and green on base). The two spies prove that no replay goes
**through those two exports**. They do not prove "no replay of its own".

There are two readings, and they are stated rather than chosen silently:

- **Strict.** `A3`'s headline is "every statement in the two files about these counts is true".
  Under that reading this sentence is not true, and it is the same defect class (a conclusion
  larger than the instrument) as the "derives nothing on its own" the ticket removed.
- **Scoped.** `A3`'s `then` enumerates four checks: the grep, the three-part docblock, the test name,
  and the honest-limit sentence with its cite. All four are MET. In this file, "replay" means a
  derive of the Zobrist key list, and `NFR-002`'s bar is *"derive once per ply"*.

QE grades the ticket on the scoped reading, as **PASS_WITH_GAPS**, and recommends **fixing this before
merge**. It is one comment line inside the ticket's own two-file fence. For example: *"…`keyHistory`
at 0 prove the loop adds no key-list replay of its own to a ply. A replay through another route
(`takeBack`, `resetTo`) is outside what a module-boundary spy on these two exports can see."*
Whether that is a re-hop or a fix-forward is the Orchestrator's call. The price of `M8` was not
measured: `UNKNOWN - verify`.

## QE-051-b. LOW, pre-existing, outside the fence. `keyHistory` on the take-back edge is guarded nowhere

`M9` adds `keyHistory(history)` on transition 18, once per take-back. All 1,540 tests stay **green**.
Merged `A8`'s title says `keyHistory` *"fires on the REFUSED claim and nowhere else"*, but the
take-back rows (`ABC-120`) count derives through `gameStatus` only. This is per command, not per ply,
so it is not `NFR-002`'s per-ply bar and not this ticket's. Route it to BA/PM as a candidate one-line
`keyHistory`-at-0 in the existing take-back rows of `src/turn-loop.test.ts`.

## QE-051-c. LOW, pre-existing, outside the fence. Stale `turn-loop.ts:<line>` cites in other files (the Engineer's flag, assessed)

**The Engineer's five are confirmed, and every one was already wrong at base `7812018`.** This
ticket made no correct cite wrong. Its +6 lines shift only lines after `:271`.

| cite | points at today | the thing it means is at |
|---|---|---|
| `src/line-input.ts:21` → `:291-309` | docblock and render lines | `A9b` repair `:329-343` (base `:323-337`) |
| `src/command-input.ts:58` → `:319-341` | exit test and `A9b` | claim branch `:360-382` |
| `src/result-screen.ts:12` → `:312` | a comment | `INPUT_ENDED_NOTICE` `:189` (write `:348`) |
| `src/cli.ts:30` → `:293-309` | docblock and loop head | `A9b` `:329-343` |
| `src/cli.ts:181` → `:312` | a comment | `:189` / `:348` |

**The pattern is wider than five.** Of the 14 `turn-loop.ts:<n>` cites in other `src/` files, QE
found **13 stale on the tip**. Only `src/line-input.ts:5` → `:135` (`PromptOutcome`) is right. The
other eight, before `:271` and untouched by this ticket, are `line-input.ts:49` (`:176`),
`command-input.ts:59` (`:234`, `claimShortfall` is `:255`), `command-input.test.ts:412` (`:246`) and
`:540` (`:269`), `engine.ts:507` (`:138`, `EngineSeam` is `:150`), `move-input.ts:7` (`:125`),
and `cli.test.ts:588` (`:191`) and `:744` (`:191-200`). Recommendation for BA/PM: one ticket to cite
by symbol (`runTurnLoop`'s `A9b` arm, `INPUT_ENDED_NOTICE`), not by line. `ABC-036` fences
`command-input.ts`, so sequence it after that ticket.

## QE-051-d. For the Orchestrator. The UAT waiver, measured as `AGENTS.md` writes it, does NOT apply

The Engineer's claim (`…05908d8f`) says the zero-production-lines waiver "should apply". The rule's
own measure is `git diff --name-only <d>~1 <d> | grep -v '\.test\.ts$' | grep '^src/'`. Over
`7812018..85f260f` it prints **`src/turn-loop.ts`**, so it is not empty. The rule is file-based. `A4`
proves the file has **zero non-comment lines**, but the rule as written does not count comment lines
apart from code. QE does not decide the reading. Taking it literally means UAT is owed. Treating a
comment-only file as "zero production lines" is the owner's word to give, not an inference to make.
Measure it again on the delivered merge commit.

## QE-051-e. INFO. `A4`'s "exactly two files" holds for `src/`, not for the branch

`git diff --numstat 7812018 85f260f` lists 7 files. The other 5 are the Engineer's 3 notes, the
ticket page's `## Delivery` and 1 trace row. Over `-- src/` it lists exactly the two named files. QE
reads `A4` as the `src/` fence and records this so nobody quotes 7 as a breach.

## No new test rows from QE

Closing QE-051-a, -b or -c means changing a comment or a test outside what `A4` measures. `A4` fixes
the suite total and the ticket's file set, so a QE row would move the very numbers under review.
None was added.
