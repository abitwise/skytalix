---
id: 20260811T093000Z-software-engineer-decision-711ab45a
kind: decision
by: software-engineer
at: 2026-08-11T09:30:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ADR-0009
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# The six shape decisions the ticket left to the engineer, and the measurement behind each

> **Hand-authored.** `scripts/context-io.ts` — the sanctioned writer named by Workflow 16 — does not
> exist in this repo or in the kit, and `mcp__grugops__propose_note` is not among this session's
> tools. The recorded precedent for the same gap is
> `.grugops/queue/done/refinement-ABC-019/claim.md`, which says so plainly rather than pretending.
> **Nothing in this hop is a `finding`** — no verification stamp is issuable to me, so no note here
> claims one, and the gate results below are recorded as an `artifact-ref`, not as a verified result.

## 1. The render seam takes a FOURTH argument, and this is the one place I differ from the ticket's text

`## Scope` and `ADR-0009` clause 9b both write the seam as
`(GameHistory, GameStatus, thinking) => readonly string[]`, and the ADR adds *"the seam is not new and
its arguments do not change."* **Three arguments cannot satisfy `A5`.**

`A5` requires that on `ambiguous` *"the candidate list reaches the frame's message region"*, and test
note row 9 requires the same. The message region is `assembleFrame`'s (`src/frame.ts:160-184`) and it
is fed by `FrameParts.messages`. A seam that is handed only the history, the status and the thinking
flag has **no channel** for a rejection line or a candidate list — and `## Scope` itself says there is
no second one: *"the rejection line and the ambiguity candidate list live in the frame's own message
region … and there is no second output channel."*

**What settles it is the ticket's own sentence, not my preference:** *"**The loop supplies the render
seam everything it draws, and the render seam derives nothing.**"* The message region is drawn. A
three-argument seam would have to derive it, which that sentence forbids. So the built seam is
`(GameHistory, GameStatus, thinking, readonly string[]) => readonly string[]`.

**This touches no clause of `ADR-0009` clause 9.** Clause 9's ruling is about the ROW COUNT crossing
the seam, not the argument list: the loop still declares no count, imports no panel, does not import
`frameHeight`, and takes its height as `firstFrame.length`. The three panel inputs are unchanged and
the return is unchanged.

**Flagged for BA/PM, not taken:** the ticket states the signature in two places and both are one
argument short of what `A5` needs. That is a text defect, and amendments are BA/PM's.

## 2. The module names `src/turn-loop.*` are ACCEPTED as pinned, with no substantive objection

The Orchestrator pinned them for collision avoidance under concurrency and flagged that they are its
own and not the Architect's. The ticket names no module. I have no substantive reason to differ:
`turn-loop` describes the component `## Scope` describes, nothing in merged `src/` collides, and a
rename later is cheap. **No rename requested.**

## 3. The height is derived, and `beginFrameSession` is called once — structurally, not by convention

`writer ??= beginFrameSession(sink, frame.length)` is the whole mechanism. The `??=` is what makes
"exactly once" a property of the code rather than a rule someone has to keep, and `frame.length` is
`ADR-0009` clause 9a's `firstFrame.length`. The loop holds no height variable at all, because it
never needs one after the session exists — which is also why it cannot pad or truncate to one.

**Measured rather than argued** (see the `artifact-ref` note's mutation matrix): a literal `19`, tuned
to shape `A`, is RED on `A18` and `A19` under shape `B`; a per-frame session is RED on `A19` (a);
padding every frame to a declared height is RED on `A19` (c)/(d).

## 4. Only the ENGINE seam's throw is caught, and that is narrower than `## Scope`'s sentence

`## Scope` says *"on any exception thrown by either seam, the position is rebuilt by replay."* `A9`
is only about the engine seam, and **`A14`'s enumerated terminal-reason set has no input-side
value** — there is `engine-threw` and `engine-failure` and nothing for a parser that explodes. A
symmetric handler could not name its reason without inventing a tenth value that `A14` does not
enumerate, which is a feature beyond what was asked (coding rule 5).

So the input seam's exception propagates to `EPIC-006`. **Flagged for BA/PM:** `## Scope` and `A14`
disagree by one value. Either the sentence narrows to the engine seam, or `A14` gains an input-side
reason. I did not choose for them.

## 5. `A3b`'s count is `plies + 1`, not `plies`, and the extra one is the machine's

`A3b` reads *"exactly once per ply."* Transition 2 of the ticket's own table is
`evaluating-terminal` → `rendering`, *"the status is computed — **always**, terminal or not"*, and
transition 1 puts it before the first frame. So a correct loop evaluates once at startup and once per
ply: **`plies + 1`**. That is what the suite asserts, at 40, 120 and 300 plies.

The criterion's INTENT — one derive per ply, zero on a non-advancing outcome — is met exactly. Its
arithmetic is off by the one evaluation the state machine mandates. **Flagged, not amended.**

## 6. The glyph mode is NOT a loop parameter; the human's colour is

`## Scope` lists both as parameters. The colour is one (`A1`/`A1b` turn on it). The glyph mode is not:
under `ADR-0009` clause 9b frame composition lives **entirely behind the render seam**, and
`## Out of scope` says the loop composes no frame. `EPIC-006` binds the mode into the seam closure,
exactly as it binds it into `renderBoard` and `assembleFrame` today. A `mode` parameter the loop never
reads would be dead code (coding rules 5 and 7).

The half of that sentence that binds is honoured: **the loop discovers neither and defaults neither.**
It reads no `process.env`, no `process.stdout`, and has no default colour.

## What was NOT decided here

- No dependency changed, no merged module was edited, and `src/gameend.ts` is untouched (`A14`).
- `src/status-panel.*`, `src/frame.test.ts` and `plans/board.md` were not created or edited.
- `ADR-0009` was not re-opened, and option **G** (a shared `src/panel-stubs.ts`) was not built — both
  stub panels are local functions in `src/turn-loop.test.ts`, per clause 9c.
- The rebase onto the two merged panels and clause 9f's real-panel re-gate are a later hop's.
