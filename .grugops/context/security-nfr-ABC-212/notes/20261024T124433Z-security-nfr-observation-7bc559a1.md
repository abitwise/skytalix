---
id: 20261024T124433Z-security-nfr-observation-7bc559a1
kind: observation
by: security-nfr
at: 2026-10-24T12:44:33Z
verified_by: 
confidence: high (NFR-009 and clause (b) run this hop, outputs read; N8-LANE is a record read, an indicator not a reading)
refs:
  - ABC-212
  - security-nfr-ABC-212
  - EPIC-004
  - grugops/security-nfr-ABC-212
  - 052ae3ad
  - d417b07c
  - 7727400c
  - NFR-004
  - NFR-009
  - NFR-008
  - N8-LANE
  - AR-NFR004-A
  - ADR-0036
  - ADR-0045
  - ADR-0044
  - qe-ABC-212/…e58d4635
  - qe-ABC-212/…f9560997
  - qe-ABC-212/…55691ad1
  - owner-word-2026-10-23/…2c6fa3b1
  - arch-design-ABC-212/…d2c68ace
  - plans/nfr-catalog.md
  - ABC-081 A7
  - KEY_ARRAY_CAPACITY
  - V2.2.1
supersedes: 
seal: sha256:11bb8a86bfda613a0432598ee00b2373cb960207f3b8f76f15cdf6c6f710fa89
---

# ABC-212 Security/NFR readings: NFR-009 MET at 30 s; clause (b) silent on all three limbs; inputs stay closed sets; the N8-LANE indicator is 1 053.5 ms

Branch `grugops/security-nfr-ABC-212`, from the QE tip `052ae3ad`. The pair is `7727400c..052ae3ad` (merge-base with `main`). Five production files changed: `src/cli-options.ts`, `src/cli.ts`, `src/engine.ts`, `src/levels.ts` and `src/uci-session.ts`. `package*.json`, `src/search.ts`, `src/level-seam.ts` and `src/startup-questions.ts` are unchanged. Raw files are in `.grugops/context/security-nfr-ABC-212/raw/`, with no personal paths. The scratch dir was `<scratchpad>/sec212/`. No timing reading and no test lane were run.

## 1. NFR-009 at 30 s (one plain `node --expose-gc` process, kiwipete; `raw/nfr009-30s.mjs`, `raw/nfr009-30s.out.json`)
- **Instrument:** `ABC-081` `A7`'s, with budgets `LEVELS[5].budgetMs` = 3 000 and `LEVELS[7].budgetMs` = 30 000. Each read comes after two `gc()` calls. Node v26.11.1, Apple M3.
- **3 s search:** depth 7, 617 050 nodes, `heapUsed` 9 069 088 B, `arrayBuffers` 4 332 211 B.
- **30 s search:** depth 9, 5 690 970 nodes, `heapUsed` 8 900 720 B, `arrayBuffers` 4 332 211 B.
- **Changes:** `heapUsed` −0.16 MiB and `arrayBuffers` 0, against a bound of ≤ 1 MiB each. `arrayBuffers` is 4.13 MiB, against ≤ 16 MiB.
- **Static (a):** table plus key array is 4 195 336 B. `HARD_CEILING_MS` read 32 000 in the same process.
- **Control:** a retained 200 000-entry `Map` then moved `heapUsed` by +19.22 MiB, so the instrument is sensitive.
- **Conditions:** load1 about 5 before and after, with a foreign vitest live. This is memory, not time. Wall was 3 000 and 30 002 ms, informational only.

## 2. ADR-0036 clause (b) (canonical `design-F-072-1/probe/clause-b.mjs`, blob `e8607203`, the same at `052ae3ad` and `main`; `raw/clause-b-limb{1,2,3}.txt`)
- **Limb 1:** (b1) 0. Ruling 2: 3 holders at base and 3 at head, 0 holder files changed. (b2) 0 new edges. 0 word hits. **Does not fire.**
- **Limb 2:** (b1) 0, (b2) 0, 0 word hits. **Does not fire.**
- **Limb 3:** (b1) 0, (b2) 0, 0 word hits. **Does not fire.**
- **Baseline at head:** 46 production files. Limb 1 holders: `book-file.ts`, `pgn-file.ts`, `uci.ts`. Limb 2 holders: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`, `uci.ts`. Limb 3: none.
- It was run from the main checkout's root, because the fresh worktree has no `node_modules`. It reads git objects only, so the result is the same.

## 3. The input surfaces (source read at `052ae3ad`)
- **`--difficulty`:** `DIFFICULTY_VALUES.find((candidate) => candidate === next)` over `ACCEPTED_ARGUMENTS`, which gains `"6"` and `"7"`.
- **The startup answer:** the same exact-equality find (`src/startup-questions.ts:128`, unchanged).
- **UCI `Skill Level`:** `Object.hasOwn(LEVELS, value)` (`src/uci-session.ts:342`, unchanged).
- **The `level-seam` throw:** `Object.hasOwn` (unchanged).
- **The `got` echo** in the info string is pre-existing, and the control-character drop (`ABC-167` `A4-a2`) is unchanged.
- **The new text interpolates only constants:** `EASIEST_LEVEL`, `HARDEST_LEVEL` and `DEFAULT_LEVEL`.
- **Readers of `HARD_CEILING_MS` in production:** `engine.ts:486` (the clamp), `levels.ts:132` (the blunder total: `min(budget, 32 000)` = budget for levels 1–4, at most 1 000 ms), and `uci-session.ts:217` (`G` with no time, capped by the level at `:286`).
- **`KEY_ARRAY_CAPACITY` 128** is guarded at `src/search.ts:346` (`ply >= KEY_ARRAY_CAPACITY` ends the line).

## 4. A4, re-tallied from QE's `raw/win-L5.txt`, `win-L6.txt`, `win-L7.txt`
- **Level 5:** 30 moves, 23 of 30 over 3 000 ms, max +5 ms, median +2 ms.
- **Level 6:** 30 moves, 5 000–5 005 ms, max depth 13.
- **Level 7:** 10 moves, 30 000–30 004 ms, max depth 10.

## 5. The N8-LANE indicator (a record read, not a reading; `raw/n8-indicator.txt`)
- **The source:** QE's gate `last-run.json` at `d417b07c`.
- **The rows:** `src/uci-session.test.ts` goes from 83 to 91 `it(` rows (+9 −1). Its 9 `ABC-212 A9` rows sum to **1 053.5 ms**. The 7 that search take 144.0–160.8 ms each, about the same as the existing level-5 bare-`go` rows (147 ms).
- **The file:** 4 340 ms at head. No base reading is on record.
- **The whole gate pass:** 8.87 s. A foreign vitest was live, so it is not admissible.
- **The A12 count holds:** 0 new files and 0 new spawns (QE).
