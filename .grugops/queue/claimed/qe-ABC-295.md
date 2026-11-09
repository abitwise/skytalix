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

## Stage A
*QE/E2E (claude-opus-5-5, qe-ABC-295), 2026-11-09, on `grugops/qe-ABC-295` from `main` `e069b49a` (`src/` tree `bba42fb7`).*

**Result: PREREG sealed; stopped before any game. 0 games played, no build, no engine search.**
- **PREREG** `20261109T092643Z-qe-e2e-decision-4151e128`, sealed at 09:26:43Z and committed at `770bc230`, before any game. Stage A checks: `…observation-ba5495ab`. Scripts sealed by sha256 in `raw/scripts/SHA256SUMS`. The read's entry is `session.sh` `968c2768…`.
- **Tool checks** (each under the host lock, one at a time):
  - `cutechess-cli` 1.5.1, sha256 `dc776901…2154f40a` = pin. Stockfish 19 (`id name Stockfish 19`), sha256 `c78c22a9…4593e352d2` = pin. Openings = pin.
  - `r --dry-run` of the exact command exits 0. Its 40-token argv is byte-equal to R1's `cmd.txt` (paths as `<out>`), so no smoke was needed.
  - `node` v26.12.1.
  - `read.mjs` reproduces R1's committed figures from its PGN.
- **The `main` sha to read:** `e069b49a` (`src/` `bba42fb7`; harness `tools/` `c361f429`). The session refuses to start on any other `src/` or harness tree.
- **E: 1 810**, confirmed by the band rule. R1 read 49.5 % at 1 810, inside 25–75 %, so E does not move. Estimate: about 50–74 % expected. An upward step is possible only if most of the +181 self-play since R1 transfers (about 30 % chance at full transfer, under 1 % at half).
- **Time estimate: about 25–55 min (0.4–0.9 h), central about 0.6 h; under 1 h.** R1 measured 0.59 h. The RUNAWAY stop is at 90 min.
- **Host gates:** W is the first game only after your brief line citing the owner's held host, plus the session's own class-and-count check (0 foreign `vitest`, `cutechess-cli`, `stockfish`, else WAIT). FL logs foreign load by class and count only, voids nothing, and never touches or records a foreign process.
- **Re-runs:** a VOID, an UNRESOLVED or a skytalix fault gives no figure; any re-run is asked of the owner first (R2-A1 allows once). A band step's second run is asked of the owner first (R2-A3).
- **To start stage B:** `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/<home>/<repo>/host-test.lock bash .grugops/context/qe-ABC-295/raw/scripts/session.sh <out> <repo>`, from this branch, holding the lock for the whole session (about 0.6 h).
- **Fences held:** no `src/`, ADR, ticket, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process touched or recorded beyond a count.
