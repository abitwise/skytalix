# qe-ABC-282 correction to `…e4b8527a` § Gates: the gates and lanes ran at `b1e7db39`

The note's "Run at `b1e7db39` and `1367de97`-line records only" is garbled. The lanes and gates ran with the worktree at `b1e7db39`, and R-281-a's four lines at the same commit (`raw/out/tlines/exits.txt`), `src/` `d235214c`, 0 dirty. `1367de97` was never a run point. No figure changes.

Also: `raw/out/lanes/exits.txt` lost its header line in the quota window, so the head of that run is read from the commit order, not from the file.
