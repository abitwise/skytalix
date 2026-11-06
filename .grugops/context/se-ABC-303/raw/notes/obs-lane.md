# se-ABC-303 observation: the lane, ungraded: paired head minus base +0.07 s median, n 6; head median 9.70 s, max 9.90 s; the bundle's rows 7.0 ms in-thread

`npm test`, tip tree against `main` `1bcdbf2d` tree, full `git archive` arms with `node_modules` linked, one lock hold, seven interleaved pairs, pair 0 a warm-up, order alternating (`raw/wall.sh`, `raw/out/wall.tsv`). Every run exit 0; 2 708 / 2 708 in 71 files on head, 24 more than base's 2 684.
- **Wall:** B median 9.59 s, H median 9.70 s, H max 9.90 s. Paired H − B median **+0.07 s**, per pair +0.21, +0.20, −0.27, −0.06, −0.07, +0.35. Budget ≤ +0.10 s; **ungraded**. The spread (−0.27 to +0.35) is wider than the budget, so this reads the budget loosely; QE's twin grades it. load1 2.97–4.42.
- **In-thread:** the 24 ABC-303 rows sum to **7.0 ms** (aim ≤ 90 ms), largest 3.2 ms. No row near 50 ms. The older rows changed are source and list rows whose work did not grow.
- **A first run of the pairs is void:** on a partial tree every run exited 1, in both arms. Not used.
