---
id: 20260814T181300Z-security-nfr-observation-bcaaa460
kind: observation
by: security-nfr
at: 2026-08-14T18:13:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A10
  - A12
  - RF-2
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# The DELETE audit — two clause groups removed, and what each one was carrying

Deletion is the remedy `RF-2` and `ABC-041` both endorsed, so the burden is on me to show nothing
security-bearing left with the words. Three deletions, audited one property at a time.

## Deletion 1 — bar 2's `assembleFrame` sanitizer disjunct

**Verified removed as an operative clause.** `grep` over the repaired page: `assembleFrame` and
`sanitize` now appear only at `:258-259`, inside the parenthetical that RECORDS the deletion. No
criterion and no bar routes anything through the sanitizer.

**Property carried?** There was none to carry. The disjunct was unreachable in every legal build
(`sanitize` is module-private at `src/frame.ts:123`; its only public route composes a whole frame,
which `A5`/`A6` forbid on exactly these paths) and it was the **weaker** of the two disjuncts —
`ABC-019`'s `R-A` records that C1/CSI survives `sanitize` in `unicode` mode. **Deleting it removed a
false route, not a control.** The surviving byte-level property is strictly stronger than the one
that stood before the repair: it is now scoped to the echoed token, ordered non-vacuity-first, and
captured over both channels.

## Deletion 2 — `A10`'s file-list and `src/`-byte-identity halves, re-homed into `A12`

The question that matters: **can anything under `src/` now change unreviewed?** Measured — 47 merged
`.ts` files, **18 production, 29 test**:

| merged file set | count | what fences it after the delete |
|---|---|---|
| production modules | **18** | `A12`: *"All 18 merged PRODUCTION modules under `src/` are byte-identical"* — explicit, and the number matches the tree |
| merged test files, other than the licence guard | **28** | `A12`'s file list: *"shows exactly: … and nothing else"* — an edit to any of them is not on the list, so `A12` fails |
| `src/history-pane.nfr.test.ts` | **1** | permitted, and **bounded**: `LICENSED_DRIVERS` *"gains exactly one element … plus its citation line, and nothing else in that file"* |

**46 of 47 merged files are frozen; the 47th is bounded to two lines.** Under the deleted `A10` all
47 were frozen — and that clause protected nothing, because it was **unsatisfiable**: `A10`'s own
*"Suite green, skip 0"* cannot be met without the licence edit it forbade. A fence that cannot be
satisfied is not a fence; the engineer must break one half, and the half that gives way is the
byte-identity one. **`A12` is a real fence where `A10`'s was a dead one.**

Every property in the deleted text is accounted for: the file list → `A12` (with the one merged file
named); *"Suite green, skip 0"* → `A12`, deliberately kept beside the licence bound so the dependency
is visible; `package.json` key-by-key → stays in `A10`. The only wording change is
`git diff --numstat` → `--name-only`; the old clause used the counts for nothing and `A12`'s
"+1 element plus its citation line" is a **content** bound, which is tighter than any line count.

## Does `A12` still bound the licence-guard edit Architect/Design found is required? YES — verified at source

- `LICENSED_DRIVERS` is at **`src/history-pane.nfr.test.ts:213`** — the ticket's citation is exact:
  `const LICENSED_DRIVERS: readonly string[] = ["turn-loop.ts"];`
- The guard is an **equality**, `:329`:
  `expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)))`,
  where `runtimeImporters` is every production module whose source matches
  `/^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m` (`:317-321`).
- So a new **flat** production entry point importing `newGame` from `./history.ts` **enters the left
  side and reds the equality until it is licensed** — the anticipated red is real, and `A12`'s bound
  is the right size for it: **+1 element, +1 citation line, nothing else in that file.**

**The bound is doing security work, not tidiness work.** *"Nothing else in that file"* is what stops
the cheaper green: weakening `toEqual` to a subset check, or editing the regex, would clear the red
and silently retire the whole-tree single-supplier invariant. `A12` forecloses that in one clause.

**`A3` is load-bearing and correctly reasoned — verified both counts.** `productionModulesIn`
(`:163-164`) is a **flat** `readdirSync` with no recursion, and the regex requires the exact
specifier `"./history.ts"`. A build at `src/cli/main.ts` is therefore invisible **twice over**: not
enumerated, and its import would read `"../history.ts"`. It goes GREEN while the correct flat build
goes RED. `A3` is the only thing standing between an engineer chasing green and that placement.

## One thing the delete DID move, named rather than left silent

The review obligation (`:270-275`) now exempts `src/history-pane.nfr.test.ts` from the
"touches any file under `src/`" trigger. **Not a loss, and I am not raising it:** `A12` bounds that
file mechanically to two lines, and the security half of this ticket is declared **fired
unconditionally** three lines above the obligation — the added lines get read because the trigger
fired, not because of this clause (`…observation-1e82c74b`). Recorded so no later hop reads the
exemption as a widening.
