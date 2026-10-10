---
id: 20261010T160355Z-software-engineer-observation-abc138-gates-plants-a1-a6-cost-74a52ca8
kind: observation
by: software-engineer
at: 2026-10-10T16:03:55Z
verified_by:
confidence: high
refs:
  - ABC-138
  - ABC-133
  - F-133-1
  - QE-133-a
  - QE-133-b
  - AR-133-LOADER
  - AR-133-WRAP
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - src/cli.test.ts
  - 20261010T160355Z-software-engineer-decision-abc138-any-callee-first-arg-and-bound-name-references-8d70af7c
supersedes:
---

# `ABC-138` readings: all 12 gap plants GREEN → RED; the controls hold; `A5` 164.8 ms at load1 7.8; gate green

This note is hand-authored and unsealed.
- Branch `grugops/ABC-138-spawn-pin-in-suite`, from `2946e22a` (the wave tip at pull).
- The code commit is `84edfb46` (`src/cli.test.ts` +30/−13).
- Not merged, not pushed.
- Machine: Apple M3, Node v26.11.0. Two other agents ran in parallel, so load1 is beside every reading.
- Raw files are in `../probe/` (`RUN.txt` indexes them).

**Premise re-verified at `2946e22a` before editing. It held.**
- `src/cli.test.ts` is byte-identical to `3159ab68`. Since then `src/` changed only in `ABC-132`'s
  three production files.
- BA/PM's subset re-run: the control and all 17 plants are GREEN 67/67, at load1 4.6–9.9
  (`probe/premise-f1331-plants-2946e22a.out.txt`).
- The dry run matches BA/PM's `3159ab68` reading line for line
  (`probe/premise-f1331-dryrun-2946e22a.out.txt`).

## Plants (`probe/plants.sh`: QE-133's harness; one plant per `npx vitest run src/cli.test.ts`)

| criterion | plant | base `2946e22a` | delivered `84edfb46` | count that reds |
|---|---|---|---|---|
| — | control (unmutated) | GREEN 67/67 | GREEN 67/67 | — |
| `A1` | `X5`, `X5b`, `X6`, `X7`, `S2`, `S3` | GREEN 67/67 each | **RED 1/67 each**, the `N8-LANE` row | (i) `[["spawnSync"],[]]` |
| `A2` | `C5`, `C6`, `C7`, `C8`, `C10`, `Q14` | GREEN 67/67 each | **RED 1/67 each**, the `N8-LANE` row | (iii), three references |
| `A3` kills | `Q11`, `Q12`, `E-MS1` | RED 1/67 | RED 1/67 | (ii) `["spawnSync","spawnSync in childOf"]` |
| `A3` kills | `Q13`, `P1` | RED 1/67 | RED 1/67 | (i) `[["spawnSync"],["* as cp"]]` |
| `A3` kills | `P-DYN` | RED 1/67 | RED 1/67 | (i) `[["spawnSync"],[]]`: one extra entry, not two |
| `A3` kills | `E-MS2` | RED 1/67 | RED 1/67 | (i) `[["* as childProcess"]]` |
| `A3` controls | `E-A1`, `S-CTRL`, `C13`, `C15`, `C14-ARRAY` | GREEN 67/67 | **GREEN 67/67** | — |
| `A4` | `C14`, `C14-ARG` | GREEN 67/67 | **RED 1/67** (stated false red) | (i) `[["spawnSync"],[]]` |

- Base load1 was 6.1–11.4 and head load1 5.4–15.7. Every reading has its load1 in
  `plants-{base,head}.out.txt`.
- Every head RED is the one `N8-LANE` row. Each carries the assertion message of the count named
  above.

## `A4` text

"resolving it needs data flow" in collapsed text (whitespace and `/` squeezed): **1 at base → 0 at
head**. The comment names `C14`'s class ("`JSON.stringify` of that name reds (`C14`)").

## `A5`: in-situ CPU (`probe/a4.sh`, `probe/a4.out.txt`, `probe/a4-summary.txt`)

- **Protocol.** ABC-133 `A4`'s protocol, with QE's `process.cpuUsage` marks. Base and head were
  each read in 11 fresh vitest processes, interleaved, with round 0 discarded.
- **The end mark moved** (the page's Test note 5). The pin's final `expect` is now (iii)'s, so the
  mark sits before it and the reading covers all three counts. The base marks are QE's, unchanged.
- **Head median total: 164.8 ms CPU ≤ 250 ms.**
  - The load is 90.3 ms of that.
  - Head load1 median is 7.78 (range 6.30–9.78).
  - The max single head round is 181.9 ms.
- **Interleaved base median: 162.5 ms** (load1 7.94).
- **Paired head − base:** median −0.3 ms (range −45.5..+20.7). The added work cannot be told apart
  from noise at this n.
- **One parse:** `createSourceFile` occurs once in the file and `createRequire(import.meta.url)("typescript")`
  occurs once, both in the pin. Every head round read `[["spawnSync"]]`, `["spawnSync in childOf"]` and
  `["spawnSync (ImportSpecifier)","spawnSync (CallExpression)"]`.

## `A6` (`probe/a6.out.txt`)

- **One path.** `git diff --name-only 2946e22a 84edfb46` lists `src/cli.test.ts` alone.
- **Nothing else moved.**
  - Numstat is +30/−13, and the manifest numstat is empty.
  - 0 files were added or deleted, and the production-lines grep is empty.
  - `it(` reads 67 → 67, and `N8_SPAWN` is `17 + 7 + 1 + 2` (27).
- **The protected blocks hash identically before and after**
  (`ticket-to-pr-ABC-133/probe/regions.sh`): `A042-A1` 12 `cfed65970e28374b`, `D065` 184
  `4c2d5f84a0dc8dd9`, `D059` 75 `1a39fb91c2e021ee`.
- **`loader-scan.mjs src/cli.test.ts` on the delivered file:**
  - `childProcessArgCalls` `[]`;
  - one `createRequire` site (the pin's `typescript` load, two call nodes, `:1871`);
  - `spawnSyncValueRefs` `["ImportSpecifier@32","CallExpression@343"]`.

## Gate (at `84edfb46`, worktree, `probe/gates.txt`)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 100 files | 5.76 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 5.76 / 5.76 |
| `npm test` | exit 0, **52 files / 1608 passed**, 8.63 s | 5.86 |
| skip count | `0` | 8.08 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 10.39 |
| `lane-inventory.js` | exit 0: "The lane collects 52 test files; git tracks 52. No findings." | 10.39 |

## Not done by this hop

- No `ADR-0035` narrow-set paired-cost run was made. The page names `A5`'s in-file bound as the
  content bound, because `N8-LANE` adds 0 files.
- `loader-scan.mjs`, the accepted-risk register and `AR-133-LOADER` / `AR-133-WRAP` are untouched.
  Discharging those risks and confirming the `C14` split are Security/NFR's calls at the gate.
- No board move: the board is fenced for this hop, and the move is the Orchestrator's.
