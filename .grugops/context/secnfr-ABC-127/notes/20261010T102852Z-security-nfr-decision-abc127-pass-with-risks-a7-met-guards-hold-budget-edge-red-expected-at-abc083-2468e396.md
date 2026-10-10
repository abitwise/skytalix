---
id: 20261010T102852Z-security-nfr-decision-abc127-pass-with-risks-a7-met-guards-hold-budget-edge-red-expected-at-abc083-2468e396
kind: decision
by: security-nfr
at: 2026-10-10T10:28:52Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-083
  - ABC-087
  - ABC-084
  - RISK-003
  - N8-LANE
  - NFR-008
  - ADR-0019
  - ADR-0026
  - ADR-0027
  - ADR-0028
  - src/puzzle-suite.test.ts
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - plans/nfr-catalog.md
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - .grugops/context/secnfr-ABC-127/notes/20261010T102840Z-security-nfr-observation-abc127-a7-quiet-20-24s-n8lane-225ms-net-budget-edge-4pct-red-6a3b6274.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970.md
  - .grugops/context/ticket-to-pr-ABC-127/notes/20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223632Z-security-nfr-decision-abc084-pass-with-risks-n8lane-met-a6-stays-default-a5-timeout-false-red-fix-c3a91e57.md
supersedes:
---

# `ABC-127` Security/NFR: **PASS_WITH_RISKS**. `A7` MET as readings, `N8-LANE` **MET at +225 ms net**, and no lane row reaches the 300 s guards. QE-127-a is upgraded: **the gate is now EXPECTED to go red at `ABC-083`**, and `ADR-0028` gives that red no agent route

Hand-authored and unsealed: a `decision`, not a stamp. `human_admission` is `off`, and this install
has no sanctioned writer.
- **Reviewed:** `4a64dd9..1087a42 -- src` on `grugops/ABC-127-harder-puzzles`.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** observation `…6a3b6274`. Every number below carries its load1 there.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so nothing blocks the merge of `ABC-127`.
- **One MEDIUM required fix, `R1`.** It is owed **before `ABC-083` enters `In Development`**, not
  before this merge. If it is not taken, the risk `AR-PUZZLE-EDGE` needs the owner's word. This gate
  does not accept it.
- Board moves are the Orchestrator's.

## Rulings

| # | item | reading (load1) | severity | ruling |
|---|---|---|---|---|
| 1 | **`A7`** (gating ≤ 45 s, lane ≤ 90 s at load1 ≤ 8; readings, never asserted) | **Conforming:** gating **20.4 / 21.4 / 24.3 s**, lane **32.9 / 34.5 / 36.2 s** (load1 3.8–5.4). **Loaded:** 26.9–34.5 s / 50.2–53.3 s (load1 11–25). QE's 43.7 s was at load1 9–19 | — | **MET**, with 1.9x / 2.5x of margin. No wall assertion exists. The four deep rows carry `300_000` guards (`src/puzzle-suite.test.ts`, lines 416, 442, 454, 460). Readings above the cap at load1 > 8 are not breaches, by the cap's own load condition |
| 2 | **`A8` / `N8-LANE`** | 0 new test files (50 → 50 at both arms). Lane, standing protocol: **+225 ms net** (null −1.35 %, sign 3/8, admissible; charge sign 5/8; load1 median 21). File alone: **+45 ms** (8/12, load1 15–24) | — | **MET: +225 ms against 650 ms.** Not separable from zero on the lane at this load; the file-alone content is 45 ms. Clause state: `NFR-008` CPU is not re-ruled here (item 7) |
| 3 | **300 s guards vs QE-127-g** | The 4x reading (299.0 s) runs at step 0.25. No lane row runs at that step: the gate row reads step 1 from the baseline file. The largest lane row, gating, needs **12x** inflation over its conforming reading (300 / 24.3) to trip. The worst inflation measured in this repository is **6.3x** | LOW (forward) | **Only a probe. No lane row reaches 300 s at the shipped engine.** The guard's real precondition is the cost of a node (item 4) |
| 4 | **The guard after an engine change** | The budget is a node count (`NODES_PER_CLOCK_CHECK` 1024, 1.20 M nodes per gating run, about 17 µs per node). A mobility-shaped probe (2 `legalMoves` per evaluation) read gating **51.8–52.6 s at load1 3.9–6.5**. That is over 45 s at a conforming load, and about **330 s at 6.3x** | LOW | **Recorded risk, owner QE at each option-B run.** Read the printed gating wall with load1 beside it. A conforming reading over 45 s is reported per `A7`'s stop rule, and the guard is re-sized before it can turn load into a red (`ABC-084` `F1`'s lesson). **`ABC-083` `A5` (≤ 1,100 ns per evaluation) forbids the probe's cost.** While `A5` holds, the guard holds; the size of the effect within `A5` is `UNKNOWN - verify` |
| 5 | **QE-127-a: does it change the risk of `ABC-083` / `ABC-087` reddening the suite under `ADR-0028`?** | **Yes, materially.** **4 % fewer readings (one reading of 25) → 57/62, red.** 4 of 5 benign evaluation terms planted out of tree → red (57 / 54 / 57 / 55). All four reds include a budget-edge row that falls a ply short (d5 → d4). E4 recovers to 58 at +5 % readings | **MEDIUM**: the strength gate's reliability, the same class as `ABC-084` `F1`. Not an ASVS item | **Required fix `R1`** (below) |
| 6 | Security (ASVS L1) | Static rows, pure search functions, console lines. No `process`, `fs`, spawn, `eval` or dynamic `import()` in the added lines. No production importer. No dependency or config change | — | **No finding.** "Not triggered" is confirmed |
| 7 | `NFR-008` (read, not ruled) | Base arm 26.2–26.7 s CPU at load1 7.2–8.0, and 35.3 s median under contention (Node v26.11.0, not the reference v24.12.0), against 15 s CPU and 3 s wall (base arm, Node v26.11.0); 0 files added | info | Reported to Architect/Design (`ADR-0019`), as at `ABC-082` and `ABC-084` |

## Item 5 in full: why the risk changed, and what `ADR-0028` does with it

**Before `ABC-127`.** `ABC-084`'s 40 rows saturated at about 5 readings of 25 (QE-084-b). A red from
tree-shape drift was effectively impossible, so a red meant a strength loss.

**After `ABC-127`.** The rows that make `W13` and `W14` go red (seeds 1008, 1075 and 1982, with 1424
beside them) finish depth 5 or 6 with less than one reading to spare.
- **A value change that enlarges the tree by about 4 % on one of these rows turns the gate red.**
  It does not have to be wrong to do that.
- **The evaluation weakenings `W6`–`W8` and `W10` do not reach these rows. A +10 cp tempo bonus
  does.**
- **The suite cannot tell "LMR mis-reduces" from "the tree grew".** QE said this; the planted terms
  show it happens with ordinary evaluation terms.
- **`ABC-083` changes `src/evaluate*.ts`, so option B runs the suite, and red = QE FAIL.** On this
  evidence a red at `ABC-083` is the expected outcome, not an edge case. That is the "gate that
  cries wolf" `ABC-084` `F1` warned about.

**`ADR-0028`, read against this (`ABC-083` is in its scope, decision 6):**
- **Decision 1 (not-a-defect first) applies, and the per-row lines make it cheap.** A mate-in-3 row
  that reads one ply shallower than recorded is budget drift. A row that keeps its depth and changes
  its move is behaviour.
- **Decision 2 (fixture re-find, no owner word) fits the win-material rows only.** Their label is
  "material-best by ≥ 2 pawns", which is an evaluator margin. E2 and E5 missed two such rows at the
  recorded depth.
  - **It does not fit the mate-in-3 rows.** Their labels are rules-exact (`A2`). What moves there
    is the node budget, not the label.
- **Decision 3 (one ÷1.5 headroom) cannot be applied to this count.** 58 / 1.5 → 39 turns **13 of
  the 15** red weakenings green. That undoes `A3` and falls below `ABC-084`'s own floor of 40.
- **Decision 5, with `ABC-084` `A7`: any lowering is the owner's word.**
- **Net: a budget-edge red at `ABC-083` has no agent route.** Every one goes to the owner.

**`ABC-087`.**
- It is a search change, so `ADR-0026` decision 10 governs it, not `ADR-0028` (decision 6).
- **If its blunder or candidate scoring spends nodes inside the `chooseMove` the runner calls**
  (its page: "spends nodes from the same per-move budget"), the sweep's mechanism applies
  directly: −4 % → red.
- If its levels wrap `chooseMove` from outside, the runner is unaffected.
- **`UNKNOWN - verify`** until the page's design question is ruled.

## `R1` — the required fix (MEDIUM, non-blocking under `block_on: high`)

- **Owner:** the Orchestrator, to route.
- **When:** before `ABC-083` enters `In Development`. The ruling belongs to Architect/Design
  (`ADR-0028`'s author) and to the owner for any level.
- **What:** a pre-ruling on how a `PUZZLE_DEEP=1` red on a value-changing ticket is read and routed.
  It is written once, the way `ADR-0028` was, rather than ruled again for each ticket.
- **No `ABC-127` code changes.** **What the ruling must not do:** loosen `solved >= baseline`,
  touch the baseline without the owner's word, or change option B's red rule. All three are his,
  verbatim.

**The options, sized from these readings. This gate does not choose between them:**
- **(a) Keep the gate as it is, and pre-shape the evidence.** Every such red goes to the owner with:
  - the per-row depth signature;
  - an out-of-tree re-run at +5 % and +10 % readings.

  Cost: expect one owner decision per evaluation ticket, starting at `ABC-083`.
- **(b) Re-cut for margin (BA/PM with QE).** Every solved row must stay solved at ≤ 0.9x readings,
  so seeds 1982, 1008 and 1424 (and 1075, at 0.87x) are dropped or replaced.
  - **Cost:** `W14` survives, because its red rests on 1008 + 1075. By QE's matrix, `A3`'s bar still
    holds: `W1`, `W1b`, `W4` and `W5` stay red, and `W2` (4), `W13` (2) and `W16` (7) cover the
    optional set. That is `UNKNOWN - verify` until it is re-run.
  - **The solved count falls 58 → 54, which is the owner's word** (`ABC-084` `A7`).
- **(c) Raise the recorded budget by about 10–15 %** (for example 25 → 28) so the edge rows have
  slack.
  - **Cost:** about +12 % on `A7`. `W13` and `W14` probably go the same way as in (b). `A4`'s
    ≥ 3 unsolved rows are `UNKNOWN - verify`. Re-recording is the owner's word only if the count
    falls.

**If `R1` is not taken, the risk is `AR-PUZZLE-EDGE` (MEDIUM).**
- *"`PUZZLE_DEEP=1` is expected to go red at `ABC-083` with no defect: budget-edge rows fall a ply
  short when an evaluation term enlarges the tree by about 4 % or more (measured: 4 of 5 planted
  terms). Red = QE FAIL, and every lowering is the owner's word."*
- **Owner of the risk: Olger Oeselg.** Option B, its red rule and the lowering rule are his.
- **This gate does not accept it.**

## Accepted and recorded risks (each with an owner)

| id | risk | severity | owner | disposition |
|---|---|---|---|---|
| `AR-PUZZLE-EDGE` | Item 5, if `R1` is not taken | MEDIUM | **Olger Oeselg** | **Not accepted by this gate.** Needs his word |
| `RR-PUZZLE-GUARD-COST` | Item 4: the 300 s guard trips under heavy load after an engine change that raises the cost of a node by about 2x | LOW | **QE** (reads the printed wall at each option-B run); **Architect/Design** (`ABC-083` `A5`, the precondition) | Recorded. The control is a reading and is already printed |
| QE-127-d (confirmed) | E2 lost 5 rows and gained 1 on a red run, so a smaller net loss would hide behind a gain | LOW | **QE** | **Endorsed:** QE's practice of reading every `NEWLY-MISSED` line on a green run |

## Proposed `plans/nfr-catalog.md` wording

The catalog is fenced from this hop, so this is a proposal. Its place is Security/NFR's, with the
owner's word if he wants it as a rule. It belongs under `RISK-003`, beside the standing *"No
wall-clock assertion belongs in the suite"*:

> **Deep-lane hang guards and count gates on a node-budgeted suite (`ABC-127`, 2026-10-10).**
> 1. **A guard is sized against the lane's own printed wall:** quiet reading × 6.3 (the worst load
>    inflation measured, `ABC-084`, load1 49–54) must stay under the guard. On a virtual clock the
>    wall is *nodes × cost per node*, so **a change that makes a node dearer re-reads the wall at its
>    QE run, with load1 beside it.** A conforming reading over the ticket's cap is reported, never
>    trimmed, and the guard is re-sized before load can turn it into a red.
> 2. **A count gate records its budget margin:** the smallest cut in readings that turns it red
>    (`ABC-127`: −4 %, one reading of 25). Within that margin, a red on a value-changing ticket is
>    read by depth signature before it is routed. A row one ply shallower than recorded is budget
>    drift; a row at its recorded depth with a different move is behaviour. A margin smaller than
>    the node drift of an ordinary evaluation term is a gate that will cry wolf; say so at the cut.

## Notes handed on (each with an owner)

- **Orchestrator.**
  - `R1` routing, before `ABC-083` is pulled. `ABC-083`'s page already says a puzzle red is a QE
    FAIL (its Dependencies).
  - The zero-production-lines call at `Ready for UAT`. The waiver's git test lists
    `src/puzzle-corpus.ts` and `src/puzzle-suite.baseline.json` (test-only data, not `*.test.ts`).
    As at `ABC-084`, the call is the Orchestrator's, and this gate does not assert it.
- **AGENTS.md Scribe (`A9`).** The drafted line (`…6341cc47`: "32-34 s (gating run 20-21 s) at load1
  4-8") agrees with the conforming readings here (32.9–36.2 / 20.4–24.3 s at load1 3.8–5.4). Nothing
  else is owed from this gate.
- **Architect/Design (`ADR-0019`).** Item 7.
- **BA/PM.** If `R1` chooses (b) or (c), that is a re-cut. QE-127-e remains with BA/PM as QE routed
  it.

## Fence

- Zero lines under `src/`, `tools/`, `package.json` and `plans/nfr-catalog.md`.
- No `plans/board.md`, `AGENTS.md`, ADR or baseline-file edits.
- Every arm, sweep and plant ran out of tree, in this gate's private scratch directory. The
  worktree's `git status` was clean after every run.
- No load was induced (`ABC-119` was building alongside).
- Nothing merged or pushed. `ABC-119`'s files were not touched.
