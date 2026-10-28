---
id: 20261028T211542Z-software-engineer-observation-bf9e7c30
kind: observation
by: software-engineer
at: 2026-10-28T21:15:42Z
verified_by: 
confidence: high: every command run as stated at 2bc28539
refs:
  - ABC-204
  - EPIC-008
  - tools/rating/rating.ts
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - orch-2026-10-27o/20261027T210610Z-orchestrator-decision-e018297c
  - grugops/se-tools-rating-host
  - 2bc28539
supersedes: 
seal: sha256:525fda1012af8d936af91a7ccadb15b159a384a3db4b19e8fc5235e9b809904e
---

# Gates and the no-game dry check at 2bc28539

**Gates (worktree at `2bc28539`, Node 26, this host):** `npm run lint` exit 0 (129 files) · `npm run typecheck` exit 0 · `npm run build` exit 0 · `npm test` exit 0, **63 files / 2 128 passed** (unchanged from main) · skip count 0 (`vitest --reporter=json` pending+todo) · `test-skip-integrity.js --skip-count 0` → `No findings.`

**Dry check (no games, no timing):** `node tools/rating/rating.ts r HEAD <out>`, with the out-dir in session scratch (outside the checkout, not committed).
- Both variables unset → `Error: CUTECHESS_CLI is not set: give the tool's path`, exit 1, out-dir not created.
- `STOCKFISH` unset → `Error: STOCKFISH is not set: give the tool's path`, exit 1.
- `STOCKFISH` set to a missing file → `Error: STOCKFISH is not a readable file`, exit 1.
- `CUTECHESS_CLI` empty → `Error: CUTECHESS_CLI is not set: give the tool's path`, exit 1.
- Both set from the session env file: a driver started the harness in its own process group and sent SIGTERM to the group as soon as the `openings:` line printed, during the artifact clone/build step. The printed pin lines (no paths in them):
  - `cutechess-cli: cutechess-cli 1.5.1 sha256 dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a = pin`
  - `stockfish: id name Stockfish 19 sha256 c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2 = pin`
  - chip and OS lines printed (x86_64 Linux class); the openings check passed (no throw).
  - The harness ended on SIGTERM. The out-dir held only `build-skytalix.log`, `host.log` (one `before` line) and `machine.txt`. There was no `cmd.txt`, no `r.out` and no `start` line, so cutechess-cli was never spawned and no game was played. No harness process was left behind.
