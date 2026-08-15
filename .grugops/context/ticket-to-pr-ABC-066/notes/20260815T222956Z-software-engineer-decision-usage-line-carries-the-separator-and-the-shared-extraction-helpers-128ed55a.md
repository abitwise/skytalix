---
id: 20260815T222956Z-software-engineer-decision-usage-line-carries-the-separator-and-the-shared-extraction-helpers-128ed55a
kind: decision
by: software-engineer
at: 2026-08-15T22:29:56Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260815T221745Z-orchestrator-decision-ready-for-dev-exit-re-read-for-abc065-and-abc066-7c41ae90.md
supersedes: 
---

# `ABC-066` — what was decided while implementing: one line, one guard block, two shared helpers

Hand-authored per `AGENTS.md` § Role / workflow files: `scripts/context-io.ts`,
`scripts/claim.js` and `mcp__grugops__propose_note` are absent from this repository and from the
kit, and `context.human_admission` is `off`. **No `kind: finding` is emitted and no `§14-gate#<id>`
stamp is invented.** Every result below is a `decision` or an `observation`.

## The delivered string

```
usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]
```

One token added, `--`, in one production line (`src/cli.ts`, the `USAGE` constant). Nothing else in
the sentence moved: the option grammar is byte-identical to the delivered one, so `A3`'s
"vocabulary does not move" is true by construction and is additionally asserted mechanically.

**Rejected, and why.** `npx`, a binary name and `node src/cli.ts` were each available and each is
out of scope on the ticket's own words — distribution is undecided (`ADR-0007` clause 5,
`EPIC-006`) and a third spelling of the entry route would be a defect, not a fix. `USAGE` was not
exported: `src/cli.ts` exports nothing (`ABC-042` `A2`, `ADR-0011` clause 4), so the guard reads the
line off a captured child's **stderr**, where a human reads it.

## `## Test notes` 3 is FOLLOWED THROUGH `G3`, NOT AS WRITTEN

The ticket says *"if `ABC-062` has merged, its extraction helper exists; use it."* **`ABC-062` has
not merged** — the parent note's `G3` establishes this and it was re-checked here. So this hop wrote
the **first** stderr→usage-line extraction, deliberately shaped for reuse.

**The helpers, and where `ABC-065`'s guard hop will find them: `src/cli.test.ts`, module scope,
immediately above the first `describe`.** Three names, in dependency order:

| helper | signature | what it does |
|---|---|---|
| `SEPARATOR_FORM` | `const: string` | `"npm run chess -- "` — the criterion's own literal, written ONCE in the file |
| `usageLineOf` | `(stderr: string) => string` | the LAST non-empty line of a refused child's stderr; throws if the child said nothing |
| `advertisedTextOf` | `(usageLine: string) => string` | everything after the separator |
| `invocationsAdvertisedBy` | `(advertised: string) => readonly (readonly string[])[]` | expands the option grammar into the invocations it advertises |

**`ABC-065`'s instruction stands: reuse these, do not write a second copy.** They are at module
scope rather than inside this ticket's `describe` precisely so the next block can call them without
editing this one — the fence both ticket pages state for whichever ticket writes second.

## The expansion grammar, decided

A bracketed group is OPTIONAL; `|` is an ALTERNATION **over the group's last token**, which is what
`[--colour white|black|random]` means and what `[--colour white|--colour black|…]` does not say. So
an alternative is expanded as *(the first alternative's tokens, less its last) + (this alternative's
last token)*. That one rule handles both groups: `[--colour white|black|random]` yields three
two-token invocations and `[--ascii | --unicode]` yields two one-token ones.

**Deliberately NOT a cross product** (`## Test notes` 5). The expansion is the empty invocation plus
each group's alternatives offered one at a time — **6 members**, not 12. Twelve combinations prove
nothing the six single-option forms do not, and the parse is the fiddly part.

**One armed edge the expansion does not skip:** the block asserts that the advertised text outside
every bracketed group is empty. A usage line that later advertised a MANDATORY argument would
otherwise be expanded as though it had not been, and the unread half would never be run.

## `A5` — read, never transcribed

**No second spelling of any accepted argument entered the test file, and no copy of the usage
sentence entered it.** The six named forms are not listed; they are *derived*: the union of the
tokens across the advertised invocations is asserted equal, both ways, to `ACCEPTED_ARGUMENTS` read
at run time. That single row carries `A3` and it is also what makes the six forms present without
naming one of them — each accepted token appears in some advertised invocation, and every one of
those invocations was resolved through `resolveOptions` in the row above it.

The refusal children are likewise **derived from the capture, not listed**: every captured child
whose exit status is non-zero. Six, asserted. **Zero new spawns** — a listed set would also go stale
the day an eleventh criterion refuses a command line this row cannot see.

## One working tree, two hops — a scheduling fact the parent note could not have known

`ticket-to-pr-ABC-065-scribe` had already claimed and **already checked out its branch in the shared
working directory** when this hop started. Checking out `grugops/ticket-to-pr-ABC-066` there would
have moved that hop's `HEAD` out from under it mid-edit. This hop therefore worked in a **linked git
worktree** (`git worktree add`), so each branch had its own checkout and neither touched the other's
tree. The parent note's ruling — the two hops run in parallel because their file sets are disjoint —
is honoured and unchanged; what it did not anticipate is that *one checkout* is a shared resource
even when the *files* are disjoint. Recorded as `G4` in the gaps observation.

## Stop conditions: none fired

No wording required a merged `ABC-042` row to move (measured, not assumed — see the gate
observation). The criterion was implementable without a second spawn and without exporting `USAGE`.
No criterion needed re-wording, so nothing was routed to BA/PM as a blocker.
