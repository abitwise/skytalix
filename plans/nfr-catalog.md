# NFR Catalog
_Updated: 2026-08-07 by Security/NFR (task `ticket-to-pr-ABC-014`, subtask `security-nfr-abc014-gate`, `ABC-014`'s gate): **`NFR-002`'s BOARD-SCAN COMPUTE HALF IS RE-MEASURED INDEPENDENTLY AND THE BAR IS MET — NO TARGET MOVED, and the `UNKNOWN - verify` on that one half is discharged with its machine.** The Engineer's figure was **not** inherited, on the standard this column set on `NFR-005` and kept on `ABC-012`: own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, `parseFen` **outside** the timed region, a checksum kept so nothing could be optimised away, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **WORST CELL 2.092 / 2.056 µs PER FRAME AGAINST THE 500 µs BAR — 0.0042x, about 240x headroom, MET**, over all 24 cells of (6 standing perft FENs × 2 glyph modes × 2 orientations); best cell 0.955 / 0.980 µs. The two samples agree to 1.7% and pick the same worst and best cell. **THE ENGINEER'S 2.070 µs IS REPRODUCED, NOT CARRIED FORWARD — this gate's two samples BRACKET it**, which is the strongest thing a re-measurement can say and is said here rather than smoothed into a single number. **THE BAR'S OWN POPULATION DOES NOT CONTAIN THIS MODULE'S WORST CASE, and that is stated rather than banked:** a **fully-occupied 64-piece board** — no empty-square short-circuit anywhere, unreachable through `parseFen`, which requires one king per side — measures **2.322 / 2.342 µs**, still **0.0047x** of the bar; the empty board, the true best case, measures 0.910–1.051 µs. **THE 40 / 120 / 300 PLY COUNTS THIS ROW MANDATES DO NOT APPLY TO THIS MODULE AND WERE NOT FAKED TO LOOK COMPLIANT** — the absence is STRUCTURAL and was measured, not assumed: `renderBoard(position, mode, orientation)` takes a `Position`, which carries no move list at all, and this gate verified that **castling, the en-passant square, both clocks and the side to move influence ZERO frame bytes**, so a frame is a pure projection of the 64 on-board squares and has no game-length denominator to carry. **TWO STRUCTURES IN THE NUMBERS, one of them ATTRIBUTED rather than guessed at:** Unicode costs **1.80–1.83x** ASCII (the Engineer's "roughly 2x" — this gate reads slightly lower and says so), and **black-bottom costs ~0.10–0.13 µs more than white-bottom on every cell**, which is **not noise** — measured in isolation, `src/render.ts:146`'s `[...FILE_LETTERS].reverse().join("")` on the black-bottom path costs **+0.112 µs/frame** against the bare constant, accounting for essentially the whole delta. Irrelevant at 240x headroom and recorded only so a later reader does not mistake it for a regression. **`NFR-002`'s WRITE half is UNTOUCHED and remains the half nobody has measured — still `UNKNOWN - verify`, still `ABC-018`'s.** The bounded-pane compute and the status-panel compute are likewise untouched. **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** — this project's standing rule; the microseconds live here, with their machine. **`NFR-001`, `NFR-003`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are BYTE-IDENTICAL; `NFR-002`'s target, its `Applies to` cell, its boundary condition, its three ply counts and every prior measurement are byte-identical — only measured evidence was appended.** Previously 2026-08-06 by Security/NFR (task `refinement-deploy-posture-2026-08-06`, subtask `security-nfr-availability-bar`): **THE `99.9%` AVAILABILITY BAR IS RULED NOT APPLICABLE TO THIS PROJECT AND `.grugops/factory.config.json` NOW SAYS SO — NO ROW WAS ADDED, NO ROW WAS DELETED, NO TARGET MOVED AND NOT ONE MEASURED FIGURE WAS TOUCHED.** The owner stated on 2026-08-06 that this project *"currently does not deploy anywhere"* and *"will be used locally for now"*; `nfr.availability` was the third of the three places the substrate still claimed otherwise, and NFR bars are this role's under the owner's standing directive of 2026-08-03. **An availability SLO is a statement about a service being reachable, and this project has nothing that is ever up** — verified here rather than inherited: `package.json` is `private: true` with **no `bin`, no `main`, no `exports` and no `start`**, `src/` holds ten modules and **no entry point**, and nothing in `src/` listens, serves, opens a socket, sets a timer or installs a signal handler; there is **no git remote, no CI and zero release records**. So there is no window, no denominator and **no instrument that could ever have failed the bar** — which makes it not a bar. **This is NOT `UNKNOWN - verify`, and this file keeps those apart:** `UNKNOWN - verify` means the quantity exists and nobody has measured it; here the quantity does not exist. **The key's contract was verified BEFORE the edit** against `agent-factory/config/factory.config.md` — `nfr.availability` is a free-form string with **no allowed-value set**, it is not one of the nine dials in the config-dial contract, **nothing in the kit reads it by name** and nothing parses it (this install has no `scripts/` directory) — so it can honestly carry the ruling; the file still parses and **the diff is exactly one line**. **DELETING the key was REJECTED as the worst option**, on the same ground the Architect gave for `environments` one hop earlier: the kit's zero-config rule reads a documented default on absence, so a deleted `availability` silently reads as `99.9%` again. **`production_requires_human_confirmation` was re-read after the edit and is still `true`.** **The bar is PARKED, NOT DESTROYED — owner Security/NFR, trigger a named condition rather than a milestone** (the first time this project ships something that must be reachable while its user is away from the keyboard; **nothing in `EPIC-001`–`EPIC-006` does that**, and `EPIC-006` is the checkpoint where the question is re-asked because that is where distribution is decided). **THE BOUNDED SECOND QUESTION IS ANSWERED AND THE ANSWER IS NO:** no other row here, and no `RISK-00x` or accepted risk on record, depends on a deploy target or on an environment promotion path existing. **Two rows (`NFR-006`, `NFR-007`) and two ASVS deferrals (`V13.4.1`, `V15.1.1`/`V15.2.1`) depend on DISTRIBUTION, which is a different thing and is NOT relaxed by the local-only posture** — `NFR-007`'s target names `npx`, and checking it surfaced a **TWO-DOCUMENTS-DISAGREE finding that is reported rather than settled: `EPIC-006` states `npx` in four places while `ADR-0007` clause 5 records the distribution mechanism as UNDECIDED** — flagged with both owners (BA/PM, Architect/Design) and **deliberately NOT edited on either side**. **`RISK-002`'s non-M3 spike, `RISK-004`'s redistribution licence and every one-machine `UNKNOWN - verify` marker in this file stand untouched** — *"we deploy nowhere"* must never be read as *"only this machine matters"*. See the two new sections at the end of this file; **`NFR-001` through `NFR-007` are BYTE-IDENTICAL** and no prior measurement, denominator, marker or instrument-limit correction was reflowed or re-opened. Previously 2026-08-04 by Security/NFR (task `ticket-to-pr-ABC-012`, `ABC-012`'s gate): **`ABC-012`'s five numeric bars are RE-MEASURED INDEPENDENTLY AND ALL SIX ARE MET, and NO TARGET MOVED — not one.** The Engineer's figures were **not** inherited, on the standard this column set on `NFR-005`: own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware; population named as the same deterministic LCG game `src/history.test.ts:81-89` plays. **`takeBack(h,2)` 2.46 / 2.45 µs (0.49x of ≤ 5 µs) · `keyHistory` 40.16 / 40.20 µs (0.67x of ≤ 60 µs) · `repetitionCounts` 44.35 / 44.45 µs (0.59x of ≤ 75 µs) · `gameStatusOf` 47.75 / 47.59 µs (0.64x of ≤ 75 µs) · `playMove` 8.6 / 8.2 ns (0.09x of ≤ 100 ns) · `repetitionCounts` @ 300 plies 91.93 / 92.15 µs (0.61x of ≤ 150 µs)**, with growth linear at 17.5 / 44.4 / 92.0 µs over 40 / 120 / 300 plies. **TWO ROWS GAIN REAL-CODE FIGURES AND NEITHER TARGET CHANGES.** `NFR-002`'s boundary-condition block quoted **46–50 µs / 97–102 µs as a WAVE-1 PROTOTYPE's numbers, taken before `src/history.ts` existed**; the module now exists, the quantity is measured on it, and the real code lands **inside the band that block already quoted, 1–8% below it** — the boundary condition itself is untouched and was **verified structurally to still hold: `src/history.ts` has ZERO importers**, so nothing pulled the repetition derive into a frame and the `O(window)` statement stands. `NFR-003` gains `ABC-012`'s derives as a named second component of the **turn** (not the frame), where four derives at ~48 µs are about **0.4% of the 50 ms budget** — compute is not the risk on that row either, and **the unmeasured terminal-I/O half remains the whole risk**. **TWO FENCES TESTED RATHER THAN RESTATED:** `gameStatusOf`'s margin over the bare derive IS one `legalMoves` call plus ~0.6 µs and **swings 1.4x on position** (3.14–3.40 µs startpos-anchored against 4.49–4.55 µs kiwipete-anchored, matching bare `legalMoves` of 2.74 and 3.89–3.96 µs) — **and against expectation the expensive-`legalMoves` anchor is CHEAPER OVERALL (41.89 / 42.25 µs), because the `O(plies)` derive dominates, so the worst generator position is NOT the worst case for the composite**; and the `takeBack` **upper bound** reads **HIGHER** with the restore outside the clock (2.92 / 2.93 µs), the restore's own ~0.017 µs being **below instrument resolution**, so the bar is MET on either framing. **INSTRUMENT-LIMIT CORRECTION, THE SEVENTH THIS FILE HAS RECORDED, and it would have produced a FALSE MISS:** the first `takeBack` cell called `legalMoves` INSIDE the timed region and read **10.38 µs against the 5 µs bar — 2.08x, a MISS**; hoisted out of the clock it reads 2.46 µs, and **no number is claimed from the discarded instrument**. **WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED:** four derives 1–8% lower, `takeBack` agreeing to 0.4%, and **`playMove` 1.5x apart (8.2–8.6 ns against 12.4–12.7 ns) — a difference this gate CANNOT attribute**, both being >7x under the bar. **No wall-clock assertion was added to the suite**, this project's standing rule. **`NFR-001`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are BYTE-IDENTICAL; `NFR-002`'s and `NFR-003`'s targets, levels, denominators, `UNKNOWN - verify` markers and every prior measurement are byte-identical — only measured evidence was appended.** Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, the SECOND risk/NFR gate): **NFR-005's fix cost is RE-GATED and MET, NO TARGET MOVED, and this row now carries two withdrawals rather than one new claim.** Both bar positions re-measured independently against a byte-identical twin used as a **null control by identity** — startpos **296.8–299.3 ns** and kiwipete **304.7–307.4 ns**, both MET with room against the ~450 ns and 432–459 ns bars; the call-count sub-bar re-verified at **ZERO** predicate calls over **437,077** no-ep nodes of a **518,474**-node walk, reproduced to the node on this gate's own spy. **The two guards' cost is BELOW what the whole-key instrument can resolve and no number is claimed from it** — every shipped-minus-pre-guard delta sits inside the twin's own band and the deltas flip sign between two samples. Measured on the predicate in isolation instead: **about +0.9 ns** on the ep-set/no-capture shape, **≤ +0.15 ns amortized** (~0.05% of a ~305 ns key), **23x cheaper** on the invalid-FEN class — consistent with the Engineer's and the design hop's ceilings and **not** confirming their per-cell point estimates. **WITHDRAWN (1): any claim that the worst-case ep spread is settled.** Three protocols on this ticket read 1.385–1.400x, 1.401–1.412x and 1.446–1.458x — about ±4% apart, which is the size of the spread itself. The bar is unaffected; it is anchored at kiwipete/startpos. **WITHDRAWN (2): the "+1.6 ns" per-call estimate for deleting the predicate's own `NO_SQUARE` early return.** It does not survive its own null control — the same benchmark reads +0.9 to +2.9 ns on cells where that delta is structurally zero. Two behaviour-equivalent cost mutants are recorded as **deliberately NOT pinned**, with the reason: no spied call count distinguishes them on any of nine call shapes, one of them costs structurally zero through the only production caller, and the only instrument that could see them (a Proxy board-read counter) **throws outright** on this code without a shim, costs 11.1–13.6x when shimmed, and inflates the un-instrumented readings 2.0–3.0x. Every target, level, marker, amortized row, allocation figure and diagnostic byte-identical; NFR-001/002/003 untouched. Previously 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, the SECOND design hop): **NFR-005's row records the cost of the ruled defect fix, and NO TARGET MOVED.** The fix adds two board-read guards inside `hasLegalEnPassant`; they cost **zero** on the no-ep path and at both anchor positions (structurally — the caller's short-circuit never enters the predicate, so the call-count sub-bar and `src/zobrist.nfr.test.ts` are untouched by construction), **≤ +0.5 ns amortized per node** (under 0.15% of a ~317 ns key), and they are **20–27x cheaper** on the invalid-FEN class they exist for. **The instrument's limit is stated rather than hidden:** two whole-key runs bracket 1.0 from both sides, so that instrument cannot resolve the delta and no number is claimed from it — the isolated predicate figures are the claim. **These are a design hop's numbers, not a gate's, and they are labelled as such: Security/NFR re-gates after the fix and owns the verdict.** The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7, the call-count sub-bar, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, ABC-011's gate): **NFR-005's per-node key cost is MEASURED and MET, and NO TARGET MOVED.** The design hop's figures were re-measured independently rather than inherited — own scripts, own `git archive` baseline of `4c6ed7d`, both trees in one process, interleaved, two samples, on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` elsewhere: **startpos 297.2–298.4 ns and kiwipete 323.5–330.9 ns — the row's own anchor positions — against 1.5x bars of ~450 ns and 432–459 ns, both MET**; worst case 1.385–1.400x, which lands between the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x and so resolves that spread. **One correction, of the same class this file has now made three times before: the "not made slower at all" sub-bar is a CALL-COUNT bar, not a timing bar, and the row did not say so.** No wall-clock run can settle "at all" — this gate's own no-ep timings sit at 1.003–1.007x, inside noise in both directions. The claim is structural (the `epSquare` guard short-circuits, so the majority path executes byte-for-byte what it executed before) and the only instrument that can fail it is a spied call count: **ZERO predicate calls over 260,292 no-ep nodes**, reproduced identically on two independent scripts. **`src/zobrist.nfr.test.ts` now pins it**, because three behaviour-equivalent mutations each left all 189 tests green — the same "a measurement is not a guard" lesson this row already carries for NFR-001. The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, design hop): **NFR-005's row gains the per-node Zobrist key cost, and NO target moved.** `ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a key per node, so the key is the one component of a search node this catalog can price before a search exists — and `ABC-011`'s design hop put a legality question inside that function, which makes the number owed here rather than only on the ticket. **Unlike the 2026-07-31 edit to NFR-001, a benchmark WAS run for this one** — against merged `src/` with a prototype outside the repository, interleaved against merged code in the same process, on Apple M3 / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` anywhere else: **1.014–1.022x per node amortized**, **1.00–1.07x at `kiwipete`/startpos** (the row's own anchor positions, both of which carry no ep square), 1.45–1.48x on the 1.87% of nodes with an ep capture available, +2.3 B/call confined to that shape. The rejected `legalMoves` shape measures 1.979x and would break `ABC-011`'s bar. **The denominator is named, because this file has learned that lesson three times already: the amortized figure is over a 120,000-node pool at the perft table's natural en-passant frequency, NOT a search's node distribution, which stays `UNKNOWN - verify` until `EPIC-004` exists.** The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7 and every demoted node-rate diagnostic are byte-identical. NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-01 by Security/NFR (task `ticket-to-pr-ABC-020`, ABC-020's gate): **NFR-001's three `gameStatus` bars are MEASURED and MET; no target moved and no number was invented.** The row's `UNKNOWN - verify` on those three bars is discharged with the figures, their call shapes and their machine. One correction, of the same class this file already made twice: **the 1.5x / 3.78 µs bar is a START-POSITION number and the row did not say so** — `gameStatus` is dominated by its one `legalMoves` call, so it costs 2.1 µs at startpos and 5.3 µs at kiwipete, on the merged tree as well as this branch. The bar now carries its position, exactly as NFR-005 carries `kiwipete`/`position-6` and NFR-002 carries its window. The ≥ 1,000,000 nodes/sec target, the 6.04M–6.21M measurement and the denominator fence are byte-identical. Previously 2026-07-31 by Architect/Design (task `ticket-to-pr-ABC-020`, design hop): **NFR-001 gains its second consumer and no target moved.** The row applied only to the generator and was verified only by `npm run perft`, which never calls `gameStatus` — so ABC-020's three leaf-cheapness bars had no home in this catalog at all. They are named now with their owner (ABC-020 A10), their machine, and `UNKNOWN - verify`; **no figure was invented and no benchmark was run for this edit.** The ≥ 1,000,000 nodes/sec target, the 6.04M–6.21M measurement and the denominator fence are byte-identical. Previously 2026-07-30 by Architect/Design (**second NFR-002 edit that day, and the target is still < 16 ms** — the ply-count denominator the first edit named is **CORRECTED to a bounded window**, because BA/PM's epic amendment `[A2]` bounds the SAN history pane to 8 move pairs and makes the frame O(window). What is in a frame, the compute/write split and the recorded measurement are all kept; the measurement is **relabelled as history** because it measured the unbounded panel EPIC-002 will no longer ship, and the bounded pane's own compute is **`UNKNOWN - verify`** — no number for it exists and none was invented. See the CORRECTED block in the NFR-002 section below. Earlier the same day: NFR-002 made verifiable during EPIC-002's decomposition — **target unchanged at < 16 ms**; the row gained what is in a frame, a named denominator, the compute/write split, and the measured compute half with its machine. Also earlier the same day: NFR-005 rewritten to the depth-in-budget target ratified in ADR-0003 clause 2 **as amended** by Olger Oeselg on 2026-07-30 — named positions, floor 6 FAIL / target 7 WARN, depth 7 provisional pending EPIC-004's non-M3 spike; node rate demoted to a diagnostic. NFR-001 and NFR-003 untouched. Previously 2026-07-29: corrected NFR-005 against measurement; fenced NFR-001's denominator; NFR-003 partly verifiable. Seeded 2026-07-24.)_

<!--
  FORMAT — read before you append. (clear voice; this is a technical file, not a role prompt.)

  This is the single list of non-functional targets (SLOs and quality bars) for grugops.
  It ships EMPTY: header + separator only, zero data rows.

  Ownership: Architect/Design seeds it; Security/NFR checks against it; Release Manager
  attaches evidence. Tickets reference NFR IDs in their traceability row; Security/NFR fails
  a gate if a touched flow violates a referenced target. Keep targets few and real.

  NFR IDs follow the stable scheme: NFR-xxx (see plans/traceability.md for the full ID scheme).

  Example row shape (this is a comment, NOT a live table row — illustrates the format only):

    | NFR-001 | Performance | p95 API < 300ms | all read endpoints | load test / QE |

  Categories to consider: performance, scalability, availability, reliability/DR, security,
  privacy/compliance, accessibility, observability, maintainability, portability, i18n/l10n, cost.
-->

| ID | Category | Target | Applies to | Verified by |
|----|----------|--------|------------|-------------|
| NFR-001 | Performance | Move generation throughput **≥ 1,000,000 nodes/sec** on perft, current-gen laptop. **Second consumer, added 2026-07-31: `gameStatus` at a search leaf** — `legalMoves` calls per `gameStatus` **exactly 1**, `zobristKey` calls **at most 1**, and **`gameStatus(startpos, emptyMap)`** within **1.5x of its measured 2.52 µs** (ABC-020's bars, ABC-007's standing note). **The 1.5x bar's denominator is the START POSITION and is not an absolute ceiling on `gameStatus`** — see the `Verified by` cell and the section below | Legal move generator — the search hot path (EPIC-001) — **and `src/gameend.ts`, which every search leaf and every ply of ABC-019's loop calls** | `npm run perft` nodes/sec (ABC-006). **MET** — re-measured 2026-07-29 at 6.04M–6.21M over five runs (M3, Node v24.12.0); the earlier `~6.2M` was the top of that range. **Denominator fence: 97.3% of the nodes this counts are free leaves**, so it measures generation-with-free-leaves and is **never** evidence for NFR-005 — see below. **`npm run perft` is NOT the oracle for the gameStatus half and must never be quoted as one:** `src/perft.ts` imports `apply`, `legal`, `moves` and `position` and never calls `gameStatus` or `zobristKey`, which is the gap QE's 2026-07-31 conformance audit existed to cover. **The three `gameStatus` bars are MET — measured 2026-08-01 at ABC-020's Security/NFR gate on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64, and `UNKNOWN - verify` on any other hardware.** Call counts **spied** (instrumented throwaway copies of `legal.ts` + `zobrist.ts` outside the repo, `gameend.ts` `cmp`-verified byte-identical), timings interleaved against the pre-ABC-020 tree `65cb789` **in one process**: **`legalMoves` = 1 across sixteen call shapes** (bare / empty map / 3-4-5 occurrences / clock 100-149-150 / checkmate / stalemate / thin material / kiwipete), **`zobristKey` ≤ 1** — exactly 1 when the counts map is consulted, **0** when the caller is bare and 0 when a cheaper branch decides — and **`gameStatus(startpos, emptyMap)` 2.13–2.26 µs**, i.e. **0.56x–0.60x of the 3.78 µs bar** and **0.98x–1.01x of the same measurement on merged code**. Measured independently twice: by the Engineer (2.17–2.24 µs) and at the gate. **DENOMINATOR, added 2026-08-01: the 3.78 µs bar is a startpos figure.** `gameStatus` is dominated by its one `legalMoves` call, which costs 2.1 µs at startpos and 3.2 µs in a middlegame, so **`gameStatus(kiwipete, emptyMap)` measures 5.30–5.47 µs on this branch and 5.29–5.85 µs on the merged tree** — 1.4x the "bar" on *both*, which is why the machine-independent quantity to read is the **ratio to the same position on the baseline tree (0.94–1.01)**, never the absolute µs. The **call-count** bars must be spied, not inferred: two Zobrist reads instead of one shared read is invisible to every value assertion. **That is no longer a warning without teeth — `src/gameend.nfr.test.ts` (added 2026-08-01 at the gate) pins all three bars as spied assertions.** It was written because three mutations of `src/gameend.ts` — a second `legalMoves()` call, two `zobristKey` reads instead of the shared local, and the 150-ply clock check moved below the fivefold check — each left all 45 tests in `gameend.test.ts` green; each now fails exactly one of its three assertions. Design behind the shape: the ABC-020 design hop of 2026-07-31 (`ticket-to-pr-ABC-020`, note `…-architect-design-decision-f95614ca`) — the added work is four integer comparisons and no new call, and state (c) allocates exactly what the merged code allocates today (measured at the gate: **1.33 B/call on both trees** over 1M-call windows, indistinguishable) |
| NFR-002 | Performance | Full board redraw completes in **< 16 ms** (never a perceptible stall). **Target unchanged** — transcribed from EPIC-002, 2026-07-24, and unchanged again by the 2026-07-30 bounded-window correction: that ruling changed the frame's growth characteristic, not the latency budget | **One full frame** of the terminal renderer (EPIC-002): board + rank/file labels + status panel + the **bounded** SAN move-history panel (most recent **8 move pairs = 16 rendered plies**, blank-padded) + the fixed **2-row message region** (`ABC-018` assembles it and it is part of the frame). **CORRECTED 2026-07-30 — the frame is NO LONGER O(plies).** Epic amendment `[A2]` bounds the pane, so the dominant term is **O(window)**: a fixed 16 rendered plies at any game length. **A frame measurement must still state its ply count**, for two reasons the bound does not remove — (i) the pane replays from `initialFen` to the window's first ply, which is **O(plies)** (one `parseFen` plus ~10 ns/ply; measured near-flat at **2.2–3.9 µs across 40–300 plies**), and (ii) O(window) is now the claim under test, provable only by comparing ply counts. **Boundary condition:** `gameStatus` + `repetitionCounts` is **O(plies)** (46–50 µs @ 120, 97–102 µs @ 300) and belongs to the LOOP (`ABC-019`), not to a frame — `ABC-016`'s panel calls `isInCheck` directly. **If a renderer ever pulls the repetition derive into a frame, the frame is O(plies) again and this row's O(window) statement is void** | **Still not built. The two halves and the three ply counts stand; what the bound changed is which number is on record.** Measure separately, each carrying its ply count and its machine: **(a) frame COMPUTE** — replay to the window's first ply + `toSan` per **rendered** ply (16, not all) + the board scan + the status panel, at ply counts **40 / 120 / 300** on a game from `startpos`, board half over the standing FENs in `src/perft.test.ts`; **(b) frame WRITE** — the same frame serialized and written to a non-TTY sink, still `UNKNOWN - verify` and still the half nobody has measured, but now **length-independent by construction**, since `4a` makes the frame a constant row count (23 in the reference layout). **The BOUNDED pane's compute is `UNKNOWN - verify`. No measurement of it exists, none is invented here, and BA/PM's ≈ 70 µs is arithmetic over wave 1's per-item figures — a target, not a result.** What would close it: `ABC-017`'s cost test (40 / 120 / 300 plies; bar ≤ 150 µs absolute **and** the three within 2x of each other), which cannot run until `ABC-013` ships `toSan`, which is blocked on ADR-0004's ratification. **RETAINED AS HISTORY — it measured the UNBOUNDED panel, which will not be built:** 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64, full-history derive **171–176 µs @ 40 plies, 517–533 µs @ 120, 1,272–1,318 µs @ 300** = 1.1% / 3.3% / 8.2% of the budget, two runs. It survives as an **upper bound** on any bounded pane and as the source of the still-valid per-item figures (`toSan` **4.31–4.45 µs** computing its own legal list, **0.10–0.11 µs** when the caller supplies it). Board, status panel, message region and terminal I/O remain **unmeasured**; every figure is one machine and one Node version, `UNKNOWN - verify` elsewhere. Design behind the shape: ADR-0002 clause 2 (derive, don't maintain) and ADR-0004 (**proposed** — SAN derived per frame, not cached), whose clause-3 first response *"render only the visible window"* `[A2]` pre-adopts. **THE BOARD-SCAN HALF OF (a) IS MEASURED AND MET — added 2026-08-07 at `ABC-014`'s Security/NFR gate, and NO TARGET MOVED.** `src/render.ts` now exists, so the one item in this row's `(a)` list reading "the board scan" is no longer unmeasurable. **The Engineer's figure was RE-MEASURED rather than inherited** (own harness outside the repository, its own process, a discarded warm-up round, 11 rounds with the cell order rotated every round, medians of per-round means, two fully independent samples, **`parseFen` outside the timed region**, checksum against elision), on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**: **worst cell 2.092 / 2.056 µs per frame against the ≤ 500 µs bar — 0.0042x, ~240x headroom, MET**, across all 24 cells of (6 standing perft FENs × 2 glyph modes × 2 orientations); best cell 0.955 / 0.980 µs; the two samples agree to 1.7% and select the same worst and best cell. **The Engineer's 2.070 µs is BRACKETED by this gate's two samples — reproduced, not carried forward.** **THE BAR'S POPULATION DOES NOT CONTAIN THE MODULE'S WORST CASE, so the worst case was measured separately as a fence:** a **fully-occupied 64-piece board** (no empty-square short-circuit; unreachable through `parseFen`, which requires one king per side) reads **2.322 / 2.342 µs = 0.0047x** of the bar, and the empty board 0.910–1.051 µs. **THE THREE PLY COUNTS DO NOT APPLY TO THIS MODULE AND NO PLY FIGURE WAS INVENTED FOR IT** — structurally, and verified rather than assumed: a `Position` carries no move list, and this gate measured that **castling, the ep square, both clocks and the side to move influence ZERO frame bytes**, so a frame is a pure projection of the 64 on-board squares with no game-length denominator. **A frame from this module is 9 rows × 18 characters, CONSTANT** over the standing FENs, the empty board and the fully-occupied board, in both modes and both orientations — which is the geometry `4a`, `ABC-016`, `ABC-017` and `ABC-018` compose against, and it is 9 of the reference layout's 23 rows. **Black-bottom costs ~0.10–0.13 µs more than white-bottom on every cell and it is ATTRIBUTED, not left as noise:** `src/render.ts:146` builds the black-bottom label row with `[...FILE_LETTERS].reverse().join("")`, measured in isolation at **+0.112 µs/frame** against the bare constant — essentially the whole delta. It is 0.02% of the bar and no change is asked for; it is recorded so a later reader does not read it as a regression. **STILL UNMEASURED ON THIS ROW AND UNCHANGED BY THIS EDIT: the frame WRITE half (`ABC-018`, the half nobody has measured), the bounded-pane compute (`ABC-017`, gated on `ABC-013`/`ADR-0004`), and the status-panel compute (`ABC-016`).** A board scan at ~2 µs is **0.013% of the 16 ms budget**, so compute is not the risk on this row either — as on `NFR-003`, the unmeasured terminal-I/O half remains the whole risk. **No wall-clock assertion was added to the suite.** |
| NFR-003 | Performance | Keystroke echo **< 50 ms**; `moves` command and tab-completion **< 100 ms** | Input prompt and controls (EPIC-003). **Second component, added 2026-08-04: `ABC-012`'s game-history derives**, which `ABC-019`'s turn loop calls two to four times per turn and which sit in the **turn**, not in a frame (see `NFR-002`'s boundary-condition block) | **Still partly verifiable — NOT passed. The target did NOT move.** Compute half measured 2026-07-29: the `moves` command's `legalMoves()` costs 2.1–5.3 µs, ~19,000–47,000x under the 100 ms budget, so compute is not the risk. Keystroke echo and terminal I/O are the other half and stay `UNKNOWN - verify` — no prompt exists; verify by input-latency measurement once EPIC-003 is built. **THE `ABC-012` TURN COMPONENT IS MEASURED AND MET — added 2026-08-04 at `ABC-012`'s Security/NFR gate, where the ticket's five numeric bars were RE-MEASURED independently rather than inherited from the Engineer who built the module.** Own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**. Population named, because this file has learned that lesson: **one deterministic LCG game from the start position — the same LCG `src/history.test.ts:81-89` plays**, so a ply count means the same thing in the harness and in the suite. **ALL SIX BARS MET WITH ROOM, at 120 plies unless noted: `takeBack(h,2)` 2.46 / 2.45 µs against ≤ 5 µs (0.49x); `keyHistory` 40.16 / 40.20 µs against ≤ 60 µs (0.67x); `repetitionCounts` 44.35 / 44.45 µs against ≤ 75 µs (0.59x); `gameStatusOf` 47.75 / 47.59 µs against ≤ 75 µs (0.64x); `playMove` 8.6 / 8.2 ns against ≤ 100 ns (0.09x); `repetitionCounts` @ 300 plies 91.93 / 92.15 µs against ≤ 150 µs (0.61x).** Shape row, no bar: 17.57 / 17.48 µs @ 40 plies. **THE HEADLINE FOR THIS ROW: four derives at ~48 µs each is about 0.4% of the 50 ms turn budget — roughly 260 turns' worth of derives would be needed to spend one keystroke budget.** Compute is not the risk here either; **the unmeasured terminal-I/O half remains the whole risk on this row and no figure for it exists.** **TWO FENCES, both TESTED at that gate rather than restated.** (i) `gameStatusOf`'s margin over `repetitionCounts` **IS** the one `legalMoves` call inside `gameStatus` plus ~0.6 µs, and it is **POSITION-DEPENDENT to 1.4x** — 3.40 / 3.14 µs startpos-anchored against 4.55 / 4.49 µs kiwipete-anchored, matching bare `legalMoves` of 2.74 µs and 3.89–3.96 µs — **but the expensive-`legalMoves` anchor is CHEAPER OVERALL (41.89 / 42.25 µs), because the `O(plies)` derive dominates**, so the worst generator position is not the worst case for the composite. The arithmetic worst case over the observed extremes is ~49.0 µs = 0.65x of the 75 µs bar, and it is **labelled as arithmetic, not as a measurement**. (ii) The `takeBack` figure is an **upper bound** by construction (its two restoring `playMove` calls sit inside the timed region); measured with the restore **outside** the clock it reads **HIGHER**, 2.92 / 2.93 µs, because that variant pays cold-object cost — the restore's own contribution is ~0.017 µs, **below what the instrument can resolve**, so the bound is tight to within less than it can see and **the bar is MET on either framing**. **AN INSTRUMENT-LIMIT CORRECTION, the seventh this file has recorded, and it is recorded rather than buried because it would have produced a FALSE MISS:** the first `takeBack` cell called `legalMoves` **inside** the timed region and read **10.38 µs against the 5 µs bar — 2.08x, a MISS**; two generator calls at 2.7 µs each account for ~5.4 µs of it, the restoring moves are fixed across iterations, and hoisted out of the clock the cell reads 2.46 µs. **No number is claimed from the discarded instrument.** **WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED:** the four derives read 1–8% lower here, `takeBack` agrees to 0.4%, and **`playMove` is 1.5x apart (8.2–8.6 ns against the Engineer's 12.4–12.7 ns) — a difference this gate CANNOT attribute**, the Engineer's harness shape not being recorded in enough detail to reproduce; both are >7x under the bar, so it moves nothing. **Every bar is MET on two independently written harnesses. NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** — this project's standing rule; the microseconds live here, with their machine. **`NFR-003`'s target, its two clauses and its `UNKNOWN - verify` on the I/O half are byte-identical; nothing on this row moved.** |
| NFR-004 | Performance | Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty | Engine move search (EPIC-004) | `UNKNOWN - verify` — not built yet; verify by wall-clock over a fixed position suite. Depends on NFR-005 |
| NFR-005 | Performance | **Depth-in-budget on the standing benchmark positions `kiwipete` and `position-6`** — at default difficulty the search completes **≥ depth 6** within the 3 s budget and never exceeds the 5 s ceiling (**below depth 6 = FAIL**), and reaches **depth 7** within that same 3 s budget (**below depth 7 = WARN**; the depth-7 level is **PROVISIONAL** pending non-M3 measurement). Node rate is a **diagnostic, not the target** | Engine search loop (EPIC-004) | **Target ratified in ADR-0003 clause 2 AS AMENDED by Olger Oeselg on 2026-07-30** — amendments: named positions / two levels / provisional depth 7. Depth-in-budget on target hardware is `UNKNOWN - verify`, and **the provisional obligation has a home: EPIC-004's own timeboxed spike (RISK-002's mitigation) measures depth-in-budget on non-M3 target hardware, and that spike is the verification that LIFTS the PROVISIONAL marker from the depth-7 level.** Until it reports, a depth-7 miss on slower hardware may be the machine rather than a regression. Measured 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64 (ADR-0003; alpha-beta-shaped model at EBF 6, leaves evaluated not generated): `kiwipete` reaches **depth 7 in 0.39–0.68 s** and depth 8 inside the 5 s ceiling at leaf-eval costs 134 ns–1,097 ns; `position-6` reaches **depth 7 in 0.644 s** at 1,097 ns — both levels clear on this machine. **Node rate DEMOTED to a diagnostic (not deleted), each figure carrying its node definition, position and machine:** **163k–351k/sec** — ABC-008 metric B (every node, leaves included, calls `legalMoves()`), kiwipete d3/d4 + startpos d4, M3, 2026-07-29; **207k/sec kiwipete, 546k/sec startpos** — same metric B by the reciprocal of one `legalMoves` call, M3, 2026-07-30; historical proxy **2,639,455/sec** — the ABC-008 spike, **no legality filtering at all**, M3: a proxy for the engine, never a measurement of it. **The old ≥ 500,000 nodes/sec target is RETIRED** as underived and untestable — the same merged code measures 207k–6.1M/sec on the node definition alone. **PER-NODE KEY COST, added 2026-08-02 at `ABC-011`'s design hop — the target did NOT move and no benchmark of the search was run (none exists).** `ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a `zobristKey` **per node**, so the key's cost is the one component of a search node this catalog can price before a search exists. `ABC-011`'s design hop ruled that the en-passant component enters the key only when a **legal** ep capture exists, which puts a legality question inside that function, and measured the consequence against merged `src/` with a prototype **outside the repo** (Apple M3 / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on any other hardware; interleaved forward and backward against merged code in the same process): **1.014–1.022x per node amortized** over a 120,000-node pool collected from the `src/perft.test.ts` table at its natural en-passant frequency, **1.00–1.07x at `kiwipete` and startpos** — the two positions this row's depth-in-budget target is anchored on, **both of which carry no ep square** — and **1.45–1.48x** on the 1.87% of pooled nodes where an ep capture is actually available. Allocation **+2.3 B/call confined to that same shape**, against the ~5 B/call of `bigint` intermediates merged `zobristKey` already allocates. **The rejected implementation shape is the one to keep out: computing availability via `legalMoves` measures 1.979x per node amortized and breaks `ABC-011`'s 1.5x bar outright.** Under depth-in-budget a cheaper node buys depth, so this is 1.4–2.2% of per-node cost spent on a key that means what FIDE 9.2.3 says — **the denominator is the pooled node population described above, not a search's node distribution**, which is `UNKNOWN - verify` until `EPIC-004` exists **MEASURED AND MET AT `ABC-011`'s SECURITY/NFR GATE 2026-08-02/03 — the per-node key cost above is discharged with independent figures, and NO TARGET MOVED.** The design hop's numbers were re-measured rather than inherited, with this gate's own scripts and its own `git archive` baseline of `4c6ed7d`: both trees imported in ONE process, 300,000 iterations per cell after a 50,000 warm-up, every cell interleaved forward AND backward, two samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64** and `UNKNOWN - verify` on any other hardware. **`zobristKey` at the two positions this row's depth-in-budget target is anchored on, both of which carry no ep square: startpos 297.2–298.4 ns against a 1.5x bar of ~450 ns, and kiwipete 323.5–330.9 ns against a 1.5x bar of 432–459 ns — BOTH MET WITH ROOM.** Worst-case per-call shape (ep square set AND a legal capture available) **1.385–1.400x**, inside the 1.5x bar; the sparse divergence FEN 1.759–1.766x, which is not a bar position and whose absolute cost (261 ns) is *below* this row's own anchor value. **The three-run spread is resolved rather than left open:** the gate's 1.385–1.400x lands BETWEEN the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x, so three independently written runs agree on the shape. **DENOMINATOR CORRECTION, and it is the fourth time this file has had to make one of this class — the sub-bar is a CALL-COUNT bar, not a timing bar.** `ABC-011`'s `NFR-005` trigger says the no-ep-square path is *"not made slower at all"*. **No wall-clock measurement can settle "at all"**: this gate's own timings put the shipped tree at 1.003–1.007x of baseline on a no-ep position, which is inside noise in both directions and is therefore evidence of nothing. The claim is **structural** — on a no-ep node `position.epSquare !== NO_SQUARE` is false, the `&&` short-circuits, and the executed work is byte-for-byte what the pre-`ABC-011` tree executed — and the only instrument that can FAIL it is a spied call count. Measured that way over a depth-3 walk of all six perft roots: **277,955 nodes hashed, 17,663 carrying an ep square, 17,663 predicate calls, ZERO on the 260,292 no-ep nodes, never more than one per call** — reproduced identically by the Engineer and by this gate on separate scripts. **A measurement is not a guard, and this row has now learned that twice: `src/zobrist.nfr.test.ts` (added 2026-08-03 at the gate) pins the sub-bar as spied assertions**, exactly as `src/gameend.nfr.test.ts` pins NFR-001's three bars. It was written because three mutations of the shipped code — reordering the guard, dropping the guard, and deleting the predicate's own `NO_SQUARE` early return — are behaviour-EQUIVALENT (they change no key on any input) and each left all 189 tests green, so no assertion about a returned key could ever fail them; each now fails an assertion in that file, and each was proven to fail rather than assumed to. **As in `gameend.nfr.test.ts`, NO wall-clock assertion belongs in the suite** — it would be a test that passes or fails on the machine that runs it; the nanoseconds live here, with their machine. **Allocation and the 1.014–1.022x amortized row above were NOT re-measured at this gate** and remain the design hop's, `UNKNOWN - verify` on other hardware; the amortized denominator is still the pooled perft population and NOT a search's node distribution, which stays `UNKNOWN - verify` until `EPIC-004` exists. **THE SECOND DESIGN HOP'S FIX COSTS NOTHING HERE — added 2026-08-03, and NO TARGET MOVED.** `ABC-011` re-entered `In Design` to rule a defect fix, and the ruled fix adds two board-read guard conditions inside `hasLegalEnPassant`. **Zero on the no-ep path and at both anchor positions, structurally rather than by timing:** the caller's `epSquare !== NO_SQUARE` short-circuit never enters the predicate, so the call-count sub-bar above and `src/zobrist.nfr.test.ts`'s zero-call assertion are untouched by construction — the guards live in the callee. Measured on the predicate in isolation, 2,000,000 iterations per cell, interleaved (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere): **+0.9 to +3.0 ns per call** on the 15.70% of nodes carrying an ep square = **≤ +0.5 ns amortized per node**, under **0.15%** of a ~317 ns key; and **20–27x cheaper** (5 ns against 111–134 ns) on the invalid-FEN class the fix exists for, where the guard returns before the make/unmake. **The instrument's own limit is stated rather than hidden, the fifth time this file has had to:** two whole-key benchmark runs put the amortized ratio at 0.9815–0.9948 and 1.0383–1.0454, bracketing 1.0 from both sides, so a whole-key run **cannot resolve** a sub-0.15% delta and no number is claimed from it — the isolated figures are the claim. **These are a design hop's numbers, not a gate's: Security/NFR re-gates after the fix lands and owns the verdict.** **RE-GATED AND MET AT `ABC-011`'s SECOND SECURITY/NFR GATE 2026-08-03 — the fix's cost is discharged with this gate's own figures, NO TARGET MOVED, and the design hop's per-cell point estimates are NOT confirmed.** Re-measured independently: **FOUR trees imported in ONE process — merged `4c6ed7d`, pre-guard `584defa`, shipped, and a BYTE-IDENTICAL TWIN of the shipped tree as a NULL CONTROL BY IDENTITY** — 15 rounds × 100,000 iterations per cell with rotated tree AND cell order and medians, two full samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **BOTH BAR POSITIONS MET WITH ROOM: startpos 296.8–299.3 ns against the ~450 ns bar (1.004–1.008x of merged), kiwipete 304.7–307.4 ns against the 432–459 ns bar (0.993–0.999x of merged).** **The CALL-COUNT sub-bar is MET and re-verified on this gate's own spy — a copy of `zobrist.ts` whose body differs from the shipped file by ONE import specifier and nothing else, over a walk whose roots and depths were read out of `src/perft.test.ts` rather than recalled: 518,474 nodes hashed, 81,397 carrying an ep square (15.70%), 81,397 predicate calls, ZERO on the 437,077 no-ep nodes, never more than one per call, and `zobristKey` pure at every node.** Reproduced to the node. **THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST AND NO NUMBER IS CLAIMED FROM IT — the sixth instrument-limit correction this file has had to record, and the reason the correction is trustworthy this time is that an identity twin caught it rather than an argument.** Every shipped-minus-pre-guard whole-key delta sits inside the twin's own per-cell band, and the deltas **flip sign between this gate's two samples** (startpos −0.69 then −3.24 ns; kiwipete −1.54 then −7.25 ns). Measured instead on the predicate in isolation, in a process that does nothing else — no Proxy probe, no equivalence sweep, both of which are known on this ticket to poison inline caches — 21 rounds × 500,000 iterations, where the identity twin reads ±0.04 ns on the tight cells: the guards cost **about +0.9 ns** on the ep-set/no-capture shape = **≤ +0.15 ns amortized per node** at the measured 15.70% ep frequency, about **0.05%** of a ~305 ns key; **below resolution** on the shapes where a capture exists; and **23x cheaper (123.4 → 5.4 ns)** on the invalid-FEN class the guards exist for. **That is consistent with the Engineer's ≤ +0.41 ns and the design hop's ≤ +0.5 ns ceilings and it does NOT confirm their per-cell point estimates** — on the two cells where the design hop claims +2.4/+2.6 ns this gate's own reading is negative and inside the twin's band, which is evidence of nothing rather than evidence against. **THE WORST-CASE EP SHAPE IS PROTOCOL-SENSITIVE AND NOBODY SHOULD CALL IT SETTLED:** this gate reads **1.401–1.412x**, the first Security/NFR gate read 1.385–1.400x, and a third protocol on this ticket read 1.446–1.458x. Three protocols, three answers inside about **±4%**. **The bar is unaffected — it is anchored at kiwipete/startpos, both at 0.993–1.008x, and the worst-case ep shape is not a bar position** — but this row explicitly does NOT claim that spread is resolved. **TWO BEHAVIOUR-EQUIVALENT COST MUTANTS ARE DELIBERATELY NOT PINNED, and the decision is recorded with its reason rather than left silent:** deleting `hasLegalEnPassant`'s own `NO_SQUARE` early return, and moving both guards inside the `EP_CAPTURE_SIDES` loop. Both survive all 214 tests (verified by running them) and were proved equivalent here over **83,400** inputs (0 answer, 0 key, 0 purity differences). **No spied call count distinguishes either — 0 of 9 call shapes, at the predicate AND through `zobristKey`** (`makeMove`, `unmakeMove` and `isSquareAttackedBy` identical everywhere) — so the instrument `src/zobrist.nfr.test.ts` exists for cannot be pointed at them. **The early-return deletion costs STRUCTURALLY ZERO in production, because `zobristKey` is the ONLY production caller of the predicate and its `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters the callee** — a stronger statement than any nanosecond figure, and the reason no nanosecond figure is quoted for it. **A per-call figure was in fact WITHDRAWN here as unsupportable:** a "+1.6 ns" estimate for the direct no-ep call does not survive its own null control, because this gate's benchmark reads **+0.9 to +2.9 ns on cells where that deletion's delta is STRUCTURALLY ZERO** (an ep square is set, so the deleted branch is never taken) — the cross-tree systematic floor is the same size as the signal. **The only instrument that CAN see these two mutants is a Proxy counting board-index reads, and this gate measured that instrument to be unusable on this code:** a Proxy over the `Uint8Array` board **throws outright** — `TypeError: this is not a typed array`, from `kingSquareOf`'s `board.indexOf` — so it does not even run without a function-binding shim; shimmed it costs **11.1–13.6x**, and its mere presence in the same process inflates the **un-instrumented** readings by **2.0–3.0x**. An instrument that destroys what it measures cannot found a budget assertion. **Owner: Security/NFR at `EPIC-004`**, when a search exists and a per-node budget makes 0.05% worth an assertion. **A CAUTION FOR WHOEVER BENCHMARKS THIS REPO NEXT, since this is the fourth protocol on `ABC-011` to hit the same wall: carry a BYTE-IDENTICAL TWIN as a null control by identity, give the timing run a process of its own, and check the reading on a cell where the delta is structurally zero before believing the reading on the cell you care about.** **The depth-in-budget target, both levels, the PROVISIONAL marker on depth 7, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched.** The amortized row was NOT re-derived here — three prior runs agree and a fourth buys nothing this gate needs; its denominator is still the pooled perft population and NOT a search's node distribution, `UNKNOWN - verify` until `EPIC-004` exists. |
| NFR-006 | Cost | Compiled opening book stays **≤ 1 MB** (no published-package bloat) | Opening book artifact (EPIC-005) | `UNKNOWN - verify` — not built yet; verify by compiled artifact size check at build |
| NFR-007 | Performance | `npx` invocation to first rendered board in **< 2 s** with a warm npm cache | CLI cold start / packaging (EPIC-006) | `UNKNOWN - verify` — not built yet; verify by timed `npx` end-to-end run |

## NFR-002 — what a "full board redraw" is, and what its denominator is (~~the ply count~~ the window, CORRECTED 2026-07-30)

_Added 2026-07-30 by Architect/Design during EPIC-002's decomposition. **The < 16 ms target did not
change** — it is still the number EPIC-002 states. What changed is that the row now says what is
being measured, so it can be failed._

> **READ THE CORRECTION BLOCK AT THE END OF THIS SECTION FIRST.** Everything between here and it was
> written against an **unbounded** history panel that EPIC-002 no longer ships. It is kept as
> history, exactly as NFR-005's withdrawn "~5x headroom" is. **The denominator is now the window,
> not the ply count. The target is untouched.**

The row was seeded honestly as `UNKNOWN - verify` on 2026-07-24 with "verify by render benchmark
over known FENs". That instruction is not sufficient, for the same reason NFR-005's
"in a middlegame position" was not: **a frame's cost is not a function of the position alone.**
EPIC-002's frame includes a two-column SAN move-history panel, and the design that serves it
(ADR-0002 clause 2, ratified: the move list is the authority and everything else is derived by
replay) makes that panel **O(plies)** while the budget stays fixed at 16 ms. A benchmark over known
FENs at ply 0 would measure the cheapest frame the game ever draws and would still read green after
the panel had eaten the budget at move 60.

So the row names three things it did not name before:

- **What is in the frame.** Board + labels + status panel + move-history panel. If the renderer
  ships something else in a frame, this row is what it must be re-measured against.
- **The ply counts.** **40 / 120 / 300** — an opening, a typical complete game, and a long one. The
  same three on every re-measurement, or the numbers are not comparable.
- **The two halves.** Compute and terminal write. Only compute can be measured before a renderer
  exists; the write half is `UNKNOWN - verify` and is named so it cannot be quietly forgotten — the
  same split NFR-003 already carries for keystroke echo.

**What is measured today, and what it is not.** 171–176 µs / 517–533 µs / 1,272–1,318 µs at
40 / 120 / 300 plies is the **SAN move-history derive alone**: replay the move list from the initial
FEN and format every ply, which costs one `legalMoves` call per ply (~97% of it) plus ~100 ns of
string work. Two runs, Apple M3, Node v24.12.0, darwin/arm64, read-only harness outside the repo
against merged `src/`. **It is not a frame measurement** — no renderer exists, and the board scan,
the status panel and every byte written to the terminal are not in it. It is a lower bound on the
frame, and it is the largest item known to be in it. `UNKNOWN - verify` on any other hardware.

### CORRECTED 2026-07-30 (same day, second edit) — the denominator is the WINDOW, not the ply count

*(Everything above in this section is kept as history. It is not wrong about the code it measured;
it is wrong about the frame that will be built.)*

**The < 16 ms target is untouched.** BA/PM ruled during the same decomposition — epic amendment
`[A2]`, acceptance `4a`–`4d` — that the live move-history pane is **bounded to the most recent 8
move pairs, blank-padded**, and that the frame is a **session-constant height**. That is a product
ruling, it is made, and it is not reopened here. It changed the frame's **growth characteristic**,
not its latency budget. BA/PM flagged this row rather than editing it because the row is
Architect/Design's; this block is the fix.

**Three things changed; four did not.**

- **Changed — the growth characteristic.** The panel is no longer `O(plies)`. It renders a fixed
  **16 plies** (8 pairs) at any game length, so the frame's dominant term is `O(window)`. The
  arithmetic that forced the bound was never about cost at all — it was the viewport: ~16 fixed rows
  on a 24-row terminal leave ~8 for history, so an unbounded pane overflows at about **move 9** and
  the redraw criterion becomes undefined, not merely slow.
- **Changed — which number is on record.** The 171–1,318 µs figures measure the **unbounded**
  full-history derive. They are kept above and in the row, relabelled as history and as an **upper
  bound**, because they still bound any bounded pane from above and because the per-item figures
  underneath them (`toSan` at 4.31–4.45 µs unassisted, 0.10–0.11 µs when handed a legal list;
  replay at 2.2–3.9 µs) are unaffected by the ruling and are what every remaining estimate rests on.
- **Changed — the write half got easier to state.** `4a` makes the frame a constant row count (23 in
  the reference layout), so the unmeasured write half has **no ply denominator at all**. It is still
  `UNKNOWN - verify`; it is now a single number per machine and sink rather than a curve.
- **Unchanged — the target, the frame's two halves, the three ply counts 40 / 120 / 300, and the
  requirement that every figure carry its position/definition/machine.**

**Why the ply count stays on every measurement even though it no longer drives the cost.** Two
reasons, and neither is ceremony. First, the pane must still **replay from `initialFen` to the
window's first ply** — `GameHistory` holds `initialFen` + `moves` + the live position and nothing
else, so there is no O(1) way to reach the position before ply *n−16*. That replay is `O(plies)`:
one `parseFen` at 1.62 µs plus ~10 ns per ply, measured near-flat at **2.2–3.9 µs from 40 to 300
plies**. Small, real, and linear. Second, `O(window)` is now a **claim under test**. A single
measurement at one ply count cannot falsify it; the 40 / 120 / 300 comparison can, which is why
`ABC-017` asserts a **ratio** (the three within 2x) alongside its absolute bar — the ratio is
machine-independent and the absolute is not.

**The boundary condition of the `O(window)` statement, stated so it cannot be silently broken.**
`gameStatus` fed by `repetitionCounts` is `O(plies)` — **46–50 µs @ 120 plies, 97–102 µs @ 300** —
and it is the largest length-dependent quantity anywhere near this frame. The decomposition puts it
in the **loop** (`ABC-019`), not in a frame: `ABC-016`'s status panel calls `isInCheck` directly and
reports check, not game over. **If a renderer ever computes the repetition counts per frame, the
frame is `O(plies)` again and the correction above is void.** That is the one change that would
require rewriting this row a third time.

**MEASURED AGAINST REAL CODE 2026-08-04 at `ABC-012`'s Security/NFR gate — the boundary condition is
UNCHANGED, the target is UNCHANGED, and the figures above stop being a prototype's.** The 46–50 µs /
97–102 µs quoted in this paragraph and in the row were **wave-1 prototype figures, taken before
`src/history.ts` existed**. The module now exists and the quantity was measured on it, independently
of the Engineer who built it: **`repetitionCounts` 44.35 / 44.45 µs @ 120 plies and 91.93 / 92.15 µs
@ 300 plies; `gameStatusOf` (the whole `gameStatus` + counts composite this paragraph is about)
47.75 / 47.59 µs @ 120 plies.** Own harness outside the repository, its own process, a discarded
warm-up round, 11 rounds with the cell order rotated every round, medians of per-round means, two
fully independent samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and
**`UNKNOWN - verify` on any other hardware**. **The prototype's figures were good: the real code lands
inside the band this paragraph already quoted, 1–8% below it.**

**Growth is linear with a constant offset — 17.5 / 44.4 / 92.0 µs at 40 / 120 / 300 plies** — which is
the `O(plies)` this paragraph asserts, now measured at the three ply counts this row itself mandates
rather than inferred from two.

**Two fences travel with the `gameStatusOf` figure and neither may be dropped when it is quoted.**
First, **the composite's margin over the bare derive is ONE `legalMoves` call plus ~0.6 µs, and it
swings 1.4x on position alone** — 3.40 / 3.14 µs on a startpos-anchored line against 4.55 / 4.49 µs
on a kiwipete-anchored one, matching bare `legalMoves` of 2.74 µs and 3.89–3.96 µs at those
positions, exactly the position-dependence `NFR-001` already records. Second, and against
expectation, **the expensive-`legalMoves` anchor is CHEAPER OVERALL — 41.89 / 42.25 µs against
47.75 / 47.59 µs — because on this composite the `O(plies)` derive dominates and that line's replay
is cheaper by more than its generator call is dearer.** So the worst `legalMoves` position is **not**
the worst case for this quantity, and anyone bounding it from `NFR-001`'s middlegame figure alone will
get the sign of the effect wrong.

**`ABC-012` did NOT put this in a frame and this row's `O(window)` statement stands untouched.**
Verified structurally at the gate rather than assumed: **`src/history.ts` has ZERO importers** — no
renderer, no panel and no other module calls `repetitionCounts` or `gameStatusOf` anywhere in `src/`.
The quantity is still the loop's (`ABC-019`'s), exactly where the decomposition put it.

**A CAUTION FOR WHOEVER MEASURES THIS QUANTITY NEXT, because this gate hit it and it is the seventh
instrument-limit correction this file has had to record.** The first `takeBack` cell built here called
`legalMoves` **inside the timed region** and read **10.38 µs against a 5 µs bar — a 2.08x FALSE
MISS**; two generator calls at 2.7 µs each accounted for ~5.4 µs of it. **No number was claimed from
it.** Anything that composes `legalMoves` with a replay will do this: hoist every generator call out
of the clock, or the instrument measures the generator and reports it as the composite.

**Not an optimization anyone should reach for:** the 40x cheaper `toSan(position, move, legal)` path
does not help the pane, which has no legal list in hand and would have to compute the same
`legalMoves` call to obtain one. ~70 µs is the honest price of 16 rendered plies, not a lazy
implementation.

**What is `UNKNOWN - verify`, and what would close each one.** Nothing in the frame as it will be
built has been measured, because none of it exists.

| Unknown | What would measure it |
|---|---|
| **Bounded pane compute** (BA/PM's ≈ 70–75 µs is arithmetic over wave 1's per-item figures — a target, not a result) | `ABC-017`'s cost test at 40 / 120 / 300 plies: ≤ 150 µs absolute **and** the three within 2x. Gated on `ABC-013` (`toSan`), itself blocked on `ADR-0004`'s ratification |
| ~~**Board-scan compute**~~ — **CLOSED 2026-08-07 at `ABC-014`'s Security/NFR gate. MET: worst cell 2.092 / 2.056 µs against the ≤ 500 µs bar (0.0042x, ~240x headroom)** over all 24 cells of 6 standing perft FENs × 2 modes × 2 orientations, two independent samples, Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere. The fully-occupied 64-piece board — the module's true worst case, **not in the bar's population** — reads 2.322 / 2.342 µs, still 0.0047x | `ABC-014`, over the standing perft FENs; bar ≤ 500 µs. **Done.** The measurement, its method, its machine and its two fences are in the `NFR-002` row above |
| **Status-panel compute** | `ABC-016`; bar ≤ 250 µs |
| **Frame assembly + the WRITE half** — the half nobody has measured | `ABC-018`, against a non-TTY sink, recorded with its machine. **No number for terminal write time may be quoted from any note in this task; none exists** |
| **Any non-M3 machine, any other Node version** | Unchanged by this correction and still open |

**No number in this correction was measured today.** Every figure quoted here is transcribed from
wave 1's measurement note (Apple M3, Node v24.12.0, darwin/arm64, two runs, read-only harness outside
the repo against merged `src/`). A harness run today would have measured the same superseded
quantities, since the bounded pane depends on a `toSan` that is not yet permitted to exist.

## Notes on the measured rows (NFR-001, NFR-003, NFR-005)

Seeded 2026-07-24. Every target above is transcribed from its epic's stated `NFR triggers`
block — no number here was invented by the Architect. Five of the seven rows were seeded
`UNKNOWN - verify` honestly: their epics were not built yet, so there was nothing to measure.
The 2026-07-29 architecture audit changed three of them: NFR-001 re-measured and still met,
NFR-003 became half-measurable, and NFR-005 became measurable and was missed against the
≥ 500,000 nodes/sec target that a human retired on 2026-07-30 (see the ratification block below).

**Do not read the raw perft figure as engine throughput — NFR-001 and NFR-005 count different
denominators.** Classic perft counts leaf nodes that return without generating or evaluating
anything; ABC-008 estimated that at ~96% and it measured 2026-07-29 at **97.3%** of the nodes
`npm run perft` counts. Strip those free leaves out and the same CPU-seconds yield ~167k
generating nodes/sec. So NFR-001's ~6.1M is a valid *generation-with-free-leaves* measurement
and **NFR-001 is genuinely MET, ~6x over target** — it is simply not a promise about search,
and it must never be quoted as evidence for NFR-005.

### NFR-001's `gameStatus` half — the three bars, MET 2026-08-01, and what each one's denominator is

_Added 2026-08-01 by Security/NFR at ABC-020's gate. The bars were seeded `UNKNOWN - verify` on
2026-07-31 with their owner named (ABC-020 acceptance A10); this discharges them. **No target
moved.** Measured on **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64**, `UNKNOWN - verify` on
any other hardware._

| Bar | Denominator — what is being counted, on what | Measured |
|---|---|---|
| `legalMoves` calls per `gameStatus` — **exactly 1** | one `gameStatus` call, spied at the `legal.ts` entry, over 16 call shapes | **1**, every shape |
| `zobristKey` calls per `gameStatus` — **at most 1** | the same, spied at the `zobrist.ts` entry | **1** when the counts map is consulted; **0** bare, and **0** when a cheaper branch decides |
| cost — within **1.5x of 2.52 µs** (≤ 3.78 µs) | **`gameStatus(startpos, emptyMap)`** — the start position, parsed, with an empty `Map`; mean over 200,000 calls after a 50,000 warm-up | **2.13–2.26 µs** = 0.56x–0.60x of the bar |

**Three things about these numbers that are easy to get wrong.**

- **The µs bar has a position on it.** `gameStatus` is dominated by its one `legalMoves` call, and
  that call costs 2.1 µs at startpos and 3.2 µs in a middlegame. `gameStatus(kiwipete, emptyMap)`
  measures **5.30–5.47 µs on this branch and 5.29–5.85 µs on the pre-ABC-020 tree** — over the
  3.78 µs figure on *both*, which would indict the baseline rather than any change. Read as an
  absolute ceiling the bar is meaningless; read against `startpos` it is exactly what it says.
  The machine-independent quantity is the **ratio to the same position on the baseline tree**
  (measured 0.94–1.01 across startpos, bare startpos and kiwipete). Same lesson as NFR-005's
  "in a middlegame position" and NFR-002's ply count — third time, so it is written down here.
- **The call-count bars are machine-independent and the µs bar is not.** That is why
  `src/gameend.nfr.test.ts` asserts call counts only. **No wall-clock assertion belongs in the
  suite**: it would be a test that passes or fails on the machine that runs it.
- **A measurement is not a guard.** Before 2026-08-01 all three bars were held by nothing in the
  repo: a second `legalMoves()` call, a doubled `zobristKey` read, and the 150-ply check moved
  below the fivefold check each left `src/gameend.test.ts` 45/45 green. Each now fails one
  assertion in `src/gameend.nfr.test.ts`.

**CORRECTED 2026-07-29 — NFR-005's "~5x headroom" is withdrawn. The constraint is not.**
*(Kept as history. Its measurements and its withdrawal stand; only the ≥ 500k **target** they were
measured against was retired on 2026-07-30 — see the ratification block below.)*
The seeded row read ABC-008 metric B = **2,639,455 nodes/sec** as "above target with ~5x
headroom". That figure stands above as history and is real, but it measured a **throwaway
spike benchmark with no legality filtering** — a proxy for the engine, not a measurement of
it. Re-running the spike's own metric-B definition against the **merged** generator gives
**163k–351k nodes/sec**: 7.5x–16x below the proxy, below the 500k target, and measured with
**no evaluation, move ordering, transposition table or quiescence running at all**. NFR-005 *then*
asked for 500k *with* evaluation; the code was below 500k *before* evaluation exists — a
**1.4x–3.1x shortfall**, not a margin.

- **Survives:** **RISK-002 = GO WITH CONSTRAINT**, and EPIC-004's per-move budget **must be
  time-based (iterative deepening against a wall clock), not depth-based** — a fixed depth
  would blow NFR-004's 3-second ceiling on exactly the machines least able to absorb it.
  Inherited by EPIC-004 as non-negotiable. The measurement **strengthens** this: the
  worst-case-slow-machine scenario the constraint hedged against has arrived on the fast
  machine.
- **Withdrawn:** the "~5x headroom" clause and the arithmetic under it (~3x for real legality
  filtering, ~3x for slower hardware, landing near ~300k). The first factor is measured at
  7.5x–16x, not 3x; the second is still unvalidated.
- **Why pruning does not close the gap.** ABC-008 netted "no alpha-beta, no TT, no move
  ordering" against its other biases as if it bought back a large multiple. For a **rate**
  metric it does not: pruning, a transposition table and move ordering reduce the **number of
  nodes needed** to reach a depth, they do not make a node cheaper — every node still pays
  generation. That is real relief for **NFR-004** (wall clock to a move) and close to none for
  **NFR-005** (nodes/sec). About 71% of per-node cost is the make/test/unmake legality filter
  in `src/legal.ts`, so closing this gap means changing how legality is decided, not tuning.
  That decision was **open and unmade** on 2026-07-29 — `src/legal.ts` deferred it to "the EPIC-004
  spike". It is now **taken**: `ADR-0003`, ratified 2026-07-30, keeps make/test/unmake and changes
  the target instead, with an ordered menu of speedups and a named trigger if the depth floor is
  ever missed.

**RATIFIED 2026-07-30 — the target is depth-in-budget on named positions; the node rate is a
diagnostic.** `memory-bank/50-decisions/ADR-0003-legality-strategy.md` was ratified by **Olger
Oeselg** on 2026-07-30. Clause 1 (keep make/test/unmake — no code change) and clause 3 (named
trigger plus an ordered menu of speedups, authorizing none) were accepted as proposed; **clause 2 was
accepted only as amended**. The row above is written to the amended clause 2, not to the draft.

- **Why the ≥ 500k target went.** It came from the ABC-008 spike, which ran **no legality filtering
  at all**, so it never measured this code. And "nodes/sec" is undefined until you say what a node
  does: the same merged code measures **207k/sec** (metric B, kiwipete) to **~6.1M/sec** (classic
  perft) — a **30x spread with no code change** — and under metric B startpos passes 500k while
  kiwipete does not. A target a *position* can pass or fail with no code changing is not testable.
- **Why depth instead of rate.** NFR-004 is the real requirement, and RISK-002 already binds
  EPIC-004 to time-based iterative deepening, which returns the best move found so far when the
  clock runs out — so the 3 s budget **cannot** be blown by a slow node rate. The rate buys
  **depth** (strength), not latency. Derived the other way (EBF 6, ID overhead 1.2x, quiescence
  2.5x, 3 s budget): depth 6 needs **~47k/sec**, depth 7 **~280k/sec**, depth 8 **~1.68M/sec**.
- **Amendment (2a) — the positions are named.** The draft target said "in a middlegame position",
  which is the same vagueness this whole correction exists to remove. `kiwipete` and `position-6` are
  the standing benchmark set — the positions ADR-0003 measured, both already carrying published perft
  counts in `src/perft.test.ts`. Re-measure on those two, or the numbers are not comparable.
- **Amendment (2b) — two levels, floor 6 FAIL / target 7 WARN.** Depth 6 needs only ~47k/sec against
  a measured 207k–546k, so a depth-6-only gate would still read green after a **4x regression**.
  Depth 7 (~280k/sec) is where the code actually sits, so that is the level which detects one. The
  floor is the FAIL because NFR-004's promise and the 1400–1700 strength target rest on it; depth 7
  is a WARN because missing it means materially slower without a broken promise yet.
- **Amendment (2c) — the depth-7 level is PROVISIONAL; the depth-6 floor is not.** Every number is
  one machine, one Node version, and the spike's 2–3x slower-hardware factor has never been
  validated on a non-M3 machine — the largest single unknown. A 3x slower machine still clears depth
  6 by ~1.5x and loses **precisely depth 7**. EPIC-004's own spike on target hardware is the named
  verification that lifts the marker; it is recorded in the row's `Verified by` so it cannot be lost.
- **Unchanged by the ratification.** **RISK-002 = GO WITH CONSTRAINT** and time-based iterative
  deepening stay non-negotiable for EPIC-004. The NFR-001 denominator fence stands. Pruning still
  does not make a node cheaper. And EPIC-004's puzzle suite and self-play ladder remain the only real
  verdict on strength — depth-in-budget is a leading indicator, not proof of strength.

**Definitions behind the two numbers, so they are not confused again.**

- NFR-001 `6.04M–6.21M/sec` — `npm run perft`: classic perft, a depth-0 leaf returns 1 without
  generating. Five runs, Apple M3, Node v24.12.0, darwin/arm64.
- NFR-005 **diagnostic** `163k–351k/sec` — ABC-008 **metric B**: a recursive make/unmake walk in which
  **every** node, leaves included, calls `legalMoves()`. Measured 2026-07-29 at 163,042/sec
  (kiwipete d3), 186,843/sec (kiwipete d4), 346,449/sec (startpos d4); reached independently
  by two agents on the same day, once by this walk and once by microbenchmarking `legalMoves`
  (≈189k/sec at kiwipete). The probes ran read-only outside the repo against merged `src/` and
  are not repo artifacts.
- Both are **one machine, one Node version**. `UNKNOWN - verify` on any other hardware — the
  spike's 2–3x slower-hardware factor has never been validated against a non-M3 machine.

**Not covered here.** Throughput is necessary for the ~1400-1700 Elo strength target, not
sufficient — Elo comes from evaluation quality and move ordering too. RISK-003 (strength is
hard to verify without a reference opponent) is untouched and remains open.

## Availability — why this catalog has NO availability row, and what would create one

_Added 2026-08-06 by Security/NFR (task `refinement-deploy-posture-2026-08-06`, subtask
`security-nfr-availability-bar`) under the owner's standing directive of 2026-08-03
(`memory-bank/60-progress.md` § "Standing directive — who decides"), which sends **risk, security and
NFR bars** to this role. **No existing row, figure, denominator or `UNKNOWN - verify` marker was
touched by this edit.**_

**The instruction this hangs off, quoted rather than paraphrased.** Project owner Olger Oeselg,
2026-08-06: *"this project currently does not deploy anywhere, mark that as well, it will be used
locally for now."* **"currently" and "for now" are load-bearing** and are honoured: this is present
posture, explicitly revisitable. Nothing below deletes machinery for ever having an availability bar;
what it removes is the **claim** that one exists today.

### The ruling

`.grugops/factory.config.json` carried `nfr.availability: "99.9%"`. **That is not a bar on this
project, and it is not one that has been missed — it is one that could never have been failed.** The
key now reads `"not-applicable-local-only (nothing is ever up; ruling in plans/nfr-catalog.md)"`.

An availability SLO is a statement that **a service is reachable over a measurement window**. It
needs three things, and this project has none of them. Each was checked here rather than inherited
from the Architect's hop:

| What an SLO needs | What is actually here | How it was checked |
|---|---|---|
| **Something that is "up" between uses** | Nothing. `package.json` is `"private": true` with **no `bin`, no `main`, no `exports`, no `start`**; `src/` is ten modules with **no entry point**; nothing opens a socket, listens, serves, sets a timer or installs a signal handler | read `package.json`; `ls src/`; grepped `src/` for `listen(`, `createServer`, `http`, `net.`, `socket`, `express`, `fastify`, `setInterval`, `process.on`, `ws://` — **zero code matches** (six hits, all English prose in comments) |
| **An observer that could find it unreachable** | Nobody. **No git remote** at all, **no CI** (`.github/` holds one file and no `workflows/`), **zero release records** under `plans/releases/` | `git remote -v` → empty; the Architect's row 2/5 of `…-observation-c9b5e699`, re-checked |
| **A window and a denominator** | None exists. *99.9% of what, over what period, missed by whom?* — no answer, and **none was invented** | there is nothing to run the question against |

**"Not measurable" is a stronger statement than "not measured", and this file keeps them apart.**
`UNKNOWN - verify` on `NFR-002`'s write half, `NFR-004`, `NFR-006`, `NFR-007` and `NFR-005`'s
non-M3 obligation means *the quantity exists, an instrument is nameable, and nobody has run it yet*.
Availability is not that: **there is no quantity and no instrument that could fail it.** This file has
recorded **seven instrument-limit corrections**, every one of them refusing a number its instrument
could not resolve. The same standard applied to a bar with **no instrument at all** retires the bar
rather than measuring it.

**The bar was never in this catalog in the first place.** Before today the word "availability"
appeared in this file exactly once — in the FORMAT comment's list of *categories to consider*. Every
other number this project holds itself to has a row here carrying its denominator, its position and
its machine. `99.9%` had none of those and lived in exactly one place, `.grugops/factory.config.json`.
**It is a bootstrap default that was never adopted, not a commitment anyone in this project made.**

### The key's contract, verified BEFORE the edit

The Orchestrator's decision note said this verification was owed and must not be assumed. It was
performed against the kit's own `agent-factory/config/factory.config.md` before the file was written:

| key | contract as documented | verdict |
|---|---|---|
| `nfr.availability` | `nfr` sub-field table: default `99.9%`, meaning *"Availability target."* — **no allowed-value set**, and the key is **not** among the nine dials in the "Config-dial contract" table | **free-form string; it CAN honestly carry this ruling** |

- **Who reads it:** grepping the whole kit for `availability` finds the config reference, the seed
  catalog's category list, and three ASVS checklist rows — `V15.1.3`, `V15.2.2` (both **L2**) and
  `V16.5.4` (**L3**). This project runs `security.asvs_level: L1`, where the cumulative filter admits
  **zero** availability requirements. **No workflow, no role and no checklist reads `nfr.availability`
  by name.**
- **Nothing parses it:** this install has no `scripts/` directory, so the value is read as prose and
  no value shape can break a consumer.
- **After the edit:** `node -e "require('./.grugops/factory.config.json')"` parses OK, the diff is
  **exactly one line**, and **`production_requires_human_confirmation` was re-read and is still
  `true`** — it is not this role's to touch and its justification never depended on a production
  environment existing.

### What was rejected, and why — surfaced rather than picked silently

- **Deleting the key. Worst option.** The kit's zero-config rule reads a documented default on
  absence, so a deleted `availability` reads as `99.9%` again: the deletion **silently restores the
  exact claim it was meant to remove.** Same trap the Architect recorded one hop earlier for
  `environments`, and independently forbidden by this task's hard constraint.
- **`""` (empty string).** One careless step from absence — the same trap.
- **`"UNKNOWN - verify"`.** False, and it would corrupt a marker this file uses precisely (see above).
- **`"0%"`.** A different untrue claim, not an honest one.
- **A bare `"n/a"`.** Drops the *why* and the trigger. `.grugops/factory.config.json` is strict JSON
  and **cannot carry a comment**, so a terse slug alone cannot distinguish a deliberate ruling from an
  unfilled bootstrap default — which is why the value carries a pointer to this section. The leading
  token still reads as a slug (`not-applicable-local-only`, mirroring the Architect's
  `deploy: "none-local-only"`), so a scanner that reads only the first word still gets the right
  answer.
- **A new `NFR-008` row.** Considered seriously and rejected: this file's FORMAT rule is *"keep
  targets few and real"*, `plans/traceability.md`'s ID scheme reserves `NFR-xxx` for non-functional
  **requirements**, and a row whose Target column reads "no target" is a contradiction that a later
  reader will try to measure. The ruling lives in this section instead. **If a later role disagrees,
  promoting this section into `NFR-008` costs one row and loses nothing — nothing here was deleted.**

### Owner and trigger — the bar is parked, not destroyed

- **Owner: Security/NFR.**
- **Trigger — a named CONDITION, not a milestone, because no milestone on this roadmap creates one.**
  The bar becomes real the first time this project ships something that must be reachable **while its
  user is not at the keyboard**: a hosted opponent, a server, a daemon, an online book or any network
  service. **Nothing in `EPIC-001`–`EPIC-006` does that** — `EPIC-006` is packaging and `EPIC-004`'s
  engine runs in-process — so an availability SLO does **not** automatically become meaningful at
  either.
- **The product has already ruled the condition out, and that is stronger than this role's reading.**
  `EPIC-006`'s `## Out of scope` names *"Network or multiplayer play — **permanent non-goal**"* and
  *"Accounts, cloud sync, ratings, or a stored game history database"*, and `EPIC-002`'s scope is a
  terminal loop. **On the product as currently scoped, the condition above is a stated permanent
  non-goal, not merely absent.** That is BA/PM's ruling and the owner's to change — it is cited here,
  not re-decided. If it is ever reversed, that reversal **is** this section's trigger.
- **Checkpoint where the condition is re-asked: `EPIC-006`.** That is where the distribution mechanism
  is settled — `ADR-0007` clause 5 records it as **undecided** (npm, a binary, a `git clone` and
  `npm start` all open), though `EPIC-006`'s own text already names `npx`; **that disagreement is
  reported in the next section and was not settled here**, and this task was in any case forbidden to
  pre-empt the choice. If `EPIC-006` ever picks a shape with a hosted component, **this section is
  where the bar is rewritten, with a denominator.**
- **A caution about what a CLI's "availability" would even mean.** For a published package it is the
  **registry's** SLO, not this project's. Do not adopt someone else's SLO as a bar this project can be
  failed on.
- **Deliberately NOT invented here.** A crash-freedom / "never lose the user's game" **reliability**
  bar is a different category, a different instrument and a different row, and nobody asked for one.
  It is named so it is not confused with availability; it is **not written**, because inventing a
  target to fill an empty slot is exactly what this file exists to prevent.

### The two sibling `nfr` keys — found in the same object, deliberately NOT changed

Recorded because a reader will otherwise ask why one key in that object was ruled and the two beside
it were not.

- **`perf_p95_ms: 300`** — a p95 latency budget over API endpoints this project does not have.
- **`a11y_target: "WCAG-2.2-AA"`** — a web-content conformance standard, for a terminal program.

Both are the same class of untrue bootstrap default as `availability` was. **Neither was asked about,
neither was edited, and this is a flag, not a re-opening:** no value changed, and `NFR-003`'s
keystroke figures (which `perf_p95_ms` is most likely to be confused with) are byte-untouched. The
task that produced this section explicitly barred re-opening any performance bar. **Owner:
Security/NFR. Trigger: `EPIC-003`** for the latency key (the first place a real interactive-latency
question exists — `NFR-003` already carries this project's honest version of it) and
**`EPIC-002`/`EPIC-003`** for the accessibility key (terminal accessibility is glyph-mode and
contrast, which `RISK-005` and epic amendment `[A4]` already own; WCAG is the wrong standard to
inherit unexamined).

## Does any other row here — or any risk on record — depend on a deploy target or a promotion path?

_Asked and answered 2026-08-06 by Security/NFR at the same subtask, as a bounded second question.
**The answer is NO.** Nothing below was edited; this is a survey with owners attached._

**The distinction the whole answer turns on, stated first:**

- a **deploy target / environment promotion path** — somewhere a build is pushed, and environments to
  promote it between (`dev → staging → prod`). **This project has none**, and `environments` is now
  `["local"]`.
- **distribution** — the artifact reaching a machine that is not its author's (npm, a binary, a
  `git clone`). **`EPIC-006`'s question, and still ahead of this project** — and whether it is already
  answered is itself contested; see the `NFR-007` block below.

**Nothing on record depends on the first. Four things depend on the second, and none of them is
relaxed by the local-only posture.**

### The seven rows

| Row | Depends on a deploy target or promotion path? | Note |
|---|---|---|
| `NFR-001` | **No** | in-process generator throughput |
| `NFR-002` | **No** | terminal frame compute and write, entirely local |
| `NFR-003` | **No** | keystroke echo and turn derives, entirely local |
| `NFR-004` | **No** | engine wall clock, in-process |
| `NFR-005` | **No** | search depth in budget, in-process. Its non-M3 obligation is about **hardware**, not deployment — see the fence below |
| `NFR-006` | **No — but distribution-dependent in one clause** | *"≤ 1 MB (no published-package **bloat**)"*. The size bar is measurable on any build; only the word *published* presupposes distribution. Worth recording separately: **its stated instrument does not exist today** — `npm run build` is `tsc --noEmit`, which emits nothing, and there is no `dist/`. Owner: Security/NFR, at `EPIC-005`/`EPIC-006`, when an artifact exists. **Not edited** |
| `NFR-007` | **No — but it is the one row that NAMES a mechanism** | *"`npx` invocation to first rendered board in < 2 s with a warm npm cache"*. `npx` presupposes npm publication. The target's substance survives any mechanism (time from a cold start to a first rendered board); only its **denominator** is mechanism-specific — the same class of denominator defect this file has corrected seven times. **DELIBERATELY NOT EDITED**, and **it surfaces a disagreement between two documents that is not this role's to settle — see immediately below** |

**TWO DOCUMENTS DISAGREE ABOUT WHETHER THE DISTRIBUTION MECHANISM IS DECIDED, and this is reported
rather than smoothed.** `NFR-007` was transcribed from `EPIC-006`, which states `npx` in **four**
places — `## Scope` (*"Packaging: runs via `npx` with no install step and no global dependency"*), the
epic-level acceptance criterion (*"Given `npx <package>` on a machine with Node installed…"*), its
`## NFR triggers` block, and its `## Test notes`. On the same day this section was written,
**`ADR-0007` clause 5** recorded that *"how the CLI will eventually be distributed is **UNDECIDED**…
npm, a standalone binary, a `git clone` and `npm start` — all open"*, and the Orchestrator's decision
note for this task named *"not deciding how the CLI will eventually be distributed"* as explicitly out
of scope.

**Both cannot be true at once**, and this is the same *two-documents-disagree* shape this project
spent 2026-08-04 untying out of `ABC-015`. **Nothing on either side was edited here:** `EPIC-006`'s
scope is **BA/PM's**, `ADR-0007` is **Architect/Design's**, and `NFR-007`'s own bar stays byte-identical
because rewriting it would either pre-empt the distribution question or re-open a performance bar —
both out of scope for this subtask. **Owners: BA/PM and Architect/Design, at `EPIC-006`'s
decomposition**, which is where the epic is opened anyway. Whichever way it resolves, `NFR-007`'s
denominator then gets stated the way every other bar in this file states one; **Security/NFR owns that
edit and does not own the choice.**

### The risks, all five, plus every accepted risk on record

Checked against `plans/epics/**` (the `RISK-00x` definitions) and every accepted-risk enumeration in
`plans/board.md`, `plans/traceability.md` and the ticket files.

| Risk | Deploy-dependent? | What it actually depends on |
|---|---|---|
| `RISK-001` move-generation edge cases | **No** — retired 2026-07-24 | the perft harness |
| `RISK-002` search throughput caps depth | **No** | **non-M3 target hardware** for its timeboxed spike — a machine, not an environment |
| `RISK-003` strength is hard to verify | **No** | a reference opponent, a self-play ladder, a puzzle suite |
| `RISK-004` opening-book source licensing | **No — distribution-dependent** | the licence must permit **redistribution**. **This is NOT made moot by "we deploy nowhere":** redistribution is triggered by the data reaching anyone at all, and a `git clone` distribution is still redistribution. Unchanged: resolve **before** copying any data, exactly as `EPIC-005` says |
| `RISK-005` terminal portability | **No** | other people's terminals (Windows Terminal, iTerm2, tmux). Its mitigation — the ASCII fallback built in from the start — is **local code and entirely unaffected**; only its *verification* needs machines this project cannot reach today |

**Accepted risks — twelve enumerated across three gates, none deploy-dependent.** `ABC-011`'s first
pass (three: one-machine timings; the `zobristKey` purity MEDIUM, since **closed**; the amortized
denominator), `ABC-011`'s re-gate (four: one-machine timings; two unpinned behaviour-equivalent cost
mutants; the amortized denominator; purity closure being 336,000 inputs rather than a proof) and
`ABC-012`'s gate (five: `takeBack(NaN)`; `playMove` validates nothing; `src/fen.ts` out-of-range move
counters; `coverage/` tracked and stale; every NFR figure being one machine and one Node version).
**Not one of them needs a deploy target, an environment or a promotion path to be discharged.** The
`ABC-006` gate's `PASS_WITH_RISKS` risk — *"nfr-catalog empty"* — is long since discharged by this
file.

### Two ASVS deferrals DO depend on packaging, and this ruling CONFIRMS them rather than closing them

Both were recorded at `ABC-011`'s gates against `security.asvs_level: L1`. **Neither is touched here,
and neither becomes passable because the project deploys nowhere:**

- **`V13.4.1`** (no source-control metadata in what is deployed) — **DEFERRED, not passed**, on the
  stated ground *"nothing is deployed and nothing is packaged until `EPIC-006`"*. The requirement is
  about what a **shipped artifact** leaks, so it goes live at **packaging**, not at deployment.
  **"We deploy nowhere" must not be read as closing it.** Owner unchanged.
- **`V15.1.1` / `V15.2.1`** (documented remediation timeframes for third-party components) — **not met
  at project level**, severity overridden from the L1 default `high` to `low` with a stated reason
  (zero runtime dependencies; the change neither touches nor degrades the gap). **Owner:
  Architect/Design, at `EPIC-006`.** Unchanged by this ruling.

### THE FENCE — "we deploy nowhere" must never be read as "only this machine matters"

Recorded loudly, because it is the most likely wrong inference from the ruling above and it would
quietly discharge obligations nobody discharged:

1. **`RISK-002`'s timeboxed non-M3 spike stands.** It is the named verification that lifts
   `NFR-005`'s **PROVISIONAL** marker from the depth-7 level. A local-only posture does not make a
   second machine unnecessary; it makes the *deployment* of this software unnecessary, which is a
   different sentence.
2. **Every `UNKNOWN - verify` on other hardware stands.** Every figure in this file is **Apple M3
   (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and unverified anywhere else. `ABC-011`'s
   re-gate accepted risk 1 and `ABC-012`'s accepted risk 5 both carry exactly this obligation.
3. **`RISK-004`'s redistribution question stands**, for the reason given in the table above.
4. **`RISK-005`'s portability question stands.** "Used locally" is a statement about *this*
   developer's machine today; the ASCII fallback exists for the terminals this project has not met.
