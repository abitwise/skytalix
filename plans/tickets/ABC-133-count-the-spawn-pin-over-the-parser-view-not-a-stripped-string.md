---
id: ABC-133
title: The spawn pin counts `child_process` use over a regex-stripped string — count it over the TypeScript parser's view (kills `Q11`–`Q13` and the pre-existing shell child `P1`)
status: in-development
column: In Development
size: S
priority: P3
epic: —
feature: —
---

# ABC-133 — a string that holds `//` or `/*` hides a real child from the pin; the parser view does not

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `postmerge-followups-2026-10-10`) at
> wave tip `9ddd6e80`, from Security/NFR's recommended follow-up **`F-058-1`** (LOW, P3) at the
> `ABC-058` gate (`.grugops/context/secnfr-ABC-058/notes/…ae61a3cb`, Ruling 2a). Its source is QE's
> gap `QE-058-a` (`.grugops/context/qe-ABC-058/notes/…904bdd2d`). This ticket discharges accepted
> risk **`AR-058-STRIP`** (LOW, owner BA/PM). **`P1` is folded in**, which was BA/PM's call (§ Scope).
> Reasoning and readings: `.grugops/context/postmerge-followups-2026-10-10/`.

## Problem

*User*: Security/NFR, whose `V1.2.5 [L1]` drift guard and `N8-SPAWN` account rest on this pin. Also
the next hop that adds a child or a literal to `src/cli.test.ts`.

*Pain*: since `ABC-058` (`S5`, merged `cef01544`), the pin (`src/cli.test.ts:1845-1850` at
`9ddd6e80`) reads `executableCodeOf("cli.test.ts")`. That helper strips `//…` and `/*…*/` by regex
and does not know about strings. It counts `import { … } from "node:child_process"` and
`spawnSync(`. Measured by QE and Security/NFR:

| plant | what it adds | base `b21ec7cf` | today (`ABC-058` merged) |
|---|---|---|---|
| `Q11` | a real `spawnSync` after a `"a//b"` string on the same line | RED | **GREEN, the child is uncounted** |
| `Q12` | a real `spawnSync` between a `"/*"` and a `"*/"` string | RED | **GREEN** |
| `Q13` | a namespace import, plus `cp.spawnSync(` after a `"x//y"` string | RED | **GREEN** |
| `P1` | `import * as cp from "node:child_process"` + `cp.execSync("true")`, **a shell child** | **GREEN** | **GREEN**, pre-existing |
| `Q14` | `const alias = spawnSync; alias(…)` | GREEN | GREEN, pre-existing |

The file header's bar 1b sentence (`:16-17`) says there is "no `exec(` or `execSync(` call site and
no `shell:`", and no row catches `P1`. Today `V1.2.5` is **MET** at the delivered build: one call
site, `spawnSync` the only imported name, no shell. The pin is a drift guard, and its holes are
accidental-shaped. The literal shape behind `Q11`/`Q12` is absent from every test file except the
strip helper's own regex.

*Value*: the next child, the next import form or the next `exec*` call reds the pin however it is
spelled around strings and comments. Prose still cannot red a correct file (`ABC-058` `A1`).

## Scope

- **Replace the pin's two regex counts** (the `import { … }` match and the `spawnSync(` count over
  `executableCodeOf("cli.test.ts")`) with two counts over the **TypeScript parser's view** of
  `src/cli.test.ts`:
  - **(i) module-specifier positions** that name `node:child_process` or `child_process`. That covers
    a static `import`, `export … from`, a dynamic `import()` and `require()`. The count is **exactly
    1**, and that one import binds **exactly** the name `spawnSync`, with no namespace and no default
    binding.
  - **(ii) calls whose callee resolves to a `child_process` binding**: a local name bound by that
    import, or a member of a namespace or default binding of it. The count is **exactly 1**, the
    call in `childOf`.
- **`P1` is folded in, at no added instrument.** Count (i) reds `P1`'s namespace import and count
  (ii) reds its `cp.execSync`, so it costs one plant run. Declining it would have meant
  deliberately leaving the namespace form uncounted.
- **The pin's comment** says what is counted, over which view, and the bound it keeps (`Q14`).
- `typescript` is already a `devDependency` (`^5.7.0`; `5.9.3` installed). This becomes **the first
  test-side load of it** (measured: no `src/*.test.ts` loads it at `9ddd6e80`).

## Out of scope

- **`Q14` (a variable alias).** Catching it needs data flow, so it stays out, as Security/NFR
  allowed, and **this page says so**. If the Engineer's view kills it at no extra code, record that;
  either way is MET.
- **`executableCodeOf` itself and its other callers** (the `cli.ts` / `cli-options.ts` rows, and
  the self-scan at `:2714`). The three other copies of the strip helper are not changed either
  (`render-seam.test.ts:112`, `line-input.test.ts:956`, `san.parse.test.ts:308`).
- **`N8_SPAWN`'s value (27)**, `childOf`, and every child.
- **`QE-058-c` / `AR-058-SAMPLE`** (bar 3's per-class sample). It is accepted, with no ticket.
- **Any manifest change.** No new dependency, no version change.

## Acceptance (Given/When/Then)

- **`A1` (the kills, red first).** **Given** each plant alone in an out-of-tree copy of the
  delivered tree, **then** each is **RED**, attributed to the pin's row. The plants are:
  - `Q11`, `Q12` and `Q13`: QE's recipes;
  - `P1`: Security/NFR's;
  - `P-DYN`: one module-level line, `void import("node:child_process");`.

  On the base (`9ddd6e80`) all five are **GREEN**. The PR note has the 5 × 2 table. *(For `Q11`–`Q13`
  and `P1`, these are QE's and Security/NFR's readings at `be12015a`; `src/cli.test.ts` is
  byte-unchanged since. `P-DYN` was measured by BA/PM at `9ddd6e80`: 66/66 green, load1 4.3.)*
- **`A2` (no kill traded, no false red).** **Then**:
  - the unmutated file is **GREEN**. Bar 1's forbidden-word list holds a `"child_process"` string
    at `:1706`, and it is not a specifier: 1 specifier position, against 2 literals with that text
    (measured);
  - `ABC-058`'s `MS1` and `MS2` are still **RED**;
  - `ABC-058` `A1`'s prose plant (a docblock sentence naming `` `spawnSync(` ``) is still **GREEN**;
  - a control that adds only `const tag = "a//b /* c"; void tag;` and no call is **GREEN**. *(It
    is green at `9ddd6e80`, 66/66.)*
- **`A3` (`Q14` is stated, not hidden).** **Then** `Q14`'s result on the delivered tree is
  recorded, and the pin's comment names a variable alias as the bound it does not see (unless
  `Q14` reads RED).
- **`A4` (the parse has a measured cost).** **Given** the delivered instrument's own work, timed
  in-process with `process.cpuUsage` (loading `typescript` plus one parse and walk of
  `src/cli.test.ts`), over **≥ 8** fresh processes with round 0 discarded and load1 logged, **then**
  the **median is ≤ 250 ms CPU**. The parse runs **once** per run of the file. *(BA/PM reading at
  `9ddd6e80` with a reference walk: load ≈ 86.7 ms + parse and walk ≈ 89.7 ms ≈ **176 ms**, load1
  4.7. That is about 1,100× `ABC-058`'s 0.154 ms, so it is stated, not hidden.)*
- **`A5` (one path, nothing else moves).** `git diff --name-only <base>..<delivered>` lists
  **exactly** `src/cli.test.ts`. The `package.json` / `package-lock.json` numstat is empty.
  **0 production lines, 0 new files, 0 new `it`, `N8_SPAWN` 27.** Lint, typecheck, build and
  `npm test` exit 0. The skip count is 0, and integrity prints `No findings.`

## Dependencies

- **`ABC-058` — `Done`** (merged `cef01544`). It owns the pin as it stands.
- **`ABC-059` (`Ready`, `P2`) edits the same file**: one new `it` after `ABC-065`'s `describe`
  (`:1948-2132` at `f76e041`). This pin is at `:1835-1850`. **Order: `ABC-059` first, then this
  ticket. Never in parallel.** `P2` goes before `P3`, and the regions do not touch, so the second
  one rebases. **Exception, from `AR-058-STRIP`'s promotion trigger:** check `ABC-059`'s diff with
  `node .grugops/context/secnfr-ABC-058/probe/scan-literals.mjs <tree>`. If it adds a string,
  template or regex literal containing `//` or `/*` (the check lists more than the one helper
  regex for `cli.test.ts`), or a second `node:child_process` import form, this ticket becomes
  **`P1`** and lands **before** `ABC-059` merges.
- **Backlog tickets that also name `src/cli.test.ts`** are merge-order only, re-checked at pull.
  None of them is `Ready`.

## Security / NFR triggers

- **`V1.2.5 [L1]`: the subject.** The verdict stays MET, and the drift guard's reach grows (`A1`).
  This changes a security-bar instrument, so **a Security/NFR hop is recommended**, as `ABC-058`
  had.
- **`ABC-041`'s clauses:**
  - (a) no manifest touch, because `typescript` is already a `devDependency`;
  - (b) no production file;
  - (c) the test file adds no network, no write and **no spawn**. It adds a read-only parse of the
    repository's own source, which is the precedent (c) names;
  - (d) one path.

  **On a disputed reading it fires and the gate resolves it.**
- **`N8-LANE`:** 0 files added, so no line is in scope. The content cost is `A4`'s bound.
  **`N8-SPAWN`:** 27, unchanged. **`NFR-008`:** the added CPU is reported. No verdict is claimed;
  that is with the owner.
- **UAT: waived** under the standing zero-production-lines rule (`A5`). The QE hop applies.

## Test notes

1. **The recipes exist.** Run every plant in a `git archive` copy, never in the worktree:
   - `Q11`–`Q14`, `E-MS1` and `E-MS2`: `.grugops/context/qe-ABC-058/probe/mutants.sh`, with
     `mutate.cjs`;
   - `P1`: `.grugops/context/secnfr-ABC-058/probe/pin-gaps.sh`.
2. **Count specifier positions, not literals.** A count of every `"child_process"` string reads 2
   and reds a correct file (`:1706`). Reference walk:
   `.grugops/context/postmerge-followups-2026-10-10/probe/cp-specifiers.mjs` (`…out.txt`: 1 at
   `:32`, 2 literals at `[32, 1706]`).
3. **Resolve the callee to the import binding, not to a member name.** Security/NFR's
   `scan-literals.mjs` name filter also listed `.exec(` at `:505`, which is `RegExp.prototype.exec`.
   A name match would false-count it.
4. **The cost probe** is `.grugops/context/postmerge-followups-2026-10-10/probe/ts-parse-cost.mjs`
   (`…out.txt`: 9 processes). It also prints the reference walk's counts: imports `["spawnSync"]`,
   calls `["spawnSync@341"]`. The base readings for `P-DYN` and the string control are
   `probe/pin-plants-9ddd6e80.out.txt`, with the one-line planter `probe/plant-one.py`.

## Size and priority rationale

**Size `S` (2).** One instrument that walks the parser's tree and maps local bindings, five
red-first plants, four controls and one cost reading. Not `XS`, because it is the first test-side
parser load and the cost needs a measured bound. Not `M`, because it is one file and every recipe
exists.

**Priority `P3`** (Security/NFR: LOW, P3). `V1.2.5` is MET and the holes are accidental-shaped.
**It becomes `P1` on `AR-058-STRIP`'s trigger:** any diff to `src/cli.test.ts` that adds a literal
containing `//` or `/*`, or a second `node:child_process` import form.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `9ddd6e80`. **Result: 10 of 10, 0 ⚠️
— MET → `Ready`.** Pull after `ABC-059`. The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** five named plants with base and today readings; the bar 1b sentence `P1` contradicts |
| 2 | scope and out-of-scope clear | **✅** two counts over one view; `P1` in, `Q14` out by name; five fences |
| 3 | INVEST-shaped | **✅** one file, independent of every open ticket except an ordering on `ABC-059` |
| 4 | acceptance testable and measurable | **✅** 5 plants GREEN→RED; 4 named controls; ≤ 250 ms CPU median over ≥ 8 processes; a one-path, 0-byte manifest fence |
| 5 | dependencies known | **✅** `ABC-058` `Done`; `ABC-059` first, with the trigger-driven exception spelled out |
| 6 | security/NFR triggers with a measurable target | **✅** `V1.2.5`; `ABC-041` (a)–(d); `N8-SPAWN` 27; the content cost ≤ 250 ms (`A4`) |
| 7 | test notes present | **✅** four (recipes, specifier vs literal, callee resolution, cost probe) |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P3`, with its `P1` trigger |
| 10 | no major unresolved blocker | **✅** none. The order behind `ABC-059` is a pull order, not a blocker |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-133`).
- Branch `grugops/ABC-133-spawn-pin-parser-view`, from `8be650e6`. The code is `cd594b5f`
  (`src/cli.test.ts` +88/−9, two hunks: the import block and the pin).
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-133/` (`…a530d175`,
  `…ccb75b95`, `probe/`) and are not restated here.

**`A1`–`A5` are met. No stop condition fired.**
- The premise held at `8be650e6`: the pin is at `:1835-1850`, `N8_SPAWN` is 27, and the file is
  changed only by `ABC-059`'s insertion.
- `AR-058-STRIP` did not fire on this diff: no `//` or `/*` literal was added, and no
  `node:child_process` form.

| # | verdict | reading (plants out of tree; base `8be650e6` → delivered `cd594b5f`) |
|---|---|---|
| `A1` | MET | `Q11`, `Q12`, `Q13`, `P1` and `P-DYN`: GREEN 67/67 → **RED 1/67**, the pin row alone. `P1` reds on both counts |
| `A2` | MET | The unmutated file is green, and (i) reads 1 position (`:1706` not counted). `MS1`/`MS2` stay RED. The prose plant and the string control stay GREEN |
| `A3` | MET | `Q14` is **GREEN** at delivery. The pin's comment names a variable alias as the bound it does not see |
| `A4` | MET | `createRequire` load + one parse and walk, n = 8 of 9 fresh processes. Median **162.0 ms** CPU in plain node (load1 8.6) and **156.5 ms** in a vitest worker (load1 9.7–10.2). Both ≤ 250 ms. It runs once per run of the file |
| `A5` | MET | `git diff --name-only` = `src/cli.test.ts`; manifest numstat empty; 0 files added; 0 production lines; 0 `it` added; `N8_SPAWN` 27. The `ABC-042` `A1` row, `ABC-065` block and `ABC-059` block hash identically |

- **Gate.** Lint, typecheck and build exit 0. `npm test` is 51 files / 1584 passed. The skip count
  is 0, and integrity reads `No findings.` `lane-inventory.js` is exit 0 with no findings.
- **Load form.** `typescript` is loaded with `createRequire`, inside the pin's `it`.
  - An ESM `import` measured ~205 ms CPU for the load under vitest, against ~85 ms. That form put
    the in-file total near 280 ms.
  - Decision `…a530d175` item 5 has the readings.
- **Side effect.** `QE-058-e` is closed: `Q8`, template text naming `spawnSync(`, no longer reds a
  correct file. `Q9`, a real call in an interpolation, stays RED.
- **Cost (`ADR-0035`, proposed; narrow set `src/cli.test.ts`, twin control, n = 8).**
  - **Both sets are admissible**: the twin reads −0.73 % / −0.22 %, sign 2/8 / 3/8, R 0.582 /
    0.371 s, at load1 median 7.7 / 6.5.
  - Head − base is **+0.144 s / +0.089 s** CPU (intervals −0.005..+0.290 / −0.059..+0.203).
  - No `N8-LANE` state is written: 0 files added, and the content bound is `A4`.
- **Next.**
  - QE's hop.
  - The Security/NFR hop the page recommends (`V1.2.5`'s instrument changed).
  - The UAT waiver applies if zero production lines holds (measured 0).

## QE 2026-10-10 (QE/E2E, `qe-ABC-133`, Workflow 04 review exit): PASS_WITH_GAPS

Reviewed `8be650e6..82104f70`, code `cd594b5f`. Every reading is QE's own, taken in fresh
`git archive` trees with QE's own plants. **`A1`–`A5` are MET. No test was added.**

- **`A1`**: `Q11`, `Q12`, `Q13`, `P1` and `P-DYN` are GREEN 67/67 at base and RED 1/67 at head.
  The red is the `N8-LANE` row alone, on the pin's own assertions. Soft re-runs show `P1` and `Q13`
  red both counts.
- **`A2`**: the unmutated file is green, and count (i) reads 1 of 2 literals (`:32`, `:1708`).
  `E-MS1`/`E-MS2` are RED. The prose plant and the string control are GREEN.
- **`A3`**: `Q14` is GREEN. The comment names the variable alias (`:1853-1854`).
- **`A4`**: timed in situ on the delivered pin, n = 8 of 9 fresh vitest processes. The median is
  **173.2 ms** CPU at load1 median 10.1, against 250. The ESM form would read 268.1 ms.
- **`A5`**: one path, 0 manifest bytes, 0 files added, 0 production lines, 67 `it`, and
  `N8_SPAWN` 27.
- **Plants**: 49 on head and base, plus 6 soft re-runs. Every `child_process` spelling and call
  shape the brief named reds, except those in the gaps below. There is no false count on
  `RegExp.exec`, a local `.execSync`, value strings or a lookalike path.
- **The engineer's decisions** are **endorsed**: binding-list specifiers, callee resolution, and
  `createRequire` inside the `it`. The ESM gap is now partly explained: +41 ms of it shows up in
  plain node, and the remaining ~+67 ms only under vitest. The mechanism is `UNKNOWN - verify`. It
  does not matter here, because the choice rests on the `A4` measurement.
- **Gates**: lint, typecheck and build exit 0. `npm test` is 51 files / 1584 passed. Skip is 0,
  integrity reads `No findings.`, and `lane-inventory.js` reports no findings.

**Gaps (none fails a criterion; every hole was green at base too, so no kill was traded):**
- **`QE-133-a` LOW.** Count (i) recognises only `import` and `require` as loaders.
  `createRequire(import.meta.url)("node:child_process")` (the shape this ticket's own load line
  uses), `process.getBuiltinModule(…)` and `vi.importActual(…)` stay green.
- **`QE-133-b` LOW.** Count (ii) does not unwrap a callee. `(spawnSync)()`, `(0, spawnSync)()`,
  `spawnSync!()` and `(spawnSync as …)()` stay green. `!` and `as` are named nowhere.
- **`QE-133-c` INFO.** `Reflect.apply` is the alias class. A tagged template cannot spawn.
- **`QE-133-d` INFO, fail-loud.** `import type … from "node:child_process"` now reds, while
  `typeof import(…)` does not.
- **`QE-133-e` INFO, fail-loud.** A shadowed `spawnSync` reds, as stated.
- **`QE-133-f` INFO.** `A4` has ~31 % headroom. One single round read 254.4 ms. Nothing in the file
  guards the load form except the comment.

The board move is the Orchestrator's. The Security/NFR hop is recommended by the page. Readings are
in `.grugops/context/qe-ABC-133/notes/` (`…27801a15` decision, `…71511fc2` readings, `…f589327d`
gaps) and `probe/`.
