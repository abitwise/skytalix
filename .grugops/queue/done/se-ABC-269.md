---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:36:34Z
subtask: se-ABC-269
role: software-engineer
ref: .grugops/context/se-ABC-269/
branch: grugops/ABC-269 (on top of QE's freeze c9c27910, with main d172cf8c merged in) — worktree .claude/worktrees/se-ABC-269
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core, one game at a time. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400. Other hops share the lock.
---
# Build ABC-269 (E1: tapered evaluation)
Build per ADR-0064 (ACCEPTED; read its § Decision log — QE-269-a ruled (a), decision …8ccb561f in .grugops/context/arch-ABC-269-rule) and plans/tickets/ABC-269*.md. The page fold (14 lines, observation …1c2ca5ff) is still owed to BA/PM; where the page and ADR-0064's dated lines differ, the ADR wins. Key points:
- One linear phase; every term an mg/eg pair in src/evaluate-params.ts; at E1 only the king square table's eg half and the passer eg half (2×) change; equal at phase 24; test-only off-door pair.
- d2: build ONLY the delta form (QE-269-b — the full form can return −0).
- QE's frozen fixtures (src/evaluate.taper-corpus.ts, sha256 05ed9e81…6e96339, PREREG …1b856350) are frozen: do NOT edit them. Write the tests that need E1 code against them.
- S1–S3 (castled corner) are a reported reading only: print their three values in your Result.
- Report B0 node counts (0.96–1.03× main expected), zugzwang 7/7, mate floor, G1, and the whole npm test count. No 100-game read — that is QE's (B8).
- AGENTS.md: if a new test lane line is needed, list it as owed to the Scribe (3 B headroom); do not edit AGENTS.md.
Fences: the ticket's files + tests. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-269, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-03, Software Engineer. Built and acceptance read. One F3 STOP: G2 (B6) reads 1.067–1.071 × against the 1.05 × bar, so the cost premise misses on my reading. Routed to Architect/Design. No cost cut was built: F3's single value-identical cut (O1-e or a packed score) is the Architect's to order. Everything else holds: B0 EXACT, B1–B4 met. Branch `grugops/ABC-269`, worktree `.claude/worktrees/se-ABC-269`, on QE's freeze `c9c27910` plus main `d172cf8c`. Claim `c0a4bd44`, code `b7a8fc3a`, deep follow-ups `8470d3f0`, then the records commit. Nothing pushed or merged, and nothing left running.**

- **Design (decision `…7445784f`):**
  - ADR-0064 d1–d7 as written. `src/evaluate-params.ts` is the data-only mg/eg table, and only `PST.king` and `PASSED` differ.
  - Phase is gathered in the non-pawn branch, the king Δ in the king branch. The blend is the **delta form only**, mg + trunc(Δ × (24 − w) / 24) (QE-269-b).
  - The memo has a third part (448 KiB).
  - `taper` is set in `Switches` / `Heuristics`: on in `search()` / `chooseMove` only, off in all 12 + 6 older doors.
  - Three test-only doors: `evaluateWithoutTaper`, `searchWithoutTaper`, `chooseMoveWithoutTaper`.
  - **Two implementation choices:**
    - `QuiescenceRules.taper?` is optional. A new `RULES_TAPERED` record is added, and the old records stay byte-identical.
    - `futilityNode` takes a sixth argument, `taper`.
- **Acceptance (observation `…669f366c`):**
  - **B0 EXACT on all 11 counts.** chooseMove kiwipete d8 1 296 788 (0.9922 × main), d9 2 733 330 (0.9617 ×); position-6 d8 404 930 (1.0344 ×), d9 926 005 (1.0120 ×), d10 1 692 669 (1.0050 ×). search() d8 839 514 / 1 533 901. Doors: main's 1 306 981 / 391 451 and 888 786 / 1 262 046.
  - **B1:** (a) 0 mirror mismatches on G3's 184 + QE's 30, and both −0 traps read +0. (b) Exact at phase 24. (c) 0 differences on 176 + 184 frozen pre-ticket scores. (d) D1–D6 read +75 / +34 / +85 / +44 / +55 / +35 (all ≥ 20). (e) 36 pairs plus the grid, all bars met.
  - **S1–S3 (a report, not graded): +13 / +13 / +23**, equal to QE's forecast.
  - **B2:** 0 / 163 and 0 / 189.
  - **B3:** zugzwang **7 / 7** at the recorded depths, none re-pinned.
  - **B4:** G1 **54 / 58**, no NEWLY-MISSED line.
  - **G4 cross-build:** 8 360 door rows against main, 0 mismatches.
  - **Plants:** 10 of 11 red. The survivor (the 24-clamp alone) is an equivalent mutant at E1.
- **B6 / G2: MISS** (decision `…7445784f` § F3).
  - The build against main's `src/`, same process, six perft roots: **1.0711 / 1.0672** (two sessions).
  - Six value-identical micro-variants read 1.065–1.086.
  - Node time: +3–7 %; the door on the identical tree reads +3.0–3.4 %. The estimate was 1–2 %.
  - The cost is the per-piece phase add.
- **Migration (observation `…ec89c8c3`):**
  - 55 first-run reds in 8 files, all classed.
  - Re-pointed, figures unchanged: 16 rows, plus 13 `evaluate` readings in quiescence.
  - Re-pinned old → new: `ABC-230` ×4 fixtures (e.g. d8c8 −1006 → d8e7 −1010), `ABC-249` 404 → 441 / 497 → 520, transposition A5 depth 4 → 5, memo 384 → 448 KiB ×2.
  - Re-found (ADR-0028 d2): `ABC-170` A1's fixture.
  - Source pins re-written: `futilityNode.length` 5 → 6 and the rules regex.
  - Grown: export lists and switch maps.
- **Gates (observation `…ce3d0c5f`):**
  - typecheck 0, lint 0, build 0.
  - `npm test` **2 519 / 2 519** (base 2 429, +90 new), 66 files, 0 skipped, 9.24 s.
  - 12 deep lanes green: taper 99, null-move 44, futility 53, search 57, engine 82, quiescence 116, transposition 40 + 26, pvs-lmr 29, ordering 43, puzzle 18, pawns 44.
  - QE's fixture sha256 is unchanged.
- **Not run (QE's):** B5 (cut audit), B7 (G6 at 4 000 ms, graded on the depth-6 floor), B8 (100 games, S′, Levels). No 100-game read was run.
- **Owed elsewhere:**
  - **Architect/Design:** F3 on G2.
  - **QE:** B5, B7, B8, a G2 re-read, and UAT.
  - **Scribe:** one AGENTS.md lane line, `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts` (B0 + B2, 9 rows).
  - **BA/PM:** the 14-line page fold `…1c2ca5ff`, unchanged by this hop.
  - **Orchestrator:** the board move.
- **Notes (sealed, 4 of 4 read back):** design `…7445784f`, acceptance `…669f366c`, migration `…ec89c8c3`, artifacts `…ce3d0c5f`. The raw files are in `.grugops/context/se-ABC-269/raw/`.

### Trace row (10 cells, header order)

| ABC-269 | E1 tapered evaluation: one linear phase (N1 B1 R2 Q4 / 24), every term an mg/eg pair in data-only src/evaluate-params.ts; king eg 40 − 15 m and passer eg 2 ×; delta-form blend; taper switch + three test-only doors | EPIC-011 | ADR-0064 (ACCEPTED, not in force) | B0 exact (0.9617–1.0344 × main); NFR-009 memo 384 → 448 KiB fixed; NFR-008 npm test 9.24 s; G1 54/58; **G2 1.067–1.071 × > 1.05 × (F3 STOP to Architect)**; NFR-005/G6 QE's | grugops/ABC-269 @ 8470d3f0 (+ records commit): src/evaluate-params.ts (new), src/evaluate.ts, src/search.ts, src/engine.ts, src/quiescence.ts | src/evaluate.taper.test.ts (90 default rows: B1 (a)–(e), rule rows, params seam, switch/door source rows; SEARCH_DEEP B0 ×7, B2 ×2) + d7 migration in quiescence, futility, null-move, engine, search, evaluate, evaluate.pawns, transposition tests; npm test 66 files / 2 519 pass, skips 0; 12 deep lanes green; cross-build 0 / 8 360; plants 10/11 red (1 equivalent) | — (UAT owed; the QE verdict signs) | — | In Development, STOP on F3 (G2); B5/B7/B8 QE's; not merged |
