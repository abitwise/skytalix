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
