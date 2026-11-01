---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:49:19Z
subtask: arch-ABC-263
role: architect-design
ticket: ABC-263
ref: .grugops/context/arch-ABC-263/
branch: new grugops/arch-ABC-263 from main (worktree .claude/worktrees/arch-ABC-263)
width: records + throwaway prototypes. se-ABC-253 runs tests beside you; EVERY prototype run is wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, ≤ 5 min each.
---
# Architect: ABC-263 spike — NPU / iGPU / multi-thread Node.js / shared search info
## Read
plans/tickets/ABC-263-spike-can-skytalix-use-the-npu-the-igpu-and-more-cpu-threads-from-node-js-on-this-host-and-share-search-info-between-them-records-only.md in full (Q1–Q4, A1–A8, host limits). Owner word .grugops/context/orch-2026-10-30a/notes/20261101T204330Z-orchestrator-decision-78c476bf.md. ADR-0055 (status after ABC-250/251), ADR-0056 (classical path, test rules), EPIC-011 § Out of scope.
## Orchestrator rulings
- A ≤ 5 min multi-core scaling prototype is not a validation game; the one-core rule binds games. Run it under the lock (it then has the host to itself from this session's side).
- "A few minutes" = ≤ 5 min per run. No sudo, no system installs (user-level npm in scratch is fine), scratch ≤ 2 GB — the /tmp quota is tight; delete your scratch when done.
- Anything estimated > 1 h → STOP and report (owner ask).
## Deliver
One proposed ADR (memory-bank/50-decisions/, status PROPOSED) or one sealed analysis note, per the page, ending in one recommendation per strand plus questions for the owner. Cite sources for runtime claims (web is allowed); mark unverified claims UNKNOWN - verify.
## Fences
memory-bank/50-decisions/ (new ADR only), your notes, scratch prototypes outside the repo. No src/, tools/, data/, package files, plans/, board. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-263, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.
