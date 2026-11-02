# qe-ABC-264-p2 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

- **Branch and worktree:** branch `grugops/qe-ABC-264-p2`, worktree `.claude/worktrees/qe-ABC-264-p2`, from `grugops/ABC-264-fix` `4d1c0616`.
- **Commits:** claim `fe5a1b12`; PREREG `e32b4745`; then the notes commit and the closing commit.
- **Candidate and base:** candidate `4d1c0616` (code `358b5f4a` + `bcc82866`). Base `0b73f51d` is the merge-base with `main`; `src`, `tools` and `package.json` show no diff to `main`.
- **Host:** AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, node v26.12.1. cutechess-cli 1.5.1 and Stockfish 19 both equal their pins.
- **Window:** 2026-11-02T13:43:02Z to 14:27:19Z, all under `flock <host-test.lock>`.
- **Raw records** (host paths masked), under `.grugops/context/qe-ABC-264-p2/raw/`:
  - `gates/` (test, lint, typecheck, build);
  - `a6/`: d.log, cmd.txt, artifacts.txt, SHA256SUMS, host.log, machine.txt, summary.txt, cutechess-summary.txt, timing-and-pairs.txt;
  - `smoke/`: the same set, plus latency-and-pool.txt;
  - `levels/` (verbose log);
  - `note-src/`; `scripts/seal.mjs`.
- **Deleted after the figures were recorded** (brief): both PGNs, both cutechess `-debug` logs (`d.out` 10.9 MB, `r.out`), and the build clones.
- **Nothing left running.** Not pushed, not merged.
