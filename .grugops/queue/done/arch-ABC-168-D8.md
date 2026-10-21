---
subtask: arch-ABC-168-D8
role: architect-design
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/arch-ABC-168-D8/
width: 3 (beside ticket-to-pr-ABC-172 and qe-ABC-187)
---

# Architect: ABC-168 stopped on `ADR-0044` D8 — the build emits `turn-loop.js` (and three more) that `A7` forbids

The SE stopped `ticket-to-pr-ABC-168` before committing code (decision `…98aa0957`, readings `…319de31a`, WIP `…397aa27c`, all on `grugops/ABC-168` @ `2f02d158`; read with `git show`). The WIP is kept as `.grugops/context/ticket-to-pr-ABC-168/wip-ABC-168-uci-entry-point.patch` on that branch.

- **The block:** `src/engine.ts:97` has `import type { EngineSeam } from "./turn-loop.ts"` (since ABC-078). tsc puts a type-only import into the program and emits every file in it, so with D8's `files: ["src/uci.ts"]`, `dist/` also holds `turn-loop.js`, `history.js`, `frame.js`, `render.js` — nothing loads them at run time. `A7` says `dist/` holds no `turn-loop.js`.
- **A second D8 gap:** D8 gives `files` but no `include`; `extends` inherits the base `include`, so D8 as written makes `npm run build` exit 1 (TS5055/TS6059) and emits test files. The WIP adds `"include": []`.

## Decide (in `ADR-0044`, as a dated addendum)
1. Which fix: (a) `A7` is read on the runtime closure from `dist/uci.js` (type-only emits allowed, and say how QE measures "loaded at run time"); (b) move `EngineSeam` out of `turn-loop.ts` into a types-only module (a core edit beyond D2's one engine edit — say whether it is allowed and where); (c) a different build shape (D8 revised), e.g. `emitDeclarationOnly`-free alternatives, `isolatedModules` + per-file build, or a post-build prune. Weigh what each costs the core-unchanged promise (`ADR-0044` title), ADR-0011 clause 4, and the UAT readings.
2. Fold the `"include": []` gap into D8.
3. Say exactly what `ABC-168`'s page must change (A7's wording, Scope 2, Out of scope) so BA/PM can amend it, and whether DoR stays 10/10.
4. Whether `ABC-172` (in development now: package rename) is affected.

## Fences
- Records only: `ADR-0044` (dated addendum; do not rewrite accepted text), notes. No `src/`, `tsconfig*`, `package.json`, ticket page or board edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `arch-ABC-168-D8`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`. Include a `kind: decision`.
- Write `.grugops/queue/done/arch-ABC-168-D8.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 (Architect) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result (architect-design, 2026-10-21T13:59:09Z): **ruling (a). `dist/` may hold type-only emits, and `A7`/M9 fence what `dist/uci.js` loads. D8 gains `"include": []`. `ABC-172` is not affected**

**Records.**
- `ADR-0044` gets a dated addendum: § Addendum — 2026-10-21, D8's emit set and its `include`, plus a pointer blockquote in
  Status. No accepted text was rewritten. Uncommitted on `main`.
- **Notes** in `.grugops/context/arch-ABC-168-D8/notes/` were sealed by `context-io.js` `admitAndAppend` (grugops
  2.1.0 plugin cache), with the context root passed explicitly as the main checkout. All three read back through
  `readContext`:
  - `…5a20f1f5` (`observation`): the readings;
  - `…ce80739a` (`decision`): the ruling;
  - `…618fccad` (`decision`): the page and M9 changes for BA/PM.

### 1. The fix: (a)
- **Measured**, in a scratch extract of `main` `41f5b366` with the WIP patch (tsc 5.9.3, Node v26.11.1). These are
  hand readings, not gates.
  - The build emits 22 files. The runtime closure from `dist/uci.js` is 18, and `turn-loop.js`, `history.js`,
    `frame.js` and `render.js` are not in it.
  - A copy of `dist/` with those four deleted runs the away-from-clone dialogue at exit 0. A copy with `search.js`
    deleted fails with `ERR_MODULE_NOT_FOUND`, which is the control.
  - There is no dynamic `import(`, and the four carry no capability.
- **How `A7`/M9 measure "not loaded":**
  - `rm -f` the four in the away-from-clone copy before the dialogue, which still passes;
  - `grep -l 'import(' dist/*.js` prints nothing;
  - there is still no `*.test.js`, `cli.js` or `line-input.js`.
- **(b) is rejected.**
  - `EngineSeam` takes a `GameHistory`, so `history.js` is still emitted.
  - It edits `turn-loop.ts` (D2's no-edit list, `A11`) and `engine.ts` a second time after `ABC-170`.
  - It adds a clause-1 module, and the next type-only import re-breaks a presence check.
- **(c) is rejected.**
  - `noResolve` was measured at exit 2.
  - A post-build prune is a rotting list. It changes Scope 6 edit 3's pinned `build` value, and it is gold plate for
    43 KB of inert, git-ignored JavaScript.
  - A per-file transpile is new build tooling.
- **Cost of (a):**
  - no `src/` change, so core-unchanged holds;
  - `ADR-0011` clause 4 holds, and clauses 1 and 3 are over `src/`;
  - `ADR-0036` (b1) and the UAT readings are unchanged;
  - revisit at any `npm publish` or packaging of `dist/`.

### 2. `"include": []` is folded into D8
Without it, the base `include` is inherited, and the build exits 1 (TS5055/TS6059) and emits test files. The WIP already
has it.

### 3. The `ABC-168` page (BA/PM to amend; text in `…618fccad`)
- **Scope 2:** add "with `\"include\": []` (`ADR-0044` § Addendum 2026-10-21)".
- **`A7` bullet 2:** "no `*.test.js`, `cli.js` or `line-input.js`; `turn-loop.js`, `history.js`, `frame.js`,
  `render.js` may be present as type-only emits and are not loaded; `grep -l 'import(' dist/*.js` prints nothing".
- **`A7` away-from-clone bullet:** add the `rm -f` of the four before the dialogue. The expected output is unchanged.
- **Out of scope:** add "moving `EngineSeam` out of `src/turn-loop.ts`, and any prune of `dist/`".
- **Test note 4:** QE's fresh-clone `A7` includes the `rm -f` run and the `import(` grep.
- **`EPIC-007` M9:** the same rewording as `A7` bullet 2.
- `A12`, Scope 6, size S and P1 are unchanged. **DoR stays 10 of 10.**

### 4. `ABC-172`: not affected
Its diff is `package.json` `name` and the lock. It has no build, `tsconfig*` or `bin` change. The existing shared
`package.json` rebase note stands.

### Owner
M9 is part of the owner-accepted `EPIC-007`. Its wording moves from "`dist/` holds no `turn-loop.js`" to "`dist/uci.js`
loads none". The owner confirms before QE/UAT reads `A7`. This does not gate the SE's restart. If he declines, the
fallback is (b), which needs an ADR amendment.

### Next
1. BA/PM amends the `ABC-168` page and M9, records only.
2. The Orchestrator asks the owner about M9.
3. `ABC-168` goes back to In Development, and the SE resumes from the WIP patch as it stands.

### Trace row (for the Orchestrator to append; this hop did not edit `plans/traceability.md`)
| ABC-168 (Architect) | ruled (a) on D8 vs A7: dist/ may hold type-only emits (turn-loop/history/frame/render.js), fence is what dist/uci.js loads; D8 gains "include": []; (b), (c) rejected | EPIC-007 | — | ADR-0044 D8 addendum 2026-10-21; ADR-0011 cl. 1/3/4; ADR-0036 (b1); notes …5a20f1f5, …ce80739a, …618fccad | main (uncommitted)<br>memory-bank/50-decisions/ADR-0044-*.md, .grugops/context/arch-ABC-168-D8/ | scratch build of main 41f5b366 + WIP: exit 0, 22 emitted / 18 loaded; four deleted → dialogue exit 0; control (search.js deleted) ERR_MODULE_NOT_FOUND; noResolve exit 2 (not gates) | — | — | Blocked (ruling given; BA/PM amends A7/Scope 2/Out of scope/M9; owner confirms M9 wording) |
