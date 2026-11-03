# arch-Q1-see-pruning decisions: `ADR-0069` is written PROPOSED, **premise MET on `main`**. Form QS is chosen by the pre-registered rule: quiescence skips a SEE-losing capture (`see < 0`) out of check, and the main search is unchanged. It amends `ADR-0024` d4. Acceptance is the owner's. Recommended slot: merge before `ABC-239`'s candidate freezes for B-T8 and its C2′ read, otherwise after `ABC-239` merges, never in between. Owed lines and a BA/PM ticket cut are listed below

Architect/Design, task `arch-Q1-see-pruning`, records only, on `grugops/arch-Q1-see-pruning` from `main` `dc7dc15d`. The PREREG `…1f71e417` was sealed and committed (`a9af0ec8`) before any measured run. The results are in this task's observation note. **ADR id: `ADR-0069`.** `arch-ABC-270` writes `ADR-0068` in parallel, so this task took the next id, per the brief.

## 1. The verdict, by the sealed rule
- **Every form passes both gates.** Pay: ≤ 0.95× on the four d8 readings, and reach ≥ +0.10 ply. Safety: drift ≥ 90 % within 25 cp with max ≤ 150 cp; mate floor 0; zugzwang 7 / 7; `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
- **Choice rule:** QSM +0.879 is the best reach. QS +0.837 is within 0.05 of it, so **QS** (the earlier form) is chosen. QSc +0.495 is not within 0.05.
- **QS:** d8 `search()` 0.7208 / 0.2652 and `chooseMove` 0.5909 / 0.2160; reach 5.879 → 6.716.

## 2. The design of record (`ADR-0069` decisions 1–13)
- **The rule.** In `quiesce`, out of check (the stand-pat branch), a LOSING capture is skipped before it is made.
  - LOSING means: it does not promote, the mover is not the king, the victim is worth less than the attacker, and `see < 0`.
  - In check, every evasion is searched. The order is unchanged (MVV-LVA, the whole list sorted), and so is the cap of 8.
  - A checking capture is skipped like any other. QSc measured that exemption at −0.34 ply with no safety gain.
- **The evaluator.** A new pure module, `src/see.ts`, exports `see`, `isLosingCapture` (threshold 0, fixed) and `seeScratchByteLength`.
  - It uses no per-call allocation (288 B fixed).
  - It is `ADR-0065` d2's algorithm with Q1's threshold.
- **The main search is unchanged.** QSM was rejected by the choice rule, and its main-rule audit showed a 325 cp error at 1.72 % flips. It stays a named follow-up with its own PREREG.
- **The switch.** `seePruning` sits in both recursions. It reaches `quiesce` through a new optional `QuiescenceRules.seePruning` field: absent means off, and the new constant record is `RULES_SEE_PRUNING`.
  - **A caller that builds its own rules record does not opt in.** So `ABC-239`'s "quiescence equals static" filter (`arch-ABC-239` `extract.ts` passes its own literal) does not move when Q1 merges.
- **The doors.** `searchWithoutSeePruning` and `chooseMoveWithoutSeePruning`, TEST-ONLY. Every older door turns the switch off. `ABC-077` `A6` +1, `ABC-078` `A4` +1. Whether `A6` counts a re-export is `UNKNOWN - verify`; the build re-exports nothing.
- **Bars for the build:**
  - drift ≥ 93 % within 25 cp, max ≤ 144 cp, 0 sign changes;
  - mate floor d5 → d5: 0;
  - zugzwang 7 / 7; `G1` ≥ 54 / 58, no NEWLY-MISSED;
  - d8 ≤ 0.78× on all four readings; reach ≥ door + 0.55 (6.429);
  - `G6` by its rule, graded; `G2` not re-read, since `evaluate*.ts` stay byte-identical;
  - C2′ GAIN ≥ 50.0 / 100 at 100 ms; S′ at E 1 810; the Levels deep lane.
  - Instrument-check counts for the build: head 605 117 / 406 787 / 766 275 / 87 475, reach 6.716; door 839 514 / 1 533 901 / 1 296 788 / 404 930, reach 5.879.
- **`ADR-0024` d4 is amended:** "static exchange evaluation" leaves the out-of-scope list for quiescence pruning. Delta pruning and quiet checks stay out.

## 3. The slot (the Orchestrator's standing slot: before `ABC-239`'s merge-read)
- **Agreed, with one sharpening.**
  - Q1 is search-side (`src/see.ts`, `quiescence.ts`, `search.ts`, `engine.ts`). `ABC-239` is evaluation-side (`evaluate-params.ts`, its tool). The files do not overlap.
  - Decision 6 keeps the tuner's data filter fixed.
- **The sharpening:** B-T8 (the owner-approved ~5 h outside pair) reads `ABC-239`'s candidate before it merges.
  - If Q1 merged between B-T8's start and `ABC-239`'s merge, `ABC-239` would rebase onto Q1. B-T8 would then have read a candidate that is not what merges.
  - **So Q1 merges before `ABC-239`'s candidate is frozen for B-T8 and its C2′ merge-read, or after `ABC-239` merges. Never in between.**
- **Recommended:** before. Q1 is S–M with a measured +0.84 ply at the 100 ms node budget, so every later C2′ read (`ABC-239`, `ABC-270`) is then taken on the deeper search the product will ship.
- One at a time on the host (one core, the shared lock). An SE hop for Q1 can run while `ABC-239`'s data pin is prepared. QE's C2′ for Q1 (100 games at 100 ms) is ALONE.
- **`ABC-270`** (E3a, `ADR-0068`) touches the evaluation only. If Q1 merges first, its build re-reads its instrument counts on the new `main`, which is the standing rule.

## 4. Effort
**S–M.** `src/see.ts` (~120 lines plus the `A1` fixture), about 5 lines in `quiesce`, the switch through two recursions, two doors, the re-points, and the rows of decision 10. One SE hop and a QE hop with C2′ (100 games at 100 ms), S′ and `G6`.

## 5. Lines owed (not edited here; the fences forbid it)
- **`ADR-0056`** (Architect, next fold):
  - (a) Row Q1: dependency "`ADR-0024` d4 (owner `Q-3K-9`, pending)" → "`ADR-0024` d4 opened by `Q-3K-9` YES (…af126c04); `ADR-0069` PROPOSED, premise met"; the basis gains "pre-registered: QS +0.837 ply, d8 0.22–0.72× (`arch-Q1-see-pruning`)"; the scope reads "quiescence only; main-search rule measured and not taken (QSM +0.042 over QS)".
  - (b) A dated D2 line (2026-11-03): Q1's verdict, the slot of § 3, and "the largest lever any `EPIC-011` probe has read, now pre-registered".
  - (c) The 2026-11-03 line "Until he answers, d4 stays closed and Q1 stays fenced" is superseded by (b).
- **`ADR-0024`** (Architect, at the owner's acceptance): a dated pointer in § Status, `ADR-0053`'s form: "Decision 4 loses one item, static exchange evaluation for quiescence pruning; `ADR-0069` decisions 1–3 give the rule. In force at the Q1 ticket's merge."
- **`ADR-0065`** (Architect, next fold): re-open 1 ("Q1 built first") reads "Q1 designed (`ADR-0069`); an O3s re-open is a new PREREG over the merged Q1". § Consequences: `src/see.ts` will exist with threshold 0; a re-open adds its own −50 test beside it.
- **`EPIC-011`** (BA/PM): the Q1 stub becomes a ticket row. The Phases line: Q1 designed, premise met, `ADR-0069` PROPOSED. Owner questions: `Q-3K-9` answered YES (…af126c04). Dependencies: Q1 before `ABC-239`'s B-T8 freeze, or after its merge (§ 3).
- **A new ticket (BA/PM cut):** "Q1 — quiescence skips SEE-losing captures out of check, behind an off-door pair" (S–M, P2). Its criteria, by reference to `ADR-0069`:
  - `A1`: the SEE fixture, ≥ 20 rows.
  - `A2`: the doors node-equal (`G4`), with the export lists +1 / +1.
  - `A3`: the bounded oracle (decision 11).
  - `A4`: (a) d8 ≤ 0.78× ×4; (b) reach ≥ door + 0.55; (c) `G6`.
  - `A5`: `G1`.
  - `A6`: the C2′ read, GAIN ≥ 50.0, plus S′ at E 1 810 and the Levels deep lane.
  - The rows of decision 10, and `G2` by byte-identity.
  - DoR row 10: "`ADR-0069` accepted by the owner". Until then it is held in Backlog.
- **`ABC-239` page** (BA/PM): one line. Its position filter names the quiescence rules record it calls. With `seePruning` absent, a Q1 merge does not move its dataset. Opting in is a decision for its own page, never an accident of merge order.
- **`ABC-270` page** (BA/PM, optional): if Q1 merges first, the build re-reads `ADR-0068`'s instrument counts on the new `main`.

## 6. Owner question (one)
- **Accept `ADR-0069`?** This also amends `ADR-0024` d4: SEE pruning enters quiescence; delta pruning and quiet checks stay fenced. Without his acceptance nothing is built, and d4 stays as written except for the design opening he already gave.
