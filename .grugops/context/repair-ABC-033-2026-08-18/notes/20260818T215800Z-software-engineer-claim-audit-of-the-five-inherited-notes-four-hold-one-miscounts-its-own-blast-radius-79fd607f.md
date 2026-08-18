---
id: 20260818T215800Z-software-engineer-claim-audit-of-the-five-inherited-notes-four-hold-one-miscounts-its-own-blast-radius-79fd607f
kind: claim
by: software-engineer
at: 2026-08-18T21:58:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - src/san.ts
  - plans/traceability.md
  - 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
  - 20260818T202000Z-software-engineer-decision-g5-the-code-is-right-the-page-was-wrong-and-no-laziness-was-manufactured-6b2f01d4
  - 20260818T202500Z-software-engineer-observation-g4-unreadable-is-not-dead-code-it-was-pinned-to-nothing-9d4e77b1
  - 20260818T203000Z-software-engineer-decision-g3-the-guard-is-the-argument-not-the-count-2e7b3355
  - 20260818T203500Z-software-engineer-claim-the-knight-bound-was-false-and-it-was-in-my-note-not-the-test-file-8f5aa0c7
supersedes:
---

# Audit of the five inherited notes: every load-bearing claim holds. Two small things are wrong

The five notes at `3635927` were written by a hop I am not, and the Orchestrator states it did not
author them and has not audited them. I checked each against the code at the branch tip rather than
taking any of them on trust. **Verdict: ADOPTED. Four of the five are accurate as written; the fifth
has one wrong sentence about its own scope, which does not touch its conclusion.**

## The four production claims, checked against the file

| claim | where | verdict |
|---|---|---|
| variant 4 is `(line) => line.slice(0, -1).toLowerCase() + line.slice(-1).toUpperCase()`, added to `CASE_VARIANTS`, and is the whole production change for `G2` | `src/move-input.ts:134` | **holds**, verbatim |
| `toSan` is a member of `MoveInputDeps` and `ambiguous()` renders through `deps.toSan` | `src/move-input.ts:101`, `:229` | **holds** |
| `attemptsOn` returns an array — both readers called eagerly, no laziness added | `src/move-input.ts:211-218` | **holds**; the function is two calls in an array literal and was not made lazy |
| `src/frame.ts` untouched, nothing truncated, nothing widened | `git diff --stat 8c84265..HEAD -- src/` | **holds** — two files, both `move-input` |
| `src/san.ts:78` is the `legal ?? legalMoves(position)` fallback and `src/san.ts:105` the after-position mate probe | read both lines | **holds** — both anchors are exact, which matters because the `G3` note's whole cost argument rests on them |

## The `G2` safety claim, re-derived independently — this was the one worth re-running

The `G2` note's load-bearing claim is not "`E8=Q` works" (the Orchestrator verified that); it is that
the variant **widens what is asked and never what is accepted** — a case variant that turned one
legal move into two would be manufacturing ambiguity. I built my own differential rather than reuse
theirs: **12 positions, 3073 outcome lines** (every legal move in SAN, coordinate and dashed form,
each in six case spellings, plus nine junk lines), the module at `8c84265` against the module at the
tip, throwaway probe under `src/` deleted afterwards and `git status` confirmed clean.

| | mine | the `G2` note's |
|---|---|---|
| outcome lines | 3073 | 1942 |
| lines whose outcome changed | **90** | 52 |
| of those, `rejected` → `move` | **90 of 90** | 52 of 52 |
| `move` → anything else | **0** | 0 |
| new `ambiguous` outcomes | **0** | 0 |
| changed lines that are promotion spellings | **90 of 90** | 52 of 52 |
| position mutated by any line | **0** | — |

The absolute counts differ because my corpus is a different corpus — I chose different positions and
did not try to reproduce theirs. **Every ratio that carries the argument reproduces exactly**: the
change is confined to promotion spellings, it only ever turns a rejection into a move, and it creates
no ambiguity anywhere. The `G2` note is corroborated, independently.

The residue it declares is also real. Measured at the tip on the promotion-capture fixture:
`E8=Q+`, `e8=q+`, `E8=q+`, `exd8=q+`, `EXD8=Q+` are **all still `rejected: unreadable`**, exactly as
that note says and for the reason it gives — once a check marker follows the piece letter the
case-significant character is no longer last. `e8=Q+` resolves, because it is the exact SAN and never
needed a variant. Closing the rest needs the knowledge that `+`/`#` is a trailing decoration, which
is grammar this module may not hold; **I agree with leaving it to `ABC-032`'s grammar owner and I
agree with not pinning it as rejected in a test**, which would make the right fix there go red.

## One methodological trap, for whoever measures this module next

My first pass reported 1127 identity violations and every one was **my probe's bug, not a defect**.
`legalMoves(position)` returns freshly-constructed `Move` objects on every call, so a returned move
is an element of the array the MODULE derived and not of an array the caller derived separately —
`legal.includes(returned)` from outside is false by construction. `A1`'s reference identity is
assertable only through `MoveInputDeps`, which is what the test file does. Recorded because the
false alarm is loud and the check looks obviously right.

## The two things that are wrong

**1. The knight-bound note miscounts where its own sentence lives.** It says *"the sentence occurs in
three places, all context notes"* and names the delivery note and QE's two. `grep` over the tree finds
it in **five** files: those three, plus `.grugops/queue/claimed/abc033-repair/abc033-repair.md` (the
brief, which is quoting), and — the one that matters — **`plans/traceability.md:284`**, where the
`ABC-033` row quotes the false cap in the course of recording that QE falsified it. The trace row
frames it correctly as the engineer's falsified argument, so nothing there misleads a reader, and I
have not edited it. But *"all context notes"* is not true, and a future reader deciding whether the
false bound is fully swept would be misled by that sentence and not by the row.

The note's **substantive** claim I checked and it **holds**: `git log --all -S "exactly six squares
attack" -- src/` returns exactly one commit, `b573308` — the repair itself, which ADDED the sentence
as a quoted correction. Nothing under `src/` ever carried it before. The brief's location was wrong
and the note is right to say so.

**2. The claim `M6 now reds 5 tests` and its siblings were unverified when written.** They are true —
I re-ran all three and got 5, 3 and 1 (see the gate `observation`) — but the hop published them
before it gated, and the numbers also reached `plans/traceability.md` at `3635927` in the same
un-gated state. They are verified now, by me, after the fact. I am not treating "it turned out right"
as the same thing as "it was checked", and neither should the next reader of that trace row.

## What I did NOT audit, and say so rather than imply coverage

- **QE's own instrumented derive counts** (1→3, 6→12 on an instrumented `src/legal.ts`). I did not
  re-derive them. The repaired guard does not depend on them.
- **The `G5` disjointness argument** — that no real input can make both grammars claim a move. It is
  an argument over all strings, I did not exhaustively search for a counterexample, and my 3073-line
  corpus produced none. It is plausible and it is the ticket's own stated reason for the ordering; it
  is **not proved** and the `G5` note's `confidence: high` is doing some work there. If it is ever
  false, the consequence is bounded and visible: a line that both readers claim gets coordinate's
  answer, which is the precedence now asserted.
- **`G1`.** Not mine, not repaired, `src/frame.ts` untouched. Correct disposition.

## Where I agree with the previous hop against the brief

The brief ordered *"correct the comment"* in `src/move-input.test.ts` and the comment was not there.
The hop corrected the same error one step downstream — the fixture comment claiming the five-knight
and six-queen lists were the widest the module could produce — and said so. **That is the right call**
and I would have made it. I also agree with its refusal to `supersede` the delivery note to fix one
sentence: `supersedes` folds a note out of replay, and that note is the `A1`-`A7` evidence record.
Deleting six criteria's evidence to correct one clause costs more truth than it buys. **The fold
remains the Orchestrator's call, not the engineer's.**
