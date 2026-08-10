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
