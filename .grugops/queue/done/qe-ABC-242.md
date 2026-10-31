---
subtask: qe-ABC-242
role: qe-e2e
ticket: ABC-242
ref: .grugops/context/qe-ABC-242/
branch: new grugops/qe-ABC-242 from grugops/ABC-242 56058203 (worktree .claude/worktrees/qe-ABC-242); base 4387d4e8, head 6884d61a
width: ALONE: no other hop runs; timing reads with the host clear
---
# QE ABC-242 (S, P3, S2, no smoke): blunder-path third occurrence scores 0
## Read
The ticket page (A1–A8, NFR triggers R1–R4, Test notes), ADR-0054 § Proposed amendment 2026-10-30 (ACCEPTED), ADR-0032 d1/d2,
ADR-0046 § Addendum R1–R4, and se-ABC-242's sealed notes and raw/probe/ on the branch (.grugops/context/se-ABC-242/).
## Do
- PREREG first: commit your plants and harness before any head run.
- A1–A3 against the REAL base tree (4387d4e8, scratch worktree), not only the SE's test-local `base()` copy (SE-242-e). Confirm that copy matches base's `blunder`.
- Plants on scratch copies only: at least the two-match → one-match plant (A2 must go red), the clock bound dropped (A3 red), the skip turned into a search (A1 child count red), and a plant on the 100 cap. Report survivors; judge the SE's M7/M8 equivalence claims (SE-242-c).
- A4: rerun both rows; confirm one step across all three callers (R3).
- A5, A6 identity, A7 gates: lint, typecheck, build, `npm test` ×3 with skips 0 and skip-integrity, G9 bytes, ENGINE_DEEP levels lane and LADDER_DEEP short once each.
- R1 census: check the SE's lines and the step-10 choice (ABC-244 condition 2).
- G8, ALONE, order b h h b b h, wait-clear by `kill -0`: report the medians. Head > 9.6 s fires tranche 2 (report only). Head > 10 s: STOP.
- SE-242-a: a short reading of whether the probe's base d8e8 (−1020 now, −1013 recorded) moved with a known merged ticket. Time-box it to 15 min; UNKNOWN is fine.
- Verdict PASS / PASS_WITH_GAPS / FAIL. UAT is owed (production lines) and your verdict signs it.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait (QE-243-a).
- Thermal stop: Tctl median > 85 °C.
- Scratch `qe-242/`.
## Publish
Sealed notes (task `qe-ABC-242`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. QE verdict: PASS_WITH_GAPS** at `6884d61a` (base `4387d4e8`).
- ALONE. PREREG `5da281c9` was committed before any head run. Notes were sealed at `dd7983c5`. Not merged, nothing
  pushed.
- Notes (task `qe-ABC-242`):
  - decision `…f24601b8`;
  - oracle `…f041ddb3`;
  - plants `…93eb0bf9`;
  - census / condition 2 `…51079df4`;
  - gates, deep and `G8` `…24035110`;
  - findings `…b9f3cd67`;
  - artifacts `…d78f87d8`.

**Acceptance**
- **A1 MET.** Read against the REAL base tree, out of tree with a counting shim, at steps 10 and 1:
  - the repeat scores exactly 0 at H and ≠ 0 at B;
  - H runs legal−1 child searches, B runs legal;
  - the entries before the repeat equal B's;
  - probe: `scored[0]` is `{d8e8, 0}`, 4 of 5 searches, and it plays d8c8;
  - `last`: the whole list is B's except its 0.
- **A2 MET.** H = B in full, and d8e8 reads −1005. Q1 (one match) turns A2 red.
- **A3 MET.** H = B in full. Q2 (no clock bound) turns A3 red.
- **A4 MET.** Both rows re-run green, with one `STEP_MS` (10) on all three callers in both files (R3).
- **A5 MET.** The row is green, and the pick recomputed on 1 099 sweep roots equals H's every time.
- **A6 MET.** No keys and `[]` give H = B in full, elapsedMs included. The engine-path files are byte-identical. The lane
  is +10 rows, −0, and the name hashes are equal.
- **A7 MET.** lint, typecheck and build exit 0. `npm test` is green ×3 with skips 0 and skip-integrity clean. `G9` bytes
  are equal. `ENGINE_DEEP` levels: 53/53 (577 s). `LADDER_DEEP` short: 18/18.
- **A8 confirmed.** `rating.ts` sets no Skill Level, and the ladder hands no prior keys.

**Checks**
- **SE-242-e confirmed:** the SE's `base()` equals base's real blunder on 42 of 42 checks.
- **Differential sweep:** 1 099 roots (273 with a third-occurrence move, 204 second occurrences), 0 FAIL.
- **Plants:** 20 of 20 as pre-registered. Every required red held: Q1 → A2, Q2 → A3, Q3 → A1 on the child count.
  - Equivalent survivors: Q7 (cap removed), Q11 (M7), Q12 (M8), Q16a.
  - Not equivalent: Q6 and Q8 (cap 8 and cap 50).
  - Unpinned by design: Q18 (a clock read in the check).
  - At step 1 the kill sets are identical to step 10 on 20 of 20 plants.
- **SE-242-c:** QE agrees that M7 and M8 are equivalent, and that removing the cap is equivalent. Lowering it is not
  (QE-242-b).

**`G8`**
- B 9.21 s, H **9.41 s**, H − B +0.21 s (the estimate was +0.05..+0.15). 6/6 rc 0, load1 ≤ 1.60.
- `NFR-008` MET. Tranche 2 (> 9.6 s) **not fired**, with a margin of 0.19 s. No STOP.

**Findings**
- **QE-242-a MEDIUM:** a ruling is owed by BA/PM.
  - On the budgets actually handed, step 10 gives the children 10, −10, −30, −50 and −70 ms, so 4 of 5 run depth 1
    unabortable, and the blunder's virtual elapsed time is 210 ms of 100.
  - `ABC-244` condition 2, read per child search, admits only step 1, and step 1 would cost about +2.5 s of lane wall.
  - The SE's "2 reads per child" is the nominal slice.
  - Kill parity holds and the product is unaffected.
- **QE-242-b LOW:** lowering the cap (Q6/Q8) survives the lane, because no fixture reads past −8. Q18 is INFO.
- **QE-242-c INFO:** the ladder pair lines were not captured by the default reporter, and the run was not repeated.
- **SE-242-a answered:** d8e8 moved −1013 → −1020 at the `ABC-228` merge `e42b637b` (quiescence evasions), and is
  unchanged since.
- SE-242-b and SE-242-f: INFO. None blocks.

**UAT:** owed (production lines in `src/levels.ts`). **This QE verdict signs it.**

STOP: none.

### Trace row (10 cells, header order)

| ABC-242 | On a blunder (levels 1–4) a root move that makes the third occurrence scores exactly 0, its child unsearched; CLI and UCI through createLevel; engine path unchanged | EPIC-010 | ADR-0054 § Proposed amendment 2026-10-30 (accepted) A1–A6; ADR-0032 d1 added bullet; ADR-0046 § Addendum R1–R4 | NFR-008 G8 MET H 9.41 s (B 9.21 s, +0.21 s; tranche-2 9.6 s not fired); NFR-004 ≤ 49 comparisons, G5 level-5 max 4 002 ms; NFR-009 no allocation; R1 census present, condition 2 ruling owed (QE-242-a) | grugops/ABC-242 @ 6884d61a: src/levels.ts (+38), src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts | npm test 63 files / 2 333 pass ×3, skips 0; QE oracle vs real base 362/0 FAIL; plants 20/20 as pre-registered (Q1→A2, Q2→A3, Q3→A1 red); ENGINE_DEEP levels 53/53; LADDER_DEEP short 18/18 | QE PASS_WITH_GAPS (UAT owed; the QE verdict signs) | — | In Review → QE PASS_WITH_GAPS (branch, not merged) |
