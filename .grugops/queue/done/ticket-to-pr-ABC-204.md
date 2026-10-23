---
subtask: ticket-to-pr-ABC-204
role: software-engineer
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/ticket-to-pr-ABC-204/
inputs: Architect …13faedbc (## Design ruling); Orchestrator nods: biome.json line under A3, E-step rule under A4
width: 3 of 3
---

# Build ABC-204: the rating harness under tools/rating/

## Do
- Worktree `../wt-ABC-204` on `grugops/ABC-204` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling`: the TypeScript harness under `tools/rating/` (R and D runners, the pinned cutechess flags, `openings.ts` reproducing `tools/rating/openings.epd` byte-for-byte at the pinned sha256, result parsing of cutechess's own Elo line, the states GAIN/LOSS/NEUTRAL/UNRESOLVED, the Stockfish depth guard), the `tsconfig.json` + `biome.json` lines. No `src/` change; 0 new files in the test lane.
- Prove it with **short smoke runs only** (a few games each for R and D, plus the openings sha check). The baseline R, the A/A D and the A5 wall timing are QE's long readings, not yours.
- Gates: lint, typecheck, build; `npm test` + `last-run.json` unchanged in file/test count; skip capture → `test-skip-integrity.js`.

## Fences
- Only `tools/rating/**`, `tsconfig.json`, `biome.json` (and the ticket's named docs). No `src/`, `package*.json` unless the page says so, no board/trace/ADRs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se204/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`; do not touch the git remote.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Delivered, no STOP, no page defect.** Branch `grugops/ABC-204` in worktree `../wt-ABC-204` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `8ccba739`. Tip **`0e88c5df`**: `82afeda1` (harness), then `0e88c5df` (notes). Not pushed, not merged. Smoke runs only; the host was not quiet (battery, thermal 1–2, load1 6–9, other hops), so no figure here is a reading. `A4`–`A6` are QE's.

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 2/2 by `readContext`, in `../wt-ABC-204/.grugops/context/ticket-to-pr-ABC-204/notes/`:
- observation `…74a2bc03`: openings sha, guards, both smoke runs, gates;
- decision `…f0a579a0`: the build to the ruling and the SE's calls inside it.

### Per criterion (the SE's share)
| crit | result |
|---|---|
| A1 | **Built.** `machine.txt` records chip, Darwin, node, `cutechess-cli --version`, Stockfish `id name`, both sha256 against the pins (a difference is written, not a stop). Smoke: both = pin |
| A2 | **Built, smoke-proven for R and D.** One command per mode; clone + `npm ci && npm run build` per side; `artifacts.txt` (sha256 + `uci` option lines); `cmd.txt` before the first game; `.out`, `.pgn`, per-engine `stderr`, `host.log`, `SHA256SUMS`; prints the Elo line, W/L/D, draw ratio, games, and the state (D: GAIN/LOSS/NEUTRAL/UNRESOLVED; R: E + X ± Y, or UNRESOLVED) |
| A3 | **MET at the build.** 0 `*.test.*`; `npm test` 61 files / 2 019 tests, same file list as base; diff touches only `tools/rating/` + 1 `tsconfig.json` line + 1 `biome.json` line (nod); lint/typecheck/build rc 0 and both lanes read the harness; `dist/` 0 `tools/` files |
| A4 | owed: QE (baseline R, 200 games) |
| A5 | owed: QE (A/A D, 100 games) |
| A6 | owed: QE (wall time; B ruled from A5) |
| A7 | owed: QE/Orchestrator (`## Reading`, EPIC line, raw files) |

**Openings:** `node tools/rating/openings.ts <TSVs>` → `openings.epd` sha256 `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666` = the probe pin, byte-for-byte; a one-byte mutation made the harness stop before any build.

**Smoke R** (`8ccba739`, E 1650, 1 round, conc 2): 2 games, 0 faults; `1-0 {White mates}`, `1/2-1/2 {Draw by 3-fold repetition}`; `Elo difference: 190.8 +/- nan, LOS: 84.1 %, DrawRatio: 50.0 %`; depth guard 0 of 134 below 3 (non-vacuous: floors 11/14/99 → 16/60/133 misses); `stderr` 0 B; artifact `877e9595…b98d`.
**Smoke D** (A/A `8ccba739`×2, B 1000, 1 round, conc 3): 2 games, 0 faults; `Elo difference: -190.8 +/- nan, LOS: 15.9 %, DrawRatio: 50.0 %`; state NEUTRAL; both artifacts `877e9595…b98d`.

**For QE:** at 2 games `+/- nan` makes D read NEUTRAL by `EPIC-008`'s literal rule (immaterial at 100/400 games); exit code is 0 for any printed state, read the `state:` line; book counts, `[FEN]` pairs, gap stats, gzip, the 25–75 % band and E′ are QE's.

Files: `tools/rating/rating.ts` 398, `tools/rating/openings.ts` 96, `tools/rating/openings.epd` 100, `tsconfig.json` +1, `biome.json` +1.

### Trace row
| ABC-204 (ticket-to-pr-ABC-204) | rating harness: cutechess-cli plays skytalix vs Stockfish UCI_LimitStrength (R) and vs its base (D), outside npm test | EPIC-008 | — | no ADR (design ruling …13faedbc); NFR-008 untouched (0 lane files); NFR-004 forfeit = move > 5 s; ADR-0036 (b) cannot fire (no src/) | grugops/ABC-204 @ 0e88c5df (code 82afeda1)<br>new tools/rating/rating.ts, tools/rating/openings.ts, tools/rating/openings.epd; tsconfig.json +1, biome.json +1; .grugops/context/ticket-to-pr-ABC-204/notes/ (2) | openings sha = pin; smoke R 2 games + smoke D 2 games, 0 faults; lint/typecheck/build 0; npm test 61/2019 = base; skips 0, No findings. | waived (0 production lines; QE reading note is the evidence) | — | In Development → In Review (QE: A4–A6 long readings) |
