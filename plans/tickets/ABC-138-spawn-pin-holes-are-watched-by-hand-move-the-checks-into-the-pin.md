---
id: ABC-138
title: The spawn pin's two accepted holes are watched by a hand-run check on every hop that touches `src/cli.test.ts` — move both checks into the pin (F-133-1 (a)+(b); `QE-133-a`, `QE-133-b`)
status: in-development
column: In Development
size: S
priority: P3
epic: —
feature: —
---

# ABC-138 — count every `child_process` loader whatever its callee, and every value use of the bound name

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cuts-r5c-f1331-2026-10-10`) from
> Security/NFR's recommended follow-up **`F-133-1`** (LOW, P3) at the `ABC-133` gate
> (`.grugops/context/secnfr-ABC-133/notes/…0f608f0c`, Rulings 2 and 3). It closes QE's `QE-133-a`
> and `QE-133-b` (`.grugops/context/qe-ABC-133/notes/…f589327d`). **(a) and (b) are both cut. That
> was BA/PM's call, reasoned in the decision note.** **This ticket reverses `ABC-133`'s "`Q14` out"
> line.** Readings were taken at `5d55cc48` and `3159ab68`:
> `.grugops/context/bapm-cuts-r5c-f1331-2026-10-10/probe/RUN.txt`.

## Problem

*User*: Security/NFR, whose `V1.2.5 [L1]` drift guard and `N8-SPAWN` count rest on this pin. Also
every hop that touches `src/cli.test.ts`: about 19 tickets since 2026-08-01.

*Pain*: the pin (`src/cli.test.ts:1841`–`:1930`, inside the `N8-LANE` `it` at `:1755`, at `3159ab68`) has two LOW holes, both accepted:
- **`AR-133-LOADER` (`QE-133-a`).** A `child_process` load through any callee other than `import` or
  `require` is not a specifier position, so nothing it binds is counted.
- **`AR-133-WRAP` (`QE-133-b`).** A wrapped callee, a variable alias or `Reflect.apply` is not resolved
  to the binding.

Each risk is held by a **hand-run trigger check**: `loader-scan.mjs`, run by BA/PM at every cut and by
Security/NFR at every gate that touches the file. The trigger is the count this ticket asks for. All
plants are GREEN at `3159ab68` (67/67 each, `probe/f1331-plants-3159ab68.out.txt`):

| class | plants | today |
|---|---|---|
| loader (`QE-133-a`) | `X5` `createRequire(…)("node:child_process")`, `X5b` via a local `req`, `X6` `process.getBuiltinModule`, `X7` `vi.importActual`, `S2` `vi.mock("node:child_process", …)`, `S3` a `node:module` namespace `createRequire` | GREEN |
| callee (`QE-133-b`) | `C5` `(spawnSync)()`, `C6` `(0, spawnSync)()`, `C7` `spawnSync!()`, `C8` `(spawnSync as …)()`, `C10` `Reflect.apply(spawnSync, …)`, `Q14` `const alias = spawnSync; alias(…)` | GREEN |

Two facts make this more than "accept and forget" (Security/NFR):
- `ABC-133` put `createRequire` into this file's imports, and the pin's own load line (`:1859`) is
  `X5`'s template.
- `vi.mock("node:child_process", …)` is live in `src/glyph-mode.nfr.test.ts:37`.

*Value*: the suite does what a person now has to remember to do on every hop that touches this file.
Once both counts land, the two accepted risks can be discharged (Security/NFR's call at the gate).

## Scope

All in the pin's one `it`, over the parse it already makes (no new load, no second parse):
- **(a) Widen count (i).** It also counts every call whose **first argument** is a string literal
  (including a no-substitution template) naming `child_process` or `node:child_process`, **whatever
  the callee**. `import()` and `require()` stay counted, once each. The unmutated file still reads
  `[["spawnSync"]]`.
- **(b) Add a third count.** Count every **value-position** reference to a name that a
  `child_process` import binds. It reads **exactly two**: the import binding and the callee of the
  call in `childOf`. A reference inside a type (`typeof spawnSync` as a type) is not counted. No data
  flow is needed. The dry run reads exactly two at both tips.
- **The pin's comment** states (a)'s and (b)'s reach. It stops saying that a variable alias is not
  seen, because `Q14` now reds. It names the one false-red class (`A4`).

## Out of scope

- **A non-literal module name** (a computed or concatenated string). It is not seen. That shape is
  adversarial, not drift. Whether `AR-133-LOADER` is discharged with this bound is Security/NFR's
  call at the gate.
- **`S1`, `import cp = require(…)`.** The `typecheck` gate already refuses it (TS1202).
- **Replacing or restructuring count (ii).** It stays as it is; this ticket adds to it.
- **Shadowing** (`QE-133-e`). It fails loud, as it does today.
- **`executableCodeOf`, `childOf`, every child and `N8_SPAWN` (27).** Every other file is out too,
  including `src/glyph-mode.nfr.test.ts`'s `vi.mock`, which is not in this file.
- **`loader-scan.mjs` and the accepted-risk register.** Discharging `AR-133-LOADER` / `AR-133-WRAP` is
  Security/NFR's call. Until the gate rules, both risks and their triggers stand as written.
- **Any manifest change.**

## Acceptance (Given/When/Then)

"Each plant alone" means QE's harness: a `git archive` copy of the delivered tree, `mutate.cjs`
anchors that each occur once, and `npx vitest run src/cli.test.ts`. The recipes are QE's
`.grugops/context/qe-ABC-133/probe/plants.sh` and Security/NFR's `secnfr-ABC-133/probe/plants.sh`
(`S2`, `S3`). `probe/f1331-plants.sh` runs the subset this page names.

- **`A1` ((a)'s kills, red first).** **Given** each plant alone (`X5`, `X5b`, `X6`, `X7`, `S2` and
  `S3`), **then** each is **RED** on count (i)'s assertion. *(At `3159ab68`: all six GREEN, 67/67.)*
- **`A2` ((b)'s kills, red first).** **Given** each plant alone (`C5`, `C6`, `C7`, `C8`, `C10` and
  `Q14`), **then** each is **RED** on the new count's assertion. *(At `3159ab68`: all six GREEN,
  67/67.)*
- **`A3` (no kill traded, no false red on the controls).**
  - **Then** the unmutated file is **GREEN** and reads count (i) `[["spawnSync"]]`, count (ii)
    `["spawnSync in childOf"]` and the new count 2.
  - **And** `ABC-133`'s kills stay **RED**: `Q11`, `Q12`, `Q13`, `P1`, `P-DYN`, `E-MS1` and
    `E-MS2`.
  - **And** these controls stay **GREEN**: `E-A1`, `S-CTRL`, `C13`, `C15` and **`C14-ARRAY`**.
    `C14-ARRAY` is QE's `C14` without its `void JSON.stringify("child_process");` call; its recipe
    is in `probe/f1331-dryrun.sh`.
- **`A4` (the one false red is stated, not hidden).**
  - **Then** `C14` as QE recorded it, and `C14-ARG` (its `JSON.stringify` call alone), read **RED**
    on count (i). A call that takes the module name as its first argument is counted whatever the
    callee. That is (a)'s price, and it fails loud.
  - **And** the pin's comment names that class.
  - **And** "resolving it needs data flow" occurs **0** times in collapsed text (**1** at
    `3159ab68`).
- **`A5` (the cost is re-measured).** **Given** the pin's own work timed in situ under `ABC-133` `A4`'s
  protocol: `process.cpuUsage` marks as in `.grugops/context/qe-ABC-133/probe/a4.sh`, **≥ 8** fresh
  processes, round 0 discarded and load1 logged. **Then** the **median is ≤ 250 ms CPU**, and the
  parse still runs once. *(Last readings: QE 173.2 ms at load1 10.1; Security/NFR 192.3 ms at load1
  11.3, 23 % headroom. Report load1 beside the median.)*
- **`A6` (one path, nothing else moves).**
  - `git diff --name-only <base>..<delivered>` lists **exactly** `src/cli.test.ts`, and the
    `package.json` / `package-lock.json` numstat is empty.
  - **0 production lines, 0 new files, 0 new `it`, `N8_SPAWN` 27.**
  - `node .grugops/context/secnfr-ABC-133/probe/loader-scan.mjs src/cli.test.ts` on the delivered file
    still reads `[]`, one `createRequire` site and two value references.
  - Lint, typecheck, build and `npm test` exit 0. The skip count is 0, and integrity prints
    `No findings.`

## Dependencies

- **None open. Pullable now.** `ABC-133` is `Done` (merged `c0b0e9e1`). `ABC-129`, the last ticket on
  this file, is `Done` (merged `3730f28e`).
- **`ABC-132` (`In Development`)** fences its diff to exactly `src/cli.ts`, `src/render-seam.ts` and
  `src/result-screen.ts` (its page, `A4`). **It does not touch this file, so the two may run in
  parallel.** If ABC-132's delivered diff names `src/cli.test.ts`, this ticket waits for it.
- **`ABC-137`** (`src/history-pane.nfr.test.ts`) is disjoint, and may run in parallel.
- **Backlog tickets that name `src/cli.test.ts`** are merge order only, re-checked at pull.
- **Promotion triggers (Security/NFR's, unchanged).** On any diff to `src/cli.test.ts`, run the
  check: `node .grugops/context/secnfr-ABC-133/probe/loader-scan.mjs src/cli.test.ts`.
  - **(a) becomes `P1`** if it reads a non-empty `childProcessArgCalls`, or a `createRequire` site
    other than the pin's load. It is then fixed in or before that diff.
  - **(b) becomes `P1`** if it reads more than two `spawnSyncValueRefs`.

  Neither trigger fires at `5d55cc48` or at `3159ab68` (`RUN.txt`).

## Security / NFR triggers

- **`V1.2.5 [L1]` is the subject.** It stays MET, and the drift guard's reach grows (`A1`, `A2`). This
  changes a security-bar instrument, so **a Security/NFR hop is recommended**, as `ABC-133` had.
- **`ABC-041` / `ADR-0036`.**
  - (a) No manifest change.
  - (b) Clause (b) does not fire: 0 production files.
  - (c) No spawn, network or write. The added work is over the read-only parse already held.
  - (d) One path.
- **`N8-SPAWN`: 27, unchanged.** **`N8-LANE`:** 0 files, so the content bound is `A5`'s 250 ms.
  **`NFR-008`:** the added CPU is reported, and no verdict is claimed; that is with the owner.
- **UAT: WAIVED by the standing 2026-08-17 rule** (`.test.ts` only, so 0 production lines). The QE hop
  applies.

## Test notes

1. **The dry run predicts every row.** `probe/f1331-dryrun.sh` applies each plant to a copy and runs
   Security/NFR's `loader-scan.mjs`. Its readings at `3159ab68` (`probe/f1331-dryrun-3159ab68.out.txt`):
   - (a) lists one entry for each `A1` plant, and for `C14` and `C14-ARG`;
   - (b) reads 3 for each `A2` plant;
   - every `A3` control reads `[]` and 2.

   The scan's (b) counts identifiers *named* `spawnSync`. The pin counts names *the import binds*.
   Today those are the same name.
2. **Why `C14` splits.** Security/NFR listed `C14` as a no-false-count control for (a). It holds
   `void JSON.stringify("child_process")`, and (a) "whatever the callee" counts that call (dry run).
   The array half is the true control. The call half is the class `A4` states. A hop that needs
   the module name as a call argument spells it through a `const`, the way bar 1's list at `:1709`
   does. **Security/NFR confirms this split at the gate.**
3. **Count each specifier position once.** `import()` and `require()` are calls with the module as
   their first argument. Widening the callee test must not list them twice: `P-DYN` stays one extra
   entry.
4. **A member name or object key spelled `spawnSync` is not a reference to the binding.** If the
   spelling counts it, the result is a loud false red, as with shadowing (`QE-133-e`). That is
   acceptable but not required; no such text exists in the file.
5. **`A5`'s marks.** QE's `a4.sh` plants its marks by anchor around the pin's lines. If the edit moves
   an anchor, move the mark and keep the protocol.

## Size and priority rationale

**Size `S` (2).** It adds two counts over an existing walk, restates one comment (reversing a page
line), runs 27 plant builds (all recipes exist) and takes one cost re-reading. Not `XS`: it is two
counts plus a cost bound, not one literal. Not `M`: it is one file, one `it`, no new parse and no new
dependency.

**Priority `P3`** (Security/NFR: LOW, P3). `V1.2.5` is MET, and no trigger fires today. It becomes
**`P1`** on either promotion trigger (§ Dependencies).

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**: base `5d55cc48`, and every plant re-run at
`3159ab68`. **Result: 10 of 10, 0 ⚠️ — MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 12 holes re-run GREEN at the tip, with the hand-run check they cost |
| 2 | scope and out-of-scope clear | **✅** two counts and one comment in one `it`. Seven fences, including the non-literal name and count (ii) |
| 3 | INVEST-shaped | **✅** independent (no open predecessor), one file, testable by existing recipes. (a) and (b) share the walk and the QE hop, so splitting them would buy two serial hops on one file |
| 4 | acceptance testable and measurable | **✅** 12 plants that must red (each GREEN today), 7 kills that stay red, 5 controls that stay green, one stated false red, one phrase 1 → 0, a CPU median ≤ 250 ms, and one-path checks |
| 5 | dependencies known | **✅** none open. `ABC-132` and `ABC-137` are disjoint, and Security/NFR's triggers are carried |
| 6 | security/NFR triggers with a measurable target | **✅** `V1.2.5` (hop recommended), `N8-SPAWN` 27, `A5` ≤ 250 ms, `ADR-0036` (b) not fired, UAT waived by rule |
| 7 | test notes present | **✅** five (dry run, the `C14` split, single count, member names, `A5` marks) |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P3`, with two `P1` triggers |
| 10 | no major unresolved blocker | **✅** none. The `C14` split is resolved on this page, and Security/NFR confirms it at the gate |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-138`).
- Branch `grugops/ABC-138-spawn-pin-in-suite`, from `2946e22a`. The code is `84edfb46`
  (`src/cli.test.ts` +30/−13, the pin's one `it` and its comment).
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-138/` (`…8d70af7c`,
  `…74a52ca8`, `probe/`) and are not restated here.

**`A1`–`A6` are met. No stop condition fired.**
- **The premise held at `2946e22a`.** The file is byte-identical to `3159ab68`, and all 12 gap
  plants and the controls are GREEN 67/67.
- **`AR-058-STRIP` did not fire.** No `//` or `/*` literal was added, and no `child_process`
  import form.

| # | verdict | reading (plants out of tree; base `2946e22a` → delivered `84edfb46`) |
|---|---|---|
| `A1` | MET | `X5`, `X5b`, `X6`, `X7`, `S2`, `S3`: GREEN 67/67 → **RED 1/67**, the pin row, on count (i) |
| `A2` | MET | `C5`, `C6`, `C7`, `C8`, `C10`, `Q14`: GREEN 67/67 → **RED 1/67**, the pin row, on the new count (iii) |
| `A3` | MET | The unmutated file is GREEN. It reads (i) `[["spawnSync"]]`, (ii) `["spawnSync in childOf"]` and (iii) two. `Q11`, `Q12`, `Q13`, `P1`, `P-DYN`, `E-MS1` and `E-MS2` stay RED, and `P-DYN` is one extra entry. `E-A1`, `S-CTRL`, `C13`, `C15` and `C14-ARRAY` stay GREEN |
| `A4` | MET | `C14` and `C14-ARG` are RED on (i). The comment names that class. "resolving it needs data flow" is 1 → 0 |
| `A5` | MET | In situ, n = 10 after round 0, interleaved with base. Median **164.8 ms** CPU ≤ 250 at load1 7.78; base 162.5 ms at 7.94; paired delta −0.3 ms. One load, one parse |
| `A6` | MET | `git diff --name-only` = `src/cli.test.ts`; the manifest numstat is empty; 0 production lines, 0 new files, 0 new `it`; `N8_SPAWN` 27. `loader-scan.mjs` reads `[]`, one `createRequire` site and two references. `ABC-042` `A1`, `ABC-065` and `ABC-059` hash identically |

- **Gate.** Lint, typecheck and build exit 0. `npm test` is 52 files / 1608 passed. The skip count
  is 0, and integrity reads `No findings.` `lane-inventory.js` exits 0 with no findings.
- **Next.**
  - QE's hop.
  - The Security/NFR hop the page recommends: confirm the `C14` split, and rule on discharging
    `AR-133-LOADER` / `AR-133-WRAP`.
  - The UAT waiver applies if zero production lines holds (measured 0).

## QE 2026-10-10 (QE/E2E, `qe-ABC-138`, Workflow 04 review exit): PASS_WITH_GAPS

Reviewed `2946e22a..7e5c9c74`, code `84edfb46`. Every reading is QE's own, taken in fresh
`git archive` trees, with the engineer's table re-run and QE's own 22 plants. **`A1`–`A6` are MET.
No test was added.**

- **`A1`–`A4`**: the engineer's 25-row table reproduces row for row at both tips. Every red is the
  `N8-LANE` row alone: (i) for `A1` and `A4`, (iii) for `A2`, and the base counts for `A3`'s kills.
- **`A5`**: **170.3 ms** median at load1 10.11 (base 180.4 ms, paired −4.3 ms). Under load1 37.8 it
  is 183.7 ms. Both are ≤ 250, with n = 10 each, round 0 discarded, and one load and one parse.
- **`A6`**: one path, +30/−13. The manifest is empty, with 0 production lines, 0 new files and 0 new
  `it`; `N8_SPAWN` 27. `loader-scan` reads `[]`, one site and two references. Lint, typecheck,
  build and `npm test` (52 / 1608) exit 0. Skip is 0, and integrity and `lane-inventory.js` report
  no findings.
- **QE's plants**: 12 new kills beyond the page's. There is no false red on type-only references,
  JSDoc, import type nodes or non-first-argument names.

**Gaps (none fails a criterion; every hole was green at base too, so no kill was traded):**
- **`QE-138-a` LOW, inside Scope (b)'s letter.** (iii) skips a reference inside
  `ExpressionWithTypeArguments`, which `ts.isTypeNode` counts as a type. A class `extends` clause
  is a value position, though. `class S extends (spawnSync as unknown as new (…) => object) {}`
  with `new S(…)` spawns a real child. The suite stays GREEN 67/67, `tsc` exits 0 and `biome`
  exits 0. The one-line fix is verified in scratch:
  `ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)`.
- **`QE-138-b` LOW.** A literal module name in a non-first argument stays green
  (`getBuiltinModule.call(process, "node:child_process")`, `Reflect.apply(loader, …,
  ["child_process"])`). The comment's bound names only non-literal names.
- **`QE-138-c`–`-f` INFO:**
  - the comment's "spell it through a `const`" remedy is the blind shape for a loader;
  - the instantiation-expression alias is held off only by a Biome format quirk;
  - `expect(…).not.toContain("child_process")` reds, as stated;
  - single rounds go over 250 ms under load.

The board move is the Orchestrator's, including whether to bounce `QE-138-a`'s one line. Security/NFR
should not discharge `AR-133-WRAP` as closed while `QE-138-a` stands. Readings are in
`.grugops/context/qe-ABC-138/notes/` (`…6ef45921` decision, `…9cdaa822` readings, `…d5a380ba`
gaps) and `.grugops/context/qe-ABC-138/probe/`. Not merged, not pushed.
