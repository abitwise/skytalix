---
task: wave-2026-09-25
subtask: design-ABC-095-wiring
role: architect-design
ref: .grugops/context/design-ABC-095-wiring/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/design-ABC-095-wiring
base: main @ e9b1c50a
---

# Subtask: rule how ABC-095's book decorator is wired into a real game without breaking merged criteria

The SE built `withBook` (`src/book-engine.ts`, branch `grugops/ABC-095-book-before-engine` tip `1f205b00`, code `521a8513`; A1/A3/A4/A5-game/A6 PASS) and STOPPED at the wiring line. Read its notes on that branch: `.grugops/context/ticket-to-pr-ABC-095/notes/` (`…ef39c9a6` what the wiring reds, `…1e971b4d` decision) and `probe/cli-wiring-not-committed.diff`. The wiring as ADR-0037/the ticket planned it (probe `const` in `src/cli.ts` with `readFileSync`, a stderr warn, `Math.random`) turns red:
1. **`ABC-042` bar 4 (security): no `node:fs` import in `cli.ts`.** ADR-0037 § Consequences' injected-reader option and the ticket both missed it.
2. **`ABC-043` A5/A7, `ABC-044` A3:** their child processes swap in a scripted or failing engine; the book now answers the first move so that engine is never reached.
3. **`ABC-119` A1 (`CLI_DEEP`, "the real search answered", ≥ 1 s floor):** the child ran in ~0.2 s because the book answered.
4. Two pins that just move (the `process.*` census, the `engine:` regex).

Rule, as an ADR-0037 (and/or ADR-0012) addendum:
- **R1 — where the book file read lives.** (b1) amend ABC-042 bar 4 to allow the read in `cli.ts`, or (b2) a new holder module that owns the `node:fs` read and stderr warn (which reopens ABC-094's placement), or another option you find. Name the ADR-0036 limb each fires. If your choice needs ABC-042 bar 4 changed, say so: Security/NFR rules the bar in the next hop (do not change it yourself).
- **R2 — how the merged child-process criteria stay valid when the book answers first.** Options the SE named: neutralise the book in those children (by what seam — it must not be a user-reachable override flag that silently disables the book in production; respect `src/cli.test.ts`'s "one criterion, one seam" rule and ADR-0029's render seam conventions), or re-script them to leave book first. Rule which, per criterion (ABC-043 A5/A7, ABC-044 A3, ABC-119 A1), and say whether each criterion's Given changes (BA/PM amends the pages in a later hop — list exactly what to amend).
- **R3 — the miss-path 5 ms bar: cold (first read+parse of `book.json`) or warm?** Give the measurement definition QE/SE will use.
- Say whether the decorator commit `521a8513` should merge alone first (production module nothing imports yet) or only with the wiring.

## Fences (you are the ONLY hop running, width 1)
Edit only `memory-bank/50-decisions/` (ADRs), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, ticket pages, `plans/board.md`, `AGENTS.md`. Probes go in scratch copies outside the repo. Work in your OWN worktree (`git worktree add ../wt-design-ABC-095-wiring -b grugops/design-ABC-095-wiring main`); symlink `node_modules` into the worktree root only if needed. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. No timing readings. If you change any committed file other than notes, run the gates before your last commit (`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, success:true). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/design-ABC-095-wiring`, then FLAT `.grugops/queue/done/design-ABC-095-wiring.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, R1–R3 rulings with reasons, the exact amendment list for Security/NFR and BA/PM, and the merge-order recommendation.
