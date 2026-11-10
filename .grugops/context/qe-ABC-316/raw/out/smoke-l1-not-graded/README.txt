Smoke, NOT GRADED: 2 games (--rounds 1) at --skill 1 --elo 1320, run 2026-11-10T15:46:04Z-15:46:54Z under the host lock, before the PREREG seal.
Its only use: to read machine.txt's control line and the engines' options on a real run (SE's open item). No figure is drawn from it.
command: CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock node tools/rating/rating.ts r b6366a79 <out> --skill 1 --elo 1320 --rounds 1 --concurrency 1
sha256 of the unredacted r.out: 4d4aa8db9a52d0bedf0ec9e14ac700e8e802a1adde1c5eb8f412bcecadeac5d4
r.out lines (not committed, debug): 9507
