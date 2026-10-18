---
id: 20261018T110713Z-ba-pm-decision-abc169-one-pin-element-abc168-four-abc172-none-abd27e75
kind: decision
by: ba-pm
task: bapm-ABC-169-rescope
at: 2026-10-18T11:07:13Z
verified_by:
confidence: high
refs:
  - ABC-169
  - ABC-168
  - ABC-172
  - ABC-042
  - ABC-122
  - ABC-041
  - ADR-0036
  - EPIC-007
  - src/cli.test.ts
  - package.json
  - plans/tickets/ABC-169-declare-the-engine-private.md
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md
  - .grugops/queue/done/ticket-to-pr-ABC-169.md
  - .grugops/context/amend-abc122-a4-pin/notes/20260925T213500Z-ba-pm-decision-widen-a11-by-one-pin-not-recut-a4-c960e385.md
supersedes:
---

# Ruling: `ABC-169` may add one element to `ABC-042` `A10`'s pin; `ABC-168` makes four; `ABC-172` makes none

This note is hand-authored and unsealed. This install has no `scripts/context-io.ts`, and no `propose_note` reached
this hop. `context.human_admission` is `off`. This follows the precedent of the `amend-abc122-a4-pin` note. It is a
BA/PM scope `decision`, not a verified finding. Readings are at `main` `692770d6`. No tests were run.

## The stop

`ABC-169` stopped at `4a0a075f`. A1–A5 held and A6 failed. `src/cli.test.ts:1759` (`ABC-042` `A10`) compares the
sorted `package.json` keys with `AT_HEAD` (`:1766-1775`, 8 keys). The `"license"` key that A1 requires makes 9 keys.
The page forbade any test edit.

## Ruling

1. **`ABC-169`:** add exactly `"license",` to `AT_HEAD`, and change nothing else in that test or that file. A5 now
   lists three files, with a 1/0 numstat on `src/cli.test.ts`. A6 allows that line and adds an armed reading: with
   the key taken out, `A10` is the only red row. The alternative was to drop `"license"` from A1. That is ruled out,
   because the key is the ticket's value and the owner's word ("keep private").
2. **`ADR-0036` (c) does not fire.** It fires only on a capability that a test file in the diff introduces (network,
   a filesystem write outside a temp dir, or a new spawn). One string literal adds none. Read-only `node:fs` is named
   precedent. No other test-integrity rule fires: the skip count stays `0`, and `.grugops/test-skips.md` and the
   QE-hop check are untouched. The pin is not weakened, because only its expected list grows, by the key the ticket
   adds. This is the `ABC-122` shape: a BA/PM ruling moves `A10` by the one value that the ticket's own manifest
   change requires.
3. **UAT stays "expected WAIVED, by A3".** The waiver grep drops `*.test.ts`, so it still names only
   `src/evaluate.ts`.
4. **`ABC-168` (fixed before its build):** Scope 6 makes four literal edits in `A10`. It adds `"bin"` to `AT_HEAD`,
   takes `"bin"` out of the reserved list, sets `build` to `tsc -p tsconfig.build.json`, and adds
   `uci: "node src/uci.ts"` to `SCRIPTS_AT_HEAD`, so `added` stays `["chess"]`. That is a 4/2 numstat. `A11` no longer
   says "unedited", and `A12` lists `src/cli.test.ts`. The `AGENTS.md` pins that Scope 5 must keep green are listed in
   its test note 5 (`ABC-042` `A1`, `ABC-065`/`ABC-071`, `ABC-059`, `ABC-109`).
5. **`ABC-172`:** no edit. `A10` pins keys, not the `name` value. `git grep cli-chess -- '*.test.ts' ':!.grugops'`
   is empty.

## The pins on `package.json`, all tracked tests (`grep package.json` over `*.test.ts`, without `.grugops`)

- `src/cli.test.ts:1759` `ABC-042` `A10`: keys, script values, reserved keys, `private`, and the added scripts. It
  goes red on 169 (`license`) and on 168 (`bin`, `build`, `uci`).
- `src/cli.test.ts:1111` `ABC-042` `A1`: `scripts.chess`, and `AGENTS.md`'s Dev / run line.
- `src/cli.test.ts:2386` `ABC-059` `A1-A4`: exactly one script runs `src/cli.ts`, and the Dev / run spans.
- `src/line-input.test.ts:674`: there is no `dependencies` key.
- `src/cli.real-engine.test.ts:84`: a byte copy into a temp tree, compared with the file itself.

## Note for the merge order

`ABC-169` and `ABC-168` both edit `AT_HEAD`. Whichever merges later rebases and keeps both elements.
