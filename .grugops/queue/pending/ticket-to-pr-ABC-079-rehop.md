---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-079-rehop
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (re-hop after a ruling)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ticket-to-pr-ABC-079/  (append to the SAME context; the first hop's 7 notes are there)
ruling_ref: .grugops/context/ruling-abc079-multiplier/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T00:00:00Z
branch: grugops/ABC-079-quiescence  (continue the SAME branch; it must first take the ruling commit)
base: grugops/ruling-abc079-multiplier @ f6772c5  (= build e2c3af5 + the ruling + ADR-0024)
---

# Subtask: `ABC-079` re-hop — order captures inside quiescence per `ADR-0024`, re-level `A5`, re-fixture, re-run every lane to completion

Architect/Design ruled (`ruling_ref:` decision note; `ADR-0024`, status `proposed` — the owner's
acceptance is pending and the ruling's numbers stand as the spec for this hop): the build is
sound; unordered quiescence is the cost; MVV-LVA ordering of the capture list inside `quiesce` is
lossless and is THIS ticket's fix. Read the ruling note, the probe table, `ADR-0024` decisions
1–3, the ticket's § Ruling, then your own first-hop notes.

## Change exactly this (the ruling's list, verbatim in intent)
1. `src/quiescence.ts`: MVV-LVA sort of the capture list before the loop (victim value desc,
   attacker value asc tiebreak; capturing promotion ranked by victim + promotion piece); export
   the key (`move → number`, pure) for `ABC-080`; correct the header's "captures are searched in
   generation order" sentence; **cap stays 8**.
2. `src/quiescence.test.ts` `A5` levels per `ADR-0024` decision 3: kiwipete ≤ 180x (d1, default
   lane), ≤ 50x (d2), ≤ 70x (d3); position-6 ≤ 10x / ≤ 26x / ≤ 13x. Still asserted. **Over =
   stop and report, not tune.**
3. `src/engine.test.ts`: re-fixture the three RED cases against the ORDERED counts (kiwipete d1 =
   5 888, position-6 d2 = 9 804); if `A2`'s 10 240 bound holds at 5 888 it stays as written.
4. `A1`–`A4`, `A6`: re-run, not re-argued. A changed verdict is a finding to REPORT.
5. Re-run and record to completion: default lane (`npx vitest run --dir src`, expect green);
   `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` AND `SEARCH_DEEP=1 npx vitest run
   src/search.test.ts` — exit 0 at EXISTING per-case timeouts, counts and wall recorded (if a
   case cannot meet 30 s ordered, that case's depth drops by one on kiwipete only, recorded; the
   timeout is NOT raised as a first resort); `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`
   including the 50 ms case — pass as written or REPORT the number, not re-fixture.
6. NFR-004 wall at `DEFAULT_BUDGET_MS` re-measured (6 positions); NFR-005 reached depth at 3 s
   REPORTED per position (the ruling estimates 3/3 on kiwipete/position-6 — `UNKNOWN - verify`).
7. NFR-008 CPU and N8-LANE paired figures (before = wave branch `b65f5f1`'s lane, after = tip),
   `/usr/bin/time -p`, ≥ 3 runs, load noted; > 15 s under load is REPORTED non-conforming. The
   new file's own charge vs 650 ms — state it; if over, say so, do not trim.

## Branch mechanics
In your worktree: `git checkout grugops/ABC-079-quiescence`, then `git merge
grugops/ruling-abc079-multiplier` (fast-forward; brings the ruling + ADR-0024 + this subtask's
sibling files), then `git checkout grugops/wave-2026-09-19 -- .grugops/queue/pending/ticket-to-pr-ABC-079-rehop.md`
to bring this file onto the branch. Claim it by hand per Workflow 17. Commit on
`grugops/ABC-079-quiescence`. **Do NOT merge the wave branch into it and do not rebase** — the
Orchestrator merges into the wave branch after QE.

## Fences
- Only `src/quiescence.ts`, `src/quiescence.test.ts`, `src/engine.test.ts` (and `src/search.ts`
  /`src/engine.ts` ONLY if the sort's export forces a type change — say so). Not `src/zobrist.*`
  (`ABC-075` live), not `src/turn-loop.*`, not `src/move-input.*`.
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` bars, `ADR-0024`'s status.
- `self_fix_attempts` = 2 on gates, then stop. Do not merge, do not deploy. Commit messages via a
  UNIQUELY-NAMED scratchpad file and `git commit -F`; gates through node scripts.

## Publish
Notes into `ref:` (`claim` for every lane with raw numbers, `observation` for NFR figures; no
`finding`), trace row, ticket § Delivery (re-hop). Move this file to `done/`.
Report: sha, numstat, the `A5` ratios measured at d1–d3 vs the levels, every lane's exit/counts/
wall, NFR-004/005/008 figures, and anything you could not meet.
