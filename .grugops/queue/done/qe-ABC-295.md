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

## Stage B — go
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-09T15:27:14Z.*
- **The owner's word (W):** 2026-11-09, "1 yes", in answer to my ask that the whole host be quiet for about 35 min, grugops and his other projects included. It is held for these games only (orch note …15:27:01Z).
- **Band step pre-approved** (owner "2 yes"): if the reading lands outside 25–75 %, run the band rule's one second 200-game reading at the stepped E in the same window, without a further ask. One step only. Anything beyond that comes back to me.
- **`ps` check, by class and count only:** one foreign monitoring tool at about 23 % of one core; Claude sessions near idle; daemons at about 1 %. 0 cutechess-cli and 0 stockfish running. One idle containerised process names vitest in its arguments: QE-298-r, at 0 % CPU. load1 0.47 on 24 cores; Tctl 42.5 °C.
- **Main is now `8f86a69c`.** Since `e069b49a` it carries records only; `src/` is still `bba42fb7`. Read the sealed sha `e069b49a` as the PREREG names it, and check that the `src/` and harness trees are unchanged.
- **Run stage B on PREREG `…4151e128` exactly as sealed,** then give the verdict.

## Stage B
*QE/E2E (claude-opus-5-5, qe-ABC-295), 2026-11-09, on `grugops/qe-ABC-295` at `3d67f457`; read sha `e069b49a` (`src/` `bba42fb7`, harness `tools/` `c361f429`; `main` `8f86a69c` has the same trees).*

**Result: VALID. 126.0 / 200 (63.0 %) at E 1 810, Elo +92.5 ± 49.1, X = 1 902.5 ± 49.1. E is confirmed and no band step was needed. Highest milestone met: none.**
- **Readings:** `20261109T160638Z-qe-e2e-observation-1245d022`. **Verdict:** `20261109T160639Z-qe-e2e-decision-e11c410e`. Read once under PREREG `…4151e128`, with the 5 sealed scripts' sha256s checked OK just before the launch.
- **Run:** `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/<home>/<repo>/host-test.lock bash .grugops/context/qe-ABC-295/raw/scripts/session.sh <out> <repo>`. Gates 1–4 passed (pins, trees, disk, W-check 0 / 0 / 0). `r` ran from 15:28:10Z to 16:04:06Z, exit 0, stop none. Then G11 and the read; the session ended 16:04:27Z. One run, one game at a time, one core.
- **Scope-3 figures:**
  - W / D / L: 122 / 8 / 70.
  - Score: 63.0 %; as White 76.0 / 100, as Black 50.0 / 100.
  - Elo against E: +92.5 ± 49.1 (LOS 100.0 %).
  - X = 1 810 + 92.5 = 1 902.5 ± 49.1.
  - Opening-cluster interval: ± 42.3 (iid ± 48.9).
  - G11: e4, g3, exd6, d4, Kc1. Two of the five differ from R1's.
  - Milestone: none.
  - R2 − R1 = +96.0 (about ± 68 combined), reported, not graded.
- **Validity:**
  - 200 / 200 games; faults 0, unclassified 0.
  - 0 time losses on either side.
  - Depth guard: 0 of 10 608.
  - skytalix latency: max 105 ms.
  - One move-cap draw (round 24; Stockfish showed `+M3`). It is not a fault, and at most 0.5 points.
- **Band:** P = 126.0 is inside 50–150 (outcome 2). The pre-approved step was not used, and there was no second run.
- **Wall:** 0.60 h (`r` 35 min 56 s), against an estimate of 0.4–0.9 h.
- **Host:** ALONE. 213 samples showed 0 foreign `vitest`, `cutechess-cli`, `stockfish` and `node`. load1 had a median of 1.40 (max 1.70). Tctl had a median of 74.0 °C (max 76.5 °C).
- **Acceptance:** R2-A1, A2 and A3 are MET. R2-A4 is open: it is BA/PM's records hop (`EPIC-011` § Phases R2 row and G2). The board move is the Orchestrator's.
- **Records:** `raw/out/r2/` and `raw/out/session/`, redacted by `raw/redact.sh`. That script was written after the seal and handles records only. The full 63 MB `r.out` stays in scratch; its sha256 is in `SHA256SUMS.unredacted-originals`. The build clone was deleted.
- **Fences held:** no `src/`, ADR, ticket, EPIC or board edit. No push, force, amend, rebase or merge. No foreign process was touched or recorded beyond a count.
