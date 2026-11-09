---
kind: adr
id: ADR-0060
---
# ADR-0060: Late-move reductions come from a log table of remaining depth and move number, one ply less at PV nodes and capped at two plies, in both recursions behind a test-only off-door pair. The history term waits for a history table

## Status

*2026-11-09, dated line by Architect/Design (task `arch-close-1109`, records only, on `grugops/arch-close-1109` from `main`
`e069b49a`). Nothing was run.* **WITHDRAWN, project closed. Never accepted, never in force.** The owner did not take the
2026-11-08 look (`orch-2026-10-30a` `…0b4bc6ba`), and on 2026-11-09 he closed the project with `ABC-284` won't-do
(`…a9c03e07`). `ADR-0026`'s flat 1-ply LMR stands on `main` as written. The text below is kept as the record of what was
proposed; nothing in it is rewritten.

*2026-11-08, dated line by Architect/Design (task `arch-ABC-284`, records only, on `grugops/arch-ABC-284` from `main`
`50ff9250`, `src/` tree `bba42fb7`). Nothing was run.* **The owner chose one try at P1 (`orch-2026-10-30a` `…4d1e0382`,
option 2). The look is written in § The 2026-11-08 look, PROPOSED. The Architect's recommendation is: do not re-open.**
- **The premise named:** decision 1, unchanged, meets every bar on today's `main`, whose tree is not the one it missed on.
  E1, Q1, `ABC-283`'s bundle (history with K3, SEE ordering, root aspiration) and bundle 1 (M3, the countermove) have
  merged since. At depth 8 the door's position-6 tree is 0.13× (`search()`) and 0.24× (`chooseMove`) what it was on
  `e72487e1`.
- **Why not:** of the four rows it must pass, two have a reason drawn from a reading on a near tree (`A4` (a), the 27 cp
  cap). The other two, `zugzwang.004` at d11 and R-283-LMR's same-depth d5 mate floor, have no reason that is not a
  guess, and every reading on a tree with P3's futility went against them. `main` keeps P3's futility.
- **If he takes the look anyway,** the form, the door counts, the probe, the order, the NFR lines, the pins and the
  intent are in that section, and a miss is final for P1 (its question 3).
- **Unchanged:** decisions 1–11, F1–F8, every bar, and R-283-LMR's line below. "Accept ADR-0060" is put only as a
  condition on a pass (its question 2). P1 stays parked until he answers.

*2026-11-04, dated line by Architect/Design (task `arch-owner-answers-1104b`, records only at `main` `65e28f95`; owed at
acceptance by `arch-bundle-1` `…37b7fb23`).* **R-283-LMR gains bundle 1's rows. Nothing in this ADR changes.**
- **The rows** (`arch-bundle-1` `…ed82b408`, exploratory, six rows, not a node trace): M1, M2 and M4 of P4 lose the KRK row
  `6k1/R7/5K2/8/8/8/8/8 w` at d5 in `chooseMove`, and C2–C4 of O2c lose KQK rows. Six of those rows return the door's mate
  with LMR off and every other switch unchanged, P4 still on in the M rows. The others were not re-read.
- **The forms built do not lose them:** `C1+M3`, `M3` and `C1` each read 0 on every d5 row. On P4 that rests on the
  three-piece clause (`ADR-0072`), not on construction.
- **The rule stands:** if bundle 1 turns the d5 floor red, the lever is LMR, this ADR, not history, T or another form
  (`ADR-0056` D5's dated block of this date).

*2026-11-04, dated line by Architect/Design (task `arch-ABC-283-accept`, records only, at `main` `715beb1c`).*
**R-283-LMR is carried here, where a P1 re-open (`ABC-284`) reads it. Nothing in this ADR changes, and P1 stays
parked.**
- **The risk** (ruling `orch-2026-10-30a` `…6c6fb0be`; `arch-ABC-283-mate` `…05ef9fc9`; QE gap QE-283-b, LOW,
  `qe-ABC-283` `…f8f8c2cc`): the same-depth mate floor depends on quiet-move order through LMR. A mating quiet move
  pushed late is reduced, the reduced search scores ≤ α, and no re-search runs. This predates history: on the door
  with its quiet tier reversed the floor loses 6 / 190, and with LMR off it loses 0.
- **The readings under the accepted bundle** (`ADR-0063` with K3, `ADR-0065`, `ADR-0066`; ACCEPTED 2026-11-04, in
  force when `ABC-283` merges):
  - d5, the bar: 0 / 190 in `search()` and 0 / 188 in `chooseMove`, against the all-off doors and base `main`. QE's
    fresh seeded KRK / KQK probe reads 0 / 16 and 0 / 16.
  - d6, a report: `chooseMove` loses 2 / 209 on the 287, the same two rows that base `main` loses. On QE's fresh probe
    it loses 1 / 30 (a KQK row).
- **The rule it sets:** if a later change turns the d5 floor red again, **the lever is LMR, this ADR, not history.**
  The history key stays K3's max(0, h). A P1 re-open's PREREG reads both floors, d5 as the bar and d6 as a report,
  over the history table that `ABC-283` puts on `main` (`ABC-284`'s named trigger 2; decision 11's history term).
- **Not graded** here or anywhere yet. Its owner is Architect/Design.

*2026-11-02, dated line by Architect/Design (task `arch-next-pull`, records only, at `main` `a6039c5b`).* **The joint
probe that this section named, decision 11's history term together with `ADR-0063`'s table and zugzwang as the hard
gate, is measured. No form meets every bar, so P1 STAYS PARKED and no joint ADR is written.**
- **The method:**
  - The set, the doors, the gates and the verdict rule were sealed and committed before any run (decision
    `…4de572aa`, commit `b6deb4e4`).
  - Every bar here was read against this ADR's door in the joint ladder, H1 (history on, flat LMR). Against `main`,
    `A4` (a) and drift were also read, as stricter additions.
  - The instrument reproduces `arch-ABC-233`'s P1-over-H1 counts to the node.
  - Raw: `.grugops/context/arch-next-pull/raw/probe/`.
- **The four forms:** H1, plus decision 1, plus one history term:
  - J1: h > 0 → one ply less;
  - J2: ± 1 by the sign of h;
  - J3: J2, with the cap at 3 for h < 0;
  - J4: h > 0 → not reduced.
- **Every form loses `zugzwang.004` at d11** (F3). J1 and J2 also lose `.001`, and J1 loses `.005` as well.
- **Every form drifts 69 cp in `chooseMove`** at position-6/f3h4, against the 27 cp cap (F1).
- **J3 is the closest.** It meets `A4` (a) (≤ 0.8169 vs H1, ≤ 0.7800 vs `main`), reach (+0.321), the mate floor (0 / 163) and `G1` (56 / 58). It still misses the cap and `.004`.
- **J1, J2 and J4** also miss `A4` (a) on `chooseMove` position-6 (0.8787, 0.8772 and 1.0104). J1 and J4 also miss reach (+0.232, +0.211).
- **What re-opens P1 now:** a new named premise. Examples: an evaluation change that changes the tree (E1 / E2), an
  extension (X1), or an ordering change that leaves history more cutoffs. The history term is no longer an open
  premise. No bar moved, and no form was tuned after the read.

*2026-11-02, dated line by Architect/Design (task `arch-ABC-233`, records only, at `main` `60b76b52`).* **O1h's table
is measured (`ADR-0063`, PROPOSED, premise not met on `main`). P1 stays parked.**
- **The diagnostic** was not pre-registered, so it carries no verdict (`ADR-0063` § Context). Decision 1, unchanged,
  was measured over the history table as its door.
  - It meets `A4` (a): 0.7505 / 0.7952 / 0.7166 / 0.7749.
  - It meets reach: +0.348.
  - It meets the 27 cp cap: drift max 25, where `main` reads 63.
  - It meets the mate floor: 0 / 163.
  - **It loses two zugzwang rows, `.001` and `.004` (5 / 7).** F3 applies, and F3 is never a re-pin.
- **What would re-open P1:** decision 11's history term, measured in a joint pre-registered probe with this table,
  with zugzwang as the hard gate. A re-measure of decision 1 alone over history is not owed.

**2026-11-02, RE-MEASURED AFTER P3: decision 1 misses three bars on `main` `e72487e1`, with futility in force. P1
STAYS PARKED.** This ADR is still PROPOSED and re-opened. No rule is written in, no bar moves, and the build does not
start. Recorded by Architect/Design (task `arch-post-268`, records only, on `grugops/arch-post-268` from `main`
`56b3782d`, whose `src/` is `e72487e1`'s).
- **The trigger** was this section's own next step: "re-measure decision 1 unchanged, under the same bars, on the
  `main` that `ABC-268` merges into". `ABC-268` merged (`ADR-0061`, in force).
- **The method.**
  - The instrument, the head, the door, the bars and the verdict rule were sealed and committed before any run
    (decision `…3a0aac14`, commit `d65e4bfb`).
  - The head is decision 1 exactly: the reopen's R0, with the PV node one ply less, the cap at 2, and r ≤ d − 2. The
    door is today's `main`: the flat rule, with futility on.
  - The instrument is `arch-ADR-0060-reopen`'s driver and predicate. The patch is re-anchored, because each call
    site now sits after the futility skip. `arch-phase2-p3`'s cut audit was added.
  - It ran on a scratch `git archive` of `e72487e1`'s `src/`. There were four batches, each under the host lock and
    each under 5 min. They read node counts only. The scratch copy is deleted. Raw:
    `.grugops/context/arch-post-268/raw/probe/`.
- **The instrument is exact.** The door reproduces `ADR-0061` d9's counts to the node: 888 786 / 1 262 046 /
  1 306 981 / 391 451, with reach 5.837.

| bar (d8 / d9, unchanged) | before P3 (`arch-phase2-rebase`) | **on `e72487e1`** | state |
|---|---|---|---|
| `A4` (a) `search()` d8 kiwipete | 0.7605 | **0.7538** (669 982 / 888 786) | met |
| `A4` (a) `search()` d8 position-6 | 0.7385 | **0.7718** (974 021 / 1 262 046) | met |
| `A4` (a) `chooseMove` d8 kiwipete | 0.7334 | **0.7195** (940 419 / 1 306 981) | met |
| `A4` (a) `chooseMove` d8 position-6, ≤ 0.85 | 0.8699 | **0.8528** (333 830 / 391 451) | **MISSED** by 0.0028 |
| `A4` (b) reach at 47 000, ≥ +0.25 | +0.2526 | **+0.384** (5.837 → 6.221; 67 deeper, 1 shallower, 16 moves differ) | met |
| `A4` (c) `G6` | not read | not read (timing, a build's gate) | — |
| `A3` drift d5 `search()`, ≥ 95 %, ≤ 27 cp, 0 sign flips | 99.47 %, max 63 | **99.47 %, max 63** (position-6/g5h6, 319 → 382); 0 sign, 0 mate-status flips | **MISSED** (cap) |
| `A3` drift d5 `chooseMove` | 100 %, max 18 | **100 %, max 18** (startpos/g2g4); 0 / 0 | met |
| mate floor, door d4 → head d5 | 0 / 163 | **0 / 163** (same-depth report 2 / 189) | met |
| zugzwang, seven rows | 7 / 7 | **6 / 7: `zugzwang.004` plays g7f6 at d11** (151 797 nodes; door h3h4 at 905 900) | **MISSED** (F3) |
| `G1` ≥ 54 / 58, no NEWLY | 54 / 58 | **54 / 58**, none newly missed or solved (door 54 / 58) | met |

- **Reports.**
  - At d8 on the other roots (`search()` / `chooseMove`): position-4 0.833 / 0.719, position-5 0.601 / 0.918,
    startpos 0.641 / 0.733.
  - Reach at 20 000 nodes: 4.842 → 5.095 (+0.253).
  - Firing at d6 on the 190 (`search()`): 226 104 of 1 438 291 non-first moves are reduced (15.7 %), 43.9 % of them
    by two plies. Nodes 0.858×.
  - **Diagnostic, added after the zugzwang miss and not pre-registered:** on `zugzwang.004` the head plays g7f6 at
    d10 and d11, and h3h4 from d12. The door plays h3h4 from d11. Decision 1 needs one ply more. F3 says that is
    never a re-pin.
- **`ADR-0061`'s cut audit, as information (not a bar here).**
  - The sample: 2 930 null-window nodes where decision 1 reduces a searched move deeper than the flat rule does
    (none reduces less, since the PV term never acts at a null window). Every 10th was taken: 210 sampled, 205 read.
  - **Result: 11 flips (5.37 %).** 8 are false fail-lows at d4 and 3 are false fail-highs at d5. The largest error is
    48 cp, and **0 errors are of 100 cp or more**. In 5 nodes the door itself disagrees with the full-window value.
  - On `ADR-0061`'s scale (≤ 0.5 % flips, 0 of 200 cp or more), the flip rate is ten times futility's bar, but no
    error is piece-sized. Deeper reductions move bounds by tens of centipawns, not by a piece.
- **What it means, said plainly.**
  - **P3 did not restore the margin that reverse futility gave on `4d1c0616`.** Futility closes most of `A4` (a)'s
    gap (0.8699 → 0.8528) and lifts reach (+0.25 → +0.38).
  - But the 63 cp line at position-6/g5h6 is unchanged to the centipawn.
  - And `zugzwang.004`, which decision 1 kept on the old `main`, is now lost at its recorded depth. Futility's
    shallow skips and the two-ply reductions together delay h3h4 by one ply.
  - **No bar moves.** F1 (the cap), F3 (zugzwang) and F4 (`A4` (a)) apply as written.
- **The owner's cap question is now moot.** Re-deriving the 27 cp cap (to 94) would still leave `A4` (a) and
  `zugzwang.004`. F3 is never a re-pin, so a "yes" admits nothing. The default stands: keep the cap.
- **What re-opens P1:** a new named premise, with a new pre-registered probe. Decision 11's history term (O1h,
  `ABC-233`) is the one on record. A re-measure on an unchanged premise is not owed again.
  - Which Phase 2 item goes next is the Orchestrator's call. `ADR-0061` F6 names P5 as NEUTRAL with a deep bar; P4
    waits for O1h.
  - The flat 1-ply LMR stays on `main`.
- **Status for the owner:** "accept ADR-0060" is **not put**. It fails on `main`.

*Earlier status, kept:* *2026-11-02, the owner's answer* (`orch-2026-10-30a` `…773be7de`, verbatim *"61 yes, 25 yes, park threads"*): **the
cap question below was not answered, so its default stands: A3's 27 cp cap is kept and P1 stays parked on `main`.**
This is the default the question names ("keep the cap"), not new owner words. Still PROPOSED, RE-OPENED; no rule is
written in, no bar moves, and the build does not start. The flat 1-ply LMR stays on `main`. The suggested next step
is unchanged: re-measure decision 1 unchanged, under the same bars, on the `main` that `ABC-268` (P3, `ADR-0061`,
accepted the same day) merges into, if it merges. Recorded by Architect/Design (task `arch-owner-answers-1102b`,
records only, on `grugops/arch-owner-answers-1102b` from `main` `b47adfbb`). Nothing was run.

**PROPOSED, RE-OPENED; RE-OPEN PROBE 2026-11-02: no form in a pre-registered set of nine meets every bar on `main`.
No rule is written in, no bar moves, and the build does not start. One question goes to the owner.** Recorded by
Architect/Design (task `arch-ADR-0060-reopen`, records only, on `grugops/arch-ADR-0060-reopen` from `main`
`cfff6993`).
- **Method.** The set, the bars and the selection rule were sealed and committed before any run (decision
  `…0481036d`, commit `0df9b672`). The rule: the eligible form with the most reach at 47 000 nodes wins. The instrument
  is `arch-phase2-rebase`'s, plus one PV-only cap knob. It ran on a scratch `git archive` of `main`'s `src/`, under the
  host lock, each batch ≤ 5 min, node counts only. The door reproduces 1 116 785 / 1 602 457 / 1 575 537 / 476 244 to
  the node, and decision 1 reproduces 849 358 / 1 183 439 / 1 155 460 / 414 286. The scratch copy is deleted. Raw:
  `.grugops/context/arch-ADR-0060-reopen/raw/probe/`.
- **Results on `main`** (eligible needs every bar: A4 (a) ≤ 0.85 on four readings, A4 (b) ≥ +0.25, A3 ≥ 95 % / ≤ 27 cp
  / 0 sign flips, mate floor 0 / 163, zugzwang 7 / 7, `G1` ≥ 54 / 58; `G6` is timing and is not read):

  | form | A4 (a) `search()` kiwi / pos-6, `chooseMove` kiwi / pos-6 | A3 max cp `search()` / `chooseMove` | A4 (b) | zugzwang | misses |
  |---|---|---|---|---|---|
  | R0 decision 1 (PV −1, cap 2) | 0.761 / 0.739, 0.733 / **0.870** | **63** / 18 | +0.253 | 7 / 7 | cap, A4 (a) |
  | C1 no PV reduction, cap 2 | **0.953** / **1.280**, **0.893** / **1.088** | **63** / **63** | — | — | A4 (a), cap |
  | C2 PV ≤ 1 ply, cap 2 | 0.801 / **0.913**, 0.753 / **0.866** | 5 / 2 | — | — | A4 (a) |
  | C3 PV flat 1, cap 2 | 0.800 / **0.909**, 0.738 / **0.866** | **30** / 21 | — | — | A4 (a), cap |
  | C4 PV ≤ 1, cap 3 | 0.764 / 0.835, 0.657 / 0.806 | 5 / 2 | **+0.168** | **6 / 7** | A4 (b), `zugzwang.004` |
  | C5 PV flat 1, cap 3 | 0.762 / 0.830, 0.645 / 0.805 | **30** / 21 | **+0.137** | **6 / 7** | cap, A4 (b), `.004` |
  | C6 PV ≤ 1, uncapped | 0.722 / 0.824, 0.629 / 0.787 | 5 / 2 | **+0.174** | **6 / 7** | A4 (b), `.004` |
  | C7 C4 with index ≥ 2 | 0.763 / 0.835, 0.657 / 0.812 | 10 / 2 | **+0.189** | **5 / 7** | A4 (b), `.001`, `.004` |
  | C8 C4 with divisor 1.75 | 0.761 / 0.822, 0.636 / 0.799 | **30** / 21 | **+0.163** | **6 / 7** | cap, A4 (b), `.004` |

  - Every form keeps ≥ 96.79 % within 25 cp, with 0 sign and 0 mate-status flips. Root moves at depth 8 are unchanged.
  - For C4–C8: mate floor 0 / 163 and `G1` 54 / 58, no NEWLY line.
  - Stage B was not read for C1–C3, which A4 (a) already rules out. R0's stage-B figures are `arch-phase2-rebase`'s.
  - `zugzwang.004` at depth 11: C4 plays g7f6 after 156 620 nodes.
  - C2, C4 and C6 read alike at depth 5, because the clamp r ≤ d − 2 never lets a cap of 3 bind there. The drift net
    cannot see a deeper cap; the zugzwang rows can.
- **What it means, said plainly.**
  - **No form passes.** Capping PV reductions at one ply clears A3 and A4 (a), but reach falls to +0.17–0.19 and
    `zugzwang.004` is lost. Decision 1 keeps reach and 7 / 7, but misses the cap and A4 (a).
  - **On `main` the reach comes with the two-ply PV reductions,** the same ones that move position-6/g5h6 by 63 cp.
  - **No form misses only the 27 cp cap.**
- **The owner question:** *may `A3`'s 27 cp cap be re-derived on `main` by `ADR-0050` d8's method?*
  - **The number:** 94 cp (⌊1.5 × 63⌋, decision 1's larger maximum on `main`).
  - **But a "yes" alone admits no form.** Decision 1 would still miss A4 (a) (0.8699 against 0.85). Passing it would
    also need 0.85 moved after the score, which no method derives. C4, C6 and C7 lose `zugzwang.004`, which is F3 and
    never a re-pin.
  - **The Architect's recommendation: keep the cap, and park P1 on `main`.**
    - The cap flags the very trade-off that buys the reach.
    - `ABC-264` showed that reach without value loses games (+0.70 ply, −42 Elo).
    - Suggested next step (the Orchestrator's call): P3 next. Then re-measure decision 1 unchanged on that `main`, by
      a dated line here, under the same bars. On `4d1c0616`, whose door had reverse futility cutting at depth 1–3,
      decision 1 met every bar. That P3's futility does the same is a judgement, `UNKNOWN - verify`. O1h's history
      table (decision 11) is the other named premise.
  - **Answers that settle it:**
    - "Keep the cap" is the default: P1 stays parked, and the flat 1-ply LMR stays on `main`.
    - "Re-derive the cap and A4 (a)": decision 1 is re-proposed with 94 cp and his A4 (a) number.
    - "Decline ADR-0060".
- **Unchanged:** decisions 1–11, F1–F8 and every bar. Decision 1 stays the measured reference, not a rule cleared to
  build.

*Earlier status (`arch-phase2-rebase`), kept:* **PROPOSED, RE-OPENED 2026-11-02: re-measured on `main`, the rule misses two of its own bars there, and the build
does not start.** Recorded by Architect/Design (task `arch-phase2-rebase`, records only, on
`grugops/arch-phase2-rebase` from `main` `5ffbae25`).
- **Why re-measure.** `ABC-264` did not merge (`ADR-0059` F5: 44.0 / 100). So this ADR's door is now `main`'s own
  search: the flat `ABC-121` rule with no reverse futility. `main`'s `src/` equals `0b73f51d`, `ABC-264`'s
  merge-base. § Consequences said it: "the premise is re-measured on `main` … The bars stay."
- **The instrument.** The same driver (`raw/probe/probe.ts` of `arch-phase2-p1`) ran on a scratch `git archive` of
  `main`'s `src/`, outside the repository. The patch was adapted to `main`: the P1 predicate is unchanged; the P3/P5
  ranking knobs are dropped, because they gated on reverse futility. Every batch ran under the host lock, took
  ≤ 5 min and read deterministic counts only, with no timing. The scratch copy is deleted. The patch, the driver
  and the outputs are kept under `.grugops/context/arch-phase2-rebase/raw/`.
- **Instrument check: exact.** The door reproduces `main`'s pre-`ABC-264` counts to the node: 1 116 785 /
  1 602 457 (`search()` depth 8, kiwipete / position-6) and 1 575 537 / 476 244 (`chooseMove` to 8). These are
  `ADR-0059`'s door counts, which QE confirmed.

**Every A3 / A4 / G1 figure, on `main` against the `4d1c0616` base it was first measured on:**

| figure | on `4d1c0616` | **on `main`** | bar | on `main` |
|---|---|---|---|---|
| `A4` (a) `search()` d8 kiwipete | 0.7238 | **0.7605** (849 358 / 1 116 785) | ≤ 0.85 | met |
| `A4` (a) `search()` d8 position-6 | 0.7086 | **0.7385** (1 183 439 / 1 602 457) | ≤ 0.85 | met |
| `A4` (a) `chooseMove` d8 kiwipete | 0.6795 | **0.7334** (1 155 460 / 1 575 537) | ≤ 0.85 | met |
| `A4` (a) `chooseMove` d8 position-6 | 0.8020 | **0.8699** (414 286 / 476 244) | ≤ 0.85 | **MISSED** |
| `A4` (b) reach at 47 000 nodes, 190 | 6.237 → 6.542 (+0.305) | **5.558 → 5.811 (+0.2526)**; 44 deeper, 2 shallower, 15 moves differ | ≥ +0.25 | met by 0.0026 (48 position-plies against 47.5 needed) |
| `A3` drift d5 `search()` | 100 %, max 16 cp | **99.47 %, max 63 cp** (position-6/g5h6, 319 → 382); 0 sign, 0 mate-status flips | ≥ 95 %, ≤ 27 cp | **MISSED** (the 27 cp cap) |
| `A3` drift d5 `chooseMove` | 100 %, max 18 cp | **100 %, max 18 cp** (startpos/g2g4); 0 / 0 | ≥ 95 %, ≤ 27 cp | met |
| `A3` mate floor, door d4 vs head d5 | 0 / 163 | **0 / 163** | 0 | met |
| same-depth mate report (d5) | 2 / 189 | 2 / 189 | report | — |
| `A3` zugzwang, seven rows | 7 / 7 | **7 / 7** (node counts as before; `zugzwang.004` 627 208 at d11) | 7 / 7 | met |
| `A5` `G1` | 54 / 58 | **54 / 58**, no NEWLY line (door 54 / 58) | ≥ 54, no NEWLY | met |
| `A4` (c) `G6` | not read | not read (timing; a build's gate) | ≥ base | — |

- Reports on `main`. At depth 8, the other roots read (`search()` / `chooseMove`): position-4 0.814 / 0.712,
  position-5 0.660 / 0.796, startpos 0.627 / 0.748. At depth 6: kiwipete 0.580 / 0.661, position-6 0.817 / 0.835.
  Root moves at depth 8 are unchanged on kiwipete and position-6 in both recursions. Firing at depth 6 on the 190
  (`search()`): 242 201 of 2 206 433 non-first moves reduced (11.0 %), 40.9 % of them by two plies (door 9.9 %,
  all by one); nodes 0.843×. Reach at 20 000 nodes: 4.426 → 4.642 (+0.216).
- **The new instrument-check counts on `main`** (they replace decision 9's `4d1c0616` counts): 849 358 / 1 183 439
  (`search()`), 1 155 460 / 414 286 (`chooseMove`), and reach 5.558 / 5.811 (sums 1 056 / 1 104 over 190).
- **The door counts on `main`:** 1 116 785 / 1 602 457 (`search()`), 1 575 537 / 476 244 (`chooseMove`).

**What it means, said plainly.**
- **Two bars miss on `main`:**
  - `A3`'s 27 cp cap: 63 cp in `search()` at position-6/g5h6.
  - `A4` (a) on `chooseMove` position-6: 0.8699 against 0.85.
  - `A4` (b) holds by less than one position-ply.
- **No bar moves.** The 27 cp, 0.85×, +0.25 ply, 95 % / 25 cp, 0 sign flips, the mate floor, 7 / 7 and 54 / 58 all
  stand as pre-registered. None is loosened here.
- **The F-rules apply as written:**
  - **F1** (drift red on a predicate that matches decision 1 exactly): **NOT MET, and this ADR is re-opened with a
    new probe.** No fallback is pre-chosen.
  - **F4** (`A4` (a) above 0.85× on any reading): the ticket would not merge.
- **So the build does not start from `main` on this text.** Decision 9 says a faithful build reproduces the probe's
  counts to the node. These readings are deterministic, so a build of decision 1 on `main` would read exactly these
  figures and fail `A3` and `A4` before any game is played.
- **The variants, re-read on `main`, do not rescue it.** On the same instrument, no rule in § What the probe
  measured meets both missed bars on `main`:

  | variant | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | drift d5 `search()` / `chooseMove` (max cp) |
  |---|---|---|---|
  | chosen (cap 2, PV −1) | 0.761 / 0.739 | 0.733 / **0.870** | **63** / 18 |
  | uncapped | 0.685 / 0.693 | 0.599 / 0.769 | **63** / 18 |
  | uncapped, killer −1 | 0.694 / 0.726 | 0.612 / 0.826 | **63** / 21 |
  | textbook 0.75 / 2.25, PV −1, killer −1 | 0.770 / 0.746 | 0.695 / **0.975** | **28** / 26 |
  | 0.75 / 2.25, no PV or killer term | 0.715 / 0.686 | 0.638 / 0.686 | **63** / 23 |
  | 1.0 / 1.75, PV −1, killer −1 | 0.653 / 0.599 | 0.578 / 0.770 | **63** / 11 |
  | flat 2 / 1, cap 2 | 0.799 / **0.908** | 0.738 / **0.867** | **30** / 21 |
  | textbook, never below 1 | 0.753 / 0.791 | 0.672 / **0.895** | **30** / 21 |

  Every variant keeps ≥ 98.93 % within 25 cp and 0 sign flips. The same position, position-6/g5h6 (319 → 382), is
  the maximum in five of the eight. The three without it (textbook, flat 2 / 1, never below 1) reduce less at PV
  nodes.
  - **One diagnostic run, not a candidate:** decision 1 with two plies less at PV nodes (PV −2). The 63 cp row
    goes, so it comes from two-ply reductions at PV nodes.
  - But the drift maximum is still 28 / 26 cp, 1 cp over the cap in `search()`.
  - And position-6 saves nothing: 1.037× in `search()` and 0.930× in `chooseMove` (kiwipete 0.842 / 0.772).
  - So moving the PV term trades one missed bar for another. Uncapped and the textbook
  forms also lose `zugzwang.004`; that was measured on `4d1c0616` and is not re-read here.
- **Why `main` differs from `4d1c0616`** (a judgement, not measured). That probe's door included reverse futility,
  which cuts at remaining depth 1–3. Those cuts removed shallow subtrees before a reduction could matter. On `main`
  those subtrees are searched, so the same table acts on a different tree. Measured: the saving on `chooseMove`
  position-6 moves from 0.80× to 0.87×, and one line moves 63 cp.
- **What changes in the text when the rule is re-opened** (decision 4's "reverse futility included", decision 5's
  door list, and decision 6's `ABC-264` re-point example):
  - On `main` the doors carry no reverse futility. Decision 5's list is the doors `main` has.
  - No `ABC-264` row exists to re-point.
  - Nothing else in decisions 2–8 depends on the base.
- **The re-open is a new design hop, not this one.** It is a new probe on `main`, and it chooses its rule on its
  merits: reach, zugzwang, `G1`, the mate floor. It must not tune the rule to pass the bars on the same two boards
  that define them: a rule fitted to its own bar measures nothing. Every bar number above carries over.
  - **Open, the owner's:** the 27 cp cap was ⌊1.5 × 18⌋, from one base's maximum. On `main` one position of 187
    moves 63 cp, so the cap has proved base-fragile. Re-deriving it on `main` by `ADR-0050` d8's method would raise
    the number. That is a loosening, so it is his word, not the Architect's.
- **Status for the owner.** The question "accept ADR-0060" is **not put** on this text, since it fails on `main`. It is
  put again after the re-open. The default without an answer is unchanged: the flat 1-ply LMR stays on `main`.

*Earlier status, kept:* **PROPOSED** 2026-11-02 by Architect/Design (task `arch-phase2-p1`, records only, on `grugops/arch-phase2-p1` from
`main` `0d7b9d2f`). The probe ran on a scratch copy of `grugops/ABC-264-fix` `4d1c0616`'s `src/`, outside the
repository, under the host lock. The copy is deleted. Nothing was committed to `src/`.

- **This is `EPIC-011` Phase 2 row P1** (`ADR-0056` D2, D6). It is the next Phase 2 item after P2 (`ABC-264`,
  `ADR-0059`). The choice is confirmed by measurement; see § Why P1 next.
- **Acceptance is the owner's.** It is a new ADR (`memory-bank/45-standing-rulings.md`, 2026-10-22). `ADR-0056` lists P1
  and the owner's "P yes" set the order P2 → P1 → P4 → P3 → P5 → P6. That covers the direction, not this text. The
  Orchestrator reports it to him.
- **The answer that settles it:** *"accept ADR-0060"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-264` precedent. The build may start while this ADR is PROPOSED, **but not
  before `ABC-264` merges**, because both edit `src/search.ts` and `src/engine.ts`. The 100-game read (C2′) and the
  merge wait on his acceptance.
- **Default without an answer:** the flat 1-ply LMR of `ABC-121` stays on `main`.
- **If the P1 ticket does not merge** (F4, F5 or F8 fires), a dated line here records "accepted, not in force on
  `main`", as `ADR-0026` decision 9 does.
- **What it amends:** `ADR-0026` decision 6, for the shipped path only (decision 2 below says how). Every other
  `ADR-0026` decision is cited, not changed. It follows `ADR-0026` decision 10's pattern: a switch, a pair of doors,
  off in every older door, a bounded oracle. **It does not amend `ADR-0059` or `ADR-0050`.**

## The 2026-11-08 look (`arch-ABC-284`): written, PROPOSED, recommended against

*Recorded by Architect/Design, task `arch-ABC-284`, records only, at `main` `50ff9250` (`src/` tree `bba42fb7`).
Nothing was run: no test, build, engine or probe. Every figure is quoted from a named record or read from `src/` as
committed. Anything that needs a reading is marked `UNKNOWN - verify`. Inputs: the owner's `…4d1e0382`; `ABC-284`'s
page; § Status with `…e17a23f4` (`arch-ADR-0060-reopen`), `…1bc554fb` (`arch-post-268`) and the lines of
`arch-ABC-233`, `arch-next-pull` and `arch-ABC-283-accept`; `ADR-0063` d11; `ADR-0076` d10 to d13; `…569849c4`;
`ADR-0056` D2 and D6; `arch-bundle-1` `…ed82b408`; `src/search.ts`, `src/search.bundle.test.ts`, `src/engine.test.ts`,
`src/search.futility.test.ts` and `src/uci-session.test.ts` on `main`.*

**Acceptance is the owner's** (L6). The Orchestrator brings it to him. Nothing here is in force, and P1 stays parked
until he answers.

### L1. The premise, the form, the door counts, and where it is written

- **The premise, named:** *decision 1, unchanged, meets every bar of L3 on today's `main`.* What changed in the tree
  since its last two probes, both on `e72487e1`:

  | merge | what it changed |
  |---|---|
  | `54dee3f2`, E1 (`ABC-269`) | every evaluation value: the tapered table |
  | `7b70e268`, Q1 (`ABC-279`) | quiescence skips SEE-losing captures out of check |
  | `58e90d07`, `ABC-283` | history with K3 (max(0, h)), SEE ordering, root aspiration: which quiet moves stand late |
  | `434fa171`, bundle 1 (`ABC-303`) | M3 move-count pruning at depth 1–3 (three-piece guard), and the countermove tier |
  | `a6ae8227`, W1 (`ABC-282`) | time use in the clock modes; a fixed-depth read on a frozen clock does not see it (`ABC-282` A0-1) |
  | `ABC-274`, `ABC-270`, `ABC-271` | structure only, value- and node-identical |

  - **The size of the change, from records.** The door's depth-8 counts went from 888 786 / 1 262 046 (`search()`)
    and 1 306 981 / 391 451 (`chooseMove`) to 311 546 / 163 523 and 573 518 / 94 911. Reach at 47 000 nodes on the 190
    went from 5.837 to about 7.016 (`arch-bundle-1`'s probe of C1 + M3, not re-read on `main`, `UNKNOWN - verify`).
  - **No P1 reading exists on any tree with E1, K3, SEE ordering, the countermove or M3.** That is the premise: a
    different tree, never measured. A different tree is not by itself a reason to pass. L2 says, row by row, what
    reason exists.
- **The form: one, chosen before any reading, and it is decision 1 exactly.** r = max(0, min(T[d][m] − (pvNode ? 1 :
  0), 2, d − 2)), with T[d][m] = ⌊1.0 + ln d × ln m / 2.0⌋. The flat rule's eligibility, and the full-depth re-search
  first, as decisions 1 and 2 write them. m is the 1-based number in today's ordered list, as the flat rule's index is.
  There is no history term. The reasons:
  - **It is the only form whose shape was chosen before these rows bit.** It was chosen on `4d1c0616` by its own
    pre-registered rule. Every other form on record lost at least one of L2's rows: eight in the re-open set, J1–J4,
    and the variants. Choosing one of them now is choosing with the rows in hand. § Status (`arch-phase2-rebase`)
    says it: "a rule fitted to its own bar measures nothing".
  - **The premise is about the tree.** Changing the rule too would leave a reading that cannot say which of the two
    moved the rows.
  - **A history term is a second change at once.** J1–J4 each lost `zugzwang.004` and drifted 69 cp. That was over
    H1, not K3, but picking a J form now is again choosing with the rows in hand. Decision 11 stays later.
  - **It needs no new text.** The switch, the doors, the rows, the exports, the oracle and the bars are decisions
    2–10, as written.
- **The door counts on today's `main`.** The door is `main`'s shipped search, with the flat 1-ply rule. Read from the
  pinned rows, not re-run:
  - `search()` at depth 8: kiwipete **311 546**, position-6 **163 523**;
  - `chooseMove` deepened to 8 on a frozen clock: kiwipete **573 518**, position-6 **94 911**;
  - source: `src/search.bundle.test.ts`, "`ABC-303` — the bundle's own counts at depth 8". `src/engine.test.ts`
    `ABC-282` A0-1's all-on column agrees for `chooseMove`. LR1 re-reads all four to the node. Decision 9's earlier
    counts are stale.
  - **Exports:** decision 4's, unchanged: `ABC-077` A6 +2, `ABC-078` A4 +1.
  - **Doors:** `logReductions` is the top rung. Every door on `main` turns it off by decision 5's rule, the newest
    (`searchWithoutCountermove`, `searchWithoutMoveCountPruning`, `searchWithoutQuietBundle`) among them. No list is
    needed.
- **Where: a dated re-open of this ADR, not a new ADR.**
  - The form, the bars, the switch and the doors are this ADR's, unchanged. A new ADR would restate decisions 1–10
    and give the bars a second home, where `ABC-284` says they have one.
  - `ABC-284`'s front matter and § Status (`arch-post-268`) name a dated line here as a re-open's place. The joint
    probe (`arch-next-pull`) was recorded here the same way.
  - Acceptance of this ADR is still the owner's. It is asked only as a condition on a pass (L6, question 2).

### L2. The rows it missed before, and whether it should pass them now

Named up front. The last column says what kind of reason exists.

| row | bar | where it missed | reason it should pass now | kind of reason |
|---|---|---|---|---|
| `A4` (a), `chooseMove` d8 position-6 | ≤ 0.85 | 0.8699 on pre-P3 `main`; 0.8528 on `e72487e1` | Over history ordering (`arch-ABC-233`'s diagnostic, H1 on `e72487e1`) decision 1 read 0.7749 against H1's door. History orders quiet moves by their cutoffs, so the moves left late fail low more often, and reducing them costs fewer re-searches | **measured on a near tree.** Not today's: K3 differs from H1, and SEE ordering, the countermove and M3 are new |
| `A3`'s 27 cp cap, `search()` drift at d5 | ≤ 27 cp | 63 cp at position-6/g5h6, on both pre-P3 `main` and `e72487e1` | Over H1, decision 1's largest drift was 25 cp (`search()`) and 11 (`chooseMove`). The 63 cp line came from two-ply reductions at PV nodes in a history-free order | **measured on a near tree, 2 cp inside.** E1 has changed every centipawn value since, so the line's size is unread |
| zugzwang 7 / 7: `zugzwang.004` at d11 | plays h3h4 | g7f6 on `e72487e1` (h3h4 only from d12); lost over H1 (5 / 7) and in each of J1–J4 | **None that is not a guess.** Decision 1 kept it only on the two trees without P3's futility; on `4d1c0616` the door found h3h4 a ply early, at d10. On `e72487e1` the door found it only from d11, with no ply to spare, and decision 1 lost it; it was lost again over H1 and in each J form. `main` keeps P3's futility. M3 does not act there: each side has two non-pawn pieces. Whether today's door has a ply to spare is unread | **a guess, and the record points against it** |
| R-283-LMR's same-depth mate floor, d5 → d5 on the 287, both recursions: a bar for this re-open since 2026-11-04 | 0 / 190 (`search()`), 0 / 188 (`chooseMove`) | Not a bar when read. Decision 1 lost 2 / 189 on all three trees it was read on (`4d1c0616`, pre-P3 `main`, `e72487e1`). J1–J4 lost 3 to 7 / 194 over H1 | K3 lets a mating quiet move that cut earlier rise in the order, so it may stand before the reduced moves. That is plausible, and unmeasured for decision 1. The loss itself is the cost decision 8 accepted: a move reduced by two plies can miss a mate the door sees at the same depth (`ADR-0026` d9) | **a guess, and the record points against it** |

**So, plainly: I cannot give a reason that is not a guess for two of the four rows. My recommendation is: do not
re-open.**
- **The odds, by judgement and not by reading:** below one in ten that the probe passes every row. A pass would still
  face C2′, which a change worth nothing passes half the time (`ADR-0076` d12). This corrects `…569849c4`'s "below
  even" downward, on a closer reading of the same records.
- **What the options read did not say.** The same-depth floor became this re-open's bar after decision 1 was
  designed. It was set to guard the floor against order changes (R-283-LMR). Decision 8 had accepted 2 / 189 there
  as the price of reducing deeper. With that floor as a bar, any LMR that reduces deeper than the door is likely to
  lose a few of the 287, whatever its table. So keeping the bar, as I recommend, all but closes this family on this
  engine. Reading it as a report again would loosen a standing line. That is not mine to do, so it is L6's question
  4, and I recommend against it.
- **No bar moved here.** Every bar in L3 is decision 8's, decision 9's or R-283-LMR's, as written.

### L3. The probe, if he takes the look: written here, not run

`ADR-0076` d13's form. It runs after L4's step 3, once, under the host lock, alone, on one core. It plays no games.
- **Sealed form.** A `decision` note under its own task, `arch-ABC-284-probe`, sealed and committed **before any
  measured run**. It names `main`'s tip and `src/` tree, each script's sha256, QE's freeze note, and the rows, bars,
  batch order and rule below, word for word. One load-only smoke may run first: the predicate called once. Then one
  results note and one decision note. Scripts and outputs go to the task's `raw/`, with `<scratch>`, `<home>` and
  `<repo>` as placeholders. **No bar moves after a reading, and a miss is not re-run.**
- **The instrument.** Scratch `git archive` copies of `src/` at the sealed tree, outside the repository: `main`,
  unpatched; and `cand`, with decisions 1–4 patched in (the predicate, the table, `logReductions` in both recursions),
  giving ON and OFF. The patch is `arch-post-268`'s (`raw/probe/`), re-anchored on today's move loops, after the
  futility and M3 skips.
- **The rows:**

  | row | reads | bar | class |
  |---|---|---|---|
  | **LR1**, instrument | OFF against unpatched `main`: nodes, score and move, `search()` d8 and `chooseMove` deepened to 8 on a frozen clock, kiwipete and position-6 | exact: L1's four counts, and `main`'s moves and scores | else void: STOP |
  | **LR0**, counts | ON on LR1's rows | none; a reading, it becomes decision 9's instrument check | reading |
  | **LR2**, the table | `lateMoveReductionByTable` called directly, against QE's frozen cells and eligibility fixtures | 0 mismatches | exact |
  | **LR3**, zugzwang | `ADR-0050` d9's seven rows, `chooseMove` ON at the recorded depths, the played move only | 7 / 7 | safe |
  | **LR4**, mate floors | (a) R-283-LMR's: every mate the door scores at d5, ON scores as a same-sign mate at d5, on the 287, `search()` and `chooseMove`, against OFF and against each all-off door the standing rows use (`…WithoutBundle`, `…WithoutQuietBundle`); (b) decision 8's: OFF at d4 against ON at d5, `search()` | 0 violations on each | safe |
  | **LR5**, pay (`A4` (a)) | d8 nodes, ON over OFF, on LR1's four rows | each ≤ 0.85 | pay |
  | **LR6**, reach (`A4` (b)) | `chooseMove` with `maxNodes: 47_000` on a frozen clock, the 190, mean completed depth, ON against OFF | ≥ OFF + 0.25 ply | pay |
  | **LR7**, drift (`A3`) | depth 5 on the 190, both recursions, ON against OFF | ≥ 95 % of non-mate scores within 25 cp, none beyond 27 cp, 0 mate scores change sign | safe |
  | **LR8**, `G1` | the 58 at the baseline's budget and step, ON against OFF | ≥ 54 / 58 ON, no NEWLY-MISSED line | safe |
  | **LR9**, reports | `chooseMove` d6 same-depth floor on the 287 and on QE's fresh KRK / KQK set (R-283-LMR's report); the first depth at which OFF and ON play h3h4 on `zugzwang.004`; deeper and shallower counts for LR6; d8 on position-4, position-5 and the start position; reach at 20 000; firing at d6 on the 190 (share reduced, share by two plies); `ADR-0061`'s cut audit as information | none | decides nothing |
  | **LR10**, lane report | the default lane with ON hard-wired, against `main`'s copy; then, with `-t`, L5's deep pins on their lanes | none; it lists every re-pin and re-point | decides nothing |
  | **LR11**, timing, last | ns per node ON against OFF at fixed depth on kiwipete and position-6; one lane read, arms B, B again and ON, production files only, 8 scored rounds | none | decides nothing; the Orchestrator may drop it |

- **Batch order, cheapest stop first:** A (LR1, LR2); B (LR3, then LR4), the two rows the record points against, a few
  minutes of lock; C (LR5, LR7, LR8); D (LR6, LR9, LR10). **Stage B (LR11) runs last, and only on a later
  Orchestrator line citing the owner's word that the host is held, with W asked for that read.**
- **Lane reads** (LR10, LR11) run vitest with one worker: `VITEST_MAX_WORKERS=1 npx vitest run …`, never plain
  `npm test`. The PREREG prints the worker count, and a run on more than one worker is void.
- **The rule, fixed now:**
  1. **LR1 or LR2 misses:** a prototype defect gets one fix under a sealed addendum, and then every row is re-read.
     If LR2 shows that decision 1's words or QE's frozen cells are wrong, and not the patch: STOP. This ADR is
     restated and goes back to him. No rule moves.
  2. **LR3, LR4, LR7 or LR8 misses:** a defect check first, sealed in the PREREG. At the failing row it confirms that
     the predicate returns decision 1's cells, that every reduced fail-high was searched again at full depth, that
     the switch reaches both recursions, and that OFF still equals LR1. If the miss is real, the premise is **NOT
     MET**: `ABC-284` is not built, it goes back to BA/PM, and nothing after the miss runs.
  3. **LR5 or LR6 misses:** **NOT MET for pay** (F4). The same as rule 2.
  4. **Every row holds:** the premise is **MET**. LR0's counts and LR10's list join decision 9 and L5 by a dated line,
     then L4's step 5.
  - No form is tuned, no second form is read, no row is dropped, and no subset stands in. **If he answers question 3
    yes, a miss here is final for P1,** and F1's "this ADR is re-opened with a new probe" does not apply after it.
- **What it can change:** decision 9's counts (LR0), L5's pin list (LR10), and whether `ABC-284` is built. **What it
  cannot:** decisions 1 and 2, any bar, the intent or the form. It cannot turn a miss into a pass.
- **Host:** the last P1 probe ran four batches, each under 5 min. This one adds the same-depth floor in both
  recursions against three doors, and a few deep rows. Under 25 min of lock by estimate, `UNKNOWN - verify`; stage B
  about 5 min more.

### L4. The order: QE's freeze before the probe and before the build

`ADR-0076` d10's pattern. No step moves a bar. Each names what proves it happened.

| # | step | who | what proves it |
|---|---|---|---|
| 1 | he answers L6 | owner | his word, in an Orchestrator note |
| 2 | this re-open merged; `ABC-284`'s page lines (the premise named, the look's rule, DoR row 10 "probe written") | Architect, BA/PM | merged records |
| 3 | **the freeze:** `qe-ABC-284-freeze`, from the words of decisions 1, 2 and 7 alone, with no code in hand. (a) The table's cells worked by hand, d 3–16 × m 4–64, non-PV and PV, after the cap and the clamp. (b) One eligibility fixture per clause of decision 2, each where every other clause would reduce. (c) The probe's sets by name, commit and sha256: the 190, the 287, the seven zugzwang rows with their depths and moves, the 58 with its baseline, kiwipete and position-6, and `qe-ABC-283`'s fresh KRK / KQK set. (d) L1's four door counts. No row is written to `src/` | QE | a sealed `decision` note with each fixture file's sha256, merged to `main` |
| 4 | the probe, under its own task; LR2 reads QE's frozen cells | Architect | its PREREG commit descends from step 3's: `git merge-base --is-ancestor <freeze commit> <PREREG commit>` |
| 5 | on MET: LR0's counts and LR10's list by dated line; DoR 10 / 10 | Architect, BA/PM | merged records |
| 6 | **the check:** before any build dispatch, the Orchestrator runs `git merge-base --is-ancestor <freeze commit> main` and confirms that the brief cites the freeze note's id | Orchestrator | a line in the dispatch note. No id, no dispatch |
| 7 | the build, on `main` after step 6 | Engineer | its first commit descends from the freeze commit |
| 8 | QE's stage 0 re-reads step 7's ancestry and the sha256s; then `A1`–`A5`; then `G6` and `NFR-008` on a held host; then C2′, 100 games at 100 ms against the merge-base, S′ at the E in force (1 810 today), and the Levels lane. Each stage under its own hold and under 1 h; W asked per read | QE | its PREREG line |

- **Why before the probe, not only before the build.** A freeze made with no patch in the world is blind by date. It
  also gives LR2 a reader of decision 1 who is not the patch's author.
- **If the order is missed,** LR2 and `A2` are not met to the letter, and no reading makes them met.
- **The fault rule.** CF1–CF10 and FL reach C2′ by `ADR-0056` D5's dated blocks. QE copies them unaltered, in
  `ADR-0076` d11's table form, with this ticket's words: "50.0" (GAIN); "B6" (NOT MET, nothing merges, QE records a
  `failed-attempt`, the ticket goes back to BA/PM, and question 3's answer applies); "no form … moves" (decisions 1
  and 2: no cell, cap, clamp, PV term or eligibility clause moves); "S1, S2 and R7" (`A7`'s doors and LR0's counts).
  It adds no bar.

### L5. `NFR-008`, `G2`, the pins, the intent

- **`NFR-008`: ≤ +0.10 s stays.** No figure above it is proposed. The lane reads 9.085 s on QE's arms
  (`plans/nfr-catalog.md`). Expected cost, all `UNKNOWN - verify`:

  | part | expected | what the design does |
  |---|---:|---|
  | the predicate's cells and eligibility rows | about +0.005 s | units, no search, in `src/search.pvs-lmr.test.ts` |
  | the two-ply re-search row | +0.005 to +0.02 s | in an existing file that already holds a call-through module mock, never a new default-lane file (`R-N8H-3`) |
  | the source row | about +0.002 s | reads two files |
  | larger production files | +0.005 to +0.02 s | about 1 to 2 KiB more in `src/search.ts` and `src/engine.ts` |
  | shipped-path rows that search at depth ≥ 3 | 0 or below | the shipped tree is smaller; unread |
  | the unresolved part, as on `ABC-291` | 0 to +0.07 s | nothing can; it may be read noise |
  | **sum** | **about +0.01 to +0.12 s, midpoint about +0.05 s** | |

  - **If it reads over:** `NFR-008` is UNRESOLVED, not a defect. The owner's "games first" (`…23d30c72`, question 4)
    was given for the evaluation terms after `ABC-291`. I read it as reaching this search change too; that reading is
    open to the Orchestrator's overruling. QE's PREREG seals the order before any figure exists.
- **`G2`: not relevant.** P1 does not touch `evaluate`, so there is no per-call ratio to set and no `G2` row.
- **`NFR-009`:** decision 2's 4 096-byte constant, built once at load. Nothing grows per search, and no level is near.
  The PR states the bytes, as decision 2 says.
- **`NFR-005`:** `A4` (c), `G6` "≥ base", is the build's timing gate, read on a held host at step 8. It is not a
  probe row.
- **The deep pins it moves.** `ADR-0071` D8's form. New figures are `UNKNOWN - verify` until LR10, then a dated line
  here and in `ADR-0071` D8, on that tree, before Ready.

  | rows | lane | where | form | old |
  |---|---|---|---|---|
  | `ABC-282` A0-3: `D8`, `D7`, `D6` | `ENGINE_DEEP` | `src/uci-session.test.ts` | **re-pin:** the session has no door, and each line is a tree pin | `info depth 8 score cp 45 nodes 196681 …`, `info depth 7 … nodes 69705 …`, `info depth 6 … nodes 10513 …` |
  | `ABC-282` A0-1, 6 rows | `ENGINE_DEEP` | `src/engine.test.ts` | **re-point** the all-on column to `chooseMoveWithoutLogReductions`, figures unchanged; the `softMs` absent ≡ 1 relation stays on `chooseMove` | 104 780 … 94 911 |
  | `ABC-282` A0-2, 4 rows | `ENGINE_DEEP` | same | **re-point,** figures unchanged | `ADR-0071` D8's table |
  | `ABC-303`, "the bundle's own counts at depth 8", 2 rows | `SEARCH_DEEP` | `src/search.bundle.test.ts` | **re-point** to the new doors, figures unchanged: they are L1's door counts | 311 546 / 573 518 and 163 523 / 94 911 |
  | `ABC-283` and `ABC-303`, "the same-depth mate floor on the 287", 4 rows | `SEARCH_DEEP` | same | **stay on the shipped path.** They are R-283-LMR's bar, read in the build. Never re-pointed | 0 violations |
  | zugzwang, the seven rows | their own lanes | `src/search.futility.test.ts`, `src/search.null-move.test.ts` | **stay; no depth is re-pinned** (F3) | recorded depths |
  | D5, "a kept move is reported…", cp 475, `a1f6` | default | `src/uci-session.test.ts` | **unchanged by construction:** depth 2 reduces nothing (the root and remaining depth below 3 return 0). LR10 confirms | `info depth 2 score cp 475 … pv a1f6` |

  - **The A0-3 margin.** `ADR-0071` D8 says `D8` reads a W1 leak only if the leak's line differs from the head's.
    LR10 reports this tree's margin in clock reads. If a leak would no longer show, it comes to the Architect before
    Ready.
  - **The default lane's re-pins** are unknown until LR10. A smaller shipped tree reaches many rows; `ABC-291`
    moved 64. A row outside LR10's list that reddens in the build is a STOP to the Architect.
- **The intent: GAIN, ≥ 50.0 of 100, unchanged** (decision 10; `ABC-284` A6). It is named before any reading and is
  never re-classed after a score is seen. Why GAIN: on `e72487e1` the rule reduced 15.7 % of non-first moves at depth
  6, 43.9 % of them by two plies, and reached +0.384 ply at the 100 ms node budget. LR9 reports today's firing; LR6
  is its bar.
- **What a pass means:** "not seen worse", not "proven better" (`ADR-0076` d12, by reference). `ADR-0056` D2's
  +40–100 stays an estimate for the history-adjusted row.

### L6. The owner's questions

1. **Should P1 get its one try?** The engine has changed a lot since P1 failed. Two of the four checks it failed now
   have a fair reason to pass, measured on a close relative of today's engine: the node saving and the score drift.
   The other two are a fixed puzzle position it must solve at a set depth, and finding the same mates at the same
   depth. Those two failed on every version of the engine that has the futility pruning, and today's engine has it.
   I have no reason they pass now that is more than a hope. My odds for the probe are below one in ten. A yes costs a
   QE hop to freeze the test positions, then about 25 minutes of the machine alone; the probe can only stop the work.
   If it passes: a build, a QE hop and 100 games, about 1 to 1¼ h more. **My recommendation: no.** P1 stays parked,
   and the host time goes to the next step you choose.
2. **If you say yes and the probe passes every check, do you accept ADR-0060 now, so the build and the 100 games
   follow without asking you again?** **My recommendation: yes, in that case only.** The table is the one designed
   in November, unchanged. With no answer, the build waits for you after a pass.
3. **If it misses, is that the end of P1?** A yes means no second shape of the table is picked after seeing which
   check failed. A new shape would need its own ADR, a reason not drawn from a failed check, and your yes.
   **My recommendation: yes.** If you answer question 1 no, P1 stays parked as it is: only a new named premise with
   its own probe re-opens it.
4. **One of the checks, the same-depth mates, was added after P1 was designed, to protect the mates from move-order
   changes.** P1's design had accepted losing 2 of 189 such mates as the price of reducing more. Any stronger late-move
   reduction is likely to lose a few. Keeping the check means this kind of change is all but closed on this engine.
   Turning it back into a report would loosen a safety check, not a speed check. **My recommendation: keep it.**
   Nothing is asked of you unless you want to change it.

## Context

- **The gap.** Today's LMR is `ABC-121`'s: **one ply, flat**. A quiet move at index ≥ 3, at remaining depth ≥ 3, not
  at the root, neither capturing nor promoting, not in check and not giving check, is searched one ply shallower on
  the null window. A reduced fail-high is searched again at full depth (`ADR-0026` decision 6, `src/search.ts`
  `lateMoveReduction`). Engines at this engine's target strength reduce more, the later the move and the deeper the
  node: a reduction read from a table of ln(depth) × ln(move number).
- **The expected value.** `ADR-0056` D2 row P1: +40–100 Elo, basis [B] 7.1 (bundled with futility and SEE) and 7.3,
  and [t]. That is an estimate for the full form, history-adjusted. It is not a reading.
- **The history term cannot be built now.** The stub says "history-adjusted". The search has **no history table**:
  `ADR-0056` § Inventory, "History / countermove / continuation history | **no**". The history heuristic is O1h,
  `ABC-233`, in Phase 3 (size M). Building a history table inside P1 would pull O1h's whole scope ahead of the owner's
  order. So this ADR decides the log table without it and names the history term as O1h's (decision 9).
- **The inputs read:** `EPIC-011` Phase 2 rows (P1, P3–P6) and § The per-change rule; `ADR-0056` D2, D5 (C2′, S′,
  R-TC, the depth-gated rule), D6 and its dated lines; `ADR-0026` decisions 1–10; `ADR-0050`; `ADR-0059`; `ABC-121`
  (the page, `A1`–`A4`); `ruling-abc121-lmr-oracle` (`noResearch` passes depth-4 drift, depth 5 reds it); and on
  `4d1c0616`: `src/search.ts` (`lateMoveReduction`, `negamax`, `searchMove`, `searchRoot`, the doors) and
  `src/engine.ts` (`negamax`, `searchMove`, `runIteration`, the doors).

### What the probe measured

The probe patched a scratch copy of `4d1c0616` with one switchable reduction predicate in both recursions (and, for
the ranking only, a futility switch and a depth-grown null-move R). Every run is deterministic: fixed depth, or
`chooseMove` with `maxDepth` or `maxNodes` on a frozen clock. **The door reproduces `ADR-0059`'s head counts to the
node** (kiwipete 658 971, position-6 1 021 190 in `search()` at depth 8; 972 596 / 299 183 in `chooseMove`). Full
figures: `.grugops/context/arch-phase2-p1/` observation `…35bd3967` (the probe note; scripts and outputs under
`raw/probe/`); the ruling is decision `…6a0f09ce`.

**The chosen rule** (decision 1: 1.0 + ln d × ln m / 2.0, one ply less at a PV node, cap 2 plies, child depth ≥ 1):

| reading | kiwipete | position-6 |
|---|---|---|
| `search()` depth 8, head / door | **0.7238** (476 991 / 658 971) | **0.7086** (723 582 / 1 021 190) |
| `chooseMove` to depth 8, head / door | **0.6795** (660 887 / 972 596) | **0.8020** (239 944 / 299 183) |
| `search()` / `chooseMove` depth 6 | 0.596 / 0.741 | 0.935 / 0.829 |

- Root moves are unchanged on both positions in both recursions. Scores: kiwipete `chooseMove` −59 → −68; the other
  three equal.
- Also at depth 8 (`search()` / `chooseMove`): position-4 0.799 / 0.702, position-5 0.768 / 0.762, startpos
  0.563 / 0.565.
- **Depth reached at a fixed node budget** (`chooseMove`, `maxNodes`, the 190 of `ABC-121`, frozen clock). This is
  what LMR buys, and it is what 100 ms sees. At **47 000 nodes** (the 100 ms median, `ADR-0056` D5): mean completed
  depth **6.237 → 6.542 (+0.305 ply)**; 53 positions deeper, 3 shallower, 13 root moves differ. At 20 000 nodes:
  5.132 → 5.374 (+0.242).
- **Firing at depth 6 on the 190** (`search()`): 239 565 of 1 992 931 non-first moves reduced (12.0 %), and 41.8 %
  of those by two plies. The door reduces 10.9 %, all by one. Nodes 0.882× the door.
- **Drift at depth 5 on the 190, against the door, both recursions:** 100 % of 187 non-mate scores within 25 cp;
  largest 16 cp (`search()`) and 18 cp (`chooseMove`); 0 mate-status flips, 0 sign flips.
- **Mate floor on the 287** (`src/search.mate-corpus.ts`): one ply deeper (door at 4, head at 5), **0 of 163**
  violations. At the same depth 5, 2 of 189 door mates are not yet mates: the horizon cost `ADR-0026` decision 9
  names and accepts.
- **`ADR-0050` d9's seven zugzwang rows** (`chooseMove`, recorded depths 9, 11, 12, 8, 8, 8, 8): **7/7**.
  `zugzwang.004` is found at depth 11 with 627 208 nodes (the door: 587 282; the door already finds it at 10).
- **`G1`** (the puzzle runner's rule on the scratch copy): **54/58**, baseline 54/58, no NEWLY line.

**The variants** (depth 8 node ratios; reach = mean depth gain at 47 000 nodes on the 190):

| variant | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | same-depth mate loss | zugzwang | `G1` |
|---|---|---|---|---|---|---|
| **chosen: 1.0 + lnd·lnm/2.0, PV −1, cap 2** | **0.724 / 0.709** | **0.680 / 0.802** | **+0.305** | 2/189 | **7/7** | **54/58** |
| the same, uncapped | 0.575 / 0.681 | 0.538 / 0.723 | +0.337 | 2/189 | 6/7 | 54/58 |
| the same, uncapped, killer −1 | 0.580 / 0.683 | 0.542 / 0.761 | +0.331 | 2/189 | 6/7 | 54/58 |
| textbook 0.75 + lnd·lnm/2.25, PV −1, killer −1 | 0.672 / 0.711 | 0.624 / 0.934 | +0.126 | 0/189 | 6/7 | — |
| 0.75 + lnd·lnm/2.25, no PV or killer term | 0.618 / 0.666 | 0.565 / 0.637 | +0.352 | **14/189** | 6/7 | **53/58** |
| 1.0 + lnd·lnm/1.75, PV −1, killer −1 | 0.543 / 0.654 | 0.508 / 0.714 | +0.374 | 5/189 | 6/7 | — |
| flat: 2 plies at non-PV, 1 at PV, cap 2 | 0.772 / 0.787 | 0.695 / 0.862 | +0.174 | 0/189 | 6/7 | 54/58 |
| textbook with "never below the flat 1" | 0.660 / 0.752 | 0.593 / 0.910 | — | — | — | — |

- Every lost zugzwang row is `zugzwang.004` (plays g7f6, not h3h4). Uncapped, the rule finds h3h4 only at depth 13
  with 2 526 967 nodes, **4.30× the door's depth-11 count**. That is a blind spot, not a re-pin. The cap of two plies
  is what keeps the row (decision 1).
- Drift at depth 5 was ≥ 99.47 % within 25 cp and ≤ 30 cp for every variant measured: **the drift bar does not tell
  these variants apart.** The reach reading, the zugzwang rows and `G1` do.
- Index ≥ 2 instead of ≥ 3 changes almost nothing (reach +0.347 against +0.331 for the same uncapped rule with the
  killer term). A killer term changes at most about 5 % of nodes and nothing else.
- Letting the reduced child drop into quiescence (child depth ≥ 0) is not taken: mixed node effects (0.52–0.95), and
  child depth ≥ 1 is the common, boring form.

### Why P1 next (the brief's question)

- **The per-depth saving ranks it first.** Same instrument, same base, each change alone over the door:
  - **P1 (chosen):** 0.68–0.80× at depth 8.
  - **P3 futility** (100 or 150 cp a ply, depth ≤ 2, null-window, quiet non-checking moves after the first):
    0.88–0.91×.
  - **P5 null move R = 3 + depth/4 or 3 + depth/6:** 0.83–0.99×.
  - P1 saves two to four times what either saves.
- **100 ms sees it.** It acts at remaining depth ≥ 3 and the 100 ms median depth is 6. It buys +0.3 ply at the 100 ms
  node budget, so C2′ can read a GAIN. P5 acts mostly deeper: `ADR-0056` D5 lists it as depth-gated, near-invisible
  at 100 ms.
- **The estimates agree.** `ADR-0056` D2: P1 +40–100 against P3 +15–40, P5 +10–30, P6 +5–15. P4 (+20–40) depends on
  P1. Cost: P1 is S–M on an existing frame (`ABC-121`'s predicate, re-search and doors). P3 and P6 would share
  `ADR-0059`'s static evaluation and are smaller.
- **It is the owner's order.** P2 → P1 → P4 → P3 → P5 → P6 (`ADR-0056` D6, dated 2026-11-02, "P yes").
- **What would have changed the pick:** P1's premise failing (no reach gain, or drift, mate or zugzwang rows lost with
  no fix). It did not fail; the cap fixed the one lost row.

## Decision

1. **The rule.** For a move that the flat rule's eligibility admits (decision 2's first list), the reduction in plies
   is

   `r = max(0, min(T[d][m] − (pvNode ? 1 : 0), 2, d − 2))`,  with  `T[d][m] = ⌊1.0 + ln(d) × ln(m) / 2.0⌋`

   - **d** is the remaining depth (at least 3); **m** is the 1-based move number in the ordered list (`index + 1`,
     at least 4).
   - **One ply less at a PV node.** A PV node is one entered with a window wider than null: `alphaIn + 1 !== beta`,
     read from the node's entry window, never from the moving `alpha`. Measured: dropping it loses `G1` 53/58 and
     14 same-depth mates.
   - **Capped at two plies.** Measured: uncapped, `zugzwang.004` is lost until depth 13 at 4.30× the door's nodes.
     Two plies keeps all seven rows.
   - **The child keeps at least one ply** (`r ≤ d − 2`). A reduced move is never sent straight into quiescence.
   - **Its cells, as they read with the cap.** Depth 3: 1 ply (0 at a PV node, from move 7: 1). Depth 4: 1 at move 4,
     2 from move 5 (PV: 0 at move 4, 1 from move 5). Depth ≥ 5: 2 at every eligible move (PV: 1, growing to 2 from
     ln d × ln m ≥ 4, for example from move 7 at depth 8). So the table's grading acts mostly at PV nodes and at
     depth 4. Measured against a flat "2 at non-PV, 1 at PV" rule, the table saves more (0.68–0.80 against
     0.70–0.86), reaches deeper (+0.305 against +0.174) and keeps `zugzwang.004`, which the flat rule loses.
   - **Everything else is `ABC-121`'s, unchanged.** A reduced null-window search that fails high is searched again
     with the same null window at **full depth** before anything else is believed, whatever `r` was. Then PVS's own
     full-window re-search follows (`ADR-0026` decisions 1 and 6, `ABC-121` `A4`).
2. **The predicate is ONE new exported pure function in `src/search.ts`:
   `lateMoveReductionByTable(position, move, depth, index, atRoot, pvNode)`, returning plies (0, 1 or 2).** Both
   recursions call it when decision 3's switch is on, and subtract exactly what it returns.
   - **Eligibility is the flat rule's, unchanged.** It returns 0 at the root, at remaining depth < 3, at index < 3,
     for a capture or promotion, when the side to move is in check, and for a move that gives check. It derives these
     facts from the position and the move, as `ADR-0026` decision 6 requires. The Engineer may move the shared
     eligibility into one helper both predicates call; the flat predicate's answers do not change.
   - **The one new caller-supplied fact is `pvNode`.** It is a fact about the node's window, which no position
     carries, so the caller passes it. This is the amendment to `ADR-0026` decision 6's contract ("the caller passes
     only three facts"): for this predicate the caller passes four. The tactical facts stay derived inside it.
   - **The table `T` is a module constant**, a `Uint8Array` of 64 × 64 cells (4 096 bytes), built once at module load
     from the formula, never written after. Indices are capped at 63, and cells below d = 3 or m = 4 hold 0. Not a
     hand-typed literal. The nearest cell to an integer boundary is 0.0003 away (d 7, m 61), so the floor is stable.
   - **The flat `lateMoveReduction` stays exported and unchanged.** The doors use it, and its table test ("exactly
     1") keeps pinning it. `ADR-0026` decision 6's "0 or 1" contract now reads as that predicate's contract. The
     shipped path's contract is this decision's "0, 1 or 2".
3. **One switch, `logReductions`, in BOTH recursions:** `src/search.ts`'s `Switches` and `src/engine.ts`'s
   `Heuristics`. It is on in `search()` and `chooseMove` only. It implies `reductions` (and so `pvs`). With it off and
   `reductions` on, the recursion calls the flat predicate exactly as today. It reaches the recursion as a switch,
   never as module state, an `EngineOptions` field or a parameter of `search()` (`ADR-0026` decision 2).
4. **Two TEST-ONLY doors: `searchWithoutLogReductions(position, depth)` and
   `chooseMoveWithoutLogReductions(position, options)`.** Each is the shipped path with `logReductions` off and
   everything else on, reverse futility included. Node for node, they are the pre-ticket `search()` and `chooseMove`
   (the `ABC-264` merge). The engine door takes no depth (`ABC-078` `A4`).
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **two**, the door and the predicate. `ABC-078` `A4`
     (`src/engine.ts`) grows by **one**, its door. Three names in all, `ADR-0059` decision 4's precedent.
5. **Every door that exists before the ticket turns `logReductions` off** (`ADR-0026` decision 3's ladder rule). Log
   reductions are the top rung, above reverse futility. The doors that carry `reductions` today
   (`searchWithoutReverseFutility`, `…WithoutQuietPromotions`, `…WithoutQuiescenceEvasions`, `…WithoutNullMove` and
   their engine twins) keep the flat rule. They and every older door read exactly as today.
6. **Rows: `ADR-0050` decision 4, `ADR-0058` decision 5 and `ADR-0059` decision 6, by reference.**
   - **Re-point.** A row whose shipped side is `search()` or `chooseMove`, and whose other side is an older door,
     re-points its shipped side to the new door of the same recursion. Example: `ABC-264`'s drift, mate-floor and
     `A4` rows, which then read `searchWithoutLogReductions` against `searchWithoutReverseFutility` and keep their
     figures (0.5901 / 0.6373 …). No bound moves.
   - **Value and behaviour rows on the shipped path stay there.** That includes the seven zugzwang rows, the mate
     rows and `G1`. A row that moves is re-pinned, old and new figures in the PR. **No zugzwang row's depth is
     re-pinned**: a row that needs a deeper search is F3, not a re-pin.
   - **The PR lists every re-pointed and every re-pinned row.**
7. **The rows this ticket adds (the instrument for `A2`).**
   - **The predicate's table, called directly:**
     - cells (non-PV / PV): (3, 4) → 1 / 0; (4, 4) → 1 / 0; (4, 5) → 2 / 1; (5, 10) → 2 / 1; (8, 20) → 2 / 2;
       (3, 30) → 1 / 1, which is the child-depth clamp;
     - 0 for each eligibility clause, each on a move where every other clause would reduce.
   - **The re-search row at two plies**, `ABC-121` `A4`'s shape: a constructed null-window node where a move reduced
     by 2 fails high and is searched again at full depth. Seen through a call-through module mock, the `ADR-0050`
     decision 9 pattern; no production counter or hook. This is the row that catches a dropped re-search: the drift
     and mate rows pass that bug (`ruling-abc121-lmr-oracle`).
   - **A source row** reads both `negamax` bodies: with `logReductions` on, each calls `lateMoveReductionByTable`,
     passes `alphaIn + 1 !== beta` as `pvNode`, and subtracts exactly the returned value.
8. **The bounded oracle (`A3`).**
   - **Drift at depth 5 on the 190, in BOTH recursions.** `search()` is read against `searchWithoutLogReductions` at
     fixed depth 5, and `chooseMove` against `chooseMoveWithoutLogReductions`, each deepened to 5. Bars: **at least
     95 % of non-mate scores within 25 cp, none beyond 27 cp, and 0 mate scores change sign.** 27 is ⌊1.5 × 18⌋, the
     measured maximum with `ADR-0050` decision 8's headroom. Mate-status flips are reported.
   - **Mate floor on the 287, one ply deeper** (`ADR-0026` decision 9's form). For every position the door scores as
     a mate at depth 4, `search()` at depth 5 scores a mate of the same sign. Measured: 0 of 163. The same-depth count
     is a report (measured 2 of 189).
   - **Zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at their recorded depths, each plays its recorded move.
     These rows fix the cap at two plies.
   - **Scope, said plainly: this oracle is a regression net, not a proof.** The drift bar did not separate any two
     variants measured. The rule's correctness rests on decision 7's table and re-search rows; its payoff rests on
     decision 9.
9. **`A4`, its premise and its bars.** Pre-registered here; not loosened after Ready.
   - **(a) Nodes at fixed depth 8 on kiwipete and position-6, in BOTH recursions** (`search()` at depth 8;
     `chooseMove` deepened to 8 on a frozen clock): **≤ 0.85× the door's** on each of the four readings.
     - Measured: 0.7238 / 0.7086 (`search()`), 0.6795 / 0.8020 (`chooseMove`).
     - It reds the switch left unwired (1.00×), the textbook constants (0.934×), "never below the flat 1" (0.910×)
       and the flat 2/1 rule (0.862×).
   - **(b) Depth reached at 47 000 nodes on the 190** (`chooseMove` with `maxNodes: 47_000` on a frozen clock,
     `ABC-170`'s abort): **mean completed depth ≥ the door's + 0.25 ply.** Deeper and shallower counts are reported.
     - Measured: +0.305 (6.542 / 6.237).
     - This is the bar that reads what LMR is for. It reds the textbook constants (+0.126) and the flat 2/1 rule
       (+0.174).
   - **(c) `G6` "≥ base"** by its rule (floor 6).
   - **The instrument check, not a bar.** On the `4d1c0616` base a faithful build reproduces the probe's head counts
     to the node: 476 991 / 723 582 (`search()`) and 660 887 / 239 944 (`chooseMove`), plus the 6.542 / 6.237
     reach. If `ABC-264` merges at a different tree, the Engineer first re-reads the door's counts on `main`. A count
     that differs is explained in the PR before `A4` is read.
     - *Dated 2026-11-02 (`arch-phase2-rebase`).* `ABC-264` did not merge. On `main` the door reads 1 116 785 /
       1 602 457 / 1 575 537 / 476 244, and decision 1's head reads 849 358 / 1 183 439 / 1 155 460 / 414 286, with
       reach 5.558 / 5.811. `chooseMove` position-6 reads **0.8699, above (a)'s 0.85**. See § Status: F4 and F1
       apply, and the build does not start on this text.
     - *Dated 2026-11-02 (`arch-ADR-0060-reopen`).* The re-open probe re-read these counts to the node. Of nine
       pre-registered forms, none meets every bar on `main` (§ Status). No rule replaces decision 1, so no new head
       counts are pinned.
     - *Dated 2026-11-02 (`arch-post-268`).* On `main` `e72487e1`, with futility in force, the door reads 888 786 /
       1 262 046 / 1 306 981 / 391 451 (`ADR-0061` d9's counts, to the node). Decision 1's head reads 669 982 /
       974 021 / 940 419 / 333 830, with reach 5.837 → 6.221. `chooseMove` position-6 is **0.8528, still above
       0.85**. With the 63 cp cap miss and `zugzwang.004`, see § Status. The build does not start, and no head
       counts are pinned.
     - *Dated 2026-11-08 (`arch-ABC-284`; nothing run).* On `main` `50ff9250` (`src/` `bba42fb7`) the door is the
       shipped search. Its pinned counts are 311 546 / 163 523 (`search()`) and 573 518 / 94 911 (`chooseMove`),
       read from `src/search.bundle.test.ts`, not re-run. The 2026-11-08 look's LR1 re-reads them to the node, and
       its LR0 would give the head's counts. Until then no head counts are pinned. § The 2026-11-08 look, L1.
   - **`G1` (`A5`):** ≥ 54/58 with no NEWLY-MISSED line (measured 54/58).
10. **The read and the reports (`A6`, `ADR-0056` D5 as folded):** C2′ 100 games at 100 ms against the merge-base, S′
    10 games at 0.5 s against Stockfish 19 at E 1 650, and the Levels deep lane on the candidate head, all by
    reference.
    - **The intent is GAIN (≥ 50.0 of 100).** The page names it before the read (C2′'s 2026-11-02 line). It is
      never re-classed after a score is seen.
    - **Why GAIN and not NEUTRAL:** the mechanism fires at 100 ms. At depth 6 it reduces 12.0 % of non-first moves
      (41.8 % of them by two plies), and at the 100 ms node budget it reaches +0.305 ply deeper. The owner's NEUTRAL
      bar is for changes invisible at 100 ms; this one is not.
    - **What 100 ms can resolve, said before the read.** The node saving is 0.68–0.80× at depth 8. By `ADR-0055`'s
      50–100 Elo a speed doubling, that suggests roughly +15–45 Elo (estimate, [D]/[J]), the low end of D2's +40–100,
      which assumed the history term. C2′ resolves about ± 48 at 95 %, so GAIN means "point estimate ≥ 0", not a
      proven gain. The owner accepted that.
    - **The firing rate at 100 ms** is reported from a test-side or scratch instrument, never a production counter.
    - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime` or environment. The rule
      is keyed on depth, move number, the window and the position only.
11. **The history term and the cap are later, measured changes, not this ticket's.**
    - **History (O1h, `ABC-233`):** once a history table exists, its ADR may add a history term to this predicate
      (for example one ply less for a high-history move, one more for a low one), with its own reach and zugzwang
      readings. BA/PM decides whether `ABC-233`'s page carries it or a follow-up does.
    - **The cap:** the 40/15 claim searches to about depth 14, where a larger cap may pay. Lifting it is a dated
      amendment with a re-measured `zugzwang.004` and reach. A history term is the usual reason a deeper reduction
      becomes safe.
    - **Page deltas this ADR owes BA/PM** (not this hop's fence): the stub's title loses "history-adjusted" (decision
      11); `A1`'s export counts (decision 4); `A2` (decision 7); `A3` (decision 8: 27 cp cap, one-ply-deeper mate
      floor, zugzwang rows); `A4` (a), (b), (c) (decision 9); `A5` `G1`; `A6` GAIN.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1 — the formula and the cap | the drift bar red in either recursion (< 95 % within 25 cp, any score beyond 27 cp, or a mate sign change) | decision 8, `A3` | a defect, back to the Engineer. Red on a predicate that matches decision 1 exactly: NOT MET, and this ADR is re-opened with a new probe. No fallback is pre-chosen: the measured maximum (18 cp) sits well inside the cap |
| **F2** | 1 — horizon cost | a door-mate at depth 4 not a same-sign mate in `search()` at depth 5 on the 287 | decision 8 | a defect |
| **F3** | 1 — the cap | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 8 | a defect: first check the cap and the PV term (uncapped loses `zugzwang.004`, measured). Never a re-pin to a deeper depth |
| **F4** | the premise, it pays | `A4` (a) above 0.85× on any of the four readings, (b) under +0.25 ply, or `G6` below base | decision 9 | the ticket is not merged; this ADR "accepted, not in force" |
| **F5** | the premise, strength | C2′ NOT MET (< 50.0 of 100), or an S′ collapse | decision 10 | the same as F4. The next Phase 2 item is then P3 (P4 depends on P1), the Orchestrator's call |
| **F6** | 4, 5 — the doors | a new door not node-equal to the pre-ticket shipped search, or an older door not node-equal to its pre-ticket self, on the `ABC-078` `A3` corpus | `A1` (`G4`) | a defect in the door or the switch wiring |
| **F7** | regression | `G1` below 54/58, or a NEWLY-MISSED line | `A5` | classed per row under `ADR-0034`; an unexplained loss is a defect (the no-PV-term variant read 53/58) |
| **F8** | 1 — the re-search | the two-ply re-search row red, or the source row finding a recursion that subtracts anything but the returned value | decision 7 | a defect |

## Alternatives

- **Uncapped (the formula alone).** It saves more (0.54–0.72×) and reaches a little deeper (+0.337). Rejected by
  measurement: `zugzwang.004` is lost until depth 13, at 4.30× the door's nodes.
- **The textbook constants** (0.75 + ln d × ln m / 2.25, PV and killer terms). Rejected: they pay too little at
  100 ms (+0.126 ply), and `chooseMove` on position-6 reads 0.934×. They also lose `zugzwang.004`.
- **No PV term.** Rejected: `G1` 53/58 (seed 5180 newly missed) and 14 same-depth mate losses, against 2.
- **A killer term (one ply less for a killer).** No measurable effect (about 5 % of nodes at most, reach +0.331
  against +0.337),
  and it would hand the predicate the killer list. Not taken. History is the better-informed signal (decision 11).
- **A flat 2-ply rule at non-PV nodes, 1 at PV.** The boring rival to the table. Rejected by measurement: less saving
  (0.70–0.86×), half the reach (+0.174), and `zugzwang.004` lost.
- **A history-adjusted table now.** Not buildable without O1h's table. Pulling `ABC-233` ahead of Phase 2 changes the
  owner's order and an M ticket's scope. Not taken (decision 11).
- **Allow the reduced child to drop into quiescence.** Mixed effects, unmotivated. Child depth ≥ 1 is kept.
- **Change the flat predicate in place** (one predicate, no switch). Rejected: it would leave no pre-ticket door, and
  every older door and the `ABC-121` rows would change meaning. `ADR-0026` decision 10's pattern exists to stop
  exactly that.
- *Dated 2026-11-08 (`arch-ABC-284`):* **any form other than decision 1, for the 2026-11-08 look.** Every other form
  on record was read on the rows that look must pass, and lost at least one. Choosing one now would be choosing with
  the rows in hand. § The 2026-11-08 look, L1.
- **P3, P5 or P6 first.** Rejected in § Why P1 next: each saves less per depth (P3 0.88–0.91×, P5 0.83–0.99×), and
  P5 is depth-gated at 100 ms.

## Consequences

- **NFRs.**
  - `NFR-005`: expected to improve (fewer nodes per depth); read by `G6`, floor 6 unchanged.
  - `NFR-004`: abort granularity unchanged; no new throw site.
  - `NFR-008`: the predicate's table, the re-search row and the source row are default-lane units. Drift, mate floor,
    zugzwang and the reach reading go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`. The reach reading costs about 18 M
    nodes (two sides × 190 × 47 000), estimated 30 s.
  - `NFR-009`: a 4 096-byte constant, allocated once at load. Nothing grows per search and its level does not move.
    The PR states the bytes; no `G7` row is owed.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the table is built from `Math.log` once per process. The predicate is pure. The same
  input and virtual clock give the same move.
- **The order with `ABC-264`.** The code waits for `ABC-264`'s merge (the same two files). The probe measured on its
  head, so the door is the post-`ABC-264` search. If `ABC-264` does not merge, the premise is re-measured on `main`
  and decision 9's counts are re-derived by a dated line here. The bars stay.
  - *Dated 2026-11-02 (`arch-phase2-rebase`):* re-measured on `main`. Two bars miss (`A3`'s 27 cp cap,
    `A4` (a) on `chooseMove` position-6), so the ADR is re-opened (F1). See § Status.
- **Threads (`ABC-265`–`ABC-267`):** no interaction. This ticket edits no `src/transposition.ts` line. The rule is
  per node, so every worker applies it alike.
- **P4 coupling (named, not decided).** Move-count pruning reads the same move number and depth. Its ADR decides
  whether it shares this table's indices.
- **No eval-scale coupling.** The rule reads no evaluation, so E1 and E2 do not re-scale it.
- **Module headers** in `src/search.ts` and `src/engine.ts` name the new switch, as they name `ABC-264`'s.
- **Migration:** none. No data, format, option or dependency changes.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated pointers in `ADR-0026` decision 6 and
  `ADR-0056` D2. Nothing else was edited.
- **After it ships:** set `logReductions` to false in `search()` and `chooseMove`, two booleans. The shipped path is
  then node for node the door, `ABC-121`'s flat rule. Deleting the switch, the predicate, the table, the two doors
  and the re-points afterwards is a mechanical revert of one ticket.
