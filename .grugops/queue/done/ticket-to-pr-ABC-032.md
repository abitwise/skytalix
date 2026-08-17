---
task: ticket-to-pr-ABC-032-2026-08-17
subtask: ticket-to-pr-ABC-032
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-032-2026-08-17/
parent_ref: .grugops/context/ticket-to-pr-ABC-032-2026-08-17/
ticket: plans/tickets/ABC-032-parse-san.md
enqueued_by: orchestrator
enqueued_at: 2026-08-17T21:35:00Z
branch: grugops/abc032-parse-san
base: main @ bf371d7
---

# Subtask: `parseSan` — SAN resolved against the legal move list, three closed outcomes

Read the ticket. Read `ref:` — it holds ONE Orchestrator note, the criteria re-read against the
built tree at the `Ready for Dev` exit. **It names one live hazard (`G1`): `ABC-031` merged
`src/coordinate-move.ts` into this ticket's neighbourhood AFTER the page was cut. Read that module
before you write — for its reject vocabulary and its reference-identity convention — and do not
edit it.** Nothing from that note is restated here.

## Hard limits on this subtask

- **`toSan`'s body is not changed.** `A6` scores this at line level with `git diff -U0`. If you
  believe `toSan` must move, STOP and say so — it is a new ticket, not this diff.
- **No line of `src/san.nfr.test.ts`, `src/san.qualifier.hardening.test.ts` or
  `src/san.suffix.hardening.test.ts` is modified or deleted.** Three merged guards; protect them by
  identity.
- **Reference identity is the assertion, not deep equality** — `ADR-0004` (2b), and `A1` is
  unfalsifiable without it. `parsed.move === move`, never `toEqual`.
- **`A7`: ONE table.** The piece letters, the castle strings and the promotion letters each appear
  **exactly once** in `src/san.ts` and both directions use them. A second private table is the exact
  shape `ADR-0004` clause 2 exists to prevent and **no behaviour assertion above can see it**.
- **`A5` is totality: the call NEVER throws** — including on `null`, `undefined`, `42`, `{}`, `[]`,
  `""` and a 10,000-character string — and the two reject codes **never collapse to one**.
- **Read `ADR-0004`'s Status section before citing it.** Clause 2 was ratified by the Orchestrator
  under a quoted delegation, recorded there as **explicitly not precedent**.

## Definition of done for this subtask

`A1`–`A7` each answered with the verdict or number the criterion asks for, **measured, not
asserted** — including `A1`'s whole-corpus round-trip (six positions, every legal move, zero
exceptions), `A3`'s **exactly 2** candidates, `A4`'s **exactly 4**, and `A6`'s skip **0** plus
`PERFT_DEEP=1` **32/32**. Gates (`lint`, `typecheck`, `build`, `npm test`, test-integrity) run on
your branch tip and transcribed. Notes published per Workflow 16 under `ref:`, hand-authored per
`agent-factory/contracts/context-note.md` — **no `kind: finding`, no invented stamp; none is
emittable on this install** (`AGENTS.md`). Queue claim taken by hand per `AGENTS.md`.
**Do not merge — the Orchestrator re-runs the gate itself and holds the merge.**
