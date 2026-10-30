---
id: 20261030T143857Z-ba-pm-decision-ed7c3f3d
kind: decision
by: ba-pm
at: 2026-10-30T14:38:57Z
verified_by: 
confidence: high on the records folded (each figure copied from QE's sealed notes and raw/); nothing run, timed or played
refs:
  - bapm-ABC-241-merge-fold
  - ABC-241
  - ABC-243
  - EPIC-010
  - ADR-0020
  - ADR-0044
  - ADR-0045
  - ADR-0053
  - main 1f6abec4
  - main a649fbc4
  - qe-ABC-241/20261030T143112Z-qe-e2e-decision-2368b03f
  - qe-ABC-241/20261030T143112Z-qe-e2e-observation-5d70bb7c
  - qe-ABC-241/20261030T143112Z-qe-e2e-observation-e6523bfb
  - QE-241-a
  - QE-241-c
  - QE-241-e
  - QE-241-f
  - SE-241-a
  - SE-241-b
  - SE-241-c
  - A3
  - A4
  - A6
  - D11
  - NFR-002
  - NFR-008
  - S-1
  - S-2
  - S-3
  - S-4
supersedes: 
seal: sha256:2d22f3f3429e9d057db76f5e934da0da57e096b96efbc7720c44782d3a3b9e37
---

# bapm-ABC-241-merge-fold: ABC-241 Done at 1f6abec4; smoke ledger row folded; QE-241-a folded into ABC-243 (DoR 10/10, Ready); A3 wording corrected; ADR-0044 D11 pointer to 4 000 ms

BA/PM, records only, at `main` `a649fbc4` (carries `1f6abec4`). No `src/`, `tools/`, `data/` or board edit.

## Rulings
1. **ABC-241 closed.** Front matter `done` / `Done` with `closed:` (merge `1f6abec4`, QE PASS_WITH_GAPS `qe-ABC-241` `…2368b03f`, which signs UAT under Test note 3). A MERGED block records A1–A10 MET, `NFR-002` MET (SE-241-b closed), and each gap's disposition. QE-241-a goes to ABC-243. SE-241-a gets no ticket (no real game can observe it, F3/F7; a crafted-map row pins it). QE-241-b, -d, -e, -f and SE-241-c get no ticket. A closing line sits under the DoR.
2. **A3 wording (QE-241-c, INFO), dated and the old text kept.** "(base: 7.Ng1)" and "(base: 11.Ng1)" are the 1.e4 board's own counts: base counts 3 at ply 13 and 5 at ply 21; head 3 at ply 9 and 5 at ply 17. In play, base claims at 5…Nf6 (ply 10) and ends by fivefold at 9…Nf6 (ply 18), both from the 1…Nf6 board. So the fix moves the claim and the game end by one ply, not four (`qe-ABC-241` `raw/qrows/ticketline.txt`). Head's readings are unchanged and met.
3. **EPIC-010 § The smoke ledger:** the ABC-241 row is copied verbatim from `…5d70bb7c`. D 4/2/4 (6.0), R 6/3/1 (6.5) at 4 000 ms, recorded and not pooled. 0 faults, 0 time losses. Pooled: none computed. Rows waiting at 4 000 ms: ABC-228 7.0 and ABC-241 6.5, 13.5 / 20, INFO only. Flag not evaluable. Tctl D 74.38 / 83.6 °C, R 74.63 / 85.5 °C (width 1). A dated footnote covers the foreign-load overlap (QE-241-f) and repetition endings untouched by the rule (QE-241-e). Tickets table: row 9 ABC-241 Done, row 19 ABC-243 Ready 10/10. A header FOLDED block was added.
4. **ABC-243: QE-241-a folded as Scope 3 / A6 / Pain 3 / Test note 4.**
   - A6: `position fen 4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1 moves h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8`, then `go depth N` at one fixed N in 1–5. Bestmove `d1e1` with `cp 0`. The same root on the raw `keyHistory` list is not 0. QE's QM3 plant (FEN's own key raw) turns the row red.
   - A4 is amended (dated, old kept): exactly one row is added, so the count is base's + 1.
   - Still XS, test-only, no smoke, no UAT. Title extended; filename kept.
   - The `NFR-008` line names the `G8` headroom (9.63 s at qe-ABC-241, 0.37 s); the added wall is `UNKNOWN - verify`, read in A5.
   - Read at `a649fbc4`: the Hash row is still `:753`, and transposition `:19` / `:660` / `:667`. ABC-241 changed `src/uci-session.test.ts` +106 / −2 (an import line, the ABC-230 oracle line, a new describe block at `:1404`).
   - **DoR 9/10 → 10/10, Ready.** Row 10's wait (ABC-241 merged) is met. Rows 2, 4, 5, 6 and 7 carry dated marks. ABC-220's rows in the same file are rebase order only. The front matter is `ready` / `Ready`; the board move is the Orchestrator's.
5. **ADR-0044:** a dated pointer in D11 after the 2026-10-19 fold says "at 3 s" reads 4 000 ms since `e42b637b` (ADR-0053 d10; ADR-0045 FOLDED records D11). The default is still 5 / `DEFAULT_LEVEL`. The same one-line pointer is in § Status's 2026-10-19 block, which states `LEVELS[5]` = `{ 3000, 0 }` in the same fold. No decision change. Row 13 of the alternatives table (level 3, 3 s) is history and was left.
