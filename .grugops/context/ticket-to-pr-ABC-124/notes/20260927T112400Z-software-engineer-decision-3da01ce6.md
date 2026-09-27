---
id: 20260927T112400Z-software-engineer-decision-3da01ce6
kind: decision
by: software-engineer
at: 2026-09-27T11:24:00Z
verified_by:
confidence: high
refs:
  - ABC-124
  - ABC-123
  - ticket-to-pr-ABC-124
  - wave-2026-09-25
  - biome.json
  - tools/grugops/uat-spec-integrity.js
  - plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md
  - .grugops/context/ticket-lint-tools/notes/20260927T111632Z-ba-pm-decision-abc124-cut-dor-10of10-lint-tools-d747a73a.md
  - .grugops/context/wave-2026-09-25/notes/20260927T001000Z-orchestrator-decision-8c8aa8a9.md
  - .grugops/context/wave-2026-09-25/notes/20260927T110855Z-orchestrator-decision-e8061413.md
supersedes:
---

# ABC-124 build decisions: one `includes` glob, one scoped `overrides` entry, Biome's safe autofix only

This note was written by hand and is unsealed. The posture is the same one earlier hops recorded:
there is no `scripts/context-io.ts` on this install, and `human_admission` is `off`. Branch
`grugops/ABC-124-lint-tools`, cut from `ddcebc5`.

## D1: `"tools/**/*.js"` goes in `files.includes`, right after `vitest.config.ts`

- The four existing positive globs and the seven `!` excludes are unchanged. The new glob is a
  sibling of the other positive globs.
- The glob is `tools/**/*.js`, not `tools/grugops/*.js`. The ticket's own scope item 1 names
  `tools/**/*.js`, and a future `tools/` sub-directory then gets covered without another config
  edit.

## D2: one `overrides` entry, and it only switches two things off

- `includes: ["tools/**/*.js"]`, `formatter.enabled: false`, and
  `assist.actions.source.organizeImports: "off"`.
- The entry has no `linter` key, so the top-level `recommended` preset reaches `tools/` unchanged.
- It has no top-level `formatter` or `assist` edit, so `src/**/*.ts` and `spike/**/*.ts` keep what
  was committed. `biome format .` checked 85 files before and after.

## D3: the three findings are fixed by `biome check --write` on the one file, with no `--unsafe`

- `npx biome check --write tools/grugops/uat-spec-integrity.js` reported `Fixed 1 file`. The diff is
  +1/−3:
  - Line 603: `Object.prototype.hasOwnProperty.call(...)` became `Object.hasOwn(...)`. The
    `engines` field says `node >=22`, and `Object.hasOwn` has existed since Node 16.9.
  - Two `continue;` statements that were the last statement of their loop body were deleted: one in
    the `frameworkSurface` outer `catch`, one in `resolveBinding`.
- Nothing was edited by hand.

## D4: where the A2 violation was planted

The plant was one line appended to `tools/grugops/lane-inventory.js`:
`export const __plantA2 = Object.prototype.hasOwnProperty.call({}, "x");`. That file has no findings
of its own and is not on `npm test`'s path. The plant was reverted with `git checkout --` right
after the GREEN reading, and it was never staged.

## D5: how A7 is invoked (re-derived, not assumed)

- `package.json`, `AGENTS.md` and every `.js`/`.ts`/`.json`/`.md` file outside the context notes and
  this ticket page were searched. None of them invokes `uat-spec-integrity.js`.
- The only documented invocation is the file's own D-12 contract header:
  `node <repo-local-path>/uat-spec-integrity.js <repo-root> [--json] [--check-browser]`.
- A7 therefore ran it that way over 9 argument sets, and also imported the two exported functions
  the autofix touched. The readings are in observation `18bca91a`.
