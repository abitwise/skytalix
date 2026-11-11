Smoke, NOT GRADED: 2 games (--rounds 1) at --skill 4 --elo 2040, run 2026-11-10T20:37:52Z-20:41:40Z under the host lock, before the PREREG seal.
Its only use: to read the control line, the engines' options, go movetime 1000 and skytalix's latency at 1 s on a real run, and the per-ply time for the estimate. No figure is drawn from it.
command: CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock node tools/rating/rating.ts r b6366a79 <out> --skill 4 --elo 2040 --rounds 1 --concurrency 1
sha256 of the unredacted r.out: 3a448dd0dbee173961d68a0c60e3e059536bdd14c683775794dae4926b150299
r.out lines (not committed, debug): 5575
