---
task: ticket-to-pr-ABC-013
subtask: ticket-to-pr-ABC-013-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/ticket-to-pr-ABC-013/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T12:45:00Z
branch: grugops/ticket-to-pr-ABC-013
---

# Subtask: break `toSan` — and be the FIRST independent check the 52 expected strings have ever had

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Seventeen notes carry the acceptance repair, the build, the red-before-green record, the engineer's
own ten-mutant set and every hop's explicit list of what it did NOT check.

## The one thing that makes this hop different

**Nobody has independently checked whether the 52 expected SAN strings are RIGHT.**

BA/PM hand-typed them and corroborated them with a reference build it wrote itself. The engineer
re-derived all 52 by hand before implementing and got agreement — but that is a second hand-derivation
by a reader who had already seen the table, and the same person wrote the derivation and the code, so
**a SAN rule either of them has wrong is wrong in both places and the agreement proves nothing about
it.** Both said so in their own notes.

`ABC-023` is the precedent and it is exact: a table validated by the instrument of the role that wrote
it, then an independent QE harness found **fourteen** builds that passed every criterion and the whole
suite. Expect that shape.

**The engineer named where to attack first**: whether disambiguation is decided over **legal** rather
than pseudo-legal moves (`A7`) — implementations in the wild genuinely differ, and it is the one row
where a reader could disagree with the *rule* rather than the arithmetic. `Q1e1`, `Qee1`, `Ne4` and
`exd6` are the rows BA/PM would attack first.

If you conclude an expected string is **wrong**, that is a finding about the CRITERIA, not
automatically a defect in the code. Say which. Do not edit a row to match the code or the code to
match a row without saying so loudly.

## What is already proven, so you do not redo it

The Orchestrator independently verified all 18 acceptance FENs and the benchmark `P60` against the
repo's own `parseFen`/`legalMoves`/`toFen` — they parse, round-trip byte-identically, are legal, and
contain the named moves. **The positions are not where the risk is. The notation is.**

## Do

- Mutate and restore. Record `src/san.ts`'s md5 before and after and prove you left it identical —
  this board checks that on every ticket, because a gate that repairs the thing it measures is not a
  gate.
- Hunt builds that pass **all 22 criteria and the whole 652-test suite** and are still wrong. The
  engineer found two such classes himself (a build ignoring the supplied `legal` list; one running the
  mate test on every move) — both invisible to all 52 rows. Assume there are more.
- Probe the corners no criterion names: `A22` covers the suite, but consider ambiguity involving
  promotion pieces, three-or-more rivals on one axis, disambiguation interacting with capture and
  check simultaneously, and pawn-capture disambiguation when two pawns can take the same square.
- Re-run the gate yourself: `npm test`, skip count, `npm run lint`, `npm run typecheck`,
  `npm run build`.

## Do not

- Do not modify `src/san.ts`. If it is wrong, report it — the fix is the engineer's.
- Do not modify any pre-existing test. The delivered diff is three NEW files and 628 insertions with
  zero deletions; keep that property true.
- Do not re-open `ADR-0004`. Do not write `parseSan`.
- Do not merge, do not deploy.

## Publish

Typed notes per Workflow 16 into `ref:` — hand-authored markdown in the established layout (no
`scripts/context-io.ts` in this repo; the gap is on the record). A `finding` needs a real
verification stamp; if you have none, record an honest `claim` with `confidence`. State your mutant
count, how many survived, and — separately — how many survivors were gaps in the CRITERIA versus
defects in the CODE. The `In Review` exit is yours. Mark this subtask done per Workflow 17.
