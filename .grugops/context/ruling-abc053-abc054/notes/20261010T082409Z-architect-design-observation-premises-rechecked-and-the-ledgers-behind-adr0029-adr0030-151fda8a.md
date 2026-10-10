---
id: 20261010T082409Z-architect-design-observation-premises-rechecked-and-the-ledgers-behind-adr0029-adr0030-151fda8a
kind: observation
by: architect-design
at: 2026-10-10T08:24:09Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-054
  - ADR-0029
  - ADR-0030
  - ADR-0011
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - src/render-seam.ts
  - tsconfig.json
supersedes:
---

# Premises re-checked on `46b6a0f`, and the measurements both ADRs rest on

This note is hand-authored. No stamp exists on this install (`AGENTS.md`). **Every row was RUN** on an out-of-tree
replica: `git archive` of `46b6a0f` into the private scratchpad, `node_modules` symlinked, Node v26.11.0, real
vitest. **No repository worktree file was written by any measurement**, and `git status` on the hop's worktree
was clean after them.

## M1–M3: what the three import forms do on this toolchain (`ABC-054`'s premise)

`tsconfig.json` has `verbatimModuleSyntax: true` (since `5165f97`, 2026-07-22). The probe module's body sets a
flag or prints when it runs.

| form | `node file.ts` | vitest | tsc | biome |
|---|---|---|---|---|
| `import type { X }` | not evaluated | not evaluated (control) | 0 | clean |
| `import { type X, type Y }` | **EVALUATED** | **EVALUATED** | 0 | `useImportType` warning, **exit 0** |
| `import { f }` | evaluated | evaluated | 0 | clean |

An unused value import (`import { f }`, `f` never used) gives a `noUnusedImports` **warning, exit 0**. Neither
lint rule is a containment, because `quality.lint.strict` is false.

**Consequence:** `ABC-054`'s "false RED" on the licence guard is a TRUE red. Its "false GREEN" on `A8` is real,
but `A8` is not misreading an import. It is measuring evaluation where the claim is consumption.

## M4: `X3b` rebuilt (`ABC-054` `A2`)

`renderBoard` was copied into `src/board-two.ts` as `renderBoardTwo`, and the seam keeps
`import { type GlyphMode, type Orientation } from "./render.ts"`. Results: `tsc` **exit 0**; `src/render-seam.test.ts`
**1 failed / 10 passed**, and the only failure is `A11` (`renderBoard` called 0 times). **`A8` is green.**

A reference consumer rule (value-binding specifier present; re-exports excluded) gives:

- BASE: `render.ts` / `status-panel.ts` / `history-pane.ts` → `["render-seam.ts"]` each;
- `X3b`: `render.ts` → **`[]`**;
- `history.ts`: `["cli.ts","turn-loop.ts"]` under both rules on BASE.

## M5: `X5b` and the frame-path ledger (`ABC-053`)

`X5b` (`void import("./history.ts").then((m) => m.gameStatusOf(history))` in the returned closure) is **22/22
green** on today's two guard files. That reproduces the cut's 19/19 on a larger file.

**The in-process spy guard was measured and rejected.** It goes RED on `X5b` with a macrotask settle or with
`vi.dynamicImportSettled()` plus a macrotask (3/3 each), and stays green on an `await Promise.resolve()` or zero
settle. It counted **1 derive call for 3 frames**. A diagnostic `.then` showed that only the first of three
concurrent `import("./history.ts")` calls received the mocked module (spy present). The other two received an
unspied instance.

**The ruled candidate** extends the existing child: one root `render-seam.ts`; an `assembleFrame` value-importer
equality tripwire; a fixture built from `history.ts?fixture`; the recorder cleared, then frames over the empty
game and a 40-ply game (both 23 rows on BASE), a 3-turn macrotask settle, and a `perFrame` set. The ledger (the
same 10 builds under both arms) is in `ADR-0029` `## Consequences`.

**Gained:** `X5b`, `X5b-query`, `X5b-computed`, `X5c` (evaluate-only), `X5b-CONDITIONAL` and `SECOND-COMPOSER`.
**Lost:** `WGLYPH-DYN`. **Kept:** `WDYNIMP` and `INLINE-TYPE`. `WINDIRECT` is kept by the regex alone.

Further results:

- `X5b` is RED 5/5. **With the settle set to 0 turns it is still RED 3/3**: the load hook sees the import when it
  is issued.
- `X5b-CONDITIONAL` is **green when only the empty game is framed**. That is why `ADR-0029` requires two states.
- Cost: the probe test's medians were **245 ms (ruled) against 214 ms (today)**, 5 runs per arm, with other lanes
  loading the machine. That is noise-level evidence of about +30 ms, **not a lane reading**.

## Not verified, and marked so

- Whether the in-process spy guard is blind to `?query`: **expected, not run**.
- Whether `void renderBoard;` evades both lint and the consumer rule (`ADR-0030` `C1`): **`UNKNOWN - verify`**.
- Node 22 / 24 loader timing for the zero-settle result: **only v26.11.0 was run**.
