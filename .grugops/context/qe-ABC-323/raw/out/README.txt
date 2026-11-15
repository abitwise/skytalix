L5 night 4 and the full 200-game reading, E 2280, graded, read by QE in stage C (qe-ABC-323) against PREREG 1d9e9a62 (qe-ABC-320's, sealed before night 1).
Session: night.sh 2280 86 <out-root> <repo>, under flock <scratch>/host-test.lock, launched on W (cut note 481f29ee, 2026-11-14) by an orchestrator
waiter on its first quiet check (night/n4-waiter.log; the waiter script itself carries host paths and is not committed).
<repo> was qe-ABC-320's worktree at 7469531f (tools/ 2ae53ab1, src/ b668b153, clean); the sealed scripts check OK there.
Session start 2026-11-14T22:28:47Z, exit 0 at 2026-11-15T01:46:52Z (el 11 885 s). 3 clean chunks, 30 games, openings 86-100; next start 101.

Layout (redacted copies, made with qe-ABC-320's raw/redact.sh, unchanged; the session repo and scratch are placeholders):
- l5-e2280-n4/cSSS/   one chunk each (S = 86, 91, 96): artifacts.txt, cmd.txt, machine.txt, r.pgn, r.summary.out (r.out's non-debug lines),
                      summary.txt, the two stderr files (0 bytes), the harness's SHA256SUMS, and SHA256SUMS.unredacted-originals.
                      build-skytalix.log and host.log are hashed in the originals list only (nights 1-3's model).
- l5-e2280-n4/night/  the session's rsum.txt, read.txt, next-start, the three cSSS.run.txt, l5-n4.console (the waiter's console capture)
                      and n4-waiter.log (class and count only). session.log (byte-equal to the console this night) and sampler.log are
                      hashed in the originals list only.
- l5-full/            QE's run, under the host lock, of rsum and raw/scripts/read.mjs 5 2280 4000 over the 20 chunk dirs of nights 1-4
                      (openings 1-100): full-rsum.txt and full-read.txt over scratch, full-rsum-durable.txt over the owner's durable copy.
                      This is the full reading, 200 games.
Placeholders: <out> = the chunk's out-dir, <out-root> = the night's out-root, <scratch>, <repo>, <cutechess-cli>, <stockfish>, <node>, <home>
(<home>/skytalix-ratings is the owner's durable copy).
The raw chunk out-dirs (with the full r.out debug logs) stay in <scratch>; a byte-equal copy of all four nights is on the owner's durable disk.

QE re-ran, under the host lock, with no engine start: rsum over night 4's three chunk dirs (byte-equal to the session's rsum.txt) and
raw/scripts/read.mjs 5 2280 4000 over them (byte-equal to the session's read.txt). The three harness SHA256SUMS check OK on the raw dirs.
rsum over the durable copy's 20 chunk dirs gives the same lines as over scratch but for the segment path prefix; read.mjs over it is byte-equal.
diff -rq scratch against the durable copy: equal for all four nights (77, 65, 77 and 41 files) and for the night-4 console.

Foreign load (FL), from sampler.log (1 176 samples, every 10 s, class and count only):
  foreign vitest 1 sample (count 1, el 10 884 s, chunk 96 after game 7, 275 s from the nearest game boundary);
  foreign cutechess-cli 0; foreign stockfish 0; foreign node 0.
  Not SHARED (vitest + cutechess-cli in 0.09 % of samples, bar 20 %).
  Tctl min 40.6, mean 71.1, max 74.9 C; worst rolling median of 30 72.9 (THERMAL bar: above 85). load1 mean 1.15, max 3.17. Free space min 6 517 MB.
  The harness's own host.log: 232 lines, foreign_vitest_procs=0 in all.
  Before launch: an orchestrator check at 22:28:16Z saw foreign vitest 2 (load1 0.83); the waiter's check at 22:28:46Z and night.sh's W-check at
  22:28:47Z saw 0 / 0 / 0 / 0 (load1 0.85).
