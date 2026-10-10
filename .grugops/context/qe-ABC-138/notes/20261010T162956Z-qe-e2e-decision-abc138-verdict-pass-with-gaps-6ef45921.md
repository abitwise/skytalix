---
id: 20261010T162956Z-qe-e2e-decision-abc138-verdict-pass-with-gaps-6ef45921
kind: decision
by: qe-e2e
at: 2026-10-10T16:29:56Z
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
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T162956Z-qe-e2e-observation-abc138-plants-a5-gates-9cdaa822
  - 20261010T162956Z-qe-e2e-observation-abc138-gap-register-d5a380ba
  - 20261010T160355Z-software-engineer-decision-abc138-any-callee-first-arg-and-bound-name-references-8d70af7c
  - 20261010T160355Z-software-engineer-observation-abc138-gates-plants-a1-a6-cost-74a52ca8
supersedes:
---

# `ABC-138` QE verdict: **PASS_WITH_GAPS** at `7e5c9c74`. `A1`–`A6` MET; two LOW gaps (`QE-138-a`, `QE-138-b`) and four INFO, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate` verdict
exists on this install (`AGENTS.md`).
- Under review: `2946e22a..7e5c9c74` on `grugops/ABC-138-spawn-pin-in-suite`. The code commit is
  `84edfb46`, and `src/` is byte-identical at the tip.
- Every reading is QE's own (`…9cdaa822`).

| | QE's reading | result |
|---|---|---|
| `A1` | `X5`, `X5b`, `X6`, `X7`, `S2` and `S3` go **GREEN 67/67 → RED 1/67**, on (i)'s assertion | **MET** |
| `A2` | `C5`, `C6`, `C7`, `C8`, `C10` and `Q14` go **GREEN 67/67 → RED 1/67**, on (iii)'s assertion | **MET** |
| `A3` | The unmutated file is GREEN and reads `[["spawnSync"]]`, `["spawnSync in childOf"]` and two references. `Q11`, `Q12`, `Q13`, `P1`, `P-DYN`, `E-MS1` and `E-MS2` are RED at both tips; `P-DYN` is one extra entry. `E-A1`, `S-CTRL`, `C13`, `C15` and `C14-ARRAY` are GREEN at both | **MET** |
| `A4` | `C14` and `C14-ARG` are RED on (i). The comment names the class: "`JSON.stringify` of that name reds (`C14`)". The phrase reads 1 → 0 | **MET** |
| `A5` | **170.3 ms** median at load1 10.11 (base 180.4 ms, paired −4.3 ms). Under load1 37.8 it is 183.7 ms (base 175.6 ms, paired +5.5 ms). Both are ≤ 250, n = 10 each, round 0 discarded. One load and one parse | **MET** |
| `A6` | One path, +30/−13. The manifest is empty; 0 production lines, 0 new files, 0 new `it`; `N8_SPAWN` 27. `loader-scan` reads `[]`, one `createRequire` site and two references. All six gates exit 0: 1608 tests, skip 0, `No findings.` ×2 | **MET** |

## The engineer's decisions (`…8d70af7c`)

1. **Delete the callee test, do not widen it: ENDORSED.** One branch per `CallExpression` keeps
   `import()` / `require()` counted once (`P-DYN`). Five further loader spellings red (`L1`, `L2`,
   `L3a`, `L4`, `L6`).
2. **(iii) as a filter over the same walk: ENDORSED, with `QE-138-a`.**
   - Counting names rather than callee shapes is what kills `Q14`, `W1`–`W4`, `W7` and `L8` with no
     data flow.
   - The type filter is one node kind too wide: `ExpressionWithTypeArguments` is a value position in
     a class `extends` clause. That gap is measured live (`W5`) and has a verified one-line fix.
3. **Member names count, loud: ENDORSED.** It also backstops `QE-138-c`: `.spawnSync` on any loaded
   module object reds (iii).
4. **(ii) left byte-identical: ENDORSED.** It is in scope as written.

## Verdict

**PASS_WITH_GAPS.**
- Every criterion is MET as written. Each gap was GREEN at base too, so no kill was traded.
- **`QE-138-a` is LOW, but it sits inside Scope (b)'s letter, and its fix is one verified line.** It
  is the Orchestrator's call whether to bounce it for that line before merge, or carry it as a
  stated residual.
- **For the Security/NFR hop:**
  - Do not discharge `AR-133-WRAP` as fully closed while `QE-138-a` stands.
  - Name `QE-138-b` / `QE-138-c` as `AR-133-LOADER`'s residuals if it is discharged.
  - Confirm the `C14` split (`QE-138-e`).
- UAT is waived by the standing zero-production-lines rule (measured 0).
- The board move is the Orchestrator's. Not merged, not pushed.
