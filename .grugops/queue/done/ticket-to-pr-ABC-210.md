---
subtask: ticket-to-pr-ABC-210
role: software-engineer
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/ticket-to-pr-ABC-210/
branch: new grugops/ABC-210 from main, worktree ../wt-ABC-210
width: 2 of 2 (no real-clock timing, no G6, no games)
---

# Build ABC-210: a check extension at the horizon (ADR-0051, ACCEPTED by the owner)

## Do
- Read Orchestrator `owner-word-2026-10-27/…047d411f`. Own worktree and `npm ci --ignore-scripts`.
- Build exactly to the page's `## Design ruling` and ADR-0051 (Architect `arch-design-ABC-210/…c5d0e464`, `…8e6a40c2`) as amended on the page (BA/PM `bapm-amend-ABC-210/…ae96d6d3`, `…6f7cb75e`). That covers:
  - the pure predicate `checkExtensionPlies(position, depth, extensions)` → 1/0 (remaining depth ≤ 0, side to move in check, cap 1 per line), called at node entry in both recursions; `extensions` placed before `afterNull`;
  - the door pair `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`, with older doors as the ruling says;
  - `QUIESCENCE_MAX_PLY` and `src/quiescence.ts` untouched; the page's Scope header lines.
- Tests:
  - A2: ADR-0051 d8's five horizon rows at depth 1 (both recursions), the line-length instrument and the cross-check cap row.
  - A3: d6 nodes against the door (≤ 1.5×); drift d5 on the 190, both recursions, ≥ 90 % within 25 cp, none beyond 174 cp; same-depth mate floor d5 on the 287.
  - The predicate table and the unit rows the ruling names.
- Pins — only those the ruling names:
  - **P1 (Orchestrator, …75af453c):** `transposition.test.ts` ABC-081 A5 fixture row re-pinned depth 3 → depth 2 at −502 (ADR-0026 d7).
  - **P2 (owner, …047d411f):** `search.null-move.test.ts` ABC-208 A2 `zugzwang.005` depth 12 → 13.
  - The 2 export lists, the 2 QE-208-c door maps, and the named re-points to the new doors (ADR-0050's d5 drift ×2, mate floor, "changes the work" ×2).
  - Any other value pin, relation, level or NFR bound moving → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom), skips (`--skip-count 0`), SEARCH_DEEP (incl. the null-move deep lane per AGENTS.md), ENGINE_DEEP (deterministic rows only), PUZZLE_DEEP (G1 54/58). No real-clock timing.

## Fences
- Only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se210/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. Do not edit ADR-0050 or ADR-0051 (Architect is accepting them beside you).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-210). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Built to ADR-0051 and the page's Design ruling. No STOP: exactly the ruled pins moved, and no other value pin, relation, level or NFR bound.** Branch `grugops/ABC-210` in `../wt-ABC-210` (own `npm ci --ignore-scripts`), from `main` `5dfd818c`. Code `dc4edb32`, tip **`a96f36b0`** (notes). Not pushed, not merged. ADR-0050 and ADR-0051 were not touched. Plants and probes ran on scratch copies under `<scratchpad>/se210/`, never in `src/`. No real-clock timing, no G6, no game.

| item | at the tip |
|---|---|
| Build | `src/search.ts`, `src/engine.ts` only (+192 −21). `checkExtensionPlies(position, depth, extensions)` returns 1 when depth ≤ 0, the count is < 1 and the side to move is in check. It is called at node entry in both recursions, after the repetition scan and before the leaf test and the probe, under switch `checkExtension`. `extensions` comes before `afterNull` and is handed to every child. Doors: `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`; 12 older doors are off. `src/quiescence.ts` is untouched. Headers are updated |
| Pins | **P1:** `transposition.test.ts` A5 d3 −485 → d2 −502. **P2:** `zugzwang.005` d12 → d13, plus the same file's table-sanity row "depths 8 to 12" → "8 to 13", the pin's own consequence (flagged in the note). The 2 export lists and the 2 QE-208-c door maps grow (`nullMove: true`). 5 re-points (d5 drift ×2, mate floor, "changes the work" ×2) |
| Red-first | the production change alone gives 2 123/2 128, the ruling's 5 predicted reds exactly. 8 plants on the new file, each red: dead 19, +2 plies 9, no cap 3, interior 2, out of check 2, engine switch off 12, engine count dropped 2, door wired on 11 |
| A2 | 5 horizon rows ×2 recursions: each plays the check, and each door plays the ADR's move. Instrument: d1 reaches ply 2, the doors ply 1; four roots at d5 reach ply 6, never 7. Cap row: d1 reaches 2 (never 3); `search()` d2 reaches 3 |
| A3 | d6 nodes 1.054× / 1.007×. Drift d5 on the 190: 93.58 % / 94.12 % within 25 cp, max 116; mate flips 0. Mate floor 0 of 189. Re-pointed ABC-208 rows read pre-ticket 100 %/25, 100 %/8, 0/189 |
| Counts | frozen-clock base → head: kiwipete d7 590 489 → 610 577, d8 1 259 463 → 1 302 377; position-6 d7 180 941 → 181 191, d8 355 565 → 358 872. **All equal the ruling's.** A1 self-check (QE's out of tree): 282/282 door cells equal to base |
| Gates | lint, typecheck and build rc 0. `npm test` 64 files, **2 161 / 2 161**; `last-run.json` success, 0 failed/pending/todo. Duration 8.96 s at the first run, 11.3–11.8 s at load1 ≈ 10 (base 8.40 s; not readings). The new default rows cost 17 ms. Skips 0, `No findings.` Lane inventory 64 = 64. SEARCH_DEEP check-extension 43, null-move 44 (zugzwang.005 Nxd5 at d13), search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29. ENGINE_DEEP (real-clock filtered): engine 54+6, levels 38+3, transposition 25+1, pvs-lmr 20+1, legal 37, gameend 47. PUZZLE **G1 54/58**, base's four misses, no NEWLY. All green |
| Owed elsewhere | `AGENTS.md` § Commands needs a line for the new deep lane (`SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.check-extension.test.ts`). ADR-0050 d9's table still reads `zugzwang.005` at 12 (`arch-accept-adr0051`). QE re-plants the P1 fixture bug at d2. LOW: an extended node is an interior node, so it does not consult `leafEndReason`; this is as ruled |

Notes are sealed via `admitAndAppend` (`contextRoot` = the worktree's `.grugops/context`) and read back 2/2, in `../wt-ABC-210/.grugops/context/ticket-to-pr-ABC-210/notes/`: decision `…8c4e8b4b` (the build, the pins, five in-ruling choices) and observation `…548912ef` (red-first, plants, counts, deep lanes, gates, flags).

### Trace row
| ABC-210 (ticket-to-pr-ABC-210) | check extension at the horizon, +1 ply once per line, in both recursions, behind the test-only door pair | EPIC-008 | — | ADR-0051 ACCEPTED (owner …047d411f; in force at merge); no bound moved; NFR-005/G6 predicted MET (UNKNOWN - verify) | grugops/ABC-210 @ a96f36b0 (code dc4edb32)<br>src/search.ts, src/engine.ts; src/search.check-extension.test.ts (33 default + 10 SEARCH_DEEP); search.test.ts, engine.test.ts export lists; search.null-move.test.ts (door maps, 5 re-points, P2); transposition.test.ts (P1); .grugops/context/ticket-to-pr-ABC-210/notes/ (2) | red-first 5 predicted reds; 8 plants bite; A2 5×2 + instrument + cap; A3 1.054×/1.007×, 93.58 %/94.12 % max 116, 0/189; frozen-clock = ruling; A1 self-check 282/282; npm test 64/2161; deep lanes green (real-clock filtered); G1 54/58; skips 0, No findings. | owed: QE verdict signs (owner delegation 2026-10-22) | — | In Development → In Review (QE: A1 out of tree, P1 re-plant, G2/G5/G6/G8/G9/G10/G11, D/S1 ALONE) |
