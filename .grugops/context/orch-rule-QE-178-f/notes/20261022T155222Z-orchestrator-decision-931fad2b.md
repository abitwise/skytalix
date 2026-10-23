---
id: 20261022T155222Z-orchestrator-decision-931fad2b
kind: decision
by: orchestrator
at: 2026-10-22T15:52:22Z
verified_by: 
confidence: high
refs:
  - ABC-178
  - ABC-197
  - QE-178-a
  - QE-178-f
  - owner-delegation-2026-10-22
supersedes: 
seal: sha256:87f698195f26ea7afa43361c2aea3a5b9f3d45b497eb0e88b687371fccc728d1
---

# QE-178-f (LOW) accepted with no re-build; it is optional scope for ABC-197

**Input:** QE `qe-ABC-178b` `…d72f02f0`. QP1d survives: a fresh session's `position`, `go` or `ucinewgame` releases a hold into session 1's output. It is not a regression, since it also survives at base and in the file before the fold. A scratch-measured one-line change to R1's session 2 (`talk(["stop", "ponderhit", "position startpos", "ucinewgame"])`) kills it at 0 nodes.

**Decision (Orchestrator, under the delegation `…5aaf7cec`; LOW, so mine to accept):**
- **Accept with no re-build.** This is the same endless family BA/PM accepted as QE-178-a (`…1f4936b2`): production runs one UCI session per process (`src/uci.ts:76`), and each new variant buys another full SE + QE cycle for a contrived build. The fold has already been done once (QE-178-b). Chasing variants one cycle at a time costs more than the row protects.
- **The reopen triggers are QE-178-a's:** production runs more than one session per module instance; `uci-session.ts` gains state that counts or carries holds across a `go`; or a leak of this shape is seen live.
- **Optional scope for ABC-197** (same file, same R1 region): its builder may widen R1's session 2 exactly as QE measured it, provided ABC-197's own QE re-reads it. It is not required.

ABC-178's In Review exit now waits only on B7/B8 (QE-178-c/-d), on the quiet-host timing hop after ABC-198 merges.
