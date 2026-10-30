---
subtask: se-ABC-225
role: software-engineer
ticket: ABC-225
ref: .grugops/context/se-ABC-225/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows)
branch: new grugops/ABC-225 from main, worktree ../wt-ABC-225
---

# ABC-225: `rating.ts rpair`, an interleaved R pair (tools only)

Build the ticket `plans/tickets/ABC-225-…` exactly: its scope, its acceptance A1–A6, its NFR triggers and its test notes.
Read EPIC-010 § The merge rule, BA/PM `bapm-owner-words-b/…2930f1bd`, the Architect's R/D notes
(`arch-epic008-rd/…0c5d62f4`: opening-paired error, the nps host check) and `tools/rating/rating.ts` with the ADRs it cites
(ADR-0049 d4: no tool paths in records).

## Do
- TDD encouraged. Defaults of `r` and `d` stay byte-identical: prove it with the dry-run / stub-cutechess `cmd.txt`
  comparison, as `se-tools-rating-concurrency` did.
- **A1–A4 by dry run and fixtures only. Don't play the A5 real smoke yourself:** that is QE's, ALONE. Leave A5 and A6
  for QE and say so.
- Gates: lint, typecheck, unit, build (mandatory). `npm test` stays green with its count reported; skips 0.

## Fences
- Edits only in `tools/rating/` plus its tests, the ticket's dated result line, and your context. No `src/` or `data/`
  edits.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`; never a bare `npx <name>`.
- No real cutechess run. Never push, force, amend or rebase. Never merge into main. No board edits. No host paths.

## Publish
- Seal notes (task `se-ABC-225`) with `at` from `date -u`: the design, each acceptance row's evidence, the gates. Commit on
  your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-29, Software Engineer. Done. Branch `grugops/ABC-225` (worktree `../wt-ABC-225`, from main `8eb8a4f9`): code `83751dc0`, notes and ticket line `9988a778`. Not merged; nothing pushed. No game was played; no real `cutechess-cli` or Stockfish ran.**

- **Design** (decision `…e58c4d25`): `rating.ts rpair <base> <candidate> <out> [--elo E] [--rounds N] [--concurrency C]`, with defaults E 1 910 (the frozen pin), width 2 and 100 openings.
  - Blocks of 10 openings (20 games per build per block), ABBA order. Each block of each build is one cutechess run with `r`'s argv, plus `start=S`, `-rounds 10` and the block's output paths.
  - Per build, the blocks are pooled by cutechess-cli 1.5.1's own Elo formula. It reproduces 4 recorded lines to the digit, and each block's printed line is checked against it.
  - The output has the pair X₂ − X₁ ± √(Y₁² + Y₂²) with EPIC-008's states, and the opening-paired (pentanomial) difference, labelled information (`an1.py`'s method).
  - Logs: `nps.log` (Stockfish's median nps per block per build) and `thermal.log` (load1, Tctl, busiest-core MHz every 10 s). Records use placeholders for host paths, user and host (ADR-0049 d4).
  - Any block cause makes the build and the pair UNRESOLVED and halts the run. `--dry-run` works in every mode. The shas are checked as `[0-9a-f]{7,40}` before `git`, with no shell.
- **A1–A4 met offline** (observation `…868049fb`): `node --test tools/rating/pair-check.ts`, 22/22, outside the lane.
  - A1: all 20 block argvs equal `r`'s except `start=S`, `-rounds` and 3 output paths.
  - A2: 10 alternating blocks, openings 1–100 once per build, both colours. Bad values exit 1.
  - A3: the r1/r2 records read −82.9 ± 73.8 and −82.9 ± 64.3.
  - A4: an illegal move, a disconnect, a stall, a time loss or a watchdog stop makes the build and the pair UNRESOLVED.
  - End to end through the real harness with stub tools: the pooled output reproduces A3. A fault injection halts after 3 of 20 runs as UNRESOLVED. The dry-run argv equals the real argv for 20/20 blocks. 153 record files have no host path, login or host name.
- **`r`/`d` defaults byte-identical to main's harness:** stub cutechess replaying r1 / q4c D. `cmd.txt`, argv, `summary.txt`, `machine.txt`, `artifacts.txt` and stdout all `cmp` 0. The temporary copy of main's file was removed.
- **Gates at `83751dc0`:** lint 0 (131 files), typecheck 0, build 0 (`dist/` 22 files, 0 from tools). `npm test` **63 files / 2 128 passed**, unchanged. Skips 0, `No findings.`
- **QE owes A5 and A6** (observation `…14fdbedc`): `rpair <base> <cand> <out> --rounds 10`, 40 games, ALONE, on AC. Read `nps.log` (2 lines), `thermal.log` (≥ 1 per 10 s) and the host-path scan. Report the wall and project 400 games (≤ 10 h). UNKNOWN - verify there: cutechess honouring `start=` (any miss shows as a coverage cause), and the k10temp read. Watch `artifacts.txt`'s `id author Olger Oeselg` (the engine's author line, also in `r`).
- **Publishing:** the `propose_note` tool was not surfaced in this session. The notes were admitted through its own handler (`admission-server.js` `handleProposeNote` → `admitAndAppend` → `appendNote`), with the trusted root set to the worktree. 3/3 admitted, seals read back ok. Notes: `../wt-ABC-225/.grugops/context/se-ABC-225/notes/`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-225 | One command reads an interleaved R pair: base and candidate against the same Stockfish, alternating blocks, opening-paired error, host log | EPIC-010 | — | NFR-008 (0 lane files); ASVS L1 input check (sha regex before git, no shell); ADR-0049 d4 (placeholders in records); no pin moved | grugops/ABC-225 @ 83751dc0 (+ notes/ticket line 9988a778): tools/rating/rating.ts (rpair, --dry-run), tools/rating/pair.ts (new), tools/rating/pair-check.ts (new) | pair-check.ts 22/22 (A1–A4 offline, records r1/r2: −82.9 ± 73.8, pentanomial −82.9 ± 64.3); stub e2e rpair + fault injection; r/d defaults byte-identical to main (stub); npm test 63 files / 2 128 pass, skips 0; no game | — (tools only, no UAT); A5/A6 QE's real 40-game smoke | — | In Review (branch, not merged; A5/A6 pending QE) |
