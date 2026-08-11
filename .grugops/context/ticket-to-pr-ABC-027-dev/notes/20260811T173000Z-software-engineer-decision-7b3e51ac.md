---
id: 20260811T173000Z-software-engineer-decision-7b3e51ac
kind: decision
by: software-engineer
at: 2026-08-11T17:30:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-dev
  - ABC-027
  - ABC-018
  - ABC-019
  - ADR-0009
  - ADR-0010
  - EPIC-002
  - src/frame.ts
  - src/frame.test.ts
  - plans/tickets/ABC-027-frame-writer-clears-each-row.md
  - 20260811T163000Z-ba-pm-decision-3a91c7d4
  - 20260811T163500Z-ba-pm-observation-8e2b0f56
supersedes:
---

# Six choices the criteria left to the build, decided here with the rejected alternative named

> **Hand-authored, and saying so as instructed.** `scripts/context-io.ts` does not exist in this
> repository or in the kit, and `mcp__grugops__propose_note` is not in this session's tools.
> Workflow 16 names `context-io.ts` as the only sanctioned writer; it is absent, so these notes were
> written to the `notes/` path directly, in the same shape and by the same route the Architect's and
> BA/PM's notes on `ADR-0010` and on this ticket's cut took. **NOTHING in this task's notes is a
> `finding`** — no verification stamp is issuable to this role and none is claimed.

The ticket did the hard thinking: it named the expression, the constant, the header sentence, the
five assertion sites and the FORM of `A2`, and it built the whole change out of tree first. Six
things were still left to the build. Each is decided here with what it rejects.

## 1 — the erase goes in the JOIN SEPARATOR, not appended per row

`sink.write(`${CURSOR_HOME}${frame.join(`${ERASE_TO_END_OF_LINE}\n`)}${ERASE_TO_END_OF_SCREEN}`)`.

**Decided:** join the rows with `\x1b[K` + newline. The erase lands AFTER each row's content and
BEFORE the newline, which is the only order that clears rightward residue — the cursor must be at the
end of the freshly written row when the erase fires.

**Rejected:** `frame.map((row) => row + ERASE_TO_END_OF_LINE).join("\n")`. It is the same idea and it
emits `H` erases instead of `H − 1`, putting a redundant one on the reserved prompt row that
`\x1b[0J` already clears. `ADR-0010` clause 1 measured that trailing erase redundant and declined it;
`A1` asserts `H − 1` and would fail this shape. It also breaks the cursor-position criterion's
arithmetic at `:419`, which slices the body between the two known constants.

**Rejected:** clearing only when the frame narrows (`ADR-0010` alternative D). Not mine to re-open —
the ADR rejected it — and the ticket puts it in `## Out of scope`.

## 2 — the constant is named and shaped like the two beside it, and it carries its own reason

`ERASE_TO_END_OF_LINE`, next to `CURSOR_HOME` and `ERASE_TO_END_OF_SCREEN`, with a doc comment in
the same register as `ERASE_TO_END_OF_SCREEN`'s: what the sequence is, why it is needed, how many are
emitted, and why the last row does not get one. `AGENTS.md` rule 11 — match existing style.

**Rejected:** inlining `"\x1b[K"` at the call site. The module's own convention is that every escape
it emits is a named constant, and the Security posture recorded on `ABC-018` (*"the only escape
sequences in the output are the two this module emits itself"*) is now three, which should be
readable from the constant block rather than from a template literal.

## 3 — the header sentence is CORRECTED, not deleted

`src/frame.ts:27-32`. The false clause was *"…padded to exactly `W`, which is what makes an in-place
redraw leave no character of the previous frame behind **without emitting a per-row erase**."*

**Decided:** keep the padding claim (still true and still load-bearing — each row still overwrites
its predecessor in full), state the measured reason it is not SUFFICIENT (`W` is a per-frame max, so
it shrinks when the widest row does), and name the ruling that supplies the rest. The module stated a
broken invariant as a fact; it now states the true one.

**Rejected:** striking the sentence. It is the only place in production code that explains why the
frame is padded at all, and deleting it would lose the reason the padding exists along with the part
that was wrong.

**NOT touched, deliberately:** the *"the frame is a session constant by the epic's SIGWINCH ruling"*
sentence above it, and the `beginFrameSession` doc comment's account of the erase clearing
`EPIC-003`'s echo. Both are still true, neither is this ticket's, and rule 9 says leave adjacent
prose alone.

## 4 — `A6` is a RETITLE-AND-FLIP, and the discharged test carries its own history

`src/frame.test.ts` — the test formerly titled *"CHARACTERIZES: `W` is recomputed per frame, so a
narrowing frame leaves the wider one's tail"*.

**Decided:** the fixture, the session, the screen, both width assertions and the `stale` computation
survive byte-for-byte; the title becomes *"DISCHARGED by `ABC-027`…"*, the expectation flips from the
residue to `[]`, and the comment RECORDS what happened — that this was a tripwire which said in its
own words it *"fails loudly the day someone changes it"*, that its own routing was *"BA/PM +
`ABC-016`/`ABC-017`"*, and that the routing arrived as `ADR-0010` clause 1. The old expectation is
kept in the comment as the thing that no longer shows.

**Rejected:** deleting the test (coding rule 12, and `A6` forbids it in terms). It is the only place
in the merged suite that constructs a narrowing, and deleting a test a ruling has just discharged is
how the reason a property is checked gets lost.

**Rejected:** inverting it silently — flipping `toEqual([...])` to `toEqual([])` while leaving the
title saying CHARACTERIZES. It would pass and it would leave the suite claiming the defect is still
there.

**Note on its FORM, so nobody reads it as a precedent:** this test compares UNTRIMMED at a screen
width equal to `W`(frame 1) — form `F2` at the artificial width. That is sound *here* because the
padEnd target is the screen's own width and the test is proving a specific previously-observed
residue is gone at the width where it was observed. It is **not** reusable as a general narrowing
criterion, and `A2` is what that has to be.

## 5 — `A2` and `A4` share ONE comparison function, so "the false-positive control" is literal

`screenEqualsFrameAfterEveryRedraw(frames, columns)` — one session, one screen, compare after EVERY
redraw with trailing spaces trimmed on both sides.

**Decided:** factor it. `A4`'s whole job is *"`A2`'s comparison holds with no failure"* on a steady
pair, and a second hand-written copy could drift from the form it is supposed to be controlling. Two
callers, so it is not the single-use abstraction coding rule 6 forbids.

**Rejected:** a helper that also owns the narrowing assertion. That belongs to `A2` alone — `A4`'s
pair does NOT narrow, by construction, and folding the two together would make `A4` unwritable.

## 6 — `A5`'s VALUE half is asserted as "no escape byte ever enters a frame value"

The criterion says *"given any `assembleFrame` call, its returned rows are unchanged by this
ticket"*, which cannot be asserted against a build that no longer exists.

**Decided:** assert the property that makes it true and that a wrong build would break — the clearing
lives in the WRITER and never in the value, so no frame carries an escape byte, every frame is still
`H` rows, the reserved prompt row is still `""`, and every other row is still exactly `W` wide. Run
over the plain fixture AND all four narrowing frames.

**Rejected:** a golden-file snapshot of the merged frames. It would pin the fixture rather than the
property, and `ADR-0010`'s `## Rollback` already states the byte-identity claim — what a test can add
is the structural reason it holds.

**Rejected:** comparing against a re-implementation of `assembleFrame` in the test. That is a second
implementation to keep correct, and it would pass for both a correct and a broken assembler.
