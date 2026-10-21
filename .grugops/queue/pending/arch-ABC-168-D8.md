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
