---
id: 20261023T135324Z-qe-e2e-observation-8a2be50b
kind: observation
by: qe-e2e
at: 2026-10-23T13:53:24Z
verified_by: 
confidence: high (direct reads: --version, sha256, build, source at 5e84232b; host log raw)
refs:
  - ABC-202
  - EPIC-007
  - M1
  - M8
  - RISK-EPIC007-01
  - ADR-0044
  - ADR-0045
  - qe-read-ABC-202
  - e5c5c2a5
  - 84a59ed6
  - plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
  - 20261023T132838Z-ba-pm-decision-d9f46c46
  - 20261023T132838Z-ba-pm-observation-3cac0a14
  - 20261023T131822Z-orchestrator-observation-7ea41eea
  - 5e84232b
supersedes: 
seal: sha256:05f8843099b9a95c60d20803c148ec8bda223228dfd218fe9298ac4546afbe2c
---

# ABC-202 setup: the tool and the artifact as pinned, A1 MET, and one A2 spelling correction (`-debug` → `-debug all`)

Machine: Apple M3, Darwin 25.6.0, macOS 26.7.1 (25G241). `node` `/opt/homebrew/bin/node` `v26.11.1`.

- **Tool, re-read at start (2026-10-23T13:32Z):** `cutechess-cli 1.5.1`, Qt 6.12.0, macOS Tahoe (26.7.1)/arm64. Binary sha256 `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`. **Both equal the page's pins.**
- **S = `e5c5c2a5`** (`main` at the run). `git diff --stat 84a59ed6 e5c5c2a5 -- src data package.json package-lock.json tsconfig.build.json` is **empty**, so the artifact's inputs equal the cut's.
- **A1 MET.** Fresh `git clone` of main's checkout into the QE scratch folder, `checkout e5c5c2a5`. `npm ci` rc 0, `npm run build` rc 0 (13:32:17Z–13:32:19Z). `dist/uci.js` sha256 `877e9595746aead5019a2e604da2ef0021e2d688168b275d809e572fe8a9b98d`. `printf 'uci\nquit\n' | node dist/uci.js` exit 0, 0 stderr bytes, prints `id name skytalix` and `uciok`. Option lines, verbatim:
  - `option name OwnBook type check default true`
  - `option name Skill Level type spin default 5 min 1 max 5`
- **A2: the pinned `-debug` did not hold. It was corrected in-hop, and each run was re-run once.** Attempt 1 (13:32:58Z, script sha256 `df9953a3…`) aborted both runs in 5 s each, rc 1, before any engine started. The output was only `Warning: Empty value for option "-debug"` (`raw/attempt1-*.out`).
  - **Cause, from the source at `5e84232b`.** A bare `-debug` is stored as `QVariant(true)` (`projects/cli/src/matchparser.cpp:135–138`). Under Qt 6, `isNull()` is false for that value. `main.cpp:482–487` accepts only `all` or a null value, so it sets `ok=false` and the tool exits. In this build, `-debug all` is the only spelling that is accepted.
  - **Correction: `-debug` → `-debug all`.** The value `all` also appends `debug` to each engine, so cutechess sends UCI `debug on` after `uci`. skytalix ignores `debug` (`src/uci-session.ts:383`, D3). `uci / [debug on] / isready / ucinewgame / isready / quit` gives byte-identical output with and without it (`raw/debugcheck-*.out`, sha256 `92515ce3…` both). No option, `tc`, opening or `go` changes. **This is inside the measure's meaning, so it is not a STOP.**
  - Corrected script `raw/run.sh` sha256 `6562e145c5e02361…`. Its diff from attempt 1 is the two `-debug` tokens plus a comment.
- **Host (logged, not gating; `raw/host.log`).** AC Power at the start and at every sample. Thermal from `notifyutil -g com.apple.system.thermalpressurelevel`. Foreign vitest counted as `pgrep -f '/vitest'` (another repo's run, `Projects/public/grugops`; none in this repo).
  - Before M1: load1 4.73, thermal 0, foreign vitest 2 procs.
  - During M1 games 1–4: thermal 1 (2 at one sample, 13:41:24Z), load1 max 7.85, foreign vitest present at most samples.
  - Games 5–6 and M8(a): thermal 0, 0 foreign vitest, load1 2.84–4.31.
  - **So the host was not quiet for M1 games 1–4.** This only matters for attributing a FAIL, and no FAIL-class result occurred.
- **Watchdog:** a bash poll loop in `run.sh` (5 s poll; 4500 s M1, 1200 s M8(a)). It never fired.
