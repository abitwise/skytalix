---
id: 20260814T172600Z-security-nfr-observation-85881f7a
kind: observation
by: security-nfr
at: 2026-08-14T17:26:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/history-pane.nfr.test.ts
  - src/glyph-mode.nfr.test.ts
  - src/frame.ts
  - src/perft-bench.ts
  - plans/board.md
supersedes: 
---

# Re-measured at HEAD `eefc217`, by me, before ruling — and the Orchestrator's builtin count is wrong

I did not accept the parent `claim`'s counts. Every figure below was re-run by me on branch
`grugops/readyfordev-ABC-042` at HEAD `eefc217`.

## The file census

| measure | count | method |
|---|---|---|
| `.ts` files under `src/` | **47** | `ls src/*.ts` |
| test files (`*.test.ts`) | **29** | of which 7 are `*.nfr.test.ts` |
| production files (non-`.test.ts`) | **18** | the ticket's own `## The one correction` uses exactly this set |
| production files importing ANY non-relative specifier | **0 of 18** | every production import is `./`-relative |
| test files importing a Node builtin (static or dynamic) | **4 of 29** | `render-seam.test.ts`, `san.test.ts`, `history-pane.nfr.test.ts`, `glyph-mode.nfr.test.ts` |
| test files touching `node:child_process` | **2 of 29** | `history-pane.nfr.test.ts`, `glyph-mode.nfr.test.ts` |
| bare-specifier builtin imports (`from "fs"` etc.) anywhere | **0 of 47** | every builtin in this repo is written `node:`-prefixed |
| `require(` anywhere under `src/` | **0** | |
| `process.argv` in any production file | **0** | |
| `shell:` anywhere under `src/` | **0** | |
| `exec` / `execSync` **call sites** anywhere under `src/` | **0** | the only call site of any spawn family is `spawnSync` at `history-pane.nfr.test.ts:581` |
| `fetch` / `WebSocket` / `XMLHttpRequest` anywhere under `src/` | **0** | |

**The correction.** The parent `claim` states *"**2 of those 47** import a builtin today."* Measured,
it is **4 of 47**. The two it missed are `src/render-seam.test.ts:39` and `src/san.test.ts:27`, both
`import { … } from "node:fs"`. The claim counted `node:child_process` files and reported the number
as the builtin count. Its structural point — the stated denominator does not match the stated
numerator — survives the correction; its number does not.

**The production invariant itself is real and stronger than either figure.** It is not "0 of 18
import a *builtin*" — it is **0 of 18 import anything non-relative at all**. There is no `node:`
import, no bare specifier, no `require`, and no dynamic `import()` in any of the 18.

## The cited precedent is legal-shaped and it is GREEN — measured, not assumed

`## Test notes` 1 cites `src/history-pane.nfr.test.ts:566-590` as *"the merged precedent for
spawning here."* Read at HEAD, that range is the probe source string (`:567-577`) and the
`spawnSync` invocation (`:581-591`). **The `spawnSync` import is at `:23`, OUTSIDE the cited
range** — the ticket cites the spawn site, and the import site is the thing bar 1's literal text
forbids.

I ran both merged builtin-importing `child_process` files:

```
npx vitest run src/history-pane.nfr.test.ts src/glyph-mode.nfr.test.ts
 ✓ src/glyph-mode.nfr.test.ts   (3 tests)  1ms
 ✓ src/history-pane.nfr.test.ts (11 tests) 92ms
 Test Files 2 passed (2) · Tests 14 passed (14)
```

**Both are merged, both are green.** Any reading of bar 1 that reaches them makes green merged code
retroactively illegal.

**Both merged uses are security-POSITIVE, which is the fact that decides the reading.**
`history-pane.nfr.test.ts:581-591` calls `spawnSync(process.execPath, [<argv array>], …)` — no
`shell`, no string command: the parameterised-OS-call form ASVS **V1.2.5 [L1]** *requires*.
`glyph-mode.nfr.test.ts:37-46,65` does not spawn at all — it `vi.mock`s `node:child_process` to spy
`execSync`/`execFileSync`/`spawnSync`/`spawn` and **prove `glyph-mode.ts` never calls them**. A
whole-diff reading of bar 1 forbids the instrument that proves the absence of OS calls.

## Three source facts the bars depend on, measured at source

1. **`sanitize` is module-PRIVATE.** `src/frame.ts:123` declares `function sanitize(text, mode)` with
   no `export`. `frame.ts` exports exactly 8 symbols (`:45,53,86,106,194,210,216,233`) and `sanitize`
   is not one of them. The only public route to it is `assembleFrame` (`:194`), which returns a whole
   frame's rows.
2. **This repo never writes a bare builtin specifier.** All builtins are `node:`-prefixed, and
   `node:fs/promises` — a sub-path spelling — is in live use at `glyph-mode.nfr.test.ts:53,64`.
3. **An entry point in this repo already writes to stdout without naming `process.stdout`.**
   `src/perft-bench.ts` (the repository's first `ADR-0011` clause-4 entry point) reaches the terminal
   through ~20 `console.log` calls (`:56-111`) and names `process.stdout` nowhere.

## Lane input for the Engineer (the NFR half)

`## Lane cost` asks for a measured anchor. Mine: `history-pane.nfr.test.ts` — **11 tests including
one 11-module-closure child spawn — runs in 92 ms**, against the ticket's cited 66 ms fd-3 anchor and
the 94.2 ms per-file median. This corroborates the ticket's guidance rather than contradicting it:
plan the new file at several times the median and keep spawns in single digits. `N8-LANE` ≤ 650 ms
CPU is not at risk from a handful of spawns on this evidence.
