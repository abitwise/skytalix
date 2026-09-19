---
id: 20260919T110500Z-architect-design-decision-shape-b-is-ruled-two-arms-eight-states-eighteen-transitions-and-the-pull-order-a4f83d02
kind: decision
by: architect-design
at: 2026-09-19T11:05:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-102
  - ABC-112
  - ABC-045
  - ABC-019
  - ABC-021
  - ABC-035
  - ABC-037
  - ADR-0021
  - ADR-0002
  - NFR-002
  - NFR-008
  - src/turn-loop.ts
  - src/command-input.ts
  - src/line-input.ts
supersedes:
---

# RULED: shape (b). Two arms, eight states, eighteen transitions; confirmation is the seam's; `resign` stays separate — and the pull order

Full reasoning, alternatives and falsification triggers are in
`memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md`. This note is the
hand-off summary; the ADR is the authority. **NOT A STAMP** — an agent's transcription of the owner's
word, recorded as a `decision` because no `finding` is admissible here.

## The owner's word, verbatim (authority note, ruling 5)

> "5. b, resign should be separate" — Olger Oeselg, project owner, in session, 2026-09-19

## The arm, in two sentences

`PromptOutcome` gains `{ kind: "quit" }` (transition 17: `awaiting-human` → `exiting`, one exported
`QUIT_NOTICE` line that is not `INPUT_ENDED_NOTICE`, no frame, `{ result: null, reason: null,
exitCode: 0 }`) and `{ kind: "take-back"; plies; messages }` (transition 18: `awaiting-human` →
`evaluating-terminal`, `takeBack(history, plies)` then the one derive transition 14 already makes,
then `rendering`). `LoopOutcome` and `TerminalReason` do not change; the `quit` confirmation is a
per-session flag in the command layer, not a loop state; `new` is a take-back of `moves.length`
plies and `undo` a take-back of 2 with the `< 2` refusal as a `command` message.

## State-machine delta

States **8 → 8**. Transitions **16 → 18** (17 `quit`, 18 `take-back`). Two record sentences narrow:
"not re-evaluated on a non-**advancing** outcome" → "on a non-**mutating** outcome (7, 8, 9, refused
claim)"; cadence `1 + plies + take-backs + re-emitting non-mutating outcomes`, and `quit` like `eof`
re-emits nothing.

## Cost of re-opening `src/turn-loop.ts` — measured, not argued

+16 lines; **zero existing tests red** (40 / 1213 green with the arms in place — sibling
`observation` note). The cost is that the two new edges are unguarded until the arm ticket writes
the rows `ADR-0021` clause 9 names; the no-re-evaluation mutant was watched red on the take-back
rows and green on the quit rows.

**Reds by ticket, named:**

- **Arm ticket (to be cut by BA/PM):** none existing. Docblocks at `src/turn-loop.ts:104-124`,
  `:155-173`, `:246-262` must be re-worded in the same change.
- **`ABC-046`:** `src/command-input.test.ts` → `ABC-035 fences — grammar only` → *"no token carries
  an effect: `quit` and `board` are outcome-identical and payload-free"* (`:486-495`) — superseded,
  recorded on `ABC-046`'s page. `src/line-input.test.ts` `A4`/`A5`/`A7` delegation spies may need
  re-pointing if the wrapper changes the call at `src/line-input.ts:243`; `resolvePromptLine` stays
  pure and exported so they need not.
- **`ABC-102`:** none beyond adding a table row (`help` is folded from the table by construction).
- **`ABC-112` if delivered:** the four-token half of `ABC-035` `A4` — which is why it should not be.

**Must NOT change:** the eighteen scripted rows and frame counts; `A3b`, `src/turn-loop.nfr.test.ts`
(numbers unchanged, sentence narrows); `A8`, `A8b`, `A9`, `A9b`, `A10`, `A10b`; `A14`'s ten;
`ABC-021`'s transition-16 rows; `INPUT_ENDED_NOTICE`; `exitCode: 0`'s type; `src/cli.ts`'s single
exit-code assignment; `src/result-screen.ts`.

## DoR re-scored (pages updated for 046 / 102 / 112; 045's page NOT edited — not in this subtask's deliverables)

| ticket | was | now | what moved |
|---|---|---|---|
| `ABC-046` | 7/10 ⚠️×3 (ruling + 3 orderings) | **8/10 ⚠️×2** — items 3 and 10, BOTH the same fact: **the arm ticket is uncut and must land first** | ruling CLOSED; `ABC-035`/`ABC-037`/`ABC-043` all `Done`; `A3` stands as written; `A8` amended to license one call-site line in `src/line-input.ts` |
| `ABC-102` | 7/10 ⚠️×3 (ruling + `EPIC-004` + 3 orderings) | **8/10 ⚠️×2** — items 3 and 10, the arm ticket | ruling CLOSED; **`EPIC-004` blocker CLOSED** — `ABC-078` is `Done` and `src/cli.ts:175` wires the real `EngineSeam`; `ABC-035`/`ABC-037`/`ABC-043` `Done` |
| `ABC-112` | 9/10 ⚠️×1 | **9/10, and MOOT** — its own pre-registered trigger fired | it is now a **one-line dependency on `ABC-046`** (`ABC-046` flips nothing — `quit` simply becomes true). Recommend **cancel, not deliver**, when `ABC-046` is pulled; `P3` per its page. Board move is the Orchestrator's |
| `ABC-045` | 8/10 ⚠️×2 (orderings only) | **10/10 by the record** | `ABC-035`/`ABC-037`/`ABC-043` all `Done`; no contract question ever. Page untouched here — BA/PM's pen to stamp |

## Pull order, recommended to the Orchestrator

1. **`ABC-045`** — XS, uses the existing `game-over` arm, no dependency on `ADR-0021`; pullable now.
2. **The arm ticket** — BA/PM cuts it (id not guessed): `src/turn-loop.ts` + `src/turn-loop.test.ts`
   only; transitions 17/18; `60-progress.md` § Known UNCUT work row 5 retires at the cut.
3. **`ABC-046`** — `quit` (confirmation wrapper, `QUIT_NOTICE` inequality) + `new`.
4. **`ABC-102`** — `undo`.

`ABC-045`, `ABC-046`, `ABC-102` all edit `COMMAND_TABLE` and `src/command-input.test.ts`: sequential,
never parallel. `ABC-112`: cancel when `ABC-046` is pulled.

## What this ruling does NOT do

Moves no ticket on the board. Cuts no ticket. Touches no file under `src/`. Changes no NFR bar
(`NFR-002` untouched — a take-back's derive is per command, not per ply; `N8-LANE` inherited by name;
`NFR-008` remains `ADR-0014`'s breach). Does not decide `QUIT_NOTICE`'s literal, the confirmation
item's wording, or `undo`'s refusal wording — those are the arm ticket's, `ABC-046`'s and `ABC-102`'s.
