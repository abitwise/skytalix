L5 night 3, E 2280, graded, read by QE in stage C (qe-ABC-322) against PREREG 1d9e9a62 (qe-ABC-320's, sealed before night 1).
Session: night.sh 2280 56 <out-root> <repo>, under flock <scratch>/host-test.lock, launched by the orchestrator on W (cut note dbb1a3ae, 2026-11-13).
<repo> was qe-ABC-320's worktree at 7469531f (tools/ 2ae53ab1, src/ b668b153, clean); the sealed scripts check OK there.
Session start 2026-11-13T21:59:44Z, exit 0 at 2026-11-14T04:40:38Z (el 24 054 s). 6 clean chunks, 60 games, openings 56-85. The 8 h guard refused chunk 86; next start 86.

Layout (redacted copies, made with qe-ABC-320's raw/redact.sh, unchanged; the session repo and scratch are placeholders):
- cSSS/          one chunk each (S = 56, 61, 66, 71, 76, 81): artifacts.txt, cmd.txt, machine.txt, r.pgn, r.summary.out (r.out's non-debug lines),
                 summary.txt, the two stderr files (0 bytes), the harness's SHA256SUMS, and SHA256SUMS.unredacted-originals.
                 build-skytalix.log and host.log are hashed in the originals list only (nights 1 and 2's model).
- night/         the session's rsum.txt, read.txt, next-start, the six cSSS.run.txt, and l5-n3.console (the orchestrator's console).
                 session.log (byte-equal to the console this night) and sampler.log are hashed in the originals list only.
- pool-n1-n3/    QE's re-run, under the host lock, of rsum and raw/scripts/read.mjs 5 2280 4000 over the 17 chunk dirs of nights 1-3
                 (openings 1-85): the interim over 170 games, not L5's figure.
Placeholders: <out> = the chunk's out-dir, <out-root> = the night's out-root, <scratch>, <repo>, <cutechess-cli>, <stockfish>, <node>, <home>.
The raw chunk out-dirs (with the full r.out debug logs) stay in <scratch>; a byte-equal copy of all three nights is on the owner's durable disk.

QE re-ran, under the host lock, with no engine start: rsum over the six chunk dirs (byte-equal to the session's rsum.txt) and
raw/scripts/read.mjs 5 2280 4000 over them (byte-equal to the session's read.txt). The six harness SHA256SUMS check OK on the raw dirs.
rsum over the durable copy's 17 chunk dirs gives the same pooled lines as over scratch (only the segment paths differ).

Foreign load (FL), from sampler.log (2 380 samples, every 10 s, class and count only):
  foreign vitest 0; foreign cutechess-cli 0; foreign stockfish 0;
  foreign node 6 (count 1 each, chunks 61, 61, 71, 76, 81, 81; each 42-393 s from the nearest game boundary).
  Not SHARED (vitest + cutechess-cli in 0 % of samples, bar 20 %).
  Tctl min 40.5, mean 71.3, max 75.5 C (THERMAL bar: median of 30 above 85). load1 mean 1.18, max 2.54. Free space min 6 261 MB.
  The harness's own host.log: 469 lines, foreign_vitest_procs=0 in all.
