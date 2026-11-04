---
id: 20261104T153847Z-architect-design-decision-d6345b29
kind: decision
by: architect-design
at: 2026-11-04T15:38:47Z
verified_by: 
confidence: high: records only; the owner's word as the Orchestrator recorded it (…7de79e90); ADR-0071 restated with no decision changed; the ADR-0024 d4 opening follows Q-3K-9's line and ADR-0069's pattern; F7's reading and the new-ADR call are flagged; nothing run
refs:
  - arch-owner-answers-1104
  - ABC-282
  - ABC-289
  - ABC-300
  - ABC-283
  - ABC-279
  - EPIC-011
  - ADR-0071
  - ADR-0024
  - ADR-0056
  - ADR-0069
  - OQ-0071-1
  - Q-3K-10
  - Q-3K-9
  - W1
  - Q2
  - orch-2026-10-30a/20261104T153246Z-orchestrator-decision-7de79e90
  - arch-ABC-282/20261104T140129Z-architect-design-decision-0187186b
  - arch-ABC-282/20261104T140129Z-architect-design-observation-1938110b
  - qe-ABC-300/20261104T144414Z-qe-e2e-decision-fbda2ad6
  - 5d402485
  - 4ea39135
  - 7b70e268
  - 9471eb32
supersedes: 
seal: sha256:43c66cd36d4925ee8b4d84adbcedfd13708b6f799660a40c8bb87b9fd32ae06f
---

# arch-owner-answers-1104 decision: ADR-0071 ACCEPTED in form (a), as written; ADR-0024 d4 opened for the design of Q2 (Q-3K-10 yes); ADR-0056 rows W1 and Q2 dated

Architect/Design, task `arch-owner-answers-1104`, records only, on `grugops/arch-owner-answers-1104` from `main`
`5d402485`. Nothing was run. Input: the owner's word as the Orchestrator recorded it, `orch-2026-10-30a` `…7de79e90`
("Accept the W1 time-use design (ADR-0071); Q-3K-10: yes").

## 1. ADR-0071 (OQ-0071-1)
- **Status: ACCEPTED 2026-11-04 by the owner, form (a), as written.** It is not in force until `ABC-282` merges on its
  read (A6, D10). The PROPOSED block is kept below it as history.
- **No decision changes.** D1–D12 stand. Option (b), the partial-move rule in every mode, is not taken, so no
  follow-up ticket is owed for it.
- **Written with it:**
  - a `## Decision log` section (ADR-0071 had none), with five rows: PREREG, PROPOSED, the BA/PM fold and `ABC-300`,
    the owner, and this restatement;
  - a dated line under D10's harness-ticket bullet: cut as `ABC-300`, merged `4ea39135` (`qe-ABC-300` `…fbda2ad6`).
    A6 plays its `d --tc 40/8`;
  - an "answered" line under § Owner questions OQ-0071-1.
- **One reading, flagged.** F7 said "this ADR stays PROPOSED with its read recorded". Under acceptance it reads
  "accepted, not in force", as `ADR-0069` F5 does. A dated note is added in the F7 cell and in § Status. The
  disposition does not change: an A6 miss is not merged.
- **The hold is the Orchestrator's** (`…7de79e90`): `ABC-282` stays held until `ABC-283` merges or misses. Whichever
  lands second carries D12's items 1–6.

## 2. ADR-0024 d4 (Q-3K-10)
- **A fourth § Status block,** the same shape as `Q-3K-9`'s: d4's fence on delta pruning is lifted for the **design**
  of Q2. Design only. Q2 needs its own PREREG and its own ADR, and a build ships on its own C2′ read with S′ and the
  Levels lane. Quiet checks stay fenced.
- **The Architect's call, recorded there:** Q2 gets a new ADR that amends d4, as `ADR-0069` did. It is not an in-place
  amendment of `ADR-0024`. `ABC-289`'s `adr:` line left this choice open. A new ADR keeps one decision per record, and
  it follows the precedent.
- **What Q2's ADR must show** is listed in that block in nine items, by `ADR-0069`'s pattern:
  1. a PREREG sealed first;
  2. the premise re-measured on `main` with Q1 in it (`ABC-289` hold 2);
  3. an exact instrument check;
  4. the pay gate;
  5. the safety gate;
  6. the rule's terms: margin, exclusions, the order against `isLosingCapture`, and the fail-soft return on a delta
     skip;
  7. the seam: one switch through `QuiescenceRules` and a test-only door pair at the top of the ladder;
  8. the bars derived by rule, and the read;
  9. the d4 amendment's pointers.
- **A d4 dated line** points at that block. Delta pruning stays on d4's list until Q2's ADR amends it.

## 3. ADR-0056
A D2 dated line of 2026-11-04 covers both rows:
- **W1:** the ticket cell reads ACCEPTED. "After a harness ticket" now reads "on `ABC-300`'s `d --tc 40/8`". The
  `ABC-283` hold is restated.
- **Q2:** "depends on" now reads "`ADR-0024` d4 opened for design by `Q-3K-10` yes". The ticket cell now reads
  "`ABC-289` (`EPIC-011`)". The premise is re-measured over Q1. The +5–20 stays an estimate, `UNKNOWN - verify` after
  Q1. The slot is the Orchestrator's.

No other ADR, and no bar, moved. Fences held: no ticket, EPIC, board, `src/` or `tools/` edit.

## 4. Owed lines (BA/PM folds them into its next task; none is written on those pages here)
**`ABC-282`:**
- `adr:` → "`ADR-0071` ACCEPTED 2026-11-04 (owner, OQ-0071-1, form (a), as written; `orch-2026-10-30a` `…7de79e90`).
  Not in force until this ticket merges on A6."
- The header line "It merges only on its read (A6) and the owner's acceptance" → "It merges only on its read (A6). The
  owner accepted `ADR-0071` 2026-11-04."
- **Dependencies:** A6 on `ABC-300`'s `d --tc 40/8` (merged `4ea39135`; QE-300-a carried here). The page still holds
  until `ABC-283` merges or misses (the Orchestrator, `…7de79e90`; `ADR-0071` D12).
- The rest of the page is unchanged. Option (b) was not taken, so no follow-up ticket is owed.

**`ABC-289`:**
- **Hold 1, the owner's, is lifted:** `Q-3K-10` answered yes 2026-11-04 (`…7de79e90`). `ADR-0024` d4 is open for
  Q2's **design**, as `Q-3K-9` opened it for Q1. A build ships on its own read.
- **What still holds it:**
  - (a) **the Architect's re-measure on `main` with Q1 in it** (hold 2): the premise reading of `ADR-0024` § Status,
    the fourth block, item 2, under a sealed PREREG;
  - (b) **a new ADR, by `ADR-0069`'s pattern, that amends d4,** and the owner's acceptance of it (reading (b) lets the
    build start on PROPOSED).
- `adr:` → drop "(1) the owner's word …". Item (3) "a new ADR or an `ADR-0024` amendment (the Architect's call)" →
  "a new ADR that amends `ADR-0024` d4 (the Architect's call, `ADR-0024` § Status, 2026-11-04)". It must show the nine
  items listed there.
- DoR row 10 stays ❌, now on the re-measure and the ADR only. Row 5's "`Q-3K-10`" → "`Q-3K-10` answered yes". F1
  (`Q-3K-10` no) is moot, and is kept struck through as history.
- The title's "Held on ADR-0024 d4 (… opening it is the owner's word)" → "held on the Architect's re-measure over Q1
  and its ADR". The wording is BA/PM's.

**`EPIC-011` § Owner questions:**
- **OQ-0071-1** → answered 2026-11-04: (a), accepted as written (`…7de79e90`). `ADR-0071` is ACCEPTED, not in force
  until `ABC-282` merges on A6. The row is struck through, like the `ADR-0069` row.
- **`Q-3K-10`** → answered yes 2026-11-04 (`…7de79e90`). `ADR-0024` d4 is open for Q2's design only. `ABC-289`'s
  owner hold is lifted; the re-measure and the ADR still hold it. The row is struck through.
- **The dated header line** → "Open now: Q-3K-6, Q-3K-8, the `ADR-0067` d6 amendment and B-T8's re-confirmation,
  plus the Q-3K-1 wording row."
- **Optional, the same fact elsewhere in the epic.** These rows still name `Q-3K-10` as a hold: § Phases row 3 / Q2,
  § Tickets row 41 (`ABC-289`) and § Dependencies' `ABC-289` line. Each now reads "held on the Architect's re-measure
  over Q1 and its ADR". § Tickets row 34 (`ABC-282`) may carry "`ADR-0071` ACCEPTED 2026-11-04". The history headers
  stay as written.

**The board:** the Orchestrator's.
