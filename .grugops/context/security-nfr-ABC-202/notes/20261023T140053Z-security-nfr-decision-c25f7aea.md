---
id: 20261023T140053Z-security-nfr-decision-c25f7aea
kind: decision
by: security-nfr
at: 2026-10-23T14:00:53Z
verified_by: 
confidence: high (placement transcribes owner-accepted M1/M8(a) text; one reading on one host, other hosts UNKNOWN - verify)
refs:
  - ABC-202
  - security-nfr-ABC-202
  - EPIC-007
  - M1
  - M8
  - ADR-0044
  - ADR-0045
  - NFR-012
  - RISK-EPIC007-01
  - QE-202-a
  - QE-202-b
  - e5c5c2a5
  - a2d7dda7
  - plans/nfr-catalog.md
  - plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
  - .grugops/context/qe-read-ABC-202/raw/run.sh
  - 20261023T135324Z-qe-e2e-observation-8a2be50b
  - 20261023T135324Z-qe-e2e-observation-202e80c8
  - 20261023T135324Z-qe-e2e-observation-81066c23
  - 20261023T135324Z-qe-e2e-decision-632c11f1
  - 20261023T140053Z-security-nfr-observation-0ffaf6fe
  - NFR-011
  - AR-NFR004-A
  - 20261023T132838Z-ba-pm-decision-d9f46c46
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261021T143943Z-security-nfr-decision-75a45be0
supersedes: 
seal: sha256:a2a4fb8a56cbe15405f0e5f3249a082929c73b0cf4dab6ff4effd291aa4101b4
---

# Security/NFR on `ABC-202`: **PASS.** `ADR-0044` candidate row (ii) is placed as **`NFR-012`**, its bounds M1's and M8(a)'s unchanged, with `raw/run.sh` as the instrument. `QE-202-a` is folded. I agree with QE's host ruling. The STOP did not fire

This is a `decision`, not a `finding`: no stamp exists on this install (`human_admission: off`). Evidence: `…0ffaf6fe`. QE: `…8a2be50b`, `…202e80c8`, `…81066c23`, `…632c11f1`. Records only: nothing was run.

## 1. Row (ii) lands as a new row, `NFR-012`, with no new bound
- **Authority.** `ADR-0044` § NFRs ("Security/NFR places rows at acceptance") and `EPIC-007` ("Security/NFR places candidate rows (i)–(iii)"; § NFR, "(ii) time safety (M1, M8(a))") give this role the placement. Both are owner-accepted. `NFR-011` (row (i)) set the precedent on 2026-10-21.
- **The target is M1's and M8(a)'s text, unchanged:**
  - (a) 6 games, `tc=60+1`, default options: 0 illegal moves, 0 time forfeits, 0 disconnects or stalls; every game ends by a chess result or by adjudication.
  - (b) 2 games, `tc=inf depth=4`: 0 illegal moves and 0 stalls; every searched move's final depth ≤ 4.
- **No margin bar was added.** The closest clock, the `isready` count and the move gap are reported, not graded, as on the `ABC-202` page.
- "Default options" is read at `Skill Level` 5 under the owner-accepted `ADR-0045` D4, as BA/PM ruled at the cut (`…d9f46c46`). That applies an accepted ADR and does not move a bar.
- **So the STOP ("a new NFR bound or a changed one") does not fire.** The owner delegation (`…5aaf7cec` item 3) keeps M-criteria changes and NFR bound moves with the owner. This hop made neither.
- **One dated insertion.** One table line was added after `NFR-011`. No `_Updated` header line and no closing section were added, to keep to the brief. The 2026-10-21 bullet "(ii) time safety: NOT YET placed" stays as history. The new row says that it supersedes that bullet.
- **First reading: (a) MET, (b) MET** at S `e5c5c2a5` (Apple M3, Node v26.11.1, `cutechess-cli` 1.5.1). This is one reading per measure on one host, so other hosts are `UNKNOWN - verify`.
- **Re-read trigger** (verification policy, not a bound): `ADR-0044` D4 or D5, `DEFAULT_LEVEL`, or the engine's budget clamp changes.

## 2. `QE-202-a`: done in both places
- **The catalog row** names `.grugops/context/qe-read-ABC-202/raw/run.sh` (sha256 `6562e145c5e02361…`) as the instrument, not `ABC-202` § The pinned invocation. It also states `-debug all` and why.
- **The `ABC-202` page** gets a dated erratum directly under its pinned block. The erratum names `run.sh` with its full sha256 and says the bare `-debug` exits under Qt 6. It also covers the flag table's `-debug` row and `QE-202-b` (`debug on` is sent and ignored). The block is kept as it was cut.

## 3. The host that was not quiet: **I agree with QE.** It does not matter for this reading
- M1 is a count of faults, and every fault is a FAIL-class event. Load or thermal throttling only slows the engine and the tool. Both make a forfeit or a stall more likely, never less. `cutechess-cli` times a move from its own send to its own read, so a delayed read lengthens the measured time. It cannot shorten it.
- So a 0-fault reading on a loaded host is the harder test, and it stands. `ABC-202` § Host preconditions pre-registered exactly this rule before the run, and the fallback (UNRESOLVED, one quiet re-run) is owed only after a FAIL-class result. There was none.
- **The raw files agree** (`…0ffaf6fe`). The over-3 000 ms moves and their maxima are the same in the loaded games 1–4 as in the quiet games 5–6. Load1 never crossed 8. AC was on throughout.
- **One honest gap (INFO).** `ABC-202` asked for the run to go "alone among agent hops". The foreign vitest came from another repository (`Projects/public/grugops`). Whether it was an agent hop is `UNKNOWN - verify`. Either way, it only matters for attributing a FAIL. This run may also have loaded that other repository's timing. That is outside this repository and is not ruled here.

## 4. Security
- Not triggered. The change is records only: 0 `src/`, `tools/`, `data/` or `package*.json` bytes.
- `cutechess-cli` is an owner-built host tool. It is not a repository dependency. It ran only the artifact built from S, in a scratch clone.
- No input, I/O, secret or dependency surface changed. The L1 checklist has nothing to apply to.

## 5. Risks
- **Required fixes:** none.
- **New accepted risks:** none.
- **INFO, `RISK-EPIC007-01` (no action asked):**
  - The reading closes the risk only as M1 can see it: 0 disconnects, and a closest clock of 13.29 s.
  - `cutechess-cli` sent **0 `isready` during a search**. So the case of a GUI that pings during a search (the owner's backend, possibly) was not exercised.
  - That case is still `ADR-0044` D5's stated weakness, with D5's third worker trigger ("a target GUI is shown to time out on `isready` or `stop`"). The `NFR-012` row says this, so the reading is not overclaimed.
  - The `EPIC-007` page is BA/PM's (`bapm-close-EPIC-007`, in parallel) and was not edited.
- **INFO, `NFR-004`:** the longest move gap seen by the tool was 3 010 ms (69 of 493 over 3 000 ms). That is inside the existing `AR-NFR004-A` (≤ 31 ms). It is not a new risk, and `NFR-004` is not re-read.
- **INFO, catalog:** the 2026-10-21 "(ii) NOT YET placed" bullet now reads as history. A later catalog hop may add a dated pointer to `NFR-012` there. Nothing is owed.

## 6. Fence
- Changed: `plans/nfr-catalog.md` (+1 line), the `ABC-202` page (+8 lines) and this task's notes.
- Not changed: `src/`, `package*.json`, `plans/board.md`, `plans/traceability.md`, the `EPIC-007` page, `memory-bank/50-decisions/`.
- No column moved. The trace row is in the brief, for the Orchestrator. Nothing was pushed or merged.
