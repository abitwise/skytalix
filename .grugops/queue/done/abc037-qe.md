---
task: quality-gate-ABC-037-qe-2026-08-19
subtask: abc037-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-037-the-real-prompt-input-seam.md
ref: .grugops/context/quality-gate-ABC-037-qe-2026-08-19/
parent_ref: .grugops/context/ticket-to-pr-ABC-037-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T11:00:00Z
branch: grugops/quality-gate-ABC-037-qe-2026-08-19
base: grugops/abc037-the-real-prompt @ HEAD
---

# Subtask: QE on `ABC-037` — the first module in this repo that reads outside input

`src/line-input.ts` (232) and `src/line-input.test.ts` (771) on
`grugops/abc037-the-real-prompt`. **Branch off the DELIVERY BRANCH, not `main`.** Read
`parent_ref:` — six notes, and a **19-mutant ledger with diffs**.

## The engineer handed you a live survivor. Start there

**`M6c` SURVIVED and it is a real leak** — not an equivalent mutant. The engineer's own memory guard
was **false**: measured out of tree with `node --expose-gc`, a leaking build retains a `pending` of
**16,777,216 characters** while `heapUsed` reports **0.01 MiB**, because `heapUsed` does not account
a cons-string's referents. **It deleted the guard rather than ship it green**, replaced it with a
flood-survival row, and recorded the retention bound as a construction argument rather than a test.

**So the 1024-character cap's retained-bytes bound is NOT proved by test.** That is the gap.
Find a guard that actually fires on `M6c` — or establish that none can within this lane's cost, and
say so plainly. `M6`/`M6b` the engineer classes as equivalent mutants (two halves of a mutually
redundant bound); **check that classification, do not inherit it.**

## `A5` is the ruling and it is the criterion that decides the ticket

The engineer claims `A5` **by construction**: there is no `try` and no `catch` in the file. **I
verified that myself** with comments stripped — zero `try`/`catch`, zero `process`, zero `console`,
zero `globalThis`, zero Node builtins, four relative imports. Do not re-derive it; **attack it
instead.** A throw can still be swallowed without `try`: a `.catch()` on a promise, a
`Promise.allSettled`, an `async` boundary that drops a rejection, a default parameter that
evaluates. Hunt those.

## The `A6` guard has three layers and a STATED limit — test the limit

Layers: runtime spies; the delivered file's **import set**; a **token scan with comments stripped**.
The engineer states layer 3 is lexical and **would not see a deliberately obfuscated reconstruction
of a global's name at runtime**. That admission is correct and worth confirming: build such an
escape and show whether it lands. Then say whether that residual matters for a module whose whole
job is to write a prompt.

Also confirm the two channels it claims **no runtime spy can see** (a load-time-bound
`process.stdout.write`, and `fs.writeSync`) are genuinely closed by construction rather than by a
spy that happens to pass.

## Security — three bars, NOT waived, and this is the first outside-input module in the repo

Re-measure all three, do not inherit: data-never-code (zero occurrences); **bounded at 1024, 1025
rejected with no resolver call** — check the boundary is not off by one in the other direction, and
that the rejection messages fit the frame; and every terminal byte through the sanitizer
(`src/frame.ts:123`) with a hostile `\x1b[2J\x1b[Hzz\x07` line.

Confirm the **firing threshold did not fire**: no `src/` file beyond the two, no runtime dependency,
`package.json` still with no `dependencies` key, and **zero Node builtins imported**.

## Also

- **`INPUT_DEEP=1` (26 tests)** is a new opt-in lane. Run it.
- **The engineer touched `AGENTS.md`** (an `INPUT_DEEP` command slot and the `heapUsed` trap) and
  `plans/traceability.md`, both in separate commits, neither under `src/`. **`AGENTS.md` is the
  Scribe's file.** Say whether the content is accurate and runnable; whether it should have been
  the Scribe's pen is mine to route, not yours.
- **A fourth stale anchor** was corrected beyond my list — the `eof` arm, cited `:123`, measured
  `:131`. Verify it.
- **`N8-LANE` is NOT claimed met** and must not be granted: the engineer measured the lane at
  **14.51 s WITHOUT** its change against `NFR-008`'s 13 s clause — `ABC-108`'s finding, reproduced
  independently. Report; do not rule.

## Fences

You do not fix. Do not weaken a guard. Do not re-open `ABC-033`, `ABC-035` or `ABC-078` — all
merged and gated. Do not rule NFR bars. Do not merge, do not deploy, do not move a board column.

## Gate

Re-run the full blocking gate yourself. Engineer's figures: **39 files / 1175 tests, 0 failed**,
skip 0, `No findings.`, lint 70 files, typecheck/build 0, `PERFT_DEEP=1` 32/32, `INPUT_DEEP=1` 26.
An isolated agent worktree has no `.claude/worktrees/`, so the recorded commands work inside one.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc037-qe`.
**Commit incrementally.**

Commit on `grugops/quality-gate-ABC-037-qe-2026-08-19`, never on `main`.
