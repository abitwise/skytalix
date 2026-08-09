# Board
_Updated: 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`, Workflow 04): **`ABC-009` PASSES WITH RISKS and moved `In Security/NFR` → `Ready for UAT`** — the one exit this role owns. `In Security/NFR` **1/2 → 0/2**, `Ready for UAT` **0/4 → 1/4**; no limit approached, no override taken, no written reason owed. Every column's header count was re-verified against its line-item count (12 columns, 0 wrong). **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both, and the owner's standing merge authority is NOT deploy authority.** Gated against `security.asvs_level` **L1** and `security.block_on` **high**; `compliance_regime` is `[]`, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted. **NO REQUIRED FIX IS OUTSTANDING AND NO HIGH-SEVERITY ITEM EXISTS TO BLOCK ON.** **`NFR-001` RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND MET ON BOTH CLAUSES** — floor 6,030,518 / 6,136,238 / 6,117,496 nodes/sec against ≥ 1,000,000, aggregate ratio **1.0062 and 0.9967** against ≥ 0.98 on two independent samples, deep lane 32/32 in 38.49 s; three trees in one process with a `cmp`-verified byte-identical twin as a null control. **THE PER-CELL QUESTION THE ENGINEER COULD NOT RESOLVE IS RESOLVED BY COUNTING INSTEAD OF TIMING:** the two added lines execute **396,350 times** over the sweep and **reject nothing in any cell**, cost 0.33–0.43 ns each in isolation, so the whole change costs **~0.01%** — true ratio ≈ 0.9999, **kiwipete ≈ 0.9998**, and the 0.9930 reading is ~35x the true deviation. Their ±1% reasoning **HOLDS** but the estimate is **optimistic**: measured ±2.0% per cell and a previously-uncharacterised ~±1% aggregate floor. **GUARD ORDERING, ROUTED HERE BY QE, IS ADJUDICATED AND THE BEHAVIOUR HALF DISCHARGED:** the five guards are a conjunction of side-effect-free predicates, hence **permutation-invariant** (99 comparisons, zero divergence, all six perft counts exact per variant), so **no later reorder can silently break the equivalence QE relied on**; ordering is a cost question only and **no change is asked for**. **SECURITY CLASSIFICATION RE-ASKED AT THE SOURCE AND UNCHANGED: RELIABILITY, NOT SECURITY** — no sink, no trust boundary, no user-supplied string reaches `src/moves.ts`, all grepped rather than assumed; no trigger manufactured. **TEN RISKS CARRIED, NONE HIGH, EACH WITH A NAMED OWNER.** `src/moves.ts` untouched by this role (`0e247853ab2c05887c76105ff83d8621`); `plans/nfr-catalog.md`'s `NFR-001` row updated and **no target moved**, verified by hashing the cells before and after._
_Updated: 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-review`, Workflow 04): **`ABC-009` PASSES WITH RISKS and moved `In Review` → `In Security/NFR`** — the one exit this role owns. `In Review` **1/3 → 0/3**, `In Security/NFR` **0/2 → 1/2**; no limit approached, no override taken, no written reason owed. `NFR-001` is triggered, so `In Security/NFR` is the next column rather than UAT. **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.** **62 MUTANTS RUN AGAINST THE DELIVERED DIFF; FIVE SURVIVE THE ENTIRE NET — all twelve criteria, all 337 delivered tests AND the `PERFT_DEEP=1` lane at 32/32 — AND NOT ONE OF THE FIVE IS A DEFECT IN THE CODE.** All five are defects in the **criteria**; the delivered fix is correct on every position that exposes them, which is why this is a pass and not a return to dev. `src/moves.ts` is **byte-identical** to `8f540cf` (md5 `0e247853ab2c05887c76105ff83d8621`, the digest the Engineer published). **THE FIFTH MUTANT THE ENGINEER HANDED OVER IS DECIDED: the colour-blind equivalence argument HOLDS and NO CRITERION IS OWED** — corroborated on a differently-built instrument (12,584 positions `parseFen` **accepts**, varying three squares jointly, three king placements, **both rights at once** and the black-to-move mirror, against the Engineer's 9,604 over two squares plus one extra piece) with **zero** divergence at `generateMoves`, at `legalMoves` and on purity; a colour criterion would pass on `main`'s unfixed tree, on the fix and on the mutant alike, so it is unfalsifiable and would be theatre. **THE SOFT SPOT NOBODY HAD EXAMINED — a criterion set written over signals that AGREE — IS NOW EXAMINED, AND IT IS WHERE ALL FIVE LIVE:** such a set hides the dimensions it holds **constant**, and two are constant across all twelve rows — **`G-1`** the impostor's PIECE TYPE (`A5`/`A6` use a bishop and a knight, satisfying "at least two piece types" literally, while the rule quantifies over ALL other bytes; a guard reading either home square as "the mover's KING/ROOK **or QUEEN**" is green on everything, and on `4k3/8/8/8/8/8/8/K3Q2R w K - 0 1` one `legalMoves` call **DESTROYS A QUEEN** and writes a king over it), and **`G-2`** HOW MANY of a side's rights are held (every criterion FEN carries at most one right per side except the reproduction FEN where BOTH castles are invalid, so nothing separates *"this option was rejected"* from *"the option loop was abandoned"* — `continue` → `break` on the **rook** guard **DELETES A LEGAL CASTLE** on `4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1`, 16 moves / 1 castle becoming 15 / 0, and is green on all twelve; the **same** mutation on the **king** guard is genuinely equivalent because both options share `kingFrom` — one token, two opposite verdicts, one green). **`A8` AND `A9` CANNOT COVER EITHER DIMENSION, STRUCTURALLY, AND BY THE ENGINEER'S OWN ARGUMENT:** in any legally-reachable position the right being set implies both pieces are home, so the two new guards never fire and a mutation to them cannot change a perft node — measured, not argued, all five survive `PERFT_DEEP=1` at 32/32. **CLOSED IN TESTS ONLY, ZERO PRODUCTION LINES:** `src/moves.castling.hardening.test.ts` is NEW (19 tests, all green on the delivered fix), the Engineer's `src/moves.castling.test.ts` is **untouched**, and **every one of the fourteen test files on `main` is unmodified — checked by diffing each individually**, so `A8`'s line-level requirement holds for this role's work too. The rows are proved load-bearing by re-running the whole campaign with them present: **47 → 53 killed, 15 → 9 survived**, with **six mutants dying to these rows and nothing else in the suite** — and **the nine behaviour-equivalent survivors still survive**, which is what proves the rows pin observable behaviour rather than the shape of the implementation. **`A7` KILLED NOTHING ACROSS 62 MUTANTS** (the ticket already says it asserts count equality rather than correctness; measured on one build at refinement, now on 62). Gates re-run on the tip by this role, before and after the added rows: lint 0 (my file alone reports zero), typecheck 0, build 0, `npm test` **337/337 then 356/356 on 16 files**, skip count **0** both times by the `AGENTS.md` command, deep lane **32/32 exact in 38.35 s**. All fifteen `A1`–`A6` counts re-derived on a **fifth** independent derivation over 128 bytes and five scalars with **zero** bytes changed; both over-rejection controls hold (kiwipete 48 / 2, `r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1` 26 / 2). Test-integrity checker **exit 2** (`.grugops/test-skips.md` absent) recorded as an **ERROR and not a pass**, no registry file created; E2E and the auto-UAT oracles `UNKNOWN - verify`. **`NFR-001` was NOT re-measured by this role, deliberately — that gate follows and owns it**; the caveat that matters is the Engineer's own per-cell floor of ~±1%, larger than any signal, so **kiwipete's 0.9930 is NOT a regression**. Routed and not discharged here: `G-1`/`G-2` as criteria text and `A7`'s null discrimination to **BA/PM**, the ordering rationale to **Security/NFR**. `ABC-022` half (b) still live **by design**. Five notes published, **no `finding`** among them (none is admissible on this task) and **nothing self-stamped**; no `index.md`/`index.jsonl` hand-faked. Subtask claimed and closed **by hand** — this install has no `scripts/`. **Security/NFR was NOT enqueued — the Orchestrator owns decompose→enqueue.**
_Updated: 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-009`, subtask `engineer-abc009-implement`, Workflow 04): **`ABC-009` IMPLEMENTED AND MOVED `In Development` → `In Review`** — the one board move this role owns. `In Development` **1/3 → 0/3**, `In Review` **0/3 → 1/3**; no limit approached, no override taken, no written reason owed. **ONE PRODUCTION FILE CHANGED (`src/moves.ts`, +30 −8) AND ONE TEST FILE ADDED (`src/moves.castling.test.ts`); NOT ONE EXISTING TEST FILE TOUCHED — verified at LINE level as `A8` demands, not by inspection:** `git diff --name-only -- 'src/*.test.ts'` is **empty**, and the new tests went into a NEW file precisely so that claim is mechanical. **THE FIX:** two guard conditions in `addCastlingMoves` plus a `rookFrom` field on the `CastleOption` table, read as **IDENTITY** tests (the mover's own `KING` byte on the king-home square, its own `ROOK` byte on the rook-home square) and placed ABOVE the existing emptiness and through-check tests, a byte compare being cheaper than an emptiness scan and far cheaper than an attack scan. **THE STRUCTURAL CHOICE THE TICKET LEFT OPEN IS RECORDED WITH THE ALTERNATIVES IT REJECTED:** `rookFrom` joins the precomputed table and the guards live at the **generator** layer, so `generateMoves` and `legalMoves` are both fixed by one change; **rejected** were importing `CASTLE_ROOK_MOVE` from `apply.ts` (apply.ts already imports moves.ts — a MODULE CYCLE for a four-entry table), deriving the square arithmetically per call (the module's own header commits to precomputed tables over per-call arithmetic in the innermost search loop, `NFR-001`), and filtering at the `legalMoves` layer (`## Scope` requires the castle not be OFFERED by `generateMoves` either). **ALL FIFTEEN POST-FIX COUNTS IN `A1`–`A6` MATCHED THE DELIVERED DIFF ON THE FIRST RUN — NO DISCREPANCY, AND NOTHING WAS ADJUSTED IN EITHER DIRECTION:** no test was bent to the code and no criterion was edited. That makes **three** independent derivations of those counts (BA/PM's seven candidate builds, the Orchestrator's own fix, this diff), and the kiwipete control reproduces too — 48 legal moves, 2 castles still offered, position pure. **RED BEFORE GREEN, PROVED NOT CLAIMED:** the new file read **23 failed / 10 passed** against the unfixed tree, and the 10 passing are exactly the four legal-castle controls and the six `A7` purity rows — which confirms on the TIP that `A7` was **absent rather than failing**. **THE LOAD-BEARING DELETIONS FAIL DISJOINT NAMED SETS ON THE DELIVERED DIFF** (re-measured here because BA/PM measured them on mutants of `main`): deleting the **king** condition fails `A4`+`A5` and nothing else, deleting the **rook** condition fails `A3`+`A6` and nothing else, weakening both to **occupancy** fails `A5`+`A6` only, and swapping the two squares fails 19 assertions including `ABC-004`'s castling tests and kiwipete `perft(1)`. All four legal-castle controls survived every mutant, so none of the reds is a false red. **A FIFTH MUTANT SURVIVES ALL TWELVE CRITERIA AND THE WHOLE SUITE, AND IT IS REPORTED RATHER THAN BURIED BECAUSE OPEN ITEM (1) SAYS SEVEN IS NOT PROVEN COMPLETE — BUT IT IS NOT A DEFECT, IT IS BEHAVIOUR-EQUIVALENT, AND THAT WAS MEASURED:** colour-blind (`pieceType`) tests instead of full-byte identity read **337/337 green** and typecheck clean, yet over an exhaustive 676-board space (13×13 bytes on the two home squares × 4 castles) the two rules read the squares differently on exactly **12** boards and the generator AGREES on all 12 — an enemy king or enemy rook there attacks a square the existing through-check test requires unattacked — and re-run with every possible third piece on every other square (**8,928** boards) the divergence is still **zero**. Same class as `ABC-011`'s two behaviour-equivalent cost mutants that were deliberately not pinned; it independently corroborates BA/PM's "wrong-colour rook is unreachable" measurement, now exhaustively and on the delivered fix. **GATES, AS THEY RAN:** `npm install` exit 0 (no dependency change, `package.json` and `package-lock.json` untouched), lint exit 0 with **zero** autofix passes needed (0 of 2 self-fix attempts spent), typecheck exit 0, `npm test` **337/337 on 15 files** (304/304 on 14 BEFORE, measured by running the suite on the tip rather than by subtraction, matching the Orchestrator's figure at the pull), build exit 0, **skip count 0** by the `AGENTS.md` command. **`A9`'s DEEP LANE IS 32/32 EXACT in 36.93 s, RUN BEFORE REVIEW as the ticket requires — nobody had run it on either tree for this ticket.** E2E `UNKNOWN - verify` (the slot is unknown; no UI surface until `EPIC-006`). Test-integrity checker **exit 2** — "cannot read the registry file"; that is "could not run", is **not** the exit-1 human-only short-circuit and is **NOT A PASS**, and no registry file was created because an agent may not self-author a justification to clear its own gate. Auto-UAT oracles `UNKNOWN - verify` (`scripts/check-uat-oracles.js` absent, non-blocking). **`NFR-001` / `A10` MET ON BOTH CLAUSES, AND THIS IS THE FIRST THROUGHPUT FIGURE ANY ROLE HAS MEASURED ON THIS TICKET** — the 6.04M–6.21M in the ticket is quoted from `plans/nfr-catalog.md`, which neither the Orchestrator nor BA/PM measured. **FLOOR:** `npm run perft` on the delivered tree reads **6,078,622 / 6,131,325 / 6,151,559 nodes/sec** over three runs — inside the catalog's standing band, ~6.1x the ≥ 1M bar. **RATIO:** three trees in ONE process — pre-fix (`main`'s `src/`), delivered, and a **byte-identical twin of the delivered tree as a null control by identity** — 7 rounds, tree AND cell order rotated every round, discarded warm-up, medians of per-round rates, node counts checksummed across every tree and round (238,936,362 nodes), **two fully independent samples** in their own processes: aggregate **post/pre = 0.9987 and 0.9974** against the ≥ 0.98 bar, **MET on both**; worst single cell across both samples 0.9880. **THE CATALOG'S STANDING CAUTION WAS FOLLOWED AND IT IS THE REASON NO PER-CELL CLAIM IS MADE:** the **structurally-zero** cells were read FIRST — position-3 and position-6 hold NO castling rights and `makeMove` can only clear rights, never create them, so the two added byte compares execute **zero** times anywhere in those subtrees and their true delta is exactly zero, yet they read **1.0084 / 0.9918 / 1.0041 / 0.9989**; the identity twin read 1.0087 and 0.9983 aggregate and up to 1.0126 per cell. **The instrument's own floor is therefore about ±1% per cell, larger than any signal** — the bar is met with margin and **no per-cell regression or improvement is claimed**, the kiwipete 0.9930 reading in particular sitting inside noise established by cells whose delta is provably zero. **Denominator fence carried, not quoted: 97.3% of the nodes perft counts are free leaves, so this is generation-with-free-leaves and is NEVER evidence for `NFR-005`.** `NFR-005` was **not** measured and the key benchmark was **not** re-run — the exclusion is structural and the ticket says so. **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** (this project's standing rule); figures are Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` on any other hardware. **NO NFR TARGET MOVED, `plans/nfr-catalog.md` WAS NOT EDITED, and no ticket other than `ABC-009` was touched.** **QE/E2E and Security/NFR were NOT enqueued** — the Orchestrator owns decompose→enqueue. **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.**
_Updated: 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-018`, subtask `engineer-abc018-implement`, Workflow 04): **`ABC-018` IMPLEMENTED AND MOVED `In Development` → `In Review`** — the one board move this role owns. `In Development` **1/3 → 0/3**, `In Review` **0/3 → 1/3**; no limit approached, no override taken, no written reason owed. **TWO NEW FILES UNDER `src/` AND NOT ONE EXISTING FILE TOUCHED**, verified rather than asserted: `git diff --numstat main -- src/` is **empty**. `src/frame.ts` (222 lines, 94 of them code) holds the VALUE (`assembleFrame`), the SESSION (`beginFrameSession`, which reads the sink's two signals once) and `frameHeight`, the one place the `+3` lives so `H` is never hardcoded; `src/frame.test.ts` holds the twelve criteria one test each, eight further pins, and the in-memory screen model the `## Test notes` require. **`RISK-005`'s BUILD OBLIGATION IS DISCHARGED AND CHECKED MECHANICALLY:** the mode is a required parameter with no default, and `src/frame.ts` imports exactly one thing — `import type { GlyphMode }`, erased at runtime — so it cannot default, hardcode or re-derive a mode; its only `isTTY`/`rows` reads are of the INJECTED SINK. **`NFR-002`'s WRITE HALF IS MEASURED FOR THE FIRST TIME AND BOTH HALVES ARE RECORDED SEPARATELY**, out of tree, two independent samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` elsewhere: compute (`renderBoard` + `assembleFrame`) **5.97–6.07 µs**, write **0.64–0.65 µs** in-memory / **1.66–1.67 µs** to `/dev/null` / **2.43–2.48 µs** to a file, at 40/120/300 plies on a 23-row 18-column 418-character frame — **SUM 0.0084–0.0092 ms against the 16 ms bar, MET with room; NO NUMBER QUOTED FROM ANY EXISTING NOTE** and the compute half is labelled a LOWER BOUND because two panels are stubs. **GATES AS THEY RAN:** lint exit 0 after ONE autofix pass (import order + formatting, self-fix 1 of 2), typecheck exit 0, `npm test` **297/297 on 14 files** (277 on 13 before, measured not subtracted), build exit 0, skip count **0**, `src/frame.ts` **100% on all four axes**; E2E `UNKNOWN - verify`, test-integrity checker **exit 2** (registry absent — an error, NOT a pass, and no file was created), auto-UAT oracles `UNKNOWN - verify` (script absent). **18 MUTANTS RUN, ALL 18 KILLED** — including both mutants the `23/23` correction was written for and the live "re-decides the strategy on every write" one — **but TWO SURVIVED THE SUITE AS FIRST WRITTEN and the SUITE was fixed, not the record: no acceptance criterion constructs a sink whose `isTTY` or `rows` is ABSENT, which is the real shape Node presents on a pipe.** That is a gap in the CRITERIA and it is handed to QE and BA/PM. **NOTHING MERGED, NOTHING DEPLOYED — a human holds both.** Full record in the ticket's `## Implementation` section and in `.grugops/context/ticket-to-pr-ABC-018/notes/`._
_Updated: 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-018`, subtask `bapm-abc018-promote`, Workflow 07): **`ABC-018` PROMOTED `Backlog` → `Ready` — the one board move this role owns — AND IT WAS NOT PROMOTED AS IT STOOD.** `Ready` **3/8 → 4/8**, `Backlog` loses one row; no limit approached, no override taken, no written reason owed. **The Definition of Ready's "acceptance criteria clear, testable and measurable" check FAILED** — the ticket's own DoR block ticked that row green on 2026-07-30 and nothing re-checked it since, and the Orchestrator's pre-check left it AMBER with three named specifics rather than green. **FIVE acceptance defects were fixed IN PLACE before the move: the three flagged (`(+N more)` with no defined `N` — agreed, and worse than described, since six 4-character SANs FIT a 2-row region at `W = 18` and a correct implementation therefore emits no marker and fails the criterion as written; the `23`-row frame — substance agreed but the DIAGNOSIS CORRECTED, `23` is `EPIC-002` `4a`'s reference layout and the real fault is a PROMPT ROW no ticket owned, which left "at least as many rows as the frame" short by exactly the row the player types into; the untested `R = H` equality boundary) PLUS TWO NAMED BY NO PRE-CHECK (`NFR-002`'s "each total is < 16 ms", ambiguous by 2x against its own ticket and traceability row, rewritten to the SUM with no target moved; and a criterion that could not fail — the `ABC-015` defect-2 shape again — restated against the injected sink).** A sixth collision (ASCII mode's zero-above-`U+007F` promise versus a sanitizer that stripped only C0) was folded into the Security bar. **SIZE `S`, PRIORITY `P0`, SCOPE, DEPENDENCIES AND `RISK-005`'s CONSTRAINT ALL UNCHANGED**; `EPIC-002`, `ABC-016`, `ABC-017` and `ABC-019` were NOT edited and are NOT vouched for. Both constraints on the Backlog row re-verified at the source (`ABC-014` merged, `renderBoard` on `main`; `ABC-015` merged `f1743a3 → f4d5d31`, so the merge-order constraint is satisfied **before** this ticket starts). **This is not the pull gate** — the Orchestrator applies the Definition of Ready again at `Ready → In Development`. Nothing implemented, `src/` untouched, nothing merged, nothing deployed._
_Updated: 2026-08-08 by the Orchestrator (task `ticket-to-pr-ABC-015`, Workflow 04): **ABC-015 MERGED to `main` and CLOSED, `Ready for UAT` → `Done` — the exit this role owns.** Fast-forward `f1743a3` → `f4d5d31`, **12 commits, no merge commit** (`git log --merges` empty and `git rev-list --count branch..main` was 0 BEFORE the merge — both verified, not assumed). `Ready for UAT` 1/4 → 0/4; `git branch --no-merged main` is empty. **Gates run by this role on the tip BEFORE and on `main` AFTER, both recorded, neither inherited from the four agents that worked this ticket: 277/277 on 13 files, skip count 0 by the `AGENTS.md` command, lint/typecheck/build exit 0 on both sides.** **`src/glyph-mode.ts` md5 `9c1f4f4e957d4faf3c9cccc49a545185` is IDENTICAL to the Engineer's first commit** — QE and Security/NFR each changed tests or docs only, and neither repaired the module to make its own verdict come out green. **The merge was covered by the owner's standing directive of 2026-08-06, but the first attempt was DENIED by the host permission classifier and was NOT worked around** — nothing ran, `main` stayed at `f1743a3`, and the decision went back to the owner, who said "merge" in session. Second such denial in two days; the block is environmental, the resolution is a human. **UAT DEFERRED to `EPIC-006` and explicitly NOT passed** — zero runtime importers, no CLI entry point, so a pass would be a fabrication. **`RISK-005`'s merge-order constraint is DISCHARGED**: ABC-015 merged with `ABC-018` still unstarted in `Backlog`, which is what "with or before" required. **Deploy was not attempted or contemplated** — it is not in the standing grant, `production_requires_human_confirmation` stays `true`, and `ADR-0007` records there is nowhere to deploy. Previously _Updated: 2026-08-08 by Security/NFR (task `ticket-to-pr-ABC-015`, subtask `security-nfr-abc015-gate`, `ABC-015`'s gate): **`ABC-015` PASSES WITH RISKS — `In Security/NFR` 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4, the one exit this role owns. NO required fix. FOUR accepted risks, each with a named owner AND a place. `compliance_regime` is `[]`, so no Compliance Officer hand-off is owed.** **`NFR-007`'s zero-filesystem / zero-process bar was RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND IS MET — the delivered guard was never cited**, because QE had already found it blind to one module specifier. Three instruments, the first of them **specifier-agnostic by design**: Node's **permission model** (`--permission`, proved ARMED by four positive controls — `readFileSync` / `fs/promises.readFile` / `execSync` / `existsSync("/etc/locale.conf")` all `ERR_ACCESS_DENIED`); a **byte-identical copy of the module alone in an empty directory with no `render.ts` beside it**, which imports and runs and therefore PROVES the runtime import closure is EMPTY; and **165 patched functions** across `fs` / `fs/promises` / `child_process` / `os` / `tty` plus a module-load recorder. Result across three ambient shapes: **0 modules loaded, 0 filesystem calls, 0 process calls, 0 bytes written**, right answers on all 11 selection paths. **ONE INSTRUMENT-LIMIT CORRECTION, RECORDED BECAUSE IT WOULD HAVE PRODUCED A FALSE MISS** — the first run counted 3 fs calls (`openSync`/`readSync`/`closeSync`) inside the region and they were the ESM loader reading the module off disk, the LOAD and not the SELECTION; hoisted out, the count is 0. That is the eighth instrument-limit correction of this shape on this project's record. **THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL FOR THE FIRST TIME** (a `python3` pty, under the permission model): `LANG=en_US.UTF-8` → **unicode**, `LANG=C` → **ascii**, with `isTTY` genuinely `true` and genuinely a boolean — every earlier test of that path faked it with `defineProperty`. **THE TICKET'S "NO SECURITY TRIGGER" REASON IS WRONG THREE TIMES IN ONE SENTENCE AND THE RULING STILL HOLDS — reported rather than ratified, exactly as `ABC-014`'s gate did.** It reads **THREE** environment variables, not two (the fourth wrong count on this ticket, and the first inside the section this gate audits); `process.stdout.isTTY` is **`undefined`** on a pipe, a file and `/dev/null`, not "a boolean"; and it **does** interpret user-influenceable text. **What actually holds is stronger: THE RETURN DOMAIN IS CLOSED** — every path returns one of two module literals, so no byte from the environment can travel through. Measured over **138 hostile locale values** (ANSI/OSC escapes, C0 controls, NUL, CRLF, shell metacharacters, command substitution, format strings, path traversal, SQL, script tags, 1M-character values, confusables, RTL override) × 3 rungs × 2 TTY states: **0 threw, domain exactly {ascii, unicode}**. **ONE REAL PROPERTY, A GADGET NOT A VULNERABILITY:** the real `process.env` falls through to `Object.prototype`, so a polluted `LC_ALL` **outranks a real UTF-8 `LANG`** and flips the session (measured with a **live null control in both directions**), and under pollution a non-string rung makes `UTF8.test`'s `ToString` **run attacker code**. Bounded: **no prototype-pollution sink exists anywhere in `src/`** (re-verified, comments stripped), a real environment cannot hold a non-string (Node coerces on assignment — measured), and the polluted return domain is **still {ascii, unicode}** — it can flip a glyph table, it cannot inject a byte. LOW. **ASVS L1 judged, not padded:** of the 70 active requirements, **12 judged individually** — `V1.2.5` (zero process operations, measured with a positive control), `V1.3.2`, `V2.1.1`, `V2.2.1` (**PASS on the environment input**, NOT ENGAGED on the flags) and `V15.3.1` PASS on evidence; `V1.2.1`–`V1.2.4` PASS by analogue; `V13.4.1` DEFERRED; `V15.1.1`/`V15.2.1` not met with a **carried** `high` → `low` override restated with its evidence re-checked (`dependencies` is `{}`, `package.json` untouched) — and **58 structurally N/A with the reason stated per chapter**. **V7 is N/A and is named rather than skipped, because the keyword matches:** ASVS "session" means an authentication session and a token; this module's session is a process-lifetime constant with no user and no token. **`ABC-014`'s BANKED `V2.2.1` COUNTERFACTUAL IS HALF DISCHARGED BY THIS TICKET AND HALF STILL LIVE:** the `mode` half is closed **by construction** — a two-literal return domain means no user string can reach `renderBoard`'s `mode`, **provided `EPIC-006` passes this module's output and not a raw flag string** — while the flags half stays `EPIC-006`'s, since `GlyphFlags` are booleans, argv gives strings, and a non-empty `"false"` is truthy. **A PRIOR GATE'S ACCEPTED RISK IS CORRECTED: `ABC-014`'s risk 3 named `ABC-015` as an owner of the ORIENTATION value, and `ABC-015` produces no orientation value at all** — checked at the source: no `EPIC-002` ticket but `ABC-014` mentions orientation, and `EPIC-002`'s own `## Dependencies` puts the human's colour, *"which fixes board orientation"*, in `EPIC-006`'s startup scope. Sole owner is **`EPIC-006`**; the `ABC-015` half is struck. Corrected in a new note rather than by `supersedes`, because that note's other three risks are correct and superseding folds all four out of replay. **DIAGNOSTIC ONLY, AND NO BAR WAS INVENTED** (the ticket names no µs bar and says why): `selectGlyphMode` **14.1–14.3 ns** first rung and **28.3–30.3 ns** all three rungs, `beginGlyphModeSession` **433–445 ns** — two independent samples, 11 rounds × 200,000 iterations, discarded warm-up, medians of per-round means, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware; ~0.00002% of `NFR-007`'s 2 s window. Partial attribution is **labelled partial**: two ambient property reads measure 156–158 ns in isolation and the closure ~3 ns, which does not sum to 433–445, and **the residual is not attributed**. **ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION AND NO NUMBER IS TAKEN FROM IT** — whether the session closure retains an injected `env`: the `WeakRef`+`--expose-gc` probe said "reachable", **and so did the null control with no session created**, so it is `UNKNOWN - verify` (and moot in production, since `process.env` outlives every session). Gates re-run on the tip `8de5624` rather than inherited: **277/277 on 13 files**, skip count **0**, lint/typecheck/build exit **0**, plus **three shuffled full-suite runs 277/277 each** on this gate's own instrument. **NO PRODUCTION CODE AND NO TEST WAS CHANGED** — `src/glyph-mode.ts` still hashes `9c1f4f4e957d4faf3c9cccc49a545185`; **no wall-clock assertion added; no `--coverage` run made**, so the tracked-`coverage/` hazard never arose. **UAT is DEFERRED to `EPIC-006`, explicitly NOT passed** — zero runtime importers, no CLI entry point, nothing rendered and nothing prompted, so a UAT pass would be a fabrication; the real-pty run is an instrument reading and is **not** offered as UAT. **`NFR-007`'s actual target (`npx` to first board < 2 s) is NOT discharged and stays `UNKNOWN - verify`**, as does the two-documents-disagree item on that row (`EPIC-006` says `npx` in four places, `ADR-0007` clause 5 says undecided) — owners BA/PM and Architect/Design at `EPIC-006`. **The merge-order constraint still binds: `ABC-015` merges with or before `ABC-018`.** **Nothing merged and nothing deployed — a human holds both.** Previously 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-spec-gaps`, Workflow 07): **`ABC-015`'s ACCEPTANCE CRITERIA AMENDED IN PLACE, ELEVEN → FIFTEEN — and NO board move, NO column exit and NO WIP change.** The ticket stays in `In Security/NFR` (1/2); amending acceptance criteria is not a column exit and **the `In Security/NFR` exit remains Security/NFR's alone**. **All four amendments RATIFY the delivered implementation, so NO code change and NO QE re-run are owed** — each is already pinned by a test that exists and passes, and the one item that could have changed code (the empty-locale ruling) is **ratified, not overturned**, on this ticket's own row-4 rationale plus POSIX **verified on this machine** (`env -i LC_ALL= LANG=en_US.UTF-8 locale` reports `LC_CTYPE="en_US.UTF-8"` — the empty variable fell through — while `LC_ALL=C` wins). **Nothing was taken on trust:** each item was re-derived by evaluating the criteria AS WRITTEN against every implementation proposed for this module. **The first item is a defect in the section this role itself corrected seven hours ago, and it is upheld and worse than reported** — criterion 11 never said which ambient values the rewrite uses, so across the 11,232 instantiations its wording admits it excludes a hardcoded-`isTTY` session in 2,592 and **admits it in 8,640**, two readings of one criterion; and two real defects (a session that **drops the flags**, and a **lazy** session) are excluded by **no reading at all**. Fixed by **adding** criterion 15 rather than widening 10 or 11. **A FOURTH item was found and is named as a fourth, not smuggled into the three**: no criterion could ever exclude a lazy session, so criterion 11 gained one clause pinning the decision to session begin — epic `2b`'s "before the first frame", the once-ness this role ruled onto this ticket. **No criterion was renumbered** (the record cites them by number); the four new ones are appended as 12–15. Size `S` and priority `P1` unmoved, `src/` untouched, no test edited, no other role's notes edited. **Nothing merged and nothing deployed — a human holds both.**
_Updated: 2026-08-08 by QE/E2E (task `ticket-to-pr-ABC-015`, subtask `qe-abc015-review`, Workflow 04): **`ABC-015` BROKEN-TESTED AND MOVED `In Review` → `In Security/NFR` on a PASS verdict** — the one board move this role owns. `In Review` 1/3 → 0/3, `In Security/NFR` 0/2 → 1/2; no limit approached, no override taken. **The four mandatory gates were RE-RUN on the tip by this role rather than inherited, before and after the added tests**: lint exit 0, typecheck exit 0, build exit 0, `npm test` **271/271 before and 277/277 after, 13 files**, skip count **0** both times by the `AGENTS.md` command — the Engineer's and the Orchestrator's figures reproduce exactly. `src/glyph-mode.ts` **100% on all four coverage axes** against a `0.8` threshold. **THE TICKET'S OWN NAMED MUTANT WAS BUILT AND RUN AND IT DIES** — to criterion 11, exactly as BA/PM designed that criterion to; the `Backlog`-exit correction did the job it was made for. **A 29-MUTANT CAMPAIGN FOUND THREE MUTANTS THAT PASSED ALL ELEVEN ACCEPTANCE CRITERIA AND ALL 271 DELIVERED TESTS**, every one of them a real production defect: the LC_CTYPE rung of the locale precedence was never pinned against either neighbour (**the exact one-at-a-time shape this ticket's own `## Test notes` forbid in writing**), a **missing** `isTTY` property — the only shape a non-TTY process ever presents — was never constructed, and a **lazy** session that memoises on first call satisfied criterion 11 while moving the decision after the first frame that epic acceptance `2b` puts it before. A fourth hole was in the `NFR-007` guard itself: it spied `node:fs` but not `node:fs/promises`. **All four are closed by SIX new tests and ONE widened guard table; no production code was changed and `src/glyph-mode.ts` is byte-identical to the Engineer's after 58 mutate-and-restore cycles.** **28 of 29 mutants now die; the single survivor is REPORTED and PROVEN behaviour-equivalent** (dropping the `Boolean()` coercion — `!undefined` and `!false` are both `true`, so row 3 fires identically), which also makes that line's comment claim that the coercion "is doing real work" false at runtime — flagged, not edited. **No E2E was written and none could be**: no CLI entry point until `EPIC-006` and this module has zero runtime importers — reported as a gap, not filled with a fake. **THREE SPEC-LEVEL ITEMS ARE BA/PM's, NOT DISCHARGED HERE** — criteria 10/11 blind to a single-signal session, the empty-locale ruling, and now criterion 6 being the one-at-a-time shape the test notes forbid. **The Engineer's flagged traceability cell-count defect DOES NOT EXIST and the Orchestrator's disproof is confirmed independently** — 12 raw pipes, one escaped, 10 cells, same as every other row. **Nothing merged and nothing deployed — a human holds both.**
_Updated: 2026-08-08 by the Software Engineer (task `ticket-to-pr-ABC-015`, subtask `engineer-abc015-implement`, Workflow 04): **`ABC-015` IMPLEMENTED AND MOVED `In Development` → `In Review`** — the one board move this role owns. `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; no limit approached, no override taken. **Three NEW files under `src/` and not one existing file touched**, verified rather than asserted: every pre-existing `src/` file is byte-identical to merged `main` at `f1743a3`. `src/glyph-mode.ts` (122 lines, **32 of them code**) carries the pure rule `selectGlyphMode(signals)` and the session accessor `beginGlyphModeSession(flags)`; `src/glyph-mode.test.ts` carries the eleven acceptance criteria one test each plus four that pin what they do not reach; `src/glyph-mode.nfr.test.ts` carries `NFR-007`'s zero-I/O bar as a spied guard, on the standing "a measurement is not a guard" rule this project has now recorded three times. **Gates as they ran: lint exit 0 after ONE autofix pass (formatting only, `lint.autofix` is `true`, self-fix 1 of 2), typecheck exit 0, `npm test` 271/271 on 13 files (253 on 11 before), build exit 0, skip count 0 by the `AGENTS.md` command, and 100% on all four coverage axes for the new module.** **THE ONE STRUCTURAL CHOICE THE TICKET DELIBERATELY LEFT OPEN IS DECIDED AND RECORDED: the session's cached value lives in the CLOSURE `beginGlyphModeSession` returns** — which is what lets acceptance criterion 10 (the **rule** reads no ambient global) and the NFR bar (the **session accessor** may read `process.stdout.isTTY` and `process.env`) hold at the same time; a module-level memo was rejected because it needs an exported reset that is itself able to break the session-constant promise, and a value the caller merely holds was rejected because it pushes the once-ness back to `EPIC-006` — the seam BA/PM closed onto this ticket — and makes criterion 11 unfalsifiable again. **21 MUTANTS RUN AND ALL 21 DIED**, including the named mutant from the ticket's own test notes (the session re-probing the environment on every call, killed **only** by criterion 11) and the `win32` rule smuggled back in (killed **only** by criterion 9's guard). **TWO OF THE 21 SURVIVED THE SUITE AS FIRST WRITTEN AND THE SUITE WAS FIXED RATHER THAN THE RECORD** — a session that hardcoded `isTTY`, and one that forwarded only `LANG`: **criteria 10 and 11 are both written over ambients where `isTTY` and the locale AGREE, so neither criterion can see it.** The suite now isolates each signal; **the CRITERIA still cannot, and that gap is handed to QE and BA/PM rather than closed here.** **ONE BEHAVIOUR THE NINE TUPLES NEVER SPECIFY WAS DECIDED BY THIS ROLE AND IS FLAGGED, NOT BURIED: an EMPTY locale variable counts as UNSET and precedence falls through** — the POSIX reading, and the one this ticket's own row-4 rationale requires. **FLAGGED AND NOT FIXED:** the tracked `coverage/` directory is stale by two merged tickets (no `render.ts.html` from `ABC-014`, no `history.ts.html` from `ABC-012`); a `--coverage` run here touched it and it was restored byte-identically rather than refreshed. **Nothing merged and nothing deployed — a human holds both**, and no `finding` was written because no §14 gate exists here to stamp one. Previously 2026-08-08 by the Orchestrator (task `ticket-to-pr-ABC-015`, Workflow 04 step 2): **ABC-015 PULLED `Ready` → `In Development`, on the corrected ticket.** Ready 4/8 → 3/8, In Development 0/3 → 1/3, queue width 1 of 3; no limit approached, no override taken. Pulled on the owner's in-session call "continue with ABC-015", which puts it ahead of `ABC-009` and `ABC-022` — **recorded as a displacement, not absorbed; neither defect is cancelled, re-sized or re-prioritised.** **The Definition of Ready was re-applied AT the pull against the ticket AS CORRECTED TODAY — not against the version this role pre-checked, and not taken from BA/PM's report.** All ten checks hold, and **two of them hold only because BA/PM corrected them: this role's own pre-check ticked "acceptance testable" green off the ticket's self-assessment ("nine enumerated input tuples"), and it was eight tuples plus one unfalsifiable session property — recounted here to confirm BA/PM is right and the pre-check was wrong.** Reading a self-assessment back as evidence is the "7 standing perft FENs that were 6" failure caught during `ABC-014`; **routing BA/PM first is what caught it, and a straight Backlog pull would have shipped both defects to an engineer.** No design hop (one pure function, a table already written, a return type merged `src/render.ts` declares) — In Analysis 0/2 and In Design 0/2 untouched. Where the session's cached value lives is **left to the engineer** and deliberately not pre-decided. `RISK-005`'s merge-order constraint is satisfied by doing this now — `ABC-018` is unstarted. Nothing merged, nothing deployed. Previously 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-promote`, Workflow 07): **ABC-015 PROMOTED `Backlog` → `Ready` — the one board exit this role owns — BUT NOT AS IT STOOD.** Ready 3/8 → 4/8, Backlog loses one row; no limit approached, no override taken. **The single check this ticket failed on 2026-08-04 now passes and was verified at the SOURCE, not inherited from `ABC-014`'s close-out or the Orchestrator's pre-check:** `git show main:src/render.ts` carries `export type GlyphMode = "unicode" | "ascii";` at line 61, `ABC-014` is in `Done` (`ed42d26` → `c1d694f`), `Blocked` is empty — the board's own "no unbuilt dependency" test holds. **TWO ACCEPTANCE DEFECTS WERE FOUND AT THIS EXIT AND CORRECTED IN PLACE BEFORE PROMOTION, both of them rows the Orchestrator's pre-check ticked green:** (1) **an input tuple with no stated output** — `--ascii` and `--unicode` arrive as two INDEPENDENT booleans, so `(true, true)` is constructible and table rows 1 and 2 both match it, while the reject-with-a-message guard sits in `EPIC-006`, which is UNDECOMPOSED and merges LATER; ruled row-order, ASCII, no throw, no message, at zero code cost; (2) **a criterion no implementation could fail** — the old "made once, before the first frame, and cached" asserts only that a `const` does not mutate once the signals are injected as arguments (which the ticket's own test notes REQUIRE), and its one failing form is the module-level accessor those notes forbid — **the same unfalsifiable shape QE found in `ABC-014`**, caught here BEFORE an engineer writes against it; replaced by two criteria a named mutant kills. **AN OWNERSHIP SEAM CLOSED:** epic `2b`'s "decided exactly once, before the first frame" was pointed at `EPIC-006` by `ABC-015` and at `ABC-015` by `ABC-018`, so no ticket owned it and none could test it — ruled to `ABC-015`; **`ABC-018` and `EPIC-006` were NOT edited and no other ticket was touched.** **Size `S`, priority `P1`, scope, `RISK-005`'s mitigation and the merge-with-or-before-`ABC-018` constraint are UNCHANGED**, re-checked rather than assumed. One inherited count corrected: "nine enumerated input tuples" was EIGHT plus one session property (the ticket's own DoR line is where the Orchestrator got it) — now nine tuples plus two session criteria. **This is NOT the pull gate** — the Definition of Ready is applied again by the Orchestrator at `Ready → In Development`; promotion makes the ticket pullable and nothing more, and the owner's pull-order call that put `ABC-015` ahead of `ABC-009`/`ABC-022` is recorded in the routing note and NOT re-opened here. **Flagged, not fixed:** this header lagged one board edit behind — `ABC-014`'s move to `Done` on 2026-08-08 (`f1743a3`) did not update it, so the entry below reads 2026-08-07 while the `Done` row reads 2026-08-08; owner Orchestrator. **Nothing implemented, `src/` untouched, nothing merged, nothing deployed.** Was: 2026-08-07 by Security/NFR (task `ticket-to-pr-ABC-014`, subtask `security-nfr-abc014-gate`, Workflow 04): **ABC-014 GATED, verdict PASS_WITH_RISKS (board verdict PASS), moved In Security/NFR → Ready for UAT — the one board move this role owns.** In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. Gated against `security.asvs_level: L1` and `security.block_on: high`; `compliance_regime` is `[]`, so no Compliance Officer hand-off is owed. **NO REQUIRED FIX. FOUR ACCEPTED RISKS, EACH WITH A NAMED OWNER AND A PLACE.** **THE NFR BAR WAS RE-MEASURED ON THIS GATE'S OWN HARNESS, NOT INHERITED** — 11 rounds with the cell order rotated every round, a discarded warm-up, medians of per-round means, two fully independent samples, `parseFen` outside the timed region, checksum against elision, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` on any other hardware: **worst cell 2.092 / 2.056 µs against the ≤ 500 µs bar — 0.0042x, ~240x headroom, MET**, over all 24 cells of 6 standing perft FENs × 2 modes × 2 orientations. **The Engineer's 2.070 µs is BRACKETED by this gate's two samples — reproduced, not carried forward.** **THE BAR'S POPULATION DOES NOT CONTAIN THE MODULE'S WORST CASE, so the worst case was measured anyway:** a fully-occupied 64-piece board reads 2.322 / 2.342 µs, still 0.0047x. **The 40/120/300 ply counts do not apply to this module and none was invented** — a `Position` carries no move list, and castling, the ep square, both clocks and the side to move were measured to influence **zero frame bytes**. **THE TICKET'S "NO SECURITY TRIGGER" RULING WAS RE-DERIVED AND IT HOLDS — but its stated reason is INCOMPLETE and this gate says so rather than ratifying the ticket's wording:** two of `renderBoard`'s three parameters ARE strings whose unions are erased at runtime, so "no user-supplied string reaches this module" is not what holds the property. What holds it is stronger and was proven — **the output alphabet is CLOSED** (42 code points over 32 frames, 0 outside the fixed tables, 0 control bytes, **0 ESC**, so no ANSI sequence is constructible), because board bytes and the mode string are used only as lookup **keys** and are never emitted. **ONE REAL PROPERTY FOUND, AND IT IS A GADGET RATHER THAN A VULNERABILITY:** the two prototype-chain lookups at `src/render.ts:118`/`:139` inject attacker data — including ESC — into a frame under an **already-polluted** `Object.prototype`; **both real modes are immune** (own properties shadow it, verified against a live-pollution control) and **no pollution sink exists anywhere in `src/`**. LOW, does not block; owner Architect/Design at `ABC-018`/`EPIC-006`. **ASVS L1 judged not padded: 4 of the 70 reachable and passing on evidence, 66 structurally N/A with the reason stated per chapter; V16 and V17 carry no L1 requirements at all.** `plans/nfr-catalog.md`'s `UNKNOWN - verify` on the board-scan compute half is **discharged in exactly 3 lines of that file with no target moved** and every other NFR row byte-identical. **NO PRODUCTION CODE AND NO TEST WAS CHANGED BY THIS GATE** — `src/render.ts` md5 733bc67fec523a7f41016bea2b026e1d, identical to the Engineer's and QE's figure. **UAT is recorded as DEFERRED to `EPIC-006`, explicitly NOT passed** — zero importers and no CLI entry point, so a UAT pass would be a fabrication. **Nothing merged, nothing deployed.** Was: 2026-08-07 by QE/E2E (task `ticket-to-pr-ABC-014`, subtask `qe-abc014-break`, Workflow 04): **ABC-014 BROKEN-TESTED, verdict PASS, moved In Review → In Security/NFR — the one board move this role owns.** In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. **NO PRODUCTION CODE WAS CHANGED — `src/render.ts` is md5-identical to the Engineer's (733bc67fec523a7f41016bea2b026e1d) after 16 mutate-and-restore cycles**, and the 24 snapshots are byte-identical too; the only file this role touched under `src/` is `src/render.test.ts`. **10 NEW MUTANTS, and ONE SURVIVED all 17 delivered tests**: a board byte outside EMPTY and the twelve real pieces drawing a `?` placeholder instead of throwing — the Engineer flagged the decision, nothing pinned it, and a placeholder would silently widen a cell and break the constant geometry ABC-018 stands on. **TWO DELIVERED ASSERTIONS WERE MEASURED BLIND, not argued blind**: criterion 2's *"not the white frame with its rows simply reversed"* is UNFALSIFIABLE as written (reversing all nine rows moves the file-label row to index 0, so it passes even under the rank-only flip it exists to catch — demonstrated by running that exact defect), and criterion 1's file-label assertion is `.trim()`-ed, so a label row shifted one column with a trailing space passes it. **22 SNAPSHOTS THE ENGINEER HANDED OVER AS UNVERIFIED ARE NOW PROVEN**, by a frame oracle derived from the FEN TEXT that never touches `parseFen`, `squareAt` or the 0x88 layout — all 24 matrix cells. **10 tests added, suite 243 → 253 on 11 files, skip count 0**; lint (0 errors, the same 2 pre-existing infos), typecheck and build all exit 0; `src/render.ts` still 100% on all four coverage axes. **NO E2E WAS WRITTEN AND NONE COULD BE** — `AGENTS.md` E2E is `UNKNOWN - verify`, nothing imports this module, and there is no CLI entry point until EPIC-006; that is reported as a gap, not papered over. **Flagged not fixed: a missing snapshot file is silently REWRITTEN and the suite passes** (measured: 24 written, 17/17 green with no `CI` env; `CI=true` fails 6 instead), and this project has no CI. Nothing was merged and nothing was deployed — a human holds both. Previously 2026-08-06 by the Software Engineer (task `ticket-to-pr-ABC-014`, subtask `engineer-abc014-implement`, Workflow 04): **ABC-014 implemented and moved In Development → In Review — the one board move this role owns.** In Development 1/3 → 0/3, In Review 0/3 → 1/3; no limit approached, no override taken. **THREE NEW FILES UNDER `src/` AND NOTHING ELSE** — `src/render.ts`, `src/render.test.ts`, `src/__snapshots__/render.test.ts.snap`; all 20 pre-existing files under `src/` are **md5-identical to merged `main` ed42d26**, checked file by file. **Gates: 243/243 green on 11 files (was 226/10), skip count 0** captured with the `AGENTS.md` command; lint + typecheck + build exit 0; `src/render.ts` 100% on all four coverage axes. **NFR-002 board-frame bar MET with 242x headroom: worst 2.070 µs/frame against 500 µs** across all 24 cells of (6 perft FENs × 2 modes × 2 orientations), Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere — measured out of tree, and **no wall-clock assertion was added to the suite**. **18 mutants, 18 killed**, and the campaign CHANGED the suite: two of them survived the shading test until an assertion NAMING the dark character was added, because every property that does not name one is symmetric under inverting the whole colouring. Nothing was merged and nothing was deployed — a human holds both. Previously 2026-08-06 by the Orchestrator (task `ticket-to-pr-ABC-012`, Workflow 04): **ABC-012 MERGED to `main` and moved Ready for UAT → Done — the `… → Done` exit this role owns. THE BRANCHING MODEL CHANGED THE SAME DAY AND THIS IS THE FIRST MERGE UNDER IT.** Fast-forward `39e260d` → `7355b51`, 8 commits, **no merge commit** (the branch was linear and nothing had diverged). Gates run BEFORE the merge on the tip and AGAIN AFTER it on `main`: **226/226 green, skip count 0** (captured with the `AGENTS.md` command, not eyeballed), lint + typecheck + build exit 0. `git branch --no-merged main` is empty. Ready for UAT 1/4 → 0/4; no limit approached, no override taken. **THE GOVERNANCE CHANGE, because it is the reason this merge did not need its own instruction: project owner Olger Oeselg, 2026-08-06 — *"everything merges to main in this project, set it as branching model and i approve your merges"*. This RETIRES the per-merge rule that has been recorded on every merge in this project's history** (`ABC-001/002/003/008`, the `ABC-004..007` stack, `ABC-020`, `ABC-011`, and `grugops/refinement-2026-08-04` two days ago), each of which said in terms that the instruction was **not** standing. It is standing now. **THREE LIMITS ARE UNCHANGED AND ARE NAMED HERE SO THE GRANT IS NOT READ WIDER THAN IT IS: (1) DEPLOY IS NOT INCLUDED** — the owner wrote *merges*, `production_requires_human_confirmation` stays `true`, and merge approval is not rounded up to deploy approval. **(2) THE GATE STILL BINDS** — approval to merge is approval to merge work that has PASSED, never to skip or soften a gate; `quality.gate_enforcement` is still `blocking` and the standing practice of running gates on the tip and again on `main` after the merge is kept, which is how this merge was done. **(3) THE AUTHORITY IS STILL THE OWNER'S AND IS REVOCABLE** — what was delegated is the keystroke, not the right; one sentence takes it back. **THE CONFIG WAS DELIBERATELY NOT EDITED, and that is a finding rather than an omission: `autonomy` ALLOWS ONLY `diff` / `branch` / `pr`, and `pr` is defined by the kit as "branch + open a PR (agents never merge)". There is NO value that expresses "agents may merge", and no `branching_model` key exists either.** Inventing one would put a control in the file every role reads first that **nothing reads and nothing enforces** — a fake dial, and precisely the two-documents-disagree failure this project spent 2026-08-04 untying out of `ABC-015`. `autonomy` stays `pr` because it still describes accurately how work is PRODUCED (branch, then gate); what the owner changed is what happens AFTER the gate is green, which `autonomy` does not describe. The directive is therefore recorded where this project's other two standing directives already live and where agents actually read them — `memory-bank/60-progress.md`, quoted verbatim with its reading and its limits — and the branching model itself is routed to the AGENTS.md Scribe. **ONE QUESTION IS PUT BACK TO THE OWNER RATHER THAN DECIDED: whether merged branches are now deleted automatically.** Three branches are fully contained in `main` (`grugops/ticket-to-pr-ABC-011`, `grugops/refinement-2026-08-04`, `grugops/ticket-to-pr-ABC-012`); deleting merged branches is ordinarily part of a trunk-based model, but the owner has twice been recorded as holding that call personally, and "everything merges to main" is a statement about destination, not cleanup. **NOTHING WAS DELETED.** **What merged: `src/history.ts`, 154 lines / 51 executable, ZERO new dependencies**, `package.json` and lockfile byte-identical. **Three gates, and each of the two later ones found something the earlier had not — both times in the SUITE rather than the module:** QE killed **21 mutants and three survived all 221 delivered tests**, every one of them `resetTo` silently not copying a field (`castling`, `blackToMove`, `epSquare`), all three hidden by a single root cause — every acceptance test anchored at the start position and took back only at **EVEN** ply counts. Security/NFR then **re-measured all six NFR bars on its own harness** and met every one with room (**0.09x–0.67x**), discarding one of its own instruments that read a 2.08x MISS because it had `legalMoves` inside the timed region. **FIVE accepted risks, each with a named owner; NO required fix outstanding.** The one to carry: **`takeBack(NaN)` — and `"abc"`, `{}`, `undefined` — silently discards the entire game**, ruled MEDIUM and non-blocking **only because the input surface does not exist yet** (zero production importers), with the counterfactual on the record — *the moment `ABC-019` wires user input to it, ASVS V2.2.1 engages, severity is HIGH, and it blocks*. **UAT deferred → `EPIC-006`, recorded as deferred rather than passed** — no runnable game exists, so there is no surface a human can exercise, and that is now the ONLY human checkpoint left before code lands. **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.** **NOTHING WAS DEPLOYED — a human still holds deploy.** Previously 2026-08-04 by Security/NFR (task `ticket-to-pr-ABC-012`, subtask `security-nfr-abc012-gate`, Workflow 04): **`ABC-012` moved `In Security/NFR` → `Ready for UAT` — VERDICT PASS_WITH_RISKS (result PASS, NO required fix, FIVE accepted risks each with a named owner and a place).** In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; **no limit approached, no override taken, no written reason owed.** The `In Security/NFR` exit is the one board move this role owns. Gated against `security.asvs_level: L1` and `security.block_on: high`; nothing sits at `high`, so nothing blocks. **THE FIVE NUMERIC BARS WERE RE-MEASURED ON THIS GATE'S OWN HARNESS RATHER THAN INHERITED** — the standard this column set on `ABC-011`'s `NFR-005` — out of tree, own process, discarded warm-up, 11 rounds with the cell order rotated every round, medians, **two fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` anywhere else. **ALL SIX MET WITH ROOM:** `takeBack(2)` **2.46 / 2.45 µs** (0.49x), `keyHistory` **40.16 / 40.20 µs** (0.67x), `repetitionCounts` **44.35 / 44.45 µs** (0.59x), `gameStatusOf` **47.75 / 47.59 µs** (0.64x), `playMove` **8.6 / 8.2 ns** (0.09x), `repetitionCounts` @300 plies **91.93 / 92.15 µs** (0.61x). **BOTH FENCES QE HANDED FORWARD WERE TESTED, NOT REPEATED:** `gameStatusOf`'s margin IS the one `legalMoves` call and swings 1.4x on position (3.14–3.40 µs startpos-anchored, 4.49–4.55 µs kiwipete-anchored, against bare `legalMoves` of 2.74 and 3.89–3.96 µs) — **and the expensive-`legalMoves` anchor turned out CHEAPER overall (41.89 / 42.25 µs), because the O(plies) derive dominates**; and the `takeBack` upper bound reads **higher** with the restore outside the clock (2.92–2.93 µs), not lower, so the bound is tight to within less than the instrument resolves and the bar is met on either framing. **ONE INSTRUMENT WAS BUILT, MEASURED AT A 2.08x FALSE MISS, AND DISCARDED** — it called `legalMoves` twice inside the timed region; no number is claimed from it and it is recorded rather than buried (the seventh instrument-limit correction this project has made). **THE TICKET'S "NO SECURITY TRIGGER" ASSERTION WAS TESTED AND HOLDS:** the 8-module transitive closure rebuilt with **zero** non-relative imports and zero `node:` / `child_process` / `eval` / `new Function` / `process.env`, **zero runtime dependencies** with `package.json` + lockfile byte-identical to `39e260d`, and **12 hostile payloads fed to `newGame`** — every one rejected with a typed `FenError`, **zero prototype pollution**. **ASVS L1 JUDGED NOT PADDED — 12 of 70 reachable and judged, 58 structurally N/A with the reason stated per block.** **`takeBack(NaN)` RULED: MEDIUM, DOES NOT BLOCK — and the reasoning is written out rather than asserted.** Reproduced and **extended past QE's table** (the raw string `"abc"` and `{}` destroy the game too, which QE did not have and which is exactly what `ABC-019` will feed it); it is a correctness/data-integrity defect, and it is **not** an ASVS L1 V2.2.1 failure today because **the input surface does not exist** — `src/history.ts` has **zero production importers** and `takeBack` has no caller outside its test file. **The counterfactual is stated rather than banked: the moment `ABC-019` wires user input to it, V2.2.1 IS engaged, the default severity is HIGH, and it BLOCKS.** Owner BA/PM, place `ABC-019`. **UAT DEFERRED to `EPIC-006`, recorded as deferred and NOT as passed.** **NO PRODUCTION CODE CHANGED, NO TEST ADDED, NO NFR TARGET MOVED.** Previously 2026-08-04 by QE/E2E (task `ticket-to-pr-ABC-012`, subtask `qe-abc012-review`, Workflow 04): **`ABC-012` moved `In Review` → `In Security/NFR` — VERDICT PASS.** In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; **no limit approached, no override taken, no written reason owed.** The `In Review` exit is the one board move this role owns. **THE VERDICT WAS EARNED BY BREAKING THE MODULE, NOT BY RE-RUNNING THE ENGINEER'S NUMBERS** — those were re-run only as a control and they reproduce exactly (221/221 on 10 files, skip count 0, lint/typecheck/build exit 0, `git diff --numstat 39e260d -- src/` empty). **21 MUTANTS OF THE SHIPPED `src/history.ts`** — the Engineer's seven re-run as a control on its own table, all seven dying as reported, plus **fourteen of this gate's own. THREE OF THE FOURTEEN SURVIVED ALL 221 DELIVERED TESTS, and all three are one shape:** `resetTo`, the helper `takeBack` rebuilds the borrowed `Position` with, silently failing to copy one of its six fields. **`castling` not copied — SURVIVED:** `makeMove` only ever CLEARS castling rights, so a replay starting from a position that has already lost one converges on the same answer, and **no acceptance test ever takes back the move that lost a right** — "undo does not give a castling right back" is one of the classic undo defects and nothing pinned it. **`blackToMove` not copied — SURVIVED:** `makeMove` TOGGLES the side to move and **all three acceptance tests that take back do so from an EVEN ply count (40, 40 and 8)**, where two wrongs cancel exactly. **`epSquare` not copied — SURVIVED:** `makeMove` sets the ep square on every move so any replay of one or more moves hides a stale one, and the only acceptance test that truncates to ZERO plies anchors at the start position, where the ep square is empty either way. **ONE ROOT CAUSE, and it is the honest summary of the delivered suite: every acceptance test anchors at the START position and takes back only at EVEN ply counts.** **`src/history.ts` IS CORRECT ON ALL THREE — these were holes in the SUITE, not defects in the module**, which is the third time running on this project that a review pass has landed exactly there. **CLOSED BY 5 TESTS THIS GATE ADDED, each aimed at a mutant that actually survived rather than an imagined one**, plus **one assertion added to criterion 2's own test**: suite **221 → 226 passed / 10 files / skip count 0**, lint + typecheck + build all **exit 0**, `src/history.ts` still **100%** on all four coverage axes, and **NO PRODUCTION CODE WAS CHANGED — `src/history.ts` is md5-identical (`12f8c562…`) after 21 mutate-and-restore cycles.** **THE THREE ITEMS THE ENGINEER HANDED FORWARD ARE EACH ADJUDICATED FROM THE EVIDENCE RATHER THAN FROM ITS FRAMING. (1) CRITERION 2 CANNOT BE SATISFIED AS WORDED — UPHELD, and verified with the COMPILER rather than by reading:** `const bad: GameStatus = { result: "draw", reason: "threefold-repetition" }` is **TS2820**, while the null control `reason: "stalemate"` compiles clean, so the probe is not vacuous. **The criterion's INTENT is met and GREEN**, and the wording is routed to **BA/PM** with neither the ticket nor merged `gameend.ts` edited. **One thing for BA/PM that was on nobody's list: `gameStatusOf` CAN return `result: "draw"` for repetition — at FIVEFOLD, which is automatic under FIDE 9.6.1** — so the criterion has a satisfiable re-wording in either direction, and **this gate wrote the fivefold test that had never existed**, the module's only reachable end-of-game path. **(2) CRITERION 2'S TEST DOES NOT PIN THE BOARD HALF OF `takeBack` — CONFIRMED by measurement and now CLOSED:** one `toFen` assertion against a core-primitive oracle, and the truncate-but-never-replay mutant now dies to that test and to **6 tests in all** rather than 2. **(3) TWO MUTANTS DIE TO EXACTLY ONE ASSERTION — CONFIRMED, and both now have two INDEPENDENT killers:** the `keyHistory` off-by-one (a new test checking EVERY key against a `parseFen`+`makeMove` oracle — 13 assertions instead of 1) and the zero clamp (the tightest possible over-run, `plies = length + 1`, where the removed clamp silently keeps a **DIFFERENT game** rather than an obviously empty one). **TWO CORRECTIONS OF RECORD, neither blocking, both to figures this project would otherwise have carried forward. (a) THE `grep -vxF -f` INSTRUMENT IS NOT UNSOUND — THE SHELL'S `grep` IS NOT `grep`.** The Engineer's identity null control was reproduced exactly (13 on `src/fen.test.ts`, 73 on `gameend`, 81 on `apply`) and then explained: **those counts ARE the files' blank-line counts, 1:1 across four files**, because `grep` in the agent shell is a function shimming to **ugrep 7.5.0**, which does not match an empty `-F -x` pattern against an empty line. **`/usr/bin/grep` returns 0 on the identity control for all four.** The Engineer's decision to claim no number from it was right; the **diagnosis** was wrong, and leaving it would teach the next role to distrust a sound idiom instead of a shimmed binary — **every grep-based instrument built in this environment is running ugrep.** **(b) `npx vitest run --coverage` DOES NOT DELETE 22 TRACKED FILES.** `coverage/` is tracked (22 files) and unignored, so the premise holds and the hazard is real — but measured under a controlled restore, **the PLAIN command deletes 0 and MODIFIES 15**, while **the filtered command the Engineer's own artifact-ref records deletes 12 and modifies 3**. Both were reproduced and both restored byte-identically (`git diff 3a44b3f -- coverage` empty). **The mitigation is verified: `--coverage.reportsDirectory` pointed outside the repository leaves `coverage/` untouched**, and Security/NFR runs coverage next. **DEFECTS AND GAPS NAMED, NOT FIXED — QE does not change production code. `takeBack(history, NaN)` SILENTLY DISCARDS THE ENTIRE GAME** — no throw, no clamp, `moves.length` 0; so does `undefined`, because `Math.max(0, NaN)` is `NaN` and `splice(NaN)` starts at 0. **`NaN` is a `number` to TypeScript and `ABC-019`'s turn loop will parse a ply count from user input**, so this is the exact silent-corruption class the clamp exists for, in the one input shape it does not cover; a fractional `plies` also takes back MORE than asked (1.5 → 2), while negative and `Infinity` are both safe exactly as the Engineer said. **Not fixed and deliberately NOT pinned by a test — a test asserting today's output would enshrine it.** **`src/history.ts:42` claims the borrow contract "is documented and tested". IT IS NOT TESTED** — no test in the file touches `history.position.board`, as the Engineer's own claim note says — and the same comment tells callers **not** to hold the reference across a `takeBack` while the decision note and this ticket's implementation record say holding it is **safe** because `takeBack` rebuilds in place: **two documents give `ABC-019` opposite guidance.** **THE DOUBLE-PUSH REPETITION TEST IS DECLINED WITH A REASON RATHER THAN LEFT OPEN** — it would assert a property of `src/zobrist.ts` (`ABC-011`'s, merged, gated twice, covered), not of `src/history.ts`, and this module cannot distinguish the two hashes; it belongs on `ABC-011`'s trace row. **`playMove` still validates nothing** — SEAM 1's priced decision, not re-opened. **THE FIVE NFR BARS WERE DELIBERATELY NOT RE-MEASURED — Security/NFR owns them and gates next**, and **nothing cost-shaped was added**: the 5 new tests carry **no wall-clock assertion**, this project's standing rule. `plans/nfr-catalog.md` was not edited and neither was the trace row's `NFRs` cell. **ACCEPTANCE CRITERION 9 VERIFIED AT LINE LEVEL — which is what it asks — WITH A WORKING NULL CONTROL: all NINE test files that existed at `39e260d` are +0/−0, while the same instrument reads 107 added lines on the one file this gate did change.** `src/history.test.ts` did not exist at `39e260d`, so it is not a pre-existing test and the criterion still holds after this pass. **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.** **SUBSTRATE DEGRADATION CARRIED FORWARD:** still no `scripts/claim.js` and no `scripts/context-io.ts`, so the queue file moved `pending` → `claimed` → `done` **by hand** with a `claim.md` registry record and the notes are hand-written in the schema's exact shape; **`finding` is inadmissible with no §14 gate to issue a stamp and NOTHING WAS SELF-STAMPED** — the kinds used are `decision`, `observation`, `claim` and `artifact-ref`. **The test-integrity checker still returns exit 2**, re-run here as Workflow 05 step 3 specifies — "the checker could not run", which is not a pass and not the exit-1 short-circuit; skip count is 0 so there is nothing for the registry to justify, and the registry is human-owned. **NO PR — this repo has no git remote**, so there is nowhere to push and none was invented. **Nothing was merged and nothing was deployed — a human holds both.** Previously 2026-08-04 by the Software Engineer (task `ticket-to-pr-ABC-012`, subtask `engineer-abc012-implement`, Workflow 04): **`ABC-012` moved `In Development` → `In Review` — the one board move this role owns.** In Development 1/3 → 0/3, In Review 0/3 → 1/3; **no limit approached, no override taken, no written reason owed.** **ONE NEW MODULE AND NOTHING ELSE UNDER `src/`:** `src/history.ts` (154 lines, 51 executable) and `src/history.test.ts` (213 lines, 7 tests). **Every tracked file under `src/` is md5-IDENTICAL to merged `main` `39e260d` and `git diff --numstat 39e260d -- src/` is EMPTY** — a byte-level result, stronger than the line-level check the last acceptance criterion asks for. **The instrument that failed is recorded rather than buried, the fifth time this project has had to:** a `grep -vxF -f` line-presence check was tried first, reported 13–81 "absent" lines per file, and **fails its own null control by identity** — comparing `src/fen.test.ts` with ITSELF it reports 13 absent lines. It is unsound on this input class and **no number is claimed from it.** **BOTH SEAMS WERE IMPLEMENTED, NOT RE-OPENED** — six functions with SEAM 1's exact signatures, three fields, and no cache / version counter / invalidation (SEAM 2). **THE DEPENDENCY CLAIM WAS MEASURED:** the graph rebuilt from `src/*.ts` gives **10 modules, zero cycles, max depth 6 → 7**, `history.ts` alone at level 7, all six edges downward, **no import of `legal.ts` and none of `san.ts`**, and it is **the one module with zero importers** — which is what keeps the rules core ignorant of the session. `memory-bank/30-architecture.md` updated, including the bullet that read *"who owns game history is an open decision, not a recorded one"*, which this ticket falsifies. **EVERY ACCEPTANCE CRITERION HAS ITS OWN TEST AND EVERY TEST WAS PROVEN ABLE TO FAIL: seven tests against seven mutants of the shipped module, all seven killed** — `repetitionCounts` dropping the current position (2 tests), `keyHistory` dropping the initial key (5), `takeBack` truncating but never replaying (2), the zero clamp removed (1), `playMove` not appending (6), `playMove` not applying (6), `keyHistory` off-by-one (1). **The deep-equal INSTRUMENT was controlled rather than trusted** — `toEqual` on a `Map<bigint, number>` proved to reject a differing count, a missing entry and an empty map while accepting a reordered equal map. Gates: **221 passed / 10 files / 0 failed** (was 214 / 9), **skip count 0** captured with the `AGENTS.md` command, lint + typecheck + build all **exit 0**, `src/history.ts` at **100%** on all four coverage axes. **ALL FIVE NFR BARS MEASURED AND MET** on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64**, `UNKNOWN - verify` on any other hardware — out of tree in its own process, 11 rounds plus a discarded warm-up, cell order rotated each round, medians of per-round means, two samples, and **no wall-clock assertion was added to the suite**, this project's standing rule. At **120 plies**: `takeBack(2)` **2.45 / 2.45 µs** against 5 µs (an **upper bound** — the two restoring `playMove` calls are inside the timed region, ~0.025 µs of it), `keyHistory` **40.66 / 40.51 µs** against 60, `repetitionCounts` **45.72 / 45.78 µs** against 75, `gameStatusOf` **49.33 / 48.99 µs** against 75, `playMove` **12.4 / 12.7 ns** against 100 ns; growth check `repetitionCounts` **@300 plies 99.62 / 99.07 µs** against 150, and **18.06 / 17.99 µs @ 40 plies** — linear with a constant offset and still **10x under** `ADR-0002`'s ~1 ms reopening threshold at 300. Every figure reproduces SEAM 1's wave-1 numbers, which is a **check** rather than a coincidence, this being the first time the code being measured exists. **`plans/nfr-catalog.md` was deliberately NOT edited** — its rows are Architect/Design's and Security/NFR's, the same division the `ABC-011` Engineer kept. **ONE ACCEPTANCE CRITERION CANNOT BE SATISFIED AS WORDED AND IS HANDED TO BA/PM RATHER THAN QUIETLY REWRITTEN OR QUIETLY IGNORED:** criterion 2's first half asks `gameStatusOf` to return `result: "draw", reason: "threefold-repetition"`, which **`src/gameend.ts` cannot return and its TYPE cannot express** — `threefold-repetition` is a `ClaimableDraw`, not an `EndReason`, because **`ABC-020` ruled on FIDE 9.2.1 that the third occurrence is a draw the side to move MAY CLAIM and may just as well decline** (`src/gameend.test.ts:68-92` pins the real shape). The only change that would satisfy the literal wording is a change to merged, `Done`, 100%-covered `gameend.ts`, which this ticket's `## Out of scope` forbids. The criterion's **intent is tested in full and green** and its second half is satisfied exactly as written. **This is a SECOND stale line on this ticket, of the same class as the trap-1 correction the Orchestrator made at the pull.** **FOUR LEADS ARE HANDED TO QE RATHER THAN ABSORBED:** criterion 2's own test does **not** pin the board half of `takeBack` (the truncate-but-never-replay mutant survives it; the criterion-5 and criterion-7 tests kill it); the `keyHistory` off-by-one is killed by **exactly one** assertion; the double-push repetition test the Orchestrator named for that column is still unwritten and was deliberately **not** added in dev, being in no acceptance criterion; and `playMove` validates nothing, by SEAM 1's priced decision. **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.** The start FEN is now literal in **five** files rather than four — `## Out of scope` forbids the shared constant. **SUBSTRATE DEGRADATION CARRIED FORWARD:** still no `scripts/claim.js` and no `scripts/context-io.ts`, so the queue file moved `pending` → `claimed` → `done` **by hand** and four context notes are hand-written in the schema's exact shape; **`finding` is inadmissible with no §14 gate to issue a stamp and NOTHING WAS SELF-STAMPED** — the kinds used are `decision`, `observation`, `claim` and `artifact-ref`. **NO PR — this repo has no git remote**, so there is nowhere to push and none was invented. **Nothing was merged and nothing was deployed — a human holds both.** Previously 2026-08-04 by the Orchestrator (task `ticket-to-pr-ABC-012`, Workflow 04): **BA/PM's refinement branch MERGED to `main`, and `ABC-012` PULLED `Ready` → `In Development` — the one board move this role owns on the way in.** Ready 5/8 → 4/8, In Development 0/3 → 1/3; **no limit approached, no override taken, no written reason owed.** **THE MERGE: `grugops/refinement-2026-08-04` → `main` by fast-forward `10b119c` → `39e260d`, ONE commit, no merge commit** (the branch was linear and nothing had diverged). Gates run BEFORE the merge on the branch tip and AGAIN AFTER it on `main`: **214/214 green, 9 files, skip count 0** (captured with the `AGENTS.md` skip-count command, not eyeballed), lint + typecheck + build all exit 0; `git branch --no-merged main` is empty. **What merged contains NO production code** — sixteen files, all under `plans/`, `memory-bank/` and `.grugops/` — which is why identical figures on both sides of the merge are the expected result rather than a suspicious one. **The merge was performed by an agent on EXPLICIT human instruction and is NOT standing authorization** — the same rule recorded for `ABC-001/002/003/008`, the `ABC-004..007` stack, `ABC-020` and `ABC-011`; the next merge needs its own instruction. **The branch was NOT deleted** — the owner's call, and never standing either. **THE PULL: `ABC-012` taken as the first item of the pull order BA/PM fixed the same day**, and the two questions that were holding that order open were answered in BA/PM's work rather than by this role: `ABC-022` was ranked `P1` and so does **not** precede `ABC-012` under the owner's legality-first directive, and the `ABC-015`/`RISK-005` knot was untied. **THE DEFINITION OF READY WAS RE-CHECKED AT THE PULL AGAINST MERGED `main`, not assumed from the 2026-07-30 promotion** — the `ABC-020`/`ABC-011` precedent — and the ticket's central premise was verified rather than read off the ticket: `gameStatus`'s `positionCounts` is still optional (`src/gameend.ts:135`) with **no supplier anywhere in `src/`**, and `src/history.ts` does not exist. Acceptance is measurable (byte-identical FEN strings, an exact array length of `N + 1`, an exact count of `3` rather than 2, an exact prefix property, a no-throw clamp, five numeric µs bars each with its ply count and machine class), dependencies are all merged, size `M` so no `SPLIT_REQUIRED`, priority `P0`, and **`ADR-0002` (four clauses) and `ADR-0004` are both ratified — neither is `proposed`, so `ABC-013`'s 2026-07-30 `Blocked` situation does not repeat.** **NO DESIGN HOP IS OWED AND NONE WAS TAKEN — `In Design` stays 0/2.** Both prior occupants of that column were pulled there for a written reason quoted from the ticket itself; `ABC-012` carries no `### Open design question` because its two seams were closed by Architect/Design **at decomposition** (SEAM 1 the exact API, SEAM 2 no memoization), and the ticket's own `## Source` says it implements those decisions and does not re-open them. Inventing a design hop for a ticket whose design is already recorded would be waste, not caution. **ONE LINE OF THE TICKET IS NOW STALE AND IS CORRECTED IN THE CONTEXT NOTE RATHER THAN IN THE TICKET** (ticket text is BA/PM's, not this role's): `## Test notes` trap 1 requires test 1 to use a repeated line that never sets an en-passant square *because `src/zobrist.ts` hashes the ep file whenever `epSquare` is set*, and says this makes the test **"blind to `ABC-011`"**. **That rationale describes the pre-`ABC-011` tree.** Verified on merged `main`: `src/zobrist.ts:85` now reads `epSquare !== NO_SQUARE && hasLegalEnPassant(position)`, so a repeated line with a double push and no available capture hashes **EQUAL**. **This is NOT a blocker and NOT a ticket change** — following the instruction as written is still correct and still cheap, since `src/gameend.test.ts:27-58` already holds the knight cycle it says to reuse; what changed is the *reason*, not the *instruction*, and the "blind to `ABC-011`" sentence must not be carried forward as current. **Whether to ADD a double-push repetition test is deliberately NOT ordered** — it is in no acceptance criterion and `AGENTS.md` rules 5 and 9 forbid an engineer adding unrequested work; it is named for the QE gate, which owns adversarial coverage and may take it or decline it. **ONE TICKET, NOT SEVERAL:** `ABC-014` is pullable for the first time and `ABC-009`/`ABC-022` are unblocked, but `ABC-019` blocks on `ABC-012` and this is a new module four epics rest on — a second concurrent ticket buys throughput this project cannot spend and costs review attention it can. `queue.wip_limit` 3 and `claim_cap` 2 are both unreached; `ticket-to-pr` is a chain, so effective width is 1 regardless. **SUBSTRATE DEGRADATION CARRIED FORWARD, recorded not glossed:** still no `scripts/claim.js` and no `scripts/context-io.ts`, so queue files move by hand and notes are hand-written in the schema's shape, and **`finding` remains inadmissible — no §14 gate exists to issue a stamp and no role may self-stamp.** **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.** **Nothing else was merged and nothing was deployed — a human holds both.** Previously 2026-08-04 by BA/PM (task `refinement-2026-08-04`, subtask `ba-pm-generator-defect-and-abc014-knot`, Workflow 07): **both unowned items are closed and the pull order is fixed. `Ready` 4/8 → 5/8; no limit approached, no override taken.** **ITEM 1 — `ABC-022` CUT (`S`, `P1`, `EPIC-001`, straight to `Ready`), and it was REPRODUCED BY THIS ROLE BEFORE BEING CUT** rather than accepted from the three roles that described it and cut none. The three prior descriptions hold, and the reproduction found **three things none of them said**: **(a) the shape is PIECE-AGNOSTIC** — both FENs on record use a knight, a **rook** reproduces identically, and line 177 reads only the occupant's *colour*, so an AC naming the two recorded FENs would have been satisfiable by a knight-shaped fix; **(b) the branch carries TWO defects and the UNROUTED one is WORSE** — the routed half (no empty-target check) is pure and merely wrong, while the second half (no check that the captured pawn *exists*) makes **`legalMoves` PERMANENTLY CORRUPT the position it is handed**, `ABC-009`'s symptom by the en-passant route; **(c) one of the two traps in the routing note is HALF WRONG, and correcting it STRENGTHENS the conclusion** — the note says perft is silent because the legality filter later rejects the over-offered move, but **measured, THE FILTER DOES NOT REJECT IT** (`legalMoves` returns it on both reproductions). Perft is silent because the **trigger population is empty**: **0 of 518,474 reachable nodes carry an occupied en-passant target**, so **no perft depth and no added perft position can ever reach this defect** — which is why the ticket's test notes forbid adding one, and why `32/32 exact` still does not clear the class. **The second trap is CONFIRMED and strengthened: `ABC-011`'s guard (a) is not a deletable workaround** — QE's correction to the Engineer was that it covers two classes and only one is this defect; re-derived here by **deleting** guard (a), the predicate answers `true` on **both** classes, because `hasLegalEnPassant` **synthesises** its probe move and never consults `generateMoves`. Guard (a) is a precondition of the *predicate*, not compensation for the *generator*, and fixing `ABC-022` changes neither row — so "deletable" is not over-stated, it is **false**. **PRIORITY `P1`, NOT `P0`, so `ABC-022` DOES NOT GO AHEAD OF `ABC-012`** — the conditional the routing note left open, answered rather than dodged, on **this board's own `P0` test** written here 2026-07-31 (*"the directive applies AND the fault is reachable"*): the directive applies, the fault does not — 0/518,474, invalid-FEN only, `EPIC-003` undecomposed. `ABC-009` is the identical shape and was ruled `P1` on this same test on the same day; ranking `ABC-022` above it would not be defensible. An escalation trigger to `P0` is on the ticket. **ITEM 2 — THE `ABC-015` / `ABC-014` / `RISK-005` KNOT IS UNTIED AND `ABC-014` IS PULLABLE FOR THE FIRST TIME.** `ABC-015` said it merges *"with or before `ABC-014` reaches `Done`"* while needing `ABC-014` first (it declares the `GlyphMode` type `ABC-015` returns) — and `Done` **means merged** here, so it required `ABC-015` to merge no later than the ticket it cannot be written without. **`ABC-015`'s wording is the one that was wrong**; `ABC-014`'s already said the right thing (*"with or before this ticket's first user-visible use"*) and `ABC-015` mis-copied it. **`ABC-014` reaching `Done` is not a user-visible use of anything** — it *"returns a frame as a value and writes nothing"* and takes the glyph mode as a **parameter it does not choose**, so merging it cannot produce the hardcoded-mode build `RISK-005` rules out. **The constraint binds at `ABC-018`**, the ticket that makes the frame a *display* rather than a value and the first thing in `EPIC-002` a player can see. **Corrected IN PLACE in four files so no two documents disagree** — `ABC-015`, `ABC-014`, `ABC-018` (which gains the constraint *and* the obligation not to hardcode or re-derive the mode) and `EPIC-002`'s `RISK-005` entry, which had propagated the wrong wording. Chain is now `ABC-014` → `ABC-015` → `ABC-018`, acyclic. **`RISK-005`'s severity and MITIGATION STRATEGY are unchanged — only the event the sequencing binds to moved**; if a later reader thinks the mitigation itself needs revisiting, that is Security/NFR's and not BA/PM's. **`ABC-015` is NOT promoted to `Ready`**: untying the merge order did not remove the build dependency, and this board's own `Ready` test is "no unbuilt dependency". **PULL ORDER: `ABC-012` → `ABC-014` → `ABC-009` → `ABC-022` → `ABC-013`**, each with its reason in the `Ready` comment below. **The 2026-07-31 re-sequencing is NOT re-opened** and its comment stands unamended; **`ABC-009` and `ABC-022` were deliberately NOT reordered against each other**, and `ABC-010`, `ABC-016`, `ABC-017`, `ABC-019`, `ABC-021` and every epic priority were re-read and left. **Two real gaps found in other tickets are NAMED, NOT FIXED, because editing them would be the board sweep this task was told not to do:** `ABC-010`'s validation closes `ABC-022`'s second half's trigger but **not** the first's, and `ABC-009`'s `## Scope` promises more than any of its acceptance criteria tests. **Nothing was merged and nothing was deployed — a human holds both**, and `Ready` → `In Development` is the Orchestrator's pull, deliberately not taken. Previously 2026-08-04 by the Orchestrator (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 MERGED to `main` and moved Ready for UAT → Done — the `… → Done` exit this role owns.** Fast-forward `4a73cf3` → `d3efba6`, 16 commits, **no merge commit** (the branch was linear and nothing had diverged). Gates run BEFORE the merge on the tip and AGAIN AFTER it on `main`: **214/214 green, skip count 0** (captured with the `AGENTS.md` command, not eyeballed), lint + typecheck + build exit 0. `git branch --no-merged main` is empty. Ready for UAT 1/4 → 0/4; no limit approached, no override taken. **The merge was performed by an agent on EXPLICIT human instruction and is NOT standing authorization** — same rule as ABC-001/002/003/008, the ABC-004..007 stack and ABC-020. **The branch was NOT deleted** — that is the owner's call, made explicitly once before and also not standing. **UAT deferred → EPIC-006, recorded as deferred rather than passed.** What merged is unusual in shape and the Done comment records it: **two design hops, two dev passes, two QE reviews and two Security/NFR gates on one `M` ticket**, because the owner declined an accepted risk all three gates had passed — and every stage of the second pass then found something the first had not. The production diff for the whole fix is **four executable lines**. **One gate run was REFUSED and re-run**: the second Security/NFR run was cut off mid-flight and left the board asserting a PASS with **zero published notes**; it was sent back on the standing rule, upheld its own verdict, and **could not reproduce several of the interrupted run's figures**. **ADR-0005 (accepted with an amendment) and ADR-0006 (accepted)** landed with it — the first ratified under the owner's 2026-08-03 delegation. Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, subtask `security-nfr-abc011-regate`, Workflow 04): **ABC-011 moved `In Security/NFR` → `Ready for UAT` on the SECOND risk/NFR gate — VERDICT PASS** — In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; **no limit approached, no override taken, no written reason owed.** The `In Security/NFR` exit is the one board move this role owns. Gated through `349b1db` against `security.asvs_level: L1` and `security.block_on: high`: **no security finding at any severity, nothing at or near `high`, so nothing blocks.** **THIS RUN COMPLETES AN INTERRUPTED ONE, AND THAT IS THE FIRST THING THIS RECORD HAS TO SAY.** An earlier attempt at this subtask was cut off mid-flight. It had already moved this board to `Ready for UAT` with a PASS and written long figure-carrying blocks into `plans/board.md`, `plans/nfr-catalog.md` and `plans/traceability.md` — but it **published no typed note at all**, so the board asserted a verdict the shared verified context did not back, which under "no published notes, no advance" is not admissible. That prose was never committed. **It has been REVERTED rather than patched, and every figure below was re-derived by this run on its own scripts** — its numbers were treated as evidence to be checked, not as this run's conclusions. Where a figure reproduced it is named as confirmed; where it did not, THIS run's figure is the record and the difference is stated. **THE MEDIUM PURITY DEFECT THE OWNER DECLINED TO MERGE IS CLOSED, at HIGH confidence, verified by this column rather than accepted:** all **13** known reproductions answer `false` and are byte-pure through `zobristKey`; **336,000 adversarial inputs of this gate's own construction read 0 impure and 0 throws**; and the instrument is **non-vacuous by the strongest available control — the REAL pre-guard tree `584defa`, the code the owner declined to merge, reads 14,341 impurities on the identical population and is impure on 6 of the same 13.** Closure also has a structural argument re-derived here: guard (b) establishes the precondition `undoSpecial`'s unconditional write assumes and does not state, guard (a) establishes the destination is empty and additionally rejects every out-of-array target (`board[oob]` is `undefined`, and `undefined !== EMPTY`). **`NFR-005` RE-MEASURED INDEPENDENTLY, FOUR TREES IN ONE PROCESS — merged `4c6ed7d`, pre-guard `584defa`, shipped, and a BYTE-IDENTICAL TWIN of the shipped tree as a NULL CONTROL BY IDENTITY** — 15 rounds × 100,000 iterations, rotated tree and cell order, medians, two full samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **BOTH BAR POSITIONS MET WITH ROOM: startpos 296.8–299.3 ns against the ~450 ns bar (1.004–1.008x of merged), kiwipete 304.7–307.4 ns against the 432–459 ns bar (0.993–0.999x of merged).** **The CALL-COUNT sub-bar is MET, re-verified on this gate's own spy through a copy of `zobrist.ts` whose body differs from the shipped file by one import specifier and nothing else: 518,474 nodes hashed, 81,397 carrying an ep square (15.70%), 81,397 predicate calls, ZERO on the 437,077 no-ep nodes, never more than one per call, and `zobristKey` pure at every node** — reproduced here to the node, on a walk whose depths were read out of `src/perft.test.ts` rather than recalled. **THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST AND NO NUMBER IS CLAIMED FROM IT.** Every shipped-minus-pre-guard whole-key delta sits inside the identity twin's own per-cell band, and the deltas FLIP SIGN between this gate's two samples (startpos −0.69 then −3.24 ns; kiwipete −1.54 then −7.25 ns). Measured instead on the predicate in isolation, in a process that does nothing else, 21 rounds × 500,000 iterations with the same identity twin reading ±0.04 ns on the tight cells: the guards cost **about +0.9 ns** on the ep-set/no-capture shape = **≤ +0.15 ns amortized per node** at the measured 15.70% ep frequency, about **0.05%** of a ~305 ns key; below resolution on the shapes where a capture exists; and **23x CHEAPER (123.4 → 5.4 ns) on the invalid-FEN class the guards exist for.** That is consistent with the Engineer's ≤ +0.41 ns and the design hop's ≤ +0.5 ns and does **not** confirm their per-cell point estimates. **THE WITHDRAWAL OF THIS COLUMN'S OWN "the worst-case spread is resolved" SENTENCE (2026-08-02/03) STANDS, and this run's figures are further evidence for it, not against it:** this gate reads the worst-case ep shape at **1.401–1.412x**, where the first gate read 1.385–1.400x and the interrupted run read 1.446–1.458x. Three protocols, three answers inside about ±4% — the same size as the spread that was once called resolved. **The bar is unaffected: it is anchored at kiwipete/startpos, and the worst-case ep shape is not a bar position.** **THE TWO COST-SHAPED EQUIVALENT MUTANTS QE HANDED THIS COLUMN ARE DELIBERATELY NOT PINNED, and this gate owns the call with its reasons:** deleting `hasLegalEnPassant`'s own `NO_SQUARE` early return, and moving both guards inside the `EP_CAPTURE_SIDES` loop. Both survive all 214 tests (verified here by running them). Both are behaviour-equivalent over **83,400** inputs of this gate's own construction — 0 answer, 0 key, 0 purity differences. **No spied call count distinguishes either: 0 of 9 call shapes, at the predicate AND through `zobristKey`** (makeMove / unmakeMove / isSquareAttackedBy identical everywhere), so the instrument `src/zobrist.nfr.test.ts` exists for cannot be pointed at them. **The early-return deletion costs STRUCTURALLY ZERO in production**, because `zobristKey` is the ONLY production caller of the predicate and its `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters the callee — a stronger statement than a nanosecond figure, and the reason no nanosecond figure is quoted. **The only instrument that COULD see them is a Proxy board-read counter, and this gate measured that instrument to be unusable here:** a Proxy over the `Uint8Array` board **throws outright** — `TypeError: this is not a typed array` from `kingSquareOf`'s `board.indexOf` — so it does not even run without a function-binding shim; shimmed it costs **11.1–13.6x**, and its mere presence in the same process inflates the *un-instrumented* readings by **2.0–3.0x**. An instrument that destroys what it measures cannot found a budget assertion. **Owner: Security/NFR at `EPIC-004`**, when a search exists and a per-node budget makes 0.05% worth an assertion. **TWO FIRST-PASS RESIDUALS ARE CLOSED AND THIS PROJECT CAN STOP CARRYING THEM — QE's report is CONFIRMED by running it: `Z1` (reorder the call-site conjunction) and `Z4` (drop the `epSquare` guard) are each KILLED by `src/zobrist.nfr.test.ts`'s spied zero-call assertion**, one test killing both. **THE UNCOMMITTED EDIT TO `src/zobrist.nfr.test.ts` IS KEPT, AFTER BEING CHECKED RATHER THAN INHERITED:** it is **comment-only**, proved mechanically (both revisions stripped of comments are md5-identical — zero assertion, import or fixture lines changed), and its four-combination deletion table was **re-derived here and is correct** (early return alone → pure; + guard (a) → pure; + guard (b) → pure; + BOTH guards → the stray pawn on off-board square 15 returns and both cases fail, confirmed by applying that mutant to the repository's own `src/` and watching the two assertions fail). **One sentence of it was WITHDRAWN as unsupportable and corrected:** it quoted "about +1.6 ns" for the direct no-ep call, and this gate's own benchmark reads +0.9 to +2.9 ns on cells where that deletion's delta is STRUCTURALLY ZERO — the cross-tree systematic floor is the same size as the signal, so no point estimate survives. **ASVS L1, judged rather than padded: the full 70-row tier was NOT re-run, and that is a decision with a reason, not an omission.** The delta since this column's first pass is **four executable lines** in one pure function (`src/legal.ts`, hoist `captured` + two board-read guards) plus a doc-comment-only edit to `src/zobrist.ts`; verified here that **no import was added or widened, no dependency changed (`package.json` / lockfile diff empty, zero runtime dependencies), no sink or I/O or `process.env` exists anywhere in `src/`, and no secret-shaped string is in the diff.** What actually moved was re-checked: **V2.1.1 / V2.2.1** (input validated to business expectations) moves in the GOOD direction — the library no longer corrupts a caller's position on a semantically-inconsistent FEN — while the underlying FEN semantic-validation gap is unchanged and still **`ABC-010`'s**. The two new reads can address out-of-array indices; on a `Uint8Array` that returns `undefined` and is **not** a memory-safety issue, so **V1.4.1 stays NOT-APPLICABLE** (and is L2 in any case). The **V15.1.1 / V15.2.1** severity override to `low` recorded at the first pass stands unchanged (owner: Architect/Design at `EPIC-006`), and **V13.4.1 stays DEFERRED, not passed.** Suite re-run by this gate: **214 passed / 9 files / 0 failed / skip count 0**; `npm run lint`, `npm run typecheck`, `npm run build` all **exit 0** (the same 2 pre-existing biome config-schema infos). **FOUR accepted risks, each with a named owner; NO required fix outstanding.** UAT recorded as **DEFERRED to `EPIC-006`, not passed** — no runnable game exists, so there is no surface a human can exercise. `ADR-0005` is still `proposed`; **no agent may mark it `accepted` and this gate did not.** **NO PR — this repo has no git remote. NOTHING MERGED, NOTHING DEPLOYED — a human holds both.** Previously 2026-08-03 by QE/E2E (task `ticket-to-pr-ABC-011`, subtask `qe-abc011-review-fix`, Workflow 04): **ABC-011 moved `In Review` → `In Security/NFR` on the SECOND review pass — VERDICT PASS** — In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; **no limit approached, no override taken, no written reason owed.** The `In Review` exit is the one board move this role owns. **The MEDIUM purity defect the project owner declined to merge is GENUINELY CLOSED**, and that verdict was reached by re-deriving the ticket and by breaking the delivered suite with mutants — **not** by re-running the Engineer's suite and reading the green. **49 mutants against the CHANGED production surface** (the first pass's 22 re-run plus 27 new ones aimed at the guard surface): **44 killed, 5 survived, and all 5 were then PROVED behaviour-equivalent** over 55,600 adversarial inputs each — same answer, same key, same purity — rather than merely left unkilled. **TWO OF THE NEW MUTANTS SURVIVED ALL 206 DELIVERED TESTS AND WERE REAL, both of them exactly the “one-line equivalent simplification” the second design hop warned about:** guard (b) relaxed from “exactly the enemy PAWN” to “any enemy PIECE” is green on 206 tests and **permanently rewrites a black KNIGHT on the ep capture square into a black PAWN from a single `zobristKey` call** (`4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1`) — the owner's MEDIUM defect reopened in a shape no delivered row reaches; and guard (a) relaxed from “the target is EMPTY” to “the target holds no ENEMY piece” is green on 206 tests and **answers `true` on the exact FEN guard (a) exists for**, the `generateMoves` own-piece case (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`) — pure, and still the wrong answer. **THE SHIPPED CODE IS CORRECT ON ALL FOUR AND NO PRODUCTION LINE WAS CHANGED** — these were holes in the SUITE, not defects in the fix, because the delivered table classifies boards by what is MISSING and never by what is PRESENT INSTEAD. **Closed by 8 tests this gate added** (4 FENs × predicate and key level); suite **206 → 214 passed / 9 files / skip count 0**, lint / typecheck / build all **exit 0**, both changed modules **100%** coverage. **The Engineer's three load-bearing claims were each VERIFIED rather than accepted, and all three hold:** the two guards are load-bearing with **DISJOINT** failure sets (4 / 7 / 13 as reported, and 8 / 11 / 21 with intersection still EMPTY after this gate's strengthening); the correction that `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` is closed by **EITHER** guard alone and so kills neither single-guard mutant is **TRUE** and is now measured twice; and **“no existing test was modified” holds at LINE LEVEL, checked three ways** — 0 absent lines from 584defa, 0 from the branch tip (this gate's tests are pure appends and widened no import either), and from the branch point 4c6ed7d exactly 6 absent lines, **all six imports**, zero non-import lines gone across the whole branch; `src/zobrist.test.ts:33-37` is **byte-identical**, moved to 43-47 only. **PURITY WAS ATTACKED FROM OUTSIDE THE ENGINEER'S SWEEP: 187,328 inputs the delivered 665-input sweep does not reach** — random boards, **hand-corrupted off-board squares (the case the Engineer named as unverified)**, kingless and multi-king boards, extreme counters, and `epSquare` = `NaN` / `Infinity` / fractional / out-of-array including −256 and 256, which pass `isOnBoard` through two's complement — **0 impure, 0 throws**, against **1,383 impurities** from the same hunter on a guard-stripped control, so the instrument is non-vacuous. Reachable population re-derived a **sixth** independent time: **518,474 / 81,397 (15.70%) / 0 / 0 / 0 / 0**. **Two first-pass residuals are now CLOSED and should stop being carried:** the Z1+L11 combined mutant (green suite, stray pawn on off-board square 15) no longer reproduces — guard (b) rejects it even with guard (a) also deleted — and Z1 and Z4 are now **killed by `src/zobrist.nfr.test.ts`**, the test the Security/NFR gate wrote in response to that very handoff. **`NFR-005`'s cost bars were deliberately NOT re-measured — Security/NFR owns them and re-gates next**; two cost-shaped equivalent mutants are handed to it by name. **ONE CORRECTION TO THE ENGINEER, non-blocking:** its claim that guard (a) “may become deletable” if BA/PM fixes the `generateMoves` defect is **over-stated** — guard (a) is load-bearing for TWO classes and only one is that defect. **`ABC-009`, `ABC-010` and the `generateMoves` own-piece defect are carried, not fixed.** **No PR — this repo has no git remote.** Nothing was merged and nothing was deployed; a human holds both. Previously 2026-08-03 by the Software Engineer (task `ticket-to-pr-ABC-011`, subtask `engineer-abc011-fix-purity`, Workflow 04): **ABC-011 moved `In Development` → `In Review` on the SECOND dev pass** — In Development 1/3 → 0/3, In Review 0/3 → 1/3; **no limit approached, no override taken, no written reason owed.** The `In Development` exit is the one board move this role owns. **The MEDIUM purity defect the project owner declined to merge is CLOSED, and all six known reproductions with it** — QE's three, the fourth the second design hop found, and the two pure divergences where the shipped predicate was already byte-pure and only its answer was wrong. Each was reproduced independently against the shipped tree BEFORE any code was written. **The fix is the two guards as ruled, and EACH WAS PROVEN LOAD-BEARING BY DELETING IT: guard (a) deleted → exactly 4 named tests fail, guard (b) deleted → exactly 7, both deleted → 13 and the pass count falls to the pre-fix baseline of 193. THE TWO FAILURE SETS ARE DISJOINT** — neither guard subsumes the other, so the "looks equivalent" one-line simplification is now caught by a test rather than by a comment. Production delta is FOUR executable lines (`src/legal.ts` +32/−6, the rest comment) plus a doc-comment-only `src/zobrist.ts` (+5/−1); `zobristKey`'s condition and signature, `src/apply.ts`, `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are **byte-untouched**. Purity is asserted over the **full position state** — all 128 board bytes and all five scalars, never `toFen` — for **EVERY** ep-square value rather than only reachable ones. Suite **206 passed / 9 files / skip count 0** (was 193), lint / typecheck / build all **exit 0**, and **no existing test was modified: zero changed pre-existing lines in either test file**, not even a widened import. `NFR-005` re-derived by this role rather than inherited and **MET** (startpos 291.3 ns, kiwipete 313.6 ns; ≤ +0.41 ns amortized per node; 20–25x cheaper on the invalid class; zero on the no-ep path, structurally). `ABC-009`, `ABC-010` and the `generateMoves` own-piece-capture defect are **carried, not fixed**. **No PR — this repo has no git remote.** Nothing was merged and nothing was deployed. Previously 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`, Workflow 04): **ABC-011 moved `In Design` → `Ready for Dev` at the SECOND design hop** — the first ticket in this project's history to enter `In Design` twice. In Design 1/2 → 0/2, Ready for Dev 0/6 → 1/6; **no limit approached, no override taken, no written reason owed.** The `In Design` exit is the one board move this role owns. **No production code was changed at this hop**, and no acceptance criterion, reproduction FEN, `NFR-005` bar or `## Out of scope` line was re-opened or edited — the first `### ANSWERED` block stands unamended and a second, dated one sits beside it. **THE DEFINITION QUESTION IS RULED: purity is UNCONDITIONAL, the answer is DOMAIN-RESTRICTED, and the first is bought with a PRECONDITION rather than with a change to what the predicate means.** `hasLegalEnPassant` synthesises its probe `Move` instead of taking one from the generator, and `undoSpecial` (`apply.ts:106-110`) writes `move.captured` back unconditionally — so when the board never held that piece the “restore” is a creation, and permanent. Two conditions make the probe well-formed and both must be checked BEFORE `makeMove`: **(a)** the ep target is empty, **(b)** the square behind it holds exactly the enemy pawn the probe claims to take. **Rule 5 gains NO domain qualifier** — a query that damages its argument is broken whatever the argument means. **THE PART THAT COULD NOT BE DELEGATED: THEY ARE TWO GUARDS, NOT ONE.** Security/NFR's one-line sketch (`board[target] === EMPTY`) is neither sufficient nor the one that fixes the corruption. **(b) is the PURITY guard** — it closes all three of QE's reproductions **and a FOURTH nobody had**, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (an ep square on the wrong rank for the side to move, dropping a phantom BLACK pawn on a2), which **(a) does not catch** because a3 is empty. **(a) is the ANSWER guard and purity does not need it** — on `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its mirror the captured pawn IS present, make/unmake round-trips BYTE-EXACTLY, and the shipped predicate still answers `true` where the oracle answers `false`: **a PURE divergence, constructed at this hop, which no prior hop had.** “Corrupts” and “disagrees with the oracle” are two different failures that QE's three FENs conflate, and a fix aimed at either alone leaves the other live. **The oracle is not the authority off-domain, and that is FORCED rather than convenient:** `legalMoves(...).some(...)` stays the DEFINITION and the test oracle on positions whose ep square the board does not contradict — a domain containing everything `makeMove` can produce, hence everything reachable by play — but outside it the generator is **unsound**, measured not conceded: it corrupts identically on two of QE's three FENs, and on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` it offers a pawn **capturing onto the mover's own knight**. So the predicate is SPECIFIED off-domain instead — `false`, and it touches nothing. **THE CASTLING FOLLOW-ON IS RULED: CASTLING IS NOT THE SAME CASE.** `zobristKey` keeps hashing castling RIGHTS and must not be changed to hash availability. **Answered from the retained FIDE text, whose sha256 AND CURRENCY were both re-verified today rather than inherited** — a fresh fetch is byte-identical to the retained copy (`e0c8bee2…`), and FIDE's own handbook index still publishes exactly `E012014`/`E012017`/`E012018`/`E012023` with nothing after 2023 (`E012024`/`25`/`26` return the same soft-404 shell as a deliberately nonsensical chapter id — control run). Three reasons, ascending: **(i)** 9.2.3.1 is written in the CAPABILITY mood (*“could have been captured”*) and 9.2.3.2 in the ENTITLEMENT mood (*“had castling rights”*, *“forfeited these”*), and 9.2.3.2 carries a sentence with no counterpart in 9.2.3.1 — *“The castling rights are lost **only** after the king or rook is moved”* — whose “only” excludes transient blockers; present in all four editions, 2014–2023. **(ii) THE DETERMINACY ARGUMENT, verified against this codebase:** `addCastlingMoves` (`moves.ts:299-319`) reads exactly `castling`, `board` and the side to move, so two positions with the same placement and side to move can differ in castling legality **only** if their rights differ — precisely what was NOT true of en passant, where the ep square is an extra bit not determined by placement. Same Laws sentence, opposite consequence. **(iii)** The residual over-discrimination is real and REPRODUCED (startpos; a knight still on g1; the king in check; f1 attacked — identical legal-move sets, different keys) and it is the SAFE direction: a draw missed, never one invented. “Fixing” it would put `isSquareAttackedBy` on a component carried by **71.0%** of nodes against the 15.70% carrying an ep square. Also checked exhaustively: **368,344 nodes carry a castling right and ZERO are stale.** **`ADR-0005` IS RATIFIED — `accepted`, WITH AN AMENDMENT, and not as a rubber stamp:** one of its statements was FALSE as written (its Consequences described a predicate that “plays a move and takes it back”, which the shipped code does not do on that class). Clauses 1–5 accepted unchanged; **Decision clause 6 is NEW** (the precondition), decided-but-not-yet-built on the `ADR-0002`-clause-2 precedent; a scope bound was added because the ADR was read wider than it is. **`ADR-0006` is NEW and `accepted`** — the castling ruling, **separate** rather than a sixth clause, because it is a different decision from a differently-worded clause landing the opposite way, and because `ADR-0005` was ratified in the same session on gated evidence while this ruling has been through no gate. **Both ADRs now carry per-clause FALSIFIER TABLES**, each checkable without trusting the file; the honest counter-argument against `ADR-0006` existing at all is recorded in its own Status section. **RE-DERIVED, NOT INHERITED:** exhaustive walk of `src/perft.test.ts`'s table at its own `fast` depths on a FOURTH independently written script — **518,474 nodes / 81,397 with an ep square**, reproducing the design, dev and QE hops **to the number**; neither guard fires **once** on that population, the answer changes on **0** nodes and the key on **0**, so they are preconditions and not a behaviour change. The guarded shape against the repository's own suite in a sandbox: **193/193 green, 0 skipped, `tsc` exit 0, NO EXISTING TEST EDITED** — including `src/zobrist.nfr.test.ts`'s call-count and byte-identity assertions. The six specified tests were **each PROVEN to fail** rather than assumed to: 10 of 14 assertions fail against shipped, exactly **2** against guard-(a)-removed, exactly **6** against guard-(b)-removed; one boundary probe kills nothing and is named so rather than counted as coverage. **COST:** **zero** on the no-ep path and at both `NFR-005` anchors, structurally — the caller's short-circuit never enters the predicate; **+0.9 to +3.0 ns per call** on the 15.70% of nodes with an ep square, i.e. **≤ +0.5 ns amortized per node**, under 0.15% of a ~317 ns key; **20–27x cheaper** on the invalid class. Two whole-key runs bracket 1.0 from both sides, so the delta is below that instrument's resolution and no number is claimed from it. **No `NFR-005` bar and no catalog target moves**; Security/NFR re-gates. **Size stays `M`** — two conditions in the one function this ticket already changes, six test cases and two doc corrections, all smaller than the delta that took it `S` → `M`. **ONE ITEM IS ROUTED TO BA/PM RATHER THAN CUT HERE:** `generateMoves` offers an en-passant capture onto a square occupied by the **mover's own** piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, both verified) — a generator defect on the invalid-FEN class, a sibling of `ABC-009`; this fix makes the **hash** immune to it, it does not clean the generator. **`In Development` is deliberately NOT entered — that pull is the Orchestrator's.** Nothing was merged and nothing was deployed — a human holds both. Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, Workflow 04 step 6): **ABC-011 PASSED the risk/NFR gate** and moved `In Security/NFR` → `Ready for UAT`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. The `In Security/NFR` exit is the one board move this role owns. Nothing was merged and nothing was deployed — a human holds both. **Result PASS with three accepted risks, each carrying a named owner.** **NFR-005 was re-measured INDEPENDENTLY and nothing was accepted from the Engineer's or QE's figures** — own scripts, own `git archive` baseline of `4c6ed7d`, both trees in ONE process, 300k iterations per cell, interleaved forward and backward, two samples, on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): **startpos 297.2–298.4 ns against a ~450 ns bar and kiwipete 323.5–330.9 ns against a 432–459 ns bar — both MET with room**, worst-case per-call shape **1.385–1.400x**, under the 1.5x bar. **The spread this column was asked to adjudicate is resolved:** my worst-case figure lands BETWEEN the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x, so three runs agree the shape is real and comfortably inside the bar. **The no-ep sub-bar holds STRUCTURALLY, and wall clock is the wrong instrument for it** — on a no-ep node the `epSquare` guard short-circuits and the executed work is byte-for-byte the baseline's; re-spied with this gate's own counting shim through a `cmp`-verified copy of `zobrist.ts`: **277,955 nodes / 17,663 ep-set / 17,663 predicate calls / ZERO on the 260,292 no-ep nodes**, identical to the Engineer's counts to the node. **The gap both prior roles handed forward is PINNED, not waived: `src/zobrist.nfr.test.ts`**, in its own file on the ABC-020 precedent so the hoisted `vi.mock` factory re-routes nothing else. Four assertions, **each PROVEN to fail rather than assumed to** — they kill `Z1`, `Z4` and `L11`, the three mutants that survived a 189-test suite. This gate added a second L11 probe FEN of its own (`4K3/8/8/8/8/k7/p7/R7 b - - 0 1`), where the predicate still returns the CORRECT `false` and still dirties the board, so the byte-identity assertion is load-bearing and not redundant. **The off-board write is ruled a CORRECTNESS defect, NOT a memory-safety one, and the distinction was measured:** `board` is a `Uint8Array(128)` and index 15 is INSIDE the allocation — "off-board" is the 0x88 encoding's logical predicate, not a memory bound — and this runtime DISCARDS out-of-allocation typed-array writes outright (probed: `probe[-1]` and `probe[999]` read back `undefined`, length unchanged). It still earned a guard, because it breaks the invariant `kingSquareOf`'s whole-array `indexOf` scan explicitly leans on. **QE's new defect is ruled MEDIUM and does NOT block:** reproduced on all three FENs against the shipped tree and clean on the `4c6ed7d` baseline, so the property is genuinely new; reachability verified independently at the only two writes to `epSquare` in `src/` — `apply.ts:139` derives it as the double-push midpoint, so no position reachable by play can trigger it and the class is ABC-010's, which `## Out of scope` carries. **NO security finding at any severity and nothing at or near `security.block_on: high`.** The ASVS L1 tier is 70 requirements and most are not-applicable by absence of the surface they name (no auth, no session, no authz, no tokens, no web, no files, no TLS, no personal data); four rows are named rather than dismissed — V11.4.1 (hash choice: not a cryptographic use case, named because it is exactly what a scanner would false-positive on), V2.1.1/V2.2.1 (FEN semantic validation, partially met, pre-existing, ABC-010's), V15.1.1/V15.2.1 (no documented dependency-remediation policy; **severity OVERRIDDEN from the L1 default `high` to `low` with the reason stated** — zero runtime dependencies and this change adds none) and V13.4.1 (deferred to EPIC-006, not passed). Gates re-run with the new guard in place: **193 pass / 0 skipped** (was 189), lint, typecheck and build all exit 0. `ADR-0005` is still `proposed`; no agent may mark it `accepted` and this gate did not. Previously 2026-08-03 by QE/E2E (task `ticket-to-pr-ABC-011`, Workflow 04 step 5): **ABC-011 PASSED review** and moved `In Review` → `In Security/NFR`. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. The `In Review` exit is the one board move this role owns. Nothing was merged and nothing was deployed. **QE fixed no production code** — `src/legal.ts` and `src/zobrist.ts` are byte-identical to `98b07e7`; five tests were added plus one assertion line, all green, skip count still 0, suite **184 → 189**. **The verdict was reached by independent re-derivation and by breaking the delivered suite, not by re-running it: twenty-two mutations** (the ABC-020 gate ran thirteen, and this change is one condition inside a function `EPIC-004` will call per node). **Seventeen were killed; five survived, and two of the five were real.** **`L8` — `if (legal) return true;` → `return legal;` — gives up after the FIRST candidate capturer and survived a 184-test suite**; it is not equivalent: on `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` the lower-file capturer is pinned and the higher-file one is legal, so the mutant **over-collapses** two positions FIDE calls different — a false repetition, the OPPOSITE of the safe error direction this ticket's priority argument rests on. The property test cannot reach that shape: over an exhaustive **518,474-node** walk exactly **two** nodes have two pseudo-legal ep capturers at all and in neither is the lower-file one illegal, so the FEN had to be built. **`Z5` — the ep FILE is load-bearing in no test — survived, and re-running it against the pre-ABC-011 baseline (174/174 green) proves it PRE-EXISTING rather than introduced.** Both closed, plus a black mirror and a byte-purity walk. **The three remaining survivors are ONE gap and it is Security/NFR's — the Engineer's flag is UPHELD on evidence rather than deference:** `Z1`/`Z4`/`L11` are behaviour-**equivalent** (each leaves 189/189 green and changes no key on any input), so only cost moves and only on the majority path, which is `NFR-005`'s sub-bar verbatim; a spied call count is the instrument, exactly the `src/gameend.nfr.test.ts` shape this column wrote for `NFR-001`. **One fact neither prior hop had, handed forward: `Z1` and `L11` TOGETHER are still 189/189 green and make `zobristKey` write a stray piece onto off-board square 15**, breaking `src/position.ts`'s own stated invariant. **ONE NEW DEFECT found, named rather than fixed: since ABC-011, `zobristKey` PERMANENTLY corrupts a position whose ep square is semantically inconsistent** — three reproductions, e.g. `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black pawn on d5. Fair to the Engineer and checked before writing: on two of the three the predicate's own ruled ORACLE corrupts identically (pre-existing in `generateMoves` + `apply`), and "does not inherit `ABC-009`" is TRUE as stated and was independently verified on `ABC-009`'s own trigger FEN; what is new is the third FEN, where the oracle stays clean and the predicate does not, and that `zobristKey` was pure on every input before this ticket. Trigger class is semantically-invalid-FEN only — the class `ABC-009`/`ABC-010` already occupy and this ticket explicitly carries — and **277,949 reachable nodes are 0 impure**. Not fixed (QE does not change production code) and not pinned (a test asserting the current output would enshrine it); the property that IS true is now pinned instead. **Every load-bearing claim on the branch was checked and held:** no existing test modified (verified line-level — exactly three lines absent from each test file, all imports, zero non-import lines gone; `src/zobrist.test.ts:33-37`'s body byte-identical); AC4's property test non-vacuous in **both** halves in fact (557 double pushes, 52 answered, 505 not, 0 violations) though `checked > 0` did not pin the collapse half, closed with one declared added line; purity over the full position state at **277,949** reachable nodes, 0 impure, agreeing with the Engineer's spy to the six root positions; the module graph rebuilt a third time — **acyclic, depth 6, `zobrist` 2 → 5, `gameend` 5 → 6**; and the divergence table reproduced to the number (518,474 / 81,397 / 77,872 / 862 = 861+1 / **0**) with a new column, **zero** predicate-vs-oracle disagreements over all 81,397 ep-set nodes. The 174 baseline was re-run from a `git archive` extract of `4c6ed7d` rather than trusted. **The `memory-bank/30-architecture.md` module-table ordering is UPHELD as the Engineer left it** — it orders by conceptual layer, not DAG level, and reordering would be the unrequested refactor rule 9 forbids; one content imprecision in the `Hashing` row is named, not fixed. **`NFR-005`'s cost bars were deliberately NOT re-measured** — Security/NFR owns them next. Gates: **189 pass / 0 skipped**, lint, typecheck and build exit 0, both changed modules 100%. Five items are recorded as a `claim` at `confidence: UNKNOWN - verify`. `ADR-0005` is still `proposed` and no agent may mark it `accepted`. Previously 2026-08-03 by the Software Engineer (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 moved `In Development` → `In Review`, implemented on branch `grugops/ticket-to-pr-ABC-011` — the one board move this role owns.** In Development 1/3 → 0/3, In Review 0/3 → 1/3; **no limit approached, no override taken.** The diff is four files under `src/` (+265/−9) and two doc edits: `src/legal.ts` gains ONE new export (`hasLegalEnPassant`) and `src/zobrist.ts` changes ONE condition and gains ONE import; the rest is tests. `src/gameend.ts`, `src/apply.ts` and `src/moves.ts` are byte-untouched, `zobristKey`'s signature is unchanged and no state was added to `Position`. **The design hop's `### ANSWERED` block was built exactly as ratified and none of its six rules was traded away** — including the two the board flagged as traps rather than preferences: the predicate is NOT `legalMoves(...).some(...)` and it is NOT homed in `src/moves.ts`. **Rule 1's short-circuit is SPIED rather than asserted:** over a depth-3 walk of all six perft positions, 277,955 nodes hashed and 17,663 carrying an ep square, `hasLegalEnPassant` was called exactly 17,663 times — **ZERO calls on the 260,292 no-ep nodes**, so the majority path runs the instructions it ran before. **Every acceptance criterion is green**, and the two that were the point hold together: the repro pair now hashes **EQUAL** while both regression guards still hash **DIFFERENT**. **No existing test was modified** — three import lines were widened across the two test files and every other original line in both is byte-identical, verified by diffing each original line against the new file rather than by inspection; `src/zobrist.test.ts`'s en-passant fixture is untouched and still passes. **The design hop's numbers were re-derived independently, not quoted, and every one reproduced to the number:** an exhaustive walk of the perft table at `src/perft.test.ts`'s own `fast` depths gives 518,474 nodes / 81,397 with an ep square, and property violations against the FIDE ground truth of **77,872 for merged, 862 for the rejected board-only reading** (861 of them `position-3`, 1 `position-4`) **and ZERO for the shipped strict reading**; the module graph rebuilt from `src/*.ts` is still acyclic and still max depth 6, with `zobrist` 2 → 5 and `gameend` 5 → 6. **`NFR-005` measured, not inferred**, merged vs ABC-011 in the SAME process against a pre-change copy of `src/` outside the repo, 300k iterations per cell, interleaved, two independent samples, on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): **startpos 302.9–306.5 ns against a ~450 ns bar, kiwipete 309.1–315.6 ns against a 432–459 ns bar**, worst-case per-call shape **1.357–1.383x** (below the design hop's recorded 1.45–1.48x) and **0.9948–1.0218x amortized** over a 120,000-node pool at natural ep frequency. Gates: **184 passed / 0 skipped** (was 174), lint, typecheck and build all exit 0. **No PR exists and none was invented — this repo has no git remote**, so there is nowhere to push; the commits sit on the local branch. **`ABC-009` and `ABC-010` are carried, not fixed**, and the shipped predicate demonstrably does not inherit `ABC-009` — proved on its own trigger FEN. **One gap is flagged for the next gates rather than absorbed:** rule 1's short-circuit is held by construction and by an out-of-repo spy, by no test in the repo — the same gap the ABC-020 Security/NFR gate closed for `NFR-001`, and left to that gate on the same precedent rather than taken here as unsized scope. **`ADR-0005` is still `proposed`; no agent may mark it `accepted` and none did.** Nothing was merged and nothing was deployed. Previously 2026-08-02 by the Orchestrator (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 pulled `Ready for Dev` → `In Development` — the one board move this role owns on the way in.** Ready for Dev 1/6 → 0/6, In Development 0/3 → 1/3; **no limit approached, no override taken.** The Definition of Ready was re-checked AT the pull rather than assumed from the 2026-07-30 promotion or from the design hop, and `ADR-0005`'s `proposed` status was checked against `ABC-013`'s Blocked precedent rather than waved through — it does **not** block, because `ABC-011` itself assigns the design question to Architect/Design by name, so the ticket is the authority and the ADR is the record. **`ADR-0005` still wants a human's ratification as a standing item; no agent may mark it `accepted`.** **A P1 was pulled ahead of two P0s on a sequencing constraint the tickets state about each other, not on priority:** `ABC-011`'s escalation trigger and `ABC-012`'s own Dependencies section both say the key fix must land before the first consumer, or `ABC-012`'s repetition test is written to dodge the defect and stays permanently blind. One ticket pulled, not three. Previously the same day by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 moved `Ready` → `In Design` → `Ready for Dev` across one design hop, the reading of "an en-passant capture is available" that its own `### Open design question` assigns to this role being settled.** Ready 5/8 → 4/8, In Design 0/2 → 1/2 → 0/2, Ready for Dev 0/6 → 1/6; **no limit approached, no override taken, no written reason owed.** Second entry to and second exit from In Design in this project's history. **RULED: "available" means a LEGAL en-passant capture exists — the strict-FIDE reading**, on FIDE 9.2.3 as retrieved and retained by BA/PM under task `refinement-fide-9-6-1` ("the possible moves of all the pieces of both players are the same" / a pawn "could have been captured"), and on this ticket's own `## Scope`, which asks for the same key "**exactly** when FIDE calls them the same position". **The predicate is homed in `src/legal.ts` and `src/zobrist.ts` imports it** — the one file the ticket's `## Out of scope` design-hop escape hatch is exercised for. **Two premises of the ticket were measured rather than accepted, and both moved:** the strict reading does NOT cost `legalMoves`' ~5,300 ns (that is the price of the obvious implementation, which is rejected) — amortized over a 120,000-node pool at natural ep frequency it costs **1.014–1.022x** merged, **1.00–1.07x at `kiwipete`/startpos where the `NFR-005` bar is anchored**, worst case 1.45–1.48x on the 1.87% of nodes with an ep capture actually available (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere); and the DAG **stays acyclic and stays exactly as deep** (max depth 6) — only `zobrist`'s own level moves, 2 → 5, with `gameend` 5 → 6. **`legalMoves(...).some(...)` is disqualified twice over: 1.979x per node AND it inherits `ABC-009`, corrupting the position it hashes** (reproduced on `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` — a phantom white king on e1). Homing the predicate in `src/moves.ts` would create **this project's first dependency cycle** and is named on the ticket so nobody walks into it. The price is stated rather than buried: `zobristKey` stops being a pure read of the board. **`ADR-0002` is EXTENDED AROUND and NOT amended** — checked clause by clause against the ratified text, so **no human ruling is owed and none was taken**; the falsifier is recorded in one sentence. **`ADR-0005` was written and is `proposed`** — not on the amendment ground but because a recorded module-graph invariant becomes false; **no agent may mark it `accepted` and none did** (`ADR-0004`'s delegated ratification is explicitly not precedent and was not leaned on), and **ABC-011 is NOT blocked on it**. **Re-sized `S` → `M` and not split** — the ticket's own named re-size condition, fired verbatim; priority `P1` unchanged. **No production code was changed at this hop** and every measurement was driven read-only against merged `src/` from a scratchpad outside the repo. **In Development is deliberately NOT entered — that pull is the Orchestrator's.** Nothing was merged and nothing was deployed. Previously the same day by the Orchestrator (task `refinement-fide-9-6-1`, Workflow 07): **the one open question merged against ABC-020 — FIDE 9.6.1's "consecutive" wording — is CLOSED as CONFORMANT, so the second change to `src/gameend.ts` on `main` is NOT owed.** BA/PM ruled it against the Laws text it retrieved; the Orchestrator re-fetched independently before accepting and confirmed the word "consecutive" occurs **zero** times in the 2023 Laws — QE's remembered phrase was verbatim correct for the **2014** edition, which 2017 replaced. **No ticket cut, no column moved, no WIP limit approached, no override taken**, and the conditional Architect/Design hop is **cancelled rather than deferred**. See the Done comment below. Previously the same day: **ABC-020 MERGED to `main` and moved Ready for UAT → Done** — the `… → Done` exit this role owns. Three stacked branches landed in ONE fast-forward (d53ce31 → cb62c9f, 27 commits, no merge commit) because the chain was linear and nothing had diverged. Gate run BEFORE the merge on the tip and AGAIN AFTER it on main: **174/174 green, 0 skips**, lint + typecheck + build exit 0. **All nine branches in this repo are now contained in main** (`git branch --no-merged main` is empty); none was deleted, that being the owner's call — **superseded 2026-08-02: the owner made that call and all eight merged branches were deleted after per-branch validation, leaving `main` as the only branch; the tips are recorded in the Done comment and no commit was lost.** Ready for UAT 1/4 → 0/4. **The merge was performed by an agent on EXPLICIT human instruction and is NOT standing authorization** — same rule as ABC-001/002/003/008 and the ABC-004..007 stack. Merged with one open question against it: FIDE 9.6.1's "consecutive" wording (`UNKNOWN - verify`), which now costs a second change to `src/gameend.ts` on main rather than one on a branch. Previously 2026-08-01 by Security/NFR (task `ticket-to-pr-ABC-020`, Workflow 04 step 6): **ABC-020 PASSED the risk/NFR gate** and moved In Security/NFR → Ready for UAT. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. The In Security/NFR exit is the one board move this role owns. Nothing was merged and nothing was deployed. **No production code was changed at this gate.** **All three of NFR-001's leaf-cheapness bars were re-measured independently — nothing was accepted from the Engineer's report:** `legalMoves` **exactly 1** across sixteen call shapes, `zobristKey` **≤ 1** (1 when the counts map is consulted, **0** bare and 0 when a cheaper branch decides), and `gameStatus(startpos, emptyMap)` **2.13–2.26 µs** = **0.56x–0.60x of the 3.78 µs bar**, 0.98x–1.01x of the pre-ABC-020 tree in the same process (Apple M3 / Node v24.12.0 / darwin-arm64; `UNKNOWN - verify` elsewhere). **One correction, and it is to the BAR, not the code: the 3.78 µs figure is a start-position number and the catalog did not say so** — kiwipete measures 5.3 µs on the merged tree as well, so read as an absolute ceiling the bar indicts the baseline. `plans/nfr-catalog.md` now carries the position; no target moved. **QE's ordering suspicion is CONFIRMED and it generalises — this is the substantive result of the gate.** Moving the 150-ply check below the fivefold check kills no test, exactly as QE said; it does **not** break the bar as written (≤ 1 still holds), it costs one 281–293 ns key read on a position reachable at most once per game, and it is a durability gap rather than a bar failure. But two further mutations show **all three bars were held by nothing in the repo**: a second `legalMoves()` call and two `zobristKey` reads instead of the shared local **each left all 45 tests green**, and the doubled generation doubles the cost of EPIC-004's hottest call with a green suite. **Closed: `src/gameend.nfr.test.ts`** — three spied assertions, one per bar, in its own file so the hoisted `vi.mock` factory re-routes the module graph for nothing else, which dissolves the Engineer's stated objection rather than overruling it. One mutant fails one assertion each. The five-occurrences-AND-clock-150 tie stays **deliberately unpinned** as QE intended — the zero-key assertion uses a one-occurrence map, so it kills the reorder purely on cost and says nothing about which automatic rule wins. **No security finding at any severity and nothing at or near `security.block_on: high`**: the ASVS L1 tier is not-applicable by absence of the surface it names, and the two rows worth naming rather than dismissing (input validation, hash choice) both point at ABC-010/ABC-009/ABC-011, all carried and ticketed. Gates re-run with the guard in place: **174 pass / 0 skipped**, lint, typecheck, build exit 0, `src/gameend.ts` still 100%. **UAT is recorded as DEFERRED to EPIC-006, not passed** — the ABC-004..007 precedent, for the same reason: this ticket renders nothing and prompts for nothing, so there is no surface a human can exercise. Previously 2026-08-01 by QE/E2E (Workflow 04 step 5): **ABC-020 PASSED review** and moved In Review → In Security/NFR. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. The In Review exit is the one board move this role owns. Nothing was merged and nothing was deployed. **QE fixed no production code**; six tests were added, all green, skip count still 0, suite 165 → 171. The verdict was reached by independent re-derivation, not by re-running the author's suite: the G-1 line driven from its FEN and move list (Black makes the third occurrence, White holds the claim, `Re8#` still reachable, `{white-wins, checkmate}`), every clock and occurrence boundary swept in both directions and both colours, and **thirteen mutations run against the delivered suite** — the check the ABC-007 gate did not make. Nine were killed. **Four survived, every one an ordering above the clock, and the ticket asserts a guard for them that does not exist** (`## Out of scope` says "A6 pins it"; A6 pins checkmate against the CLOCK, a different pair). Each changes a reason and never a result, so product severity is LOW and gate severity is higher — QE closed all four with one added test. A9 was verified by name-set diff against `b1b96cd~1` plus a body diff, and holds exactly. **A5's epoch argument is ruled CORRECT**, with the arithmetic reproduced on both trees (117 / 167 / 150, and 150−133=17, 17+100=117); the wording that is wrong is QE's own G-3 sentence carried into A5's Given — the wall unfreezes after its first capture and resets the clock three times, so "within 150 plies" holds per irreversible-move epoch, which is what FIDE 9.6.2 bounds. A5's substance holds under all ten drives and is now pinned by two tests rather than by argument. ABC-009 and ABC-011 confirmed genuinely carried and confirmed load-bearing for no new test. Gates re-run by QE on this branch: 171 pass / 0 skipped / lint, typecheck, build all exit 0 / `src/gameend.ts` 100%. **A10's NFR bars were deliberately NOT re-measured** — Security/NFR owns them next. Three items could not be settled and are recorded as a `claim` with `confidence: UNKNOWN - verify`: FIDE 9.6.1's "consecutive" wording, `GameResult`'s dead-but-correctly-kept alias, and the reason chosen when two automatic rules coincide. Previously 2026-07-31 by the Software Engineer (task `ticket-to-pr-ABC-020`, Workflow 04): ABC-020 moved In Development → In Review, implemented on branch `grugops/ticket-to-pr-ABC-020`. In Development 1/3 → 0/3, In Review 0/3 → 1/3; no limit approached, no override taken. The diff is `src/gameend.ts` alone (+113/−66) plus its test file: the design hop's ratified two-arm union built exactly as written, `gameStatus`'s signature byte-identical, no new import, no new state on `Position`. A1–A10 green; **A9 held exactly — the four named tests whose expectations changed are the only tests whose names changed, the fifth gained the absence assertion the ticket asked for, and no sixth test moved.** A10 measured on Apple M3 / Node v24.12.0 / darwin-arm64 and spied rather than inferred: `legalMoves` 1 per call across ten call shapes, `zobristKey` ≤ 1 (0 when bare), cost 2.17–2.24 µs against a 3.78 µs bar; `UNKNOWN - verify` on other hardware. `ABC-009` and `ABC-011` carried not owned, the FIDE 5.2.2 gap declined as documentation only, the terminal-check order untouched. Human holds merge and deploy. Previously 2026-07-31 by Architect/Design: ABC-020 moved Ready → In Design → Ready for Dev across one design hop, the return-shape question its own `### Open design question` assigns being settled. Ready 6/8 → 5/8, In Design 0/2 → 1/2 → 0/2, Ready for Dev 0/6 → 1/6; no limit approached, no override taken. First entry to and first exit from In Design, and first occupant of Ready for Dev, in this project's history. The shape is a two-arm discriminated union on the `result` field GameStatus already has, with the claimable set optional and absent-when-empty on the in-progress arm; ADR-0002 clause 4 is ruled an EXTENSION and not an amendment, so no human ruling is owed, no ratified clause was touched and no ADR was written. In Development is deliberately NOT entered — that pull is the Orchestrator's. Previously 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`, task `epic-to-tickets-EPIC-002`). The project owner's standing priority of 2026-07-31 — "chess moves must be legal according to game rules, everything else comes after that" — re-sequenced this board. TWO TICKETS CUT: ABC-020 (FIDE 9.2/9.3 draws become claimable and FIDE 9.6 backstops land with them, M, P0, straight to Ready) and ABC-021 (the draw-claim interaction, S, P1, Backlog behind ABC-019). ONE PRIORITY CHANGED: ABC-009 P2 → P1, promoted Backlog → Ready. Everything else was re-read and DELIBERATELY LEFT — see the re-sequencing comment under Ready. Ready 4/8 → 6/8; no limit approached, no override taken. EPIC-002 is now 9 tickets / 25 points (was 8 / 23 — ABC-021 adds 2); ABC-020 sits under EPIC-001 with ABC-009 and ABC-011, so EPIC-001 now has three open tickets against merged, Done code. Previously 2026-07-31 by Architect/Design (ADR-0004 ratified — clauses 1 + 3 as proposed, clause 2 as amended; ABC-013 moved Blocked → Ready, Ready 3/8 → 4/8, no limit approached, no override taken. Blocked is now empty after one day, no escalation. The ratification was made by the Orchestrator under a named, quoted delegation from Olger Oeselg — the first ADR here not ratified by a human directly, and explicitly not precedent). Previously 2026-07-30 by BA/PM (EPIC-002 decomposed into ABC-012..ABC-019, 23 points; ABC-012 + ABC-014 promoted to Ready, ABC-013 to Blocked on ADR-0004's ratification, the rest held in Backlog behind their predecessors; ABC-011 escalated P2→P1 and promoted to Ready, its own trigger having fired. Ready 3/8, no limit approached, no override taken. Earlier the same day: ABC-011 cut to Backlog from the architecture audit `architecture-audit-2026-07-29`, on ADR-0002's recommendation. Previously 2026-07-29: ABC-009 + ABC-010 cut to Backlog from the same audit)_

<!--
  FORMAT — read before you move a ticket. (clear voice; this is a technical file, not a role prompt.)

  plans/board.md is grugops's SINGLE SOURCE OF WIP TRUTH. Every ticket sits in exactly one
  column. Each column has a definition (ENTRY MEANS), an EXIT OWNER (the role that signs off
  to move the ticket out), and a WIP limit (max tickets allowed in that column at once). The
  Orchestrator refuses to pull new work past a WIP limit without a written reason.

  WIP NUMBERS COME FROM CONFIG. The per-column limits shown in each heading are the lean
  DEFAULTS, sourced from `agent-factory/config/factory.config.json#wip_limits`. Edit the dial,
  not this file, to change a limit — then update the heading to match. The two must agree.
  In lean mode the In Security/NFR and Ready to Release columns may be skipped unless a
  trigger fires (the columns still exist; they just stay empty).

  HEADING FORMAT (spec §6.1): each column is an H2 heading carrying its live/limit WIP count,
  e.g. `## In Development (WIP 1/3)` — the left number is how many tickets are in the column
  now, the right number is the limit from config. Unlimited columns read `(WIP unlimited)`;
  Blocked is visible and time-tracked (no WIP limit) and reads `(visible, time-tracked)`.

  TICKET ROWS: this board ships EMPTY — column structure only, ZERO live ticket rows. It is a
  clean append target. Roles append a one-line ticket row under the matching column as work
  moves, e.g. (this is a comment, NOT a live row — the generic `ABC-` prefix shows format only):

    ## In Development (WIP 1/3)
    - [ABC-014] Asset allocation chart  (owner: Software Engineer, since: 2026-06-01)

    ## In Review (WIP 1/3)
    - [ABC-012] Portfolio FX conversion  (PR: #41, QE: running)

  BOARD <-> TICKET CONTRACT: each ticket file (`plans/tickets/<prefix>-xxx.md`) carries a
  status line in its front matter so the board column and the ticket never disagree (spec §6.1).
  The shape (example only, NOT a live ticket):

    status: in-development
    column: In Development
    size: M
    priority: P2
    epic: EPIC-003
    feature: FEAT-007

  A ticket's `column:` value MUST equal the board column it sits under, and `status:` is the
  kebab-case form of that column. The validator can check the two for drift.

  CADENCE: this board ships the Kanban columns (the default cadence, `cadence=kanban`). The
  scrum overlay (sprint goal / committed backlog / burndown) lives in `plans/sprints/SPRINT-xx.md`
  and is NOT pre-rendered here. The sizing, priority, and Blocked conventions below are shared
  by BOTH cadences.
-->

## Columns (spec §6.1)

The 13 columns in flow order, each with what entry means, who owns the exit, and the WIP
limit (default from `factory.config.json#wip_limits`):

| Column | Entry means | Exit owner | WIP (default) |
|--------|-------------|-----------|---------------|
| Backlog | idea captured | BA/PM | unlimited |
| Ready | Definition of Ready met | BA/PM | 8 |
| In Analysis | behavior being mapped | System Analyst | 2 |
| In Design | structure/ADR being decided | Architect/Design | 2 |
| Ready for Dev | handoffs complete, ticket sized | Orchestrator | 6 |
| In Development | code being written | Software Engineer | 3 (== max parallel tickets) |
| In Review | PR + QE running | QE/E2E | 3 |
| In Security/NFR | risk/compliance gate | Security/NFR | 2 |
| Ready for UAT | gates passed | UAT Planner | 4 |
| In UAT | business acceptance | UAT Planner | 4 |
| Ready to Release | UAT signed off | Release Manager | 4 |
| Done | merged + released (or merged, lean) | Orchestrator | unlimited |
| Blocked | waiting on a dependency/decision | (raiser) | visible, time-tracked |

WIP limits come from config (`wip_limits`); the numbers above are the lean defaults.

## Backlog (WIP unlimited)

- [EPIC-002] Terminal board and game loop  (owner: BA/PM, size: XL, priority: P0, since: 2026-07-22, decomposed: ABC-012..ABC-019 + ABC-021)
- [EPIC-003] Move input and controls  (owner: BA/PM, size: M, priority: P0, since: 2026-07-22)
- [EPIC-004] Engine and AI opponent  (owner: BA/PM, size: L, priority: P0, since: 2026-07-22)
- [EPIC-005] Opening book  (owner: BA/PM, size: S, priority: P1, since: 2026-07-22)
- [EPIC-006] Game session and packaging  (owner: BA/PM, size: M, priority: P2, since: 2026-07-22)
- [ABC-010] FEN semantic validation  (owner: BA/PM, size: M, priority: P1, epic: EPIC-003, since: 2026-07-29)
- [ABC-016] Status panel  (size: M, P1, epic: EPIC-002, blocked-until: ABC-013, ABC-014, ABC-020)
- [ABC-017] Bounded move-history pane — two-column SAN  (size: S, P2, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-019] Turn loop skeleton  (size: L, P0, epic: EPIC-002, blocked-until: ABC-012, ABC-014, ABC-018; merge-order: after ABC-020)
- [ABC-021] Draw-claim interaction — the player having the move claims  (size: S, P1, epic: EPIC-002, blocked-until: ABC-020, ABC-019, since: 2026-07-31)

<!--
  AMENDED 2026-07-31: a NINTH EPIC-002 ticket, ABC-021 (draw-claim interaction, S, 2 points), was cut
  under the owner's legality-first directive, taking this epic to 9 tickets / 25 points. The largest
  is still L, so there is still no SPLIT_REQUIRED and the epic's XL size is unchanged. ABC-020 was
  cut in the same step but belongs to EPIC-001, not here — it changes src/gameend.ts, which is the
  rules core. See the re-sequencing comment under Ready.

  EPIC-002 DECOMPOSED 2026-07-30 by BA/PM (task `epic-to-tickets-EPIC-002`, Workflow 03) into
  ABC-012..ABC-019 — 8 tickets, 23 points. Epic size corrected M -> XL in-file with the reason,
  exactly as EPIC-001 recorded its own L -> XL correction; the no-XL rule binds TICKETS, and the
  largest here is L, so there is NO SPLIT_REQUIRED. The epic ROW STAYS IN BACKLOG carrying a
  `decomposed:` annotation — that is precisely what EPIC-001 did on 2026-07-22, and it left Backlog
  only on 2026-07-24 when all seven of its tickets were merged. An epic row is a container; it exits
  Backlog for Done when its tickets are Done. The Backlog exit BA/PM actually owns and has taken
  today is the TICKET-level one: Backlog -> Ready for ABC-012, ABC-014 and ABC-011.

  ABC-015..ABC-019 meet the Definition of Ready in full. They are held in Backlog because each has
  an unbuilt PREDECESSOR TICKET, not because anything about them is unresolved — they are NOT
  Blocked-column blocked, and BA/PM promotes each as its `blocked-until` list clears. Same pattern
  ABC-004..007 used.

  CORRECTED 2026-08-08 by BA/PM at ABC-015's promotion: "meet the Definition of Ready IN FULL" was
  NOT true of ABC-015 — two acceptance defects were found at the Backlog exit and fixed before it
  moved (an input tuple with no stated output; a criterion no implementation could fail). The
  sentence is left standing because it records what was believed on 2026-07-30; read it as the
  decomposition's claim, not as a current verdict. ABC-016..ABC-019 were NOT re-checked here — this
  subtask promoted one ticket and does not vouch for the other four.

  Two of this epic's four acceptance criteria were AMENDED before these tickets were cut, because
  wave 1 established they could not be met as written and an untestable criterion fails the
  Definition of Ready for every ticket beneath it. Both amendments are recorded in place in
  plans/epics/EPIC-002-terminal-board-and-game-loop.md with what changed and whether a promise was
  reduced (it was, twice, and both are marked REDUCED rather than softened quietly).
-->
<!--
  ABC-011 cut 2026-07-30 by BA/PM from the same architecture audit, on the recommendation in
  ADR-0002's `Out of scope … en-passant hashing defect` section — a third correctness defect in
  merged, Done, 100%-covered code (`src/zobrist.ts:71` hashes the en-passant file whenever
  `epSquare` is set, not only when an ep capture is available, so FIDE-identical positions hash
  differently and threefold repetition under-detects). ADR-0002 recommended it and did not cut it;
  ticketing is BA/PM's. `S` / `P2` is BA/PM's own call, agreeing with the ADR: latent (no consumer
  of the key list exists yet — `gameStatus`'s `positionCounts` has no supplier anywhere in `src/`)
  and the error direction is safe (a legitimate draw is missed, never a false draw declared).
  Ratification of ADR-0002 clause 2 widened its blast radius to four epics without moving its
  severity or reachability, so it carries a sequencing escalation trigger rather than a higher
  priority. INDEPENDENT of ABC-009 and ABC-010 — different module, and unlike those two nothing
  makes this one unreachable. Not promoted to Ready; that gate is a separate step.

  ABC-009 and ABC-010 cut 2026-07-29 by BA/PM from the architecture audit
  (task `architecture-audit-2026-07-29`) — two correctness defects found in merged, Done,
  100%-covered code. Both are LATENT today (`parseFen` has no user-facing caller) and go live
  when EPIC-003 accepts a FEN from a user, which is why ABC-010 (the boundary) is P1 and
  ABC-009 (the invariant behind it) is P2 with a stated escalation trigger. They are
  independent of each other by design; neither is promoted to Ready — the Definition of Ready
  gate is a separate step.

  EPIC-001 left Backlog 2026-07-24 — decomposed into ABC-001..ABC-007 (+ the ABC-008 spike),
  all merged and Done; it now sits in the Done column below. EPIC-002..006 remain
  decomposed-later epics above: each still needs `epic-to-tickets` (Workflow 03) before any
  ticket can be pulled. Nothing is Ready right now — that is the next planning step, not an
  oversight.
-->

## Ready (WIP 2/8)

- [ABC-013] SAN rendering — src/san.ts with toSan only  (size: M, P1, epic: EPIC-002, deps: ABC-003 + ABC-005, both merged on main; unblocked 2026-07-31 when ADR-0004 was ratified)
- [ABC-022] generateMoves offers en-passant captures its own preconditions forbid  (size: S, P1, epic: EPIC-001, deps: none; cut 2026-08-04 by BA/PM, straight to Ready)

<!--
  ABC-018 ENTERED AND LEFT THIS COLUMN ON 2026-08-09 — promoted here by BA/PM and pulled to
  In Development by the Orchestrator the same day, so its row now sits below. Ready 3/8 -> 4/8
  -> 3/8, the same shape ABC-015 traced on 2026-08-08. ABC-009, ABC-013 and ABC-022 stay, unmoved
  and unchanged.

  ABC-009 AND ABC-022 HAVE NOW BEEN DISPLACED TWICE. Both are P1 rules-core defects, in Ready since
  2026-07-31 and 2026-08-04, and this is the SECOND consecutive owner pull-order call putting
  renderer work in front of them (ABC-015 was the first). The owner may re-order their own queue and
  this is not an argument against it — it is recorded so the pattern is visible on the board rather
  than re-derived later. NEITHER is cancelled, re-sized or de-prioritised.
-->

<!--
  ABC-009 LEFT THIS COLUMN 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04)
  — pulled to In Development on the owner's direct request ("implement ABC-009"). Ready 3/8 -> 2/8;
  its row now sits under In Development. THE DISPLACEMENT PATTERN RECORDED ABOVE IS BROKEN, not
  continued: the third consecutive call went TO the rules-core defect, not past it. ABC-013 and
  ABC-022 stay, unmoved and unchanged; ABC-022 is now the one displaced P1 and its own escalation
  trigger is still unspent.

  IT WAS NOT PULLED AS IT STOOD, and the delay was the FACTORY'S, not the owner's. The Definition of
  Ready's "acceptance criteria clear, testable and measurable" row FAILED at this pull. The ticket's
  own DoR block ticked it green on 2026-07-31 and nothing re-checked it for nine days; the
  Orchestrator's pre-check left it AMBER with four named specifics; BA/PM re-derived and found SEVEN,
  THREE of which no pre-check named. The ticket was corrected IN PLACE inside Ready first (no board
  move, Ready stayed 3/8 throughout that hop) and the pull is of the corrected ticket. Six acceptance
  criteria became ten, original order preserved.

  THE BLOCKING DEFECT, STATED PLAINLY BECAUSE IT IS THE SECOND TIME THIS BOARD HAS SEEN IT: a
  100%-passing acceptance set did not require fixing the harm the ticket's own P1 escalation was
  written about. `## Scope` named two castling preconditions — king home, rook home — and only the
  rook half was tested. Measured on a mutant, not argued: a fix implementing the rook precondition
  ALONE passed all six original criteria, the suite 304/304 with skip count 0, and deep perft 32/32,
  while `legalMoves` still offered an illegal FLAG_CASTLE and still wrote a phantom king on four
  FENs. Delete the king precondition from a correct fix and NOT ONE criterion failed.

  THE THREE-WAY CROSS-CHECK IS ON THE RECORD. BA/PM established the corrected numbers on seven
  candidate builds patched into a COPY of main's src/ outside the repo. The Orchestrator then
  re-derived all fifteen post-fix counts (A1 3, A2 3, A3 5, A4 16x4, A5 19/17/13/19, A6 12/7/12/5)
  on an INDEPENDENTLY WRITTEN fix, plus all twelve "today" parentheticals and all four three-call
  signatures on unpatched main — every one matched, and the suite baseline read 304/304 as claimed.
  Two independently written fixes agreeing on fifteen counts is why this ticket is being pulled on a
  PASS rather than a second amber. NO src/ FILE WAS MODIFIED BY EITHER ROLE: git diff --stat main --
  src/ is empty and src/moves.ts still hashes fb4fa40934e768dffeaeed0b43548842.
-->


<!--
  ENTERED 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-018`, subtask `bapm-abc018-promote`,
  Workflow 07) — the `Backlog -> Ready` exit this role owns. Ready 3/8 -> 4/8, Backlog loses one
  row. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for the count.

  BOTH CONSTRAINTS ON THE BACKLOG ROW ARE DISCHARGED, verified at the source rather than read off a
  close-out note or off the Orchestrator's pre-check: ABC-014 is in Done and `git show
  main:src/render.ts` returns the merged 150-line module with `renderBoard` in it; ABC-015 merged
  (f1743a3 -> f4d5d31) and is in Done, so RISK-005's merge-order constraint ("ABC-015 merges with or
  before ABC-018") is SATISFIED BEFORE THIS TICKET STARTS and cannot be violated by it. What survives
  it is a BUILD obligation, not a sequencing one, and it is on the ticket: the writer takes the glyph
  mode as an argument from ABC-015's selection function and must not default, hardcode or re-derive
  it. The Blocked column is empty.

  IT WAS NOT PROMOTED AS IT STOOD. The Definition of Ready's "acceptance criteria clear, testable and
  measurable" check FAILED. The ticket's own DoR block ticked that row green on 2026-07-30 and
  nothing re-checked it until today; the Orchestrator's pre-check left it AMBER with three named
  specifics. FIVE defects were fixed IN PLACE first — the three flagged, plus TWO NAMED BY NO
  PRE-CHECK — and the promotion is of the corrected ticket:

    1) `(+N more)` HAD NO DEFINED N (flagged item 1, AGREED and worse than described). "As many
       candidates as fit" needs a width; `git grep -E "columns|COLUMNS|width"` over non-test src/ on
       merged main returns ZERO, and in append mode there is no width at all. Carried one step
       further: six 4-character SANs (29 chars) FIT a 2-row region (36 chars at W=18), so a correct
       implementation shows all six, emits NO marker and FAILS the criterion as written, while a
       one-per-row implementation answers N=5. RULED: one session-constant frame width W; the region
       takes a LIST of items placed whole or not at all; N is the count of supplied items not shown
       in full. Split into a fits case and a does-not-fit case. Packing stays the engineer's.

    2) A FRAME ROW NO TICKET OWNED (flagged item 2 — substance agreed, DIAGNOSIS CORRECTED). 23 is
       NOT unsourced: it is EPIC-002 4a's reference layout, 9+3+8+2+1 PROMPT = 23. This ticket's
       Scope assembled four of those five regions and sums to 22. Grepped across ABC-014/016/017/019/
       021 and EPIC-003: NO ticket owned the prompt row, and ABC-016 records that ABC-018 owns "all
       writing". The row the player types into was inside the epic's frame, outside this ticket's,
       and owned by nobody — so "at least as many rows as the frame" was short by one and the first
       keystroke scrolls the frame origin off the top, which is the exact failure 4b names. RULED:
       the frame RESERVES a 1-row prompt row inside H; the in-place write leaves the cursor at its
       start with no trailing newline; EPIC-003 keeps the prompt surface. The alternative (frame
       stays 22, in-place needs R >= H+1) is recorded with its reason for rejection: it would amend
       the EPIC's rule to fix this TICKET's omission.

    3) THE EQUALITY BOUNDARY WAS UNTESTED (flagged item 3, AGREED). 24/23 and 10/23 were covered;
       23/23 was not. Added, asserted on the screen model. Kills TWO mutants: `>` where the rule says
       `>=`, and a trailing newline after the frame's last row.

    4) THE NFR-002 BAR WAS AMBIGUOUS BY 2x (NO PRE-CHECK NAMED THIS). "Each total is < 16 ms" reads
       as each HALF < 16 ms and passes a 31 ms frame against a 16 ms bar, contradicting this ticket's
       own Security/NFR section and plans/traceability.md's ABC-018 row, which both say
       "compute + write < 16 ms". Rewritten to the SUM. NO TARGET MOVED — the 16 ms is EPIC-002's.

    5) A CRITERION THAT COULD NOT FAIL (NO PRE-CHECK NAMED THIS) — the ABC-015 defect-2 shape again.
       "When `process.stdout.isTTY` changes afterwards, the strategy in use is unchanged" names an
       ambient global the captured-sink design this ticket's own Test notes MANDATE never reads, so
       it passes for every implementation including one that re-decides on every write. Restated
       against the injected sink, which kills that mutant — and unlike ABC-015 the mutant is live
       here, because the signals sit on a stateful object the writer holds.

  ONE COLLISION CLOSED WHILE THERE, folded into the Security bar rather than counted as a sixth:
  acceptance 2a asserts ZERO code points above U+007F over the WHOLE stream in ASCII mode while the
  sanitizer removed only C0 and U+007F, so a player typing `é` made two of this ticket's own criteria
  contradict each other. RULED: in ASCII mode the sanitizer removes above-U+007F from supplied
  strings too; in Unicode mode they survive.

  SIZE, PRIORITY, SCOPE BOUNDARY, OUT-OF-SCOPE LIST, DEPENDENCIES AND THE SECURITY DISPOSITION ARE
  UNCHANGED — S (2), P0. EPIC-002 was NOT edited (the corrections match the epic's own layout;
  nothing there had to change), and ABC-016/ABC-017/ABC-019 were NOT re-checked here — this subtask
  promoted ONE ticket and does not vouch for the other three.
-->

<!--
  ABC-015 ENTERED AND LEFT THIS COLUMN ON 2026-08-08 — promoted here by BA/PM and pulled to
  In Development by the Orchestrator the same day, so its row now sits below. Ready 3/8 -> 4/8
  -> 3/8. ABC-009 and ABC-022 stay, unmoved and unchanged: the owner's in-session pull-order call
  put ABC-015 in front of them, which is the owner's to make, and it de-prioritises neither.
-->


<!--
  ENTERED 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-promote`,
  Workflow 07) — the `Backlog -> Ready` exit this role owns. Ready 3/8 -> 4/8, Backlog loses one
  row. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for the count.

  THE ONE CHECK ABC-015 FAILED ON 2026-08-04 NOW PASSES, and it was verified at the SOURCE rather
  than read off ABC-014's close-out note or off the Orchestrator's pre-check: `git show
  main:src/render.ts` carries `export type GlyphMode = "unicode" | "ascii";` at line 61, ABC-014 is
  in Done (merged ed42d26 -> c1d694f), and the Blocked column is empty. The board's own Ready test
  — "no unbuilt dependency" — holds.

  IT WAS NOT PROMOTED AS IT STOOD. The Definition of Ready's "acceptance testable and measurable"
  check FAILED on two counts, both of which the Orchestrator's pre-check table ticked green. Both
  were fixed IN PLACE in the ticket first, and the promotion is of the corrected ticket:

    1) AN INPUT TUPLE WITH NO STATED OUTPUT. `--ascii` and `--unicode` arrive as TWO INDEPENDENT
       BOOLEANS (argv is EPIC-006's), so (true, true) is constructible and table rows 1 and 2 both
       match it. The ticket called the flags "mutually exclusive" and handed the rejection to
       EPIC-006, which is UNDECOMPOSED and merges LATER — so no merged code holds that precondition
       when this function gets its first caller. RULED: rows are evaluated in order, row 1 wins,
       the answer is ASCII, and the function neither throws nor prints. Costs zero code and keeps
       the conflict-rejection policy in exactly one place.

    2) AN UNFALSIFIABLE CRITERION. The old ninth criterion ("the mode already handed to the renderer
       is unchanged ... made once and cached") could not fail any implementation this ticket's scope
       permits: with the signals injected as arguments — which the ticket's own test notes REQUIRE —
       it asserts that a `const` does not mutate. Its one failing form is the module-level accessor
       the test notes forbid. THIS IS THE SHAPE QE FOUND IN ABC-014 ("not the white frame with its
       rows simply reversed"), caught this time BEFORE an engineer writes against it. Replaced by
       two criteria a named mutant kills.

  AN OWNERSHIP SEAM WAS CLOSED WHILE THERE. Epic acceptance 2b requires the mode to be "decided
  exactly once, before the first frame". ABC-015's Scope handed startup to EPIC-006; ABC-018's
  Dependencies (lines 110-112) say "ABC-015 owns that rule and runs it once at startup". Both
  pointed away, so NO ticket owned the once-ness and no ticket could test it. Ruled to ABC-015, the
  ticket with the rule in it. ABC-018 AND EPIC-006 WERE NOT EDITED — nothing in either had to
  change, and this subtask touched no other ticket.

  WHERE THE CACHE LIVES IS NOT DECIDED HERE. That is structure and it is the engineer's; what is
  required is the observable outcome. SIZE S (2), PRIORITY P1, SCOPE, RISK-005's mitigation and the
  merge-with-or-before-ABC-018 constraint are ALL UNCHANGED and were re-checked, not assumed.

  ONE ROW OF THE ORCHESTRATOR'S PRE-CHECK IS CORRECTED, and it came from the ticket's own DoR line:
  "nine enumerated input tuples" was EIGHT tuples plus one session property. Same shape as the
  "7 perft FENs that were 6" correction of 2026-08-06. After the corrections it is nine tuples plus
  two session criteria, and the ticket now says so.

  THIS IS NOT THE PULL GATE. The Definition of Ready is applied again by the Orchestrator at
  Ready -> In Development (Workflow 04 step 1). Promotion makes ABC-015 pullable, nothing more, and
  the pull order it displaces (ABC-009 and ABC-022, both P1, both still in Ready) is the owner's
  call recorded in the Orchestrator's routing note — NOT re-opened here.

  NOTHING WAS IMPLEMENTED, src/ WAS NOT TOUCHED, NOTHING MERGED AND NOTHING DEPLOYED. Full reasoning
  is in the promotion notes, not summarised here:
  .grugops/context/ticket-to-pr-ABC-015/notes/
-->
<!--
  EMPTIED OF ABC-014 ON 2026-08-06 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04) —
  the `Ready → In Development` pull this role owns. Ready 4/8 → 3/8, In Development 0/3 → 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed.

  ABC-014 is item 2 of BA/PM's 2026-08-04 pull order and item 1 (ABC-012) is MERGED and Done, so
  this pull takes the order's next item and nothing else. THE ORDER IS NOT RE-OPENED.

  THE TWO PRIOR DECLINES ARE SPENT, NOT OVERTURNED. This role declined ABC-014 on 2026-08-02 and
  again on 2026-08-03 against the ABC-015 / RISK-005 contradiction. BA/PM untied that knot on
  2026-08-04 in four files; the constraint now binds at ABC-018, not here. Re-checked at the pull
  rather than taken on trust: ABC-014's Dependencies, ABC-015's, ABC-018's and EPIC-002's RISK-005
  entry all now name ABC-018, and no two of them disagree. Chain ABC-014 → ABC-015 → ABC-018 is
  acyclic.

  NO DESIGN HOP AND NO UI HOP — In Design stays 0/2, and this is a judgment, not an omission.
  The three cross-ticket contracts this renderer would need a design hop to settle are already
  settled in writing: shading is BY CHARACTER (EPIC-002 scope amendment [A4]), the glyph mode is a
  PARAMETER this module does not choose (amendment [A1] / acceptance 2b, whose selection table is
  ABC-015's), and the frame is a VALUE with constant geometry (acceptance 4a, which states in its
  own words that "the exact split is the engineer's"). Frontend/UI was considered and declined: its
  output is a UI contract — tokens, component inventory, five states, a11y bar — and every one of
  those questions is either already answered above or does not exist for a function that returns an
  array of strings. Inventing a hop to re-state settled decisions is waste, not caution. The trigger
  that WOULD earn a Frontend/UI hop is named so it is not missed: ABC-018, where the board, status
  panel, history pane and message region compose into one frame under acceptance 4a/4b/4c.

  PREMISES RE-VERIFIED AGAINST MERGED `main` (ed42d26) AT THE PULL, not read off the ticket:
  src/render.ts does not exist; fileOf, rankOf, squareAt, pieceType, isBlack and Position are all
  exported from merged src/position.ts; the standing perft FEN table the geometry criterion is
  written over is in src/perft.test.ts (7 FENs). NO UNBUILT DEPENDENCY.

  ONE TICKET, NOT THREE, against a limit of 3 — the same reasoning recorded for ABC-020, ABC-011 and
  ABC-012. ABC-009, ABC-013 and ABC-022 are all pullable; a second concurrent ticket buys throughput
  this project has no way to spend and costs review attention it does. Width for this task is 1
  regardless: ticket-to-pr is a chain (engineer → QE → Security/NFR), each stage reading what the
  last one published.

  NOTHING WAS MERGED AND NOTHING WAS DEPLOYED. Full reasoning, the Definition-of-Ready re-check and
  what this pull does NOT authorize are in the pull decision note, not summarised here:
  .grugops/context/ticket-to-pr-ABC-014/notes/20260806T090000Z-orchestrator-decision-3b7c1d24.md

  ---
  ENTERED 2026-08-04 by BA/PM (task `refinement-2026-08-04`, subtask
  `ba-pm-generator-defect-and-abc014-knot`, Workflow 07) — the `Backlog -> Ready` exit this role
  owns. Two items were routed here by the Orchestrator; both are closed. Ready 4/8 -> 5/8.
  NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed for the count.

  ITEM 1 — ABC-022 CUT (S, P1, EPIC-001, straight to Ready). `generateMoves` offers en-passant
  captures its own stated preconditions forbid. Routed to BA/PM by THREE roles across ABC-011 and
  cut by none; it is now owned.

  REPRODUCED BY BA/PM BEFORE CUTTING, on a script that copied none of theirs. What the three prior
  descriptions said holds. THREE THINGS THEY DID NOT SAY, each of which changed the ticket:

  a) THE SHAPE IS PIECE-AGNOSTIC. Both FENs on record put a KNIGHT on the ep target. A ROOK
     reproduces identically (`4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1`) — line 177 reads only the
     occupant's COLOUR. An acceptance criterion naming the two recorded FENs would have been
     satisfiable by a knight-shaped fix. AC A1 is written over the class instead.
  b) THERE ARE TWO DEFECTS IN THAT BRANCH, NOT ONE, AND THE UNROUTED ONE IS WORSE. The routed half
     (a) — no empty-target check — is pure and gives a wrong answer. Half (b) — no check that the
     captured pawn EXISTS — makes `legalMoves` PERMANENTLY CORRUPT the position it is handed
     (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` gains a phantom black pawn on a2). That is ABC-009's
     symptom by the en-passant route. Both are the same four lines, so they are ONE ticket; splitting
     them would give two tickets editing the same `if`.
  c) ONE TRAP IN THE ROUTING NOTE IS HALF WRONG, AND CORRECTING IT STRENGTHENS THE CONCLUSION. The
     note says perft cannot clear this because the legality filter later rejects the over-offered
     move. MEASURED: THE FILTER DOES NOT REJECT IT — `legalMoves` returns it on both reproductions.
     Perft is silent because the TRIGGER POPULATION IS EMPTY: 0 of 518,474 reachable nodes carry an
     occupied ep target. So no perft depth and no added perft position can EVER reach this defect,
     which is why the ticket's test notes forbid adding one. Conclusion unchanged and stronger:
     32/32 exact does not clear this class.

  THE OTHER TRAP IS CONFIRMED AND STRENGTHENED. ABC-011's guard (a) is NOT a deletable workaround.
  QE's correction to the Engineer was that it covers two classes and only one is this defect.
  Re-derived here by DELETING guard (a): the predicate answers `true` on BOTH classes, including the
  own-piece one. `hasLegalEnPassant` SYNTHESISES its probe move and never consults `generateMoves`,
  so guard (a) is a precondition of the PREDICATE, not compensation for the generator. Fixing
  ABC-022 changes neither row. "Deletable" is not over-stated, it is FALSE. The ticket carries QE's
  correction rather than the Engineer's original framing, as instructed, and goes past it.

  PRIORITY P1, NOT P0 — and this is the ranking the Orchestrator's note left open, answered rather
  than dodged. Applying THIS BOARD'S OWN P0 test, written here on 2026-07-31 under the owner's
  legality-first directive and never overturned: "P0 means the owner's directive applies AND the
  fault is reachable". The directive applies — it is a move-legality defect in the query that defines
  legal moves. It is NOT reachable — 0 of 518,474 nodes, invalid FEN only, and EPIC-003 is
  undecomposed. ABC-009 is the identical shape and was ruled P1 on this same test on the same day;
  ruling ABC-022 P0 would rank it ABOVE ABC-009, which is not defensible (ABC-009 is reached by
  `gameStatus` on its first line, every ply — a strictly wider surface).

  SO ABC-022 DOES NOT GO AHEAD OF ABC-012. Said plainly because the routing note made that the open
  question and "no" is the honest answer. An escalation trigger is on the ticket: it rises to P0 if
  EPIC-003 accepts an outside position, if ABC-010 is deferred/descoped, or if any position reachable
  by legal play is shown to carry an occupied ep target.

  ITEM 2 — THE ABC-015 / ABC-014 / RISK-005 KNOT IS UNTIED, and ABC-014 IS PULLABLE.

  THE CONTRADICTION: ABC-015 said it "merges with or before ABC-014 reaches Done, never after", while
  needing ABC-014 first (ABC-014 declares the `GlyphMode` type it returns) and sitting
  `blocked-until: ABC-014`. In this project Done MEANS MERGED (mode=lean), so that required ABC-015
  to merge no later than the ticket it cannot be written without. Jointly satisfiable only if both
  merge in one act — i.e. only if they are one ticket, which ABC-014's own size rationale rejects
  ("folding all three gives an 8-point XL and an automatic SPLIT_REQUIRED").

  WHICH DOCUMENT WAS WRONG: ABC-015's. ABC-014's Dependencies already said the right thing —
  "with or before this ticket's FIRST USER-VISIBLE USE" — and ABC-015 mis-copied it as ABC-014
  reaching Done. ABC-014 reaching Done is not a user-visible use of anything: ABC-014 "returns a
  frame as a value and writes nothing" and takes the glyph mode as a PARAMETER it does not choose, so
  merging it cannot produce the hardcoded-mode build RISK-005's "built in from the start rather than
  retrofitted" rules out.

  THE REAL CONSTRAINT: ABC-015 merges with or before ABC-018 — the ticket that makes the frame a
  DISPLAY rather than a value, and the first thing in EPIC-002 a player can see. Corrected IN PLACE
  in four files so no two documents disagree: ABC-015 (Dependencies + priority rationale + DoR),
  ABC-014 (clarified, naming ABC-018), ABC-018 (gains the constraint and the obligation not to
  hardcode or re-derive the mode), and EPIC-002's RISK-005 entry (which had propagated the wrong
  wording). Chain is now ABC-014 -> ABC-015 -> ABC-018, acyclic.

  WHAT DID NOT CHANGE, DELIBERATELY: RISK-005's severity and its MITIGATION STRATEGY (only the event
  the sequencing binds to moved — if anyone reads it as changing the mitigation, that is
  Security/NFR's call, not BA/PM's); ABC-015's size, priority, scope, acceptance and Backlog
  position; and its `blocked-until: ABC-014`, which was always correct. ABC-015 is NOT promoted to
  Ready: untying the merge order did not remove the build dependency, ABC-014 is still unbuilt, and
  this board's own Ready test is "no unbuilt dependency".

  PULL ORDER FOR READY (guidance; the pull is the Orchestrator's), with a reason per ticket:

    1. ABC-012 (M, P0) — unchanged from the 2026-07-31 order, and its blocker is gone: ABC-011 is
       merged, so its repetition tests can be written against a key that means what FIDE means. No
       design hop. ABC-022 does NOT displace it (P1 vs P0, latent vs reachable).
    2. ABC-014 (M, P0) — the other P0 the product's existence rests on, and it is pullable for the
       first time: the knot that stopped it twice is untied and it never blocked on ABC-015.
    3. ABC-009 (S, P1) — first of the two rules-core defects. Ahead of ABC-022 on standing rank (in
       Ready since 2026-07-31) and on the marginally wider reachable surface (`gameStatus` reaches
       it every ply). DELIBERATELY NOT REORDERED against ABC-022.
    4. ABC-022 (S, P1) — beside ABC-009, same class, same trigger (invalid FEN), same gate
       (ABC-010). Different function (`addPawnMoves` vs `addCastlingMoves`), so the two do not
       conflict and either may ship first.
    5. ABC-013 (M, P1) — renderer work, below every P0 and below the rules-core defects. Unchanged;
       the 2026-07-31 rule that rules-core beats renderer inside one priority still holds.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each carries its reason:

  - THE 2026-07-31 RE-SEQUENCING IS NOT RE-OPENED. Its comment above stands unamended. The pull order
    here is that order with the two Done tickets removed and one new P1 inserted at its rank.
  - ABC-012, ABC-014 stay P0; ABC-009, ABC-013 stay P1; ABC-010 stays P1 in Backlog. Nothing this
    task found bears on any of them. ABC-022 is a NEW defect in the same latent class as ABC-009/010,
    not evidence about them.
  - ABC-015's size (S) and priority (P1) are untouched. The knot was a sequencing error, not a
    mis-sizing.
  - ABC-016/017/019/021 untouched — none is named by either item.
  - NO EPIC PRIORITY CHANGED.
  - ABC-010 IS NOT EDITED, though this task found a real gap in it: its scope rejects "an ep square
    with no pawn that could have made the double push", which closes ABC-022's half (b) trigger but
    NOT half (a) — on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` the double-push pawn IS present and
    ABC-010 as written accepts the FEN. FLAGGED on ABC-022's Dependencies and in memory-bank's known
    issues, for ABC-010's own refinement. Editing it here would be the board sweep this task was
    told not to do.
  - ABC-009's Scope/Acceptance mismatch is NAMED, NOT FIXED: its Scope bullet 1 promises byte-identical
    return "for every position it accepts", but every one of its acceptance criteria is a castling
    FEN, so building it to its acceptance leaves ABC-022's half (b) live with a green gate. Recorded
    on ABC-022 so the two tickets do not silently overlap. Amending ABC-009's acceptance is a third
    item and was not taken.

  NOTHING WAS MERGED AND NOTHING WAS DEPLOYED — a human holds both. No column other than Ready moved,
  and Ready -> In Development is the Orchestrator's pull, deliberately not taken here.

  ---
  RE-SEQUENCED 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`) against the project owner's
  standing priority, quoted verbatim from Olger Oeselg on 2026-07-31:

    "The most important thing is that chess moves are legal according to game rules, everything else
     comes after that. Game has to be played according to it's rules."

  This is a priority directive, not a feature request, and it outranks the sequencing set on
  2026-07-30. The input is QE's four notes of 2026-07-31 under task `epic-to-tickets-EPIC-002`
  (ranked gaps G-1..G-6, six refutations, the test artifact-ref, and five unsettled items).

  WHAT MOVED — three things, and only three.

  1. ABC-020 CUT and promoted straight to Ready (M, P0, EPIC-001). QE's G-1: the code applies FIDE
     9.2 (threefold) and 9.3 (fifty-move) automatically where the Laws make both a claim by the
     player HAVING THE MOVE. Reproduced with a FEN — 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 — where this code
     declares 1/2-1/2 and FIDE says White mates with Re8. The deviation runs systematically against
     the human, because the engine is the side that repeats when it is losing. It REVERSES rulings
     made twice (ABC-007 and ABC-019 `## Out of scope`, the latter reading "Settled ... not open");
     both predate the directive and both `## Out of scope` blocks were amended in place the same day,
     so no two documents disagree. THE FIDE 9.6 BACKSTOPS (fivefold, 75-move) ARE IN THE SAME TICKET
     AND MUST NOT BE SPLIT OUT: the automatic fifty-move rule is currently the only thing that ends
     a locked position — QE drove one for 117 plies to prove it — so claims without 9.6 ship a game
     that never terminates. Acceptance A5 is the criterion that fails if anyone separates them.
  2. ABC-021 CUT (S, P1, EPIC-002, Backlog behind ABC-020 + ABC-019). The claim interaction: the
     human claims by command, the engine does NOT claim (it has no evaluation until EPIC-004, and
     "always claim" is strictly worse chess), no offer prompt (it would break epic acceptance 4a's
     constant row count), and the status panel states availability attributed to the side to move.
  3. ABC-009 ESCALATED P2 -> P1 and promoted Backlog -> Ready. `legalMoves` offers a FLAG_CASTLE move
     that is not a legal chess move and corrupts the board taking it back — the query that DEFINES
     legality returning an illegal move is exactly the class the directive names. Note carefully:
     the ticket's OWN escalation trigger has NOT fired and is recorded as unspent. This is a
     directive escalation. Not P0 — it still needs a semantically-invalid position, and no path in
     the product produces one today.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each of these carries its reason:

  - ABC-010 (M, P1) stays P1. Already ranked as a legality defect on 2026-07-29 and its reachability
    is unchanged by the directive — it goes live when EPIC-003 accepts a user FEN, which is still
    unbuilt. Raising it to P0 would put an EPIC-003 ticket ahead of the tickets that make the game
    exist at all.
  - ABC-011 (S, P1) stays P1. ABC-020 gives it a second and now AUTOMATIC consumer (fivefold, FIDE
    9.6.1). That does not raise it, because a repetition loop can contain no capture and no pawn
    move, so the clock climbs and the CLOCK-BASED 75-move backstop terminates every game regardless
    of what the key does. Under-detection costs a late draw, never a hung game.
  - ABC-012 (M, P0), ABC-014 (M, P0), ABC-018 (S, P0), ABC-019 (L, P0) all stay P0. The directive
    re-ranks CORRECTNESS AGAINST FEATURES, not feature against feature. These four are not renderer
    polish — they are whether the product exists. Demoting them would model the directive as "stop
    building the game", which it does not say. What the directive DOES set is the pull order INSIDE
    P0: ABC-020 first.
  - ABC-013 (M, P1) stays P1. Renderer work, already below every P0.
  - ABC-015 (S, P1) stays P1. Its priority is a SEQUENCING constraint — RISK-005 requires it to merge
    with or before ABC-014 — not a claim about user value. Lowering it would rank it behind the
    ticket it must precede.
  - ABC-016 (M, P1) stays P1. The directive argues both ways and they cancel: its new item 7 is a
    rules affordance (without it no player learns a claim exists), items 1-6 are renderer work.
  - ABC-017 (S, P2) stays P2. Already the drop-first tier; P3 is "someday" and this is in the epic's
    scope line.
  - Every EPIC priority is unchanged (EPIC-002/003/004 P0, EPIC-005 P1, EPIC-006 P2). The directive
    lands on tickets, and the two epics that own rule conformance are already P0.

  WIP AND THE LIMIT. Ready 4/8 -> 6/8 against a configured limit of 8 (`.grugops/factory.config.json`
  `wip_limits.Ready`). NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed. Both
  promotions qualify on this board's own Ready test rather than on their priority — ABC-020 and
  ABC-009 each have NO unbuilt dependency, standing on merged src/ alone, which is the exact
  criterion that keeps ABC-015..ABC-019 and ABC-021 in Backlog. Six is still under the ceiling and
  Ready remains a buffer feeding In Development (WIP 3), not a target.

  SUGGESTED PULL ORDER (guidance; the pull is the Orchestrator's). ABC-020 first — P0 correctness,
  and it is a merge-order dependency for ABC-019 and ABC-016, whose acceptance criteria were amended
  today to match it. Then ABC-012 and ABC-014, the P0 tickets the product's existence rests on. Then
  ABC-009 and ABC-011, the P1 rules-core defects. Then ABC-013, the P1 renderer ticket. Within a
  single priority the directive ranks rules-core work ahead of renderer work; that ordering is stated
  here rather than encoded by inflating the P0-P3 scheme.

  As written 2026-07-31 by Architect/Design, before this re-sequencing:
  ABC-013 joined Ready 2026-07-31, moved out of Blocked by Architect/Design when ADR-0004 was
  ratified. Ready 3/8 -> 4/8, well under the limit; no override needed and none taken. Ready is the
  right column and not a conservative Backlog hold: ABC-013's only remaining dependencies are
  ABC-003 and ABC-005, both merged on main, so it has NO unbuilt predecessor — the one thing that
  keeps ABC-015..ABC-019 in Backlog. It does not depend on ABC-012 or ABC-014, and the two tickets
  that depend on IT (ABC-016, ABC-017) stay in Backlog behind it, unchanged.

  Read ADR-0004's Status section before citing this move: that ADR was ratified by the ORCHESTRATOR
  under a named, quoted delegation from Olger Oeselg dated 2026-07-31 — NOT by a human directly. It
  is the first ADR in this project ratified that way and it is explicitly NOT precedent; the standing
  rule that no agent may mark an ADR accepted is unchanged for every other ADR. The sentence in the
  Blocked comment below that reads "this is the same ruling on the same kind of artifact" was written
  on 2026-07-30 and is CORRECTED by this paragraph: it was the same kind of artifact, and it was not
  the same kind of ruling.

  As written 2026-07-30, before that ruling: Ready holds 3 of a permitted 8, and 3 is the honest
  number rather than a conservative one:
  ABC-012 and ABC-014 are the ONLY two EPIC-002 tickets with no unbuilt dependency at all — both
  stand on merged src/ alone. ABC-013 would have been the third and is in Blocked instead, on a
  decision only a human can make. The limit is a ceiling, not a target; Ready is a buffer feeding
  In Development (WIP 3), and flooding it would move the queue rather than shorten it. Same
  reasoning recorded when EPIC-001 put 3 of its 7 into Ready.

  ABC-011 joins them because its OWN escalation trigger fired: it rises to P1 and must be Ready
  "before whichever consumer of the key list lands first", and ABC-012 is that consumer. Both are
  in Ready together; the pull order is the Orchestrator's. ABC-011's size is unchanged at S.

  Emptied 2026-07-23: ABC-003 was pulled into In Development for ticket-to-pr. Its deps
  (ABC-001, ABC-002) are satisfied on main, so it was pulled straight from Ready — no
  analysis or design hop was needed (it arrived meeting the Definition of Ready in full).
-->


## In Analysis (WIP 0/2)

## In Design (WIP 0/2)

<!--
  EXITED 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask
  `architect-abc011-defect-definition-and-ratify`, Workflow 04). ABC-011 moved In Design ->
  Ready for Dev. In Design 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. NO LIMIT APPROACHED, no override
  needed and none taken, no written reason owed. In Design is empty again in the same session, so no
  design-hop WIP was left standing. The SECOND exit from In Design for one ticket and the third in
  this project's history.

  NO PRODUCTION CODE WAS CHANGED AT THIS HOP, and no acceptance criterion, reproduction FEN,
  NFR-005 bar or `## Out of scope` line was re-opened or edited. The first `### ANSWERED` block
  stands unamended; a second, DATED one was added beside it rather than over it.

  ALL THREE THINGS OWED ARE SETTLED.

  1. THE DEFINITION QUESTION -- RULED: purity is UNCONDITIONAL, the answer is DOMAIN-RESTRICTED, and
     the first is bought with a PRECONDITION rather than with a change to what the predicate means.
     `hasLegalEnPassant` synthesises its probe Move instead of taking one from the generator, and
     `undoSpecial` (apply.ts:106-110) writes `move.captured` back unconditionally -- so when the
     board never held that piece the "restore" is a creation, and permanent. Two conditions make the
     probe well-formed and both must be checked BEFORE makeMove: (a) the ep target is empty, (b) the
     square behind it holds exactly the enemy pawn the probe claims to take. Rule 5 gains NO domain
     qualifier: a query that damages its argument is broken whatever the argument means.

     THE PART THAT COULD NOT BE DELEGATED -- THEY ARE TWO GUARDS, NOT ONE, and Security/NFR's
     one-line sketch ("guarding on board[target] === EMPTY") is neither sufficient nor the one that
     fixes the corruption. (b) is the PURITY guard: it closes all three of QE's reproductions AND a
     FOURTH nobody had, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (ep square on the wrong rank for the side
     to move -> phantom BLACK pawn on a2), which (a) does NOT catch because a3 is empty. (a) is the
     ANSWER guard and purity does not need it: on `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its
     mirror the captured pawn IS present, make/unmake round-trips BYTE-EXACTLY, and the shipped
     predicate still answers true where the oracle answers false -- A PURE DIVERGENCE, constructed
     at this hop, which no prior hop had. "Corrupts" and "disagrees with the oracle" are two
     different failures that QE's three FENs conflate.

     THE ORACLE IS NOT THE AUTHORITY OFF-DOMAIN, AND THAT IS FORCED RATHER THAN CONVENIENT.
     `legalMoves(...).some(...)` stays the DEFINITION and the test oracle on positions whose ep
     square the board does not contradict -- a domain containing everything makeMove can produce,
     hence everything reachable by play. Outside it the generator is UNSOUND, measured not conceded:
     it corrupts identically on two of QE's three FENs, and on
     `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` it offers a pawn CAPTURING ONTO THE MOVER'S OWN KNIGHT.
     Tracking it there would import a generator defect into the hash, so the predicate is SPECIFIED
     off-domain instead: it returns false and touches nothing.

  2. THE CASTLING FOLLOW-ON -- RULED: CASTLING IS **NOT** THE SAME CASE. zobristKey keeps hashing
     castling RIGHTS and must not be changed to hash availability. Answered from the retained FIDE
     text, whose sha256 AND CURRENCY were both RE-VERIFIED today rather than inherited: a fresh
     fetch is byte-identical to the retained copy (e0c8bee2...), and FIDE's own handbook index still
     publishes exactly E012014/E012017/E012018/E012023 with nothing after 2023 (E012024/25/26 return
     the same soft-404 shell as a nonsense chapter id -- control run). Manifest retained at
     .grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt. Three reasons,
     ascending: (i) 9.2.3.1 is written in the CAPABILITY mood ("could have been captured") and
     9.2.3.2 in the ENTITLEMENT mood ("had castling rights", "forfeited these"), and 9.2.3.2 carries
     a sentence with no counterpart in 9.2.3.1 -- "The castling rights are lost ONLY after the king
     or rook is moved" -- whose "only" excludes transient blockers; present in all four editions,
     2014-2023. (ii) THE DETERMINACY ARGUMENT, verified against this codebase: addCastlingMoves
     (moves.ts:299-319) reads exactly `castling`, `board` and the side to move, so two positions with
     the same placement and side to move can differ in castling legality ONLY if their rights differ
     -- precisely what was NOT true of en passant, where the ep square is an extra bit not determined
     by placement. Same Laws sentence, opposite consequence. (iii) The residual over-discrimination is
     real and REPRODUCED (four pairs: startpos, knight on g1, king in check, f1 attacked -- identical
     legal-move sets, different keys) and it is the SAFE direction: a draw missed, never one invented.
     "Fixing" it would put isSquareAttackedBy on a component carried by 71.0% of nodes vs the 15.70%
     carrying an ep square. Also checked exhaustively: 368,344 nodes carry a right and ZERO are stale.

  3. ADR-0005 IS RATIFIED -- `accepted`, WITH AN AMENDMENT, and NOT as a rubber stamp. One of its
     statements was FALSE as written: its Consequences described a predicate that "plays a move and
     takes it back", which the shipped code does not do on that class. Clauses 1-5 accepted unchanged
     on evidence three gates established and this hop re-derived; DECISION CLAUSE 6 IS NEW (the
     precondition) and is decided-but-not-yet-built, the ADR-0002-clause-2 precedent; a scope bound
     was added because the ADR was read wider than it is. ADR-0006 IS NEW AND `accepted` -- the
     castling ruling, SEPARATE rather than a sixth clause, because it is a different decision from a
     differently-worded clause landing the opposite way, and because ADR-0005 was ratified in the same
     session on gated evidence while this ruling has been through no gate. Both ADRs now carry
     PER-CLAUSE FALSIFIER TABLES, each checkable without trusting the file. The honest
     counter-argument against ADR-0006 existing at all (it changes no code; BA/PM's 9.6.1 ruling set
     the precedent that those get a note, not an ADR) is recorded in its own Status section.

  RE-DERIVED, NOT INHERITED. Exhaustive walk of src/perft.test.ts's table at its own fast depths on a
  FOURTH independently written script: 518,474 nodes / 81,397 with an ep square -- reproducing the
  design, dev and QE hops TO THE NUMBER. Neither guard fires ONCE on that population, the predicate's
  answer changes on 0 nodes and the key changes on 0, so they are preconditions and not a behaviour
  change. The guarded shape run against the repository's own suite in a sandbox: 193/193 green, 0
  skipped, tsc exit 0, NO EXISTING TEST EDITED -- including zobrist.nfr.test.ts's call-count and
  byte-identity assertions. The six specified tests were each PROVEN TO FAIL rather than assumed to:
  10 of 14 assertions fail against shipped, exactly 2 against guard-(a)-removed, exactly 6 against
  guard-(b)-removed. One boundary probe kills nothing and is NAMED so rather than counted as coverage.

  COST, asked because this sits in a function EPIC-004 calls per node: ZERO on the no-ep path and at
  both NFR-005 anchors (structurally -- the caller's short-circuit never enters the predicate);
  +0.9 to +3.0 ns per call on the 15.70% of nodes with an ep square, i.e. <= +0.5 ns amortized per
  node, under 0.15% of a ~317 ns key; and 20-27x CHEAPER on the invalid class. Two whole-key runs
  bracket 1.0 from both sides, so the delta is below that instrument's resolution and no number is
  claimed from it. NO NFR-005 bar and NO catalog target moves; Security/NFR re-gates and owns the
  verdict.

  SIZE STAYS M and no re-size is owed -- two conditions in the one function ABC-011 already changes,
  six test cases, two doc corrections, all smaller than the delta that took it S -> M. ONE ITEM IS
  ROUTED TO BA/PM RATHER THAN CUT HERE: generateMoves offers an ep capture onto a square occupied by
  the MOVER'S OWN piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6
  0 1`, both verified) -- a generator defect on the invalid-FEN class, a sibling of ABC-009. This fix
  makes the HASH immune to it; it does not clean the generator.

  Full reasoning, every re-derivation and the six things that could NOT be settled:
  .grugops/context/ticket-to-pr-ABC-011/notes/ -- the architect-design decision, observation, claim
  and artifact-ref notes of 2026-08-03.

  IN DEVELOPMENT IS DELIBERATELY NOT ENTERED -- that pull is the Orchestrator's. Nothing was merged
  and nothing was deployed; a human holds both.

  ---
  RE-ENTERED 2026-08-03 by the Orchestrator, from Ready for UAT. See the Ready for UAT comment for
  why a gates-passed ticket moved backward and why the fix is In Design rather than In Development.
  In Design 0/2 -> 1/2; no limit approached, no override taken. Second design hop on one ticket --
  the first in this project's history, and worth a line in plans/metrics.md at the next sweep.

  THREE THINGS ARE OWED HERE, and the third is new authority rather than a new question:

  1. THE DEFINITION QUESTION UNDER THE MEDIUM DEFECT. QE reproduced the shipped predicate and the
     ruled oracle disagreeing on `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` and explicitly declined to call
     it -- "needs an Architect ruling not a dev fix". Rule 5 of the first hop's `### ANSWERED` block
     (byte-identical on return) is the contract the fix must satisfy.

  2. THE OWNER'S TECHNICAL RULING, quoted verbatim 2026-08-03: "any legal move, even the special ones
     still need to be checked." That ENDORSES the strict-FIDE reading -- a special move is still a
     move -- and raises the follow-on this hop must answer rather than assume: IS CASTLING THE SAME
     CASE? `zobristKey` hashes castling RIGHTS. FIDE 9.2.3.1 (en passant, "could have been captured")
     and 9.2.3.2 (castling, rights "forfeited") are worded differently, so the answer is not
     automatic in either direction, and the retrieved Laws text is already in this repo's shared
     context under task `refinement-fide-9-6-1`. Answer it from that text, not from memory -- the
     9.6.1 episode is what that rule was learned from.

  3. ADR-0005 RATIFICATION IS NOW THIS ROLE'S. The owner retired the standing "no agent may mark an
     ADR accepted" rule on 2026-08-03 and delegated decisions to the role that can verify them, naming
     architecture questions and the Architect specifically. ADR-0004 stops being the recorded
     exception and becomes the ordinary case. The full directive, its reading and its stated limits
     are in memory-bank/60-progress.md under "Standing directive -- who decides". Ratifying carries
     owning: an ADR accepted under this delegation records what would falsify it.
-->


<!--
  ENTERED AND EXITED 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04).
  ABC-011 is the SECOND ticket this project has put in In Design, and it was pulled here for the same
  written reason ABC-020 was: `### Open design question — hand to Architect/Design at the design hop,
  do not decide in dev`. No engineer starts until the reading is settled, because an engineer who
  guesses it writes code against a contract that can be rejected.

  Ready 5/8 -> 4/8, In Design 0/2 -> 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. Every column under its
  limit; NO LIMIT APPROACHED, no override needed and none taken, no written reason owed. In Design is
  empty again in the same session, so no design-hop WIP was left standing.

  WHAT WAS SETTLED. The acceptance criteria, both reproduction FENs, the NFR-005 bar and `## Out of
  scope` were NOT re-opened and none was edited.

  1. THE READING: "an en-passant capture is available to the side to move" means a LEGAL one exists --
     the strict-FIDE reading, not the board-only one. FIDE 9.2.3 makes sameness turn on whether "the
     possible moves ... are the same" and 9.2.3.1 on whether a pawn "could have been captured"; a
     capture that leaves your own king in check is neither. That text is not this role's reading of
     the Laws -- it is the text BA/PM retrieved and retained under task `refinement-fide-9-6-1`, and it
     was checked against rather than re-derived.
  2. WHERE IT LIVES, which is the half an engineer could not have guessed: a new exported predicate in
     src/legal.ts -- the module that already owns "is this legal" -- and src/zobrist.ts imports it.
     NOT `legalMoves(...).some(...)`, NOT re-implemented inside zobrist.ts, and NOT in moves.ts.
     src/legal.ts is the ONE file `## Out of scope`'s design-hop escape hatch is exercised for.
  3. THE MEASUREMENTS, because two of this ticket's premises were assumptions. The strict reading does
     NOT cost legalMoves' ~5,300 ns -- that is only the price of the obvious implementation, which is
     rejected. Driven read-only against merged src/ from a scratchpad outside the repo, interleaved,
     Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): amortized over a
     120,000-node pool at natural ep frequency the ruled shape costs 1.014-1.022x merged (board-only
     0.996-1.004x, via legalMoves 1.979x); at kiwipete and startpos -- the two positions NFR-005's bar
     is anchored on, BOTH of which carry no ep square -- 1.00-1.07x; worst case 1.45-1.48x on the
     1.87% of nodes where an ep capture is actually available. ADR-0002 clause 3 has EPIC-004's
     transposition table computing a key per node, so the amortized row is the row that binds: the
     ruling costs 1.4-2.2% per node.
  4. THE legalMoves SHAPE IS DISQUALIFIED ON A SECOND, NON-COST GROUND, and it is reproduced rather
     than argued: on `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` it inherits ABC-009 and CORRUPTS THE POSITION
     IT IS HASHING -- a phantom white king appears on e1. merged zobristKey, the board-only variant and
     the ruled predicate all leave that position byte-identical.
  5. THE DAG STAYS CLEAN, and the ticket's framing is corrected in one respect. Rebuilt from src/*.ts
     rather than read off the audit: today acyclic, max depth 6, zobrist at level 2. Under the ruling
     it is STILL ACYCLIC and STILL EXACTLY AS DEEP (max depth 6); what moves is zobrist's own level,
     2 -> 5, and gameend follows, 5 -> 6. Homing the predicate in moves.ts instead would have created
     THIS PROJECT'S FIRST CYCLE (apply -> moves -> apply), which is why that trap is named on the
     ticket. memory-bank/30-architecture.md's layering line becomes false and is owed an edit when the
     change lands -- recorded on the ticket so it is not dropped.
  6. THE PRICE, stated rather than buried: zobristKey stops being a pure read of the board. It joins
     legalMoves / gameStatus / perft under the "transient mutation behind pure-looking queries"
     pattern, on ~2% of nodes. What that forecloses -- hashing a Position you may not write to, and
     hashing one from two threads at once -- is in ADR-0005's Consequences.
  7. ADR-0002 EXTENDS AROUND, it is NOT amended -- checked clause by clause against the ratified text,
     so NO human ruling is owed and none was taken. Clause 3's 9-23 ns/node is the repetition scan ON
     TOP OF the key and does not move; the ~300 ns key cost is a Context-table figure, not a clause
     proposition. The falsifier that would overturn that reading is one sentence long and is recorded
     on the ticket and in the note.
  8. ADR-0005 WAS WRITTEN AND IT IS `proposed`. NOT on the amendment ground -- on the ground that a
     recorded module-graph invariant becomes false and a ticket is not where a maintainer looks for
     the module graph. NO AGENT MAY MARK IT `accepted` AND NONE DID; ADR-0004's delegated ratification
     is explicitly not precedent and was not leaned on. ABC-011 is NOT blocked on it, because the
     authority for the ruling is the ticket's own delegation of the question to this role by name.
  9. RE-SIZED S -> M AND NOT SPLIT -- the ticket's own named re-size condition for this branch of the
     decision, fired verbatim. Priority P1 unchanged.

  Full reasoning, rejected options, every measurement and the five items that could NOT be settled:
  .grugops/context/ticket-to-pr-ABC-011/notes/ -- the architect-design decision, observation and
  claim notes of 2026-08-02.

  ---
  ENTERED AND EXITED 2026-07-31 by Architect/Design (task `ticket-to-pr-ABC-020`, Workflow 04).
  ABC-020 is the FIRST ticket this project has put in In Design, and it was pulled here because the
  ticket itself says so: `### Open design question — hand to Architect/Design at the design hop, do
  not decide in dev`. No engineer starts until the return shape is settled, because an engineer who
  guesses the shape writes code against a contract that gets rejected.

  Ready 6/8 -> 5/8, In Design 0/2 -> 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. Every column under its
  limit; no override needed and none taken. In Design is empty again in the same session, so no
  design-hop WIP was left standing.

  WHAT WAS SETTLED (the design hop is NOT a re-opening of the ticket — acceptance A1-A10 are written
  on observable behaviour and none was edited):

  1. THE SHAPE. GameStatus becomes a two-arm discriminated union on the `result` field it ALREADY
     has, with `claimable?: DrawClaims` present only on the in-progress arm and ABSENT — not null,
     not [] — when nothing is claimable. `DrawClaims.by` is REQUIRED, so an unattributed claim is
     unrepresentable, which is what acceptance A7 is protecting. `EndReason` gains fivefold-repetition
     and seventy-five-move and loses threefold-repetition and fifty-move, which become the whole of a
     new, disjoint `ClaimableDraw`. State (b) reported as `result: "draw"` is now a COMPILE error
     rather than a test failure. The signature `gameStatus(position, positionCounts?)` is
     byte-identical to the merged one.
  2. ADR-0002 CLAUSE 4 EXTENDS AROUND — it is NOT amended, so no human ruling is owed and none was
     taken, and no ADR was written. Both of the clause's propositions have `positionCounts` as their
     subject and both are untouched. The falsifier that would overturn that reading is recorded in
     the note, one sentence long. Note which option the clause actually discriminates against: the
     SECOND EXPORTED QUERY, which is rejected here on four other grounds as well.
  3. A9 IS A SHAPE CONSTRAINT, contrary to the ticket's "resolves identically under all three
     options". 18 whole-object toEqual assertions sit outside A9's named five, and measured on this
     repo's vitest an extra property survives toEqual only when absent. The criterion is CORRECT as
     written and was NOT edited — it is what selected the shape, and the correction is recorded
     beside it.

  Full reasoning, rejected options and constraint check:
  .grugops/context/ticket-to-pr-ABC-020/notes/20260731T181000Z-architect-design-decision-f95614ca.md
-->

## Ready for Dev (WIP 0/6)

<!--
  EMPTIED 2026-08-03 by the Orchestrator, for the SECOND time on this ticket: ABC-011 pulled
  Ready for Dev -> In Development. Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3. Both under
  limit; no override needed and none taken.

  DEFINITION OF READY RE-CHECKED AT THIS PULL TOO, not carried over from the first one. What changed
  since: the fix contract is a SECOND dated `### ANSWERED 2026-08-03` block (the first was not
  overwritten, so both rulings are readable), the acceptance it must satisfy is rule 5 of the first
  block plus the domain restriction this hop specified, and the two guards are named individually
  with the reproduction each one closes. Size stays M -- the Architect re-checked rather than
  absorbed. No blocker: ADR-0005 is `accepted` (with an amendment) and ADR-0006 is `accepted`, both
  ruled under the owner's 2026-08-03 delegation, so nothing here waits on a ratification.

  TWO GUARDS, NOT ONE, AND THE BOARD RECORDS WHY BECAUSE IT IS THE EASY THING TO GET WRONG. The
  captured-pawn guard buys PURITY and closes a fourth reproduction no prior role had
  (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, which the empty-target guard does NOT catch, a3 being empty).
  The empty-target guard buys ORACLE AGREEMENT and is needed only for two divergences where the
  predicate is already byte-pure. Security/NFR's one-line sketch was neither sufficient nor the guard
  that fixes the corruption -- named here so nobody simplifies it back.

  NOT A REGRESSION IN THE GATES. All three passed this ticket on 2026-08-02/03 and the defect was
  named in the open by QE and severity-ruled by Security/NFR as an accepted risk. The owner declined
  the risk, which is the owner's to decline. The gate chain then found MORE on the second pass than
  it did on the first, which is the argument for re-gating rather than merging the fix on trust.
-->

<!--
  ENTERED 2026-08-03 by Architect/Design at the SECOND design hop (task `ticket-to-pr-ABC-011`).
  Ready for Dev 0/6 -> 1/6; no limit approached, no override taken.

  WHAT THE ENGINEER PICKS UP IS A DELTA, NOT A FRESH TICKET. Five commits of ABC-011 are already on
  this branch and have passed all three gates; what is owed now is the fix contract in the
  `### ANSWERED 2026-08-03` block -- two guard conditions in `hasLegalEnPassant`, six test cases
  across `src/legal.test.ts` and `src/zobrist.test.ts`, and two doc-comment corrections. THE ONLY
  PRODUCTION FILE THAT CHANGES IS src/legal.ts. Everything the first `### ANSWERED` block ratified
  stays exactly as built.

  THREE THINGS THE ENGINEER SHOULD NOT HAVE TO REDISCOVER, all measured at the design hop:

  - The exact guard placement: both conditions are loop-invariant and belong ABOVE the
    EP_CAPTURE_SIDES loop, and `rank` is already the capture square (`enPassantCaptureSquare` in
    apply.ts:78 computes the same value), so the second guard costs one read of a square the
    function already addresses.
  - The six probe FENs and which mutant each kills, in the ticket's own table. FOUR of them kill the
    captured-pawn guard; only TWO kill the empty-target guard, and those two are pure -- their
    zobristKey twins pass either way. A seventh boundary FEN is named as killing NOTHING; do not
    count it as coverage.
  - Cost: zero on the no-ep path (structurally), <= +0.5 ns amortized per node, 20-27x cheaper on the
    class being fixed. No NFR-005 bar moves and Security/NFR re-gates.

  DEFINITION OF READY re-checked at this exit rather than assumed from the 2026-08-02 pass: problem,
  scope/out-of-scope (unchanged), INVEST, acceptance measurable (six FENs, both properties asserted
  at predicate AND key level, each assertion proven to fail), dependencies (none blocking; ADR-0005
  and ADR-0006 are both `accepted` and neither gates this), NFR triggers with numbers, test notes,
  size M, priority P1, no blocker.

  ---
  EMPTIED 2026-08-02 by the Orchestrator: ABC-011 pulled Ready for Dev -> In Development, the one
  board move this role owns on the way in. Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3.
  Both under limit; no override needed and none taken.

  DEFINITION OF READY RE-CHECKED AT THE PULL, not assumed from the 2026-07-30 promotion or from the
  design hop -- the ABC-020 precedent. Problem, scope/out-of-scope, INVEST (independent; merged
  src/ only), acceptance measurable (two exact FEN pairs with their exact bigint keys, EQUALITY and
  INEQUALITY both asserted, a property test over the existing perft position table, a numeric ns
  bar), dependencies (none blocking), NFR triggers with numbers (NFR-005: within 1.5x of 288-306 ns,
  and the no-ep path not slower AT ALL), test notes naming two non-interchangeable test shapes and
  three traps, size M, priority P1, no blocker. The one open item at cut time -- the availability
  reading -- was closed by the design hop, so this pull is clean rather than conditional.

  ADR-0005 IS `proposed` AND THAT WAS CHECKED RATHER THAN ACCEPTED. An unratified ADR held ABC-013
  in Blocked on 2026-07-30, so the question is live: does this one block ABC-011? It does not, and
  the distinction is real rather than convenient. ADR-0004 declared ITSELF blocking ("the merge of
  the first line of src/san.ts") and decided ABC-013's CONTENT -- the ticket had no answer without
  it. ADR-0005 is the RECORD of a ruling ABC-011 itself assigns to Architect/Design BY NAME
  ("hand to Architect/Design at the design hop, do not decide in dev"), so the ticket is the
  authority and the ADR files it where a maintainer will look; its stated rollback is one condition,
  one import and one predicate. It still wants a human's ratification -- NO AGENT MAY MARK IT
  `accepted`, and ADR-0004's delegated ratification is explicitly not precedent -- but that is a
  standing item, not a gate on this ticket.

  WHY THIS TICKET AHEAD OF THE TWO P0s. ABC-012 and ABC-014 are P0 and this is P1, so this pull
  inverts the board's own 2026-07-31 suggested order. The reason is a SEQUENCING constraint the two
  tickets state about EACH OTHER, not a priority judgment: ABC-011's escalation trigger says it must
  land before the first consumer of the key list "otherwise that consumer's own tests are written
  against a key that under-detects and the defect stops being a bug and becomes an encoded
  assumption", and ABC-012's own Dependencies section says "the two must not be built in the order
  that bakes the defect into this module's tests". ABC-012 IS that consumer (gameStatusOf is
  ADR-0002 clause 4's single supplier of positionCounts). Build ABC-012 first and its Test notes
  REQUIRE an ep-free knight cycle to dodge this defect, leaving that test permanently blind. The
  order is one-way. The owner's standing legality-first directive points the same way and is the
  tiebreak, not the argument. Full reasoning:
  .grugops/context/ticket-to-pr-ABC-011/notes/20260802T214000Z-orchestrator-decision-0e6f8692.md

  ONE TICKET, NOT THREE. In Development takes ABC-011 alone against a limit of 3 for the same reason
  ABC-020 was pulled alone: ABC-012 must not be built against today's key, and ABC-014 walks into the
  ABC-015/RISK-005 sequencing knot flagged for BA/PM below.

  ---
  ENTERED 2026-08-02 by Architect/Design on the In Design exit (task `ticket-to-pr-ABC-011`) -- the
  one board move this role owns on the way out. Ready for Dev 0/6 -> 1/6; no limit approached, no
  override taken.

  THE NEXT MOVE IS NOT MINE. Ready for Dev -> In Development is the ORCHESTRATOR's pull and is
  deliberately NOT taken here, exactly as it was left on 2026-07-31 for ABC-020: In Development is
  0/3 and nothing blocks the pull, but a design role taking a dev pull moves work past the one role
  that holds WIP truth for the whole board.

  WHAT THE ENGINEER GETS, and it is on the ticket rather than only in a note: the ratified reading and
  the exact shape it requires, in a dated `### ANSWERED` block under the ticket's own open design
  question, with six numbered rules each of which a test or a measurement can fail, the measured cost
  table, the two doc edits that land with the change, and the one FEN pair the ruling decides
  (`7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` against the same FEN with `-`, which must now hash EQUAL). Two
  of those rules are traps rather than preferences and are worth reading twice: implementing the
  predicate as `legalMoves(...).some(...)` costs 1.979x per node AND corrupts the position it hashes
  (ABC-009, reproduced), and homing it in src/moves.ts creates this project's first dependency cycle.

  RE-SIZED S -> M at the design hop on the ticket's own named condition, and NOT split. The ticket's
  `## Test notes` still names the two test shapes it always did; the ruling fixes the fourth
  acceptance criterion's ORACLE (`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`) rather than
  adding a criterion, because the predicate re-derives pawn geometry src/moves.ts also owns and that
  duplication is otherwise unguarded.

  ---
  ENTERED AND EXITED 2026-07-31. Architect/Design put ABC-020 here on the In Design exit (first
  occupant of this column in the project's history); the Orchestrator pulled it to In Development
  the same day, which is the move this role owns.

  DEFINITION OF READY re-checked at the pull, not assumed from the earlier promotion: problem,
  scope/out-of-scope, INVEST, measurable acceptance (exact FENs, exact move lists, thresholds at
  149/150 and four/five occurrences, exact call counts), dependencies, NFR triggers with numbers,
  test notes naming the five existing tests that may change, size M, priority P0, no blocker. The
  one open item at cut time -- the return shape -- was closed by the design hop, so the pull is
  clean rather than conditional.

  Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3. Both under limit, no override taken.

  THE NEXT MOVE IS NOT MINE. Ready for Dev -> In Development is the ORCHESTRATOR's pull, and it is
  deliberately not taken here: In Development is 0/3 and the pull order the board's own re-sequencing
  comment suggests puts ABC-020 first, but a design role taking a dev pull would move work past the
  one role that holds WIP truth for the whole board.

  What the engineer gets, and it is on the ticket rather than only in a note: the exact TypeScript
  the contract requires, in a dated `### ANSWERED` block under the ticket's own open design question,
  plus an expected-value table in `## Test notes` for the five existing tests A9 permits changing —
  each value driven read-only against merged src/, not inferred. The one to read twice is the
  fifty-move test at line 69, where the claimant is BLACK, because White made the move that ticked
  the clock to 100.

  MERGE ORDER IS UNCHANGED AND STILL LOAD-BEARING: ABC-020 merges before ABC-019 and before ABC-016,
  whose acceptance criteria were amended on 2026-07-31 to match it.
-->


## In Development (WIP 0/3)

<!--
  EXITED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-009`, subtask
  `engineer-abc009-implement`, Workflow 04): ABC-009 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. The In Review comment below carries what is handed over rather than
  restating it, and the full record is in `.grugops/context/ticket-to-pr-ABC-009/notes/`.

  ONE PRODUCTION FILE CHANGED AND ONE TEST FILE ADDED; NOT ONE EXISTING TEST FILE TOUCHED --
  verified at line level rather than by inspection, which is what A8 requires:
  `git diff --name-only -- 'src/*.test.ts'` is EMPTY, and `git status --short -- src/` reports
  exactly ` M src/moves.ts` and `?? src/moves.castling.test.ts`. The new tests went into a NEW
  file precisely so that claim is mechanical.

  THE FIX: two guard conditions in `addCastlingMoves` (src/moves.ts), plus a `rookFrom` field on
  the `CastleOption` table. `+30 -8` lines. The two home squares are read as IDENTITY tests --
  the mover's own KING byte on the king-home square, its own ROOK byte on the rook-home square --
  and they sit ABOVE the existing emptiness and through-check tests, because a byte compare is
  cheaper than an emptiness scan and far cheaper than an attack scan.

  THE STRUCTURAL CHOICE, WITH THE ALTERNATIVE IT REJECTED (the fix site was NOT ruled on, so this
  is the engineer's call and is recorded as one): the rook's home square is a new `rookFrom` field
  on the CastleOption table (h1=7, a1=0, h8=119, a8=112), and the guards live in
  `addCastlingMoves` -- the generator layer -- so `generateMoves` and `legalMoves` are BOTH fixed
  by one change. REJECTED: (a) importing `CASTLE_ROOK_MOVE` from apply.ts, which is where the
  rook's leg already lives -- rejected because apply.ts already imports from moves.ts, so this
  would create a MODULE CYCLE for a four-entry table; (b) deriving the rook square arithmetically
  from `kingTo` per call, rejected because the module's own header commits to precomputed tables
  over per-call arithmetic in the search's innermost loop (NFR-001); (c) filtering at the
  `legalMoves` layer, rejected because `## Scope` requires the castle not be OFFERED by
  `generateMoves` either, and a legalMoves-layer filter leaves the exported generator emitting a
  move the rules forbid.

  ALL FIFTEEN POST-FIX COUNTS IN A1-A6 MATCHED THE DELIVERED DIFF ON THE FIRST RUN. NO
  DISCREPANCY WAS FOUND AND NOTHING WAS ADJUSTED IN EITHER DIRECTION -- no test was bent to the
  code and no criterion was edited. A1 3 moves / 0 castles, A2 [3,3,3], A3 5, A4 16/16/16/16,
  A5 19/17/13/19, A6 12/7/12/5. The kiwipete control also reproduces: 48 legal moves with 2
  castles STILL offered and the position pure across the call. That is now THREE independent
  derivations of those counts (BA/PM's seven candidate builds, the Orchestrator's own fix, this
  diff) rather than two.

  RED BEFORE GREEN, PROVED RATHER THAN CLAIMED (quality.tdd is `encouraged`): the new file was
  run against the UNFIXED tree first -- 23 failed / 10 passed of 33. The 10 that passed are
  exactly the four legal-castle controls and the six A7 purity rows, which confirms the ticket's
  "A7 today: passes" ON THE TIP and that A7 was ABSENT rather than failing. Every one of the 23
  defect assertions was red before the fix existed.

  THE THREE LOAD-BEARING DELETIONS FAIL DISJOINT NAMED SETS ON THE DELIVERED DIFF, not on a
  candidate -- test note 5, re-measured here because BA/PM measured it on mutants of main:
    delete the KING condition   -> A4 + A5 fail, NOTHING else (16 assertions, 321/337)
    delete the ROOK condition   -> A3 + A6 fail, NOTHING else (5 assertions, 332/337)
    weaken BOTH to OCCUPANCY    -> A5 + A6 fail only            (12 assertions, 325/337)
    swap the two squares        -> 19 fail, incl. ABC-004 castling and kiwipete perft(1) (A8)
  All four legal-castle controls survived every mutant, so none of the reds is a false red. The
  mutations were applied in place and reverted from a pristine copy, with src/moves.ts re-hashed
  to 0e247853ab2c05887c76105ff83d8621 after each one.

  A FIFTH MUTANT SURVIVES ALL TWELVE CRITERIA AND THE WHOLE SUITE, AND IT IS REPORTED BECAUSE
  OPEN ITEM (1) SAYS SEVEN IS NOT PROVEN COMPLETE. Weakening both identity tests to COLOUR-BLIND
  (`pieceType(...) !== KING/ROOK` instead of the full byte) reads 337/337 green and typechecks
  clean. IT IS NOT A DEFECT -- it is BEHAVIOUR-EQUIVALENT, and that was measured rather than
  argued: exhaustively over all 13x13 byte combinations on the two home squares x 4 castles (676
  boards), the two rules read the squares differently on exactly 12 boards and the generator's
  output AGREES on all 12, because an enemy king or enemy rook on those squares attacks a square
  the existing through-check test requires unattacked. Re-run with every possible third piece on
  every other board square (8,928 boards): still ZERO divergence. So the criteria cannot kill it
  and SHOULD not -- this is the same class as ABC-011's two behaviour-equivalent cost mutants that
  were deliberately not pinned. It independently corroborates BA/PM's "a wrong-colour rook is
  unreachable" measurement, now at the delivered fix and over both squares exhaustively rather
  than on two FENs. The delivered fix is STRICTER than reachability requires, which is the safe
  direction.

  GATES, AS THEY RAN: npm install exit 0 (no dependency change, package.json and package-lock.json
  untouched), lint exit 0 with ZERO autofix passes needed (0 of 2 self-fix attempts spent),
  typecheck exit 0, npm test 337/337 on 15 files (304/304 on 14 files BEFORE, measured by running
  the suite on the tip rather than by subtraction, and matching the figure the Orchestrator
  recorded at the pull), build exit 0. Skip count 0 by the AGENTS.md command. A9 DEEP LANE 32/32
  EXACT in 36.93 s, run BEFORE review as the ticket requires -- nobody had run it on either tree
  for this ticket. E2E: UNKNOWN - verify (the AGENTS.md slot is unknown; no UI surface and no
  runnable game until EPIC-006). Test-integrity checker: exit 2, run exactly as Workflow 05 step 3
  specifies -> "cannot read the registry file"; `.grugops/test-skips.md` does not exist. Exit 2 is
  "the checker could not run", is NOT the exit-1 human-only short-circuit and is NOT A PASS. NO
  registry file was created -- an agent may not self-author a justification to clear its own gate,
  and with a skip count of 0 nothing is owed one. Auto-UAT oracles: UNKNOWN - verify,
  scripts/check-uat-oracles.js does not exist in this install (non-blocking per Workflow 05). The
  two lint INFOS are pre-existing biome.json schema/deprecation notices, unrelated to this ticket
  and NOT touched.

  NFR-001 / A10: MET ON BOTH CLAUSES, AND IT IS THE FIRST THROUGHPUT MEASUREMENT ANY ROLE HAS
  TAKEN ON THIS TICKET. The 6.04M-6.21M figure in the ticket is quoted from plans/nfr-catalog.md
  and was NOT measured by the Orchestrator or BA/PM; these numbers are this role's own.
    FLOOR: `npm run perft` on the delivered tree reads 6,078,622 / 6,131,325 / 6,151,559 nodes/sec
    over three runs -- 6.08M-6.15M, INSIDE the catalog's standing band, about 6.1x the >= 1M bar.
    RATIO: three trees imported in ONE process -- pre-fix (main's src), delivered, and a
    BYTE-IDENTICAL TWIN of the delivered tree as a NULL CONTROL BY IDENTITY -- 7 rounds, tree AND
    cell order rotated every round, discarded warm-up, medians of per-round rates, node counts
    checksummed across every tree and round (238,936,362 nodes), two fully independent samples in
    their own processes. AGGREGATE post/pre = 0.9987 and 0.9974 against the >= 0.98 bar: MET on
    both samples. Worst single cell across both samples 0.9880 (startpos), still above the bar.
    THE CATALOG'S CAUTION WAS FOLLOWED AND IT IS THE REASON NO PER-CELL CLAIM IS MADE. The
    structurally-zero cells were read FIRST: position-3 and position-6 carry NO castling rights,
    and makeMove can only clear rights and never create them, so ABC-009's two added byte compares
    execute ZERO times anywhere in those two subtrees -- their true delta is exactly zero, and they
    read 1.0084 / 0.9918 / 1.0041 / 0.9989 across the two samples. The identity twin read 1.0087
    and 0.9983 aggregate and up to 1.0126 per cell. SO THE INSTRUMENT'S OWN FLOOR IS ABOUT +/-1%
    PER CELL, WHICH IS LARGER THAN ANY SIGNAL: the bar is met with margin, and NO per-cell
    regression or improvement is claimed from this instrument -- in particular the kiwipete 0.9930
    reading is inside the noise established by cells whose delta is provably zero.
    DENOMINATOR FENCE, carried not quoted: 97.3% of the nodes perft counts are FREE LEAVES, so
    this is generation-with-free-leaves and is NEVER evidence for NFR-005.
    NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE -- this project's standing rule; the figures
    live here and in the notes, with their machine: Apple M3 (Mac15,13) / Node v24.12.0 /
    Darwin 25.5.0 arm64, and UNKNOWN - verify on any other hardware.
  NFR-005 was NOT measured and the key benchmark was NOT re-run -- the exclusion is structural and
  the ticket says so explicitly. NO NFR TARGET MOVED and plans/nfr-catalog.md was NOT edited.
-->

<!--
  ENTERED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04) — the
  `Ready for Dev -> In Development` exit this role owns, taken here as `Ready -> In Development`
  because this board has no occupant of `Ready for Dev` and never has. In Development 0/3 -> 1/3,
  Ready 3/8 -> 2/8. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for the count.
  Width used is 1 against `queue.wip_limit` 3, and not because of the cap: the ticket-to-pr hops are
  genuinely serial, so dev runs alone and QE and Security/NFR are enqueued after it rather than
  beside it. `queue.claim_cap` 2 is unspent. Queue was empty at the pull.

  THE DEFINITION-OF-READY GATE PASSED HERE, on the corrected ticket and on the second pass. The
  first pass FAILED and the Ready-column comment carries what failed, what was measured on a mutant,
  and the fifteen-count three-way cross-check behind the pass. Read the ticket's correction block
  under `## Acceptance` before designing anything: it decides the identity-versus-occupancy question,
  the layer each criterion is asserted at, and every post-fix count, and each ruling names the
  alternative it rejected.

  THREE THINGS THE ENGINEER INHERITS AS OPEN, none of them a blocker:
  (1) SEVEN IS NOT PROVEN COMPLETE. This board's own history is a pre-check naming three, BA/PM
      finding five, then QE finding SIX mutants past all twelve corrected criteria (ABC-018,
      2026-08-09). Expect A1–A10 to be insufficient and say so if they are.
  (2) THE POST-FIX COUNTS CAME FROM CANDIDATE FIXES, not from the delivered one. Two independent
      derivations agree, which is strong but is not the same as the real diff. A discrepancy at the
      implementation hop is to be RAISED, never silently adjusted to match the code.
  (3) THE FIX SITE IS NOT RULED ON. `addCastlingMoves` and `legalMoves` are observationally
      equivalent today because generateMoves has no non-test caller but legalMoves — BA/PM stated
      that against its own criteria, which are written at the legalMoves layer. `## Scope` is the
      requirement; the mechanism is the engineer's call.

  NFR-001 IS TRIGGERED and its bar is now machine-independent: perft >= 1M nps AND ratio >= 0.98
  against the same measurement on the pre-fix tree in the SAME process. No throughput figure has
  been measured by any role on this ticket — the Orchestrator did not run `npm run perft` and neither
  did BA/PM. The 6.04M-6.21M baseline is quoted from plans/nfr-catalog.md, which is the authority.
  Read that catalog's standing benchmarking caution AND its denominator fence (97.3% of the nodes
  perft counts are free leaves) before measuring.

  EXITED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-018`, subtask
  `engineer-abc018-implement`, Workflow 04): ABC-018 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. Full record in the ticket's `## Implementation` section; the In Review
  comment below carries what is handed over rather than restating it.

  TWO NEW FILES, NO EXISTING FILE UNDER src/ TOUCHED -- verified, not asserted:
  `git diff --numstat main -- src/` is EMPTY, and the only entries `git status --short -- src/`
  reports are src/frame.ts (222 lines, 94 of them code) and src/frame.test.ts. src/render.ts and
  src/glyph-mode.ts in particular are byte-identical to merged main at 7e0923c.

  GATES, AS THEY RAN: npm install exit 0 (no dependency change, package-lock untouched), lint
  exit 0 after ONE autofix pass (`npx biome check --write src/frame.test.ts` -- import ORDER and
  formatting only, lint.autofix is true, self-fix attempt 1 of 2), typecheck exit 0, npm test
  297/297 on 14 files (277 on 13 BEFORE, measured by running the suite without this file rather
  than by subtraction), build exit 0. Skip count 0 by the AGENTS.md command. src/frame.ts at 100%
  on all four coverage axes. E2E: UNKNOWN - verify (the AGENTS.md slot is unknown; no UI surface
  and no runnable game until EPIC-006). Test-integrity checker: exit 2 -- run exactly as Workflow
  05 step 3 specifies, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "cannot read the registry file". Exit 2 is "the checker could not run", is
  NOT the exit-1 short-circuit and is NOT a pass; NO registry file was created, because an agent
  may not self-author a justification to clear its own gate, and the skip count is 0 so nothing
  is owed a justification. Auto-UAT oracles: UNKNOWN - verify, scripts/check-uat-oracles.js does
  not exist in this install (non-blocking per Workflow 05). The two lint INFOS are pre-existing
  biome.json schema/deprecation notices, unrelated to this ticket and NOT touched.

  RISK-005's BUILD OBLIGATION -- the one thing on this ticket that survives its discharged
  merge-order constraint -- IS MET, AND IT WAS CHECKED MECHANICALLY RATHER THAN ASSERTED. The
  glyph mode is a REQUIRED parameter of assembleFrame with NO default. src/frame.ts imports
  exactly one thing, `import type { GlyphMode } from "./render.ts"`, which is erased at runtime,
  so the module cannot default the mode, cannot hardcode one (its only mode literal is the
  `mode === "ascii"` comparison inside the sanitizer) and cannot re-derive one: `process.` appears
  only in prose, and the only isTTY/rows reads in the file are of the INJECTED SINK. ABC-015 owns
  the rule and runs it once; its answer arrives here exactly as it arrives at renderBoard.

  FIVE STRUCTURAL CHOICES THE TICKET LEFT OPEN ARE DECIDED, each with its reason in the module
  header and in the ticket's `## Implementation`:
    (1) W is derived from the PANEL rows only. "The widest row the assembled regions emit" is
        circular if the message region is inside the maximum -- one long rejection would widen the
        frame, which is the one way content can break 4a's constant geometry. The panels set W;
        the message region is bounded BY it. Two tests kill the other reading.
    (2) EVERY ROW EXCEPT THE PROMPT ROW IS PADDED TO EXACTLY W. That is what makes the in-place
        redraw leave NO CHARACTER of the previous frame behind: ED(0) clears from the cursor down,
        but a row shorter than the row it overwrites leaves the old tail to its right, and the
        Security bar allows only the two escape sequences this module emits -- so a per-row
        erase-to-end-of-line was not available. The prompt row is deliberately NOT padded: padding
        it would leave the cursor at column W instead of at that row's start.
    (3) The packing search runs DOWNWARD, because N and the marker are coupled -- dropping an item
        raises N, which can lengthen `(+N more)`, which can drop another item.
    (4) The sanitizer runs over EVERY string placed into the frame, panel rows included, which is
        what the ticket's "any supplied string ... before it is placed" says and what makes
        acceptance 2a hold over the WHOLE emitted stream by construction.
    (5) Widths are counted in UTF-16 units, which equal code points for everything this frame can
        carry. A terminal's DISPLAY columns are a third quantity and nothing in this epic supplies
        one -- stated in the header rather than left to be discovered.

  NFR-002: BOTH HALVES MEASURED SEPARATELY, WITH THE MACHINE AND THE PLY COUNT, AND NO NUMBER IS
  QUOTED FROM ANY EXISTING NOTE. Out of tree, own harness in its own process, the game replay and
  parseFen hoisted OUT of every timed region (the catalog's own caution, which produced a 2.08x
  false miss on ABC-012), a discarded warm-up round, 11 rounds per cell, cell order rotated every
  round, medians of per-round means, TWO fully independent samples. Apple M3 (Mac15,13) / Node
  v24.12.0 / Darwin 25.5.0 arm64, UNKNOWN - verify on any other hardware. Denominator: a 23-row,
  18-column frame, 418 characters serialized.
    COMPUTE (renderBoard + assembleFrame): 5.97/6.03 us @40, 6.02/6.07 us @120, 6.03/6.06 us @300.
    WRITE, in-memory sink (serialization only): 0.64/0.64, 0.64/0.65, 0.65/0.65 us.
    WRITE, fs.writeSync to /dev/null:          1.67/1.66, 1.66/1.66, 1.67/1.67 us.
    WRITE, fs.writeSync to a regular file:     2.43/2.48, 2.44/2.46, 2.44/2.48 us.
    SUM (the bar): 0.0084-0.0092 ms worst case against 16 ms -- MET, about 0.05% of the budget.
  THREE LIMITS TRAVEL WITH THESE FIGURES: the compute half is a LOWER BOUND (ABC-016 and ABC-017
  are stubs built outside the clock and ABC-013's SAN derive is not in it at all); "write" was
  measured three ways because "written to a non-TTY sink" honestly means three different things,
  and all three are reported rather than the flattering one; and the in-place TTY path was NOT
  timed separately, because the bar names a non-TTY sink and what a real terminal does with the
  bytes is not observable in-process. NO wall-clock assertion was added to the suite -- this
  project's standing rule; Security/NFR re-derives on its own instruments.

  ENTERED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-018`, Workflow 04 step 2) — the
  `Ready -> In Development` exit this role owns. Ready 4/8 -> 3/8, In Development 0/3 -> 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed.

  THE DEFINITION-OF-READY GATE PASSED ON THE CORRECTED TICKET, and BA/PM's five rulings were
  RE-VERIFIED AT THE SOURCE rather than inherited -- the same standard BA/PM applied to this role's
  pre-check, which is what caught that the pre-check's AMBER row was actually a FAIL:

    - EPIC-002:197-198 does contain "1 prompt row = 23 rows", so `23` was never unsourced and this
      role's pre-check item 2 was WRONG on that point. BA/PM's correction stands: the ticket's Scope
      assembled four of five regions and summed to 22.
    - ABC-016:72 gives "all writing" to ABC-018; ABC-019's eight `prompt` hits are all about WHEN to
      prompt, never a frame row; EPIC-003's are the prompt's text, echo and NFR-003. So reserving the
      row here creates NO DOUBLE OWNERSHIP -- this ticket reserves and renders nothing.
    - EPIC-002:133 (#2a) asserts zero code points above U+007F "in the emitted frame", not in one
      panel, so the ASCII sanitizer widening is CONSISTENCY WITH THE EPIC, not scope creep.
    - EPIC-002:200 (#4b) says "at least as many rows as the frame", so R = H is in-place by the
      epic's own rule and was untested. Defect 3 confirmed.
    - Defect 4 (NFR-002 read as each half rather than the sum) contradicted the ticket's own NFR
      section AND its traceability row. NO TARGET MOVED -- the 16 ms is EPIC-002's.

  SIZE RE-CHECKED, NOT CARRIED: still S (2). One reserved row placed by the mechanism the message
  region already uses, one width constant, one sanitizer clause, four tests. No argv, no I/O, no new
  module. NOT XL, so no SPLIT_REQUIRED.

  AN OPEN CROSS-TICKET OBLIGATION IS CREATED HERE AND IS NOT DISCHARGED BY THIS TASK. The reserved
  prompt row is a contract with only one side written down: ABC-018 reserves the frame's last row and
  leaves the cursor at its start, EPIC-003 is expected to type into exactly that row, and ABC-019
  drives the loop around it. BA/PM did NOT edit and does NOT vouch for EPIC-002, ABC-016, ABC-017 or
  ABC-019 -- correctly, since a promotion subtask should not quietly rewrite four other tickets. It
  is NOT a blocker for ABC-018, which is buildable against a stub. WHEN ABC-019 IS REFINED AND WHEN
  EPIC-003 IS DECOMPOSED, THE PROMPT-ROW CONTRACT MUST BE CARRIED INTO THEM. Routed to BA/PM then,
  not now, and recorded here so it is not rediscovered as a defect.

  EXITED 2026-08-08 by the Software Engineer (task `ticket-to-pr-ABC-015`, subtask
  `engineer-abc015-implement`, Workflow 04): ABC-015 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. Full record in the ticket's `## Implementation` section.

  THREE NEW FILES, NO EXISTING FILE UNDER src/ TOUCHED -- verified, not asserted:
  `git diff --numstat main -- src/` lists only src/glyph-mode.ts (122 lines, 32 of them code),
  src/glyph-mode.test.ts and src/glyph-mode.nfr.test.ts, and every pre-existing src/ file is
  byte-identical to merged main at f1743a3. src/render.ts in particular is untouched: its header
  records that it reads no isTTY and no process.env, and adding the ambient reads there would have
  broken epic acceptance 4c.

  GATES, AS THEY RAN: lint exit 0 (after ONE autofix pass -- biome failed on FORMATTING ONLY,
  lint.autofix is true, self-fix attempt 1 of 2), typecheck exit 0, npm test 271/271 on 13 files
  (253 on 11 before), build exit 0. Skip count 0 by the AGENTS.md command. src/glyph-mode.ts at
  100% on all four coverage axes.

  THE ONE STRUCTURAL CHOICE THE TICKET LEFT OPEN IS DECIDED: the session's cached value lives in
  the CLOSURE beginGlyphModeSession returns. That is what lets acceptance criterion 10 (the RULE
  reads no ambient global) and the NFR bar (the SESSION ACCESSOR may read process.stdout.isTTY and
  process.env) both hold at once. A module-level memo was rejected -- it needs an exported reset for
  the tests to run more than one session, and that export is the one thing able to break the
  session-constant promise. A value the caller merely holds was rejected -- it pushes the once-ness
  back to EPIC-006, the seam BA/PM closed onto this ticket, and makes criterion 11 unfalsifiable
  again.

  21 MUTANTS RUN, ALL 21 DIED -- including the named mutant from the ticket's test notes (the
  session re-probing the environment on every call; killed ONLY by criterion 11) and the platform
  rule smuggled back in (killed ONLY by criterion 9's guard). TWO OF THEM SURVIVED THE SUITE AS
  FIRST WRITTEN AND THE SUITE WAS FIXED RATHER THAN THE RECORD: a session that hardcoded isTTY, and
  one that forwarded only LANG. Both criteria 10 and 11 are written over ambients where isTTY and
  the locale AGREE, so neither could see it. The tree was restored byte-identically afterwards.

  ONE BEHAVIOUR THE NINE TUPLES DO NOT SPECIFY WAS DECIDED HERE AND IS FLAGGED, NOT BURIED: an
  EMPTY locale variable counts as UNSET and precedence falls through. POSIX reads it that way, and
  so does this ticket's own rationale for row 4 ("unset ... carries no information"). Two tests pin
  it. QE and Security/NFR own whether that reading stands.

  FLAGGED, NOT FIXED -- NEITHER IS THIS SUBTASK'S:

    1. The tracked coverage/ directory is stale by two merged tickets (it has no render.ts.html from
       ABC-014 and no history.ts.html from ABC-012), so this role did not regenerate it and restored
       it byte-identically after a --coverage run touched it. Owner: whoever owns the coverage
       artifact; raised here rather than silently refreshed.

    2. plans/traceability.md's ABC-015 row has ELEVEN cells against a TEN-column header, and it did
       BEFORE this subtask edited it (checked at HEAD, not assumed). The cause is a raw, unescaped
       `|` inside the TypeScript union type quoted in the Status cell, which splits that cell in any
       markdown renderer. Left exactly as written: escaping it means editing another role's recorded
       audit text, and this subtask's edits kept the count at eleven rather than making it worse.
       Owner: the board sweep, alongside ABC-012's stale ticket frontmatter.
-->

<!--
  PULLED 2026-08-08 by the Orchestrator (task `ticket-to-pr-ABC-015`, Workflow 04 step 2) —
  `Ready -> In Development`, one of the two exits this role owns. Ready 4/8 -> 3/8, In Development
  0/3 -> 1/3, queue width 1 of 3. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed.

  PULLED ON AN OWNER CALL, RECORDED RATHER THAN ABSORBED. The owner said "continue with ABC-015" in
  session on 2026-08-08. That puts ABC-015 ahead of ABC-009 and ABC-022, the two rules-core defects
  the owner's own legality-first directive ranks first inside a priority. NEITHER IS CANCELLED,
  RE-SIZED OR RE-PRIORITISED — both keep P1 and their place in Ready. The owner may re-order their
  own queue; this role records the displacement so nobody re-derives it later.

  THE DEFINITION OF READY WAS RE-APPLIED AT THE PULL, against the ticket AS CORRECTED BY BA/PM
  today — not against the version this role pre-checked, and not taken from BA/PM's report. All ten
  checks hold. Two of them hold only BECAUSE of BA/PM's corrections:

    - "acceptance testable and measurable" — the pre-check this role published at 09:xx ticked this
      green on the ticket's own DoR line ("nine enumerated input tuples"). IT WAS EIGHT TUPLES PLUS
      ONE SESSION PROPERTY, and this role recounted the original bullets to confirm BA/PM is right
      and the pre-check was wrong. Reading a self-assessment back as evidence is the same failure
      mode as the "7 standing perft FENs" that were 6, caught during ABC-014.
    - The (--ascii AND --unicode) tuple is constructible from two independent booleans and table
      rows 1 and 2 BOTH matched it, with no stated output. An engineer had three defensible guesses.
      BA/PM ruled row order -> ASCII, no throw, no print. That is a product call and it is theirs.
    - The old session criterion could not fail: with signals injected as arguments — which the
      ticket's own test notes REQUIRE — it asserted only that a const does not mutate. Replaced by
      two criteria written against a named mutant.

  BA/PM WAS ROUTED HERE FIRST FOR EXACTLY THIS REASON. Backlog -> Ready is their exit, not this
  role's, and the ticket sat in Backlog. Had this role pulled it straight out of Backlog to save a
  hop, both defects would have reached an engineer.

  NO DESIGN HOP, and the reason is recorded rather than assumed. ABC-014 — an M and the epic's
  headline — took none because its cross-ticket contracts were already settled at the epic. This is
  a strictly smaller case: one pure function, a five-row precedence table already written out, and a
  return type a merged module declares. In Analysis 0/2 and In Design 0/2 are untouched.

  ONE STRUCTURAL CHOICE IS THE ENGINEER'S AND IS DELIBERATELY NOT PRE-DECIDED HERE: where the
  session's cached value lives, given acceptance criterion 10 requires the RULE to read no ambient
  global while the NFR bar allows the SESSION accessor to read process.stdout.isTTY and process.env
  once. BA/PM left it open in those words; this role does not close it.

  RISK-005's merge-order constraint is SATISFIED BY DOING THIS NOW, not bent by it: ABC-015 merges
  with or before ABC-018, and ABC-018 is unstarted in Backlog.
-->

<!--
  EXITED 2026-08-06 by the Software Engineer (task `ticket-to-pr-ABC-014`, subtask
  `engineer-abc014-implement`, Workflow 04): ABC-014 implemented with tests and a green mandatory
  gate, moved In Development -> In Review. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit
  approached, no override taken, no written reason owed. The In Development -> In Review exit is the
  one board move this role owns. Nothing was merged and nothing was deployed -- a human holds both.

  THREE NEW FILES UNDER src/ AND NOTHING ELSE. src/render.ts (150 lines, 65 of them code),
  src/render.test.ts (353 lines, 17 tests) and src/__snapshots__/render.test.ts.snap (24 snapshots,
  the first snapshot file in this repo). ALL 20 PRE-EXISTING FILES UNDER src/ ARE md5-IDENTICAL TO
  MERGED `main` ed42d26, checked file by file against the tree rather than inferred, and
  `git diff --numstat ed42d26 -- src/` is EMPTY.

  THE LAYOUT IS THE ONE DECISION THIS TICKET HAD LEFT TO MAKE, and epic acceptance 4a hands it over
  in its own words ("the invariant is the criterion; the exact split is the engineer's"). The frame
  is 9 rows x 18 characters -- 8 board rows + 1 file-label row, matching 4a's reference split
  exactly. EVERY SQUARE IS TWO CHARACTERS: its shading character, then its piece glyph, or the
  shading character again when the square is empty. That is not cosmetic. It is what makes
  "adjacent squares on a rank are shaded differently" ASSERTABLE ON A FULL BACK RANK -- a one-
  character cell where the piece replaces the shading leaves the criterion vacuous exactly where the
  pieces are -- and the two-character pitch is what puts the file labels under the piece column with
  one space between them, so the label row reads `a b c d e f g h` AND measures the same 18
  characters as a board row, with no trailing padding anywhere in the frame.

  THE THREE EPIC-002 CONTRACTS WERE IMPLEMENTED, NOT RE-OPENED: shading by CHARACTER and no ANSI
  ([A4]); the glyph mode is a PARAMETER this module does not choose ([A1] / 2b -- it declares
  `GlyphMode` and consumes it, and ABC-015 still owns the five-row selection table); the frame is a
  VALUE with constant geometry (4a). Nothing in src/render.ts reads isTTY, process.env or a terminal
  size, so epic acceptance 4c and EPIC-006's pipe-driven test can both assert against it.

  EVERY ACCEPTANCE CRITERION HAS ITS OWN TEST AND EVERY TEST WAS PROVEN ABLE TO FAIL: 18 mutants of
  the shipped module, all 18 killed, restored md5-identical afterwards. THE CAMPAIGN CHANGED THE
  SUITE RATHER THAN DECORATING IT, and that is the part worth reading: TWO MUTANTS SURVIVED THE
  SHADING TEST -- taking the shade from the SCREEN position instead of the square, and swapping the
  dark and light characters. Both invert the whole colouring, and every property that does not NAME
  a character (corners equal, adjacent differ, two characters in all) is symmetric under that
  inversion, so criterion 6's "a1 and h8 are both DARK" was being carried only by the two hand-
  written frames. One assertion naming the character closed it; both mutants now die to the
  criterion's own test. Reported because it was measured, not because it reads well.

  NFR-002's BOARD-FRAME BAR IS MET WITH 242x HEADROOM AND IS RECORDED WITH ITS MACHINE. Worst cell
  across two independent samples: 2.070 us per frame against the 500 us bar, over all 24 cells of
  (6 standing perft FENs x 2 glyph modes x 2 orientations), on Apple M3 (Mac15,13) / Node v24.12.0 /
  Darwin 25.5.0 arm64 -- `UNKNOWN - verify` on any other hardware. Out of tree in its own process,
  11 rounds plus a discarded warm-up, 2,000 iterations per timed region, cell order rotated every
  round, medians of per-round means, parseFen OUTSIDE the timed region, checksum accumulated so
  nothing could be optimised away. Unicode costs about 2x ASCII (0.95-1.13 us vs 1.42-2.07 us) and
  both are ~250x under the bar. NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE, this project's
  standing rule, and plans/nfr-catalog.md was deliberately NOT edited -- that file's rows are
  Architect/Design's and Security/NFR's, the same division ABC-011 and ABC-012 kept.

  GATES: 243 passed / 11 files / 0 failed (was 226 / 10), skip count 0 captured with the AGENTS.md
  command and not eyeballed; lint, typecheck and build all exit 0 (the same 2 pre-existing biome
  config-schema infos); src/render.ts at 100% statements / branches / functions / lines.

  HANDED TO QE RATHER THAN ABSORBED, each with its reason: the purity criterion (byte-identical
  repeat + toFen unchanged) has exactly ONE killer in the suite -- the mutant that clears each
  square as it reads it dies to that test and to nothing else; "a1 and h8 are dark" is now pinned by
  NAMING the character, which is the only way a character-shaded board can assert it, so a reviewer
  who dislikes `:` and `.` is disagreeing with a test rather than with a comment; the 24 generated
  snapshots are a REGRESSION net, not a correctness proof, and two of them (kiwipete and position-3,
  both orientations) were hand-checked square by square against their FENs while 22 were not; and
  nothing imports src/render.ts yet, so no test in this suite exercises it through a caller.

  THREE THINGS FLAGGED, NOT FIXED. (1) The standing perft FEN TABLE HOLDS 6 POSITIONS, NOT 7 -- the
  pull note and this ticket's traceability row both say 7. The 7th literal in src/perft.test.ts is
  `7k/4P3/8/8/8/8/8/4K3 w - - 0 1`, an ad-hoc promotion position inside a perftDivide test, not a
  row of the table. All 6 are transcribed into src/render.test.ts and machine-compared to the
  originals; nothing about the criterion changes. (2) THE UNICODE FIGURINES ARE EAST-ASIAN-WIDTH
  AMBIGUOUS: U+2654-U+265F render double-width in some terminals, which would break the visual
  alignment of a frame whose STRING width is provably constant. It is invisible to every criterion
  here, because all of them are written against the frame as a value, and it lands on ABC-018 where
  the frame meets a real terminal. (3) coverage/ IS A STALE TRACKED ARTIFACT, last updated at
  ABC-007 (76ca714) and not maintained by ABC-011 or ABC-012; a --coverage run dirtied it and it was
  restored with `git checkout` rather than regenerated or deleted.

  ABC-009, ABC-010 and ABC-022 are carried, not fixed. The start FEN is now literal in SIX files
  rather than five, and the six perft FENs are literal in a second file -- a test file cannot import
  another test file's private const, and a new shared fixture module is an unrequested file
  (AGENTS.md rules 5 and 9); every FEN was machine-compared to its original. SUBSTRATE DEGRADATION
  CARRIED FORWARD: no scripts/claim.js and no scripts/context-io.ts, so the queue file moved
  pending -> claimed -> done BY HAND (with a claim.md registry record written into the claim
  directory) and the context notes are hand-written in the schema's exact shape; `finding` is
  inadmissible with no §14 gate to issue a stamp and NOTHING WAS SELF-STAMPED -- the kinds used are
  decision, observation, claim and artifact-ref. NO PR -- this repo has no git remote, so there is
  nowhere to push and none was invented.

  ---
  ENTERED 2026-08-06 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04) — the
  `Ready → In Development` pull this role owns. 0/3 → 1/3, no limit approached, no override taken.
  The reason for the pull, the Definition-of-Ready re-check and the no-design-hop ruling are in the
  Ready comment above and in full in the pull decision note; not restated here.

  THE EXIT FROM THIS COLUMN IS THE SOFTWARE ENGINEER'S (In Development → In Review), then QE/E2E
  owns the In Review exit, then Security/NFR gates NFR-002 (board-frame compute ≤ 500 µs/frame,
  recorded with its machine). ABC-014 has NO security trigger — it renders bytes from
  position.board and no user-supplied string reaches it; the escape-sequence trigger belongs to
  ABC-018's message region.

  ---
  EMPTIED 2026-08-04 by the Software Engineer (task `ticket-to-pr-ABC-012`, subtask
  `engineer-abc012-implement`, Workflow 04): ABC-012 implemented with tests and a green mandatory
  gate, moved In Development -> In Review. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit
  approached, no override taken, no written reason owed. The In Development -> In Review exit is the
  one board move this role owns.

  ONE NEW MODULE AND NOTHING ELSE UNDER src/. src/history.ts (154 lines, 51 executable) and
  src/history.test.ts (213 lines, 7 tests). EVERY TRACKED FILE UNDER src/ IS md5-IDENTICAL TO MERGED
  `main` 39e260d and `git diff --numstat 39e260d -- src/` IS EMPTY -- a byte-level result, stronger
  than the line-level check the last acceptance criterion asks for. Recorded with its instrument
  failure, because this board has learned that lesson four times: a `grep -vxF -f` line-presence
  check was tried FIRST and reported 13 to 81 "absent" lines per file, and it fails its own null
  control by identity -- comparing src/fen.test.ts with ITSELF it reports 13 absent lines. It is
  unsound on this input class and NO number is claimed from it; the md5 and git-diff results are the
  record.

  THE TWO SEAMS WERE IMPLEMENTED, NOT RE-OPENED. Six functions with SEAM 1's exact signatures, three
  fields, and NO cache / version counter / invalidation (SEAM 2). The one thing the language cannot
  express is named in the code rather than hidden: `GameHistory.moves` is `readonly Move[]` to
  callers and the module's own two mutators reach through it via a single named helper, because
  TypeScript has no "writable inside this module" modifier.

  THE DEPENDENCY CLAIM WAS MEASURED, NOT ASSERTED. Graph rebuilt from src/*.ts: 10 modules, zero
  cycles, max depth 6 -> 7, history.ts alone at level 7, all six edges downward (fen, apply, zobrist,
  gameend, plus the Move / Position types), NO import of legal.ts and none of san.ts, and it is the
  ONE MODULE WITH ZERO IMPORTERS -- which is what keeps the rules core ignorant of the session.
  memory-bank/30-architecture.md updated accordingly, including the bullet that read "who owns game
  history is an open decision, not a recorded one", which this ticket falsifies.

  EVERY ACCEPTANCE CRITERION HAS ITS OWN TEST AND EVERY TEST WAS PROVEN ABLE TO FAIL. Seven tests
  (the six the ticket names, plus one for the clamp criterion the six do not cover) against seven
  mutants of the shipped module, all seven killed: repetitionCounts dropping the CURRENT position
  (2 tests), keyHistory dropping the initial key (5), takeBack truncating but never replaying (2),
  takeBack's zero clamp removed (1), playMove not appending (6), playMove not applying (6),
  keyHistory off-by-one (1). The deep-equal INSTRUMENT was controlled rather than trusted: `toEqual`
  on a Map<bigint, number> proved to reject a differing count, a missing entry and an empty map while
  accepting a reordered equal map.

  GATES: 221 passed / 10 files / 0 failed (was 214 / 9), skip count 0 captured with the AGENTS.md
  command and not eyeballed; lint, typecheck and build all exit 0 (the same 2 pre-existing biome
  config-schema infos); src/history.ts at 100% statements / branches / functions / lines.

  ALL FIVE NFR BARS MEASURED AND MET, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64
  and `UNKNOWN - verify` on any other hardware. Out of tree in its own process, 11 rounds plus a
  discarded warm-up, cell order rotated every round, medians of per-round means, two independent
  samples; NO wall-clock assertion was added to the suite, which is this project's standing rule.
  At 120 plies: takeBack(2) 2.45 / 2.45 us against a 5 us bar (an UPPER BOUND -- the two restoring
  playMove calls sit inside the timed region and contribute ~0.025 us), keyHistory 40.66 / 40.51 us
  against 60, repetitionCounts 45.72 / 45.78 us against 75, gameStatusOf 49.33 / 48.99 us against 75,
  playMove 12.4 / 12.7 ns against 100 ns; and the growth check repetitionCounts @300 plies
  99.62 / 99.07 us against 150. Growth shape 18.06 / 17.99 us @ 40 plies -- linear with a constant
  offset, and at 300 plies still 10x under ADR-0002's own ~1 ms reopening threshold. Every figure
  reproduces SEAM 1's wave-1 numbers, which is a CHECK rather than a coincidence, since this is the
  first time the code being measured exists. plans/nfr-catalog.md was deliberately NOT edited -- that
  file's rows are Architect/Design's and Security/NFR's, the same division the ABC-011 Engineer kept.

  ONE ACCEPTANCE CRITERION CANNOT BE SATISFIED AS WORDED, AND IT IS HANDED TO BA/PM RATHER THAN
  QUIETLY REWRITTEN OR QUIETLY IGNORED. Criterion 2's first half asks gameStatusOf to return
  `result: "draw", reason: "threefold-repetition"`. src/gameend.ts cannot return that and its TYPE
  cannot express it: `threefold-repetition` is a `ClaimableDraw`, not an `EndReason`, because ABC-020
  ruled on FIDE 9.2.1 that the third occurrence is a draw the side to move MAY CLAIM and may just as
  well decline -- src/gameend.test.ts:68-92 pins the real shape. The only change that would satisfy
  the literal wording is a change to merged, Done, 100%-covered gameend.ts, which this ticket's
  `## Out of scope` forbids, and SEAM 1 fixes gameStatusOf as a one-line delegate. The criterion's
  INTENT is tested in full and green, and its second half is satisfied exactly as written. This is a
  second stale line on this ticket, of the same class as the trap-1 correction the Orchestrator made
  at the pull, and it is BA/PM's to fix.

  HANDED TO QE RATHER THAN ABSORBED, each with the reason: criterion 2's own test does NOT pin the
  BOARD half of takeBack (the truncate-but-never-replay mutant survives it and is killed by the
  criterion-5 and criterion-7 tests instead); the keyHistory off-by-one is killed by exactly ONE
  assertion; the double-push repetition test is still not written and was deliberately not added
  here, being in no acceptance criterion; playMove validates nothing, by SEAM 1's priced decision;
  and the `position` borrow is untypeable and untested, with takeBack rebuilding the borrowed object
  IN PLACE so a held reference stays valid.

  ABC-009, ABC-010 and ABC-022 are carried, not fixed. The start FEN is now literal in FIVE files
  rather than four -- `## Out of scope` forbids the shared constant and every test file here already
  declares its own. SUBSTRATE DEGRADATION CARRIED FORWARD: no scripts/claim.js and no
  scripts/context-io.ts, so the queue file moved pending -> claimed -> done BY HAND and the four
  context notes are hand-written in the schema's exact shape; `finding` is inadmissible with no §14
  gate to issue a stamp and NOTHING WAS SELF-STAMPED -- the kinds used are decision, observation,
  claim and artifact-ref. NO PR -- this repo has no git remote, so there is nowhere to push and none
  was invented. Nothing was merged and nothing was deployed; a human holds both.

  ---
  ENTERED 2026-08-04 by the Orchestrator (task `ticket-to-pr-ABC-012`, Workflow 04): ABC-012 pulled
  `Ready` -> `In Development`, the one board move this role owns on the way in. Ready 5/8 -> 4/8,
  In Development 0/3 -> 1/3. Both under limit; no override needed and none taken.

  PULLED DIRECT FROM `Ready`, WITH NO DESIGN HOP, AND THAT IS A DECISION WITH A REASON RATHER THAN A
  SHORTCUT. The two prior occupants of `In Design` -- ABC-020 and ABC-011 -- were each pulled there
  for a written reason quoted from the ticket itself (`### Open design question -- hand to
  Architect/Design at the design hop, do not decide in dev`). ABC-012 carries no such line, and it
  carries none because its two seams were already closed by Architect/Design AT DECOMPOSITION on
  2026-07-30: SEAM 1, the history module's exact API (note
  `20260730T143500Z-architect-design-decision-d7a42f7a`), and SEAM 2, that the derived counts are NOT
  memoized (note `20260730T143800Z-architect-design-decision-38b772b6`), both in the
  `epic-to-tickets-EPIC-002` context folder. The ticket's own `## Source` section says it implements
  those decisions and does not re-open them. `In Design` stays 0/2.

  DEFINITION OF READY RE-CHECKED AT THE PULL AGAINST MERGED `main`, not assumed from the 2026-07-30
  promotion -- the ABC-020 / ABC-011 precedent. The ticket's central premise was VERIFIED rather than
  read off the ticket: `gameStatus`'s `positionCounts` is still optional (src/gameend.ts:135,
  `positionCounts?: ReadonlyMap<bigint, number>`) and still has NO SUPPLIER anywhere in src/, and
  src/history.ts does not exist. Problem, scope/out-of-scope, INVEST (independent -- parseFen/toFen,
  makeMove, gameStatus and zobristKey are all merged on main), acceptance measurable (byte-identical
  FEN strings, an exact array length of N + 1, an exact count of 3 rather than 2, an exact prefix
  property, a no-throw clamp on an over-large takeBack, five numeric microsecond bars each recorded
  with its ply count and its machine class), dependencies (none blocking), NFR triggers with numbers
  and an explicit "no security trigger" with its reason, test notes naming six tests and three traps,
  size M, priority P0, no blocker. ADR-0002 (all four clauses) and ADR-0004 are both RATIFIED, so the
  unratified-ADR situation that held ABC-013 in Blocked on 2026-07-30 does not repeat here.

  THE ABC-011 SEQUENCING CONSTRAINT IS DISCHARGED, NOT PENDING. ABC-011 was deliberately pulled ahead
  of this ticket on 2026-08-02 because ABC-012's own Dependencies section says "the two must not be
  built in the order that bakes the defect into this module's tests". ABC-011 merged to main on
  2026-08-04. The order held; this is the consumer it was held for.

  ONE LINE OF THE TICKET IS NOW STALE AND IS CORRECTED IN THE CONTEXT NOTE, NOT IN THE TICKET --
  ticket text is BA/PM's and this role does not edit it. `## Test notes` trap 1 requires test 1 to use
  a repeated line that never sets an en-passant square, BECAUSE src/zobrist.ts hashes the ep file
  whenever epSquare is set, and adds that this makes the test "blind to ABC-011". That rationale
  describes the PRE-ABC-011 tree. On merged main, src/zobrist.ts:85 reads
  `epSquare !== NO_SQUARE && hasLegalEnPassant(position)`, so a repeated line containing a double push
  with no available capture now hashes EQUAL. Three things follow and none of them is a gate: the
  instruction is still correct and still cheap to follow (src/gameend.test.ts:27-58 already holds the
  knight cycle it names); the "blind to ABC-011" sentence must not be carried forward as current; and
  whether to ADD a double-push repetition test is DELIBERATELY NOT ORDERED here, being in no
  acceptance criterion -- it is named for the QE gate, which owns adversarial coverage.

  ONE TICKET, NOT SEVERAL, against a limit of 3. ABC-014 is pullable for the first time since the
  ABC-015/RISK-005 knot was untied, and ABC-009 and ABC-022 are unblocked -- but ABC-019 blocks on
  ABC-012, four epics rest on this module, and a second concurrent ticket buys throughput this
  project has no way to spend while costing review attention it does. Full reasoning:
  .grugops/context/ticket-to-pr-ABC-012/notes/20260804T120000Z-orchestrator-decision-f066a9d0.md

  Nothing was merged from this branch and nothing was deployed -- a human holds both. The merge that
  DID happen today was BA/PM's refinement branch to main on explicit human instruction, recorded in
  the header comment above, and it is not standing authorization.
-->

<!--
  EMPTIED 2026-08-03 by the Software Engineer for the SECOND time on this ticket: ABC-011's MEDIUM
  purity defect fixed with tests and a green mandatory gate, moved In Development -> In Review.
  WIP 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override taken, no written reason
  owed. The In Development -> In Review exit is the one board move this role owns.

  BOTH GUARDS BUILT, AND EACH PROVEN LOAD-BEARING BY DELETING IT RATHER THAN BY ARGUING FOR IT.
  The board's own warning above was the right one to write down. Measured against the final tree:

    guard (a) deleted (empty-target / ANSWER)   -> exactly 4 tests fail, and they are ONLY the two
                                                   pure-divergence FENs, at predicate AND key level
    guard (b) deleted (captured-pawn / PURITY)  -> exactly 7 fail: the three empty-target
                                                   corruptions at both levels, plus the
                                                   every-input purity sweep
    both deleted (= the code the owner declined) -> 13 fail, 193 pass -- exactly the pre-fix baseline

  THE TWO FAILURE SETS ARE DISJOINT. Neither guard subsumes the other and neither can be deleted
  with the suite green, so the one-line simplification the Ready for Dev comment warned about is
  now caught by a named test rather than by a comment.

  ONE HONESTY NOTE THE NUMBERS DESERVE: `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` (QE's third
  reproduction) is closed by EITHER guard alone, so it kills neither single-guard mutant. It is
  named rather than counted as evidence for one guard.

  Suite 206 passed / 9 files / skip count 0 (was 193). lint, typecheck, build all exit 0.
  NO EXISTING TEST MODIFIED -- zero changed pre-existing lines in either test file, verified by
  line-level diff; not even an import was widened this pass, which is stricter than the first pass
  managed. Nothing was merged and nothing was deployed; a human holds both.

  ---
  PULLED 2026-08-03 by the Orchestrator from Ready for Dev, the second pull on this ticket. WIP
  0/3 -> 1/3; no limit approached, no override taken. See the Ready for Dev comment above for the
  Definition-of-Ready re-check and why the fix is two guards rather than one.

  The engineer builds the SECOND `### ANSWERED 2026-08-03` block on the ticket. The reading and the
  fix contract are settled; TDD and the implementation are still the engineer's. The bar that decides
  whether the fix is right is unchanged from the first pass and is now sharper: the predicate leaves
  the position byte-identical on return for EVERY input, not merely for reachable ones, and the
  answer is specified rather than inherited where the board contradicts the ep square.
-->

<!--
  EMPTIED 2026-08-03 by the Software Engineer: ABC-011 implemented with tests and a green
  mandatory gate, moved In Development -> In Review. WIP 1/3 -> 0/3. The In Development ->
  In Review exit is the one board move this role owns.

  ---
  PULLED 2026-08-02 by the Orchestrator from Ready for Dev -- the one board move this role owns on
  the way in. WIP 0/3 -> 1/3; no limit approached, no override taken. See the Ready for Dev comment
  above for the Definition-of-Ready re-check, the ADR-0005 blocking check, and why a P1 was pulled
  ahead of two P0s.

  The engineer builds the `### ANSWERED` block on the ticket exactly as ratified: the strict-FIDE
  reading, `hasLegalEnPassant` exported from src/legal.ts, and one changed condition at
  src/zobrist.ts:71 with the `epSquare !== NO_SQUARE` guard FIRST so the no-ep path is untouched.
  The reading is settled; TDD and the implementation are still the engineer's.

  ---
  EMPTIED 2026-07-31 by the Software Engineer: ABC-020 implemented with tests and a green
  mandatory gate, moved to In Review. WIP 1/3 -> 0/3. The In Development -> In Review exit is
  the one board move this role owns.

  PULLED 2026-07-31 by the Orchestrator from Ready for Dev -- the one board move this role owns on
  the way in. WIP 0/3 -> 1/3; the column takes ONE ticket, not three, because ABC-020 must merge
  before ABC-019 and ABC-016 and pulling a second ticket now would invite a merge order the board
  has twice recorded as load-bearing.

  Why this ticket first among the P0s: ABC-012/014/018/019 are P0 because the product does not
  exist without them. ABC-020 is P0 because the product plays chess by the wrong rules -- a
  different P0, and the owner's 2026-07-31 directive orders the two.

  Emptied 2026-07-23: ABC-003 moved to In Review once implemented with tests and a green
  mandatory gate. In lean mode a ticket needing neither analysis nor design flows
  Ready → In Development → In Review with no intermediate hop.
-->


## In Review (WIP 1/3)

- [ABC-009] legalMoves mutates the position it documents as unchanged  (size: S, P1, epic: EPIC-001, deps: none; RETURNED from Ready for UAT 2026-08-09 — acceptance criterion A11 NOT MET, ~9 test rows owed and ZERO production lines; code correct and unchanged, `src/moves.ts` md5 0e247853 identical to the Engineer's first commit; branch `grugops/ticket-to-pr-ABC-009`, suite 356/356 skip 0, deep lane 32/32, NFR-001 MET)

<!--
  EMPTIED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-review`,
  Workflow 04) on a PASS WITH RISKS verdict. **ABC-009 moved In Review -> In Security/NFR, the one
  exit this role owns.** In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no
  override taken, no written reason owed. NFR-001 is triggered, so In Security/NFR is the correct
  next column rather than UAT. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.
  The full QE record is in the In Security/NFR comment below, in the ticket's `## QE` section and in
  `.grugops/context/ticket-to-pr-ABC-009/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS PAID, AND THE HEADLINE IS THE DISTINCTION: 62 mutants were run against
  the delivered diff and FIVE survive the ENTIRE net -- all twelve criteria, all 337 delivered tests
  AND the PERFT_DEEP=1 lane at 32/32 -- and NOT ONE of the five is a defect in the code. All five are
  defects in the CRITERIA. The delivered fix is correct on every position that exposes them, which is
  why this is a PASS and not a return to dev. src/moves.ts is byte-identical to the Engineer's commit
  8f540cf (md5 0e247853ab2c05887c76105ff83d8621, the digest they published) and
  `git diff 8f540cf -- src/moves.ts` is EMPTY.

  THE FIFTH MUTANT THE ENGINEER HANDED OVER TO BE DECIDED: the colour-blind equivalence argument
  HOLDS and NO CRITERION IS OWED. Corroborated on a differently-built instrument -- 12,584 positions
  that parseFen ACCEPTS, varying three squares jointly, three king placements, BOTH rights at once
  and the black-to-move mirror, against the Engineer's 9,604 over two squares plus one extra piece --
  with zero divergence at generateMoves, at legalMoves and on purity. A colour criterion would pass
  on main's unfixed tree, on the fix and on the mutant alike: unfalsifiable, therefore theatre. The
  Engineer's disposition was right on both halves.

  THE SOFT SPOT NOBODY HAD EXAMINED IS NOW EXAMINED, and it is where all five live. A criterion set
  written over signals that AGREE hides the dimensions it holds CONSTANT, and two are held constant
  across all twelve rows:
    G-1  THE IMPOSTOR'S PIECE TYPE. A5/A6 use a bishop and a knight -- "at least two piece types"
         satisfied literally -- but the rule quantifies over ALL other bytes. A guard reading either
         home square as "the mover's KING/ROOK **or QUEEN**" is green on everything, and on
         4k3/8/8/8/8/8/8/K3Q2R w K - 0 1 one legalMoves call DESTROYS A QUEEN and writes a king over
         it: the ticket's own family-2 harm on the most valuable piece on the board.
    G-2  HOW MANY OF A SIDE'S RIGHTS ARE HELD. Every criterion FEN carries at most one right per side
         except the reproduction FEN, where BOTH castles are invalid -- so no criterion asks whether a
         VALID castle survives when its sibling is bogus, and nothing separates "this option was
         rejected" from "the option loop was abandoned". `continue` -> `break` on the ROOK guard
         DELETES A LEGAL CASTLE on 4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1 (16 moves / 1 castle becomes
         15 / 0) and is green on all twelve. The SAME mutation on the KING guard is genuinely
         equivalent, because both options share kingFrom. One token, two opposite verdicts, one green.

  A8 AND A9 CANNOT COVER EITHER DIMENSION, STRUCTURALLY -- and by the Engineer's own argument: in any
  position reachable from a legal start the right being set implies both pieces are home, so the two
  new guards NEVER FIRE and a mutation to them cannot change a perft node. Measured, not argued: all
  five survive PERFT_DEEP=1 at 32/32. The same argument that makes the fix safe for legal play makes
  the whole perft apparatus unable to certify it.

  CLOSED IN TESTS ONLY -- ZERO PRODUCTION LINES. src/moves.castling.hardening.test.ts is NEW (19
  tests, all passing on the delivered fix); the Engineer's src/moves.castling.test.ts is UNTOUCHED;
  and every one of the FOURTEEN test files that exist on main is unmodified, checked by diffing each
  INDIVIDUALLY, so A8's line-level requirement holds for this role's work too. The rows are proved
  load-bearing by re-running the whole campaign with them present: 47 -> 53 killed, 15 -> 9 survived,
  and SIX mutants die to these rows AND NOTHING ELSE in the suite. The nine behaviour-equivalent
  survivors STILL SURVIVE -- these rows kill zero of them, which is what proves they pin observable
  behaviour rather than the shape of the implementation.

  A7 KILLED NOTHING ACROSS 62 MUTANTS. The ticket already says it asserts count EQUALITY rather than
  correctness; that was measured on one build at refinement and is now measured on 62. Keep it as the
  standing purity walk `## Test notes` 2 asks for, but its green is not evidence about this fix.

  ROUTED AND NOT DISCHARGED HERE: G-1 and G-2 to BA/PM as CRITERIA text (this role does not edit
  `## Acceptance`), A7's null discrimination to BA/PM, and the castling-right test being guarded in
  the whole suite only by a 40-second opt-in lane (A9 kills it at 31/32; these new rows now kill it in
  the default lane too -- not charged against ABC-009, since the right is not one of the two BOARD
  preconditions this ticket owns).

  NFR-001 WAS NOT RE-MEASURED BY THIS ROLE, deliberately -- that gate follows and owns it. No
  throughput figure anywhere in this role's output is its own. The part of the Engineer's measurement
  that matters is its caveat: the per-cell floor is ~+/-1%, larger than any signal, so KIWIPETE'S
  0.9930 IS NOT A REGRESSION and only the aggregate against the 0.98 bar is load-bearing.

  ABC-022's HALF (b) IS STILL LIVE BY DESIGN. This ticket fences it and closes nothing there; not
  tested here and not reported as a miss.

  Test-integrity checker exit 2 (`.grugops/test-skips.md` absent, confirmed with ls) recorded as an
  ERROR and NOT as a pass; NO registry file was created, an agent may not author a justification to
  clear its own gate. E2E and the auto-UAT oracles are `UNKNOWN - verify`, not green.

  SECURITY/NFR WAS NOT ENQUEUED BY THIS ROLE -- the Orchestrator owns decompose->enqueue; this role
  took one board move and stopped.
-->

<!--
  ENTERED 2026-08-09 from In Development, by the Software Engineer (task `ticket-to-pr-ABC-009`,
  subtask `engineer-abc009-implement`, Workflow 04). In Review 0/3 -> 1/3. QE/E2E owns this
  column's exit. The implementation record is in the In Development block above and in the
  ticket's `## Implementation` section; it is not restated here.

  FOUR THINGS ARE HANDED OVER NAMED RATHER THAN LEFT TO BE DISCOVERED:

  (1) SEVEN DEFECTS IS STILL NOT PROVEN COMPLETE, AND THIS HOP DID NOT CLOSE THAT. Open item (1)
      came in open and goes out open. What this hop CAN add is that five mutants were run against
      the delivered diff and the twelve criteria killed four of them cleanly, in disjoint named
      sets; the fifth survives and was PROVED behaviour-equivalent over 9,604 boards rather than
      excused. So no criterion gap has been found -- but only five mutants were tried, against
      ABC-018's 56, and a mutation campaign is QE's instrument, not this role's. EXPECT MORE.
  (2) THE TWO PLACES BA/PM SAID IT WOULD LOOK FIRST ARE STILL UNEXAMINED BY ANYONE. Its claim note
      named them: a criterion set written entirely over signals that AGREE, and the interaction
      between a new precondition and the existing `option.empty` / `option.kingPath` tests. This
      hop touched the second one only incidentally -- the equivalence result above is exactly that
      interaction, and it shows the through-check test MASKS the colour dimension. Whether it masks
      anything else is not established here.
  (3) A6 IS ASSERTED ONLY ON THE OFFER, AND THAT IS STRUCTURAL, NOT AN OVERSIGHT. Family 3 leaves
      the position byte-identical -- the make/unmake pair round-trips the impostor exactly -- so no
      purity assertion can ever see it and only the FLAG_CASTLE count can. Re-verified here rather
      than inherited. A reviewer looking for a purity row on A6 will not find one and should not.
  (4) ABC-022's HALF (b) IS STILL LIVE AND THAT IS INTENDED. `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`
      still writes a phantom black pawn onto a2 on one legalMoves call. No line of `addPawnMoves`
      was changed and no FLAG_EN_PASSANT behaviour was touched, which is the fence the ticket's
      `## Out of scope` draws. `## Scope` bullet 1 is scoped "on the castling route" for exactly
      this reason, and ABC-022's ticket was NOT edited.

  NOT ENQUEUED BY THIS ROLE: QE/E2E and Security/NFR. The Orchestrator owns the decompose->enqueue
  step; this role took one board move and stopped. NOTHING MERGED AND NOTHING DEPLOYED.
-->

<!--
  EMPTIED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-018`, subtask `qe-abc018-review`,
  Workflow 04) on a PASS verdict. ABC-018 moved In Review -> In Security/NFR, the one exit this
  role owns. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no override
  taken, no written reason owed. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.
  The full QE record is in the In Security/NFR comment below, in the ticket's `## QE` section and
  in `.grugops/context/ticket-to-pr-ABC-018/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS PAID, AND IT WAS NOT PAID BY RE-READING THE MODULE. 56 mutants, 75
  mutate-and-restore cycles, SIX of which passed all twelve acceptance criteria AND all 297
  delivered tests. All six are now dead. The production module was NOT changed -- src/frame.ts is
  byte-identical to the Engineer's commit d88a1f0 (md5 bb827f52fe537817e40020a29dfa0e6d, the
  digest they published) and `git diff --stat d88a1f0 -- src/frame.ts` is EMPTY.
-->

<!--
  ENTERED 2026-08-09 from In Development, by the Software Engineer (task `ticket-to-pr-ABC-018`,
  subtask `engineer-abc018-implement`). In Review 0/3 -> 1/3. QE/E2E owns this column's exit.
  The implementation record is in the In Development block above and in the ticket's
  `## Implementation` section; it is not restated here.

  THREE THINGS ARE HANDED OVER NAMED RATHER THAN LEFT TO BE DISCOVERED:

  (1) THE ACCEPTANCE CRITERIA ARE BLIND TO A SINK WHOSE isTTY OR rows IS ABSENT, WHICH IS THE REAL
      SHAPE NODE PRESENTS ON A PIPE. Every one of the twelve criteria names a row count, so a
      writer reading an absent row count as UNLIMITED, and one reading an absent isTTY as a
      TERMINAL, pass all twelve. Both were found by mutation while implementing; the SUITE now
      covers them with a test that writes to three sinks with missing signals, but the CRITERIA
      still do not. This is ABC-015's QE finding a second time, on the same class of gap, and it
      is BA/PM's to close if they want it closed. It is NOT a defect in the delivered code.

  (2) ACCEPTANCE CRITERION 1 IS NEAR-VACUOUS UNDER THE STUB PANELS, EXACTLY AS BA/PM RULED. It is
      implemented as strongly as stubs allow -- a frame is assembled at EVERY ply of a real 300-ply
      game (a legal knight shuffle, so the ply count is real rather than a position that merely
      looks like one) and every row count must be identical -- but a fixed-height stub makes any
      assembler pass. QE should treat it as an integration obligation for ABC-019 / EPIC-006, not
      as evidence delivered here. The falsifiable weight sits in the criterion beneath it, which
      varies message content and thinking state in one run.

  (3) W = 18 IS A STUB FIXTURE AND THE SUITE DERIVES IT RATHER THAN ASSERTING IT INTO EXISTENCE.
      It falls out of the merged renderBoard, the widest real panel that exists. When ABC-016 and
      ABC-017 ship, W becomes whatever the widest of the three emits; one test already pins that
      by handing in a 24-wide status stub. The reserved prompt row's contract likewise still has
      only ONE SIDE written down -- this ticket reserves the row and leaves the cursor at its
      start; EPIC-003 and ABC-019 have not been told. That is the Orchestrator's open item.
-->

<!--
  LEFT 2026-08-08 by QE/E2E (task `ticket-to-pr-ABC-015`, subtask `qe-abc015-review`, Workflow 04)
  on a PASS verdict. ABC-015 moved In Review -> In Security/NFR, the one exit this role owns.
  In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no override taken.
  The full QE record is in the In Security/NFR comment below and in the context notes under
  `.grugops/context/ticket-to-pr-ABC-015/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS PAID, AND IT WAS NOT PAID BY RE-READING THE CODE. A 29-mutant campaign
  found THREE mutants that passed all eleven acceptance criteria AND all 271 delivered tests while
  being real production defects. All three are now dead. The production module was NOT changed --
  `src/glyph-mode.ts` is byte-identical to the Engineer's after 58 mutate-and-restore cycles.
-->

<!--
  ENTERED 2026-08-08 from In Development, by the Software Engineer (task `ticket-to-pr-ABC-015`,
  subtask `engineer-abc015-implement`). In Review 0/3 -> 1/3. QE/E2E owns this column's exit.
  The implementation record is in the In Development block above and in the ticket's
  `## Implementation` section; it is not restated here.

  TWO THINGS ARE HANDED OVER NAMED RATHER THAN LEFT TO BE DISCOVERED:

  (1) THE EMPTY-LOCALE-VARIABLE READING IS THE ENGINEER'S OWN CALL, not the ticket's. None of the
      nine tuples constructs `LANG=`, so "the first SET of LC_ALL / LC_CTYPE / LANG" had to be
      defined; it is defined as POSIX defines it (empty = unset, fall through) and two tests pin it.
      If that reading is wrong, it is wrong in production and no acceptance criterion would catch it.

  (2) ACCEPTANCE CRITERIA 10 AND 11 ARE BLIND TO A SESSION THAT READS ONLY ONE OF THE TWO AMBIENT
      SIGNALS. Both are written over ambients where isTTY and the locale AGREE, so a session that
      hardcoded isTTY, or forwarded only LANG, passes both. Found by mutation while implementing;
      the SUITE now covers it with a test that isolates each signal, but the CRITERIA still do not.
      That is a gap in the ticket, not in the code, and it is BA/PM's to close if they want it closed.

  EXITED 2026-08-07 by QE/E2E (task `ticket-to-pr-ABC-014`, subtask `qe-abc014-break`, Workflow 04)
  on a PASS verdict: ABC-014 -> In Security/NFR. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2;
  NO LIMIT APPROACHED, no override taken, no written reason owed. The In Review exit is the one
  board move this role owns. Nothing was merged and nothing was deployed -- a human holds both.

  VERDICT: PASS. Reached by BREAKING the module. The Engineer's numbers were re-run only as a
  control and they reproduce: 243/243 on 11 files before this pass, skip count 0 by the AGENTS.md
  command, lint/typecheck/build exit 0, src/render.ts 100% on all four coverage axes, and its md5 is
  733bc67fec523a7f41016bea2b026e1d -- the figure the Engineer published, which is the independent
  confirmation that this gate changed no production code either. NO DEFECT WAS FOUND IN
  src/render.ts. Everything below is a hole in the SUITE, which is where the last three review
  passes on this board also landed.

  10 NEW MUTANTS, of which ONE SURVIVED ALL 17 DELIVERED TESTS:
    - a board byte outside EMPTY and the twelve real pieces drawing a "?" PLACEHOLDER instead of
      throwing -- SURVIVED. The Engineer named the throw as a deliberate decision (ticket
      `## Out of scope` puts position validity on ABC-009/ABC-010; AGENTS.md rule 8 forbids handling
      a scenario that cannot occur) but nothing pinned it, and the alternative failure mode is
      SILENT: a placeholder widens the cell to 10 characters and breaks the constant geometry
      ABC-018 and epic 4a stand on, and no other test in the file would notice. Now pinned by a
      characterization test that is its ONLY killer.
  The other nine all died. Four of the Engineer's own were re-run as a control rather than
  inherited: M1 (shade from the screen position) and M12 (dark/light swapped) DO now die to
  criterion 6's own test, which is the Engineer's headline claim and it holds; M13 and M4 die too.

  TWO DELIVERED ASSERTIONS WERE MEASURED BLIND, NOT ARGUED BLIND:
    (1) CRITERION 2's last clause is UNFALSIFIABLE as written. `expect(black).not.toEqual([...white]
        .reverse())` reverses all NINE rows, which moves the file-label row to index 0 where the
        black-bottom frame has a board row -- so the two can never be equal whatever the renderer
        did. Demonstrated by running the exact defect the clause exists to catch (files never
        mirrored, a rank-only flip): the delivered form PASSES on the mutant, the board-rows-only
        form FAILS. The criterion's INTENT was already green through the "king before queen"
        assertion beside it; only this clause was empty.
    (2) CRITERION 1's file-label assertion is `.trim()`-ed, so it cannot see the label row shifted a
        column. A mutant that shifts every letter one left -- same 18-character width, trailing
        space at the end of the frame, labels no longer over their files -- is killed by 8 tests,
        and NOT ONE of them is an acceptance-criterion test: two hand-written frames and six
        snapshots carry it alone. The same is true of a shading inversion confined to rank 5.

  22 OF THE 24 SNAPSHOTS WERE HANDED OVER AS UNVERIFIED. They are now PROVEN, not re-eyeballed: a
  frame oracle derived from the FEN TEXT -- a second FEN reader that never touches parseFen,
  squareAt or the 0x88 layout, with the shading built by walking out from a1 and flipping rather
  than by the module's (file + rank) % 2 -- asserted against all 24 matrix cells. It kills 8 of the
  10 mutants on its own, so it is not a tautology.

  CLOSED BY 10 TESTS THIS GATE ADDED, each aimed at a mutant that actually survived or at an
  assertion measured blind: the FEN-text oracle; the all-empty board and the fully-occupied board
  (NO delivered test could reach either -- every one enters through parseFen, which requires exactly
  one king per side, so the suite only ever exercised the FEN-LEGAL slice of a `Position`); the 64
  off-board squares of the 0x88 array proven never to reach the frame; the raw 128-byte board
  compared before and after on all 24 cells (the delivered purity test asserts through toFen, on one
  FEN, and was the ONLY killer of the clear-as-you-read mutant -- now 3); the placeholder
  characterization; the untrimmed label row with every letter proven to sit in its own file's glyph
  column and no trailing whitespace anywhere; epic amendment [A4] as a property (no ANSI escape and
  no control character in any frame, which is also the executable form of this ticket's "no security
  trigger" rationale that Security/NFR gates next); 18 CODE POINTS as well as 18 UTF-16 units; and
  the falsifiable form of criterion 2's last clause.
  Suite 243 -> 253 passed / 11 files / skip count 0; lint 0 errors (the same 2 pre-existing biome
  config-schema infos), typecheck and build exit 0; src/render.ts still 100% on all four axes.

  THE FIVE ITEMS THE ENGINEER HANDED FORWARD ARE EACH ADJUDICATED FROM THE EVIDENCE:
  (1) THE PURITY CRITERION HAS EXACTLY ONE KILLER -- CONFIRMED by re-running that mutant, and now
      CLOSED: 3 independent killers, one of which does not route through fen.ts at all.
  (2) "a1 AND h8 ARE DARK" NOW ENCODES A CHARACTER CHOICE -- UPHELD, and the cost is stated rather
      than hidden: this gate INCREASED it. Changing the shading characters now moves 3 assertions,
      2 hand-written frames, the all-empty-board frame and one oracle constant. That is the right
      trade -- an assertion that names no character is symmetric under inverting the whole colouring,
      which is exactly how two mutants survived -- but a reviewer who wants different characters
      should know it is 7 places, not 3.
  (3) 22 OF 24 SNAPSHOTS NOT HAND-VERIFIED -- CONFIRMED, and CLOSED by the oracle above.
  (4) NOTHING IMPORTS src/render.ts YET -- CONFIRMED and NOT closable here. It is ABC-018's.
  (5) THE POSITION IS TRUSTED AND A BAD BYTE THROWS -- VERIFIED TRUE (TypeError on bytes 7, 8, 15,
      200 and 255) and now pinned. This was the one surviving mutant.

  NO E2E WAS WRITTEN AND NONE COULD BE, stated plainly rather than skipped quietly: AGENTS.md's E2E
  command is `UNKNOWN - verify`, `quality.ui_e2e` is `ui-or-critical-path` and this project has no UI
  surface and no CLI entry point until EPIC-006. Nothing imports this module, so there is no caller
  to drive. Reported as a gap; no fake E2E was invented to fill the slot.

  FLAGGED, NOT FIXED (each belongs to someone else's file):
    - THE SNAPSHOT NET IS "WRITE-IF-MISSING" BY DEFAULT. Measured: with the snapshot file removed
      and no `CI` in the environment, `npx vitest run src/render.test.ts` passes 17/17 and WRITES 24
      snapshots; with `CI=true` it fails 6 instead. This project has no CI, so the gate is always run
      without it. The two defect classes above that only snapshots and hand-written frames caught are
      now also caught by property tests, so the exposure is reduced -- but the remedy is a one-word
      change to the AGENTS.md test command, and AGENTS.md's command table is not this role's file.
    - U+2654-U+265F EAST-ASIAN-WIDTH AMBIGUITY -- carried forward to ABC-018 and RISK-005 exactly as
      the Engineer left it. `UNKNOWN - verify` on this gate's instruments: a string width and a
      terminal COLUMN width are different things and no in-process test can read the second.
    - plans/nfr-catalog.md's NFR-002 row is still owed the measured compute half; ABC-014's ticket
      frontmatter still reads `in-development`; plans/metrics.md is still stale. All three are the
      Architect/Security and Orchestrator divisions the Engineer already flagged, unchanged here.

  ---
  ENTERED 2026-08-06 by the Software Engineer (task `ticket-to-pr-ABC-014`, subtask
  `engineer-abc014-implement`, Workflow 04). In Review 0/3 -> 1/3; no limit approached, no override
  taken. The full implementation record — the layout decision, the 18-mutant campaign, the NFR
  measurement with its machine, the five items handed to QE and the three flagged-not-fixed — is in
  the In Development comment above and in the context notes under
  `.grugops/context/ticket-to-pr-ABC-014/notes/`; it is not restated here.

  THE EXIT FROM THIS COLUMN IS QE/E2E'S. Security/NFR then gates NFR-002's board-frame bar; this
  ticket has NO security trigger (it renders bytes from position.board and no user-supplied string
  reaches it — the escape-sequence trigger is ABC-018's message region).

  ---
  EXITED 2026-08-04 by QE/E2E (task `ticket-to-pr-ABC-012`, subtask `qe-abc012-review`, Workflow 04)
  on a PASS verdict: ABC-012 -> In Security/NFR. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2;
  NO LIMIT APPROACHED, no override taken, no written reason owed. The In Review exit is the one
  board move this role owns. Nothing was merged and nothing was deployed -- a human holds both.

  VERDICT: PASS. Reached by BREAKING the module, not by re-running the Engineer's numbers. Those
  were re-run only as a control and they reproduce: 221/221 on 10 files before this pass, skip count
  0, lint/typecheck/build exit 0, git diff --numstat 39e260d -- src/ empty.

  THE PART THAT EARNED THE VERDICT: 21 mutants of the shipped src/history.ts, of which 7 are the
  Engineer's re-run as a control on its own table and 14 are this gate's own. The Engineer's seven
  all die as reported. THREE OF THIS GATE'S FOURTEEN SURVIVED ALL 221 DELIVERED TESTS, and all three
  are the same shape -- resetTo, the helper takeBack rebuilds the borrowed Position with, silently
  not copying one of its six fields:
    - resetTo never copies `castling`  -- SURVIVED. makeMove only ever CLEARS castling rights, so a
      replay that starts from a position which has already lost one converges on the same answer,
      and NO acceptance test ever takes back the move that lost a right. "Undo does not give a
      castling right back" is one of the classic undo defects and nothing pinned it.
    - resetTo never copies `blackToMove` -- SURVIVED. makeMove TOGGLES the side to move, and all
      three acceptance tests that take back do so from an EVEN ply count (40, 40 and 8), where two
      wrongs cancel exactly. The suite could not see a wrong side to move.
    - resetTo never copies `epSquare` -- SURVIVED. makeMove sets the ep square on every move, so any
      replay of one or more moves hides a stale one; the only acceptance test that truncates to ZERO
      plies anchors at the start position, where the ep square is empty either way.
  ONE ROOT CAUSE, and it is the honest summary of the delivered suite: every acceptance test anchors
  at the START position and takes back only at EVEN ply counts. src/history.ts is CORRECT on all
  three -- these were holes in the SUITE, not defects in the module, which is the same way both
  ABC-011 review passes landed.

  CLOSED BY 5 TESTS THIS GATE ADDED, each aimed at a mutant that actually survived rather than at an
  imagined one, plus ONE assertion added to criterion 2's own test. Suite 221 -> 226 passed / 10
  files / skip count 0; lint, typecheck and build all exit 0; src/history.ts still 100% on all four
  coverage axes. NO PRODUCTION CODE WAS CHANGED -- src/history.ts is md5-identical to the Engineer's
  (12f8c562d46286e68383f8e2cab407fa) after 21 mutate-and-restore cycles.

  THE THREE ITEMS THE ENGINEER HANDED FORWARD ARE EACH ADJUDICATED FROM THE EVIDENCE:
  (1) CRITERION 2 CANNOT BE SATISFIED AS WORDED -- UPHELD, and verified with the COMPILER rather
  than by reading: `const bad: GameStatus = { result: "draw", reason: "threefold-repetition" }` is
  TS2820, while the null control `reason: "stalemate"` compiles clean, so the probe is not vacuous.
  The criterion's INTENT is met and GREEN. The wording is routed to BA/PM; neither the ticket nor
  merged gameend.ts was edited. One thing for BA/PM that was NOT on the ticket: gameStatusOf CAN
  return `result: "draw"` for repetition -- at FIVEFOLD, which is automatic (FIDE 9.6.1) -- so the
  criterion has a satisfiable re-wording in either direction, and this gate added the fivefold test
  that had never been written.
  (2) CRITERION 2'S TEST DOES NOT PIN THE BOARD HALF OF takeBack -- CONFIRMED by measurement, and
  now CLOSED. One toFen assertion against a core-primitive oracle; the truncate-but-never-replay
  mutant now dies to that test, and to 6 tests in all rather than 2.
  (3) TWO MUTANTS DIE TO EXACTLY ONE ASSERTION -- CONFIRMED, and both now have two INDEPENDENT
  killers: the keyHistory off-by-one (a new test checking every key against a parseFen+makeMove
  oracle, 13 assertions instead of 1) and the zero clamp (a tightest-possible over-run, plies =
  length + 1, where the removed clamp silently keeps a DIFFERENT game rather than an obviously
  empty one).

  TWO CORRECTIONS OF RECORD, neither blocking, both to figures this project would otherwise carry:
  (a) THE `grep -vxF -f` INSTRUMENT IS NOT UNSOUND -- THE SHELL'S `grep` IS NOT grep. Reproduced the
  Engineer's identity null control exactly (13 on src/fen.test.ts, 73 on gameend, 81 on apply), then
  found the cause: those counts ARE the files' blank-line counts, 1:1 across four files, because
  `grep` in the agent shell is a function shimming to ugrep 7.5.0, which does not match an empty
  -F -x pattern against an empty line. /usr/bin/grep returns 0 on the identity control for all four.
  The Engineer's decision to claim no number from it was right; the DIAGNOSIS was wrong, and leaving
  it would teach the next role to distrust a sound idiom instead of a shimmed binary. EVERY
  grep-based instrument built in this environment is running ugrep.
  (b) `npx vitest run --coverage` DOES NOT DELETE 22 TRACKED FILES. coverage/ is tracked (22 files)
  and unignored -- that premise holds and the hazard is real -- but measured under a controlled
  restore: the PLAIN command deletes 0 and MODIFIES 15; the filtered command the Engineer's
  artifact-ref actually records deletes 12 and modifies 3. Both were reproduced and both restored
  byte-identically (git diff 3a44b3f -- coverage empty). THE MITIGATION, verified: run coverage with
  --coverage.reportsDirectory pointed outside the repository and coverage/ is untouched. Security/
  NFR runs coverage next and should use it.

  DEFECTS AND GAPS NAMED, NOT FIXED (QE does not change production code):
    - takeBack(history, NaN) SILENTLY DISCARDS THE ENTIRE GAME -- no throw, no clamp, moves.length
      0. So does `undefined`. Math.max(0, NaN) is NaN and splice(NaN) starts at 0. NaN is a `number`
      to TypeScript, and ABC-019's turn loop will parse a ply count from user input, so this is the
      exact silent-corruption class the clamp exists for, in the one input shape it does not cover.
      Also: a fractional plies takes back MORE than asked (1.5 -> 2). Negative and Infinity are both
      safe, as the Engineer said. NOT fixed and deliberately NOT pinned by a test -- a test asserting
      today's output would enshrine it. Owner: BA/PM to rule, ABC-019 to consume.
    - src/history.ts:42 says the borrow contract "is documented and tested". IT IS NOT TESTED -- no
      test in the file touches history.position.board, as the Engineer's own claim note says. The
      same doc comment also tells callers not to hold the reference across a takeBack, while the
      Engineer's decision note and this ticket's implementation record say holding it is SAFE
      because takeBack rebuilds in place. Two documents give ABC-019 opposite guidance.
    - The double-push repetition test the Orchestrator named for this column is STILL NOT WRITTEN,
      and this gate DECLINES it with a reason rather than leaving it open: it would assert a
      property of src/zobrist.ts (ABC-011's, already merged, gated twice and covered), not of
      src/history.ts, and this module cannot distinguish the two hashes. Owner: ABC-011's trace row.
    - playMove still validates nothing. SEAM 1's priced decision, unchanged and not re-opened.

  THE FIVE NFR BARS WERE DELIBERATELY NOT RE-MEASURED -- Security/NFR owns them and gates next.
  Nothing cost-shaped was added: the 5 new tests carry NO wall-clock assertion, this project's
  standing rule. plans/nfr-catalog.md was NOT edited, and neither was the trace row's NFRs cell.

  ACCEPTANCE CRITERION 9 VERIFIED AT LINE LEVEL, which is what it asks, with a working null control:
  all NINE test files that existed at 39e260d are +0/-0, while the same instrument reads 107 added
  lines on the file this gate did change. src/history.test.ts did not exist at 39e260d, so it is not
  a pre-existing test and the criterion still holds after this pass.

  ABC-009, ABC-010 and ABC-022 are carried, not fixed. NO PR -- this repo has no git remote, so
  there is nowhere to push and none was invented. Substrate degradation carried forward: no
  scripts/claim.js and no scripts/context-io.ts, so the queue file moved pending -> claimed -> done
  BY HAND with a claim.md registry record, and the notes are hand-written in the schema's exact
  shape. `finding` is INADMISSIBLE with no §14 gate to issue a stamp and NOTHING WAS SELF-STAMPED --
  the kinds used are decision, observation, claim and artifact-ref.
-->

<!--
  ENTERED 2026-08-04 by the Software Engineer (task `ticket-to-pr-ABC-012`, Workflow 04): ABC-012
  implemented with tests and a green mandatory gate. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3;
  no limit approached, no override taken. The full record -- the seven mutants, the byte-level
  no-existing-file-touched proof, the measured DAG, the five met NFR bars with their machine, and the
  instrument that failed its own null control -- is in the In Development comment above and in
  .grugops/context/ticket-to-pr-ABC-012/notes/.

  TWO THINGS FOR WHOEVER OWNS THIS COLUMN NEXT, neither of them a gate:

  (1) ONE ACCEPTANCE CRITERION IS STALE AND IS BA/PM'S, NOT QE'S. Criterion 2 asks gameStatusOf to
  return `result: "draw", reason: "threefold-repetition"`, which src/gameend.ts cannot return and its
  TYPE cannot express -- ABC-020 ruled threefold CLAIMABLE on FIDE 9.2.1. The criterion's intent is
  tested and green; the wording was not edited here.

  (2) FOUR ADVERSARIAL LEADS ARE HANDED OVER RATHER THAN ABSORBED, with the reason each is a lead
  rather than a defect: criterion 2's own test does not pin the BOARD half of takeBack; the
  keyHistory off-by-one is killed by exactly one assertion; the double-push repetition test the
  Orchestrator named for this column is still unwritten and was deliberately not added in dev; and
  playMove validates nothing by SEAM 1's priced decision.
-->

<!--
  EXITED 2026-08-03 by QE/E2E on a PASS verdict, the SECOND review pass: ABC-011 -> In Security/NFR.
  In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; NO LIMIT APPROACHED, no override taken, no
  written reason owed. The In Review exit is the one board move this role owns. Nothing was merged
  and nothing was deployed -- a human holds both.

  VERDICT: PASS. The MEDIUM purity defect the project owner declined to merge is GENUINELY CLOSED.
  Reached by re-deriving the ticket and by breaking the delivered suite with mutants -- NOT by
  re-running the Engineer's suite and reading the green.

  THE MUTATION CAMPAIGN IS THE PART THAT MATTERS. 49 mutants against the CHANGED production surface
  (the first pass's 22 re-run, plus 27 new ones aimed at the guard surface): 44 killed, 5 survived,
  and every one of the 5 was then PROVED behaviour-equivalent over 55,600 adversarial inputs each
  (same answer, same key, same purity) rather than merely left unkilled.

  TWO OF THE NEW MUTANTS SURVIVED ALL 206 DELIVERED TESTS AND WERE REAL. Both are exactly the
  "one-line equivalent simplification" the second design hop warned about:
    - guard (b) relaxed from "exactly the enemy PAWN" to "any enemy PIECE" -- green on 206 tests,
      and it permanently rewrites a black KNIGHT on the ep capture square into a black PAWN from a
      single zobristKey call (`4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1`). That is the owner's MEDIUM
      defect, reopened in a shape no delivered row reaches.
    - guard (a) relaxed from "the target is EMPTY" to "the target holds no ENEMY piece" -- green on
      206 tests, and it answers `true` on the exact FEN guard (a) exists for, the one where
      generateMoves offers an ep capture onto the mover's OWN piece
      (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`). Pure, and still the wrong answer.
  THE SHIPPED CODE IS CORRECT ON ALL FOUR. NO PRODUCTION LINE WAS CHANGED. These were holes in the
  SUITE, not defects in the fix, and they are closed by 8 tests this gate added: the delivered table
  classifies boards by what is MISSING (no pawn, wrong-coloured pawn) and never by what is PRESENT
  INSTEAD, which is the axis both relaxations move along. Suite 206 -> 214, skip count 0.

  THE ENGINEER'S THREE LOAD-BEARING CLAIMS, EACH VERIFIED RATHER THAN ACCEPTED:
    - "each guard is load-bearing, two DISJOINT failure sets" -- TRUE, and it survives this gate's
      strengthening. Guard (a) deleted -> 8 named failures; guard (b) deleted -> 11; INTERSECTION
      EMPTY; both deleted -> 21 = 8 + 11 + the 2 tests either guard alone closes. (Before my tests:
      4 / 7 / 13, exactly as reported.)
    - "one of QE's own first-pass FENs is closed by EITHER guard alone, so it kills neither
      single-guard mutant" -- TRUE. `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` appears in the both-deleted
      failure set and in NEITHER single-guard set. The Engineer's correction of my inherited
      expectation is right and it is now measured twice.
    - "no existing test was modified, zero widened pre-existing lines" -- TRUE at line level, not by
      inspection, and checked three ways. See the entry comment under In Security/NFR.

  PURITY ATTACKED FROM OUTSIDE THE ENGINEER'S SWEEP, which is what this gate was asked to do:
  187,328 inputs the delivered 665-input sweep does not reach -- 600 random boards, hand-corrupted
  off-board squares (the case the Engineer explicitly named as unverified), kingless and multi-king
  boards, all-pawn boards, extreme counters, every castling value, and epSquare = NaN / Infinity /
  fractional / out-of-array, including -256 and 256, which PASS isOnBoard through two's complement.
  0 impure, 0 throws. The same hunter finds 1,383 impurities on a guard-stripped control tree, so it
  is non-vacuous rather than merely quiet.

  ONE THING FROM THE FIRST PASS IS NOW CLOSED AND SHOULD STOP BEING CARRIED: the Z1+L11 combined
  mutant that pass handed to Security/NFR (green suite, stray pawn on off-board square 15) no longer
  reproduces -- guard (b) rejects it, and it stays closed even with guard (a) also deleted. And the
  first pass's other two survivors, Z1 and Z4, are now KILLED -- by src/zobrist.nfr.test.ts's spied
  call-count test, written by the Security/NFR gate in response to that handoff. The handoff worked.

  ENTERED 2026-08-03 by the Software Engineer, the SECOND time this ticket has entered this column.
  In Review 0/3 -> 1/3; no limit approached, no override taken.

  WHAT IS A DELTA AND WHAT IS NOT, so the next gate does not re-derive the whole ticket. The ONLY
  production change since 584defa is FOUR executable lines in `hasLegalEnPassant`
  (`src/legal.ts` +32/-6, of which the rest is comment) plus a doc-comment-only edit to
  `src/zobrist.ts` (+5/-1). `src/zobrist.ts`'s condition, `zobristKey`'s signature, `src/apply.ts`,
  `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are BYTE-UNTOUCHED. Everything
  the first pass and the three prior gates established still stands and was NOT re-opened.

  ALL SIX KNOWN REPRODUCTIONS ARE CLOSED, and each was reproduced independently against the shipped
  tree BEFORE any code was written rather than taken from the notes: QE's three, the fourth the
  design hop found (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, which the empty-target guard does NOT
  catch), and the two pure divergences where the shipped predicate was already byte-pure and only
  its ANSWER was wrong (`4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its mirror).

  THE REACHABLE POPULATION DID NOT MOVE, re-derived on this role's own script a fifth independent
  time and reproducing the design, dev and QE hops TO THE NUMBER: 518,474 nodes / 81,397 ep-set
  (15.70%) / 0 answers changed / 0 keys changed / 0 firings of either guard / 0 impure nodes on
  either tree. The guards are a precondition, not a behaviour change.

  NFR-005 RE-DERIVED BY THIS ROLE RATHER THAN INHERITED (Apple M3 Mac15,13 / Node v24.12.0 /
  darwin-arm64, `UNKNOWN - verify` elsewhere): startpos 291.3 ns against a ~450 ns bar, kiwipete
  313.6 ns against a 432-459 ns bar -- MET. Isolated on the predicate, -0.3 to +2.6 ns per call on
  ep-set nodes, i.e. <= +0.41 ns amortized per node and 0.13% of a ~313 ns key -- inside the design
  hop's published +0.9...+3.0 ns band without exceeding its ceiling. 20-25x CHEAPER on the invalid
  class, reproducing its 20-27x. The no-ep sub-bar is ZERO structurally: the guards live inside the
  predicate, after its own NO_SQUARE early return, and the caller's short-circuit never enters it --
  `src/zobrist.nfr.test.ts`'s zero-call assertions pass untouched. THE TWO NO-EP ANCHORS ARE KEPT AS
  A NULL CONTROL whose delta is structurally zero; they land at +0.06 and +0.20 ns, which IS this
  instrument's resolution, and it is why the ep-set whole-key cells (+0.66 and -0.42 ns) are
  reported as measured rather than claimed as a number.

  CARRIED, NOT FIXED: ABC-009, ABC-010, and the `generateMoves` own-piece-capture defect the design
  hop routed to BA/PM (still reproduces -- verified this pass on its own FEN). Nothing was merged
  and nothing was deployed; a human holds both. No PR -- this repo has no git remote.

  ---
  EXITED 2026-08-03 by QE/E2E on a PASS verdict: ABC-011 -> In Security/NFR. In Review 1/3 -> 0/3,
  In Security/NFR 0/2 -> 1/2; NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Review exit is the one board move this role owns. Nothing was merged and nothing was deployed.

  QE FIXED NO PRODUCTION CODE. src/legal.ts and src/zobrist.ts are byte-identical to 98b07e7. Five
  tests were added and one assertion line, all green, skip count still 0, suite 184 -> 189.

  THE VERDICT WAS REACHED BY RE-DERIVATION AND BY BREAKING THE SUITE, NOT BY RE-RUNNING IT.
  TWENTY-TWO MUTATIONS were run against the delivered suite -- the ABC-020 gate ran thirteen, and
  this ticket is one condition inside a function EPIC-004 will call per node, so the check the last
  gate invented is the check that matters most here. SEVENTEEN were killed. FIVE SURVIVED, and two
  of the five were real:

    L8  `if (legal) return true;` -> `return legal;`   gives up after the FIRST candidate capturer.
        SURVIVED a 184-test suite. It is not an equivalent mutant: on
        `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` the lower-file capturer c5xd6 is pinned by the c8 rook
        and e5xd6 is legal, so under the mutant the key COLLAPSES two positions FIDE calls
        different. That is an OVER-collapse -- a repetition declared that never happened -- which is
        the OPPOSITE of the safe error direction this ticket's whole priority argument rests on. The
        property test cannot reach the shape: over an exhaustive 518,474-node walk of the perft
        table at its own `fast` depths, exactly TWO nodes have two pseudo-legal ep capturers at all
        and in NEITHER is the lower-file one illegal. The FEN had to be built. Shipped code is
        CORRECT on it; the suite simply could not see it. Closed, plus its black mirror
        `2k5/8/8/8/2pPp3/8/8/2R4K b - d3 0 1` so the predicate's black branch is covered too.

    Z5  `EP_FILE[fileOf(position.epSquare)]` -> `EP_FILE[0]`   SURVIVED. Re-run against the
        PRE-ABC-011 baseline (4c6ed7d): 174/174 green there too, so this is PRE-EXISTING and not
        introduced by this ticket -- the ep FILE has never been load-bearing in any test here, and
        the new property test does not close it either, because it only ever compares "key with ep"
        against "key with ep cleared", never two different files. Consequence if it broke: a FALSE
        repetition. Closed with one pair, `4k3/8/8/1pPpP3/8/8/8/4K3 w - b6 0 1` vs `... d6 0 1`.

  THE THREE REMAINING SURVIVORS ARE ONE GAP AND IT IS SECURITY/NFR'S -- the Engineer's flag is
  UPHELD, on evidence rather than on deference. Z1 (reorder the guard behind the predicate), Z4
  (drop the epSquare guard) and L11 (drop the predicate's own NO_SQUARE early return) are
  BEHAVIOUR-EQUIVALENT, verified: each leaves 189/189 green and none changes any key on any input,
  because the predicate's internal guard makes the reordered condition compute the same thing. What
  they change is COST on the majority path, which is NFR-005's sub-bar verbatim ("the no-ep-square
  path is not made slower at all"). No assertion about a key can ever fail them; the instrument is a
  spied call count -- exactly the shape src/gameend.nfr.test.ts has and exactly what the ABC-020
  Security/NFR gate wrote. Writing it here would put an NFR test in QE's column.
  ONE FACT THE DEV HOP DID NOT HAVE, handed over so the next gate starts ahead: Z1 AND L11 TOGETHER
  -- the reorder plus deleting the guard that then looks redundant, an ordinary tidy-up -- still
  leave 189/189 GREEN, and on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1` a single zobristKey call then writes
  a white pawn onto OFF-BOARD SQUARE 15, breaking the invariant src/position.ts states in its own
  comment. Latent rather than live, and invisible to every test in the repo.

  ONE NEW DEFECT FOUND, NAMED RATHER THAN FIXED. Since ABC-011, zobristKey PERMANENTLY corrupts a
  position whose ep square is semantically inconsistent -- three reproductions, board bytes compared
  before and after a single call:
      4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1   -> a PHANTOM BLACK PAWN appears on d5
      4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1  -> the white pawn on d5 turns BLACK
      4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1 -> a PHANTOM WHITE PAWN appears on e4
  The predicate builds its probe move with `captured: PAWN | ...` without checking that such a pawn
  is there or that the target is empty; unmakeMove then writes the ASSUMED pawn back, which is a
  creation rather than a restore. FAIR TO THE ENGINEER, and checked before it was written down: on
  the first two FENs the predicate's own ruled ORACLE, `legalMoves(...).some(...)`, corrupts them
  IDENTICALLY -- the fault is pre-existing in generateMoves + apply and the predicate reproduces its
  definition faithfully; and "the shipped predicate does not inherit ABC-009" is TRUE as stated and
  was independently verified on ABC-009's own trigger FEN. What IS new: on the third FEN
  generateMoves does not offer the ep move at all, so the ORACLE says false and stays clean while
  the predicate says true and corrupts -- implementation and ruled definition disagree; and before
  ABC-011 zobristKey was pure on EVERY input, valid or not, while its header and
  memory-bank/30-architecture.md now promise "transiently mutates ... returns the position as it
  found it", which on this class is false. REACHABILITY IS THE SAME CLASS THE TICKET ALREADY
  CARRIES: every trigger needs a semantically invalid FEN through parseFen, makeMove can never
  produce one, and 277,949 reachable nodes are 0 impure. Not fixed (QE does not change production
  code) and not pinned with a test (a test asserting the current output would enshrine it). Instead
  the property that IS true and load-bearing is now pinned: zobristKey is byte-pure at every
  reachable node. Owner: BA/PM to cut it or fold it into ABC-010; Architect/Design to rule on the
  predicate-vs-oracle divergence, since guarding the predicate would deliberately diverge from the
  definition the design hop ratified. It does NOT block ABC-011.

  EVERY LOAD-BEARING CLAIM ON THE BRANCH WAS CHECKED AND HELD.
    - NO EXISTING TEST MODIFIED: verified line-level, not by inspection -- every line of 4c6ed7d's
      two test files was searched for in the new files. Exactly 3 lines absent from each, ALL
      imports; zero non-import lines vanished. src/zobrist.test.ts:33-37's body is byte-identical
      and still passes; only its line numbers moved.
    - AC4's PROPERTY TEST IS NON-VACUOUS IN BOTH HALVES -- in fact: instrumented, the walk plays 557
      double pushes, 52 ep-ANSWERED and 505 ep-UNANSWERED, 0 violations. BUT the delivered
      assertions are `checked > 0` and `answered > 0`, and `checked` counts BOTH kinds, so the
      collapse half was exercised and unpinned. One line added -- `expect(checked - answered)
      .toBeGreaterThan(0)` -- declared loudly here because it edits a test block written on this
      branch (not a pre-existing one) and strengthens rather than accommodates.
    - PURITY: full position state (128 board bytes + all five scalars, stronger than toFen, which
      cannot see the counters) compared across every zobristKey call over a 3-ply walk of all six
      perft roots -- 277,949 nodes, 0 impure. The Engineer's spy counted 277,955 over the same walk;
      the difference is exactly 6, the six roots their walk hashed and mine did not. The two runs
      AGREE EXACTLY.
    - MODULE GRAPH rebuilt from src/*.ts a third time with cycle detection and longest-path
      levelling: ACYCLIC, max depth 6, zobrist 2 -> 5, gameend 5 -> 6. Matches the ruling exactly.
    - THE DIVERGENCE TABLE REPRODUCED TO THE NUMBER on a third independently written script:
      518,474 nodes / 81,397 ep-set / 77,872 merged violations / 862 board-only (861 position-3,
      1 position-4) / ZERO shipped. Plus a column the prior hops did not have: the shipped predicate
      disagreed with its documented oracle ZERO times over all 81,397 ep-set nodes.
    - BASELINE 174 was not taken on trust: 4c6ed7d's src/ extracted with `git archive` into a
      sandbox and run. 174 passed / 0 skipped, confirmed.

  THE MODULE TABLE IN memory-bank/30-architecture.md: the Engineer's call to leave it ordered by
  conceptual layer is UPHELD. The table orders by layer, not by DAG level, and the corrected
  layering line two sections down carries the fix with its rebuild dated. Reordering it would be the
  unrequested refactor rule 9 forbids. One imprecision named rather than fixed: the `Hashing` row's
  CONTENT still reads as a self-contained leaf and says nothing about the legal.ts edge -- a
  one-cell content edit, not a reshuffle, and documentation rather than coverage.

  NFR-005's COST BARS WERE DELIBERATELY NOT RE-MEASURED -- Security/NFR owns them next and two roles
  measuring the same bar is waste, the same disposition the ABC-020 QE gate took with A10. What was
  re-derived is the sub-bar's STRUCTURAL half, without timing anything.

  Gates re-run by QE on this branch: 189 pass / 0 skipped / lint, typecheck and build all exit 0
  (2 pre-existing biome config-schema infos, present at 4c6ed7d) / src/legal.ts and src/zobrist.ts
  both 100% stmt/branch/func/line. Five items could not be settled and are recorded as a `claim` at
  `confidence: UNKNOWN - verify`. ADR-0005 is still `proposed`; no agent may mark it `accepted` and
  none did. No PR exists and none was invented -- this repo has no git remote.
-->

<!--
  ENTERED 2026-08-03 by the Software Engineer, branch `grugops/ticket-to-pr-ABC-011`. In Development
  1/3 -> 0/3, In Review 0/3 -> 1/3; NO LIMIT APPROACHED, no override taken, no written reason owed.

  NO PR EXISTS, AND THIS IS NOT A GAP IN THE WORK. This repo has NO git remote -- `git remote` is
  empty -- so there is nowhere to push and no pull request to open. No PR link was invented. Same
  posture ABC-020 and the ABC-004..007 stack recorded. A human holds merge and deploy; nothing was
  merged and nothing was deployed.

  WHAT LANDED. Four files under src/ (+265/-9) and two doc edits. src/legal.ts gains
  ONE new export (`hasLegalEnPassant`, 30 lines incl. doc comment); src/zobrist.ts changes ONE
  condition and gains ONE import; the rest is tests. src/gameend.ts, src/apply.ts, src/moves.ts,
  src/position.ts and src/fen.ts are BYTE-UNTOUCHED, zobristKey's signature is unchanged and no
  state was added to Position (ADR-0002 clause 1).

  THE `### ANSWERED` BLOCK WAS BUILT AS RATIFIED AND NONE OF ITS SIX RULES WAS TRADED AWAY. Rule 1
  (guard first, short-circuits) is SPIED rather than asserted: over a depth-3 walk of all six perft
  positions, 277,955 nodes hashed, 17,663 carrying an ep square, hasLegalEnPassant called exactly
  17,663 times -- ZERO calls on the 260,292 no-ep nodes, and never more than one on any node. Rule 2
  (not legalMoves) and rule 3 (not moves.ts) were followed, and the graph was REBUILT from src/*.ts
  rather than trusted: still acyclic, still max depth 6, zobrist 2 -> 5 and gameend 5 -> 6, exactly
  as the design hop ruled. Rule 5 (purity) is a test, four FENs including ABC-009's own trigger
  shape `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1`, toFen compared across the call.

  ACCEPTANCE. All seven criteria green -- see the artifact-ref note for how each was proved. The
  two that were the point: the repro pair (`...4P3... b KQkq e3` vs `-`) now hashes EQUAL, and BOTH
  regression guards still hash DIFFERENT. NO EXISTING TEST WAS MODIFIED: three import lines were
  widened across src/zobrist.test.ts and src/legal.test.ts to reach the new symbols, and every
  other original line in both files is byte-identical -- verified by diffing each original line
  against the new file, not by inspection. src/zobrist.test.ts's "depends on en-passant
  availability" fixture is untouched and still passes, which is what the ticket demanded.

  THE DEFECT'S SCALE, RE-DERIVED INDEPENDENTLY rather than quoted from the design hop. Exhaustive
  walk of the perft table at src/perft.test.ts's own `fast` depths: 518,474 nodes, 81,397 carrying
  an ep square. Property violations against the FIDE ground truth
  `legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`: merged (pre-ABC-011) 77,872; board-only
  (the rejected reading) 862, of which 861 are position-3 and 1 is position-4; SHIPPED strict ZERO.
  Every one of the design hop's published figures reproduced to the number on an independent run.

  NFR-005 MEASURED, NOT INFERRED, on Apple M3 / Node v24.12.0 / darwin-arm64 -- the machine class
  the baseline was taken on; `UNKNOWN - verify` on any other hardware. Merged and ABC-011 zobristKey
  benchmarked IN THE SAME PROCESS against a pre-change copy of src/ outside the repo, 300k
  iterations per cell, interleaved forward and backward, two independent samples. Bar: within 1.5x
  of 288-306 ns at kiwipete / ~300 ns at startpos, and the no-ep path not slower AT ALL.
    startpos, no ep      302.9-306.5 ns  (bar ~450 ns)   0.963-1.008x merged   PASS
    kiwipete, no ep      309.1-315.6 ns  (bar 432-459)   0.984-1.015x merged   PASS
    ep set, no capture   320.3-351.0 ns                  1.000-1.091x merged
    ep set, capture available                            1.357-1.383x merged   worst case, under 1.5x
    amortized, 120,000-node pool at natural ep frequency  0.9948-1.0218x merged
  The no-ep sub-bar holds STRUCTURALLY and not just statistically: the spy above shows the
  predicate is never entered on those nodes, so the majority path executes the same instructions it
  executed before. The worst-case shape came in BELOW the design hop's recorded 1.45-1.48x, and the
  amortized row -- the one ADR-0002 clause 3 makes binding for EPIC-004's per-node key -- is inside
  noise of merged.

  CARRIED, NOT FIXED, and each is deliberate: ABC-009 (legalMoves mutating its argument) is
  untouched and the shipped predicate does NOT inherit it -- proved by the purity test on ABC-009's
  own trigger FEN; ABC-010 (FEN semantic validation) untouched. ADR-0005 remains `proposed` and NO
  AGENT MAY MARK IT `accepted`. One thing flagged FOR THE NEXT GATES rather than absorbed: rule 1's
  short-circuit is held by construction and by an out-of-repo spy, NOT by any test in the repo --
  the same gap the ABC-020 Security/NFR gate closed for NFR-001 by adding src/gameend.nfr.test.ts.
  Left to that gate on the ABC-020 precedent (the engineer measures, the gate pins) rather than
  taken here, because the design hop sized this ticket at three test shapes and a fourth is scope
  the engineer should not quietly take.

  ---
  EMPTIED 2026-08-01 by QE/E2E: ABC-020 reviewed and PASSED, moved In Review -> In Security/NFR.
  WIP 1/3 -> 0/3. The In Review exit is the one board move this role owns.

  VERDICT: PASS. ABC-020 meets the lean Definition of Done and the PR review checklist. No defect
  blocks the exit. QE fixed NO production code; six tests were added, all green, skip count 0.

  RE-DERIVED INDEPENDENTLY, not read off the Engineer's report. The G-1 line driven from the FEN
  and the move list: Black's move makes the third occurrence, the status is `in-progress` with
  `{by:"white", draws:["threefold-repetition"]}`, Re8 is still legal for the side to move, and Re8
  gives `{white-wins, checkmate}`. FIDE 1-0 where merged main returns 1/2-1/2. The result is
  `in-progress` and not a fourth value -- at runtime AND at compile time. Boundaries swept in both
  directions and both colours: clock 98/99 no claim, 100/149 claimable, 150/151/999 automatic;
  occurrences 0-2 no claim, 3-4 claimable, 5+ automatic; the full 4x4 cross-product correct,
  including both draws reported together with threefold first.

  THIRTEEN MUTATIONS RUN against the delivered suite in a throwaway worktree -- the check the
  ABC-007 gate did not make. NINE were killed, including `by: "white"` unconditionally (the exact
  G-1 defect, 2 tests), both thresholds in both directions, and `claimable` always present (12
  tests, of which 8 are among the 18 whole-object toEqual assertions A9 forbids touching -- so
  those 18 are demonstrably NOT inert and now also assert that nothing is claimable).

  FOUR MUTANTS SURVIVED, every one an ordering above the clock, and the ticket claims a guard that
  does not exist: `## Out of scope` says the zero-legal-moves-first ordering is load-bearing and
  that "A6 pins it". A6 pins checkmate against the CLOCK -- a different pair. Moving
  isInsufficientMaterial below the 150-ply check, below the fivefold check, or moving the
  zero-legal-moves branch below isInsufficientMaterial each changed a REASON and never a RESULT, so
  no whole-object assertion noticed. Product severity LOW (a reason string, read only by EPIC-006's
  result screen; isInsufficientMaterial is correct per R-1, so no mutant can turn a win into a
  draw). GATE severity higher -- a document asserting a guard that is not there is how ABC-007
  passed. CLOSED by a QE test; all four now fail.

  A9 VERIFIED BY NAME-SET DIFF against b1b96cd~1 (not against main, which would have counted the
  architecture-audit tests as ABC-020 edits): 28 names before, 4 removed, 15 added, 24 unchanged.
  A name diff is not sufficient, so the bodies were diffed too: the only pre-existing tests touched
  are the five named on the ticket, and line 142 is byte-identical. No sixth test moved.

  A5's EPOCH ARGUMENT RULED CORRECT, and the wording that is wrong is QE's own. Ten drives, five
  policies x two trees: pre-ABC-020 first-legal 117 plies (reproducing QE's published G-3 figure to
  the ply), this branch first-legal 167, quiet-only and last-legal 150 exactly. 150-133=17,
  17+100=117, 17+150=167 -- all exact. The wall resets the clock THREE times (plies 8, 14, 17), and
  ply 14 is a PAWN MOVE: the wall unfreezes after the first capture. So A5's Given -- "no capture
  and no pawn move available to either side", carried verbatim from QE's own G-3 note -- is false
  beyond ply 7, and "within 150 plies" holds only per irreversible-move epoch, which is what FIDE
  9.6.2 actually bounds. The Engineer disclosed both narrowings rather than quietly satisfying the
  criterion. A5's SUBSTANCE -- the game terminates automatically with no claim -- holds under every
  one of the ten drives, and is now pinned by two QE tests instead of by argument. RECOMMENDATION
  FOR BA/PM: correct A5's and A8's Given; the criteria themselves need no change and the code needs
  none.

  CARRIED DEFECTS CONFIRMED GENUINELY CARRIED. ABC-009 still mutates its argument (the phantom
  second white king on 4k3/8/8/8/8/8/8/K7 w KQ - 0 1), and NO new test depends on it -- all eleven
  FENs the new tests use round-trip through toFen unchanged across a gameStatus call, kiwipete
  included. ABC-011 cannot decide anything here: epSquare measured -1 at every ply of the G-1
  shuffle, QE's colour-mirror line, knightCycles(4), and the 150-ply wall drive.

  GATES RE-RUN BY QE ON THIS BRANCH after the six added tests: npm test 171 passed / 7 files, skip
  count 0, lint exit 0 (2 pre-existing biome config infos, present before this ticket), typecheck
  exit 0, build exit 0, src/gameend.ts 100% stmt/branch/func/line. Every figure matches the
  Engineer's independently.

  NOT VERIFIED HERE, DELIBERATELY: A10's NFR-001 cost bars. Security/NFR reviews those next and two
  roles measuring the same thing is waste. One thing flagged for them: moving the 150-ply check
  below the fivefold check kills no test and would break the measured "zobristKey = 0 when the
  clock decides" bar.

  THREE ITEMS COULD NOT BE SETTLED and are recorded as a `claim` with confidence UNKNOWN - verify,
  none of them blocking: (1) FIDE 9.6.1's "five CONSECUTIVE alternate moves" versus the plain
  five-count the ticket specifies -- a BA/PM reading, and unfixable from a counts map anyway since
  it carries no ordering; (2) GameResult is dead, keeping it was RIGHT (the ratified block spells it
  out), and the trap is one line to close via `GameResult = GameStatus["result"]` -- for whoever
  owns the ADR-0002 seam; (3) five occurrences AND clock >= 150 always reports seventy-five-move --
  left deliberately unpinned, because pinning an arbitrary choice between two rules that both apply
  is how a later correction becomes a "regression". EPIC-006's result screen decides.

  ENTERED 2026-07-31 by the Software Engineer, branch `grugops/ticket-to-pr-ABC-020`. WIP 0/3 ->
  1/3; no limit approached, no override taken.

  NO PR EXISTS, AND THIS IS NOT A GAP IN THE WORK. This repo has NO git remote -- `git remote` is
  empty -- so there is nowhere to push and no pull request to open. `gh` IS installed and
  authenticated (account `abitwise`), so the blocker is the missing remote, not the tool, and no PR
  link was invented. The two commits sit on the local branch. This is the posture the ABC-004..007
  stack has been in since 2026-07-24, where the same comment records a human merge still
  outstanding. A human holds merge and deploy; nothing was merged and nothing was deployed.

  WHAT LANDED. src/gameend.ts only, +113/-66 lines, no new module, no new import, no new state on
  Position -- the import list is byte-for-byte the merged one, and the gameStatus signature is
  byte-identical (positionCounts stays second and stays optional). The design hop's ratified shape
  was built exactly as written: GameStatus is a two-arm discriminated union on the `result` field
  it already had, `claimable` is ABSENT (not null, not []) when nothing is claimable, and
  DrawClaims.by is required. EndReason gained fivefold-repetition + seventy-five-move and lost
  threefold-repetition + fifty-move, which are now the whole of the disjoint ClaimableDraw.

  ACCEPTANCE. A1-A10 all green -- see the artifact-ref note for how each was proved. A9 held
  exactly: the FOUR named tests that had to change are the only ones whose names changed, the
  fifth (99 plies) gained the absence assertion the ticket asked for, and NO sixth test moved.
  Measured, not asserted: the first run after the implementation landed showed 4 failures, all
  four named. Line 142 ("prefers checkmate over the fifty-move rule") is untouched, as instructed.

  A10 MEASURED on Apple M3 / Node v24.12.0 / darwin-arm64, spied (not inferred) with an
  instrumented copy of legal.ts + zobrist.ts outside the repo, gameend.ts byte-identical:
  legalMoves calls per gameStatus = 1 across all ten call shapes (bar: exactly 1); zobristKey
  calls <= 1, and 0 whenever the caller is bare or an earlier branch decides (bar: at most 1);
  cost 2.17-2.24 us/call against the published 2.52 us baseline, i.e. 0.86-0.89x where the bar is
  1.5x (<= 3.78 us). UNKNOWN - verify on any other hardware.

  CARRIED, NOT FIXED, exactly as the ticket directs: ABC-009 (legalMoves mutating its argument)
  and ABC-011 (en-passant hashing). Every repeated line in the new tests is an en-passant-free
  knight or king shuffle for ABC-011's reason. The FIDE 5.2.2 dead-position gap is NOT fixed --
  the module header now says honestly that insufficient-material is a SUBSET of 5.2.2, which was
  QE's G-3 recommendation, and the terminal-check ORDER is unchanged (R-4's load-bearing
  ordering, pinned by A6 at clock 150 as well as 100).

  ONE THING FOR THE REVIEWER. `GameResult` is now referenced by nothing, here or anywhere in
  src/. It was already exported before this ticket and the design hop's ratified shape spells it
  out verbatim, so it was kept rather than deleted -- flagged, not removed, per coding rule 12,
  and the call to keep or drop it belongs with whoever owns the ADR-0002 seam.

  Cleared 2026-07-24: the ABC-004..007 stacked review unit passed the EPIC-001 review gate
  (QE/E2E independent PR-review-checklist pass + Security/NFR gate) and advanced to Ready for
  UAT. The 4/3 WIP override recorded here at batch start is now RESOLVED — the column is back
  to 0/3. The stacked branches are unchanged (main → 004 → 005 → 006 → 007); the single human
  merge of that stack is still outstanding and still human-held (autonomy=pr).
-->


## In Security/NFR (WIP 0/2)

<!--
  EMPTIED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`,
  Workflow 04): **ABC-009 PASSES WITH RISKS and moved In Security/NFR -> Ready for UAT — the one
  exit this column owns.** In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4. No limit
  approached, no override taken, no written reason owed. NOTHING MERGED AND NOTHING DEPLOYED — a
  human holds both, and the owner's standing merge authority is NOT deploy authority.

  security.asvs_level L1, security.block_on high, compliance_regime [] — so NO Compliance Officer
  hand-off is owed, recorded rather than silently omitted. NO REQUIRED FIX IS OUTSTANDING and NO
  HIGH-SEVERITY ITEM EXISTS TO BLOCK ON.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  NFR-001 was re-derived here on this gate's own instruments, written OUTSIDE the repository.
  src/moves.ts is untouched by this role and still hashes 0e247853ab2c05887c76105ff83d8621.

  THE FOUR MANDATORY GATES RE-RUN ON THE TIP cff45ee: lint exit 0 (2 pre-existing biome.json
  infos), typecheck 0, build 0, npm test 356/356 on 16 files, skip count 0 by the AGENTS.md
  command, deep lane 32/32 EXACT in 38.49 s (third independent run: 36.93 s Engineer, 38.35 s QE).
  Test-integrity checker exit 2 (.grugops/test-skips.md absent, checked with ls) recorded as an
  ERROR and NOT a pass, no registry file created. E2E and auto-UAT oracles UNKNOWN - verify.

  (1) NFR-001 / A10 IS MET ON BOTH CLAUSES. Floor 6,030,518 / 6,136,238 / 6,117,496 nodes/sec
      against >= 1,000,000 (~6.1x). Aggregate ratio 1.0062 and 0.9967 against >= 0.98 on two fully
      independent samples, worst single cell 0.9863. Three trees in ONE process -- pre-fix,
      delivered, and a byte-identical TWIN as a null control by identity, the twin cmp-verified on
      all thirteen non-test files and `pre` verified to differ from `post` in moves.ts AND NOTHING
      ELSE -- 12 rounds (round 0 discarded), tree AND cell order rotated, parseFen outside every
      clock, checksum 409,605,192 nodes per sample. One honest difference from the Engineer: this
      gate's LOWEST floor run (6,030,518) sits 0.16% UNDER the catalog's standing 6.04M-6.21M band.
      Scatter on one run; NO BASELINE MOVED, and it is recorded rather than rounded into the band.

  (2) THE ENGINEER'S +/-1% INSTRUMENT-FLOOR REASONING: IT HOLDS, THE ESTIMATE IS OPTIMISTIC, AND IT
      WAS NOT THE END OF THE ROAD. Calibrating against provably-zero cells plus an identity twin is
      the right move and "no per-cell number is claimable" is the right conclusion. But this gate
      measures +/-2.0% per cell (twin, position-5), and characterises an AGGREGATE floor nobody had
      (twin 1.0096 / 1.0087; three of four aggregate twin readings across two gates near +0.9%, a
      SYSTEMATIC this gate CANNOT ATTRIBUTE) -- so the bar's 2-point margin exceeds resolution by
      about 2x, not comfortably. Per-cell instability shown the hard way: kiwipete reads 0.9930 /
      0.9967 (Engineer) against 1.0228 / 1.0052 (here). One wording overshoot named: "kiwipete's
      0.9930 is NOT a regression" is stronger than a noise floor can license (it licenses only
      "cannot resolve whether it is"); their note also states the correct form, so it is a phrasing
      inconsistency, not a false result.

  (3) THE QUESTION IS RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT -- the same move this
      catalog already made for NFR-005's call-count sub-bar. Over the exact perft population the two
      added lines execute 198,175 times EACH = 396,350 total across 11,377,922 nodes and REJECT
      NOTHING IN ANY CELL (0 failures of 198,175 each), which confirms empirically over 11.4M nodes
      the structural fact that makeMove only ever CLEARS a right (src/apply.ts:142); position-3 and
      position-6 execute them ZERO times. Isolated on an exported addCastlingMoves the pair costs
      +1.30 / +1.73 ns per call on startpos against a +/-0.22 ns null floor -- RESOLVED, ~0.33-0.43
      ns per execution. ARITHMETIC over the measured count and cost (LABELLED ARITHMETIC, NOT A
      MEASUREMENT): 0.131-0.170 ms on a 1.854-1.887 s sweep = 0.0070%-0.0091%, TRUE ratio ~0.9999
      and KIWIPETE'S TRUE RATIO ~0.9998 -- the 0.9930 reading is ~35x the true deviation. Robust to
      a 10x error in the multiplier. So the Engineer's conclusion is POSITIVELY ESTABLISHED, not
      merely unrefuted. Denominator fence re-derived independently at 97.18% free leaves.

  (4) GUARD ORDERING, ROUTED HERE BY QE AS GATE-UNVERIFIABLE: THE BEHAVIOUR HALF IS DISCHARGED, NOT
      CARRIED. The five guards are a CONJUNCTION of side-effect-free predicates over an unmutated
      position (isSquareAttackedBy and raySliderAttacks perform no writes -- checked; board is a
      readonly Uint8Array(128) and every frozen-table index is in bounds, so no guard depends on an
      earlier one for safety), therefore the emitted move set is PERMUTATION-INVARIANT under all 120
      orderings. Measured: 3 reorderings x 33 FENs = 99 comparisons, ZERO divergence at
      generateMoves, at legalMoves and on purity, with all six exact perft counts holding for every
      variant. SO NO LATER REORDER CAN SILENTLY BREAK THE EQUIVALENCE QE RELIED ON. QE's mechanism
      ("empty is tested before the through-check") is sound but stronger than needed; restated as a
      conjunction it is reorder-proof, and that restatement is the durable form.
      THE COST HALF IS REAL AND LIVES ON THE INVALID CLASS: an invalid FEN costs 522-526 ns pre-fix
      against 27.9-28.1 ns delivered (~18x), because the byte compare sits ABOVE THE ATTACK SCAN;
      below the through-check gives all of it back (+481 ns). BUT THE STATED REASON IS INVERTED FOR
      THE POPULATION NFR-001 MEASURES, and this is where this gate disagrees with the Engineer:
      measured selectivity is 0.0% for both added guards (0 rejects in 198,175 each) against 17.6%
      for the empty test and 14.1% for the through-check, so in exact executions the delivered order
      is the SECOND-MOST-EXPENSIVE of four (above-right 1,284,772 > delivered 396,350 > below-empty
      326,476 > below-through 280,302). That is ~0.003% -- far below resolution. NO CHANGE IS ASKED
      FOR (rules 5, 9, 10); the sharper reason is recorded instead. Nothing pins the ordering and
      NOTHING CAN, since invariance means no test could ever fail on a reorder.

  (5) SECURITY CLASSIFICATION: RELIABILITY, NOT SECURITY -- re-asked at the source with evidence, not
      carried, and NO TRIGGER MANUFACTURED. Zero eval/new Function/vm/require, zero child_process,
      zero HTML/XML/SQL/URL/fetch sinks, zero node:net|tls|http|https|dgram imports in non-test src/
      -- each grepped. addCastlingMoves is MODULE-PRIVATE; its only caller is generateMoves, whose
      only non-test caller is legalMoves (src/legal.ts:46). No process.argv/stdin/env/readFileSync in
      src/moves.ts at all; positions enter only via parseFen, called from history.ts and
      perft-bench.ts (hardcoded FENs). NO USER-SUPPLIED STRING REACHES src/moves.ts. QE's
      queen-destroying result is a worse RELIABILITY consequence of a MUTANT THAT WAS NEVER SHIPPED,
      not a security one. The one security-adjacent question this change touches -- a DoS-shaped cost
      on malformed input -- was asked and comes out IN THE CHANGE'S FAVOUR (18x cheaper). ASVS L1
      counted at the source: 70 active requirements, and V16/V17 carry NO L1 requirement at all
      (29 rows, zero at L1) -- checked, not assumed.

  (6) LOGGING: this module logs nothing and the only logging in non-test src/ is perft-bench.ts's
      console.log. Normally this gate flags a failure mode with no log. IT DOES NOT APPLY HERE: the
      fix ELIMINATES the failure rather than instrumenting it, so there is no later incident to
      diagnose. No logging asked for (rules 5 and 8).

  TEN RISKS CARRIED, NONE HIGH, EACH WITH A NAMED OWNER: (1) G-1/G-2 closed in TESTS but not in the
  criteria -- BA/PM, MEDIUM, deliberately NOT discharged here since ## Acceptance is BA/PM's and this
  gate did not touch it; (2) A7 killed nothing across 62 mutants -- BA/PM, LOW; (3) the castling-right
  test is guarded in the default lane only by QE's rows -- BA/PM or Architect, LOW; (4) guard ordering
  RESHAPED -- Architect/Design at ABC-010/EPIC-003, LOW: behaviour discharged, what remains is that
  nothing pins it and, if user FENs are ever admitted, a reorder below the through-check restores an
  18x cost on malformed input; (5) NFR-001 per-cell figures are noise and must never be quoted --
  Security/NFR, LOW, the TENTH instrument-limit correction on this project; (6) NFR-001 has no guard
  in the suite -- Security/NFR at EPIC-004, LOW, and no wall-clock assertion belongs there (standing
  rule); (7) ABC-010 unbuilt so the invalid FEN is still ACCEPTED at the boundary -- ABC-010, LOW, by
  design; (8) ABC-022 half (b) live BY DESIGN -- severity NONE; (9) A1-A10 plus QE's rows still not
  PROVEN complete, nine equivalent survivors stand -- QE/BA-PM; (10) test-integrity exit 2, E2E and
  auto-UAT oracles UNKNOWN - verify -- human-owned. V15.1.1/V15.2.1 NOT MET with the carried high->low
  override, evidence re-checked (runtime dependencies is {}, package.json and package-lock.json
  byte-identical to main on this branch), owner Architect/Design at EPIC-006. V13.4.1 DEFERRED,
  unchanged and not relaxed.
-->

<!--
  ENTERED 2026-08-09 from In Review, by QE/E2E (task `ticket-to-pr-ABC-009`, subtask
  `qe-abc009-review`, Workflow 04) on a PASS WITH RISKS verdict. In Security/NFR 0/2 -> 1/2.
  Security/NFR owns this column's exit. The QE record is in the In Review comment above and in the
  ticket's `## QE` section; it is not restated here.

  WHAT THIS GATE IS OWED, NAMED SO IT IS NOT DISCOVERED:

  (1) NFR-001 / A10 IS YOURS AND QE DID NOT TOUCH IT. No throughput figure in any QE output is QE's
      own -- `npm run perft` was not run by this role. The Engineer's figures are the first and only
      ones on this ticket: floor 6.08M-6.15M nodes/sec against the >= 1,000,000 bar, aggregate ratio
      0.9987 and 0.9974 against >= 0.98 on two independent samples, three trees in one process with a
      byte-identical twin as null control. THE CAVEAT IS THE PART THAT MATTERS AND IT IS THE
      ENGINEER'S OWN: the instrument's per-cell floor is ~+/-1%, established by two structurally-zero
      cells and an identity twin reading up to 1.0126 -- LARGER THAN ANY SIGNAL THE CHANGE COULD
      PRODUCE. So KIWIPETE'S 0.9930 IS NOT A 0.7% REGRESSION and no per-cell number is claimable;
      only the aggregate is load-bearing. Re-derive on your own instruments as you did for ABC-015 and
      ABC-018.
  (2) ONE RISK IS ROUTED TO YOU SPECIFICALLY: the guard-ordering rationale is GATE-UNVERIFIABLE.
      Moving both new guards below the emptiness test, below the through-check test, or above the
      right test is behaviour-equivalent -- measured over 12,584 accepted positions, zero divergence --
      and therefore invisible to every test in the suite. The Engineer's cheap-tests-first reasoning
      (a byte compare below an attack scan) is sound and rests on READING, and NFR-001's own floor is
      larger than the effect, so no gate on this ticket can confirm or refute it. Severity low, named
      rather than left implicit.
  (3) NFR-005 IS EXCLUDED STRUCTURALLY, NOT BY MEASUREMENT, and the ticket says explicitly not to
      re-run the key benchmark to "confirm" it: zobristKey -> hasLegalEnPassant calls neither
      generateMoves nor legalMoves. QE did not re-run it either.
  (4) NO SECURITY TRIGGER, and it was re-asked rather than carried: no user-supplied string reaches
      src/moves.ts, no sink, no trust boundary. The queen-destroying mutant QE found is a worse
      RELIABILITY consequence, not a security one -- the same call the correction block made for
      family 2. security.asvs_level L1, security.block_on high, compliance_regime [].
  (5) TWO CRITERIA GAPS ARE OPEN AND THEY ARE BA/PM'S, NOT YOURS: G-1 (A5/A6 vary two piece types
      where the rule quantifies over all) and G-2 (no criterion varies how many of a side's rights are
      held). Both are CLOSED IN TESTS -- so a regression is caught -- but the SPECIFICATION still does
      not state them, which is what let this class recur on ABC-015, ABC-018 and ABC-009. Do not
      discharge them here.
  (6) STILL OPEN, UNCHANGED BY QE: A1-A10 plus the new rows is not PROVEN complete. 62 mutants is
      twelve times the Engineer's five and still not a proof; nine survivors remain and QE argues all
      nine equivalent over an enumerated corpus, not over the position space.
  (7) ABC-022's HALF (b) IS LIVE BY DESIGN. Not a miss, fenced by ABC-009's `## Out of scope`.

  Test-integrity checker exit 2 (registry absent) is an ERROR and not a pass; E2E and the auto-UAT
  oracles are `UNKNOWN - verify`. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.
-->

<!--
  EMPTIED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-018`, subtask
  `security-nfr-abc018-gate`, ABC-018's gate): **ABC-018 PASSES WITH RISKS and moved
  In Security/NFR -> Ready for UAT — the one exit this column owns.** In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4. No limit approached, no override taken, no written reason owed.
  NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.

  security.asvs_level L1, security.block_on high, compliance_regime [] — so NO Compliance Officer
  hand-off is owed, recorded rather than silently omitted. NO REQUIRED FIX IS OUTSTANDING and NO
  HIGH-SEVERITY ITEM EXISTS TO BLOCK ON. Five accepted risks, each with a severity, a NAMED OWNER
  and a place.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  both bars were re-derived here on this gate's own instruments, written outside the repository.

  THE SECURITY BAR — asserted on the EMITTED STREAM at BYTE level, which is what a terminal reads.
  21 adversarial strings (every C0 code point in one string, U+007F, ESC[2J, OSC-0 and OSC-8, DCS
  passthrough, DSR — the sequence that makes a terminal WRITE BACK — alternate screen, 8-bit CSI
  and OSC, both ends of the C1 block, a NUL run, CR overstrike, an RTL override, ZWSP and BOM,
  combining marks, an astral pair, and the epic's own example rejection text) x 2 glyph modes x 2
  strategies, placed in the MESSAGE region AND in a PANEL row:
    0 ESC bytes from supplied data · 0 C0 bytes · 0 U+007F · 0 code points above U+007F in ASCII
    mode · row count CONSTANT at 23 · exactly ONE write call per frame (84 frames, 84 writes) ·
    exactly the module's own two sequences in place (ESC[H, ESC[0J) and ZERO in append.
  Re-run in full under NODE'S PERMISSION MODEL, proved ARMED FIRST by three positive controls (fs
  write, fs read outside the allowlist, child process — all ERR_ACCESS_DENIED): the campaign still
  completes, so the module performs no filesystem operation and spawns no process while assembling
  and emitting. V1.2.5 and V1.3.2 therefore pass ON EVIDENCE rather than on a grep.

  ONE INSTRUMENT-LIMIT CORRECTION, RECORDED BECAUSE IT WOULD HAVE PRODUCED A FALSE MISS: this
  gate's first run read 42 surviving C0 bytes over 21 in-place frames. ESC is itself a C0 byte and
  those 42 are exactly 2 per frame — the module's OWN cursor-home and erase. Append mode read 0 and
  gave it away. Subtracted, the count is 0. A second instrument fault is recorded too: a retyped
  C1 payload lost its C1 code point in the editor and measured "2J"; the corpus is now referenced
  by INDEX, and both faults were in the INSTRUMENT, never in the module.

  THE C1 QUESTION QE ROUTED TO THIS GATE IS DECIDED, NOT RATIFIED — AND STRIPPING C1 WOULD BE
  THEATRE. Measured: a clean unicode frame with NO SUPPLIED TEXT AT ALL already carries 64
  C1-RANGE BYTES, and every one of them comes from the module's own glyph table (the board alone
  accounts for all 64). The single 8-bit CSI byte 0x9B IS THE BLACK QUEEN — U+265B encodes as
  E2 99 9B. The whole adversarial C1 payload adds 5 more. So stripping C1 from supplied strings
  would remove 5 of 69 and leave 64: the control that makes unicode mode safe is THE TERMINAL
  BEING UTF-8, which is a property of MODE SELECTION (ABC-015), not of sanitization. The bar stays
  exactly as written; the residual is accepted risk 4 below, owner EPIC-006.

  NFR-002 — BOTH HALVES RE-DERIVED, AND THE WRITE HALF'S UNKNOWN - verify IS DISCHARGED IN
  plans/nfr-catalog.md. Own harness outside the repository, own process, replay and parseFen
  hoisted out of every clock, the writer built once outside it, discarded warm-up, 11 rounds x
  2,000 iterations per cell, cell order ROTATED every round, medians of per-round means, checksum
  against elision, TWO FULLY INDEPENDENT SAMPLES, on Apple M3 (Mac15,13) / Node v24.12.0 /
  Darwin 25.5.0 arm64 and UNKNOWN - verify on any other hardware. Denominator re-derived: a 23-row
  frame at W = 18, 418 characters serialized, 419 characters / 483 BYTES on the wire in unicode
  and 419 bytes in ASCII, 425 characters in place.
    compute            5.998/6.031 · 5.978/6.015 · 6.137/6.046 us  (40 / 120 / 300 plies)
    write, in memory   0.638/0.644 · 0.636/0.635 · 0.648/0.644 us
    write, /dev/null   1.670/1.666 · 1.660/1.650 · 1.674/1.672 us
    write, a file      2.733/2.772 · 2.714/2.733 · 2.711/2.768 us  <- the reading the row carries
    write, a FIFO      2.317/2.294 · 2.285/2.285 · 2.302 us        <- EPIC-006's pipe shape
  SUM 0.0087-0.0088 ms against 16 ms — 0.055% of the budget, ~1,800x headroom, MET AT EVERY PLY
  COUNT ON EVERY DEFINITION, and BOTH HALVES FLAT across 40/120/300, which is this row's O(window)
  claim measured rather than inferred.

  THE ENGINEER'S SECOND ROUTED QUESTION IS ANSWERED: which of three "write" definitions the row
  takes. RULED — the row's quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`,
  and the bar is judged against the MOST EXPENSIVE HONEST READING, the regular file. In-memory
  omits the syscall the row's own words require and is a floor. The FIFO is EPIC-006's shape and is
  recorded BESIDE the row rather than as it, because a pipe write's cost includes the READER's
  scheduling and is a property of the pair, not of this module.

  WHERE THIS GATE DIFFERS FROM THE ENGINEER IT IS STATED, NOT SMOOTHED: compute, the in-memory sink
  and /dev/null all reproduce inside this gate's two samples; the REGULAR-FILE cell reads ~11%
  HIGHER (2.711-2.772 against 2.43-2.48 us) and THIS GATE CANNOT ATTRIBUTE IT. Both are >1,800x
  under the bar. THE IN-PLACE PATH, WHICH THE ENGINEER RECORDED AS NOT TIMED, IS NOW TIMED AND
  COSTS THE SAME: 1.650-1.690 us against append's 1.643-1.671 us to the same fd, so the 7 extra
  escape characters are BELOW INSTRUMENT RESOLUTION. What a real TERMINAL does with them is still
  UNKNOWN - verify and is not claimed.

  THE ONE WAY THIS BAR CAN BE BUSTED TODAY IS MEASURED RATHER THAN LEFT AS A WORRY. assembleFrame
  places no bound on a supplied item's LENGTH. Cold, first frame, own process — the shape of a
  frame assembled once per ply — a short message costs 0.16-0.20 ms, 100,000 characters 3.6-4.3 ms,
  400,000 characters 14.1-15.8 ms (THE WHOLE 16 ms BUDGET) and 1,000,000 characters 28.4-41.9 ms
  (1.8x-2.6x OVER). The item COUNT crosses at about 13,000; an ambiguity list is bounded by the
  ~218 legal moves of a position and costs 0.13 ms. NINTH INSTRUMENT-LIMIT CORRECTION ON THIS
  PROJECT'S RECORD: a warm micro-benchmark median reads ~5x lower on that cell and is the WRONG
  instrument for a once-per-ply frame; no number is claimed from it.

  A BOUNDARY WAS FOUND, LOCATED EXACTLY, AND SHOWN TO BE UNREACHABLE — recorded so nobody has to
  rediscover it. "No emitted row exceeds W" is a DISPLAY invariant (a wider row wraps and adds a
  screen row, which is the one way content breaks 4a). The (+N more) marker is emitted unpadded and
  untruncated, so at W <= 8 the region row EXCEEDS W. It cannot fire while the merged renderBoard
  is in the frame: W = max over the panel rows and renderBoard is always 18 wide, and the marker
  reaches 19 characters only at N >= 10^10 supplied items. Structurally unreachable — a fence, not
  a risk, and NO CHANGE IS ASKED FOR.

  THE FIVE ACCEPTED RISKS, NONE UNOWNED, NONE HIGH:
    1. THE CONTROL SITS IN THE ASSEMBLER, NOT IN THE WRITER. Measured: a raw row handed straight to
       beginFrameSession's writer emits 1 ESC byte; the same payload through assembleFrame emits 0.
       The writer's parameter is readonly string[] and cannot express "sanitized". LOW — there is
       no untrusted consumer in-process and src/frame.ts has ZERO runtime importers. NO CHANGE
       ASKED FOR: the split is the ticket's own VALUE/SESSION design. Owner ABC-019, the render
       trigger that will own the only call site.
    2. NO BOUND ON A SUPPLIED ITEM'S LENGTH — the 400,000-character measurement above. MEDIUM
       (V2.2.1 by analogue; not a live L1 failure, because nothing supplies this input yet). Owner
       BA/PM at EPIC-003, which owns the input surface and will decide what a rejection message may
       quote back. Inventing a bound here is the unrequested flexibility rule 7 forbids.
    3. THE mode PARAMETER IS AN UNCHECKED ERASED UNION AND IT FAILS OPEN. Measured: "ascii" gives 0
       code points above U+007F; "unicode", "ASCII", "", undefined, null, 0 and a plain object ALL
       give 34 — every non-"ascii" value selects unicode. selectGlyphMode fails SAFE to ascii on
       ambiguity (RISK-005's whole mitigation direction); assembleFrame fails OPEN. THIRD
       APPEARANCE OF THIS CLASS ON THIS BOARD (ABC-014's GLYPHS[mode] gadget, ABC-015's flags
       half). LOW — the only producer is ABC-015's closed two-literal domain and there is no
       runtime caller. Owner EPIC-006, where ABC-015's gate already placed the flags half.
    4. A FORCED --unicode ON A TERMINAL THAT IS NOT UTF-8. ABC-015's rule row 2 lets the flag beat
       the locale, so the mismatch is constructible; the frame then puts 64 C1-range bytes per
       frame on the wire from its own glyph table, one of them 8-bit CSI. LOW, and NOT fixable in
       this module — see the C1 ruling above. Owner EPIC-006, which owns the flag.
    5. THE MESSAGE REGION CANNOT DISPLAY THE EPIC'S OWN EXAMPLE REJECTION TEXT. Measured at the
       real W = 18: ["no piece on that square"] renders as ["", "(+1 more)"] — 23 characters do not
       fit 18, each item is placed whole or not at all, so the player is told that something was
       withheld and NEVER WHAT. "illegal move" and "e2e4 is illegal" do fit. This conforms to every
       criterion and to ## Scope, so it is a DESIGN gap and not a defect; it is the diagnosability
       shape this gate is required to look for — the failure message that explains a rejection is
       the one thing the player cannot read. MEDIUM, and the severity is explicitly NOT an
       ASVS-derived one; NO ASVS DEFAULT SEVERITY WAS OVERRIDDEN BY THIS GATE IN EITHER DIRECTION.
       Owner BA/PM, place ABC-016 / ABC-017 (which set W) and EPIC-003 (which writes the text).

  ASVS L1 COUNTED AT THE SOURCE RATHER THAN INHERITED: 70 active requirements, and V16 and V17
  carry NO L1 requirement at all — checked, not assumed. Judged individually: V1.2.1 PASS BY
  ANALOGUE ON EVIDENCE (the terminal-sink output-encoding bar above, this change's one real
  engagement) · V1.2.5 and V1.3.2 PASS ON EVIDENCE under the permission model · V2.1.1 PASS (the
  ticket's ## Scope and ## Security triggers ARE the documented input-validation rule, with a
  measurable bar) · V2.2.1 PASS on the message text, with risks 2 and 3 recorded rather than
  waived · V2.2.2 PASS BY ANALOGUE with risk 1 named · V15.3.1 PASS by analogue · V1.2.2/V1.2.3/
  V1.2.4/V1.3.1/V1.5.1 NOT ENGAGED (no HTML, JSON, SQL, WYSIWYG or XML anywhere) · V13.4.1
  DEFERRED, unchanged and NOT relaxed · V15.1.1/V15.2.1 NOT MET with the carried high -> low
  override restated and its evidence RE-CHECKED HERE (dependencies is {}, package.json untouched on
  this branch), owner Architect/Design at EPIC-006 · the remaining chapters STRUCTURALLY N/A. V7
  SESSION MANAGEMENT IS N/A AND IS NAMED RATHER THAN SKIPPED BECAUSE THE KEYWORD MATCHES:
  beginFrameSession is a process-lifetime strategy constant, and ASVS "session" means an
  authentication session with a token.

  THE PROTOTYPE-CHAIN GADGET WAS PROBED WITH A LIVE NULL CONTROL IN BOTH DIRECTIONS, the third time
  on this board. Unpolluted with `messages` genuinely absent, assembleFrame THROWS a TypeError;
  with Object.prototype.messages polluted it assembles and DISPLAYS the attacker's text; with the
  pollution deleted it throws again. So pollution turns a loud crash into a silent success — and it
  is BOUNDED: the sanitizer runs over whatever the property yields, so the emitted stream still
  carries ZERO ESC bytes. Pollution can inject TEXT, never an ESCAPE. And there is no sink: every
  computed-key write in non-test src/ is a numeric array index, with no __proto__, no Object.assign,
  no JSON.parse and no merge anywhere. NOT a risk, recorded as a measured bound.

  FAILURE MODES AND LOGGING, because a failure mode with no log is the incident nobody can diagnose
  later. This module logs NOTHING and there is no logging anywhere in this project. It throws
  TypeError on a missing panel, a non-array `messages` and a non-string row or item; a sink whose
  write() throws (EPIPE — a reader that closed early, which is exactly EPIC-006's pipe shape)
  propagates uncaught. NO ERROR HANDLING IS ASKED FOR HERE — guarding calls that cannot fail
  through the only future caller is the impossible-scenario handling rule 8 forbids — but ABC-019
  and EPIC-006 own the enclosing loop and should know that the frame write is a throw site. ONE
  FAIL DIRECTION IS WORTH RECORDING AS A POSITIVE: a nonsense height makes (sink.rows ?? 0) >= h
  false, so the writer APPENDS and emits zero cursor control. The strategy choice fails SAFE.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP a446297 BY THIS ROLE, NOT INHERITED: npm run lint
  exit 0 (the 2 infos are the pre-existing biome.json schema-version and recommended-deprecation
  notices, untouched), npm run typecheck exit 0, npm run build exit 0, npm test exit 0 at 304/304
  on 14 files, skip count 0 by the AGENTS.md command. Test-integrity checker exit 2
  (.grugops/test-skips.md absent) — the checker COULD NOT RUN, recorded as an ERROR and NOT as a
  pass, and NO registry file was created: an agent may not self-author a justification to clear its
  own gate. E2E and auto-UAT oracles UNKNOWN - verify. NO --coverage RUN WAS MADE, so the tracked
  coverage/ hazard never arose and the 100% figure stays QE's rather than being restated as this
  gate's.

  NO PRODUCTION CODE AND NO TEST WAS CHANGED. git diff --stat -- src/ is EMPTY and src/frame.ts
  still hashes bb827f52fe537817e40020a29dfa0e6d — the Engineer's FIRST-COMMIT digest this board's
  merge record checks, and the digest QE published. Repairing the implementation to make this
  gate's own verdict come out green is not this role's, and there was nothing to repair.

  CARRIED FORWARD UNCHANGED AND NOT DISCHARGED HERE: QE's two criteria-level items for BA/PM (no
  criterion constructs a sink whose isTTY or rows is ABSENT — the third consecutive ticket; and
  criterion 2 is weaker than it was ruled to be); the per-frame W handed to ABC-016/ABC-017;
  criterion 1's integration obligation at ABC-019/EPIC-006; the reserved prompt row's one-sided
  contract, still the Orchestrator's; the EPIC-006/ADR-0007 npx disagreement; the two ASVS
  deferrals; coverage/ tracked and stale. NO ACCEPTANCE CRITERION WAS AMENDED — that is the
  Backlog exit — and no ticket other than ABC-018 was touched.
-->

<!--
  ENTERED 2026-08-09 from In Review, by QE/E2E (task `ticket-to-pr-ABC-018`, subtask
  `qe-abc018-review`, Workflow 04) on a PASS verdict. In Security/NFR 0/2 -> 1/2. Security/NFR owns
  this column's exit. NOTHING MERGED, NOTHING DEPLOYED -- a human holds both.

  VERDICT: PASS, reached by BREAKING the module rather than by reading it. ALL TWELVE TESTABLE
  ACCEPTANCE CRITERIA ARE COVERED AND NON-VACUOUS except the two BA/PM already ruled on. NO
  PRODUCTION DEFECT WAS FOUND, and no production line was changed.

  THE FOUR MANDATORY GATES WERE RE-RUN ON THE TIP BY THIS ROLE, before and after the added tests,
  rather than inherited: lint exit 0 (the 2 infos are the pre-existing biome.json notices),
  typecheck exit 0, build exit 0, npm test 297/297 THEN 304/304 on 14 files, skip count 0 both
  times by the AGENTS.md command, src/frame.ts 100% on all four coverage axes against the 0.8
  threshold. The 277-on-13 baseline was RE-DERIVED by running the suite without this file, not
  subtracted. Test-integrity checker exit 2 (.grugops/test-skips.md absent) -- recorded as an
  ERROR and NOT as a pass; no registry file was created. E2E UNKNOWN - verify. Five shuffled
  full-suite runs clean.

  BOTH FAKES THE TICKET'S OWN ## Test notes NAME WERE CHECKED BY CONSTRUCTION AND NEITHER IS
  PRESENT. A byte-only rewrite of criteria 5 and 6 PASSES the no-padding mutant that the DELIVERED
  forms kill -- the screen model is load-bearing. And the mutant that IS the second fake (sanitize()
  left correct, the writer bypassing it) dies to criteria 11 and 12, which assert on the captured
  stream.

  BA/PM'S THREE CORRECTED CRITERIA EACH KILL THEIR MUTANT ALONE: the 23/23 boundary kills `>` for
  `>=`; the injected-sink restatement kills the per-write re-decide; the relational N kills an
  invented N. The corrections were not ceremony.

  SIX MUTANTS PASSED ALL TWELVE CRITERIA AND ALL 297 DELIVERED TESTS, AND NOT ONE WAS A DEFECT IN
  THE DELIVERED CODE. All six are now dead, each to exactly one added test:
    (1) SEPARATOR = "" -- items run together into one unreadable token while both region criteria
        still pass; the separator is load-bearing in the ticket's OWN arithmetic (6x4 + 5).
    (2) the sanitizer skipped over the PANEL rows -- the Engineer said the narrower reading "would
        pass every test in this suite", and it did.
    (3) no (+N more) when NOT ONE supplied item fits -- the region goes SILENTLY BLANK and the
        player is never told anything was withheld.
    (4) a TTY exactly ONE ROW SHORT still redrawing in place -- the OTHER side of the >= boundary.
        The criteria's only "too short" case is 13 rows short, which a `>= H - 1` slip clears.
        This is the exact failure 4b exists to prevent.
    (5) U+0000 surviving the C0 strip -- the bar is a RANGE and the range was never asserted.
    (6) the C1 block stripped in unicode mode -- CHARACTERIZED, NOT DECIDED, and ROUTED TO THIS
        GATE: the module matches the bar exactly (C0 and U+007F only), U+009B is 8-bit CSI, and a
        UTF-8 terminal does not honour it. The disposition is Security/NFR's.

  FOUR MUTANTS SURVIVE AND ALL FOUR ARE REPORTED. Three are PROVEN EQUIVALENT (`?? -1` for `?? 0`
  since H >= 3 on every reachable input; `sink.isTTY === true` for `Boolean(sink.isTTY)` over the
  declared type -- ABC-015's surviving mutant a SECOND TIME on the same coercion; `+ 1` for
  `+ SEPARATOR.length`). The fourth reserves marker room on every region row: it shows fewer items
  with a larger N, N stays a count of the input, so it is a CONFORMING ALTERNATIVE PACKING and not
  a defect -- which is what this ticket intends by leaving packing to the engineer.

  ONE PRODUCTION-SHAPED RISK IS NAMED AND IT IS STILL A PASS: W IS RECOMPUTED PER FRAME while the
  ticket calls it "a session constant". beginFrameSession takes H and not W. Demonstrated on the
  screen model -- a 24-wide frame followed by an 18-wide one leaves the wider frame's TAIL on
  screen, the same class the padding decision prevents one level up. It breaks NO criterion, it
  CANNOT FIRE TODAY (renderBoard is always 9x18, the other two panels are fixed-height stubs, and
  there is no runtime importer), and the fix is an API change whose shape depends on ABC-016 and
  ABC-017. Pinned by a CHARACTERIZATION test and handed to those tickets.

  TWO CRITERIA-LEVEL ITEMS ARE BA/PM's AND ARE NOT DISCHARGED HERE:
    (a) NO CRITERION CONSTRUCTS A SINK WHOSE isTTY OR rows IS ABSENT -- the Engineer's handed-over
        gap, CONFIRMED INDEPENDENTLY: both mutants die to their own added pin and to nothing else.
        THIRD CONSECUTIVE TICKET whose acceptance set is written over signals that agree.
    (b) CRITERION 2 IS WEAKER THAN IT WAS RULED TO BE. BA/PM left criterion 1 near-vacuous
        knowingly, on the reasoning that criterion 2 carries the falsifiable weight. MEASURED, it
        does NOT kill the grown-message-region mutant its own rationale names -- its two-item
        rejection never needs a third row. A third item fixes it. Amending a criterion is the
        Backlog exit, not this role's.

  NFR-002 WAS NOT RE-DERIVED HERE and no figure of QE's may be quoted as a measurement -- this
  gate owns it. One coarse single-sample sanity check agreed with the Engineer's in-memory pair
  (0.0071 ms vs 0.0067 ms per frame) so that a four-orders-of-magnitude claim was not relayed
  unlooked-at. plans/nfr-catalog.md is untouched and undischarged.

  NO E2E WAS WRITTEN AND NONE COULD BE: no CLI entry point until EPIC-006, zero runtime importers
  of src/frame.ts, AGENTS.md E2E slot UNKNOWN - verify. Reported as a gap, not filled with a fake.
-->

<!--
  EMPTIED 2026-08-08 by Security/NFR (task `ticket-to-pr-ABC-015`, subtask
  `security-nfr-abc015-gate`, ABC-015's gate): **ABC-015 PASSES WITH RISKS and moved
  In Security/NFR -> Ready for UAT — the one exit this column owns.** In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4. No limit approached, no override taken. NOTHING MERGED AND NOTHING
  DEPLOYED — a human holds both.

  security.asvs_level L1, security.block_on high, compliance_regime [] — so NO Compliance Officer
  hand-off is owed, and that is recorded rather than silently omitted. NO REQUIRED FIX IS
  OUTSTANDING. Four accepted risks, each with a severity, a NAMED OWNER and a PLACE.

  NFR-007's ZERO-FILESYSTEM / ZERO-PROCESS BAR WAS RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND IS
  MET. The delivered guard (src/glyph-mode.nfr.test.ts) was NEVER CITED — QE had already found it
  blind to node:fs/promises, a specifier it did not name, and a guard that fails by omission is not
  evidence. Three instruments, the first specifier-agnostic BY DESIGN:
    1. Node's PERMISSION MODEL (--permission --allow-fs-read=<dir>), which denies at the binding
       level, below every module mock. Proved ARMED first, by four positive controls: readFileSync,
       fs/promises.readFile, execSync and existsSync("/etc/locale.conf") -- the exact mutant QE
       built -- all ERR_ACCESS_DENIED.
    2. A cmp-verified BYTE-IDENTICAL COPY OF THE MODULE ALONE IN AN EMPTY DIRECTORY, with NO
       render.ts beside it. It imports and runs, which PROVES the `import type` line is erased and
       the RUNTIME IMPORT CLOSURE IS EMPTY -- stronger than reading the source.
    3. 165 FUNCTIONS PATCHED across fs, fs/promises, child_process, os and tty, plus a module-load
       recorder (node:module registerHooks).
  Across three ambient shapes (isTTY absent / true / false): 0 MODULES LOADED, 0 FILESYSTEM CALLS,
  0 PROCESS CALLS, 0 BYTES WRITTEN, and 0 wrong answers over all 11 selection paths and 2 sessions.

  ONE INSTRUMENT-LIMIT CORRECTION, RECORDED BECAUSE IT WOULD HAVE PRODUCED A FALSE MISS. The first
  run counted THREE fs calls inside the region -- openSync, readSync, closeSync -- and they were the
  ESM loader reading glyph-mode.ts off disk: the module LOAD, not the SELECTION. The load was
  hoisted out and the counters reset at the region boundary; the count is then 0. This is the eighth
  instrument-limit correction of this shape on this project's record, and the seventh produced a
  2.08x FALSE MISS on ABC-012.

  WHAT THE ONE PERMITTED READ ACTUALLY DOES, measured rather than assumed: process.stdout is a LAZY
  getter and the first touch constructs the stream for fd 1 -- Socket on a pipe, SyncWriteStream on
  a file and on /dev/null, WriteStream on a real terminal. It performs no permission-checked
  filesystem operation and no child process in any of the four shapes. So the bar is MET and the
  bigger sentence ("zero I/O below the JS line") is NOT claimed.

  THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL FOR THE FIRST TIME ON THIS TICKET. Every
  earlier test faked isTTY with defineProperty. This gate allocated a real pty (python3 pty.spawn)
  and ran the module inside it under the permission model: LANG=en_US.UTF-8 -> unicode, LANG=C ->
  ascii, with isTTY genuinely true and genuinely a boolean. Both directions right on a real device.
  It is ONE machine's terminal; Windows conhost, Windows Terminal, iTerm2 and tmux stay
  UNKNOWN - verify and are RISK-005's open item.

  THE ENVIRONMENT IS TOUCHED NARROWLY, measured with a recording Proxy on process.env: AT MOST 3
  KEYS READ and only LC_ALL / LC_CTYPE / LANG; it STOPS at the first set rung (LC_ALL alone when
  LC_ALL is set); ZERO ENUMERATIONS (ownKeys never trapped); ZERO env reads at all on a non-TTY sink
  (row 3 short-circuits before the loop -- so on the pipe EPIC-006's end-to-end test uses, this
  module reads no environment variable); and ZERO further ambient reads across 8 accessor calls
  after the session began.

  THE TICKET'S "NO SECURITY TRIGGER" REASON IS WRONG THREE TIMES IN ONE SENTENCE, AND THE RULING
  STILL HOLDS. Reported rather than ratified -- ABC-014's gate corrected exactly such a claim, and
  the subtask asked for the re-derivation, not the ticket's wording.
    "reads TWO environment variables"  -> it reads THREE. The FOURTH wrong count on this ticket and
                                          the first inside the section this gate audits.
    "and A BOOLEAN"                    -> process.stdout.isTTY is UNDEFINED on a pipe, a file and
                                          /dev/null; a boolean only on a real terminal. That is
                                          exactly why Boolean() is in the code.
    "interprets NO USER TEXT"          -> it interprets three user-influenceable env values against
                                          a regex. process.env is a real ambient data source, and
                                          src/glyph-mode.ts is the FIRST module in src/ to read it.
    "it writes nothing"                -> TRUE. 0 bytes to stdout and 0 to stderr, counted.
  WHAT ACTUALLY HOLDS IS STRONGER: THE RETURN DOMAIN IS CLOSED. Every path returns one of two module
  literals, and the env values are match SUBJECTS that are never returned, emitted or embedded in a
  message -- the same load-bearing property ABC-014's gate proved for the frame's output alphabet,
  one layer up. Measured over 138 HOSTILE LOCALE VALUES x 3 rungs x 2 TTY states (ANSI ESC and OSC
  payloads, C0 controls, a NUL byte, CRLF injection, shell metacharacters, command substitution,
  format strings, path traversal, SQL, a script tag, a __proto__ JSON payload, 10k- and 1M-character
  values, Unicode confusables, an RTL override): 0 THREW, RETURN DOMAIN EXACTLY {ascii, unicode}.
  Also measured: /utf-?8/i has no `g` flag so it carries no lastIndex (six identical calls agree),
  and a 5 MB value scans in 1.55 ms -- linear, no ReDoS (and V1.3.12 is L3, outside the active set).

  ONE REAL PROPERTY FOUND, AND IT IS A GADGET NOT A VULNERABILITY -- the environment sibling of the
  GLYPHS[mode] gadget ABC-014's gate found. src/glyph-mode.ts:87's `signals.env[name]` is an
  unguarded prototype-chain lookup AND THE REAL process.env FALLS THROUGH TO Object.prototype.
  Measured with a LIVE NULL CONTROL IN BOTH DIRECTIONS, because this module's default answer is
  unicode and a "polluted with UTF-8" result would have looked like a hit while proving nothing:
    real LANG=en_US.UTF-8 own, LC_ALL/LC_CTYPE not own, unpolluted  -> unicode
    Object.prototype.LC_ALL = "C"  (a rung the env does not own)    -> ASCII  (it OUTRANKS LANG)
    pollution deleted                                               -> unicode again
  hasOwn(process.env,"LC_ALL") stays false throughout while process.env.LC_ALL reads as "C". And
  under pollution the rung need not be a string, so UTF8.test's ToString RUNS ATTACKER CODE
  (measured, 1 invocation through the real process.env) and a throwing toString escapes
  beginGlyphModeSession uncaught. FOUR BOUNDS, each verified: (1) a REAL environment can never hold
  a non-string -- Node coerces on assignment, measured; (2) NO prototype-pollution sink exists
  anywhere in src/ -- every production module scanned with comments stripped, the only computed
  writes being position.board[i] = n into a Uint8Array; (3) the reachable return domain UNDER
  pollution is STILL exactly {ascii, unicode} -- it can flip a glyph table, it cannot inject a byte;
  (4) an own `false` flag shadows a polluted Object.prototype.ascii. LOW, does not block.

  ASVS L1 JUDGED, NOT PADDED. 70 active requirements, counted at the source (V1:8 V2:4 V3:8 V4:2
  V5:4 V6:13 V7:6 V8:4 V9:4 V10:5 V11:3 V12:3 V13:1 V14:2 V15:3; V16 and V17 carry NO L1 requirement
  at all -- checked, not assumed). TWELVE judged individually, 58 structurally N/A with the reason
  stated per chapter:
    V1.2.5  OS command injection      PASS on evidence -- zero process operations, measured under
                                      the permission model with a positive control. This is the
                                      requirement that would have been engaged had the module
                                      shelled out to `locale`, which the ticket forbids by name.
    V1.3.2  no dynamic execution      PASS -- and the module-load recorder measured ZERO modules
                                      loaded, which is stronger than a grep.
    V2.1.1  documented input rules    PASS -- the five-row table, the ## Scope bullet defining "set"
                                      as non-empty, criterion 14, the module header. This
                                      requirement was WEAKER before 2026-08-08's second pass.
    V2.2.1  input validated           PASS on the ENVIRONMENT input (positive pattern match, defined
                                      outcome for every non-match, closed return domain over 138
                                      hostile values). NOT ENGAGED on the flags -- see below.
    V15.3.1 minimum subset returned   PASS on evidence -- 3 keys, 0 enumerations, two-literal return.
    V1.2.1-1.2.4                      PASS BY ANALOGUE -- ASVS 5.0 has no terminal-output
                                      requirement; same treatment ABC-014's gate gave.
    V13.4.1                           DEFERRED, NOT PASSED -- packaging, EPIC-006. Not relaxed here.
    V15.1.1 / V15.2.1                 NOT MET at project level. CARRIED override restated with its
                                      evidence re-checked: L1 default `high` -> `low` because there
                                      are ZERO runtime dependencies (`dependencies` is {}) and
                                      package.json and the lockfile are untouched on this branch.
                                      Owner Architect/Design at EPIC-006. NOT a new override.
  V7 SESSION MANAGEMENT (6) IS N/A AND IS NAMED RATHER THAN SKIPPED, BECAUSE THE KEYWORD MATCHES:
  ASVS "session" means an authentication session and a session token; this module's "session" is a
  process-lifetime constant with no user, no token, no login and no timeout.
  NO DEFAULT SEVERITY WAS OVERRIDDEN BY THIS GATE in either direction -- nothing demoted to keep the
  gate green, nothing inflated to look thorough.

  ABC-014's BANKED V2.2.1 COUNTERFACTUAL IS HALF DISCHARGED BY THIS TICKET AND HALF STILL LIVE.
  That gate banked: "the moment EPIC-006 wires an unvalidated flag string to `mode`, V2.2.1 IS
  engaged. Owner ABC-015/EPIC-006, which owns the value."
    DISCHARGED -- the `mode` half, BY CONSTRUCTION. beginGlyphModeSession returns a value from a
      closed two-literal domain, so no user string can reach renderBoard's `mode`. THE CONDITION IS
      STATED RATHER THAN ASSUMED: this holds only if EPIC-006 passes THIS MODULE'S OUTPUT and not a
      raw flag string.
    STILL LIVE -- the flags half, and it is EPIC-006's. GlyphFlags are BOOLEANS and argv gives
      STRINGS; a non-empty "false" is truthy, so a naive --ascii=false passed through unconverted
      selects ASCII silently. EPIC-006's conversion obligation, recorded so it is inherited rather
      than discovered.

  A PRIOR GATE'S ACCEPTED RISK NAMES AN OWNER THAT DOES NOT OWN IT, AND IS CORRECTED HERE.
  ABC-014's gate recorded accepted risk 3 -- "a non-white-bottom orientation silently renders
  BLACK-bottom" -- with owner "ABC-015 / EPIC-006 (they own the value)". ABC-015 HAS NOW SHIPPED AND
  IT PRODUCES NO ORIENTATION VALUE AT ALL: its whole scope is the glyph mode, and the word
  "orientation" appears nowhere in the ticket. Checked at the source: no EPIC-002 ticket but ABC-014
  mentions orientation, and EPIC-002's own ## Dependencies puts the human's colour -- "which fixes
  board orientation" -- in EPIC-006's startup scope. RULED: that risk's SOLE owner is EPIC-006; the
  ABC-015 half is struck. The mechanism, because it is the reusable part: that gate correctly found
  renderBoard's two string parameters are both ERASED unions, then assigned BOTH VALUES' OWNERSHIP
  to the same pair -- but only one of the two, `mode`, is this ticket's. Corrected in a new note
  rather than by `supersedes`, because that note's other three risks are correct and superseding
  overrides a WHOLE note.

  THE FOUR ACCEPTED RISKS, NONE UNOWNED:
    1. The environment prototype-chain gadget (above)                LOW  Architect/Design
                                                                          @ ABC-018 / EPIC-006
    2. An uncaught exception can escape the session's ambient read   LOW  EPIC-006 (startup)
       -- no log, no context, and it fails CLOSED rather than             @ EPIC-006 / ABC-018
       fail-safe: no board at all is NEITHER of RISK-005's two
       directions. No fix asked for -- there is no logger and no
       caller at this layer, and guarding a read that can only fail
       under a polluted prototype is the impossible-scenario
       handling AGENTS.md rule 8 forbids (ABC-014's gate declined
       the sibling case for the same reason).
    3. The WHOLE environment crosses the call boundary -- the        LOW  Software Engineer
       GlyphSignals.env parameter is the entire Record and                @ EPIC-006
       beginGlyphModeSession hands it all of process.env, when
       three named keys are all that is read. NOT a leak today
       (measured: 3 keys, 0 enumerations, nothing emitted); a
       BLAST-RADIUS statement -- a future debug line inside
       selectGlyphMode prints a developer's whole shell environment
       rather than three locale strings. NARROWING THE PARAMETER
       NOW WAS CONSIDERED AND REJECTED AS GOLD-PLATING (rules 5/10).
    4. Every figure here is one machine and one Node version         LOW  Security/NFR
       (Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64),       @ EPIC-004's non-M3
       and the real-terminal reading is one pty on it.                    spike; RISK-005

  A DIAGNOSTIC, EXPLICITLY NOT A BAR, AND NO BAR WAS INVENTED (the ticket names no us bar and says
  why): selectGlyphMode 14.1-14.3 ns first rung, 28.3-30.3 ns all three rungs; beginGlyphModeSession
  433-445 ns -- 11 rounds x 200,000 iterations, discarded warm-up, medians of per-round means, TWO
  independent samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and
  UNKNOWN - verify on any other hardware. About 0.00002% of NFR-007's 2 s window. ATTRIBUTION IS
  PARTIAL AND LABELLED PARTIAL: two ambient property reads measure 156-158 ns in isolation and the
  closure ~3 ns, which does not sum to 433-445, and the residual is NOT attributed -- a number this
  gate cannot explain is not turned into a story. NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE.

  ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION AND NO NUMBER IS TAKEN FROM IT: whether the session
  closure retains an injected env object. The WeakRef + --expose-gc probe reported it reachable
  after three collections -- AND SO DID THE NULL CONTROL WITH NO SESSION CREATED, so the instrument
  cannot resolve it. Recorded UNKNOWN - verify. It is moot in production anyway: process.env is a
  process-lifetime global, so a reference to it retains nothing that was not already retained.

  GATES RE-RUN BY THIS ROLE ON THE TIP 8de5624 RATHER THAN INHERITED: npm test 277/277 on 13 files,
  skip count 0 by the AGENTS.md command, lint exit 0 (2 pre-existing infos), typecheck exit 0, build
  exit 0 -- PLUS three further full-suite runs with --sequence.shuffle, 277/277 each, this gate's own
  flakiness check rather than QE's. Per-file arithmetic re-derived: 253 on 11 files on main + 24 in
  the two new files = 277 on 13. NO PRODUCTION CODE AND NO TEST WAS CHANGED BY THIS GATE --
  git diff --stat -- src/ is empty and src/glyph-mode.ts still hashes
  9c1f4f4e957d4faf3c9cccc49a545185. NO --coverage RUN WAS MADE, so the tracked coverage/ hazard never
  arose; the 100% figure is QE's and is not restated as this gate's.

  WHAT THIS GATE REFUSED TO DO: it did not widen the delivered NFR guard (adding names to a list that
  fails by omission treats the symptom; the permission model covers every specifier at once); it did
  not pin the prototype gadget with a test (that means asserting behaviour under a deliberately
  polluted global, damaging the process it runs in, for a scenario with no reachable precondition --
  ABC-014's gate declined the same); it did not amend or re-open a single acceptance criterion (that
  exit is BA/PM's, taken twice today); it did not edit the Boolean() comment or re-adjudicate it
  (this gate's own measurement SUPPORTS the Orchestrator's "overclaiming, not lying" reading);
  it did not touch ABC-014's note, any other role's notes, plans/metrics.md, or coverage/ (rule 12 --
  still tracked, still stale, still flagged); and it did not re-route ABC-012's stale frontmatter or
  the snapshot net, both of which already have owners.

  UAT IS RECORDED AS DEFERRED TO EPIC-006, EXPLICITLY NOT PASSED. src/glyph-mode.ts has ZERO RUNTIME
  IMPORTERS (verified, not assumed), returns a value, writes nothing and prompts for nothing, and
  AGENTS.md's Dev / run is UNKNOWN - verify because there is no CLI entry point. There is no surface
  a human can exercise, so a UAT pass would be a fabrication. THE REAL-PTY RUN IS AN INSTRUMENT
  READING AND IS NOT OFFERED AS UAT. ABC-018 is the first ticket that puts this rule in front of a
  human. Same posture as ABC-012 and ABC-014, ruled on this ticket's own evidence.

  NOT DISCHARGED BY ANY OF THIS: NFR-007's actual target (npx to first board < 2 s) stays
  UNKNOWN - verify and is EPIC-006's -- a zero-I/O component inside a window is not the window; and
  the two-documents-disagree item on that row (EPIC-006 states npx in four places, ADR-0007 clause 5
  records the distribution mechanism as UNDECIDED) is untouched and still open, owners BA/PM and
  Architect/Design at EPIC-006's decomposition.

  THE MERGE-ORDER CONSTRAINT STILL BINDS: ABC-015 merges WITH OR BEFORE ABC-018, never after.
  ABC-018 is unstarted and in Backlog, so it is satisfiable and satisfied by merging this now.
-->

<!--
  ACCEPTANCE CRITERIA AMENDED IN PLACE 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask
  `bapm-abc015-spec-gaps`, Workflow 07). ELEVEN -> FIFTEEN.

  NO BOARD MOVE AND NO WIP CHANGE. ABC-015 stays in In Security/NFR (1/2); this role amended
  acceptance criteria, which is not a column exit, and THE In Security/NFR EXIT REMAINS
  SECURITY/NFR's ALONE. No column's WIP number moved. This is the order the Orchestrator reversed
  itself into: a gate certifies a change AGAINST its acceptance criteria, and three roles had
  independently reported those criteria incomplete, so the criteria are settled BEFORE the gate is
  spent rather than after.

  NO CODE CHANGE IS OWED AND NO QE RE-RUN IS OWED. All four amendments RATIFY the delivered
  implementation, and each is already pinned by a test that exists and passes today. The one item
  that COULD have changed code -- the empty-locale ruling -- is ratified, not overturned.

  NOTHING WAS TAKEN ON TRUST. This task has already produced one confirmed miscount and one flagged
  non-defect, so each item was re-derived by evaluating the CRITERIA AS WRITTEN against every
  implementation proposed for this module. src/ was not touched and no test was edited.

  (1) CRITERIA 10 AND 11 WERE BLIND TO A SINGLE-SIGNAL SESSION -- UPHELD, AND WORSE THAN REPORTED.
      THIS IS THE SECTION THIS ROLE ITSELF CORRECTED SEVEN HOURS AGO, and it is ruled on the
      evidence rather than defended. Criterion 11 never said WHICH ambient values the rewrite uses:
      measured across all 11,232 instantiations its wording admits, it excludes a session that
      hardcodes isTTY in 2,592 and ADMITS IT IN 8,640 -- two readings of one criterion, the exact
      defect this role ruled against at this ticket's Backlog exit. Two further real defects are
      excluded by NO reading at all: a session that DROPS THE FLAGS (--ascii silently ignored) and a
      LAZY session. FIXED BY ADDING CRITERION 15, NOT BY WIDENING 10 OR 11 -- loading the wiring
      onto a criterion about the cache is how this ticket produced four criteria that passed for
      reasons other than the ones they were written for.

  (2) THE LC_CTYPE RUNG WAS PINNED BY NO CRITERION -- UPHELD, QE's characterisation SHARPENED.
      Measured: both reordering implementations satisfy all nine original tuples. But criterion 6 is
      not the fault and was NOT rewritten -- its job is the spelling tolerance and it does it; it was
      carrying a precedence it was never asked to carry. The faults are that no criterion ever stated
      the middle rung, and that the file used its silent variables two ways (under the other reading
      criterion 6 WOULD have pinned LC_CTYPE > LANG and criterion 8 would have been FALSE). Fixed by
      one sentence in the lead-in plus criteria 12 and 13, which pin the rung against each neighbour
      with conflicting values set at once -- the shape the ticket's own ## Test notes have demanded
      in writing since it was cut.

  (3) AN EMPTY LOCALE VARIABLE COUNTS AS UNSET -- THE ENGINEER'S RULING IS RATIFIED. The one item
      that could change code, and it does not. Evidence, in the order it carried weight: this
      ticket's own row-4 rationale (a content-free variable must not become a negative signal);
      POSIX, CHECKED ON THIS MACHINE rather than recalled -- `env -i LC_ALL= LANG=en_US.UTF-8 locale`
      reports LC_CTYPE="en_US.UTF-8", the empty LC_ALL fell through, while LC_ALL=C wins; and the
      product value statement, since the literal reading freezes precedence at the first rung and
      hands ASCII to a UTF-8 player whenever CI or a shell wrapper exports LC_ALL=. It does NOT
      contradict the both-flags-true fail-safe ruling: that tuple is a CONTRADICTION between two
      explicit requests, this one is the ABSENCE of information. Now SPECIFIED (a ## Scope bullet
      plus criterion 14) instead of living as an inference in a code comment.

  (4) A FOURTH ITEM, FOUND HERE AND NAMED AS A FOURTH RATHER THAN SMUGGLED INTO THE THREE: NO
      CRITERION COULD EVER EXCLUDE A LAZY SESSION -- it is admitted under every one of criterion 11's
      11,232 conforming instantiations, because the criterion requests the mode before rewriting
      anything. QE closed it in tests; it is not a test detail. Epic acceptance 2b is "decided
      exactly once, BEFORE the first frame", and this role ruled that once-ness ONTO THIS TICKET on
      2026-08-08 after finding ABC-015 and ABC-018 each pointing at the other. Owning a promise means
      stating it. Criterion 11 widened by one clause; it kills the lazy session and nothing else, and
      the delivered session is already eager by construction.

  NO CRITERION WAS RENUMBERED. The whole record cites them by number ("dies to criterion 11 alone"),
  so the four new ones are APPENDED as 12-15 rather than filed next to their kin, and every existing
  citation stays true. Size S (2) and priority P1 are unmoved -- the second pass added no
  implementation work at all.

  ONE COSMETIC FOLLOW-UP, FLAGGED AND NOT ACTED ON, AND NOT A GATE BLOCKER: the tests that pin
  criteria 11-15 sit under headings calling them BEYOND the criteria ("QE/E2E adversarial coverage",
  "the engineer's stated assumption"). Re-labelling is one line per heading in src/glyph-mode.test.ts
  and belongs to QE; this subtask does not touch src/, and the assertions already ARE the criteria.
-->

<!--
  ENTERED 2026-08-08 by QE/E2E (task `ticket-to-pr-ABC-015`, subtask `qe-abc015-review`,
  Workflow 04). In Security/NFR 0/2 -> 1/2. Security/NFR owns this column's exit.

  VERDICT: PASS. The eleven acceptance criteria are each implemented, each tested, and each pass.
  The delivered implementation is CORRECT -- no production defect was found and no production code
  was changed. What was found is a TEST-SUITE hole, and it was closed here.

  THE FOUR MANDATORY GATES WERE RE-RUN BY THIS ROLE ON THE TIP RATHER THAN INHERITED, both before
  and after the tests below were added: lint exit 0 ("Checked 29 files ... Found 2 infos" -- the two
  infos are the PRE-EXISTING biome.json schema-version and deprecated-`recommended` notices, not
  this ticket's), typecheck exit 0, build exit 0, `npm test` 271/271 on 13 files BEFORE and 277/277
  on 13 files AFTER, skip count 0 by the AGENTS.md command both times. The Engineer's and the
  Orchestrator's figures REPRODUCE EXACTLY.

  THE TICKET'S OWN NAMED MUTANT IS DEAD, ESTABLISHED RATHER THAN ASSUMED. The `## Test notes` name
  it: "the implementation that reads `process.env` on every call passes all nine table rows and must
  fail only these two [session criteria]". It was built and run: it dies, and it dies to criterion
  11 exactly as BA/PM designed it to. That correction at the Backlog exit did the job it was made
  for.

  THREE MUTANTS PASSED ALL ELEVEN ACCEPTANCE CRITERIA AND ALL 271 DELIVERED TESTS. All three are
  real production defects; all three are now killed by tests added here.

  (1) LOCALE PRECEDENCE -- THE MIDDLE RUNG WAS NEVER PINNED. Reordering to LC_ALL > LANG > LC_CTYPE,
      or promoting LC_CTYPE above LC_ALL, both went green. THE TICKET'S OWN `## Test notes` FORBID
      THE SHAPE THAT LET THIS THROUGH, in these words: "Test the LC_ALL > LC_CTYPE > LANG precedence
      with conflicting values set at once, not one variable at a time. One-at-a-time tests pass on
      an implementation that reads the wrong one." Criterion 5 pins LC_ALL against LANG; criterion 6
      sets LC_CTYPE ALONE -- the one-at-a-time shape -- so LC_CTYPE was never tested against either
      neighbour. Closed with 4 rows, each setting two or three variables to CONFLICTING values.

  (2) A MISSING isTTY PROPERTY WAS NEVER CONSTRUCTED, AND IT IS THE ONLY SHAPE PRODUCTION EVER
      PRESENTS. Node leaves `isTTY` ABSENT on a pipe, a file or CI -- it does not set it to `false`.
      Every session test rewrote it to a real boolean, so a session reading a missing property as A
      TERMINAL (`?? true`, or a typeof guard) passed everything while sending Unicode into a pipe --
      which breaks the determinism the ticket's own row-3 rationale promises EPIC-006's pipe-driven
      end-to-end test. Closed with a test that deletes the property.

  (3) THE SESSION WAS NOT PINNED AS EAGER. A lazy accessor that memoises on FIRST CALL passed
      everything, because criterion 11 requests the mode immediately after beginning the session.
      Epic acceptance `2b` is "decided exactly once, BEFORE the first frame", and lazy moves that
      decision to whenever the first frame is drawn. Closed with a test that moves the ambient
      BETWEEN begin and the first request.

  A FOURTH HOLE, IN THE NFR-007 GUARD ITSELF: it spied `node:fs` and `node:child_process` but not
  `node:fs/promises`, a different specifier. A mutant reading /etc/locale.conf through
  `node:fs/promises` went green while the SYNCHRONOUS twin of the same read died. The async half of
  the same guard is now spied. (The non-prefixed `fs` specifier was tested and DOES die -- vitest
  aliases it. That one was not a hole.)

  ONE MUTANT SURVIVES AND IT IS REPORTED, NOT HIDDEN: dropping the `Boolean()` coercion on
  `process.stdout.isTTY`. It is an EQUIVALENT mutant, proven rather than argued -- with the property
  genuinely absent, `Boolean(undefined)` is `false` and `!false` is `true`, while `!undefined` is
  also `true`, so row 3 fires identically. The new absent-property test exercises exactly that input
  and passes either way. NOT a coverage gap. But the module's comment at that line claims the
  coercion "is doing real work and is not decoration", and that claim is FALSE at runtime -- it is a
  type-honesty nicety. Recorded as a comment defect, not a code defect; nothing was edited.

  NO E2E WAS WRITTEN AND NONE COULD BE. `quality.ui_e2e` is `ui-or-critical-path`, AGENTS.md has E2E
  as `UNKNOWN - verify`, there is no CLI entry point until EPIC-006 and this module has ZERO runtime
  importers. Reported as a gap rather than filled with a fake.

  TWO SPEC-LEVEL ITEMS REMAIN BA/PM's AND ARE NOT DISCHARGED HERE -- criteria 10/11 being blind to a
  single-signal session, and the empty-locale ruling. A THIRD IS ADDED BY THIS PASS: criterion 6 is
  the one-at-a-time shape the ticket's own test notes forbid, so the CRITERIA, not just the suite,
  under-specify the LC_CTYPE rung. The suite now covers all three; the CRITERIA still do not.
  Amending an acceptance criterion is the Backlog exit and it is not this role's.

  ONE FLAGGED DEFECT FROM THE ENGINEER DOES NOT EXIST AND THE ORCHESTRATOR'S DISPROOF IS CONFIRMED
  INDEPENDENTLY: plans/traceability.md's ABC-015 row has 12 raw pipes, ONE of them escaped, so 11
  unescaped and TEN cells -- the same as the header and every other row. Counted by machine here,
  splitting on pipes not preceded by a backslash. Do not "fix" it; the fix would remove a correct
  escape and break the row.
-->

<!--
  LEFT 2026-08-07 by Security/NFR (task `ticket-to-pr-ABC-014`, subtask `security-nfr-abc014-gate`,
  Workflow 04) on a PASS_WITH_RISKS verdict (board verdict PASS). ABC-014 moved
  In Security/NFR -> Ready for UAT, the one exit this role owns. In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4; no limit approached, no override taken. The full gate record is in the
  Ready for UAT comment below and in the context notes under
  `.grugops/context/ticket-to-pr-ABC-014/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS NOW PAID. The bar was RE-MEASURED, not inherited -- 2.092 / 2.056 us
  against the 500 us bar, ~240x headroom, two independent samples that BRACKET the Engineer's
  2.070 us. `plans/nfr-catalog.md`'s `UNKNOWN - verify` on the board-scan compute half is
  discharged, in exactly 3 lines of that file, with no target moved.
-->

<!--
  ENTERED 2026-08-07 by QE/E2E (task `ticket-to-pr-ABC-014`, subtask `qe-abc014-break`, Workflow 04)
  on a PASS verdict. In Security/NFR 0/2 -> 1/2; no limit approached, no override taken. The full QE
  record -- the one surviving mutant, the two assertions measured blind, the FEN-text oracle that
  closes 22 unverified snapshots, and the five Engineer hand-offs adjudicated -- is in the In Review
  comment above and in the context notes under `.grugops/context/ticket-to-pr-ABC-014/notes/`; it is
  not restated here.

  WHAT THIS COLUMN OWES, stated so it is not re-derived: NFR-002's board-frame compute bar is the
  ONE trigger. The Engineer's figure is 2.070 µs worst against 500 µs on Apple M3 / Node v24.12.0 /
  Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere, measured out of tree with parseFen outside the
  timed region. This board's standing practice is that this gate re-measures on its own harness
  rather than inheriting -- the ABC-011 and ABC-012 precedent. NFR-002's WRITE half stays
  `UNKNOWN - verify` and is ABC-018's. plans/nfr-catalog.md's NFR-002 row is owed the compute half
  and is this column's file, not QE's.

  ---
  EXITED 2026-08-04 by Security/NFR (task `ticket-to-pr-ABC-012`, subtask `security-nfr-abc012-gate`,
  Workflow 04). ABC-012 moved In Security/NFR -> Ready for UAT. In Security/NFR 1/2 -> 0/2,
  Ready for UAT 0/4 -> 1/4; no limit approached, no override taken, no written reason owed.

  VERDICT: PASS_WITH_RISKS (result PASS, NO required fix outstanding, FIVE accepted risks each with
  a named owner and a place). Gated against `security.asvs_level: L1` and `security.block_on: high`.
  Nothing sits at `high`, so nothing blocks. `compliance_regime` is [], so no Compliance Officer
  hand-off is owed.

  IT WAS NOT EARNED BY READING THE ENGINEER'S NUMBERS OR QE'S VERDICT. Those were re-run only as a
  control on this gate's own instruments and they reproduce: 226 passed / 10 files / 0 failed, skip
  count 0 by the AGENTS.md command, lint / typecheck / build all exit 0, and src/history.ts md5
  12f8c562d46286e68383f8e2cab407fa -- identical to the Engineer's feat commit 47cad31, which is the
  independent confirmation that QE changed no production code.

  (A) THE FIVE NUMERIC BARS WERE RE-MEASURED ON THIS GATE'S OWN HARNESS -- the standard this column
  set on ABC-011's NFR-005, where inheriting a design hop's figures was explicitly refused. Own
  harness outside the repository, its own process doing nothing else, a discarded warm-up round, 11
  rounds with the CELL ORDER ROTATED EVERY ROUND, medians of per-round means, TWO fully independent
  samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` on any
  other hardware. Population stated: the SAME deterministic LCG game src/history.test.ts:81-89 plays,
  so a ply count means the same thing in the harness and in the suite.

  ALL SIX MET, EVERY ONE WITH ROOM:
    takeBack(h,2) @120 [upper bound]  2.46 / 2.45 us   vs <= 5 us     0.49x  MET
    keyHistory(h) @120                40.16 / 40.20 us vs <= 60 us    0.67x  MET
    repetitionCounts(h) @120          44.35 / 44.45 us vs <= 75 us    0.59x  MET
    gameStatusOf(h) @120              47.75 / 47.59 us vs <= 75 us    0.64x  MET
    playMove(h,move) @120             8.6 / 8.2 ns     vs <= 100 ns   0.09x  MET
    repetitionCounts(h) @300 plies    91.93 / 92.15 us vs <= 150 us   0.61x  MET
    repetitionCounts(h) @40 plies     17.57 / 17.48 us  (shape only, no bar)
  Growth is linear with a constant offset -- 17.5 / 44.4 / 92.0 us at 40 / 120 / 300 plies -- so at
  300 plies the derive is still ~10x under ADR-0002's own ~1 ms threshold for re-opening clause 2,
  and SEAM 2's no-memoization decision is under no pressure from anything measured here.

  (B) BOTH FENCES QE HANDED THIS COLUMN WERE TESTED RATHER THAN PASSED ON A THIRD TIME.

  FENCE 1 -- gameStatusOf's margin is POSITION-DEPENDENT. Discharged with the fence's own
  measurement: the margin over repetitionCounts is 3.40 / 3.14 us on the startpos-anchored line and
  4.55 / 4.49 us on a kiwipete-anchored line, against bare legalMoves of 2.74 us and 3.89-3.96 us at
  those positions. So the margin IS the one legalMoves call inside gameStatus plus ~0.6 us of that
  function's other work, and it swings 1.4x on position alone. The fence is real.
  AND THE RESULT NOBODY PREDICTED: the expensive-legalMoves anchor is CHEAPER OVERALL -- kiwipete
  41.89 / 42.25 us against startpos 47.75 / 47.59 us -- because on this module the O(plies) derive
  dominates and that line's replay is cheaper by more than its generator call is dearer. The bar
  survives the worst legalMoves position this repository benchmarks. Arithmetic worst case over the
  observed extremes (worst derive 44.45 + worst legalMoves 3.96 + ~0.6 gameStatus overhead) is
  ~49.0 us = 0.65x of the bar -- labelled as arithmetic, not as a measurement.

  FENCE 2 -- the takeBack figure is an UPPER BOUND. Tested by moving the two restoring playMove
  calls OUTSIDE the timed region. It reads HIGHER, not lower: 2.92-2.93 us against 2.45-2.46 us,
  because the clean variant builds a fresh 120-ply history per iteration and pays cold-object cost.
  The restore's arithmetic contribution is 2 x ~8.4 ns = ~0.017 us, BELOW what this instrument can
  resolve. So the bound is confirmed as a bound, is tight to within less than the instrument can
  see, and THE BAR IS MET ON EITHER FRAMING (0.49x and 0.59x). No claim is made that either framing
  resolves the other.

  (C) ONE INSTRUMENT WAS BUILT, MEASURED, AND DISCARDED BEFORE IT PRODUCED A FALSE MISS. The first
  takeBack cell called legalMoves twice INSIDE the timed region and read 10.38 us against the 5 us
  bar -- 2.08x, a MISS. Two generator calls at 2.7 us each account for ~5.4 us of it. The restoring
  moves are fixed across iterations, so they are now computed once outside the clock and the cell
  reads 2.46 us. NO NUMBER IS CLAIMED FROM THE DISCARDED INSTRUMENT and it is recorded rather than
  buried: a gate that reports a MISS it manufactured itself is worse than one that reports nothing.
  Seventh instrument-limit correction this project has recorded, caught by the caution
  plans/nfr-catalog.md already carries.

  (D) THE TICKET'S "NO SECURITY TRIGGER" ASSERTION WAS TESTED, NOT INHERITED -- AND IT HOLDS.
  Verified structurally rather than by reading the ticket: the transitive import closure of
  src/history.ts was rebuilt (8 modules -- history, apply, fen, gameend, legal, moves, position,
  zobrist), EVERY import in it is relative and inside src/, and across the whole closure there is
  ZERO node: builtin, child_process, require(, eval(, new Function, process.env, globalThis or
  __proto__. No filesystem, no network, no environment, no serialization sink, no logger, no secret,
  no privilege check. ZERO RUNTIME DEPENDENCIES (package.json has no `dependencies` key at all) and
  package.json + package-lock.json are byte-identical to merged main 39e260d.
  HOSTILE INPUT ACTUALLY FED TO THE MODULE -- 12 payloads at newGame(initialFen), its only external
  string input: prototype-pollution keys, __proto__ and constructor/prototype placements, a
  10,000-char string, control bytes, `; rm -rf /`, ../../../../etc/passwd, ' OR 1=1 --, <script>.
  EVERY ONE REJECTED with a typed FenError. ZERO prototype pollution (Object.prototype unmodified),
  zero hang, zero crash.
  ASVS L1 JUDGED, NOT PADDED: 12 of the 70 L1 requirements are reachable at all and each was judged
  from evidence; 58 are structurally N/A with the reason stated per block (45 across V3/V4/V6/V7/V8/
  V9/V10/V12 -- no HTTP, no browser, no user, no account, no session, no token, no socket; V5 -- no
  file handling; V14 -- there is NO sensitive data in this system, the entire data content is a chess
  position and a move list, zero PII and zero secrets; V11.3.x -- no encryption; the V1 output-encoding
  half -- no HTML, XML, URL, JSON or template anywhere). V1.2.4 / V1.2.5 / V1.3.2 PASS by absence of
  sink, verified structurally. V11.4.1 is N/A WITH ITS REASON: zobristKey is a NON-cryptographic
  position-identity hash that signs nothing and derives no key -- a collision is a wrong draw verdict,
  a correctness risk and not a security one. A judged subset with its delta stated beats a re-run of
  70 rows, which is the ABC-011 gate's precedent.

  (E) THE takeBack(NaN) RULING, WHICH THIS COLUMN WAS ASKED FOR. REPRODUCED AND EXTENDED PAST QE'S
  TABLE: NaN, undefined, the RAW STRING "abc" and {} each silently discard the ENTIRE game; null, [],
  -1 and -Infinity are safe no-ops; "2" and [3] are correct by coercion; 1.5 takes back 2 and 0.5
  takes back 1; Infinity and 1e21 clamp to 0 correctly. THE STRING CASE IS NEW HERE AND IT IS THE ONE
  THAT MATTERS -- ABC-019 parses a ply count from user input and BOTH plausible implementations reach
  the defect (Number.parseInt("abc") is NaN; handing the raw token through is worse still).
  SEVERITY MEDIUM. IT DOES NOT BLOCK against security.block_on: high, and the reasoning is written out
  rather than asserted because the convenient answer here would have been the easy one. It is a
  CORRECTNESS and DATA-INTEGRITY defect, not a security finding. Under ASVS V2.2.1 an unvalidated
  input used for a business decision is an L1 requirement, and this role's own rule makes an L1 fail
  HIGH by default -- which would block. IT IS NOT AN L1 FAILURE TODAY, and the reason is a fact this
  gate MEASURED rather than an opinion: THE INPUT SURFACE DOES NOT EXIST. src/history.ts has ZERO
  production importers, and there is NO call to takeBack or playMove anywhere outside
  src/history.test.ts. Nothing untrusted reaches it and there is no trust boundary for a validation
  control to sit on. The requirement is not FAILED -- it is NOT YET ENGAGED.
  AND THE COUNTERFACTUAL IS STATED PLAINLY RATHER THAN BANKING THE CONVENIENT HALF: the moment
  ABC-019 wires a parsed ply count to this function, V2.2.1 IS engaged, the default severity is HIGH,
  and IT BLOCKS. That is not a deferred security control -- it is a named trigger with a named owner,
  recorded so ABC-019's gate cannot claim it was not told. Owner: BA/PM to rule the guard; place:
  ABC-019. Not fixed, and deliberately not pinned by a test (a test asserting today's output would
  enshrine it and make the eventual fix look like a regression) -- QE's reason, which this gate shares.

  (F) playMove's UNGUARDED PRECONDITION -- the consequence is worse than "a corrupt board", and this
  is new. Feeding a start-position move to a history anchored at 8/8/8/8/8/8/8/K6k w - - 0 1 is
  accepted without error, materialises a knight, and gameStatusOf then returns
  {"result":"draw","reason":"insufficient-material"} -- a well-typed, CONFIDENT, WRONG terminal
  verdict. ASVS V2.3.1 PARTIAL, not engaged today for the same zero-caller reason. SEAM 1 priced the
  guard at ~2-5 us and declined it; NOT re-opened here, but now on the record with its real
  consequence. Owner: Architect/Design; place: ABC-019 / EPIC-003.

  (G) THE COVERAGE HAZARD WAS READ BEFORE COVERAGE WAS RUN, exactly as QE asked. coverage/ is tracked
  (22 files, confirmed) and is NOT in .gitignore (confirmed). QE's mitigation was used and then
  VERIFIED rather than trusted: --coverage.reportsDirectory pointed outside the repository gave
  src/history.ts 100 / 100 / 100 / 100 against a 0.8 threshold, with `git status --porcelain -uall
  coverage` EMPTY and `git diff --numstat 3a44b3f -- coverage` EMPTY. coverage/ is byte-identical
  after this gate's run. The hazard was NOT reproduced here -- QE reproduced it twice already under a
  controlled restore and this gate had nothing to add by damaging tracked files a third time.

  (H) THE TEST-INTEGRITY CHECKER WAS RE-RUN AND RECORDED AS AN ERROR, NEVER AS A PASS. Run exactly as
  Workflow 05 step 3 specifies: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "Error: cannot read the registry file", exit=2. The registry does not exist
  (confirmed with ls). Exit 2 is "the checker could not run" and is NOT the exit-1 short-circuit and
  NOT a pass. Three roles have now run it independently on this ticket and all three recorded the
  same. The suite's skip count is 0, captured here with the AGENTS.md command, so there is nothing
  for the registry to justify; the registry is human-owned and NO FILE WAS CREATED -- an agent may not
  self-author a justification to clear its own gate. The standing gap QE named (no board entry or
  trace row in this project has ever mentioned this checker) is closed FOR THIS TICKET by this comment
  and the trace row, and remains open for the project.

  (I) src/history.ts:42's DOC CONTRADICTION CONFIRMED ON THIS GATE'S OWN INSTRUMENTS, BOTH HALVES.
  "documented and tested" is FALSE -- no test in src/history.test.ts touches position.board (searched;
  seven other test files do, none about history.position). And the comment tells callers not to hold
  the reference across a takeBack, which the shipped resetTo makes SAFE: measured, a held reference is
  === h.position after takeBack, is not stale, and reads the correctly rewound position. The comment
  errs in the SAFE direction so it is not a defect and not a blocker, but ABC-019 is the first caller
  and will read one of two documents that disagree. Named, not fixed -- it is production-code text.

  FIVE ACCEPTED RISKS, EACH WITH A NAMED OWNER AND A PLACE (no unowned accepted risk):
    1. takeBack(NaN)/"abc"/{}/undefined destroys the game -- MEDIUM -- owner BA/PM, place ABC-019.
    2. playMove validates nothing; a foreign move yields a confident WRONG verdict -- MEDIUM --
       owner Architect/Design (SEAM 1), place ABC-019 / EPIC-003.
    3. src/fen.ts accepts out-of-range move counters: 999999999999999999999 is ACCEPTED, becomes
       1e+21, breaks FEN round-trip byte-identity, and makes gameStatusOf report a seventy-five-move
       draw before the game starts. Negative / non-numeric / exponential / hex are all correctly
       rejected, so this is a RANGE gap in a control that exists, not a missing control. ABC-001's
       merged Done code, out of scope here (AGENTS.md rules 9 and 12) -- recorded because THIS ticket
       makes it reachable through a new door, newGame(initialFen). LOW -- owner BA/PM to cut it or
       fold it into the ABC-009 / ABC-010 invalid-FEN family, place EPIC-001.
    4. coverage/ tracked, unignored and stale -- LOW -- owner a human (repository hygiene, not an
       agent's cleanup). THREE ROLES HAVE NOW FLAGGED IT AND NO TICKET EXISTS FOR IT; three flags with
       no ticket is how a flagged item evaporates, so the missing artefact is named rather than a
       fourth flag added. BA/PM to cut it.
    5. Every NFR figure is one machine and one Node version -- LOW -- owner Security/NFR, place
       EPIC-004's already-scheduled non-M3 spike (RISK-002's mitigation), the same instrument that
       lifts NFR-005's PROVISIONAL marker. The two samples agree to ~1% and the margins are 1.5x-11x,
       so a 3x slower machine still clears every bar -- but that is ARITHMETIC, not a measurement.

  WHAT THIS GATE COULD NOT SETTLE, named rather than smoothed: why this gate's playMove figure
  (8.2-8.6 ns) is 1.5x the Engineer's (12.4-12.7 ns) -- both are >7x under the bar so it does not move
  the verdict, but the Engineer's harness shape is not recorded in enough detail to reproduce and "we
  do not know why these differ" is the honest sentence; whether the two takeBack framings resolve each
  other (they do not -- the delta is below instrument resolution); the true worst case for gameStatusOf
  across all positions (two anchors measured, the rest is arithmetic); and whether EPIC-006 will ever
  let a user type a FEN, which is the scope question risk 3's LOW severity rests on.

  NO PRODUCTION CODE WAS CHANGED AND NO TEST WAS ADDED. src/history.ts and src/history.test.ts are
  byte-identical to what QE handed over; this gate names required fixes rather than making them, and
  both defects it found need GUARDS, which are production logic this column does not write.
  NO NFR TARGET MOVED -- not one. plans/nfr-catalog.md gains ABC-012's real-code measurements on the
  two rows that already name this module's derives (NFR-002's boundary condition, NFR-003's turn
  budget); NFR-001, NFR-004, NFR-005, NFR-006 and NFR-007 are byte-identical.
  No acceptance criterion, `## Out of scope` line, NFR bar or test note was edited -- including
  criterion 2, whose wording remains BA/PM's and is upheld as unsatisfiable by two gates now.
  The double-push repetition test stays DECLINED on QE's routing reason; this gate has no evidence
  that changes it and does not re-open it. ABC-009, ABC-010 and ABC-022 are carried, not fixed.
  NO PR -- this repository has no git remote and none was invented. NOTHING MERGED, NOTHING DEPLOYED;
  a human holds both.
-->

<!--
  ENTERED 2026-08-04 by QE/E2E (task `ticket-to-pr-ABC-012`, subtask `qe-abc012-review`, Workflow
  04) on a PASS verdict. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no
  override taken. The full review record -- the 21 mutants, the three that survived the delivered
  suite, the compiler-verified ruling on criterion 2, and the two corrections of record -- is in the
  In Review comment above and in .grugops/context/ticket-to-pr-ABC-012/notes/.

  WHAT THIS COLUMN IS BEING HANDED, BY NAME:

  (1) THE FIVE NUMERIC NFR BARS, DELIBERATELY NOT RE-MEASURED BY QE. takeBack(2) <= 5 us,
  keyHistory <= 60 us, repetitionCounts <= 75 us, gameStatusOf <= 75 us, playMove <= 100 ns, all at
  120 plies, plus the growth check repetitionCounts @300 plies <= 150 us. The Engineer measured all
  of them MET on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify`
  anywhere else. Two fences travel with those figures and should not be dropped: the takeBack number
  is an UPPER BOUND (its two restoring playMove calls sit inside the timed region, ~0.025 us of the
  2.45 us), and gameStatusOf's 3.2-3.6 us margin over repetitionCounts is the one legalMoves call
  inside gameStatus, which is POSITION-dependent in a way the two derives are not.

  (2) NOTHING COST-SHAPED WAS ADDED BY THIS GATE. The 5 new tests carry no wall-clock assertion.
  They add 12 replays of at most 12 plies and one 41-ply game; the file runs in 18 ms.

  (3) A COVERAGE HAZARD YOU WILL HIT, WITH ITS MITIGATION MEASURED. coverage/ is TRACKED (22 files)
  and unignored, and a coverage run damages it: plain `npx vitest run --coverage` modifies 15
  tracked files; `--coverage.include=...` DELETES 12 and modifies 3. Both reproduced here under a
  controlled restore. Use `--coverage.reportsDirectory=<path outside the repo>` -- verified to leave
  coverage/ byte-identical. Whether a generated report should be tracked at all is a human's call,
  flagged and not fixed, and the committed report is already stale (it predates src/history.ts).

  (4) ONE PRODUCTION-CODE GAP THAT IS NOT A COST BAR: takeBack(history, NaN) silently discards the
  whole game. Named, not fixed, not pinned. It is BA/PM's to rule and ABC-019's to consume, but it
  is recorded here because this column sees the module before the turn loop does.

  (5) THE TEST-INTEGRITY CHECKER STILL RETURNS EXIT 2, re-run by this gate exactly as Workflow 05
  step 3 specifies: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "cannot read the registry file", exit=2. Exit 2 is "the checker could not run"
  and is NOT a pass and NOT the exit-1 short-circuit. The suite's skip count is 0, measured with the
  AGENTS.md command, so there is nothing for the registry to justify; the registry is human-owned
  and no agent may self-author one to clear its own gate. Recorded, not cleared.

  No security trigger on this ticket -- no injection sink, no trust boundary, no privilege, no data
  exposure, no user-supplied string reaches this module -- stated with its reason rather than
  assumed. Nothing was merged and nothing was deployed; a human holds both.
-->

<!--
  EXITED 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, subtask
  `security-nfr-abc011-regate`, Workflow 04) on the SECOND risk/NFR gate. ABC-011 moved
  In Security/NFR -> Ready for UAT. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4;
  no limit approached, no override taken, no written reason owed.

  VERDICT: PASS (PASS_WITH_RISKS in this role's own vocabulary -- result PASS, FOUR accepted risks
  each with a named owner, NO required fix outstanding). Gated against `security.asvs_level: L1`
  and `security.block_on: high`. No security finding at any severity, nothing at or near `high`.

  THIS RUN COMPLETED AN INTERRUPTED ONE, AND THE RECORD SAYS SO RATHER THAN GLOSSING IT. A first
  attempt at this subtask was cut off mid-flight. It had already moved this board to Ready for UAT
  with a PASS and written long figure-carrying blocks into plans/board.md, plans/nfr-catalog.md and
  plans/traceability.md -- but published NO typed note at all, so the board asserted a verdict the
  shared verified context did not back. Under "no published notes, no advance" that state was not
  admissible, and the project owner has already declined to merge this ticket once, so an unbacked
  PASS is exactly what must not slip through. That prose was never committed. It was REVERTED
  rather than patched, and every figure below was re-derived on this run's own scripts. The
  interrupted run's numbers were treated as evidence to be checked, never inherited on trust.
  Which of its figures reproduced and which did not is recorded in the `observation` note.

  WHAT THIS GATE ADJUDICATED, AND WHAT IT DELIBERATELY DID NOT. The delta since this column's own
  first pass is FOUR executable lines in one pure function (src/legal.ts: hoist `captured` plus two
  board-read guards) and a doc-comment-only edit to src/zobrist.ts. The full 70-row ASVS L1 tier was
  NOT re-run, and that is a decision with a reason rather than an omission: this column worked that
  surface row by row on the first pass and the diff adds no surface. What actually changed WAS
  re-checked -- see the ASVS block below.

  1. NFR-005's TWO BAR POSITIONS -- MET WITH ROOM, re-measured independently.
     FOUR trees in ONE process: merged `4c6ed7d`, pre-guard `584defa`, shipped, and a
     BYTE-IDENTICAL TWIN of the shipped tree used as a NULL CONTROL BY IDENTITY. 15 rounds x
     100,000 iterations, rotated tree AND cell order, medians, two full samples. Apple M3
     (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 -- `UNKNOWN - verify` on any other hardware.

       startpos   296.8-299.3 ns   against the ~450 ns bar    (1.004-1.008x of merged)
       kiwipete   304.7-307.4 ns   against the 432-459 ns bar (0.993-0.999x of merged)

     The bar is 1.5x the audit's 288-306 ns at kiwipete / ~300 ns at startpos, read off this
     ticket's own `## Security / NFR triggers` block rather than recalled.

  2. THE CALL-COUNT SUB-BAR -- MET, re-verified on this gate's own spy. A copy of zobrist.ts whose
     body differs from the shipped file by ONE import specifier and nothing else, importing a shim
     that counts and delegates to the real predicate. The walk's roots and depths were READ OUT OF
     src/perft.test.ts, not recalled.

       TOTAL nodes hashed                      518474
       nodes carrying an ep square              81397   (15.70%)
       nodes with NO ep square                 437077
       hasLegalEnPassant calls                  81397
         ... of those, on a NO-EP node              0    <- THE SUB-BAR
       max predicate calls per zobristKey call       1
       zobristKey impure at a node                   0

     Reproduced here TO THE NODE. The sub-bar reads "not made slower at all", which no wall-clock
     run can settle; the claim is structural (the caller's `epSquare !== NO_SQUARE` short-circuits,
     so the majority path executes byte-for-byte what it executed before) and a spied call count is
     the only instrument that can FAIL it.

  3. THE MEDIUM PURITY DEFECT -- CLOSED, at HIGH confidence, verified here rather than accepted.
       - all 13 known reproductions answer `false` and are byte-pure through zobristKey;
       - 336,000 adversarial inputs of this gate's own construction: 0 impure, 0 throws. Six board
         shapes (plain / off-board junk / kingless / many-kings / all-pawns / dense) x 139 epSquare
         values including NO_SQUARE, every on- and off-board index, -2/-16/-256/-999/128/256/999,
         NaN, Infinity and fractional, both sides to move;
       - THE INSTRUMENT IS NON-VACUOUS, and by the strongest control available: not a synthetic
         guard-stripped tree but THE REAL PRE-GUARD TREE `584defa`, the code the owner declined to
         merge. On the IDENTICAL population it reads 14,341 impurities and is impure on 6 of the
         same 13 reproductions. 0 against 14,341 is the result; 0 on its own would not be.
       - single-guard controls confirm the design hop's disjointness reading: guard (a) deleted
         alone -> still 0 impure (it buys the ANSWER); guard (b) deleted alone -> impure on 5 of
         the 13 (it buys PURITY).
       - and it is not only empirical: guard (b) establishes exactly the precondition
         `undoSpecial`'s unconditional write assumes and does not state, guard (a) establishes the
         destination is empty AND rejects every out-of-array target, because `board[oob]` on a
         Uint8Array is `undefined` and `undefined !== EMPTY`.
     HIGH confidence, with its bound named honestly: this is 336,000 inputs plus a structural
     precondition argument, not a theorem.

  4. THE INSTRUMENT'S OWN LIMIT, STATED RATHER THAN HIDDEN -- and it is the part worth reading.
     THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST, so NO number is claimed from it.
     Every shipped-minus-pre-guard whole-key delta sits inside the identity twin's own per-cell
     band, and the deltas FLIP SIGN between this gate's two samples (startpos -0.69 then -3.24 ns;
     kiwipete -1.54 then -7.25 ns). Benchmark protocol is a known trap on this ticket -- this is the
     fourth protocol to hit the same wall -- so a null control was carried and the instrument was
     not allowed to quote a number it cannot support.
     Measured instead on the predicate in isolation, in a process that does NOTHING else (no Proxy,
     no sweep -- both are known to poison inline caches), 21 rounds x 500,000 iterations, with the
     same identity twin reading +-0.04 ns on the tight cells:
       guards cost about +0.9 ns on the ep-set/no-capture shape
         = <= +0.15 ns amortized per node at the measured 15.70% ep frequency, about 0.05% of a
           ~305 ns key;
       below resolution on the shapes where a capture exists;
       23x CHEAPER (123.4 -> 5.4 ns) on the invalid-FEN class the guards exist for.
     That is consistent with the Engineer's <= +0.41 ns and the design hop's <= +0.5 ns and does
     NOT confirm their per-cell point estimates.

  5. THE "SPREAD IS RESOLVED" WITHDRAWAL STANDS, and this gate's own figures support the
     withdrawal rather than the original claim. The worst-case ep shape reads 1.401-1.412x here,
     1.385-1.400x at the first gate, and 1.446-1.458x at the interrupted run. Three protocols,
     three answers inside about +-4%. The bar is unaffected -- it is anchored at kiwipete/startpos
     and the worst-case ep shape is not a bar position -- but nobody should call that quantity
     settled.

  6. THE TWO COST-SHAPED EQUIVALENT MUTANTS QE HANDED THIS COLUMN -- NOT PINNED. This gate owns
     the call, including the decline. (i) deleting hasLegalEnPassant's own NO_SQUARE early return;
     (ii) moving both guards INSIDE the EP_CAPTURE_SIDES loop.
       - both survive all 214 tests -- verified by running them, not assumed;
       - both behaviour-equivalent over 83,400 inputs of this gate's own construction: 0 answer,
         0 key, 0 purity differences;
       - NO spied call count distinguishes either: 0 of 9 call shapes, at the predicate AND through
         zobristKey (makeMove / unmakeMove / isSquareAttackedBy identical everywhere). The
         instrument src/zobrist.nfr.test.ts exists for cannot be pointed at them;
       - the early-return deletion costs STRUCTURALLY ZERO in production: zobristKey is the ONLY
         production caller of the predicate and its own guard short-circuits, so a no-ep node never
         enters the callee. That is a stronger statement than a nanosecond figure and it is why no
         nanosecond figure is quoted;
       - the ONLY instrument that could see them is a Proxy board-read counter, and this gate
         measured that instrument to be UNUSABLE here: a Proxy over the Uint8Array board THROWS
         outright (`TypeError: this is not a typed array`, from kingSquareOf's `board.indexOf`), so
         it does not even run without a function-binding shim; shimmed it costs 11.1-13.6x, and its
         mere presence in the process inflates the UN-instrumented readings by 2.0-3.0x. An
         instrument that destroys what it measures cannot found a budget assertion.
     Pinning a cost this project's instruments cannot resolve would be pinning noise, and this
     role's hard limit is not to gold-plate. ACCEPTED RISK, owner: Security/NFR at EPIC-004, when a
     search exists and a per-node budget makes 0.05% worth an assertion.

  7. TWO FIRST-PASS RESIDUALS ARE CLOSED -- QE's report CONFIRMED by running it. Z1 (reorder the
     call-site conjunction) and Z4 (drop the epSquare guard) are each KILLED by
     src/zobrist.nfr.test.ts's spied zero-call assertion -- one test, both mutants, each applied to
     the repository's own src/ and the failure watched. This project can stop carrying them.

  8. THE UNCOMMITTED EDIT TO src/zobrist.nfr.test.ts -- KEPT, after being checked rather than
     inherited. It arrived with no note explaining it.
       - it is COMMENT-ONLY, proved mechanically: both revisions stripped of comments are
         md5-identical. Zero assertion, import or fixture lines changed;
       - its four-combination deletion table was RE-DERIVED here and is CORRECT:
           early return gone, both guards present -> false, board untouched
           + guard (a) gone                       -> false, board untouched
           + guard (b) gone                       -> false, board untouched
           + BOTH guards gone                     -> stray pawn back on off-board square 15
                                                     (index 15: 0 -> 1), and BOTH cases fail
         The last row was proven by applying that mutant to the repository's own src/ and watching
         the two assertions fail, not by reading the code;
       - so the block is a genuine THREE-deletion regression guard and is kept, not dropped;
       - ONE SENTENCE WAS WITHDRAWN AS UNSUPPORTABLE AND CORRECTED. It quoted "about +1.6 ns" for
         the direct no-ep call. This gate's own benchmark reads +0.9 to +2.9 ns on cells where that
         deletion's delta is STRUCTURALLY ZERO (an ep square is set, so the deleted branch is never
         taken), so the cross-tree systematic floor is the same size as the signal and no point
         estimate survives. The corrected comment quotes no figure and states the structural fact
         instead.

  9. ASVS L1 -- judged, not padded. The 70-row tier was worked row by row at the first pass and is
     not re-run on a four-line diff to a pure function. What the diff can actually move was
     re-checked here:
       no import added or widened in src/legal.ts        verified
       package.json / lockfile diff 584defa..HEAD        EMPTY; zero runtime dependencies
       eval / new Function / vm / child_process / fs /
         http / fetch / net / process.env / os in src/   NONE
       secret-shaped strings in the src/ diff            NONE
     V2.1.1 / V2.2.1 (input validated to business expectations) moves in the GOOD direction -- the
     library no longer corrupts a caller's position on a semantically-inconsistent FEN -- while the
     underlying FEN semantic-validation gap is unchanged and still ABC-010's. The two NEW reads can
     address out-of-array indices; on a Uint8Array that returns `undefined` and is NOT a
     memory-safety issue, so V1.4.1 stays NOT-APPLICABLE (and is an L2 row in any case).
     V15.1.1 / V15.2.1's severity override to `low` recorded at the first pass stands unchanged
     (owner: Architect/Design at EPIC-006). V13.4.1 stays DEFERRED, not passed -- nothing is
     deployed or packaged until EPIC-006.

  10. GATES, EXACTLY AS THEY RAN AT THIS GATE.
       npm test            214 passed / 9 files / 0 failed
       skip count          0    (npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests')
       npm run lint        exit 0  (the same 2 pre-existing biome config-schema infos)
       npm run typecheck   exit 0
       npm run build       exit 0
      The repository's own src/ was mutated transiently to prove assertions fail; both files were
      backed up first, restored after, and the restore was md5-verified each time.

  FOUR ACCEPTED RISKS, EACH WITH A NAMED OWNER, AND NO REQUIRED FIX OUTSTANDING:
    1. Every timing figure on this ticket is ONE machine (Apple M3 / Node v24.12.0 / darwin-arm64)
       and `UNKNOWN - verify` anywhere else. Owner: EPIC-004's non-M3 spike, which already carries
       the identical obligation for NFR-005's depth-7 PROVISIONAL marker.
    2. Two behaviour-equivalent cost mutants are unpinned, deliberately, because no instrument this
       project has can resolve them. Owner: Security/NFR at EPIC-004.
    3. The amortized per-node figure is measured on a perft-table population, not a search's node
       distribution, and stays `UNKNOWN - verify` until a search exists. Owner: EPIC-004.
    4. Purity closure is 336,000 inputs plus a structural argument, not a proof. A shape absent
       from the generator would escape it. Owner: QE/E2E, at the next change to this predicate.
  The first pass's accepted risk "zobristKey permanently corrupts a semantically-inconsistent ep
  position" is GONE from this list rather than reworded -- it is the MEDIUM, and it is closed.

  ABC-009 and ABC-010 still carried, not fixed. The `generateMoves` en-passant-onto-own-piece
  defect is still owned by nobody until BA/PM acts -- now three gates in a row saying it.
  UAT is DEFERRED to EPIC-006, NOT passed. ADR-0005 remains `proposed`; no agent may mark it
  `accepted` and this gate did not. NO PR -- this repo has no git remote. NOTHING MERGED, NOTHING
  DEPLOYED -- a human holds both.
-->

<!--
  ENTERED 2026-08-03 by QE/E2E, the SECOND time this ticket has entered this column.
  In Security/NFR 0/2 -> 1/2; no limit approached, no override taken.

  WHAT IS A DELTA AND WHAT IS NOT, so this gate does not re-derive the whole ticket. Since 584defa
  the ONLY production change is FOUR executable lines in `hasLegalEnPassant` plus a doc-comment-only
  edit to `src/zobrist.ts`. This QE pass changed NO production code and added 8 tests
  (206 -> 214, skip count 0). `src/zobrist.ts`'s condition, `zobristKey`'s signature, `src/apply.ts`,
  `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are BYTE-UNTOUCHED.

  "NO EXISTING TEST WAS MODIFIED" -- VERIFIED AT LINE LEVEL, THREE WAYS, NOT BY INSPECTION. Every
  line of every test file at each of three revisions was searched for in the current tree, which is
  stricter than `git diff` because it also catches a line that was moved and edited:
    from 584defa (before the fix commits) -> 0 absent lines across all 9 test files. The Engineer's
      "this pass widened zero pre-existing lines" is TRUE.
    from ddc013e (the branch tip) -> 0 absent lines. This gate's own 8 tests are pure appends and
      widened no import either.
    from 4c6ed7d (the branch point) -> 6 absent lines, ALL SIX IMPORTS, three per test file, exactly
      what the first pass recorded. ZERO non-import lines have vanished across the whole branch.
  `src/zobrist.test.ts:33-37`, the fixture the ticket names by line number, is BYTE-IDENTICAL; only
  its line numbers moved (33-37 -> 43-47) because helpers were added above it.

  FOR THIS GATE SPECIFICALLY, and NFR-005's cost bars were deliberately NOT re-measured here:
    - Your own src/zobrist.nfr.test.ts now kills the first pass's Z1 and Z4 survivors (1 test each,
      the spied zero-call assertion). The gap the first QE pass handed you is closed.
    - TWO COST-SHAPED MUTANTS SURVIVE AND ARE BEHAVIOUR-EQUIVALENT, so no assertion about a key can
      ever fail them and they are yours if anyone's: (i) deleting `hasLegalEnPassant`'s own
      NO_SQUARE early return -- now genuinely equivalent BECAUSE guard (a) catches it
      (`board[-1]` is `undefined !== EMPTY`), where on the first pass it was equivalent for a
      different reason; (ii) moving both guards INSIDE the EP_CAPTURE_SIDES loop -- same answers,
      same keys, strictly more work. Neither is pinned by anything in the repo. Three further
      survivors (guards swapped, guards merged into one `||` line, `<= EMPTY` instead of
      `!== EMPTY`) are equivalent AND cost-neutral; the merged-into-one-line form is safe, which is
      worth knowing because two OTHER one-line merges are NOT and are now pinned.
    - THE ENGINEER FLAGGED ITS OWN FIRST BENCHMARK PROTOCOL AND DISCARDED IT: a null control on a
      structurally-zero delta read up to 1.26x. It re-ran with 9 alternating rounds and medians and
      the control fell to +0.06 / +0.20 ns. That self-report is honest and is the third protocol on
      this ticket to hit the same wall. This gate re-measured NO nanosecond and takes no view on the
      numbers; the instrument caution is passed on, not endorsed.

  EXITED 2026-08-03 by Security/NFR on a PASS verdict: ABC-011 -> Ready for UAT. In Security/NFR
  1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; NO LIMIT APPROACHED, no override taken, no written reason
  owed. The In Security/NFR exit is the one board move this role owns. Nothing was merged and
  nothing was deployed -- a human holds both.

  VERDICT: PASS, with three accepted risks each carrying a named owner. Gate run against
  security.asvs_level L1 and security.block_on `high`. NO security finding at any severity, and
  nothing at or near `high`, so nothing blocks.

  NFR-005 RE-MEASURED INDEPENDENTLY -- NOTHING WAS ACCEPTED FROM THE ENGINEER'S OR QE'S FIGURES.
  Own scripts, own baseline (4c6ed7d extracted with `git archive`), both trees imported in ONE
  process, 300k iterations per cell after a 50k warm-up, each cell interleaved forward AND backward
  so drift hits both variants equally, two samples. Apple M3 (Mac15,13) / Node v24.12.0 /
  darwin-arm64 -- `UNKNOWN - verify` on any other hardware. The machine-independent quantity is the
  ratio to the baseline tree measured in the same process, never the absolute nanoseconds.

    position                       merged(4c6ed7d)   ABC-011           ratio          bar
    startpos      -- NO ep square  296.8-340.7 ns    297.2-298.4 ns    0.872-1.006    <= ~450  MET
    kiwipete      -- NO ep square  318.4-334.0 ns    323.5-330.9 ns    0.969-1.039    <= 432-459 MET
    position-3    -- NO ep square  165.8-165.8 ns    166.2-166.8 ns    1.003-1.007    not a bar posn
    ep set, no capture at all      309.1-310.1 ns    307.4-378.2 ns    0.991-1.224    not a bar posn
    ep set, capture AVAILABLE      300.6-301.6 ns    417.6-420.8 ns    1.385-1.400    worst case, < 1.5x
    the divergence FEN (sparse)    147.8-148.2 ns    260.6-261.0 ns    1.759-1.766    not a bar posn

  BOTH BAR POSITIONS MET WITH ROOM: startpos 297-298 ns against ~450, kiwipete 324-331 ns against
  432-459. HOW MINE CROSS-CHECK THEIRS, stated rather than glossed: my worst-case per-call shape
  (1.385-1.400x) lands BETWEEN the dev hop's 1.357-1.383x and the design hop's 1.45-1.48x, which
  resolves the spread this column was asked to adjudicate -- the three runs agree that the shape is
  real, is the worst on the table, and is comfortably under 1.5x. My divergence-FEN ratio
  (1.759-1.766x) sits just under the dev hop's 1.771-1.858x and confirms their reading of it: an
  artefact of a 5-piece board where the base key is half the normal cost, not a bar position, and
  its ABSOLUTE cost (261 ns) is below the bar's own anchor value. One cell of mine is noisy and is
  reported as measured rather than smoothed: "ep set, no capture at all" sampled 307.4 and 378.2 ns
  on the two runs. It is not a bar position and both samples sit far under any ceiling.

  THE SUB-BAR ("the no-ep-square path is not made slower at all") HOLDS, AND WALL CLOCK IS THE WRONG
  INSTRUMENT FOR IT. My own timings have the shipped tree 1.003-1.007x of baseline at position-3 --
  inside noise, but "not slower AT ALL" is a claim no timing run can settle at that resolution. The
  claim is STRUCTURAL and that is how it was verified: on a no-ep node `position.epSquare !==
  NO_SQUARE` is false, `&&` short-circuits, and the executed work is byte-for-byte what the baseline
  executed. Re-spied independently with my own counting shim through a copy of zobrist.ts whose body
  was `cmp`-verified identical to the shipped file apart from its two import specifiers, over a
  depth-3 walk of all six perft roots:
    nodes hashed 277,955 / ep-set 17,663 / hasLegalEnPassant calls 17,663 /
    calls on the 260,292 NO-EP nodes: 0 / max calls per zobristKey call: 1
  Identical to the Engineer's figures to the node. Three roles now agree on numbers none copied.

  THE GAP BOTH PRIOR ROLES HANDED FORWARD IS PINNED, NOT WAIVED -- src/zobrist.nfr.test.ts, on the
  ABC-020 precedent, in its OWN FILE so the hoisted vi.mock factory re-routes the module graph for
  nothing else (the same reason src/gameend.nfr.test.ts is its own file). Four assertions, and each
  was PROVEN to fail rather than assumed to:
    - zero hasLegalEnPassant calls on four no-ep positions  -> kills Z1 (reorder) and Z4 (drop the
      guard). Both previously survived a 189-test suite.
    - exactly one call when an ep square IS set             -> stops the guard over-suppressing.
    - predicate returns false AND touches no board byte, on TWO no-ep probe FENs -> kills L11.
  The second L11 FEN is this gate's own contribution and it is why the byte assertion is not
  redundant: on `4K3/8/8/8/8/k7/p7/R7 b - - 0 1` the a2 pawn's departure discovers the a1 rook on
  the a3 king, so under L11 the predicate still returns the CORRECT `false` -- and still leaves a
  stray pawn on off-board square 15. There the board assertion is the only one that bites; verified
  by running it. Suite 189 -> 193, skip count still 0, lint/typecheck/build all exit 0.

  THE OFF-BOARD WRITE IS A CORRECTNESS DEFECT, NOT A MEMORY-SAFETY ONE, AND THE DISTINCTION WAS
  MEASURED RATHER THAN ASSERTED. QE asked this column to judge it and the answer is neither
  inflation nor a wave-off. `Position.board` is a Uint8Array(128); the stray write lands on INDEX
  15, which is INSIDE the allocation -- "off-board" here is the 0x88 encoding's LOGICAL predicate
  ((sq & 0x88) !== 0), not a memory bound. And the runtime discards out-of-allocation typed-array
  writes outright: probed directly, `probe[-1] = 9` and `probe[999] = 9` both read back `undefined`
  with length and byteLength unchanged. There is no pointer arithmetic, no adjacent memory and no
  overflow available in this runtime, so ASVS V1.4.1 (memory-safety / buffer overflow) is
  NOT-APPLICABLE here -- and it is an L2 row in any case, outside this project's L1 tier.
  WHAT IT IS INSTEAD, and why it still earned a test: it breaks an invariant a LIVE consumer leans
  on. `kingSquareOf` finds the king with `position.board.indexOf(KING | colour)` across all 128
  bytes, and its own doc comment cites "off-board squares are EMPTY" as the reason that scan is
  sound. This mutant writes a PAWN byte, so it does not fool that scan -- but it is the invariant
  the scan depends on, and the tidy-up that produces it left 189/189 green. That is a correctness
  hazard worth a guard, which is what it now has.

  QE'S NEW DEFECT -- zobristKey PERMANENTLY corrupts a position whose ep square is semantically
  inconsistent -- IS RULED MEDIUM AND DOES NOT BLOCK. Reproduced by this gate on all three of QE's
  FENs against the shipped tree, and against the 4c6ed7d baseline for contrast (unchanged on all
  three, so the property is genuinely NEW since ABC-011). QE's fairness to the Engineer was checked
  and holds: on the first two FENs the ruled ORACLE `legalMoves(p).some(...)` corrupts identically,
  so that pair is pre-existing in generateMoves + apply and merely reproduced faithfully; on the
  third, `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`, generateMoves does NOT offer the ep move, the oracle
  returns false and leaves the position clean, while hasLegalEnPassant returns true and corrupts --
  a GENUINE predicate-vs-oracle divergence, confirmed here. REACHABILITY was verified independently
  rather than accepted: the only two writes to epSquare in src/ are fen.ts:175 (parseFen, which
  validates the field is a square NAME and nothing about the board) and apply.ts:139, which sets it
  to `(move.from + move.to) / 2` only on a pawn double push -- geometry that guarantees both the
  capturable pawn and the empty target. So NO position reachable by play can trigger it; the trigger
  class is invalid-FEN only, which is ABC-010's surface and which this ticket's `## Out of scope`
  carries explicitly. MEDIUM rather than LOW because a function whose header promises the position
  comes back "as they found it" now silently and permanently mutates a caller's data on that class,
  and a maintainer will read the header as a guarantee; NOT HIGH because it is unreachable by play,
  has no untrusted-input path in a library with no entry point until EPIC-006, and carries no
  security consequence. Owners: BA/PM to cut it or fold it into ABC-010; Architect/Design to rule
  the predicate-vs-oracle divergence, which is a definition question and not an implementation one.

  SECURITY: NO FINDING AT ANY SEVERITY. The ticket's "No security trigger" is upheld on inspection
  rather than quoted. src/ has no eval / new Function / vm / child_process / require, no fs, no
  http, no fetch, no process.env, no os -- grepped, all absent. Zero runtime dependencies and
  package.json + the lockfile byte-untouched by this ticket, so no new supply-chain surface. No
  secret-shaped string anywhere in the 4c6ed7d..HEAD diff. No auth, no session, no privilege, no
  personal data, no PII, no GDPR surface, no logging (and none is required at L1). compliance_regime
  is empty, so no Compliance Officer hop is owed.
  THE ASVS L1 TIER IS 70 REQUIREMENTS AND MOST ARE NOT-APPLICABLE BY ABSENCE OF THE SURFACE THEY
  NAME -- said plainly rather than padded into a table of passes: all 13 of V6 Authentication, all 6
  of V7 Session Management, all 4 of V8 Authorization, all 4 of V9 Tokens, all 5 of V10 OAuth/OIDC,
  all 8 of V3 Web Frontend, all 4 of V5 File Handling, all 3 of V12 TLS and both V14 rows have no
  surface in a dependency-free chess library with no entry point. FOUR ROWS ARE WORTH NAMING RATHER
  THAN DISMISSING:
    - V11.4.1 (approved hash functions). NOT-APPLICABLE, and named because it is precisely the row a
      scanner or a hurried reviewer WOULD flag: this change sits in a module called "hashing" that
      seeds a table from splitmix64 with a hardcoded constant. Zobrist keys are a position-identity
      key for game logic, not a "general cryptographic use case" -- no signature, no HMAC, no KDF,
      no random bit generation, and no security decision rests on collision resistance. The fixed
      seed is a deliberate REQUIREMENT (reproducible keys across runs) and the module documents why
      Math.random is avoided. Flagging it would be gold-plating; ignoring it silently would leave
      the next reviewer to re-derive it.
    - V2.1.1 / V2.2.1 (documented input-validation rules; input validated to business expectations).
      PARTIALLY MET and this is the row that genuinely touches the defect above. FEN is this
      library's one externally-authored input format; parseFen validates STRUCTURE (it throws
      FenError) but not SEMANTIC consistency. Pre-existing, already ticketed as ABC-010, and
      explicitly carried by this ticket. ABC-011 does not create the gap -- it adds one new
      consequence to it. Owner: ABC-010.
    - V15.1.1 / V15.2.1 (documented remediation timeframes for third-party components). NOT MET at
      the project level: no such policy document exists. SEVERITY OVERRIDDEN from the L1 default of
      `high` to `low`, with the reason stated as the hard limits require: the project has ZERO
      runtime dependencies, this change adds none, and a documentation-policy gap the change neither
      touches nor degrades is not a defect of this change. Recorded so it is visible rather than
      dropped; it does not block ABC-011. Owner: Architect/Design, at EPIC-006 packaging.
    - V13.4.1 (deployed without source-control metadata). DEFERRED, not passed -- nothing is
      deployed and nothing is packaged until EPIC-006. Recorded rather than marked green.

  WHERE THE CHANGE TOUCHES DATA IT DID NOT TOUCH BEFORE, which is where new exposure hides and is
  the one genuinely new thing here: zobristKey used to READ the board and nothing else; it now
  WRITES it transiently through makeMove/unmakeMove on the ~1-2% of nodes carrying a legal ep
  capture. Both defects on this desk are instances of exactly that, which is the honest reading of
  the risk this design took on. Purity on the reachable population is intact and now pinned by QE's
  277,949-node walk; this gate re-verified byte purity across all six of its own benchmark positions
  (board and toFen both identical) and confirmed the two out-of-play classes above.

  ADR-0005 IS STILL `proposed` and no agent may mark it `accepted`; this gate did not. The code it
  describes is merged on this branch, which is worth a human's attention and is carried, not closed.

  Gates re-run by this gate on this branch WITH the new guard in place: 193 pass (was 189) / 0
  skipped / lint, typecheck and build all exit 0 (2 pre-existing biome config-schema infos, present
  at 4c6ed7d). Five throwaway harness scripts in the session scratchpad, NOT committed, every number
  transcribed here with its machine. No PR exists and none was invented -- this repo has no git
  remote.
-->

<!--
  ENTERED 2026-08-03 from QE/E2E's PASS. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit
  approached, no override taken. See the exit comment under `## In Review` for the full QE record.

  WHAT THIS COLUMN INHERITS, so the gate starts ahead of where QE did rather than rediscovering it.

  1. NFR-005 IS THIS COLUMN'S AND QE MEASURED NONE OF IT. Deliberately, on the ABC-020 precedent:
     two roles measuring the same bar is waste. Unverified from QE and inherited as reported by the
     Engineer, all on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere):
       startpos, no ep      302.9-306.5 ns  (bar ~450)      0.963-1.008x merged
       kiwipete, no ep      309.1-315.6 ns  (bar 432-459)   0.984-1.015x merged
       ep set, capture available            worst-case per-call shape 1.357-1.383x
       amortized, 120,000-node pool         0.9948-1.0218x merged
     The design hop recorded 1.45-1.48x for the same worst-case shape; the dev hop measured lower.
     Both are on the record so this gate can adjudicate the spread rather than discover it.

  2. THE SUB-BAR ("the no-ep-square path is not made slower at all") IS PINNED BY NOTHING IN THE
     REPO, AND QE UPHELD THE ENGINEER'S DECISION TO LEAVE IT HERE -- on evidence, not deference.
     Three mutants survive a 189-test suite and they are ONE gap:
       Z1  `if (hasLegalEnPassant(position) && position.epSquare !== NO_SQUARE) {`   in zobrist.ts
       Z4  `if (hasLegalEnPassant(position)) {`                                      in zobrist.ts
       L11 delete `if (target === NO_SQUARE) return false;`                          in legal.ts
     All three are BEHAVIOUR-EQUIVALENT -- verified, not assumed: each leaves 189/189 green and none
     changes any key on any input, because the predicate's internal guard makes the reordered
     condition compute the same thing. Only COST moves, and only on the majority path. No assertion
     about a key can ever fail them, so a behavioural test is the wrong tool: the instrument is a
     SPIED CALL COUNT, the shape src/gameend.nfr.test.ts already has and the shape this column wrote
     for NFR-001 on ABC-020. The Engineer measured it out-of-repo (0 calls over 260,292 no-ep
     nodes); nothing in src/ holds it.
     THE FACT NEITHER PRIOR HOP HAD: Z1 AND L11 TOGETHER -- the reorder plus deleting the guard that
     then LOOKS redundant, an ordinary tidy-up rather than a contrived mutant -- still leave 189/189
     GREEN, and on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1` one zobristKey call then writes a white pawn
     onto OFF-BOARD SQUARE 15, breaking the invariant src/position.ts states in its own comment
     ("Off-board squares stay EMPTY and are never read"). Latent rather than live -- zobristKey and
     toFen both skip off-board squares -- but it turns the reorder from a cost regression into a
     correctness one, and every test in the repo is blind to it.

  3. ONE NEW DEFECT, NAMED BY QE AND NOT FIXED, WHICH THIS COLUMN MAY WANT TO WEIGH: since ABC-011,
     zobristKey PERMANENTLY corrupts a position whose ep square is semantically inconsistent (three
     reproductions in the In Review exit comment and in QE's `claim` note). Trigger class is
     semantically invalid FEN only -- the same class ABC-009 needs and ABC-010 exists to close, both
     explicitly carried by this ticket -- and 277,949 reachable nodes are 0 impure. NO SECURITY
     TRIGGER is claimed for it: no injection sink, no trust boundary, no privilege, no data
     exposure. It is a correctness/robustness item pointing at ABC-010, and the ticket's own
     Security/NFR triggers section already says "No security trigger. ... Do not inflate it."

  4. NFR-001 IS EXPLICITLY NOT AT RISK and `npm run perft` is NOT the oracle here -- src/perft.ts
     never imports zobrist, and the hashing module's only production consumer is src/gameend.ts.
     Stated on the ticket, re-confirmed by QE's own rebuild of the module graph, and repeated so
     nobody spends 38 s on the deep lane believing it proves something.

  Previously 2026-08-01: EXITED by Security/NFR on a PASS verdict: ABC-020 -> Ready for UAT. WIP 1/2 -> 0/2;
  no limit approached, no override taken. The column is empty again.

  WHAT THIS COLUMN ADJUDICATED, and the result. A10's three bars, all re-measured independently --
  nothing was accepted from the Engineer's report and nothing was quoted from it:

    legalMoves calls per gameStatus   EXACTLY 1, across sixteen call shapes         PASS
    zobristKey calls per gameStatus   <= 1: exactly 1 when the counts map is
                                      consulted, 0 bare, 0 when a cheaper branch
                                      decides                                       PASS
    gameStatus(startpos, emptyMap)    2.13-2.26 us over three fresh processes
                                      = 0.56x-0.60x of the 3.78 us bar, and
                                      0.98x-1.01x of the pre-ABC-020 tree measured
                                      in the SAME process                           PASS

  Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify` on any other hardware.
  Call counts were SPIED with instrumented throwaway copies of legal.ts + zobrist.ts outside the
  repo, gameend.ts cmp-verified byte-identical; timings load both trees in ONE process and measure
  them interleaved A,B,B,A so drift hits both equally. Primitives cross-check to three earlier
  agents' published figures (zobristKey 281-293 ns vs 288-306; legalMoves 2.02-2.16 us vs 1.83-2.22).

  ONE CORRECTION, AND IT IS TO THE BAR RATHER THAN THE CODE. The 3.78 us figure is a START-POSITION
  number and plans/nfr-catalog.md did not say so. gameStatus is dominated by its one legalMoves
  call, which costs 2.1 us at startpos and 3.2 us in a middlegame, so gameStatus(kiwipete, emptyMap)
  measures 5.30-5.47 us on this branch and 5.29-5.85 us on MERGED code -- 1.4x the "bar" on both
  trees. Read as an absolute ceiling it indicts the baseline, not this change. The catalog row now
  carries its position and names the machine-independent quantity (the ratio to the same position on
  the baseline tree: 0.94-1.01). Third time this file has learned the same lesson, after NFR-005's
  "in a middlegame position" and NFR-002's ply count.

  QE'S ORDERING SUSPICION: CHASED, CONFIRMED, AND IT GENERALISES. This is the substantive result.
  Moving the 150-ply clock check below the fivefold check leaves gameend.test.ts 45/45 green, and
  spied, it takes a counts-map caller at clock >= 150 from 0 to 1 zobristKey calls. Two precisions,
  because they decide the severity: the bar AS WRITTEN (at most 1) is NOT broken -- the mutant still
  measures max 1 -- so this is a durability gap and not a bar failure; and the cost is one key read,
  281-293 ns, on a terminal position reachable at most once per game (the wall-clock delta measured
  129 ns, inside this harness's +-340 ns noise floor). On its own it would not have been worth a
  ticket.

  What made it worth acting on is that two FURTHER mutations show all three bars were held by
  NOTHING in this repository:

    a second legalMoves() call                       all 45 tests green
    two zobristKey reads instead of the shared local all 45 tests green
    the 150-ply check below the fivefold check       all 45 tests green   (QE's)

  The doubled generation is the serious one: it doubles the cost of the single hottest call in
  EPIC-004's search and every value assertion in the suite stays green. plans/nfr-catalog.md had
  already warned that these bars "must be spied, not inferred" -- the warning had no teeth.

  CLOSED, AND THIS COLUMN OWNED THE CALL. Both prior roles handed the decision here in writing: the
  Engineer's decision note recorded keeping the spy out of the suite as "reversible in one small
  commit if Security/NFR wants the guard permanent", QE declined because "a call-count spy is this
  column's instrument, not QE's", and this block previously read "that is the call to make here".
  Made: src/gameend.nfr.test.ts, three spied assertions, one per bar. NO production code changed and
  no existing test touched. The Engineer's objection -- a vi.mock factory is hoisted to file scope,
  so it would re-route the module graph for all 45 tests in gameend.test.ts to buy three assertions
  -- was correct, and a SEPARATE FILE dissolves it rather than overruling it; that option was not on
  the table when the judgment was made. Verified one mutant per assertion:

    second legalMoves call  -> "bare, in progress: expected legalMoves 1 times, got 2"
    two zobristKey reads    -> "expected zobristKey 1 times, got 2"
    the reorder             -> "expected zobristKey +0 times, got 1"

  LEFT UNPINNED ON PURPOSE, and QE's reasoning survives intact. Five occurrences AND clock >= 150
  both apply and the code reports seventy-five-move; pinning an arbitrary choice between two rules
  that both hold is how a later correction becomes a "regression". The zero-key assertion therefore
  uses a counts map holding ONE occurrence, where no repetition rule is in play at all -- it kills
  the reorder purely on COST and says nothing about which rule names the tie. EPIC-006's result
  screen still decides that.

  ALLOCATION. State (c) -- in progress, nothing claimable, the common case at every search leaf --
  measures 1.33 B/call on this branch and 1.33 B/call on the pre-ABC-020 tree over 1,000,000-call
  windows with zero GC events inside them: indistinguishable, so the branch adds none. Worth stating
  precisely: state (c) is not literally allocation-free and never was (merged code already allocates
  the returned literal), and src/gameend.ts:161 allocates `const draws = []` unconditionally, on the
  state-(c) path too -- it costs nothing because TurboFan sinks it into the branch where it escapes,
  which is the path a hot search leaf runs. State (b) allocates the DrawClaims the ratified shape
  asks for (~+2.3 B/call measured, a lower bound), and state (b) means a claim genuinely exists.

  STRUCTURAL. No new dependency edge (the import list is byte-identical to 65cb789's), no new state
  on Position (src/position.ts unchanged), and no dependency change at all -- package.json and the
  lockfile are untouched and the project has zero runtime dependencies.

  THE SECURITY HALF IS EMPTY, AND IT WAS RE-CHECKED RATHER THAN ACCEPTED. gameStatus is a pure
  function of an in-memory Position and an optional Map: no interpreter, no parser, no file, no
  socket, no process boundary, no credential, no persistence, no user data. Working the L1 tier of
  the ASVS checklist (70 requirements at security.asvs_level L1), every applicable row is
  not-applicable by ABSENCE of the surface it names. Two are worth naming rather than dismissing:
  V2.2.1 (gameStatus validates nothing and is right not to -- its contract is a well-formed
  Position; FEN semantics are ABC-010's and the integrity defect on this path is ABC-009, carried
  and ticketed) and V11.4.1 (zobristKey is a repetition hash, not a security control -- nothing
  authenticates or authorizes on it, and its collision behaviour is ABC-011's correctness question).
  NO FINDING AT ANY SEVERITY, and nothing at or near security.block_on: high. The consequence of a
  defect here is a wrong chess result, which is what the whole ticket is about -- not inflated, not
  deflated.

  ACCEPTED RISKS, EACH WITH AN OWNER. (1) The us figure is a single-machine number, UNKNOWN - verify
  elsewhere; the new guard is the machine-independent half, and no wall-clock assertion was added to
  the suite because it would pass or fail on the machine that runs it -- owner EPIC-004's non-M3
  spike, which already carries the same obligation for NFR-005. (2) The un-optimized (cold) cost of
  the state-(c) empty-array literal is UNKNOWN - verify: measured and inconclusive, and irrelevant at
  a hot leaf -- owner EPIC-004. (3) ABC-009 and ABC-011 remain carried, not owned -- owners their
  own tickets.

  NOT RE-LITIGATED HERE. QE's four LOW defects and three unsettled items stand as recorded: A5/A8's
  Given wording and FIDE 9.6.1's "consecutive" are BA/PM's, and the dead GameResult alias is
  Architect/Design's. This column adding an opinion to them would be noise.

  GATES, re-run on this branch with the guard in place: npm test 174 passed / 8 files (was 171),
  skip count 0, npm run lint exit 0 (the same 2 pre-existing biome config infos), npm run typecheck
  exit 0, npm run build exit 0, src/gameend.ts still 100% stmt/branch/func/line.

  Still NO git remote, so still no PR to open; the work sits on the local branch
  grugops/ticket-to-pr-ABC-020. A HUMAN HOLDS MERGE AND DEPLOY. Merge order is still load-bearing:
  this merges BEFORE ABC-019 and ABC-016.

  ---
  ENTERED 2026-08-01 by QE/E2E on a PASS verdict. WIP 0/2 -> 1/2; no limit approached, no override
  taken. FIRST OCCUPANT of this column since it was cleared -- the ABC-004..007 stack passed
  through it on 2026-07-24.

  WHAT IS OWED HERE, and it is a short list because QE deliberately did not touch it. ABC-020's
  acceptance criterion A10 is "the cost bar in `Security / NFR triggers` holds when measured", and
  that is the whole of what this column has to adjudicate:

    - legalMoves calls per gameStatus stays EXACTLY 1;
    - zobristKey calls per gameStatus stays AT MOST 1 (fivefold and threefold share one key read);
    - gameStatus stays within 1.5x of its measured 2.52 us per call (bar: <= 3.78 us).

  The Engineer reports these SPIED, not inferred, on Apple M3 / Node v24.12.0 / darwin-arm64:
  legalMoves = 1 across ten call shapes, zobristKey <= 1 and 0 when the caller is bare or an earlier
  branch decides, cost 2.17-2.24 us. `UNKNOWN - verify` on any other hardware. QE did NOT re-measure
  any of it -- two roles measuring the same thing is waste, and nothing about it looked suspicious.

  ONE THING QE FOUND THAT BEARS ON THIS COLUMN. Mutation testing showed that moving the 150-ply
  clock check BELOW the fivefold check kills no test in the suite. That mutation would break the
  bar-2 property the Engineer measured -- "zobristKey = 0 when the clock decides", since the key
  read would then happen before the clock short-circuits -- and nothing would notice. QE did not add
  that guard: a call-count spy is this column's instrument, not QE's, and the Engineer's decision
  note records deliberately keeping the spy out of the permanent suite as reversible in one small
  commit if this column wants it. That is the call to make here.

  The ticket also records "No security trigger": no injection sink, no trust boundary, no privilege,
  no data exposure. The consequence of a defect in this module is a wrong chess result -- which is
  what the whole ticket is about, and neither to be inflated nor deflated.
-->

## Ready for UAT (WIP 0/4)

<!--
  LEFT THIS COLUMN 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04) — MOVED
  BACKWARD to In Review. Ready for UAT 1/4 -> 0/4, In Review 0/3 -> 1/3. FIRST BACKWARD MOVE IN THIS
  PROJECT'S HISTORY, and recorded as one rather than dressed up as a normal transition.

  WHY: acceptance criterion A11, added by BA/PM at the criteria-text hop, is NOT MET. A ticket with an
  unmet acceptance criterion cannot honestly sit in Ready for UAT. The move is not a backward move
  because anything regressed — it is one because the board was asserting a readiness the ticket did
  not have.

  THE MOVE IS NOT ON THE ORCHESTRATOR'S TWO OWNED EXITS and is taken anyway. The alternatives were to
  leave a known-unmet criterion sitting in Ready for UAT, or to close the ticket — both make the board
  state a falsehood. A visible backward move is the honest record and it costs only wall-clock: the
  CODE IS CORRECT and unchanged, `src/moves.ts` still md5 0e247853ab2c05887c76105ff83d8621, identical
  to the Engineer's first commit, so no gate repaired the module to make its own verdict green.

  WHAT A11 IS, MEASURED BY THE ORCHESTRATOR ON ITS OWN MUTANT BEFORE TAKING THIS MOVE: QE's hardening
  rows closed the QUEEN INSTANCE, not the DIMENSION. A mutant reading the king's home square as "own
  KING or own ROOK" passes the Engineer's 33 acceptance tests, ALL 19 of QE's hardening tests and the
  full 356/356 on 16 files — and on 4k3/8/8/8/8/8/8/K3R2R w K - 0 1 one legalMoves() call DESTROYS THE
  ROOK and writes a king over it. BA/PM found three such survivors over ten mutants; own-KING-or-ROOK,
  own-KING-or-PAWN and own-ROOK-or-PAWN all pass everything, and only own-ROOK-or-KNIGHT dies (to A6's
  knight row). So A11 quantifies over EVERY own piece type on BOTH home squares rather than adding a
  fourth sample. What is owed is ~9 TEST ROWS AND ZERO PRODUCTION LINES.

  THE SAME MISTAKE WAS MADE THREE TIMES ON THIS TICKET, INCLUDING TWICE BY THE ORCHESTRATOR, and it is
  the ticket's own defect turned on the ticket: the original Scope named two preconditions and tested
  one; the Orchestrator built the QUEEN mutant because QE named the queen, watched it die to four
  hardening tests, and called the gap closed — testing the example instead of the rule. Recorded so the
  fourth instance is caught by the board rather than by luck.

  A12 (G-2, rights per side) is ALREADY SATISFIED by QE's existing rows and needs no work. A7 is KEPT
  and RECLASSIFIED — inert by construction across 0 of 72 mutants, but the suite's only purity walk
  over legal positions and ABSENT rather than failing before this ticket; what BA/PM deleted is its
  FALSE JUSTIFICATION ("the guard that would have caught the defect originally"), disproved by the
  Engineer's own red-before-green record showing those six rows GREEN ON THE UNFIXED TREE. Second
  criterion on this project whose protective value was assumed rather than measured.

  A TRACE DEFECT THE ORCHESTRATOR REPORTED HERE ON 2026-08-09 IS WITHDRAWN — IT DOES NOT EXIST. The
  claim was that traceability rows ABC-011/ABC-015 carry 11 cells against the header's 10 from an
  "unescaped |". BA/PM re-derived it: the pipes ARE escaped (`\|`), every row has ten cells in all
  eight commits that ever touched the file, and the row's own author documented it on 2026-08-08. The
  Orchestrator's awk splitter counted raw pipes and ignored the escape; its own "ABC-009 verified at
  10" was luck of the splitter. Removing the backslash — the fix it proposed — is the one edit that
  WOULD have corrupted those rows. No ticket cut, no row edited.

  STILL OPEN AND SEPARATE, verified independently and NOT withdrawn: ABC-018 sits in Done here while
  plans/tickets/ABC-018-frame-output-and-redraw.md still reads `status: ready-for-uat` /
  `column: Ready for UAT`, against ABC-015's correct `done` / `Done`. Real state disagreement, not
  ABC-009's, needs its own item.

  NOT MERGED AND NOT CLOSED. Merge pre-checks are green and stay green: fast-forward available (0
  commits on main not on the branch, 0 merge commits, 8 ahead), branch-tip gate lint 0 / typecheck 0 /
  356 of 356 / build 0 / skip 0. The owner's standing merge directive of 2026-08-06 authorises the
  keystroke for work that PASSED; A11 unmet means this has not passed, and limit 2 of that directive —
  "the gate still binds" — is exactly this case. UAT stays deferred to EPIC-006 per the precedent on
  every ticket this project has shipped; that ruling is not taken here.
-->

<!--
  ENTERED 2026-08-09 from In Security/NFR, by Security/NFR (task `ticket-to-pr-ABC-009`, subtask
  `sec-abc009-nfr`, Workflow 04) on a PASS WITH RISKS verdict. Ready for UAT 0/4 -> 1/4. The gate
  record is in the In Security/NFR comment above and in the ticket's `## Security / NFR` section; it
  is not restated here. NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.

  UAT IS DEFERRED TO EPIC-006 AND IS EXPLICITLY NOT PASSED — ruled on this ticket's own evidence
  rather than inherited: there is no CLI entry point and no runnable game (AGENTS.md `Dev / run` is
  UNKNOWN - verify; `quality.ui_e2e` is ui-or-critical-path and this change has no UI surface), so
  THERE IS NO SURFACE A HUMAN CAN EXERCISE and a UAT pass would be a fabrication.

  WHAT A HUMAN MUST EVENTUALLY CHECK, named rather than left implicit: that a game played through
  the real CLI never offers a castle the rules forbid, and that the board a player sees after a
  `moves`/status query is the board they had before it. Neither is checkable today. Everything this
  ticket fixes is reachable ONLY through a semantically-invalid FEN, which no product path can
  produce until ABC-010 and EPIC-003 exist — which is also why the defect stayed latent and why its
  escalation trigger remains unspent.

  CARRIED INTO UAT: the ten risks in the In Security/NFR record, none high, each owned. The two that
  a UAT reader most needs are BA/PM's G-1/G-2 criteria-text gap (MEDIUM — closed in tests, open in
  the specification) and the standing fact that A1-A10 plus QE's rows is not PROVEN complete.
-->

<!--
  EMPTIED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-018`, Workflow 04): **ABC-018 MERGED
  to main and CLOSED, Ready for UAT -> Done — the second exit this role owns.** Ready for UAT 1/4 ->
  0/4. Fast-forward 7e0923c -> 364928b, 5 COMMITS, NO MERGE COMMIT: `git rev-list --count
  branch..main` was 0 and `git log --merges main..branch` was empty, BOTH CHECKED BEFORE the merge
  rather than assumed. `git branch --no-merged main` is now empty — all eleven branches contained.

  GATES RUN BY THIS ROLE ON THE TIP BEFORE AND ON MAIN AFTER, BOTH RECORDED, NEITHER INHERITED from
  the four agents that worked this ticket: lint / typecheck / build exit 0 on both sides, 304/304 on
  14 files on both sides, skip count 0 by the AGENTS.md command on both sides.

  src/frame.ts md5 bb827f52fe537817e40020a29dfa0e6d is IDENTICAL to the Engineer's first commit
  d88a1f0, checked ON MAIN. QE changed src/frame.test.ts only (+148/-0) and Security/NFR changed no
  source at all — NEITHER GATE REPAIRED THE MODULE TO MAKE ITS OWN VERDICT GREEN, which is the
  specific failure this board checks on every merge.

  MERGED UNDER THE OWNER'S STANDING DIRECTIVE OF 2026-08-06, read at its authority in
  memory-bank/60-progress.md rather than from AGENTS.md's pointer. All three of its limits honored:
  deploy not included and not attempted, the gate still binds and was run both sides, the authority
  stays the owner's. UNLIKE THE PREVIOUS TWO MERGES THE HOST PERMISSION CLASSIFIER DID NOT DENY THIS
  ONE — ABC-014 and ABC-015 were each blocked first and each returned to the owner rather than worked
  around. Recorded because two denials had started to look like a rule; this is the counter-example.

  NFR-002's WRITE HALF IS NOW MEASURED — the row plans/nfr-catalog.md carried as UNKNOWN - verify.
  Re-derived at the gate on its own instruments: compute + write 0.0087-0.0088 ms against a 16 ms
  bar, flat across 40/120/300 plies, Apple M3 / Node v24.12.0 / Darwin arm64. The gate's regular-file
  cell reads ~11% above the Engineer's and THAT DISCREPANCY WAS STATED RATHER THAN SMOOTHED.

  UAT DEFERRED TO EPIC-006 AND EXPLICITLY NOT PASSED — zero runtime importers, no CLI entry point, so
  a pass would be a fabrication. Same disposition as every ticket this project has shipped.

  RISK-005 IS FULLY DISCHARGED. Its merge-order half was satisfied before this ticket started
  (ABC-015 merged 2026-08-08); its BUILD half was checked mechanically at the merge — the glyph mode
  is a required parameter with no default, frame.ts's only import is an erased `import type
  { GlyphMode }`, and the only isTTY/rows reads are of the INJECTED sink.

  SIX ITEMS ARE RECORDED OPEN RATHER THAN DISCHARGED, in full in the close-out note: the prompt-row
  contract has only one side written down (ABC-019 and EPIC-003 must carry it); six mutants passed
  all twelve acceptance criteria at QE (gaps in the CRITERIA, not defects in the code, all pinned);
  no criterion constructs an absent isTTY/rows sink for the third consecutive ticket; W is recomputed
  per frame while Scope calls it a session constant; tools/grugops/test-skip-integrity.js exited 2 on
  all three agent runs and has never run successfully in this project; and ABC-009 + ABC-022 have now
  been displaced twice.

  DEPLOY WAS NOT ATTEMPTED OR CONTEMPLATED — not in the standing grant,
  production_requires_human_confirmation stays true, and ADR-0007 records there is nowhere to deploy.

  Previously ENTERED 2026-08-09 by Security/NFR:
-->

<!--
  ENTERED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-018`, subtask
  `security-nfr-abc018-gate`, ABC-018's gate): **ABC-018 In Security/NFR -> Ready for UAT on a
  PASS_WITH_RISKS verdict.** Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  The full gate record — the byte-level escape campaign under Node's permission model, NFR-002's
  two halves on four sinks with two independent samples, the two routed questions decided, the
  ASVS L1 walkthrough, and the five accepted risks with their owners — is in the In Security/NFR
  column above and in the Security/NFR notes under
  .grugops/context/ticket-to-pr-ABC-018/notes/. It is NOT restated here.

  WHAT THIS COLUMN IS BEING ASKED FOR, STATED PLAINLY: nothing a human can do yet. UAT IS DEFERRED
  TO EPIC-006 AND IS EXPLICITLY NOT PASSED. Ruled on THIS ticket's evidence rather than inherited
  from ABC-015's identical ruling: src/frame.ts has ZERO RUNTIME IMPORTERS (git grep in non-test
  src/ returns nothing — checked here, not taken from QE's note), package.json has no bin, no main,
  no exports and no start, and AGENTS.md's Dev / run is UNKNOWN - verify because there is no CLI
  entry point until EPIC-006. assembleFrame returns a value and beginFrameSession writes only to a
  sink a caller injects, so NOTHING REACHES A HUMAN'S TERMINAL and a UAT pass would be a fabrication.

  WHAT A HUMAN MUST EVENTUALLY CHECK IS NAMED RATHER THAN LEFT IMPLICIT, because this gate could
  not check it in-process: that a real terminal draws the frame without a staircase (this module
  emits no carriage return and relies on ONLCR, which QE flagged as UNKNOWN - verify under the raw
  mode EPIC-003's input surface may set); that the two escape sequences behave as the screen model
  assumes; and that the 64 C1-range bytes a unicode frame carries are harmless on the terminal
  actually in use. EPIC-006 is the first place all three are observable.

  THIS GATE ATTACHED NO TERMINAL AND CLAIMS NONE. Unlike ABC-015's gate, which drove a real pty,
  every reading here is of a captured sink or of a file descriptor — recorded as a limit rather
  than glossed.

  NOTHING MERGED AND NOTHING DEPLOYED — a human holds both. Merge is the Orchestrator's under the
  owner's standing authority, and it is approval to merge work that PASSED, never to skip a gate.
-->

<!--
  EXITED 2026-08-08 by the Orchestrator: ABC-015 merged to main and moved Ready for UAT -> Done,
  the exit this role owns. Ready for UAT 1/4 -> 0/4. Its row now sits in the Done column below with
  the merge shape and both gate runs recorded.
-->

<!--
  ENTERED 2026-08-08 by Security/NFR (task `ticket-to-pr-ABC-015`, subtask
  `security-nfr-abc015-gate`, ABC-015's gate): **ABC-015 In Security/NFR -> Ready for UAT on a
  PASS_WITH_RISKS verdict.** Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  The full gate record — the three instruments, the 138-value adversarial campaign, the ASVS L1
  walkthrough, the four accepted risks with their owners, and the correction to ABC-014's accepted
  risk 3 — is in the In Security/NFR column above and in the four Security/NFR notes under
  .grugops/context/ticket-to-pr-ABC-015/notes/. It is NOT restated here.

  WHAT THIS COLUMN IS BEING ASKED FOR, STATED PLAINLY: nothing a human can do yet. UAT IS DEFERRED
  TO EPIC-006 AND IS EXPLICITLY NOT PASSED. src/glyph-mode.ts has ZERO RUNTIME IMPORTERS, returns a
  value, writes nothing and prompts for nothing, and there is no CLI entry point until EPIC-006 —
  AGENTS.md's Dev / run is UNKNOWN - verify for exactly that reason. ABC-018 is the first ticket
  that puts this rule in front of a human. Same posture ABC-012 and ABC-014 took, ruled here on this
  ticket's own evidence rather than inherited as precedent.

  This gate DID exercise the module against a REAL TERMINAL (a python3-allocated pty, under Node's
  permission model): LANG=en_US.UTF-8 -> unicode, LANG=C -> ascii, isTTY genuinely true. THAT IS AN
  INSTRUMENT READING AND IT IS NOT OFFERED AS UAT — it is closer to a human exercising the product
  than anything on this ticket, and it is still not one.

  NOTHING MERGED AND NOTHING DEPLOYED — a human holds both. The owner's standing merge authority is
  approval to merge work that PASSED a gate; this ticket has now passed one, and the merge and the
  ... -> Done exit are the Orchestrator's, not this column's.
-->

<!--
  EMPTIED 2026-08-08 by the Orchestrator (task `ticket-to-pr-ABC-014`, Workflow 04): **ABC-014
  MERGED to `main` and moved Ready for UAT → Done — the `… → Done` exit this role owns.** Fast-forward
  `ed42d26` → `c1d694f`, 6 commits, **no merge commit** (`git log --merges` empty; the branch was
  linear and nothing had diverged). Ready for UAT 1/4 → 0/4; no limit approached, no override taken.

  GATES RUN BY THIS ROLE ON THE TIP BEFORE THE MERGE AND AGAIN ON `main` AFTER IT, both recorded, as
  the standing directive requires — and NOT inherited from any of the three agents that worked this
  ticket: **253/253 on 11 files, skip count 0** (captured with the `AGENTS.md` command, not
  eyeballed), lint + typecheck + build exit 0 on both sides. `git branch --no-merged main` is empty.

  THE MERGE WAS AUTHORIZED TWICE OVER, AND THE SECOND TIME IS THE ONE THAT MATTERS HERE. The owner's
  standing directive of 2026-08-06 covers it (`memory-bank/60-progress.md` § "Standing directive —
  the branching model, and who turns the merge key"). **But the first attempt was DENIED by the host's
  permission classifier, and it was not worked around** — a merge is a governance surface, so it went
  back to the human rather than to a different command. Project owner Olger Oeselg then said
  *"merge it"* in session on 2026-08-08. **Recorded because the honest sequence is part of the trail:
  the block was environmental, not a project rule, and the resolution was a human, not a workaround.**

  THE THREE LIMITS ON THE STANDING GRANT ARE UNCHANGED AND WERE ALL HONORED. (1) **DEPLOY IS NOT
  INCLUDED** — none was attempted or contemplated; `production_requires_human_confirmation` stays
  `true` and `ADR-0007` says there is nowhere to deploy. (2) **THE GATE STILL BINDS** — it was run
  green on both sides of the merge, never skipped or self-certified; `quality.gate_enforcement` is
  `blocking`. (3) **THE AUTHORITY IS STILL THE OWNER'S AND REVOCABLE.**

  **UAT IS DEFERRED TO `EPIC-006`, EXPLICITLY NOT PASSED** — Security/NFR's ruling, kept verbatim
  through this move rather than quietly rounded to a pass. Zero importers, no CLI entry point, no
  surface a human can exercise; a UAT pass would be a fabrication. This is the same posture every
  ticket in this project has carried, and `60-progress.md` already records the consequence the owner
  should see: with the merge checkpoint delegated there is now no human checkpoint between an agent's
  work and `main` until `EPIC-006` produces something a human can actually drive.

  **NOTHING WAS DEPLOYED AND NOTHING WAS PUSHED** — this repo has no remote and never had one. The
  branch was NOT deleted; that call has always been the owner's.

  TWO ITEMS ARE OPEN AND OWNED, named here so they are not lost with the ticket:
  1. **The self-healing snapshot net** — `npm test` is `vitest run` with no `--ci`, no
     `vitest.config.*` exists, and this project has no CI, so a missing snapshot cannot fail the
     gate. Routed to the AGENTS.md Scribe; NOT fixed on the ticket branch (wrong scope, wrong diff,
     and two agents must not write one working tree). Note
     `20260807T113000Z-orchestrator-decision-8f5a2b60`.
  2. **`ABC-012`'s ticket frontmatter is a column behind the board** — flagged 2026-08-06, still
     open, belongs to the board sweep. Note `20260806T090500Z-orchestrator-observation-6d02ae91`.

  ---
  Prior occupancy, retained:
  ENTERED 2026-08-07 from Security/NFR's PASS_WITH_RISKS verdict (task `ticket-to-pr-ABC-014`,
  subtask `security-nfr-abc014-gate`, Workflow 04). In Security/NFR 1/2 -> 0/2, Ready for UAT
  0/4 -> 1/4; no limit approached, no override taken. Gated against `security.asvs_level: L1` and
  `security.block_on: high`. `compliance_regime` is [], so no Compliance Officer hand-off is owed.

  THE NFR BAR WAS RE-MEASURED ON THIS GATE'S OWN HARNESS, NOT INHERITED -- the standard this column
  set on ABC-011's NFR-005 and kept on ABC-012. Harness outside the repository, its own process
  doing nothing else, a discarded warm-up round, 11 rounds with the CELL ORDER ROTATED EVERY ROUND,
  medians of per-round means, TWO fully independent samples, parseFen OUTSIDE the timed region, a
  checksum kept against elision, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and
  `UNKNOWN - verify` on any other hardware. Population: all 24 cells of 6 standing perft FENs x 2
  glyph modes x 2 orientations.
    worst bar cell   2.092 / 2.056 us   vs <= 500 us   0.0042x   MET  (kiwipete|unicode|black-bottom)
    best bar cell    0.955 / 0.980 us                                 (position-3|ascii|white-bottom)
    unicode          1.80-1.83x the cost of ascii
  The two samples agree to 1.7% and select the same worst and best cell. THE ENGINEER'S 2.070 us IS
  BRACKETED BY THIS GATE'S TWO SAMPLES -- reproduced, not carried forward, and said that way rather
  than smoothed into one number.

  THE BAR'S OWN POPULATION DOES NOT CONTAIN THIS MODULE'S WORST CASE, and the worst case was
  measured anyway rather than banked: a FULLY-OCCUPIED 64-PIECE BOARD (no empty-square short-circuit
  on any of the 64 squares, and unreachable through parseFen, which requires one king per side)
  reads 2.322 / 2.342 us = 0.0047x of the bar. The empty board, the true best case, reads
  0.910-1.051 us. Both are fences, not the result.

  THE 40/120/300 PLY COUNTS plans/nfr-catalog.md MANDATES ON AN NFR-002 MEASUREMENT DO NOT APPLY TO
  THIS MODULE, AND NO PLY FIGURE WAS INVENTED TO LOOK COMPLIANT. The absence is structural and was
  MEASURED, not assumed: renderBoard takes a Position, which carries no move list at all, and this
  gate verified that castling, the en-passant square, both clocks and the side to move influence
  ZERO frame bytes. A frame is a pure projection of the 64 on-board squares.

  ONE STRUCTURE IN THE NUMBERS IS ATTRIBUTED RATHER THAN LEFT AS NOISE: black-bottom costs
  ~0.10-0.13 us more than white-bottom on EVERY cell. Measured in isolation, src/render.ts:146's
  `[...FILE_LETTERS].reverse().join("")` on the black-bottom path costs +0.112 us/frame against the
  bare constant -- essentially the whole delta. It is 0.02% of the bar, NO CHANGE IS ASKED FOR, and
  it is recorded only so a later reader does not read it as a regression.

  THE TICKET'S "NO SECURITY TRIGGER" RULING WAS RE-DERIVED AGAINST WHAT WAS ACTUALLY BUILT AND IT
  HOLDS -- BUT ITS STATED REASON IS INCOMPLETE, AND THIS GATE REPORTS THAT RATHER THAN RATIFYING THE
  TICKET'S WORDING. The ticket says "no user-supplied string reaches this module". Two of
  renderBoard's three parameters ARE strings -- GlyphMode and Orientation -- and their TypeScript
  unions are ERASED AT RUNTIME; EPIC-006's --ascii/--unicode flags are the plausible path by which a
  user-controlled string becomes one. What actually holds the property is stronger and was proven
  here: THE FRAME'S OUTPUT ALPHABET IS CLOSED. Every emitted byte comes from a module constant; the
  board bytes and the mode string are used only as lookup KEYS and are never emitted. Measured over
  32 frames spanning the 6 standing FENs, the empty board and a fully-occupied board in both modes
  and both orientations: 42 distinct code points, 0 outside the fixed tables, 0 control bytes, 0 ESC
  -- no ANSI sequence is constructible from this module's output. 27 hostile mode values (prototype
  keys, a raw ESC sequence, a 10,000-char string, <script>, `; rm -rf /`, non-strings) injected ZERO
  bytes: 26 threw, 1 returned a clean frame.

  ONE REAL PROPERTY WAS FOUND AND IT IS A GADGET, NOT A VULNERABILITY -- reported plainly rather
  than either inflated or buried. GLYPHS[mode] (src/render.ts:118) and glyphs[pieceType(piece)]
  (:139) are unguarded prototype-chain lookups. Under an ALREADY-POLLUTED Object.prototype, a
  non-union mode ("constructor", "__proto__", "toString", "valueOf") or a board byte with
  (b & 7) === 7 injects attacker-controlled data straight into the frame INCLUDING ESC, and breaks
  the constant 18-character geometry (rows of 98 and 28 observed). BOTH REAL MODES ARE IMMUNE --
  own properties 1..6 shadow the polluted prototype, verified against a live-pollution control so
  the negative is not vacuous -- and THERE IS NO PROTOTYPE-POLLUTION SINK ANYWHERE IN src/, so the
  precondition cannot be created from inside this project. LOW, does not block.

  ASVS L1 JUDGED, NOT PADDED. Of the 70 active L1 requirements, 4 are reachable and pass on
  evidence (V1.3.2 no eval or dynamic execution; V2.1.1 the module documents its input contract in
  its own header, including that it validates nothing and why; V15.3.1 the frame returns only the
  required subset -- a board-only projection, measured; V1.2.x by analogue, via the closed output
  alphabet, ASVS 5.0 having no terminal-output-encoding requirement). 66 are structurally N/A with
  the reason stated per chapter: no HTTP, browser, cookie, session, token, OAuth, TLS, file,
  database or crypto surface exists anywhere in the closure. V16 and V17 carry NO L1 requirements
  at all. The import closure was re-verified with comments stripped -- render.ts -> position.ts ->
  nothing, 114 code lines, ZERO sinks (no node:, child_process, require(, eval(, new Function,
  process., globalThis, fs., fetch(, Buffer, console., stdout, isTTY, timers, crypto). The three
  process./stdout/isTTY matches in the file are all in the doc comment saying it reads none of them.

  FOUR ACCEPTED RISKS, NONE UNOWNED: (1) the prototype-chain gadget above -- LOW -- Architect/Design,
  place ABC-018/EPIC-006. (2) An out-of-domain board byte throws an uncaught TypeError with no
  context (verified on bytes 7, 8, 15, 16, 63, 127, 200, 255) -- LOW -- the DECISION is right and is
  not re-opened (the ticket's Out of scope and AGENTS.md rule 8), but ABC-018 is where an uncaught
  throw from a render call meets a half-drawn terminal; owner Architect/Design, place ABC-018.
  (3) A non-"white-bottom" orientation value silently renders BLACK-bottom rather than throwing --
  LOW -- owner ABC-015/EPIC-006, which owns the value. (4) Every figure is one machine and one Node
  version -- LOW -- Security/NFR, at EPIC-004's already-scheduled non-M3 spike.

  NO REQUIRED FIX. NO PRODUCTION CODE AND NO TEST WAS CHANGED BY THIS GATE: src/render.ts md5
  733bc67fec523a7f41016bea2b026e1d, identical to the Engineer's and QE's published figure, and
  `git diff HEAD -- src/` is empty. Gates re-run here rather than inherited: 253 passed / 11 files /
  0 failed, skip count 0 by the AGENTS.md command, lint 0 errors (the same 2 pre-existing biome
  config-schema infos), typecheck and build exit 0.

  CARRIED FORWARD UNCHANGED, NOT CLOSED HERE: the U+2654-U+265F East-Asian-Width ambiguity is
  `UNKNOWN - verify` on this gate's instruments too -- a string width and a terminal COLUMN width
  are different things and no in-process test reads the second; it lands on ABC-018 and RISK-005.
  The self-healing snapshot net is already routed to the AGENTS.md Scribe by the Orchestrator and is
  NOT re-routed here. NFR-002's WRITE half remains the half nobody has measured and stays ABC-018's.

  FLAGGED FOR THE THIRD TIME AND DELIBERATELY NOT FIXED: the ABC-014 ticket file's frontmatter still
  reads `status: in-development` / `column: In Development`. Ticket frontmatter is board state and
  the Orchestrator moves it; this board is the state of record. The Engineer and QE each flagged it
  before this. Three flags and no fix is itself the signal -- owner Orchestrator, next board-touching
  task. plans/metrics.md is likewise still stale (its own header names the daily sweep and the retro
  as its update owners) and this move makes it staler again. coverage/ remains a stale tracked
  artifact last written at ABC-007; flagged, not deleted (AGENTS.md rule 12).

  NOTHING MERGED AND NOTHING DEPLOYED. The owner's standing merge authority is approval to merge
  work that PASSED, and it is not deploy approval; per ADR-0007 this project deploys nowhere at all.
  ABC-009, ABC-010 and ABC-022 are carried, not fixed.
-->

<!--
  ENTERED 2026-08-04 from Security/NFR's PASS_WITH_RISKS verdict (task `ticket-to-pr-ABC-012`,
  subtask `security-nfr-abc012-gate`, Workflow 04). In Security/NFR 1/2 -> 0/2, Ready for UAT
  0/4 -> 1/4; no limit approached, no override taken. The full gate record -- the independently
  re-measured six-bar table, both fences tested rather than repeated, the discarded instrument, the
  judged ASVS L1 tier and the reasoned takeBack(NaN) ruling -- is the EXIT comment under
  `## In Security/NFR`.

  UAT IS DEFERRED TO EPIC-006 AND RECORDED AS DEFERRED, NOT PASSED -- the ABC-004..007, ABC-020 and
  ABC-011 posture, unchanged and for the unchanged reason: ABC-012 is a library module with ZERO
  importers that renders nothing and prompts for nothing, so there is no surface a human can
  exercise, and marking a UAT passed would be a fabrication. The traceability UAT cell says so.

  What a human WILL be able to exercise once EPIC-006 ships: that taking a move back rewinds the
  repetition history too, so a draw that was claimable before the undo is not still claimable after
  it. That is the whole user-visible consequence of this ticket, and it is EPIC-006's named test.

  WHAT THE OWNER SHOULD KNOW BEFORE MERGING, stated plainly because autonomy=pr reserves this
  decision for them: all three gates passed and NO required fix is outstanding, but FIVE accepted
  risks travel with the merge, and TWO of them are real defects that are unreachable today only
  because this module has no caller. takeBack(NaN) -- and the raw string "abc", and {} -- silently
  discards the ENTIRE game; playMove accepts a move from a different position and then reports a
  confident WRONG game result. ABC-019 is the ticket that makes both reachable, and this gate has
  recorded that the first one becomes a HIGH-severity ASVS L1 failure at that point, which WILL
  block. Merging ABC-012 is safe; merging ABC-019 without ruling the guard is not.

  NO PR EXISTS -- this repository has no git remote (`git remote -v` is empty), so there is nowhere
  to push and none was invented. The work is committed on the working branch and a human holds merge
  and deploy.
-->

<!--
  EXITED 2026-08-04 by the Orchestrator: ABC-011 MERGED to `main` and moved Ready for UAT -> Done,
  the `... -> Done` exit this role owns. Ready for UAT 1/4 -> 0/4. See the Done comment for the
  merge record.

  UAT DEFERRED TO EPIC-006, RECORDED AS DEFERRED AND NOT PASSED -- the ABC-004..007 and ABC-020
  posture, unchanged and for the unchanged reason: ABC-011 is rules-core-only work that renders
  nothing and prompts for nothing, so there is no surface a human can exercise and marking a UAT
  passed would be a fabrication. The traceability UAT cell says so.

  What a human WILL be able to exercise once EPIC-006 ships: that a repetition draw is offered for
  positions FIDE calls the same, and NOT offered merely because two positions share a written-down
  en-passant square. That is the whole user-visible consequence of this ticket.

  ---
  RE-ENTERED 2026-08-03 from Security/NFR's SECOND-PASS verdict, the second time this ticket has
  entered this column. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached,
  no override taken. The full gate record -- the independently re-measured NFR-005 table with its
  identity null control, the sub-bar's spied call counts, the MEDIUM ruled CLOSED with its
  336,000-input hunt against the real pre-guard tree as control, the reasoned DECLINE on the two
  cost-shaped mutants, and the ASVS L1 judgment -- is the EXIT comment under `## In Security/NFR`.

  WHAT IS DIFFERENT FROM THE FIRST TIME THIS TICKET SAT HERE, stated plainly because it is the only
  question the owner asked: THE MEDIUM PURITY DEFECT THE OWNER DECLINED TO MERGE IS CLOSED, and
  closed on this column's own evidence rather than accepted from the two gates before it -- all 13
  known reproductions pure, 336,000 adversarial inputs at 0 impure against a control that reads
  14,341 on the identical population, plus a structural precondition argument. The accepted risk
  that used to read "zobristKey permanently corrupts a semantically-inconsistent ep position" is
  GONE from the list rather than reworded.

  AND ONE THING THE OWNER SHOULD KNOW BEFORE MERGING: an earlier, interrupted attempt at this
  re-gate had already moved this board here with a PASS while publishing no typed note at all. That
  state was not admissible and was not left standing -- the uncommitted prose was reverted and this
  verdict was re-derived from scratch. It landed in the same place, but it now has notes behind it.

  UAT IS STILL DEFERRED TO EPIC-006 AND STILL RECORDED AS DEFERRED RATHER THAN PASSED. Nothing
  about that changed: no runnable game exists, so there is no surface a human can exercise.
-->


<!--
  SENT BACK 2026-08-03 by the Orchestrator on the project owner's explicit instruction: "fix the
  medium defect before merging". ABC-011 moved Ready for UAT -> In Design. Ready for UAT 1/4 -> 0/4,
  In Design 0/2 -> 1/2. No limit approached, no override taken.

  THIS IS A BACKWARD MOVE AND IT IS RECORDED AS ONE. The ticket had passed all three gates and was
  waiting only on a human merge. The owner declined to merge with the defect carried, which is the
  owner exercising the decision autonomy=pr reserves for them. The gates were NOT wrong to pass it:
  QE named the defect and Security/NFR ruled it MEDIUM-and-not-blocking on reachability grounds
  (unreachable by play; `apply.ts:139` derives epSquare as the double-push midpoint), and both
  recorded it in the open rather than absorbing it. The owner weighed the same facts and chose
  differently. That is what "accepted risk with an owner" is for -- the owner is the one who accepts.

  WHY In Design AND NOT In Development. The defect is `zobristKey` permanently dirtying a position
  whose ep square is semantically inconsistent, and QE could not settle WHY the shipped predicate
  and the ruled oracle disagree on `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` -- it flagged that as needing
  an Architect ruling, not a dev fix. An engineer who guesses the definition writes a fix against a
  contract that can be rejected. Same reason this ticket entered In Design the first time.

  IT IS A DEFECT AGAINST THIS TICKET'S OWN RATIFIED CONTRACT, so no new ticket is cut and this is not
  scope growth: the `### ANSWERED` block's rule 5 says the predicate "must leave the position
  byte-identical on return". On this input class it does not. `## Out of scope`'s invalid-FEN line
  (ABC-010's surface) governs what the predicate must ANSWER, not whether it may corrupt what it was
  handed. Security/NFR's routing of a possible follow-on ticket to BA/PM stands for anything that
  turns out to be genuinely ABC-010's.

  ---
  ENTERED 2026-08-03 from Security/NFR's PASS. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4;
  no limit approached, no override taken. See the exit comment under `## In Security/NFR` for the
  full gate record -- the independently re-measured NFR-005 table, the sub-bar's spied call counts,
  the four assertions added in src/zobrist.nfr.test.ts and the ASVS L1 result.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED -- the same posture
  ABC-020 and the ABC-004..007 stack were given, for the same unchanged reason. ABC-011 is
  rules-core-only work inside a library with no entry point: it renders nothing, prompts for
  nothing, and `AGENTS.md` records both the dev command and E2E as `UNKNOWN - verify` because no
  runnable game exists until EPIC-006. There is no surface a human can exercise, so there is no UAT
  to run and marking one passed would be a fabrication. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  WHAT A HUMAN WILL BE ABLE TO EXERCISE ONCE EPIC-006 SHIPS, and what UAT should then cover: that a
  game repeating a position reached via a double push is offered the threefold draw it is entitled
  to -- the exact case this ticket fixes, since the placement after 1.e4 is the placement after
  1.e3 ... 2.e4 and before ABC-011 those two hashed differently and never joined a count. The
  regression side is equally checkable by hand: a repetition where the ep capture is genuinely
  available must NOT be collapsed, and no draw may ever be offered that was not earned. The error
  direction to watch is unchanged -- a legitimate draw arriving late is the failure this ticket
  removes; a FALSE draw is the failure it must never introduce.

  THREE ACCEPTED RISKS RIDE INTO UAT WITH THIS TICKET, each with a named owner, none blocking:
    1. Every timing figure on this ticket is ONE MACHINE (Apple M3 / Node v24.12.0 / darwin-arm64)
       and `UNKNOWN - verify` anywhere else. The machine-independent quantity is the ratio to the
       baseline tree in the same process. Owner: EPIC-004's non-M3 spike, which already carries the
       identical obligation for NFR-005's depth-7 PROVISIONAL marker.
    2. zobristKey permanently corrupts a position whose ep square is semantically inconsistent
       (MEDIUM). Invalid-FEN trigger class only, unreachable by play, carried by `## Out of scope`.
       Owners: BA/PM to cut or fold into ABC-010; Architect/Design for the oracle divergence.
    3. The amortized per-node figure is measured on a perft-table population, NOT on a search's node
       distribution, which stays `UNKNOWN - verify` until EPIC-004 exists. Owner: EPIC-004.
-->

<!--
  ENTERED AND EXITED. Entered 2026-08-01 by Security/NFR on a PASS verdict; exited 2026-08-02 when
  the Orchestrator moved ABC-020 to Done on merge. WIP 0/4 -> 1/4 -> 0/4; no limit approached, no
  override taken. First occupant of this column since it was cleared on 2026-07-24.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED. ABC-020 is
  rules-core-only work: it renders nothing and prompts for nothing (its own `## Out of scope` sends
  the interaction to ABC-021, the panel row to ABC-016, the prompt verb to EPIC-003 and the result
  screen to EPIC-006). There is no surface a human can exercise until a runnable game ships, so
  there is no UAT to run and marking one passed would be a fabrication. This is exactly the posture
  ABC-004..007 were given on 2026-07-24 and the reason is unchanged. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  What a human WILL be able to exercise once EPIC-006 ships, and what UAT should then cover: that a
  threefold repetition or a 100-ply clock offers a claim instead of ending the game, that declining
  it and playing on is possible (the G-1 line's Re8# is the acceptance case), that the claim is
  offered to the side to move and to nobody else, and that a game with no claim ever made still
  ends -- on fivefold for a caller with history, on the 75-move backstop for one without.

  ---
  Cleared 2026-07-24: the ABC-004..007 stack was merged to main and moved to Done. UAT
  execution for the EPIC-001 rules core is DEFERRED, not skipped — it is a pure library with
  no surface a human can exercise until EPIC-006 packaging ships a runnable game. The
  traceability UAT cells read "UAT deferred — EPIC-006" so the gap stays visible rather than
  being quietly marked passed.
-->

## In UAT (WIP 0/4)

## Ready to Release (WIP 0/4)

## Done (WIP unlimited)

- [ABC-018] Frame output and redraw — in-place on a TTY, append otherwise, constant height  (merged: 2026-08-09 by fast-forward 7e0923c → 364928b, 5 commits, no merge commit — `git rev-list --count branch..main` was 0 and `git log --merges main..branch` empty, both checked BEFORE the merge; 304/304 on 14 files + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; `src/frame.ts` md5 `bb827f52…` IDENTICAL to the Engineer's first commit — QE changed only its own test file (+148/-0) and Security/NFR changed no source, so neither gate repaired the module to make its own verdict green; **promoted only after BA/PM found and fixed FIVE acceptance defects at the `Backlog → Ready` exit — three the Orchestrator flagged, two named by no pre-check — including a frame row (the prompt row) that EPIC-002's own reference layout contained and NO ticket owned**; QE PASS after 56 distinct mutants over 75 cycles, of which **6 passed all twelve criteria and all 297 delivered tests** — every one a gap in the CRITERIA rather than a defect in the code, all pinned; Security/NFR PASS_WITH_RISKS, no required fix, 5 accepted risks each with a named owner, **NFR-002's write half measured for the first time in this project** at 0.0087–0.0088 ms against 16 ms; **UAT deferred → EPIC-006, explicitly NOT passed** — zero runtime importers, no CLI entry point; first merge in three not preceded by a host permission denial; `RISK-005` fully discharged — merge-order half satisfied before the ticket started, build half checked mechanically at the merge)
- [ABC-015] Glyph mode selection — precedence, signal set, --unicode override  (merged: 2026-08-08 by fast-forward f1743a3 → f4d5d31, 12 commits, no merge commit — `git log --merges` empty and `git rev-list --count branch..main` was 0 before the merge, both verified not assumed; 277/277 on 13 files + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; `src/glyph-mode.ts` md5 `9c1f4f4e…` IDENTICAL to the Engineer's first commit — QE and Security/NFR each changed tests or docs only and neither repaired the module to make its own verdict green; QE PASS after 29 mutants of which 3 passed every criterion AND all 271 delivered tests; Security/NFR PASS_WITH_RISKS, no required fix, 4 accepted risks each with a named owner, NFR-007's zero-I/O bar re-derived on that gate's own instruments and MET; **acceptance criteria AMENDED TWICE mid-flight by BA/PM, 9 criteria → 15, every amendment ratifying what was already built**; **UAT deferred → EPIC-006, explicitly not passed** — zero runtime importers, no CLI entry point; second merge in two days preceded by a host permission denial that was returned to the owner rather than worked around; RISK-005's merge-order constraint DISCHARGED — this merged before ABC-018, which is still unstarted)
- [ABC-014] Board frame renderer — grid, labels, shading, orientation, both glyph modes  (merged: 2026-08-08 by fast-forward ed42d26 → c1d694f, 6 commits, no merge commit; 253/253 green + skip 0 re-verified ON main by the Orchestrator, lint/typecheck/build exit 0 both sides; QE PASS after 34 mutate-and-restore cycles with `src/render.ts` md5 unchanged; Security/NFR PASS_WITH_RISKS — NFR-002 board-frame bar re-measured 2.092 µs against ≤ 500 µs, ~240x headroom, Apple M3 / Node v24.12.0 / darwin-arm64; 4 accepted risks each with a named owner; **UAT deferred → EPIC-006, explicitly not passed** — zero importers, no CLI entry point; first merge in this project preceded by a host permission denial that was returned to the owner rather than worked around)
- [ABC-012] Game history module — the move list is the authoritative state  (merged: 2026-08-06 by fast-forward 39e260d → 7355b51, 8 commits, no merge commit; 226/226 green + skip 0 re-verified ON main; **THE FIRST MERGE UNDER THE OWNER'S STANDING MERGE APPROVAL, not a per-instance instruction**; three gates PASS — QE killed 21 mutants of which 3 survived the delivered suite, Security/NFR re-measured all six NFR bars independently and MET every one at 0.09x–0.67x; five accepted risks each with a named owner, no required fix; UAT deferred → EPIC-006)
- [ABC-011] Zobrist key hashes en passant when no capture is available  (merged: 2026-08-04 by fast-forward 4a73cf3 → d3efba6, 16 commits, no merge commit; 214/214 green + 0 skips re-verified ON main; two design hops, two dev passes, two QE reviews and two sec/NFR gates; the MEDIUM purity defect the owner declined to merge is CLOSED; ADR-0005 accepted-with-amendment and ADR-0006 accepted; UAT deferred → EPIC-006)
- [ABC-020] FIDE 9.2/9.3 draws become claimable, FIDE 9.6 backstops land with them  (merged: 2026-08-02 by fast-forward d53ce31 → cb62c9f; 174/174 green re-verified ON main; QE PASS after 13 mutations, sec/NFR PASS on all three bars re-measured; UAT deferred → EPIC-006; its one open question — FIDE 9.6.1 "consecutive" — CLOSED 2026-08-02 as conformant, no code change owed)
- [EPIC-001] Chess rules core  (complete: 2026-07-24, decomposed ABC-001..ABC-007 + ABC-008 spike, all merged; rule-complete and perft-proven)
- [ABC-008] SPIKE — Node search throughput  (merged: 2026-07-23, outcome: GO WITH CONSTRAINT, RISK-002 answered)
- [ABC-001] Position state and FEN round-trip  (merged: 2026-07-23, 27 tests, ADR-0001)
- [ABC-002] Pseudo-legal move generation for all piece types  (merged: 2026-07-23, 22 tests, QE PASS no defects)
- [ABC-003] Apply and undo a move with full state restoration  (merged: 2026-07-23, 15 tests, QE PASS no defects, src/apply.ts 100% coverage)
- [ABC-004] Special moves — castling, en passant, promotion  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-005] Legal move filtering and attack detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-006] Perft verification harness  (merged: 2026-07-24, deep perft 32/32 exact, RISK-001 retired, NFR-001 ~6.2M nps; UAT deferred → EPIC-006)
- [ABC-007] Game-end detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS, EPIC-001 rule-complete; UAT deferred → EPIC-006)


<!--
  ABC-011 MERGED 2026-08-04 as a fast-forward, 4a73cf3 -> d3efba6, 16 commits, NO merge commit
  created -- the branch was linear and nothing had diverged (`git rev-list --count
  grugops/ticket-to-pr-ABC-011..main` was 0 before the merge).

  VERIFIED BEFORE the merge on the branch tip and AGAIN AFTER it on main: 214/214 green, skip count
  0 (captured with the AGENTS.md command, not eyeballed), lint + typecheck + build all exit 0.
  Re-verifying ON main is the ABC-004..007 and ABC-020 precedent and it is the only check that
  catches a merge which breaks something no branch broke on its own. `git branch --no-merged main`
  is empty.

  THE MERGE WAS PERFORMED BY AN AGENT ON EXPLICIT HUMAN INSTRUCTION ("merge the branch for me"),
  the same one path that crosses the "humans hold merge" line without breaking it: the human holds
  the DECISION, the agent supplies the keystroke. This is NOT standing authorization; the standing
  rule is unchanged and no future merge happens without the same explicit instruction. Identical to
  the rule already recorded for ABC-001/002/003/008, the ABC-004..007 stack and ABC-020.

  THE BRANCH WAS NOT DELETED. Branch deletion is the owner's call -- they made it explicitly once,
  on 2026-08-02, and that was recorded as not standing either. `grugops/ticket-to-pr-ABC-011` is
  contained in main and can be deleted on a word.

  WHAT MERGED, and it is worth one line because the shape is unusual: TWO design hops, TWO dev
  passes, TWO QE reviews and TWO Security/NFR gates on one M ticket. The second pass exists because
  the owner DECLINED an accepted risk that all three gates had passed -- the MEDIUM purity defect --
  and every stage of that second pass then found something the first had not: a fourth reproduction
  at the design hop, a self-caught bad benchmark protocol in dev, and two more real mutants at QE,
  one of which permanently rewrote a black knight into a black pawn. The production diff for the
  whole fix is FOUR EXECUTABLE LINES.

  ONE GATE RUN WAS REFUSED AND RE-RUN, which is the part worth keeping. The second Security/NFR run
  was cut off mid-flight by the machine sleeping and left the board asserting a PASS with detailed
  figures, ZERO published notes, no claim.md, the queue task stranded in claimed/ and a half-edited
  test file -- nothing committed. The Orchestrator refused it on the standing rule (no published
  notes, no advance) and sent the column back to either back the verdict or reverse it. It upheld
  the verdict AND corrected it: it reverted the stranded prose rather than patching it, and could
  not reproduce several of the interrupted run's figures, including a claimed "2.5x Proxy
  deoptimisation" that in fact throws outright un-shimmed. Its own numbers are the record. Had the
  unbacked PASS been accepted, this would have merged on figures nobody could reproduce.

  TWO ADRs LANDED WITH IT, the first ratified under the owner's 2026-08-03 delegation: ADR-0005
  (en-passant availability is a legality question; the hash module asks the rules) accepted WITH AN
  AMENDMENT, because one of its own statements was false as written; and ADR-0006 (castling rights
  stay rights in the hash) accepted -- answering the owner's "special moves" question with a
  reasoned NO rather than by analogy.
-->
<!--
  ABC-020 merged 2026-08-02. THREE stacked branches landed in ONE fast-forward, because they were
  a single linear chain and nothing had diverged: main d53ce31 -> cb62c9f, 27 commits, no merge
  commit created.

    main
     └─ grugops/architecture-audit-2026-07-29     ADR-0002 + ADR-0003 ratified; ABC-009/010/011 cut
         └─ grugops/epic-to-tickets-EPIC-002      EPIC-002 decomposed; ADR-0004 ratified; ABC-020/021 cut
             └─ grugops/ticket-to-pr-ABC-020      ABC-020 implemented + gated

  Verified BEFORE the merge (on the tip) and AGAIN AFTER it (on main): 174/174 green, 0 skips,
  lint + typecheck + build all exit 0. Re-verifying on main is the ABC-004..007 precedent and it is
  the only check that catches a merge which breaks something no branch broke on its own.

  ALL NINE branches in this repo are now contained in main; `git branch --no-merged main` is empty.
  No branch was deleted -- that is the owner's call, not an agent's.

  BRANCHES DELETED 2026-08-02 on EXPLICIT owner instruction ("validate if these branches have been
  merged and if so then delete each"), which is the owner making the call the line above reserved
  for them. NOT standing authorization: no future branch is deleted without the same instruction.
  Validated BEFORE deleting, per branch, by `git merge-base --is-ancestor <branch> main` plus
  `git rev-list --count main..<branch>` -- all eight returned contained / 0, and
  `git branch --no-merged main` was empty. Deleted with `git branch -d`, the safe form that REFUSES
  an unmerged branch; `-D` was never used, so an unmerged branch could not have been lost even if
  the validation had been wrong. Tips recorded here so they are recoverable independent of the
  reflog, and each was re-confirmed an ancestor of main AFTER deletion:

    grugops/ticket-to-pr-ABC-020           cb62c9f
    grugops/epic-to-tickets-EPIC-002       d6c7e71
    grugops/architecture-audit-2026-07-29  4d00cb1
    grugops/close-out-EPIC-001             d53ce31
    grugops/ticket-to-pr-ABC-007           cd9caae
    grugops/ticket-to-pr-ABC-006           07cfac5
    grugops/ticket-to-pr-ABC-005           8eb8b69
    grugops/ticket-to-pr-ABC-004           ce05df9

  `main` is now the only branch, still at 4a73cf3 -- unmoved by the deletions. NO COMMIT WAS LOST:
  every SHA above is still reachable from main. Nothing was merged and nothing was deployed.

  The merge was performed by an agent on EXPLICIT human instruction ("merge the one open"), the
  same one path that crosses the "humans hold merge" line without breaking it: the human holds the
  DECISION, the agent supplies the keystroke. This is NOT standing authorization; the standing rule
  is unchanged and no future merge happens without the same explicit instruction. Identical to the
  rule already recorded for ABC-001/002/003/008 and for the ABC-004..007 stack.

  MERGED WITH ONE OPEN QUESTION AGAINST IT, recorded so it is not lost: FIDE 9.6.1 says "five
  CONSECUTIVE alternate moves" and this code uses a plain 5-count (QE, `UNKNOWN - verify`, declined
  to assert it from a remembered sentence). The Orchestrator recommended settling it BEFORE the
  merge; the owner merged first. That is a legitimate call -- the error direction is the safe one,
  as with ABC-011 -- but the consequence is now real: closing it means a SECOND change to
  src/gameend.ts on main rather than one change on a branch. It is open question 1 in
  memory-bank/60-progress.md.

  THAT OPEN QUESTION IS CLOSED, 2026-08-02, task `refinement-fide-9-6-1` (Workflow 07): THE CODE
  CONFORMS AND THE SECOND CHANGE IS NOT OWED. BA/PM ruled it against the retrieved Laws text and
  the Orchestrator re-fetched independently before accepting -- Article 9.6.1 at
  handbook.fide.com/chapter/E012023 reads verbatim "the same position has appeared, as in 9.2.2 at
  least five times", and the word CONSECUTIVE occurs ZERO times in the whole 2023 Laws. QE's
  memory was verbatim correct for the 2014 edition, which the 2017 edition replaced: right words,
  wrong edition -- a failure only retrieval can catch, so QE's refusal to assert it is VINDICATED
  rather than overturned. `occurrences >= 5` matches "at least five times" (and `>=` is the right
  direction); `halfmoveClock >= 150` matches 9.6.2's "at least 75 moves ... by each player"; 9.6's
  "if the last move resulted in checkmate, that shall take precedence" is the terminal-check order
  A6 already pins. NO TICKET CUT, no column moved, no override taken. The conditional
  Architect/Design hop -- held in case consecutiveness needed ADR-0002 clause 3's per-ply key list
  -- is CANCELLED rather than deferred; ADR-0002 needs no amendment on this account. Response bytes
  and their sha256 are retained under .grugops/context/refinement-fide-9-6-1/sources/. No gate was
  re-run: nothing under src/ or any test file changed.

  ABC-004..007 merged 2026-07-24 as one fast-forward of the stacked unit
  (main f80a15a → cd9caae, no conflicts), suite re-verified 143/143 green ON main after the
  merge. EPIC-001 (Chess rules core) is now COMPLETE: all 8 tickets closed.

  The merge was performed by an agent on EXPLICIT human instruction — the same one path that
  crosses the "humans hold merge" line without breaking it: the human holds the DECISION, the
  agent supplies the keystroke. This is NOT standing authorization; the standing rule is
  unchanged and no future merge happens without the same explicit instruction. Identical to
  the rule already recorded for ABC-001/002/003/008.
-->


<!--
  Done means MERGED, and as of 2026-07-23 these three are: `main` was created at 8d0a8f7,
  the tip that contained all three stacked branches. In lean mode Done is the terminal
  column — there is no release stage, so `mode=lean` closes the ticket at merge.

  The merge was performed by an agent on explicit human instruction, which is the one path
  that crosses the "humans hold merge" line without breaking it: the human holds the
  decision, not the keystroke. The standing rule is unchanged — no future merge happens
  without the same explicit instruction.
-->

## Blocked (visible, time-tracked)

_Empty. The column's one and only occupant, ABC-013, was unblocked 2026-07-31._

<!--
  CLEARED 2026-07-31 by Architect/Design (subtask `architect-adr0004-ratify`): ADR-0004 is
  `accepted`, so ABC-013's single blocker is gone and it moved to Ready (see the Ready comment for
  why Ready and not Backlog). Blocked time: 2026-07-30 -> 2026-07-31, ONE day against
  `blocked_escalation_days: 2` — it never escalated. First entry to and first exit from this column
  in the project's history; the Blocked convention worked exactly as written, which is worth one
  line in plans/metrics.md when the next sweep runs.

  HOW it was ratified matters and is not what the paragraph below anticipated. ADR-0004 was ruled on
  by the ORCHESTRATOR under an explicit, quoted delegation from the project owner Olger Oeselg dated
  2026-07-31 ("I will give ADR-0004 ownership to you, you can decide if changes are needed or it can
  be scrapped") — NOT by a human directly. It is the FIRST ADR in this project ratified that way, it
  is explicitly NOT precedent, and the delegation was specific to ADR-0004 by name. The standing rule
  that no agent may mark an ADR accepted is unchanged for every other ADR. The last line of the
  paragraph below — "this is the same ruling on the same kind of artifact" — is therefore CORRECTED
  rather than fulfilled: same kind of artifact, different kind of ruling.

  The ruling accepted clauses 1 and 3 as proposed and AMENDED clause 2. The amendment lands on
  EPIC-003's `parseSan` (a discriminated result that keeps `ambiguous` and `rejected` distinct, plus
  the move-identity invariant), not on ABC-013's `toSan` — so ABC-013's scope, size, priority,
  acceptance criteria and NFR bars are all unchanged by it.

  As written 2026-07-30, when the ticket entered this column:
  ABC-013 is the FIRST ticket this project has put in Blocked, and it is here rather than in Ready
  on purpose. It meets every other Definition-of-Ready check; what it fails is "no major unresolved
  blocker". ADR-0004 (SAN ownership) says of itself that it does NOT block cutting tickets but DOES
  block "the merge of the first line of src/san.ts", because that is the point at which the decision
  becomes expensive to reverse. A ticket in Ready is pullable, and pulling this one would produce
  code that cannot land — so it sits in Blocked, visible and time-tracked against
  `blocked_escalation_days: 2`, rather than buried in a dependency line where the human ruling it
  needs would be invisible.

  Ratification alone clears it. ADR-0002 and ADR-0003 were each ratified in session by a named
  human on 2026-07-30; this is the same ruling on the same kind of artifact.

  ABC-016 and ABC-017 depend on ABC-013 and therefore inherit the wait. They are in BACKLOG, not
  Blocked: their blocker is a ticket, not a decision, and duplicating one decision across three
  Blocked rows would make the column lie about how many human rulings are outstanding. There is
  exactly one.
-->

## Conventions

These sizing, priority, and Blocked conventions are defined ONCE here and apply to BOTH
cadences (kanban and scrum) — BOARD-04. The Phase-4 scrum cadence references this same block;
it is not redefined per cadence.

### Sizing (spec §6.3)

T-shirt size maps to points: `XS=1, S=2, M=3, L=5, XL=8`. **XL must be split** — the
Orchestrator enforces "no XL into dev". BA/PM sizes (and prioritizes) at refinement. The
sizing scheme is set in config (`sizing`, default `tshirt`).

### Priority (spec §6.3)

`P0` (drop everything) `..` `P3` (someday). Use WSJF instead if config says so
(`priority_scheme`, default `P0-P3`).

### Blocked policy (spec §6.4)

- Any agent can move a ticket to Blocked with a `blocked-by` reason and a date.
- The daily sweep counts blocked time and escalates anything blocked past the config
  threshold `blocked_escalation_days` (default 2).
- A blocker is a decision, a dependency, or a missing input. Name it. Assign a human if needed.
