---
subtask: security-nfr-ABC-202
role: security-nfr
ticket: plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
ref: .grugops/context/security-nfr-ABC-202/
width: 2 (records only; disjoint files from bapm-close-EPIC-007)
---

# Place ADR-0044 candidate row (ii) (time safety) from ABC-202's reading, and fold QE-202-a (records only)

## Do
- ABC-202 asks Security/NFR's catalog hop to place `ADR-0044` candidate row (ii) (time safety: M1, M8(a)) once the reading is done. Read QE's notes and raw files on `main` (`.grugops/context/qe-read-ABC-202/`) and rule how row (ii) lands in `plans/nfr-catalog.md`: one dated insertion, no existing bar moved. If placing it needs a new NFR bound or a changed one, STOP: that is the owner's.
- **QE-202-a:** cite `raw/run.sh` as the operative command block (`-debug all`, not bare `-debug`), in the catalog row and as a dated erratum on the ABC-202 page's pinned block.
- Note the host state honestly: M1 games 1–4 ran on a non-quiet host (thermal 1–2, a foreign vitest, load1 ≤ 7.85), 5–6 and M8(a) quiet; QE ruled it does not matter for a 0-fault reading. Rule whether you agree.
- **Records only. No runs, no games.** Result: PASS, PASS_WITH_RISKS or FAIL.

## Fences
- Work on `grugops/security-nfr-ABC-202` (worktree `../wt-security-nfr-ABC-202` from `main`). Only `plans/nfr-catalog.md`, the ABC-202 page and your notes. No `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md`, the EPIC-007 page, `memory-bank/50-decisions/`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec202/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-202`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**PASS** (Security/NFR, 2026-10-23, branch `grugops/security-nfr-ABC-202` @ `4de09964`, records only: no game, no build, no vitest, no timing).

- **Row (ii) → `NFR-012`, one dated insertion.** One table line after `NFR-011` in `plans/nfr-catalog.md`.
  - **Target:** M1's and M8(a)'s text, unchanged. (a) 6 games, `tc=60+1`, default options: 0 illegal moves, 0 forfeits, 0 disconnects or stalls. (b) 2 games, `tc=inf depth=4`: 0 illegal moves, 0 stalls, final depth ≤ 4.
  - "Default options" is read at `Skill Level` 5 under `ADR-0045` D4, as BA/PM ruled at the cut (`…d9f46c46`).
  - **Authority:** `ADR-0044` § NFRs and `EPIC-007` ("Security/NFR places candidate rows (i)–(iii)"), with `NFR-011` as the precedent.
  - **First reading:** (a) MET and (b) MET at `e5c5c2a5`. This is one host, so other hosts are `UNKNOWN - verify`.
  - Removing the line recovers the old file byte for byte. `NFR-001`–`NFR-011` hash the same before and after. **No level, bar or bound moved.**
  - No `_Updated` line or closing section was added, to keep to "one insertion". The 2026-10-21 "(ii) NOT YET placed" bullet stays as history. The row says it supersedes that bullet.
- **STOP: did not fire.** Placing the row needed no new bound and no changed one.
- **`QE-202-a`: done.**
  - **The row** cites `.grugops/context/qe-read-ABC-202/raw/run.sh` (sha256 `6562e145…`) as the instrument, with `-debug all`, not the page's pinned block.
  - **The ABC-202 page** has a dated erratum directly under the pinned block. It names `run.sh` with its full sha256 and covers the flag table's `-debug` row and `QE-202-b`. The block is kept as cut.
- **Host that was not quiet: I agree with QE.**
  - M1 counts faults. Load can only make a forfeit or stall more likely, and cutechess's own delay lengthens a measured move rather than shortening it. So a 0-fault reading on a loaded host stands.
  - `ABC-202` pre-registered this rule, and its fallback is owed only after a FAIL-class result. There was none.
  - The raw files agree. The over-3 000 ms moves are spread the same way over the loaded games 1–4 and the quiet games 5–6. Load1 never crossed 8, and AC was on throughout.
- **Raw files checked:** `SHA256SUMS` 23/23 OK. The `run.sh` diff is only the two `-debug all` tokens plus a comment. QE's counts reproduce from the raw logs: 6+2 `Finished game`, 493 clocked `go`, 151 exact `go depth 4`, 0 `setoption`, 0 fault strings, 0 `isready` during a `go`.
- **Security:** not triggered (0 production bytes; `cutechess-cli` is an owner-built host tool, not a dependency).
- **Required fixes:** none. **New accepted risks:** none.
- **INFO, no action asked:**
  - **`RISK-EPIC007-01` is only half exercised.** cutechess sent 0 `isready` during a search, so a GUI that pings during a search was not exercised. `ADR-0044` D5 still covers that case, with its worker trigger. `NFR-012` says so. The `EPIC-007` page is BA/PM's and was not edited.
  - **Move gap:** the longest gap seen by the tool was 3 010 ms (69/493 moves over 3 000 ms, none over 5 000 ms). That is inside the existing `AR-NFR004-A` (≤ 31 ms). `NFR-004` was not re-read.
  - **The "alone" precondition:** the foreign vitest came from another repository. Whether it was an agent hop is `UNKNOWN - verify`, and it only matters for attributing a FAIL.
- **Notes** (`.grugops/context/security-nfr-ABC-202/notes/` on my branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes, both validate, index rendered):
  - `20261023T140053Z-security-nfr-observation-0ffaf6fe` (re-reads and checks)
  - `20261023T140053Z-security-nfr-decision-c25f7aea` (rulings and the result)
- **Not touched:** `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md` (the row below is for the Orchestrator), the `EPIC-007` page, `memory-bank/50-decisions/`. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-202 (security-nfr) | Security/NFR catalog hop: ADR-0044 candidate row (ii) placed as NFR-012 (time safety; M1 + M8(a) bounds unchanged; instrument raw/run.sh with -debug all); first reading (a) MET (b) MET at e5c5c2a5; QE-202-a erratum on the ABC-202 page; non-quiet host ruled immaterial (agree with QE) | EPIC-007 | M1, M8(a) | NFR-012 (new, placed); NFR-011; NFR-004 / AR-NFR004-A (gap 3 010 ms, inside); ADR-0044 D4/D5; ADR-0045 D4; RISK-EPIC007-01 | `grugops/security-nfr-ABC-202` @ `4de09964` (records only)<br>`plans/nfr-catalog.md` +1 row; ABC-202 page +1 erratum<br>`.grugops/context/security-nfr-ABC-202/notes/` (…0ffaf6fe, …c25f7aea) | records only; QE raw at `main` `a2d7dda7` re-read: SHA256SUMS 23/23 OK, counts reproduced (6+2 Finished, 493 clocked go, 151 go depth 4, 0 setoption, 0 faults, 0 isready in go) | — | — | PASS (no required fixes; no new accepted risk); STOP not fired; UAT waived (0 production lines); merge is the Orchestrator's |
