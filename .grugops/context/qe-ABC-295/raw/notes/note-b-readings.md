# qe-ABC-295 stage B readings: one sealed session under the host lock, 15:28:10Z–16:04:27Z. Gates 1–4 passed (W-check 0 / 0 / 0). `r` on `e069b49a` at E 1 810 ran once: exit 0, stop none, 200 of 200 games in 35 min 56 s. Then G11 and `read.mjs`. The host was ALONE: 0 foreign processes of any class in all 213 samples. Nothing re-played, nothing left running

QE/E2E, task `qe-ABC-295`, stage B, branch `grugops/qe-ABC-295` at `3d67f457` (harness `tools/` `c361f429`). The Orchestrator's go line is in the brief (`## Stage B — go`, 15:27:14Z), citing the owner's held host (W, orch note `…810191ff`). Paths are placeholders (`ADR-0049` d4). Raw: `raw/out/r2/` (the tool's records) and `raw/out/session/` (the session's own logs, `read.mjs` output and G11).

## Order, as sealed in PREREG `…4151e128`
1. 15:28:04Z: a pre-check with the sealed `hostcheck.sh`. load1 0.43, Tctl 43.2 °C; foreign `vitest` 0, `cutechess-cli` 0, `stockfish` 0, `node` 0.
2. 15:28:10Z: `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/<home>/<repo>/host-test.lock bash .grugops/context/qe-ABC-295/raw/scripts/session.sh <out> <repo>`. The scripts' sha256s were checked against `raw/scripts/SHA256SUMS` just before: all 5 OK. The session held the lock once, for all of it.
   - Gate 1: both tool sha256s = pin. `cutechess-cli` 1.5.1 `dc776901…2154f40a`; Stockfish 19 `c78c22a9…4593e352d2`. These are the same two binaries as at stage A.
   - Gate 2: `e069b49a:src` = `bba42fb7`; `HEAD:tools` = `c361f429`. `main` was `8f86a69c` at the read, with the same `src/` and `tools/` trees (checked with `git rev-parse`).
   - Gate 3: 3 531 MB free in the temp file system, so ≥ 1 024.
   - Gate 4 (W's check): `foreign_vitest=0 foreign_cutechess=0 foreign_stockfish=0 foreign_node=0`, load1 0.48, Tctl 42.2 °C. **Passed.**
3. 15:28:10Z–16:04:06Z: the R2 command, once. `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r e069b49a <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`. Exit 0, stop none.
4. 16:04:06Z–16:04:27Z: G11. Five fresh processes on the tool's clone (`e069b49a`, `src/` `bba42fb7`). Each searched 4 000.3–4 002.1 ms.
5. 16:04:27Z: `read.mjs <out>`, offline, rc 0.

## Build and records
- **One clone of `e069b49a`**, built by `npm ci` and `npm run build`. `dist/` has 24 files, tree sha256 `fd27ec59…5c8` (`artifacts.txt`). The UCI handshake names `skytalix` with `Skill Level` default 5.
- **`cmd.txt`** shows skytalix at `st=0.1 timemargin=50 restart=on`. It shows Stockfish at `st=0.1 timemargin=2000 restart=on`, `Threads=1`, `Hash=16`, `UCI_LimitStrength=true`, `UCI_Elo=1810`. It also has `-openings … order=sequential -repeat -games 2 -rounds 100 -concurrency 1 -maxmoves 200 -debug all`.
- **`machine.txt`:** both tool lines `= pin`. Its `control:` line is byte-equal (`grep -x`) to `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`.
- **The tool's own `SHA256SUMS`** checks OK on the originals.
- **`raw/out/r2/`** holds the tool's files with paths redacted by `raw/redact.sh`. That script was written after the seal; it handles records only. `r.summary.out` is `r.out` without its `-debug` lines. The full 63 MB log stays in scratch, and its sha256 is in `SHA256SUMS.unredacted-originals`. The tool's `host.log` holds counts only.

## Wall time and throughput
- **Wall time:** `r` took 35 min 56 s. The whole session took 36 min 17 s with G11 and the read: **0.60 h**, about 334 games/h. The PREREG estimate was 25–55 min (0.4–0.9 h), so it was met. R1 took 35 min 29 s.
- **Games:** 10.0 s on average and 40 s at most. Plies per game: 87 at the median and 106.2 on average.

## Host, by class and count only (213 samples, 10 s apart)
- load1: median 1.40, max 1.70.
- Tctl: median 74.0 °C, max 76.5 °C. THERMAL (a 30-sample median above 85 °C) never fired. RUNAWAY (90 min) never fired.
- Temp free: 2 698–2 759 MB.
- **Foreign `vitest` 0, `cutechess-cli` 0, `stockfish` 0, `node` 0 in every one of the 213 samples.** The tool's own `host.log` agrees: `foreign_vitest_procs=0` in all 237 of its lines. So the reading is **ALONE**, not SHARED. No foreign process was touched, and none was recorded beyond a count.

## Checks and quirks (none touches validity)
- **One move-cap draw.** Round 24 (opening 24), Stockfish White and skytalix Black, adjudicated a draw at 400 plies by `-maxmoves 200`. At the last move Stockfish's comment showed `+M3`. The draw gives skytalix at most +0.5 that a played-out game might not have. At 125.5 / 200 the score would be 62.75 %, about +91 Elo, with the same band outcome. R2-A1 does not count a move-cap draw as a fault, and the tool reports it on its own line (`move-cap draws: 1`).
- **Sampler cosmetics.** For the first two samples, before `r.out` existed, the sealed sampler's `grep -c … || echo 0` wrote "0" twice. That split each of those lines in two. The read does not use the sampler. All 213 samples carry a full host line.
- **Build log:** the build log has `npm audit` and `install-scripts` warnings from `npm ci`. They belong to the build tooling and are not a read fault. The build exited 0.
- **Nothing left running:** 0 `cutechess-cli` and 0 `stockfish` processes after the session. The tool's clone was deleted from scratch after the records were copied. The full `r.out` and PGN stay in scratch.
