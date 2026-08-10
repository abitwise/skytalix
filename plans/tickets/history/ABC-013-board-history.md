# ABC-013 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-013`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-013-san-rendering.md`](../ABC-013-san-rendering.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## Blocked (visible, time-tracked) — column note

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

---

## `Ready → Ready for Dev` — the BA/PM promotion, 2026-08-10

Recorded by BA/PM (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-bapm`, Workflow 07).
WIP at the move: **Ready 1/8 → 0/8, Ready for Dev 0/6 → 1/6**; `In Development` 0/3 and `Blocked`
empty, both untouched. `queue.wip_limit` 3, unchanged. The `Ready` exit is BA/PM's per this board's
`## Columns`; the `Ready for Dev → In Development` exit is the Orchestrator's and was **not** taken,
and **no engineer was enqueued**.

**The Definition of Ready is MET on all ten rows — after eighteen corrections.** The hop that
opened this task returned AMBER on one row ("acceptance criteria clear, testable and measurable")
and named four defects plus a fifth it explicitly declined to assert. Measured at this hop: **17
corrections**, and the fifth candidate — *a castle can give check, and nothing pinned `O-O+`* — is
**confirmed**.

**Nine wrong builds passed all thirteen criteria as written.** Each was a real build of `toSan`,
scored against a hand-typed oracle of 52 rows over 18 FENs, on merged `main`, outside the
repository. They were scored *charitably*: every prose criterion was handed the best FEN that can be
built for it, which is strictly more than an engineer holding only the ticket would have had. The
nine: rank-before-file; rivals drawn from the **pseudo-legal** list (a **pinned** knight still forces
a qualifier); rivals not filtered by piece type; `#` emitted on a **stalemate**; the `x` lost on an
**en-passant** capture; `x` for pawn captures only; a castle returning before its suffix; a wrong
`K` letter; and `P` on a quiet pawn push. All nine die on the repaired table.

**The pre-check's `Pe4` lead was confirmed and its mechanism corrected.** The build it described —
an explicit `P` on every quiet pawn move — is killed by the *promotion* criterion, because it also
emits `Pe8=Q`. The build that actually survives is the narrower one whose promotion branch is
written separately and correctly. Recorded rather than absorbed, because "confirmed" and "confirmed
as described" are not the same verdict.

**One of thirteen criteria was executable as written**, against a section that opened *"Every
criterion is a hand-built FEN with an exact expected string"*. Five criteria named a position in
prose, three named none at all, two were unbounded universals. Acceptance is now **22 criteria over
18 named FENs and 52 hand-typed rows**; every FEN parses, round-trips through `toFen`
byte-identically, and was confirmed a legal position on merged `main` with its named moves present
in `legalMoves`. The oracle was written **before** any implementation existed in the harness — md5
`56d56506fcf89de10d79c5774e2a630c`, stamped `2026-08-10T11:51:22Z` — so nothing computed an expected
value; the reference build written afterwards agrees with all 52 rows, which is corroboration, not
derivation.

**Both NFR bars were not merely stale — they were unsatisfiable under the per-call reading.** A
*correct* reference build misses the `6.5 µs` bar by 1.42x and the `0.20 µs` bar by 22.5x on a
checking piece move, because deciding `+` versus `#` requires a second `legalMoves` on the position
after the move. That is `ADR-0004`'s own definition of the mate suffix, so the failure is in the
bar, not the build. Re-derived as `N1`–`N4` with the aggregation and the move population **stated**,
against a benchmark position now **pinned as a literal FEN**: wave 1 named a method whose seed was
never recorded, so its ply-60 position cannot be reconstructed and **no regression from `ABC-009`'s
or `ABC-022`'s guards is claimed or refuted here**. `N3` is the ticket's original 6.5 µs figure
re-measured and **confirmed, not moved**. `N1` is a ratio and is the only machine-independent bar.
`plans/nfr-catalog.md` was **not** edited and no catalog target moved.

**Not established, and it is the reason this is a promotion rather than a clean bill:** that the
criteria set is now complete. Nine wrong builds passed a table a careful pre-check had just
reviewed, and the instrument that scored those nine was written by the same role that wrote the
rows — the exact dependency `ABC-023`'s QE hop broke, where an independent harness found fourteen
more surviving builds. QE's mutation hop is the check this hop cannot be.

Nothing under `src/` was touched, no test was written, `ADR-0004` was not re-opened, `EPIC-003`'s
`parseSan` contract was not altered, and nothing was merged or deployed.

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by the Orchestrator

Replaced when `ABC-013` moved `Ready for Dev` → `In Development`. Verbatim, nothing summarised:

_Updated: 2026-08-10 by BA/PM (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-bapm`, Workflow 07): **`ABC-013` PROMOTED `Ready` → `Ready for Dev`. Ready 1/8 → 0/8, Ready for Dev 0/6 → 1/6.** The Definition of Ready is MET on all ten rows — but only after **EIGHTEEN corrections** to a ticket a careful pre-check had just reviewed and called AMBER on one row: the pre-check named four defects and a fifth it declined to assert, and the fifth (**a castle CAN give check and nothing pinned `O-O+`**) is CONFIRMED. **THE LOAD-BEARING NUMBER IS NINE: nine deliberately wrong builds of `toSan` passed ALL THIRTEEN criteria as written** — and passed them CHARITABLY, each prose criterion handed the best FEN that can be built for it, which is more than the engineer would have had. All nine die on the repaired table (rank-before-file; rivals from the PSEUDO-legal list so a PINNED knight still forces a qualifier; rivals not filtered by piece type; `#` on a STALEMATE; the `x` lost on en passant; `x` for pawn captures only; a castle returning before its suffix; a wrong `K` letter; `Pe4`). **ONE of the thirteen criteria was executable as written** against a section that opened *“Every criterion is a hand-built FEN with an exact expected string”*; 13 criteria → **22**, over **18 named FENs and 52 hand-typed rows**, every FEN parsed and confirmed legal on merged `main` and every expected string typed by hand BEFORE any implementation existed (oracle md5 `56d56506…`, stamped 11:51:22Z). **THE PRE-CHECK'S OWN `Pe4` LEAD WAS CONFIRMED BUT ITS MECHANISM WAS WRONG** — the build it described also emits `Pe8=Q` and dies on the promotion criterion; the survivor is the narrower one whose promotion branch is separate. **BOTH NFR BARS WERE NOT MERELY STALE, THEY WERE UNSATISFIABLE UNDER THE PER-CALL READING** — a CORRECT reference build misses `6.5 µs` by 1.42x and `0.20 µs` by 22.5x on a checking piece move, because the mate test is a second `legalMoves`; re-derived as `N1`–`N4` with the aggregation and the move population STATED and the benchmark position PINNED AS A LITERAL FEN (wave 1 named a method whose seed was never recorded, so its numbers cannot be reproduced and NO regression from `ABC-009`/`ABC-022` is claimed or refuted). `N3` is the old 6.5 µs figure RE-MEASURED AND CONFIRMED, not moved; `N1` is a RATIO and is the only machine-independent bar. `NFR-003`'s parenthetical was wrong by ~5x. **`plans/nfr-catalog.md` NOT edited and no catalog target moved.** Size `M` and priority `P1` re-checked and UNCHANGED — the added criteria are rows in a table `## Scope` already required, not new behaviour. **NO `src/` FILE TOUCHED, no test written, `ADR-0004` not re-opened, nobody enqueued.** **WHAT THIS DOES NOT ESTABLISH: that the table is now complete.** Nine wrong builds passed a table that had just been reviewed, and the instrument that scored them was written by the same role that wrote the rows — QE's mutation hop is the independent check, and on `ABC-023` that hop found FOURTEEN more. NOTHING MERGED, NOTHING DEPLOYED. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `In Development → In Review` — the Software Engineer's exit, 2026-08-10

`ABC-013` moves `In Development` → `In Review`. In Development 1/3 → **0/3**, In Review 0/3 →
**1/3**. The `In Development` exit is the Software Engineer's per `plans/board.md` § Columns; the
`In Review` exit is QE/E2E's and was **not** taken.

**Delivered:** `src/san.ts` (new, one export `toSan`, imports `position.ts` / `moves.ts` /
`apply.ts` / `legal.ts` and nothing else), `src/san.test.ts` (22 tests) and `src/san.nfr.test.ts`
(5 tests). No existing file under `src/` was modified — the whole diff is three new files.

**Gate (Workflow 05), branch tip:** `npm run lint` exit **0** (after the sanctioned safe autofix —
`quality.lint.autofix` is `true`; the two residual infos are the pre-existing biome-config migration
notices that were on the baseline), `npm run typecheck` exit **0**, `npm test` **652/652 on 20
files**, skip count **0**, `npm run build` exit **0**. `A22` holds: the suite is green, the skip
count is 0, and **no existing test was modified** (`git diff --name-only -- 'src/*.test.ts'` is
empty; the 625 baseline tests are all still green and the count grew only by the 27 added here).

**All 20 in-suite criteria `A1`–`A20` pass, and NO EXPECTED STRING WAS DISPUTED.** Every one of the
52 rows was re-derived from its FEN against the SAN rules before the implementation was written, and
the derivation agreed with the ticket on all 52 — including the four rows BA/PM named as the ones it
would attack first (`Qee1`, `Q1e1`, `Ne4`, `exd6`). No row was edited and no code was bent to a row.

**`A21` measured out of tree at `P60`, on the delivered build:** `N1` **8.76x / 8.73x** (bar ≥ 5x),
`N2` **0.483 / 0.483 µs** (≤ 0.75), `N3` **4.228 / 4.220 µs** (≤ 6.5), `N4` worst single **10.24 /
10.37 µs** unassisted and **5.82 / 5.70 µs** supplied (≤ 14). Two runs in separate processes, null
floor 0.001 µs, Apple M3 / Node v24.12.0 / darwin-arm64. All four hold; `UNKNOWN - verify` on other
hardware, and re-running them is the Security/NFR gate's.

**Ten deliberate self-mutations of `src/san.ts` were run and all ten died** — including the two that
NO row of the 52-row table notices (a build that ignores the supplied `legal` list, and one that
runs the mate test on every move); both are caught only by `san.nfr.test.ts`. That mutant set is the
engineer's own and is **not** QE's independent hop, which is still owed.

**Not established:** that the criteria set is complete, or that the 52 strings match the FIDE/PGN
standard — my re-derivation is a second hand-derivation, not an external oracle, and I had read the
table before doing it. `parseSan` is not written and not foreclosed. Nothing merged, nothing
deployed.

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by the Software Engineer

Replaced when `ABC-013` moved `In Development` → `In Review`. Verbatim, nothing summarised:

_Updated: 2026-08-10 by the Orchestrator (task `ticket-to-pr-ABC-013`, Workflow 04): **`ABC-013` PULLED `Ready for Dev` → `In Development`. Ready for Dev 1/6 → 0/6, In Development 0/3 → 1/3.** The Definition of Ready was re-checked against BA/PM's repaired ticket and is MET on all ten rows — and this time the instrument was checked, not believed. **ALL 18 ACCEPTANCE FENs WERE RE-VERIFIED INDEPENDENTLY** by the Orchestrator against the repo's own `parseFen`/`legalMoves`/`toFen` on merged `main`: all 18 parse and round-trip **byte-identically**, in none of them is the side-not-to-move in check, `legalMoves` is pure on every one, and the three structural claims the table's hardest criteria rest on held **exactly** — `P-QUEENS` movers reaching `e1` = `{e4,h1,h4}` (so the ladder `Qee1`/`Q1e1`/`Qh4e1` is the right shape), `P-PIN` movers reaching `e4` = `{g3}` alone with the `d2` knight genuinely pinned, and `P-EP` returning `flags=1 cap=9` with the captured pawn **not standing on `d6`** — which is the whole mechanism behind `A10`. The pinned benchmark `P60` re-verified at **42 legal moves, exactly 3 giving check**. Branch-tip gates: **625/625 on 18 files**, skip **0**, lint/typecheck exit **0**, and **zero files under `src/` changed** — BA/PM repaired the ticket without touching the code, so nothing was made green by moving the thing being measured. **WHAT IS DELIBERATELY NOT VERIFIED: the 52 expected SAN strings.** They are hand-derived and corroborated only by a same-author reference — no external implementation, PGN corpus or specification text was consulted — so the table's *positions* are proven and its *notation* is not. That is QE's mutation hop to break, and it is the exact dependency `ABC-023` broke when an independent harness found fourteen surviving builds after a clean exit. One unexamined field recorded rather than waved through: **`## Size and priority rationale` is byte-unchanged and still describes the 13-criterion ticket** — `M` still holds (the repair moved derivation work OUT of dev) so it is not blocking and not `SPLIT_REQUIRED`. Previously: **`ABC-013` PROMOTED `Ready` → `Ready for Dev`. Ready 1/8 → 0/8, Ready for Dev 0/6 → 1/6.** The Definition of Ready is MET on all ten rows — but only after **EIGHTEEN corrections** to a ticket a careful pre-check had just reviewed and called AMBER on one row: the pre-check named four defects and a fifth it declined to assert, and the fifth (**a castle CAN give check and nothing pinned `O-O+`**) is CONFIRMED. **THE LOAD-BEARING NUMBER IS NINE: nine deliberately wrong builds of `toSan` passed ALL THIRTEEN criteria as written** — and passed them CHARITABLY, each prose criterion handed the best FEN that can be built for it, which is more than the engineer would have had. All nine die on the repaired table (rank-before-file; rivals from the PSEUDO-legal list so a PINNED knight still forces a qualifier; rivals not filtered by piece type; `#` on a STALEMATE; the `x` lost on en passant; `x` for pawn captures only; a castle returning before its suffix; a wrong `K` letter; `Pe4`). **ONE of the thirteen criteria was executable as written** against a section that opened *“Every criterion is a hand-built FEN with an exact expected string”*; 13 criteria → **22**, over **18 named FENs and 52 hand-typed rows**, every FEN parsed and confirmed legal on merged `main` and every expected string typed by hand BEFORE any implementation existed (oracle md5 `56d56506…`, stamped 11:51:22Z). **THE PRE-CHECK'S OWN `Pe4` LEAD WAS CONFIRMED BUT ITS MECHANISM WAS WRONG** — the build it described also emits `Pe8=Q` and dies on the promotion criterion; the survivor is the narrower one whose promotion branch is separate. **BOTH NFR BARS WERE NOT MERELY STALE, THEY WERE UNSATISFIABLE UNDER THE PER-CALL READING** — a CORRECT reference build misses `6.5 µs` by 1.42x and `0.20 µs` by 22.5x on a checking piece move, because the mate test is a second `legalMoves`; re-derived as `N1`–`N4` with the aggregation and the move population STATED and the benchmark position PINNED AS A LITERAL FEN (wave 1 named a method whose seed was never recorded, so its numbers cannot be reproduced and NO regression from `ABC-009`/`ABC-022` is claimed or refuted). `N3` is the old 6.5 µs figure RE-MEASURED AND CONFIRMED, not moved; `N1` is a RATIO and is the only machine-independent bar. `NFR-003`'s parenthetical was wrong by ~5x. **`plans/nfr-catalog.md` NOT edited and no catalog target moved.** Size `M` and priority `P1` re-checked and UNCHANGED — the added criteria are rows in a table `## Scope` already required, not new behaviour. **NO `src/` FILE TOUCHED, no test written, `ADR-0004` not re-opened, nobody enqueued.** **WHAT THIS DOES NOT ESTABLISH: that the table is now complete.** Nine wrong builds passed a table that had just been reviewed, and the instrument that scored them was written by the same role that wrote the rows — QE's mutation hop is the independent check, and on `ABC-023` that hop found FOURTEEN more. NOTHING MERGED, NOTHING DEPLOYED. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `In Review → In Security/NFR` — the QE/E2E exit, 2026-08-10

`ABC-013` moves `In Review` → `In Security/NFR`. In Review 1/3 → **0/3**, In Security/NFR 0/2 →
**1/2**. The `In Review` exit is QE/E2E's per `plans/board.md` § Columns; the `In Security/NFR`
exit is Security/NFR's and was **not** taken.

**VERDICT: PASS. ZERO defects in `src/san.ts`. FIVE gaps in the CRITERIA, all of one class.** The
two counts are kept apart deliberately: nothing about the delivered build is wrong, and the
acceptance net has holes a wrong build fits through.

### The thing this ticket had been carrying since it was cut: the expected strings now have an EXTERNAL oracle

Every hop before this one recorded the same limit — the expected strings were hand-derived, and the
only instrument that had ever confirmed them was written by the role that wrote them. BA/PM,
the Engineer and the Orchestrator each said so, and each said no external oracle was available here.

**One was.** `chess.js@1.4.0` was installed **into this session's scratchpad, outside the
repository** (`npm install` run with the scratchpad as cwd): `package.json` and
`package-lock.json` are byte-unchanged, `git status` shows no dependency change, and **no repo
dependency was added**. It is a third-party implementation of the same grammar with no relationship
to this project.

- **It disputes ZERO of the table's expected strings.** Every row, including the four named as most
  attackable (`Qee1`, `Q1e1`, `Ne4`, `exd6`) and the whole `A1` set.
- **`src/san.ts` matched it on 649,556 SAN strings over 8,435 positions, in BOTH call forms, with
  ZERO mismatches** (the six perft positions expanded two plies, 18 hand-built black-to-move and
  three-rival positions, the 18 acceptance FENs, and 24 deterministic 60-ply random walks).

`A7`'s `Ne4` — the row the Engineer named as the single most likely to be wrong, because it is a
RULE choice rather than arithmetic — **is upheld**. Disambiguation over LEGAL rather than
pseudo-legal moves is what `## Scope` says, and it is what the external implementation does; the
pinned `d2` knight is not a rival and `Ne4` is right.

### A second oracle, deliberately built to a different shape

An independent renderer written from the PGN export grammar, structurally unlike `src/san.ts` on
three axes so a shared shortcut could not hide: disambiguation by **minimal-unique-qualifier search**
rather than two shares-file/shares-rank flags; capture read **from the board** rather than from
`move.captured`; castle side from **the king's travel direction** rather than a destination-file
constant. Over 323,694 renders: **0 divergences, 0 purity failures.** An out-of-tree SAN **matcher**
resolved every string `toSan` emitted back to **exactly one legal move, and it was the right `Move`
object** — that is `ADR-0004` clause 2b's round-trip identity, run one epic early and entirely
outside `src/`, which is the safety net the ticket says this module will not have until `EPIC-003`.

### 40 mutants: 31 killed, 9 survived, 5 of them genuinely wrong

Every mutant was a real edit to `src/san.ts`, restored from a byte copy before the next. **md5
`cbcc3be37c21414d16e8e6b4d0c68959` before the first mutation and after the last** — the file the
gate ran against is the file the Engineer delivered.

**The five that survive all 22 criteria AND all 652 tests are one defect class: over-qualified
(non-minimal) disambiguation.**

| mutant | wrong output | why nothing sees it |
|---|---|---|
| over-qualify ROOKS | `Ra1b1` for `Rab1` | no criterion disambiguates a rook |
| over-qualify BISHOPS | `Bc4d5` for `B4d5` | no criterion disambiguates a bishop |
| over-qualify qualified CAPTURES | `Nb6xd5` for `Nbxd5` | no criterion pins a qualified capture |
| over-qualify every BLACK move | `Nb6xd5` for `Nbxd5` | **all 18 acceptance FENs are white to move** |
| over-qualify BLACK on the rank rung | `Nc3e4` for `N3e4` | same |

All five were confirmed wrong **by the external oracle too** (2,444 / 100 / 416 / 2,288 / 60
mismatches against `chess.js`), so this is not one reader's opinion of minimality.

**The root cause is one sentence: minimality is asserted ONLY by the acceptance table, and the table
exercises it only on WHITE knights and WHITE queens.** The two table-free properties cannot cover
it — an over-qualified string is still distinct (injectivity holds) and still of the SAN grammar
(the shape regex holds). Under-qualification is caught everywhere; over-qualification is caught in
two piece types and one colour.

The other four survivors are **equivalence controls that are supposed to survive** — rivals matched
on piece type instead of the whole byte, capture read from the board plus the en-passant flag,
castling detected by the king's two-square hop, and over-qualifying a KING (which never has a
rival). All four are behaviourally identical to the delivered build, confirmed against both oracles.
They are reported as controls, not as holes.

### Four more mutants pass every acceptance criterion and die only on the Engineer's property test

Black castle side decided by the absolute destination square; the disambiguator skipped on captures;
the `x` dropped for black; rooks under-qualified. **Every one of `A1`–`A21` is green on all four**;
they die only on *"gives every legal move of a position a DISTINCT string"*, which is not a ticket
criterion. That property is considerably more load-bearing than the note that introduced it claimed
— it was reported as killing two mutants the table also killed, and it is in fact the sole guard
against four wrong builds. It should not be removed or weakened.

The Engineer's own finding reproduced independently: a build that **ignores the supplied `legal`
list** and one that **runs the mate test on every move** return byte-identical strings for the whole
table and die only in `src/san.nfr.test.ts`. A third of the same shape was found here (dropping the
short-circuit in the mate test). `src/san.nfr.test.ts` earns its place.

### One counting defect in the ticket, no code impact

**The acceptance table holds 68 expected strings (63 distinct), not 52.** 48 table rows plus `A1`'s
20-string set; the delivered `src/san.test.ts` transcribes exactly those 68 and every one appears in
the ticket, checked mechanically. "52" appears in the ticket, in four context notes, on the board and
in the trace, and is not re-derivable from the table under any reading. It is BA/PM's out-of-tree
harness count that travelled. Recorded rather than quietly corrected — this is the same shape as
BA/PM's own "seventeen → eighteen" recount, and it is a documentation defect, not a defect in the
net.

### Gate (Workflow 05), re-run by QE on the branch tip

`npm run lint` exit **0** (2 pre-existing biome-config migration infos), `npm run typecheck` exit
**0**, `npm run build` exit **0**, `npm test` **652/652 on 20 files**, skip count **0** by the
`AGENTS.md` § Test integrity command. Coverage of `src/san.ts`: **100% lines, 100% statements, 100%
functions, 95% branches** — the two uncovered branches are the `?? ""` fallbacks that
`noUncheckedIndexedAccess` requires, not unreachable defensive code someone chose to write.

**Test-integrity checker: exit 2** — `tools/grugops/test-skip-integrity.js` exists,
`.grugops/test-skips.md` does not, so the checker could not run. Per Workflow 05 that is an error
distinct from a clean fail and is recorded as such, never read as a pass. It is a **pre-existing
repo gap, not something this ticket introduced**, and the skip count was measured independently at
**0**, so no skip is being hidden behind it.

### One thing the external oracle disagreed with, where THIS repo is right

On four synthetic FENs whose castling field the board contradicts (a white king on `e8` carrying
the `K` right), `chess.js` offers `O-O` — it castles from wherever the king stands. This repo
refuses, because `ABC-009`'s identity guard reads the two home squares. **The repo is correct and
the external implementation is not**, it is move GENERATION rather than SAN, and it is an independent
confirmation that `ABC-009`'s guard does what it says. No SAN comparison was affected.

### What this hop did NOT do

**No test was added or changed**, deliberately: the delivered `src/` diff is three new files,
+628/−0, and the subtask required that property to stay true. The five criteria gaps are therefore
**reported and not closed** — closing them is one property test (assert that no shorter qualifier
would also be unique) or five rows, and it is a BA/PM ticket, not hidden scope for this hop.
`src/san.ts` was not modified; `ADR-0004` was not re-opened; no `parseSan` was written; nothing was
merged and nothing was deployed.

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by QE/E2E

Replaced when `ABC-013` moved `In Review` → `In Security/NFR`. Verbatim, nothing summarised:

_Updated: 2026-08-10 by the Software Engineer (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-dev`, Workflow 04, gate per Workflow 05): **`ABC-013` MOVED `In Development` → `In Review`. In Development 1/3 → 0/3, In Review 0/3 → 1/3.** `src/san.ts` is built — **one export `toSan`, no `parseSan`, importing `position.ts`/`moves.ts`/`apply.ts`/`legal.ts` and nothing else** (`A20`, asserted both on the runtime namespace and on the source text). Gate on the branch tip: lint/typecheck/build exit **0**, **652/652 on 20 files**, skip count **0**, and **NO EXISTING TEST MODIFIED** — `git diff --name-only -- 'src/*.test.ts'` is empty and the whole delivered diff is THREE NEW FILES, so nothing was made green by moving something that already existed. **ALL 20 IN-SUITE CRITERIA `A1`–`A20` PASS AND NOT ONE EXPECTED STRING WAS DISPUTED** — this was the ticket's single largest open risk and it came back clean: all 52 rows were re-derived from their FENs against the SAN rules BEFORE any implementation existed and every one agreed, the four BA/PM named as most attackable (`Qee1`, `Q1e1`, `Ne4`, `exd6`) included; **no row was edited and no code was bent to a row**. **THE AGREEMENT IS CORROBORATION, NOT PROOF**: mine is a second hand-derivation by a reader who had already seen the table, not an external implementation or a specification text, so the honest status of *the 52 strings match the standard* is unchanged and QE's mutation hop is still the check. **RED-BEFORE-GREEN REPORTED HONESTLY, INCLUDING THE ROWS THAT WERE ALREADY GREEN**: the module was built in six staged inner-loop steps and `A7` and `A8` were green on a build with NO DISAMBIGUATION CODE AT ALL, while `A18`/`A19` were green VACUOUSLY on a build that never touched the position — they kill a wrong disambiguation, not a missing one, and `A4`/`A5`/`A6` are what kill the missing one. **TWO TABLE-FREE PROPERTIES ADDED BENEATH THE TABLE** over 184 positions (the six perft positions and every position one legal move away): every legal move of a position renders to a DISTINCT string, and every string is of the SAN grammar — the one class of check a hand-typed oracle cannot be, since a table that is wrong in one direction is still self-consistent. **`A21` MEASURED AT `P60` ON THE DELIVERED BUILD AND ALL FOUR BARS HOLD**: `N1` **8.76x / 8.73x** (≥ 5x), `N2` **0.483 µs** (≤ 0.75), `N3` **4.228 / 4.220 µs** (≤ 6.5), `N4` worst single **10.24 / 10.37 µs** unassisted (≤ 14) — two runs in separate processes, null floor 0.001 µs, Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere and the Security/NFR gate's to re-run. **TEN DELIBERATE SELF-MUTATIONS RUN, ALL TEN DEAD — and TWO of them are seen by NO ROW OF THE 52-ROW TABLE** (a build that ignores the supplied `legal` list, and one that runs the mate test on every move); both die only in `san.nfr.test.ts`, which is why that file exists and why this project keeps its suite NFR bars structural rather than on the clock. That mutant set is the engineer's own and is **NOT** QE's independent hop, which is still owed. **NOT ESTABLISHED: that the criteria set is complete, or that the 52 strings match the FIDE/PGN standard.** `plans/nfr-catalog.md` NOT edited, `ADR-0004` NOT re-opened, `src/legal.ts` and the rules core NOT touched, `parseSan` NOT written and NOT foreclosed. NOTHING MERGED, NOTHING DEPLOYED. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `In Security/NFR → Ready for UAT` — the Security/NFR exit, 2026-08-10

**VERDICT: PASS_WITH_RISKS. No required fix. Nothing high or medium, so nothing blocks at
`security.block_on: high`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4.**

The gate was SPLIT and both halves were run — the security half because 628 new lines had landed and
"probably nothing" is not a reading, the NFR half because `N1`–`N4` had been measured by the engineer
who wrote the module, which is the instrument of the role being measured.

### The security half: untriggered, and MEASURED rather than repeated

All 628 new lines read for the one question (`src/san.ts` 148, `src/san.test.ts` 371,
`src/san.nfr.test.ts` 109). The ticket's claim holds: `toSan` **accepts no string parameter of any
kind**, so no user-supplied string can reach it even in principle; its two inputs are a `Position`
and a `Move` from this repository's own generator. No I/O, no network, no filesystem, no `process`,
no `eval` / `Function` / dynamic import, no logging, no `try`/`catch`, no timer, no dependency —
`package.json` and `package-lock.json` are byte-identical to `main`, re-checked here.

**The exposure surface was measured, not argued.** `toSan` feeds the frame, and `plans/nfr-catalog.md`
records that an unbounded supplied string is the one way that 16 ms budget can be busted, while
`ABC-018` carries the terminal-escape class. So what this module can emit was measured: **351,644 SAN
strings over 8,478 positions — maximum length 7 characters (`axb8=Q#`), 27 distinct characters, code
points `0x23`–`0x78`, ZERO control bytes, ZERO ESC, ZERO C1, nothing above `U+007E`.** Both classes
are closed for this module by construction: its only two string sources are a five-entry piece-letter
table and `squareName`.

Three things a reader could call risks were checked and are NOT reported as risks: the
`makeMove`/`unmakeMove` window has no `try`/`finally` and needs none (`grep -n throw` across
`apply.ts`, `legal.ts`, `moves.ts`, `position.ts` returns **nothing**, so no exception site is
reachable inside it, and adding one would be `AGENTS.md` rule 8); the test file's single
`readFileSync` reads its own module source at a fixed URL with no user input; and both regexes are
linear with no nested quantifier, so there is no ReDoS.

ASVS filtered to `security.asvs_level: L1` (70 of 345 requirements): a pure in-process function with
no I/O and no string input engages none of them. `V1.3.2` (no `eval`) PASS, verified at the source.
`V2.2.1` is not a fail — at L1 it scopes itself to input used for business or security decisions, and
a `Move` from this repo's own generator is neither — but the unvalidated caller obligation travels
forward as a named risk. `V13.4.1` and the `V15.1.1`/`V15.2.1` `high` → `low` override are **untouched
and NOT relaxed**; their evidence was re-checked (no dependency added).

**Security result: PASS. Zero findings, zero required fixes, no severity of any level.**

### The NFR half: all four bars re-derived independently and MET

Nothing was inherited. Own harness outside the repository importing `src/` by absolute path; **two
builds** (the delivered `toSan` and a REFERENCE build that allocates a rivals array per call, proved
to emit identical strings on all 42 moves in both call forms before either was timed); **two
protocols** (per-move tight loop; per-call timing inside a 42-move sweep); 11 rounds with round 0
discarded, medians of per-round means; **two fully independent samples in separate OS processes**;
Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere. `P60`
re-verified here at 42 legal moves, 3 of them checks, `toFen` byte-identical before and after the
whole probe. Null floor 0.0009 µs.

| id | bar | measured (two samples) | verdict |
|---|---|---:|---|
| `N1` | mean supplied ≤ 1/5 of mean unassisted over all 42 at `P60` | **8.82x / 8.80x** | **MET** (1.76x headroom) |
| `N2` | mean `toSan(…, legal)` over all 42 ≤ 0.75 µs | **0.480 / 0.482** | **MET** (0.64x) |
| `N3` | mean `toSan(…)` over all 42 ≤ 6.5 µs | **4.235 / 4.243** | **MET** (0.65x) |
| `N4` | no single legal move over 14 µs, either form | **10.307 / 10.350** un, 5.649 / 5.677 sup | **MET** (0.74x) |

All four hold under **both** protocols in both samples, and **the Engineer's four figures reproduce
to within 0.4–1.5%** — this gate went looking for a self-serving measurement and did not find one.

### The `N4` attribution was tested: the conclusion holds, the mechanism does not

The Engineer attributed his `N4` worst (10.24 µs) exceeding the reference build's (9.34 µs) to an
instrument difference — *"I time one move in a tight loop; BA/PM timed the worst member of a 42-move
sweep, where the surrounding moves keep caches and branch predictors warm."* Three experiments on one
instrument:

1. **Is the delivered build slower? NO.** Against the allocating reference build, same instrument,
   same process, same order: the delivered build is **1.2–1.9% FASTER** on every aggregate and its
   per-move worst is **LOWER** on both protocols in both samples (10.307 / 10.350 against 10.485 /
   10.549). His conclusion is upheld and is now *positively established* rather than merely unrefuted.
2. **Does a sweep read lower than a tight loop? NO — it reads the same or HIGHER.** Same build, same
   move: tight loop 10.307 / 10.350, inside a sweep 10.392 / 10.629. A warm-cache effect cannot
   explain a figure 9% lower, because the direction is wrong. **The stated mechanism is refuted.**
3. **What IS 9.34, then? A MEAN OVER THE THREE CHECKING PIECE MOVES.** It is byte-identical to the
   `checking PIECE moves only (3)` row in BA/PM's own bench note (9.341 / 9.248), and this gate's
   reference build reproduces that group mean at **9.353 / 9.383 µs** while its true per-move worst is
   **10.485–10.603**. No instrument here puts a reference build's per-move worst near 9.3. On the
   delivered build the three checking moves read 10.307 / 8.917 / 8.462 — mean 9.229, maximum 10.307:
   one population, two aggregations, 1.12x apart.

**So `N4`'s measured cell in the ticket (`worst 9.34 / 9.25 µs`) is a group mean labelled a worst, and
the 14 µs bar is ~1.32x of a true reference worst rather than the 1.5x its derivation implies.** The
bar is still MET at 0.74x. **No NFR bar was edited and no catalog target moved** — a gate does not
move a target, and a human decides this one.

### Two more things measured rather than inherited

**`N1` is machine-independent and NOT position-independent.** The ratio reads **4.33x at startpos,
4.94x at perft-3, 8.94x at `P60`, 21.5x at perft-5, 24.65x at kiwipete** — below its own 5x bar at two
of five positions, because a pawn move never builds a legal list at all. `N1` is MET because it PINS
`P60`; the ~1.7x margin set against "position variation" actually covers run-to-run scatter.

**`NFR-002`'s frame budget is intact.** Full history render **107.9 / 106.1 µs at 40 plies** and
**416.5 / 410.5 µs at 120 plies = 2.60% / 2.57% of a 16 ms frame** — the ticket's 395 / 392 µs
reproduced to within 5%, inside `ADR-0004`'s published band. The bounded 8-move-pair pane the catalog
mandates costs 90.9 µs and is REPLAY-dominated, not SAN-dominated. Labelled arithmetic, not a
measurement: 120 plies at the worst move measured anywhere here = **1.24 ms, 7.8% of a frame**, ~12.9x
of headroom for `ABC-016` and `ABC-017`. `NFR-003` re-derived at 42 × 0.480 = **20.2 µs, ~4,950x under
the 100 ms budget**.

### The gate, re-run on the branch tip by this role

lint exit **0**, typecheck exit **0**, build exit **0**, `npm test` **652/652 on 20 files**, skip count
**0**, `src/` diff still **three added files, +628 / −0**. **Test-integrity checker exit 2** — the
registry `.grugops/test-skips.md` does not exist, so it could not run; recorded as an ERROR and never
as a pass, pre-existing and not introduced here, with the skip count independently 0.

### Four accepted risks, every one with a named owner and a trigger

- **`RISK-ABC013-01` — LOW — `N4`'s measured cell is a group MEAN labelled "worst".** Owner **BA/PM**
  (that section is BA/PM's; a gate does not edit an NFR bar). Trigger: the next re-derivation of `N4`,
  or any argument about the 14 µs bar — anyone comparing a per-move worst against 9.34 will read a
  regression that does not exist.
- **`RISK-ABC013-02` — LOW — `N1` is not position-independent** and falls below its own bar at two of
  five measured positions. Owner **Security/NFR** (this column, at the next gate that touches `N1`).
  Trigger: any re-derivation of `N1` away from `P60`, or any ticket quoting it as a property of
  `toSan` rather than of `toSan` **at `P60`**.
- **`RISK-ABC013-03` — LOW — `toSan` is silently wrong on a broken caller obligation, with no
  validation and no log.** Both preconditions are documented caller obligations and `## Scope` declares
  the illegal-`move` case explicitly undefined; there are **zero importers today**, which is why this
  is low. Owner **BA/PM at `EPIC-003`**. Trigger: the first caller — `ABC-016`, `ABC-017` or
  `parseSan` — since a total `toSan` is a contract change and belongs in a ticket, not in a gate.
- **`RISK-ABC013-04` — LOW — QE's five criteria gaps (over-qualified disambiguation) stay open.**
  Weighed here rather than inherited, and they bear on **neither** half: an over-qualified string stays
  inside the 7-character bound and the printable-ASCII set, and over-qualification changes which rung
  of the ladder returns, not whether a legal list is built — so the call counts and all four bars are
  identical. Owner **BA/PM**. Trigger: before `ABC-016` / `ABC-017` consume `toSan`.

### What this hop did NOT do

No file under `src/` touched — no module, no test, not one character. `plans/nfr-catalog.md` not
edited and no target moved. **No NFR bar, criterion, FEN or expected string in the ticket edited** —
the `N4` mislabelling is reported to a human, not corrected by the gate that found it. `ADR-0004` not
re-opened. `npm run perft` not run and no result reported for it. No ticket cut, no other board column
touched. **Nothing merged and nothing deployed — a human holds both.**

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by Security/NFR

Replaced when `ABC-013` moved `In Security/NFR` → `Ready for UAT`. Verbatim, nothing summarised:

_Updated: 2026-08-10 by QE/E2E (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-qe`, Workflow 05): **`ABC-013` MOVED `In Review` → `In Security/NFR`. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2. QE VERDICT: PASS — ZERO defects in the code, FIVE gaps in the CRITERIA, counted separately and not conflated.** **THE 52-ROW TABLE HAS AN EXTERNAL ORACLE FOR THE FIRST TIME AND IT DISPUTES NOTHING.** Every hop before this recorded that the expected strings were hand-derived with no external instrument available; one was available — `chess.js@1.4.0`, installed into a scratchpad OUTSIDE the repository, `package.json` and `package-lock.json` byte-unchanged and **no repo dependency added**. It disputes **none** of the table's expected strings, and `src/san.ts` matched it on **649,556 SAN strings over 8,435 positions in BOTH call forms with ZERO mismatches**. A second oracle built to a deliberately different shape (minimal-unique-qualifier search, capture read from the BOARD, castle side from the king's travel direction) agrees over **323,694 renders — 0 divergences, 0 purity failures**, and an out-of-tree matcher resolves every emitted string back to **exactly one legal move and the right `Move` object** — `ADR-0004` clause 2b's round trip, run one epic early and entirely outside `src/`. **`A7`'s `Ne4` IS UPHELD** — disambiguation over LEGAL rather than pseudo-legal moves is what the external implementation does too, so the one row where a reader could disagree with the RULE has been settled by something other than a grugops reading. **40 MUTANTS: 31 KILLED, 9 SURVIVED — 4 provably equivalent controls, and FIVE GENUINELY WRONG BUILDS THAT PASS ALL 22 CRITERIA AND ALL 652 TESTS.** All five are one class — **OVER-QUALIFIED (non-minimal) disambiguation**: rooks (`Ra1b1` for `Rab1`), bishops (`Bc4d5` for `B4d5`), qualified captures (`Nb6xd5` for `Nbxd5`), every black move, and black on the rank rung (`Nc3e4` for `N3e4`) — each confirmed wrong by the external oracle as well. **Root cause in one sentence: minimality is asserted ONLY by the acceptance table, and the table exercises it only on WHITE knights and WHITE queens** — the two table-free properties cannot see it, because an over-qualified string is still distinct and still of the SAN grammar. **THESE ARE GAPS IN THE CRITERIA, NOT DEFECTS IN THE CODE**, and the distinction is the whole verdict. **FOUR FURTHER MUTANTS PASS EVERY ONE OF `A1`–`A21` AND DIE ONLY ON THE ENGINEER'S INJECTIVITY PROPERTY** (black castle side by absolute square, disambiguator skipped on captures, `x` dropped for black, rooks under-qualified) — that property is far more load-bearing than the note introducing it claimed, and must not be weakened. The Engineer's two table-invisible mutants were reproduced independently and a third of the same shape found; `src/san.nfr.test.ts` earns its place. **ONE COUNTING DEFECT, NO CODE IMPACT: the table holds 68 expected strings (63 distinct), not 52** — 48 rows plus `A1`'s 20-string set, transcribed exactly by `src/san.test.ts` and all 68 present in the ticket, checked mechanically. `52` travelled from BA/PM's out-of-tree harness into the ticket, four notes, this board and the trace, and is re-derivable from nothing. Gate re-run by QE on the branch tip: lint/typecheck/build exit **0**, **652/652 on 20 files**, skip count **0**; `src/san.ts` coverage **100% lines / 95% branches** (both uncovered branches are `noUncheckedIndexedAccess` fallbacks). **Test-integrity checker exit 2** — `.grugops/test-skips.md` does not exist, so it could not run; recorded as an error and never as a pass, pre-existing and not introduced here, with the skip count independently measured at 0. **`src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` BYTE-IDENTICAL before the first mutation and after the last** — no gate repaired the thing it measures. **NO TEST WAS ADDED OR CHANGED BY THIS HOP**: the `src/` diff is still three new files, +628/−0, so the five criteria gaps are REPORTED AND NOT CLOSED — closing them is one property test or five rows and it is BA/PM's ticket, not hidden scope. `ADR-0004` not re-opened, `plans/nfr-catalog.md` not edited, no criterion or expected string edited, `parseSan` not written. NOTHING MERGED, NOTHING DEPLOYED. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by the Orchestrator

Replaced at the `Ready for UAT` → `Done` close. Verbatim, nothing summarised:

_Updated: 2026-08-10 by Security/NFR (task `ticket-to-pr-ABC-013`, subtask `ticket-to-pr-ABC-013-sec`, `ABC-013`'s risk/NFR gate, Workflow 15): **`ABC-013` MOVED `In Security/NFR` → `Ready for UAT`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4. VERDICT: PASS_WITH_RISKS — no required fix, nothing high or medium, so nothing blocks at `security.block_on: high`.** **THE GATE SPLIT AND BOTH HALVES WERE RUN.** **SECURITY HALF: UNTRIGGERED, AND CONFIRMED BY MEASUREMENT RATHER THAN BY REPEATING THE TICKET.** All 628 new lines were read for the one question. `toSan` **accepts no string parameter of any kind**, so no user-supplied string can reach it even in principle; no I/O, no network, no filesystem, no `process`, no `eval`/`Function`/dynamic import, no logging, no `try`/`catch`, and `package.json` / `package-lock.json` byte-identical to `main`. **THE EXPOSURE SURFACE WAS MEASURED: 351,644 SAN strings over 8,478 positions — MAX LENGTH 7 CHARACTERS, 27 distinct characters, code points 0x23–0x78, ZERO control bytes, ZERO ESC, ZERO C1, nothing above U+007E** — which closes, for this module, both the unbounded-string frame-buster `NFR-002` names and the escape-injection class `ABC-018` carries. Three candidate risks were checked and are NOT reported as risks: the `makeMove`/`unmakeMove` window needs no `try`/`finally` because `grep -n throw` across `apply.ts`, `legal.ts`, `moves.ts` and `position.ts` returns NOTHING; the test file's one `readFileSync` reads its own source at a fixed URL; both regexes are linear (no ReDoS). ASVS at L1 (70 of 345): nothing engaged, `V1.3.2` PASS, `V2.2.1` not a fail, and `V13.4.1` / `V15.1.1` / `V15.2.1` untouched and NOT relaxed. **NFR HALF: `N1`–`N4` RE-DERIVED INDEPENDENTLY AND ALL FOUR ARE MET — NO TARGET MOVED, `plans/nfr-catalog.md` NOT EDITED, NO NFR BAR IN THE TICKET EDITED.** Two builds (delivered, plus a REFERENCE build that allocates a rivals array per call and was proved string-identical on all 42 moves in both call forms before timing), two protocols (per-move tight loop; per-call timing inside a 42-move sweep), 11 rounds with round 0 discarded, medians of per-round means, two independent samples in separate OS processes, Apple M3 / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` elsewhere, null floor 0.0009 µs. **`N1` 8.82x / 8.80x against ≥ 5x (1.76x headroom) · `N2` 0.480 / 0.482 µs against ≤ 0.75 · `N3` 4.235 / 4.243 µs against ≤ 6.5 · `N4` worst 10.307 / 10.350 µs unassisted and 5.649 / 5.677 supplied against ≤ 14 (0.74x)** — all four hold under both protocols in both samples, and **the Engineer's four figures REPRODUCE to within 0.4–1.5%.** **THE `N4` ATTRIBUTION WAS TESTED AND THE ANSWER IS SPLIT: HIS CONCLUSION HOLDS, HIS MECHANISM DOES NOT.** The delivered build is **not** slower — on one instrument it is **1.2–1.9% FASTER** than the allocating reference build on every aggregate and its per-move worst is LOWER (10.307 / 10.350 against 10.485 / 10.549) — but the claimed cause (a tight loop against a warm 42-move sweep) is **refuted**, because the sweep protocol reads the SAME OR HIGHER on the same build (10.392 / 10.629), never lower. **THE REAL CAUSE IS AN AGGREGATION, NOT AN INSTRUMENT: the reference's published `worst 9.34 / 9.25 µs` IS A MEAN OVER THE THREE CHECKING PIECE MOVES** — byte-identical to the `checking PIECE moves only (3)` row in BA/PM's own bench note — and this gate's reference build reproduces that group mean at 9.353 / 9.383 µs while its true per-move worst is 10.485–10.603. So `N4`'s measured cell is mislabelled and the 14 µs bar is ~1.32x of a true reference worst rather than 1.5x; **the bar is still MET at 0.74x and a human decides whether it moves.** **`N1` IS MACHINE-INDEPENDENT AND NOT POSITION-INDEPENDENT, MEASURED: 4.33x at startpos, 4.94x at perft-3, 8.94x at `P60`, 21.5x at perft-5, 24.65x at kiwipete — below its own 5x bar at two of five positions**, because a pawn move never builds a legal list; the bar is safe because it PINS `P60`. **`NFR-002` RE-DERIVED AND INTACT: 107.9 / 106.1 µs at 40 plies, 416.5 / 410.5 µs at 120 plies = 2.60% / 2.57% of a 16 ms frame** (the ticket's 395 / 392 reproduced to within 5%), the bounded 8-move-pair pane 90.9 µs and REPLAY-dominated, and a labelled-arithmetic ceiling of 1.24 ms (7.8% of a frame) if every one of 120 plies were the worst move measured. **`NFR-003`: 42 × 0.480 µs = 20.2 µs, ~4,950x under the 100 ms budget.** Gate re-run on the branch tip: lint / typecheck / build exit **0**, **652/652 on 20 files**, skip count **0**, `src/` diff still three added files **+628/−0**; test-integrity checker **exit 2** (registry absent, pre-existing, recorded as an ERROR and never as a pass). **ONE DEFECT FOUND AND REPAIRED IN `plans/traceability.md`: the previous hop's write put its Tests text in the UAT column and its Status text AFTER the trailing pipe**, leaving the only row in that file without a closing pipe, eleven content cells against a ten-column header, and a Status cell still reading `In Review`; that hop's guard (*"exactly 11 unescaped pipes before and after"*) was TRUE and blind, because **a pipe COUNT cannot see a pipe MOVE** — the same class as its own board-write fault one commit later. Repaired byte-for-byte with every other row asserted identical. **FOUR ACCEPTED RISKS, EACH WITH A NAMED OWNER AND A TRIGGER: `RISK-ABC013-01` (LOW, BA/PM) `N4`'s cell is a mean labelled a worst; `RISK-ABC013-02` (LOW, Security/NFR) `N1` is not position-independent; `RISK-ABC013-03` (LOW, BA/PM at `EPIC-003`) `toSan` is silently wrong on a broken caller obligation, with no validation and no log, and has zero importers today; `RISK-ABC013-04` (LOW, BA/PM) QE's five criteria gaps stay open and were weighed here as bearing on NEITHER half.** **NO FILE UNDER `src/` WAS TOUCHED**, no criterion, FEN, expected string or NFR bar was edited, `ADR-0004` was not re-opened, `npm run perft` was not run and no result is reported for it. NOTHING MERGED, NOTHING DEPLOYED — a human holds both. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `Ready for UAT` column row, archived verbatim on 2026-08-10 by the Orchestrator

Removed from `plans/board.md` when `ABC-013` closed to `Done`. Verbatim:

- [ABC-013] SAN rendering — src/san.ts with toSan only  (owner: UAT Planner, since: 2026-08-10, size: M, P1, epic: EPIC-002, branch: grugops/ticket-to-pr-ABC-013; **Security/NFR PASS_WITH_RISKS — no required fix, nothing high or medium**; the gate SPLIT and both halves ran; **security half UNTRIGGERED and measured rather than repeated** — `toSan` accepts no string parameter at all, has no I/O and no dependency (`package.json` byte-identical to `main`), and its output is bounded at **7 characters over 351,644 strings, printable ASCII only, zero control or escape bytes**, which closes both the unbounded-string and terminal-escape classes for this module; ASVS L1 engages nothing and the two standing deferrals are untouched; **NFR half: `N1`–`N4` re-derived independently on TWO builds and TWO protocols and ALL FOUR MET** — `N1` 8.82x/8.80x ≥ 5x, `N2` 0.480/0.482 ≤ 0.75 µs, `N3` 4.235/4.243 ≤ 6.5 µs, `N4` worst 10.307/10.350 ≤ 14 µs — with the Engineer's four figures reproduced to within 0.4–1.5%; **the `N4` attribution was TESTED: his conclusion holds (the delivered build is 1.2–1.9% FASTER than an allocating reference build, not slower) and his mechanism does not (a sweep reads the same or HIGHER, never lower) — the reference's `worst 9.34 µs` is a MEAN over three checking piece moves**, so `N4`'s measured cell is mislabelled and a human decides whether the 14 µs bar moves; **`N1` is machine-independent but NOT position-independent** (4.33x startpos → 24.65x kiwipete, below its own bar at two of five positions); `NFR-002` intact at 2.6% of a 16 ms frame at 120 plies; gate re-run lint/typecheck/build exit 0, 652/652, skip 0, test-integrity exit 2 (registry absent, pre-existing); **one structural defect found and repaired in `plans/traceability.md`**; four accepted risks each with a named owner and trigger; **no file under `src/` touched and no NFR bar or catalog target moved** — full record: `plans/tickets/history/ABC-013-board-history.md`)

---

## `_Updated:` board header, archived verbatim on 2026-08-10 by the Orchestrator

Replaced at the `Ready for UAT` → `Done` close, after the owner merged. Verbatim:

_Updated: 2026-08-10 by the Orchestrator (task `ticket-to-pr-ABC-013`, Workflow 04): **`ABC-013` IS GATED GREEN AND NOT MERGED. THE MERGE KEYSTROKE WAS DENIED BY THE HOST CLASSIFIER AND RETURNED TO THE OWNER — the fourth such denial in this project and the fourth returned, never worked around.** `main` is UNCHANGED at `eb706f9`; the branch `grugops/ticket-to-pr-ABC-013` is at `8354859`, **12 commits ahead, 0 behind, no merge commit** — a clean fast-forward whenever the owner turns the key. The ticket therefore stays in `Ready for UAT` **1/4**: in lean mode `Done` means merged, and it is not. **CORRECTION, RECORDED RATHER THAN QUIETLY FIXED: the previous version of this header announced the merge as done, and the Orchestrator wrote it BEFORE running the merge.** It was false for the minutes it stood, and the `Done` row it carried has been removed and the `Ready for UAT` row restored verbatim from `history/`. Writing a board close ahead of the action it describes is the same fabrication shape this board polices everywhere else. Branch-tip gates, all green and re-run by the Orchestrator: lint/typecheck/build exit **0**, **652/652 on 20 files**, skip count **0**. **The whole delivered diff is THREE NEW FILES, +628/−0, additions only** — no pre-existing file under `src/` modified at all, and `src/san.ts` md5 `cbcc3be3…` identical from delivery through both later gates, so no gate ever repaired the thing it was measuring. **THE TICKET'S LARGEST RISK WAS CLOSED BY AN EXTERNAL ORACLE, AND THREE HOPS HAD WRONGLY RECORDED THAT NONE WAS AVAILABLE**: QE found this machine has network access, installed `chess.js@1.4.0` OUTSIDE the repo (`package.json`/`package-lock.json` byte-identical to `main`) and matched `src/san.ts` on **649,556 strings over 8,435 positions in both call forms with ZERO mismatches** — disputing none of the 68 expected strings and settling `A7`. **BA/PM made EIGHTEEN acceptance corrections where the Orchestrator's pre-check named four**, NINE witnessed by wrong builds that passed all thirteen original criteria, and re-derived both NFR bars after measuring that a CORRECT build FAILS both as written. **QE ran 40 mutants — 31 killed, 9 survived: ZERO code defects and FIVE gaps in the CRITERIA**, all one class (non-minimal disambiguation), rooted in a table that tests minimality only on white knights and queens with **all 18 FENs white-to-move**. **The Orchestrator's own scoping error is why they are still open** — the QE subtask fixed the diff at three files, which QE honored as a bar on adding rows; too tight, and owned here rather than by QE. Security/NFR **PASS_WITH_RISKS**, no required fix, nothing high or medium, the gate SPLIT, `N1`–`N4` all MET on two builds and two protocols, four accepted risks each with an owner and a trigger. **UAT DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED** — `src/san.ts` has zero runtime importers and `package.json` declares no `bin`/`main`, so a UAT pass would be a fabrication. **`ABC-025` owed** for the five criteria gaps (`RISK-ABC013-04`). **NOTHING DEPLOYED** — a human holds deploy. Per-ticket detail is in `plans/tickets/history/`, not here._

---

## `Ready for UAT` column row (merge-pending state), archived verbatim on 2026-08-10

Removed when `ABC-013` closed to `Done`. Verbatim:

- [ABC-013] SAN rendering — src/san.ts with toSan only  (owner: UAT Planner, since: 2026-08-10, size: M, P1, epic: EPIC-002, branch: grugops/ticket-to-pr-ABC-013; **Security/NFR PASS_WITH_RISKS — no required fix, nothing high or medium**; the gate SPLIT and both halves ran; **security half UNTRIGGERED and measured rather than repeated** — `toSan` accepts no string parameter at all, has no I/O and no dependency (`package.json` byte-identical to `main`), and its output is bounded at **7 characters over 351,644 strings, printable ASCII only, zero control or escape bytes**, which closes both the unbounded-string and terminal-escape classes for this module; ASVS L1 engages nothing and the two standing deferrals are untouched; **NFR half: `N1`–`N4` re-derived independently on TWO builds and TWO protocols and ALL FOUR MET** — `N1` 8.82x/8.80x ≥ 5x, `N2` 0.480/0.482 ≤ 0.75 µs, `N3` 4.235/4.243 ≤ 6.5 µs, `N4` worst 10.307/10.350 ≤ 14 µs — with the Engineer's four figures reproduced to within 0.4–1.5%; **the `N4` attribution was TESTED: his conclusion holds (the delivered build is 1.2–1.9% FASTER than an allocating reference build, not slower) and his mechanism does not (a sweep reads the same or HIGHER, never lower) — the reference's `worst 9.34 µs` is a MEAN over three checking piece moves**, so `N4`'s measured cell is mislabelled and a human decides whether the 14 µs bar moves; **`N1` is machine-independent but NOT position-independent** (4.33x startpos → 24.65x kiwipete, below its own bar at two of five positions); `NFR-002` intact at 2.6% of a 16 ms frame at 120 plies; gate re-run lint/typecheck/build exit 0, 652/652, skip 0, test-integrity exit 2 (registry absent, pre-existing); **one structural defect found and repaired in `plans/traceability.md`**; four accepted risks each with a named owner and trigger; **no file under `src/` touched and no NFR bar or catalog target moved** — full record: `plans/tickets/history/ABC-013-board-history.md`)  **[MERGE PENDING — the merge keystroke was DENIED by the host classifier on 2026-08-10 and RETURNED TO THE OWNER rather than worked around; the fourth such denial in this project and the fourth returned. All gates are GREEN on the branch tip and the fast-forward is clean (0 behind, 0 merge commits, 12 ahead of `eb706f9`). `main` is UNCHANGED at `eb706f9`. This ticket is NOT Done, because in lean mode Done means merged.]**

---

## `plans/traceability.md` Status cell, superseded verbatim on 2026-08-10 at the close

It still read `In Review`, three column moves stale. Verbatim:

**In Review — moved from `In Development` 2026-08-10 by the Software Engineer (Workflow 04); In Development 1/3 → 0/3, In Review 0/3 → 1/3.** All 20 in-suite criteria `A1`–`A20` pass and `A21`'s four bars hold on the delivered build; `A22` holds (green, skip 0, no existing test changed). **NOT ONE OF THE 52 EXPECTED STRINGS WAS DISPUTED** — every row was re-derived from its FEN against the SAN rules before the implementation existed, including the four BA/PM named as most attackable (`Qee1`, `Q1e1`, `Ne4`, `exd6`); no row was edited and no code was bent to a row. **That agreement is corroboration, NOT proof**: it is a second hand-derivation by a reader who had already seen the table, not an external implementation, a PGN corpus or a specification text — so *the 52 strings match the standard* is still `UNKNOWN - verify` and QE's mutation hop is still the independent check. Red-before-green reported with its already-greens: `A7` and `A8` were green on a build with NO disambiguation code at all, and `A18`/`A19` were green VACUOUSLY before the function touched the position. `ADR-0004` not re-opened, `plans/nfr-catalog.md` not edited, `src/legal.ts` and the rules core untouched. NOTHING MERGED, NOTHING DEPLOYED — the `In Review` exit is QE/E2E's  **QE/E2E PASS 2026-08-10 — `In Review` → `In Security/NFR` (In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2).** ZERO defects in `src/san.ts` and FIVE gaps in the CRITERIA, reported as two separate counts and never conflated: the delivered build is correct — externally corroborated on 649,556 strings — while the acceptance net misses an entire defect class (over-qualified disambiguation for rooks, bishops, qualified captures and black). `A7`'s `Ne4` upheld against an external implementation, so the legal-vs-pseudo-legal RULE is no longer resting on a grugops reading. Gate re-run on the branch tip: lint/typecheck/build exit **0**, **652/652 on 20 files**, skip **0**; **test-integrity checker exit 2** (`.grugops/test-skips.md` absent — recorded as an error, never as a pass, pre-existing and not introduced here). The `In Security/NFR` exit is Security/NFR's and was NOT taken. `ADR-0004` not re-opened, `plans/nfr-catalog.md` not edited, no criterion / FEN / expected string / NFR bar edited, `parseSan` not written. NOTHING MERGED, NOTHING DEPLOYED.  **SECURITY/NFR PASS_WITH_RISKS 2026-08-10 — `In Security/NFR` → `Ready for UAT` (In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4). NO REQUIRED FIX; NOTHING HIGH OR MEDIUM, so nothing blocks at `security.block_on: high`.** **THE GATE SPLIT and both halves were run.** SECURITY HALF: all 628 new lines read for the one question, and the ticket's `no security trigger` claim HOLDS - `src/san.ts` accepts no string parameter of any kind, has no I/O, no network, no filesystem, no `process`, no `eval`/`Function`/dynamic import, no logging, no `try`/`catch` and no dependency, and `package.json` / `package-lock.json` are byte-identical to `main`. **THE EXPOSURE SURFACE WAS MEASURED RATHER THAN ARGUED: 351,644 SAN strings over 8,478 positions - MAX LENGTH 7 CHARACTERS, 27 distinct characters, code points 0x23-0x78, ZERO control bytes, ZERO ESC, ZERO C1, nothing above U+007E**, which closes for this module both the unbounded-string frame-buster `NFR-002` names and the escape-injection class `ABC-018` carries. The `makeMove`/`unmakeMove` window has no `try`/`finally` and needs none - `grep -n throw` across `apply.ts`, `legal.ts`, `moves.ts` and `position.ts` returns NOTHING, so no exception site is reachable inside it; the test file's one `readFileSync` is its own source at a fixed URL and both regexes are linear (no ReDoS). ASVS filtered to L1 (70 of 345): nothing engaged; `V1.3.2` PASS; `V2.2.1` not a fail because a `Move` from this repo's own generator is not a security-decision input, but the unvalidated caller obligation travels with the first caller; `V13.4.1` and `V15.1.1`/`V15.2.1` untouched and NOT relaxed. NFR HALF: all four bars re-derived and MET (see the NFRs cell). GATE RE-RUN ON THE BRANCH TIP by this role: lint / typecheck / build exit 0, `npm test` 652/652 on 20 files, skip count 0, `src/` diff still three added files +628/-0; test-integrity checker exit 2 (registry `.grugops/test-skips.md` absent, pre-existing, recorded as an ERROR and never as a pass). **FOUR ACCEPTED RISKS, EVERY ONE WITH A NAMED OWNER AND A TRIGGER: `RISK-ABC013-01` LOW `N4`'s measured cell is a group mean labelled `worst` (owner BA/PM); `RISK-ABC013-02` LOW `N1` is not position-independent (owner Security/NFR); `RISK-ABC013-03` LOW `toSan` is silently wrong on a broken caller obligation, with no validation and no log (owner BA/PM at `EPIC-003`); `RISK-ABC013-04` LOW QE's five criteria gaps stay open and were weighed here as bearing on NEITHER half (owner BA/PM).** **THIS ROW'S STRUCTURE WAS REPAIRED AT THIS HOP:** the previous write put its Tests text into the UAT column and its Status text AFTER the trailing pipe, leaving the only row in this file with no closing pipe, eleven content cells against a ten-column header, and a Status cell still reading `In Review` after the ticket had left that column - a pipe COUNT cannot see a pipe MOVE. Both strings were moved into the cells their author named, byte-for-byte, nothing rewritten. NOTHING MERGED, NOTHING DEPLOYED - a human holds both.


## `plans/board.md` `_Updated:` header, superseded VERBATIM on 2026-08-10 when BA/PM cut `ABC-025`

Archived before replacement, per the rule at the top of `plans/board.md`. Nothing summarised, nothing dropped.

_Updated: 2026-08-10 by the Orchestrator (task `ticket-to-pr-ABC-013`, Workflow 04): **`ABC-013` CLOSED — merged BY THE OWNER and moved `Ready for UAT` → `Done`. Ready for UAT 1/4 → 0/4.** Fast-forward `eb706f9` → `8dd8d22`, 14 commits, **no merge commit** (`git log --merges` empty and `git rev-list --count HEAD..main` 0, checked before AND re-verified after). **The merge keystroke was DENIED by the host classifier and RETURNED TO THE OWNER rather than worked around — the fourth such denial in this project and the fourth returned. The owner merged and deleted the branch.** Gates run on the branch tip and AGAIN on `main`: lint/typecheck/build **0** both sides, **652/652 on 20 files**, skip **0**, and **`PERFT_DEEP=1` 32/32 EXACT in 38.38 s on `main`** — the deep lane's only run on this ticket and the check that the rules core is untouched. **The whole delivered diff is THREE NEW FILES, +628/−0, additions only**; no pre-existing file under `src/` modified, and `src/san.ts` md5 `cbcc3be3…` identical from delivery through both gates and on `main` after the merge. **THE LARGEST RISK — 68 expected SAN strings never checked by anything but their own authors — WAS CLOSED BY AN EXTERNAL ORACLE, AND THREE HOPS HAD WRONGLY RECORDED THAT NONE EXISTED**: QE disbelieved that premise, found network access, installed `chess.js@1.4.0` OUTSIDE the repo and matched on **649,556 strings over 8,435 positions, ZERO mismatches**, settling `A7`. **BA/PM made EIGHTEEN acceptance corrections where the Orchestrator's pre-check named four**, and proved a CORRECT build FAILS both original NFR bars — a trap that would have fired after the code was written. **QE: 40 mutants, ZERO code defects, FIVE criteria gaps** (non-minimal disambiguation; all 18 FENs white-to-move), **left open by the Orchestrator's own over-tight QE scoping and owned there** — `RISK-ABC013-04` → **`ABC-025` owed**. Security/NFR **PASS_WITH_RISKS**, gate SPLIT, `N1`–`N4` all MET, four owned risks. **UAT DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED** — zero runtime importers, no `bin`/`main`. **THREE ORCHESTRATOR ERRORS ARE ON THE RECORD FOR THIS TICKET**, all self-caught and corrected: a merge limit asserted that the owner's standing directive had already retired; a board close written BEFORE the merge ran and false for minutes; and the QE scoping above. **NOTHING DEPLOYED** — a human holds deploy. Per-ticket detail is in `plans/tickets/history/`, not here._
