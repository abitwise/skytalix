---
id: ABC-056
title: `AR-1`'s accepted-risk override has drifted — its stated reason covers `brace-expansion` only, and two of today's three advisories are `nanoid` and `postcss`
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-056 — the override still holds; the sentence it is written on no longer covers the set

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of Security/NFR's `ABC-041` review, which **referenced `AR-1` rather than
> re-raising it** and recorded the drift honestly instead of inheriting it silently.
> **Owner: Release Manager** — unchanged from `AR-1` itself.

## Problem

*User*: the Release Manager, and whoever next reads `AR-1` to decide whether a `high` advisory is
already disposed of.

*Pain*: **`AR-1`'s override reason is specific to one package, and the covered set has moved.**

`AR-1` was written **2026-07-29** over **5 high**, all `brace-expansion` (GHSA-mh99-v99m-4gvg), with
a reason that is specific by design: *"the vulnerable code path requires attacker-controlled glob
patterns, which do not exist here."*

Measured at the `ABC-041` security review, **2026-08-13**:

```
npm audit             3 vulnerabilities — 1 moderate, 2 high
  brace-expansion  high      DoS via unbounded expansion / unbounded intermediate arrays
  nanoid           high      custom generators can loop indefinitely when size is zero (GHSA-2v37-7h3g-55p8)
  postcss          moderate  attacker-controlled sourceMappingURL reads arbitrary .map files (GHSA-fxqj-rqcc-2cmp)
npm audit --omit=dev  found 0 vulnerabilities     (audit metadata: prod 1 — the root package — dev 180)
```

**`nanoid` and `postcss` are new entries that `AR-1`'s stated reason does not cover.** Neither has
anything to do with glob patterns.

*Value*: **the override's structural premise still holds and was re-verified on 2026-08-13** —
`npm audit --omit=dev` is **0**, the package has **zero runtime dependencies**, is `"private": true`,
declares no `bin`, emits nothing from `build` (it is `tsc --noEmit`), and `AGENTS.md` § Deployment
posture records that nothing is deployed anywhere. None of the three packages can reach a runtime
artifact because **there is no runtime artifact**. So this ticket is **not** "a high vulnerability is
unhandled" — it is "the written reason no longer matches what it is covering", which is the failure
mode where an accepted risk quietly becomes an unexamined one.

## Scope

- **Re-state `AR-1`'s override on the reason that is actually load-bearing** — zero runtime
  dependencies, private, no `bin`, emits nothing, deploys nowhere — so it covers a *set that changes*
  rather than one CVE that happened to be first.
- **Record today's set with dates and identifiers**, so the next drift is visible by comparison
  rather than by memory.
- **State the re-check trigger.** `AR-1` has none today, which is why the drift went four advisories
  before anyone compared. `ABC-042` is a candidate — it is the ticket that ends the
  zero-production-Node-builtin invariant — but the honest trigger is probably *the first hop that
  touches `package.json`*, and choosing it is the Release Manager's.
- **Decide the `@vitest/coverage-v8` upgrade separately or not at all.** `AR-1` already priced
  `npm audit fix --force` as a **breaking** upgrade to `@vitest/coverage-v8@4.1.10` and said it
  warrants a ticket rather than a drive-by. This ticket does **not** perform it.

## Out of scope

- **Running `npm audit fix --force`, or any dependency upgrade.** `AGENTS.md` § Safety rules: do not
  change dependencies without reason. Deciding to upgrade is in scope; upgrading is not.
- **Re-severity-rating the three advisories.** The override is contextual and its context is
  unchanged.
- **Attaching any of this to `ABC-041`.** `package.json` and `package-lock.json` are **byte-untouched**
  by that diff, which adds exactly **zero** supply-chain surface. Security/NFR was explicit about not
  attaching it and this ticket keeps that separation.
- **Any change under `src/`.**

## Acceptance (Given/When/Then)

- **`A1` (the reason covers the set).** **Given** the re-stated `AR-1`, **when** each of the three
  current advisories is checked against it, **then** the reason applies to **all three** without a
  per-package argument. *(Today it applies to one of three.)*
- **`A2` (the set is dated and enumerated).** The record names, for each advisory: package, severity,
  advisory id, and the date `npm audit` was run. **Given** a later reader, **then** they can diff
  today's `npm audit` against the record and see drift without re-deriving history.
- **`A3` (the structural premise is re-verified, not assumed).** **Then** the record carries the four
  checks that make the override sound, each with its command and its output: `npm audit --omit=dev`
  → **0**; `jq 'has("dependencies")' package.json` → **false**; `"private": true`; `build` emits
  nothing. *(All four were true on 2026-08-13 — re-run them, do not copy them.)*
- **`A4` (a re-check trigger exists and is falsifiable).** The record names a condition under which
  `AR-1` must be re-read, stated so that a reader can tell whether it has fired. *("Periodically" is
  not a trigger.)*
- **`A5` (no dependency changed).** `git diff --numstat package.json package-lock.json` is **empty**,
  and `git diff --numstat -- src/` is **empty**.

## Dependencies

- **None.** `AR-1` lives in
  `.grugops/context/architecture-audit-2026-07-29/notes/20260729T145735Z-security-nfr-observation-abedec95.md`
  and the measurement is in `.grugops/context/security-nfr-ABC-041/notes/`. Both are readable today.
- **`ABC-041` neither blocks it nor is blocked by it.**

## Security / NFR triggers

- **`N8-LANE` not triggered** — **0 new test files**, **0 files under `src/`**.
- **`NFR-002` not triggered.**
- **Security: THE SUBJECT of the ticket, and the four clauses still apply to the ticket's own diff**
  (`ABC-041`'s repaired threshold): **(a)** fires on a `dependencies` key or **any** touch of
  `package.json` / `package-lock.json` — **and `A5` forbids exactly that**, so if this ticket ever
  fires (a) it has left its own scope; **(b)**, **(c)** and **(d)** are quiet because nothing under
  `src/` is touched. **On a disputed reading it fires and the gate resolves it.**

## Test notes

1. **Re-run the four structural checks; do not copy the 2026-08-13 numbers.** The whole defect being
   repaired is a record that was copied forward instead of compared.
2. **`npm audit` output is not stable over time** — that is the point. Record the date beside it.
3. **This is a documentation change with a safety consequence**, so `A5` is the criterion that keeps
   it one: an empty diff on both manifests is what separates "re-stated the risk" from "changed the
   dependencies".

## Lane cost — how many test FILES this ticket implies

**Zero, and zero files under `src/`.**

## Size and priority rationale

**Size `XS` (1).** One record re-written, four commands re-run, one trigger chosen. The only judgement
is the trigger, and it belongs to the owner.

**Priority `P2`.** The risk is genuinely low in context and was re-verified 15 days after `AR-1` was
written. It is not `P3` because two `high` advisories currently sit under a reason that does not
mention them, and the cost of that being noticed by the wrong person at the wrong time is a stalled
release conversation. **Promote to `P1` the moment this project acquires a runtime dependency, a
`bin`, or anything to deploy** — each of those removes one leg of the override's premise.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 9 of 10 — NOT MET.** ⚠️×1.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `AR-1` covers 1 of 3 advisories by its stated reason; `nanoid` and `postcss` are not glob-pattern issues |
| 2 | scope and out-of-scope clear | **✅** re-state, enumerate, choose a trigger; four fences, first of which forbids the upgrade itself |
| 3 | INVEST-shaped | **✅** independent, tiny, testable by comparing a reason against a set |
| 4 | acceptance testable and measurable | **✅** five criteria; `A3` names four commands with their required outputs, `A5` requires two empty diffs |
| 5 | dependencies known | **✅** none; both source notes cited by path |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` 0 files; the four security clauses, with (a) deliberately set against this ticket's own `A5` |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with the promotion trigger named |
| 10 | no major unresolved blocker | **⚠️ NOT MET** — the re-check trigger (`A4`) is a **Release Manager** decision, and the `@vitest/coverage-v8` breaking-upgrade question is theirs too. BA/PM cannot score this Ready on someone else's behalf |

## Page note — `RISK-ABC143-01` rides on the coverage-v8 question

**2026-10-11, BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe143-2026-10-11`). Nothing above changed.
DoR stays 9/10, and item 10 is still the Release Manager's.
- `@vitest/coverage-v8` 3.2.7's installed manifest declares the peer `vitest: 3.2.7` (read at the hop). So
  **a yes to the coverage-v8 4.x upgrade is in practice a vitest 4.x bump.** The 4.x peer is
  `UNKNOWN - verify`.
- On 4.x, `tools/grugops/result-file-reporter.js` silently drops unhandled errors (`QE-143-c`, read, not
  run). **The upgrade ticket, if one is cut, carries `RISK-ABC143-01`.** That rule is stated once, on
  `ABC-143`'s page § Follow-ups. In short: depend on `ABC-149`, re-run its six plant rows at head, and
  take or decline QE's 4.x route.
- This ticket still performs no upgrade (`A5`).

## Re-score — 2026-10-12 (BA/PM, subtask `bapm-rescore-backlog-process`, `main` @ `1eb2edbc`)

**Verdict: DoR 10/10 (was 9/10), recommend `Ready`. `XS`, `P2` kept. Owner: Release Manager,
unchanged. The drift still exists and is worse: `AR-1`'s stated reason now covers 0 of 3.** I ran
`npm audit` read-only; nothing was installed, fixed or written (manifest md5s identical before and
after). Commands are in `.grugops/context/bapm-rescore-backlog-process/notes/` (observation note,
§ ABC-056).

**Today's set (`npm audit`, 2026-10-12T12:20Z, exit 1): 3 vulnerabilities, 1 moderate and 2 high, all
transitive dev dependencies.**

| package | severity | advisory | reaches the tree via |
|---|---|---|---|
| `nanoid` 3.3.16 | high | GHSA-2v37-7h3g-55p8 | `vite` → `postcss` |
| `postcss` 8.5.22 | moderate | GHSA-fxqj-rqcc-2cmp | `vite` |
| `source-map-js` 1.2.1 | high | GHSA-68fv-2mgg-jv7q | `postcss`; `magicast` |

- **`brace-expansion`, `AR-1`'s only subject, is gone.** `9313dda7` (`ABC-152`, 2026-10-11) removed it
  (Security/NFR `secnfr-ABC-152-window`, `V12`).
- **`source-map-js` is new** since this page was cut.
- npm offers a **non-`--force`** `npm audit fix` for all three.
- **Still true:** `npm audit --omit=dev` finds **0**; `jq 'has("dependencies")' package.json` → `false`;
  `"private": true`; no `bin`; `build` is `tsc --noEmit`.

**Discharged:**
- **The `@vitest/coverage-v8` half of the item-10 ⚠️.** `ABC-152` performed that upgrade
  (`@vitest/coverage-v8` and `vitest` both `~4.1.11` in `package.json`; md5 `076a03d7…`). Scope bullet
  4 and the 2026-10-11 page note on `RISK-ABC143-01` are history.
- **The trigger half.** The Release Manager owns and executes this ticket, so choosing the trigger is
  the ticket's work, not a blocker (`ABC-039` scored its unread dates the same way). `A4` below makes
  the choice testable and gives a measured default.

**Two premise changes `A1`/`A3` must carry:**
1. **The set drifted twice with the lockfile UNCHANGED.** `package-lock.json` has no commit between
   2026-07-22 and 2026-10-11. In that time `nanoid` and `postcss` appeared (by 08-13), and
   `source-map-js` appeared (by 10-11). **A trigger of "a hop touches `package.json`" would have missed
   both.**
2. **"Ships nothing" is no longer literal.** `ADR-0018` (`ABC-100`) made the channel `git clone` +
   `npm install` + `npm run chess`. `npm install` puts this dev tree on a user's machine. The leg that
   carries the weight now is the **runtime path**: `npm run chess` runs `node src/cli.ts`, and the 37
   non-test `src/*.ts` files hold 140 import specifiers, **all relative (`./`)**. No package is loaded
   at runtime.

**Criteria amendments (2026-10-12):**
- **`A1`** ~~each of the three current advisories~~ → each advisory in **the set measured at the hop**.
  It may be empty if a fix lands first; then the record says so and `A1` holds vacuously.
- **`A3`** gains a fifth check. The production import graph loads no package:
  ``grep -hoE "(from|import\() *['\"][^'\"]+['\"]" $(ls src/*.ts | grep -v '\.test\.ts$') | grep -vE "['\"]\./"``
  → **empty**.
- **`A4`** ~~a condition under which `AR-1` must be re-read~~ → the record names its trigger, and the
  trigger **must fire on an advisory published against an unchanged lockfile**. Measured default:
  *"any `npm audit` run at a Security/NFR hop whose (package, advisory id) set differs from the
  record's"*. The Release Manager may adopt or replace it. **"A hop touches `package.json`" alone
  fails `A4`.**
- **Where the record goes:** a new `decision` note with `refs: [AR-1, ABC-056]` and **`supersedes`
  EMPTY**. `AR-1` shares its 2026-07-29 note (`…abedec95`) with `AR-2` onward, and superseding that note
  would fold them out on replay.
- `A2`, `A5` unchanged. `A5` still forbids any manifest change; running `npm audit fix` is not this
  ticket.

**Owner question (exact; it does not block this ticket):** *"`npm audit` offers a non-breaking,
lockfile-only fix for all three dev-only advisories (`nanoid`, `postcss`, `source-map-js`). Should we
(a) leave the tree as it is and re-state `AR-1` over them (`ABC-056` as written), or (b) cut a separate
gated ticket to apply that lockfile fix, after which `ABC-056` records an empty set and its trigger?"*
`ABC-056` passes under either answer. Under (b), pulling the fix first makes `ABC-056` smaller.

**DoR 10/10:** 1 ✅ (0 of 3 covered), 2 ✅, 3 ✅, 4 ✅ (`A1`/`A3`/`A4` amended), 5 ✅ (none; the
`ABC-152` note cited), 6 ✅ (0 `src/`, 0 test files; security clause (a) still set against `A5`),
7 ✅, 8 ✅ `XS`, 9 ✅ `P2` (`P1` trigger unchanged and not fired: no runtime dependency, no `bin`,
nothing published), 10 ✅.

## Amendment — 2026-10-17 (BA/PM, subtask `bapm-amend-ABC-056`, branch tip `10e7aab6`): `A3` check 5 ruled

**Why:** the Release Manager stopped at `A3` check 5 (`…/ticket-to-pr-ABC-056/notes/…abc056-a3-blocked-0d45639e`). Run as
written, the grep prints `from "node:fs"` (`src/book-file.ts:13`, `ABC-095` `09740ea4`, after the 2026-10-12 re-score). I re-ran
it at `10e7aab6` and got the same: 40 non-test `src/*.ts` files and 148 specifiers. Measurements and plants are in
`.grugops/context/bapm-amend-ABC-056/notes/`.

**Ruling 1: check 5 excludes `node:` built-ins.** The check measures what its own sentence says: *"the production import
graph loads no package"*. A `node:` specifier resolves only to a Node built-in and never to `node_modules`, so it is not a
package. The 2026-10-12 command matched that sentence only while no production file imported a built-in (`ADR-0036`
limb 1's baseline was 0 until `ABC-095`). The meaning is unchanged. A built-in written without the prefix (`"fs"`) still
prints, so the check fails closed. While re-stating the command I closed two blind spots in it. A side-effect
`import "pkg"` printed nothing before, and a non-literal `import(x)` cannot be seen by any specifier grep. **Check 5 is
now three commands**, each over `$(ls src/*.ts | grep -v '\.test\.ts$')`:

- **5a, no package specifier:** ``grep -hoE "(from|import *\(?) *['\"][^'\"]+['\"]" $(ls src/*.ts | grep -v '\.test\.ts$') | grep -vE "['\"](\./|node:)"`` → **empty**
- **5b, no loader the grep cannot see:** ``grep -nE "\brequire *\(|createRequire|import\( *[^'\" ]" $(ls src/*.ts | grep -v '\.test\.ts$')`` → **empty**
- **5c, the built-in set, recorded as read:** ``grep -hoE "(from|import *\(?) *['\"]node:[^'\"]+['\"]" $(ls src/*.ts | grep -v '\.test\.ts$') | grep -oE "node:[^'\"]+" | sort -u`` → the record states the set it read. 2026-10-17: **`node:fs`** (one specifier, `src/book-file.ts:13`).

At `10e7aab6`: 5a is empty, 5b is empty, 5c is `node:fs`. The widened regex returns the same 148 specifiers as the old one
(identical when sorted).

**Ruling 2: the reason in `AR-1`'s re-statement does not change. Its record and trigger gain the built-in set.** The
advisories sit in the npm dev tree, which `npm run chess` (`node src/cli.ts`) never loads. A built-in belongs to the Node
runtime, not to the tree `npm audit` reads, and an advisory against Node itself is a Node-version question that sits
outside `AR-1`. The record must still name the built-in set it read, and the trigger must fire when that set changes.
Some built-ins load code: `node:module` exposes `createRequire`, and `node:child_process` can start a package's binary.
So a new built-in is the one way a package could reach the runtime path while 5a and 5b stay empty. I did not list which
built-ins load code, because that list would need upkeep (coding rule 7). The trigger fires rarely, since one built-in
has appeared in the project's history. Any diff that adds a built-in already routes to Security/NFR under `ADR-0036`
clause (b) limb 1, which is the hop where `A4`'s `npm audit` comparison runs.

**Criteria amendments (2026-10-17):**
- **`A3`:** check 5 is 5a + 5b + 5c above, each with its command and output. The record carries the 5c set. Checks 1–4 are
  unchanged.
- **`A4`:** the trigger keeps the 2026-10-12 rule, which the Release Manager may adopt or replace. It **must also** fire
  when any `A3` check reads differently from the record: 5a or 5b non-empty, or a 5c set different from the recorded one
  (the RM's draft *"if any of the structural checks 1–5 changes its reading"* meets this once 5c is in the record). This
  clause is the minimum and is not the Release Manager's to drop.
- `A1`, `A2`, `A5` are unchanged. `XS` and `P2` are kept. The `P1` promotion trigger has not fired: `node:fs` is not a
  runtime dependency. Scope bullet 3's *"`ABC-042` … ends the zero-production-Node-builtin invariant"* is history:
  `ABC-095` ended it.

**DoR re-check: 10/10.** 1 ✅ (0 of 3 covered); 2 ✅; 3 ✅; 4 ✅ (check 5 now has three exact commands, and each output is
true at the tip); 5 ✅ (none); 6 ✅ (0 `src/` lines, 0 test files, clause (a) still set against `A5`); 7 ✅; 8 ✅ `XS`; 9 ✅ `P2`;
10 ✅ (the owner's 2026-10-12 word *"Re-state the accepted risk"* settled the only open question; this ruling is BA/PM's and
needs no owner word). **The Release Manager resumes at `A3`.**

## Delivery — 2026-10-17 (Release Manager, subtask `resume-ABC-056`, branch `grugops/ABC-056-restate-ar-1` from `6d24c5d1`)

**`AR-1` is re-stated** in decision note
`.grugops/context/ticket-to-pr-ABC-056/notes/20261017T102600Z-release-manager-decision-ar1-restated-718112dd.md`
(`refs: [AR-1, ABC-056]`, `supersedes` empty). That note holds the authoritative text, and this section only maps
it to the criteria. I re-ran every command at 10:25Z–10:26Z on 2026-10-17 and copied none of them. Nothing was
installed or fixed.

- **`A1` MET.** The new reason: *no package from the npm tree is loaded on the runtime path.* The tree is dev-only
  (checks 1–2), and `node src/cli.ts` imports only relative modules plus the recorded built-in set (check 5). This
  reason covers all three advisories using only their `dev: true` flag. No package-specific argument is involved.
- **`A2` MET.** `npm audit`, 2026-10-17T10:25Z, exit 1, found 3 (1 moderate, 2 high):
  `nanoid` high GHSA-2v37-7h3g-55p8; `postcss` moderate GHSA-fxqj-rqcc-2cmp; `source-map-js` high
  GHSA-68fv-2mgg-jv7q. These are the same (package, id) pairs as 2026-10-12. The note gives the installed version,
  vulnerable range and path of each, plus the `jq` line to diff against.
- **`A3` MET** (checks 5a/5b/5c as amended). 1 `npm audit --omit=dev` → `found 0 vulnerabilities`. 2 → `false`.
  3 → `true`, with no `bin`/`main`/`exports`/`files`. 4 `tsc --noEmit` exit 0, nothing written. 5a empty. 5b empty.
  5c `node:fs`, which is the recorded set (40 files, 148 specifiers).
- **`A4` MET.** Re-read `AR-1` when **(1)** any `npm audit` run returns a (package, advisory id) set different from
  the record, or **(2)** any check 1–5c reads differently from the record, including a 5c set other than `{node:fs}`.
  Clause (1) fires on a newly published advisory with the lockfile unchanged. Clause (2) is the minimum that BA/PM
  ruled.
- **`A5` MET.** `git diff --numstat main...HEAD -- package.json package-lock.json` is empty, and
  `git diff --numstat main...HEAD -- src/` is empty. Manifest md5s are unchanged (`076a03d7…`, `ed7a5b0c…`).
  `npm audit fix` was not run.

**Not done here:** the plain `npm audit fix` that npm offers for all three. Applying it would need a separate gated
ticket, if the owner ever wants one. No board move: the Orchestrator owns it.
