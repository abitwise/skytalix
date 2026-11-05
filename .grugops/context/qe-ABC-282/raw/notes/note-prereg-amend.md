# qe-ABC-282 PREREG amendment, sealed before any game: A6's harness runs from a small `--shared` checkout, and this is launch 3. No bar, command token, build or control changes. Also a count fix: the A3 (b) sweep is 1 140 go lines, not 2 280

Amends `…416a183f`. **No game has been played, so no result was seen before this note.**

## Why a third launch
- **Launch 1 (21:26:23Z):** the harness stopped building the base. `git clone` exited 128 with `Disk quota exceeded`. `/tmp` is a tmpfs with a per-user quota, hard 11.79 GiB, and a clone copies about 0.72 GB across filesystems. Most of the quota is other hops' scratch, which this hop did not touch. The candidate built.
- **Launch 2 (21:28:54Z):** the same command with `<out>` under `<worktree>/games/`. The harness refused it before doing anything: `freshOut` will not take an `<out>` inside its checkout. That guard is deliberate, and QE-204-a closed its symlink form. It is respected, not worked around.
- The PREREG said a pre-game error gets the same command "once more". Launch 3 goes past that wording, so it is stated here. Both stops came before any engine played, so this cannot be a re-play of anything.

## What changes
- **The harness's checkout only.** `<scratch>/qe282/repo` is `git clone --shared --no-checkout <worktree>` with a sparse checkout of `tools/rating`, `src` and `data`, at `701326a5`. `run-a6.sh` is unchanged and gets it as `<worktree>`.
- Its object store is the repository's, by alternates, so each match clone is about 0.39 GB in place of 0.72 GB, and the two fit in the quota. `<out>` stays in `<scratch>/qe282`, outside that checkout, so the guard holds.
- **Read equal before sealing:** `tools/rating` is `diff -r` clean against the worktree (tree `8f03fe47`), and `src/` too. The `--dry-run` argv is byte-equal from both checkouts.
- **The builds do not change.** The harness still clones, checks out `04ebeb7e` and `22931005` by SHA, runs `npm ci` and builds. The candidate's dist tree sha256 must equal launch 1's `c3f8c88d…d304`. If it differs, the read is not started on.

## What does not change
Every bar, 100 games, `tc=40/8`, the verdict rules, A4's hold. A miss is still final. A further pre-game failure is recorded and reported; no fourth launch without saying so first.

## Count fix
The PREREG's A3 (b) sweep is 19 × 6 × 5 × 2 = **1 140** go lines. It said 2 280; the script was always 1 140.
