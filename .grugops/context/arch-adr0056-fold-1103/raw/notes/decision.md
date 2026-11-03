# arch-adr0056-fold-1103: the `ADR-0056` lines owed by `arch-ABC-234` (`…a4ed96aa` § 5) and `arch-ABC-236` (`…0886976b` § 7) are folded; `ADR-0065` and `ADR-0066` status lines read "PROPOSED, premise not met; ticket parked by the Orchestrator 2026-11-03"

Architect/Design, task `arch-adr0056-fold-1103`, records only, on `grugops/arch-adr0056-fold-1103` from `main` `af15cbc9`. Nothing run. Rulings applied: `orch-2026-10-30a` `…24990015` (ABC-234 parked; `Q-3K-9` pending) and this task's brief (ABC-236 parked).

## 1. `ADR-0056`, from `…a4ed96aa` § 5
- (a) D2 row O3s: "`ABC-234` (fenced, A0)" → `ADR-0065` PROPOSED, premise not met on `main` (S1m `chooseMove` d8 0.986 / 0.955); A0 ruled (d4 fences Q1, not O3s); parked.
- (b) Survey row "SEE for ordering": adds "`ADR-0065`: premise not met, 2026-11-03".
- (c) `EPIC-010` map row `ABC-234`: "`ADR-0024` d4 re-open evidence (A0), ADR" → "`ADR-0065`: premise not met; parked (2026-11-03)".
- (d) D2 row Q1: size "S after O3s" → "S–M, carrying `see` (`ADR-0065` decision 2)"; dependency "O3s; `ADR-0024` d4" → "`ADR-0024` d4 (owner `Q-3K-9`, pending)"; basis adds the diagnostic "+0.88 ply reach, d8 0.22–0.68× (`arch-ABC-234`, not pre-registered)".
- (e) A dated D2 line (2026-11-03) for rows O3s and Q1 and the ranking: O3s parked; Q1 the SEE lever by diagnostic; `Q-3K-9` unanswered so d4 stays closed; the Orchestrator's recommended Q1 slot (after `ABC-236`, before `ABC-239`) recorded as his, the order not changed.

## 2. `ADR-0056`, from `…0886976b` § 7
- (a) D2 row S1: "`ABC-236`" → `ADR-0066` PROPOSED, premise not met on `main` (A100 d8 0.9836 / 0.9913); fires at 100 ms; parked.
- (b) `EPIC-010` map row `ABC-236`: "new ADR" → "`ADR-0066`: premise not met; parked (2026-11-03)".
- (c) C2′ § Depth-gated mechanisms: the S1 bullet is removed; S1 is added to "Rows that act at shallow depth fire at 100 ms" with "measured: 70.4 % of nodes at 47 000 inside aspiration passes (`arch-ABC-236`)", and an inline dated note keeps the struck text.
- (d) C2′ "C yes" examples: "S1, X2 and P5 by their depth gates" → "X2 and P5 by their depth gates (S1 struck 2026-11-03: measured to fire, `ADR-0066`)".
- (e) A dated D2 line (2026-11-03) for row S1, in the `arch-ABC-233` shape: verdict, the PVS ceiling, not depth-gated (70.4 % / 51.3 %), re-opens on T1 or a deeper shipped search, E1 not a condition.
- (f) D6 item 4 (Phase 3): "Then S1 (`ABC-236`)" marked "parked 2026-11-03, `ADR-0066` premise not met"; O3s in the same line marked "parked 2026-11-03, `ADR-0065`".

## 3. Status lines
- `ADR-0065` and `ADR-0066` § Status each gain a lead line "PROPOSED, premise not met; ticket parked by the Orchestrator 2026-11-03", with its source; the original status paragraph is kept below it unchanged.

## 4. Not done (fenced or not owed here)
- `EPIC-011` and the `ABC-236` page lines of `…0886976b` § 7 are BA/PM's (not in this fence). The `ABC-234` page and `EPIC-011` lines of `…a4ed96aa` § 5 were already folded by `bapm-ABC-234-park`.
- `ADR-0067` (`ABC-239`) not created or touched.
- No other `ADR-0056` row re-derived; O1h's Phase 3 entry is not re-marked (not owed).
