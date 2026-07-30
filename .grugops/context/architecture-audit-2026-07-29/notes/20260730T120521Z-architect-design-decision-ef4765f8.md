---
id: 20260730T120521Z-architect-design-decision-ef4765f8
kind: decision
by: architect-design
at: 2026-07-30T12:05:21Z
verified_by: human:Olger Oeselg
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ADR-0002
  - ADR-0003
  - ADR-0001
  - NFR-005
  - NFR-004
  - NFR-003
  - RISK-002
  - EPIC-002
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/zobrist.ts
  - 20260729T145433Z-architect-design-observation-43d9a3cc
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T151154Z-architect-design-decision-7805ef24
  - 20260729T200039Z-architect-design-decision-bd553d62
  - 20260730T103350Z-architect-design-decision-f9ef2d01
  - 20260730T104500Z-orchestrator-observation-3c8d17ba
  - 20260730T105400Z-architect-design-decision-309efdbe
supersedes: 
---

# ADR-0002 RATIFIED by a human — all four clauses AS PROPOSED

Subtask `adr-0002-ratify` of task `architecture-audit-2026-07-29`. **I did not make this decision. I
recorded one that a named human made.** Olger Oeselg ruled in session on 2026-07-30: *"ratify
ADR-0002"* — unqualified, so unlike `ADR-0003` **no clause was amended**. Two repo files changed:
`ADR-0002` (status flip + ratification record + two labelled factual refreshes + the sentences the
flip invalidated) and `plans/traceability.md` (the two ADR rows that were owed and missing).

## Provenance and admissibility — read this first, because the stamp needs it

`verified_by: human:Olger Oeselg`. That is the honest stamp for a non-gate-adjudicable judgment ruled
on by a named human: no §14 gate can adjudicate "who should own game history", which is a design
judgment about four unbuilt epics. It is the same escalation valve
`…-orchestrator-observation-3c8d17ba` reserved for the ADR pair, and the same stamp the `ADR-0003`
ratification note (`…-architect-design-decision-309efdbe`) carries.

**But state plainly what did NOT happen**, exactly as that note did. This repo has **no
`scripts/context-io.ts`** — there is no `scripts/` directory at all — **no `scripts/claim.js`**, and
**no `.claude/hooks/` admission guard** (verified this session: all three paths absent). So:

- This note was **hand-written directly against the SCTX-01 schema** in
  `agent-factory/contracts/context-note.md`. **No validator ran. No admission check ran. No atomic
  claim was taken.** `index.md` / `index.jsonl` were not regenerated — the task folder still contains
  `notes/` and nothing else.
- **The `human:` stamp is NOT mechanically enforced here.** On Claude Code that stamp is made
  un-forgeable by a per-call PreToolUse hook reading a fresh session variable the agent's own child
  env cannot reach. That hook does not exist in this repo. The stamp therefore records **a ruling
  given in session by a named human, transcribed by me** — it is not proof the ruling happened. A
  reader auditing this must weigh it as a transcription, not as an enforced signal.
- **No `finding` is admitted, deliberately, regardless of the stamp.** There is no live §14-gate
  verdict anywhere under this task, so no `finding` is admissible here and I recorded none. This is
  `kind: decision`, matching the posture of all ten prior notes in this folder — five `decision`,
  four `observation`, one `artifact-ref`, and **not one `finding`**. `confidence: high` applies to *what
  the human ruled and what I wrote* — not to the engine numbers, whose confidence is unchanged from
  the notes they come from (`…-bd553d62` medium-high, `…-f9ef2d01` medium-high).

I read all ten prior notes in this folder from disk before acting, plus `ADR-0002`, `ADR-0003`,
`ADR-0001`, `plans/nfr-catalog.md`, `plans/traceability.md`, `AGENTS.md`,
`agent-factory/roles/architect-design.md`, `agent-factory/workflows/16-context-read-write.md` and
`agent-factory/contracts/context-note.md`. **Nothing was relayed to me as fact by an agent, and every
number I wrote came out of a file I read myself.**

## What the human ratified — the whole ADR, unamended

| Clause | Ruling |
|---|---|
| **1 — the rules core keeps owning a position, not a game** (`makeMove`/`unmakeMove` history-free, `UndoRecord` caller-owned) | **accepted as proposed** |
| **2 — one module above the core owns `{ initial position, Move[] }`, derived by replay not maintained** | **accepted as proposed** |
| **3 — the search does not share that structure** (preallocated per-ply key array, seeded once per search) | **accepted as proposed** |
| **4 — `gameStatus`'s `positionCounts` gets exactly one supplier**, signature unchanged | **accepted as proposed** |

The contrast with `ADR-0003` is the point of the record and is stated inside `ADR-0002`'s Status
section: there, clause 2 was accepted **only as amended** and three amendments had to be written into
the file. Here nothing of the sort happened. Clause 2 — the derive-don't-maintain call the authoring
note named as "the most judgment-laden clause" — was **ratified with no change**, and I did not
soften, strengthen or hedge it. The Confidence section (`medium-high`, with its three named
mind-changers) is byte-untouched.

## The two factual refreshes — labelled in the file as NOT clause amendments

Both are marked in place with the literal phrase **"Factual refresh on ratification … NOT a clause
amendment"**, so a reader can tell them from an amendment at a glance. That distinction is load
bearing precisely because for `ADR-0003` it was real.

**Refresh A — the `~6%` counterfactual is superseded by measurement.**
`### Stated dependency on ADR-0003` predicted that if `ADR-0003` chose pin-aware generation,
`makeMove` would fall to "roughly once per node" and the penalty to "about the cost of one key
(~6%)", which "must then be re-measured". `ADR-0003` measured that counterfactual, and I transcribed
its figures from its `### Stated dependency on ADR-0002 … — answered with measurement` section with
attribution (one machine: Apple M3, Node v24.12.0, darwin-arm64):

- **4.2x confirmed independently** — `ADR-0003` reproduced this ADR's shape at **4.48x at kiwipete
  (+16.9 µs/node)** and **4.60x at startpos (+6.9 µs/node)**, against `ADR-0002`'s **4.13x-4.21x** and
  **+16.1 µs/node**. `makeMove` calls per node today: **40.9** (40.9 pseudo-legal moves per node over
  the six standard positions to depth 3).
- **The premise fails; the conclusion strengthens** — calls/node fall **40.9 → 3.3** under lazy
  legality (**12x, not to ~1**) and the penalty measures **1.93x at kiwipete / 0.99x at startpos**,
  **not ~1.06x**. Under a pseudo-legal search the *relative* penalty gets **worse**, because the node
  gets ~12x cheaper while still making one `makeMove` per move searched. The file now says **`~6%`
  must not be quoted from this ADR again.**
- **What `ADR-0003`'s ratification settled** — because its **clause 1 was ratified as proposed**,
  make/test/unmake stays, so **`ADR-0002`'s 4.13x-4.21x stands exactly as written and the
  re-measurement this section asks for is NOT owed today.** It becomes owed only if a human later
  authorizes an option from `ADR-0003` clause 3 — which authorizes none. I recorded both halves
  honestly rather than picking one: `ADR-0003`'s own text names **(c1)** and **(c2)** as the two that
  move this number, and its last resort **(b)** full pin-aware generation is precisely the
  counterfactual `ADR-0002`'s `~6%` was written about. The dependency section keeps its honest
  structure — nothing was deleted, and the original prediction is still quoted in the bullet above the
  refresh so the record reads without the file's history.

**Refresh B — the retired-`NFR-005` framing, in the four places `…-309efdbe` named.** All four
leaned on the `>= 500,000 nodes/sec` target that a human RETIRED at `ADR-0003`'s ratification. Each is
now re-framed against the depth-in-budget target **as `plans/nfr-catalog.md` actually reads today** —
`kiwipete` and `position-6`, `>= depth 6` in 3 s and never past the 5 s ceiling as the **FAIL** floor,
`depth 7` in 3 s as the **WARN** level marked **PROVISIONAL** pending non-M3 measurement, node rate
**demoted to a diagnostic**:

1. **Context** — the "`NFR-005` is currently missed against a 500k target" clause is replaced by the
   measurement standing on its own (**163k-351k nodes/sec, ABC-008 metric B, no evaluation running,
   M3, 2026-07-29**), followed by the labelled refresh. The refresh states plainly that **the
   measurement is unaffected and stays**, and that **nothing this ADR concludes changes**: its
   argument is per-node cost against a **~5,000 ns search node** (9-23 ns/node vs 86-101 ns/node vs
   4.13x-4.21x), and under a depth target a cheaper node still buys depth — so cheaper is still
   better, in the same order, and the whole Alternatives ranking stands.
2. **Consequences** — "Against a missed `NFR-005`, that is the cheapest correct option measured"
   becomes the measurement it always was (**0.2-0.4% of a ~5,000 ns search node, the cheapest correct
   option measured**), with the refresh noting the ranking is unmoved.
3. **The shared-`Map` Alternative** — "4-10x cheaper, on a metric (`NFR-005`) that is currently
   missed" becomes **4-10x cheaper per node (9-23 ns against 86-101 ns)**, still undiminished under a
   depth target. The refresh restates that this option is rejected **on shape, not on cost** — that
   was true before and is untouched.
4. **Rollback** — "the clause the `NFR-005` deficit binds on" becomes "the clause the search's
   per-node cost binds on", and the demand for a fresh measurement before any reversal is unchanged.

**No NFR row was touched.** `plans/nfr-catalog.md` is byte-unchanged — `ADR-0002` changes no NFR
target, and the refresh only points at what the catalog already says.

## The sentences the flip invalidated, each named so the edit is auditable

Beyond the two refreshes, five edits were made **only** because a `proposed` ADR became an `accepted`
one. Naming them rather than making them silently is what made the `ADR-0003` record trustworthy:

1. `## Status` — `**proposed** — awaiting ratification by a human. No agent may move this to
   `accepted`.` → `**accepted** — ratified by a named human on 2026-07-30. No agent may move an ADR to
   `accepted`; a human did.` The prohibition is **kept**: it is accurate history now.
2. `## Status` prose — "This ADR presents a decision; it does not take one … what follows **is** a
   recommendation … so a human **can** ratify" re-tensed to past, closing with "and it was ruled on in
   session". Otherwise an accepted ADR still reads as a draft.
3. `## Status` — the unsigned `Ratified by: `__________________`  on `__________`` line is now
   `Ratified by: Olger Oeselg  on 2026-07-30`.
4. `## Status` — new `### Ratification record` subsection: clause-by-clause "accepted as proposed" for
   all four, the two refreshes labelled as refreshes, an explicit "nothing else moved" list, and the
   line that **ratification settled who owns game history and measured nothing** — every figure in the
   file is a transcription carrying its position, node definition and machine.
5. `## Alternatives`, the leave-it-caller-owned option — "The **recommendation** above *is* this
   option plus a name and a home" → "The **Decision** above …", and the live offer "If a human prefers
   to defer even that, the loss is bounded" re-tensed to record that the offer was on the table and
   that **the 2026-07-30 ruling did not defer**. The rejection ("Rejected — but only just") is
   untouched; only the tense that implied an open question changed.

Everything else in the file is byte-unchanged: the Decision clauses, the measurement table, the
Confidence section, the `Game`-type and derive-everything Alternatives, the forecloses bullets, the
out-of-scope en-passant subsection, and Rollback apart from the one refreshed sentence.

## `plans/traceability.md` — the two owed ADR rows appended

`…-309efdbe` flagged that **neither `ADR-0002` nor `ADR-0003` had any trace row at all**, and that it
was this role's own duty. Both rows are now appended, in the file's fixed 10-column shape (verified:
every row in the table has exactly 10 cells), placed after `ABC-010` and before the `pending` epic
rows so the concrete-id rows stay grouped — the same placement convention BA/PM used for
`ABC-009`/`ABC-010`.

- **`ADR-0002`** — Epic cell carries all four epics it constrains (`EPIC-002`, `EPIC-004`,
  `EPIC-005`, `EPIC-006`); NFRs cell names `NFR-005`, `NFR-003` (41 µs replay = 0.089% of the 50 ms
  keystroke budget) and cross-references `ADR-0003` and `ADR-0001`, which is how `ABC-001` already
  references `ADR-0001`; Code cell reads `no src/** change — decision only`; Tests cell records that
  **no existing test would catch getting this wrong** and names who owes the tests (EPIC-002's
  decomposition, EPIC-006's undo test); Status `Accepted — ratified by Olger Oeselg 2026-07-30, all
  four clauses as proposed`.
- **`ADR-0003`** — `EPIC-004`; `NFR-005` (target re-derived, catalog row rewritten, `>= 500,000`
  RETIRED, depth-7 PROVISIONAL), `NFR-004`, `NFR-003`, `RISK-002`; Code cell notes clause 1 is
  literally that `src/legal.ts` is not changed, and names the ADR plus the `plans/nfr-catalog.md`
  row; Tests cell records 143/143 and deep perft 32/32 unchanged and that **EPIC-004's spike owns the
  measurement that lifts the PROVISIONAL marker**; Status `clauses 1 + 3 as proposed, clause 2 as
  amended`. **The `ADR-0003` file itself was not touched** — only this trace row about it.

UAT and Release cells are empty on both: a decision is not released and nothing here is gated. No
evidence was invented. A provenance paragraph was appended to the file's existing trailing HTML
comment (matching the `ABC-009`/`ABC-010` precedent) explaining why these are rows rather than only
NFR-column references, and `_Updated:` now reads `2026-07-30` in the file's own minimal style.

## Still un-dispositioned, and NOT mine to close

- **The en-passant hashing defect (`src/zobrist.ts:71`) has no ticket.** `ADR-0002`'s out-of-scope
  subsection reproduces it concretely and **recommends a defect ticket under `EPIC-001`, sized `S`,
  priority no higher than `P2`**. That recommendation is left exactly as written — I did not cut the
  ticket, did not re-word the recommendation, and did not absorb it into anything. **Ticketing is
  BA/PM's**, and it was outside this subtask. It is now carried by an **`accepted`** ADR rather than a
  `proposed` one, which is the only thing that changed about it: the ratified decision makes the
  derived key list the substrate for every repetition verdict in the product, so the key's inaccuracy
  is inherited by all four epics until the defect is fixed. Error direction is the safe one (a
  legitimate draw is missed, never a false draw declared).
- **`EPIC-004`'s own `NFR triggers` block still states `>= 500,000 nodes/sec`** as "the primary output
  of the spike" — flagged by `…-309efdbe`, still unfixed, still `plans/epics/**` and therefore BA/PM's.
  It now contradicts a ratified catalog row *and* a ratified `ADR-0002` refresh. If `EPIC-004` is
  decomposed before that is corrected, it will be planned against a retired number.
- **`ADR-0001` was not touched** and needs nothing from this ratification: its rollback trigger was
  already reconciled to `NFR-001` on 2026-07-29, so it never leaned on the retired 500k target.

## Verification of this change set

Documentation only. `git diff --stat -- src/` is **empty**. After the edits: `npm test` →
**143 passed / 143, 7 files, 967 ms**; `npm run typecheck` (`tsc --noEmit`) → **exit 0, clean**. Both
unchanged and green, as a docs-only change must leave them. `git status` shows exactly two modified
state files: `memory-bank/50-decisions/ADR-0002-game-history-ownership.md` and
`plans/traceability.md`.

**No benchmark was run and none was needed: ratification settled who owns game history and measured
nothing.** Every number in both edited files is transcribed from a file I read, carrying its position,
its node definition and its machine.

## Scope

Read: all ten prior notes in this folder; `agent-factory/roles/architect-design.md`;
`agent-factory/workflows/16-context-read-write.md`; `agent-factory/contracts/context-note.md`;
`AGENTS.md`; `ADR-0002`, `ADR-0003`, `ADR-0001`; `plans/nfr-catalog.md`; `plans/traceability.md`.
Wrote exactly two repo files (`ADR-0002`, `plans/traceability.md`) plus this note.

## What I did NOT touch

**No `src/**`** (verified: empty `git diff` for `src/`). **No `plans/nfr-catalog.md`** — `ADR-0002`
changes no NFR row, so the catalog is byte-unchanged. No `plans/board.md`, no `plans/tickets/**`, no
`plans/epics/**`, no `memory-bank/30-architecture.md`, and **no ADR other than `ADR-0002`** —
`ADR-0003` and `ADR-0001` were read, never edited. **No ticket was cut.** **No `git add`, no
`git commit`** — both edits are left in the working tree for the Orchestrator's single commit. No
branch change (still `grugops/architecture-audit-2026-07-29`), no merge, no deploy.
`agent-factory/**` read-only KIT.

## Risks

- **The `human:` stamp on this note is a transcription, not an enforced signal.** No admission-guard
  hook exists in this repo (see provenance). If the ruling did not happen as stated, nothing here
  would have caught it. That is the honest limit of the audit trail for a ratification in a repo
  without the enforcement tier.
- **An unamended ratification is easy to misread as a rubber stamp.** It was not: the ruling was
  unqualified, and the ratification record says so in as many words while naming clause 2 as the
  judgment-laden one. Anyone tempted to "tidy" clause 2 later is reopening a ratified clause, not
  editing a draft.
- **Clause 2's derive-don't-maintain call rests on 41 µs having ~25x of margin, on one machine.**
  `UNKNOWN - verify` on any other hardware, as the ADR says. Its named trigger (a consumer needing the
  derived counts many times per turn) is a local memoization, not a reversal — that distinction is now
  ratified and must be honoured rather than re-litigated.
- **`ADR-0002` now carries transcribed `ADR-0003` numbers.** They are attributed, dated and
  machine-tagged, but they are a copy: if `ADR-0003`'s figures are ever corrected, refresh A in
  `ADR-0002` must be corrected with them. This is the cost of answering a dependency in the dependent
  file instead of by reference only.
- **The en-passant defect is still un-ticketed while the decision that inherits it is now accepted.**
  Named above; it needs a BA/PM disposition, not another architect note.
- **`EPIC-004` still holds the retired 500k target in its own epic file.** Unchanged from
  `…-309efdbe`'s flag, and now one file further out of line.
- **This note passed no validator** (see provenance). Nothing was regenerated; `index.md` /
  `index.jsonl` still do not exist for this task.
