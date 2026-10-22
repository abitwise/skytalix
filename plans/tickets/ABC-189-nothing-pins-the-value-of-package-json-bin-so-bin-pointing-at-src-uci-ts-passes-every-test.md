---
id: ABC-189
title: "Nothing pins the value of `package.json` `bin`, so `bin` pointing at `src/uci.ts` passes every test (`AR-168-BINPIN`)"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-007
feature: —
---

# ABC-189: one value assertion for `bin` in `ABC-042` `A10` (`src/cli.test.ts`). Test-only, 0 production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-ABC-168-followups`, at `main` `96dc3fa3`). Sources:
> - QE's `QE-168-b`: `grugops/qe-ABC-168` @ `7e831392`, `.grugops/context/qe-ABC-168/notes/…observation-b1a6b8ef`
>   (mutant `(iv-b)`) and `…observation-1c648c1a`. These notes are on the QE branch, not yet on `main`.
> - Security/NFR's `…decision-75a45be0` § 5, which accepts it as `AR-168-BINPIN` (LOW, owner the Orchestrator).
> - The owner record `…orchestrator-decision-e37f4a1a`.
>
> The pin was measured red and green on a scratch export of `6d27dc9e`. The readings are in
> `.grugops/context/bapm-cut-ABC-168-followups/notes/`.

## Problem

*User:*
- the owner's web backend, which will launch `skytalix` (`ADR-0044` D8);
- anyone who packages `dist/`;
- the next hop that edits `bin`.

*Pain:*
- **`ABC-168` adds `"bin": { "skytalix": "dist/uci.js" }`.** Its `A10` row then lists `bin` as an allowed key, but
  never checks its value.
- **QE's mutant `(iv-b)`, `bin` → `src/uci.ts`, survives everything but review:**
  - `src/cli.test.ts` runs 88 of 88 green;
  - `A7`'s `npm link` run answers `uciok`, because the link resolves outside `node_modules`, where type stripping
    still works.
- **It fails only in the case that matters most.** Installed under `node_modules` (D8's premise), Node does not
  strip types, so the backend's install breaks. Nothing goes red before that.

*Value:* a wrong `bin` goes red in `npm test`, at the commit that makes it.

## Scope

- **One assertion, in one row.** It goes in `src/cli.test.ts`, inside the `ABC-042` row
  `it("A10 — package.json gains exactly one scripts key and nothing else", …)`. Place it beside
  `expect(packaged.private).toBe(true);`. The shape, as measured at cut:

  ```ts
  expect(packaged.bin, "package.json bin (AR-168-BINPIN)").toEqual({ skytalix: "dist/uci.js" });
  ```

  The wording of the message is the Software Engineer's. It must contain `AR-168-BINPIN`.
- **At most one comment line**, if the SE wants one.

## Out of scope

- `package.json`, `package-lock.json`, and any other row or file.
- **`A10`'s title and its key list.** `ABC-168` already re-pinned those.
- **QE-168-c's optional `A1`/`A2` rows** in the `UCI_DEEP` lane. Security/NFR ruled them not owed (`…75a45be0` § 6).
- **Proving the installed case** (a real `npm install` of `skytalix` under `node_modules`). That belongs to a
  packaging ticket, if one is ever cut.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time. It must hold `ABC-168`'s merge (see Dependencies). "Head" is the branch merged with
the latest `main`.

- **`A1` (the pin, and only the pin).**
  - `grep -c 'AR-168-BINPIN' src/cli.test.ts` prints **1** at head and **0** at base.
  - `grep -c 'skytalix: "dist/uci.js"' src/cli.test.ts` prints **1** at head and **0** at base.
- **`A2` (red on QE's mutants, green on the real file).**
  - **Given** a scratch export of head (`git archive <sha> | tar -x -C <scratch>`, with `node_modules` symlinked);
  - **when** `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "A10 — package.json"` runs;
  - **then**:
    - with the real `package.json`, it gives `1 passed`;
    - with `(iv-b)` (`"skytalix": "dist/uci.js"` → `"skytalix": "src/uci.ts"`), it gives `1 failed`, with
      `AR-168-BINPIN` and `expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }`;
    - with `(iv-a)` (→ `"dist/cli.js"`), it gives `1 failed`.
  - The same `(iv-b)` export **at base** gives `1 passed`. That is the gap this ticket closes.
  - *(All four were measured at cut on `6d27dc9e` with the line above added, `cli.test.ts` 88 tests, 1 selected.)*
- **`A3` (no test added or lost).**
  - `npm test` exits 0 with the same file and test counts as base;
  - `.test-results/last-run.json` reads `success: true`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.`
- **`A4` (fence).**
  - `git diff --name-only main...HEAD`, ignoring `.grugops/` and the hop's own records in `plans/`, lists only
    `src/cli.test.ts`.
  - `git diff -U0` on it adds 1 or 2 lines and removes 0.
  - The UAT waiver form in `AGENTS.md`
    (`git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing.

## Dependencies

- **Waits: `ABC-168` merged.** The pin pins `ABC-168`'s key. On `main` today, `A10` forbids `bin`, so the pin
  would be red at base.
- **Owed before any ticket merges that** packages `dist/` for anyone else, makes a backend take `skytalix` as a
  dependency (D8 revisit, `ADR-0018`), or edits `bin`. That is `AR-168-BINPIN`'s trigger (`…75a45be0` § 5). Such a
  ticket may carry this line itself instead.
- **No overlap** with `ABC-190` (`package-lock.json`). Either can go first.

## Security / NFR triggers

- **Security:** this closes `AR-168-BINPIN` (LOW, owner the Orchestrator) when it lands and QE reads it red on
  `(iv-b)` (`A2`). It is a test-only change and fires no clause.
- **`NFR-008`:** not triggered. 0 files, 0 tests and 0 spawns are added, and the counts equal base (`A3`).

## Test notes

1. **Watch it go red before you trust it.** Run `A2`'s `(iv-b)` export first, never by editing the real
   `package.json` in the worktree.
2. If `A10`'s body has moved by pull time, anchor the line next to `expect(packaged.private).toBe(true);` wherever
   that line now is.
3. **Gates:** lint (autofix on), typecheck, build, `npm test`, skip count 0. A QE hop is owed: QE reads `A2` itself.
   The UAT waiver is expected (0 production lines).

## Size and priority

**`XS`:** one line in one test row. The red/green shape was measured at cut.

**`P3`:** the risk is LOW, and nothing on the board packages `dist/` or edits `bin`. **Raise it to `P2` when a
ticket that meets the trigger is pulled.** It is due before that ticket merges.

## Definition of Ready

BA/PM, 2026-10-21 at `96dc3fa3`. **Result: 10 of 10.** It sits in **Backlog** because of a named wait: `ABC-168`
merged.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `(iv-b)` survives 88/88 and `npm link`; it breaks the `node_modules` install D8 relies on |
| 2 | scope and out-of-scope clear | **✅** one assertion in one named row; the lock, the `A10` title and keys, QE-168-c's rows and the install proof are fenced |
| 3 | INVEST-shaped | **✅** independent of `ABC-190`; valuable alone; `XS`; testable red/green |
| 4 | acceptance testable and measurable | **✅** grep 0 → 1; `(iv-b)` and `(iv-a)` red, real file green, base `(iv-b)` green (measured); counts equal; 1–2 lines added, 0 removed |
| 5 | dependencies known | **✅** waits `ABC-168` merged; owed before a packaging, backend-dependency or `bin` ticket merges |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-168-BINPIN` on QE's red read; `NFR-008` 0/0/0 |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** none. The wait is sequencing, not a blocker |

BA/PM moves it **Backlog → Ready** when `ABC-168` merges. The Orchestrator may do so on that merge without another
BA/PM hop, because the DoR stands.
