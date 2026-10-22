---
subtask: qe-ABC-200
role: qe-e2e
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/qe-ABC-200/
branch: grugops/ABC-200 (tip 0a07df04; code 1efd2cee; base bd745ac9); worktree ../wt-ABC-200 (read only)
width: 2 (beside security-nfr-ABC-200)
---

# QE gate for ABC-200: A1–A9, including the A8 hand reading on a real terminal. Your verdict also stands as UAT

## Do
- Create your own worktree `../wt-qe-ABC-200` on `grugops/qe-ABC-200` from the tip. Merge the current `main` in first (a merge, not a rebase). Run your own `npm ci --ignore-scripts`.
- Re-read A1–A7 and A9 on your own runs **before** opening the SE's notes (`…f274160a`, `…3ccb839a`, `…11628f2f`). Re-plant P1–P6 on scratch copies; each must go red on its named row. Run base `npm test` for real; do not subtract.
- **A8, on a real pseudo-terminal** (for example `script -q <logfile> npm run chess`, driven with `expect` or a small node-pty-free driver; your choice, and say how). Keep the raw transcripts. Cover the SE's eight cases:
  1. black then 1;
  2. two empty answers;
  3. wrong answers;
  4. the pasted line `black\n1\ne5\n`;
  5. Ctrl-D at each question: exit status 0 and prompt, with no frame and no stack trace (the Architect's residual 3);
  6. both flags given;
  7. the first frame overwrites the question lines;
  8. piped input and output.
  If a case cannot be driven on this host, say exactly which case and why. Do not guess.
- Rule on the SE's deviation: an empty answer keeps `parsed.options` instead of importing `DEFAULT_DIFFICULTY`. Is the behaviour identical, and is it in line with the ruling?
- Gates at your merge: lint, typecheck, build (`dist/` gains neither new module); `npm test` + `last-run.json`; skip capture → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`, `INPUT_DEEP`. Heap 128 multi-file, 400 one-file. No timing claims.
- **Verdict:** PASS, PASS_WITH_GAPS or FAIL, with a gap register (`QE-200-x`). Under the owner delegation `…5aaf7cec`, a PASS or PASS_WITH_GAPS with no blocking gap signs UAT, so write the A8 evidence as you would for a human reader.

## Fences
- Work only in `../wt-qe-ABC-200` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe200/`. Commit notes plus a `## QE` section on the ABC-200 page in your worktree. No `src/` edits on the tip; no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
