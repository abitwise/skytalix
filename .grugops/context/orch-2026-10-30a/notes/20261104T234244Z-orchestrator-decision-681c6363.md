---
id: 20261104T234244Z-orchestrator-decision-681c6363
kind: decision
by: orchestrator
at: 2026-11-04T23:42:44Z
verified_by: 
confidence: high
refs:
  - ABC-301
  - ABC-303
  - ABC-271
  - ADR-0056
  - ADR-0067
  - 84f9bae1
  - e28552ac
  - 5aee89b7
supersedes: 
seal: sha256:d1286f4e33e9b0783d6e03303073c71540bce934b4597d34cf054e0379118a27
---

Rulings on arch-ABC-303-open's two checks, and a stalled agent.
1. K0 against "identity": the Architect's reading stands. B-T4's never-list means ADR-0067 d5's tracer gate, B-T1. K0's sentence is that value-0 terms change nothing, which stops being true when a fit gives them values, so it retires at scope 4 on an emission that moves a value. The tracer gate is untouched. If ABC-301 does not merge, K0 stands and takes the re-point.
2. A new C2' against B4: NOT ruled by me. "One read, never re-played" is the rule the owner accepted, so a second read after a candidate fault goes to him. The strict reading holds until he answers: a candidate fault closes the read unpassed.
3. Disclosed fault of mine: the K0 red reached main through my brief and ruling, which listed no deep lanes and fenced "Move no other expectation". From now on, a merge re-read runs the deep lane of any test file arriving from the other side.
4. se-ABC-301-fit stalled. Its last transcript entry is a tool call at 22:12:13Z with no result; the merge in that call never ran (head still 8701a422, stash list empty, four files modified). No lock held, no process, no notification since. Two reports of mine after 22:12Z said it was still working; that was unverified and wrong. Work lost: about 1.5 h of schedule, no code. Replaced by se-ABC-301-fit-2, which starts from the uncommitted worktree.
