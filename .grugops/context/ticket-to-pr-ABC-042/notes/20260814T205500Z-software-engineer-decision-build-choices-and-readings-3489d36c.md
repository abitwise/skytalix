---
id: 20260814T205500Z-software-engineer-decision-build-choices-and-readings-3489d36c
kind: decision
by: software-engineer
at: 2026-08-14T20:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A6
  - A9
  - A10
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# The choices this hop made, and the readings it made rather than assumed

Everything the ticket left to the engineer, plus every place two readings existed. Each one names the
alternative that was not taken, so a reviewer can disagree with the choice rather than reverse-engineer it.

## 1. The rejection channel is **stderr** — the choice `A6` leaves open

Taken with the consequence Architect/Design attached to it: **the entry point is then also the only
module that may acquire `process.stderr` as a writable handle**, which is what `A9`(3) already
enforces for every other new module. Measured before choosing: `process.stderr` occurs in **one**
file in this repository (`src/glyph-mode.test.ts:130`, a spy) and in **zero** production modules, so
the rule forbids nothing that exists.

**Why stderr and not stdout:** a usage error is not output, and `A7`/`A8`'s "emitted stream" is
stdout — putting a diagnostic there would put non-frame bytes on the one channel the epic asserts
frame properties over. **The union assertions do not care**, which is exactly why `A5`, `A6`(iii) and
bar 3 are asserted over **stdout AND stderr** here: a build that printed a board on the other channel
would pass a one-channel test, and that build is what the union clause exists to catch.

## 2. `process.exit()` is NOT called — `process.exitCode` is set instead

On macOS a **pipe is an asynchronous stream** (Node's own documented table), so exiting immediately
after writing truncates what was just written. The rejection path sets `process.exitCode = 1` and
returns; the success path leaves it at 0. `A1`'s "exits with code 0", `A5`'s and `A6`(iii)'s
"non-zero" are all satisfied without the class of flake that `process.exit()` would introduce on
exactly the platform the criteria are measured on.

## 3. The resolver holds the accepted set as **one exported tuple, destructured**

```ts
export const ACCEPTED_ARGUMENTS = ["--ascii", "--unicode", "--colour", "white", "black", "random"] as const;
const [ASCII, UNICODE, COLOUR, WHITE, BLACK, RANDOM] = ACCEPTED_ARGUMENTS;
```

`A6`(i) needs the set to be **data**, exported, and **the only argv literal in the module**. The
destructuring is what makes the second half true without an index-lookup obscuring the first: every
comparison below reads `token === ASCII`, and no accepted spelling is written twice anywhere in the
file. **Rejected:** a record of named constants (`{ ascii: "--ascii", … }`) — it is not an
enumeration and the element-for-element equality against `## Scope`'s table gets a shape to
negotiate; and re-spelling the value words in a type alias — that is the same literal in a second
place, which is the failure this repository names in its own words.

## 4. The colour -> orientation rule lives in the **resolver**, not the entry point

`A4` requires the resolution of `random` to be readable as exactly `"white"` or `"black"` (so the
resolver must return the **colour**), and `A9`(2) forbids a branch on argv after the resolver
returns. Deriving the orientation at the entry point would put a branch there — defensible, since it
branches on a resolved value rather than on argv, but **the conservative build has no branch at
all**, and it also puts the "board is drawn from the human's side" rule in the one module that can be
unit-tested. `ResolvedOptions` therefore carries `colour` **and** `orientation`. The redundancy is
one field and it buys both readings of `A9`(2) at once.

## 5. `process.argv.slice(2)` — the reading, stated rather than assumed

`A9`(2) says `process.argv` occurs **exactly once** and *"its only use is as the argument to the
resolver"*. Two readings exist: the strict one, where `.slice(2)` is a use that is not "as the
argument"; and the one taken here, where the whole expression **is** the argument and the clause's
own gloss — *"no second read and no branch on argv after the resolver returns"* — is what it is
protecting. **The strict reading is unimplementable in the delivered shape**: passing the whole
`process.argv` would force the pure resolver to know it must drop two ambient entries, which
contradicts `## Scope` 2's "reads no ambient signal" and makes `A6`(ii)'s empty-argv and shape
corpora incoherent. The assertion is written to hold the taken reading **exactly**: one occurrence,
inside `resolveOptions(process.argv.slice(2))`, and exactly one `resolveOptions` call site.

## 6. `A9`'s scope is the **new production modules** — the ruled reading, applied narrowly

Architect/Design ruled `A9`'s scope to be production modules (`ADR-0011` clause 1), because the test
file must contain `process.execPath`. Applying it to **all** production modules also reds:
`src/frame.ts`, whose docblock names `process.stdout` in order to say it never reaches for it, and
`src/glyph-mode.ts`, the merged exception the ticket names by line. Both are merged and neither is
this ticket's. **The assertion is scoped to the two NEW modules**, plus a guard that the new modules
are exactly those two — so a third would red this row rather than slip past it.

## 7. `A10` is asserted against a **transcription of `HEAD`**, not against a git read

"Key by key against `HEAD`" needs a baseline. A `git show <base>:package.json` would mean spawning
git from the suite — a spawn on a file that is already over its lane budget, and one more process
whose absence would have to be handled. The test instead **transcribes** `HEAD`'s eight top-level
keys and nine script commands, the same instrument `A6`(i) uses for `## Scope`'s table. It is
stronger than a diff read in one specific way the comment records: **a key added and removed within
the branch is invisible to a diff and visible to this**.

## 8. `A1`'s reading: `npm` writes on the child's stdout before the entry point does

Measured: `npm run chess` emits its own two-line banner (`> cli-chess@0.0.0 chess`, `> node
src/cli.ts`) **on stdout** before the script's output. So "the process writes a frame of exactly N
rows" is asserted as: the stream **ends with** the 23-row frame joined by newlines plus exactly one
newline, byte for byte, **and the bytes before it carry zero frame rows**. `A7`'s and `A8`'s
properties are asserted over the whole captured stdout, banner included — they hold there too, and
that is the stronger place to assert them.

## 9. The licence edit was **pasted, not composed**

The citation in `src/history-pane.nfr.test.ts` is Architect/Design's text from
`…decision-clause4-census-and-licence-d07080ea`, wrapped to the file's own 100-column docblock style
and not otherwise altered. `LICENSED_DRIVERS` gained `"cli.ts"` and nothing else changed in that
file: the `toEqual` was not weakened to a subset, the `runtimeImporters` regex was not touched, and
`FRAME_PRODUCERS` was not given a new entry — the resolver is **not** a frame producer and the entry
point cannot be one, which is `ADR-0011` clause 4 doing its job.

## 10. Two commits, deliberately

The first commit is **the delivered change** — exactly the six paths `A12` names. The second is the
**queue and context state** Workflows 16 and 17 require (`.grugops/queue/…`, this note and its
siblings). `A12`'s `git diff --name-only` is checkable as written against the first commit, and no
process bookkeeping is smuggled into the same diff as the code. **`plans/board.md` and
`plans/traceability.md` were not touched at all** — the board is the Orchestrator's and the human's,
and the trace row is owed rather than taken (see the gaps note).
