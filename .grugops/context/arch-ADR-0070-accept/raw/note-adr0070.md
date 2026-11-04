# arch-ADR-0070-accept decision: ADR-0070 ACCEPTED in form (a), structure only. The terms land at 0, value- and node-identical, with no switch, no doors and no games. The second pull fits king distance and free path; U is held at 0

Architect/Design, task `arch-ADR-0070-accept`, records only, on `grugops/arch-ADR-0070-accept` from `main` `7a9ee712`.
Nothing was run. Inputs: the owner's word `orch-2026-10-30a` `…e8a3b5df` ("a"), the Orchestrator's ruling `…e0ff0aeb`,
and `arch-ABC-271` `…bbc0a213` / `…c9af6d84` (the probe, kept as history).

## 1. What ADR-0070 now says
- **Status:** ACCEPTED 2026-11-04 by the owner, form (a), choice rule 4. Not in force until `ABC-271` merges. The
  PROPOSED block is kept below it as history (text of record `01d2434b`).
- **d1:** `PASSED_KING_ENEMY`, `PASSED_KING_OWN`, `PASSED_FREE` (by rank) and `PASSED_UNSTOPPABLE`, every half 0. The
  rules are unchanged, and the probed values are recorded as the prior and as the seam values. Every mg half stays 0 at
  every pull, because the loop is skipped at w = D.
- **d2:** unchanged structure. The memo is 576 KiB (+128 KiB, `NFR-009`), at value 0 as at any value.
- **d3:** the cost is paid in full at 0 (R = 1.0269 on the roots, about 1.085 × on the endgame set). There is no
  zero-value fast path. The single value-identical cut is named.
- **d4:** no switch and no doors. `ABC-271` scope 5 is struck. The seam `passerTermsForTest` stays.
- **d5: K0–K4 replace P0–P8.**
  - K0: node identity at `main`'s counts, which are 766 275 / 1 725 150; 87 475 / 253 724 / 533 916; 605 117 /
    406 787. They stand at `main` `7a9ee712`: its `src/` tree `4fb3da04` differs from `8adb0a18` in three test files
    only.
  - K1 (a): the mirror.
  - K1 (b): `Object.is` value identity on the frozen corpora.
  - K1 (c): the structure through the seam, at the probed values, by arithmetic. These rows are not E3's generated
    rows, which stay NOT MET.
  - K1 (d): the range row. K1 (e): the memo words.
  - K2: two re-pins only, both of the memo's byte size (458 752 → 589 824).
  - K3: `G2` ≤ 1.05 ×. K4: `G6` ≥ base.
  - No games.
- **d6:** migration is K2's two rows. The value rows go to the second pull under B-T4.
- **d7:** `ABC-271` (structure) → the second pull. One read judges both.

## 2. The door reading, named rather than picked silently
- The brief wrote "land at value 0 behind the off-door pair" and listed "the door pair" among the bars.
- The form the owner accepted (`…e0ff0aeb`, ADR-0070 § Alternatives, `ADR-0068` d4) has **no switch and no doors**.
- **Taken:** the accepted form. "The door pair" is read as "every existing door pair reads its pre-ticket counts"
  (K0).
- If the Orchestrator meant a new door pair at 0, that is a dated line in ADR-0070 later. It is not the accepted
  text, and it would reproduce a path that does not differ.

## 3. What the second pull fits, and U
- **Free, eg half, ≥ 0:** `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE`, at R = 1–6.
- **Held at 0:** their mg halves, the R = 0 entries, and **`PASSED_UNSTOPPABLE`**.
- **Why U is 0, and not 400:**
  1. 400 is a rule value whose pre-registered row, E3 (c), missed and stays NOT MET (`…e0ff0aeb`).
  2. `ADR-0067` item 5 keeps the square a rule, out of the fit.
  3. 400 is derived from E1's and the probed values, which the second pull fits.
- **The cost, stated:** UN alone widened `zugzwang.001`'s depth-9 margin by 85 cp on `main`'s table (29 → 114). The
  second pull goes without that.
- **The `ADR-0067` lines written:**
  - a Status line and two log rows;
  - d5: the tracer traces E4a's four features, eg only, with two checks;
  - d6: the free set, and how the terms enter F3's procedure. K1 (c) seam rows enter no bound. K1 (b)'s literals are
    pins. `zugzwang.001` stays B-T5's safety row;
  - § Consequences item 5's order.
- **Open, the owner's, not decided:** the d6 amendment (the margin-aware form, all relations bounded at once) and
  B-T8's re-confirmation for the second pull.

## 4. Other records written
- `ADR-0056`: row E4's dated line (form (a); the dependency now reads "E1; structure at 0; values from E2's second
  pull, judged in its read"), and D6 item 5's step 3 / 4 line.
- `ADR-0064`: d10's dated line (no door; it supersedes "behind their own door, `…WithoutPasserKings`").
- **No bar moved.** Fences held: no `src/`, `tools/`, ticket, EPIC or board edit.

## 5. Owed lines (BA/PM re-cuts `ABC-271`; nothing here is written on those pages)
**The `ABC-271` page:**
- `adr:` → "`ADR-0070` ACCEPTED 2026-11-04 (owner, form (a), structure only)". DoR row 10 ✅.
- `size:` M → **S** (no switch, no doors, two re-pins). The title drops "behind an ADR-0026 test-only off-door pair".
  The new title is BA/PM's word.
- **Intent:** no intent class and no read. The build is value-identical. The firing figure (29.75 %) is history and
  a forecast for the second pull.
- **Scope:**
  - 1–3: the rules stand, with every value 0 and each rule recorded as the prior in its comment. Scope 3's "a stated
    value below a queen" now reads "0; the rule value 400 is not shipped (ADR-0070 d7)".
  - 4: the memo is 576 KiB.
  - 5 (the switch and door pair): struck. `passerTermsForTest` stays, used from test files only.
- **Acceptance:** K0–K4 replace P0–P8, with K0's exact counts (ADR-0070 d5). K1 (c) is the seam rows at the probed
  values. K2 is exactly the two memo-size re-pins. No games. S2 nps is reported only if the Orchestrator rules as for
  `ABC-270`.
- **Falsifiers:** ADR-0070 F1–F5 replace the page's F1–F6.
- **NFR triggers:** `NFR-009` +128 KiB (576 KiB). `NFR-001` / `G2`: K3. `NFR-005`: K4. `NFR-008`: K1 rows are units.
- **Test notes:** QE freezes K1 (a)'s passer positions and K1 (c)'s fixtures before the build. Whether UAT is owed is
  the standing rule's: the diff has production lines, so the QE verdict signs it.
- **Dependencies:** `ABC-271` before the second pull. The second pull's fit is taken on a `main` that contains it.

**`EPIC-011`:**
- Row E4: E4a → `ADR-0070` ACCEPTED (form (a), structure only at 0).
- Row E2: the second pull fits KD and FP (eg ≥ 0, mg 0) and holds U at 0. It is a new attempt under F6 with its own
  PREREG.
- Phase 4 order: `ABC-271` (structure) → E2's second pull. One read judges both.
- Owner items open before the second pull: the `ADR-0067` d6 amendment and B-T8's re-confirmation.

**The board:** the Orchestrator's.
