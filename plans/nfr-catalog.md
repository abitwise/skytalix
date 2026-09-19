# NFR Catalog
_Updated: 2026-09-19 by Architect/Design (task `owner-rulings-2026-09-19`, subtask `ruling-abc100-distribution`, Workflow 07, delivering `ABC-100`): **`NFR-007` ONLY. THE `< 2 s` BAR IS BYTE-IDENTICAL; NO LEVEL, TARGET FIGURE OR `UNKNOWN - verify` MARKER MOVED, AND NOTHING WAS MEASURED.** The row's DENOMINATOR is restated from *"`npx` invocation … warm npm cache"* to *"`npm run chess` on a completed clone (after `npm install`)"* on the owner's ruling of 2026-09-19 (`ADR-0018`, superseding `ADR-0007` clause 5 only), the `Verified by` cell's *"timed `npx` run"* instruction follows it, and the 2026-08-06 TWO-DOCUMENTS-DISAGREE item is CLOSED (appended to the row's tail and to its 2026-08-06 block below). `NFR-001`–`NFR-006` and `NFR-008` untouched._
_Updated: 2026-09-19 by Architect/Design (task `owner-rulings-2026-09-19`, subtask `ruling-abc110-level-15s`, Workflow 07) — **`NFR-008` ONLY, AND FOR THE FIRST TIME SINCE 2026-08-11 A LEVEL MOVED: THE CPU CLAUSE IS 15 s, ON THE OWNER'S VERBATIM WORD (*"3. raise to 15s for now"*, Olger Oeselg, 2026-09-19), `ADR-0019` superseding `ADR-0014` on the level only.** ONE CELL of the `NFR-008` table row edited (`Target` — the level and its dating); `ID` / `Category` / `Applies to` / `Verified by` byte-identical; **`NFR-001`–`NFR-007` byte-identical, hashed individually before and after** (the eight-row hash is therefore NOT `63f66795…ca31` any more — the new one is recorded in the section appended at the end of this file). **THE WALL CLAUSE (3 s) DID NOT MOVE. `N8-LANE`'s 5% / 650 ms, its instrument, statistic, null control and 160 ms floor did not move; `N8-SPAWN` stays 0 ms; no test file changed lane.** Re-measured at `2c96dbd`: **CPU 14.940 s = 99.6% of 15 s, MET by 60 ms**; wall 4.385 s REPORTED, NOT RULED (`ABC-111`)._
_Updated: 2026-09-19 by Architect/Design (task `owner-rulings-2026-09-19`, subtask `ruling-abc107-overflow`, Workflow 07): **NO TABLE ROW TOUCHED — THIS LINE ONLY.** `ADR-0022` (option 4 for `ABC-107`: the message region's overflow is a documented, tested bound) adds ZERO production lines and ZERO render-path work, so `NFR-002`'s target, bar and figures do not move; `ADR-0009`'s row tripwire (`= 23` / `≤ 24`) is untouched by fence; `NFR-008` / `N8-LANE`: the build is ≤ 1 new test file and 0 new spawns, and no lane line is claimed while `ABC-108` stands. Recorded here so the NFR impact of the design is written down as ZERO rather than left unstated._

_Updated: 2026-08-12 by Architect/Design (task `design-ABC-029-2026-08-12`, subtask `design-ABC-029-production-module`, Workflow 07): **`NFR-002` ONLY, AND ITS TABLE ROW IS BYTE-IDENTICAL. ONE NOTE APPENDED TO THE SECTION AND NOTHING ELSE — NO TARGET, BAR, LEVEL, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE.** All eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the eight lines together before and after the write (`sha256 63f66795…ca31`) and by hashing each row individually — 8 rows before, 8 after, 46 table lines before and after. **THE NOTE THIS ROW WAS OWED: the FIRST non-renderer production runtime importer of `src/history.ts` now exists — `src/turn-loop.ts` — which is what makes this row's renderer-scoping LOAD-BEARING rather than incidental.** **THE ROW IS NOT BREACHED AND THAT WAS RE-MEASURED HERE, NOT INHERITED:** on a replica of `ABC-019`'s tip verified `cmp`-identical file by file (17 non-test `.ts`, `src/turn-loop.ts` md5 `bd793612…97cc`), the render closure rooted at the five renderers this row names is **11 modules with `history.ts` NOT among them**, the probe is **armed** (rooted at `turn-loop.ts` it DOES report `history.ts`), and the pane's own closure is **still exactly SEVEN**. The loop holding the derive is this row's *"the quantity belongs to the LOOP, not to a frame"* being **satisfied**, not breached — so **the row was right in advance and needed no edit**. **WHAT NEEDED A RULING IS THE GUARD, NOT THE ROW, AND IT IS `ADR-0011`'s:** `ABC-017`'s `A11` was a **whole-tree proxy** for a **frame-scoped** property, sound only while every production module was the rules core or a renderer. **ONE STRUCTURAL FACT RECORDED BECAUSE IT IS WHY THE PROXY COULD NOT SIMPLY BE NARROWED: `src/frame.ts` imports NOTHING — its runtime closure is exactly ONE module, itself.** A frame is composed by **injection**, not by import, so frame membership is **not derivable from the module graph**, and this row's `Applies to` cell is currently the only statement of what the frame path contains. **`MET`/`MISS` STAYS SECURITY/NFR'S and no verdict is taken here — `ABC-019` has never been through a Security/NFR gate.** Owner of the guard repair: **`ABC-029`**. **ZERO `src/` lines and ZERO test lines** — every measurement ran on copies outside the repository, so the no-wall-clock-in-the-suite rule is not engaged and `NFR-008`'s lane budget is not charged. `NFR-001` and `NFR-003`–`NFR-008` untouched; no ADR re-opened; `plans/board.md` and `plans/tickets/` deliberately NOT touched. NOTHING MERGED, NOTHING DEPLOYED._
_Updated: 2026-08-11 by Architect/Design (task `design-stub-seam-and-nfr002`, Workflow 07): **`NFR-002` ONLY. THE `< 16 ms` TARGET DOES NOT MOVE, AND NO BAR IS CREATED, MOVED OR LOOSENED.** **ONE CELL OF THE `NFR-002` TABLE ROW EDITED — `Applies to` — and `ID` / `Category` / `Target` / `Verified by` verified BYTE-IDENTICAL CELL BY CELL against `HEAD` rather than asserted; `NFR-001` and `NFR-003`–`NFR-008` BYTE-IDENTICAL; `git diff --numstat` reports exactly 1 insertion / 1 deletion on the table.** **THE BOUNDARY BLOCK'S QUANTITY IS RE-MEASURED AND RE-SCOPED: `gameStatusOf` reads 20.76 / 48.27 / 95.29 µs at 40 / 120 / 300 plies on merged code, and the wave-1 PROTOTYPE band `46–50 @ 120 / 97–102 @ 300` is retained as history with its 300-ply end shown to be ~7% HIGH — every real reading is 94.4–95.6 µs, BELOW its 97 lower bound. Three independent harnesses by three roles over three days agree within 2.1%.** **THE FLAG BA/PM RAISED AT `refinement-ABC-019` IS RULED: this row has a real coherence problem and it is NOT the one flagged.** The `≤ 100 µs` bar is `ABC-019`'s and appears NOWHERE in this file (`grep` = 0 matches), so the disagreement was between this row and a TICKET; and *"the correct build sits at or over the bar"* is **FALSE as measured** — it double-counts `gameStatus` (`gameStatusOf` ALREADY contains it, `src/history.ts:152`) and quotes a superseded band, where the correct build reads **0.95x, MET**. **BA/PM's ruling 3 STANDS ENTIRELY, on the stronger of its two reasons — a two-derives-per-ply build MEETS the timing bar at 0.94x, which is why the spied call count binds and a clock cannot.** **WHAT THIS ROW'S OWN INCOHERENCE WAS: it carried the prototype band as an UNLABELLED headline figure, and it was transcribed into a ticket bar TWICE.** Fixed by labelling: the measured triple is the headline, the band is struck through, and the cell now states the quantity is the `O(window)` falsifier's evidence and **NOT a bar of this row**, with a fence forbidding transcription into a ticket bar without re-deriving all three ply counts. **NEW STRUCTURAL FACT: bare `gameStatus` is FLAT in plies (2.71 / 3.31 / 2.21 µs), so the ENTIRE `O(plies)` term is `repetitionCounts` — the falsifier names exactly the right call.** The bounded-pane compute (`ABC-017`) and the status-panel compute (`ABC-016`) are **still `UNKNOWN - verify` and no number was invented for either**; `MET`/`MISS` stays Security/NFR's; `plans/tickets/` and `plans/board.md` deliberately NOT touched. **ZERO `src/` lines and ZERO test lines** — the harness lived outside the repository, `src/` aggregate md5 `afbc181925173a615c3fbf18fd51dab8` before and after, so the no-wall-clock-in-the-suite rule is not engaged and `NFR-008`'s lane budget is not charged. NOTHING MERGED, NOTHING DEPLOYED._
_Updated: 2026-08-11 by Architect/Design (task `design-frame-contract`, Workflow 07): **`NFR-002` ONLY, AND ITS TABLE ROW IS BYTE-IDENTICAL — NO TARGET, BAR, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED, AND NOTHING WAS MEASURED FOR THIS ROW AT THIS HOP. ONE TABLE CELL OF THE SECTION'S UNKNOWNS TABLE EDITED AND ONE SUBSECTION APPENDED; `NFR-001` AND `NFR-003`–`NFR-008` UNTOUCHED.** **THE FLAG `ABC-016` CARRIES AS OPEN WITH THIS ROLE'S NAME ON IT IS NOT OPEN — it was ruled at `refinement-ABC-026` on the day it was raised (reason 1 STALE, reason 2 CARRIED and deliberately not written into the row because this file does not certify a ticket that has shipped zero lines); both dispositions were re-checked here and both hold, so NO EDIT IS OWED TO THE ROW AND NONE IS MADE.** What is owed is on the ticket — its flag should read *ruled, carried by Security/NFR at its own gate* rather than *owed by Architect/Design* — and that is **flagged for BA/PM, not edited here.** **WHAT IS NEW STRENGTHENS THE BOUNDARY CONDITION WITHOUT MOVING IT: both checkers are now PROMOTED acceptance text** — `ABC-016` `A13` and `ABC-017` `A11` (the latter also pinning *"`GameHistory` as a type only — `src/history.ts` still has zero runtime importers"*) — so the `O(window)` falsifier is guarded on each ticket by a criterion that can fail at zero timing sensitivity; **the gate obligation is unchanged and is NOT discharged by it** (each gate still `grep`s delivered code). `src/history.ts` re-checked here: exactly one importer, `src/history.test.ts`. **TWO POINTERS IN THE UNKNOWNS TABLE ARE CORRECTED AND NEITHER IS A BAR OF THIS ROW: the closer's blocker chain was STALE ON BOTH LINKS** (`ADR-0004` accepted 2026-07-31, `ABC-013` `done` and merged 2026-08-10, both read at source), **and its *"three within 2x"* named a bar no ticket carries any more** — that figure was transcribed from `ABC-017`'s ticket in 2026-07-30 and the ticket re-derived it with measurement at its promotion (**1.845x**, 7.7% headroom, on the builder its own test notes mandate against **1.060x** on a knight shuffle: the 2x was measuring the fixture, not the algorithm; `ABC-016` carries 3x for the identically shaped bar). **The ≤ 150 µs absolute is untouched and SECURITY/NFR STILL OWNS MET/MISS** — correcting a pointer is not taking a verdict; it is closing the TWO-DOCUMENTS-DISAGREE class this file already tracks on `NFR-007`. **THIS ROW'S 23-ROW DENOMINATOR WAS ASSUMED AND IS NOW FALSIFIABLE, AND THAT CHANGES NO FIGURE:** the write half's *"23-row frame at `W = 18`, 418 characters"* had nothing that could fail if a panel shipped a different row count — measured here, `src/frame.test.ts:632-638` asserts the 23 identity from **three LOCAL SHADOW constants** at `:38-43` and therefore **passes all six row-count mutants constructed at this hop**, including the two that push `H` to 25 where `beginFrameSession` takes the append path and epic `4b` goes unreachable; `ABC-016`'s `A11` passes both of those too, because it hardcodes the `history` term. **`ADR-0009` puts the identity in ONE place reading all three terms from delivered code (`renderBoard(...).length`, `STATUS_ROWS`, `HISTORY_ROWS`), a `= 23` tripwire plus a `≤ 24` requirement, owed by whichever panel ticket merges SECOND.** **The bounded-pane compute (`ABC-017`) and the status-panel compute (`ABC-016`) remain `UNKNOWN - verify` and no number was invented for either. ZERO `src/` LINES were written at this hop, so nothing was added to the suite.** Previously 2026-08-10 by Architect/Design (task `refinement-ABC-026`, subtask `refinement-ABC-026-design`, Workflow 07): **THE DEFAULT TEST LANE HAS A TOTAL BUDGET FOR THE FIRST TIME — `NFR-008` IS SEEDED, MEASURED, AND ITS LEVEL IS MARKED `PROVISIONAL` WITH A NAMED HUMAN RATIFIER. EXACTLY ONE ROW ADDED; `NFR-001`–`NFR-007` ARE BYTE-IDENTICAL, verified by hashing all nine pre-existing table lines before and after the write rather than asserted; 9 table lines before, 10 after; the new row carries the same 7 pipe-separated fields as every other. NO TARGET MOVED.** **`npm test`, `PERFT_DEEP` unset: ≤ 3 s WALL and ≤ 13 s CPU (user+sys), medians of ≥ 7 interleaved runs, reference machine Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7, `UNKNOWN - verify` elsewhere. Today 1.765 s wall / 7.640 s CPU — 59% of the wall clause, MET, and it BINDS inside this project's own remaining plan.** **THE 3 s IS ADOPTED, NOT INVENTED — it is `ABC-026`'s own promotion trigger**, the only figure for this quantity the board had already agreed to; the 13 s is 3 s × the measured 4.15–5.07x CPU/wall conversion. **BOTH CLAUSES ARE NEEDED AND EACH BOUNDS THE OTHER'S DEGENERATE OPTIMUM, measured: `--no-file-parallelism` cuts CPU 30.1% and multiplies WALL by 2.4x.** **THE STRUCTURAL FINDING: A TEST FILE COSTS 368–504x A TEST.** 128 trivial assertions in ONE file cost 1.105/1.125 s CPU; the same 128 in 128 FILES cost 21.295/23.780 s — 19.3x/21.1x — so 0.35–0.43 ms per `it` against 159–179 ms per FILE, and the floor curve is **CPU = 0.85 s + 159 ms × files, `R² 0.9999` over files = 1…128** (the prior hop had n = 2 conditions at one point; this is the curve it asked for). **49–58% of the lane's CPU is per-file runner overhead**, by two independent decompositions agreeing within 8 points. **SO 22 FILES IS NOT THE PROBLEM AND FILE COUNT IS NOT THE LEVER — nothing here proposes deleting, narrowing or merging any test, and this measurement removes the last reason anyone might have wanted to.** **~70–90% OF THE PER-FILE COST IS PER-FILE PROCESS ISOLATION (`--no-isolate`: −30.7%/−36.5% CPU) AND THAT SAVING IS NOT AVAILABLE — the eleventh instrument-limit correction on this file's record and the most expensive to have got wrong: `--no-isolate` is GREEN IN 4 OF 21 OBSERVED RUNS, THE FIRST OBSERVED RUN WAS GREEN, and the only files that ever fail are `zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and `san.nfr.test.ts` — `NFR-005`'s call-count sub-bar, `NFR-001`'s three `gameStatus` bars and `ABC-025`'s five `N1` rows. The lane's dominant cost is buying exactly the isolation this catalog's own spied guards depend on, and until now nobody knew the price.** No guard is under suspicion and no change is asked for. **THE STANDING PER-TICKET BAR IS `N5` WITH ONE CLAUSE CHANGED — THE DENOMINATOR: ≤ 5% of the TOTAL, not of the current lane.** *n* tickets at 5% of the current lane multiply it by `1.05ⁿ` (2.65x at twenty) with every ticket green — geometric and unbounded; 5% of a fixed total is arithmetic and admits exactly twenty. **BA/PM's 5% was never the defect; its denominator was**, and every other clause of their re-derivation (CPU, net of the floor, median of paired per-round deltas, n ≥ 7 interleaved, null control by identity) is adopted unchanged and with attribution. **A PER-TICKET WALL BAR IS UNMEASURABLE BY CONSTRUCTION, not merely noisy** — two added files move the wall clock −15 to +3 ms/file while moving CPU 100–225 ms/file, and wall grows in a SAWTOOTH with a ~70–75 ms step at each multiple of the 7 default workers, so it would charge two identical tickets different amounts for identical work. **`ABC-025`'s cost is INDEPENDENTLY REPRODUCED at +13.75% CPU** (BA/PM +12.8/+13.9/+14.1%, Security/NFR +12.1/+13.6%) **and the two-empty-files floor is reproduced in SIGN and ORDER but READS LOWER: +3.88%/+5.59% here against +5.4%/+6.1% there** — the 5.8% used in `ABC-025`'s ruling is at or above the top of this hop's range, which is why the floor is restated as an ABSOLUTE (160 ms CPU/file, band 100–229) that does not depend on which lane it is a percentage of. **This hop's identity null control is WORSE than theirs (−0.43%/−0.52%/−1.26% at 3/8 against ±0.1% at 4/8) and that is reported, not smoothed.** **THE FENCE ON EVERY ABSOLUTE HERE: the SAME tree read 6.68 s CPU / 1.61 s wall early and 8.14 s / 1.96 s after ~15 min of sustained 8-core load — +22% on ONE machine inside ONE hour.** Own harness outside the repository, **19 out-of-tree copies with every repository file `cmp`-verified byte-identical per file before any condition**, `/usr/bin/time -p`, one fresh OS process per run, order rotated every round, round 0 discarded, n = 8 usable rounds, wall and CPU never blended, every run asserting its own file AND test count — **0 harness errors over 11 measurement suites / 612 recorded runs** (plus 9 deliberately-failing `--no-isolate` runs, which are data of a different kind, and 33 standalone determinism runs); **the repository's `src/` was NEVER written (37 md5s identical before and after, `git status --short -- src/` empty) and NO wall-clock assertion was added to the suite.** **`NFR-002`'S TWO OPEN FLAGS ARE RULED AND ITS TABLE ROW IS BYTE-IDENTICAL: `ABC-017`'s is STALE — the rewrite it asks for landed at `92046f9` 2026-07-31T09:55, nine and a half hours AFTER `ABC-017` was cut at `03b0a65` 00:27, and the sentence it quotes occurs nowhere in the `NFR-002` row or its section today except where this hop quotes it, so the flag is struck on `ABC-017` rather than the row being re-opened; `ABC-016`'s is CARRIED, not discharged, because it is a true statement about a ticket that has shipped ZERO lines and this file does not certify unbuilt code.** Previously 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`, `ABC-009`'s gate): **`NFR-001` RE-MEASURED AND MET ON BOTH CLAUSES, AND THE PER-CELL QUESTION THAT DEFEATED THE PERFT INSTRUMENT IS RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT. NO TARGET MOVED — `NFR-001`'s Target and Applies-to cells and `NFR-002`..`NFR-007` are BYTE-IDENTICAL, verified by hashing the cells before and after rather than asserted; 7 raw fields per table line before and after; EXACTLY 2 LINES CHANGED of 545 (this header and the `NFR-001` row).** Floor **6,030,518 / 6,136,238 / 6,117,496 nodes/sec** against ≥ 1,000,000 (MET, ~6.1x); aggregate ratio **1.0062 and 0.9967** against ≥ 0.98 on two independent samples (MET, worst cell 0.9863); deep lane **32/32 in 38.49 s**. Re-derived, not inherited — three trees in one process with a `cmp`-verified byte-identical twin as a null control by identity, 12 rounds, rotated order, `parseFen` outside every clock, two samples, Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere. **THE TENTH INSTRUMENT-LIMIT CORRECTION ON THIS FILE'S RECORD: the per-cell floor is ±2.0%, not the ~±1% previously recorded, and the AGGREGATE floor (~±1%, a systematic this gate CANNOT attribute) had never been characterised at all** — so the bar's 2-point margin exceeds the resolution by about 2x, not comfortably. **THE COUNT IS WHAT RESOLVES IT, the same move this file already made for `NFR-005`'s call-count sub-bar:** the two added lines execute **396,350 times** over the whole sweep and **reject nothing in any cell**, cost **0.33–0.43 ns each** measured in isolation against a ±0.22 ns null floor, so by arithmetic (labelled arithmetic) the whole change costs **0.0070%–0.0091%** — true ratio **≈ 0.9999**, kiwipete **≈ 0.9998**, and the 0.9930 reading everyone was asked about is ~35x the true deviation. **DENOMINATOR FENCE RE-DERIVED INDEPENDENTLY at 97.18% free leaves** against this file's 97.3%. **GUARD ORDERING IS ADJUDICATED — the five guards are a conjunction of side-effect-free predicates, hence PERMUTATION-INVARIANT (99 comparisons, zero divergence), so ordering is a COST question only; no change asked for.** `NFR-005` NOT measured and the key benchmark NOT re-run — the exclusion is structural. _(Previous header, retained here so it is not lost: 2026-08-09 by Security/NFR at `ABC-018`'s gate — **`NFR-002`'s WRITE HALF — the half this file has called "the half nobody has measured" since 2026-07-30 — IS MEASURED AND ITS `UNKNOWN - verify` IS DISCHARGED. THE BAR IS MET AT EVERY PLY COUNT AND NO TARGET MOVED.** The Engineer's figures were **RE-DERIVED, not inherited**, and QE explicitly declined to re-derive, so a number nobody at this gate produced is not reported as gated: own harness outside the repository, own process, replay and `parseFen` hoisted out of every clock, the writer built once outside it, discarded warm-up, **11 rounds × 2,000 iterations** per cell, order rotated every round, medians of per-round means, checksum against elision, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` elsewhere. **THE ROW'S OWN DEFINITION OF "WRITE" IS RULED, because the Engineer measured three sinks and routed the choice here by name: the quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`, judged against the MOST EXPENSIVE HONEST READING.** Four instruments, all recorded: in-memory **0.635–0.648 µs** (a floor — it omits the syscall the row's words require), `/dev/null` **1.650–1.674 µs**, **a regular file 2.711–2.772 µs — the figure the row carries**, and a **FIFO with a live reader 2.285–2.317 µs**, which is `EPIC-006`'s pipe shape and sits beside the row rather than in it because a pipe write's cost includes the READER's scheduling. Compute **5.978–6.137 µs**. **SUM 0.0087–0.0088 ms against 16 ms — 0.055%, ~1,800x headroom, MET; both halves FLAT across 40/120/300 plies**, which is this row's `O(window)` claim measured rather than inferred. **DENOMINATOR RE-DERIVED: a 23-row frame at `W = 18`, 418 characters serialized, 419 characters / 483 BYTES on the wire in unicode mode and 419 bytes in ASCII** — the byte figure is new, because a character count is not a wire cost at three bytes per glyph. **WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED:** compute, the in-memory sink and `/dev/null` all reproduce inside this gate's two samples; the **regular-file cell reads ~11% HIGHER (2.711–2.772 against 2.43–2.48 µs) and this gate CANNOT attribute it.** **THE IN-PLACE PATH, RECORDED BY THE ENGINEER AS NOT TIMED, IS NOW TIMED AND COSTS THE SAME** (1.650–1.690 against 1.643–1.671 µs to the same fd — the 7 escape characters are below instrument resolution); what a real TERMINAL does with them stays `UNKNOWN - verify`. **THE COMPUTE HALF IS STILL A LOWER BOUND** (`ABC-016`, `ABC-017` are stubs outside the clock; `ABC-013`'s SAN derive is not in it). **THE ONE WAY THIS BAR CAN BE BUSTED TODAY IS MEASURED RATHER THAN LEFT AS A WORRY: an UNBOUNDED supplied string.** Cold, first frame, own process — the shape of a frame assembled once per ply — one item of **400,000 characters costs 14.1–15.8 ms, the WHOLE budget**, and 1,000,000 characters **28.4–41.9 ms, 1.8–2.6x OVER**; the item count crosses at ~13,000. **NINTH INSTRUMENT-LIMIT CORRECTION ON THIS FILE'S RECORD:** a warm micro-benchmark median reads ~5x lower on that cell and is the WRONG instrument for a once-per-ply frame; no number is claimed from it. **No bound is asked for on `ABC-018`** — nothing supplies this input until `EPIC-003` — but the number is handed forward, owner **BA/PM at `EPIC-003`**, so that ticket has a bar rather than a feeling. **`NFR-007`'s single-write clause is verified on this gate's own counter: 84 frames, 84 `write` calls, exactly one per frame.** **THE SECURITY BAR IS RE-DERIVED ON THE EMITTED STREAM AND MET:** 21 adversarial strings × 2 glyph modes × 2 strategies, in the message region **and** in a panel row — **0 ESC bytes from supplied data, 0 C0 bytes, 0 `U+007F`, 0 code points above `U+007F` in ASCII mode, row count constant at 23, and exactly the module's own 2 escape sequences in place and 0 in append.** **THE C1 QUESTION QE ROUTED HERE IS DECIDED, NOT RATIFIED, AND THE ANSWER IS THAT STRIPPING C1 WOULD BE THEATRE:** a clean unicode frame with **no supplied text at all** already carries **64 C1-range BYTES**, all of them from the module's own glyph table, and **the one 8-bit CSI byte `0x9B` is the BLACK QUEEN `♛` (`U+265B` = `E2 99 9B`)** — the whole adversarial C1 payload adds 5 more. The control that makes unicode mode safe is the terminal being UTF-8, which is a property of **mode selection (`ABC-015`)**, not of sanitization; owner **`EPIC-006`**, which owns the `--unicode` flag that can force the mismatch. **NO ROW WAS ADDED OR DELETED. `NFR-001`, `NFR-003`–`NFR-007` are BYTE-IDENTICAL, and `NFR-002`'s ID, Category, TARGET and `Applies to` cells are BYTE-IDENTICAL — verified by hashing them before and after, not asserted.** Previously 2026-08-08 by Security/NFR (task `ticket-to-pr-ABC-015`, subtask `security-nfr-abc015-gate`, `ABC-015`'s gate): **`NFR-007` GAINS MEASURED EVIDENCE FOR ONE COMPONENT OF ITS WINDOW AND ITS TARGET DID NOT MOVE — the row is still `UNKNOWN - verify` and NOTHING DISCHARGES IT.** `ABC-015`'s ticket-level bar — *"zero filesystem and zero process operations; it reads `process.stdout.isTTY` and `process.env` only"* — sits inside the `npx`-to-first-board window and is **MET**. **THE DELIVERED GUARD WAS DELIBERATELY NOT CITED:** QE had found `src/glyph-mode.nfr.test.ts` blind to `node:fs/promises`, a specifier it did not name, and **a guard that fails by omission is not evidence** — so the bar was re-derived on this gate's own instruments, the first of them **specifier-agnostic by design**. **Node's PERMISSION MODEL** (`--permission --allow-fs-read=<dir>`, which denies at the binding level below every module mock), **proved ARMED by four positive controls** (`readFileSync`, `fs/promises.readFile`, `execSync`, `existsSync("/etc/locale.conf")` — all `ERR_ACCESS_DENIED`); a **`cmp`-verified byte-identical copy of the module ALONE in an empty directory with no `render.ts` beside it**, which imports and runs and therefore **PROVES the runtime import closure is EMPTY**; and **165 patched functions** across `fs` / `fs/promises` / `child_process` / `os` / `tty` plus a `node:module` `registerHooks` load recorder. **Across three ambient shapes: 0 modules loaded, 0 filesystem calls, 0 process calls, 0 bytes written, 0 wrong answers over 11 selection paths and both entry points.** **AN INSTRUMENT-LIMIT CORRECTION, THE EIGHTH THIS FILE HAS RECORDED, AND IT WOULD HAVE PRODUCED A FALSE MISS:** the first run counted three filesystem calls inside the region and they were the **ESM loader reading the module off disk** — the LOAD, not the SELECTION; hoisted out, the count is **0**. **WHAT THE ONE PERMITTED READ ACTUALLY DOES, MEASURED SO THE BAR IS NOT OVER-CLAIMED:** `process.stdout` is a **lazy getter** whose first touch constructs the stream for fd 1 (`Socket` on a pipe, `SyncWriteStream` on a file and `/dev/null`, `WriteStream` on a terminal) and performs **no permission-checked filesystem operation and no child process** — the bar is met, and *"zero I/O below the JS line"* is **not** claimed. **THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL** (a `python3` pty, under the permission model): `LANG=en_US.UTF-8` → **unicode**, `LANG=C` → **ascii**, `isTTY` genuinely `true`; every earlier test faked it with `defineProperty`. **THE ENVIRONMENT IS TOUCHED NARROWLY**, measured with a recording `Proxy`: **at most 3 keys** (`LC_ALL`/`LC_CTYPE`/`LANG`), stopping at the first set rung, **0 enumerations**, **0 env reads at all on a non-TTY sink**, and **0 further ambient reads across 8 accessor calls**. **A DIAGNOSTIC AND EXPLICITLY NOT A BAR — `ABC-015` names no µs bar and says why, and NONE WAS INVENTED:** `selectGlyphMode` **14.1 / 14.3 ns** first rung and **28.3 / 30.3 ns** all three rungs, `beginGlyphModeSession` **436.6 / 442.7 ns** — 11 rounds × 200,000 iterations, discarded warm-up, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware; ~**0.00002%** of the 2 s window. **ATTRIBUTION IS PARTIAL AND LABELLED PARTIAL:** two ambient property reads read 155.9 / 158.4 ns in isolation and the closure 2.9 / 3.2 ns, which does **not** sum to 433–445 ns, and **the residual is NOT attributed**. **ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION AND NO NUMBER IS TAKEN FROM IT** — whether the session closure retains an injected `env`: the `WeakRef` + `--expose-gc` probe said "reachable" **and so did the null control with no session created**, so `UNKNOWN - verify` (and moot in production, since `process.env` outlives every session). **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE.** **STILL OPEN ON THIS ROW AND NOT CLOSED HERE: the `npx` measurement itself (`EPIC-006`'s), and the TWO-DOCUMENTS-DISAGREE item recorded on 2026-08-06** — `EPIC-006` states `npx` in four places while `ADR-0007` clause 5 records the mechanism as UNDECIDED; **neither side was edited**, owners BA/PM and Architect/Design at `EPIC-006`. **EXACTLY ONE ROW AND ONE LINE CHANGED. `NFR-001`–`NFR-006` are BYTE-IDENTICAL, and `NFR-007`'s TARGET cell and `Applies to` cell are BYTE-IDENTICAL — NO TARGET MOVED**, verified by hashing the cells before and after rather than asserted. **The two ASVS deferrals (`V13.4.1`, `V15.1.1`/`V15.2.1`) are untouched and NOT relaxed**; `V15.1.1`/`V15.2.1`'s `high` → `low` override was restated at `ABC-015`'s gate with its evidence re-checked (`dependencies` is `{}`, `package.json` untouched on that branch) and remains **Architect/Design's at `EPIC-006`**. Previously 2026-08-07 by Security/NFR (task `ticket-to-pr-ABC-014`, subtask `security-nfr-abc014-gate`, `ABC-014`'s gate): **`NFR-002`'s BOARD-SCAN COMPUTE HALF IS RE-MEASURED INDEPENDENTLY AND THE BAR IS MET — NO TARGET MOVED, and the `UNKNOWN - verify` on that one half is discharged with its machine.** The Engineer's figure was **not** inherited, on the standard this column set on `NFR-005` and kept on `ABC-012`: own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, `parseFen` **outside** the timed region, a checksum kept so nothing could be optimised away, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **WORST CELL 2.092 / 2.056 µs PER FRAME AGAINST THE 500 µs BAR — 0.0042x, about 240x headroom, MET**, over all 24 cells of (6 standing perft FENs × 2 glyph modes × 2 orientations); best cell 0.955 / 0.980 µs. The two samples agree to 1.7% and pick the same worst and best cell. **THE ENGINEER'S 2.070 µs IS REPRODUCED, NOT CARRIED FORWARD — this gate's two samples BRACKET it**, which is the strongest thing a re-measurement can say and is said here rather than smoothed into a single number. **THE BAR'S OWN POPULATION DOES NOT CONTAIN THIS MODULE'S WORST CASE, and that is stated rather than banked:** a **fully-occupied 64-piece board** — no empty-square short-circuit anywhere, unreachable through `parseFen`, which requires one king per side — measures **2.322 / 2.342 µs**, still **0.0047x** of the bar; the empty board, the true best case, measures 0.910–1.051 µs. **THE 40 / 120 / 300 PLY COUNTS THIS ROW MANDATES DO NOT APPLY TO THIS MODULE AND WERE NOT FAKED TO LOOK COMPLIANT** — the absence is STRUCTURAL and was measured, not assumed: `renderBoard(position, mode, orientation)` takes a `Position`, which carries no move list at all, and this gate verified that **castling, the en-passant square, both clocks and the side to move influence ZERO frame bytes**, so a frame is a pure projection of the 64 on-board squares and has no game-length denominator to carry. **TWO STRUCTURES IN THE NUMBERS, one of them ATTRIBUTED rather than guessed at:** Unicode costs **1.80–1.83x** ASCII (the Engineer's "roughly 2x" — this gate reads slightly lower and says so), and **black-bottom costs ~0.10–0.13 µs more than white-bottom on every cell**, which is **not noise** — measured in isolation, `src/render.ts:146`'s `[...FILE_LETTERS].reverse().join("")` on the black-bottom path costs **+0.112 µs/frame** against the bare constant, accounting for essentially the whole delta. Irrelevant at 240x headroom and recorded only so a later reader does not mistake it for a regression. **`NFR-002`'s WRITE half is UNTOUCHED and remains the half nobody has measured — still `UNKNOWN - verify`, still `ABC-018`'s.** The bounded-pane compute and the status-panel compute are likewise untouched. **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** — this project's standing rule; the microseconds live here, with their machine. **`NFR-001`, `NFR-003`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are BYTE-IDENTICAL; `NFR-002`'s target, its `Applies to` cell, its boundary condition, its three ply counts and every prior measurement are byte-identical — only measured evidence was appended.** Previously 2026-08-06 by Security/NFR (task `refinement-deploy-posture-2026-08-06`, subtask `security-nfr-availability-bar`): **THE `99.9%` AVAILABILITY BAR IS RULED NOT APPLICABLE TO THIS PROJECT AND `.grugops/factory.config.json` NOW SAYS SO — NO ROW WAS ADDED, NO ROW WAS DELETED, NO TARGET MOVED AND NOT ONE MEASURED FIGURE WAS TOUCHED.** The owner stated on 2026-08-06 that this project *"currently does not deploy anywhere"* and *"will be used locally for now"*; `nfr.availability` was the third of the three places the substrate still claimed otherwise, and NFR bars are this role's under the owner's standing directive of 2026-08-03. **An availability SLO is a statement about a service being reachable, and this project has nothing that is ever up** — verified here rather than inherited: `package.json` is `private: true` with **no `bin`, no `main`, no `exports` and no `start`**, `src/` holds ten modules and **no entry point**, and nothing in `src/` listens, serves, opens a socket, sets a timer or installs a signal handler; there is **no git remote, no CI and zero release records**. So there is no window, no denominator and **no instrument that could ever have failed the bar** — which makes it not a bar. **This is NOT `UNKNOWN - verify`, and this file keeps those apart:** `UNKNOWN - verify` means the quantity exists and nobody has measured it; here the quantity does not exist. **The key's contract was verified BEFORE the edit** against `agent-factory/config/factory.config.md` — `nfr.availability` is a free-form string with **no allowed-value set**, it is not one of the nine dials in the config-dial contract, **nothing in the kit reads it by name** and nothing parses it (this install has no `scripts/` directory) — so it can honestly carry the ruling; the file still parses and **the diff is exactly one line**. **DELETING the key was REJECTED as the worst option**, on the same ground the Architect gave for `environments` one hop earlier: the kit's zero-config rule reads a documented default on absence, so a deleted `availability` silently reads as `99.9%` again. **`production_requires_human_confirmation` was re-read after the edit and is still `true`.** **The bar is PARKED, NOT DESTROYED — owner Security/NFR, trigger a named condition rather than a milestone** (the first time this project ships something that must be reachable while its user is away from the keyboard; **nothing in `EPIC-001`–`EPIC-006` does that**, and `EPIC-006` is the checkpoint where the question is re-asked because that is where distribution is decided). **THE BOUNDED SECOND QUESTION IS ANSWERED AND THE ANSWER IS NO:** no other row here, and no `RISK-00x` or accepted risk on record, depends on a deploy target or on an environment promotion path existing. **Two rows (`NFR-006`, `NFR-007`) and two ASVS deferrals (`V13.4.1`, `V15.1.1`/`V15.2.1`) depend on DISTRIBUTION, which is a different thing and is NOT relaxed by the local-only posture** — `NFR-007`'s target names `npx`, and checking it surfaced a **TWO-DOCUMENTS-DISAGREE finding that is reported rather than settled: `EPIC-006` states `npx` in four places while `ADR-0007` clause 5 records the distribution mechanism as UNDECIDED** — flagged with both owners (BA/PM, Architect/Design) and **deliberately NOT edited on either side**. **`RISK-002`'s non-M3 spike, `RISK-004`'s redistribution licence and every one-machine `UNKNOWN - verify` marker in this file stand untouched** — *"we deploy nowhere"* must never be read as *"only this machine matters"*. See the two new sections at the end of this file; **`NFR-001` through `NFR-007` are BYTE-IDENTICAL** and no prior measurement, denominator, marker or instrument-limit correction was reflowed or re-opened. Previously 2026-08-04 by Security/NFR (task `ticket-to-pr-ABC-012`, `ABC-012`'s gate): **`ABC-012`'s five numeric bars are RE-MEASURED INDEPENDENTLY AND ALL SIX ARE MET, and NO TARGET MOVED — not one.** The Engineer's figures were **not** inherited, on the standard this column set on `NFR-005`: own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware; population named as the same deterministic LCG game `src/history.test.ts:81-89` plays. **`takeBack(h,2)` 2.46 / 2.45 µs (0.49x of ≤ 5 µs) · `keyHistory` 40.16 / 40.20 µs (0.67x of ≤ 60 µs) · `repetitionCounts` 44.35 / 44.45 µs (0.59x of ≤ 75 µs) · `gameStatusOf` 47.75 / 47.59 µs (0.64x of ≤ 75 µs) · `playMove` 8.6 / 8.2 ns (0.09x of ≤ 100 ns) · `repetitionCounts` @ 300 plies 91.93 / 92.15 µs (0.61x of ≤ 150 µs)**, with growth linear at 17.5 / 44.4 / 92.0 µs over 40 / 120 / 300 plies. **TWO ROWS GAIN REAL-CODE FIGURES AND NEITHER TARGET CHANGES.** `NFR-002`'s boundary-condition block quoted **46–50 µs / 97–102 µs as a WAVE-1 PROTOTYPE's numbers, taken before `src/history.ts` existed**; the module now exists, the quantity is measured on it, and the real code lands **inside the band that block already quoted, 1–8% below it** — the boundary condition itself is untouched and was **verified structurally to still hold: `src/history.ts` has ZERO importers**, so nothing pulled the repetition derive into a frame and the `O(window)` statement stands. `NFR-003` gains `ABC-012`'s derives as a named second component of the **turn** (not the frame), where four derives at ~48 µs are about **0.4% of the 50 ms budget** — compute is not the risk on that row either, and **the unmeasured terminal-I/O half remains the whole risk**. **TWO FENCES TESTED RATHER THAN RESTATED:** `gameStatusOf`'s margin over the bare derive IS one `legalMoves` call plus ~0.6 µs and **swings 1.4x on position** (3.14–3.40 µs startpos-anchored against 4.49–4.55 µs kiwipete-anchored, matching bare `legalMoves` of 2.74 and 3.89–3.96 µs) — **and against expectation the expensive-`legalMoves` anchor is CHEAPER OVERALL (41.89 / 42.25 µs), because the `O(plies)` derive dominates, so the worst generator position is NOT the worst case for the composite**; and the `takeBack` **upper bound** reads **HIGHER** with the restore outside the clock (2.92 / 2.93 µs), the restore's own ~0.017 µs being **below instrument resolution**, so the bar is MET on either framing. **INSTRUMENT-LIMIT CORRECTION, THE SEVENTH THIS FILE HAS RECORDED, and it would have produced a FALSE MISS:** the first `takeBack` cell called `legalMoves` INSIDE the timed region and read **10.38 µs against the 5 µs bar — 2.08x, a MISS**; hoisted out of the clock it reads 2.46 µs, and **no number is claimed from the discarded instrument**. **WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED:** four derives 1–8% lower, `takeBack` agreeing to 0.4%, and **`playMove` 1.5x apart (8.2–8.6 ns against 12.4–12.7 ns) — a difference this gate CANNOT attribute**, both being >7x under the bar. **No wall-clock assertion was added to the suite**, this project's standing rule. **`NFR-001`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are BYTE-IDENTICAL; `NFR-002`'s and `NFR-003`'s targets, levels, denominators, `UNKNOWN - verify` markers and every prior measurement are byte-identical — only measured evidence was appended.** Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, the SECOND risk/NFR gate): **NFR-005's fix cost is RE-GATED and MET, NO TARGET MOVED, and this row now carries two withdrawals rather than one new claim.** Both bar positions re-measured independently against a byte-identical twin used as a **null control by identity** — startpos **296.8–299.3 ns** and kiwipete **304.7–307.4 ns**, both MET with room against the ~450 ns and 432–459 ns bars; the call-count sub-bar re-verified at **ZERO** predicate calls over **437,077** no-ep nodes of a **518,474**-node walk, reproduced to the node on this gate's own spy. **The two guards' cost is BELOW what the whole-key instrument can resolve and no number is claimed from it** — every shipped-minus-pre-guard delta sits inside the twin's own band and the deltas flip sign between two samples. Measured on the predicate in isolation instead: **about +0.9 ns** on the ep-set/no-capture shape, **≤ +0.15 ns amortized** (~0.05% of a ~305 ns key), **23x cheaper** on the invalid-FEN class — consistent with the Engineer's and the design hop's ceilings and **not** confirming their per-cell point estimates. **WITHDRAWN (1): any claim that the worst-case ep spread is settled.** Three protocols on this ticket read 1.385–1.400x, 1.401–1.412x and 1.446–1.458x — about ±4% apart, which is the size of the spread itself. The bar is unaffected; it is anchored at kiwipete/startpos. **WITHDRAWN (2): the "+1.6 ns" per-call estimate for deleting the predicate's own `NO_SQUARE` early return.** It does not survive its own null control — the same benchmark reads +0.9 to +2.9 ns on cells where that delta is structurally zero. Two behaviour-equivalent cost mutants are recorded as **deliberately NOT pinned**, with the reason: no spied call count distinguishes them on any of nine call shapes, one of them costs structurally zero through the only production caller, and the only instrument that could see them (a Proxy board-read counter) **throws outright** on this code without a shim, costs 11.1–13.6x when shimmed, and inflates the un-instrumented readings 2.0–3.0x. Every target, level, marker, amortized row, allocation figure and diagnostic byte-identical; NFR-001/002/003 untouched. Previously 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, the SECOND design hop): **NFR-005's row records the cost of the ruled defect fix, and NO TARGET MOVED.** The fix adds two board-read guards inside `hasLegalEnPassant`; they cost **zero** on the no-ep path and at both anchor positions (structurally — the caller's short-circuit never enters the predicate, so the call-count sub-bar and `src/zobrist.nfr.test.ts` are untouched by construction), **≤ +0.5 ns amortized per node** (under 0.15% of a ~317 ns key), and they are **20–27x cheaper** on the invalid-FEN class they exist for. **The instrument's limit is stated rather than hidden:** two whole-key runs bracket 1.0 from both sides, so that instrument cannot resolve the delta and no number is claimed from it — the isolated predicate figures are the claim. **These are a design hop's numbers, not a gate's, and they are labelled as such: Security/NFR re-gates after the fix and owns the verdict.** The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7, the call-count sub-bar, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, ABC-011's gate): **NFR-005's per-node key cost is MEASURED and MET, and NO TARGET MOVED.** The design hop's figures were re-measured independently rather than inherited — own scripts, own `git archive` baseline of `4c6ed7d`, both trees in one process, interleaved, two samples, on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` elsewhere: **startpos 297.2–298.4 ns and kiwipete 323.5–330.9 ns — the row's own anchor positions — against 1.5x bars of ~450 ns and 432–459 ns, both MET**; worst case 1.385–1.400x, which lands between the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x and so resolves that spread. **One correction, of the same class this file has now made three times before: the "not made slower at all" sub-bar is a CALL-COUNT bar, not a timing bar, and the row did not say so.** No wall-clock run can settle "at all" — this gate's own no-ep timings sit at 1.003–1.007x, inside noise in both directions. The claim is structural (the `epSquare` guard short-circuits, so the majority path executes byte-for-byte what it executed before) and the only instrument that can fail it is a spied call count: **ZERO predicate calls over 260,292 no-ep nodes**, reproduced identically on two independent scripts. **`src/zobrist.nfr.test.ts` now pins it**, because three behaviour-equivalent mutations each left all 189 tests green — the same "a measurement is not a guard" lesson this row already carries for NFR-001. The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, design hop): **NFR-005's row gains the per-node Zobrist key cost, and NO target moved.** `ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a key per node, so the key is the one component of a search node this catalog can price before a search exists — and `ABC-011`'s design hop put a legality question inside that function, which makes the number owed here rather than only on the ticket. **Unlike the 2026-07-31 edit to NFR-001, a benchmark WAS run for this one** — against merged `src/` with a prototype outside the repository, interleaved against merged code in the same process, on Apple M3 / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` anywhere else: **1.014–1.022x per node amortized**, **1.00–1.07x at `kiwipete`/startpos** (the row's own anchor positions, both of which carry no ep square), 1.45–1.48x on the 1.87% of nodes with an ep capture available, +2.3 B/call confined to that shape. The rejected `legalMoves` shape measures 1.979x and would break `ABC-011`'s bar. **The denominator is named, because this file has learned that lesson three times already: the amortized figure is over a 120,000-node pool at the perft table's natural en-passant frequency, NOT a search's node distribution, which stays `UNKNOWN - verify` until `EPIC-004` exists.** The depth-in-budget target, its two levels, the PROVISIONAL marker on depth 7 and every demoted node-rate diagnostic are byte-identical. NFR-001, NFR-002, NFR-003 and every other row untouched. Previously 2026-08-01 by Security/NFR (task `ticket-to-pr-ABC-020`, ABC-020's gate): **NFR-001's three `gameStatus` bars are MEASURED and MET; no target moved and no number was invented.** The row's `UNKNOWN - verify` on those three bars is discharged with the figures, their call shapes and their machine. One correction, of the same class this file already made twice: **the 1.5x / 3.78 µs bar is a START-POSITION number and the row did not say so** — `gameStatus` is dominated by its one `legalMoves` call, so it costs 2.1 µs at startpos and 5.3 µs at kiwipete, on the merged tree as well as this branch. The bar now carries its position, exactly as NFR-005 carries `kiwipete`/`position-6` and NFR-002 carries its window. The ≥ 1,000,000 nodes/sec target, the 6.04M–6.21M measurement and the denominator fence are byte-identical. Previously 2026-07-31 by Architect/Design (task `ticket-to-pr-ABC-020`, design hop): **NFR-001 gains its second consumer and no target moved.** The row applied only to the generator and was verified only by `npm run perft`, which never calls `gameStatus` — so ABC-020's three leaf-cheapness bars had no home in this catalog at all. They are named now with their owner (ABC-020 A10), their machine, and `UNKNOWN - verify`; **no figure was invented and no benchmark was run for this edit.** The ≥ 1,000,000 nodes/sec target, the 6.04M–6.21M measurement and the denominator fence are byte-identical. Previously 2026-07-30 by Architect/Design (**second NFR-002 edit that day, and the target is still < 16 ms** — the ply-count denominator the first edit named is **CORRECTED to a bounded window**, because BA/PM's epic amendment `[A2]` bounds the SAN history pane to 8 move pairs and makes the frame O(window). What is in a frame, the compute/write split and the recorded measurement are all kept; the measurement is **relabelled as history** because it measured the unbounded panel EPIC-002 will no longer ship, and the bounded pane's own compute is **`UNKNOWN - verify`** — no number for it exists and none was invented. See the CORRECTED block in the NFR-002 section below. Earlier the same day: NFR-002 made verifiable during EPIC-002's decomposition — **target unchanged at < 16 ms**; the row gained what is in a frame, a named denominator, the compute/write split, and the measured compute half with its machine. Also earlier the same day: NFR-005 rewritten to the depth-in-budget target ratified in ADR-0003 clause 2 **as amended** by Olger Oeselg on 2026-07-30 — named positions, floor 6 FAIL / target 7 WARN, depth 7 provisional pending EPIC-004's non-M3 spike; node rate demoted to a diagnostic. NFR-001 and NFR-003 untouched. Previously 2026-07-29: corrected NFR-005 against measurement; fenced NFR-001's denominator; NFR-003 partly verifiable. Seeded 2026-07-24.)_

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
| NFR-001 | Performance | Move generation throughput **≥ 1,000,000 nodes/sec** on perft, current-gen laptop. **Second consumer, added 2026-07-31: `gameStatus` at a search leaf** — `legalMoves` calls per `gameStatus` **exactly 1**, `zobristKey` calls **at most 1**, and **`gameStatus(startpos, emptyMap)`** within **1.5x of its measured 2.52 µs** (ABC-020's bars, ABC-007's standing note). **The 1.5x bar's denominator is the START POSITION and is not an absolute ceiling on `gameStatus`** — see the `Verified by` cell and the section below | Legal move generator — the search hot path (EPIC-001) — **and `src/gameend.ts`, which every search leaf and every ply of ABC-019's loop calls** | `npm run perft` nodes/sec (ABC-006). **MET** — re-measured 2026-07-29 at 6.04M–6.21M over five runs (M3, Node v24.12.0); the earlier `~6.2M` was the top of that range. **Denominator fence: 97.3% of the nodes this counts are free leaves**, so it measures generation-with-free-leaves and is **never** evidence for NFR-005 — see below. **`npm run perft` is NOT the oracle for the gameStatus half and must never be quoted as one:** `src/perft.ts` imports `apply`, `legal`, `moves` and `position` and never calls `gameStatus` or `zobristKey`, which is the gap QE's 2026-07-31 conformance audit existed to cover. **The three `gameStatus` bars are MET — measured 2026-08-01 at ABC-020's Security/NFR gate on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64, and `UNKNOWN - verify` on any other hardware.** Call counts **spied** (instrumented throwaway copies of `legal.ts` + `zobrist.ts` outside the repo, `gameend.ts` `cmp`-verified byte-identical), timings interleaved against the pre-ABC-020 tree `65cb789` **in one process**: **`legalMoves` = 1 across sixteen call shapes** (bare / empty map / 3-4-5 occurrences / clock 100-149-150 / checkmate / stalemate / thin material / kiwipete), **`zobristKey` ≤ 1** — exactly 1 when the counts map is consulted, **0** when the caller is bare and 0 when a cheaper branch decides — and **`gameStatus(startpos, emptyMap)` 2.13–2.26 µs**, i.e. **0.56x–0.60x of the 3.78 µs bar** and **0.98x–1.01x of the same measurement on merged code**. Measured independently twice: by the Engineer (2.17–2.24 µs) and at the gate. **DENOMINATOR, added 2026-08-01: the 3.78 µs bar is a startpos figure.** `gameStatus` is dominated by its one `legalMoves` call, which costs 2.1 µs at startpos and 3.2 µs in a middlegame, so **`gameStatus(kiwipete, emptyMap)` measures 5.30–5.47 µs on this branch and 5.29–5.85 µs on the merged tree** — 1.4x the "bar" on *both*, which is why the machine-independent quantity to read is the **ratio to the same position on the baseline tree (0.94–1.01)**, never the absolute µs. The **call-count** bars must be spied, not inferred: two Zobrist reads instead of one shared read is invisible to every value assertion. **That is no longer a warning without teeth — `src/gameend.nfr.test.ts` (added 2026-08-01 at the gate) pins all three bars as spied assertions.** It was written because three mutations of `src/gameend.ts` — a second `legalMoves()` call, two `zobristKey` reads instead of the shared local, and the 150-ply clock check moved below the fivefold check — each left all 45 tests in `gameend.test.ts` green; each now fails exactly one of its three assertions. Design behind the shape: the ABC-020 design hop of 2026-07-31 (`ticket-to-pr-ABC-020`, note `…-architect-design-decision-f95614ca`) — the added work is four integer comparisons and no new call, and state (c) allocates exactly what the merged code allocates today (measured at the gate: **1.33 B/call on both trees** over 1M-call windows, indistinguishable) **RE-MEASURED AND MET AT `ABC-009`'s SECURITY/NFR GATE 2026-08-09, AND THE PER-CELL QUESTION THAT DEFEATED THE PERFT INSTRUMENT IS RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT. NO TARGET MOVED.** `ABC-009` adds two identity guards to `addCastlingMoves` in the search hot path. The Engineer's figures were **RE-DERIVED, not inherited**, and QE explicitly declined to re-derive: own harness outside the repository, three trees in ONE process — pre-fix (`main`, `moves.ts` `fb4fa40934e768dffeaeed0b43548842`), delivered (`0e247853ab2c05887c76105ff83d8621`) and a **BYTE-IDENTICAL TWIN as a NULL CONTROL BY IDENTITY**, the twin `cmp`-verified equal on all thirteen non-test files and `pre` verified to differ from `post` in `moves.ts` **and nothing else** — 12 rounds with round 0 discarded, tree AND cell order rotated every round, `parseFen` hoisted out of every clock, medians of per-round rates, checksum 409,605,192 nodes per sample, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` elsewhere**. **FLOOR: 6,030,518 / 6,136,238 / 6,117,496 nodes/sec against ≥ 1,000,000 — MET, ~6.1x.** **RATIO: aggregate post/pre 1.0062 and 0.9967 against ≥ 0.98 — MET on both samples**, worst single cell 0.9863. Deep lane **32/32 exact in 38.49 s** (third independent run; 36.93 s Engineer, 38.35 s QE). **THE INSTRUMENT'S OWN FLOOR IS WORSE THAN THIS FILE HAS RECORDED, AND THAT IS THE TENTH INSTRUMENT-LIMIT CORRECTION HERE:** the Engineer put the per-cell floor at ~±1%; this gate measures **±2.0% per cell** (identity twin, position-5) and, newly characterised, an **AGGREGATE floor of ~±1%** (twin 1.0096 / 1.0087, and three of four aggregate twin readings across two gates near **+0.9%** — a SYSTEMATIC favouring whichever tree loads last, which this gate **CANNOT ATTRIBUTE**). The bar's whole margin is 2 points, so "the margin exceeds the resolution" holds by about **2x**, not comfortably. Per-cell instability shown the hard way: kiwipete reads **0.9930 / 0.9967** (Engineer) against **1.0228 / 1.0052** (here) — four readings of one cell spanning 0.993–1.023. **THE RESOLUTION, AND IT IS THE SAME MOVE THIS FILE ALREADY MADE FOR `NFR-005`'s CALL-COUNT SUB-BAR: count instead of time.** Over the exact `npm run perft` population the two added lines execute **198,175 times each = 396,350 total** across 11,377,922 counted nodes, and **REJECT NOTHING IN ANY CELL (0 failures out of 198,175 each)** — confirming empirically, over 11.4M nodes, the structural fact that `makeMove` only ever CLEARS a right (`src/apply.ts:142`), so a held right in a reachable position implies both pieces are home; `position-3` and `position-6` execute them **ZERO** times. Isolated on an exported `addCastlingMoves` (which removes perft's ~35x dilution), the pair costs **+1.30 / +1.73 ns per call** on startpos against a null-control floor of **±0.22 ns** — RESOLVED, ~**0.33–0.43 ns per execution** — while the structurally-zero cell reads +0.24 / +0.33 ns. **ARITHMETIC over the measured count and the measured per-execution cost, LABELLED ARITHMETIC AND NOT A MEASUREMENT: 0.131–0.170 ms on a 1.854–1.887 s sweep = 0.0070%–0.0091%, so the TRUE post/pre ratio is ≈ 0.9999 and kiwipete's TRUE ratio is ≈ 0.9998** — the 0.9930 reading is ~35x the true deviation. Robust to a 10x error in the multiplier (0.085%, still 20x inside the bar). **So `ABC-009` costs about 0.01% of this row's figure and the Engineer's "kiwipete is not a regression" is now positively established rather than merely unrefuted.** **DENOMINATOR FENCE RE-DERIVED INDEPENDENTLY: 321,193 of 11,377,922 counted nodes generate, so 97.18% are free leaves** — this file's 97.3% reproduced to within 0.1 points on a different instrument. **GUARD ORDERING, routed to this gate by QE as gate-unverifiable, is ADJUDICATED: the five guards are a CONJUNCTION of side-effect-free predicates over an unmutated position, so the emitted move set is PERMUTATION-INVARIANT** — measured, three reorderings × 33 FENs = 99 comparisons with **zero divergence** at `generateMoves`, at `legalMoves` and on purity, and all six exact perft counts holding for every variant. Ordering therefore affects **cost only**: measured selectivity over the perft sweep is **0.0%** for both added guards (0 rejects) against **17.6%** for the pre-existing empty test and **14.1%** for the through-check, so in exact executions the delivered order is the second-most-expensive of four (above-right 1,284,772 > **delivered 396,350** > below-empty 326,476 > below-through 280,302) — a ~0.003% penalty, far below resolution, **and NO CHANGE IS ASKED FOR**. The placement earns its keep on the other population: on an invalid FEN `addCastlingMoves` costs **522–526 ns pre-fix against 27.9–28.1 ns delivered, ~18x**, because the byte compare rejects **above the attack scan**; moving the guards below the through-check gives all of it back (+481 ns). **`NFR-005` WAS NOT MEASURED AND THE KEY BENCHMARK WAS NOT RE-RUN** — `ABC-009` excludes it STRUCTURALLY and says so explicitly: `zobristKey` → `hasLegalEnPassant` (`src/legal.ts:85-134`) synthesises its own probe and calls neither `generateMoves` nor `legalMoves`, re-read at the source here. **No wall-clock assertion was added to the suite** — this project's standing rule (`src/zobrist.nfr.test.ts:112`); the figures live here with their machine. **The `gameStatus` half of this row, its three bars, the ≥ 1,000,000 target and the 6.04M–6.21M standing band are BYTE-IDENTICAL and untouched** — recorded because one of this gate's three floor runs (6,030,518) sits 0.16% UNDER that band, which is scatter on one run and **does not move the baseline** |
| NFR-002 | Performance | Full board redraw completes in **< 16 ms** (never a perceptible stall). **Target unchanged** — transcribed from EPIC-002, 2026-07-24, and unchanged again by the 2026-07-30 bounded-window correction: that ruling changed the frame's growth characteristic, not the latency budget | **One full frame** of the terminal renderer (EPIC-002): board + rank/file labels + status panel + the **bounded** SAN move-history panel (most recent **8 move pairs = 16 rendered plies**, blank-padded) + the fixed **2-row message region** (`ABC-018` assembles it and it is part of the frame). **CORRECTED 2026-07-30 — the frame is NO LONGER O(plies).** Epic amendment `[A2]` bounds the pane, so the dominant term is **O(window)**: a fixed 16 rendered plies at any game length. **A frame measurement must still state its ply count**, for two reasons the bound does not remove — (i) the pane replays from `initialFen` to the window's first ply, which is **O(plies)** (one `parseFen` plus ~10 ns/ply; measured near-flat at **2.2–3.9 µs across 40–300 plies**), and (ii) O(window) is now the claim under test, provable only by comparing ply counts. **Boundary condition:** `gameStatus` + `repetitionCounts` — i.e. `gameStatusOf`, which **already contains** the `gameStatus` call (`src/history.ts:152`) — is **O(plies)**: **MEASURED on merged code at 20.8 / 48.3 / 95.3 µs at 40 / 120 / 300 plies** (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere; three independent harnesses by three roles agree within 2.1% — see the 2026-08-11 `design-stub-seam-and-nfr002` block below). **THIS IS THE `O(window)` FALSIFIER'S EVIDENCE AND IT IS NOT A BAR OF THIS ROW; NO TICKET MAY TRANSCRIBE IT INTO A TICKET-LEVEL BAR WITHOUT RE-DERIVING ALL THREE PLY COUNTS** — `ABC-019`'s original `≤ 100 µs @ 120 plies` bar was set by transcribing the superseded band below and it could not fail on the wrong build it existed to forbid. ~~46–50 µs @ 120, 97–102 µs @ 300~~ **RETAINED AS HISTORY: a WAVE-1 PROTOTYPE band taken before `src/history.ts` existed. It holds at 120 plies and its 300-ply end is ~7% HIGH — every real reading is 94.4–95.6 µs, i.e. BELOW its 97 lower bound.** The quantity belongs to the LOOP (`ABC-019`), not to a frame — `ABC-016`'s panel calls `isInCheck` directly. **If a renderer ever pulls the repetition derive into a frame, the frame is O(plies) again and this row's O(window) statement is void** | **Still not built. The two halves and the three ply counts stand; what the bound changed is which number is on record.** Measure separately, each carrying its ply count and its machine: **(a) frame COMPUTE** — replay to the window's first ply + `toSan` per **rendered** ply (16, not all) + the board scan + the status panel, at ply counts **40 / 120 / 300** on a game from `startpos`, board half over the standing FENs in `src/perft.test.ts`; **(b) frame WRITE** — the same frame serialized and written to a non-TTY sink, still `UNKNOWN - verify` and still the half nobody has measured, but now **length-independent by construction**, since `4a` makes the frame a constant row count (23 in the reference layout). **The BOUNDED pane's compute is `UNKNOWN - verify`. No measurement of it exists, none is invented here, and BA/PM's ≈ 70 µs is arithmetic over wave 1's per-item figures — a target, not a result.** What would close it: `ABC-017`'s cost test (40 / 120 / 300 plies; bar ≤ 150 µs absolute **and** the three within 2x of each other), which cannot run until `ABC-013` ships `toSan`, which is blocked on ADR-0004's ratification. **RETAINED AS HISTORY — it measured the UNBOUNDED panel, which will not be built:** 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64, full-history derive **171–176 µs @ 40 plies, 517–533 µs @ 120, 1,272–1,318 µs @ 300** = 1.1% / 3.3% / 8.2% of the budget, two runs. It survives as an **upper bound** on any bounded pane and as the source of the still-valid per-item figures (`toSan` **4.31–4.45 µs** computing its own legal list, **0.10–0.11 µs** when the caller supplies it). Board, status panel, message region and terminal I/O remain **unmeasured**; every figure is one machine and one Node version, `UNKNOWN - verify` elsewhere. Design behind the shape: ADR-0002 clause 2 (derive, don't maintain) and ADR-0004 (**proposed** — SAN derived per frame, not cached), whose clause-3 first response *"render only the visible window"* `[A2]` pre-adopts. **THE BOARD-SCAN HALF OF (a) IS MEASURED AND MET — added 2026-08-07 at `ABC-014`'s Security/NFR gate, and NO TARGET MOVED.** `src/render.ts` now exists, so the one item in this row's `(a)` list reading "the board scan" is no longer unmeasurable. **The Engineer's figure was RE-MEASURED rather than inherited** (own harness outside the repository, its own process, a discarded warm-up round, 11 rounds with the cell order rotated every round, medians of per-round means, two fully independent samples, **`parseFen` outside the timed region**, checksum against elision), on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**: **worst cell 2.092 / 2.056 µs per frame against the ≤ 500 µs bar — 0.0042x, ~240x headroom, MET**, across all 24 cells of (6 standing perft FENs × 2 glyph modes × 2 orientations); best cell 0.955 / 0.980 µs; the two samples agree to 1.7% and select the same worst and best cell. **The Engineer's 2.070 µs is BRACKETED by this gate's two samples — reproduced, not carried forward.** **THE BAR'S POPULATION DOES NOT CONTAIN THE MODULE'S WORST CASE, so the worst case was measured separately as a fence:** a **fully-occupied 64-piece board** (no empty-square short-circuit; unreachable through `parseFen`, which requires one king per side) reads **2.322 / 2.342 µs = 0.0047x** of the bar, and the empty board 0.910–1.051 µs. **THE THREE PLY COUNTS DO NOT APPLY TO THIS MODULE AND NO PLY FIGURE WAS INVENTED FOR IT** — structurally, and verified rather than assumed: a `Position` carries no move list, and this gate measured that **castling, the ep square, both clocks and the side to move influence ZERO frame bytes**, so a frame is a pure projection of the 64 on-board squares with no game-length denominator. **A frame from this module is 9 rows × 18 characters, CONSTANT** over the standing FENs, the empty board and the fully-occupied board, in both modes and both orientations — which is the geometry `4a`, `ABC-016`, `ABC-017` and `ABC-018` compose against, and it is 9 of the reference layout's 23 rows. **Black-bottom costs ~0.10–0.13 µs more than white-bottom on every cell and it is ATTRIBUTED, not left as noise:** `src/render.ts:146` builds the black-bottom label row with `[...FILE_LETTERS].reverse().join("")`, measured in isolation at **+0.112 µs/frame** against the bare constant — essentially the whole delta. It is 0.02% of the bar and no change is asked for; it is recorded so a later reader does not read it as a regression. **STILL UNMEASURED ON THIS ROW AND UNCHANGED BY THIS EDIT: the frame WRITE half (`ABC-018`, the half nobody has measured), the bounded-pane compute (`ABC-017`, gated on `ABC-013`/`ADR-0004`), and the status-panel compute (`ABC-016`).** A board scan at ~2 µs is **0.013% of the 16 ms budget**, so compute is not the risk on this row either — as on `NFR-003`, the unmeasured terminal-I/O half remains the whole risk. **No wall-clock assertion was added to the suite.** **THE WRITE HALF — "THE HALF NOBODY HAS MEASURED" — IS MEASURED, AND ITS `UNKNOWN - verify` IS DISCHARGED. Added 2026-08-09 at `ABC-018`'s Security/NFR gate. NO TARGET MOVED.** The Engineer's figures were **RE-DERIVED rather than inherited**, on the standard this column has kept since `NFR-005`: own harness **outside the repository**, its own process, the game replay and `parseFen` hoisted **out of every timed region**, the writer built once outside the clock (a session's strategy choice is a startup cost this row does not measure), a **discarded warm-up round**, **11 rounds** per cell, **2,000 iterations** per cell per round, **cell order rotated every round**, medians of per-round means, a checksum against elision, and **two fully independent samples** (two process runs, quoted separately and never averaged), on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**. **DENOMINATOR, re-derived rather than copied: a 23-row frame at `W = 18`, 418 characters serialized — 419 characters and 483 BYTES on the wire in unicode mode, 419 bytes in ASCII mode, 425 characters in place.** The byte figure is new; a character count is not a wire cost when the glyphs are three bytes each. **THE ROW'S OWN DEFINITION OF "WRITE" IS RULED HERE, because the Engineer measured three sinks and explicitly routed the choice to this gate: the row's quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`, and the bar is judged against the MOST EXPENSIVE HONEST READING.** All four instruments are recorded and none is hidden: **in-memory serialization 0.638/0.644 · 0.636/0.635 · 0.648/0.644 µs** (omits the syscall the row's own words require — a floor, not the row); **`fs.writeSync` to `/dev/null` 1.670/1.666 · 1.660/1.650 · 1.674/1.672 µs** (a real `write(2)` that reaches no storage); **`fs.writeSync` to a regular file 2.733/2.772 · 2.714/2.733 · 2.711/2.768 µs** — **the figure this row carries**; and **`fs.writeSync` to a FIFO with a live reader 2.317/2.294 · 2.285/2.285 · 2.302 µs**, which is **`EPIC-006`'s pipe shape** and is recorded beside it rather than as it, because a pipe write's cost includes the READER's scheduling and is a property of the pair rather than of this module. Compute re-measured at **5.998/6.031 · 5.978/6.015 · 6.137/6.046 µs** over 40/120/300 plies. **THE BAR IS THE SUM AND IT IS MET AT EVERY PLY COUNT ON EVERY DEFINITION: 0.0087–0.0088 ms on the reading this row carries, against 16 ms — 0.055% of the budget, about 1,800x headroom;** 0.0066–0.0068 ms on the in-memory floor. **BOTH HALVES ARE FLAT ACROSS 40 / 120 / 300 PLIES**, which is this row's own `O(window)` claim measured at the three ply counts the 2026-07-30 correction mandates rather than inferred. **THE ENGINEER'S FIGURES ARE REPRODUCED EXCEPT ON ONE CELL, AND THE DIFFERENCE IS STATED RATHER THAN SMOOTHED:** compute (5.97–6.07 µs), the in-memory sink and `/dev/null` all reproduce inside this gate's two samples, but the **regular-file cell reads 2.711–2.772 µs here against their 2.43–2.48 µs — about 11% HIGHER, and this gate CANNOT attribute it** (the file target and filesystem are not recorded in their note in enough detail to reproduce); both are >1,800x under the bar, so it moves nothing. **THE IN-PLACE (TTY) PATH, WHICH THE ENGINEER RECORDED AS NOT TIMED, IS NOW TIMED — and the answer is that it costs the same:** in place **1.674/1.661 · 1.669/1.650 · 1.690/1.677 µs** against append **1.655/1.643 · 1.650/1.643 · 1.671/1.660 µs** to the same fd, so the 7 extra characters of cursor-home and erase are **BELOW WHAT THIS INSTRUMENT CAN RESOLVE**. **What a real TERMINAL does with those two sequences remains `UNKNOWN - verify` and is NOT claimed** — it is not observable in-process, and `EPIC-006` is the first place it can be seen. **THE COMPUTE HALF REMAINS A LOWER BOUND AND THAT LIMIT IS CARRIED, NOT DROPPED:** `ABC-016`'s status panel and `ABC-017`'s history pane do not exist and entered as fixed-height stub arrays built OUTSIDE the clock, and `ABC-013`'s SAN derive — the largest item known to be headed for this frame — is not in it at all. **AN UNBOUNDED SUPPLIED STRING IS THE ONE WAY THIS ROW'S BAR CAN BE BUSTED TODAY, and it is measured rather than left as a worry:** `assembleFrame` places no bound on a message item's length, and measured **COLD, first frame, in its own process** (which is the shape of a frame assembled once per ply — a warm micro-benchmark median reads ~5x lower and is the WRONG instrument for this question, recorded as an instrument-limit correction, the ninth on this file's record), one supplied item of **400,000 characters costs 14.1–15.8 ms — the WHOLE 16 ms budget** — and one of 1,000,000 characters costs **28.4–41.9 ms, 1.8x–2.6x OVER it**; a short message costs 0.16–0.20 ms. The item COUNT crosses the budget at about **13,000 items** (12,000 → 14.2 ms, 16,000 → 22.1 ms; an ambiguity list is bounded by the ~218 legal moves of a position and costs 0.13 ms). **No bound is asked for HERE** — nothing supplies this input until `EPIC-003`, and inventing one now is the unrequested flexibility `AGENTS.md` rule 7 forbids — but the number is handed forward so `EPIC-003` has a bar rather than a feeling. **`NFR-007` IS TOUCHED AND ITS TARGET DID NOT MOVE:** the ticket's *"nothing here may block on I/O beyond the single write"* is verified on this gate's own counter — **exactly ONE `write` call per frame across 21 adversarial inputs × 2 modes × 2 strategies, 84 frames, 84 writes**. **STILL UNMEASURED ON THIS ROW AND UNCHANGED BY THIS EDIT: the bounded-pane compute (`ABC-017`, gated on `ABC-013`/`ADR-0004`) and the status-panel compute (`ABC-016`).** **No wall-clock assertion was added to the suite** — this project's standing rule (`src/zobrist.nfr.test.ts:112`); the microseconds live here, with their machine. **THE STATUS-PANEL COMPUTE — NAMED "STILL UNMEASURED" TWICE ABOVE — IS MEASURED AND MET. Added 2026-08-12 at `ABC-016`'s Security/NFR gate. NO TARGET MOVED and no earlier block is rewritten; the two sentences above are left standing as the record of what was true at the `ABC-014` and `ABC-018` gates.** The ticket's own bar is `NFR-002` in three parts: **panel compute ≤ 25 µs at each of 40 / 120 / 300 plies**, **the three within 3x**, and **`A13`'s spied call counts, which is the part that actually binds**. **RE-DERIVED ON THIS GATE'S OWN INSTRUMENT AND DELIBERATELY NOT INHERITED** — neither the Engineer's (5.68 / 8.07 / 9.94 µs) nor QE's (5.66 / 8.21 / 10.06 µs) was reused; harness **outside the repository** importing the worktree's `src/` read-only, population **`ABC-012`'s own deterministic LCG game from startpos** re-implemented over the core's primitives (asserting the realised ply count, so a game that ended early could not silently weaken a cell), `status` evaluated **once per history OUTSIDE the clock** because the ticket makes it an INPUT, `parseFen` **inside** the timed region where `lastMoveSan` actually pays it, 11 rounds × 2,000 iterations, round 0 discarded, **cell order rotated every round**, medians of per-round means, a checksum against elision, and **two fully independent samples quoted separately and never averaged**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** — **`UNKNOWN - verify` on any other hardware**. **PANEL COMPUTE 5.665 / 8.171 / 10.049 µs and 5.723 / 8.196 / 10.027 µs at 40 / 120 / 300 plies: worst cell 10.049 µs against the 25 µs bar = 0.402x, MET; spread 1.774x and 1.752x against the 3x bar, MET.** Both samples reproduce the Engineer's and QE's figures to within **1.7%**, which is a statement about the instrument as much as about the panel — three independently written harnesses by three roles now agree on this quantity. **PART 3, THE PART THAT BINDS, WAS RE-SPIED OUT OF TREE ON AN INSTRUMENTED COPY** (the worktree never written; every patch asserted to apply exactly once, and an ARMED-SPY positive control run before any zero was believed — QE's `failed-attempt` lesson that a zero meaning "nothing ran" is indistinguishable from "nothing happened"). **`A13`'s rewritten two-term scan clause HOLDS AT EVERY REGIME, INCLUDING PLY 0: `squareAt` = 64 on the empty history and 64 + the anchor's occupied squares from the first move on — verified at depths 0,1,2,3,4,5,6 on BOTH a 32-piece and a 3-piece anchor (14 of 14 cells), and additionally at seven MOVE-TYPE regimes the criterion does not name** (castle, promotion, en-passant, capture, checking last move, mating last move, disambiguated last move) — **all HOLD**. `gameStatusOf` / `repetitionCounts` / `keyHistory` / `gameStatus` = **0 everywhere**; `toSan` = 1 (0 on the empty history); the `isInCheck` **direct** half = 1 at ply 0 on both anchors and the **difference** half = 1 at depths 2,3,4,5 on both anchors. **The two-term sum is STRUCTURALLY COMPLETE and that was checked rather than assumed:** the only production callers of `squareAt` are `fen.ts:90` (`parseFen`, one per occupied square — the replay term), `fen.ts:193` (`toFen`, not on the panel's path), `render.ts:133` (`ABC-014`'s board scan) and `status-panel.ts:129` (the 64) — and `grep -c squareAt src/apply.ts` is **0**, so `makeMove` cannot contribute at any depth. **THE `O(window)` BOUNDARY CONDITION SURVIVES THIS TICKET — the obligation this row homes to Security/NFR at `ABC-016`'s own gate, re-grepped on DELIVERED code rather than inherited:** `src/history.ts`'s **production runtime importers remain ZERO** — `src/status-panel.ts:42` and `src/status-panel.test.ts:33` are `import type` (erased), `src/status-panel.nfr.test.ts` reaches it only through `vi.mock` plus a dynamic `await import()` (test-only), and the single runtime importer is `src/history.test.ts`. Item 7 as originally drafted would have been that importer and would have expired the verification on merge; as delivered the panel replays through `fen.ts` + `apply.ts` and calls the repetition machinery zero times. **`A13` is the ticket's half and does NOT discharge this one; this gate discharged it by `grep`.** **No wall-clock assertion entered the suite** and none was asked for — the microseconds live here, with their machine. **`NFR-001` and `NFR-003`–`NFR-008` are BYTE-IDENTICAL — asserted by hashing every table line before and after this write, not eyeballed; 10 table lines before and after, exactly one row's `Verified by` cell appended to and no target, bar or `UNKNOWN - verify` marker moved.** |
| NFR-003 | Performance | Keystroke echo **< 50 ms**; `moves` command and tab-completion **< 100 ms** | Input prompt and controls (EPIC-003). **Second component, added 2026-08-04: `ABC-012`'s game-history derives**, which `ABC-019`'s turn loop calls two to four times per turn and which sit in the **turn**, not in a frame (see `NFR-002`'s boundary-condition block) | **Still partly verifiable — NOT passed. The target did NOT move.** Compute half measured 2026-07-29: the `moves` command's `legalMoves()` costs 2.1–5.3 µs, ~19,000–47,000x under the 100 ms budget, so compute is not the risk. Keystroke echo and terminal I/O are the other half and stay `UNKNOWN - verify` — no prompt exists; verify by input-latency measurement once EPIC-003 is built. **THE `ABC-012` TURN COMPONENT IS MEASURED AND MET — added 2026-08-04 at `ABC-012`'s Security/NFR gate, where the ticket's five numeric bars were RE-MEASURED independently rather than inherited from the Engineer who built the module.** Own harness outside the repository, its own process doing nothing else, a discarded warm-up round, **11 rounds with the cell order rotated every round**, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**. Population named, because this file has learned that lesson: **one deterministic LCG game from the start position — the same LCG `src/history.test.ts:81-89` plays**, so a ply count means the same thing in the harness and in the suite. **ALL SIX BARS MET WITH ROOM, at 120 plies unless noted: `takeBack(h,2)` 2.46 / 2.45 µs against ≤ 5 µs (0.49x); `keyHistory` 40.16 / 40.20 µs against ≤ 60 µs (0.67x); `repetitionCounts` 44.35 / 44.45 µs against ≤ 75 µs (0.59x); `gameStatusOf` 47.75 / 47.59 µs against ≤ 75 µs (0.64x); `playMove` 8.6 / 8.2 ns against ≤ 100 ns (0.09x); `repetitionCounts` @ 300 plies 91.93 / 92.15 µs against ≤ 150 µs (0.61x).** Shape row, no bar: 17.57 / 17.48 µs @ 40 plies. **THE HEADLINE FOR THIS ROW: four derives at ~48 µs each is about 0.4% of the 50 ms turn budget — roughly 260 turns' worth of derives would be needed to spend one keystroke budget.** Compute is not the risk here either; **the unmeasured terminal-I/O half remains the whole risk on this row and no figure for it exists.** **TWO FENCES, both TESTED at that gate rather than restated.** (i) `gameStatusOf`'s margin over `repetitionCounts` **IS** the one `legalMoves` call inside `gameStatus` plus ~0.6 µs, and it is **POSITION-DEPENDENT to 1.4x** — 3.40 / 3.14 µs startpos-anchored against 4.55 / 4.49 µs kiwipete-anchored, matching bare `legalMoves` of 2.74 µs and 3.89–3.96 µs — **but the expensive-`legalMoves` anchor is CHEAPER OVERALL (41.89 / 42.25 µs), because the `O(plies)` derive dominates**, so the worst generator position is not the worst case for the composite. The arithmetic worst case over the observed extremes is ~49.0 µs = 0.65x of the 75 µs bar, and it is **labelled as arithmetic, not as a measurement**. (ii) The `takeBack` figure is an **upper bound** by construction (its two restoring `playMove` calls sit inside the timed region); measured with the restore **outside** the clock it reads **HIGHER**, 2.92 / 2.93 µs, because that variant pays cold-object cost — the restore's own contribution is ~0.017 µs, **below what the instrument can resolve**, so the bound is tight to within less than it can see and **the bar is MET on either framing**. **AN INSTRUMENT-LIMIT CORRECTION, the seventh this file has recorded, and it is recorded rather than buried because it would have produced a FALSE MISS:** the first `takeBack` cell called `legalMoves` **inside** the timed region and read **10.38 µs against the 5 µs bar — 2.08x, a MISS**; two generator calls at 2.7 µs each account for ~5.4 µs of it, the restoring moves are fixed across iterations, and hoisted out of the clock the cell reads 2.46 µs. **No number is claimed from the discarded instrument.** **WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED:** the four derives read 1–8% lower here, `takeBack` agrees to 0.4%, and **`playMove` is 1.5x apart (8.2–8.6 ns against the Engineer's 12.4–12.7 ns) — a difference this gate CANNOT attribute**, the Engineer's harness shape not being recorded in enough detail to reproduce; both are >7x under the bar, so it moves nothing. **Every bar is MET on two independently written harnesses. NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** — this project's standing rule; the microseconds live here, with their machine. **`NFR-003`'s target, its two clauses and its `UNKNOWN - verify` on the I/O half are byte-identical; nothing on this row moved.** |
| NFR-004 | Performance | Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty | Engine move search (EPIC-004) | `UNKNOWN - verify` — not built yet; verify by wall-clock over a fixed position suite. Depends on NFR-005 |
| NFR-005 | Performance | **Depth-in-budget on the standing benchmark positions `kiwipete` and `position-6`** — at default difficulty the search completes **≥ depth 6** within the 3 s budget and never exceeds the 5 s ceiling (**below depth 6 = FAIL**), and reaches **depth 7** within that same 3 s budget (**below depth 7 = WARN**; the depth-7 level is **PROVISIONAL** pending non-M3 measurement). Node rate is a **diagnostic, not the target** | Engine search loop (EPIC-004) | **Target ratified in ADR-0003 clause 2 AS AMENDED by Olger Oeselg on 2026-07-30** — amendments: named positions / two levels / provisional depth 7. Depth-in-budget on target hardware is `UNKNOWN - verify`, and **the provisional obligation has a home: EPIC-004's own timeboxed spike (RISK-002's mitigation) measures depth-in-budget on non-M3 target hardware, and that spike is the verification that LIFTS the PROVISIONAL marker from the depth-7 level.** Until it reports, a depth-7 miss on slower hardware may be the machine rather than a regression. Measured 2026-07-30 on M3 / Node v24.12.0 / darwin-arm64 (ADR-0003; alpha-beta-shaped model at EBF 6, leaves evaluated not generated): `kiwipete` reaches **depth 7 in 0.39–0.68 s** and depth 8 inside the 5 s ceiling at leaf-eval costs 134 ns–1,097 ns; `position-6` reaches **depth 7 in 0.644 s** at 1,097 ns — both levels clear on this machine. **Node rate DEMOTED to a diagnostic (not deleted), each figure carrying its node definition, position and machine:** **163k–351k/sec** — ABC-008 metric B (every node, leaves included, calls `legalMoves()`), kiwipete d3/d4 + startpos d4, M3, 2026-07-29; **207k/sec kiwipete, 546k/sec startpos** — same metric B by the reciprocal of one `legalMoves` call, M3, 2026-07-30; historical proxy **2,639,455/sec** — the ABC-008 spike, **no legality filtering at all**, M3: a proxy for the engine, never a measurement of it. **The old ≥ 500,000 nodes/sec target is RETIRED** as underived and untestable — the same merged code measures 207k–6.1M/sec on the node definition alone. **PER-NODE KEY COST, added 2026-08-02 at `ABC-011`'s design hop — the target did NOT move and no benchmark of the search was run (none exists).** `ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a `zobristKey` **per node**, so the key's cost is the one component of a search node this catalog can price before a search exists. `ABC-011`'s design hop ruled that the en-passant component enters the key only when a **legal** ep capture exists, which puts a legality question inside that function, and measured the consequence against merged `src/` with a prototype **outside the repo** (Apple M3 / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on any other hardware; interleaved forward and backward against merged code in the same process): **1.014–1.022x per node amortized** over a 120,000-node pool collected from the `src/perft.test.ts` table at its natural en-passant frequency, **1.00–1.07x at `kiwipete` and startpos** — the two positions this row's depth-in-budget target is anchored on, **both of which carry no ep square** — and **1.45–1.48x** on the 1.87% of pooled nodes where an ep capture is actually available. Allocation **+2.3 B/call confined to that same shape**, against the ~5 B/call of `bigint` intermediates merged `zobristKey` already allocates. **The rejected implementation shape is the one to keep out: computing availability via `legalMoves` measures 1.979x per node amortized and breaks `ABC-011`'s 1.5x bar outright.** Under depth-in-budget a cheaper node buys depth, so this is 1.4–2.2% of per-node cost spent on a key that means what FIDE 9.2.3 says — **the denominator is the pooled node population described above, not a search's node distribution**, which is `UNKNOWN - verify` until `EPIC-004` exists **MEASURED AND MET AT `ABC-011`'s SECURITY/NFR GATE 2026-08-02/03 — the per-node key cost above is discharged with independent figures, and NO TARGET MOVED.** The design hop's numbers were re-measured rather than inherited, with this gate's own scripts and its own `git archive` baseline of `4c6ed7d`: both trees imported in ONE process, 300,000 iterations per cell after a 50,000 warm-up, every cell interleaved forward AND backward, two samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64** and `UNKNOWN - verify` on any other hardware. **`zobristKey` at the two positions this row's depth-in-budget target is anchored on, both of which carry no ep square: startpos 297.2–298.4 ns against a 1.5x bar of ~450 ns, and kiwipete 323.5–330.9 ns against a 1.5x bar of 432–459 ns — BOTH MET WITH ROOM.** Worst-case per-call shape (ep square set AND a legal capture available) **1.385–1.400x**, inside the 1.5x bar; the sparse divergence FEN 1.759–1.766x, which is not a bar position and whose absolute cost (261 ns) is *below* this row's own anchor value. **The three-run spread is resolved rather than left open:** the gate's 1.385–1.400x lands BETWEEN the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x, so three independently written runs agree on the shape. **DENOMINATOR CORRECTION, and it is the fourth time this file has had to make one of this class — the sub-bar is a CALL-COUNT bar, not a timing bar.** `ABC-011`'s `NFR-005` trigger says the no-ep-square path is *"not made slower at all"*. **No wall-clock measurement can settle "at all"**: this gate's own timings put the shipped tree at 1.003–1.007x of baseline on a no-ep position, which is inside noise in both directions and is therefore evidence of nothing. The claim is **structural** — on a no-ep node `position.epSquare !== NO_SQUARE` is false, the `&&` short-circuits, and the executed work is byte-for-byte what the pre-`ABC-011` tree executed — and the only instrument that can FAIL it is a spied call count. Measured that way over a depth-3 walk of all six perft roots: **277,955 nodes hashed, 17,663 carrying an ep square, 17,663 predicate calls, ZERO on the 260,292 no-ep nodes, never more than one per call** — reproduced identically by the Engineer and by this gate on separate scripts. **A measurement is not a guard, and this row has now learned that twice: `src/zobrist.nfr.test.ts` (added 2026-08-03 at the gate) pins the sub-bar as spied assertions**, exactly as `src/gameend.nfr.test.ts` pins NFR-001's three bars. It was written because three mutations of the shipped code — reordering the guard, dropping the guard, and deleting the predicate's own `NO_SQUARE` early return — are behaviour-EQUIVALENT (they change no key on any input) and each left all 189 tests green, so no assertion about a returned key could ever fail them; each now fails an assertion in that file, and each was proven to fail rather than assumed to. **As in `gameend.nfr.test.ts`, NO wall-clock assertion belongs in the suite** — it would be a test that passes or fails on the machine that runs it; the nanoseconds live here, with their machine. **Allocation and the 1.014–1.022x amortized row above were NOT re-measured at this gate** and remain the design hop's, `UNKNOWN - verify` on other hardware; the amortized denominator is still the pooled perft population and NOT a search's node distribution, which stays `UNKNOWN - verify` until `EPIC-004` exists. **THE SECOND DESIGN HOP'S FIX COSTS NOTHING HERE — added 2026-08-03, and NO TARGET MOVED.** `ABC-011` re-entered `In Design` to rule a defect fix, and the ruled fix adds two board-read guard conditions inside `hasLegalEnPassant`. **Zero on the no-ep path and at both anchor positions, structurally rather than by timing:** the caller's `epSquare !== NO_SQUARE` short-circuit never enters the predicate, so the call-count sub-bar above and `src/zobrist.nfr.test.ts`'s zero-call assertion are untouched by construction — the guards live in the callee. Measured on the predicate in isolation, 2,000,000 iterations per cell, interleaved (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere): **+0.9 to +3.0 ns per call** on the 15.70% of nodes carrying an ep square = **≤ +0.5 ns amortized per node**, under **0.15%** of a ~317 ns key; and **20–27x cheaper** (5 ns against 111–134 ns) on the invalid-FEN class the fix exists for, where the guard returns before the make/unmake. **The instrument's own limit is stated rather than hidden, the fifth time this file has had to:** two whole-key benchmark runs put the amortized ratio at 0.9815–0.9948 and 1.0383–1.0454, bracketing 1.0 from both sides, so a whole-key run **cannot resolve** a sub-0.15% delta and no number is claimed from it — the isolated figures are the claim. **These are a design hop's numbers, not a gate's: Security/NFR re-gates after the fix lands and owns the verdict.** **RE-GATED AND MET AT `ABC-011`'s SECOND SECURITY/NFR GATE 2026-08-03 — the fix's cost is discharged with this gate's own figures, NO TARGET MOVED, and the design hop's per-cell point estimates are NOT confirmed.** Re-measured independently: **FOUR trees imported in ONE process — merged `4c6ed7d`, pre-guard `584defa`, shipped, and a BYTE-IDENTICAL TWIN of the shipped tree as a NULL CONTROL BY IDENTITY** — 15 rounds × 100,000 iterations per cell with rotated tree AND cell order and medians, two full samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **BOTH BAR POSITIONS MET WITH ROOM: startpos 296.8–299.3 ns against the ~450 ns bar (1.004–1.008x of merged), kiwipete 304.7–307.4 ns against the 432–459 ns bar (0.993–0.999x of merged).** **The CALL-COUNT sub-bar is MET and re-verified on this gate's own spy — a copy of `zobrist.ts` whose body differs from the shipped file by ONE import specifier and nothing else, over a walk whose roots and depths were read out of `src/perft.test.ts` rather than recalled: 518,474 nodes hashed, 81,397 carrying an ep square (15.70%), 81,397 predicate calls, ZERO on the 437,077 no-ep nodes, never more than one per call, and `zobristKey` pure at every node.** Reproduced to the node. **THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST AND NO NUMBER IS CLAIMED FROM IT — the sixth instrument-limit correction this file has had to record, and the reason the correction is trustworthy this time is that an identity twin caught it rather than an argument.** Every shipped-minus-pre-guard whole-key delta sits inside the twin's own per-cell band, and the deltas **flip sign between this gate's two samples** (startpos −0.69 then −3.24 ns; kiwipete −1.54 then −7.25 ns). Measured instead on the predicate in isolation, in a process that does nothing else — no Proxy probe, no equivalence sweep, both of which are known on this ticket to poison inline caches — 21 rounds × 500,000 iterations, where the identity twin reads ±0.04 ns on the tight cells: the guards cost **about +0.9 ns** on the ep-set/no-capture shape = **≤ +0.15 ns amortized per node** at the measured 15.70% ep frequency, about **0.05%** of a ~305 ns key; **below resolution** on the shapes where a capture exists; and **23x cheaper (123.4 → 5.4 ns)** on the invalid-FEN class the guards exist for. **That is consistent with the Engineer's ≤ +0.41 ns and the design hop's ≤ +0.5 ns ceilings and it does NOT confirm their per-cell point estimates** — on the two cells where the design hop claims +2.4/+2.6 ns this gate's own reading is negative and inside the twin's band, which is evidence of nothing rather than evidence against. **THE WORST-CASE EP SHAPE IS PROTOCOL-SENSITIVE AND NOBODY SHOULD CALL IT SETTLED:** this gate reads **1.401–1.412x**, the first Security/NFR gate read 1.385–1.400x, and a third protocol on this ticket read 1.446–1.458x. Three protocols, three answers inside about **±4%**. **The bar is unaffected — it is anchored at kiwipete/startpos, both at 0.993–1.008x, and the worst-case ep shape is not a bar position** — but this row explicitly does NOT claim that spread is resolved. **TWO BEHAVIOUR-EQUIVALENT COST MUTANTS ARE DELIBERATELY NOT PINNED, and the decision is recorded with its reason rather than left silent:** deleting `hasLegalEnPassant`'s own `NO_SQUARE` early return, and moving both guards inside the `EP_CAPTURE_SIDES` loop. Both survive all 214 tests (verified by running them) and were proved equivalent here over **83,400** inputs (0 answer, 0 key, 0 purity differences). **No spied call count distinguishes either — 0 of 9 call shapes, at the predicate AND through `zobristKey`** (`makeMove`, `unmakeMove` and `isSquareAttackedBy` identical everywhere) — so the instrument `src/zobrist.nfr.test.ts` exists for cannot be pointed at them. **The early-return deletion costs STRUCTURALLY ZERO in production, because `zobristKey` is the ONLY production caller of the predicate and its `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters the callee** — a stronger statement than any nanosecond figure, and the reason no nanosecond figure is quoted for it. **A per-call figure was in fact WITHDRAWN here as unsupportable:** a "+1.6 ns" estimate for the direct no-ep call does not survive its own null control, because this gate's benchmark reads **+0.9 to +2.9 ns on cells where that deletion's delta is STRUCTURALLY ZERO** (an ep square is set, so the deleted branch is never taken) — the cross-tree systematic floor is the same size as the signal. **The only instrument that CAN see these two mutants is a Proxy counting board-index reads, and this gate measured that instrument to be unusable on this code:** a Proxy over the `Uint8Array` board **throws outright** — `TypeError: this is not a typed array`, from `kingSquareOf`'s `board.indexOf` — so it does not even run without a function-binding shim; shimmed it costs **11.1–13.6x**, and its mere presence in the same process inflates the **un-instrumented** readings by **2.0–3.0x**. An instrument that destroys what it measures cannot found a budget assertion. **Owner: Security/NFR at `EPIC-004`**, when a search exists and a per-node budget makes 0.05% worth an assertion. **A CAUTION FOR WHOEVER BENCHMARKS THIS REPO NEXT, since this is the fourth protocol on `ABC-011` to hit the same wall: carry a BYTE-IDENTICAL TWIN as a null control by identity, give the timing run a process of its own, and check the reading on a cell where the delta is structurally zero before believing the reading on the cell you care about.** **The depth-in-budget target, both levels, the PROVISIONAL marker on depth 7, the amortized 1.014–1.022x row, the allocation figure and every demoted node-rate diagnostic are byte-identical; NFR-001, NFR-002, NFR-003 and every other row untouched.** The amortized row was NOT re-derived here — three prior runs agree and a fourth buys nothing this gate needs; its denominator is still the pooled perft population and NOT a search's node distribution, `UNKNOWN - verify` until `EPIC-004` exists. |
| NFR-006 | Cost | Compiled opening book stays **≤ 1 MB** (no published-package bloat) | Opening book artifact (EPIC-005) | `UNKNOWN - verify` — not built yet; verify by compiled artifact size check at build |
| NFR-007 | Performance | `npm run chess` on a completed clone (after `npm install`) to first rendered board in **< 2 s** — *denominator restated 2026-09-19 per `ADR-0018` Decision 4 on the Orchestrator's instruction; was "`npx` invocation to first rendered board … with a warm npm cache"; the `< 2 s` bar is byte-identical and Security/NFR may re-state the wording at the measuring hop* | CLI cold start / packaging (EPIC-006) | **STILL `UNKNOWN - verify` — not measured yet; verify by a timed `npm run chess` end-to-end run on a fresh clone (was: timed `npx` run). THE TARGET IS UNTOUCHED AND NOTHING BELOW DISCHARGES IT.** **ONE COMPONENT OF THE WINDOW BECAME MEASURABLE 2026-08-08 AT `ABC-015`'s SECURITY/NFR GATE, and it is recorded as evidence for a component and NOT as a result for this row.** `ABC-015`'s ticket-level bar — *"the selection performs **zero** filesystem and **zero** process operations; it reads `process.stdout.isTTY` and `process.env` only"* — sits inside this window and is **MET**. **The Engineer's and QE's guard (`src/glyph-mode.nfr.test.ts`) was deliberately NOT cited**: QE had found it blind to `node:fs/promises`, a specifier it did not name, and a guard that fails by omission is not evidence. Re-derived on three instruments, the first **specifier-agnostic by design**: **Node's permission model** (`--permission --allow-fs-read=<dir>`, denying at the binding level below every module mock), proved **ARMED** by four positive controls (`readFileSync`, `fs/promises.readFile`, `execSync`, `existsSync("/etc/locale.conf")` — all `ERR_ACCESS_DENIED`); a **`cmp`-verified byte-identical copy of `src/glyph-mode.ts` alone in an empty directory with no `render.ts` beside it**, which imports and runs and therefore **proves the runtime import closure is EMPTY**; and **165 patched functions** across `fs` / `fs/promises` / `child_process` / `os` / `tty` plus a `node:module` `registerHooks` load recorder. **Across three ambient shapes (`isTTY` absent / true / false): 0 modules loaded, 0 filesystem calls, 0 process calls, 0 bytes written, and 0 wrong answers over 11 selection paths and both entry points.** **AN INSTRUMENT-LIMIT CORRECTION, THE EIGHTH THIS FILE HAS RECORDED, AND IT WOULD HAVE PRODUCED A FALSE MISS:** the first run counted three filesystem calls inside the region — `openSync` / `readSync` / `closeSync` — and they were the **ESM loader reading the module off disk**, i.e. the module **LOAD** and not the **SELECTION**; hoisted out of the region with the counters reset at the boundary, the count is **0**. Same class as the seven before it, and the seventh produced a 2.08x false miss on `ABC-012`. **WHAT THE ONE PERMITTED READ ACTUALLY DOES, MEASURED RATHER THAN ASSUMED, so the bar is not over-claimed:** `process.stdout` is a **lazy getter** whose first touch constructs the stream for fd 1 — `Socket` on a pipe, `SyncWriteStream` on a regular file and on `/dev/null`, `WriteStream` on a real terminal — and it performs **no permission-checked filesystem operation and no child process** in any of the four shapes. The bar is met; *"zero I/O below the JS line"* is a bigger sentence and is **not** claimed. **THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL** (a `python3`-allocated pty, under the permission model): `LANG=en_US.UTF-8` → **unicode**, `LANG=C` → **ascii**, `isTTY` genuinely `true` and genuinely a boolean — every earlier test of that path faked it with `defineProperty`. **THE ENVIRONMENT IS TOUCHED NARROWLY**, measured with a recording `Proxy` on `process.env`: **at most 3 keys** and only `LC_ALL` / `LC_CTYPE` / `LANG`, **stopping at the first set rung**, **0 enumerations** (`ownKeys` never trapped), **0 environment reads at all on a non-TTY sink** (row 3 short-circuits, so on the pipe `EPIC-006`'s end-to-end test uses this module reads no environment variable), and **0 further ambient reads across 8 accessor calls** after the session began. **A DIAGNOSTIC AND EXPLICITLY NOT A BAR — `ABC-015` names no µs bar and says why, and none was invented here:** `selectGlyphMode` **14.1 / 14.3 ns** when the first rung decides and **28.3 / 30.3 ns** when all three locale rungs are walked; `beginGlyphModeSession` **436.6 / 442.7 ns** — 11 rounds × 200,000 iterations per cell, a discarded warm-up round, medians of per-round means, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**. That is roughly **0.00002%** of this row's 2 s window. **ATTRIBUTION IS PARTIAL AND IS LABELLED PARTIAL RATHER THAN SMOOTHED:** two ambient property reads measure **155.9 / 158.4 ns** in isolation and the closure allocation plus one call **2.9 / 3.2 ns**, which does **not** sum to the 433–445 ns figure — **the residual is NOT attributed and no claim is made about it**. **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** — this project's standing rule; the nanoseconds live here, with their machine. **ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION AND NO NUMBER IS TAKEN FROM IT:** whether the session closure retains an injected `env` object — a `WeakRef` + `--expose-gc` probe reported it reachable after three collections, **and so did the null control with no session created**, so the instrument cannot resolve it (`UNKNOWN - verify`). It is moot in production: `process.env` is a process-lifetime global, so a reference to it retains nothing that was not already retained. **WHAT IS STILL OPEN ON THIS ROW AND IS NOT CLOSED BY ANY OF THE ABOVE: the `npx`-to-first-board measurement itself (`EPIC-006`'s), and the TWO-DOCUMENTS-DISAGREE item recorded here on 2026-08-06** — `EPIC-006` states `npx` in four places while `ADR-0007` clause 5 records the distribution mechanism as UNDECIDED. **Neither was touched by this gate**; owners BA/PM and Architect/Design at `EPIC-006`'s decomposition, unchanged. **[TWO-DOCUMENTS-DISAGREE ITEM CLOSED 2026-09-19 by Architect/Design at `ABC-100` (task `owner-rulings-2026-09-19`, subtask `ruling-abc100-distribution`): the owner ruled the channel — *"1. git clone + npm start works for now"* (Olger Oeselg, in session, 2026-09-19) — `ADR-0018` supersedes `ADR-0007` clause 5 only, and `EPIC-006`'s four `npx` sentences (`:206`, `:222`, `:252`, `:257`) now name `git clone` + `npm install` + `npm run chess`. The measurement itself is STILL OPEN and stays `UNKNOWN - verify`; it is now measurable and the denominator is in the `Target` cell.]** |
| NFR-008 | Performance / cost | **THE DEFAULT TEST LANE'S TOTAL — the number `ABC-026` was cut because this board did not have.** `npm test` with `PERFT_DEEP` unset completes in **≤ 3 s wall-clock** **AND** **≤ 15 s CPU (user + sys)** — **CPU LEVEL 15 s FROM 2026-09-19 ON THE OWNER'S WORD (*"3. raise to 15s for now"*, Olger Oeselg, in session, 2026-09-19; `ADR-0019`); it was 13 s from 2026-08-11 to 2026-09-19 and every "13 s" below in this row is that historical level, retained as written. The WALL clause did not move** — each the **median of ≥ 7 interleaved runs**, one fresh OS process per run, round 0 discarded as warm-up, on the reference machine **Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / npm 11.7.0 / vitest 3.2.7** — **`UNKNOWN - verify` on any other hardware, and the wall clause is a function of CORE COUNT: on 1 core wall ≈ CPU and this lane is already over.** **A breach of EITHER clause is a breach, and each clause exists to bound the other's degenerate optimum — measured, not argued:** `--no-file-parallelism` cuts CPU by **30.1%** and multiplies wall by **2.4x**, so a CPU-only bar is met by making the engineer wait longer; a wall-only bar is met by buying cores. **THE 3 s IS ADOPTED, NOT INVENTED — it is `ABC-026`'s own promotion trigger** (*"promote to `P1` when the default lane passes 3 s"*, written by BA/PM at the cut and endorsed by the Orchestrator at the scheduling hop): the one figure for this quantity that this board had already agreed to. The 13 s is 3 s × the **measured** CPU/wall conversion of **4.15–5.07x** on 8 logical cores, taken at the low end. **THE LEVEL IS RATIFIED — `PROVISIONAL` DISCHARGED 2026-08-11 BY THE OWNER, Olger Oeselg, DIRECTLY AND IN SESSION (*"ratify NFR-008 at 3s wall / 13s CPU"*); the Orchestrator was the CHANNEL, NOT the ratifier, and this row does NOT rest on a delegation.** Both clauses now bind as written. The shape was never provisional — the two clauses, the instrument, the statistic, the admissibility control and the machine are measured and are this row's; what a 3 s wait is *worth* to the humans who wait for it is not a quantity any role here can measure. Ratified by **Olger Oeselg** directly, 2026-08-11 — UNLIKE `NFR-005`'s depth 7, which remains PROVISIONAL to this day; this row was seeded in that shape and has now left it. **THE BUDGET HAS TWO ACCOUNTS WITH DIFFERENT OWNERS AND THAT SPLIT IS THE POINT OF THE ROW: (1) the CONTENT account, charged per ticket at ≤ 5% of the TOTAL (not of the current lane) — the standing per-ticket bar, wording in the section below, owner BA/PM at each cut; (2) the FLOOR account — `files × per-file cost`, which no ticket can influence and which no per-ticket bar has ever been able to see — owner ARCHITECT/DESIGN.** `ABC-025`'s gate risk #9 said the cheapest saving on this lane *"is structural and is not owned by anyone"*; account (2) is that ownership | **The default test lane** — `npm test` (= `vitest run`) with `PERFT_DEEP` **unset**: the `unit` step of `quality.mandatory_gates`, and the inner loop every role runs several times per hop. **NOT** the `PERFT_DEEP=1` lane (36–40 s; `ABC-024` considered and rejected promoting it into the gate and this row does not re-open that), and **NOT** `lint` / `typecheck` / `build` | **MEASURED 2026-08-10 by Architect/Design at `ABC-026`'s design hop — the lane is at 46–59% of the wall clause and 49–59% of the CPU clause across every reading on record from two roles, so the bar is MET today and it BINDS inside this project's own remaining plan.** Own harness outside the repository, 19 out-of-tree working copies with `node_modules` symlinked, **every copy of a repository file `cmp`-verified byte-identical per file before any condition was applied** (37 files × 7 full-lane trees, 35 × 5 reduced trees) and **the repository's `src/` never written** — 37 md5s identical before and after and `git status --short -- src/` empty. `/usr/bin/time -p`, one fresh OS process per run, wall and CPU **reported separately and never blended**, order rotated every round, round 0 discarded, **n = 8 usable rounds per condition**, **every run asserting its own test-file count AND test count** (a mismatch is a harness error, never a datum) — **0 harness errors over 11 measurement suites / 612 recorded runs** (plus 9 deliberately-failing `--no-isolate` runs, which are data of a different kind, and 33 standalone determinism runs). **TODAY, `npm test` on the 22-file lane, two independent samples of this hop quoted separately and never averaged: 1.565 s wall (1.500–1.720) / 7.205 s CPU (7.170–7.230) on the quietest sample — CPU spread 0.8%, the tightest reading of the hop — and 1.765 s wall (1.61–2.50) / 7.640 s CPU (7.29–8.10) mid-session.** BA/PM independently measured **1.380–1.435 s / 6.310–6.365 s** on the 20-file tree (i.e. without `ABC-025`'s two files) a few hours earlier, which is the same lane one ticket smaller. **THE FENCE THAT TRAVELS WITH EVERY ABSOLUTE FIGURE IN THIS ROW: the SAME tree read 6.68 s CPU / 1.61 s wall early and 8.14 s / 1.96 s after ~15 min of sustained 8-core load — +22% on ONE machine inside ONE hour.** Absolutes drift ~20% with thermal state; **ratios replicate and absolutes do not**, which is why the bar carries ~1.8x margin and why the per-ticket bar below is a *paired* ratio. **THE LANE IS ROUGHLY HALF RUNNER AND HALF TESTS, by two independent decompositions that agree within 8 points: 49–58% of its CPU is per-file overhead** (linear floor model: CPU = 0.85 s + 159 ms × files, `R² 0.9999` over files = 1…128) **against vitest's own accounting** (transform 466 + collect 1,195 + prepare 1,019 = 2,680 ms vs tests 2,760 ms). **A TEST FILE COSTS 368–504x A TEST:** 128 trivial assertions in ONE file cost 1.105 / 1.125 s CPU; the same 128 in 128 FILES cost 21.295 / 23.780 s — **19.3x / 21.1x** — so per trivial `it` **0.35–0.43 ms** against per file **159–179 ms**. **~70–90% of the per-file cost is per-file PROCESS ISOLATION** (`--no-isolate` on an 18-file tree: −30.7% / −36.5% CPU = 113–166 ms per file). **AND THAT SAVING IS NOT AVAILABLE — see the section below; it breaks the four spied call-count guards that `NFR-001`, `NFR-005` and `ABC-025`'s `N1` rest on, in 17 of 21 observed runs, and the FIRST observed run was green.** **`NFR-001`–`NFR-007` are BYTE-IDENTICAL — verified by hashing every table line before and after the write, not asserted; 9 table lines before, 10 after, exactly one row added and no target moved.** **No wall-clock assertion was added to the suite** — this project's standing rule; the seconds live here, with their machine |

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
| **Bounded pane compute** (BA/PM's ≈ 70–75 µs is arithmetic over wave 1's per-item figures — a target, not a result) | `ABC-017`'s cost test at 40 / 120 / 300 plies: ≤ 150 µs absolute **and** the three within ~~2x~~ **3x** — the absolute is untouched; the ratio clause was RE-DERIVED ON `ABC-017` at its promotion (2026-08-10, with measurement) and is transcribed here 2026-08-11. **UNBLOCKED 2026-08-11:** ~~Gated on `ABC-013` (`toSan`), itself blocked on `ADR-0004`'s ratification~~ — `ADR-0004` is **accepted** (2026-07-31) and `ABC-013` is **`done` / merged on `main`** (2026-08-10), so nothing gates this closer except `ABC-017` itself. Both corrections are pointers, not bars — see the `design-frame-contract` block below |
| ~~**Board-scan compute**~~ — **CLOSED 2026-08-07 at `ABC-014`'s Security/NFR gate. MET: worst cell 2.092 / 2.056 µs against the ≤ 500 µs bar (0.0042x, ~240x headroom)** over all 24 cells of 6 standing perft FENs × 2 modes × 2 orientations, two independent samples, Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere. The fully-occupied 64-piece board — the module's true worst case, **not in the bar's population** — reads 2.322 / 2.342 µs, still 0.0047x | `ABC-014`, over the standing perft FENs; bar ≤ 500 µs. **Done.** The measurement, its method, its machine and its two fences are in the `NFR-002` row above |
| **Status-panel compute** | `ABC-016`; bar ≤ 250 µs |
| **Frame assembly + the WRITE half** — the half nobody has measured | `ABC-018`, against a non-TTY sink, recorded with its machine. **No number for terminal write time may be quoted from any note in this task; none exists** |
| **Any non-M3 machine, any other Node version** | Unchanged by this correction and still open |

**No number in this correction was measured today.** Every figure quoted here is transcribed from
wave 1's measurement note (Apple M3, Node v24.12.0, darwin/arm64, two runs, read-only harness outside
the repo against merged `src/`). A harness run today would have measured the same superseded
quantities, since the bounded pane depends on a `toSan` that is not yet permitted to exist.

### THE TWO OPEN FLAGS ON THIS ROW ARE RULED 2026-08-10 by Architect/Design (task `refinement-ABC-026`) — one is STALE and already discharged, one is CARRIED. **NOT ONE BYTE OF THE `NFR-002` TABLE ROW WAS TOUCHED; its ID, Category, Target, `Applies to` and `Verified by` cells are BYTE-IDENTICAL, verified by hashing the whole line before and after the write rather than asserted.**

**Flag 1 — `ABC-017`'s: "the row records that *the frame is a function of GAME LENGTH, not only of
position — the history panel is O(plies)*, which was true of the unbounded model and is not true of
this one. The row is Architect/Design's to rewrite; flagged here, not edited." RULING: STALE. It was
already discharged nine and a half hours after it was written, and NO EDIT IS OWED OR MADE.** The
quoted sentence is verbatim from the `Applies to` cell **as it stood at `f3d5966`**; `ABC-017` was cut
at `03b0a65`, **2026-07-31T00:27:21+03:00**, and the correction block above this one landed at
`92046f9`, **2026-07-31T09:55:05+03:00** — *"CORRECTED 2026-07-30 — the frame is NO LONGER O(plies)"*,
which is the rewrite the flag asks for, written by this role on this row. Checked at the source and
not inferred: the string *"the frame is a function of GAME LENGTH"* **does not occur in the `NFR-002`
row, in this section's prose, or anywhere else in this file except the two places this hop quotes it
— here and in the header** (checked by `grep` after the write, not before it, because a claim about a
file's contents that is made before the file is written is a prediction). **The correct action is
therefore to strike the flag on `ABC-017`, not to rewrite a row
that has already been rewritten** — and a hop that took the flag at face value would have re-opened
the most-corrected row in this file for no reason. `ABC-017`'s bullet is corrected in place, in that
ticket's own correction convention, at this hop.

**Flag 2 — `ABC-016`'s (added 2026-08-10 at its promotion hop): the row's `O(window)` boundary
condition was verified STRUCTURALLY at `ABC-012`'s gate on the ground that "`src/history.ts` has ZERO
importers", `ABC-016`'s item 7 as originally written would have been that importer, and as
re-specified the panel imports `GameHistory` as a TYPE ONLY. RULING: CARRIED, NOT DISCHARGED, and
deliberately NOT written into the row.** It is a true and useful statement about a ticket that is in
`Ready` and has shipped **zero lines**; recording *"the boundary condition survives `ABC-016`"* here
today would be this file certifying unbuilt code, which is the one thing its `UNKNOWN - verify`
discipline exists to prevent. **The boundary condition and its falsifier are already stated in this
section and need no new words** — *"if a renderer ever computes the repetition counts per frame, the
frame is `O(plies)` again and the correction above is void"*. **What is new is that the condition now
has TWO named tickets that can void it and each has a checker: `ABC-016` (status panel) at its own
Security/NFR gate, and `ABC-017` (history pane) at its.** Each must re-verify the importer fact on
**delivered** code, exactly as `ABC-012`'s gate did — a `grep` for importers of `src/history.ts`, not
a reading of the ticket. **Owner: Security/NFR at each of those two gates. Trigger: each ticket
entering `In Security/NFR`.**

**What is still `UNKNOWN - verify` on `NFR-002` is unchanged by this ruling** — the bounded-pane
compute (`ABC-017`) and the status-panel compute (`ABC-016`) are both still unmeasured, both still
have their bars, and **no number was invented for either here.** `ABC-016`'s own re-derived
`≤ 25 µs`/frame bar and `ABC-017`'s `≤ 150 µs` bar are ticket-level bars and are not rows in this
file; when they are measured on delivered code, the results belong in the `NFR-002` row.

### RE-CHECKED 2026-08-11 by Architect/Design (task `design-frame-contract`) — `ABC-016`'s flag was ALREADY RULED and stays ruled; two POINTERS in the unknowns table above are corrected; and the row's own 23-row denominator gets a checker for the first time. **NOT ONE BYTE OF THE `NFR-002` TABLE ROW WAS TOUCHED — no target, no bar, no measured figure and no `UNKNOWN - verify` marker moved, and nothing was measured for this row at this hop.**

**1. The flag `ABC-016` carries as open, with this role's name on it, is NOT open.** `ABC-016`'s
Definition-of-Ready block still reads *"`plans/nfr-catalog.md`'s `NFR-002` row — owed a rewrite for two
reasons now (`EPIC-002` `[A2]` and this ticket's structural note). **Owner Architect/Design**"*. Both
reasons are disposed of in the block immediately above this one, written by this role at
`refinement-ABC-026` on the same day the flag was raised: reason 1 is **STALE** (the rewrite it asks
for landed at `92046f9`, and the sentence it quotes occurs nowhere in the row today), and reason 2 is
**CARRIED, not discharged, and deliberately not written into the row** — because recording *"the
boundary condition survives `ABC-016`"* would be this file certifying a ticket that has shipped zero
lines. **Both dispositions were re-checked at this hop and both hold. NO EDIT IS OWED TO THIS ROW ON
THAT FLAG AND NONE IS MADE.** What is owed is on the **ticket**, not here: `ABC-016`'s flag should say
*ruled at `refinement-ABC-026`, carried by Security/NFR at this ticket's own gate*, not *owed by
Architect/Design*. **Flagged for BA/PM at `ABC-016`'s next hop and deliberately not edited** —
`plans/tickets/ABC-016*.md` belongs to a BA/PM hop at this boundary.

**2. What is genuinely new since that ruling is one sentence's worth, and it strengthens the boundary
condition rather than moving it.** When `refinement-ABC-026` ruled, it could only say that each of the
two tickets *"has a checker"*. Both checkers are now **promoted acceptance text**: `ABC-016` `A13`
(spied — `gameStatusOf`, `repetitionCounts`, `keyHistory` and `gameStatus` **exactly 0**) and
`ABC-017` `A11` (the same four at 0, `takeBack` / `playMove` at 0, `parseFen` at most 1, and
*"the pane imports `GameHistory` as a **type only** — after this ticket, `src/history.ts` still has
zero runtime importers"*). So this row's `O(window)` falsifier — *"if a renderer ever computes the
repetition counts per frame"* — is now guarded on each ticket by a criterion that **can fail, at zero
timing sensitivity**. **The gate obligation is unchanged and is NOT discharged by that:** each
ticket's Security/NFR gate still re-verifies the importer fact on **delivered** code by `grep`, not by
reading a ticket. Owner and trigger unchanged. Re-checked at this hop for information only:
`src/history.ts` has exactly one importer, `src/history.test.ts`.

**3. Two corrections to the unknowns table above. Both are POINTERS to a ticket-level bar; neither is
a bar of this row, and neither adjudicates anything.** (a) The closer's blocker chain — *"gated on
`ABC-013`, itself blocked on `ADR-0004`'s ratification"* — was **stale on both links**: `ADR-0004` has
been `accepted` since 2026-07-31 and `ABC-013` is `done` and merged on `main` as of 2026-08-10, both
read at the source here. (b) The closer said *"the three within 2x"*, which **no ticket carries any
more**. That figure was never an independently derived catalog bar; it was transcribed from
`ABC-017`'s then-current ticket bar on 2026-07-30. `ABC-017` re-derived it **with measurement** at its
promotion: the correct build measures **1.845x** on the long-game builder that ticket's own test notes
mandate (**7.7% headroom**) against **1.060x** on a fixed-content knight shuffle — i.e. the 2x bar was
measuring the fixture rather than the algorithm — and `ABC-016` carries **3x** for the identically
shaped bar and measured 1.88x against it. **The ≤ 150 µs absolute is untouched, and correcting a
pointer is not taking a verdict: Security/NFR still owns MET / MISS when the bounded pane is measured
on delivered code.** Recorded rather than left alone because a catalog that names a closer no ticket
carries is exactly the **TWO-DOCUMENTS-DISAGREE** defect class this file already tracks on `NFR-007`.

**4. This row's 23-row denominator was assumed and is now falsifiable — the structural contribution of
this hop, and it changes no figure.** The write half carries *"a 23-row frame at `W = 18`, 418
characters serialized"* as its measured denominator, and the board-scan block records the board's 9
rows as *"9 of the reference layout's 23 rows"*. **Until this hop nothing in the tree could fail if a
panel shipped a different row count.** Measured here against merged code rather than argued:
`src/frame.test.ts:632-638` asserts the 23 identity from **three local shadow constants** declared in
the test file at `:38-43`, so it **passes on all six row-count mutants constructed at this hop** —
including the two that push `H` to 25, where `beginFrameSession` takes the append path and epic
acceptance `4b` becomes unreachable. `ABC-016`'s `A11` passes both of those as well, because it
hardcodes the `history` term. **`ADR-0009` (accepted 2026-08-11) puts the identity in ONE place
reading all three terms from delivered code** — `renderBoard(...).length`, `STATUS_ROWS`,
`HISTORY_ROWS` — with a `= 23` tripwire and a `≤ 24` requirement, owed by whichever of `ABC-016` /
`ABC-017` merges **second**. **No figure in this row changes.** What changes is that if a panel's row
count ever moves, the write half's 418 / 419-character and 483-byte figures become discoverable as
stale **at that ticket's gate** instead of in somebody's terminal.

**Unchanged and explicitly not touched at this hop:** the `< 16 ms` target, the boundary condition and
its falsifier, the three ply counts, every measured figure and machine on this row, and the two
remaining `UNKNOWN - verify` items — **the bounded-pane compute (`ABC-017`) and the status-panel
compute (`ABC-016`) are both still unmeasured, and no number was invented for either here.** Nothing
was added to the test suite at this hop (**zero `src/` lines**), so the standing no-wall-clock-in-the-suite
rule is not engaged.

### RE-SCOPED 2026-08-11 by Architect/Design (task `design-stub-seam-and-nfr002`) — the boundary block's quantity is RE-MEASURED and RE-LABELLED, and the ROW'S `Applies to` CELL IS EDITED FOR THE FIRST TIME SINCE 2026-08-09. **THE `< 16 ms` TARGET DOES NOT MOVE. NO BAR IS CREATED, MOVED OR LOOSENED.** `ID`, `Category`, `Target` and `Verified by` verified BYTE-IDENTICAL cell by cell against `HEAD` rather than asserted, `NFR-001` and `NFR-003`–`NFR-008` BYTE-IDENTICAL, and `git diff --numstat` reports exactly 1 insertion / 1 deletion on the table.

**Why this row was reopened.** BA/PM flagged it at `refinement-ABC-019`: the boundary block's own
figures appeared to refute the `≤ 100 µs @ 120 plies` bar sitting beside them. **The flag was right
that this row has a coherence problem and wrong about what the problem is.** Both halves are settled
here with measurement.

**FIRST, the correction that has to come before anything else: the `≤ 100 µs` bar is NOT in this
file and never was.** `grep` for `100 µs` across this catalog returns **zero matches**. The bar is
`ABC-019`'s, on `ABC-019`. So the disagreement was never internal to this row — it was
**between this row and a ticket**, which is the `TWO-DOCUMENTS-DISAGREE` class this file already
tracks on `NFR-007`. What this row owes is not a verdict on someone else's bar; it is to stop being
the document that supplies a stale figure to one.

**SECOND, the arithmetic behind *"the correct build sits at or over the bar"* is wrong twice, and the
sentence is FALSE as measured.**

1. **It double-counts `gameStatus`.** `ABC-019`'s `[D19]` reads the band and adds *"`gameStatus`'s
   2.52 µs"* to reach 99.5–104.5 µs. Read at source, `gameStatusOf(history)` is
   `gameStatus(history.position, repetitionCounts(history))` — **`src/history.ts:152`** — so the
   composite **already contains** that call. This row's own words for the quantity are *"`gameStatus`
   **fed by** `repetitionCounts`"*, and its later `ABC-012`-gate paragraph names it *"the whole
   `gameStatus` + counts composite this paragraph is about"*. **Nothing is owed on top of it.**
2. **The band it quotes is a superseded wave-1 prototype band and its 300-ply end is ~7% high.**
   Measured here on merged code, own harness **outside the repository**, its own process, a discarded
   warm-up round, **9 usable rounds × 300 iterations**, cell order rotated every round, medians of
   per-round means, the game built by `src/history.test.ts:81-89`'s LCG so a ply count means the same
   thing here and in the suite, **every game's length asserted**, elision-checked; **Apple M3 / Node
   v24.12.0 / darwin-arm64 and `UNKNOWN - verify` on any other hardware**:

   | cell | 40 plies | 120 plies | 300 plies |
   |---|---|---|---|
   | `repetitionCounts` | 17.74 µs | 44.11 µs | 91.76 µs |
   | `gameStatusOf` (the composite) | 20.76 µs | **48.27 µs** | **95.29 µs** |
   | `gameStatus` bare (no counts map) | 2.71 µs | 3.31 µs | 2.21 µs |

   **So at 300 plies the correct build reads 95.29 µs — 0.95x of 100, MET with 4.7% margin, not "at
   or over".** The band's `97–102` lower bound is above **every** independent reading.

**THREE INDEPENDENT HARNESSES, THREE ROLES, THREE DAYS, AND THEY AGREE — which is why the prototype
band can be retired rather than merely doubted.** `gameStatusOf`: `ABC-016`'s hop **21.06 / 47.93 /
95.64**, `refinement-ABC-019`'s hop **20.62 / 48.06 / 94.43**, this hop **20.76 / 48.27 / 95.29** —
spread **2.1% @ 40, 0.7% @ 120, 1.3% @ 300**. `repetitionCounts` against this row's own `ABC-012`-gate
figures (17.5 / 44.4 / 92.0): **1.4% / 0.7% / 0.3%**. All inside the **±22% thermal drift** `NFR-008`
documents for this machine, and far tighter than it.

**A structural fact worth having, and it is new on this row:** bare `gameStatus` is **FLAT in plies**
(2.71 / 3.31 / 2.21 µs — the ordering is noise at this scale). **The entire `O(plies)` term is
`repetitionCounts`**, which is 91.76 of the composite's 95.29 µs at 300 plies. So the falsifier this
block states — *"if a renderer ever pulls the repetition derive into a frame"* — names **exactly** the
right call, and a renderer that called bare `gameStatus` would not void the `O(window)` claim at all.
The block's wording was already precise; this is the measurement that shows it was precise on purpose.

**THIRD, what this row's OWN incoherence actually was, and it is now fixed.** The row's `Applies to`
cell carried the prototype band as the quantity's **headline figure with no label**, while the real
measured figures sat further down the section. A reader who quoted the row quoted the prototype — and
that is not hypothetical: **it happened twice.** `ABC-019`'s original bar transcribed *"46–50 µs at
120 plies"* verbatim as its derivation, and its repair hop quoted `97–102` again and drew a false
conclusion. **A figure in this catalog that is not labelled "not a bar" will be transcribed into a
ticket bar.** Fixed in the cell: the measured triple is the headline, the prototype band is struck
through and retained as history in this file's standing convention, and the cell now says in terms
that the quantity is the falsifier's evidence and **not a bar of this row**, with the
re-derive-all-three-ply-counts fence attached.

**Also repaired: one internally contradictory sentence, kept as history.** The 2026-08-04 paragraph
above says the real code *"lands inside the band this paragraph already quoted, 1–8% below it."*
**Below a band is not inside it.** Measured: **inside at 120** (48.27 against 46–50) and **below at
300** (95.29 against 97–102). The paragraph is not rewritten — its figures are good and its "1–8%
below" is right — but the "inside the band" half is superseded by this sentence.

**FOURTH — DOES THE `< 16 ms` FRAME TARGET MOVE? NO. Explicitly, and for a structural reason rather
than because the number happens to fit.** The target applies to *"one full frame"*, and **this row's
own words put this quantity in the LOOP, not in a frame.** It is not in the target's denominator at
all, so no measurement of it can move the target. For scale, and as a fence rather than a bar: at
95.29 µs the composite is **0.6% of 16 ms**, and even the three-derives-per-ply wrong build
`refinement-ABC-019` measured (277.56 µs @ 300) is **1.7%**. **Compute has never been the risk on this
row; it was the terminal-write half, and that was measured and discharged at `ABC-018`'s gate.** The
only thing that could move this target is the falsifier firing — a renderer pulling the derive into a
frame — and that is a structural change, not a timing result.

**FIFTH, where the bar belongs, stated once so it stops being re-litigated.** **This row records the
quantity; the ticket bars it.** `ABC-019` now carries `≤ 45 @ 40`, `≤ 100 @ 120` and `≤ 200 @ 300`
plus the **spied call count** that actually binds (`repetitionCounts` and `gameStatus` exactly once
per ply, zero on a non-advancing prompt outcome) — and the spied count is the right instrument for
the reason `refinement-ABC-019` measured and this hop does not dispute: **a two-derives-per-ply build
reads 93.58 µs @ 120 = 0.94x and MEETS the timing bar.** *That* is why the bar could not catch what it
was written for — **not** because a correct build busted it. **BA/PM's ruling 3 stands entirely, on the
stronger of its two reasons.** Its point about `O(plies)` also stands and is measured here: the
composite's ratios are **2.33x from 40→120 and 1.97x from 120→300**, so one ply count cannot describe
the line, which is exactly why this row mandates three.

**Explicitly NOT done at this hop, and each has an owner.** No bar was created on this row and none
of `ABC-019`'s three ply-count clauses was touched (**owner BA/PM at the ticket; the ticket text is a
concurrent hop's this wave**). `MET`/`MISS` on any of them stays **Security/NFR's** at that ticket's
own gate. The bounded-pane compute (`ABC-017`) and the status-panel compute (`ABC-016`) are **still
`UNKNOWN - verify`, still unmeasured, and no number was invented for either.** The boundary condition,
its falsifier, the three ply counts and every other figure and machine on this row are unchanged.
**Zero `src/` lines and zero test lines** — the timing harness lived outside the repository and `src/`
is byte-identical (36-file aggregate md5 `afbc181925173a615c3fbf18fd51dab8` before and after), so the
standing no-wall-clock-in-the-suite rule is not engaged and `NFR-008`'s lane budget is not charged.

### RE-MEASURED 2026-08-11 by Architect/Design (task `design-frame-width-clearing`) — the write half's serialized-length denominator, and what `ADR-0010` adds to it. **THE `< 16 ms` TARGET DOES NOT MOVE. NO BAR IS CREATED, MOVED OR LOOSENED. NOT ONE BYTE OF ANY TABLE ROW WAS TOUCHED** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the eight lines together before and after the write (`sha256 1136d003…7c810`).

**Why this row is touched at all.** `ADR-0010` (accepted 2026-08-11) rules that `src/frame.ts`'s
in-place writer clears each row as it writes it, so the **emitted** redraw grows. This row's write half
carries a serialized-length denominator, and a denominator that silently stops describing the delivered
stream is the **TWO-DOCUMENTS-DISAGREE** class this file already tracks. **No figure in the row is
edited; what follows is a note beside it.**

**1. The existing 418-character figure is CORRECT and its scope is now stated.** Measured on merged
code with the merged test file's own stubs: the assembled 23-row frame at `W = 18` serializes to
**418 characters** as `frame.join("\n")` — 22 rows × 18 characters + 22 newlines, the prompt row being
empty. **The stream actually written is 425 characters / 489 UTF-8 bytes**, because
`beginFrameSession`'s in-place branch adds `\x1b[H` (3) and `\x1b[0J` (4). The two numbers measure
different things and **the row's figure is not wrong** — it is the frame, not the emission. Recorded so
the 7-character gap is never later read as drift.

**2. `ADR-0010` adds exactly `(H − 1) × 3` = 66 characters per redraw, always.** Not a range and not a
measurement that could come out differently: one `\x1b[K` between each pair of rows. Measured on the
delivered `ABC-016` panel with a 24-column history pane — quiet frame 557 → 623 characters, both-claims
frame 1129 → 1195. **Against a 16 ms budget this is not a cost, and it is recorded as a denominator
change rather than as a performance item.**

**3. What genuinely moves this denominator is the two panels landing, and that is NOT `ADR-0010`.**
The 418-character figure rests on `W = 18`, which holds only while the two unbuilt panels are the
merged test's stubs (widest rows 13 and 14, so the real board pins `W`). Measured against the
**delivered** `ABC-016` panel: `W` is **24** on a quiet frame and **50** with a draw claimable, and the
emitted stream is **621** and **1193** bytes. **No figure is edited here** — `ABC-016` and `ABC-017` are
not merged, and recording a delivered figure for an unmerged ticket is this file certifying work that
has not landed, which the 2026-08-11 `design-frame-contract` block declined to do for the same reason.
**Owner: whichever hop re-measures this row after the second panel merges.**

**Unchanged and explicitly not touched at this hop:** the `< 16 ms` target, the boundary condition and
its `O(window)` falsifier, the three ply counts, every measured figure, machine and `UNKNOWN - verify`
marker on this row — **the bounded-pane compute (`ABC-017`) and the status-panel compute (`ABC-016`)
are both still unmeasured and no number was invented for either.** **Zero `src/` lines and zero test
lines at this hop** — every measurement above ran on copies outside the repository, `src/` is
byte-identical, so the standing no-wall-clock-in-the-suite rule is not engaged and `NFR-008`'s lane
budget is not charged. **No new NFR row is created**: `ADR-0010`'s property is a per-frame correctness
invariant with no target to miss, so it belongs in acceptance criteria (`ADR-0010` clause 7) and not in
this catalog.

### ONE NOTE ADDED 2026-08-12 by Architect/Design (task `design-ABC-029-2026-08-12`, subtask `design-ABC-029-production-module`) — THE FIRST NON-RENDERER PRODUCTION IMPORTER OF `src/history.ts` NOW EXISTS, WHICH IS WHAT MAKES THIS ROW'S RENDERER-SCOPING LOAD-BEARING RATHER THAN INCIDENTAL. **NOT ONE BYTE OF ANY TABLE ROW WAS TOUCHED** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing them together before and after the write (`sha256 63f66795…ca31`), and each row hashed individually as well. **NO TARGET, BAR, LEVEL, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED. `MET`/`MISS` IS SECURITY/NFR'S AND NO VERDICT IS TAKEN HERE.**

**The fact this row is owed, in one sentence:** `src/turn-loop.ts` imports `src/history.ts` at
runtime — the **first** production runtime importer in this project's history, and the first
production module that is neither the rules core nor a renderer.

**This row is NOT breached, and that was re-measured here rather than inherited from the hop that
raised it.** Probed with the same `module.registerHooks` technique the `RF-1` probe uses, on a replica
of `ABC-019`'s tip verified `cmp`-identical file by file (all 17 non-test `.ts`; `src/turn-loop.ts`
md5 `bd793612476c9d0eac28b75e1e3297cc`): rooted at the five renderers this row's own words name, the
**render closure is 11 modules** — `apply`, `fen`, `frame`, `glyph-mode`, `history-pane`, `legal`,
`moves`, `position`, `render`, `san`, `status-panel` — and **`history.ts` is NOT among them**. The
zero is **armed**: the same probe rooted at `turn-loop.ts` **does** report `history.ts`. **The pane's
own runtime closure is still exactly SEVEN modules.** Node v24.12.0, Apple M3 / Darwin 25.5.0 arm64,
`UNKNOWN - verify` elsewhere.

**Why the row needed no edit, stated so the absence is not read as an oversight.** This row already
voids itself on *"if a **renderer** ever pulls the repetition derive into a **frame**"* and already
says *"the quantity belongs to the LOOP (`ABC-019`), not to a frame"*. The loop importing the history
module is that sentence being **satisfied**, not breached — `ADR-0002` clause 4 makes `gameStatusOf`
the single `positionCounts` supplier and the loop is where the derive is supposed to live. **The row
was right in advance; nothing in it moves.**

**What DID need a ruling, and where it lives.** The guard that stood in for this premise — `ABC-017`'s
`A11`, *"zero runtime importers among the production modules"* — was a **whole-tree proxy** for a
**frame-scoped** property, and it was sound only while every production module was either the rules
core or a renderer. It is not any more. **`ADR-0011` rules the scope** (`memory-bank/50-decisions/`):
the premise is a property of the **frame path**, the frame path is a closure and not a file list, and
`src/perft-bench.ts` is a production module that is an **entry point** and is not on the frame path.
**No bar of this row is involved in that ruling and none was consulted as one.**

**One structural fact worth recording here, because it is the reason the proxy could not simply be
narrowed:** `src/frame.ts` imports **nothing** — its runtime closure is exactly one module, itself. A
frame is composed by **injection**, not by import, so frame membership is not derivable from the
module graph. That is measured, and it is why this row's `Applies to` cell — which enumerates a frame
in prose — is currently the **only** statement of what the frame path contains.

**Owner of the guard repair: `ABC-029`** (`P1`, `Backlog`). **`NFR-002`'s `MET`/`MISS`: Security/NFR,
unchanged — `ABC-019` has never been through a Security/NFR gate and this note does not stand in for
one.** Zero `src/` lines and zero test lines at this hop; every measurement ran on copies outside the
repository, so the no-wall-clock-in-the-suite rule is not engaged and `NFR-008`'s lane budget is not
charged.

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

**[RESOLVED 2026-09-19 by Architect/Design at `ABC-100` (task `owner-rulings-2026-09-19`).** The owner
chose: *"1. git clone + npm start works for now"* (Olger Oeselg, in session, 2026-09-19).
`memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md` supersedes
`ADR-0007` clause 5 only; `EPIC-006`'s four `npx` sentences are repaired to `git clone` +
`npm install` + `npm run chess`; `NFR-007`'s `Target` cell above carries the restated denominator with
the `< 2 s` bar byte-identical. The denominator restatement was made at that hop on the Orchestrator's
instruction so the row and the ADR do not disagree; **Security/NFR keeps the wording and may re-state
it at the measuring hop.** The two documents no longer disagree.]**

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

## NFR-008 — the default lane's total, the standing per-ticket bar, and the per-file floor

_Added 2026-08-10 by Architect/Design (task `refinement-ABC-026`, subtask `refinement-ABC-026-design`,
Workflow 07), from `ABC-025`'s Security/NFR gate risk **#9**. **`NFR-001`–`NFR-007` are byte-identical
and no target moved.**_

### Why a total was owed, in one paragraph

**Every bar this board has set on lane cost is a per-ticket ratio against the lane as it stood when
that ticket was cut, and a per-ticket ratio cannot see an accumulating total.** *n* tickets each
passing "≤ 5% of the current lane" multiply the lane by `1.05ⁿ` — **2.65x at twenty tickets** — with
every ticket green. That is a geometric series and it is unbounded by construction. **The same 5%
denominated in a fixed TOTAL is an arithmetic series: twenty tickets consume it exactly once, and the
number of tickets the budget admits becomes an explicit, checkable number instead of a surprise.**
`ABC-025`'s `N5` is the worked example — invented to protect the lane, and its own gate found it did
not. **`N5`'s `5%` was never the defect. Its DENOMINATOR was.** The figure is retained below,
unchanged, against a different denominator.

### The standing per-ticket lane bar — inherited by every ticket from this row forward

**Every ticket that adds a test file inherits this. A ticket may state a TIGHTER bar and may never
state a looser one; a ticket that states nothing has stated this one.** It replaces the practice of
re-deriving a lane bar per ticket, which has now cost two ruling hops.

> **`N8-LANE` — the tests a ticket adds may cost at most 5% of `NFR-008`'s TOTAL — that is
> ≤ 650 ms CPU while the CPU clause is 13 s — NOT 5% of the lane as it stands.**
>
> - **Instrument: CPU (user + sys) of the default lane. NOT wall.** This is measured, not preferred:
>   adding two test files moves the wall clock by **−15 to +3 ms per file** — indistinguishable from
>   zero — while moving CPU by **100–225 ms per file**. **A per-ticket WALL bar is unmeasurable by
>   construction rather than merely noisy**, and that, not "noise", is why `N5`'s wall wording could
>   not adjudicate itself. (The total in `NFR-008` is on the wall clock *and that is not a
>   contradiction*: a total is a ~2x question and wall resolves it easily; a per-ticket delta is a 5%
>   question and only CPU resolves it. **The two bars need different instruments because they ask
>   questions two orders of magnitude apart.**)
> - **Statistic: the median of paired per-round deltas**, n ≥ 7 interleaved rounds, condition order
>   rotated every round, one fresh OS process per run, round 0 discarded as warm-up, **with the sign
>   test reported beside it** — on a right-tailed distribution the sign is what says an effect exists.
> - **Admissible only with an identity null control** — a `cmp`-verified byte-identical second tree,
>   run as its own condition in the same interleaved harness — **reading ≤ 1.5% CPU with its sign at
>   chance.** Measured null floors on this instrument: **−0.43%, −0.52%, −1.26%; signs 3/8, 3/8, 3/8**
>   (BA/PM's quieter session read ±0.1% at 4/8; this hop's is worse and is reported, not smoothed).
> - **NET of the per-file floor: subtract 160 ms CPU per test file the ticket adds.** The floor is the
>   runner's cost, not the ticket's; charging a ticket for it makes a bar that two EMPTY files trip.
>   The floor is charged to `NFR-008`'s **floor account**, owner Architect/Design.
> - **NET of the SPAWN ACCOUNT: subtract the measured CPU of every child process the ticket's own
>   ACCEPTED CRITERIA force it to spawn.** A criteria-forced child is the operating system's price of
>   proving a command runs, not test content. Charged to `NFR-008`'s **spawn account**, owner
>   Architect/Design — **created 2026-08-15 on the project owner's instruction. Its charging test, its
>   four exclusions and its three stops are the `N8-SPAWN` section at the end of this row, and you
>   must read them before you subtract anything: most of what looks chargeable is not.**
> - **Scope:** every file the branch adds under `src/`. **Denominator:** the lane without those files,
>   `npm test`, `PERFT_DEEP` unset, runner invoked directly or via `npm test` **stated either way**.
> - **Every figure carries its machine.** `UNKNOWN - verify` on anything but the reference machine.
>
> **Owner: BA/PM at each cut** (who writes the ticket's NFR trigger). **Checked by Security/NFR at
> each gate** against this wording rather than against a per-ticket invention. **A gate does not move
> this bar** — that rule is unchanged and it is why `ABC-025`'s gate was right to stop where it did.

**This bar is BA/PM's `N5` re-derivation with exactly one clause changed — the denominator.** Every
other clause (CPU, net of the floor, median of paired per-round deltas, n ≥ 7 interleaved, null
control by identity, scope = files added under `src/`) is theirs, survived four instruments and one
ruling, and is adopted here unchanged and with attribution. **The one clause that changed is the one
`ABC-026` exists for**, and BA/PM said so themselves at the ruling hop: *"whether 5% is the right
fraction is `UNKNOWN - verify` until `ABC-026` sets the total."*

**Where 5% comes from, stated so it can be disagreed with rather than inherited.** It is the budget
divided by the work the plan still contains: `Backlog` + `Ready` hold **7 named tickets** (`ABC-010`,
`ABC-016`, `ABC-017`, `ABC-019`, `ABC-021`, `ABC-024`, `ABC-026`) plus **four undecomposed epics**
(`EPIC-003` M, `EPIC-004` L, `EPIC-005` S, `EPIC-006` M) — and the one epic this board has actually
decomposed, `EPIC-002` (XL), produced **nine** tickets. **≈ 20–25 remaining ticket-shaped units, so
1/20 = 5% each.** Re-derive it when the plan changes; the arithmetic is one line and it is meant to
be re-run, not preserved.

**Calibration against the only real ticket on record, and it is uncomfortable rather than
reassuring.** `ABC-025` cost **+905 ms CPU (quiet sample) to +1,465 ms (loaded sample)** gross; net of
2 files × 160 ms that is **+585 ms to +1,145 ms = 4.5%–8.8% of a 13 s budget.** **So the budget admits
somewhere between 11 and 22 more `ABC-025`-sized tickets and the plan has about 20 left. It is tight,
not comfortable — which is the finding, and it is the reason this row exists at all.** *This is a
calibration reading on a CLOSED ticket and it re-opens nothing:* `ABC-025` is merged, its `N5` verdict
(NOT MET at 1.6x, breach accepted as an owned risk) stands exactly as ruled, and nothing here revisits
it.

### The per-file floor — measured across a range of file counts, which is what `ABC-026` asked for

The previous reading was **n = 2 conditions at one point** (two trivial files). This is the curve.
Empty out-of-tree trees, `K` trivial one-assertion test files importing nothing from the repository,
`K` = 0…128, plus content controls. Two fully independent samples, quoted separately and never
averaged:

```
                                        sample 1                sample 2
vitest with ZERO test files          0.250 s CPU / 0.175 s   0.250 s / 0.180 s
CPU   = a + b x K                 0.852 s + 159.3 ms x K   0.790 s + 178.7 ms x K   R^2 .9999 / .9998
WALL  = a + b x K                 0.358 s +  29.9 ms x K   0.286 s +  40.1 ms x K   R^2 .9995 / .9956
```

**Linear over two orders of magnitude in `K`** — marginal CPU per file 130/173/164/145/160/158/162 ms
at K = 2/4/8/16/32/64/128 in sample 1. **In the real lane the marginal cost is 100–229 ms CPU per file
and RISES with the number added** (100 / 124 / 151 / 163 / 168 ms at +2 / +4 / +8 / +16 / +32 files on
the 22-file lane; 127–225 / 155–214 / 175–229 at +2 / +4 / +8 on the 20-file `ABC-025` baseline),
because a small addition partly fills idle worker slots. **Use 160 ms; the band is 100–229 ms.**

**A TEST FILE COSTS 368–504x A TEST. That is the whole answer to "is 22 test files the right shape".**

```
128 trivial assertions in ONE file       1.105 / 1.125 s CPU
the same 128 in 128 FILES               21.295 / 23.780 s CPU      -> 19.3x / 21.1x
per trivial `it`                          0.43 / 0.35 ms
per test FILE                            159.3 / 178.7 ms
8 files x 16 its  vs  8 files x 1 it     +0 ms / +65 ms for 120 extra assertions
```

**RULING ON THE SHAPE QUESTION: 22 files is not the problem and file count is not the lever.** The
question `ABC-025`'s gate posed — *"no role has ever been asked whether 22 is the right shape"* —
has a measured answer, and it is that **the lane is expensive per FILE and nearly free per TEST, so
the lever is the per-file cost, not the number of files.** Consolidating files would trade a real
saving against readability, ownership and blast radius; **reducing the per-file cost costs nothing at
all in coverage.** Nothing here suggests deleting, narrowing or merging any test — `ABC-026`'s own
out-of-scope line already forbids it and this measurement removes the last reason anyone might have
wanted to.

**WALL TIME GROWS IN A SAWTOOTH, NOT A LINE, and a ticket author needs to know it.** The default
worker count is `availableParallelism() − 1` = **7** on this machine. Single-file wall steps measured
across the boundary: K 6→7 **+15 ms**, **7→8 +70 ms**, 8→9 +5 ms, 9→10 +20 ms, 14→15 **+75 ms**,
15→16 +15 ms. **So one added test file costs 5–20 ms of wall inside a wave and ~70–75 ms at each
multiple of 7** — the same file is nearly free or ~5x more expensive depending only on how many files
already exist. **A per-ticket WALL bar would therefore charge two identical tickets different
amounts for identical work**, which is the sharpest available statement of why the per-ticket bar is
on CPU.

### Where the per-file cost actually goes — and the lever that is NOT available

`--no-isolate` (files share a worker process instead of getting a fresh one) on an 18-file tree:

```
                            CPU (2 samples)      WALL (2 samples)     sign
forks, --no-isolate         -30.7% / -36.5%      -14.1% / -24.0%      0/8, 0/8
threads, isolated           -7.9%  / -9.1%       -12.4% / -16.2%      0/8, 1/8
threads, --no-isolate       -34.7% / -42.3%      -23.2% / -31.8%      0/8, 0/8
```

That is **113–166 ms CPU per file, i.e. ~70–90% of the entire per-file floor, spent on per-file
process isolation.** It is by far the largest single saving available anywhere on this lane — larger
than every test-content saving anyone has proposed, combined.

> **IT IS NOT AVAILABLE TODAY, AND ONE GREEN RUN WOULD HAVE SAID IT WAS. This is an
> instrument-limit correction of the species this file has now recorded eleven times, and it is the
> most expensive one to have got wrong.**
>
> ```
> full 22-file lane, --no-isolate            GREEN in  4 of 21 observed runs
> the FIRST observed run                     GREEN   <- a single run would have shipped this
> the ONLY files that ever fail              src/zobrist.nfr.test.ts   (NFR-005's call-count sub-bar)
>                                            src/gameend.nfr.test.ts   (NFR-001's three gameStatus bars)
>                                            src/san.nfr.test.ts       (ABC-025's five N1 spied rows)
> the same tree with those 4 files removed   GREEN 6 of 6, --no-isolate
> --pool=threads --no-isolate                GREEN in  1 of 3; same files
> --pool=threads WITH isolation              GREEN in 24 of 24
> ```
>
> **The lane's dominant cost is buying exactly one thing: the module-registry isolation that this
> board's spied call-count guards depend on.** Those guards are not incidental — they are the
> instruments this catalog reached for, three separate times, when a wall clock could not resolve a
> question (`NFR-001`'s *"count instead of time"*, `NFR-005`'s call-count sub-bar, `ABC-025`'s `N1`).
> **The board bought them with a per-file process, and until this hop nobody knew the price.**
> **No change is asked for here and no guard is under suspicion.**

**The lever that IS available, priced as it would actually be adopted** — a two-line
`vitest.config.ts` setting `pool: "threads"`, measured through `npm test` in the same interleaved
harness:

```
npm test today                      1.765 s wall (1.61-2.50)   7.640 s CPU (7.29-8.10)
npm test with pool: "threads"       1.500 s wall               6.830 s CPU
                                    -13.97% wall (-260 ms)     -10.78% CPU (-825 ms)   sign 0/8, 0/8
                                    676/676 green in 24 of 24 observed runs
```

**It is NOT adopted at this hop and this is deliberate.** A refinement hop does not change the
project's runner configuration, `worker_threads` is a different isolation model from a child process
(shared `process`, shared native addons, shared `process.env`), and **"green 24 times" is exactly the
evidence that `--no-isolate` produced before it was caught.** It is handed to `ABC-026`'s development
hop as a **candidate with a measured price and a required screen: ≥ 20 consecutive green runs and the
four `*.nfr.test.ts` files passing in every one.** Owner **Architect/Design**, decided at that hop.

### What this row does NOT establish

**Not a figure for any other machine or any other core count.** One machine, eleven suites in one
session; **`UNKNOWN - verify` elsewhere, and the wall clause is explicitly a function of core count.**
**Not a stable absolute:** the same tree drifted **+22% in CPU and wall inside one hour** under
sustained load, so every absolute here is a session property and every ratio is not. **Not a
re-measurement of `NFR-001`–`NFR-007`** — none was touched and no target moved. **Not a verdict on any
test, any file or any coverage decision** — no row is under suspicion and none was examined for
deletion. **Not a promotion of the `PERFT_DEEP=1` lane into anything** — `ABC-024`'s rejection stands
untouched. **Not a ruling on what a 3 s wait is worth to a human**, which is the one input this whole
row rests on and the one no role here can measure — **it is `PROVISIONAL` and its ratifier is named.**

### AUDIT NOTE 2026-08-12 by Architect/Design (task `arch-audit-2026-08-12`, subtask `audit-architecture`, Workflow 07) — the FLOOR ACCOUNT's consumption is restated at today's file count, and ONE SCREEN CONDITION IN `ADR-0008` IS NOW STALE. **NO TARGET, BAR, LEVEL, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE.** All eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 325c5c03…f6d4`). **`NFR-008`'s 3 s / 13 s level is Olger Oeselg's, ratified in person, and an audit does not move it.**

**Nothing here is a re-measurement of the lane total.** `ABC-026`'s `H5` owns that measurement and it is still `UNKNOWN - verify`; running it at this hop would collide with that open work. **Every number below is ARITHMETIC on figures already in this section**, and the inferred CPU total is labelled as an inference, not a reading.

**1. The file count moved 22 → 28 and the floor account moved with it.** This section's `pool: "threads"` table reads the lane at **22 files / 7.640 s CPU / 1.765 s wall**. Today `src/` carries **28 test files** (counted, not estimated). At this section's own **160 ms CPU per file**, the six added files put the floor account **+0.96 s**, for an **inferred ~8.6 s CPU — about 66% of the 13 s clause** (band 8.24–9.01 s at the recorded 100–229 ms marginal band).

**2. THE CPU CLAUSE BINDS FIRST, AND THAT IS THE PLANNING FACT.** The lane is commonly quoted against the wall clause (~52–59% of 3 s). **On the CPU clause it is further along — ~66% — and CPU is where a test FILE is expensive**, because this section already measured wall to move −15 to +3 ms per added file while CPU moves 100–229 ms. **Reading headroom off the wall clock overstates it.**

**3. Headroom, in the unit a ticket author actually spends: TEST FILES.**

```
remaining CPU under the 13 s clause          ~4.4 s      (from the inferred ~8.6 s)
files if each were EMPTY (floor only)          ~27       band 19-44 at 229/100 ms
files at TODAY's all-in average (307 ms/file)  ~14       floor + content, today's own mix
tickets at N8-LANE's full 650 ms content each   ~6       ignoring the floor those files also cost
absolute ceiling from CPU = 0.852 + 0.1593K     76 files total (zero content; unreachable)
```

**Use ~14 as the planning number and ~27 as the ceiling.** `EPIC-003` and `EPIC-004` are both file-adding epics and `EPIC-004` is sized **L**. **The budget does not comfortably admit both at today's per-file cost** — which is `ADR-0008`'s own *"tight, not comfortable"* finding, restated six files later and closer to the wall.

**4. `ADR-0008`'s `pool: "threads"` SCREEN IS STALE AND UNDER-SPECIFIES — this is the one actionable item.** Decision 8 requires *"≥ 20 consecutive green runs including **all four** `*.nfr.test.ts` files"*. **There are now SEVEN**: `gameend`, `glyph-mode`, `history-pane`, `san`, `status-panel`, `turn-loop`, `zobrist`. **The count was CORRECT when `ADR-0008` was written and the drift is dated precisely** — at 2026-08-10 the four were `gameend` (added 08-01), `zobrist` (08-03), `glyph-mode` (08-08) and `san` (08-10); **`history-pane`, `status-panel` and `turn-loop` all landed on 2026-08-11**, after that sentence was written and on the day it was ratified. Those three were not in the screen's contemplation, and `ABC-025`-era evidence showed spied call-count guards are **exactly** the files that break under a changed isolation model. **Whoever runs that screen must read it as "every `*.nfr.test.ts` file", not "the four".** The ADR's *ruling* is untouched and correct; its *census* went stale the same way `00-index.md`'s ADR count did. **No ADR text was edited by this audit and `ADR-0008` is not re-opened.**

**5. `pool: "threads"` is still the right lever and is still NOT adopted here.** It is the only measured saving that does not touch a guard: **−13.97% wall / −10.78% CPU** for a two-line config change, against `--no-isolate`'s larger −30–36% CPU which is **unavailable** because it disarms the spied call-count guards this catalog reached for three times. Threads buys roughly **0.8 s of CPU ≈ 5 more test files** — real, and **not** a substitute for the per-file cost being the structural driver. **Owner remains Architect/Design and the deciding hop remains `ABC-026`'s**, exactly as Decision 8 states. **Nothing is adopted, screened or reversed at this audit.**

### `NFR-008` IS MEASURED — 2026-08-13 by Architect/Design (task `abc026-2026-08-13`, subtask `ABC-026-lane-budget`, Workflow 04). **BOTH CLAUSES MET. `H5` IS DISCHARGED.** **NO TARGET, BAR, LEVEL, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 63f66795…ca31`, unchanged from the `ABC-029` hop) and by hashing each row individually; 46 table lines before and after. **The 3 s / 13 s level is Olger Oeselg's, ratified in person 2026-08-11, and this hop measures AGAINST it rather than touching it.**

**This is the reading `H5` has been owed across two merges.** Two prior hops declined it because a live QE hop shared the same cores; the audit hops that did approach it were explicit that they had not discharged it. **Everything below is a median of ≥ 7 interleaved runs to this row's own protocol** — `npm test`, `PERFT_DEEP` unset, one fresh OS process per run, condition order rotated every round, round 0 discarded as warm-up, **every run asserting its own test-file count AND its own test count** (a run whose tree state is not what its label claims is a harness error and never a datum). **135 recorded runs, 0 harness errors.** Measured at `main` = **`06c5427`**, `src/` = **28 test files / 807 tests**.

**1. THE LANE TOTAL, TWO INDEPENDENT SAMPLES, AND BOTH CLAUSES ARE MET.**

```
n = 8 usable rounds per condition per sample, interleaved                    WALL           CPU (user+sys)
sample A  (in-worktree, loaded: 1-min loadavg median 9.83 on 8 cores)     2.210 s        10.390 s
            spread                                                    1.880-2.970    10.070-11.590
sample B  (in-worktree, quieter: loadavg median 7.65)                    1.845 s         9.975 s
            spread                                                    1.770-2.050     9.660-10.340
sample C  (out-of-tree copy, cmp-verified byte-identical per file)       1.935 s        10.315 s

NFR-008 wall <= 3 s    ->  MET on every sample.  Worst median 2.210 s = 73.7% of the clause.
NFR-008 CPU  <= 13 s   ->  MET on every sample.  Worst median 10.390 s = 79.9% of the clause.
```

**Stated honestly rather than flattered: individual RUNS touched 2.97 s and 3.02 s under concurrent load.** The clause binds the **median**, and the median is MET with margin on all three samples — but the lane is close enough to 3 s that a single loaded run can reach it, and **a single run was never a reading of this row.**

**2. THE CPU CLAUSE BINDS FIRST. The architecture audit's RULING is confirmed; its NUMBER is not.** That audit inferred **~8.6 s CPU** (band 8.24–9.01) by arithmetic on a 22-file / 7.640 s figure and labelled the inference as an inference. **Measured: 9.975–10.390 s — the inference was 14–17% LOW.** The gap is not added test content (the +131 tests since are worth only 46–56 ms at this section's own 0.35–0.43 ms per test); it is that the 22-file baseline it extrapolated from was a *different session*, which is this section's own ±22% fence doing exactly what it warns about. **The audit's qualitative call — CPU binds, not wall — is CONFIRMED, and by a second route it did not have:** on this hop's own identity null control the **wall** clock's null reads **+3.88% (sign 6/8)**, which is LARGER than its signal for two added files (**+1.81%, sign 5/8**), while **CPU**'s null reads **+0.48% (sign 5/8)** against a two-file signal of **+3.49% (sign 7/8)**. **The wall clock cannot see two added test files; CPU can. That is measured here, not inherited.**

**3. The delivery audit's reading is NOT refuted — it was consistent all along, and it was right to refuse to call itself a discharge.** Its **1.98 s wall / 9.51 s CPU** sits 4.5% below this hop's quieter CPU median and between its wall medians — well inside this section's ±22% session fence. Its own stated reasons for not discharging `H5` (runs sequential rather than interleaved) were correct and are what this hop supplies. **So the two prior readings never disagreed about the LANE. They disagreed about the HEADROOM, and the disagreement is entirely explained by the architecture audit having INFERRED its CPU total instead of measuring it.**

**4. THE PER-FILE FLOOR, RE-DERIVED ON THE REAL 28-FILE LANE RATHER THAN INHERITED.** Out-of-tree copies, every copied repository file `cmp`-verified byte-identical per file (250 file copies, 0 mismatches), `K` trivial one-assertion test files importing nothing from the repository, plus a second byte-identical copy as the **identity null control**:

```
files    28 (control)   30 (+2)    32 (+4)    36 (+8)        null control (28, identical copy)
CPU      10.315 s      10.685 s   11.025 s   11.590 s        +0.48% CPU, sign 5/8  ADMISSIBLE
paired delta vs 28        +0.360     +0.615     +1.320  s
sign                         7/8        8/8        8/8
marginal CPU per file     180 ms     154 ms     165 ms
marginal WALL per file     18 ms      34 ms       40 ms   <- and the WALL null is +75 ms, i.e.
                                                             larger than the +2-file signal

fit over files = 28..36:   CPU = 5.920 s + 158.2 ms x files    R^2 0.9954
```

**THE PUBLISHED SLOPE IS RE-DERIVED, NOT INHERITED: 158.2 ms/file against the recorded 159 ms/file — agreement within 0.5%, from an independent harness on a lane six files larger.** **Use 160 ms; this hop's own band is 154–180 ms**, which sits inside the recorded 100–229 ms. **The INTERCEPTS are not comparable and must not be quoted against each other:** the recorded `0.85 s` is an EMPTY-tree intercept fitted over `K` = 1…128 trivial files, while `5.920 s` is this lane's content-loaded intercept fitted over a narrow 28…36 window. **Extrapolating 5.920 s to K = 0 is not valid and is not done here.**

**5. THE HEADROOM, IN THE UNIT A TICKET AUTHOR SPENDS — TEST FILES, WITH THE ARITHMETIC SHOWN.** Computed on the **conservative** (highest) measured CPU median, sample A:

```
remaining CPU under the 13 s clause     13 - 10.390 = 2.610 s     (sample B: 13 - 9.975 = 3.025 s)

files if each added file were EMPTY     2.610 / 0.1582 = 16.5  ->  ~16 files   band 14-19
  (floor only, at the re-derived slope)   band: 2.610/0.185 = 14.1 ; 3.025/0.159 = 19.0

files at TODAY's ALL-IN cost per file   10.390 / 28 = 371 ms per file
  (floor + the content a real file adds) 2.610 / 0.371 =  7.0  ->  ~7 files    band 7-8

tickets at N8-LANE's full 650 ms         2.610 / 0.650 =  4.0  ->  ~4 tickets  before the floor
  content each                                                       those files also cost
```

**USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING.** **This roughly HALVES the audit's ~14 planning / ~27 ceiling, and the correction is entirely the measured-vs-inferred CPU total in item 2 — not a change of method.** `EPIC-003` alone was decomposed into eight tickets implying **7–8 new test files**. **At today's all-in cost that is the whole planning number.** This is `ADR-0008`'s *"tight, not comfortable"* holding, and it is tighter than the last restatement of it.

**6. A CONCURRENT LANE IS LIVE AND THE RESTATEMENT RULE IS ARITHMETIC, NOT A RE-MEASUREMENT.** `ABC-021` is building in a separate worktree and carried **28 test files — no new file yet** — when this was measured. **If it (or any ticket) merges a test file first, do NOT re-measure: restate by arithmetic from the per-file cost above** — subtract **160 ms CPU** (band 154–180) per added file from the remaining 2.610 s, and subtract **one** from the file counts in item 5. The reading is anchored to `06c5427`; that is why the commit is recorded.

**7. WHAT WAS RUNNING WHILE THIS WAS MEASURED — part of the measurement, not a footnote.** Two other agents were live on this machine throughout (one `ABC-021` build in a sibling worktree, one markdown-only refinement cut), plus Chrome, Docker Desktop and VS Code. **98 of the 135 runs began at a 1-min load average above the machine's 8 cores** (min 3.23, median 10.56, max 35.90). **A sibling worktree's vitest was directly observed in exactly 2 of 135 runs** — `npm exec vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts`, i.e. `ABC-021`'s own lane. **Both fell in the `pool: "threads"` slope sweep: one was the discarded warm-up round, and the other landed at the TOP of its condition's range and does not move that condition's median of 8.** **Neither of the two lane-total samples (A and B) nor the per-file floor sweep observed a sibling vitest at all.** The honest reading: **this is a LOADED measurement, the load pushes the absolutes UP, and both clauses are MET anyway** — so the contention makes this reading conservative rather than flattering.

**8. `pool: "threads"` IS ADOPTED, AND THE SCREEN WAS RUN AGAINST SEVEN FILES, NOT FOUR.** See `ADR-0008`'s 2026-08-13 addendum for the ruling and the reasoning; the delivered file is `vitest.config.ts`, which did not exist before this hop. Measured here, paired and interleaved in the same rounds as the totals above:

```
                        CPU delta        sign     WALL delta        sign
sample A            -0.800 s  -7.70%     0/8    -0.510 s -23.08%    0/8
sample B            -0.730 s  -7.32%     0/8    -0.260 s -14.09%    0/8
recorded 2026-08-10           -10.78%     0/8            -13.97%    0/8

per-file CPU SLOPE  forks 158.2 ms/file  ->  threads 138.9 ms/file   = -12.2%   R^2 0.9988
```

**The recorded −13.97% wall replicates almost exactly in the quieter sample; the recorded −10.78% CPU does NOT — this hop reads −7.3% / −7.7%, and that is reported rather than smoothed.** **The audit's characterisation *"a one-time discount, not a change in the slope"* is REFUTED: the slope falls 12.2%.** It is nonetheless a *modest* structural change — the per-file floor is still ~139 ms — so the audit's conclusion that threads is **not a substitute for the per-file cost being the driver** stands. **Headroom after adoption: `13 − 9.545 = 3.455 s`; `3.455 / 0.1389 = ~25` empty files, `3.455 / 0.341 = ~10` files at the all-in mix — i.e. the planning number moves from ~7 to ~10, and the ceiling from ~16 to ~25.**

**9. Creating `vitest.config.ts` was PRICED, because creating a file the runner reads is a real decision.** A config file containing `defineConfig({})` and nothing functional was run as its own condition in the same interleaved harness: **+0.24% CPU (sign 6/8) / −0.45% wall (sign 2/8)** in sample A and **+0.30% CPU (sign 5/8) / 0.00% wall (sign 3/8)** in sample B. **Both sit inside this row's own ≤ 1.5% null band with the sign at chance, so the file's mere existence costs measurably nothing.** **This also settles what would have happened had `A4` REFUSED: `A5` still owes the file, and it can be created at zero measured cost.**

**10. What this reading does NOT establish.** **Not a figure for any other machine or core count** — Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / npm 11.7.0 / vitest 3.2.7; **`UNKNOWN - verify` elsewhere.** **`node_modules` was SYMLINKED from the sibling `cli-chess-example` worktree** — the named environment in this row assumes an installed tree, and a symlink is a deviation from it; it is the same deviation the delivery audit recorded, it affects module *resolution* rather than execution, and it is disclosed rather than buried. **Not a re-measurement of `NFR-001`–`NFR-007`** — none was touched and no target moved. **Not a verdict on any test, file or coverage decision** — nothing was examined for deletion, and `src/` is byte-identical. **Not a proof that `pool: "threads"` cannot flake** — 24 of 24 green bounds the failure rate at roughly **12.5%** by the rule of three, **not at zero**, which is why the rollback is written into `vitest.config.ts` itself.

### THE SPAWN ACCOUNT (`N8-SPAWN`) IS CREATED — 2026-08-15 by Architect/Design (task `g1-answered-2026-08-15`, subtask `design-nfr008-spawn-account`, Workflow 07), **on the project owner's instruction and on no role's own authority**. **Recommended by Security/NFR** at `ABC-042`'s gate as option 2 of three, and deliberately NOT created there (*"I did not create it. I have no authority to and I am not going to invent one at a gate"*); **authorized by the project owner, Olger Oeselg, in session 2026-08-15** — *"My decision: create a spawn account and merge"*; **written here** by the role that owns this row and owns the floor account it is modelled on. **NO TARGET, BAR, LEVEL OR MEASURED FIGURE MOVED ANYWHERE IN THIS FILE. THE 3 s WALL / 13 s CPU CLAUSE IS UNTOUCHED AND THE 5% IS UNTOUCHED** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 63f66795…ca31`, unchanged from the `ABC-029` and `ABC-026` hops) and by hashing each row individually; 46 table lines before and after. **`N8-LANE`'s instrument, statistic, null-control and floor clauses are BYTE-IDENTICAL as well, hashed bullet by bullet before and after — this account is added BESIDE them and changes none of them.**

**What the owner authorized, and what the owner did not — separated here so a later reader can check the reading rather than inherit it.** The owner authorized **a new cost class in an owner-ratified document**, which is the one thing no role here could grant itself; the previous hop named the objection this discharges — *"a coordinator inventing one at a gate is the same loophole with a better justification."* **The owner did NOT authorize a larger budget.** `NFR-008`'s 13 s CPU clause, its 3 s wall clause and the total they express are outside that answer and are untouched. **This account moves ATTRIBUTION. It never moves the total.**

> **`N8-SPAWN` — the CPU of a child process that a ticket's own ACCEPTED CRITERIA force it to spawn is
> charged to `NFR-008`'s SPAWN ACCOUNT, not to the ticket, and is subtracted from that ticket's
> `N8-LANE` charge — exactly as the per-file floor already is. Owner: Architect/Design.**
>
> **IT IS AN ATTRIBUTION, NOT AN ALLOWANCE. Every millisecond charged here is still spent inside
> `NFR-008`'s 13 s CPU clause.** The account answers *"whose cost is this"*. It never answers *"may the
> lane cost more"*.
>
> **WHAT MAY BE CHARGED — one test, and a cost has to pass all three parts of it.**
> 1. It is a **child process**, and what is charged is the **child's own measured CPU** — median of
>    ≥ 5 direct timings on the reference machine, **listed child by child beside the criterion that
>    forces it**. No lump sum, no residual, no estimate. (The protocol is the one Security/NFR actually
>    ran at `ABC-042`'s gate, adopted here with attribution rather than invented.)
> 2. It is **named by an accepted criterion or security bar of the ticket**, and the number of children
>    is **countable off the criterion text before the build exists** — a property of the ticket page,
>    not of the implementation.
> 3. **Deleting the child would require deleting or weakening that criterion.** That is the whole test,
>    and it is the floor account's test in a second dress: *the floor is the runner's cost, not the
>    ticket's* — and a criteria-forced child is the operating system's price of proving a command runs.
>
> **WHAT MAY NOT BE CHARGED — the four things the drawer would otherwise fill with.**
> 1. **The in-process cost of the file that holds the children** — transform, collect, sweeps, source
>    reads, fixtures, helpers. That is CONTENT and it stays on the ticket under `N8-LANE`.
> 2. **A child that proves something an in-process assertion could prove.** If the criterion survives
>    the child's deletion, the child is a convenience and the ticket pays for it.
> 3. **Any child beyond the count the criterion text forces** — repeats, retries, statistical
>    replicates, a loop over one criterion's argv, or a child added after the cut that no criterion
>    names.
> 4. **The per-file floor of the file that holds the children** — that is already the FLOOR account's.
>    **Nothing is charged to two accounts.**
>
> **WHO OWNS IT AND WHO CHECKS IT — BOTH UNCHANGED. Owner: BA/PM at each cut** (who writes the
> ticket's NFR trigger). **Checked by Security/NFR at each gate**, against this wording rather than
> against a per-ticket invention. **A gate does not move this bar, and it does not move this account
> either.** No new owner, no new checker and no new hop is created. Two things this account does fix
> for the checker: **the child count is derived FROM THE CRITERION TEXT, NOT FROM THE BUILD**, and
> **a delivered spawn that no criterion names is a finding against the ticket, never a charge here.**
>
> **WHAT STOPS IT — three stops, because a cost class with no ceiling is a drawer, and an unbounded
> account hands back the geometric budget this row exists to have killed.**
> 1. **THE TOTAL STOPS IT ABSOLUTELY.** A charge that would put the lane's measured median over 13 s
>    CPU — or over 3 s wall — is a breach of `NFR-008` itself, **and this account gives no relief from
>    it.** Nothing charged here is exempt from the total, and the account may never be used to buy a
>    lane the total does not admit.
> 2. **THE CRITERION TEXT IS THE CEILING ON A SINGLE CHARGE**, and it is fixed at the cut — before
>    anyone can know what the measurement will say.
> 3. **TWO TRIP-WIRES, BOTH DENOMINATED IN THE FIXED TOTAL** and never in the lane as it stands (that
>    denominator is the defect this row exists to have killed):
>    - **A single ticket charging more than one full `N8-LANE` slice — more than 650 ms, i.e. more
>      than 5% of the CPU clause — has that figure REPORTED by the gate and carried into the merge
>      decision, never silently netted out.** It does not fail the ticket. It forbids the charge being
>      invisible, which is the whole reason this row prefers an attributable budget to a total.
>    - **When the account's CUMULATIVE charge passes 10% of the CPU clause — 1.3 s, two slices — the
>      account is CLOSED to new charges until Architect/Design restates it in this section against a
>      fresh lane reading.** CLOSED means what it says: while it is closed, a ticket's forced children
>      are charged to the ticket under `N8-LANE` as though this account did not exist.
>
> **The running total is restated in this section at every charge, beside the lane's remaining CPU
> headroom** — the same restatement duty the floor account already carries.
> **OPENING BALANCE: 0 ms. Nothing is charged to this account by the hop that writes it.**
>
> **CPU ONLY.** This is an attribution on the CPU instrument, which is the instrument `N8-LANE` is
> written on. **The 3 s WALL clause is a total, has no per-ticket bar, and knows nothing about
> accounts** — child processes ARE visible on the wall, unusually for this lane, and nothing here
> exempts them from it.

**What this account does NOT do — stated because a carve-out not bounded in writing gets read wider.**

- **It does not move `NFR-008`'s level.** 3 s wall / 13 s CPU is Olger Oeselg's, ratified in person
  2026-08-11, and this hop writes an account against it rather than touching it.
- **It does not re-derive the 5%.** That was option 3 and the owner did not choose it. This row's own
  invitation — *"Re-derive it when the plan changes; the arithmetic is one line"* — is addressed to a
  BA/PM cut hop and **stays open and unexercised.**
- **It does not touch `N8-LANE`'s instrument, statistic, null control or floor clause.** All four are
  hashed byte-identical across this write.
- **It does not grade any ticket, past or in flight.** No verdict, no ratio and no prediction is
  written here. **This account was written against the criterion-text test above, not tuned to any
  ticket's number**, and applying it to a ticket is Security/NFR's at a gate.
- **It does not licence a ticket to spawn.** A ticket does not acquire children by wanting them — the
  criteria must force them, and whether criteria *should* force them is a question for the cut, owner
  BA/PM.
- **It does not create headroom.** The lane's remaining CPU after this section is exactly what it was
  before it.

**TWO CENSUSES GO STALE HERE AND BOTH ARE FLAGGED RATHER THAN REPAIRED.** This row's own table cell
says the budget has **TWO ACCOUNTS**; there are now **three** — content, floor, spawn. `ADR-0008`'s
Decision 6 says the same. **Neither is edited by this hop:** the cell's target, level, instrument,
statistic and machine are byte-identical and what went stale is a COUNT, and `ADR-0008` is
owner-ratified and the account is fully writable without it. **This is the same species as the stale
census this file has already recorded once** — `ADR-0008`'s *"all four `*.nfr.test.ts` files"*, correct
when written and stale at seven, flagged by the 2026-08-12 audit and deliberately not edited. Same
class, same treatment, and the repair is a census correction rather than a ruling.

## `NFR-004` IS RULED FOR THE FIRST TIME — 2026-08-18 by Security/NFR at `ABC-078`'s gate (task `security-nfr-ABC-078-2026-08-18`, subtask `abc078-secnfr`, Workflow 15). **BOTH CLAUSES ADJUDICATED: the ≤ 3 s clause is NOT MET and is an ACCEPTED RISK with a named owner; the 5 s HARD CEILING is BREACHED and its enforcement is RULED OWED BY `ABC-078`.** **NO TARGET, BAR, LEVEL, MEASURED FIGURE OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 63f66795…ca31`, unchanged from the `ABC-029`, `ABC-026` and `N8-SPAWN` hops). **The `NFR-004` row's `Verified by` cell still reads `UNKNOWN - verify` and this hop deliberately did NOT edit it** — see the fence at the end of this section for why.

**This row waited from `EPIC-004`'s cut until now for a measurement, and it got three.** `ABC-078` is the first ticket that could exercise it. **The engineer measured and refused to rule; QE measured harder and wrote *"I do NOT rule `NFR-004`"*. Both refusals were correct — the bar is Security/NFR's — and this section is that ruling.**

### CLAUSE A — "≤ 3 s at default difficulty": **NOT MET. ACCEPTED AS RISK `AR-NFR004-A`.**

**Three independent hops, three DIFFERENT worst-case positions, three worst-case numbers inside 4 ms** — which is the signature of a machine-wide granularity floor rather than a pathological position:

| hop | worst case | position | calls over 3 s |
|---|---|---|---|
| Software Engineer, delivery | 3 027 ms | `position-4/f3d4` | 29/30 |
| QE, validation | 3 030 ms | `position-5/b1c3` | 29/30 |
| **Security/NFR, this gate** | **3 031 ms** | **`kiwipete`** | **27/30** |

**Worst overshoot ever measured: 31 ms = 1.03% of the budget. Median overshoot 2–3 ms over 450 samples.** Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0; **`UNKNOWN - verify` on any other hardware.**

**The attribution is PROVEN, not assumed.** Iterative deepening spends its budget by construction — the last iteration is aborted AT the deadline — and what remains is the abort granularity. QE varied `NODES_PER_CLOCK_CHECK` over a **64x** range and instrumented the check site: median inter-check gap scales **linearly** with the constant on all six benchmark positions, and **`max(gap) >= overshoot` in 24 of 24 runs.** There is no hidden second cause; this gate went looking for one.

**Accepted rather than fixed, for four reasons, and the fourth decides it:** (1) the cause is structural and bounded, not a defect; (2) **both in-module remedies are worse than the overshoot** — aiming at `deadline − margin` makes the sentence true by silently redefining `budgetMs` on the module whose whole subject is that the budget is honest (coding rules 5 and 7), and **dropping `NODES_PER_CLOCK_CHECK` to 256 DOES NOT WORK for this purpose: QE measured a 256-node interval taking 105 ms of wall clock, a GC/scheduler stall the constant has no influence over, so it cuts the MEDIAN ~4x and leaves the TAIL where it is**; (3) materiality is one move's latency in a local CLI, nothing downstream is denominated in this clause, and **live exposure today is nil** — `src/turn-loop.ts` is byte-identical and nothing in the shipped tree constructs an engine; (4) **the clause is dischargeable for free by the party that already owns the choosing** — a caller passing **2 900 ms** puts all 30 measured calls under 3 s with ~70 ms to spare and changes no line of the module. Unlike clause B, clause A really IS a claim about a chosen default: it says *"at default difficulty"*, and the default is `EPIC-006`'s.

> **ACCEPTED RISK `AR-NFR004-A`.** `NFR-004`'s ≤ 3 s clause is missed by ≤ 31 ms (≤ 1.03%) on 27–29 of 30 benchmark calls at `budgetMs = 3000`, by the abort granularity. Accepted for `ABC-078` as delivered. **It also covers the ~3 ms residual over the 5 s ceiling that survives clause B's clamp** — same mechanism, same bound.
> **Owner: Security/NFR, at `EPIC-006`'s difficulty hop** (`ABC-087` if that lands first).
> **Discharge:** that hop either passes ~2 900 ms, making the clause literally true at zero cost, or re-accepts this risk in writing with its number. **It may NOT be discharged by editing this row.**
> **Scope of the acceptance:** it is denominated in a measured 1.03% on named positions on ONE machine. **A later reading materially worse than that is a NEW question and is not covered here**, and `ABC-074`'s off-M3 measurement is still owed.

### CLAUSE B — "hard ceiling 5 s at any difficulty": **BREACHED. Enforcement RULED OWED BY `ABC-078`, and a REQUIRED FIX is specified.**

**Measured twice, independently.** QE: `budgetMs = 4999` → 5 003 ms. This gate, real clock, `kiwipete`: 3 000 → 3 006 ms; **4 999 → 5 000 ms; 5 000 → 5 002 ms; 6 000 → 6 004 ms.** The exact tipping budget moves by a millisecond between runs and **the structure does not: `chooseMove` computes `deadline = start + options.budgetMs` and contains NO reference to 5 000 of any kind.** Elapsed tracks the budget upward without limit — `budgetMs = 600000` would return at ten minutes. **The ceiling holds today only because every caller in existence passes 3 000.**

**THE RULING: the clamp belongs to `ABC-078`, not to `EPIC-006`.** The counter-argument — that `ABC-078` *"takes a budget as a parameter"* and choosing is `EPIC-006`'s — quotes the wrong section of the ticket. **Four reasons, in order of weight:**

1. **The ticket's own `## Scope` claims the ceiling:** *"The default budget: 3 s, hard ceiling 5 s (`NFR-004`)."* `## Out of scope` defers *difficulty selection* — "a flag, a prompt, or how a chosen level persists" — and says in the same breath **"It owns the mechanism; `EPIC-006` owns the choosing."** A ceiling is not a selection; it is the bound inside which every selection must land, i.e. a property of the mechanism.
2. **"AT ANY DIFFICULTY" is exactly the phrase that puts it beyond the caller.** A ceiling that holds only when the caller chooses well is not a ceiling on the engine — it is an unwritten second requirement on the caller. Clause A survives being a statement about a chosen default because it says *"at default difficulty"*; clause B says the opposite.
3. **`EPIC-006` cannot honour a constraint nothing records.** There is today no test, type, constant, comment or ticket line anywhere in the tree saying that a budget above ~4.99 s breaches a merged NFR. **Deferring enforcement to a hop that has not been told the constraint exists is not deferral; it is loss.**
4. **Enforcing it here costs one line** — and closes the module's only genuinely unbounded path for free.

> **REQUIRED FIX `RF-1` — severity MEDIUM.** (`security.block_on` is `high`, so it does **not** block the gate; live exposure is nil today. It is a required fix, not an accepted risk, and it is not closed by anything less than this.) In `src/engine.ts` and nowhere else:
> 1. `export const HARD_CEILING_MS = 5_000;` beside `DEFAULT_BUDGET_MS`, documented as a bound on the MECHANISM — `NFR-004` says the ceiling holds at ANY difficulty, so it is honoured whatever a caller passes; `EPIC-006` chooses a budget, not the ceiling.
> 2. In `chooseMove`'s `budget` initialiser: `deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),`. **`Math.min` and not an `if`, because it preserves every degenerate input already measured safe:** `NaN` → `NaN` (both comparisons false → depth 1, exactly as today); `0` / `-1` / `-1e9` → unchanged; **`Infinity` → 5 000**, which also fixes the module's only non-terminating budget. **No behaviour below 5 s changes at all.**
> 3. Two comment lines — one on `budgetMs` (values above the ceiling are capped, not honoured) and one on `Clock` (must be a real-time, non-decreasing source; `Date.now` satisfies it, a frozen or backwards clock does not terminate).
> 4. **One guarding assertion, on the INJECTED clock, not the wall** — with a virtual clock the search must stop at `start + 5 000` when handed `budgetMs = 10_000`. Machine-independent, millisecond-cheap, reds the moment the clamp is removed, and it honours this catalog's standing rule that **no wall-clock assertion belongs in the default suite**. It adds no test FILE and no child process, so it charges neither `N8-LANE`'s content nor the floor or spawn accounts.
>
> **NOT required, and deliberately so: no validation, no throw, no rejection, and NO SAFETY MARGIN.**

**THE RESIDUAL AFTER THE FIX, recorded now so it is not discovered later as a surprise.** With the clamp, a caller passing 10 s returns at **~5 003 ms — still ~3 ms over a "hard" ceiling.** That residual is `AR-NFR004-A` above: same mechanism, same ≤ 31 ms bound, same owner. **A margin to hide it is refused at this gate.** The engineer declined to invent one, QE recorded that refusal as correct, and this gate agrees: a margin makes the sentence true by making `budgetMs` a lie. **If this project wants the 5 s ceiling literally true to the millisecond, that is a decision to take at `EPIC-006` alongside the budget choice, with its cost visible — not something to slip into a repair hop.**

### THE FENCE ON THIS SECTION

**The row's TARGET is untouched and was never in question.** `≤ 3 s at default difficulty` and `hard ceiling 5 s at any difficulty` stand exactly as written. **This section rules the row; it does not edit it, and a gate could not.**

**The `Verified by` cell still says `UNKNOWN - verify` and that is CORRECT, not an oversight.** The row is now measured on **one machine** and is enforced by **nothing** until `RF-1` lands. The cell moves when the off-M3 obligation (`ABC-074`, `Blocked`) reports — not when a gate takes a reading on an M3.

**Every number in this section is true of Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0 and of nothing else.** No production file was modified to take any of these readings: the ceiling and degenerate-budget probes are throwaway scripts outside the repository that IMPORT `src/engine.ts`, and the deep lane ran on an out-of-tree copy. `src/` is byte-identical across this hop.

## `NFR-005` IS MEASURED FOR THE FIRST TIME — 2026-08-18 by Security/NFR at `ABC-078`'s gate. **IT SITS BELOW ITS FAIL FLOOR AND THE FLOOR IS NOT RELAXED, NOT LOWERED AND NOT ONE BYTE EDITED. THE TICKET DOES NOT FAIL ON IT.** This is a WAYPOINT, not a verdict.

**Three independent readings at the 3 s budget, and the number is stable:**

| hop | `kiwipete` | `position-6` |
|---|---|---|
| Software Engineer | depth **4**, 81 968 nodes, 3 005 ms | depth **3**, 101 422 nodes, 3 025 ms |
| QE | depth **4**, 91 184 nodes, 3 021 ms | depth **3**, 114 734 nodes, 3 025 ms |
| **Security/NFR, this gate** | depth **4**, 88 112 nodes, 3 030 ms | depth **3**, 91 182 nodes, 3 005 ms |

**Against this row: `≥ depth 6` is the FAIL floor and depth 7 the PROVISIONAL WARN level. Measured: depth 4 and depth 3 — two and three plies below the floor.** Apple M3 (Mac15,13); `UNKNOWN - verify` elsewhere.

**THE FLOOR IS NOT RELAXED.** The temptation at a gate that measures 4 against a 6 is to argue the 6 was optimistic. It was not, and it is not a gate's to move regardless: the level is **`ADR-0003` clause 2 as amended by Olger Oeselg on 2026-07-30.** **The gap is evidence about the ENGINE, not about the BAR.**

**`ABC-078` DOES NOT FAIL ON IT, and the reason is causal rather than charitable.** This row measures **the search**; `ABC-078` did not build the search — it built the time control around it. **The three tickets that buy depth at a fixed budget are all unbuilt: `ABC-080` (move ordering — conventionally several plies, and the largest single item), `ABC-079` (quiescence), `ABC-081` (transposition table).** Iterative deepening WITHOUT move ordering is the configuration in which alpha-beta is worth least, because ordering is what makes the previous iteration's best move pay for the next one. **Charging `ABC-078` with depth 4 charges the clock for the engine's strength.** The ticket's own `Security / NFR triggers` section predicted exactly this in advance — *"first point at which the FAIL floor and WARN level are measurable at all. Report; do not rule."*

**THE FLOOR IS NOT DUE YET, and that distinction is the point of this entry.** Recording "FAIL" against a third-built engine would burn the word — the next reader would find a FAIL against a bar nobody intended to be met yet and would either relax it or ignore it, and both are how bars die. Recording nothing would be worse.

> **WHEN THE FLOOR BECOMES DUE — the test the next reader inherits.** **At the close of the LAST of `ABC-079`, `ABC-080` and `ABC-081`.** From that point `NFR-005` is live on `kiwipete` and `position-6` at 3 s and a miss IS a FAIL. **A reading taken after only one or two of them is another waypoint, not a verdict — record it as one.** **The depth-7 WARN level stays PROVISIONAL until `ABC-074`** (`Blocked`, wants a non-M3 machine); this gate does not lift that marker and could not, since every number here is true of one machine. **`ABC-074` being blocked does NOT block the FAIL floor — depth 6 is not provisional; only depth 7 is.**

**The honest size of the gap, so nobody is surprised at that hop:** depth 4 → depth 6 is two plies at the ~6 effective branching factor this catalog models, i.e. **roughly 30–40x more work inside the same 3 s.** That is not a tuning distance; `ADR-0003`'s own model says the three unbuilt tickets are what pay for it. **If all three land and the number is still 4, THAT is a finding about the engine**, it belongs to whoever closes the last of them, and at that point the row's level is argued on evidence by Architect/Design and the owner — never by a gate.

## `N8-LANE` AT `ABC-078` — **NOT MET at ~840 ms net against 650 ms (1.29x)**, and the LANE'S OWN BUDGET WAS ALREADY SPENT BEFORE THIS TICKET ARRIVED — 2026-08-18 by Security/NFR at `ABC-078`'s gate. **NO LEVEL, ACCOUNT, INSTRUMENT OR CLAUSE MOVED: `NFR-008`'s 3 s wall / 13 s CPU is Olger Oeselg's and is untouched; `N8-LANE`'s 5%, CPU instrument, paired-median statistic, identity null control and 160 ms floor are untouched; `N8-SPAWN`'s opening balance stays 0 ms.**

**The engineer could not take this under the row's own protocol** (six sibling worktrees live inside the shared checkout) and honestly said so. **This gate could, and the conditions are different rather than merely newer:** three **out-of-tree** copies of the delivered tree, so no sibling worktree is inside any measured tree and `.claude/worktrees/` does not exist in any of them; machine 1-min load average **2.92** on 8 cores at the start.

- **A** = the delivered tree, 36 test files / 1 016 tests
- **B** = the same tree without `src/engine.test.ts`, 35 files / 999 tests — **the lane as it stood BEFORE this ticket**
- **C** = a `diff -r`-verified byte-identical twin of A — **the identity null control this row requires**

Protocol as this row writes it: CPU (user + sys), one fresh OS process per run, condition order rotated every round, **9 rounds, round 0 discarded, n = 8**, every run asserting its own test-FILE count and test count (**27 usable runs, 0 harness errors**).

```
paired per-round CPU deltas, seconds       A-B (this ticket's file)    C-A (identity null)
rounds 1..8      +0.88 +0.87 +0.89 +1.94 +1.11 +0.86 +1.39 +1.40   -0.09 -0.10 +0.15 -0.22 -0.04 +0.23 -0.12 -0.68
MEDIAN                        +1.000 s                              -0.095 s  =  -0.66%
SIGN                             8/8                                   2/8 positive  -> at chance

  null control -0.66% CPU with its sign at chance  ->  INSIDE the row's <= 1.5% clause  ->  ADMISSIBLE

condition medians, n = 8            CPU (user+sys)      WALL
A  delivered,        36 files          14.635 s        2.935 s
B  without the file, 35 files          13.400 s        2.805 s     <- the lane BEFORE this ticket
C  identity twin,    36 files          14.540 s        2.960 s

THE CHARGE     gross +1 000 ms  -  160 ms floor (1 file)  -  0 ms N8-SPAWN  =  ~840 ms net
               against N8-LANE's 650 ms  =  1.29x  =  6.5% of the 13 s CPU clause     NOT MET
```

**Nothing is chargeable to `N8-SPAWN`:** `src/engine.test.ts` spawns no child process and no accepted criterion of `ABC-078` forces one. The account's balance is unchanged at **0 ms**.

**FINDING 1 — about `ABC-078`. `N8-LANE` NOT MET. Severity LOW. It does not fail the ticket.** The engineer never claimed it met — it reported ~700 ms net, named its confound and refused to rule. **That refusal was correct, and the confound was not what put the number over: cleaner conditions read the charge HIGHER (~840 ms, not ~700 ms).** It does not fail the ticket because (a) the miss is **190 ms on a 13 000 ms clause — 1.5% of the lane** — and it is reported rather than netted away, which is what this row asks a gate to do; (b) **`ABC-025`'s `N5` missed at 1.6x, was accepted as an owned risk and merged — 1.29x is inside that precedent**, applied rather than re-invented; (c) the content is not waste — the expensive repetitions already sit behind `ENGINE_DEEP=1`, the default-lane cases already use millisecond budgets as the ticket required, and this gate looked for a cheap 190 ms rather than assuming there was none; (d) **QE found three of this ticket's criteria are guarded by tests that do not detect what they exist to detect, so a follow-up that makes those guards real will COST lane time, not save it.** Trimming a file whose guards are known-thin, to buy 190 ms, optimises the wrong quantity.

> **ACCEPTED RISK `AR-N8LANE-078`.** `ABC-078` charges ~840 ms CPU net against `N8-LANE`'s 650 ms (1.29x; 6.5% of the 13 s clause). Accepted, and **reported into the merge decision rather than silently netted out**. **Owner: Architect/Design**, who owns `NFR-008`, its floor account and its spawn account. **Discharge: at the lane re-measurement below, where this 840 ms is one input among many rather than a separate question.**

**FINDING 2 — about THE LANE, not about `ABC-078`, and it is the larger of the two.** **Condition B — the lane exactly as it stood before this ticket — medians 13.400 s CPU against `NFR-008`'s 13 s clause.** The engineer, from a very different machine state, measured **12.2–13.1 s** for the same thing. **Two independent readings, two machine conditions, both landing at or over the clause.** This would be true if `ABC-078` had never been cut; **charging it to this ticket would be a category error — the ticket did not spend the lane's budget, it arrived after the budget was spent and asked for a slice that was no longer there.**

**And it is precisely what this row's own arithmetic forecast, out loud, on 2026-08-13:** 9.545 s CPU at 28 files post-`threads`, *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING"* at ~341 ms all-in per file, *"tight, not comfortable"*. **The lane now carries 35–36 files. Seven to eight files have been added since — the whole planning number, exactly as forecast. The row did not fail to see this coming; nobody re-read it at a cut.**

> **`OQ-1` — OPEN, and it wants a ticket. Owner: Architect/Design** (this row's owner; a gate does not move this bar and does not restate this row).
> 1. **Re-measure the lane total under this row's own protocol on a QUIET machine** — this gate's was not one — and restate the reading anchored to a commit.
> 2. **Rule on the CPU clause.** Either the lane is genuinely over 13 s and something gives, or the restated figure says it is not. **Both answers are useful; not asking is not.**
> 3. **If it is over, the options are Architect/Design's and the owner's, not a gate's.** Named only so the ticket is not written from scratch: `ADR-0008` records that **`isolate: false` saves 30–36% and is UNAVAILABLE** — it disarms three `*.nfr.test.ts` guards, **do not rediscover that lever**; moving the slowest content behind an existing opt-in lane is available; **re-deriving the 5% against today's plan is this row's own standing invitation and is still unexercised**; and moving the 13 s level is the owner's alone. **This gate recommends none of them and records that the question is now due.**
> 4. **Until it is ruled, `N8-LANE` cannot honestly be granted to any ticket — a 5% slice of a total that is already spent is not a slice of anything.** That is the sentence the next gate should inherit.

**WHAT THIS READING DOES NOT ESTABLISH — the honesty clause, and it is why `OQ-1` is an open question rather than a verdict.** All-in cost here is 13.400/35 = **383 ms per file** against the ratified 2026-08-13 post-`threads` figure of **341 ms**; deflating my base by that 12% puts it near **11.9 s, under the clause**. **A fraction of these absolute totals is load inflation and this gate cannot separate it from content.** So: **the paired deltas are the robust part** — and this row is deliberately written on paired deltas, which is exactly why. **The absolute totals are indicative and discharge nothing.** **This section does NOT record "`NFR-008` BREACHED" as a verdict** — that verdict is Architect/Design's, under this row's protocol, on a quiet machine. It records that two independent readings from two machine states both land at or over the clause, and that the question is due. **Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7; `UNKNOWN - verify` elsewhere.** `node_modules` was symlinked into each out-of-tree condition — the same disclosed deviation every prior lane reading on this project carries — and `AGENTS.md` was copied into each condition because `src/cli.test.ts` reads it. **No repository file was modified: `src/` is byte-identical across this hop and nothing was moved or reverted.**


## `OQ-1` IS RULED — **`NFR-008`'s CPU CLAUSE IS BREACHED at 14.480 s against 13 s**, and `N8-LANE` IS A **RATE LIMIT, NOT A GRANT** — 2026-08-19 by Architect/Design (task `design-oq1-lane-budget-2026-08-19`, subtask `design-oq1-lane-budget`, Workflow 07), the row's owner, at `ABC-108`. **NO TARGET, BAR, LEVEL, FLOOR, ACCOUNT, INSTRUMENT OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 63f66795…ca31`, unchanged from the `ABC-029`, `ABC-026`, `N8-SPAWN` and `ABC-078` hops) and by hashing each row individually; 56 table lines before and after. **`NFR-008`'s 3 s wall / 13 s CPU level is Olger Oeselg's, ratified in person 2026-08-11, and this hop rules AGAINST it rather than touching it. `N8-LANE`'s 5%, CPU instrument, paired-median statistic, identity null control and 160 ms floor are untouched, and `N8-SPAWN`'s balance stays 0 ms.**

**This is the verdict `OQ-1` said was Architect/Design's and nobody else's.** The full reading, its raw per-run data, its protocol and its honesty clause are in `.grugops/context/design-oq1-lane-budget-2026-08-19/notes/` and are **not restated here** — this section carries the ruling and the numbers it is ruled on.

### THE RULING, and both clauses get an answer or an honest refusal

> **`NFR-008` CPU (`≤ 13 s`): BREACHED.** Ruled on **14.480 s**, at `main` @ **`54cbb23`**, **39 test files / 1181 tests**. **Over by 1.480 s = 111.4% of the clause.**
>
> **`NFR-008` WALL (`≤ 3 s`): NOT RULED, and deliberately so.** Two samples straddle it — **2.805 s (93.5%)** and **3.120 s (104.0%)**. **A clause whose verdict flips with the filesystem cache has not been measured well enough to rule, and picking the flattering sample is exactly what `ABC-108` exists to prevent.** It is the first time any sample of this lane has exceeded 3 s. **It wants its own measurement and it is not this ticket's clause.**

Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / macOS 26.5.2 / Node v24.12.0 / vitest 3.2.7. **`UNKNOWN - verify` on any other hardware.**

### The two samples. **The ruling is taken on the LOWER of them, deliberately**

Out-of-tree copies from `git archive 54cbb23` (tracked files only, so **no `.claude/worktrees/` existed in any measured tree** — the `vitest.config.ts` trap avoided by construction and verified by counting, not assumed), `node_modules` symlinked in — **the same disclosed deviation every prior lane reading on this project carries**. `AGENTS.md` needed no separate copy this time because it is tracked; the inherited reading's second disclosed deviation **does not arise here**, which is a difference from it rather than a silent repeat. **`ABC-078` is IN and that is no longer a choice: it merged, as did `ABC-037`.**

```
SAMPLE 1 - the protocol reading. CPU (user+sys), one fresh OS process per run, condition order
rotated every round, 9 rounds, round 0 discarded, n = 8, every run asserting its own test-FILE
count AND test count. 27 usable runs, 0 harness errors.

condition medians, n = 8              CPU (user+sys)      WALL
A  the lane, 39 files / 1181 tests       14.760 s        2.805 s     range 14.67-15.05 / 2.75-2.85
N  diff -r-verified identity twin        14.795 s        2.785 s
P  A + 8 trivial one-assertion files     16.120 s        2.880 s     (47 files / 1189 tests)

IDENTITY NULL CONTROL  N-A  +15 ms = +0.10% CPU, sign 5/8   ->  inside the <= 1.5% clause,
                                                                sign at chance -> ADMISSIBLE
                                                                (recorded before the treatment)
SLOPE PROBE            P-A  +1230 ms CPU, sign 8/8          ->  153.7 ms CPU per test file

SAMPLE 2 - the COOLED series. Six single runs of A with a 90 s idle gap before each, load read
immediately BEFORE each run. NOT protocol-conformant (n = 6) - a supplement, never averaged.

MEDIAN  14.480 s CPU / 3.120 s WALL      range 14.19-14.78 / 3.03-3.26     load before: 1.44-2.77

NFR-008 CPU <= 13 s   ->  14.480 s = 111.4%   OVER by 1.480 s        <- THE RULED FIGURE
                          14.760 s = 113.5%   OVER by 1.760 s
NFR-008 WALL <= 3 s   ->   2.805 s =  93.5%   /   3.120 s = 104.0%   <- straddles; not ruled
```

**The cooled sample reads LOWER CPU and HIGHER wall than the protocol sample, and that is reported rather than smoothed.** Lower CPU at lower load is what a machine should do; higher wall is not. **The consistent explanation is a cold filesystem/JIT cache after each 90 s idle gap — interleaved rounds run warm — and it was NOT separately established, so it is a candidate and not a cause.** It is precisely why the wall clause is left unruled.

### `A1` FAILED — quiet could not be bought, so the contamination was **SIZED** instead of asserted

**The lowest 1-min load average observed anywhere in this hop was 1.44 and the maximum was 10.24, against `A1`'s threshold of 1.0.** `ABC-108`'s ⚠️ and its `## Dependencies` were right: ~20 agent worktrees are live on this machine and it cannot be quieted from inside itself.

**`A1` also cannot be satisfied by a measurement of THIS lane on THIS machine at all, and that is a property of the criterion rather than of the machine.** The lane runs `pool: "threads"` at `availableParallelism() − 1` = 7 workers, consuming ~14.6 s of CPU in ~2.9 s of wall — **~5x parallelism.** A back-to-back interleaved harness therefore pushes the 1-min load average above 1.0 **by itself, inside one round**, whatever else is running. **A load threshold sampled at round boundaries during a self-parallel harness measures the harness.**

**So the ruling does not rest on a claim of quiet. It rests on a measured bound on the contamination:**

```
load sensitivity of this instrument, measured three independent ways
  within sample 1, load rose 3.2x (3.0 -> 9.5) during the run          +1.63% CPU
  across the samples, load fell ~3x (7.19 -> 2.17)                     -1.90% CPU
  the single QUIETEST run of the whole hop, at load 1.74               14.15 s = 8.8% OVER

deflation required to bring the ruled figure under 13 s                 10.2%
largest load effect measurable over a 6x load swing (1.7 -> 10.2)        1.9%
                                                          RATIO         5.4x
```

**The breach is five to six times larger than the entire measured load sensitivity of the instrument, and not one of the fifteen runs of this lane taken in this hop — at any load — came in under 13 s.** That is a bounded honest answer from a machine that failed `A1`, and it is offered as exactly that.

### `A4` — the per-file all-in cost, and **the honesty clause `ABC-108` was built around is DISCHARGED**

```
ratified 2026-08-13, post-`threads`      9.545 s / 28 files  =  341 ms per file
Security/NFR 2026-08-18 (condition B)   13.400 s / 35 files  =  383 ms per file
THIS RULING, sample 1                   14.760 s / 39 files  =  378 ms per file
THIS RULING, sample 2 (cooled)          14.480 s / 39 files  =  371 ms per file
```

**This hop lands BETWEEN the two figures while being taken at a LOWER load than either.** `ABC-108` was written so it could not be read as though the breach were established, because Security/NFR read 383 against 341 and could not size the difference. **It is sized now:**

- **ATTRIBUTED — of the 42 ms/file gap, ~7 ms/file (about 2%) is load** by the sensitivity measured above, and **the remaining ~35 ms/file — five sixths of it — is content and file mix.** The lane grew **28 → 39 files and 807 → 1181 tests**, and the eleven files added since the ratified reading cost `(14.480 − 9.545) / 11` = **449 ms per file all-in, 32% above the old lane's 341 ms average.** The lane did not drift slower per file; **it took on eleven above-average files.**
- **REPORTED BUT CONFOUNDED, and not banked — this hop's slope reads 153.7 ms/file against the ratified post-`threads` 138.9 ms/file (+10.7%).** This row's own floor measurement records that marginal cost **rises with file count**, and this window is 39→47 against the ratified 28→36. **Some unknown share of that +10.7% is the window, not the load.**
- **NOT ATTRIBUTABLE, and it cuts AGAINST deflation rather than for it — the ratified 341 ms is ITSELF a loaded figure.** Item 7 of the 2026-08-13 reading states it in its own words: two other agents live throughout, **98 of 135 runs beginning above 8 cores (load median 10.56, max 35.90)**, *"this is a LOADED measurement, the load pushes the absolutes UP, and both clauses are MET anyway."* **Deflating today's number toward a baseline that is itself inflated is not a correction; it is double-counting in the lane's favour.** The honest residue: **how much of the ratified 341 ms is inflation is `UNKNOWN - verify` — only that it is not a floor.**

### This row's OWN restatement arithmetic reaches the same verdict, from 2026-08-13's published numbers alone

Item 6 of the 2026-08-13 reading says: when files land, **do not re-measure, restate by arithmetic.** Nobody ever ran it. Run now against 39 files:

```
floor only, at the ratified threads slope   9.545 + 11 x 0.1389  =  11.07 s   under
at this hop's measured slope                9.545 + 11 x 0.1537  =  11.23 s   under
at the ratified ALL-IN 341 ms/file          9.545 + 11 x 0.341   =  13.30 s   OVER THE CLAUSE
MEASURED                                                            14.48 - 14.76 s
```

**The clause was already arithmetically breached on this row's own published per-file figure, before any measurement of mine and before `ABC-078` was cut.** The row forecast it out loud on 2026-08-13 — *"USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING"*, *"tight, not comfortable"* — **and eleven files landed against a planning number of seven.** The measurement confirmed a published forecast; it did not discover a surprise. **The gap between the arithmetic restatement (13.30 s) and the measurement (14.48 s) is those eleven files being heavier than average, and it is 1.18 s — most of the breach.**

### `A6` — WHAT `N8-LANE` MEANS FROM 2026-08-19 FORWARD. **This grants nothing and loosens nothing**

Security/NFR left the next gate the sentence *"a 5% slice of a total that is already spent is not a slice of anything."* **Here is the sentence that replaces it:**

> **`N8-LANE`'s 650 ms is STILL MEASURED, STILL BINDING, and STILL 5% OF THE 13 s CLAUSE — but from 2026-08-19 it is a RATE LIMIT and NOT A GRANT, and passing it no longer implies `NFR-008` is respected, because it is not.** A ticket still measures its charge under this row's protocol and still states it against **650 ms**, against **the clause** and never against the current lane. **What it may no longer do is conclude anything about the budget from passing.** The lane is **overdrawn by 1.480 s**, so every charge — including a fully compliant one — adds to an overdraft.

**Three consequences, written so they cannot be read as permission:**

1. **`N8-LANE MET` may never again be written to mean "the lane is within budget".** Write the measured milliseconds, then the ruled clause state. A cut or a gate that writes only a percentage of the budget has said nothing true.
2. **Every ticket in flight and in `Backlog` carrying an `N8-LANE ≤ 650 ms` line KEEPS that line and it is still checkable.** The arithmetic that stopped being honest was *"and therefore the lane is fine"*, never the 650 ms. **No ticket needs re-cutting for this and BA/PM does not have to re-open pages.**
3. **Nothing is looser than what it replaced.** The 5%, the CPU instrument, the paired-median statistic, the identity null control, the 160 ms floor and `N8-SPAWN`'s 0 ms are all unmoved; every clause is strictly **harder** to read as a pass than it was yesterday.

### `AR-N8LANE-078` — DISCHARGED as an input, exactly as it was framed

`ABC-078`'s ~840 ms is **not** the cause of the breach, and charging it there would be the category error Security/NFR already named: **the arithmetic restatement was over the clause at 13.30 s on 2026-08-13's own published figure, before `ABC-078` existed.** **`AR-N8LANE-078` is closed as an accounting question and stands as a historical record; its 190 ms overspend is 13% of the 1.480 s deficit and removing it entirely would not clear the clause.** No new risk is opened against `ABC-078`.

### THE REMEDY IS NOT CHOSEN HERE — but the options are now **SIZED** rather than listed

**The deficit a remedy must close is 1.480 s** (1.760 s on the protocol sample). `ABC-108` fences the remedy out and this ruling keeps that fence.

1. **`isolate: false` — UNAVAILABLE, and NOT rediscovered.** `ADR-0008` decision 7: 30–36% saving, green in 4 of 21 runs, disarms `zobrist.nfr.test.ts` / `gameend.nfr.test.ts` / `san.nfr.test.ts`. **It would close this gap twice over and it is still not available.** Recorded so nobody spends a hop finding it again.
2. **Move WHOLE FILES behind an existing opt-in lane** (`PERFT_DEEP` / `SEARCH_DEEP` / `ENGINE_DEEP` / `INPUT_DEEP`). **AVAILABLE, and the only lever an agent can pull.** **Sized, and the sizing is the useful part: ~70% of this lane's CPU is the per-file floor, not test execution** — the whole per-file in-worker time sums to roughly 4.2 s of a 14.5 s total. **So trimming assertions inside files aims at the smaller 30% and cannot close 1.480 s; only moving a whole file removes its floor.** At 371 ms all-in per average file that is **~4 average files**, or fewer heavy ones. **`UNKNOWN - verify`: the all-in saving of moving any SPECIFIC file was not measured here and must be measured by the remedy ticket, never inferred.** **The price is named: it removes default-lane coverage, against this project's standing convention that every acceptance criterion is answered in the default lane.**
3. **Re-derive the 5% against today's plan** — this row's own standing invitation, **still unexercised**. **Plainly: it creates no headroom.** It changes what a *ticket* may spend, not what the *lane* already costs. Worth doing; not a remedy for this breach.
4. **Moving the 13 s level is the owner's alone and this hop STOPS at naming it.** It is `ABC-108`'s `## Out of scope`, it is this row's own wording, and it is Olger Oeselg's, ratified in person 2026-08-11. **Not recommended, not argued obsolete, not moved.**

### WHAT HAPPENS NEXT — and the one thing this ruling could NOT do

**A remedy ticket is OWED and it is `P0`** by `ABC-108`'s own named promotion trigger. **Stated honestly: that trigger says *"on a quiet machine"* and this machine was not one — the trigger is met on substance, because the contamination was sized at 1.9% against a 10.2% breach, not because `A1` passed. It did not.**

**`A5` asks this ruling to name a follow-up ticket ID and it cannot supply one.** Cutting a ticket and assigning an id are **BA/PM's at a cut**, and the board is the Orchestrator's. **Inventing an id here would be fabricating a board state**, so the ruling names the requirement, the priority and the owner and leaves the id to be written in by BA/PM at the cut. **That is a stated gap in `A5`, not a silent one.**

### ESCALATED, plainly, rather than routed around

1. **`NFR-008` is a merged, ratified contract and it is now BREACHED.** The clause did not change — the lane grew past it. **Every remedy that closes the gap changes something the owner ruled:** option 2 changes what the default lane guarantees, option 4 changes his level. **That choice is Olger Oeselg's and it is escalated, not routed around.**
2. **`ABC-108`'s `A1` is unsatisfiable as written** for a self-parallel lane on this machine. The measurable replacement that worked is the **load SENSITIVITY** of the instrument. Whoever re-scores that page should know `A1` failed, why, and that the ruling stands on the bound rather than on a claim of quiet.
3. **The wall clause is unruled and one sample is over it** — the first 3 s+ sample this lane has produced. It wants its own measurement with the warm/cold question settled.

**THE FENCE ON THIS SECTION.** This hop **measured and ruled**; it **moved nothing**. No target, bar, level, floor, account, instrument, statistic, null control or `UNKNOWN - verify` marker was edited anywhere in this file; the eight rows hash to `63f66795…ca31` unchanged; `src/` is byte-identical and `git diff --name-only` under `src/` is **empty**; no test was added, deleted, trimmed or moved; no board column was moved; nothing was merged or deployed. **The measurement harness ran entirely outside the repository and is not committed — this ruling's own charge against the lane is 0 ms, and `N8-SPAWN`'s balance stays 0 ms.**

## `G-QE115-3` IS RULED — **`N8-SPAWN`'s TIME CLAUSES ARE CUT-TIME AND ROLE-CHECKED BY DESIGN; an account whose only mechanical pin is its COUNT is the CORRECT shape** — 2026-08-21 by Architect/Design (task `residual-G-QE115-3-2026-08-21`, subtask `residual-gqe115-3`, Workflow 07), the row's owner, at the owner's instruction. **NO TARGET, BAR, LEVEL, FLOOR, ACCOUNT, INSTRUMENT, STATISTIC, NULL CONTROL OR `UNKNOWN - verify` MARKER MOVED ANYWHERE IN THIS FILE** — all eight rows `NFR-001`–`NFR-008` verified byte-identical by hashing the matched row lines together before and after the write (`sha256 63f66795…ca31`, unchanged from the `ABC-029`, `ABC-026`, `N8-SPAWN`, `ABC-078` and `OQ-1` hops); 56 table lines before and after. **`NFR-008`'s 3 s wall / 13 s CPU level is Olger Oeselg's, ratified in person 2026-08-11, and is untouched. `N8-LANE`'s 5%, CPU instrument, paired-median statistic, identity null control and 160 ms floor are untouched. `N8-SPAWN`'s ceilings, charging test, four exclusions, three stops, owner, checker and `0 ms` balance are untouched.** This is the **restatement in this section** the account reserves to Architect/Design, and it restates **how the clauses are CHECKED** — never what may be charged.

**This section carries the ruling. The reasoning, the alternatives and the rollback falsifier are `ADR-0017`; the raw measurements are `.grugops/context/residual-G-QE115-3-2026-08-21/notes/`. Neither is restated here.** `NFR-008` is **NOT GRADED** here and **NO `N8-LANE` LINE IS CLAIMED** — that is `ABC-108`'s and it is open.

### The ruling

> **A `N8-SPAWN` instance's COUNT clause is mechanically pinnable and IS pinned. Its TIME clauses — added wall, and added CPU per added child — are NOT, and no lane, harness, instrument or proxy is owed for them. This is the intended shape.**
>
> **The reason is a difference in KIND, not in effort.** The count is a **STATE** property of one tree: in-process, machine-independent, deterministic, free, and **it survives the merge as a live invariant**. The time clauses are **DELTA** properties **between two commits** — *"measured as the median of >= 5 interleaved paired runs against the immediate base commit"* — and a test inside the tree has one tree. Three consequences, each alone sufficient: **(a)** asserting the delta means running the whole default lane ten times *from inside the default lane* — **~46 s wall / ~166 s CPU against a total of 3 s / 13 s, ~12.8x the budget it guards**; **(b)** the instrument is the real machine clock, which this catalog bars from the suite, and the **injected-clock** escape used everywhere else is unavailable because the quantity named IS real time; **(c)** a cut-time delta against a named base is **history after the merge and cannot drift** — the live invariant is the count, and the count is pinned.
>
> **`N8-SPAWN` is not the account that lost its guard. It is the only one that ever had one**, because one of its three clauses happened to be a state property. `N8-LANE`'s 650 ms, the 160 ms per-file floor and `NFR-008`'s own level are all asserted by nothing mechanical and all ruled by a role at a hop. **A budget clause here may be role-checked without being weak.**

### What replaces the gate — TWO NAMED TRIGGERS. Owner and checker are UNCHANGED

**Owner: BA/PM at each cut. Checked by Security/NFR at each gate** — exactly as this account already says. **No new role, no new hop, no new gate command, no config change.** What was missing was the trigger, and one of the two was invisible.

- **`T1` — a hop that CHANGES THE NUMBER OF CHILDREN re-measures BOTH time clauses** under this account's protocol. **Already effectively enforced**: the count pin forces such a hop to edit the literal and write its reason, and it fired twice on `ABC-115` (+5 → +6, +6 → +7). This only writes it down.
- **`T2` — a hop that changes WHAT AN EXISTING CHILD DOES** — its argv, its stdin script, its substitution hook, its settle — **re-measures the per-child CPU clause, whether or not the count moves.** **This trigger existed nowhere before this ruling**: not on the ticket, not in this account, not in the test file, not in QE's residual. **It is the substantive addition, and it is this account's own rule read honestly** — *"a child no criterion names is a finding against the ticket"* extended to *a child that stopped being the child its criterion priced*.

### `AR-N8SPAWN-DRIFT` — the accepted risk, because a residual with no carrier is how this board loses things

> **`AR-N8SPAWN-DRIFT`.** An existing criterion-forced child can be made **arbitrarily more expensive with no mechanical signal whatever**. **MEASURED at this hop, not asserted:** deleting one substitution hook in `src/cli.test.ts` (**one line**, `black: play(["--colour", "black"])`) makes an existing child run the real engine — **+2.68 s wall and +2.60 s CPU, 8.6x the `<= 0.30 s` per-child clause from a SINGLE child — and the lane stays 40 files / 1213 tests / 1213 passed, exit 0**, count pin included. **ACCEPTED, with `T2` as its only control. Owner: Architect/Design**, who owns this row and this account. **Discharge: at `ABC-108`'s remedy**, where a child that grew is one input among many — the same framing `AR-N8LANE-078` was discharged under. **REPORTED to `ABC-108`, not charged to it; `N8-SPAWN`'s balance stays 0 ms.**

**And the finding that decides the ruling, stated separately because it is the counter-intuitive part: the clauses are written on ADDED children, and that mutant adds none.** A faithful mechanical implementation of the clauses **as written** — the 166 s harness — **would report compliance on the one mutant that matters.** Building it would convert an honest known gap into a false assurance, against this project's hardest-won test rule: **never ship a guard you have not watched go RED.**

**Stated plainly so this is not read as safety: the risk is REAL and LIVE.** This lane is already breached by **1.480 s**; one hook deletion would nearly double that breach in a single silent line. **It is accepted because the cheapest honest guard costs ~12x the budget and is green on the mutant anyway — not because it is small.**

### What is DISPOSITIONED and what is CARRIED — so the next hop does not re-raise a settled thing

- **`G-QE115-3` is DISPOSITIONED, not carried.** *"Two of `N8-SPAWN`'s three clauses are asserted by nothing mechanical"* is **TRUE, and it is the design.** **Do not re-raise it as a defect.** It has now been raised twice by two roles — Security/NFR at `ABC-042`'s gate, QE as `G-QE115-3` — which is why it earned an ADR rather than only a note.
- **`AR-N8SPAWN-DRIFT` is CARRIED**, with a named owner and a named discharge. It is a **different and larger** hole than the one `G-QE115-3` names.
- **To OVERTURN this ruling: produce the guard, do not re-argue the gap.** The falsifier is in `ADR-0017`'s `## Rollback` and it is runnable — a default-lane assertion under ~50 ms, machine-independent, **RED on that one-line mutant and GREEN on the base tree.** If it exists, this ruling is wrong.
- **ONE EDIT IS OWED ELSEWHERE AND IS NOT MADE HERE.** `AGENTS.md`'s `## Test` section documents four opt-in lanes and a reader could reasonably expect a fifth; **the edit owed is one sentence, and its owner is whoever holds that file next. `ABC-109` is live against it and under a byte cap**, so it is named as owed and left alone. **Nothing in `AGENTS.md` is false today.**
- **ONE TICKET IS NAMED AND NOT CUT** — *record the `T2` trigger in the gate checklist and in the `## Security / NFR triggers` block of future cuts*, **`XS` / `P2` / owner BA/PM**. **Cutting it and giving it an id are BA/PM's**; inventing an id here would fabricate a board state, the same stop `ABC-108`'s `A5` recorded.

**THE FENCE ON THIS SECTION.** This hop **ruled**; it **moved nothing**. No target, bar, level, floor, account, instrument, statistic, null control or `UNKNOWN - verify` marker was edited anywhere in this file; the eight rows hash to `63f66795…ca31` unchanged; **`src/` is byte-identical and `git diff --numstat -- src/` is empty**; no test was added, deleted, trimmed, moved or re-titled; no board column was moved; `ABC-115` was not moved and is not signed; nothing was merged or deployed. **The mutant ran entirely outside the repository and is not committed — this ruling's own charge against the lane is 0 ms, and `N8-SPAWN`'s balance stays 0 ms.**

## `NFR-008`'s CPU LEVEL IS 15 s — **THE FIRST LEVEL MOVE IN THIS FILE, AND IT IS THE OWNER'S, NOT A ROLE'S** — 2026-09-19 by Architect/Design (task `owner-rulings-2026-09-19`, subtask `ruling-abc110-level-15s`, Workflow 07), the row's owner, at `ABC-110`. **ONE CELL OF THE `NFR-008` ROW EDITED (`Target`: the CPU level and its dating). `NFR-001`–`NFR-007` BYTE-IDENTICAL, hashed individually before and after (`fcae7ccf…`, `75fcc5e2…`, `79e391ff…`, `053ba48a…`, `f9c6579b…`, `850ba137…`, `3988e3bb…`, unchanged); `NFR-008`'s row moved `c1524ad1…` → `080ba017…`; the eight-row hash is now `sha256 eee4dfff…3e5f` (was `63f66795…ca31`) — and the BYTE RANGE that hash covers is defined here for the first time, closing the gap QE named on 2026-08-20: the eight lines matching `^\| NFR-00[1-8] \|`, concatenated in file order, piped to `shasum -a 256`.** 56 table lines before and after. **THE WALL CLAUSE (3 s) DID NOT MOVE. `N8-LANE`'s 5%, its 650 ms, its CPU instrument, paired-median statistic, identity null control and 160 ms floor did not move. `N8-SPAWN` stays 0 ms. No test file changed lane; `src/` is byte-identical.**

### The word, and what it moves

> *"3. raise to 15s for now"* — Olger Oeselg, project owner, in session, 2026-09-19, answering item 3 of six (transcribed verbatim in `.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`).

**That is lever (ii) of `ABC-110` — the one that page, `ABC-108` and `ADR-0014` all said was the owner's alone.** He took it with the sized alternative in front of him: QE measured lever (i) on 2026-08-20 (`engine` + `perft` behind a flag, 2.550 s, 12 criteria out of the default lane) and he chose to move his level instead. **`ADR-0019` records him and supersedes `ADR-0014` on the level only.** "For now" is honoured as revisitable: `ADR-0019` `## Rollback` names three triggers (a breach at 15 s; a conforming reading ≤ 13 s making the old level restorable; `ABC-111` landing), and no agent moves the number in either direction.

### RE-MEASURED at the new level — `ABC-110` `A6`, CPU half. **MET, by 60 ms, and NOT ROBUST**

At **`2c96dbd`** (the tracked tree; `src/`, `vitest.config.ts`, `package.json` verified `git diff`-identical to that commit), **40 test files / 1213 tests / skip 0** asserted by every run, contained lane **`npx vitest run --dir src`** (as this row's re-measure instruction states), two `rsync` copies outside the repository verified byte-identical by `/usr/bin/diff -r` (`A`, and its identity twin `N`), `node_modules` symlinked into each (the disclosed deviation every lane reading on this project carries), `AGENTS.md` present in the copy so the `ENOENT` deviation does not arise. `/usr/bin/time -p`, CPU = user + sys, one fresh OS process per run, order rotated every round (`A N` / `N A`), **9 rounds, round 0 discarded, n = 8**, 1-min load average read immediately before and after every run. **18 runs, 0 harness errors.** Raw per-run TSV, load log and the harness as text: `.grugops/context/ruling-abc110-level-15s/notes/`.

```
condition medians, n = 8            CPU (user+sys)         WALL
A  the lane, 40 files / 1213 tests     14.940 s           4.385 s      range 14.76-15.16 / 4.32-4.75
N  identity twin                       14.915 s           4.380 s      range 14.69-15.21 / 4.31-4.61

IDENTITY NULL CONTROL  N-A   median -55 ms = -0.37% CPU, sign 3/8   ->  <= 1.5%, sign at chance:
                             ADMISSIBLE (recorded before the treatment was looked at)

NFR-008 CPU <= 15 s   ->  14.940 s =  99.6%   UNDER by 0.060 s     <- MET on the protocol median
        (at the old 13 s ->  14.940 s = 114.9%   over by 1.940 s)    <- the lane grew +1 file / +32 tests since 54cbb23
NFR-008 WALL <= 3 s   ->   4.385 s = 146.2%                         <- REPORTED, NOT RULED (see below)

round 0, discarded:  A  wall 16.49 / CPU 18.28  (the session's cold first run)   N  4.43 / 14.78
runs individually over 15 s CPU:  A 15.16, 15.13   N 15.04, 15.21   -> 4 of 16 usable runs
1-min load before each run:  min 4.02  median 4.44  max 7.46   (5-min ~7.0 throughout)
load sensitivity inside this sample:  rounds 1-3 (load 4.1-4.8) median A 14.82 s -> rounds 6-8 (load 4.3-7.5) 14.99 s  =  +1.1%
```

Machine: Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / macOS 26.5.2 / Node v24.12.0 / npm 11.7.0 / vitest 3.2.7 — **`UNKNOWN - verify` on any other hardware.** **A quiet machine was not available and is not claimed**; sibling hops of this same wave were live. The shape that worked in `ADR-0014` is reused: the contamination is sized, not asserted away.

**THE RULING: `NFR-008` CPU (`≤ 15 s`): MET, on the protocol median, at 99.6%.** And the honest second sentence: **the 0.4% margin is smaller than the measured load sensitivity (+1.1% here, +1.63% / −1.90% on 2026-08-19), four of sixteen usable runs individually exceed the level, and one more average test file (~370 ms all-in) puts the median over.** The level is exhausted on arrival. Every cut and gate from here should expect the next file-adding ticket to re-breach at 15 s, write the measured milliseconds and the clause state, and treat `ADR-0019` revisit trigger (a) — not a fresh escalation — as what happens then; the sized remedy (`OPT-1`) is already on the table.

**THE WALL FIGURE IS REPORTED AND IS NOT A VERDICT.** `ABC-111`'s warm/cold protocol is unsettled and `ABC-110` `A6` says the wall figure cannot be read until it is; this reading IS the warm-interleaved state by this row's own round-0 rule. It is reported with its size because the size matters: **4.385 s is 46% over the 3 s clause**, and the 2026-08-19 straddle was ±0.3 s — **a 1.4 s excess is not a warm/cold question.** The CPU/wall ratio here is **3.41x** against 5.29x warm / 4.64x cooled on 2026-08-19, at a 1-min load of 4–7.5 on 8 cores with the harness itself contributing ~3.4 of that; **core contention from concurrent work is the consistent reading and is labelled a CANDIDATE, not a cause** — the same discipline `ADR-0014` applied to the cache. `ABC-111`'s `A5` reproducibility run in a separate session is what separates "the lane's wall grew" from "the machine was busy". Vitest's own `Duration` line read 3.7–3.9 s per run; the ~0.65 s between that and `real` is `npx` + Node bootstrap, common to every reading on this row.

### `N8-LANE` — 650 ms STAYS, and what changed about how to read it

The owner moved the level, not the per-ticket bar. **5% of 15 s would be 750 ms; that arithmetic is NOT run into the bar.** 650 ms is retained exactly as `ADR-0014` decision 4 left it and now reads as 4.33% of the level; re-deriving the 5% remains this row's standing, unexercised invitation (`ADR-0008`, `ADR-0014` alternative 3) and creates no headroom either way. **No ticket's `N8-LANE ≤ 650 ms` line is re-cut.** `ADR-0014` decision 4's rate-limit reading lapses by its own rollback clause — a conforming reading has the lane under the owner-moved clause — **and the headroom it grants is 60 ms in substance**, so the standing form of words is unchanged: write the measured milliseconds, then the ruled clause state; `N8-LANE MET` still means "under 650 ms" and nothing about the budget.

### `ABC-110`'s criteria, dispositioned here so the page and this row agree

`A1`–`A4` DONE by QE 2026-08-20 and cited, not repeated. `A5` SATISFIED by the word above. `A6` CPU half RULED MET; WALL half NOT RULED, gated on `ABC-111` (the residual). `A7` VERIFIED on the diff — the "unless the owner moved the level" branch, with his words and their date quoted. `A8` VERIFIED as a no-op: 1213 tests before and after, skip 0, nothing moved lanes. `A9` NOT APPLICABLE: no lane created, `ABC-109`'s cap not engaged. **Recommendation to the Orchestrator: close `ABC-110` on the CPU clause with the wall residual named on `ABC-111`.** Board moves are the Orchestrator's.

**THE FENCE ON THIS SECTION.** This hop **recorded the owner's level, measured against it and ruled the CPU clause**; it moved nothing of its own. The wall clause's 3 s, `N8-LANE`'s 5% / 650 ms / instrument / statistic / null control / 160 ms floor, `N8-SPAWN`'s 0 ms, `NFR-001`–`NFR-007`, `src/`, `vitest.config.ts`, `AGENTS.md` and `package.json` are byte-identical; no test was added, deleted, trimmed or moved between lanes; no board column was moved; nothing was merged or deployed. **The harness ran outside the repository and is not committed — this hop's own charge against the lane is 0 ms, and `N8-SPAWN`'s balance stays 0 ms.**
