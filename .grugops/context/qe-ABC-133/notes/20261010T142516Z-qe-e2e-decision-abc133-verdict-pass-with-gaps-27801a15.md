---
id: 20261010T142516Z-qe-e2e-decision-abc133-verdict-pass-with-gaps-27801a15
kind: decision
by: qe-e2e
at: 2026-10-10T14:25:16Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-042
  - F-058-1
  - QE-058-a
  - QE-058-e
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T142516Z-qe-e2e-observation-abc133-plants-a4-gates-71511fc2
  - 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
  - 20261010T140620Z-software-engineer-decision-abc133-specifiers-as-binding-lists-callee-resolution-createrequire-a530d175
  - 20261010T140620Z-software-engineer-observation-abc133-gates-plants-a1-a5-cost-ccb75b95
supersedes:
---

# `ABC-133` QE verdict: **PASS_WITH_GAPS** at `82104f70`. `A1`–`A5` MET; the three build decisions are endorsed; two LOW gaps and four INFO, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate`
verdict exists on this install (`AGENTS.md`).
- Under review: `8be650e6..82104f70` on `grugops/ABC-133-spawn-pin-parser-view`. The code commit is
  `cd594b5f`, and `src/` is byte-identical at the tip.
- Every reading is QE's own (`…71511fc2`).

| | QE's reading | result |
|---|---|---|
| `A1` | `Q11`, `Q12`, `Q13`, `P1` and `P-DYN`: **GREEN 67/67 at base → RED 1/67 at head**. The red is the `N8-LANE` row alone, on the pin's own assertion: (ii), (ii), (i), (i), (i). SecNFR's `P2` (a URL string) also flips. Soft re-runs show `P1` and `Q13` red BOTH counts | **MET** |
| `A2` | The unmutated file is GREEN 67. There are 2 `child_process` literals (`:32` specifier, `:1708` array), and count (i) reads 1. `E-MS1` RED (ii) and `E-MS2` RED (i). The prose plant `E-A1` is GREEN, and so is the string control `S-CTRL` | **MET** |
| `A3` | `Q14` is **GREEN** at head, and the comment (`:1853-1854`) names "a VARIABLE ALIAS, `const alias = spawnSync; alias(…)`" as the bound it keeps | **MET** |
| `A4` | Timed IN SITU on the delivered pin: `cpuUsage` marks were planted around its own lines, over 9 fresh vitest processes with round 0 discarded. The median is **173.2 ms** (load 95.9 + parse and walk 80.5), at load1 9.8–11.1 (median 10.1), against 250 ms. One load (`:1858`) and one parse (`:1859`) run per run of the file, inside the `it` | **MET** |
| `A5` | name-only = `src/cli.test.ts` (+88/−9). Manifest numstat is empty, 0 files were added and the zero-production-lines grep is empty. The `it(` count is 67 = 67, and `N8_SPAWN` is `17 + 7 + 1 + 2`. Lint, typecheck and build exit 0; `npm test` is 51 / 1584; skip is 0; integrity reads `No findings.` | **MET** |

## The engineer's decisions (`…a530d175`)

1. **Binding-list specifiers: ENDORSED.**
   - One value carries both the count and the binding, and a failure prints the offending
     position.
   - Measured: every spelling QE planted names itself in the red. That covers the bare spelling,
     default, namespace, rename, `export {…} from`, `export *`, `export * as`, `require` / `import()`
     with a template literal, and the type-only import.
2. **Callee resolution by bound name or member: ENDORSED.**
   - When (i) holds, the only bound name is `spawnSync`, so (ii) reduces to "calls to `spawnSync`".
     Its blind spots are wrapper shapes only (`QE-133-b`).
   - It does not false-count `RegExp.prototype.exec`, a local `obj.execSync` or a value string
     (`C13`, `C14`). It fails loud on shadowing (`C12`).
   - The `in childOf` suffix makes a stray call elsewhere print bare (`spawnSync`, `cp.execSync`). By reading, not planted: a second call inside `childOf` would also red, because the expectation is a list of exactly one.
3. **`createRequire` inside the `it`: ENDORSED.**
   - The gap is MEASURED, and is now PARTLY EXPLAINED. In situ, the ESM load is 204.4 ms against
     95.9 ms (+108.5 ms). In plain node, the load alone is 126.1 ms against 84.9 ms (+41.2 ms).
   - So about 40 % of the gap exists without vitest, in Node's ESM-imports-CJS path. The mechanism
     is `UNKNOWN - verify`; a plausible candidate is named-export detection over `typescript.js`.
     The other ~60 % is vitest-specific.
   - **It does not matter for this ticket.** The choice rests on the measured cost against `A4`
     (the ESM form reads 268.1 ms and breaches 250), not on the mechanism.
   - `createRequire` is Node's native `require`, outside vitest's module graph, so a vitest upgrade
     cannot move its cost.
   - The one price is that the file now imports `createRequire`, which is the loader `QE-133-a`
     names.

## Verdict

**PASS_WITH_GAPS.**
- The two LOW gaps are holes that were also GREEN at base, so neither is a traded kill:
  - `QE-133-a`: loaders other than `import` / `require`;
  - `QE-133-b`: unwrapped callees.
- The four INFO items are recorded (`…f589327d`).
- No test was added: each gap widens the page's letter, which is BA/PM's call.
- Next: the Security/NFR hop the page recommends (`V1.2.5`'s instrument changed). Then UAT is
  waived by the standing zero-production-lines rule (measured 0).
- The board move is the Orchestrator's. Not merged, not pushed.
