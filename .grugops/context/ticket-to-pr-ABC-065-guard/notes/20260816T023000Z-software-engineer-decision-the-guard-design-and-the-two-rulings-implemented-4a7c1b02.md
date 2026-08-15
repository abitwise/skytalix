---
id: 20260816T023000Z-software-engineer-decision-the-guard-design-and-the-two-rulings-implemented-4a7c1b02
kind: decision
by: software-engineer
at: 2026-08-16T02:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - src/cli.test.ts
  - AGENTS.md
  - .grugops/context/quality-gate-ABC-066-qe/notes/20260816T001800Z-qe-e2e-observation-gaps-found-at-qe-for-abc066-d73cfa8f.md
  - .grugops/context/ticket-to-pr-ABC-065-scribe/notes/20260815T222226Z-agents-md-scribe-observation-four-gaps-found-at-the-scribe-hop-223095f2.md
supersedes: 
---

# `ABC-065` half 2 — how the guard is built, and the two rulings it implements rather than re-litigates

Hand-authored per `AGENTS.md` § Role / workflow files. **No `kind: finding` and no `§14-gate#<id>`
stamp** — `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this repository
and from the kit and `context.human_admission` is `off`, so no verdict is emittable on this install
and none is invented.

## What was added: ONE `describe`, TWO `it` rows, appended after `ABC-066`'s block

`describe("ABC-065 — AGENTS.md's \`Dev / run\` slot is reachable and its option list is the accepted
set")`, at the END of `src/cli.test.ts`. **85 added lines, 0 removed.** Nothing above line 886 moved
— see the byte-identity note.

| row | criterion | what it asserts |
|---|---|---|
| `A1` | the separator is shown, and what it shows resolves | `slot` contains `SEPARATOR_FORM` **first**; then the fence is stripped, argv is read, a **count floor** of `>= 1` applies, every token is in `ACCEPTED_ARGUMENTS`, and `resolveOptions(argv).ok` |
| `A3` | the documented list equals the accepted set | dash-led tokens collected, the bare `--` excluded by the ruling below, a **count floor** of `>= acceptedOptions.length`, then **both-ways** set equality, then each value word present |

The slot is located **mechanically** (`## Test notes` 1) — `indexOf("- Dev / run:")` to the end of
its HTML comment — never by line number. That is not decoration: **`ABC-042`'s own `AGENTS.md` row
moved 56 lines when `ABC-066` landed** (`:193-204` → `:249-260`). A positional guard would already
be wrong.

## The vacuity defence, which is `Q2` implemented rather than acknowledged

QE handed this hop `Q2` by name. `advertisedTextOf` is
`slice(indexOf(SEPARATOR_FORM) + SEPARATOR_FORM.length)`; `indexOf` returns `-1` when the separator
is absent, so it degrades to a silent slice from a meaningless offset instead of a throw. Its sibling
`usageLineOf` throws on bad input. **Two of the four shared helpers have opposite contracts and
neither says so** — QE's words, and I found them accurate.

**Three things stop the vacuity, and all three are in the block:**

1. `expect(slot).toContain(SEPARATOR_FORM)` **before** `advertisedTextOf` is called at all;
2. the **count floors** — `resolveOptions([])` is `ok: true`, so "what it advertises resolves" is on
   its own satisfiable by advertising nothing;
3. the **both-ways** set equality, which an empty documented set fails in one direction.

**This is not an argument. Mutant `V` (the separator stripped from `AGENTS.md`, i.e. the file exactly
as `ABC-065` found it) goes RED on line 1 of that list, and I watched it red before I ever ran the
guard green.** The measurement is in the gate note.

## Ruling 1, implemented — the bare `--` separator is NOT an option token

The Orchestrator ruled it at this hop and I implemented it rather than re-opening it. The Scribe's
`G4` measured the contradiction exactly and I reproduced it on the delivered slot:

```
raw dash-led tokens  : ["--","--ascii","--colour","--unicode"]     <- FOUR
after the `--` filter: ["--ascii","--colour","--unicode"]          <- THREE, and A3 says three
```

**The fourth token is the separator, and it is there because `A1` put it there.** So `A1` and `A3`
contradict on a literal reading, and the guard has to pick a reading.

**The exclusion is by EXACT EQUALITY with `"--"` and by nothing looser**, with a comment at the site
naming the ruling — as instructed. This matters and is not style: a pattern loose enough to drop the
bare form (say, "any token shorter than three characters") could also swallow a real option, and the
resulting weakening would be invisible, because the guard would still be green on correct
documentation. The same exact match also drops the HTML comment's own `<!--` and `-->` delimiters,
which the collector otherwise sees — recorded so a later reader knows the filter has two jobs.

**Removing the separator from `AGENTS.md` to satisfy `A3` was FORBIDDEN and was not done.** The
wording repair is BA/PM's; the ruling is what I built.

## Ruling 2, inherited — `A6` is scored across the ticket's two hops

The Scribe's commit carries `AGENTS.md`; mine carries `src/cli.test.ts`. What `A6` protects is
measured in the gate note and holds: **zero production lines, zero new files, zero new spawns,
`spawned` still 10.**

## Trap 3 — the note's transcription was wrong and the source was right

`Q2`'s prose says `advertisedTextOf` reads `+ 17`. **The source reads `+ SEPARATOR_FORM.length`
(`src/cli.test.ts:194` after the merge).** There is no magic number in the delivered code. The
behavioural claim `Q2` makes is entirely correct; only its quotation of the code is not. I read the
source. **My own block writes `COMMENT_CLOSE.length` for the same reason rather than `+ 3`.**

## What I did NOT do, stated so it is not read as done

- **`AGENTS.md` not edited.** The Scribe's half is on this branch and is done. Every mutant applied
  to it was reverted, and `git status --porcelain AGENTS.md` is empty.
- **Zero production bytes.** No file under `src/` other than `src/cli.test.ts`.
- **`ABC-066`'s merged block not edited** — including its stale `THESE TWO HELPERS` comment, which
  QE's `Q6` assigned to this hop. The Orchestrator's hard limit forbids editing that block and a
  hard limit outranks a `LOW` tidy-up. **Left open and re-reported.**
- **No merged `ABC-042` row moved.** 0 deleted lines; hashes in the byte-identity note.
- **No second helper written**, no helper forked, no criterion re-worded.
- **`plans/board.md` and `plans/traceability.md` not written** — the Orchestrator's, by instruction.
  **The `In Development → In Review` move this role normally owns, and the trace row for the
  delivered commit, are OWED AND UNWRITTEN.** Named here so they are not silently lost.
- **No merge to `main`, no push, no deploy.**
