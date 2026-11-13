L5 night 2, E 2280, graded, read by QE in stage C (qe-ABC-321) against PREREG 1d9e9a62 (qe-ABC-320's, sealed before night 1).
Session: night.sh 2280 31 <out-root> <repo>, under flock <scratch>/host-test.lock, launched by the orchestrator on W (cut note b354e881, 2026-11-12).
<repo> was qe-ABC-320's worktree at 7469531f (tools/ 2ae53ab1, src/ b668b153, clean); the sealed scripts check OK there.
Session start 2026-11-12T22:48:44Z, exit 0 at 2026-11-13T04:53:35Z (el 21 891 s). 5 clean chunks, 50 games, openings 31-55. The 8 h guard refused chunk 56; next start 56.

Layout (redacted copies, made with qe-ABC-320's raw/redact.sh, unchanged; the session repo and scratch are placeholders):
- cSSS/          one chunk each (S = 31, 36, 41, 46, 51): artifacts.txt, cmd.txt, machine.txt, r.pgn, r.summary.out (r.out's non-debug lines),
                 summary.txt, the two stderr files (0 bytes), the harness's SHA256SUMS, and SHA256SUMS.unredacted-originals.
                 build-skytalix.log and host.log are hashed in the originals list only (night 1's model).
- night/         the session's rsum.txt, read.txt, next-start, the five cSSS.run.txt, and l5-n2.console (the orchestrator's console).
                 session.log (= the console without its last two lines) and sampler.log are hashed in the originals list only.
- pool-n1-n2/    QE's re-run, under the host lock, of rsum and raw/scripts/read.mjs 5 2280 4000 over the 11 chunk dirs of nights 1 and 2
                 (openings 1-55): the interim over 110 games, not L5's figure.
Placeholders: <out> = the chunk's out-dir, <out-root> = the night's out-root, <scratch>, <repo>, <cutechess-cli>, <stockfish>, <node>, <home>.
The raw chunk out-dirs (with the full r.out debug logs) stay in <scratch>; a byte-equal copy of both nights is on the owner's durable disk.

QE re-ran, under the host lock, with no engine start: rsum over the five chunk dirs (byte-equal to the session's rsum.txt) and
raw/scripts/read.mjs 5 2280 4000 over them (byte-equal to the session's read.txt). The five harness SHA256SUMS check OK on the raw dirs.
rsum over the durable copy's 11 chunk dirs gives the same pooled lines as over scratch.

Foreign load (FL), from sampler.log (2 166 samples, every 10 s, class and count only):
  foreign vitest 1 sample (count 1, chunk 46, mid-game, not at a game boundary; the harness's host.log saw it in the same minute);
  foreign cutechess-cli 0; foreign stockfish 0; foreign node 5 (count 1 each, chunks 31, 31, 36, 41, 51).
  Not SHARED (vitest + cutechess-cli in 0.05 % of samples, bar 20 %).
  Tctl min 40.5, mean 71.0, max 75.2 C (THERMAL bar: median of 30 above 85). load1 mean 1.19, max 1.97. Free space min 5 997 MB.
  The harness's own host.log: 421 lines, foreign_vitest_procs=0 in 420 and 1 in one.
