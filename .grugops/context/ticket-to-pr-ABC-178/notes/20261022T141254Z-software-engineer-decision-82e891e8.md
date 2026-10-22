---
id: 20261022T141254Z-software-engineer-decision-82e891e8
kind: decision
by: software-engineer
at: 2026-10-22T14:12:54Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-178
  - QE-177-a
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-197
  - 43e4996f
  - efaa0a76
  - 20261022T134641Z-ba-pm-decision-8165d1ba
  - 20261022T134635Z-ba-pm-observation-d5e744dd
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - src/uci-session.test.ts
supersedes: 
seal: sha256:05bffab55d982d9064cdeffaa492daf544d09ac48a386a10b4de045ad8f14476
---

# ABC-178 R1 shape: two `talk`s in `ABC-167 A6`, placed after "a stop with nothing held writes nothing"; base is `main` `43e4996f` (lane 1 995), not 1 994

- **Row:** `it("ABC-178 R1: a hold left in one session is not released by a fresh session")`. Session 1 is `talk(["position startpos", "go infinite"], 1_000)` (U1's step), and it is never released. Session 2 is a fresh `talk(["stop", "ponderhit"])` on the default step (it searches nothing and reads no clock), and it mirrors the row above it. Asserts: session 1's `out` has no `bestmove` line; session 2's `out` is `[]` (B1, test note 2).
- **Placement:** directly after "a stop with nothing held writes nothing", inside `describe("ABC-167 A6 — infinite waits for stop")`, as the page's § Scope places it.
- **Diff:** one hunk, 7 `+` lines: one comment citing `ABC-178`/`QE-177-a`, the 5-line row, and **one blank separator line**. I read the blank line as part of R1's row (it is not a comment and not a `-` line). If B3 is read strictly as "R1 and comment lines only", that blank line is the only thing it could object to. Flagged, not hidden.
- **Base:** `main` moved past `ABC-168`'s merge, so B4's "base total + 1" is **1 995 → 1 996**, not 1 994 → 1 995. The page allowed for this ("`ABC-168`'s merge would move it").
- **Notes are not committed on the branch.** Committing them would add `.grugops/…` paths to B3's `--name-only` list. The delivered tip `efaa0a76` carries only the test file. The notes sit uncommitted in the worktree for the Orchestrator's close, as `ticket-to-pr-ABC-177`'s notes did (`fb9ed0ea`).
