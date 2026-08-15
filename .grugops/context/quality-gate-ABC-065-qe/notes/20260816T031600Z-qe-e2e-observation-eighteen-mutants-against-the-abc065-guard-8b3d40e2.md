---
id: 20260816T031600Z-qe-e2e-observation-eighteen-mutants-against-the-abc065-guard-8b3d40e2
kind: observation
by: qe-e2e
at: 2026-08-16T03:16:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - AGENTS.md
  - src/cli.test.ts
  - src/cli-options.ts
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
supersedes: 
---

# Breaking the `ABC-065` guard: eighteen mutants, four green, two false red

The guard hop built four mutants (`V`, `A4`-1, `A4`-2, `C`) and all four red. **This note is the
mutants it did NOT build** — the four the subtask named by name, plus ten more. Every one is
recorded, including the four that came back **GREEN** and the two that redded on **correct**
documentation.

## Method, so nothing rests on trust

`AGENTS.md` (and, for three mutants, `src/cli-options.ts`) mutated by a script outside the
repository; `npx vitest run src/cli.test.ts`; then `git checkout -- AGENTS.md src/` **unconditionally**
— the revert is in the harness, not in the mutation script, so a crash in the mutator could not leave
a half-reverted tree. `git status --porcelain` was printed after **every** revert and was empty every
time. Byte-identity is proved by blob hash in the verdict note.

## The table — 18 mutants

| # | mutant | result | which assertion decided it |
|---|---|---|---|
| `V` | the separator STRIPPED — the file exactly as `ABC-065` found it *(the guard hop's, replicated)* | **RED** 1/32 | `expect(slot).toContain(SEPARATOR_FORM)` — **the vacuity precondition** |
| **`N1`** | **separator PRESENT, the option list EMPTIED** | **RED** 1/32 | `A3` **count floor**: `documented options ["--colour","--ascii"]: expected 2 to be >= 3` |
| **`N2`** | **the `Dev / run` slot DELETED ENTIRELY** | **RED** 3/32 | `devRunSlot` **throws** `AGENTS.md has no \`- Dev / run:\` slot with a comment` — **both** `ABC-065` rows fail, **and `ABC-042`'s own `A1` row fails too** |
| **`N3a`** | **a SECOND, broken `Dev / run` slot AFTER the good one** | **GREEN 32/32** | **none — GAP `Q7`** |
| **`N3b`** | the same duplicate placed **BEFORE** the good one | **RED** 2/32 | `A1`'s `toContain` and `A3`'s floor (`documented options []: expected 0 to be >= 3`) |
| **`N4`** | **the slot's HTML comment UNTERMINATED** | **GREEN 32/32** | **none — GAP `Q8`, and the more serious of the two** |
| `N5` | `--Difficulty` documented — a mixed-case option that does not exist | **RED** 1/32 | `A3` set equality: `['--Difficulty','--ascii',…] ≠ ['--ascii','--colour','--unicode']` |
| `N6` | **the bare `--` documented as though it were an option of this program** | **GREEN 32/32** | **none — and this is the CORRECT result.** See the `--` ruling note |
| **`N7`** | **`--depth` added to `ACCEPTED_ARGUMENTS`, documented nowhere — `A4`'s SECOND direction, from the code side** | **RED** 7/32 | `A3` **count floor**: `documented options ["--colour","--ascii","--unicode"]: expected 3 to be >= 4` |
| `N7b` | an argument **literally named `--`** added to `ACCEPTED_ARGUMENTS` | **RED** 7/32 | `A3` floor **and** `ABC-042`'s merged `A6(i)` row. See the ruling note — this is a **non-case** |
| `N8` | the example advertises a token the program rejects: `npm run chess -- --difficulty 3` | **RED** 2/32 | `A1` token containment (`documented token --difficulty`) **and** `A3` equality |
| `N9` | separator present, **advertising nothing after it** | **RED** 1/32 | `A1` **count floor**: `the invocation after the separator: []: expected 0 to be >= 1` |
| `N10` | the value word `random` deleted from the slot | **RED** 1/32 | `A3`'s last clause: `documented value random` |
| `N11` | the option list moved **OUTSIDE** the comment, after it closes | **RED** 1/32 | `A3` floor — the mechanical slot definition holds its boundary |
| `N12` | **double space** after the separator | **GREEN 32/32** | **none — cosmetic and correctly accepted.** The `ABC-066` `Q4` case, one file over |
| `N13` | the slot **RENAMED** `- Dev/run:` | **RED** 3/32 | `devRunSlot` throws; `ABC-042`'s `A1` row also fails |
| **`N14`** | **`--depth` accepted AND `--bogus` documented — the COUNT HELD at 4 v 4** | **RED** 7/32 | **the set equality ALONE**: `['--ascii','--bogus',…] ≠ ['--ascii','--colour',…]` |
| `N15` | the example written **without the markdown code fence** — still correct documentation | **RED** 1/32 | `A1`: `documented token —` — **a FALSE red.** `Q9` |
| `N16` | honest prose naming an unsupported option: *"There is no `--help`."* | **RED** 1/32 | `A3` equality — **a FALSE red.** `Q9` |

**14 of 18 red. 4 green, of which 2 (`N6`, `N12`) are green for the right reason and 2 (`N3a`, `N4`)
are gaps. 2 of the 14 reds (`N15`, `N16`) fire on correct documentation.**

## The four the subtask asked for by name, each answered

1. **Separator present, option list empty (`N1`) → RED**, on the count floor, *before* the equality is
   reached. The floor is not decoration; without it an empty documented set passes a one-way
   containment.
2. **Slot deleted entirely (`N2`) → RED.** It reds by **throwing**, not by asserting — the subtask
   warned that *"a guard that throws where it should red"* is the same defect in a coat. **It is not,
   here**, and the distinction is worth stating precisely: vitest scores an uncaught throw inside an
   `it` as a **test failure**, so the terminal signal is identical (`Test Files 1 failed`, exit 1) and
   the message names the cause in one line. What *would* be the defect is a throw that escapes the
   `it` — e.g. at module scope, where it becomes a collection error that some reporters render as a
   crash rather than a failure. This throw is inside the `it` body, via a helper called from it.
   **RULED: acceptable, not a gap.** It also drags `ABC-042`'s merged `A1` row red with it, which is
   a second independent alarm on the same event.
3. **Two `Dev / run` slots → SPLIT.** A broken duplicate **before** the good one reds (`N3b`); a
   broken duplicate **after** it ships **GREEN** (`N3a`). The guard reads `indexOf`'s **first** match
   and never checks that the slot is unique. `Q7`.
4. **Unterminated HTML comment → GREEN, and it is worse than green.** `Q8`, below.

## `N4` in full, because the block's own comment claims the opposite

`devRunSlot` carries this comment: *"A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a renamed slot,
**or one whose comment never closes**, would otherwise arrive as an empty string."* The rename half is
true (`N13` reds). **The never-closes half is not.** `end = agents.indexOf(COMMENT_CLOSE, start)`
returns `-1` only if there is **no `-->` anywhere later in the file**, and `AGENTS.md` has ten of them.
So the `end < 0` branch is **dead in practice**, and what actually happens is silent over-capture.
Measured on the mutated file:

```
slot length: 1082 bytes, 16 lines   (unmutated: 9 lines)
...tail of the over-captured slot...
  and exits 0 — the option is silently discarded and stdout looks like success.
- Perft harness (move-gen correctness + nodes/sec, ABC-006): `npm run perft`
- Perft deep counts (opt-in slow suite): `PERFT_DEEP=1 npx vitest run src/perft.test.ts`
- Spike benchmark (throwaway, ABC-008): `npm run spike:perft [depth]`

### Test

- Test (all): `npm test` <!-- vitest run -->
```

**The slot silently swallowed four unrelated bullets and a section heading, and the suite stayed
green** — because none of the swallowed text happens to contain a `--`-prefixed token. It is green by
luck, not by construction: had the `Coverage` bullet (`npx vitest run --coverage`) fallen inside the
window, the same mutant would have redded for a reason that has nothing to do with the defect. **A
guard whose scope silently grows is a guard whose future results are not reproducible.** `Q8`.

## The floor and the equality are each live, in BOTH directions — the mirror of the guard hop's mutant `C`

The guard hop built `C` (an option swapped, count held) to show the equality does work independently
of the floor **in the documentation direction**. `N14` is the same control **in the code direction**,
which is the one that matters long-term: `--depth` added to `ACCEPTED_ARGUMENTS` **and** `--bogus`
added to the slot, so the count is **4 v 4** and the floor is satisfied. **RED, on the equality
alone.** So all four cells of the matrix are proved:

| | floor reds | equality reds |
|---|---|---|
| documented ≠ accepted, count moves | `A4`-2, `N1`, `N7` | — |
| documented ≠ accepted, count held | — | `C`, `N14` |

**`A4` is MET in both directions, and the second direction — the one that will actually happen the
day `EPIC-006` adds an argument — is now measured from the code side rather than the prose side.**
When it happens the message a future hop sees is exactly:
`documented options ["--colour","--ascii","--unicode"]: expected 3 to be greater than or equal to 4`.

## Every mutant reverted, and the tree proved pristine

`git status --porcelain` (whole worktree) is **empty**; `git diff HEAD` is **0 lines**. Blob hashes
for the three mutated paths are in the verdict note and each equals the branch tip's.
