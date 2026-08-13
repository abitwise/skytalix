---
id: 20260813T164000Z-ba-pm-decision-what-i-refused-to-cut-and-the-three-ids-i-did-not-spend-5b19d3c8
kind: decision
by: ba-pm
at: 2026-08-13T16:40:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - EPIC-004
  - ABC-042
  - ABC-043
  - ABC-046
  - ADR-0007
  - ADR-0002
  - AGENTS.md
supersedes:
---

# What I could NOT cut, what I REFUSED to cut, and the three ids I did not spend

> **Hand-authored, no stamp.** The distinction in the title is the point of this note: *could not* is
> a blocked decision, *refused* is scope discipline, and collapsing the two is how an epic grows a
> ticket nobody asked for.

## COULD NOT — a decision someone else holds

### 1. Packaging and distribution, entirely. A human holds it and I did not touch it.

`ADR-0007` and `AGENTS.md` § Deployment posture: *"How the CLI will eventually be distributed — npm,
a binary, a `git clone` — is undecided, and `EPIC-006` decides it. **Do not fill that in.**"*

**Cutting `npx`-shaped tickets before that decision produces tickets that fail the Definition of Ready
on *dependencies known* and *no major unresolved blocker*** — the reason the 2026-08-12 hop gave for
not decomposing this epic at all, and it still holds for this half. **What changed is that the
decision forecloses the packaging tickets and does NOT foreclose the runnable ones**, which is the
whole reason this hop was possible.

**The fence is mechanical, not a promise.** `ABC-042` `A10`: `package.json` gains **exactly one**
`scripts` key and gains no `bin`, `main`, `files`, `publishConfig` or `dependencies` key, and
`private` stays `true` — asserted **key by key against `HEAD`**, not by reading a diff. **A `scripts`
entry is a dev command and is what `AGENTS.md`'s `Dev / run` slot asks for; `bin`/`main` are
distribution.** That is the line, and it is drawn where a test can see it.

**Consequence, recorded on the epic page:** epic acceptance criterion #1 (*"Given `npx <package>` …"*)
is **NOT met by this decomposition and cannot be met by any ticket until a human decides.**

### 2. `undo` — it needs an engine reply to take back.

Its criterion is *"takes back the human move **and** the engine reply"*, and there is no engine reply.
The 2026-08-12 hop already ruled it uncuttable until `EPIC-004` exists and I am honouring that rather
than re-litigating it. **Two things worth carrying forward so the next hop does not re-derive them:**

- **The epic's stated `## Risks` — *"a shallow undo that forgets repetition history would corrupt
  draw detection"* — is structurally absent.** `ADR-0002`: undo is one operation on one list; position,
  Zobrist keys and repetition counts are all derived by replay, so they rewind together. The
  architecture audit reached the same conclusion independently.
- **`ABC-046` `A4` proves it on `new`**, which is the one list-truncating command reachable today:
  after `new`, `moves.length` is 0, `keyHistory` is 1 and `repetitionCounts` has exactly one entry.
  **So the epic's headline risk gets tested before `undo` is ever cut.**

### 3. Difficulty levels — `EPIC-004`, and its first ticket must be a spike.

`NFR-005`'s depth-7 level is `PROVISIONAL` pending measurement on non-M3 hardware, and `RISK-002`'s
timeboxed spike is the named verification that lifts the marker. **Epic acceptance criterion #4
(`--colour black --difficulty 3`) is NOT met**: `ABC-042` `A6` rejects `--difficulty` as an
unrecognised argument with a usage message, rather than accepting it and ignoring it.

### 4. `quit`'s and `new`'s outcome shape — Architect/Design's.

Cut as `ABC-046` **with its Definition of Ready deliberately not met**, because the alternative was to
leave the gap in prose where nobody re-reads it. Three shapes priced, none adopted. See the
observation note in this folder for the measurement.

## REFUSED — nothing blocked it; it is not in scope

- **A hot-seat two-human mode.** It would make the game playable today with no engine, and it is
  rejected: no epic asks for it (coding rule 5), and the merged loop has no shape for it — an adapter
  from `InputSeam` to `EngineSeam` must swallow six of seven `PromptOutcome` arms and turn EOF into a
  throw, which the loop reports as `engine-threw`. **End-of-input presented as an engine fault is the
  inverse of `ABC-019` `A10`'s forbidden move.** Recorded so it is not re-derived.
- **`--color` as an alias for `--colour`, a `--help` beyond the usage message, a verbosity flag, a
  logging channel.** Coding rules 5 and 7. None was requested.
- **Promoting `START_FEN` to a shared export.** There is no start-position constant under `src/`
  (measured: every test file defines its own). The entry point holds the literal. Promoting it is a
  change to a merged module for one caller's convenience — flagged, not taken (coding rule 12's
  posture applied to an addition).
- **Save / resume and PGN export.** The epic's own declared negotiable slice, and nothing has
  play-tested anything. **Cut them first if this epic runs long — after `ABC-046`, which is the
  drop-first `P2`.**
- **A confirmation on `resign`.** The epic's sentence attaches confirmation to `quit`. Ruled on
  `ABC-045` with the counter-argument named and marked as a cheap owner-reversible call. **I checked
  whether I preferred that reading because it keeps `ABC-045` unblocked; it would read the same way
  if the sequencing were reversed.**

## The three ids I did not spend

**`ABC-047`, `ABC-048`, `ABC-049` are unallocated and free.** My range was `ABC-041`–`ABC-049`;
spending six of nine is the answer, not a shortfall. **The work that would fill them —
packaging, difficulty, `undo` — is blocked on a human decision and on an undecomposed epic, and
allocating ids to it now would put three permanently-not-Ready tickets on the board.** The board
already carries the lesson: `ABC-024`, `ABC-026`, `ABC-028`, `ABC-030` and `ABC-039` each sat with DoR
honestly unmet rather than smoothed, and that is a cost worth paying for a ticket that can be built.
It is not worth paying for one that cannot.

## The one thing I did NOT do that my role would normally do

**I did not write `plans/board.md`** — it is the Orchestrator's, and the rows I want placed are in the
`artifact-ref` note in this folder, **short, one line each**, per that file's own rule and per the
brief.
