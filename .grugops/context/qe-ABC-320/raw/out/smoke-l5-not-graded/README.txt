Smoke, NOT GRADED: 2 games (--rounds 1 --start 1) at --skill 5 --elo 2280, run 2026-11-11T21:59:20Z-22:21:45Z (22 min 25 s) under the host lock, before the PREREG seal.
Its only uses: to read the control line, the start line, the engines' options, go movetime 4000 and skytalix's latency at 4 s on a real run, and the per-ply time, log size and build time for the estimate. No figure is drawn from it; its score is not used.
command: CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock node tools/rating/rating.ts r cddd4df9 <out> --skill 5 --elo 2280 --rounds 1 --start 1 --concurrency 1
host before: load1 0.46, Tctl 33.8 C, foreign vitest / cutechess-cli / stockfish / node 0 / 0 / 0 / 0. After: load1 1.33, Tctl 69.1 C, 0 / 0 / 0 / 0 (class and count only).
sha256 of the unredacted r.out: 2d35ac36154b3004132e76f2688cba167751a9bb46e7e8756ba97971bda9c762
r.out lines (not committed, debug): 16232; 2 117 602 bytes (about 6.2 KB a ply). The build clone (805 MB) was deleted after the smoke.
read.txt: raw/scripts/read.mjs 5 2280 4000 <out>, the sealed read script, run on this smoke.
