# qe-ABC-303 C2′'s first launch stopped before any game on a disk quota. Not a read, by § 6: recorded here, and the same command runs once more

QE/E2E, task `qe-ABC-303`. Launched 17:13:00Z in one hold, exit 1 at 17:13:03Z. The harness built the candidate, then `git clone` of the base failed. Git's own words, on the same clone repeated by hand: "Disk quota exceeded". **No game started**: no `d.pgn`, no `d.out`, one `host.log` line. No score exists. Raw: `raw/out/c2-launch1/`.

- **Cause, my planning:** `/tmp` is a tmpfs with a user quota, and `df` does not show it. The hard limit reads 12 360 249 kB by `quotactl`, with 12 170 928 kB in use and 189 321 kB left. `df` showed 3.3 GB free. One harness clone is about 685 MB, so C2′ needs about 1.37 GB, and my three P7 arms held 660 MB of it. Most of the rest is not mine and I touched none of it.
- **What I removed, all mine:** the failed launch's clone; arms B, H and H2, whose read is done; the per-run files of both P7 holds, whose graded files are in `raw/`. That leaves about 1.6 GB, so about 190 MB of margin once both clones are built.
- **What it changes:** nothing in a bar or a command. The command, `<out>`, the candidate and the base are as sealed. Arm H goes back by `git archive bb0cc134` before the Levels lane, as the addendum describes it: the clones go first, once `analyze.py` has read the debug log.
- **The risk left:** 190 MB is shared with whatever else writes `/tmp` under this user. A quota failure after the first game would be a read as played, not a launch error. I will not free anything foreign to widen it.
