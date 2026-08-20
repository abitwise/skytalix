---
id: 20260821T024000Z-qe-e2e-artifact-ref-what-this-hop-wrote-and-the-six-things-it-refused-2d90fb64
kind: artifact-ref
by: qe-e2e
at: 2026-08-21T02:40:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - G-QE115-2
  - G-QE115-3
supersedes:
---

# WHAT THIS HOP WROTE, AND THE SIX THINGS IT REFUSED TO DO

## Written

- `.grugops/context/qe-ABC-115-2026-08-21/notes/` — eight notes, hand-authored per
  `agent-factory/contracts/context-note.md`. **No `finding`** — `context.human_admission` is `off`
  and no `finding` is admissible on this install, so results are `observation` / `claim` /
  `decision` / `failed-attempt` / `artifact-ref`. There is no `index.md` / `index.jsonl`: the
  sanctioned renderer `scripts/context-io.ts` is absent from this repository and from the kit, and
  every sibling task under `.grugops/context/` carries `notes/` only.
- `plans/board.md` — one header appended after the budget ruling's, and the `ABC-115` line appended
  to in place. **Two moves labelled distinctly; net column counts unchanged.**
- `plans/traceability.md` — one header appended, and **one row (`ABC-115`), two cells (`Tests`,
  `Status`), append-only within those cells**. Re-split from disk after the write: **12 fields on an
  escape-aware split (10 cells, two empty edges)**, and no pipe character was written into either
  cell.
- `.grugops/queue/` — `qe-abc115-review` taken `pending` → `claimed` → `done` by hand per Workflow
  17. **The atomic act was a bare `mkdir .grugops/queue/claimed/qe-abc115-review` (no `-p`) in the
  repository checkout, which is where the `pending/` file physically was** — the same substrate
  every earlier `ABC-115` hop used; the resulting records are committed on this branch.

## Refused

1. **Fixed nothing.** Both defects are reported, neither is repaired. `git status --porcelain` is
   clean of `src/`, every mutant was restored, and `src/` on this branch is byte-identical to
   `6acc3fb`.
2. **Re-opened neither ruling.** The exit-code ruling (`ADR-0016`) and the 2026-08-21 budget ruling
   stand untouched. Where my measurement bears on the budget clause I **reproduced** it rather than
   argued with it, and it holds.
3. **Did not widen the stdout arm, and did not ask for it.** `G-QE115-1` asks for a *test*, not for
   the arm to absorb more codes — the ticket priced that trade and took the other side.
4. **Did not raise the `N8-SPAWN` ceiling.** Closing `G-QE115-1` costs one child, 23 → 24, and a
   ceiling raise is BA/PM's word. It is named as a cost, not taken.
5. **Did not sign, did not merge, did not deploy.** No UAT was conducted. 13 production lines ship,
   so the zero-production-lines waiver does **not** apply and acceptance is the named owner's word.
   Seven branches are stacked unmerged and merging is the human's.
6. **Did not grade the lane.** `NFR-008` is breached on both sides of my paired runs;
   `ABC-108` / `ABC-110` own it. Reported as figures, with no verdict attached.

Also untouched: `src/cli.ts`, `src/cli.test.ts`, `ADR-0016`, `AGENTS.md`, `plans/nfr-catalog.md`,
`plans/tickets/ABC-115-*.md`, and every other ticket. **`ABC-050`'s `exclude` residual and `G-06`
are still open and still not mine.**

## The reading order for whoever picks this up

1. the `decision` note — the verdict, what passes, and the cheaper routing the Orchestrator may take;
2. `G-QE115-1` (`claim`) and `G-QE115-2` (`claim`) — the two defects, each with its reproduction;
3. the mutation `observation` — the eight arms and which row kills each;
4. the pty `observation` — the TTY `UNKNOWN` closed;
5. the gates/flake `observation` — the boring half, and `G-QE115-3`;
6. the `failed-attempt` — two instruments of mine that proved nothing, so nobody rebuilds them.
