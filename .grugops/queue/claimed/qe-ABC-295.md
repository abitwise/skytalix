---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-09T09:18:51Z
subtask: qe-ABC-295
role: qe-e2e
ref: .grugops/context/qe-ABC-295/
branch: new grugops/qe-ABC-295 from main
width: stage A only — PREREG and dry checks. No games.
---
# ABC-295 (R2): stage A, the PREREG
Read ABC-295's page whole, ABC-273's R1 reading and notes, ADR-0056 D5/D6, and the owner's ruling …a9c03e07.
1. **Check, without games:**
   - cutechess-cli and Stockfish 19 are present and match the pinned sha256 (ABC-204);
   - `tools/rating/rating.ts r` runs dry, or with a single-game smoke if the harness has no dry mode; a smoke must not exceed 2 games and is labelled not graded;
   - the main sha to read;
   - node --version.
2. **Seal the PREREG before any graded game.** It covers:
   - E, from R1's 1 810 by the band rule;
   - the command as R1 ran it;
   - R2-A1–A4;
   - the claim rule;
   - the host gates: foreign load logged by class and count only, never a foreign command line, since they can carry credentials;
   - the UNRESOLVED and re-run rules: a re-run is asked of the owner first;
   - the time estimate. The owner has already said yes to a run over 1 h, but say so if yours is over 1 h.
3. **STOP and report.** The 200 games run only on a later brief line from me, citing the owner's held host.
Every run goes as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. Records write paths only as placeholders. Never kill foreign processes. No src/ change, ADR, ticket, EPIC or board edit. Publish sealed notes (contextRoot = your worktree's .grugops/context; `at` from `date -u` run immediately before each note). Add a ## Stage A block to this brief and keep it in claimed/. Commit and run `node tools/grugops/records-path-check.js --base main` first. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
