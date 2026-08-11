---
id: 20260812T061500Z-software-engineer-decision-9d4b1e08
kind: decision
by: software-engineer
at: 2026-08-12T06:15:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-rf1
  - abc027-rf1-2026-08-12
  - refinement-ABC-027-a1
  - security-nfr-ABC-027
  - ABC-027
  - ABC-018
  - ADR-0009
  - ADR-0010
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
  - plans/traceability.md
  - 20260812T060000Z-software-engineer-observation-3f8c2a71
supersedes:
---

# `RF-1` SHIPPED AS SPECIFIED — every criterion met, and ONE ITEM ON THE OWED LIST CAME BACK NOT-FALSE and is reported rather than absorbed

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **No `finding` in this task's notes.**
> Grounded in `20260812T060000Z-software-engineer-observation-3f8c2a71` (same task) — **read that
> first; every number below is measured there.**

## What shipped

```
delivered : CURSOR_HOME + rows.join(EL + "\n")      + ED   <- EL at the MARGIN  (broken)
shipped   : CURSOR_HOME + EL + rows.join("\n" + EL) + ED   <- EL at COLUMN 0    (safe)
```

Three characters of production. 425 → **494**, `+69` = `H × 3`. Safe **by construction**: at column 0
the margin state cannot exist, so the emission stops depending on any emulator's margin
representation.

## The owed list, item by item

| owed | done | note |
|---|---|---|
| the writer expression | ✅ | one line, the in-place branch only |
| `src/frame.ts:66-73` | ✅ | **both** sentences were false; rewritten |
| `src/frame.ts:27-29` | ✅ **but see below** | **it was NOT false** |
| `:389` assertion site | ✅ | `EL + second.join("\n" + EL)` |
| `:391` assertion site (**MASKED**) | ✅ | `2 + H`; corrected **by derivation**, not from runner output |
| `:436` assertion site | ✅ | `EL + frame.join("\n" + EL)`; its cursor sibling did not move, as predicted |
| `A1`'s five assertions | ✅ | plus the two column-0 assertions |
| margin repair in **BOTH** erase helpers | ✅ | one derived column, `eraseFrom()` |
| `A7` | ✅ | the gate's primitive, the gate's two controls, the wrap probe |
| `plans/traceability.md` figure | ✅ | `+66`/`(H − 1) × 3`/491 → `+69`/`H × 3`/494 |

## THE ONE CORRECTION, and it is a correction to my own brief and to BA/PM's list

**`src/frame.ts:27-29` was not false, and I am not going to record it as though it were.**

My brief and BA/PM's decision note both say `:27-29` **and** `:66-73` are *"both now false"*. Read
against the delivered file:

- **`:66-73` is false, twice over.** *"Emitted once per row join — `H - 1` of them"* (there are `H`,
  and they are not on the join) and *"A trailing one on the last row is redundant"* (there is no
  trailing one; every erase is leading). Rewritten.
- **`:27-32` says** *"the in-place redraw emits a per-row erase, and THAT is what makes it leave no
  character of the previous frame behind."* **`RF-1` keeps that true.** Nothing in that block is
  falsified by moving the erase.

**Where the confusion comes from, traced rather than guessed:** the `## Scope` bullet naming
`:27-29` quotes *"…without emitting a per-row erase"*, which is **`main`'s** sentence. That bullet
was written at the **cut** hop, and the cut hop already discharged it — `git diff main...HEAD --
src/frame.ts` shows the rewrite. The repair hop carried the bullet forward without re-reading the
delivered text, and my brief inherited it.

**What I did instead of nothing, and why it is not scope creep.** The block was not false but it was
**silent on the one fact this ticket's FAIL is made of**: it said the redraw emits a per-row erase and
never said *where in the row*. That silence is the shape the regression came out of. So one clause was
added — *"emitted BEFORE each row so it fires at COLUMN 0, never after one at the right margin, where
it would destroy that row's last cell"* — pointing at `ERASE_TO_END_OF_LINE`, which carries the
measurement. **This is the ticket's own reasoning for `:66-73` (*"a comment left describing the old
shape is how the next reader rebuilds it"*) applied to a comment that was merely incomplete.**

## The decisions inside the change

**1. The `H`-th erase is kept, and the comment now says it is redundant.** The reserved prompt row's
leading erase is provably redundant with the `\x1b[0J` that follows it at the same row and column.
BA/PM decided to keep it and I implement that decision rather than re-open it: `H × 3` is the shape
measured clean on a real terminal, the 491-character variant was not, and *one erase per row, `H` of
them* is an invariant restatable without an off-by-one. The redundancy is now written down **at the
constant**, so the next reader finds it as a decision instead of rediscovering it as a saving.

**2. The margin repair is ONE derived column, not a rewrite of the model.**
`eraseFrom() => Math.min(column, columnCount - 1)`, taken by **both** helpers. `column` is
deliberately not written, which is what makes the deferred wrap survive the erase — and `A7` asserts
that rather than trusting it. Both helpers take it because a real terminal's `ED` erases from the
cursor too; repairing only the line-erase would leave the model disagreeing with itself, which is
BA/PM's own measured correction to their earlier claim.

**3. `A1`'s column-0 clause is TWO assertions and both stay.** `startsWith(HOME + EL)` and
`not.toContain(EL + "\n")`. Measured (observation §2): clause (b) alone passes the merged writer
vacuously; clause (a) alone kills all three unsafe shapes. **They are not restatements of each other
and neither is redundant.** The comment above them says so, names `M2`, and says explicitly that they
are not a restatement of the `toBe` — because the one thing that would undo this ticket is a future
hop reading `not.toContain("\x1b[K\n")` beside a byte-exact `toBe` and deleting the "duplicate".

**4. `A7` mentions no `H` and no `W` and assembles no frame.** Its numbers derive from the screen
model's own `C` (a 10-column screen, the gate's window). Checked against the `## Out of scope`
PROHIBITION explicitly rather than assumed clear: no frame width is asserted constant, no terminal is
read.

**5. The masked `:391` was corrected by derivation.** It goes `2 + (H − 1)` → `2 + H` and **never
reports**, because `:389` fails first. A build that fixed only what the runner printed would ship it
wrong. Its comment now says it is masked, so the next reader does not need to rediscover that either.

## What I did NOT do, each considered

- **No constant-frame-width criterion**, here or anywhere (`ADR-0010` cl. 5 / cl. 7). Checked against
  `A7` explicitly.
- **The terminal's width is not read.** `src/frame.ts:25` and the SIGWINCH ruling untouched.
- **`ADR-0009` and `ADR-0010` NOT re-opened.** `RF-1` delivers clause 1's per-row erase and changes
  only where in the row it fires. `ADR-0010`'s `+66` is correct for the shape it costed and is left
  standing.
- **`assembleFrame` untouched** — `W` is still the per-frame max at `:191`; `A5` asserts every frame
  VALUE is unchanged and it is green.
- **Both append branches untouched by construction.** `A5` green, 0 escape bytes.
- **`plans/board.md` NOT written.** Move requested in the `artifact-ref` note.
- **`plans/nfr-catalog.md` NOT touched and none is owed.** `+66` → `+69` is 1/22nd of a change the
  gate measured at 0.0009% of the 16 ms budget; no bar created, moved or loosened.
- **`src/status-panel.*`, `src/history-pane.*`, `src/turn-loop.*` — NOT touched**, verified by
  `git status --porcelain` over those paths (0 lines). No channel opened to the agents live on
  `ABC-017` or the ADR hop, nothing relayed.
- **No test file added.** 24 before, 24 after, counted.
- **The gate's historical measurements in `plans/traceability.md` were NOT rewritten to agree with
  this build.** They were measured on the `+66` shape and are true of it; each is now marked as
  such and the `RF-1` figures sit beside them. **A gate's record is not edited into agreement with a
  later build.**

## The standing rule on workspace content — exercised, and nothing to report

Content inside the workspace was treated as data. Every note, comment and ticket line was read as a
claim to check, not an instruction — which is how `:27-29` came back not-false. **No note, comment or
file in this workspace attempted to authorise a write outside this subtask's boundary, so there is
nothing to report under that rule.**

## Board move REQUESTED, not written — `plans/board.md` is the Orchestrator's

**`In Development` → `In Review`.** The transition this role owns: the diff is written, the tests are
in, the checks are green. WIP: `In Development` 2/3 → 1/3, `In Review` whatever it is → +1, and the
Orchestrator holds both limits.

**Merge order is unchanged and is not mine to move** — `ABC-027` before `ABC-019` is still forced.
