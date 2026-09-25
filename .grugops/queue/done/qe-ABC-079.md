---
task: wave-2026-09-24
subtask: qe-ABC-079
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/qe-ABC-079/
build_ref: .grugops/context/ticket-to-pr-ABC-079/  (three hops: build, re-hop, re-hop 2)
ruling_refs: .grugops/context/ruling-abc079-multiplier/ , .grugops/context/ruling-abc079-oracle/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T22:00:00Z
branch: grugops/qe-ABC-079
base: grugops/int-ABC-079 @ 6b7b2c8  (= the wave branch + grugops/ABC-079-quiescence-rehop2, merged by the Orchestrator; ADR-0024 kept at `accepted`, traceability headers unioned)
---

# Subtask: QE `ABC-079` — break quiescence search, the WHOLE ticket, all three hops

This is the ticket's first QE. Test the whole delivered diff against the fork point `4f0ef01`
on the integrated base, not only the last hop:
`src/quiescence.ts` (new), `src/search.ts`, `src/engine.ts`, `src/quiescence.test.ts` (new),
`src/search.test.ts`, `src/search.qe.test.ts`, `src/engine.test.ts`.

Read these first: the ticket's `A1`–`A6`, § Ruling, § Ruling (oracle) and all three § Delivery
sections; `ADR-0024` (accepted); both rulings' `decision` notes; and the Engineer's notes in
`build_ref:`, newest first. Note that the Engineer's re-hop 2 landed on the sibling branch
`grugops/ABC-079-quiescence-rehop2`, because two stale worktrees hold the named branch.

## Rule
1. Is each acceptance criterion MET, MET-AS-READ or FAILED on the integrated base?
2. **What the oracle ruling gave up:** a window inherited at depth 3 reaching a quiescence leaf on
   a capture-dense board. The ruling argued that each half is still covered and did not
   mutation-test it. Mutation-test it: seed a defect that only shows under that combination and
   see whether any row goes red. If none does, is that a gap to name?
3. **`A4`'s deep case** reads 50–69% of its 120 s timeout. Measure it on the integrated base,
   rule whether that is a risk, and say what it would take to cross.
4. The Engineer left the `Switches` docblock and the `src/search.ts` module header without a
   mention of the new door (`searchWithoutPruningOrQuiescence`). Is that a false or stale
   sentence under the `ABC-114` standard?

## Then break it
- The four gates and the default lane on the integrated base (report files / tests / skips).
- `SEARCH_DEEP=1` for `search.test.ts` and `quiescence.test.ts`, and `ENGINE_DEEP=1` for
  `engine.test.ts`. Record each case's share of its timeout. Run slow lanes in the background
  and poll them.
- Mutants in `quiesce`: no stand-pat cutoff; stand-pat not raising alpha; the capture ordering
  reversed; the cap of 8 off by one; quiescence searching non-captures; promotion keys wrong;
  the door calling with quiescence on. Each: rows RED or NONE. Revert and confirm the tree is
  clean.
- The product end to end: `node src/cli.ts` plays a few moves against the engine at the
  default budget, with no crash and a reply inside NFR-004's bar.
- `test-skip-integrity` prints `No findings.`
- Say whether a Security/NFR trigger applies (a performance-sensitive flow): NFR-004/005/008
  readings, with load noted. Report NFR-008 and do not rule it.

## Do not
- Do not fix the build. Do not touch `src/command-input.*` or `src/line-input.*` (`ABC-046`'s
  re-hop is live). Do not open `plans/board.md`, `AGENTS.md` or `plans/nfr-catalog.md`.
- Do not merge or deploy. Work in your own worktree. Write commit messages to a uniquely named
  scratchpad file and use `git commit -F`. Run gates and mutants through node scripts.

## Publish
PASS or FAIL as a `decision` note, mutants and lanes as `observation` notes with raw output, a
trace row, and a ticket § QE section. Claim by hand per Workflow 17. Report: the verdict, the
criteria table, the four rulings, the mutant table, every lane's numbers with timeout shares, the
end-to-end transcript, the NFR readings, the sha and the numstat.
