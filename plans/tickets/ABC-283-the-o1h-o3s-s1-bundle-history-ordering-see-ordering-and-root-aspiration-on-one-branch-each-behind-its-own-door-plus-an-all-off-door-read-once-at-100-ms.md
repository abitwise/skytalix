---
id: ABC-283
title: "The O1h + O3s + S1 bundle: the history heuristic (ADR-0063), SEE ordering of losing captures (ADR-0065, on src/see.ts) and root aspiration windows (ADR-0066), built on one branch, each behind its own ADR door plus one door that turns all three off; P0 all-off equals main exactly, the ADR-0064 d7 safety rows, NFR-008 ≤ 10 s; then ONE read, 100 games at 100 ms against main, GAIN ≥ 50.0, never re-played"
status: done
column: Done
size: L
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0063 (with K3; ABC-233), ADR-0065 (ABC-234) and ADR-0066 (ABC-236) ACCEPTED as a bundle 2026-11-04, in force at this merge (58e90d07), by the owner's word (orch-2026-10-30a …4c4cb03d ruling 2) on qe-ABC-283 PASS_WITH_GAPS …de1dc511; Status lines arch-ABC-283-accept …cbf0bc7b. The three pay premises were overridden, not met. (Was: each PROPOSED with its pay premise not met on main, re-opened as one bundle by the owner's word; doors follow ADR-0026 d10's pattern.)"
---

# ABC-283: the O1h + O3s + S1 bundle, one branch, one read

> **DONE 2026-11-04: MERGED `58e90d07`; B5'S PASS BRANCH APPLIES; THE THREE ADRs ACCEPTED AS A BUNDLE, by BA/PM** (task
> `bapm-ABC-283-done`, records only, at `main` `fd6b595f`; nothing run). Sources: QE's verdict `qe-ABC-283` `…de1dc511`
> and gaps `…f8f8c2cc`; the Orchestrator's dispositions `orch-2026-10-30a` `…2409cec9`; the re-read on the merged tree
> `se-ABC-283-merge` `…f7f63e1d`; the Architect's Status lines `arch-ABC-283-accept` `…cbf0bc7b`; the board (Done).
> - **The outcome: PASS_WITH_GAPS, no blocking gap.** QE's verdict signs UAT (the owner's delegation, 2026-10-22).
>   - B1 P0: 6 / 6 byte-equal. B2: mate floor d5 0 / 190 (`search()`) and 0 / 188 (`chooseMove`); zugzwang 7 / 7;
>     `G1` 54 / 58, none newly missed. B3 `NFR-008`: graded median 9.60 s ≤ 10 s.
>   - **B4: C2′ 59 / 27 / 14 = 66.0 / 100 ≥ 50.0, MET** (Elo +115.2 ± 67.0), played once. S′ 6.0 / 10 against E 1 810
>     (information). The Levels deep lane 58 / 58.
> - **B5, pass:** merged (`58e90d07`, with `ABC-271` in), and `ADR-0063` (with K3), `ADR-0065` and `ADR-0066` are
>   ACCEPTED as a bundle, in force at this merge. Before it, QE-283-i's re-read on the tree merged with `ABC-271`
>   (`…f7f63e1d`): every deterministic count equals QE's; `npm test` 2 687 / 2 687; the default lane 9.77 s (quiet read).
> - **§ Open, as ruled** (`…c7609f51` 4, the rulings in `…3851bf43`): the Levels deep lane a bar; S′ and the per-ADR
>   drift bars information; `NFR-005` reported; B2 (c) "none newly missed" as written.
> - **Gaps carried, none a bar:** QE-283-a MEDIUM (`R-N8H-1` → MEDIUM; the Security/NFR hop after the merge,
>   `secnfr-nfr008-1104`); QE-283-b LOW (R-283-LMR, `ADR-0060` § Status); QE-283-c LOW (the optional iteration-5 mate
>   row, `ABC-236` test note 3); QE-283-g (this front matter, now fixed).
> - **Released:** the slot on `src/search.ts` / `src/engine.ts`. `ABC-282` (W1) is unheld; `ABC-286` (P4) and `ABC-288`
>   (O2c) are unheld for their probes; `ABC-284` (P1) points at R-283-LMR (`…2409cec9` 5).
> - `ABC-233`, `ABC-234` and `ABC-236` are Done, delivered by this ticket.

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-W1-bundle-cut`, records only, at `main` `09694a4e`;
> nothing run, built or timed). Source: the owner's *"merge ABC-233, ABC-234 and ABC-236 into one branch and do one
> test run"* (`orch-2026-10-30a` `…4c4cb03d` ruling 2). **Every bar below is copied from that note.** None is added
> and none is loosened. Where the note is silent, this page says so and leaves the question to the Orchestrator
> (§ Open, not bars).
> - **The re-open is requirement-level and the owner's.** His word overrides the three not-met premises (each ADR's
>   F4: the ≤ 0.95 × pay gate). `ABC-233`, `ABC-234` and `ABC-236` stay as the design pages. This ticket is the
>   build and the read.
> - **The build:** the Software Engineer, on `grugops/ABC-283` (the Orchestrator's brief `se-ABC-283`).
> - **The board move to Ready for Dev is the Orchestrator's.**

## Problem

- **User:** the owner at level 5, and every later read of this epic at the 100 ms node budget.
- **Pain:** three ordering and window changes were designed, probed and parked one by one. Each passed its safety
  gate and missed its own pay gate alone, on `src/` tree `58fa3eb4` (before E1). These are the design-of-record
  readings at d8, against ≤ 0.95 ×:
  - **O1h** (`ADR-0063`): 1.0011 / 0.7970 / 0.9751 / 0.9832. The killers hold 90 % of quiet cutoffs.
  - **O3s** (`ADR-0065`, S1m): `search()` 0.9011 / 0.9428, `chooseMove` 0.9864 / 0.9548.
  - **S1** (`ADR-0066`, A100): `chooseMove` 0.9836 / 0.9913. The root is already PVS.
- **Value:** whether the three together win games at 100 ms. The node ratios were measured alone, so they are not a
  forecast of the bundle. **The read decides it: one read, never re-played.** S1 fires at 100 ms (70.4 % of nodes at
  47 000, `ADR-0066`), so GAIN is the intent.

## Scope

Each item is built **exactly as its ADR states** (the SE brief `se-ABC-283`).

1. **O1h, `ADR-0063` (`ABC-233`):** the history table, side × from × to, raised by d² with a d² malus, a gravity
   bound, cleared per search, ordered after the killers, in both recursions. Doors `searchWithoutHistory` /
   `chooseMoveWithoutHistory`.
2. **O3s, `ADR-0065` (`ABC-234`):** SEE orders the losing captures (below −50 cp) after the killers in the full-width
   search. It is ordering only, and it reuses `src/see.ts` from `ABC-279`. Quiescence is unchanged. Doors
   `searchWithoutSeeOrdering` / `chooseMoveWithoutSeeOrdering`.
3. **S1, `ADR-0066` (`ABC-236`):** root aspiration windows in `chooseMove` from iteration 5, ±100 cp. Only the failed
   side widens, doubling, and the window goes full past 400 cp. Mate scores keep the full window. Door
   `chooseMoveWithoutAspiration`.
4. **One all-off door:** one test-only door that turns all three off. Its name is the Engineer's, and it is recorded
   in the PR.
5. **Every older door turns all three off** (`ADR-0026` d10's ladder). Rows re-point by reference (`ADR-0064` d7's
   list). No zugzwang depth is re-pinned.

## Out of scope

- **Each item's pay gate** (≤ 0.95 × at d8). The owner's word re-opens the bundle over it. The node ratio is reported
  (the SE brief), not graded.
- **A read per item, or a re-read of any subset.** There is one read, of the bundle.
- **Re-tuning after the read:** δ, the margin and the history bound are not changed, and no form is swapped.
- **O2c, P1 and P4,** which wait on history (`ADR-0063` decision 11). They stay as they are until this ticket is
  disposed.
- Any change to evaluation, quiescence, the transposition table or time use (`ABC-282`).

## Acceptance criteria

The bars are the owner's (`…4c4cb03d` ruling 2), copied exactly. They are not loosened after Ready.

- **B1, P0 (all off equals `main`):** with all three off, the node counts equal `main`'s **exactly**. The SE brief
  spells this as `chooseMove` and `search()` on kiwipete and position-6.
- **B2, the `ADR-0064` d7 safety rows:**
  - (a) **the mate floor.** BA/PM reads "floor" as **0 violations**, as every row of that name on this project reads.
  - (b) **zugzwang 7 / 7** (`ADR-0050` d9's rows, at their recorded depths, never re-pinned deeper).
  - (c) **`G1`: none newly missed.**
- **B3, `NFR-008`: the default lane ≤ 10 s.** New rows go in the deep lanes. `main` reads 9.42 s, so there is 0.58 s
  of headroom.
- **B4, then ONE read** (only after B1–B3 are met):
  - **100 games at 100 ms, the bundle against `main`,** through `ABC-255`'s harness in C2′'s shape (`EPIC-011` § The
    per-change rule, by reference).
  - **The PREREG is sealed first,** as a note before the first game. It names the candidate and base SHAs, the
    control and the bar.
  - **GAIN: MET at ≥ 50.0 of 100.**
  - **It is never re-played.**
- **B5, the disposition:**
  - **Pass:** merge, and `ADR-0063`, `ADR-0065` and `ADR-0066` are **accepted as a bundle**.
  - **Miss:** **not merged**, and the three stay parked.
- **Reported, not bars** (the SE brief): the bundle's node ratio on the original ADRs' probe positions. Snapshot
  changes, if any, are listed in the PR.
- **Standing gates:** lint, typecheck, unit and build (`quality.mandatory_gates`), the QE hop, and merge on green.

## What happens on a miss

- **B4 below 50.0:** NOT MET. The branch is not merged, and the three ADRs and pages stay parked (B5). A
  `failed-attempt` note records the reading. The read is not re-played, and no subset is read instead.
- **B1–B3 red before the read** is a defect for the Software Engineer ("bars before handoff", `se-ABC-283`), not a
  miss. The read does not start until they are met.
- **Either way, the slot on `src/search.ts` / `src/engine.ts` is released** for `ABC-282`.

## NFR triggers

- **`NFR-008`** (`npm test` ≤ 10 s; 9.42 s on `main`): B3. The heavy rows go in `SEARCH_DEEP` / `ENGINE_DEEP`.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): the history table is 32 KiB (`ADR-0063`), and `see`'s scratch is 288 B
  fixed (`ABC-279`). Nothing grows per search.
- **`NFR-005`** (the depth-6 floor at `LEVELS[5]`): not among the owner's bars. It is covered by `G6` only if the
  Orchestrator rules so (§ Open).
- **`NFR-004`:** none. No time rule changes.
- **Security:** none.

## Test notes

1. **The PREREG before any game** (B4). It is sealed, then played once.
2. **The probe scripts** are in `.grugops/context/arch-ABC-233/raw`, `arch-ABC-234/raw` and `arch-ABC-236/raw`. They
   were measured on tree `58fa3eb4`. `main` has moved since (E1, `ABC-274`, `ABC-279`, `ABC-270`), so their counts
   are not P0's: P0 is all-off against today's `main`.
3. **The door ladder:** the new doors sit above `seePruning` (`ABC-279`) in `ADR-0026` d3's ladder. Every older door
   reads its base self.
4. **UAT is owed.** The QE verdict signs it (the 2026-10-22 delegation).

## Size and priority

- **Size: L.** Three M-sized designs on one branch, in both recursions, with five doors and an all-off door, and one
  read.
- **Priority: P2** (the brief).

## Dependencies

- **None hard.** The three ADRs are the design (PROPOSED, re-opened by the owner's word), and `src/see.ts` is on
  `main` (`ABC-279`, merged `7b70e268`).
- **`ABC-282` (W1) waits on this ticket** on `src/engine.ts`: it builds after this merges or misses.
- **`ABC-271` (E4a)** edits evaluation, not ordering. There is no file collision expected. Whichever merges second
  re-reads its counts.

## Open, not bars (for the Orchestrator)

The owner's note does not name these. This page adds none of them as a bar.

1. **S′ and the Levels deep lane.** `EPIC-011` § The per-change rule pairs them with C2′. The owner's *"do one test
   run"* names the 100 games only. Do they run as guards, run as reports, or are they waived?
2. **Each ADR's own drift bars** (its safety gate). They are not among the d7 rows. Are they reported or graded?
3. **`G6` / `NFR-005`.** Not named. Is it read?
4. **B2 (c)'s wording:** "none newly missed" is copied as written, with no "≥ 54 / 58" added.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ three parked designs, each short of its pay gate alone; the owner asks for one read of the three together |
| 2 | scope and out-of-scope | ✅ scope 1–5, each as its ADR; pay gates, per-item reads and re-tuning out |
| 3 | INVEST | ✅ L, one branch and one read, by the owner's word; independent of evaluation |
| 4 | testable, measurable acceptance | ✅ B1 exact; B2 0 / 7 of 7 / none newly missed; B3 ≤ 10 s; B4 ≥ 50.0 of 100, once; B5 merge or park |
| 5 | dependencies known | ✅ none hard; `ABC-282` after it |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s; `NFR-009` 32 KiB + 288 B |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the three ADRs are the design. Their acceptance follows a pass (B5), by the owner's word. The four § Open items do not block the build |

**DoR 10/10. Ready.** *2026-11-04 (`bapm-ABC-283-done`): **Done** (merged `58e90d07`; QE PASS_WITH_GAPS `…de1dc511`).*
