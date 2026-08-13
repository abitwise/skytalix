---
id: 20260813T232000Z-software-engineer-observation-x8-watched-red-and-the-second-mutant-the-third-line-needed-a138a98a
kind: observation
by: software-engineer
at: 2026-08-13T23:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - src/render-seam.ts
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20260813T230500Z-qe-e2e-observation-a6-was-widened-in-words-and-the-instrument-did-not-move-fb895859
supersedes: 
---

# `X8` rebuilt from the gate's text, watched GREEN then RED — and a second mutant, because `X8` cannot reach the third line I added.

Every run below happened in an **out-of-tree copy** of this branch's worktree, by the method the
re-gate used (`tar --exclude=node_modules --exclude=.git`, `node_modules` symlinked, mutate the copy
only). The worktree's `src/render-seam.ts` was therefore **never opened for writing** — stronger than
"mutated and reverted". The copy was proved faithful before the first edit: `src/render-seam.ts` md5
**`bc18d0830b84adaff123affce66561c5`** and `src/render-seam.test.ts` md5
**`2c16c77e3667817d66bbc945236431cf`**, both equal to the worktree's, and it ran **11 passed** at rest.

Every mutant was applied by an anchored substitution that **refuses to write unless each anchor
matches exactly once** and refuses a no-op, then reverted with the module md5 re-verified.

## `X8` first, unfixed instrument — the claim that it ships green today, reproduced

`X8` is the gate's, byte-for-byte from its `observation` note: an `ambientMode()` reading
`process.env.CHESS_GLYPHS` through `(globalThis as ...)["process"]`, and
`board: renderBoard(history.position, ambientMode() ?? mode, orientation)` in the seam.

| check, `X8` applied, instrument as delivered at `c3384ea` | result |
|---|---|
| `npx vitest run` (whole lane) | **827 passed / 827, 29 files** |
| `npx tsc --noEmit` | **exit 0** |
| `npx biome check src/render-seam.ts` | **exit 0**, the same 2 pre-existing infos |
| the `A6 / A7` row | **GREEN** |

**And it is not decorative — I put the environment variable on rather than taking that on trust:**

```
CHESS_GLYPHS=ascii npx vitest run src/render-seam.test.ts   ->   3 failed | 8 passed (11)
   x A1 ...   x A4 ...   x A5 ...
   ✓ A6 / A7 — no ambient reads, no glyph-mode import, and history.ts imported nowhere
```

Three content criteria red **while the criterion whose whole job is to forbid this stays green**. That
is the gate's `A1`/`A4`/`A5` result reproduced digit for digit, and it is the shape of the defect: the
behavioural reds only fire if the variable happens to be set during a run, so the text check is the
guard in practice and the text check was one keystroke wide.

## Then the fix, and it goes red

With the three lines added to the `A6 / A7` row:

```
X8 + repaired instrument   ->  1 failed | 10 passed (11)   (whole lane: 1 failed | 826 passed (827))
   x A6 / A7   AssertionError: expected '/**\n * `ABC-041` — the render seam: …' not to contain 'process'
   ❯ src/render-seam.test.ts:292:24
```

`:292` is the **bare-word `process`** line. Because it fires first, the `globalThis` line is never
reached in that run, so I armed it separately — same mutant, both `process` lines removed from the
instrument:

```
X8, `process.` and `process` lines removed   ->  1 failed | 10 passed (11)
   x A6 / A7   AssertionError: … not to contain 'globalThis'
   ❯ src/render-seam.test.ts:291:24
```

The `globalThis` line reds **alone**. Both lines were then restored, `X8` reverted, and the sandbox
module md5 re-verified at `bc18d083…` with the repaired instrument **11 passed** on the pristine tree.

## `X8b` — I built a second mutant, because `X8` proves nothing about the third line

`X8` contains no `import.meta`, so the `import.meta` assertion is untouched by it. Adding an assertion
no mutant reds is exactly the move this ticket's whole loop exists to stop, so I built one:

```ts
function ambientMode(): GlyphMode | undefined {
  const flag = new URL(import.meta.url).searchParams.get("glyphs");
  return flag === "ascii" ? "ascii" : undefined;
}
```

| `X8b` | result |
|---|---|
| spellings in the mutated module | `process` **0**, `globalThis` **0**, `import.meta` **1** |
| `npx tsc --noEmit` | **exit 0** |
| `npx vitest run` on the **delivered** instrument | **827 passed / 827, 29 files** — it ships green today too |
| `npx biome check src/render-seam.ts` | **exit 0** |
| on the **repaired** instrument | **1 failed | 10 passed (11)** — `… not to contain 'import.meta'` at `src/render-seam.test.ts:294:24`, **and nothing else** |

**Recorded honestly: `X8b` is weaker than `X8` in one respect.** `X8` changes the delivered frame when
a plain environment variable is set; `X8b`'s ambient channel is a query parameter on a module
specifier, which is exotic and would not fire in any normal run. It is a **spelling-discrimination**
mutant — its job is to prove the third assertion is not decoration, and it does that: `tsc`-clean,
green on today's instrument, red on exactly one line of the repaired one. I am not claiming it is a
realistic ambient read.

## The counts, at my own hand, over the pristine module

`process.` **0**, `process` **0**, `globalThis` **0**, `import.meta` **0**, `from "./glyph-mode.ts"`
**0** — the gate's count reproduced. The three added lines are green on the delivered tree, which is
why this hop adds a guard and changes no behaviour.
