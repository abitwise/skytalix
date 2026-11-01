# ABC-254 QE artifacts: branch grugops/qe-ABC-254 (claim 2c0bcbc3, PREREG 12288266, raw evidence 6d393592); nothing pushed or merged; no process left running

*This is an `observation`, not an `artifact-ref`: no §14 gate run exists to bind (the se-ABC-254 and qe-ABC-248 precedent).*

- **Branch:** `grugops/qe-ABC-254`, worktree `.claude/worktrees/qe-ABC-254`, cut from `grugops/ABC-254` `fe53dbda` (code `600d8de3`). Not pushed, not merged.
- **Commits:**
  - `2c0bcbc3`: claim.
  - `12288266`: PREREG decision `…6b25d0a8` plus the scripts.
  - `6d393592`: raw evidence.
  - Then these notes, and the brief's Result with the move to `done/`.
- **Raw (`.grugops/context/qe-ABC-254/raw/`), host paths redacted to `$SCRATCH` / `$REPO`:**
  - `a4/`: `a4.jsonl` (main, 60 runs incl. re-run attempts), `a4-rerun2.jsonl` (the graded board re-run), `a4-rerun1-aborted.jsonl` (not graded), `analysis.jsonl`, `posthoc-info.txt` (INFO), `times.txt`, and `a4-clear-stuck.log` (the detector deadlock).
  - `g4/`: `g4-summary.txt` (`cmp` and counts), `g4-H.jsonl.gz` and `g4-sample-H.jsonl.gz` (the rows; B is byte-equal), `err-H.txt`.
  - `gates/`: lint, typecheck, build, the G8 table and per-run tails, the skip-integrity and lane-inventory output, the last-run counts, the G1 `cmp`, and perft H/B.
  - `deep/`: 16 lane summaries plus the verbose puzzle count. `fuzz/fuzz-H.json`.
  - `plants/`: the PL1–PL3b and PQ1–PQ3 outputs, with the PQ fuzz JSON and the PQ2 deep-A1 output.
  - `qe-scripts/`:
    - `probe.mjs`, `a4.mjs` (the version that ran the graded re-run; the main schedule ran it without the capped-wait lines), `a4-rerun1.mjs` (the version the main schedule and the aborted re-run ran), `host.mjs` (with the detector fix), `clear.mjs` (stuck, superseded), `analyse.mjs`;
    - `g4.mjs` and `run-g4.sh`; `fuzz.mjs`; `plant.py`; `g8.sh`, `deep.sh`, `batch1.sh` and `batch2.sh`; `seal.mjs`.
- **Scratch only, not committed:** the `git archive` trees B/H, the full archives FB/FP (`node_modules` symlinked), and the full G4 base rows (byte-equal to head's).
- **Commands, all under `flock …/host-test.lock`:**
  - `node a4.mjs` (main and re-runs);
  - `run-g4.sh`;
  - `npm run lint|typecheck|build`, and `npm test` ×6 (G8, b h h b b h);
  - `test-skip-integrity.js --skip-count 0` and `lane-inventory.js`;
  - `se-ABC-235/raw/g1.mjs` on B and H; `npm run perft` and `node src/perft-bench.ts`; `fuzz.mjs`;
  - single-file vitest for the plants, and `npm test` on PL3a;
  - the 16 deep lanes (`ENGINE_DEEP` / `SEARCH_DEEP` / `PERFT_DEEP` / `PUZZLE_DEEP`, heap 400, one file at a time) and the PQ2 deep A1.
  - **Exception, disclosed:** the graded board re-run ran under the lock held by my own suspended A4 job.
- **Processes:** no process of this hop is left running. My suspended driver was terminated, and the lock was released at 16:42:54Z. **No foreign process was killed.**
