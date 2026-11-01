---
id: 20261101T075832Z-software-engineer-observation-aedad93f
kind: observation
by: software-engineer
at: 2026-11-01T07:58:32Z
verified_by: 
confidence: high on SE-248-a (both command forms were run) and SE-248-c/d; SE-248-b's mechanism is inferred from one node/time read; artifacts as committed
refs:
  - se-ABC-248
  - ABC-248
  - ADR-0046
  - ADR-0050
  - NFR-008
  - EPIC-010
  - ABC-244
  - ABC-177
  - ABC-167
  - ABC-208
  - QE-208-a
  - QE-208-b
  - QE-244-a
  - QE-245-b
  - WRONGSIDE
  - SE-248-a
  - SE-248-b
  - SE-248-c
  - SE-248-d
  - grugops/ABC-248
  - 7e9ab524
  - 71700836
  - 46365ed0
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:bf4a929b5bcd3c95b0456fa642d6539edd13b54126d66fcdcc0c713bfb9e7f56
---

# `ABC-248` SE findings, artifacts and handoff: one ruling-6 command trap (SE-248-a), the A4-a2 node drop (SE-248-b), the wrong-side sole killers (SE-248-c)

## Findings (SE's, for QE to weigh; no `finding` kind is admissible on this install)
- **SE-248-a (MEDIUM, a gate-command trap; nothing changed here).** Ruling 6 / A10 gives
  `ENGINE_DEEP=1 … npx vitest run src/uci-session.test.ts -t "<moved describe>"`. Vitest reads `-t` as a regular
  expression, and the moved describe's title ends "[deep, ENGINE_DEEP=1]". Written as is, that bracket becomes a
  character class, so the full title matches nothing.
  - The command then runs **0 tests and exits 0** ("241 skipped"), which is a vacuous green (`raw/deep-run-unescaped.txt`).
  - Escaping the brackets runs the 4 rows green: `-t "ABC-167 A5 — the D4 time rule, read from the info line's time
    \[deep, ENGINE_DEEP=1\]"`.
  - QE should use the escaped form (or a bracket-free prefix such as `-t "line's time \[deep"`) and check that "4
    passed" is printed. The same trap applies to the existing deep describes; AGENTS.md's `-t "ABC-221 A10"` avoids it
    by stopping before the bracket.
- **SE-248-b (INFO; how condition 2 reads).** At step 1 000, A4-a2's bare `go` completes depth 3 on 1 044 nodes with
  `time` 5 000. At step 100 it was depth 6 on 34 836 nodes with `time` 4 100.
  - The engine also reads the clock at entry and before each iteration. On a 1 000 ms step those reads use up the 4
    000 ms by the first 1 024-node check, so the search makes about one in-search node check.
  - Ruling 2 counts intervals as ⌈budget ÷ step⌉ (40 → 4) and names A4-a2 as passing. That is the rule I applied, the
    same arithmetic `ABC-244`'s U1 rows went through.
  - The row asserts no depth and no time, and its kill set is unchanged, so parity holds. Whether condition 2 should
    count reads or node checks is a ruling question, not this ticket's.
- **SE-248-c (INFO, a coverage map).** In the default lane, "white reads wtime" is the only killer of WS-WHITE and
  "black reads btime" is the only killer of WS-BLACK. Those two rows are also the only default-lane killers of
  `WRONGSIDE`. So the census's `UNKNOWN - verify` is now read: both rows stay.
- **SE-248-d (INFO).** Of qe-ABC-177's re-frozen union list, 24 entries no longer apply as written at `46365ed0`
  (listed by `freeze.mjs`). M06 and M07 are among them, and I re-anchored both (167-M06r, 167-M07r). QE's own A5 list
  may want the same re-anchoring.

## Artifacts
- **Branch:** `grugops/ABC-248` (worktree `.claude/worktrees/se-ABC-248`, from `main` `46365ed0`). Nothing pushed, not
  merged.
  - `7e9ab524`: the PREREG, with the frozen lists and runner, before any head run.
  - `71700836`: the code, the two test files only.
  - The notes commit follows.
- **Files:** `src/search.null-move.test.ts` (QE-208-a sweep and title; QE-208-b root and titles);
  `src/uci-session.test.ts` (A5's four rows moved into a new `[deep, ENGINE_DEEP=1]` describe before A11; A4-a2 step
  1 000).
- **Tests:** none added, none removed. Four rows moved out of the default lane into `ENGINE_DEEP`, and three were
  retitled per ruling 5. The lane goes 2 366 → 2 362.
- **Commands run:** `npm run lint` / `typecheck` / `build` and `npm test` (×2 at the tip, ×2 at base, b h h b);
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; `node tools/grugops/lane-inventory.js`;
  the deep lane via `node_modules/.bin/vitest` (no `npx`); `probe/mut.mjs` (9 arms); `probe/parity.mjs`;
  `probe/t2a.mjs`; the scratch probes `t2c.probe.test.ts` and a node probe (not in `src/`).
- **Docs:** none touched. `AGENTS.md` is not edited (condition 5). Its `ENGINE_DEEP` uci-session line still runs the
  moved rows.
- **UAT waiver check:** `git diff --name-only 71700836~1 71700836 | grep -v '\.test\.ts$' | grep '^src/'` prints
  nothing. There is no production line.

## Remaining work (QE, then Security/NFR)
- A5: re-confirm T2a/T2d parity on QE's frozen list, with `WRONGSIDE`.
- A6: plant parity and the `insideNull` / `underNull` reads.
- A7: the node census table.
- A8: `N8-LANE` on the two-file set.
- A9: `G8` b h h b b h, under W1.
- A10: the deep lane, with escaped brackets (SE-248-a).
- A11's lane.
- The SE's informal read (H − B ≈ −0.33 s at n = 2) is `UNKNOWN - verify` until A9.
