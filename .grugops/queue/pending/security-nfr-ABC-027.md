---
task: abc027-secnfr-2026-08-11
subtask: security-nfr-ABC-027
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/security-nfr-ABC-027/
parent_ref: .grugops/context/abc027-secnfr-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T23:15:00Z
branch: grugops/ABC-027-frame-clearing
worktree: ../cli-chess-ABC-027
---

# Subtask: Security/NFR gate on `ABC-027` — and one `UNKNOWN - verify` risk that is the real question

`ABC-027` changes **merged production code every frame in the product passes through**, adding
**+66 characters per frame** (`(H − 1) × 3`). QE returned PASS_WITH_RISKS: 14 genuine mutants, 14
killed, zero survivors, **zero code defects**.

Read `parent_ref:` first, then QE's four notes in `.grugops/context/quality-gate-ABC-027-qe/notes/`
— **its `claim` note carries the open risk** — then `plans/tickets/ABC-027-frame-writer-clears-each-row.md`,
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` (accepted; **do not
re-open**), and `plans/nfr-catalog.md`.

## The question this gate exists for on this ticket

**`ABC-027` makes `\x1b[K` fire at the RIGHT MARGIN on every row. Before it, the only escape was
`\x1b[0J`, emitted once at column 0 — never at the margin.** So the screen model's margin
representation became load-bearing **for the first time, and it has never been measured.**

Two readings, disagreeing by **9 rows per frame**:
- The test model lets `column` run to `columnCount` (one past the last cell), making the erase a
  **no-op**.
- A VT/xterm keeps the cursor at `columnCount − 1` with the wrap-pending flag, and `EL(0)` erases
  from the cursor — **that last cell**.

**Under the second reading, at a terminal exactly `W` wide the delivered writer loses the entire
h-file of the board plus its label** — and unlike the defect this ticket fixes, that would hit
**every** frame, not just narrowing ones. The suite's `:379`, `:408`, `:426` and `A6` all construct
screens at exactly `W`, so its strongest assertions rest on the one behaviour nothing has measured.

**QE marked this `UNKNOWN - verify` and refused to fabricate a terminal. Do not fabricate one
either.** What is wanted is a *risk disposition*: bound it, name an owner and a trigger, or say
plainly that it cannot be bounded here — which is a legitimate stop and better found now than after
this merges into a module every frame passes through.

Also measured, and it is good news: at terminals **narrower** than the frame the delivered writer is
equal or better than merged (24 vs 26/27 mismatches).

## The NFR half

- **`NFR-002`** — the `< 16 ms` per-frame write bar. The emission grows 425 → 491 characters. Re-derive
  on your own instruments; do not inherit the Engineer's or BA/PM's numbers.
- **`N8-LANE`** — zero test files were added, so the lane budget should not have moved. Verify.
- `plans/nfr-catalog.md` was **not** edited by this ticket and no bar was created, moved, loosened or
  re-derived. Confirm that, and seed a row only if the decision genuinely needs one.

## The security half

Judge whether it is triggered at all, and **say so either way rather than running it silently**. The
change emits ANSI escape bytes derived from a module constant — no user input reaches the escape
sequence — but you should verify that rather than take it from me.

## Scope limits

- Do NOT edit `src/`. If code must change, say which module and why; the Engineer changes it.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT re-open `ADR-0009` or `ADR-0010`, and do NOT propose a constant-frame-width criterion —
  `ADR-0010` cl. 5 refuses it because `W` varies by design.
- Do NOT touch `src/status-panel.*` or `src/turn-loop.*`. An Engineer is live on `ABC-019` and a
  BA/PM on `ABC-016`, both in other worktrees. You never communicate with them.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Working rules

Work in `../cli-chess-ABC-027` on branch `grugops/ABC-027-frame-clearing`, rebased onto current
`main` and re-gated green by the Orchestrator (**681/681 on 22 files**) — verify yourself. Gates
blocking: lint/typecheck/build 0, skip 0. `security.asvs_level` is `L1`, `block_on` is `high`.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you and the §14 gate machinery does not exist in this repo — do
**not** self-attest one. Claim per Workflow 17 (atomic `mkdir`; create the `claimed/` parent if
missing).

Report: PASS / PASS_WITH_RISKS / FAIL, every accepted risk with a **named owner and trigger**, any
required fix, your disposition of the margin question, `NFR-002` re-measured, and your board move.
