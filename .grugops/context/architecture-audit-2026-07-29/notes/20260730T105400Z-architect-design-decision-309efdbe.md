---
id: 20260730T105400Z-architect-design-decision-309efdbe
kind: decision
by: architect-design
at: 2026-07-30T10:54:00Z
verified_by: human:Olger Oeselg
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ADR-0003
  - ADR-0002
  - NFR-004
  - NFR-005
  - NFR-001
  - NFR-003
  - RISK-002
  - EPIC-004
  - ABC-008
  - memory-bank/50-decisions/ADR-0003-legality-strategy.md
  - plans/nfr-catalog.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T151154Z-architect-design-decision-7805ef24
  - 20260729T200039Z-architect-design-decision-bd553d62
  - 20260730T103350Z-architect-design-decision-f9ef2d01
  - 20260730T104500Z-orchestrator-observation-3c8d17ba
supersedes: 
---

# ADR-0003 RATIFIED by a human — clauses 1 and 3 as proposed, clause 2 AS AMENDED

Subtask `adr-0003-ratify-amend` of task `architecture-audit-2026-07-29`. **I did not make this
decision. I recorded one that a named human made.** Olger Oeselg ruled in session on 2026-07-30:
*"ratify 1 and 3, amend 2"*. Two repo files changed: `ADR-0003` (status flip + clause-2 amendment +
the sentences the flip invalidated) and `plans/nfr-catalog.md` (the `NFR-005` row the ADR was holding
back while `proposed`).

## Provenance and admissibility — read this first, because the stamp needs it

`verified_by: human:Olger Oeselg`. That is the honest stamp for a non-gate-adjudicable judgment
ruled on by a named human — the escalation valve the prior orchestrator note
(`…-orchestrator-observation-3c8d17ba`) explicitly reserved for this: no §14 gate can adjudicate
"is >= 500k the right target", because that is a product-strength judgment.

**But state plainly what did NOT happen.** This repo has **no `scripts/context-io.ts`** — there is no
`scripts/` directory at all — and **no `admission-guard` PreToolUse hook** (there is no
`.claude/hooks/` directory). So:

- This note was **hand-written directly against the SCTX-01 schema** in
  `agent-factory/contracts/context-note.md`. **No validator ran. No admission check ran.**
  `index.md` / `index.jsonl` were not regenerated. No atomic claim was taken.
- **The `human:` stamp is NOT mechanically enforced here.** On Claude Code that stamp is made
  un-forgeable by a per-call hook reading a fresh session variable the agent's own child env cannot
  reach. That hook does not exist in this repo. The stamp therefore records **a ruling given in
  session by a named human**, transcribed by me — it is not proof that the ruling happened. A reader
  auditing this must weigh it as a transcription, not as an enforced signal.
- **No `finding` is admitted, deliberately, regardless of the stamp.** There is no live §14-gate
  verdict anywhere under this task, so no `finding` is admissible here and I did not record one. This
  is `kind: decision`, matching the posture of all nine prior notes in this folder. `confidence: high`
  applies to *what the human ruled and what I wrote* — not to the engine numbers, whose confidence is
  unchanged from `…-architect-design-decision-f9ef2d01` (high on the measurements, medium on the
  re-derived target's literature inputs: EBF 6, quiescence 2.5x, "depth 6-7 is enough for 1400-1700").

I read all nine prior notes in this folder before acting, plus `ADR-0003`, `ADR-0001`, `ADR-0002`,
`plans/nfr-catalog.md` and `EPIC-004` from disk. Nothing was relayed to me as fact by an agent.

## What the human ratified, and what the human changed

The audit trail must show an **amendment**, not a wholesale acceptance, so it is recorded that way in
`ADR-0003`'s Status section as well as here:

| Clause | Ruling |
|---|---|
| **1 — `src/legal.ts` is not changed** (make/test/unmake stays) | **accepted as proposed** |
| **2 — `NFR-005` re-derived from `NFR-004`** | **accepted ONLY as amended** — the draft target was not ratified |
| **3 — named trigger + ordered menu (c1)/(c2)/(b), authorizing none** | **accepted as proposed** |

The three amendments came from an orchestrator review of the ADR, were put to the human, and were
accepted by the same ruling:

- **(2a) The positions are named.** The draft said *"in a middlegame position"* — untestable, and the
  same vagueness clause 2 exists to correct `NFR-005` for. Replaced with **kiwipete and position-6**
  as the standing benchmark set: the two positions the ADR actually measured, both already carrying
  published perft counts in `src/perft.test.ts`.
- **(2b) Two levels — depth 6 FAILS, depth 7 WARNS.** The ADR's own arithmetic says depth 6 needs
  ~47k nodes/sec against a measured 207k-546k, so a depth-6-only gate would still read green after a
  **4x regression**. Depth 7 needs ~280k, which is where the code sits (measured wall clock: depth 7
  at kiwipete in 0.39-0.68 s, at position-6 in 0.644 s). Depth 6 is the FAIL floor because `NFR-004`'s
  promise rests on it; depth 7 is the WARN because it is the level that detects a regression.
- **(2c) The depth-7 level is PROVISIONAL; the depth-6 floor is not.** One machine, one Node version,
  and the unvalidated 2-3x slow-hardware factor is the ADR's own largest single unknown — a 3x slower
  machine still clears depth 6 by ~1.5x and loses **precisely depth 7**. Provisional pending
  `EPIC-004`'s spike on target hardware.

## Files changed, and the sentences the ratification invalidated

**`memory-bank/50-decisions/ADR-0003-legality-strategy.md`** — `## Status` is now **`accepted`**, the
ratification line reads `Ratified by: Olger Oeselg  on 2026-07-30`, and a `### Ratification record`
subsection states clause-by-clause what was accepted as proposed vs as amended, with one line of why
per amendment. The sentence that no agent may move an ADR to `accepted` is **kept** — it is accurate
history now, since a human did. Clause 2 in the Decision section carries the amended target plus the
three amendments' fuller reasoning.

Clauses 1 and 3 were not rewritten; Context, Alternatives, the option tables, the `ADR-0002`
dependency section and the `ABC-009` interaction table are untouched. Five sentences elsewhere were
updated **only** because the flip or an amendment invalidated them, and each is named here so the
edit is auditable rather than silent:

1. `Decision` lead-in: "**Recommended:** keep make/test/unmake" → "**Ratified:** … clauses 1 and 3 as
   proposed, clause 2 as amended" — otherwise an accepted ADR still reads as a draft.
2. `Decision`, the held-back follow-up: "this ADR deliberately does not edit `plans/nfr-catalog.md` …
   that edit belongs to whoever ratifies" → records that the edit **was** made on ratification, to
   the amended target.
3. `Confidence / what would change my mind`, the 3x-slow-hardware bullet: a pointer that amendment
   (2c) prices exactly this in.
4. `Consequences`: "**`NFR-005` stops being a pass/fail gate and becomes a diagnostic**" was wrong
   after (2b) — as amended `NFR-005` **is** pass/fail, on depth; it is the **nodes/sec figure** that
   became the diagnostic. Also: the `EPIC-004` bullet now says that spike owns lifting the provisional
   marker, and the forecloses bullet no longer says a green `NFR-005` row proves nothing (it now names
   the nodes/sec figure, and adds that a green row on this M3 is not evidence about target hardware).
5. `Rollback`: clause 2's cost curve now distinguishes the two levels — the depth-6 floor is the
   expensive one to revert, while revising the provisional depth-7 level is the **discharge** of this
   ADR's own obligation, not a rollback of it. The closing "measurements recorded in a `proposed`
   decision record" was re-tensed, and now says plainly that ratification settled what the target is
   and **measured nothing**.

**`plans/nfr-catalog.md`** — the `NFR-005` row rewritten to the ratified, amended clause-2 target:
depth-in-budget on `kiwipete` and `position-6`, `>= depth 6` in 3 s / never past the 5 s ceiling as
the **FAIL floor**, `depth 7` in 3 s as the **WARN target** marked **PROVISIONAL**. `Verified by`
gives the provisional obligation a home: **`EPIC-004`'s own timeboxed spike (RISK-002's mitigation),
measuring depth-in-budget on non-M3 target hardware, is the named verification that lifts the
PROVISIONAL marker.** Node rate is **demoted, not deleted**, and every rate now carries its node
definition, its position and its machine: 163k-351k/sec (metric B, kiwipete d3/d4 + startpos d4, M3,
2026-07-29), 207k/546k per-call (metric B, M3, 2026-07-30), and the ABC-008 proxy 2,639,455/sec (no
legality filtering at all, M3) kept visible as history. The old `>= 500,000 nodes/sec` is marked
**RETIRED**. A dated `RATIFIED 2026-07-30` prose block records why the target went, why depth replaced
rate, and the three amendments; the `CORRECTED 2026-07-29` block is **kept as history** with a
one-line note that its measurements and its withdrawal stand and only the target they were measured
against was retired. `_Updated:` now reads 2026-07-30 with the 2026-07-29 and 2026-07-24 provenance
preserved.

**`NFR-001` and `NFR-003` were not touched** — not the rows, not the denominator fence, not the
partial-verifiability wording. Both were corrected 2026-07-29 and stand.

## ADR-0002 is UNTOUCHED — and it now carries a stale reference a human must dispose of

`git diff -- memory-bank/50-decisions/ADR-0002-game-history-ownership.md` is **empty**. It remains
`status: proposed` with an unsigned ratification line. The human has not ruled on it; I did not flip
it, amend it, or "align" it.

**The tension, named for a human and deliberately not resolved:** `ADR-0002` leans on `NFR-005` in
four places, and all four are now stale as *target* references while remaining valid as *measurements*:

- Context: *"`NFR-005` is currently **missed** — the audit measured 163k-351k nodes/sec against a 500k
  target"*. That 500k target no longer exists.
- Consequences: *"Against a missed `NFR-005`, that is the cheapest correct option measured."*
- Alternatives (the shared-`Map` option): *"on a metric (`NFR-005`) that is currently missed"*.
- Rollback: *"clause 3 … is the clause the `NFR-005` deficit binds on."*

**None of this changes any `ADR-0002` conclusion.** Its argument is per-node cost against a ~5,000 ns
search node (9-23 ns/node vs 86-101 ns/node vs 4.2x), and under a depth-in-budget target per-node cost
still buys depth — so cheaper is still better and the ranking is unchanged. What is stale is only the
*framing* ("a missed 500k target") that the argument is dressed in. Disposition for a human, on
`ADR-0002`'s own terms: it is a wording refresh at *its* ratification, not a reopening of its clauses.

`ADR-0003`'s `ADR-0002` dependency section is likewise unchanged and still correct: because clause 1
keeps make/test/unmake, `ADR-0002`'s 4.2x stands as written and the re-measurement it asks for becomes
owed only if a human later ratifies clause 3's (c1) or (c2).

## Second stale reference, flagged not fixed — EPIC-004's own NFR triggers block

`plans/epics/EPIC-004-engine-and-ai-opponent.md` still states, in its `NFR triggers` section:
*"`NFR-005` Search throughput — target **>= 500,000 nodes/sec** during search … the primary output of
the spike"*. That now contradicts the ratified catalog row. **I did not edit it** — `plans/epics/**`
was outside this subtask and epics are BA/PM's file. It should be brought into line before `EPIC-004`
is decomposed, or decomposition will be planned against the retired number. Note that the epic's
`RISK-002` mitigation — *"an early timeboxed spike that measures nodes/sec before the full build
commits to the design"* — is the spike the catalog row now names as lifting the provisional marker, so
that spike's brief also needs the wording change: it measures **depth-in-budget**, not nodes/sec.

## Verification of this change set

Documentation only. `git diff --stat -- src/` is **empty**. `npm test` after the edits:
**143 passed / 143, 7 files, 930 ms** — unchanged and green, as expected for a docs-only change. No
measurement was re-run and none was needed: **ratification settled what the target is; it measured
nothing.** Every number in the two edited files is transcribed from the notes already in this folder,
with its position, its node definition and its machine attached.

## Scope

Read: all nine prior notes in this folder; `agent-factory/roles/architect-design.md`;
`agent-factory/workflows/16-context-read-write.md`; `agent-factory/contracts/context-note.md`;
`AGENTS.md`; `ADR-0003`, `ADR-0002`, `ADR-0001`; `plans/nfr-catalog.md`;
`plans/epics/EPIC-004-engine-and-ai-opponent.md`. Wrote exactly two repo files (`ADR-0003`,
`plans/nfr-catalog.md`) plus this note.

## What I did NOT touch

**No `src/**` — clause 1 is precisely that no code changes** (verified: empty `git diff` for `src/`).
**No `ADR-0002`** and no `ADR-0001`. No `plans/board.md`, no `plans/traceability.md`, no
`plans/tickets/**`, no `plans/epics/**`, no `memory-bank/30-architecture.md`. No ticket was cut.
**No `git add`, no `git commit`** — both edits are left in the working tree for the Orchestrator's
single commit. No branch change (still `grugops/architecture-audit-2026-07-29`), no merge, no deploy.
`agent-factory/**` read-only.

The `plans/traceability.md` row this role normally appends is still **missing**, and it is now owed by
two ratified/authored ADRs — `ADR-0002` and `ADR-0003` have no trace row at all. Naming the omission
rather than silently skipping it: `plans/**` beyond the NFR catalog was out of scope for this subtask.

## Risks

- **The `human:` stamp on this note is a transcription, not an enforced signal.** No
  `admission-guard` hook exists in this repo (see provenance). If the ruling did not happen as stated,
  nothing here would have caught it. That is the honest limit of the audit trail for a ratification in
  a repo without the enforcement tier.
- **The depth-7 level is PROVISIONAL and must not be quoted as settled.** It is one machine
  (Apple M3, Node v24.12.0, darwin/arm64), and the 2-3x slow-hardware factor is still unvalidated on
  any non-M3 machine. A depth-7 miss on slower hardware may be the machine. The obligation is parked
  in the `NFR-005` `Verified by` cell so it cannot be lost; if `EPIC-004`'s spike never runs it, the
  marker never lifts and the row stays half-provisional forever.
- **The measured depth figures come from a model, not from a search.** Alpha-beta approximated at a
  fixed effective branching factor 6, leaves evaluated with a 134 ns-1,097 ns function, no
  transposition table, no move ordering cost, no quiescence. The ADR says so; the catalog row now
  says so too. They make the absolute times a **lower bound**.
- **Three literature assumptions remain load-bearing on clause 2** — EBF 6, quiescence factor 2.5, and
  "depth 6-7 is enough for 1400-1700 Elo". `EPIC-004`'s puzzle suite and self-play ladder are the only
  real verdict on strength and outrank every number in the ADR.
- **`ADR-0002` and `EPIC-004` now hold references to a retired target.** Both flagged above, neither
  fixed. The risk is that `EPIC-004` is decomposed against `>= 500,000 nodes/sec` from its own epic
  file while the catalog says otherwise.
- **This note passed no validator** (see provenance). Nothing was regenerated; `index.md` /
  `index.jsonl` still do not exist for this task.
