---
id: 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
kind: observation
by: qe-e2e
at: 2026-10-10T14:25:16Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - AR-058-STRIP
  - V1.2.5
  - Q14
  - src/cli.test.ts
  - 20261010T142516Z-qe-e2e-observation-abc133-plants-a4-gates-71511fc2
  - 20261010T142516Z-qe-e2e-decision-abc133-verdict-pass-with-gaps-27801a15
supersedes:
---

# `ABC-133` gap register: two LOW, four INFO. None fails a criterion, and every hole was green at base too, so no kill was traded

This note is hand-authored and unsealed. Every gap was measured, and its plant is in `…71511fc2` and
`../probe/summary.txt`. **No test was added.** Each gap sits outside the page's letter:
- count (i)'s list names `import`, `export … from`, `import()` and `require()`;
- count (ii)'s bound is "neither a bound name nor a member of one".

Closing either gap widens the contract. That is BA/PM's call (the `ABC-059` QE precedent), not a QE
test addition.

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| `QE-133-a` | LOW | **Count (i) knows the module through two callee spellings only: the `import` keyword and the identifier `require`.** A `child_process` load through any other loader is not a specifier position in its view, so the members called on it are never bound either. This **ticket put `createRequire` into the file's imports**, and the pin's own load line (`:1858`) is the exact template for `X5`. | `X5` `createRequire(import.meta.url)("node:child_process").execSync(…)`, `X5b` via a local `req`, `X6` `process.getBuiltinModule(…)` and `X7` `vi.importActual(…)`: all **GREEN** on head and on base | BA/PM, with Security/NFR (`V1.2.5`). A cheap widening: count ANY call whose first argument is a `child_process` string, whatever the callee. That would also red `vi.mock("node:child_process")`, which is arguably wanted |
| `QE-133-b` | LOW | **Count (ii) does not unwrap a callee.** A parenthesised, comma, non-null (`!`) or `as`-cast callee around `spawnSync` is not seen. The pin's comment states the class ("neither a bound name nor a member of one") and names only the variable alias. The engineer's decision `…a530d175` item 4 names the paren and comma forms. **`!` and `as` are named nowhere**, and both are ordinary TypeScript | `C5`–`C8`: all **GREEN** on head and on base | BA/PM. A cheap widening: strip parenthesised / non-null / `as` / `satisfies` wrappers before resolving. The comma form is the alias class |
| `QE-133-c` | INFO | Alias-class and no-child shapes. `Reflect.apply(spawnSync, …)` passes the binding as a value (the `Q14` class, stated). `` spawnSync`true` `` cannot spawn, because Node throws `ERR_INVALID_ARG_TYPE` | `C10`, `C9` GREEN; `c9-tagged.out.txt` | none |
| `QE-133-d` | INFO, fail-loud | **Type-only references are treated two ways.** `import type { SpawnSyncReturns } from "node:child_process"` now reds count (i) (`X8`: **new**, GREEN at base). Yet `typeof import("node:child_process")` in a type position stays GREEN (`X8c`). Both match the page's letter: an `import` declaration is a specifier position, and an import TYPE node is not a call. A hop that needs the type can write `ReturnType<typeof spawnSync>` | `X8` RED (i), `X8b` RED both, `X8c` GREEN | none; recorded so the next red is not a surprise |
| `QE-133-e` | INFO, fail-loud | Shadowing is not modelled. A local or parameter named `spawnSync` that is called reds count (ii). It was red at base too, through the regex. The engineer stated this (item 4) | `C12` RED both | none |
| `QE-133-f` | INFO | **`A4` has headroom of ~31 % and no in-file guard.** The median is 173.2 ms against 250, but one single round read 254.4 ms at load1 9.8. Swapping the load back to an ESM `import` breaches the bound (268.1 ms), and only the pin's comment says so; no test would red | `a4-require.out.txt`, `a4-esm.out.txt` | none; the comment is the guard, by design (`A4` is a measurement, not a row) |

**Not gaps (checked):**
- Bare-vs-`node:` spellings, default / namespace / renamed / re-exported forms (`export {…} from`,
  `export *`, `export * as`), a `require` or `import()` with a template literal, optional calls,
  `.call` / `.apply` / `?.call`, and computed members all red (`X1`–`X4c`, `X9`, `C1`–`C4`).
- No false count on `RegExp.prototype.exec`, a local object's `.execSync`, a `child_process` value
  string, or a `./child_process` lookalike (`C13`–`C15`).
