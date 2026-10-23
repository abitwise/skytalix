---
subtask: qe-read-ABC-202
role: qe-e2e
ticket: plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
ref: .grugops/context/qe-read-ABC-202/
width: 1 (ALONE among agent hops; the page requires it)
---

# Read EPIC-007 M1 and M8(a) with cutechess-cli, exactly as ABC-202 pins them

## Do
- Follow the ABC-202 page exactly: re-check the tool's version and sha256; fresh clone of `main` at the sha you record as S, `npm ci && npm run build`; run M1 then M8(a) with the pinned flags, the page's EPD file and watchdogs; check every result text against the page's pass list.
- Host: AC at the start (required); log load1, thermal and foreign vitest (not gating). Apply the page's rule for a fault on a non-quiet host (UNRESOLVED, owner-window re-run owed) — do not re-run on your own beyond what the page allows.
- A flag that misbehaves: fix the spelling in-hop and record it, as the page allows; anything that changes what is measured is a STOP back to BA/PM.
- Keep every raw file (pgn, debug logs, stderr, EPD, versions) under `.grugops/context/qe-read-ABC-202/raw/` in your worktree.
- Verdict per measure: MET, NOT MET or UNRESOLVED, and the route the page names for any failure. Fix nothing.

## Fences
- Work in `../wt-qe-read-ABC-202` on `grugops/qe-read-ABC-202` from `main`, the fresh clone, and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe202/`. Commit notes, raw files and a dated `## QE` addendum on the ABC-202 page. No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, `memory-bank/50-decisions/`; do not touch the cutechess checkout. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-read-ABC-202`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

QE/E2E, 2026-10-23T13:31–13:55Z (claim 13:31:42Z). **M1 MET, M8(a) MET** at S `e5c5c2a5`; `RISK-EPIC007-01` did not
show up; no failure route owed. Branch `grugops/qe-read-ABC-202` @ `6eb109e0` (worktree `../wt-qe-read-ABC-202` from
`main` `e5c5c2a5`). Not merged, not pushed.

- **Tool:** `cutechess-cli 1.5.1`, sha256 `fb4fc2aa…6e1c` (both equal the pins). Machine Apple M3, macOS 26.7.1, node v26.11.1.
- **A1 MET:** `npm ci` and build rc 0. `dist/uci.js` sha256 `877e9595…`, `Skill Level default 5`. The src/data/package
  diff between `84a59ed6` and S is empty.
- **A2 MET after one in-hop spelling fix: `-debug` → `-debug all`.** The bare flag aborts this Qt 6 build:
  `Empty value for option "-debug"`, rc 1 in 5 s, no engine started. `all` also sends `debug on`, which the engine
  ignores (output byte-identical). Each run was re-run once. Every other pin held, including `go depth 4`.
- **M1:** 1008 s.

  | game | result {text} | plies |
  |---|---|---|
  | 1 | 1-0 {White mates} | 127 |
  | 2 | ½ {Draw by 3-fold repetition} | 68 |
  | 3 | ½ {Draw by 3-fold repetition} | 55 |
  | 4 | 1-0 {White mates} | 51 |
  | 5 | ½ {Draw by 3-fold repetition} | 91 |
  | 6 | 1-0 {White mates} | 101 |

  - 0 illegal moves, 0 forfeits, 0 disconnects, 0 stalls.
  - Min clock 13.29 s. 0 `isready` sent during a `go`. All `stderr` files 0 bytes.
- **M8(a):** 10 s.
  - Game 1: 1-0 {White mates}, 103 plies.
  - Game 2: 0-1 {Black mates}, 48 plies.
  - 151/151 `go depth 4`. Final depths `{4: 131}`; 20 book moves; 0 `ignores go depth` lines.
- **Host:** AC throughout. M1 games 1–4 ran on a host that was not quiet (thermal 1–2, a foreign vitest from another repo,
  load1 ≤ 7.85). That is immaterial, because no FAIL-class result occurred. Games 5–6 and M8(a) ran quiet.
- **Gaps (INFO):** `QE-202-a` (the pinned block and row (ii) should carry `-debug all`), `-b` (`debug on` is sent and
  ignored), `-c` (`tc=60+1` sends 61 000 ms on move 1), `-d` (EPIC-007's M1 row text is stale).
- **Notes:** `…8a2be50b` (setup, A1/A2), `…202e80c8` (M1), `…81066c23` (M8(a)), `…632c11f1` (verdict).

**Trace row** (for the Orchestrator):

| ABC-202 (qe-read-ABC-202) | QE: cutechess-cli 1.5.1 self-play of built dist/uci.js at e5c5c2a5 — M1 6/6 pass texts, 0 illegal/forfeit/disconnect/stall, min clock 13.29 s; M8(a) 2/2 pass texts, 151/151 go depth 4, final depth {4:131}; A2 spelling fix -debug → -debug all | EPIC-007 (M1, M8(a)) | — | RISK-EPIC007-01 not shown; ADR-0044 row (ii) read (catalog placement Security/NFR's); NFR-004 unchanged; QE-202-a/-b/-c/-d INFO | grugops/qe-read-ABC-202 @ 6eb109e0<br>.grugops/context/qe-read-ABC-202/notes/ (4), raw/ + SHA256SUMS, ABC-202 page ## Reading, EPIC-007 dated line | run.sh 6562e145…; m1.out fee117b9…, m1.pgn 8ef24204…, m8a.out 800936c9…, m8a.pgn 6bdbda83…, m1-perft.epd 54bea6aa…; dist/uci.js 877e9595… | UAT waived (0 production lines; not a signature) | — | In Development → Orchestrator (QE M1 MET, M8(a) MET …632c11f1; card move and EPIC-007 closure the Orchestrator's) |
