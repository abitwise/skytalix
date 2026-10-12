---
id: 20261012T125300Z-software-engineer-observation-wiring-reds-merged-criteria-ef39c9a6
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-095
at: 2026-10-12T12:53:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-119
  - ADR-0012
  - ADR-0036
  - ADR-0037
  - src/cli.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
supersedes:
---

# The `src/cli.ts` wiring line reds seven merged rows. Three of them are other tickets' criteria whose premise the book removes.

This note is hand-authored and unsealed. Branch `grugops/ABC-095-book-before-engine`, from `main` `e9b1c50a`.

**What was tried.** It is the diff in `probe/cli-wiring-not-committed.diff`. A probe `const` sits above `runTurnLoop({`. Its
`read` is `readFileSync(new URL("../data/opening-book/book.json", import.meta.url))`, its `warn` is
`process.stderr.write(line + "\n")`, and its `random` is `Math.random`. Inside the call, only
`engine: withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS }))` changes. Typecheck and lint were clean. The
diff was **reverted** before any commit.

**Reading 1.** Run: `npx vitest run src/cli.test.ts src/cli.real-engine.test.ts src/engine.test.ts src/history-pane.nfr.test.ts`.
Result: 6 failed, 109 passed.

| row | cause | kind |
|---|---|---|
| `ABC-042` `A9` process census | a 3rd `process.stderr` (the warn sink) and `process` 10 against the pinned 9 | a census pin. It would move by one deliberate entry |
| `ABC-042` **bar 1 / bar 4** | `cli.ts imports node:fs`. Bar 4 reads "no filesystem and no network" on `cli.ts` and `cli-options.ts` | **a merged SECURITY bar** |
| `ABC-043` `A1` | `/engine:\s*createEngine\(…\)/` does not match the wrapped value | a wiring pin. A7 requires the change |
| `ABC-043` `A5` | engine-fault children (`engine-threw` and the other faulty seam) render 2 frames, not 1. The book answers ply 0, so the substituted faulty engine is never reached | **another ticket's criterion; its Given no longer holds** |
| `ABC-043` `A7` | colour children: the scripted engine opens `a2a3`, and the book overrides it | **as above** |
| `ABC-044` `A3` | faulty engine: the "did not finish" screen is missing, because the fault is never reached | **as above** |

**Reading 2.** Run: `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`, with the wiring applied. Result: 1 failed, 6 passed.
`ABC-119` `A1` ("the real search answered: the child took at least 1 s") read **201 ms** and **187 ms** of whole-child
wall time against its 1,000 ms floor, because the book answers the start position. The other six rows pass.
That includes `A3(i)`: the book reply is legal by the project's generator.

**The same lane on the committed branch, without the wiring:** 7 of 7 passed.

**Why this is not mine to resolve under this ticket.** The ADRs did not see bar 4. `ADR-0037` § Consequences and this
ticket's NFR bullet both anticipate "`(b1)` if `src/cli.ts` holds the read". The `ABC-094` probe is built to have the
read bound at the root. But `ABC-042` bar 4 forbids exactly that import in `src/cli.ts`. There are two ways out, and
neither is mine:
- amend a merged security bar;
- put the read in a new holder module. That is `(b2)`, and it re-opens `ABC-094`'s placement.

The other four reds belong to `ABC-043`, `ABC-044` and `ABC-119`. Each criterion's Given assumes the engine seam
answers the first engine ply, and with the book wired it does not. The ways out are to substitute or neutralise the
book in those children, or to re-script them to leave book. `src/cli.test.ts`'s substitution rules ((S)/(C)/(N), "one
criterion, one seam") govern that, and the fence is BA/PM's and QE's. The 2026-10-12 re-score's line, "`src/cli.test.ts`,
which this ticket does not need to edit", is **wrong at `e9b1c50a`**.
