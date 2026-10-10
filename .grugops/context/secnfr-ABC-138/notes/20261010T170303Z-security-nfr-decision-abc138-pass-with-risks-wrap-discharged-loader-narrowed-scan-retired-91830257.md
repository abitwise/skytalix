---
id: 20261010T170303Z-security-nfr-decision-abc138-pass-with-risks-wrap-discharged-loader-narrowed-scan-retired-91830257
kind: decision
by: security-nfr
at: 2026-10-10T17:03:03Z
verified_by:
confidence: high
refs:
  - ABC-138
  - ABC-133
  - ABC-041
  - F-133-1
  - AR-133-LOADER
  - AR-133-WRAP
  - QE-138-a
  - QE-138-b
  - QE-138-c
  - QE-138-d
  - QE-138-e
  - QE-138-f
  - QE-133-e
  - V1.2.5
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ADR-0036
  - src/cli.test.ts
  - plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
  - 20261010T170303Z-security-nfr-observation-abc138-plants-a5-gates-f114ac22
  - 20261010T143745Z-security-nfr-decision-abc133-pass-with-risks-strip-discharged-loader-wrap-low-f-133-1-0f608f0c
  - 20261010T162956Z-qe-e2e-observation-abc138-gap-register-d5a380ba
  - 20261010T164758Z-software-engineer-decision-abc138-fix-iii-counts-expression-with-type-arguments-4c39f4c1
supersedes:
---

# `ABC-138` Security/NFR: **PASS_WITH_RISKS**. The `C14` split is confirmed, with the `const` remedy narrowed on the branch. **`AR-133-WRAP` is DISCHARGED.** **`AR-133-LOADER` is NARROWED** to two adversarial residuals, LOW, with an event trigger. **`loader-scan.mjs` is RETIRED** from the per-diff routine. All take effect when `ABC-138` merges

This note is hand-authored and unsealed. It is a `decision`, not a stamp: `human_admission` is `off`
and this install has no sanctioned writer.
- **Reviewed:** `2946e22a..a4802fc0` on `grugops/ABC-138-spawn-pin-in-suite` (code `84edfb46` and
  `33e54f70`). This hop added **`0a63e4c4`**: a comment-only change, `src/cli.test.ts` +4/−2, inside
  the pin's comment.
- **Settings:** `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.
- **Readings:** `…f114ac22` and `../probe/`. Every reading is this hop's own, taken at `0a63e4c4`.

## Result

**PASS_WITH_RISKS.**
- No finding is at or above `high`, so nothing blocks.
- One required fix was found and made on the branch: the `QE-138-c` wording (Ruling 1).
- Two LOW residuals are accepted under `AR-133-LOADER`, with an owner and a trigger.
- **`V1.2.5 [L1]` is MET.** The drift guard's reach grew, no kill was traded, and every plant
  reproduces.
- **`N8_SPAWN` is 27, unchanged.**
- **`A5` is MET at the new tip in two batches** (see the NFR section).
- UAT is waived by the standing zero-production-lines rule (0 measured at `0a63e4c4`). The board
  move is the Orchestrator's.

## Ruling 1. The `C14` split: CONFIRMED, with the guidance narrowed (required fix, made: `0a63e4c4`)

**The false red is acceptable.** It covers any call whose first argument is a literal
`(node:)child_process`, whatever the callee. It is acceptable for four reasons:
- **It fails loud, never silent.** It reds the `N8-LANE` row on count (i), with the message
  "child_process specifier positions".
- **It can never hide a child.**
- **The pin's comment names the class.**
- **The known innocent idioms have a working remedy.** These red as stated: `C14`, `C14-ARG`
  (`K1`), `F1` (`console.log`) and `F4` (`expect(…).not.toContain`). Respelling the name through a
  `const` for a call that loads nothing is GREEN (`K3`).

`C14-ARRAY` is the true control and stays GREEN.

**The guidance as delivered was wrong for one case, and that case is a drift path.** The comment
said that a hop needing the name "as a call argument spells it through a `const`." For a LOADER,
that is the exact shape count (i) cannot see. `K4` (`vi.importActual(CP)`), `K5`
(`createRequire(…)(CP)`) and QE's `L3b` are all GREEN, with `tsc` 0 and `biome` 0.

So the pin's own comment taught the evasion to an innocent hop that hits a red on a second load.
That makes `QE-138-c` more than INFO: it is the one route by which drift, rather than an
adversary, reaches the non-literal bound.

**Fixed in the comment only.** The remedy is now confined to "a call that LOADS NOTHING", and the
comment says: "NEVER a loader's argument: a `const` name is the unseen bound below, and a second load
in this file is a scope change, not a spelling (`QE-138-c`)." This is test-only, and it is inside the
page (Scope: the comment "names the one false-red class (`A4`)"). No code moved.

**Diagnosability (INFO, no action).** A red on (i) caused by a call shows an extra `[]` entry, not
the callee. The literal is greppable, so this is noted only.

## Ruling 2. `AR-133-WRAP`: DISCHARGED, effective when `ABC-138` merges

Count (iii) now reds every shape the risk named, plus every shape QE added:
- **The risk's own shapes.** `C5` to `C8`, `C10` (`Reflect.apply`) and `Q14` (a variable alias).
- **QE's added shapes.**
  - `W1`, `W2`, `W3`, `W4` and `W7`: `satisfies`, an array index, shorthand, `new (… as …)` and
    destructuring.
  - `L8`: re-export.
  - `W5` and `W6`, the `ExpressionWithTypeArguments` hole (`QE-138-a` and `-d`). These are closed
    by `33e54f70` and re-read RED here, along with this hop's `E3`.

**QE's condition is met.** "Do not discharge while `QE-138-a` stands": it no longer stands.

**One shape reaches the binding with no identifier: direct `eval("spawnSync")` (`E1`).**
- Count (iii) does not see it, and the suite is GREEN.
- **`npm run lint`, a mandatory gate, refuses it:** `lint/security/noGlobalEval`, from Biome's
  `recommended` preset in `biome.json`.
- Indirect `eval` and `new Function` cannot see module bindings at all.
- So `E1` is closed by an existing gate, as `S1` is by TS1202. **This is a dependency, not a risk.**
  If a `biome.json` change turns off `noGlobalEval` for `src/`, that change reopens `E1`. Whoever
  makes it owns the re-read.

**Known loud behaviours (not risks).**
- Shadowing (`QE-133-e`) reds.
- A member name or object key spelled like the bound name reds.

**The `spawnSyncValueRefs > 2` promotion trigger lapses.** Its check is now an assertion in the
suite.

## Ruling 3. `AR-133-LOADER`: NARROWED, still LOW, owner BA/PM, with an event trigger and no per-diff scan

**What is closed.** Count (i) now reds a literal first-argument load whatever the callee:
- `X5`, `X5b`, `X6`, `X7`, `S2` and `S3`;
- QE's `L1`, `L2`, `L3a`, `L4`, `L6` and `L7`;
- this hop's `L-c` and `L-d`.

**What remains is two residuals.** Both are adversarial, and both were GREEN at base, so no kill
was traded:

| residual | shape (GREEN at `0a63e4c4`, `tsc` 0) | severity | why not higher |
|---|---|---|---|
| **`QE-138-b`: a literal name that is not a call's first argument** | `getBuiltinModule.call(process, "node:child_process")` (`L3c`, `L-a`); `Reflect.apply(createRequire(…), undefined, ["child_process"])` (`L5`) | **LOW** | It takes `.call`, `.apply` or `Reflect.apply` on a loader. No such idiom exists anywhere in `src/`: there is no `Reflect.apply`, no `getBuiltinModule` and no `.call(process`. The comment names the bound |
| **The non-literal name** (the page's own out-of-scope line) | a computed, concatenated or `const`-held name (`L-b`, `L3b`, `K4`, `K5`) | **LOW** | It is adversarial. **Its one drift route, the comment's own `const` advice (`QE-138-c`), is closed by Ruling 1.** An innocent hop that wants a second load now meets a red on (i) and a comment that calls it a scope change |

**The L1 → high default does not apply.** `V1.2.5` is MET. The override is this gate's, the
reasons are those of `ABC-133` Ruling 2, and the owner is named below.

**Accepted as `AR-133-LOADER` (narrowed). LOW. Owner: BA/PM.**
- **Trigger (an event, with no scan).** It fires when either of these happens:
  - A ticket's scope, or a hop's report, calls for a second `child_process` load or a
    `child_process` mock in `src/cli.test.ts`.
  - A red on count (i) is resolved by respelling the module name rather than by removing the load.
    BA/PM reads this at the cut. QE or Security/NFR reads it in the diff of any hop that changes the
    pin's region or adds a loader call.
- **On fire:** `F-138-1` becomes **P1**, in or before that ticket.
  - `F-138-1` is a fourth count: every string literal exactly naming `(node:)child_process`, wherever
    it sits, pinned to the import specifier and bar 1's list.
  - The cost is that `C14-ARRAY` becomes a stated false red.
- **`F-138-1` is NOT recommended for cutting now.** Both residuals are adversarial, and the pin is a
  drift guard, not an adversary guard (`ABC-058` Ruling 2a, `ABC-133` Ruling 2).

**`QE-138-c` is closed by `0a63e4c4`.** What it leaves behind is the non-literal residual above.

## Ruling 4. `loader-scan.mjs` is RETIRED from the per-diff routine, effective when `ABC-138` merges

It was run by BA/PM at every cut and by Security/NFR at every gate that touched `src/cli.test.ts`.
Each of its three readings is now covered or weaker:
- **(a) `childProcessArgCalls`.** This is count (i)'s predicate exactly: a literal first argument,
  whatever the callee. It is now an assertion in the suite.
- **(c) `spawnSyncValueRefs`.** Count (iii) is STRONGER. It counts names the import binds, not the
  spelling `spawnSync`, and it counts inside `ExpressionWithTypeArguments`. The scan keeps the old
  `ts.isTypeNode` filter: **on a `W5`-planted copy it reads two references, while the suite reds**
  (`probe/loader-scan-w5.out.txt`). Kept in the routine, it would be a check that reads clean on a
  shape the suite catches.
- **(b) `createRequireSites`.** This was a proxy for the `X5` template. The literal `X5` forms are
  in (i). What remains is the non-literal residual, which now runs on the event trigger in
  Ruling 3.

**What retirement does and does not mean.**
- The script stays in the repo as a historical probe and is not deleted.
- The per-diff duty and the two promotion triggers of `ABC-133` Rulings 2 and 3 lapse **when
  `ABC-138` merges to `main`**.
- **A branch cut from `main` before that merge, which touches `src/cli.test.ts`, still runs it at
  its gate.** That branch's pin lacks counts (i)-wide and (iii).

## NFR

- **`A5` is MET.** The pin's own CPU was timed in situ under the `ABC-133` `A4` protocol: 11
  interleaved rounds, round 0 discarded, load1 logged, one load and one parse.
  - **Batch 1: 230.2 ms median** at load1 11.28. Base was 206.2 ms; the paired delta median is
    −8.5 ms.
  - **Batch 2: 167.9 ms median** at load1 9.88. Base was 176.1 ms; the paired delta median is
    −0.5 ms.
- **Batch 1's 8 % headroom is the environment, not the change.**
  - Base rose by the same amount.
  - The `typescript` load segment alone rose from about 92 ms to about 125 ms.
  - Single rounds over 250 ms occurred at both tips (3 each in batch 1). This is `QE-138-f`, as
    recorded.
  - The bound is a median, and it held in both batches. **No in-suite timing is owed**: the standing
    no-wall-clock rule applies, as in `ABC-133` Ruling 4.
- **`NFR-008`: no verdict is claimed.** The added CPU is about 0 ms paired, and the CPU clause stays
  with the owner.
- **`N8-LANE`:** 0 new files, and the content bound is `A5`'s.
- **`N8-SPAWN`:** 27, unchanged.
- **`ABC-041` / `ADR-0036`:**
  - (a) no manifest bytes;
  - (b) 0 production files;
  - (c) no spawn, network or write; the work is a read-only parse already held;
  - (d) one path.

## Checklist (L1, cumulative)

- **`V1.2.5 [L1]`: MET.**
  - There is one argument-array call site, in `childOf`, with no `exec*` and no `shell:`.
  - The drift guard now covers every loader that takes a literal first argument, and every value
    reference to the binding.
  - Its two residuals are accepted above.
- **Secrets, personal data, auth, network, migration and external integration:** none in scope.
- **Logging and diagnosability.** Each of the three assertions names its count in the failure
  message. Count (iii) prints each reference with its parent kind.

## Not done by this gate

- No production `src/`, `plans/board.md`, ADR, `AGENTS.md` or `plans/nfr-catalog.md` change. No
  catalog line names `AR-133-*` or the scan.
- `ABC-133`'s ticket page still carries the old triggers, as history. This note supersedes them at
  merge.
- Not merged, not pushed.
