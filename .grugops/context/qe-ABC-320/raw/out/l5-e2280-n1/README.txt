L5 night 1, E 2280, graded, read by QE in stage C (qe-ABC-320) against PREREG 1d9e9a62.
Session: night.sh 2280 1 <out-root> <repo>, under flock <scratch>/host-test.lock, launched by the orchestrator on the brief's Stage B line (W, 2026-11-11).
Session start 2026-11-11T22:28:53Z, exit 0 at 2026-11-12T04:50:14Z (el 22 880 s). 6 clean chunks, 60 games, openings 1-30. The 8 h guard refused chunk 31; next start 31.

Layout (redacted copies, made with raw/redact.sh, a byte copy of qe-ABC-317's but its header line):
- cSSS/      one chunk each (S = 1, 6, 11, 16, 21, 26): artifacts.txt, cmd.txt, machine.txt, r.pgn, r.summary.out (r.out's non-debug lines),
             summary.txt, the two stderr files (0 bytes), the harness's SHA256SUMS, and SHA256SUMS.unredacted-originals.
             build-skytalix.log and host.log are hashed in the originals list only (ABC-317's model).
- night/     the session's rsum.txt, read.txt, next-start, the six cSSS.run.txt, and l5-n1.console (the orchestrator's console).
             session.log (= the console without its last line) and sampler.log are hashed in the originals list only.
Placeholders: <out> = the chunk's out-dir, <out-root> = the night's out-root, <scratch>, <repo>, <cutechess-cli>, <stockfish>, <node>.
The raw chunk out-dirs (with the full r.out debug logs) stay in <scratch>: rsum needs r.out for the 200-game reading.

QE re-ran, under the host lock, with no engine start: rsum over the six chunk dirs (byte-equal to night/rsum.txt) and
raw/scripts/read.mjs 5 2280 4000 over them (byte-equal to night/read.txt). The six harness SHA256SUMS check OK on the raw dirs.

Foreign load (FL), from sampler.log (2 264 samples, every 10 s, class and count only):
  foreign vitest 0 samples; foreign cutechess-cli 0; foreign stockfish 1 (count 1, at a game boundary in chunk 6);
  foreign node 3 (count 1 each, chunks 1 and 16). Not SHARED (vitest + cutechess-cli in 0 % of samples, bar 20 %).
  Tctl min 41.2, mean 70.2, max 74.8 C (THERMAL bar: median of 30 above 85). load1 mean 1.18, max 2.03. Free space min 5 350 MB.
  The harness's own host.log: 449 lines, foreign_vitest_procs=0 in all.
