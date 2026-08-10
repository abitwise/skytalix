---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-013/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T11:38:14Z
branch: grugops/ticket-to-pr-ABC-013
---

# Subtask: build `src/san.ts` with `toSan` only, against a 22-criterion table whose positions are proven and whose strings are not

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Two Orchestrator decision notes and eight BA/PM notes carry the baseline, the acceptance repair and
its reasoning, the re-derived performance bars, and — most importantly — the explicit list of what
each hop did **not** check. Do not re-derive what is recorded; do re-derive what is disclaimed.

## What is proven for you, and what is not

**Proven, by the Orchestrator, independently, against the repo's own `parseFen`/`legalMoves`/`toFen`:**
all 18 named positions parse, round-trip byte-identically, are legal, and contain the moves the
criteria name. You may rely on the FENs. The benchmark position `P60` is likewise verified at 42
legal moves, 3 of them checks.

**Not proven: the 52 expected SAN strings.** They were hand-typed from the FENs and corroborated only
by a reference build written by the same role that wrote the rows — no external implementation, PGN
corpus or specification text was consulted. BA/PM named `Q1e1`, `Qee1`, `Ne4` and `exd6` as the rows
it would attack first.

**So: if your implementation disagrees with an expected string, that is a real fork in the road and
not automatically your bug.** Do not bend the code to match a row you believe is wrong, and do not
edit the row to match your code. Stop, write the disagreement up as a note at `ref:` with your
reasoning against the SAN rules, and say so in your report. A wrong expectation silently satisfied is
the worst outcome available on this ticket.

## The build

`## Scope` fixes the signature and the module's imports; `ADR-0004` clause 1 fixes its placement.
`toSan` only — **no `parseSan`**, which is `EPIC-003`'s and must not be foreclosed. Follow the inner
TDD loop in Workflow 04 step 3 (`quality.tdd` is `encouraged`); the acceptance table is the outer
layer and the double-loop rule applies.

Obtain every `Move` from `legalMoves(position)` selected by `(from, to, promotion)` — **never** a
hand-built `Move` literal. `ADR-0004` clause 2b is the reason and the ticket's Test notes state it.

Mind `N1`–`N4` while you build: `N1` is the primary bar, it is a ratio, and it is what the optional
`legal` parameter exists to deliver. The bars came from a build that allocates a rivals array per
call, so they are **ceilings you should clear comfortably**, not targets to approach.

## Do not

- Do not modify any existing test. `A22` requires the suite green at **625/625, skip 0** with no
  existing test changed; the baseline is measured on the branch tip and is in the context.
- Do not touch `src/legal.ts` or the rules core. Do not import `gameend.ts` or `history.ts`.
- Do not re-open `ADR-0004`, and do not edit the acceptance table to make a test pass.
- Do not merge, do not deploy, do not leave the branch.

## Publish

Typed notes per Workflow 16 into `ref:` — hand-authored markdown in the established layout (this repo
has no `scripts/context-io.ts`; the gap is on the record). Record your red-before-green evidence
honestly: report a row that was already green before your change as already-green rather than
claiming it as a kill. Update `plans/traceability.md` with the code and test links. Move the ticket
`In Development → In Review` when the gate is green — that exit is yours. Mark this subtask done per
Workflow 17.
