---
task: security-nfr-ABC-066
subtask: security-nfr-ABC-066
role: security-nfr
workflow: agent-factory/workflows/07-security-nfr-review.md
ref: .grugops/context/security-nfr-ABC-066/
parent_ref: .grugops/context/quality-gate-ABC-066-qe/
ticket: plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T00:30:00Z
branch: grugops/security-nfr-ABC-066
base: grugops/ticket-to-pr-ABC-066 @ 8fb6ff1
---

# Subtask: the Security/NFR gate on `ABC-066`

**Read `parent_ref:` FIRST — QE's five notes — then the implementing hop's five at
`.grugops/context/ticket-to-pr-ABC-066/notes/`.** Both are on disk; I am relaying nothing. QE
returned `READY_FOR_HUMAN_REVIEW`, all six criteria MET, with six gaps (0 HIGH, 2 MEDIUM, 4 LOW).
**Do not re-derive what those ten notes already measured.**

## Why you were called, in the ticket's own words

`ABC-066` § Security / NFR triggers **argues itself quiet and then says the opposite**: it works
`ABC-041`'s clause (b) in detail — *"(b) does not fire on its own subject, which is CAPABILITY, not
file-touched"* — and closes with **"Disputed either way, it fires and the gate resolves it."** So it
fires, and you resolve it. **You are not here to rubber-stamp the ticket's own analysis; you are here
to check it.** If the ticket's reading of clause (b) is wrong, say so.

## What to examine

1. **`ABC-041`'s four clauses, each answered on its own terms** — the ticket answers all four and
   claims (b) turns on capability rather than file-touched. **That is the reading to test.** This
   ticket DOES change a production module (`src/cli.ts`), which is the first time in this follow-up
   set that clause (b) has a live subject.
2. **The changed bytes are user-facing prose written to stderr.** `ABC-042`'s **bar 3** governs the
   ECHOED TOKEN and `printableOf`. The ticket says neither is touched and the new text contains no
   user input. **Verify that, do not accept it** — a usage string is the one place where program text
   and user-supplied text sit on the same line.
3. **Capability, measured not asserted**: no new Node builtin import, no new `process.` read, no
   `spawn` / `exec` / `fetch` / `eval` / `new Function`, `spawned` still **10**.
4. **`N8-LANE` ≤ 650 ms.** The engineer measured **+70 ms against a +100 ms identity-null control** —
   i.e. below its own noise floor — and QE deliberately did **not** re-run the paired instrument and
   said so. **Rule on whether that figure is good enough to carry, or re-run it.** Note the honest
   caveat already on the record: the null floor that session was degraded by parallel work.
5. **`NFR-002`** — the ticket says untriggered because a refusal writes no frame row and `src/cli.ts`
   exports nothing. Confirm or deny.
6. **QE's `Q1`/`Q2` are MEDIUM and both concern the shared helpers**, not the product. Say whether
   either is a security or NFR concern in your reading, or purely a test-robustness one.

## Hard limits

- **Read-only on `src/`.** If you find a defect, report it; the fix is a new hop. Do not edit
  `src/cli.ts`, `src/cli-options.ts` or `src/cli.test.ts`.
- **Do not edit `AGENTS.md`** — `ABC-065`'s half is live and unmerged on another branch.
- **Do not write `plans/board.md`, `plans/traceability.md` or `plans/nfr-catalog.md` rows for this
  ticket** — the first two are mine; if the NFR catalog needs a row, propose it and I will route it.
- **Do not merge, push or deploy.**
- **`security.block_on` is `high`.** A HIGH finding blocks the merge; anything lower is recorded with
  its residual risk named and does not.

## The tree hazard — three hops have now hit it

**One working tree, one git index, and the files being disjoint does not make the index disjoint.**
Take a linked `git worktree` for your branch; stage with **explicit pathspecs**; never `git commit
-a`, never a bare `git add -A`.

## Stop conditions

- A criterion needs re-wording → stop, route to BA/PM.
- A merged `ABC-042` row would have to move → stop and route to me.
- You reach a HIGH you cannot resolve → stop and escalate; do not soften it to MEDIUM to let the
  merge through.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one, and do not read QE's green as
a stamp (QE's `Q5` records exactly that limitation). Claim per Workflow 17 by hand: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/security-nfr-ABC-066/`, and write `claim.md` inside it.

Report: a clear PASS / PASS-WITH-FIXES / FAIL, each of `ABC-041`'s four clauses answered
individually with your own measurement, your ruling on the lane figure, your ASVS-L1 reading, and
every finding with severity, residual risk and owner.
