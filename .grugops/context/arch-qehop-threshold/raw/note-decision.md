# `arch-qehop-threshold`: `T-QEHOP-GROWTH` re-arms at **5,500 note files** by a lead-time rule; the host change starts a new `F` series (0.030 s CPU / 0.020 s wall); the next read uses `qe-qehop-growth`'s Linux port. Nothing goes to the owner

Rulings in `ADR-0035` § Addendum 2026-11-01 (after qe-qehop-growth), C2–C5, committed `b5bb0ce4` on `grugops/arch-qehop-threshold`. Catalog: `plans/nfr-catalog.md` § "`N8-LANE` at `ABC-105`", new last subsection, and the floors block.

## Scope
`T-QEHOP-GROWTH` on `tools/grugops/qe-hop-integrity.test.ts` only. No level, bound, `N8-LANE` text or table row moves. Records only; nothing run.

## C2 (`QE-QHG-d`): the next threshold is 5,500
- **Rule, replacing B3's "by the same arithmetic":** the largest multiple of 100 not above N0 + (b − hi)/s − 7 × r. b = 0.650 s; hi = the latest MET's x(7); s = the steeper of A3's slope (81.75 µs a note) and any same-host two-point slope; r = the faster of the 7- and 14-day growth rates on `main`. In words: one week of the fastest recent growth short of the projected upper-end crossing.
- **Today:** 4 272 + 1 957 − 7 × 104 = 5 501 → **5,500**. `main` holds 4 287 at `28e46464`, so it fires in ~1 213 notes (12–16 days at 104–74 a day).
- **Why:** A3's 75 % was the means; "room to land under the bound" with time to act was the purpose. At 74–104 notes a day the 75 % point (≈ 4 670) is ~400 notes on, and a read there projects 0.488 s and can only read MET; ~400 notes is ~0.033 s of slope, inside one interval.
- **Expected at 5,500:** +0.555 s (median), +0.590 s (upper end; six ticks under). Leaves 729 notes (7–10 days) before the upper-end crossing ≈ 6 229, 1 157 before the median crossing ≈ 6 657. Robust to a 50 % steeper slope (median 0.606 s).
- **Rejected:** 75 % / same-headroom (≈ 4 640–4 700); the crossing itself; a two-week lead (≈ 4 700); a calendar backstop; pulling the reads lever (MET); a fourth arm for a paired slope.
- **Whose word:** a rule change, not arithmetic, but B3 is this role's text, the threshold is a LOW scheduled re-read, and B3's only owner route is NOT MET. **No one's word needed; nothing to the owner.**

## C3 (`QE-QHG-b`): new `F` series on `oeselg-dev`
- The host change moves per-file cost (B 0.575 s on the M3, 0.370 s here), so the series breaks (`ADR-0042` ruling 6, `ADR-0040` decision 4); the catalog's re-base rule makes M3 figures M3 history.
- One admissible reading → largest governs: **`F` = 0.030 s CPU / 0.020 s wall.** M3 `F` 0.020 / 0.020 kept as history. Continuing the series gives the same figures, so the ruling sets the basis, not the number. The twin is floor-admitted (A1). 650 ms = 21.7 × F.

## C4 (`QE-QHG-c`): method
- Next read: `qe-qehop-growth`'s pre-registration (`833192d7` + `8dfbabf5`, blob `3aab3adc`) and its harness by sha256 (lane `0c23701b…`, host `c3dda32f…`, gate `576481d3…`, sampler `c7058df6…`, window `738d3a62…`, readout `ea2ac1aa…`, placeholder `f730fdb2…`). Its own pre-registration per B1; any harness change is a stated adaptation.

## C5 (`QE-QHG-a`): noted, no action
- MET admitted only by A1's tick; A1's rollback has not fired (0.160 s under at the upper end). Watch: if the next read's interval is within 0.030 s of 650 ms, the timer route is owed before the read after it.

## Risks
- s is the M3 slope; the `oeselg-dev` slope is `UNKNOWN - verify` until the next read gives a same-host pair.
- Growth rate is not stable (39 → 74–104 a day); the count-based trigger self-corrects in notes, not in days.
