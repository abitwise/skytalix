---
id: 20261010T133223Z-qe-e2e-decision-abc057-verdict-pass-with-gaps-70eb6930
kind: decision
by: qe-e2e
at: 2026-10-10T13:32:23Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ADR-0011
  - ADR-0029
  - ADR-0030
  - R5
  - QE-054-b
  - AR-053-ORDER
  - M15
  - src/history-pane.nfr.test.ts
  - 20261010T133223Z-qe-e2e-observation-abc057-ledger-spans-docblock-readings-019d1043
  - 20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012
  - 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
  - 20261010T131017Z-software-engineer-observation-abc057-gates-ledger-arming-controls-cost-4d731ea3
  - 20261010T131349Z-software-engineer-observation-abc057-fix-forward-two-comments-c225fb9c
supersedes:
---

# `ABC-057` QE verdict: **PASS_WITH_GAPS** at `00aad4da`. `A1`–`A5` MET, test note 5 as required, three LOW gaps and five INFO, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate` verdict
exists on this install (`AGENTS.md`).
- Under review: `079284d9..00aad4da` on `grugops/ABC-057-licence-guard`. The code is `404934f3` and
  `d2920d60`.
- QE ran the gates in the Engineer's worktree.
- Every build ran on QE's own harness (`../probe/plantqe057.py`, `../probe/ledger.sh`) with QE's own
  spellings. Each build was planted into a fresh `git archive` copy in QE's scratchpad, and no byte of
  the worktree was planted.
- `Q-CTRL-*` builds are delegated, unchanged, to `qe-ABC-053/probe/plant.py`.
- The spans were re-hashed with QE's own anchors (`../probe/spansqe.py`, sha256). The Engineer's
  numbers were not used.

| | QE's reading | result |
|---|---|---|
| `A1` | `M15`, verbatim from the page, on the whole `src` lane. On head it is **RED**: 1 failed / 1582 passed, and the only failure is `the licence guard compares with an EQUALITY`. On base `079284d9` it **survives**, 1583/1583. The verbatim spelling is lint-red on both trees, but only on formatting, so QE also read it after `biome format` (`M15+FMT`). That spelling is lint 0 and tsc 0, RED on head with the same single attribution, and 1583/1583 on base. `M15-SUB` reads the same way in both spellings. On base, each mutant loses a real kill: `M15+FMT+WSTALELICENCE` is green, and so are `M15SUB+FMT+WPERFT-STATIC` and `M15SUB+FMT+QWLAUNDER-CLIOPT`. On head, each of those reds on the tripwire only | **MET** |
| `A2` | `WLAUNDER`, `WPERFT-STATIC` and `WSTALELICENCE` (QE's spellings; the stale licence uses a top-level `await import`, so the loop still runs) give the **same failing tests on base and head**: 3, 1 and 1, with the same messages. The sibling tripwire is a 4-line span with the same sha256 (`0f1fda2690e34d56`) at base, `404934f3`, `d2920d60` and `00aad4da` | **MET** |
| `A3` | 0 occurrences of `game-owning driver` in the file. (i) and (ii) are word for word with `ADR-0011`'s amendment (`:300-309`), along with "both", "citation must show both", the frame-path exclusion and the refused wide reading | **MET** |
| `A4` | 2/2. Every fact in the two citations was checked against code. `turn-loop.ts` calls `playMove`, `takeBack`, `gameStatusOf` and `keyHistory` (`:256`, `:304`, `:342`, `:389`, `:414`, `:435`, `:442`), receives `history` injected (`:154`), and has no bare `gameStatus(` and no `new Map` outside comments. `cli.ts` calls `newGame` (`:166`), which is `history.ts`'s only constructor, and exports nothing. `render-seam.ts` really is guarded against importing `history.ts` (`render-seam.test.ts:309-325`). | **MET**. The `turn-loop.ts` (i) reading is gap QE-057-c |
| `A5` | `git diff --name-only` for `404934f3~1..404934f3` and for `d2920d60~1..d2920d60` is `src/history-pane.nfr.test.ts` and nothing else. The production filter prints nothing. numstat is +34/−12 and +8/−6, so +42/−18 over the range. The only non-comment `+`/`−` lines are the 3-line `toContain`. Counts of `spawn`, `execFile` and `readFileSync` are unchanged, base to tip (2/1/6). Suite green, skip 0 | **MET** |
| test note 5 | `Q-CTRL-DEAF-AFTER-LOAD+X5b` is **RED** on `the probe is ARMED: expected [] to include 'history.ts'`, on head and on base. `Q-CTRL-ARMING-FIRST+DEAF+X5b` is GREEN, 12/12, by construction. The probe's `it` is byte-identical (115 lines, `051ea712d8d7c1e5`). `loaded = []` appears 3 times and `await import(arming)` once, on both trees, so no phase-label assertion is owed | as required |

**Gate at `00aad4da`** (`../probe/gates-tip.txt`). Node v26.11.0, load1 2.1 → 6.3.
- `npm run lint`: exit 0, 98 files.
- `npm run typecheck` and `npm run build`: exit 0.
- `npm test`: exit 0, **51 files / 1583 passed**.
- Skip count: **0**, measured.
- `test-skip-integrity.js … --skip-count 0`: `No findings.`
- `lane-inventory.js`: 51/51, no findings.
- Not triggered: `PUZZLE_DEEP` (no engine file) and `CLI_DEEP` (no `src/cli.ts` or `src/engine.ts` change).

**Cost was not re-measured.** The task did not ask for it. The added work is one `String.includes`
over a string already in memory, and the `N8-LANE` added-file scope is empty. The Engineer's set 2
reading stands as their reading, not QE's.

**Why PASS_WITH_GAPS and not PASS.** Every criterion is met as written, and the ticket's own mutant
is red on head and green on base. The gaps cover what the pin and the narrowed prose do not reach.
Each one is measured, and none breaks a criterion:
- **QE-057-a.** The pin covers the operator. It does not cover the operands. A gate-clean one-line
  narrowing of `runtimeImporters`, or of the scanned set, survives the whole lane on head, with
  `WPERFT-STATIC` green. This was already true on base.
- **QE-057-b.** The composer docblock lists "two" uncounted static value imports. QE found two more
  that are gate-clean.
- **QE-057-c.** `turn-loop.ts`'s (i) reading of "receive one injected" goes beyond the ADR. It is
  already flagged to Architect/Design, and QE adds a counterpoint.

**Why not FAIL.** No criterion fails. No protected span moved. No docblock statement is false
against the code: the historical "green before and after `turn-loop.ts`" was measured true at
`6cd25079` and `d83a7e4d`. Every surviving mutant is outside the ticket's named property, or is a
deliberate edit that test note 2 already concedes.

**Next.** The board move out of `In Review` is the Orchestrator's (the board is fenced from QE's
hop).
- Security is "not triggered" on the page: 0 production lines and 0 new spawns. QE measured nothing
  that contradicts it.
- UAT is waived by the zero-production-lines rule (measured: the filter prints nothing).
- The gaps are routed in `…a331f012`.
- Not merged, not pushed.
