---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-17T10:44:45Z
sealed: false
refs: [ABC-040, ABC-030, ABC-024]
---

# Owner word, 2026-10-17 — pull ABC-040, ABC-030, ABC-024

The owner said verbatim: **"pull ABC-040, ABC-030, ABC-024"**. Width 3 (owner, 2026-10-17) holds.

- All three move Ready → In Development (3/3); three SE hops run in parallel, each in its own worktree.
- **Sequencing for ABC-040** (its page: must not run beside a hop appending to `plans/traceability.md`): the ABC-030 and ABC-024 hops are told
  NOT to touch `plans/traceability.md`; each hands its row text back and the Orchestrator appends it at merge, after ABC-040's splice is on main.
  ABC-040 merges first.
- ABC-030 pulled beside others rather than last: its "pull last" was ordering among P3s, and its own constraint (no hop live in its four
  `*.nfr.test.ts` files) holds — ABC-024 touches only `src/moves.castling.hardening.test.ts`.
