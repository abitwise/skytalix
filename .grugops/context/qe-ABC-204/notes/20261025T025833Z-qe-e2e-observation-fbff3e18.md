---
id: 20261025T025833Z-qe-e2e-observation-fbff3e18
kind: observation
by: qe-e2e
at: 2026-10-25T02:58:33Z
verified_by: 
confidence: high (every command run by QE at the merge; outputs read; probes cleaned up)
refs:
  - ABC-204
  - EPIC-008
  - NFR-004
  - NFR-008
  - ADR-0049
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - arch-design-ABC-204/20261023T205749Z-architect-design-decision-13faedbc
  - ticket-to-pr-ABC-204/20261023T211610Z-software-engineer-decision-f0a579a0
  - ticket-to-pr-ABC-204/20261023T211610Z-software-engineer-observation-74a2bc03
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-212/20261024T123135Z-orchestrator-decision-55691ad1
  - grugops/qe-ABC-204
  - e546e124
  - 3497aad2
  - 0e88c5df
  - ADR-0023
  - ABC-202
supersedes: 
seal: sha256:a2a86c1ff1d33ea50f4b63746116a7a5ef486e91f27c8a7e17306938ef1c8740
---

# ABC-204 QE gate: A1–A3 MET at merge e546e124; openings reproduce byte-for-byte; two harness record defects found (QE-204-a LOW, QE-204-b MEDIUM)

QE/E2E, task `qe-ABC-204`. Branch `grugops/qe-ABC-204` in `../wt-qe-ABC-204`. **Merge `e546e124`** = `grugops/ABC-204` `0e88c5df`
+ `main` `3497aad2` (no conflict). Own `npm ci`, node v26.11.1, Apple M3, Darwin 25.6.0. `main` `3497aad2` is the reading's S.
Scratch is `<scratchpad>/qe204/`. Personal paths are redacted under `ADR-0049` d4.

## A1 (tools pinned): MET
- `cutechess-cli` sha256 `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`, `--version` `cutechess-cli 1.5.1`.
- Stockfish (`/opt/homebrew/bin/stockfish` → `Cellar/stockfish/19`) sha256 `dc2f18c34ae962dff591b66147d220ec06e61d756b93d8a4f5e04fd8e55c251f`, `id name Stockfish 19`.
- Both equal `EPIC-008` § Dependencies. QE read them with `shasum`, and the harness's `machine.txt` says `= pin` in both readings.

## A2 (one command per mode): MET, with QE-204-b
- Both modes ran from one command. Each wrote `cmd.txt` before the first game, then `artifacts.txt` (sha, `dist/uci.js`
  sha256, the `uci` lines), `.out`, `.pgn`, per-engine `.stderr`, `host.log`, `summary.txt` and `SHA256SUMS`, and
  printed the Elo line (when `cutechess-cli` printed one), W/L/D, the draw ratio, the game count and a state.
- The printed state is right in the two cases QE saw: A5's battery stop printed `UNRESOLVED` with three named causes,
  and A4 printed `E + X ± Y` (see the reading notes).
- Sad paths, re-run by QE: an out dir inside the checkout and a non-empty out dir are refused before anything is
  written. `--budget-ms 900` and `--elo 1319` are refused, as are a flag of the other mode and a missing argument.
  All exit 1.
- **QE-204-a (LOW).** An out dir that is itself a **symlink into the checkout** passes the guard. It resolves
  `realpath(dirname(out)) + basename(out)`, so it never resolves the leaf. Probe: a scratch symlink to an empty
  directory in the worktree. The harness wrote `host.log`, `machine.txt`, `build-skytalix.log` and began a clone inside
  the checkout before QE stopped it after 4 s (removed; `git status` clean). The out dir is caller-supplied, so this is
  not a security boundary. Fix: `realpathSync(out)` after `mkdirSync`, then the inside check.
- **QE-204-b (MEDIUM).** `artifacts.txt`'s "artifact sha256" hashes `dist/uci.js` only. That file is the entry module,
  and it imports the other 21 `dist/` files. **The hash does not identify the build:**
  - The SE's smoke build at `8ccba739` and this reading's build at `3497aad2` both hash `877e9595…b98d`.
  - They are different engines: ABC-206 and ABC-212 changed `engine.js`, `evaluate.js` and others between them, and
    the `uci` line moved from `Skill Level … max 5` to `max 7`.
  - The whole-tree sha256 values differ: `3798b8d1…` at `8ccba739` and `726e5225…` at `3497aad2` (22 files each).
  - Consequence: every later `EPIC-008` D reading would print equal "artifact" hashes for a candidate and a base that
    differ. The SE's "equal artifact hashes are a free reproducibility check" therefore checks nothing. The commit sha
    is still recorded, so the reading stays attributable; only the hash evidence is void.
  - Fix: write a sorted per-file manifest of `dist/` and its tree hash into `artifacts.txt`. QE wrote that manifest
    by hand for both readings (`raw/*/dist-manifest.txt`).

## A3 (outside the lane; NFR-008 untouched): MET
- `git diff --stat 8ccba739..0e88c5df`, excluding `.grugops/context/`: `biome.json` +1 (`tools/rating/**/*.ts`),
  `tsconfig.json` +1 (the same), and `tools/rating/{rating.ts, openings.ts, openings.epd}`. That is the page's list plus
  the Design ruling's dated `biome.json` clarification. `package.json` is untouched. 0 `*.test.*` files are added.
- `main..e546e124` differs in the same five paths only.
- `npm run lint` rc 0 (127 files; `biome lint --verbose` names the harness files). `npm run typecheck` rc 0
  (`tsc --listFilesOnly` lists 2 `tools/rating` files). `npm run build` rc 0: `dist/` holds 22 files, 0 under `tools/`.
- `npm test` rc 0: **62 files, 2073/2073**, 0 pending, 0 todo (`last-run.json` success). `vitest list --filesOnly` gives
  the same 62 files on `main` `3497aad2` and at the merge (`diff` empty). `test-skip-integrity.js … --skip-count 0`
  gives `No findings.`

## Q5 openings, re-derived by QE
- The five TSVs at `SOURCE_COMMIT` (the Architect's `design204/tsv`) equal `compile.ts` `SOURCE_SHA256`.
- `drawOpenings` regenerates `openings.epd` **byte-for-byte**: sha256 `0d7f7a72…2666`, equal to the pin. Nothing was
  written; QE imported the function and compared the bytes.
- QE's own checks on the file: 100 lines, 100 distinct, LF only. Each block of 20 is in ascending
  sha256(`"ABC-204/openings/v1\n"` + EPD) order. Side to move matches ply parity (4, 6, 8 → w; 5, 7 → b). Four fields
  on every line.
- **QE-204-c (INFO).** 23 of 100 lines carry an en-passant square (for example `d6`) that no pawn can capture.
  `cutechess-cli` drops it to `-` in the FEN it sends and in `[FEN]`, so play starts from the same position. The 100
  stay distinct on board, side and castling. A checker that compares `[FEN]` to the file has to compare three fields
  (QE's first pass flagged 14 rounds for this, then was fixed). Q5's pin and rule stand.
