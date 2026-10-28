---
id: 20261028T211542Z-software-engineer-decision-f55b4cdf
kind: decision
by: software-engineer
at: 2026-10-28T21:15:42Z
verified_by: 
confidence: high: diff read line by line; pins hashed from the binaries the version checks named
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
seal: sha256:8ade90a1bdfe748e0d413a4bf3465b0464899413937357a9bcbdec2cdabc4fe6
---

# rating.ts takes the tool paths from the environment; pins re-set to this host

**What changed (commit `2bc28539` on `grugops/se-tools-rating-host`, from main `54bcf923`):**
- `tools/rating/rating.ts` reads `CUTECHESS_CLI` and `STOCKFISH` from the environment at module load, before any work. There are no defaults, and no host path is in the source. An unset or empty variable throws `<NAME> is not set: give the tool's path`. A path that is set but unreadable (`accessSync` R_OK) throws `<NAME> is not a readable file`. Neither message prints the path.
- Pins re-set: `CUTECHESS_SHA256` `fb4fc2aa…6e1c` → `dc776901…f40a`; `STOCKFISH_SHA256` `dc2f18c3…251f` → `c78c22a9…52d2`. Checked before pinning: `cutechess-cli --version` first line `cutechess-cli 1.5.1`; `uci` → `id name Stockfish 19`.
- The pin check is unchanged: `= pin` / `DIFFERS from pin`, and the openings pin still throws.
- ABC-204 § Dependencies: a dated 2026-10-28 change line (old → new pins, tool sources, env paths with no defaults, reason: the host move, owner `…5dbd717b`). The Q2 pin and the R command shape now name `$STOCKFISH` / `$CUTECHESS_CLI`. The old pin lines and the 2026-10-23 readings are not edited. EPIC-008 is not touched (BA/PM's `bapm-epic008-hostB`).

**Beyond the brief's letter (decided here; small and reversible; flagged for the Orchestrator):**
1. The preamble's `run("sysctl", ["-n", "machdep.cpu.brand_string"])` exits 1 on Linux, and `run` throws. It sat before `console.log(machine)`, so on this host the harness died before it printed a pin line, and the brief's dry check could not run. It now reads `chip: ${cpus()[0]?.model}` and `${platform()}: ${release()}`. On macOS that is the same text as before (`darwin: …`); on Linux it prints `linux: …`.
2. `hostLine` ran `notifyutil`, `pmset` and `pgrep` in one `try`. On Linux `notifyutil` is absent, so the `pgrep` count was skipped and every `host.log` line would read `foreign_vitest_procs=0`. That is a silent false "alone" for option B's two ALONE readings. The macOS probes now have their own `try` (thermal and power stay `?` on Linux) and `pgrep` has its own.
- Not done: no test was added. The harness is outside `npm test` by design (ABC-204: no `*.test.*` under `tools/rating/`), and the dry check below is the behaviour evidence. `memory-bank/70-runbook.md` and `src/` never named the tool paths, so they needed no edit. ABC-202, EPIC-008, the board and the game-1 analysis still name previous-host paths, as dated records owned by other roles.
