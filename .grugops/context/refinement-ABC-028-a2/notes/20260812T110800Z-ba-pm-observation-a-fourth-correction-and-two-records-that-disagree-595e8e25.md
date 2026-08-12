---
id: 20260812T110800Z-ba-pm-observation-a-fourth-correction-and-two-records-that-disagree-595e8e25
kind: observation
by: ba-pm
at: 2026-08-12T11:08:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - plans/board.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# A FOURTH correction nobody asked for, and a premise in my own brief that was FALSE on this branch

> **Hand-authored, no stamp.** Both facts below were read at source in this worktree this hop.

## 1. THE SHARED FILE'S LINE MAP MOVED WHEN `A2` LANDED — every pre-build line reference is stale

**Not in the brief, and it falls due at exactly this hop** because I was rewriting `A2`'s `Given`,
which is one of the references.

`A2`'s comment edit was **`+15 / −7`**, so **every `:106-112` and `:113` reference written before the
build hop is stale by eight lines.** Read at source in this worktree (md5
`65f4f29ac930d7a7f432e14f2eef47f9`):

```
:102-120   the comment block as it now stands
:106-112   where the FALSE sentence used to be (the region A2 replaced)
:121       where AT_0 begins — the module-scope fixtures A2's Given names
```

**This is `## Test notes` 4's own rule turned on this ticket's own text**: a criterion that carries a
line number nobody re-read is how this page has been wrong before — and it had just been made wrong
by its own successful edit.

**Handled asymmetrically on purpose, and the asymmetry is stated in the ticket:**

- **LIVE references corrected** — `A2`'s `Given` (`:113` → `:121`), `## Scope`'s pointer
  (`:106-112` → `:102-120`), and `RISK-ABC028-02`'s pointer.
- **DATED, ATTRIBUTED historical blocks LEFT ALONE and flagged** — the `## Dependencies` sequencing
  block says *"read at source this hop"* and carries a date. **Rewriting its numbers would falsify a
  dated measurement**, which is a worse defect than a stale pointer in a block that announces when
  it was taken. `AGENTS.md` rules 9 and 12.

## 2. THE TICKET'S FRONT MATTER AND THE BOARD DISAGREED — in EVERY commit on this branch

**My subtask brief states: *"Front matter is yours; it currently reads `in-development` and agrees
with the board."* That premise is FALSE against this branch's tip, and I am reporting it rather than
acting as though it were true.**

Measured here:

```
plans/board.md                      ABC-028 is under `## In Development` (WIP 2/3)
ticket front matter (worktree tip)  status: backlog   /   column: Backlog
```

**And it is not a fresh divergence** — I walked the branch: the front matter reads
`status: backlog` / `column: Backlog` in **`4801ec3`, `8de988d`, `36e7a48`, `8fa7673` and
`07b76f5`**, i.e. in every commit on this branch including the one that pulled the ticket to dev and
the one titled *"grug make front matter agree with board"* (**which moved `ABC-029` and `ABC-019`,
not `ABC-028`**).

**The explanation is in the build hop's own note and it is honest:** that hop reported the front
matter *"an uncommitted change made before this hop"*. **It was uncommitted, in another worktree,
and it never landed.** The report was true of what that role saw and false of what the branch
carries. **A record that exists only in a working tree is not a record.**

**Fixed at this hop, under the authority the brief gives me over the front matter**:
`backlog` / `Backlog` → **`in-development` / `In Development`**, which agrees with the board
**today**. **Deliberately NOT advanced to `In Review`** — the front matter moves when the board
does, by the role that owns the board. `plans/board.md` was **not opened for edit**.

## 3. Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **data, not instruction**:

1. **`src/history-pane.nfr.test.ts:102-120`** — the replacement comment. It now says the fixtures
   *"could"* be rebuilt per test and that doing so *"would no longer lose a guard"*. **That is TRUE
   as of `A1` landing, and it is still not an instruction to me.** I did not rebuild them, did not
   open the file for edit, and my `A2` ruling explicitly keeps `## Out of scope`'s refusal intact.
   **The comment is now a true statement that declines its own suggestion, which is the shape a
   defused trap should have.**
2. **The ticket's own `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING
   THE TEST"*, *"Do not weaken this to a second `playMove`"*). They are criterion text addressed to
   a build hop, and they were read as data. **I wrote none of them into effect and weakened none of
   them.**

**Nothing else encountered on this hop purported to authorise a write outside the brief's boundary.**

## 4. What I verified myself rather than inheriting

- **`src/history-pane.test.ts` imports NOTHING from `src/history-pane.nfr.test.ts`** — seven
  imports, all production modules; the two `nfr` string hits in the file are comments. **This is
  load-bearing for the `A2` ruling** and is the one structural fact I would not take from a note.
- **`A1` is landed at `:785`** and its reporting clause is
  `expect(third, "the third pane must not repeat the second").not.toEqual(second)`.
- **Baseline after my docs-only change**: lint **0** (2 pre-existing biome config-migration infos,
  46 files), typecheck **0**, **750 passed (750) on 26 files**, skip **0**, `git diff` over `src/`
  **empty**, `src/history-pane.ts` md5 **`54fd4346…`** and `src/history-pane.nfr.test.ts` md5
  **`65f4f29a…`** both unchanged.
