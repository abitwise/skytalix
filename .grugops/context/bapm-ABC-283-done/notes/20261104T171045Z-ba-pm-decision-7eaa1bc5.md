---
id: 20261104T171045Z-ba-pm-decision-7eaa1bc5
kind: decision
by: ba-pm
at: 2026-11-04T17:10:45Z
verified_by: 
confidence: high: every page line is the Architect's owed line (cbf0bc7b § Owed, items 1-4) on the owner's word (4c4cb03d) and the Orchestrator's dispositions (2409cec9) on QE's recorded verdict (de1dc511); pages 7ce32f23; no bar, size or priority moved; nothing run. Five judgments flagged (J1 the adr Was: bracket, J2 ABC-288 title, J3 extra EPIC-011 rows, J4 ABC-233 Dedupe row, J5 ABC-298 and board cards untouched)
refs:
  - bapm-ABC-283-done
  - grugops/bapm-ABC-283-done
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - ABC-282
  - ABC-284
  - ABC-286
  - ABC-288
  - ABC-298
  - EPIC-011
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0060
  - ADR-0056
  - ADR-0071
  - K3
  - O1h
  - O3s
  - S1
  - C2-prime
  - UAT
  - R-283-LMR
  - R-BUNDLE-1
  - QE-283-b
  - QE-283-c
  - QE-283-g
  - fd6b595f
  - 58e90d07
  - 7ce32f23
  - arch-second-pull-1104
  - orch-2026-10-30a/20261104T130054Z-orchestrator-decision-4c4cb03d
  - orch-2026-10-30a/20261104T164704Z-orchestrator-decision-2409cec9
  - orch-2026-10-30a/20261104T165451Z-orchestrator-decision-dda43b71
  - orch-2026-10-30a/20261104T165714Z-orchestrator-decision-ce2883d8
  - arch-ABC-283-accept/20261104T165453Z-architect-design-decision-cbf0bc7b
  - qe-ABC-283/20261104T164437Z-qe-e2e-decision-de1dc511
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-f8f8c2cc
  - se-ABC-283-merge/20261104T170008Z-software-engineer-observation-f7f63e1d
supersedes: 
seal: sha256:55e42f49914f9ce9254595e09b99daceeea9f04670e9dfd5472d7ac365a6098a
---

# bapm-ABC-283-done decision: ABC-283's merge folded into the pages. ABC-233, ABC-234 and ABC-236 are Done, delivered by ABC-283; ABC-283 is Done (B5's pass branch); ABC-282 unheld; ABC-286 and ABC-288 unheld for their probes; ABC-284 points at R-283-LMR

BA/PM, task `bapm-ABC-283-done`, records only, on `grugops/bapm-ABC-283-done` from `main` `fd6b595f`. Nothing was run
except the note seal and the records-path check. Pages are in `7ce32f23`. Inputs: the Architect's owed lines
(`arch-ABC-283-accept` `…cbf0bc7b` § Owed (BA/PM), items 1–4); the owner's word (`orch-2026-10-30a` `…4c4cb03d`
ruling 2); the Orchestrator's dispositions `…2409cec9` (1 the pre-merge re-read, 5 the unholds), the re-pins
`…c7609f51`, K3 `…6c6fb0be` and the § Open rulings `…3851bf43`; QE's verdict `qe-ABC-283` `…de1dc511` and gaps
`…f8f8c2cc`; the merged-tree re-read `se-ABC-283-merge` `…f7f63e1d`; the owner's bundling direction `…dda43b71` item 3
and his risk acceptance R-BUNDLE-1 `…ce2883d8`; the board at `fd6b595f` (ABC-283 Done, merged `58e90d07`;
"ABC-233/234/236 delivered by ABC-283").

## ABC-233, ABC-234, ABC-236 (item 1): Done, delivered by ABC-283; DoR 10/10
- Front matter `status: done` / `column: Done`, to match the board's line. The board cards for these three still sit
  in a Backlog list (board lines for `[ABC-233]`, `[ABC-234]`, `[ABC-236]`); moving them is the Orchestrator's.
- `adr:` is the Architect's line, word for word in substance: `ADR-0063` (with K3) / `ADR-0065` / `ADR-0066` ACCEPTED
  2026-11-04 as a bundle by the owner's word (`…4c4cb03d` ruling 2) on `qe-ABC-283` PASS_WITH_GAPS `…de1dc511`
  (C2′ 66.0 / 100); in force when `ABC-283` merges (merged `58e90d07`); the premise was overridden, not met. The old
  PROPOSED / parked line is kept in brackets as "Was:".
- DoR row 10 → ✅ "ADR accepted as a bundle (`ABC-283`)"; the old text struck. DoR line: 10/10, Done.
- A new dated top block on each page names `ABC-283` as the build and supersedes the PARKED banner and the re-open
  block, which stay as written.
- Specific lines:
  - `ABC-233`: 32 KiB, not 16 KiB. The page has carried 32 KiB since 2026-11-02 (`bapm-records-1102c`: § NFR triggers
    and DoR row 6), so `ADR-0063` § Consequences' "(BA/PM)" line was already discharged; scope 1 gains a dated as-built
    line (side × from × to, 32 KiB) with K3's quiet key max(0, h).
  - `ABC-234`: the build reuses `src/see.ts` (`ABC-279`); its −50 test is its own (`losingForOrdering`), beside Q1's 0.
    Scope 1 gains a dated as-built line.
  - `ABC-236`: the KRK mate row at iteration 6, a pin; `ADR-0066` d9's "iteration 5 or later" holds. QE-283-c's
    optional iteration-5 mate row is test note 3 (not owed).

## ABC-283 (item 2): Done; B5's pass branch applies
- Front matter `ready` / `Ready` → `done` / `Done` (QE-283-g closed). `adr:` → ACCEPTED as a bundle 2026-11-04, in
  force at this merge (`58e90d07`); the old line kept as "Was:".
- A dated outcome block: B1–B4 as QE read them (P0 6 / 6; floor 0 / 190, 0 / 188; zugzwang 7 / 7; `G1` 54 / 58 none
  newly missed; `NFR-008` graded 9.60 s; C2′ 59 / 27 / 14 = 66.0 / 100, Elo +115.2 ± 67.0; S′ 6.0 / 10, information;
  Levels 58 / 58); the QE-283-i re-read on the merged tree (`npm test` 2 687 / 2 687; lane 9.77 s); § Open as ruled
  (`…3851bf43`); the carried gaps (QE-283-a → `secnfr-nfr008-1104`; QE-283-b R-283-LMR; QE-283-c; QE-283-g); the slot
  released.

## EPIC-011 (item 3, plus the bundling pointer)
- § Phases rows O1h, O3s, S1: a dated line, accepted as a bundle, delivered by `ABC-283`.
- § Tickets rows 7, 8, 9 (state → Done, DoR → 10/10) and 35 (state → Done), each with a dated line.
- § Dedupe audit: the three rows gain "delivered by `ABC-283`; Done".
- § Dependencies: the `ABC-233` → O2c → `ABC-234` → Q1 line, the Search side line, and the `ABC-236` "parked, orders
  nothing" line (superseded).
- The `bapm-W1-bundle-cut` banner's "stay as the design pages" bullet gains the outcome.
- § The per-change rule: one dated pointer to the owner's bundling direction (`…dda43b71` item 3) and R-BUNDLE-1
  (`…ce2883d8`), naming the Architect's draft (`arch-second-pull-1104`, in flight) as the rule's home. The rule itself
  is not written.
- A new top block lists the changes.

## Unholds (item 4)
- `ABC-282` (W1): a new top block lifts the "until `ABC-283` merges or misses" hold (`…2409cec9` 5) and names the
  merge-first carries already on the page (`ADR-0071` D12: D4 per aspiration pass, b re-read and frozen, A0 re-read
  on the new merge-base, `ADR-0066` d5's dated line, the text conflicts). § Dependencies, DoR row 5 and the line under
  the DoR gain a dated line. DoR 10/10, Ready, unchanged.
- `ABC-286` (P4), `ABC-288` (O2c): a new top block, "unheld for its probe"; the § Dependencies `ABC-283` bullet is
  marked met; DoR row 10 stays ❌, now on the Architect's probe and the ADR only. DoR 9/10, Backlog.
- `ABC-284` (P1): under trigger (2), a dated pointer to R-283-LMR (`ADR-0060` § Status, 2026-11-04): it names the
  premise; it does not re-open P1. § Dependencies' premise (2) line gains the same. Still parked, DoR 9/10.

## Judgments, flagged
- **J1, the adr line kept with a "Was:" bracket** on all four pages, so the PROPOSED history stays readable in the
  front matter. Drop the bracket if you prefer the Architect's line alone.
- **J2, `ABC-288`'s title changed** (drops "Held until ABC-283 … merges"; now "Held on the Architect's probe and ADR
  (ABC-283 merged 58e90d07 …)"). The file slug is kept, because sealed notes cite paths. `ABC-286`'s title is still
  true as written (its second condition, the joint probe, is unmet), so it is not changed.
- **J3, EPIC-011 rows beyond the Architect's list:** § Phases rows P1, P4, O2c, W1 and § Tickets rows 34, 36, 38, 40
  each gained one dated line for the unholds and the pointer, so the epic agrees with the pages. Revert them if you
  want the epic to carry only the Architect's list.
- **J4, `ABC-233`'s Dedupe audit row** did not say "parked", but it gained the outcome line with the other two.
- **J5, not touched:** `ABC-298` (V3), whose page says it waits its turn after `ABC-283` and on its ADR; it was not in
  the brief. The board cards (`[ABC-233]`, `[ABC-234]`, `[ABC-236]` in a Backlog list; `[ABC-282]`'s "Held: builds
  after ABC-283" text; `[ABC-286]` / `[ABC-288]`) are the Orchestrator's.
- No bar, size or priority moved. No ADR, board or `src/` line was edited.
