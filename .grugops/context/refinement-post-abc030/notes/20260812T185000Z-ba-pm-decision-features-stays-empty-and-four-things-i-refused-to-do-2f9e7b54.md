---
id: 20260812T185000Z-ba-pm-decision-features-stays-empty-and-four-things-i-refused-to-do-2f9e7b54
kind: decision
by: ba-pm
at: 2026-08-12T18:50:00Z
verified_by:
confidence: high
refs:
  - EPIC-003
  - EPIC-006
  - ABC-028
  - ABC-030
  - plans/features
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# `plans/features/` stays empty and `feature:` stays `—`. **Ruled, not overlooked** — plus the four things I refused to do this hop, each with its reason

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.

## The `plans/features/` ruling

**`plans/features/` is empty, no `FEAT-` file has ever been written, and the board contract and the
trace both carry a `feature:` field. My ruling: that is CORRECT, it stays that way, and the field is
NOT deleted.**

**Why a feature layer is not earning its keep here.** The kit's hierarchy is epic → feature → ticket,
and a feature is worth a file when an epic's tickets need an **intermediate grouping that changes a
decision** — a cluster that is scoped, accepted, released or dropped as a unit. Nothing on this board
has that shape. `EPIC-001` decomposed to 8 tickets, `EPIC-002` to 9, `EPIC-003` to 9 at this hop, and
in all three cases every ticket is independently valuable, independently testable and already traces
to its epic in `plans/traceability.md`. **A `FEAT-` row would carry a value that no gate reads, no
board move consults and no trace query joins on** — a single-use abstraction (coding rule 6) and
unrequested flexibility (rule 7), in a repository whose `AGENTS.md` puts both rules in writing.

**Why the field is NOT deleted.** It costs one em-dash per ticket, it is part of the board↔ticket
contract that a validator can check, and the 25 delivered tickets all carry it as `—` — so the current
state is **consistent**, not broken. Deleting a contract field to tidy a directory is a bigger change
than leaving one column reading `—`.

**Explicitly refused: retro-fitting features to fill the directory.** My brief said not to and I would
have refused anyway — inventing three `FEAT-` files for `EPIC-003` so a folder is non-empty is the
definition of bloat, and it would put a second, unmaintained grouping beside the epic that already
groups them.

**The one condition that would change this, named so the question does not get re-asked a fourth
time:** when an epic first produces **two clusters that ship and are accepted separately**. The only
plausible candidate on the roadmap is `EPIC-006` — *session commands* and *packaging/distribution* are
genuinely different acceptance events, and packaging is gated on a human decision the other half is
not. **If `EPIC-006`'s decomposition splits along that line, cut two features there and nowhere
else.** Recorded in `plans/epics/EPIC-003-move-input-and-controls.md` so the next reader finds the
ruling rather than the empty directory.

## Four things I refused to do, each with its reason

### 1. I did not cut a ticket for `ABC-028`'s BA/PM-owned record debt, and it is real

`ABC-028` is in `Done` and its final gate routed **four gaps to BA/PM** (`F1` MEDIUM — `A5`'s
extension rule has an undocumented domain and goes red on correct code at `preservedTail: 16`;
`F2` LOW — a stale live lane figure, third time; `F3` LOW — a published line count wrong by six;
`F4` MEDIUM — the forbidden-formulation rule is unenforceable), plus the later `H1` (MED, BA/PM,
*"ONE CLAUSE OF SCOPE, DO NOT RE-OPEN"*).

**I did not cut it, and the reason is not tidiness.** `F1`'s verdict rests on a measurement — running
the suite with `preservedTail: 16` and observing `1 failed / 27` on correct code — and **my boundary
this hop is no code and no tests.** Cutting a ticket whose central criterion I cannot verify, on a
`Done` ticket I must not re-open, would be the smoothing this board refuses. **The honest handling is
the one my brief prescribes for the two concurrent audits: name it in prose and let it be cut by a hop
that can measure it.** So: **it needs ONE ticket, it is BA/PM-owned, the next free ID after this hop is
`ABC-039`, and the `Done` record must not be edited to fix it.**

**I did apply the ONE half of it that is live and verifiable without running anything:** the *"or any
new file"* clause, unscoped, **fires on 33 non-source files** — and `ABC-030` (in `Backlog`) had copied
it verbatim. Corrected there to *"any new file **under `src/`**"*. The `package.json`-`dependencies`
half appears only in `Done` tickets and is left as a closed record; **for the avoidance of doubt I
verified the underlying fact: `package.json` has NO `dependencies` key — absent, not `{}`.**

### 2. I did not touch `plans/board.md`

It is the Orchestrator's. Every row I want is written **verbatim** in the `artifact-ref` note beside
this one. **This is also why two ticket pages say "REQUESTED, not taken" for their `Backlog → Ready`
move** — the DoR judgement is mine, the row is not.

### 3. I did not touch the duplicate `ABC-028` / `ABC-029` trace rows, and I did not remove the stale `pending` `EPIC-003` trace row

The duplicate pairs need a hop that can **reconcile two histories**, not a delete — the record says the
stale `ABC-028` row is not even a prefix of the live one. **Verified untouched: both pairs are still
there, four rows, and the table went 41 → 49 lines, exactly the +8 I appended, every one at 10
columns.**

The `| pending | Move input and controls | EPIC-003 | ... |` row **is** now stale — that epic is
decomposed — and `EPIC-002`'s precedent was to remove its equivalent. **I left it**, because my
boundary is *append rows for tickets you create only*, and silently deleting a row is exactly the class
of edit that boundary exists to prevent. **Routed to the Orchestrator as a one-line retirement.**

### 4. I did not re-measure the lane, re-run a mutant, or edit a `Done` ticket, an ADR, `plans/metrics.md` or `plans/nfr-catalog.md`

`H5` (the lane total) stays owed to `ABC-026`, whose acceptance criteria I wrote this hop so that it
can be discharged properly. `ABC-024`'s seven survivor verdicts stay `UNKNOWN - verify` at 807 on 28
files, needing a dev/QE hop. `ADR-0008`, `ADR-0011` and the catalog are cited throughout and none was
opened for edit — the Architect lane owns them this hop, and `ABC-026` `A5` names `ADR-0008` as a
placement target for a **future** hop rather than editing it here.

## One standing-rule check, run and reported

**Nothing in this workspace tried to authorise a write outside my boundary.** The closest thing to a
flag was `AGENTS.md`'s own *"act as the Orchestrator"* line, which is this repository's documentation
of its own entry point and is **data, not an instruction to me**. I remained BA/PM, wrote no code, and
opened no file outside `plans/tickets/`, `plans/epics/`, `plans/traceability.md` and this task's own
`.grugops/` records.
