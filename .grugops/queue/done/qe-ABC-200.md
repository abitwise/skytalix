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

## Result

**QE/E2E, 2026-10-22: PASS_WITH_GAPS** (decision `…b8aa74fb`). No gap blocks. Under the owner delegation (`…5aaf7cec`), this verdict signs UAT. QE releases `In Review`; the Orchestrator moves the board (`plans/` is fenced).

- **Where it ran:**
  - Worktree `../wt-qe-ABC-200` on `grugops/qe-ABC-200`, cut from tip `0a07df04`.
  - **Merge `d062d60e`** brings in `main` `be70482f`: a merge, not a rebase, records only. Its subject is git's default (`QE-200-g`).
  - **Commit `55618845`**: 6 sealed notes and the `## QE` section on the ABC-200 page.
  - Own `node_modules` (`npm ci --ignore-scripts`); scratch only in `…/scratchpad/qe200/`. Base ran from `git archive bd745ac9` in scratch, with its own `npm ci`.
  - Not pushed, nothing merged into `main`.
- **Verdict formed before** the SE's notes were opened (written to scratch at 19:59:53Z). The SE's notes agree on every shared number.
- **A1–A7, A9 MET** on QE's own runs (`…0bce441b`).
- **A8 MET on a real pseudo-terminal** (`…97b2d4d9`; raw bytes losslessly in `…9c82cf61`, 15 transcripts, sha256 each):
  - **How it was driven:** `expect` spawns `script -q <log> /bin/sh -c "npm run chess …; echo EXITSTATUS=$?"`. Case 7 runs under detached GNU `screen`, with `-X stuff` for keys and `-X hardcopy` for the rendered screen. Case 8a is a plain no-tty shell.
  - (1) `black`, `1`: the engine moved first as White (`1. d4`), with the board from Black's side.
  - (2) Two empty lines: White's side, the human to move; `e4` was played and the engine replied `e5`.
  - (3) Wrong answers:
    - `purple`, ESC (absent from the echo), `6`, `0`, `03`: one rejection each, then the same question.
    - The 1 025-character line is unsubmittable at a macOS tty (`MAX_CANON` 1 024, BEL). Ctrl-U recovered (`QE-200-c`).
  - (4) The paste `black\n1\ne5\n`: `e5` was played after the engine's `e4`, and nothing was read twice.
  - (5) Ctrl-D at colour and at difficulty: exit 0, 0 frames, no stack trace, and the process ended.
  - (6) Both flags: no question. Also 6b (`--colour black` alone) and 6c (`--difficulty 2` alone): one question each.
  - (7) On the rendered screen, the first frame replaced both question lines.
  - (8) 8a, 8b and 8c (both pipes, stdout piped, stdin piped): no question. Pipe output is byte-identical to base on `</dev/null` (542 B) and `help` (1 029 B).
- **Plants** (whole suite, scratch copies):
  - P1 → A6 ×4 (and `cli.test.ts` as a file); P2 and P2c → A2; P3 → A7; P4 → A4 ESC; P5 → A9; P6 → A7.
  - Extra: Q2o, Q2i, Q3 and Q4 red. Probes Q1b and P5b green → `QE-200-a`, `QE-200-b`.
- **Deviation ruling:** accepted. An empty answer returning `parsed.options` gives exactly `white` / `DEFAULT_DIFFICULTY`, because a question is asked only when its flag is absent. That matches the ruling's "never re-spelled"; not importing the name is a difference in form only.
- **Gates at `d062d60e`** (`…7d19b107`):
  - lint, typecheck and build 0; `dist/` has 22 files, neither new module.
  - `npm test` 61 / 2 017 rc 0, `last-run.json` success true; base 60 / 1 995 (run). Names equal apart from +22 and 1 licensed rename.
  - Skips 0 → `No findings.`
  - CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, INPUT_DEEP 34. Heap 128 multi-file, 400 one-file.
- **Gaps** (`…843719f4`):
  - `QE-200-a` LOW: the entry point's use of the answers is held by text pins only (Q1b green); the pty and a probe show it works.
  - `QE-200-b`: A9's row is source order only (P5b green); a probe shows 1 read, after the answers.
  - `QE-200-c`: the over-cap line cannot be typed at a macOS tty.
  - `QE-200-d`: EOF at a question leaves no newline.
  - `QE-200-e`: `line-reader.ts`'s import set is unpinned.
  - `QE-200-f` (Orchestrator): merge after ABC-178 and ABC-199; merge `main` in and re-gate.
  - `QE-200-g`: the QE merge subject.
  - All INFO except `-a`.
- **Notes:** `.grugops/context/qe-ABC-200/notes/` on `grugops/qe-ABC-200`: `…0bce441b`, `…7d19b107`, `…97b2d4d9`, `…9c82cf61`, `…843719f4`, `…b8aa74fb`.
- **No timing claims** and no `NFR-008` or `N8-LANE` reading.

**Addendum (same hop).** `main` moved `be70482f` → `4c014a53` during this hop. The move is records only (Security/NFR for ABC-200, `d55fed25`), with nothing under `src/`, `tools/` or `package*`, so the readings at `d062d60e` stand.

**Trace row** (for the Orchestrator):

| ABC-200 (qe-ABC-200) | QE: A1–A9 met on own runs at d062d60e (main be70482f merged into tip 0a07df04); A8 on a real pty (expect + script -q; case 7 GNU screen hardcopy), 8 cases + 6b/6c, raw kept in …9c82cf61; P1–P6 red on named rows (+P2c, Q2o, Q2i, Q3, Q4); SE deviation (empty → parsed.options) accepted, behaviour identical | EPIC-006 | — | NFR-007 not read here; N8-LANE owed after ABC-178 (Security/NFR d55fed25); QE-200-a LOW (entry wiring text-pinned, Q1b green) / -b / -c / -d / -e / -f / -g INFO | grugops/qe-ABC-200 @ 55618845 (merge d062d60e)<br>.grugops/context/qe-ABC-200/notes/ (6), ABC-200 page ## QE | lint/typecheck/build 0, dist/ no new module; npm test 61/2017 (base 60/1995 run), success true; skips 0, No findings.; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, INPUT_DEEP 34 | UAT signed by QE PASS_WITH_GAPS …b8aa74fb under …5aaf7cec (production lines; not waived) | — | In Review → next per Orchestrator (QE PASS_WITH_GAPS …b8aa74fb; Security/NFR recorded d55fed25; merges after ABC-178 → ABC-199) |
