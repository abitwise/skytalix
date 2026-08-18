---
task: repair2-ABC-033-2026-08-18
subtask: abc033-repair2
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
ref: .grugops/context/repair2-ABC-033-2026-08-18/
parent_ref: .grugops/context/quality-gate-ABC-033-delta-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T17:00:00Z
branch: grugops/abc033-repair2
base: grugops/quality-gate-ABC-033-delta @ 723c65b
---

# Subtask: `ABC-033` repair round 2 of 2 — a FALSE SENTENCE in production source, and two record overclaims

**This is the LAST repair round** (`quality.self_fix_attempts` = 2). It is deliberately tiny.
**ZERO behaviour change.** If you find yourself changing what the module accepts or returns, stop —
you have exceeded this brief.

Branch off `grugops/quality-gate-ABC-033-delta` @ `723c65b`. Read `parent_ref:` — six QE notes.

## 1. `src/move-input.ts:199-203` states a falsehood. This is the whole reason for this hop

The comment claims **"no line can make both claim a move and no line can tell the two orderings
apart by its outcome."** QE falsified it and **I reproduced the counterexample first-hand** before
sending this:

FEN `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` (white pawn b2, white bishop d2), input **`B2b4`**:
- `parseCoordinateMove` returns a move: **`b4`** (pawn double push)
- `parseSan` returns a move: **`Bb4`** (rank-qualified bishop)
- the module returns **`b4`**

Both readers claim a move, and **they claim different moves**. The cause: `parseCoordinateMove`
lowercases before matching, and of `N B R Q K` exactly one — `b` — is also a file letter.

**Correct the comment to say what is true.** The order is not a tie-break over a disjoint space; it
is a **real precedence** that decides `B2b4` in the coordinate reader's favour. Say that, and say
why that answer is the right one (a shift-slipped coordinate typist meant `b2b4`).

**Do not change the precedence.** Coordinate-first is correct and QE agrees; only the explanation
is wrong.

## 2. Make `M12` killable by a real input

QE's `M12` (swapping the attempt order) currently reds only through an injected-seam test. **It is
killable by a plain real-input test with no stubs** — `B2b4` on the FEN above. Add it. A guard that
only bites through a stub is weaker than one that bites on a string a player can type.

QE also found a wider `B`-initial sweep: **10 both-claim inputs across four positions, 9 benign
(same move), `B2b4` the one where they differ.** You may pin more than one row if it is cheap; one
is sufficient.

## 3. Two record corrections — your own notes, and be exact

- The `G5` note says the disjointness claim is *"unproved"* and carries `confidence: high`. **It is
  not unproved — it is FALSE.** Append a correcting note (notes are append-only; do not rewrite).
  Say plainly that a prior hop's `confidence: high` was wrong and what the counterexample is.
- The `G2` claim *"widens what is asked, never what is accepted"* is quoted as though the rejection
  arm were untouched. QE found variant 4 also flips rejections **`unreadable` → `no-such-move`**,
  one-way, never the reverse — correct behaviour, but a changed class the sentence hides. **Record
  it.** Do NOT quote QE's 97,716-line count as blast radius; it is a property of QE's corpus.

## What you may NOT do

- **No behaviour change.** No new accepted input, no changed precedence, no new rejection code.
- **`A7` still binds**: `src/move-input.ts` and `src/move-input.test.ts` only.
- Do not touch `src/san.ts` or `src/coordinate-move.ts` — the `b`-is-also-a-file collision is
  **pre-existing, on the exact-as-typed path, and predates `G2`**. If you think it deserves a
  ticket, say so in a note and I will route it. Do not fix it here.
- Do not pin the `E8=Q+` suffix residue by test — QE agreed with leaving it unpinned so `ABC-032`'s
  grammar owner is not fought. **But note QE's correction: the residue is larger than the 14
  enumerated strings** (every `#` spelling, plus the bishop/knight and `exf8` families). Size it
  from the RULE, not the list, if you mention it.
- Do not merge, do not deploy, do not move a board column.

## Gate

Full blocking gate, contained lane. Baseline **1047 tests / 36 files, skip 0** — your additions
should raise the test count and change nothing else. Re-run **M12** and show it now reds **without
stubs**. Record the mutant diff.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc033-repair2`.

Commit on `grugops/abc033-repair2`, never on `main`.
