---
task: wave-2026-09-24
subtask: ticket-to-pr-ABC-079-rehop2
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (second re-hop after the oracle ruling)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ticket-to-pr-ABC-079/  (append to the SAME context)
ruling_ref: .grugops/context/ruling-abc079-oracle/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T20:30:00Z
branch: grugops/ABC-079-quiescence  (continue the SAME branch; it must first take the ruling commit)
base: grugops/ruling-abc079-oracle @ b324cb6  (= re-hop fa80923 + the oracle ruling)
---

# Subtask: `ABC-079` second re-hop — make the unpruned oracle affordable per the oracle ruling, and turn the deep lane green

Architect/Design ruled (read the `decision` note in `ruling_ref:`, its probe table, and the
ticket's § Ruling (oracle)). The depth-3 oracle now compares on the bare leaf through a new
test-only door, and the quiescence leaf stays under the oracle at depth 2 on all six positions
and at depth 3 on startpos and position-3. `src/search.test.ts` is inside this ticket's fence.

## Change exactly the ruling's list
1. `src/search.ts`: add `searchWithoutPruningOrQuiescence(position, depth)`, which calls
   `searchRoot` with pruning and quiescence both off. Document it like its two siblings; nothing
   else in the file changes.
2. `src/search.test.ts`: `A1` bare-leaf depth-3 pairs on all six positions (deep lane);
   quiescence-on depth-3 pairs kept only on startpos (deep) and position-3 (default lane), the
   other four deleted; `A2`'s deep case reads the bare-leaf kiwipete pair; `A7`'s deep case takes
   its unpruned half from the door and checks `.intact` on the memoised depth-2 pairs; `A6`'s
   export list gains the door; the header is corrected. **Timeouts do not move.**
3. `src/search.qe.test.ts`: `QE-G1` gains one case for the door.
4. Re-run to completion and record: `SEARCH_DEEP=1 npx vitest run src/search.test.ts` (every
   case's share of its timeout; name any case over 50%, and watch `A4`'s deep case, which read
   50–69%), `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`,
   `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`, the default lane, and the four gates.
   **A case over its timeout means stop and report; do not tune.**
5. Paired figures for NFR-008 CPU and N8-LANE (before = `fa80923`, after = tip),
   `/usr/bin/time -p`, at least 3 runs, load noted.

## Branch mechanics
In your worktree: `git checkout grugops/ABC-079-quiescence`, then
`git merge grugops/ruling-abc079-oracle` (a fast-forward), then
`git checkout grugops/wave-2026-09-24 -- .grugops/queue/pending/ticket-to-pr-ABC-079-rehop2.md`.
Claim by hand per Workflow 17. Commit on `grugops/ABC-079-quiescence`. **Do NOT merge the wave
branch into it and do not rebase.** The Orchestrator merges after QE.

## Fences
- Touch only `src/search.ts`, `src/search.test.ts` and `src/search.qe.test.ts`. Do not touch
  `src/quiescence.*`, `src/engine.*` (unless a gate forces it; say so), `src/zobrist.*`,
  `src/command-input.*`, `src/line-input.*` or `src/turn-loop.*`.
- Do not touch `plans/board.md`, `AGENTS.md` (the Scribe owes the deep-lane lines after this hop),
  the `plans/nfr-catalog.md` bars or `ADR-0024`.
- `self_fix_attempts` = 2 on gates, then stop. Do not merge or deploy. Write commit messages to
  a uniquely named scratchpad file and use `git commit -F`. Run gates through node scripts.

## Publish
Notes into `ref:` (a `claim` for every lane with raw numbers, `observation` for NFR figures, no
`finding`), a trace row, and ticket § Delivery (re-hop 2). Move this file to `done/`.
Report: the sha, the numstat, every lane's exit, counts and wall time, the per-case timeout
shares for the deep lane, the NFR-008 figures, and anything you could not meet.
