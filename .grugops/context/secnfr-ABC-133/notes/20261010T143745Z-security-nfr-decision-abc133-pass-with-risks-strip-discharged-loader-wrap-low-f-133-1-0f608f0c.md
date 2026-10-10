---
id: 20261010T143745Z-security-nfr-decision-abc133-pass-with-risks-strip-discharged-loader-wrap-low-f-133-1-0f608f0c
kind: decision
by: security-nfr
at: 2026-10-10T14:37:45Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-041
  - ABC-115
  - F-058-1
  - F-133-1
  - QE-133-a
  - QE-133-b
  - QE-133-c
  - QE-133-d
  - QE-133-e
  - QE-133-f
  - QE-058-e
  - AR-058-STRIP
  - AR-133-LOADER
  - AR-133-WRAP
  - V1.2.5
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ADR-0035
  - src/cli.test.ts
  - plans/tickets/ABC-133-count-the-spawn-pin-over-the-parser-view-not-a-stripped-string.md
  - 20261010T143745Z-security-nfr-observation-abc133-plants-loader-scan-a4-192ms-gates-1457cc94
  - 20261010T114249Z-security-nfr-decision-abc058-pass-with-risks-clause-c-does-not-fire-strip-trade-low-follow-up-cost-bounded-ae61a3cb
  - 20261010T142516Z-qe-e2e-decision-abc133-verdict-pass-with-gaps-27801a15
  - 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
  - 20261010T140620Z-software-engineer-decision-abc133-specifiers-as-binding-lists-callee-resolution-createrequire-a530d175
supersedes:
---

# `ABC-133` Security/NFR: **PASS_WITH_RISKS**. The pin still discharges `N8-SPAWN`'s count and `V1.2.5`'s drift guard, and **`AR-058-STRIP` is discharged**. `QE-133-a` and `QE-133-b` are LOW, accepted with triggers, and routed as `F-133-1`. `QE-133-f` does not move `NFR-008`

This note is hand-authored and unsealed. It is a `decision`, not a stamp, because `human_admission`
is `off` and this install has no sanctioned writer.
- **Reviewed:** `8be650e6..e542c574` on `grugops/ABC-133-spawn-pin-parser-view`. The code commit is
  `cd594b5f`: `src/cli.test.ts` +88/−9.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** `…1457cc94`.

## Result

**PASS_WITH_RISKS.**
- **Nothing blocks.** No finding is at or above `high`.
- **No fix is required, on this branch or anywhere else.** No test was added.
- Two LOW risks are accepted, each with an owner and a promotion trigger.
- One LOW follow-up, `F-133-1`, is recommended to BA/PM.
- **`V1.2.5 [L1]` stays MET.** The instrument's reach grows, and no kill was traded.
- The board move to `Ready for UAT` is the Orchestrator's. UAT is waived by the standing
  zero-production-lines rule (measured 0).

## Ruling 1. The new pin still discharges what the catalog and `ABC-058` rely on

- **`N8-SPAWN` = 27.** The catalog says *"a `N8-SPAWN` instance's COUNT clause is mechanically
  pinnable and IS pinned"* (the `G-QE115-3` ruling). The count is `spawned`. This pin is what stops a
  child from bypassing it.
  - At head, the pin still asserts one specifier position binding `spawnSync` alone, and one
    resolved call, the one in `childOf`.
  - Of 58 plants across both hops (QE's 49 and this hop's 9), **no shape with a real call or a
    real `child_process` load is red at base and green at head**. Every such shape the regex pin
    caught, the parser pin catches.
  - The one base-red, head-green plant is `Q8`, template TEXT naming `spawnSync(` with no call. It
    was a false red, and it is now removed (`QE-058-e`, QE's and the Engineer's reading).
  - `N8_SPAWN` is `17 + 7 + 1 + 2`, unchanged. **The count clause is still pinned, and more
    strongly.**
- **`AR-058-STRIP` is DISCHARGED**, effective when `ABC-133` merges.
  - `Q11` is RED at head (this hop). QE and the Engineer read `Q12`, `Q13` and `P2` RED.
  - The strip class is gone from this pin: no text is stripped, so no string can hide a call.
  - The promotion trigger and its `scan-literals.mjs` check lapse with it.
  - `executableCodeOf`'s other callers were never under this risk. They are the
    production-module rows and the self-scan, out of scope by the page.
- **`P1` is closed.** It is a namespace import plus `cp.execSync`: a shell child that was GREEN at
  base and at `ABC-058`'s head. This hop's own plant reds it on count (i).
- **The bar 1b sentence (`:16-17`) is now pinned.** It reads "no `exec(` or `execSync(` call site".
  Any `execSync` reached through a `child_process` binding reds count (ii).
- **`ABC-041`'s clauses are quiet.**
  - (a): no manifest change. `typescript` was already a devDependency, and the gate's `typecheck`
    already runs it.
  - (b): no production file.
  - (c): no network, no write and no spawn. It adds a read-only parse of the file's own source. This
    is the precedent the page cites, and the read capability (`sourceOf`) was already held.
  - (d): one path.
  - Loading `typescript` in-process grants it no trust that `tsc` in the gate does not already have.

## Ruling 2. `QE-133-a` (loaders other than `import`/`require`): LOW, accepted as `AR-133-LOADER`, and routed as `F-133-1` (a)

**What it is.** These shapes stay green, at base and at head:
- `createRequire(…)("node:child_process")`, plus `X5b` and this hop's `S3` (the `node:module`
  namespace);
- `process.getBuiltinModule(…)`;
- `vi.importActual(…)`.

This hop adds `S1`, `import cp = require(…)`. It is green under vitest, but the mandatory
`typecheck` gate refuses it with TS1202. So that loader is closed by a gate that already exists.

**Severity: LOW. The L1 → high default does not apply.**
- That mapping is for a *failed* requirement, and `V1.2.5` is MET at head. The override is this
  gate's, the reasons are the same as `ABC-058` Ruling 2a, and the owner is named below.
- **No kill was traded.** Every loader shape was green at base too.
- **The pin is a drift guard, not an adversary guard.** The idiomatic way to add a second child,
  adding a name to the existing `import { … }`, reds count (i).
- **Two things raise this above "accept and forget".**
  - **This ticket put the template into the file.** `createRequire` is now imported, and the pin's own
    load line (`:1858`) is the exact shape of `X5`.
  - **The vi.* loader idiom is live in this repository.** `src/glyph-mode.nfr.test.ts:37` uses
    `vi.mock("node:child_process", …)`.
  - The shape is therefore one copy-paste from existing code, not two coincident accidents.

**Not a required fix on this branch.** The page fixes count (i)'s loader list as `import`,
`export … from`, `import()` and `require()`. Widening it is outside the page's letter, as QE found,
so it is BA/PM's to cut.

**`AR-133-LOADER`: LOW, owner BA/PM.**
- **Window:** until `F-133-1` (a) lands, or permanently if BA/PM declines it.
- **Promotion trigger:** any diff to `src/cli.test.ts` after which the scan below reads either of:
  - a non-empty `childProcessArgCalls`;
  - a `createRequire` site other than the pin's own `typescript` load.

  Either makes `F-133-1` (a) **P1**, to be fixed in or before that diff.
- **The check:** `node .grugops/context/secnfr-ABC-133/probe/loader-scan.mjs src/cli.test.ts`. At
  `e542c574` it reads `[]` and one site, `@1858`.
- **Who runs it:** BA/PM at the cut, and Security/NFR at the gate, for any ticket that touches
  `src/cli.test.ts`.

## Ruling 3. `QE-133-b` (unwrapped callees): LOW, accepted as `AR-133-WRAP`; folding it into `F-133-1` is BA/PM's call

**What it is.** These callees are not seen, and all were green at base:
- `(spawnSync)()`;
- `(0, spawnSync)()`;
- `spawnSync!()`;
- `(spawnSync as …)()`.

**Severity: LOW, for the same reasons as Ruling 2, with two differences.**
- **All four wrappers are non-idiomatic around a direct call**, and no copy of any of them exists
  in the file.
- **The pin's comment states the class**: "neither a bound name nor a member of one". That class
  contains every wrapper, though `!` and `as` are not named.

**Accepted as `AR-133-WRAP`: LOW, owner BA/PM.** It sits beside the stated `Q14` bound, which is the
same class.
- **Promotion trigger:** any diff to `src/cli.test.ts` after which the scan's `spawnSyncValueRefs`
  lists more than two entries. Today the two are the `ImportSpecifier` `@32` and the `childOf`
  `CallExpression` `@343`. Exceeding that makes `F-133-1` (b) **P1**.
- **The check:** the same command as Ruling 2. The scan sees every QE-133-b shape, plus `Q14` and
  `Reflect.apply` (R2).

## Recommended follow-up `F-133-1` (LOW, P3; BA/PM cuts or declines)

The scope is `src/cli.test.ts` only, test-only, with the same parse and no new load.

**(a) closes `QE-133-a`.** Count (i) also counts every call whose first argument is a string naming
`(node:)child_process`, whatever the callee.
- The unmutated file must still read exactly `[["spawnSync"]]`. The dry run gives (a) `[]`.
- **Red first:** `X5`, `X5b`, `X6`, `X7` and `S3`, plus `vi.mock("node:child_process", …)`. Reddening
  that is wanted: this file's children must stay real.
- **Controls:** the unmutated file, `E-A1`, `S-CTRL`, and `C13`/`C14` (no false count).

**(b) closes `QE-133-b`. This part is BA/PM's call.** A third count: every value-position reference
to a name a `child_process` import binds is exactly two, the binding and the callee of the call in
`childOf`.
- It needs no data flow. The dry run reads exactly two at head.
- **Red first:** `C5`–`C8`. It also reds `Q14` and `C10`. That reverses this page's "`Q14` out", so
  the new ticket must say so and restate the pin's comment.
- A type-position `typeof spawnSync` is not counted.
- It fails loud on shadowing, as today (`QE-133-e`).

**Cost:** no new parse. Re-time `A4` under this page's protocol.

## Ruling 4. `QE-133-f` (`A4`'s headroom): INFO. It does not move `NFR-008`, and no in-file guard is owed

- **`A4` is MET.** This hop timed it in situ at **192.3 ms**, at load1 11.3, which leaves 23 %
  headroom. QE read 173.2 ms at load1 10.1, with 31 % headroom. The margin is load-sensitive, and it
  is stated as such.
- **It does not move `NFR-008`'s state.** The CPU clause has been **BREACHED** since 2026-09-25
  (24.86–26.04 s, `ADR-0035` decision 5). Decision 6 is with the owner.
  - This ticket adds about 0.17–0.19 s of content per lane run, roughly 0.7 % of the lane's CPU.
  - That is **reported to the owner with the rest, not ruled here.** No clause flips on it.
- **`N8-LANE` is not at risk.** `ADR-0035` names `A4` as this file's content bound, because the
  file's floor `F` (1.097 s) refuses a 650 ms lane reading. Every reading on record is far under
  650 ms: QE's worst single round (254.4 ms) and the ESM swap QE timed (268.1 ms) both are.
- **No in-file CPU assertion is owed.** One is barred by the standing no-wall-clock-in-suite rule. A
  time bound is a DELTA property, checked by a role at a hop, as in the `G-QE115-3` reasoning. The
  comment guarding the load form is the right shape.
- **Re-time trigger, written down.** BA/PM at the cut, checked by Security/NFR at the gate. A diff
  that does any of these re-times `A4` under the page's protocol at that hop:
  - changes the pin's load line, its form or its placement;
  - adds a second parse;
  - moves the installed `typescript` version.

  This needs no accepted risk; it is a trigger.

## The INFO items: agreed as QE recorded them

- `QE-133-c`: `Reflect.apply` is the alias class, and a tagged template cannot spawn.
- `QE-133-d`: `import type … from "node:child_process"` now reds. It fails loud, never silent.
- `QE-133-e`: shadowing reds. It fails loud.

None needs action.

## Checklist (`security.asvs_level` L1, cumulative)

- **`V1.2.5 [L1]`** (OS command injection): **MET.**
  - The children use argument-array form. There is one call site, in `childOf`, with no `exec*` and
    no `shell:`.
  - The `ABC-115` `/bin/sh -c` scripts are unchanged and are composed only from `shellWord`-quoted
    paths and the file's own literals.
  - The drift guard now reaches string-hidden calls, namespace, default, re-export, dynamic and
    `require` forms, and `exec*` through a binding.
  - It does not reach the two residuals above, which are accepted.
- **Secrets, personal data, auth, network, migration and external integration:** none in scope.
- **Logging and diagnosability:** a red prints the offending specifier binding list or the callee
  text, with ` in childOf` attribution. The failure names itself.

## Not done by this gate

- No `src/` byte, `plans/board.md`, `plans/nfr-catalog.md`, ADR or `AGENTS.md` change. No catalog
  line needed changing: `AR-058-STRIP` was never a catalog line, and `N8-SPAWN`'s count clause
  stands as written.
- Nothing merged, nothing pushed.
- **Next steps:**
  - The Orchestrator moves `ABC-133` to `Ready for UAT` (waived).
  - BA/PM cuts or declines `F-133-1`.
  - The owner's `NFR-008` decision is unchanged by this hop.
