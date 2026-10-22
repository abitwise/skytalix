---
id: ABC-190
title: "The lock root lacks the `license` and `bin` that `package.json` carries, so the next `npm install` drops 4 lines into someone else's diff (QE-172-a + `ABC-168`'s `bin`)"
status: in-development
column: In Development
size: XS
priority: P3
epic: EPIC-007
feature: —
---

# ABC-190: regenerate `package-lock.json` once, after `ABC-168` merges. 4 root-metadata lines are added, and nothing moves

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-ABC-168-followups`, at `main` `96dc3fa3`). Sources:
> - Security/NFR on `ABC-172`, `.grugops/context/security-nfr-ABC-172/notes/…decision-216ceb43` Ruling 2. It
>   accepts QE-172-a as LOW, and gives the chore's acceptance.
> - Security/NFR on `ABC-168`, `…decision-75a45be0` § 3, which confirms the lock root lacks `bin` and `license`.
> - The owner record `…orchestrator-decision-e37f4a1a`.
>
> The regeneration was measured on a scratch copy of `6d27dc9e`. The readings are in
> `.grugops/context/bapm-cut-ABC-168-followups/notes/`.

## Problem

*User:*
- any contributor who next runs `npm install`;
- the Security/NFR clause (a) reader of that contributor's diff.

*Pain:*
- **The lock root `packages[""]` has no `"license": "UNLICENSED"`.** This is drift left by `ABC-169` (`b3fecb1b`):
  QE-172-a.
- **After `ABC-168`, it also has no `bin` block.** `ABC-168`'s `A12` keeps the lock unchanged on purpose.
- **So the next `npm install` writes these 4 lines into whatever unrelated change runs it.** That drops unrelated
  lockfile churn into that ticket's clause (a) read.

*Value:* one commit lands the 4 lines on their own. Security/NFR reads them once, as root metadata only, and later
diffs stay clean.

## Scope

- **Run `npm install --package-lock-only --ignore-scripts`** at `main`, after `ABC-168` merges.
- **Commit `package-lock.json`, and only that file.** It is regenerated, never hand-edited.

## Out of scope

- `package.json` and any dependency, version or range change.
- **`npm audit fix`, and the AR-1 re-statement** (the `vite` advisories). The AR-1 re-statement belongs to the
  Release Manager (`…216ceb43` Ruling 3).
- Anything in `src/`.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time, which holds `ABC-168`'s merge. "Head" is the branch merged with the latest `main`.

- **`A1` (exactly the 4 lines).**
  - **Given** head;
  - **when** `git diff --numstat main...HEAD -- package-lock.json` runs;
  - **then** it prints `4	0	package-lock.json`.
  - The 4 added lines sit under `packages[""]`: `"license": "UNLICENSED",` and the 3-line
    `"bin": { "skytalix": "dist/uci.js" },` block.
  - *(Measured at cut: on a scratch copy of `6d27dc9e`'s `package.json` and lock, npm 11.20.0 printed `4 0`, and the
    lines were exactly those.)*
  - **If `ABC-168` is dropped instead of merged,** the chore lands with the `license` line alone: `1	0`
    (`…216ceb43`).
- **`A2` (nothing that resolves moves).**
  - `git diff -U0 main...HEAD -- package-lock.json | grep -cE '^[-+].*"(version|resolved|integrity)"'` prints **0**.
  - `git diff --name-only main...HEAD`, ignoring `.grugops/` and the hop's own records in `plans/`, lists only
    `package-lock.json`.
- **`A3` (it installs and it is stable).**
  - In a fresh clone of head, `npm ci --ignore-scripts` exits **0** and leaves `git status --porcelain` empty.
  - Re-running `npm install --package-lock-only --ignore-scripts` there adds no further diff.
- **`A4` (no lane moves).**
  - `npm test` exits 0 with the same file and test counts as base, and skips are 0.
  - lint, typecheck and build exit 0.
  - The UAT waiver form in `AGENTS.md` prints nothing (0 `src/` lines).

## Dependencies

- **Waits: `ABC-168` merged.** One regeneration then closes QE-172-a and `ABC-168`'s `bin` drift together.
  Regenerating earlier would mean a second regeneration later, or would edit the lock under `ABC-168`'s `A12` fence.
- **No overlap** with `ABC-189` (`src/cli.test.ts`). Either can go first.

## Security / NFR triggers

- **Security, clause (a) fires** (a `package-lock.json` edit). A short Security/NFR clause (a) hop is owed.
  `…216ceb43` expects no finding: root metadata only, with no resolution, integrity or install effect. It closes
  QE-172-a (LOW, owner the Orchestrator) when it merges.
- **`NFR-008`:** not triggered. 0 tests and 0 spawns are added.

## Test notes

1. **Use the npm that ships with the repository's Node** (11.20.0 at cut). If the regeneration adds or removes any
   line other than the 4, **stop and hand back**, for example when a different npm rewrites the lock format. Do not
   hand-trim the diff.
2. **Run `A3` in a fresh clone,** never in the main checkout's `node_modules`.
3. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed (QE reads `A1`–`A3`), then the
   clause (a) hop. The UAT waiver is expected.

## Size and priority

**`XS`:** one command and one file, with the diff known to the line.

**`P3`:** metadata drift with no install effect. It is LOW, and Security/NFR set XS/P3.

## Definition of Ready

BA/PM, 2026-10-21 at `96dc3fa3`. **Result: 10 of 10.** It sits in **Backlog** because of a named wait: `ABC-168`
merged.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the root lacks `license` (QE-172-a) and, after `ABC-168`, `bin`; the next `npm install` adds them to an unrelated diff |
| 2 | scope and out-of-scope clear | **✅** one command, one file; `package.json`, audit fixes, AR-1 and `src/` fenced |
| 3 | INVEST-shaped | **✅** independent of `ABC-189`; valuable alone; `XS`; testable to the line |
| 4 | acceptance testable and measurable | **✅** numstat `4 0` (measured); 0 `version`/`resolved`/`integrity` lines; `npm ci` rc 0 with a clean status; idempotent; counts equal |
| 5 | dependencies known | **✅** waits `ABC-168` merged; the `ABC-168`-dropped fallback is `1 0` |
| 6 | security/NFR triggers with a measurable target | **✅** clause (a) hop, expected no finding; closes QE-172-a; `NFR-008` not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. The wait is sequencing |

BA/PM moves it **Backlog → Ready** when `ABC-168` merges. The Orchestrator may do so on that merge without another
BA/PM hop, because the DoR stands.
