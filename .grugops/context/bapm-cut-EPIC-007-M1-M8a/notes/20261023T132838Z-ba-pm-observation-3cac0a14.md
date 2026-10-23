---
id: 20261023T132838Z-ba-pm-observation-3cac0a14
kind: observation
by: ba-pm
at: 2026-10-23T13:28:38Z
verified_by: 
confidence: high (direct read-only reads: --version, --help, manual, source at 5e84232b; EPD lines checked 6/6)
refs:
  - ABC-202
  - EPIC-007
  - ABC-168
  - M1
  - M8
  - RISK-EPIC007-01
  - ADR-0044
  - ADR-0045
  - plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - 20261023T131822Z-orchestrator-observation-7ea41eea
  - 20261023T105223Z-ba-pm-decision-b5f65536
  - 20261022T185856Z-ba-pm-decision-2fddb7fa
  - 84a59ed6
supersedes: 
seal: sha256:c23c1643692ddf22be8a49a83e8cbef19e8790b2b3af10d5e4713447d67dfc43
---

# cutechess-cli read for ABC-202's pins, 2026-10-23, at `main` `84a59ed6`. No game was played

Reads on this host, read-only (`--version`, `--help`, the manual, the source in the owner's checkout):
- Binary `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli`: `cutechess-cli 1.5.1`, Qt 6.12.0, macOS Tahoe (26.7.1)/arm64. Checkout `5e84232b` (`v1.5.1-5-g5e84232b`). Binary sha256 `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`. Not on PATH (unchanged from `…7ea41eea`).
- `--help` exits 0. Output sha256 `fe66c4eb…`. Its engine options and flags agree with the manual `docs/cutechess-cli.6.txt` (sha256 `8de9e427…`, dated June 28, 2020).
- The manual settles: `proto=uci`, `tc=60+1` (moves/time+increment), `tc=inf`, `depth=N`, `cmd=`, `arg=`, `dir=`, `stderr=`, `name=`, `-openings file= format=epd order=sequential`, `-rounds`, `-games`, `-concurrency`, `-maxmoves`, `-pgnout`, `-debug`.
- The manual does not settle the following; they were read from the source at `5e84232b`. QE confirms them on the first run.
  - `uciengine.cpp:268–287`: with `tc=inf` and a ply limit, the engine is sent `go depth N` and no `infinite`.
  - `timecontrol.cpp:149`: with no `tc`, the time control is invalid, so `tc=inf` is required next to `depth=`.
  - `enginebuilder.cpp:86`: `QProcess::start(cmd, arguments)`, so `cmd` is not split on spaces, and the script path goes in `arg=`.
  - `epdrecord.cpp:140–155`: an EPD line takes 4 FEN fields, and `hmvc`/`fmvn` give the counters (default `0 1`).
  - `tournament.cpp:52,62`: opening repetitions default 1; sides swap by default.
  - `board/result.cpp:102–154`, `board/westernboard.cpp:1436–1494`: the result texts, for example `loses on time`, `makes an illegal move`, `disconnects`, `'s connection stalls`, `mates`, `Draw by 3-fold repetition`, `Draw by adjudication`.
- Repo at `84a59ed6`: `DEFAULT_LEVEL = 5` (`src/levels.ts:53`). Level 5 has blunder rate 0, and levels 1–4 ignore `go depth` (`src/uci-session.ts:289–292`; `ADR-0045` D4). EPIC-007 M1's "Skill Level 3" predates `ADR-0045`. Node at the cut is `/opt/homebrew/bin/node` `v26.11.1`.
- The six EPD lines on the ABC-202 page were checked mechanically: each one rebuilds its `src/perft.test.ts` FEN exactly (6/6).
