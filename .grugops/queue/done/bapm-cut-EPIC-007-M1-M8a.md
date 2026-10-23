---
subtask: bapm-cut-EPIC-007-M1-M8a
role: ba-pm
ticket: plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
ref: .grugops/context/bapm-cut-EPIC-007-M1-M8a/
width: 1 (records only)
---

# Cut the XS agent-run QE reading ticket for EPIC-007 M1 and M8(a)

## Do
- The trigger you set (`…b5f65536`) fired: the owner built `cutechess-cli` 1.5.1 (`…7ea41eea`). It is not on PATH; the ticket pins the absolute path and version.
- Cut one ticket page (next free ABC id) that reads M1 and M8(a) exactly as the EPIC-007 measures state, agent-run by QE, no human gate, raw files kept under the ticket's context. Pin the flag spellings the measures leave `UNKNOWN - verify` from the upstream manual in the checkout (`docs/cutechess-cli.6.txt`), or leave them to QE's first run if the manual does not settle them.
- Say what the artifact under test is (`npm run build` → `dist/uci.js` at a named `main` sha) and how cutechess invokes it (`cmd=`/`dir=`, node).
- Host preconditions: rule whether the time-safety reading (M1 `tc=60+1`, 0 time forfeits) needs AC and a quiet host, and estimate wall time. If it needs the owner's quiet window, say so in the page.
- Run the Definition of Ready; size and prioritise. No production code is expected; if the reading could fail and need a fix, say how a failure routes.
- Add one dated line on the EPIC-007 page pointing to the new ticket.

## Fences
- Work on `grugops/bapm-cut-EPIC-007-M1-M8a` (worktree `../wt-bapm-cut-EPIC-007-M1-M8a` from `main`). Only the new ticket page, the EPIC-007 page and your notes. You may run `cutechess-cli --version` / `--help` read-only; no games. No `src/`, `package*.json`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-m1m8a/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-EPIC-007-M1-M8a`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (with the board card line for the Orchestrator) plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-23T13:28Z): **`ABC-202` cut: `Ready`, `XS`, `P2`, `EPIC-007`, DoR 10/10. Builder QE/E2E, agent-run, no human gate. The owner's quiet window is NOT needed up front. No owner question.**

These are records only, on `grugops/bapm-cut-EPIC-007-M1-M8a` in `../wt-bapm-cut-EPIC-007-M1-M8a`, cut from `main` `84a59ed6`. There is one commit, **`28714fb9`**; it is not merged and not pushed. No game was played; only `cutechess-cli --version` and `--help` ran.

The notes are in `.grugops/context/bapm-cut-EPIC-007-M1-M8a/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's `.grugops/context`) and read back 2/2 by `readContext`:
- `20261023T132838Z-ba-pm-observation-3cac0a14`: the tool reads (version, sha256, `--help`, the manual, and the source lines that settle what the manual does not);
- `20261023T132838Z-ba-pm-decision-d9f46c46`: the rulings.

| item | ruling |
|---|---|
| ticket | **`ABC-202`**: "`cutechess-cli` plays the built `skytalix` (`dist/uci.js`) against itself: read `EPIC-007` M1 (6 games, `tc=60+1`) and M8(a) (2 games, `depth=4`)" |
| tool | `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli`, 1.5.1 (`5e84232b`), sha256 `fb4fc2aa…`, not on PATH, invoked by absolute path |
| artifact | `dist/uci.js` from `npm ci && npm run build` in a fresh clone of `main` at S, recorded (`84a59ed6` at the cut); `cmd=<abs node> arg=<clone>/dist/uci.js dir=<clone>` (`cmd` is not split, per source) |
| M1 pin | `-each proto=uci tc=60+1 -openings file=m1-perft.epd format=epd order=sequential -rounds 6 -games 1 -concurrency 1 -maxmoves 200 -pgnout m1.pgn -debug`, with per-engine `name=`/`stderr=`; the six-line EPD (perft FENs with `hmvc`/`fmvn`) is on the page and checked 6/6 |
| M8(a) pin | `-each proto=uci tc=inf depth=4 -rounds 1 -games 2 -concurrency 1 -maxmoves 200 -pgnout m8a.pgn -debug`; sent as `go depth 4` (source `uciengine.cpp:268–287`); `tc=inf` required (`timecontrol.cpp:149`) |
| options | none set. "Default options" = `OwnBook` true and `Skill Level` **5** (`ADR-0045` D4). M1's "Skill Level 3" is stale, and level 3 would make M8(a) unreadable |
| result texts | an allow-list from the source (`result.cpp`, `westernboard.cpp`). An unknown text is a STOP to BA/PM. A pin that does not hold is corrected in the hop (`A2`), not failed |
| host | **AC required. The run goes alone (width 1). The quiet window is NOT needed up front**: M1 counts faults, and load can create a forfeit but never hide one. A forfeit, stall or disconnect on a host that was not quiet (load1 > 8, thermal ≥ 1, a foreign vitest, battery) is UNRESOLVED, and one re-run in the owner's quiet window is then owed |
| wall time | an estimate of ~30–45 min typical and ~60 min worst (`UNKNOWN - verify`); watchdogs 75 min (M1) and 20 min (M8(a)) |
| failure route | the reading hop fixes nothing. An illegal move or a depth above 4 → BA/PM fix ticket → SE. A forfeit, stall or disconnect on a quiet host = `RISK-EPIC007-01`, the `ADR-0044` D5 worker trigger → Architect/Design rules first (a new or changed ADR is a STOP to the owner) → BA/PM cut |
| EPIC-007 page | one dated box pointing to `ABC-202`; status and column unchanged |

Files on the branch:
- `plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md` (new, 335 lines);
- `plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md` (+8, one dated box);
- 2 notes.

Not touched: `src/`, `package*.json`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`, every other page, git config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

**For the Orchestrator:**
- **Board card line:** `ABC-202` (XS, P2, EPIC-007) → **Ready**: an agent-run cutechess-cli reading of M1 and M8(a), builder QE/E2E; AC and width 1 required; owner window only on the fallback. Ready 0/8 → 1/8. **Next free id: ABC-203.**
- Append the trace row below to `plans/traceability.md` at merge (fenced at this hop).
- After the reading: Security/NFR's catalog hop places `ADR-0044` candidate row (ii) from the pinned command line. If both measures are MET, the EPIC-007 card move is yours.

### Trace row (10 cells, header order)

| ABC-202 (bapm-cut-EPIC-007-M1-M8a) | cutechess-cli 1.5.1 plays the built skytalix (dist/uci.js at main S) against itself: EPIC-007 M1 (6 games, one per perft FEN, tc=60+1, default options: 0 illegal, 0 forfeit, 0 disconnect/stall) and M8(a) (2 games from startpos, colours swapped, tc=inf depth=4 → go depth 4: 0 illegal, 0 stall, final depth ≤ 4 per searched move); flags pinned from the manual and source at 5e84232b; default = Skill Level 5 (ADR-0045 D4) | EPIC-007 | — | RISK-EPIC007-01 (checked here); ADR-0044 candidate row (ii) read here, placed later by Security/NFR; NFR-004 unchanged; NFR-008 untouched (0 files, 0 spawns); notes …7ea41eea, …b5f65536, …2fddb7fa, …3cac0a14, …d9f46c46 | grugops/bapm-cut-EPIC-007-M1-M8a @ 28714fb9 (records only)<br>plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md; EPIC-007 page (one dated box) | — (records only; cutechess-cli --version/--help only, no game) | UAT waived (0 production lines); QE reading note is the evidence | — | cut → Ready (XS, P2, DoR 10/10; builder QE/E2E; AC + width 1; owner quiet window only on the fallback); next free ABC-203 |
