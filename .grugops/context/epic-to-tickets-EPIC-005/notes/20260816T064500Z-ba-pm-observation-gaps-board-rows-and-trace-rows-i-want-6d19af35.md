---
id: 20260816T064500Z-ba-pm-observation-gaps-board-rows-and-trace-rows-i-want-6d19af35
kind: observation
by: ba-pm
at: 2026-08-16T06:45:00Z
verified_by: 
confidence: high
refs:
  - EPIC-005
  - EPIC-004
  - EPIC-001
  - ABC-092
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-096
  - RISK-004
  - NFR-006
  - NFR-007
  - ADR-0009
supersedes: 
---

# Gaps (severity + owner), the board rows I want, and the traceability rows

**I wrote `plans/tickets/ABC-092`…`ABC-096` and these notes. Nothing else. I did not touch
`plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `plans/epics/`, `AGENTS.md`,
`src/`, any test, or any id at or above `ABC-097`. I ran no git command.**

## Gaps

| # | severity | gap | owner |
|---|---|---|---|
| **G1** | **HIGH** | **`RISK-004` is unresolved: no opening-data source and no licence is chosen, and `plans/nfr-catalog.md` rules the redistribution question NOT moot under the local-only posture ("a `git clone` is still redistribution").** Every data-bearing ticket in this epic is illegal to start until it is. **My subtask's stop condition fired here and I obeyed it — I named no candidate source.** | **Project owner (ratification) + Architect/Design (ADR)**, via `ABC-092` |
| **G2** | **HIGH** | **`EPIC-004`'s move-choice entry point does not exist, and three things about it are unknowable at this hop: its ticket id, whether it can be wrapped from outside, and whether it is spy-able.** `ABC-095` is written against **behaviour only** and contains **no `EPIC-004` ticket id by construction**. | **BA/PM cutting `EPIC-004`** (to publish the seam) + **Orchestrator** (to link the ids once both cuts land) |
| **G3** | **MEDIUM** | **Where the book short-circuit physically lives — inside `EPIC-004`'s move-choice function, or in the caller above it — is an unmade architecture decision straddling two epics.** Recorded on `ABC-095` and deliberately not taken: taking it in an `EPIC-005` ticket would be this epic deciding `EPIC-004`'s shape. | **Architect/Design**, at `ABC-095`'s `In Design` |
| **G4** | **MEDIUM** | **Two epics want ONE seeded-randomness seam and neither owns it.** `EPIC-005` needs it for weighted book choice ("deterministic under a fixed seed"); `EPIC-004` § Scope needs it for blunder-rate difficulty and its own "reproducible under a fixed seed" acceptance. **`src/` has no production randomness source today** — the only seeded generator on record is the LCG fixture at `src/history.test.ts:81-89`. Left unruled, the two epics ship two RNGs. | **Architect/Design**, before either `ABC-094` or `EPIC-004`'s search ticket enters `In Development` |
| **G5** | **MEDIUM** | **`NFR-006`'s stated instrument does not exist.** Its `Verified by` cell says *"artifact size check at build"*, and `npm run build` is `tsc --noEmit`, which emits nothing; there is no `dist/`. `plans/nfr-catalog.md` already records this at its `NFR-006` deploy-dependency row. **`ABC-093` `A5` supplies an instrument that runs today** (read the checked-in file, assert ≤ 1,048,576 bytes) — **but the catalog row still names the phantom one**, and I may not edit that file. | **Security/NFR** (row), at `ABC-093`'s gate |
| **G6** | **MEDIUM** | **This epic adds the project's first third-party *content* dependency.** The ASVS `V15.1.1`/`V15.2.1` severity override from `high` to `low` is justified on record by *"zero runtime dependencies"*. `ABC-093` `A7` keeps `package.json`'s `dependencies` at `{}`, preserving the letter of that justification — **but a bundled third-party data file is a third-party component in substance.** Recorded, not resolved. | **Architect/Design**, at `EPIC-006` (the deferral's existing owner) |
| **G7** | **MEDIUM** | **Book-supplied opening names are untrusted text reaching the terminal through a NEW door.** The measured escape-byte bar in `plans/nfr-catalog.md`'s `NFR-002` section (0 ESC / 0 C0 / 0 `U+007F` / 0 code points above `U+007F` in ASCII mode, row count constant) was written for **player** input. `ABC-096` `A3` transcribes it with its source, and `A4` bounds the field because that section measured an unbounded supplied string at 400,000 characters = the whole 16 ms budget. **The bar is not a catalog ROW, so nothing structurally forces a gate to apply it to this new door.** | **Security/NFR**, at `ABC-096`'s gate |
| **G8** | **MEDIUM** | **Loading the book may land inside `NFR-007`'s `npx`-to-first-board window (< 2 s)** if the load is eager. `ABC-094` carries an `N-LOAD` bar with two acceptable forms (0 filesystem ops at construction, **or** measured load ≤ 100 ms = 5% of the 2 s window). **Which form is chosen is a design decision, not an engineering detail.** | **Architect/Design**, at `ABC-094`'s `In Design` |
| **G9** | **LOW** | **`ADR-0009`'s frame row identity (`= 23` tripwire, `≤ 24` requirement) versus an opening-name field.** `ABC-096` `A2` forbids spending the one row of headroom on a `P3` cosmetic field on its own authority and routes it here instead. | **Architect/Design**, only if `ABC-096` cannot fit the name into an existing region |
| **G10** | **LOW** | **`plans/epics/EPIC-001-chess-rules-core.md` front matter reads `status: backlog` / `column: Backlog` while its modules are merged on `main`** (`fen.ts`, `legal.ts`, `apply.ts`, `san.ts`, `zobrist.ts` all read at this hop). **Same defect class as `W1`**, the board↔ticket front-matter drift repaired on 4 of 69 rows on 2026-08-16 — but for **epics**, which that repair did not cover. I checked `EPIC-005`'s dependency by reading the tree precisely because I did not trust this field. | **Orchestrator** (the file is outside my write limits) |
| **G11** | **LOW** | **`EPIC-005` § Scope calls the book file "a build artifact" checked into the repo.** In this repository "build" emits nothing and there is no `dist/`; a checked-in generated file is not a build artifact in the sense `EPIC-006` will use the word. Wording only — it misled me for one reading. | **BA/PM**, at the next `EPIC-005` amendment |
| **G12** | **LOW / informational** | **This repository is about to hold two different things called a "licence".** `src/history-pane.nfr.test.ts`'s `LICENSED_DRIVERS` (an *import* licence, `ABC-057`'s subject) and the book's *redistribution* licence (`ABC-092`). Recorded on `ABC-092` so a later hop does not fold them. **No action wanted.** | **Whoever holds `ABC-057`** — informed, not asked |
| **G13** | **LOW** | **`EPIC-005`'s epic-level acceptance bullets 1–3 are only executable end to end once `ABC-095` lands**, since each begins "when the engine moves". I decomposed them into ticket-level criteria that ARE executable earlier — the ten-games variety clause splits into `ABC-093` `A4` (data: ≥ 3 replies to `1. e4`) and `ABC-094` `A3` (behaviour: ≥ 3 distinct across ten seeds). **The epic's own wording is not amended by me** and remains the UAT bar. | **BA/PM / UAT Planner**, at `EPIC-005`'s UAT |

**No `kind: finding` is used here.** `context.human_admission` is `off` on this install and no
`§14-gate#<id>` stamp is emittable, per `AGENTS.md`.

## Board rows I want appended — one line each, all under `## Backlog (WIP unlimited)`

Backlog is unlimited, so nothing I add can breach a WIP limit.

```
- [ABC-092] Decide and record the opening-book source and its licence before a byte is copied  (BA/PM, S, P1, epic: EPIC-005, since: 2026-08-16, DoR 9/10 ⚠️ the CHOICE is the owner's + Architect/Design's — an agent researches, a human ratifies; **the only ticket in EPIC-005 that is pullable TODAY**; RISK-004; 0 files under src/)
- [ABC-093] Compile the opening lines into one static, data-only, reproducible book artifact  (BA/PM, M, P1, epic: EPIC-005, since: 2026-08-16, DoR 8/10 ⚠️ HARD-BLOCKED on ABC-092's ADR; ⚠️ format is Architect/Design's at In Design; NFR-006 ≤ 1,048,576 bytes on an instrument that runs TODAY; needs nothing from EPIC-004)
- [ABC-094] Book probe — lookup, weighted seeded choice, and no crash on a missing or corrupt file  (BA/PM, M, P1, epic: EPIC-005, since: 2026-08-16, DoR 8/10 ⚠️ ordering on ABC-093 only; **the largest thing EPIC-005 can deliver while EPIC-004 is unbuilt**; introduces the project's FIRST production randomness seam — see G4)
- [ABC-095] Put the book in front of the engine's move choice and fall through cleanly when it leaves book  (BA/PM, S, P1, epic: EPIC-005, since: 2026-08-16, **DoR 7/10 — NOT READY, and the score is not inflated**; ⚠️ HARD-BLOCKED on EPIC-004's move interface, which did not exist when this was cut — depended on BY BEHAVIOUR, **no EPIC-004 id guessed**; ⚠️ where the short-circuit lives is unruled (G3))
- [ABC-096] Show the named opening when the book knows it — inside the frame's existing row identity  (BA/PM, S, P3, epic: EPIC-005, since: 2026-08-16, DoR 8/10 ⚠️ needs ABC-093's format to carry the name; **the epic's droppable bullet — shed this first**; first third-party text to reach the terminal, so the ABC-018 escape-byte bar applies (G7); promote to P2 if the format would have to be re-opened to add it later)
```

## Traceability rows I want appended (10-column shape at `plans/traceability.md:197`)

```
| ABC-092 | Decide and record the opening-book source and its licence before any data is copied (EPIC-005 § Scope 1; RISK-004) | EPIC-005 | — | NFR-006 (informed, not verified); ASVS V15.1.1/V15.2.1 challenged | not started — markdown only, 0 files under src/ | not started — no test file, by design (test note 1) | not started | not started | Backlog — DoR 9/10 ⚠️ owner ratification |
| ABC-093 | Compile the selected lines into one static, data-only, reproducible book artifact with a 100% legality proof | EPIC-005 | — | **NFR-006 ≤ 1,048,576 bytes (A5, own instrument — see G5)**; NFR-008 ≤ 650 ms CPU / ≤ 2 files | not started — compiler + artifact + attribution file | not started — reproducibility, legality, depth bounds, 1.e4 reply count, artifact size | not started | not started | Backlog — DoR 8/10 ⚠️ blocked on ABC-092 |
| ABC-094 | Book probe — lookup, weighted seeded choice, exactly-once warning and no crash on a missing or corrupt book | EPIC-005 | — | N-LOAD (0 fs ops at construction OR ≤ 100 ms = 5% of NFR-007's 2 s); probe ≤ 30 ms = 1% of NFR-004's 3 s; NFR-008 ≤ 650 ms CPU / ≤ 2 files / ≤ 2 spawns | not started — one new module | not started — 100 identical seeded picks, ≥ 3 of 10 seeds distinct, ±5 pp over 1,000 draws, 5-case corrupt matrix, exactly 1 warning over 50 calls | not started | not started | Backlog — DoR 8/10 ⚠️ ordering on ABC-093 |
| ABC-095 | Short-circuit the engine's move choice with the book; fall through to search invisibly when it leaves book | EPIC-005 | — | NFR-004 consumed (≤ 30 ms hit, ≤ 5 ms miss overhead); NFR-002 observed; **NFR-005 explicitly NOT triggered**; NFR-008 ≤ 650 ms / 1 file / 0 spawns | not started — 2-3 call sites | not started — search called 0 times on a hit and exactly 1 on a miss (spied COUNT, never a clock), equal frame row counts across the transition | not started | not started | **Backlog — DoR 7/10, BLOCKED on EPIC-004's move interface (dependency by behaviour; no id guessed)** |
| ABC-096 | Show the named opening when the book knows it, inside the frame's existing row identity | EPIC-005 | — | **NFR-002 < 16 ms TRIGGERED**; ADR-0009 row identity (= 23 / ≤ 24); escape-byte bar transcribed from the NFR-002 section (G7); NFR-008 ≤ 1 file | not started — display path only | not started — equal row counts across 3 frames, 0 ESC / 0 C0 / 0 U+007F / 0 non-ASCII in ASCII mode, 100,000-character name bounded | not started | not started | Backlog — DoR 8/10 ⚠️ needs ABC-093's name field |
```

## Ids

**`ABC-097`, `ABC-098` and `ABC-099` are UNUSED and free.** The range was a ceiling, not a quota.
**No id at or above `ABC-100` was written, read or referenced.**
