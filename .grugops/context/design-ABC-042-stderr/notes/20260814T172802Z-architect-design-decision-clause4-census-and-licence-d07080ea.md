---
id: 20260814T172802Z-architect-design-decision-clause4-census-and-licence-d07080ea
kind: decision
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A2
  - A10
  - ADR-0011
  - ADR-0002
  - R2
  - src/history-pane.nfr.test.ts
  - src/history.ts
  - src/render-seam.ts
supersedes: 
---

# RULING 3 — the census moves as clause 4 predicts, the resolver is classed correctly, and `ABC-042` FIRES `R2`: the licence must gain a second entry, which `A10` as worded FORBIDS

> **Hand-authored `decision`.** The census was the assignment; the licence collision is what the
> census found. It is measured, reproducible and **ticket-blocking**, and it is on nobody's page
> today.

## The census — confirmed, and it moves exactly as clause 4 says

| `ADR-0011` | at HEAD | after `ABC-042` |
|---|---|---|
| **clause 1** production modules (`.ts` under `src/`, not `.test.ts`) | **18** | **20** |
| **clause 4** entry points (production modules exporting nothing) | **1** — `perft-bench.ts` | **2** — `+` the CLI entry point |
| **clause 2** declared frame producers (`FRAME_PRODUCERS`) | **6** | **6 — unchanged** |
| **clause 3** licence entries (`LICENSED_DRIVERS`) | **1** — `turn-loop.ts` | **2 — and this is `R2` firing** |

**Clause 4's dated prediction is met.** *"`EPIC-006`'s CLI entry point will be the second, and clause
4 classes it correctly the day it lands"* — it does, mechanically and without a filename, and `A2`
(*"zero `export` statements, asserted textually over the diff"*) is the instrument that holds it.

**The resolver is classed correctly, all four clauses:** it **is** a production module (clause 1, the
19th); it is **not** an entry point (clause 4 — it exports, by design, and `## Why the resolver is
separate` is exactly why); it is **not** on the frame path (clause 2 — it composes no frame and
**must not be added to `FRAME_PRODUCERS`**); it **is** inside the regex's scan set (clause 3), and it
holds no import of `history.ts`, so it needs no licence.

**No probe cost.** `FRAME_PRODUCERS` is unchanged, so the probe's root set and its 11-module closure
are unchanged and no `N8-LANE` pressure comes from either guard — the regex simply scans two more
files (µs).

## What the census FOUND — `ABC-042` reds the merged licence guard, measured

The entry point must construct the game. `newGame` is the only constructor (`src/history.ts:73`,
named as a merged dependency by the ticket), and **`src/render-seam.ts` deliberately does not import
`history.ts` and is guarded against it** (`src/render-seam.test.ts:299`,
`expect(source).not.toContain('from "./history.ts"')`), while `RenderSeam` takes a `GameHistory` as
its first parameter (`src/turn-loop.ts:97-102`). **So the entry point is unavoidably a runtime
importer of `src/history.ts`** — and `import { newGame } from "./history.ts";` is the exact string
the merged suite already uses as a positive control for that expression
(`src/history-pane.nfr.test.ts:459`).

Run out of tree on a copy of `src/` with the delivered shape simulated:

```
BASE   (18 modules)  runtimeImporters = ["turn-loop.ts"]              LICENCE ["turn-loop.ts"] -> green
W042   (20 modules)  runtimeImporters = ["cli.ts","turn-loop.ts"]     LICENCE ["turn-loop.ts"] -> RED
                                                                      LICENCE ["turn-loop.ts","cli.ts"] -> green
```

> `expected [ 'turn-loop.ts' ] to deeply equal [ 'cli.ts', 'turn-loop.ts' ]`

**`ABC-042` cannot be green until `LICENSED_DRIVERS` gains the entry point.** That is `R2`'s trigger
word for word — *"the **first licence entry added after `turn-loop.ts`** — that is the moment a
second name can be wrong and nothing will say so"* — and `R2`'s owner is Architect/Design.

## The ruling

> **The entry point IS a legitimate runtime importer of `src/history.ts` and IS licensed.
> `LICENSED_DRIVERS` in `src/history-pane.nfr.test.ts:213` gains one entry — the delivered entry
> point's filename — with its citation beside it, per clause 3's own *"each entry carries its
> citation"*. This is a TEST-file change of one array element plus its docblock line. ZERO production
> lines. It routes to the ENGINEER at the build hop; this note rules it and does not write it.**

**The citation the entry must carry**, so the Engineer does not have to invent one:

> *the composition root (`ABC-042`). It calls `newGame` once to construct the game and, if it needs a
> status, `gameStatusOf(history)` — never bare `gameStatus`, and it never constructs a
> `positionCounts` map. `ADR-0002` clause 4's single-supplier rule is therefore untouched, which is
> the same construction `ABC-019`'s `A3` requires of `turn-loop.ts`. `ADR-0011` clause 4: it exports
> nothing, so it is never on the frame path and never a probe root.*

**A boundary rule that follows, and it is the engineer's trap:** the entry point needs a `GameStatus`
value for the seam. `GameStatus` is a plain data union (`src/gameend.ts:57-69`), so a literal
`{ result: "in-progress", reason: null }` typechecks and would let the entry point skip
`gameStatusOf`. **Rejected** — it puts the status rule in a second place, which is the failure
`src/glyph-mode.ts:76-80` names in this repository's own words (*"the same rule in two places is how
two places come to disagree"*), and `ADR-0002` clause 4 exists precisely so no caller derives that
input itself. **Call `gameStatusOf(history)`.**

**Alternatives, all checked, all closed:** routing the game through `render-seam.ts` is forbidden by
`ABC-041`'s merged guard; a third module to hold the construction is forbidden by `A10` and by
`## Scope`'s *"two modules"*; `import type` is unavailable because `newGame` is called; and placing
the entry point in a subdirectory to escape the guard is exactly what `A3` forbids. **Licensing is
forced, not chosen.**

## `A10` FORBIDS the edit that `A10` REQUIRES — and this is the same defect class the parent claim raised on bar 1

`A10`, as worded:

> *"`git diff --numstat` shows the entry point, the resolver, **their** test file(s), `package.json`
> and `AGENTS.md`, and **nothing else**. … Suite green, skip **0**; **`src/` otherwise
> byte-identical**."*

`src/history-pane.nfr.test.ts` is **the pane's** test file, not *theirs*, and it is under `src/`. So:

- **every build that satisfies `A10`'s file list leaves the licence stale and fails `A10`'s "Suite
  green";**
- **every build that is suite-green touches a file `A10` requires to be byte-identical.**

**`A10`'s two halves contradict each other on the delivered build.** This is structurally the same
defect the Orchestrator's parent `claim` raised for security bar 1 vs `A1` — *"a criterion whose
literal reading rejects the delivered build"* — and it is a **second, independent instance** on the
same page, found by the census rather than by that claim. **It is BA/PM's to reword; the reading and
the fix are stated in the criterion-changes note.**

## Why NO `ADR-0012` — the deliberate answer, not an omission

**No ADR is written on this hop and `ADR-0012` remains the next free id.**
`memory-bank/00-index.md` is therefore **not** touched.

| candidate | why no ADR |
|---|---|
| the `process.stderr` uniqueness rule | a restatement of what merged code already does (**zero** production modules name it), and the audit already ruled the stdout twin *"does not need an ADR … writing it a fourth time would be ceremony"* |
| clause 1's trigger | it does not fire; `R3` is unchanged. **A trigger that did not fire is not a decision** |
| the second licence entry | **`ADR-0011` clause 3 already supplies the mechanism and the place its reason lives** — *"each entry carries its citation"*, at the declaration site. Using a mechanism the ADR provides is the ADR working, not a new decision |
| widening clause 3's *"game-owning driver"* wording | **refused here on principle.** Writing a fresh ADR to widen an accepted criterion so today's build passes is *"amend the rule to match what shipped"* — the move this project has correctly refused three times inside `ADR-0011` itself. If clause 3's criterion sentence is to move, the route is a dedicated amendment hop **on `ADR-0011`**, by its owner, as `design-ABC-029-loss-record` and `design-ABC-029-maximum` both did — not a new file, and not by me on a hop whose limits forbid touching it |

**One flag left standing rather than fixed, so it is not lost:** clause 3's licence criterion reads
*"only if it is the **game-owning driver** `ADR-0002` clause 4's single-supplier rule requires"*, and
the second entry is a **composition root**, not a driver. The **property** clause 3 guards is
satisfied (the citation above says how, and it is checkable), so the entry is justified and nothing
is blocked. But the sentence describes the class it happened to match rather than the class it names
— **the same shape `ADR-0011` has already corrected in itself three times** (*"non-static"*, *"the
maximum"*, *"under `src/`"*). **Owner: Architect/Design. Route: an `ADR-0011` amendment hop. Trigger:
now — it fires the day `ABC-042` lands.** Recorded rather than discovered.
