# qe-ABC-275 runs: commands, test data and flaky risk (offline only; nothing left running)

- **Trees.** `git archive 30d15584` (before) and `git archive ed52e5a2` (after), extracted to a session scratch dir. `GIT_DIR` pointed at the worktree's git dir so `git rev-parse` resolves the SHA argument. `CUTECHESS_CLI` and `STOCKFISH` were set to two 1-byte readable dummy files (dry runs read the paths at load and start nothing). SHA argument `30d15584`. One fixed, never-created `<out>` path. The tree root was replaced by `<ROOT>` before `diff`.
- **A2 argv list (34):**
  - r with no flag; `--elo 1810 --rounds 5 --concurrency 1`; `--budget-ms 500 --rounds 5 --concurrency 1`, with and without `--elo 1810`; `--elo` 2601 / 3190 / 1320, with no flag and at 500; `--concurrency 8 --rounds 1`.
  - d at its default and at 3000 / 2500 / 2000 / 1500 / 1000 / 100; d 100 `--rounds 50 --concurrency 1`.
  - rpair at its default; rpair `--elo 1810 --rounds 10 --concurrency 1`.
  - Refusals: r `--elo` 3191 / 1319; `--budget-ms 500.0` (accepted, QE-255-b); `--concurrency 2.0`; `--rounds 0`; `--skill 3`; d `--elo`; d `--budget-ms` 500 / 4000; rpair `--budget-ms` 100 / 500; rpair `--rounds 15`; r with a missing positional.
  - Result: 22 exit 0 + 12 exit 1, identical on both sides. `diff` with stack-frame line numbers normalised: empty.
- **A1 / A3 / A4** were run in the worktree itself. The A1 vector was compared with `diff` against an expected list typed from the ticket.
- **Gates** (worktree, main's `node_modules` symlinked, then removed): `node --test tools/rating/pair-check.ts`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` (13:01:54Z–13:02:04Z, 9.42 s).
- **Mutants:** 4, in the scratch after-tree only. The worktree source was never edited, and `cmp` confirmed the restore.
- **Flaky risk:** low. The rows are pure argv prints with no timing, engine or network. The only environment coupling is `homedir()` placeholder logic in the existing harness helper.
- **Coverage:** the mode is lean, and pair-check is outside the vitest lane, so no coverage threshold applies. Six new rows plus one edited row cover A1 / A3 / A4 / A5. A2 rests on the 32 old rows, which pass unedited, and QE's 34-argv before/after diff.
- **Scratch** was deleted after the run. No process was left running.
