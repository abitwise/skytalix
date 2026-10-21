---
id: 20261021T092500Z-security-nfr-observation-d9d72d63
kind: observation
by: security-nfr
at: 2026-10-21T09:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - AR-095-CWD
  - AR-095-L1UNIT
  - AR-095-READ
  - ABC-163
  - ABC-168
  - G-1
  - G-2
  - G-3
  - V5.3.2
  - ADR-0036
  - NFR-008
  - grugops/ABC-180
  - acb52edf
  - d9c3cca3
  - ccccc6bb
  - grugops/qe-ABC-180
  - c0a7225f
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - 20261021T091812Z-qe-e2e-observation-9caa5ead
  - 20261021T091813Z-qe-e2e-observation-91bdbc2a
  - 20261021T091814Z-qe-e2e-observation-b571ef5f
  - 20261021T091815Z-qe-e2e-decision-f88e0845
  - 20261021T082900Z-security-nfr-decision-06c147db
  - 20261021T084500Z-orchestrator-decision-6d15cdc3
supersedes: 
seal: sha256:8544ec7deed8748c9eb9af5b6c4f89713f99d79f4425731cf878305dd1a414c0
---

# Security/NFR readings, `ABC-180` @ `acb52edf` (tip `d9c3cca3`, QE `c0a7225f`, base `ccccc6bb`)

My own readings. No timing was taken. No test lane was run. The plant matrix is QE's (`…91bdbc2a`) and is not re-run here.

## 1. Scope: test-only
- `git diff --name-only ccccc6bb d9c3cca3` lists `src/cli.real-engine.test.ts` and four SE notes under `.grugops/context/ticket-to-pr-ABC-180/`. Nothing else.
- The waiver form `git diff --name-only acb52edf~1 acb52edf | grep -v '\.test\.ts$' | grep '^src/'` is empty (exit 1).
- `c0a7225f` over `d9c3cca3` adds only QE's four notes and the ABC-180 page.
- `src/book-file.ts` is unchanged: still one import, one export, one read of a constant path resolved from the module URL. `V5.3.2` [L1] is met at the tip.
- `main` has moved since `ccccc6bb` (ABC-179 and others). None of those commits touch `src/cli.real-engine.test.ts`, `src/book-file.ts` or `data/`.
- **`ADR-0036` Ruling 2 does not fire.** No limb-1 holder is edited.

## 2. The decoy write: no new temp-file concern at L1
- **The diff.** In `A7`'s `beforeAll`, `neutral` is assigned from `mkdtempSync` first. Then `mkdirSync(dirname(join(neutral, BOOK_PATH)), { recursive: true })` runs, then `writeFileSync` of a fixed 35-byte ASCII string. All of it is inside `neutral`.
- **Cleanup.** `afterAll` calls `removeCopy(neutral)`, which is an exact-path `rmSync(…, { recursive: true, force: true })`. It is guarded by `neutral !== undefined`. Because `neutral` is assigned before the two new calls, a throw in either one still leaves the directory named for removal.
- **Scratch probe** (session scratchpad, private `TMPDIR`, removed afterwards). I replayed the same calls:
  - `neutral` is mode **0700**. The new `data/` is 0755 and the decoy is 0644 under umask 022. No other principal can reach either, because their parent is 0700.
  - The exact-path `rmSync` removed the whole tree.
  - A symlink planted inside `neutral` pointing outside was **not followed**: the target survived.
  - Nothing was left in `TMPDIR`.
- **Agrees with:** QE `A3` (0 lane-made entries after all 19 cells) and my `ABC-162` reading `…3ea2c883` § 2.
- **The written bytes** are a fixed literal: no path, no secret, no input. The `booked` child reads nothing from its cwd in the delivered build.
- **Logging is unchanged.** The detector reads the probe's one fixed warning, which carries no path or bytes.

## 3. `NFR-008` / `N8-LANE`
- QE's counts (`…9caa5ead` `A6`): 0 new test files, 0 new tests, 0 new spawns.
- `CLI_DEEP` 11 tests and 6 children, both equal to base. `npm test` 59/1987, equal to base.
- Nothing needed timing.

## 4. The validate-then-fallback family (G-1), read from QE's matrix and the code
- **P6g** reads the cwd file and uses it only if it parses as UTF-8 JSON. It skips the non-JSON decoy by design, so it is green at base and at head.
- **Every decoy shape has a validator one level deeper that skips it.** This is reasoning, not a measurement:
  - A JSON-but-not-a-book decoy (for example `{}`) would likely red P6g *as planted*, through `parseBook`'s `is not a format-1 book` warning. But a P6g that validates with `parseBook` itself skips that decoy. That is the natural way to write a "local override book". `UNKNOWN - verify`: not run.
  - QE's VD (a valid format-1 book whose only reply to 1. e4 is `b7b5`) kills that form at the `:523` membership check. But an override that validates further (an entry count, a size, a version field) skips VD in turn.
  - QE says the same thing (`…f88e0845` G-1).
- **What VD would cost**, if it replaced the delivered decoy:
  - It drops the one fixed stderr signal that `ABC-180` `A4` just labelled. That label is what the `AR-162-FALLBACK` close reads.
  - It drops the PD guard (the decoy does not parse).
  - It couples the kill to the delivered book's content: `b7b5` must stay absent from the book's replies at key `3c9a1e3dcc88de6c`. Regenerating the book with `b7b5` would silently remove the kill unless a new guard pins that absence.
  - It is a non-stderr discriminator. I ruled that shape gold-plating at L1 in `…06c147db` § 2.
- **What does cover the whole family, at any validation depth, including P6i (another path):**
  - **For an edit inside a holder:** `ADR-0036` § S1 Ruling 2 routes any edit to `src/book-file.ts` to `In Security/NFR`, and S3 item 2 reads the file by hand there. P6f, P6g and P6i are all edits to that file.
  - **For a new read anywhere else:** clause (b) limb 1 fires on any `+` line carrying its token, `from "node:`, in a production file (`ADR-0036`, the limb table and § S1). A new `node:fs` import is such a line. That covers an override placed elsewhere, such as a new entry point.
  - **Status of the automation:** Ruling 2 is applied by hand today (`AR-095-L1UNIT`). `ABC-163`, now in QE, folds it into `clause-b.mjs`.

## 5. G-2: the decoy-write order
- `spawnReal` uses `spawnSync`, so the child has exited before any later line runs.
- QE's TMO moves the write after the `booked` spawn. That keeps P6f green, because `A7`'s presence check runs after the child.
- **The likelihood is low:** the write's natural place is directly after `mkdtempSync`. But the test file is not a capability holder, so no routing control would see such a reorder.
- **A cheap mechanical pin exists**, and QE can measure it (TMO red at head):
  - capture `existsSync(join(neutral, BOOK_PATH))` on the line directly before the `booked` spawn;
  - assert that value in `A7`;
  - add a comment on the write saying it must precede the spawn.

  That is 0 spawns and 0 tests.
